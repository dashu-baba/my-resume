import { loadResume } from "@/lib/resume";
import { RoleGrid } from "@/components/chrome/RoleGrid";

export default function Home() {
  const resume = loadResume();
  return (
    <main style={{ padding: "32px 16px", maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>{resume.meta.name}</h1>
      <p style={{ fontSize: 14, color: "var(--color-muted)", marginTop: 0 }}>
        {resume.meta.titles.default} · pick a variant below.
      </p>
      <RoleGrid />
    </main>
  );
}
