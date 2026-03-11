import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreateTeamInput } from "../types/team";

const playerSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  position: z.string().min(1, "Position is required"),
  jerseyNumber: z.number().min(1).max(99),
  age: z.number().min(5).max(100),
});

const teamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  foundingDate: z.string().min(1, "Founding date is required"),
  coachName: z.string().min(3, "Coach name is required"),
  roster: z.array(playerSchema).min(1, "At least one player is required"),
});

export function useTeamForm(onSubmit: (data: CreateTeamInput) => void, initialData?: Partial<CreateTeamInput>) {
  const form = useForm<CreateTeamInput>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      description: "",
      foundingDate: "",
      coachName: "",
      roster: [],
      ...initialData,
    },
  });

  return form;
}
