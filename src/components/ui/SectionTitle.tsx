import styles from "./ui.module.css";

type Props = { children: React.ReactNode; accent?: boolean };

export function SectionTitle({ children, accent = false }: Props) {
  return (
    <h2 className={`${styles.sectionTitle} ${accent ? styles.sectionTitleAccent : ""}`}>
      {children}
    </h2>
  );
}
