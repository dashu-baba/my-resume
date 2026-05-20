import styles from "./Modern.module.css";
import { Header } from "../sections/Header";
import { Overview } from "../sections/Overview";
import { Competencies } from "../sections/Competencies";
import { Experience } from "../sections/Experience";
import { Projects } from "../sections/Projects";
import { Education } from "../sections/Education";
import type { FilteredResume } from "@/lib/filter";

export function Modern({ data }: { data: FilteredResume }) {
  return (
    <article className={styles.page}>
      <aside className={styles.sidebar}>
        <Header data={data.meta} variant="compact" />
        <Competencies data={data.competencies} variant="pills" pillTheme="dark" />
        <Education data={data.education} />
      </aside>
      <main className={styles.main}>
        <Overview text={data.overview} />
        <Experience data={data.experience} showTechStack={false} />
        <Projects data={data.projects} />
      </main>
    </article>
  );
}
