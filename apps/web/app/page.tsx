"use client";
import { Delete } from "next-icons";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Delete />
    </div>
  );
}
