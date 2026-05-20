import { describe, it, expect } from "vitest";
import { filterResumeForRole } from "@/lib/filter";
import { ROLES } from "@/lib/registry";
import { loadResume } from "@/lib/resume";

describe("filterResumeForRole · real data", () => {
  const resume = loadResume();

  for (const role of ROLES) {
    it(`produces a non-empty resume for /${role}`, () => {
      const filtered = filterResumeForRole(resume, role);
      expect(filtered.meta.name).toBeTruthy();
      expect(filtered.overview.length).toBeGreaterThan(20);
      expect(filtered.experience.length).toBeGreaterThan(0);
    });
  }
});
