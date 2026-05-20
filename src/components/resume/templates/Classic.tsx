import styles from "./Classic.module.css";
import { Header } from "../sections/Header";
import { Overview } from "../sections/Overview";
import { Competencies } from "../sections/Competencies";
import { Experience } from "../sections/Experience";
import { Projects } from "../sections/Projects";
import { Education } from "../sections/Education";
import type { FilteredResume } from "@/lib/filter";

export function Classic({ data }: { data: FilteredResume }) {
  return (
    <article className={styles.page}>
      <div className={styles.headerWrap}>
        <Header data={data.meta} />
      </div>
      <Overview text={data.overview} />
      <Competencies data={data.competencies} variant="rows" />
      <Experience data={data.experience} />
      <Projects data={data.projects} />
      <Education data={data.education} />
    </article>
  );
}
