import { SectionTitle } from "@/components/ui/SectionTitle";
import styles from "./Overview.module.css";

export function Overview({ text, label = "Professional Overview" }: { text: string; label?: string }) {
  return (
    <section>
      <SectionTitle>{label}</SectionTitle>
      <p className={styles.body}>{text}</p>
    </section>
  );
}
