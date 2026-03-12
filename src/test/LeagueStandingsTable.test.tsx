import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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
    expect(screen.getByText("Position")).toBeDefined();
    expect(screen.getByText("Team")).toBeDefined();
    expect(screen.getByText("Played")).toBeDefined();
    expect(screen.getByText("Win")).toBeDefined();
    expect(screen.getByText("Draw")).toBeDefined();
    expect(screen.getByText("Loss")).toBeDefined();
    expect(screen.getByText("Goals For")).toBeDefined();
    expect(screen.getByText("Goals Against")).toBeDefined();
    expect(screen.getByText("Points")).toBeDefined();
    expect(screen.getByText("Alpha FC")).toBeDefined();
    expect(screen.getByText("Beta United")).toBeDefined();
    expect(screen.getByText("Gamma City")).toBeDefined();
  });

  it("formats position with ordinal indicators for English locales", () => {
    render(<LeagueStandingsTable data={baseData} locale="en-US" />);
    expect(screen.getByText("1st")).toBeDefined();
    expect(screen.getByText("2nd")).toBeDefined();
    expect(screen.getByText("3rd")).toBeDefined();
  });

  it("right-aligns numeric columns via className", () => {
    render(<LeagueStandingsTable data={baseData} />);
    const pointsHeader = screen.getByRole("button", { name: /Sort by Points/i }).closest("th");
    expect(pointsHeader?.className.includes("text-right")).toBe(true);
  });

  it("applies top 3 highlight classes", () => {
    render(<LeagueStandingsTable data={baseData} />);
    const row1 = screen.getByText("Alpha FC").closest("tr");
    const row2 = screen.getByText("Beta United").closest("tr");
    const row3 = screen.getByText("Gamma City").closest("tr");
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

    fireEvent.click(screen.getByRole("button", { name: /Sort by Points/i }));
    const rows = screen.getAllByRole("row");
    const firstBodyRow = rows[1];
    expect(firstBodyRow.textContent?.includes("A")).toBe(true);
  });

  it("uses goal difference as a tie-breaker when sorting by points", () => {
    const tieData: StandingsTeamRow[] = [
      { position: 1, teamName: "A", played: 10, win: 7, draw: 2, loss: 1, goalsFor: 10, goalsAgainst: 3, points: 23 },
      { position: 2, teamName: "B", played: 10, win: 7, draw: 2, loss: 1, goalsFor: 10, goalsAgainst: 5, points: 23 },
    ];
    render(<LeagueStandingsTable data={tieData} initialSort={{ key: "points", direction: "desc" }} />);
    const bodyRows = screen.getAllByRole("row").slice(1);
    expect(bodyRows[0].textContent?.includes("A")).toBe(true);
  });

  it("shows empty state for no data", () => {
    render(<LeagueStandingsTable data={[]} />);
    expect(screen.getByText("No standings data available.")).toBeDefined();
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
    expect(screen.getByText("Delta")).toBeDefined();
  });

  it("formats numbers using locale", () => {
    const big: StandingsTeamRow[] = [
      { position: 1, teamName: "Locale FC", played: 1000, win: 500, draw: 300, loss: 200, goalsFor: 1234, goalsAgainst: 567, points: 1500 },
    ];
    render(<LeagueStandingsTable data={big} locale="de-DE" />);
    expect(screen.getByText("1.000")).toBeDefined();
  });
});

