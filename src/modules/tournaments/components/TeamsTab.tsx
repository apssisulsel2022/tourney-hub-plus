import React from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";

const teams = [
  { name: "FC Thunder", city: "New York", coach: "Marco Rossi", players: 22, status: "active" as const },
  { name: "Red Lions", city: "Chicago", coach: "David Chen", players: 20, status: "active" as const },
  { name: "Blue Eagles", city: "Los Angeles", coach: "Sarah Johnson", players: 21, status: "active" as const },
  { name: "Golden Stars", city: "Miami", coach: "Alex Petrov", players: 19, status: "active" as const },
  { name: "United FC", city: "Houston", coach: "James Lee", players: 23, status: "active" as const },
  { name: "Dynamo City", city: "Seattle", coach: "Omar Faruk", players: 20, status: "active" as const },
  { name: "Phoenix SC", city: "Phoenix", coach: "Luca Bianchi", players: 21, status: "active" as const },
  { name: "Metro FC", city: "Denver", coach: "Chris Park", players: 22, status: "active" as const },
];

export function TeamsTab() {
  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="data-table-header px-4 py-3 text-left">Team</th>
              <th className="data-table-header px-4 py-3 text-left">City</th>
              <th className="data-table-header px-4 py-3 text-left hidden md:table-cell">Coach</th>
              <th className="data-table-header px-4 py-3 text-center">Players</th>
              <th className="data-table-header px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((t, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {t.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm">{t.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{t.city}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{t.coach}</td>
                <td className="px-4 py-3 text-sm text-center">{t.players}</td>
                <td className="px-4 py-3 text-center"><StatusBadge status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
