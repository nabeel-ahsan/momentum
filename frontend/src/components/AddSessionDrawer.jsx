import React from "react";
import { X } from "lucide-react";
import styles from "../utils/styles";
import AddSessions from "../pages/AddSessions";

export default function AddSessionDrawer({ isOpen, setOpen, onAddSuccess }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-lg h-full bg-[#0d0d0e] border-l border-zinc-800 p-6 md:p-8 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200">
        <header className="flex items-center justify-between border-b border-zinc-800 pb-5 mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Add Focus Session
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={`${styles.button.ghost} text-zinc-500`}
          >
            <X size={22} />
          </button>
        </header>

        <AddSessions
          onCloseDrawer={() => setOpen(false)}
          onAddSuccess={onAddSuccess}
        />
      </div>
    </div>
  );
}
