"use client";
import styles from "./page.module.css";
import * as icons from "next-icons";

export default function Home() {
  return (
    <div className={styles.page}>
      {Object.keys(icons).map((icon) => {
        const Component = icons[icon as keyof typeof icons];
        return <Component key={icon} />;
      })}
    </div>
  );
}
