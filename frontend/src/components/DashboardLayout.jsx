import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { LayoutDashboard, User, LogOut, Menu, Plus, X } from "lucide-react";
import styles from "../utils/styles";
import AddSessionDrawer from "./AddSessionDrawer";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  const [refreshSignal, setRefreshSignal] = useState(false);
  const triggerGridRefresh = () => setRefreshSignal((prev) => !prev);

  const getPageTitle = () => {
    if (location.pathname === "/profile") return "Profile Context";
    return "Performance Hub";
  };

  const menuItems = [
    { id: "/app", label: "Dashboard", icon: LayoutDashboard },
    { id: "/profile", label: "Profile", icon: User },
  ];

  const sidebarContent = (
    <aside className="w-full h-full flex flex-col justify-between p-6 bg-[#09090b]">
      <div className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center text-black font-black text-base">
              M
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Momentum
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-zinc-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                navigate(item.id);
                setIsSidebarOpen(false);
              }}
              className={`${styles.sidebarItem} ${location.pathname === item.id ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"}`}
            >
              <item.icon size={19} /> {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="border border-zinc-800 bg-[#0d0d0e] rounded-xl p-4 flex items-center gap-3 relative">
        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold uppercase">
          {user?.name ? user.name[0] : "D"}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-semibold text-white truncate">
            {user?.name || "Developer"}
          </p>
          <p className="text-xs text-zinc-500 truncate">
            {user?.email || "dev@momentum.io"}
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="text-zinc-500 hover:text-red-400 p-1 rounded-md transition-all"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen w-screen bg-[#09090b] text-zinc-100 font-sans overflow-hidden">
      <div className="hidden md:block w-72 h-full border-r border-zinc-800 fixed top-0 left-0 z-40">
        {sidebarContent}
      </div>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="relative w-80 h-full border-r border-zinc-800 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
      <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 md:p-10 md:ml-72 relative">
        <header className="flex md:hidden items-center justify-between border border-zinc-800 bg-[#0d0d0e] p-4 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="text-zinc-500 hover:text-white p-1 rounded-md"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded bg-white flex items-center justify-center text-black font-black text-xs">
              M
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              Momentum
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsAddDrawerOpen(true)}
            className="text-zinc-500 hover:text-white p-1 rounded-md"
          >
            <Plus size={18} />
          </button>
        </header>
        <section className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tighter text-white capitalize">
              {getPageTitle()}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Visible trackable proof of consistency.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddDrawerOpen(true)}
            className={`${styles.button.primary} hidden md:flex`}
          >
            <Plus size={16} /> Add Session
          </button>
        </section>
        <div className="flex-1 flex flex-col">
          <Outlet context={{ refreshSignal }} />
        </div>
      </main>
      <AddSessionDrawer
        isOpen={isAddDrawerOpen}
        setOpen={setIsAddDrawerOpen}
        onAddSuccess={triggerGridRefresh}
      />
    </div>
  );
}
