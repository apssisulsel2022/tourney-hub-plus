import React from "react";
import { Upload, MapPin, Calendar, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTournamentForm } from "../hooks/useTournamentForm";
import { CreateTournamentInput } from "../types/tournament";

interface TournamentFormProps {
  onSubmit: (data: CreateTournamentInput) => void;
  onCancel?: () => void;
  onSaveDraft?: () => void;
}

export function TournamentForm({ onSubmit, onCancel, onSaveDraft }: TournamentFormProps) {
  const { register, handleSubmit, formState: { errors } } = useTournamentForm(onSubmit);

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl border p-6 space-y-6">
      {/* Logo Upload */}
      <div className="flex items-center gap-6">
        <div className="h-24 w-24 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-secondary transition-colors">
          <Upload className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">Tournament Logo</p>
          <p className="text-sm text-muted-foreground">Upload a logo (PNG, JPG, max 2MB)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1.5 block">Tournament Name *</label>
          <input 
            type="text" 
            placeholder="e.g. Premier Cup 2026" 
            {...register("name")}
            className={`h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary ${errors.name ? 'border-destructive' : ''}`} 
          />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1.5 block">Description</label>
          <textarea 
            placeholder="Brief description of the tournament..." 
            {...register("description")}
            className="h-24 w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary resize-none" 
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Format *</label>
          <select 
            {...register("format")}
            className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary"
          >
            <option value="League">League</option>
            <option value="Knockout">Knockout</option>
            <option value="Group Stage + Knockout">Group Stage + Knockout</option>
            <option value="Round Robin">Round Robin</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Age Category *</label>
          <select 
            {...register("ageCategory")}
            className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary"
          >
            <option value="Senior">Senior</option>
            <option value="U-21">U-21</option>
            <option value="U-19">U-19</option>
            <option value="U-17">U-17</option>
            <option value="U-15">U-15</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Start Date *</label>
          <input 
            type="date" 
            {...register("startDate")}
            className={`h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary ${errors.startDate ? 'border-destructive' : ''}`} 
          />
          {errors.startDate && <p className="text-xs text-destructive mt-1">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5"><Calendar className="h-4 w-4" /> End Date *</label>
          <input 
            type="date" 
            {...register("endDate")}
            className={`h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary ${errors.endDate ? 'border-destructive' : ''}`} 
          />
          {errors.endDate && <p className="text-xs text-destructive mt-1">{errors.endDate.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Location *</label>
          <input 
            type="text" 
            placeholder="City, Country" 
            {...register("location")}
            className={`h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary ${errors.location ? 'border-destructive' : ''}`} 
          />
          {errors.location && <p className="text-xs text-destructive mt-1">{errors.location.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5"><Users className="h-4 w-4" /> Max Teams *</label>
          <input 
            type="number" 
            placeholder="16" 
            {...register("maxTeams", { valueAsNumber: true })}
            className={`h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary ${errors.maxTeams ? 'border-destructive' : ''}`} 
          />
          {errors.maxTeams && <p className="text-xs text-destructive mt-1">{errors.maxTeams.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5"><Trophy className="h-4 w-4" /> Venue</label>
          <select 
            {...register("venueId")}
            className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary"
          >
            <option value="">Select a venue...</option>
            <option value="national-stadium">National Stadium</option>
            <option value="city-arena">City Arena</option>
            <option value="olympic-park">Olympic Park</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Registration Deadline</label>
          <input 
            type="date" 
            {...register("registrationDeadline")}
            className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary" 
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onSaveDraft}>Save as Draft</Button>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="success">Continue →</Button>
        </div>
      </div>
    </form>
  );
}
