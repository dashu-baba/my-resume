import { SectionTitle } from "@/components/ui/SectionTitle";
import { TechPills } from "@/components/ui/TechPills";
import styles from "./Competencies.module.css";
import type { FilteredResume } from "@/lib/filter";

type Variant = "rows" | "pills";

export function Competencies({
  data,
  variant = "rows",
  label = "Core Competencies",
  pillTheme = "light",
}: {
  data: FilteredResume["competencies"];
  variant?: Variant;
  label?: string;
  pillTheme?: "light" | "dark";
}) {
  if (data.length === 0) return null;
  return (
    <section>
      <SectionTitle>{label}</SectionTitle>
      <div className={styles.list}>
        {data.map((c) =>
          variant === "rows" ? (
            <div key={c.category} className={styles.row}>
              <b>{c.category}:</b>
              {c.items.join(", ")}
            </div>
          ) : (
            <div key={c.category} className={styles.row}>
              <b>{c.category}</b>
              <TechPills items={c.items} variant={pillTheme} />
            </div>
          ),
        )}
      </div>
    </section>
  );
}
