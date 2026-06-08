import React from "react";
import { useAuth } from "../context/AuthProvider";
import { LogOut, User } from "lucide-react";
import styles from "../utils/styles";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className={`${styles.card} max-w-xl p-6 md:p-8 space-y-6`}>
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-5">
        <div className="h-14 w-14 rounded-full bg-zinc-800 flex items-center justify-center text-white font-black text-xl shadow-md uppercase">
          {user?.name ? user.name[0] : <User />}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            {user?.name || "Developer Profile"}
          </h2>
          <p className="text-xs text-zinc-500">System Identity Verified</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <span className={styles.label}>Account User Name</span>
          <p className="bg-[#0d0d0e] border border-zinc-800/80 p-3 rounded-lg text-sm text-zinc-200 font-medium">
            {user?.name || "-"}
          </p>
        </div>
        <div>
          <span className={styles.label}>Registered Developer Email</span>
          <p className="bg-[#0d0d0e] border border-zinc-800/80 p-3 rounded-lg text-sm text-zinc-200 font-mono">
            {user?.email || "-"}
          </p>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={logout}
          className={`${styles.button.danger} w-full sm:w-auto`}
          type="button"
        >
          <LogOut size={15} /> Terminate System Session
        </button>
      </div>
    </div>
  );
};

export default Profile;
