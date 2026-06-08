const styles = { 
  input: "w-full bg-[#0d0d0e] border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 tracking-normal transition-all", 
  label: "block text-xs font-semibold tracking-wide uppercase text-zinc-500 mb-1.5", 
  button: { 
    primary: "flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-all shadow-md shadow-white/5 disabled:opacity-50", 
    secondary: "flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all", 
    danger: "flex items-center justify-center gap-2 bg-zinc-900 border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50",
    ghost: "flex items-center justify-center gap-2 text-zinc-500 hover:text-white text-sm font-medium p-2 rounded-md transition-all",
    icon: "text-zinc-500 hover:text-white p-1.5 rounded transition-all disabled:opacity-30 disabled:pointer-events-none"
  },
  card: "border border-zinc-800 bg-zinc-900/30 rounded-xl", 
  sidebarItem: "w-full flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-lg transition-all", 
};

export default styles;