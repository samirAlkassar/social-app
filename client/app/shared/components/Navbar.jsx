"use client"

import React, {useState, useEffect, useContext} from "react";
import deleteCookies from "@/app/actions/deleteCookies";
import getCookies from "@/app/actions/getCookies";
import Link from "next/link";
import { useUserContext } from "@/app/context/useUser"; 
import { Search, Sun, Moon, MessageCircle, Bell, ChevronDown, HelpCircle, LogOut, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const {user,setUser, loading} = useUserContext();
  const [darkMode, setDarkMode] = React.useState(false);



  const router = useRouter();

  const onLogout = () => {
    setUser(null);
    localStorage.clear();
    deleteCookies("token");
    router.push("/login"); // ✅ avoids full reload, keeps hydration smooth
  };

  return (
    <nav className="w-full flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-neutral-200/50 text-neutral-800 px-6 py-2 shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between mx-auto max-w-[100rem] w-full">
      {/* Left: Logo + Search */}
      <div className="flex items-center gap-6">
        <div className="text-xl font-semibold text-neutral-900 tracking-tight">⚡MyApp</div>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2.5 w-64 rounded-xl bg-neutral-50 border border-neutral-200/60 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Right: Buttons */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 text-neutral-600 hover:text-neutral-800"
        >
          {darkMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>

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
            <button className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 text-neutral-600 hover:text-neutral-800">
              <MessageCircle size={18} />
            </button>

            {/* Notifications */}
            <button className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 text-neutral-600 hover:text-neutral-800 relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Help */}
            <button className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 text-neutral-600 hover:text-neutral-800">
              <HelpCircle size={18} />
            </button>

            {/* User Info + Dropdown */}
            <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200/60 px-4 py-2.5 rounded-xl hover:bg-neutral-100 transition-all duration-200">
              <img
                src={user.picturePath ? user?.picturePath : "./avatar-profile-notfound.jpeg"}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border border-neutral-200/60 "
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-800 leading-tight">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs text-neutral-500">Online</span>
              </div>
              <button
                onClick={onLogout}
                className="ml-2 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-all duration-200 flex items-center gap-1.5 cursor-pointer text-xs font-medium"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </>
        )
      ) : (
        // Not logged in
        <div className="flex items-center gap-2">
          <a
            href="/login"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 transition-all duration-200 text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            <LogIn size={16} />
            Login
          </a>
          <a
            href="/register"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white transition-all duration-200 text-sm font-medium"
          >
            <UserPlus size={16} />
            Register
          </a>
        </div>
      )}

      </div>
      </div>
    </nav>
  );
};