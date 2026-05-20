import styles from "./Minimal.module.css";
import { Header } from "../sections/Header";
import { Overview } from "../sections/Overview";
import { Competencies } from "../sections/Competencies";
import { Experience } from "../sections/Experience";
import { Projects } from "../sections/Projects";
import { Education } from "../sections/Education";
import type { FilteredResume } from "@/lib/filter";

export function Minimal({ data }: { data: FilteredResume }) {
  return (
    <article className={styles.page}>
      <div className={styles.banner}>
        <div className={styles.bigName}>{data.meta.name}</div>
        <div className={styles.rule} />
        <Header data={{ ...data.meta, name: "" }} />
      </div>
      <Overview text={data.overview} label="Overview" />
      <Competencies data={data.competencies} variant="rows" label="Competencies" />
      <Experience data={data.experience} label="Experience" showTechStack={false} />
      <Projects data={data.projects} />
      <Education data={data.education} />
    </article>
  );
}
