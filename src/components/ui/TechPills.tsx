import styles from "./ui.module.css";

type Props = { items: string[]; variant?: "light" | "dark" };

export function TechPills({ items, variant = "light" }: Props) {
  if (items.length === 0) return null;
  return (
    <div className={styles.pillRow}>
      {items.map((item) => (
        <span key={item} className={`${styles.pill} ${variant === "dark" ? styles.pillDark : ""}`}>
          {item}
        </span>
      ))}
    </div>
  );
}
