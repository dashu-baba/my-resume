import { describe, it, expect } from "vitest";
import { filterResumeForRole } from "@/lib/filter";
import type { Resume } from "@/lib/types";

const base: Resume = {
  meta: {
    name: "N",
    titles: { default: "Default Title", byRole: { architect: "Arch Title" } },
    contact: { phone: "+1", email: "a@b.com", location: "X", links: [] },
  },
  overview: { default: "Default overview.", byRole: { frontend: "Frontend overview." } },
  competencies: [
    { category: "Universal", items: ["a", "b"] },
    { category: "OnlyBackend", items: ["x"], roles: ["backend"] },
  ],
  experience: [
    {
      company: "CoA",
      role: "R",
      period: "2020",
      summary: "Worked.",
      bullets: [{ text: "Visible to all." }, { text: "Only for backend.", roles: ["backend"] }],
    },
    {
      company: "CoB",
      role: "R",
      period: "2019",
      bullets: [{ text: "Only for frontend.", roles: ["frontend"] }],
    },
  ],
  projects: [
    { name: "P1", description: "d" },
    { name: "P2", description: "d", roles: ["js"] },
  ],
  education: [{ degree: "BSc", institution: "U", year: "2013" }],
};

describe("filterResumeForRole", () => {
  it("returns the byRole title when present", () => {
    const r = filterResumeForRole(base, "architect");
    expect(r.meta.title).toBe("Arch Title");
  });

  it("falls back to default title when no byRole entry", () => {
    const r = filterResumeForRole(base, "backend");
    expect(r.meta.title).toBe("Default Title");
  });

  it("returns the byRole overview when present", () => {
    const r = filterResumeForRole(base, "frontend");
    expect(r.overview).toBe("Frontend overview.");
  });

  it("includes untagged competency categories", () => {
    const r = filterResumeForRole(base, "frontend");
    expect(r.competencies.map((c) => c.category)).toContain("Universal");
  });

  it("excludes tagged competency categories when role does not match", () => {
    const r = filterResumeForRole(base, "frontend");
    expect(r.competencies.map((c) => c.category)).not.toContain("OnlyBackend");
  });

  it("keeps tagged competency categories when role matches", () => {
    const r = filterResumeForRole(base, "backend");
    expect(r.competencies.map((c) => c.category)).toContain("OnlyBackend");
  });

  it("filters bullets within an experience entry", () => {
    const r = filterResumeForRole(base, "frontend");
    const coA = r.experience.find((e) => e.company === "CoA");
    expect(coA?.bullets.map((b) => b.text)).toEqual(["Visible to all."]);
  });

  it("keeps an experience entry with no surviving bullets if it has a summary", () => {
    const r = filterResumeForRole(base, "js");
    const coA = r.experience.find((e) => e.company === "CoA");
    expect(coA?.bullets).toEqual([{ text: "Visible to all." }]);
    expect(coA?.summary).toBe("Worked.");
  });

  it("drops experience entries with no surviving bullets and no summary", () => {
    const r = filterResumeForRole(base, "backend");
    const coB = r.experience.find((e) => e.company === "CoB");
    expect(coB).toBeUndefined();
  });

  it("includes untagged projects and excludes mismatched tagged ones", () => {
    const r = filterResumeForRole(base, "architect");
    expect(r.projects.map((p) => p.name).sort()).toEqual(["P1"]);
  });

  it("includes tagged projects when role matches", () => {
    const r = filterResumeForRole(base, "js");
    expect(r.projects.map((p) => p.name).sort()).toEqual(["P1", "P2"]);
  });
});
