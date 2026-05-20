import { Classic } from "./Classic";
import { Modern } from "./Modern";
import { Minimal } from "./Minimal";
import type { Template } from "@/lib/registry";
import type { FilteredResume } from "@/lib/filter";

export const templates: Record<Template, (props: { data: FilteredResume }) => JSX.Element> = {
  classic: Classic,
  modern: Modern,
  minimal: Minimal,
};
