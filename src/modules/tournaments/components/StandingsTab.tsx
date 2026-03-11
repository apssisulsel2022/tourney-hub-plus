import React from "react";
const standingsData = [
  { pos: 1, team: "FC Thunder", p: 10, w: 8, d: 1, l: 1, gf: 24, ga: 8, pts: 25 },
  { pos: 2, team: "Red Lions", p: 10, w: 7, d: 2, l: 1, gf: 20, ga: 10, pts: 23 },
  { pos: 3, team: "Blue Eagles", p: 10, w: 6, d: 2, l: 2, gf: 18, ga: 12, pts: 20 },
  { pos: 4, team: "Golden Stars", p: 10, w: 5, d: 3, l: 2, gf: 16, ga: 11, pts: 18 },
  { pos: 5, team: "United FC", p: 10, w: 4, d: 3, l: 3, gf: 14, ga: 13, pts: 15 },
  { pos: 6, team: "Dynamo City", p: 10, w: 3, d: 2, l: 5, gf: 12, ga: 16, pts: 11 },
  { pos: 7, team: "Phoenix SC", p: 10, w: 2, d: 1, l: 7, gf: 9, ga: 20, pts: 7 },
  { pos: 8, team: "Metro FC", p: 10, w: 1, d: 0, l: 9, gf: 5, ga: 28, pts: 3 },
];

export function StandingsTab() {
  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="data-table-header px-4 py-3 text-center w-12">#</th>
              <th className="data-table-header px-4 py-3 text-left">Team</th>
              <th className="data-table-header px-4 py-3 text-center">P</th>
              <th className="data-table-header px-4 py-3 text-center">W</th>
              <th className="data-table-header px-4 py-3 text-center">D</th>
              <th className="data-table-header px-4 py-3 text-center">L</th>
              <th className="data-table-header px-4 py-3 text-center hidden sm:table-cell">GF</th>
              <th className="data-table-header px-4 py-3 text-center hidden sm:table-cell">GA</th>
              <th className="data-table-header px-4 py-3 text-center font-bold">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standingsData.map((row) => (
              <tr key={row.pos} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${row.pos <= 2 ? "border-l-2 border-l-success" : row.pos >= 7 ? "border-l-2 border-l-destructive" : ""}`}>
                <td className="px-4 py-3 text-center text-sm font-bold">{row.pos}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {row.team.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm">{row.team}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm">{row.p}</td>
                <td className="px-4 py-3 text-center text-sm">{row.w}</td>
                <td className="px-4 py-3 text-center text-sm">{row.d}</td>
                <td className="px-4 py-3 text-center text-sm">{row.l}</td>
                <td className="px-4 py-3 text-center text-sm hidden sm:table-cell">{row.gf}</td>
                <td className="px-4 py-3 text-center text-sm hidden sm:table-cell">{row.ga}</td>
                <td className="px-4 py-3 text-center text-sm font-bold">{row.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
