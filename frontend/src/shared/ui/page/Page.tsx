import React, { ReactNode } from "react";
import styles from "./Page.module.css";

interface PageProps {
  children: ReactNode;
}

export const Page = ({ children }: PageProps) => {
  return <div className={styles.page}>{children}</div>;
};

interface PageHeaderProps {
  title?: ReactNode;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  centerTitle?: boolean;
}

export const PageHeader = ({
  title,
  leftContent,
  rightContent,
  centerTitle = false,
}: PageHeaderProps) => {
  return (
    <header className={styles.header}>
      {leftContent && <div className={styles.headerLeft}>{leftContent}</div>}
      {title && (
        <h1
          className={`${styles.headerTitle} ${centerTitle ? styles.headerTitleCenter : ""
            }`}
        >
          {title}
        </h1>
      )}
      {rightContent && <div className={styles.headerRight}>{rightContent}</div>}
    </header>
  );
};