import React from "react";
import { ArrowLeft, Shield, ChevronRight, CheckCircle2, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PlayerRegistrationForm } from "@/modules/players/components/PlayerRegistrationForm";
import { playerService } from "@/modules/players/services/playerService";
import { CreatePlayerInput } from "@/modules/players/types/player";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PlayerRegistrationPage() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/players");
  };

  const handleFinalSubmit = async (data: CreatePlayerInput) => {
    try {
      await playerService.createPlayer(data);
      toast.success("Player registered successfully!", {
        description: `${data.name} is now registered for the 2026 season.`,
      });
      navigate("/players");
    } catch (error) {
      toast.error("Failed to register player");
      console.error(error);
    }
  };

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-20 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-widest">
            <Link to="/players" className="hover:text-secondary transition-colors">Player Database</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Registration</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
            <UserPlus className="h-10 w-10 text-secondary" />
            Athlete Onboarding
          </h1>
          <p className="text-muted-foreground font-medium max-w-2xl">
            Complete the multi-step registration process to enroll a new player into the platform. 
            All documents will be verified by the league administration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/players">
            <Button variant="ghost" className="h-11 px-6 rounded-2xl font-black text-xs uppercase tracking-widest gap-2">
              <ArrowLeft className="h-4 w-4" /> BACK TO DATABASE
            </Button>
          </Link>
        </div>
      </div>

      {/* Registration Steps */}
      <PlayerRegistrationForm 
        onSubmit={handleFinalSubmit}
        onCancel={handleCancel}
      />

      {/* Trust and Verification Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 p-6 bg-secondary/5 rounded-3xl border border-secondary/10 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
            <Shield className="h-7 w-7 text-secondary" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-black uppercase tracking-tight">Security Protocol</p>
              <Badge variant="outline" className="text-[9px] font-black border-secondary/30 text-secondary">ENCRYPTED</Badge>
            </div>
            <p className="text-xs text-muted-foreground font-medium">All personal data and documents are stored securely using industry-standard encryption protocols.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 bg-success/5 rounded-3xl border border-success/10 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-success/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-7 w-7 text-success" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-black uppercase tracking-tight">Instant Eligibility</p>
              <Badge variant="outline" className="text-[9px] font-black border-success/30 text-success">VERIFIED</Badge>
            </div>
            <p className="text-xs text-muted-foreground font-medium">Players become eligible for match selection immediately after administrative verification of documents.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
