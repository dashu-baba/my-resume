import { SectionTitle } from "@/components/ui/SectionTitle";
import { BulletList } from "@/components/ui/BulletList";
import styles from "./Experience.module.css";
import type { FilteredResume } from "@/lib/filter";

export function Experience({
  data,
  label = "Professional Experience",
  showTechStack = true,
}: {
  data: FilteredResume["experience"];
  label?: string;
  showTechStack?: boolean;
}) {
  if (data.length === 0) return null;
  return (
    <section>
      <SectionTitle>{label}</SectionTitle>
      <div className={styles.list}>
        {data.map((e) => (
          <article key={`${e.company}-${e.period}`} className={`${styles.entry} break-avoid`}>
            <div className={styles.entryHead}>
              <div className={styles.company}>
                {e.company}
                {e.location ? ` — ${e.location}` : ""}
              </div>
              <div className={styles.meta}>
                <span className={styles.role}>{e.role}</span>
                <span>{e.period}</span>
              </div>
            </div>
            {e.summary && <p className={styles.summary}>{e.summary}</p>}
            <BulletList items={e.bullets.map((b) => b.text)} />
            {showTechStack && e.techStack && e.techStack.length > 0 && (
              <>
                <div className={styles.techHeader}>Tech Stack</div>
                {e.techStack.map((g, i) => (
                  <div key={i} className={styles.techGroup}>
                    {g.items.join(", ")}
                  </div>
                ))}
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
