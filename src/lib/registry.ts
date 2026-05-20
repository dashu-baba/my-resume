export const ROLES = [
  "architect",
  "fullstack",
  "backend",
  "frontend",
  "dotnet",
  "js",
  "golang",
] as const;

export const TEMPLATES = ["classic", "modern", "minimal"] as const;

export const DEFAULT_TEMPLATE = "classic" as const;

export type Role = (typeof ROLES)[number];
export type Template = (typeof TEMPLATES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  architect: "Solution Architect",
  fullstack: "Senior Full-Stack Engineer",
  backend: "Backend / Platform Engineer",
  frontend: "Frontend Engineer",
  dotnet: ".NET Engineer",
  js: "JavaScript / TypeScript Engineer",
  golang: "Go Engineer",
};

export const TEMPLATE_LABELS: Record<Template, string> = {
  classic: "Classic",
  modern: "Modern",
  minimal: "Minimal",
};
