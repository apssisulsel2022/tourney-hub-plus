import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import StatisticsPage from "../pages/StatisticsPage";
import { BrowserRouter } from "react-router-dom";

describe("StatisticsPage dashboard", () => {
  it("renders the three main sections", async () => {
    render(
      <BrowserRouter>
        <StatisticsPage />
      </BrowserRouter>
    );
    expect(await screen.findByText("Top Scorers")).toBeDefined();
    expect(screen.getByText("Top Assists")).toBeDefined();
    expect(screen.getByText("Disciplinary Record")).toBeDefined();
  });

  it("exports CSV when CSV button is clicked", async () => {
    const createObjectURLSpy = vi.spyOn(URL, "createObjectURL");
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    render(
      <BrowserRouter>
        <StatisticsPage />
      </BrowserRouter>
    );

    await screen.findByText("Top Scorers");
    fireEvent.click(screen.getByText("CSV"));

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });

  it("exports PDF using window.open and print", async () => {
    const print = vi.fn();
    const focus = vi.fn();
    const doc = {
      open: vi.fn() as unknown as Document["open"],
      write: vi.fn() as unknown as Document["write"],
      close: vi.fn() as unknown as Document["close"],
    };
    const win = {
      document: doc as unknown as Document,
      print: print as unknown as Window["print"],
      focus: focus as unknown as Window["focus"],
    };
    const openSpy = vi.spyOn(window, "open").mockReturnValue(win as unknown as Window);

    render(
      <BrowserRouter>
        <StatisticsPage />
      </BrowserRouter>
    );

    await screen.findByText("Top Scorers");
    fireEvent.click(screen.getByText("PDF"));

    expect(openSpy).toHaveBeenCalled();
    expect(doc.write).toHaveBeenCalled();
    expect(print).toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it("toggles live updates button pressed state", async () => {
    render(
      <BrowserRouter>
        <StatisticsPage />
      </BrowserRouter>
    );

    await screen.findByText("Top Scorers");
    const btn = screen.getByRole("button", { name: /Live Updates/i });
    const pressedBefore = btn.getAttribute("aria-pressed");
    fireEvent.click(btn);
    const pressedAfter = btn.getAttribute("aria-pressed");
    expect(pressedBefore).not.toBe(pressedAfter);
  });
});
