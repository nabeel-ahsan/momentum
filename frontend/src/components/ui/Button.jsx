import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  iconBefore,
  iconAfter,
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 outline-none select-none disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-white text-black hover:bg-zinc-200 shadow-md shadow-white/5 active:scale-[0.98]",
    secondary:
      "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-[0.98]",
    outline:
      "bg-transparent border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900/50 active:scale-[0.98]",
    danger:
      "bg-zinc-900 border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 active:scale-[0.98]",
    ghost: "text-zinc-500 hover:text-white p-2 rounded-md hover:bg-zinc-900/40",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs rounded-md",
    md: "px-5 py-2.5 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      )}

      {!loading && iconBefore && (
        <span className="inline-flex shrink-0">{iconBefore}</span>
      )}

      <span>{children}</span>
      
      {!loading && iconAfter && (
        <span className="inline-flex shrink-0">{iconAfter}</span>
      )}
    </button>
  );
}
