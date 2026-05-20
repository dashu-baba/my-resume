import type { FC } from "react";
import { Classic } from "./Classic";
import { Modern } from "./Modern";
import { Minimal } from "./Minimal";
import type { Template } from "@/lib/registry";
import type { FilteredResume } from "@/lib/filter";

export const templates: Record<Template, FC<{ data: FilteredResume }>> = {
  classic: Classic,
  modern: Modern,
  minimal: Minimal,
};
