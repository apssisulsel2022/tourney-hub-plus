import React, { useState } from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LeagueStandingsTable, StandingsTeamRow } from "../components/LeagueStandingsTable";

const baseData: StandingsTeamRow[] = [
  { position: 1, teamName: "Alpha FC", played: 10, win: 8, draw: 1, loss: 1, goalsFor: 20, goalsAgainst: 10, points: 25 },
  { position: 2, teamName: "Beta United", played: 10, win: 7, draw: 2, loss: 1, goalsFor: 18, goalsAgainst: 9, points: 23 },
  { position: 3, teamName: "Gamma City", played: 10, win: 6, draw: 2, loss: 2, goalsFor: 16, goalsAgainst: 12, points: 20 },
];

describe("LeagueStandingsTable", () => {
  it("renders required headers and rows", () => {
    render(<LeagueStandingsTable data={baseData} />);
    const table = screen.getByRole("table", { name: /league standings table/i });
    const t = within(table);
    expect(t.getByText("Position")).toBeDefined();
    expect(t.getByText("Team")).toBeDefined();
    expect(t.getByText("Played")).toBeDefined();
    expect(t.getByText("Win")).toBeDefined();
    expect(t.getByText("Draw")).toBeDefined();
    expect(t.getByText("Loss")).toBeDefined();
    expect(t.getByText("Goals For")).toBeDefined();
    expect(t.getByText("Goals Against")).toBeDefined();
    expect(t.getByText("Points")).toBeDefined();
    expect(t.getByText("Alpha FC")).toBeDefined();
    expect(t.getByText("Beta United")).toBeDefined();
    expect(t.getByText("Gamma City")).toBeDefined();
  });

  it("formats position with ordinal indicators for English locales", () => {
    render(<LeagueStandingsTable data={baseData} locale="en-US" />);
    const table = screen.getByRole("table", { name: /league standings table/i });
    const t = within(table);
    expect(t.getByText("1st")).toBeDefined();
    expect(t.getByText("2nd")).toBeDefined();
    expect(t.getByText("3rd")).toBeDefined();
  });

  it("right-aligns numeric columns via className", () => {
    render(<LeagueStandingsTable data={baseData} />);
    const table = screen.getByRole("table", { name: /league standings table/i });
    const pointsHeader = within(table).getByRole("button", { name: /Sort by Points/i }).closest("th");
    expect(pointsHeader?.className.includes("text-right")).toBe(true);
  });

  it("applies top 3 highlight classes", () => {
    render(<LeagueStandingsTable data={baseData} />);
    const table = screen.getByRole("table", { name: /league standings table/i });
    const t = within(table);
    const row1 = t.getByText("Alpha FC").closest("tr");
    const row2 = t.getByText("Beta United").closest("tr");
    const row3 = t.getByText("Gamma City").closest("tr");
    expect(row1?.className.includes("bg-yellow-500/15")).toBe(true);
    expect(row2?.className.includes("bg-muted/60")).toBe(true);
    expect(row3?.className.includes("bg-amber-700/15")).toBe(true);
  });

  it("sorts by points when header is clicked", () => {
    const tieData: StandingsTeamRow[] = [
      { position: 1, teamName: "A", played: 10, win: 7, draw: 2, loss: 1, goalsFor: 10, goalsAgainst: 5, points: 23 },
      { position: 2, teamName: "B", played: 10, win: 7, draw: 2, loss: 1, goalsFor: 9, goalsAgainst: 5, points: 23 },
      { position: 3, teamName: "C", played: 10, win: 6, draw: 2, loss: 2, goalsFor: 8, goalsAgainst: 6, points: 20 },
    ];
    render(<LeagueStandingsTable data={tieData} initialSort={{ key: "teamName", direction: "asc" }} />);

    const table = screen.getByRole("table", { name: /league standings table/i });
    fireEvent.click(within(table).getByRole("button", { name: /Sort by Points/i }));
    const rows = within(table).getAllByRole("row");
    const firstBodyRow = rows[1];
    expect(firstBodyRow.textContent?.includes("A")).toBe(true);
  });

  it("uses goal difference as a tie-breaker when sorting by points", () => {
    const tieData: StandingsTeamRow[] = [
      { position: 1, teamName: "A", played: 10, win: 7, draw: 2, loss: 1, goalsFor: 10, goalsAgainst: 3, points: 23 },
      { position: 2, teamName: "B", played: 10, win: 7, draw: 2, loss: 1, goalsFor: 10, goalsAgainst: 5, points: 23 },
    ];
    render(<LeagueStandingsTable data={tieData} initialSort={{ key: "points", direction: "desc" }} />);
    const table = screen.getByRole("table", { name: /league standings table/i });
    const bodyRows = within(table).getAllByRole("row").slice(1);
    expect(bodyRows[0].textContent?.includes("A")).toBe(true);
  });

  it("shows empty state for no data", () => {
    render(<LeagueStandingsTable data={[]} />);
    const table = screen.getByRole("table", { name: /league standings table/i });
    expect(within(table).getByText("No standings data available.")).toBeDefined();
  });

  it("shows loading skeletons when loading is true", () => {
    render(<LeagueStandingsTable data={baseData} loading />);
    expect(screen.getByText("Loading standings…")).toBeDefined();
  });

  it("shows error state and allows retry", () => {
    const onRetry = () => {};
    render(<LeagueStandingsTable data={baseData} error="Network error" onRetry={onRetry} />);
    expect(screen.getByText("Network error")).toBeDefined();
    expect(screen.getByText("Try again")).toBeDefined();
  });

  it("updates when data changes (real-time update capability)", () => {
    const Wrapper = () => {
      const [rows, setRows] = useState<StandingsTeamRow[]>(baseData);
      return (
        <div>
          <button onClick={() => setRows([{ position: 1, teamName: "Delta", played: 1, win: 1, draw: 0, loss: 0, goalsFor: 5, goalsAgainst: 0, points: 3 }, ...rows])}>
            add
          </button>
          <LeagueStandingsTable data={rows} />
        </div>
      );
    };

    render(<Wrapper />);
    fireEvent.click(screen.getByText("add"));
    const table = screen.getByRole("table", { name: /league standings table/i });
    expect(within(table).getByText("Delta")).toBeDefined();
  });

  it("formats numbers using locale", () => {
    const big: StandingsTeamRow[] = [
      { position: 1, teamName: "Locale FC", played: 1000, win: 500, draw: 300, loss: 200, goalsFor: 1234, goalsAgainst: 567, points: 1500 },
    ];
    render(<LeagueStandingsTable data={big} locale="de-DE" />);
    const table = screen.getByRole("table", { name: /league standings table/i });
    expect(within(table).getByText("1.000")).toBeDefined();
  });
});
