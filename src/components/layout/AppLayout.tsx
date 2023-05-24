import React, {ReactNode} from "react";
import {Layout} from "antd";
import styles from './app-layout.module.css';

export default function AppLayout({children}: {children: ReactNode}) {
  return (
    <Layout className={styles.outer}>
      <div className={styles.inner}>
        {children}
      </div>
    </Layout>
  )
}
