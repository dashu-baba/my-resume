import { templates } from "./templates";
import type { Template } from "@/lib/registry";
import type { FilteredResume } from "@/lib/filter";

export function ResumeShell({ template, data }: { template: Template; data: FilteredResume }) {
  const Component = templates[template];
  return <Component data={data} />;
}
