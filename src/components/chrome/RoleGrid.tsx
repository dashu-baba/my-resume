import Link from "next/link";
import { ROLES, ROLE_LABELS, TEMPLATES } from "@/lib/registry";
import styles from "./chrome.module.css";

const ROLE_TAGLINES: Record<(typeof ROLES)[number], string> = {
  architect: "Architecture, distributed systems, leadership.",
  fullstack: "End-to-end product engineering across the stack.",
  backend: "APIs, services, data pipelines, infra.",
  frontend: "React, Remix, Angular, Astro, Web Components.",
  dotnet: "ASP.NET Core, Azure Functions, Cosmos DB, SQL Server.",
  js: "Node.js, React, Remix, Next.js, Astro, Lit.",
  golang: "Distributed-systems experience; open to Go-focused roles.",
};

export function RoleGrid() {
  return (
    <div className={styles.grid}>
      {ROLES.map((role) => (
        <div key={role} className={styles.card}>
          <Link href={`/${role}/`}>
            <div className={styles.cardTitle}>{ROLE_LABELS[role]}</div>
          </Link>
          <div className={styles.cardDesc}>{ROLE_TAGLINES[role]}</div>
          <div className={styles.cardLinks}>
            {TEMPLATES.map((t) => (
              <Link key={t} href={`/${role}/${t}/`}>
                {t}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
