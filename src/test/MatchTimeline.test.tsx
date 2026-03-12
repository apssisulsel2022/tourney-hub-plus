import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MatchTimeline, MatchTimelineEvent } from "../components/MatchTimeline";

const baseEvents: MatchTimelineEvent[] = [
  { id: "e1", type: "goal", minute: 12, teamName: "FC Thunder", playerName: "Carlos Silva" },
  { id: "e2", type: "yellow", minute: 23, teamName: "Red Lions", playerName: "David Chen" },
  { id: "e3", type: "red", minute: 78, teamName: "Red Lions", playerName: "Liam Foster" },
  { id: "e4", type: "substitution", minute: 45, teamName: "FC Thunder", playerName: "Marco Rossi", playerOutName: "Marco Rossi", playerInName: "Alex Park" },
];

describe("MatchTimeline", () => {
  it("renders all event types with icons and labels", () => {
    render(<MatchTimeline events={baseEvents} order="asc" />);

    expect(screen.getByText("⚽")).toBeDefined();
    expect(screen.getByText("🟨")).toBeDefined();
    expect(screen.getByText("🟥")).toBeDefined();
    expect(screen.getByText("🔄")).toBeDefined();

    expect(screen.getByText("Carlos Silva")).toBeDefined();
    expect(screen.getByText("David Chen")).toBeDefined();
    expect(screen.getByText("Liam Foster")).toBeDefined();
    expect(screen.getByText("Marco Rossi → Alex Park")).toBeDefined();

    expect(screen.getAllByText(/'\s*$/).length).toBeGreaterThan(0);
  });

  it("supports ascending and descending ordering", () => {
    const { rerender } = render(<MatchTimeline events={baseEvents} order="asc" />);
    const itemsAsc = screen.getAllByRole("listitem");
    expect(itemsAsc[0].getAttribute("aria-label")?.includes("12")).toBe(true);

    rerender(<MatchTimeline events={baseEvents} order="desc" />);
    const itemsDesc = screen.getAllByRole("listitem");
    expect(itemsDesc[0].getAttribute("aria-label")?.includes("78")).toBe(true);
  });

  it("keeps stable ordering for simultaneous events", () => {
    const simultaneous: MatchTimelineEvent[] = [
      { id: "s1", type: "goal", minute: 45, teamName: "FC Thunder", playerName: "A" },
      { id: "s2", type: "yellow", minute: 45, teamName: "Red Lions", playerName: "B" },
    ];
    render(<MatchTimeline events={simultaneous} order="asc" />);
    const items = screen.getAllByRole("listitem");
    expect(items[0].getAttribute("aria-label")?.includes(": A")).toBe(true);
    expect(items[1].getAttribute("aria-label")?.includes(": B")).toBe(true);
  });

  it("handles extra time minutes like 45+2", () => {
    const extraTime: MatchTimelineEvent[] = [
      { id: "x1", type: "goal", minute: "45+2", teamName: "FC Thunder", playerName: "ET Goal" },
      { id: "x2", type: "yellow", minute: 45, teamName: "FC Thunder", playerName: "45 Card" },
    ];
    render(<MatchTimeline events={extraTime} order="asc" />);
    const items = screen.getAllByRole("listitem");
    expect(items[0].getAttribute("aria-label")?.includes("45")).toBe(true);
    expect(items[1].getAttribute("aria-label")?.includes("45+2")).toBe(true);
  });

  it("truncates long player names and preserves full name in title", () => {
    const longName = "A Very Long Player Name That Should Truncate In The UI Layout";
    render(<MatchTimeline events={[{ id: "l1", type: "goal", minute: 10, teamName: "FC Thunder", playerName: longName }]} />);
    const el = screen.getByTitle(longName);
    expect(el.className.includes("truncate")).toBe(true);
  });

  it("supports live updates when new events arrive", () => {
    const Wrapper = () => {
      const [events, setEvents] = useState<MatchTimelineEvent[]>([{ id: "a1", type: "goal", minute: 1, teamName: "FC Thunder", playerName: "Kickoff" }]);
      return (
        <div>
          <button onClick={() => setEvents((prev) => [...prev, { id: "a2", type: "yellow", minute: 2, teamName: "Red Lions", playerName: "Foul" }])}>
            add
          </button>
          <MatchTimeline events={events} order="asc" />
        </div>
      );
    };

    render(<Wrapper />);
    expect(screen.getByText("Kickoff")).toBeDefined();
    fireEvent.click(screen.getByText("add"));
    expect(screen.getByText("Foul")).toBeDefined();
  });

  it("provides accessible order controls when onOrderChange is provided", () => {
    const Wrapper = () => {
      const [order, setOrder] = useState<"asc" | "desc">("desc");
      return <MatchTimeline events={baseEvents} order={order} onOrderChange={setOrder} />;
    };
    render(<Wrapper />);
    fireEvent.click(screen.getByLabelText("Sort timeline ascending"));
    const items = screen.getAllByRole("listitem");
    expect(items[0].getAttribute("aria-label")?.includes("12")).toBe(true);
  });
});
