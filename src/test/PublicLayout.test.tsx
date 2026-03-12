import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";

describe("PublicLayout", () => {
  it("sets document title and description meta", () => {
    render(
      <MemoryRouter initialEntries={["/public"]}>
        <Routes>
          <Route
            path="/public"
            element={
              <PublicLayout seo={{ title: "Test Title", description: "Test Description" }}>
                <div>Content</div>
              </PublicLayout>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(document.title).toBe("Test Title");
    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute("content")).toBe("Test Description");
  });

  it("renders a mobile bottom navigation with accessible links", () => {
    render(
      <MemoryRouter initialEntries={["/public"]}>
        <Routes>
          <Route
            path="/public"
            element={
              <PublicLayout seo={{ title: "Test", description: "Desc" }}>
                <div>Content</div>
              </PublicLayout>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    const nav = screen.getByLabelText("Primary mobile");
    expect(nav).toBeTruthy();
    expect(screen.getByLabelText("Home")).toBeTruthy();
    expect(screen.getByLabelText("Matches")).toBeTruthy();
    expect(screen.getByLabelText("Standings")).toBeTruthy();
    expect(screen.getByLabelText("Teams")).toBeTruthy();
    expect(screen.getByLabelText("More")).toBeTruthy();
  });
});
