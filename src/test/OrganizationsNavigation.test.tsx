import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import OrganizationsPage from "@/pages/OrganizationsPage";
import OrganizationDetailPage from "@/pages/organizations/OrganizationDetailPage";

const renderApp = (initialEntry: string) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/organizations" element={<OrganizationsPage />} />
          <Route path="/organizations/:id" element={<OrganizationDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("Organizations navigation", () => {
  it("navigates from list row click to the correct organization detail", async () => {
    renderApp("/organizations");

    const row = await screen.findByLabelText("Open organization City Football Association");
    fireEvent.click(row);

    expect(await screen.findByText("Organization Detail")).toBeTruthy();
    const hits = await screen.findAllByText("City Football Association");
    expect(hits.length).toBeGreaterThan(0);
  });

  it("shows a not found state for invalid organization id", async () => {
    renderApp("/organizations/invalid-id");

    expect(await screen.findByLabelText("Organization not found")).toBeTruthy();
    expect(screen.getByText("Organization not found")).toBeTruthy();
  });
});
