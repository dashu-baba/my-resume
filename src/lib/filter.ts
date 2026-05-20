import type { Resume, Role } from "./types";

export interface FilteredResume {
  meta: {
    name: string;
    title: string;
    contact: Resume["meta"]["contact"];
  };
  overview: string;
  competencies: { category: string; items: string[] }[];
  experience: {
    company: string;
    location?: string;
    role: string;
    period: string;
    summary?: string;
    bullets: { text: string }[];
    techStack?: { items: string[] }[];
  }[];
  projects: { name: string; description: string; url?: string }[];
  education: Resume["education"];
}

const matches = (roles: readonly Role[] | undefined, current: Role) =>
  roles === undefined || roles.includes(current);

export function filterResumeForRole(resume: Resume, role: Role): FilteredResume {
  const title = resume.meta.titles.byRole?.[role] ?? resume.meta.titles.default;
  const overview = resume.overview.byRole?.[role] ?? resume.overview.default;

  const competencies = resume.competencies
    .filter((c) => matches(c.roles, role))
    .map(({ category, items }) => ({ category, items }));

  const experience = resume.experience
    .map((e) => {
      const bullets = e.bullets.filter((b) => matches(b.roles, role)).map(({ text }) => ({ text }));
      const techStack = e.techStack
        ?.filter((g) => matches(g.roles, role))
        .map(({ items }) => ({ items }));
      return {
        company: e.company,
        location: e.location,
        role: e.role,
        period: e.period,
        summary: e.summary,
        bullets,
        techStack: techStack && techStack.length > 0 ? techStack : undefined,
      };
    })
    .filter((e) => e.bullets.length > 0 || !!e.summary);

  const projects = resume.projects
    .filter((p) => matches(p.roles, role))
    .map(({ name, description, url }) => ({ name, description, url }));

  return {
    meta: { name: resume.meta.name, title, contact: resume.meta.contact },
    overview,
    competencies,
    experience,
    projects,
    education: resume.education,
  };
}
