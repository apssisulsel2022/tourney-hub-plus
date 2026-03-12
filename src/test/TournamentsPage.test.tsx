import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TournamentsPage from "../pages/TournamentsPage";
import { BrowserRouter } from "react-router-dom";

describe("TournamentsPage", () => {
  it("renders the tournaments page title", () => {
    render(
      <BrowserRouter>
        <TournamentsPage />
      </BrowserRouter>
    );
    expect(screen.getByText("Tournaments")).toBeDefined();
  });

  it("filters tournaments by search query", () => {
    render(
      <BrowserRouter>
        <TournamentsPage />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText("Search by name or location...");
    fireEvent.change(searchInput, { target: { value: "Premier Cup" } });
    
    expect(screen.getByText("Premier Cup 2026")).toBeDefined();
    // Use queryByText for elements that shouldn't be there
    expect(screen.queryByText("City League Season 8")).toBeNull();
  });

  it("changes view mode from grid to list", () => {
    render(
      <BrowserRouter>
        <TournamentsPage />
      </BrowserRouter>
    );
    
    fireEvent.click(screen.getByLabelText("List view"));
    
    // In list mode, we expect a table header
    expect(screen.getByText("Tournament Name")).toBeDefined();
  });
});
