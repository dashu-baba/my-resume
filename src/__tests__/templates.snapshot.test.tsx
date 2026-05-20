import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ROLES, TEMPLATES } from "@/lib/registry";
import { loadResume } from "@/lib/resume";
import { filterResumeForRole } from "@/lib/filter";
import { ResumeShell } from "@/components/resume/ResumeShell";

describe("templates × roles snapshots", () => {
  const resume = loadResume();
  for (const role of ROLES) {
    for (const template of TEMPLATES) {
      it(`${role} / ${template} renders stable HTML`, () => {
        const filtered = filterResumeForRole(resume, role);
        const { container } = render(<ResumeShell template={template} data={filtered} />);
        expect(container.innerHTML).toMatchSnapshot();
      });
    }
  }
});
