import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Plus, Trash2, UserPlus, Shield, Info, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateTeamInput } from "../types/team";
import { cn } from "@/lib/utils";

interface TeamFormProps {
  onSubmit: (data: CreateTeamInput) => void;
  onCancel?: () => void;
  initialData?: Partial<CreateTeamInput>;
}

export function TeamForm({ onSubmit, onCancel, initialData }: TeamFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { register, control, handleSubmit, formState: { errors }, watch } = useForm<CreateTeamInput>({
    defaultValues: {
      name: "",
      description: "",
      foundingDate: "",
      coachName: "",
      roster: [],
      ...initialData,
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "roster"
  });

  const STEPS = [
    { id: "basic", title: "Basic Info", icon: Info },
    { id: "roster", title: "Initial Roster", icon: Users },
  ];

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handleBack = () => setCurrentStep(prev => prev - 1);

  return (
    <div className="space-y-8">
      {/* Progress Tracker */}
      <div className="flex items-center justify-center gap-4">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all",
                currentStep === i ? "border-secondary bg-secondary text-white shadow-lg shadow-secondary/20" : 
                currentStep > i ? "border-secondary bg-secondary text-white" : "border-muted text-muted-foreground"
              )}>
                {currentStep > i ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
              </div>
              <span className={cn("text-xs font-bold uppercase tracking-wider", currentStep === i ? "text-secondary" : "text-muted-foreground")}>
                {step.title}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className="w-12 h-px bg-muted" />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-card rounded-2xl border p-8 shadow-sm">
          {currentStep === 0 && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-32 w-32 rounded-3xl border-2 border-dashed border-muted flex flex-col items-center justify-center cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-all group relative overflow-hidden">
                    <Upload className="h-8 w-8 text-muted-foreground group-hover:text-secondary transition-colors" />
                    <span className="text-[10px] font-bold text-muted-foreground group-hover:text-secondary mt-2">UPLOAD LOGO</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center font-bold uppercase">PNG, JPG up to 2MB</p>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Team Name *</label>
                    <Input {...register("name")} placeholder="e.g. FC Thunder" className="h-12 font-bold" />
                    {errors.name && <p className="text-xs text-destructive font-bold">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Coach Name *</label>
                    <Input {...register("coachName")} placeholder="Head Coach" className="h-12 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Founding Date *</label>
                    <Input {...register("foundingDate")} type="date" className="h-12 font-bold" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Team Description *</label>
                    <Textarea {...register("description")} placeholder="Describe your team history and philosophy..." className="min-h-[120px] font-medium resize-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Roster Setup</h3>
                  <p className="text-sm text-muted-foreground">Add initial players to your team</p>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 font-bold border-secondary text-secondary hover:bg-secondary/10"
                  onClick={() => append({ firstName: "", lastName: "", position: "ST", jerseyNumber: 1, age: 20 })}
                >
                  <UserPlus className="h-4 w-4" /> Add Player
                </Button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 rounded-xl border bg-muted/20 relative group">
                    <div className="md:col-span-2 space-y-1">
                      <Input {...register(`roster.${index}.firstName`)} placeholder="First Name" className="h-9 font-bold" />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <Input {...register(`roster.${index}.lastName`)} placeholder="Last Name" className="h-9 font-bold" />
                    </div>
                    <div className="space-y-1">
                      <select {...register(`roster.${index}.position`)} className="h-9 w-full rounded-lg border bg-background px-2 text-xs font-bold outline-none focus:border-secondary">
                        <option value="GK">GK</option>
                        <option value="DEF">DEF</option>
                        <option value="MID">MID</option>
                        <option value="FWD">FWD</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Input {...register(`roster.${index}.jerseyNumber`, { valueAsNumber: true })} type="number" placeholder="#" className="h-9 font-bold" />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => remove(index)}
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {fields.length === 0 && (
                  <div className="py-12 text-center border-2 border-dashed rounded-xl bg-muted/10">
                    <UserPlus className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm font-bold text-muted-foreground">No players added yet</p>
                    <Button type="button" variant="link" onClick={() => append({ firstName: "", lastName: "", position: "ST", jerseyNumber: 1, age: 20 })}>Click to add first player</Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-dashed border-muted">
          <Button type="button" variant="ghost" className="font-bold text-muted-foreground" onClick={onCancel}>
            Cancel
          </Button>
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button type="button" variant="outline" className="font-bold" onClick={handleBack}>
                Previous Step
              </Button>
            )}
            {currentStep < STEPS.length - 1 ? (
              <Button type="button" variant="secondary" className="font-black px-8" onClick={handleNext}>
                Continue →
              </Button>
            ) : (
              <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white font-black px-12 shadow-lg shadow-secondary/20">
                REGISTER TEAM
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
