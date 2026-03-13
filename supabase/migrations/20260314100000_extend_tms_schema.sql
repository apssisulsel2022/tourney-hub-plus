
-- Enums for registration and payments
CREATE TYPE public.registration_status AS ENUM ('pending', 'verified', 'rejected', 'paid');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE public.notification_type AS ENUM ('info', 'success', 'warning', 'error');

-- Add columns to tournaments
ALTER TABLE public.tournaments 
ADD COLUMN IF NOT EXISTS registration_fee NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS sport_type TEXT,
ADD COLUMN IF NOT EXISTS rules TEXT;

-- Add columns to tournament_teams for registration workflow
ALTER TABLE public.tournament_teams
ADD COLUMN IF NOT EXISTS status public.registration_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- Add columns to players for verification workflow
ALTER TABLE public.players
ADD COLUMN IF NOT EXISTS document_ktp_url TEXT,
ADD COLUMN IF NOT EXISTS document_health_cert_url TEXT,
ADD COLUMN IF NOT EXISTS document_statement_url TEXT,
ADD COLUMN IF NOT EXISTS verification_status public.registration_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID REFERENCES public.tournaments(id),
    team_id UUID REFERENCES public.teams(id),
    amount NUMERIC(10, 2) NOT NULL,
    status public.payment_status DEFAULT 'pending',
    payment_method TEXT,
    invoice_url TEXT,
    receipt_url TEXT,
    transaction_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type public.notification_type DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for new tables
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for payments (org admins and team managers can see)
CREATE POLICY "Users can view their own team payments" ON public.payments
FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.teams t 
        WHERE t.id = public.payments.team_id 
        AND (t.organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()))
    )
);

-- Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Policies for audit logs (Super admin only)
CREATE POLICY "Super admins can view all audit logs" ON public.audit_logs
FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
);

-- Trigger to update updated_at on payments
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
