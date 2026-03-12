import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import OrganizationDetailPage from "@/pages/organizations/OrganizationDetailPage";

describe("OrganizationDetailPage", () => {
  const renderPage = (initialEntry: string) => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="/organizations/:id" element={<OrganizationDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it("renders structured header and tabs", async () => {
    renderPage("/organizations/org-cfa");

    expect(await screen.findByText("Organization Detail")).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Overview" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Members" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Metadata" })).toBeTruthy();
  });

  it("filters members by search input", async () => {
    renderPage("/organizations/org-cfa?tab=members");

    const search = await screen.findByLabelText("Search members");
    fireEvent.change(search, { target: { value: "sarah@" } });
    const list = screen.getByLabelText("Members list");
    expect(within(list).getByText("Sarah Connor")).toBeTruthy();
    expect(within(list).queryByText("John Doe")).toBeNull();
  });
});

