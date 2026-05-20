import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ResumeSchema } from "../src/lib/schema";

const file = readFileSync(join(process.cwd(), "data", "resume.json"), "utf8");
const result = ResumeSchema.safeParse(JSON.parse(file));

if (!result.success) {
  console.error("resume.json failed validation:");
  for (const issue of result.error.issues) {
    console.error(`  • ${issue.path.join(".") || "(root)"}: ${issue.message}`);
  }
  process.exit(1);
}

console.log("✓ resume.json passes schema validation");
