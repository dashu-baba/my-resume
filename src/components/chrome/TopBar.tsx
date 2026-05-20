"use client";

import { useRouter } from "next/navigation";
import { ROLES, TEMPLATES, ROLE_LABELS, TEMPLATE_LABELS } from "@/lib/registry";
import type { Role, Template } from "@/lib/registry";
import { PrintButton } from "./PrintButton";
import styles from "./chrome.module.css";

export function TopBar({ role, template }: { role: Role; template: Template }) {
  const router = useRouter();

  return (
    <div className={`${styles.topbar} no-print`}>
      <span className={styles.label}>Role</span>
      <select
        className={styles.select}
        value={role}
        onChange={(e) => router.push(`/${e.target.value}/${template}/`)}
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>

      <span className={styles.label}>Template</span>
      <select
        className={styles.select}
        value={template}
        onChange={(e) => router.push(`/${role}/${e.target.value}/`)}
      >
        {TEMPLATES.map((t) => (
          <option key={t} value={t}>
            {TEMPLATE_LABELS[t]}
          </option>
        ))}
      </select>

      <span className={styles.spacer} />
      <PrintButton />
    </div>
  );
}
