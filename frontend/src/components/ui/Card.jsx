import React from "react";
import styles from "../../utils/styles";

export default function Card({ children, className = "", noPadding = false, ...props }) {
  return (
    <div className={`${styles.card} ${noPadding ? "" : "p-5"} ${className}`} {...props}>
      {children}
    </div>
  );
}
