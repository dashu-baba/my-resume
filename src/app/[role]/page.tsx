import { notFound } from "next/navigation";
import { ROLES, ROLE_LABELS, DEFAULT_TEMPLATE } from "@/lib/registry";
import type { Role } from "@/lib/registry";
import { loadResume } from "@/lib/resume";
import { filterResumeForRole } from "@/lib/filter";
import { ResumeShell } from "@/components/resume/ResumeShell";
import { TopBar } from "@/components/chrome/TopBar";

type Params = { role: string };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  return ROLES.map((role) => ({ role }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { role } = await params;
  const r = role as Role;
  if (!ROLES.includes(r)) return {};
  const resume = loadResume();
  const filtered = filterResumeForRole(resume, r);
  return {
    title: `${ROLE_LABELS[r]} — ${resume.meta.name}`,
    description: filtered.overview.slice(0, 160),
    alternates: { canonical: `/${role}/${DEFAULT_TEMPLATE}/` },
  };
}

export default async function RoleDefaultPage({ params }: { params: Promise<Params> }) {
  const { role } = await params;
  const r = role as Role;
  if (!ROLES.includes(r)) notFound();
  const filtered = filterResumeForRole(loadResume(), r);
  return (
    <>
      <TopBar role={r} template={DEFAULT_TEMPLATE} />
      <ResumeShell template={DEFAULT_TEMPLATE} data={filtered} />
    </>
  );
}
