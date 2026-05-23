import React from "react";
import styles from "../utils/styles";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-screen bg-[#09090b] text-white font-sans overflow-x-hidden">
      
      <main className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-10"> 
          <div className="flex items-center gap-3 md:hidden"> 
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-black font-black text-sm">M</div> 
            <span className="text-xl font-bold tracking-tight">Momentum</span> 
          </div>
          {children}

        </div> 
      </main>
      <aside className="hidden md:block md:w-1/2 bg-[#0d0d0e] border-l border-zinc-800 relative overflow-hidden"> 
        <div className="absolute inset-0 opacity-10 mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/gradients/12.png')] bg-cover" /> 
        <div className="h-full w-full flex flex-col justify-center p-20 relative z-10 space-y-4"> 
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-black font-black text-2xl shadow-xl shadow-white/5">M</div>
            <span className="text-4xl font-extrabold tracking-tighter text-white">Momentum</span>
          </div>
          <h2 className="text-6xl font-black tracking-tighter text-white/95 leading-[0.95] max-w-lg"> 
            Visible trackable proof of consistency.
          </h2>
          <p className="text-lg text-zinc-500 max-w-sm pt-4"> 
            A minimalist tracker built for software developers to lock in focused effort, daily.
          </p>
        </div>
      </aside>

    </div>
  );
}