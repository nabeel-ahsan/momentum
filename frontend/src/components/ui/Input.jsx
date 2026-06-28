import React from "react";
import styles from "../../utils/styles";

export default function Input({ label, error, className = "", id, ...props }) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={`${styles.input} ${error ? "border-red-500/40 focus:border-red-500" : ""} ${className}`}
        {...props}
      />
      {error && (
        <span className="block text-xs text-red-400 font-semibold mt-1">
          {error}
        </span>
      )}
    </div>
  );
}
