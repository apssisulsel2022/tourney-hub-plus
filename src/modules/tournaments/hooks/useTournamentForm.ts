import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreateTournamentInput } from "../types/tournament";

const tournamentSchema = z.object({
  name: z.string().min(3, "Tournament name must be at least 3 characters"),
  description: z.string().optional(),
  format: z.enum(["League", "Knockout", "Group Stage + Knockout", "Round Robin"]),
  ageCategory: z.enum(["Senior", "U-21", "U-19", "U-17", "U-15"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  location: z.string().min(1, "Location is required"),
  maxTeams: z.number().min(2, "Minimum 2 teams required"),
  venueId: z.string().optional(),
  registrationDeadline: z.string().optional(),
  logoUrl: z.string().optional(),
  organizationId: z.string().min(1, "Organization is required"),
});

export const useTournamentForm = (
  onSubmit: (data: CreateTournamentInput | Partial<CreateTournamentInput>) => void,
  initialData?: Partial<CreateTournamentInput>
) => {
  const form = useForm<CreateTournamentInput>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      format: initialData?.format || "League",
      ageCategory: initialData?.ageCategory || "Senior",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      location: initialData?.location || "",
      maxTeams: initialData?.maxTeams || 16,
      venueId: initialData?.venueId || "",
      registrationDeadline: initialData?.registrationDeadline || "",
      logoUrl: initialData?.logoUrl || "",
      organizationId: initialData?.organizationId || "",
    },
  });

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
