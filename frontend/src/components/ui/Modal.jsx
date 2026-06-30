import React, { useEffect } from "react";
import { X } from "lucide-react";
import Button from "./Button";
import Card from "./Card";

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg",
  ...props
}) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Dimmed Overlay Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal Dialog Card */}
      <Card
        noPadding
        className={`relative w-full ${maxWidth} bg-[#0d0d0e] border border-zinc-800 p-6 md:p-8 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh] z-10 animate-in zoom-in-95 duration-200`}
        {...props}
      >
        {/* Header bar */}
        <header className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-zinc-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1"
          >
            <X size={20} />
          </Button>
        </header>

        {/* Modal body */}
        <div className="flex-1">{children}</div>
      </Card>
    </div>
  );
}
