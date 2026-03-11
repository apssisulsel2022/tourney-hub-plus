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
});

export const useTournamentForm = (onSubmit: (data: CreateTournamentInput) => void) => {
  const form = useForm<CreateTournamentInput>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      name: "",
      description: "",
      format: "League",
      ageCategory: "Senior",
      startDate: "",
      endDate: "",
      location: "",
      maxTeams: 16,
      venueId: "",
      registrationDeadline: "",
      logoUrl: "",
    },
  });

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
