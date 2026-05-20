import styles from "./Header.module.css";
import type { FilteredResume } from "@/lib/filter";

type Variant = "default" | "compact";

export function Header({
  data,
  variant = "default",
}: {
  data: FilteredResume["meta"];
  variant?: Variant;
}) {
  const compact = variant === "compact";
  const { name, title, contact } = data;

  return (
    <header className={`${styles.header} ${compact ? styles.headerCompact : ""}`}>
      <div className={styles.left}>
        <h1 className={`${styles.name} ${compact ? styles.nameCompact : ""}`}>{name}</h1>
        <div className={`${styles.title} ${compact ? styles.titleCompact : ""}`}>{title}</div>
      </div>
      <div className={`${styles.contact} ${compact ? styles.contactCompact : ""}`}>
        <span className={styles.contactLine}>{contact.phone}</span>
        <span className={styles.contactLine}>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </span>
        <span className={styles.contactLine}>{contact.location}</span>
        {contact.links.length > 0 && (
          <span className={styles.contactLine}>
            {contact.links.map((l, i) => (
              <span key={l.url}>
                {i > 0 && <span className={styles.contactSep}>·</span>}
                <a href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              </span>
            ))}
          </span>
        )}
      </div>
    </header>
  );
}
