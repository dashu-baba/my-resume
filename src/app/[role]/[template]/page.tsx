import { notFound } from "next/navigation";
import { ROLES, TEMPLATES, ROLE_LABELS } from "@/lib/registry";
import type { Role, Template } from "@/lib/registry";
import { loadResume } from "@/lib/resume";
import { filterResumeForRole } from "@/lib/filter";
import { ResumeShell } from "@/components/resume/ResumeShell";
import { TopBar } from "@/components/chrome/TopBar";

type Params = { role: string; template: string };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  return ROLES.flatMap((role) => TEMPLATES.map((template) => ({ role, template })));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { role, template } = params;
  const r = role as Role;
  if (!ROLES.includes(r)) return {};
  const resume = loadResume();
  const filtered = filterResumeForRole(resume, r);
  return {
    title: `${ROLE_LABELS[r]} — ${resume.meta.name}`,
    description: filtered.overview.slice(0, 160),
    alternates: { canonical: `/${role}/${template}/` },
  };
}

export default async function RoleTemplatePage({ params }: { params: Params }) {
  const { role, template } = params;
  const r = role as Role;
  const t = template as Template;
  if (!ROLES.includes(r) || !TEMPLATES.includes(t)) notFound();

  const filtered = filterResumeForRole(loadResume(), r);
  return (
    <>
      <TopBar role={r} template={t} />
      <ResumeShell template={t} data={filtered} />
    </>
  );
}
