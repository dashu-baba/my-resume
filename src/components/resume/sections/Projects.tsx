import { SectionTitle } from "@/components/ui/SectionTitle";
import styles from "./Projects.module.css";
import type { FilteredResume } from "@/lib/filter";

export function Projects({
  data,
  label = "Projects",
}: {
  data: FilteredResume["projects"];
  label?: string;
}) {
  if (data.length === 0) return null;
  return (
    <section>
      <SectionTitle>{label}</SectionTitle>
      {data.map((p) => (
        <div key={p.name} className={`${styles.entry} break-avoid`}>
          <div>
            <span className={styles.name}>{p.name}</span>
            {p.url && (
              <a className={styles.url} href={p.url} target="_blank" rel="noopener noreferrer">
                ↗
              </a>
            )}
          </div>
          <p className={styles.desc}>{p.description}</p>
        </div>
      ))}
    </section>
  );
}
