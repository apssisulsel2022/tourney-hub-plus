import React from "react";
import { ArrowLeft, Check, ChevronRight, Save, X, Shield, Plus, Info, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { TeamForm } from "@/modules/teams/components/TeamForm";
import { CreateTeamInput } from "@/modules/teams/types/team";
import { teamService } from "@/modules/teams/services/teamService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function TeamCreatePage() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/teams");
  };

  const handleFinalSubmit = async (data: CreateTeamInput) => {
    try {
      await teamService.createTeam(data);
      toast.success("Team registered successfully!", {
        description: `${data.name} is now ready for competition.`,
      });
      navigate("/teams");
    } catch (error) {
      toast.error("Failed to register team");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/teams">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Register Team</h1>
            <p className="text-muted-foreground mt-1">Onboard your club and manage its roster</p>
          </div>
        </div>
      </div>

      <TeamForm 
        onSubmit={handleFinalSubmit}
        onCancel={handleCancel}
      />

      <div className="flex items-center justify-between p-6 bg-secondary/5 rounded-2xl border border-secondary/10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-bold">Team Protection Policy</p>
            <p className="text-xs text-muted-foreground">Club details and rosters are verified by platform admins.</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-secondary border-secondary/30 px-3">SAFE & VERIFIED</Badge>
      </div>
    </div>
  );
}
