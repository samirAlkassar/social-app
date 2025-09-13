"use client"
import React from "react";
import deleteCookies from "@/app/actions/deleteCookies";
import { useUserContext } from "@/app/context/useUser"; 
import { Search, MessageCircle, Bell, HelpCircle, LogOut, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import ThemeButton from "../ui/ThemeButton";

export const Navbar = () => {
  const {user,setUser, loading} = useUserContext();




  const router = useRouter();

  const onLogout = () => {
    setUser(null);
    localStorage.clear();
    deleteCookies("token");
    router.push("/login"); // ✅ avoids full reload, keeps hydration smooth
  };

  return (
    <nav className="w-full flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border/50 text-neutral-800 md:px-6 md:py-2 px-2 py-1 shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between mx-auto max-w-[100rem] w-full">
      {/* Left: Logo + Search */}
      <div className="flex items-center gap-6">
        <div className="text-md md:text-xl sm:text-lg font-semibold text-text tracking-tight">🌊 Mawja</div>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2.5 max-w-64 rounded-xl bg-secondary border border-border text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-text/20 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Right: Buttons */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}

      <ThemeButton />

      {loading?  
                // Skeleton state
          <div className="flex items-center gap-3 bg-neutral-50 px-4 py-2.5 rounded-xl animate-pulse border border-neutral-200/60">
            <div className="w-8 h-8 rounded-full bg-neutral-200"></div>
            <div className="flex flex-col gap-1.5">
              <div className="w-20 h-3 rounded bg-neutral-200"></div>
              <div className="w-14 h-2.5 rounded bg-neutral-200"></div>
            </div>
            <div className="w-16 h-8 rounded-lg bg-neutral-200"></div>
          </div>
           :user ? (
            (
          <>
            {/* Chat */}
            <div className="hidden lg:block">
            <button className="p-2.5 rounded-xl bg-secondary hover:bg-secondary-hover transition-all duration-200 text-text">
              <MessageCircle size={18} />
            </button>

            {/* Notifications */}
            <button className="p-2.5 rounded-xl bg-secondary hover:bg-secondary-hover transition-all duration-200 text-text relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red rounded-full border-2 border-border"></span>
            </button>

            {/* Help */}
            <button className="p-2.5 rounded-xl bg-secondary hover:bg-secondary-hover  transition-all duration-200 text-text">
              <HelpCircle size={18} />
            </button>
            </div>

            {/* User Info + Dropdown */}
            <div className="flex items-center gap-3 bg-card border border-border px-4 py-2.5 rounded-xl hover:bg-card-hover transition-all duration-200">
              <img
                src={user.picturePath ? user?.picturePath : "./avatar-profile-notfound.jpeg"}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border border-border "
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text leading-tight">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs text-text-muted">Online</span>
              </div>
              <button
                onClick={onLogout}
                className="ml-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary-hover text-text transition-all duration-200 flex items-center gap-1.5 cursor-pointer text-xs font-medium"
              >
                <LogOut size={14} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </>
        )
      ) : (
        // Not logged in
        <div className="flex items-center gap-2">
          <a
            href="/login"
            className="flex items-center gap-2 px-2 py-1 md:px-4 md:py-2.5 rounded-md md:rounded-xl border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 transition-all duration-200 text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            <LogIn size={16} className="hidden sm:block"/>
            Login
          </a>
          <a
            href="/register"
            className="flex items-center gap-2 px-2 py-1 md:px-4 md:py-2.5 rounded-md md:rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white transition-all duration-200 text-sm font-medium"
          >
            <UserPlus size={16}  className="hidden sm:block"/>
            Register
          </a>
        </div>
      )}

      </div>
      </div>
    </nav>
  );
};