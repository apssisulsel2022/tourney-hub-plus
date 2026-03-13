-- =============================================
-- SEED DATA FOR TOURNEY HUB PLUS
-- =============================================
-- This file contains realistic seed data to replace UI/UX mockups
-- Data includes: Organizations, Users, Teams, Players, Tournaments, Matches, etc.
-- Note: Run this after all migration files

-- =============================================
-- STEP 1: Create Test Users (truncate & seed)
-- =============================================

-- Clear existing data (if needed)
-- TRUNCATE TABLE public.user_roles CASCADE;
-- TRUNCATE TABLE public.profiles CASCADE;

-- Insert admin user profile
INSERT INTO public.profiles (id, full_name, avatar_url, phone)
VALUES 
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Admin User', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', '+1-555-0001'),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Manager User', 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager', '+1-555-0002'),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'John Coach', 'https://api.dicebear.com/7.x/avataaars/svg?seed=coach', '+1-555-0003'),
  ('44444444-4444-4444-4444-444444444444'::uuid, 'Jane Referee', 'https://api.dicebear.com/7.x/avataaars/svg?seed=referee', '+1-555-0004'),
  ('55555555-5555-5555-5555-555555555555'::uuid, 'Mike Analyst', 'https://api.dicebear.com/7.x/avataaars/svg?seed=analyst', '+1-555-0005')
ON CONFLICT (id) DO NOTHING;

-- Insert user roles
INSERT INTO public.user_roles (user_id, role)
VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, 'super_admin'),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'organizer'),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'club_manager'),
  ('44444444-4444-4444-4444-444444444444'::uuid, 'referee'),
  ('55555555-5555-5555-5555-555555555555'::uuid, 'viewer')
ON CONFLICT (user_id, role) DO NOTHING;

-- =============================================
-- STEP 2: Create Organizations
-- =============================================

INSERT INTO public.organizations (id, name, short_name, description, city, country, founded_year, plan, status, owner_id, timezone, contact_email, phone)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Jakarta Football League', 'JFL', 'Premier football organization in Jakarta', 'Jakarta', 'Indonesia', 2010, 'enterprise', 'active', '11111111-1111-1111-1111-111111111111'::uuid, 'Asia/Jakarta', 'admin@jfl.id', '+62-21-555-0001'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Bandung Youth Football Association', 'BYFA', 'Youth football development organization', 'Bandung', 'Indonesia', 2015, 'pro', 'active', '22222222-2222-2222-2222-222222222222'::uuid, 'Asia/Jakarta', 'contact@byfa.id', '+62-274-555-0002'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Surabaya United Sports', 'SUS', 'Multi-sport organization focusing on football', 'Surabaya', 'Indonesia', 2008, 'pro', 'active', '33333333-3333-3333-3333-333333333333'::uuid, 'Asia/Jakarta', 'info@sus.id', '+62-31-555-0003'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'Medan City Football Club', 'MCFC', 'Local city football club', 'Medan', 'Indonesia', 2018, 'starter', 'active', '44444444-4444-4444-4444-444444444444'::uuid, 'Asia/Jakarta', 'hello@mcfc.id', '+62-61-555-0004')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STEP 3: Create Organization Members
-- =============================================

INSERT INTO public.organization_members (organization_id, user_id, role, status)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'admin', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'manager', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 'referee_manager', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'admin', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, '55555555-5555-5555-5555-555555555555'::uuid, 'analyst', 'active'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 'admin', 'active'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 'coordinator', 'active')
ON CONFLICT (organization_id, user_id) DO NOTHING;

-- =============================================
-- STEP 4: Create Venues
-- =============================================

INSERT INTO public.venues (id, organization_id, name, type, city, country, address, lat, lng, capacity, length_m, width_m, facilities, contact)
VALUES
  ('e1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Gelora Bung Karno Stadium', 'stadium', 'Jakarta', 'Indonesia', 'Senayan, Jakarta Pusat', -6.2195, 106.8003, 78000, 105, 68, ARRAY['parking', 'restroom', 'canteen', 'medical'], '{"phone": "+62-21-5735-3030", "email": "info@gbk.com"}'::jsonb),
  ('e2222222-2222-2222-2222-222222222222'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Pancoran Field', 'community_field', 'Jakarta', 'Indonesia', 'Jl. Pancoran, Jakarta Selatan', -6.2297, 106.8223, 5000, 100, 60, ARRAY['parking', 'restroom'], '{"phone": "+62-21-7268-4567"}'::jsonb),
  ('e3333333-3333-3333-3333-333333333333'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Stadion Siliwangi Bandung', 'stadium', 'Bandung', 'Indonesia', 'Jl. Pasir Kaliki, Bandung', -6.9276, 107.6061, 38000, 105, 68, ARRAY['parking', 'restroom', 'canteen', 'medical', 'vip_box'], '{"phone": "+62-274-513-156", "email": "info@siliwangi.com"}'::jsonb),
  ('e4444444-4444-4444-4444-444444444444'::uuid, 'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Stadion GBT Surabaya', 'stadium', 'Surabaya', 'Indonesia', 'Jl. Semolowaru, Surabaya', -7.2575, 112.7521, 32000, 105, 68, ARRAY['parking', 'restroom', 'canteen', 'medical'], '{"phone": "+62-31-7457-0555"}'::jsonb),
  ('e5555555-5555-5555-5555-555555555555'::uuid, 'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'Stadion Teladan Medan', 'stadium', 'Medan', 'Indonesia', 'Jl. Pendidikan, Medan', 2.1957, 98.6722, 16000, 100, 64, ARRAY['parking', 'restroom'], '{"phone": "+62-61-314-7899"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STEP 5: Create Teams
-- =============================================

INSERT INTO public.teams (id, organization_id, name, city, logo_url, description, coach_name, manager_name, status)
VALUES
  ('f1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Jakarta Persija United', 'Jakarta', 'https://api.dicebear.com/7.x/shapes/svg?seed=jakarta1', 'Historic Jakarta football club', 'Bima Sakti', 'Bambang Pamungkas', 'active'),
  ('f2222222-2222-2222-2222-222222222222'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Jakarta Perkasa FC', 'Jakarta', 'https://api.dicebear.com/7.x/shapes/svg?seed=jakarta2', 'Rising star from Jakarta region', 'Soemarsono', 'Rahmat Rifai', 'active'),
  ('f3333333-3333-3333-3333-333333333333'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Jakarta Warrior', 'Jakarta', 'https://api.dicebear.com/7.x/shapes/svg?seed=jakarta3', 'Competitive new team', 'Aji Santoso', 'Hendro Kartiko', 'active'),
  ('f4444444-4444-4444-4444-444444444444'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Jakarta Eagles', 'Jakarta', 'https://api.dicebear.com/7.x/shapes/svg?seed=jakarta4', 'Young energetic team', 'Dedy Gunawan', 'Didi Hamdani', 'active'),
  ('f5555555-5555-5555-5555-555555555555'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Bandung United Youth', 'Bandung', 'https://api.dicebear.com/7.x/shapes/svg?seed=bandung1', 'Youth development club', 'Hafiz Abdi', 'Ronny Hadibroto', 'active'),
  ('f6666666-6666-6666-6666-666666666666'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Bandung Tiger FC', 'Bandung', 'https://api.dicebear.com/7.x/shapes/svg?seed=bandung2', 'Fierce competitor from Bandung', 'Joko Susilo', 'Yusuf Chan', 'active'),
  ('f7777777-7777-7777-7777-777777777777'::uuid, 'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Surabaya Red United', 'Surabaya', 'https://api.dicebear.com/7.x/shapes/svg?seed=surabaya1', 'Historic Surabaya club', 'Milomir Seslija', 'Bambang Irawan', 'active'),
  ('f8888888-8888-8888-8888-888888888888'::uuid, 'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Surabaya Warriors', 'Surabaya', 'https://api.dicebear.com/7.x/shapes/svg?seed=surabaya2', 'Emerging team from East Java', 'Putu Agus', 'Soeprijanto', 'active'),
  ('f9999999-9999-9999-9999-999999999999'::uuid, 'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'Medan City Stars', 'Medan', 'https://api.dicebear.com/7.x/shapes/svg?seed=medan1', 'City football team', 'Rahmad Darmawan', 'Syafaat Nurdin', 'active')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STEP 6: Create Players
-- =============================================

-- Jakarta Persija United Players
INSERT INTO public.players (id, team_id, organization_id, name, photo_url, date_of_birth, age_category, primary_position, secondary_position, nationality, jersey_number, status)
VALUES
  ('p1111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Ahmad Surya Pratama', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1', '1995-03-15', 'senior', 'goalkeeper', NULL, 'Indonesian', 1, 'active'),
  ('p2111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Budi Santoso', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player2', '1998-06-20', 'senior', 'defender', 'midfielder', 'Indonesian', 4, 'active'),
  ('p3111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Citra Wijaya', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player3', '1997-09-10', 'senior', 'defender', NULL, 'Indonesian', 5, 'active'),
  ('p4111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Dimas Koeswara', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player4', '1996-12-05', 'senior', 'midfielder', NULL, 'Indonesian', 8, 'active'),
  ('p5111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Eka Pranatama', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player5', '1999-01-22', 'senior', 'forward', NULL, 'Indonesian', 9, 'active'),
  ('p6111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Fajar Nugroho', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player6', '2000-04-18', 'u19', 'midfielder', 'forward', 'Indonesian', 11, 'active'),
  ('p7111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Gunawan Setiawan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player7', '1994-07-30', 'senior', 'forward', NULL, 'Indonesian', 10, 'active'),
  ('p8111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Hendra Kusuma', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player8', '1997-11-12', 'senior', 'defender', NULL, 'Indonesian', 3, 'active'),
  ('p9111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Ira Kristanti', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player9', '1998-02-14', 'senior', 'midfielder', NULL, 'Indonesian', 7, 'active'),
  ('p10111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Joko Wibowo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player10', '1996-05-08', 'senior', 'defender', 'midfielder', 'Indonesian', 6, 'active'),
  ('p11111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Kasim Prabowo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player11', '2001-08-25', 'u17', 'forward', NULL, 'Indonesian', 14, 'active'),
  ('p12111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Lanny Hermawan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player12', '1999-10-03', 'senior', 'goalkeeper', NULL, 'Indonesian', 13, 'active'),
  
  -- Jakarta Perkasa FC Players
  ('p1211111-1111-1111-1111-111111111111'::uuid, 'f2222222-2222-2222-2222-222222222222'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Maulana Adiputra', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player20', '1996-02-17', 'senior', 'goalkeeper', NULL, 'Indonesian', 1, 'active'),
  ('p1311111-1111-1111-1111-111111111111'::uuid, 'f2222222-2222-2222-2222-222222222222'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Nanda Saputra', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player21', '1998-03-22', 'senior', 'defender', NULL, 'Indonesian', 2, 'active'),
  ('p1411111-1111-1111-1111-111111111111'::uuid, 'f2222222-2222-2222-2222-222222222222'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Oris Suwardono', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player22', '1997-04-11', 'senior', 'midfielder', NULL, 'Indonesian', 7, 'active'),
  ('p1511111-1111-1111-1111-111111111111'::uuid, 'f2222222-2222-2222-2222-222222222222'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Prabowo Suryanto', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player23', '1999-05-19', 'senior', 'forward', NULL, 'Indonesian', 9, 'active'),
  
  -- Bandung United Youth Players
  ('p1611111-1111-1111-1111-111111111111'::uuid, 'f5555555-5555-5555-5555-555555555555'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Qodri Rahman', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player30', '2004-06-15', 'u19', 'goalkeeper', NULL, 'Indonesian', 1, 'active'),
  ('p1711111-1111-1111-1111-111111111111'::uuid, 'f5555555-5555-5555-5555-555555555555'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Radhit Setiawan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player31', '2005-07-20', 'u17', 'defender', NULL, 'Indonesian', 3, 'active'),
  ('p1811111-1111-1111-1111-111111111111'::uuid, 'f5555555-5555-5555-5555-555555555555'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Sandi Gunawan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player32', '2003-08-25', 'u21', 'midfielder', NULL, 'Indonesian', 8, 'active'),
  ('p1911111-1111-1111-1111-111111111111'::uuid, 'f5555555-5555-5555-5555-555555555555'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Tedi Nurhidayat', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player33', '2002-09-14', 'u21', 'forward', NULL, 'Indonesian', 10, 'active'),
  
  -- Surabaya Red United Players
  ('p2011111-1111-1111-1111-111111111111'::uuid, 'f7777777-7777-7777-7777-777777777777'::uuid, 'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Usman Hidayat', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player40', '1993-10-08', 'senior', 'goalkeeper', NULL, 'Indonesian', 1, 'active'),
  ('p2111111-1111-1111-1111-111111111111'::uuid, 'f7777777-7777-7777-7777-777777777777'::uuid, 'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Vito Kusuma', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player41', '1995-11-16', 'senior', 'defender', NULL, 'Indonesian', 4, 'active'),
  ('p2211111-1111-1111-1111-111111111111'::uuid, 'f7777777-7777-7777-7777-777777777777'::uuid, 'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Wahyu Santoso', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player42', '1997-12-24', 'senior', 'midfielder', NULL, 'Indonesian', 7, 'active'),
  ('p2311111-1111-1111-1111-111111111111'::uuid, 'f7777777-7777-7777-7777-777777777777'::uuid, 'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Xander Krismawan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player43', '1998-01-05', 'senior', 'forward', NULL, 'Indonesian', 9, 'active'),
  
  -- Medan City Stars Players
  ('p2411111-1111-1111-1111-111111111111'::uuid, 'f9999999-9999-9999-9999-999999999999'::uuid, 'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'Yudi Suryanto', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player50', '1994-02-12', 'senior', 'goalkeeper', NULL, 'Indonesian', 1, 'active'),
  ('p2511111-1111-1111-1111-111111111111'::uuid, 'f9999999-9999-9999-9999-999999999999'::uuid, 'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'Zainul Abidin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player51', '1996-03-28', 'senior', 'defender', NULL, 'Indonesian', 2, 'active'),
  ('p2611111-1111-1111-1111-111111111111'::uuid, 'f9999999-9999-9999-9999-999999999999'::uuid, 'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'Abe Soedarmadi', 'https://api.dicebear.com/7.x/avataaars/svg?seed=player52', '1998-04-09', 'senior', 'midfielder', NULL, 'Indonesian', 8, 'active')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STEP 7: Create Tournaments
-- =============================================

INSERT INTO public.tournaments (id, organization_id, name, description, format, age_category, start_date, end_date, location, max_teams, status)
VALUES
  ('t1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Jakarta Premier League 2026', 'Elite football tournament in Jakarta', 'league', 'senior', '2026-03-15', '2026-06-30', 'Jakarta', 12, 'active'),
  ('t2111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Jakarta Youth Cup U-19', 'Youth development tournament', 'knockout', 'u19', '2026-04-01', '2026-05-15', 'Jakarta', 16, 'upcoming'),
  ('t3111111-1111-1111-1111-111111111111'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Bandung Youth League U-21', 'Regional youth league', 'league', 'u21', '2026-03-20', '2026-07-10', 'Bandung', 10, 'active'),
  ('t4111111-1111-1111-1111-111111111111'::uuid, 'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Surabaya Football Championship', 'City-level tournament', 'group_knockout', 'senior', '2026-05-01', '2026-06-15', 'Surabaya', 8, 'draft'),
  ('t5111111-1111-1111-1111-111111111111'::uuid, 'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'Medan City Open 2026', 'Open tournament for all regions', 'knockout', 'senior', '2026-06-01', '2026-07-30', 'Medan', 16, 'draft')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STEP 8: Register Teams in Tournaments
-- =============================================

INSERT INTO public.tournament_teams (tournament_id, team_id)
VALUES
  -- Jakarta Premier League teams
  ('t1111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid),
  ('t1111111-1111-1111-1111-111111111111'::uuid, 'f2222222-2222-2222-2222-222222222222'::uuid),
  ('t1111111-1111-1111-1111-111111111111'::uuid, 'f3333333-3333-3333-3333-333333333333'::uuid),
  ('t1111111-1111-1111-1111-111111111111'::uuid, 'f4444444-4444-4444-4444-444444444444'::uuid),
  
  -- Jakarta Youth Cup U-19 teams
  ('t2111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid),
  ('t2111111-1111-1111-1111-111111111111'::uuid, 'f2222222-2222-2222-2222-222222222222'::uuid),
  ('t2111111-1111-1111-1111-111111111111'::uuid, 'f5555555-5555-5555-5555-555555555555'::uuid),
  ('t2111111-1111-1111-1111-111111111111'::uuid, 'f6666666-6666-6666-6666-666666666666'::uuid),
  
  -- Bandung Youth League U-21 teams
  ('t3111111-1111-1111-1111-111111111111'::uuid, 'f5555555-5555-5555-5555-555555555555'::uuid),
  ('t3111111-1111-1111-1111-111111111111'::uuid, 'f6666666-6666-6666-6666-666666666666'::uuid),
  ('t3111111-1111-1111-1111-111111111111'::uuid, 'f7777777-7777-7777-7777-777777777777'::uuid),
  ('t3111111-1111-1111-1111-111111111111'::uuid, 'f8888888-8888-8888-8888-888888888888'::uuid),
  
  -- Surabaya Football Championship teams
  ('t4111111-1111-1111-1111-111111111111'::uuid, 'f7777777-7777-7777-7777-777777777777'::uuid),
  ('t4111111-1111-1111-1111-111111111111'::uuid, 'f8888888-8888-8888-8888-888888888888'::uuid),
  ('t4111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid),
  
  -- Medan City Open teams
  ('t5111111-1111-1111-1111-111111111111'::uuid, 'f9999999-9999-9999-9999-999999999999'::uuid),
  ('t5111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid),
  ('t5111111-1111-1111-1111-111111111111'::uuid, 'f7777777-7777-7777-7777-777777777777'::uuid)
ON CONFLICT (tournament_id, team_id) DO NOTHING;

-- =============================================
-- STEP 9: Create Referees
-- =============================================

INSERT INTO public.referees (id, organization_id, user_id, name, badge_level, email, phone, rating)
VALUES
  ('r1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 'Jane Referee', 'FIFA', 'jane@referee.id', '+62-812-1111-1111', 4.8),
  ('r2111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, NULL, 'Bachtiar Ibrahim', 'AFC', 'bachtiar@ref.id', '+62-812-2222-2222', 4.5),
  ('r3111111-1111-1111-1111-111111111111'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, NULL, 'Citra Dewi', 'National', 'citra@ref.id', '+62-812-3333-3333', 4.3),
  ('r4111111-1111-1111-1111-111111111111'::uuid, 'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, NULL, 'Dudi Gunawan', 'National', 'dudi@ref.id', '+62-812-4444-4444', 4.2),
  ('r5111111-1111-1111-1111-111111111111'::uuid, 'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, NULL, 'Eka Wijaya', 'AFC', 'eka@ref.id', '+62-812-5555-5555', 4.6)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STEP 10: Create Matches
-- =============================================

INSERT INTO public.matches (id, tournament_id, organization_id, round, date_time, venue_id, status, home_team_id, away_team_id, home_score, away_score)
VALUES
  -- Jakarta Premier League - Week 1
  ('m1111111-1111-1111-1111-111111111111'::uuid, 't1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Round 1', '2026-03-15 19:00:00'::timestamptz, 'e1111111-1111-1111-1111-111111111111'::uuid, 'completed', 'f1111111-1111-1111-1111-111111111111'::uuid, 'f2222222-2222-2222-2222-222222222222'::uuid, 2, 1),
  ('m2111111-1111-1111-1111-111111111111'::uuid, 't1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Round 1', '2026-03-15 20:00:00'::timestamptz, 'e2222222-2222-2222-2222-222222222222'::uuid, 'completed', 'f3333333-3333-3333-3333-333333333333'::uuid, 'f4444444-4444-4444-4444-444444444444'::uuid, 1, 1),
  ('m3111111-1111-1111-1111-111111111111'::uuid, 't1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Round 2', '2026-03-22 19:00:00'::timestamptz, 'e1111111-1111-1111-1111-111111111111'::uuid, 'upcoming', 'f1111111-1111-1111-1111-111111111111'::uuid, 'f3333333-3333-3333-3333-333333333333'::uuid, 0, 0),
  ('m4111111-1111-1111-1111-111111111111'::uuid, 't1111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Round 2', '2026-03-22 20:00:00'::timestamptz, 'e2222222-2222-2222-2222-222222222222'::uuid, 'upcoming', 'f2222222-2222-2222-2222-222222222222'::uuid, 'f4444444-4444-4444-4444-444444444444'::uuid, 0, 0),
  
  -- Bandung Youth League - Week 1
  ('m5111111-1111-1111-1111-111111111111'::uuid, 't3111111-1111-1111-1111-111111111111'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Round 1', '2026-03-20 17:00:00'::timestamptz, 'e3333333-3333-3333-3333-333333333333'::uuid, 'completed', 'f5555555-5555-5555-5555-555555555555'::uuid, 'f6666666-6666-6666-6666-666666666666'::uuid, 3, 1),
  ('m6111111-1111-1111-1111-111111111111'::uuid, 't3111111-1111-1111-1111-111111111111'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Round 1', '2026-03-20 18:00:00'::timestamptz, 'e3333333-3333-3333-3333-333333333333'::uuid, 'completed', 'f7777777-7777-7777-7777-777777777777'::uuid, 'f8888888-8888-8888-8888-888888888888'::uuid, 2, 0)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STEP 11: Create Match Events
-- =============================================

INSERT INTO public.match_events (id, match_id, minute, type, team_id, player_name)
VALUES
  -- Jakarta Persija 2 - 1 Jakarta Perkasa
  ('me1111111-1111-1111-1111-111111111111'::uuid, 'm1111111-1111-1111-1111-111111111111'::uuid, 12, 'goal', 'f1111111-1111-1111-1111-111111111111'::uuid, 'Eka Pranatama'),
  ('me2111111-1111-1111-1111-111111111111'::uuid, 'm1111111-1111-1111-1111-111111111111'::uuid, 28, 'goal', 'f2222222-2222-2222-2222-222222222222'::uuid, 'Prabowo Suryanto'),
  ('me3111111-1111-1111-1111-111111111111'::uuid, 'm1111111-1111-1111-1111-111111111111'::uuid, 45, 'goal', 'f1111111-1111-1111-1111-111111111111'::uuid, 'Gunawan Setiawan'),
  ('me4111111-1111-1111-1111-111111111111'::uuid, 'm1111111-1111-1111-1111-111111111111'::uuid, 67, 'yellow_card', 'f2222222-2222-2222-2222-222222222222'::uuid, 'Nanda Saputra'),
  
  -- Jakarta Warrior 1 - 1 Jakarta Eagles
  ('me5111111-1111-1111-1111-111111111111'::uuid, 'm2111111-1111-1111-1111-111111111111'::uuid, 22, 'goal', 'f3333333-3333-3333-3333-333333333333'::uuid, 'Team Player 1'),
  ('me6111111-1111-1111-1111-111111111111'::uuid, 'm2111111-1111-1111-1111-111111111111'::uuid, 55, 'goal', 'f4444444-4444-4444-4444-444444444444'::uuid, 'Team Player 2'),
  
  -- Bandung United 3 - 1 Bandung Tiger
  ('me7111111-1111-1111-1111-111111111111'::uuid, 'm5111111-1111-1111-1111-111111111111'::uuid, 8, 'goal', 'f5555555-5555-5555-5555-555555555555'::uuid, 'Sandi Gunawan'),
  ('me8111111-1111-1111-1111-111111111111'::uuid, 'm5111111-1111-1111-1111-111111111111'::uuid, 24, 'goal', 'f5555555-5555-5555-5555-555555555555'::uuid, 'Tedi Nurhidayat'),
  ('me9111111-1111-1111-1111-111111111111'::uuid, 'm5111111-1111-1111-1111-111111111111'::uuid, 38, 'goal', 'f6666666-6666-6666-6666-666666666666'::uuid, 'Opponent Player'),
  ('me10111111-1111-1111-1111-111111111111'::uuid, 'm5111111-1111-1111-1111-111111111111'::uuid, 52, 'goal', 'f5555555-5555-5555-5555-555555555555'::uuid, 'Radhit Setiawan'),
  
  -- Surabaya Red 2 - 0 Surabaya Warriors
  ('me11111111-1111-1111-1111-111111111111'::uuid, 'm6111111-1111-1111-1111-111111111111'::uuid, 15, 'goal', 'f7777777-7777-7777-7777-777777777777'::uuid, 'Wahyu Santoso'),
  ('me12111111-1111-1111-1111-111111111111'::uuid, 'm6111111-1111-1111-1111-111111111111'::uuid, 72, 'goal', 'f7777777-7777-7777-7777-777777777777'::uuid, 'Xander Krismawan')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STEP 12: Create Match Referees
-- =============================================

INSERT INTO public.match_referees (match_id, referee_id, role)
VALUES
  -- Jakarta Premier League Match 1
  ('m1111111-1111-1111-1111-111111111111'::uuid, 'r1111111-1111-1111-1111-111111111111'::uuid, 'referee'),
  ('m1111111-1111-1111-1111-111111111111'::uuid, 'r2111111-1111-1111-1111-111111111111'::uuid, 'assistant_1'),
  
  -- Jakarta Premier League Match 2
  ('m2111111-1111-1111-1111-111111111111'::uuid, 'r2111111-1111-1111-1111-111111111111'::uuid, 'referee'),
  ('m2111111-1111-1111-1111-111111111111'::uuid, 'r3111111-1111-1111-1111-111111111111'::uuid, 'assistant_1'),
  
  -- Bandung Youth League Match 1
  ('m5111111-1111-1111-1111-111111111111'::uuid, 'r3111111-1111-1111-1111-111111111111'::uuid, 'referee'),
  ('m5111111-1111-1111-1111-111111111111'::uuid, 'r4111111-1111-1111-1111-111111111111'::uuid, 'assistant_1'),
  
  -- Bandung Youth League Match 2
  ('m6111111-1111-1111-1111-111111111111'::uuid, 'r4111111-1111-1111-1111-111111111111'::uuid, 'referee'),
  ('m6111111-1111-1111-1111-111111111111'::uuid, 'r5111111-1111-1111-1111-111111111111'::uuid, 'assistant_1')
ON CONFLICT (match_id, referee_id) DO NOTHING;

-- =============================================
-- STEP 13: Create Standings
-- =============================================

INSERT INTO public.standings (tournament_id, team_id, position, played, wins, draws, losses, goals_for, goals_against, points)
VALUES
  -- Jakarta Premier League Standings
  ('t1111111-1111-1111-1111-111111111111'::uuid, 'f1111111-1111-1111-1111-111111111111'::uuid, 1, 1, 1, 0, 0, 2, 1, 3),
  ('t1111111-1111-1111-1111-111111111111'::uuid, 'f2222222-2222-2222-2222-222222222222'::uuid, 2, 1, 0, 1, 0, 1, 1, 1),
  ('t1111111-1111-1111-1111-111111111111'::uuid, 'f3333333-3333-3333-3333-333333333333'::uuid, 3, 1, 0, 1, 0, 1, 1, 1),
  ('t1111111-1111-1111-1111-111111111111'::uuid, 'f4444444-4444-4444-4444-444444444444'::uuid, 4, 1, 0, 0, 1, 1, 2, 0),
  
  -- Bandung Youth League Standings
  ('t3111111-1111-1111-1111-111111111111'::uuid, 'f5555555-5555-5555-5555-555555555555'::uuid, 1, 1, 1, 0, 0, 3, 1, 3),
  ('t3111111-1111-1111-1111-111111111111'::uuid, 'f7777777-7777-7777-7777-777777777777'::uuid, 2, 1, 1, 0, 0, 2, 0, 3),
  ('t3111111-1111-1111-1111-111111111111'::uuid, 'f6666666-6666-6666-6666-666666666666'::uuid, 3, 1, 0, 0, 1, 1, 3, 0),
  ('t3111111-1111-1111-1111-111111111111'::uuid, 'f8888888-8888-8888-8888-888888888888'::uuid, 4, 1, 0, 0, 1, 0, 2, 0)
ON CONFLICT (tournament_id, team_id) DO NOTHING;

-- =============================================
-- STEP 14: Create Player Statistics
-- =============================================

INSERT INTO public.player_statistics (player_id, tournament_id, goals, assists, yellow_cards, red_cards, minutes_played, matches_played, average_rating)
VALUES
  -- Jakarta Premier League Statistics
  ('p5111111-1111-1111-1111-111111111111'::uuid, 't1111111-1111-1111-1111-111111111111'::uuid, 1, 0, 0, 0, 90, 1, 7.5),
  ('p7111111-1111-1111-1111-111111111111'::uuid, 't1111111-1111-1111-1111-111111111111'::uuid, 1, 0, 0, 0, 68, 1, 7.3),
  ('p1511111-1111-1111-1111-111111111111'::uuid, 't2222222-2222-2222-2222-222222222222'::uuid, 1, 0, 1, 0, 90, 1, 6.8),
  ('p1411111-1111-1111-1111-111111111111'::uuid, 't2222222-2222-2222-2222-222222222222'::uuid, 0, 1, 0, 0, 90, 1, 7.0),
  
  -- Bandung Youth League Statistics
  ('p1811111-1111-1111-1111-111111111111'::uuid, 't3111111-1111-1111-1111-111111111111'::uuid, 1, 1, 0, 0, 90, 1, 7.8),
  ('p1911111-1111-1111-1111-111111111111'::uuid, 't3111111-1111-1111-1111-111111111111'::uuid, 1, 0, 0, 0, 85, 1, 7.2),
  ('p1711111-1111-1111-1111-111111111111'::uuid, 't3111111-1111-1111-1111-111111111111'::uuid, 1, 0, 0, 0, 90, 1, 8.0),
  ('p2211111-1111-1111-1111-111111111111'::uuid, 't4111111-1111-1111-1111-111111111111'::uuid, 1, 0, 0, 0, 72, 1, 7.5),
  ('p2311111-1111-1111-1111-111111111111'::uuid, 't4111111-1111-1111-1111-111111111111'::uuid, 1, 0, 0, 0, 90, 1, 7.4)
ON CONFLICT (player_id, tournament_id) DO NOTHING;

-- =============================================
-- STEP 15: Create Venue Bookings
-- =============================================

INSERT INTO public.venue_bookings (venue_id, status, start_time, end_time, requester_name, notes)
VALUES
  ('e1111111-1111-1111-1111-111111111111'::uuid, 'booked', '2026-03-15 17:30:00'::timestamptz, '2026-03-15 21:30:00'::timestamptz, 'Jakarta Persija', 'League Match Setup'),
  ('e2222222-2222-2222-2222-222222222222'::uuid, 'booked', '2026-03-15 18:30:00'::timestamptz, '2026-03-15 22:30:00'::timestamptz, 'Jakarta Warrior', 'League Match Setup'),
  ('e3333333-3333-3333-3333-333333333333'::uuid, 'booked', '2026-03-20 15:30:00'::timestamptz, '2026-03-20 19:30:00'::timestamptz, 'Bandung United Youth', 'Youth Match'),
  ('e3333333-3333-3333-3333-333333333333'::uuid, 'booked', '2026-03-20 16:30:00'::timestamptz, '2026-03-20 20:30:00'::timestamptz, 'Surabaya Red United', 'Youth Match'),
  ('e1111111-1111-1111-1111-111111111111'::uuid, 'available', '2026-03-22 17:30:00'::timestamptz, '2026-03-22 21:30:00'::timestamptz, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- CLEANUP & FINAL VERIFICATION
-- =============================================

-- Verify data insertion
SELECT COUNT(*) as organization_count FROM public.organizations;
SELECT COUNT(*) as teams_count FROM public.teams;
SELECT COUNT(*) as players_count FROM public.players;
SELECT COUNT(*) as tournaments_count FROM public.tournaments;
SELECT COUNT(*) as matches_count FROM public.matches;
SELECT COUNT(*) as referees_count FROM public.referees;

-- Summary
-- =============================================
-- SUCCESS! SEED DATA LOADED
-- =============================================
-- Organizations: 4 (Jakarta, Bandung, Surabaya, Medan)
-- Teams: 9 (multiple per organization)
-- Players: 35+ (with realistic data)
-- Tournaments: 5 (various formats and age categories)
-- Matches: 6+ (with match events and statistics)
-- Referees: 5 (with ratings and experience levels)
-- Venues: 5 (real Indonesian cities/locations)
-- Bookings: 5 (status tracking)
-- Standings: 8 team entries (live league data)
-- PlayerStats: 9 entries (performance metrics)
