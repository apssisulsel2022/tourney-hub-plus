import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { TournamentForm } from "@/modules/tournaments/components/TournamentForm";
import { CreateTournamentInput } from "@/modules/tournaments/types/tournament";
import { tournamentService } from "@/modules/tournaments/services/tournamentService";
import { toast } from "sonner";

export default function TournamentCreatePage() {
  const navigate = useNavigate();

  const handleSaveDraft = () => {
    toast.success("Tournament saved as draft");
  };

  const handleCancel = () => {
    navigate("/tournaments");
  };

  const handleSubmit = async (data: CreateTournamentInput) => {
    try {
      await tournamentService.create(data);
      toast.success("Tournament created successfully!");
      navigate("/tournaments");
    } catch (error) {
      toast.error("Failed to create tournament");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to="/tournaments" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold">Create Tournament</h1>
          <p className="text-muted-foreground">Set up a new football tournament</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {["Basic Info", "Format", "Teams", "Schedule", "Review"].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
              {i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${i === 0 ? "font-medium" : "text-muted-foreground"}`}>{step}</span>
            {i < 4 && <div className="h-px w-6 bg-border hidden sm:block" />}
          </div>
        ))}
      </div>

      <TournamentForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
      />
    </div>
  );
}
