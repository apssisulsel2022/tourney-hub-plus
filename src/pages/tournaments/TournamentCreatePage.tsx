import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ChevronRight, Save, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { TournamentForm } from "@/modules/tournaments/components/TournamentForm";
import { CreateTournamentInput } from "@/modules/tournaments/types/tournament";
import { tournamentService } from "@/modules/tournaments/services/tournamentService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "basic", title: "Basic Info", description: "Name, format & location" },
  { id: "format", title: "Rules & Format", description: "Match rules & scoring" },
  { id: "teams", title: "Participant Mgmt", description: "Teams & registration" },
  { id: "schedule", title: "Scheduling", description: "Dates & venues" },
  { id: "review", title: "Review & Publish", description: "Final confirmation" },
];

export default function TournamentCreatePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<CreateTournamentInput>>({});

  const handleSaveDraft = () => {
    toast.success("Tournament saved as draft", {
      description: "You can continue editing from your tournament list.",
    });
  };

  const handleCancel = () => {
    navigate("/tournaments");
  };

  const handleNext = (data: Partial<CreateTournamentInput>) => {
    setFormData(prev => ({ ...prev, ...data }));
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleFinalSubmit({ ...formData, ...data } as CreateTournamentInput);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinalSubmit = async (data: CreateTournamentInput) => {
    try {
      await tournamentService.create(data);
      toast.success("Tournament created successfully!", {
        description: `${data.name} is now live and accepting registrations.`,
      });
      navigate("/tournaments");
    } catch (error) {
      toast.error("Failed to create tournament");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/tournaments">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Tournament</h1>
            <p className="text-muted-foreground mt-1">Configure your competition settings</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={handleSaveDraft}>
            <Save className="h-4 w-4" /> Save Draft
          </Button>
          <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2" onClick={handleCancel}>
            <X className="h-4 w-4" /> Discard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-1">
            {STEPS.map((step, i) => {
              const isActive = i === currentStep;
              const isCompleted = i < currentStep;
              
              return (
                <div 
                  key={step.id} 
                  className={cn(
                    "relative flex items-start gap-4 p-4 rounded-xl transition-all",
                    isActive ? "bg-secondary/10 border border-secondary/20 shadow-sm" : "opacity-60"
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300",
                    isActive ? "border-secondary bg-secondary text-secondary-foreground" : 
                    isCompleted ? "border-secondary bg-secondary text-secondary-foreground" : "border-muted text-muted-foreground"
                  )}>
                    {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  <div className="space-y-0.5">
                    <p className={cn("text-sm font-bold", isActive ? "text-secondary" : "text-foreground")}>{step.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-tight">{step.description}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={cn(
                      "absolute left-[29px] top-[48px] w-[2px] h-[24px] bg-muted",
                      isCompleted && "bg-secondary"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-muted bg-muted/20">
              <h2 className="text-xl font-bold">{STEPS[currentStep].title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{STEPS[currentStep].description}</p>
            </div>
            
            <div className="p-8">
              {currentStep === 0 && (
                <TournamentForm 
                  onSubmit={handleNext}
                  onCancel={handleBack}
                  onSaveDraft={handleSaveDraft}
                  initialData={formData}
                />
              )}

              {currentStep > 0 && (
                <div className="py-20 text-center space-y-4">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <ChevronRight className="h-8 w-8 text-muted-foreground opacity-20" />
                  </div>
                  <h3 className="text-xl font-bold">Step {currentStep + 1}: {STEPS[currentStep].title}</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    Implementation for this step's specialized configuration panel will be loaded here.
                  </p>
                  <div className="flex items-center justify-center gap-4 pt-8">
                    <Button variant="outline" onClick={handleBack}>Back to {STEPS[currentStep-1].title}</Button>
                    <Button variant="secondary" onClick={() => handleNext({})}>Continue to {STEPS[currentStep+1]?.title || 'Review'}</Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-dashed border-muted">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              Progress auto-saved at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Step {currentStep + 1} of 5</p>
          </div>
        </div>
      </div>
    </div>
  );
}
