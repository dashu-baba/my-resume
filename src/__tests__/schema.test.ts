import { describe, it, expect } from "vitest";
import { ResumeSchema } from "@/lib/schema";

const minimal = {
  meta: {
    name: "Test",
    titles: { default: "Engineer" },
    contact: { phone: "+1", email: "t@example.com", location: "Earth", links: [] },
  },
  overview: { default: "Overview." },
};

describe("ResumeSchema", () => {
  it("accepts minimal resume", () => {
    const r = ResumeSchema.parse(minimal);
    expect(r.meta.name).toBe("Test");
  });

  it("rejects unknown role in tag list", () => {
    const bad = {
      ...minimal,
      competencies: [{ category: "X", items: ["y"], roles: ["nope"] }],
    };
    expect(() => ResumeSchema.parse(bad)).toThrow();
  });

  it("rejects invalid email", () => {
    const bad = {
      ...minimal,
      meta: { ...minimal.meta, contact: { ...minimal.meta.contact, email: "not-an-email" } },
    };
    expect(() => ResumeSchema.parse(bad)).toThrow();
  });

  it("accepts byRole override map", () => {
    const r = ResumeSchema.parse({
      ...minimal,
      overview: { default: "Default.", byRole: { architect: "Architect text." } },
    });
    expect(r.overview.byRole?.architect).toBe("Architect text.");
  });
});
