import React, { useEffect, useState, useRef } from "react";
import { Upload, MapPin, Calendar, Users, Trophy, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTournamentForm } from "../hooks/useTournamentForm";
import { CreateTournamentInput } from "../types/tournament";
import { supabase } from "@/integrations/supabase/client";

export interface TournamentFormProps {
  onSubmit: (data: CreateTournamentInput | Partial<CreateTournamentInput>) => void;
  onCancel?: () => void;
  onSaveDraft?: () => void;
  initialData?: Partial<CreateTournamentInput>;
}

export function TournamentForm({ onSubmit, onCancel, onSaveDraft, initialData }: TournamentFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useTournamentForm(onSubmit, initialData);
  const [venues, setVenues] = useState<{ id: string; name: string }[]>([]);
  const [organizations, setOrganizations] = useState<{ id: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [venuesRes, orgsRes] = await Promise.all([
        supabase.from("venues").select("id, name").order("name"),
        supabase.from("organizations").select("id, name").order("name"),
      ]);
      if (venuesRes.data) setVenues(venuesRes.data);
      if (orgsRes.data) setOrganizations(orgsRes.data);
    };
    fetchData();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File too large. Max 2MB.");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `tournament-logos/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("org-assets").upload(path, file);
    if (error) {
      console.error("Upload error:", error);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("org-assets").getPublicUrl(path);
    setValue("logoUrl", urlData.publicUrl);
    setLogoPreview(urlData.publicUrl);
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo Upload */}
      <div className="flex items-center gap-6">
        <div
          className="h-24 w-24 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-secondary transition-colors overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          {logoPreview ? (
            <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
          ) : (
            <Upload className={`h-8 w-8 text-muted-foreground ${uploading ? "animate-pulse" : ""}`} />
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        <div>
          <p className="font-medium">Tournament Logo</p>
          <p className="text-sm text-muted-foreground">
            {uploading ? "Uploading..." : "Upload a logo (PNG, JPG, max 2MB)"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Organization */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
            <Building2 className="h-4 w-4" /> Organization *
          </label>
          <select
            {...register("organizationId")}
            className={`h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary ${errors.organizationId ? "border-destructive" : ""}`}
          >
            <option value="">Select organization...</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
          {errors.organizationId && <p className="text-xs text-destructive mt-1">{errors.organizationId.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1.5 block">Tournament Name *</label>
          <input
            type="text"
            placeholder="e.g. Premier Cup 2026"
            {...register("name")}
            className={`h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary ${errors.name ? "border-destructive" : ""}`}
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
            className={`h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary ${errors.startDate ? "border-destructive" : ""}`}
          />
          {errors.startDate && <p className="text-xs text-destructive mt-1">{errors.startDate.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5"><Calendar className="h-4 w-4" /> End Date *</label>
          <input
            type="date"
            {...register("endDate")}
            className={`h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary ${errors.endDate ? "border-destructive" : ""}`}
          />
          {errors.endDate && <p className="text-xs text-destructive mt-1">{errors.endDate.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Location *</label>
          <input
            type="text"
            placeholder="City, Country"
            {...register("location")}
            className={`h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary ${errors.location ? "border-destructive" : ""}`}
          />
          {errors.location && <p className="text-xs text-destructive mt-1">{errors.location.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5"><Users className="h-4 w-4" /> Max Teams *</label>
          <input
            type="number"
            placeholder="16"
            {...register("maxTeams", { valueAsNumber: true })}
            className={`h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary ${errors.maxTeams ? "border-destructive" : ""}`}
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
            {venues.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
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
          <Button type="submit" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Continue →</Button>
        </div>
      </div>
    </form>
  );
}
