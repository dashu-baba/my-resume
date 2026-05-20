"use client";

import styles from "./chrome.module.css";

export function PrintButton() {
  return (
    <button type="button" className={styles.printBtn} onClick={() => window.print()}>
      Print / Save as PDF
    </button>
  );
}
