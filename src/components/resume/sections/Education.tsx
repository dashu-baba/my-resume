import { SectionTitle } from "@/components/ui/SectionTitle";
import styles from "./Education.module.css";
import type { FilteredResume } from "@/lib/filter";

export function Education({
  data,
  label = "Education",
}: {
  data: FilteredResume["education"];
  label?: string;
}) {
  if (data.length === 0) return null;
  return (
    <section>
      <SectionTitle>{label}</SectionTitle>
      {data.map((e, i) => (
        <div key={i} className={styles.entry}>
          <div className={styles.degree}>{e.degree}</div>
          <div className={styles.line}>
            {e.institution} · {e.year}
          </div>
        </div>
      ))}
    </section>
  );
}
