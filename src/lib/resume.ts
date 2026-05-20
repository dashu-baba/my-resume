import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ResumeSchema, type Resume } from "./schema";

let cached: Resume | null = null;

export function loadResume(): Resume {
  if (cached) return cached;
  const file = readFileSync(join(process.cwd(), "data", "resume.json"), "utf8");
  const parsed = ResumeSchema.parse(JSON.parse(file));
  cached = parsed;
  return parsed;
}
