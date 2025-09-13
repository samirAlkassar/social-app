import {Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useThemeContext } from "@/app/context/useTheme";

const ThemeButton = () => {
    const {toggleDarkMode, theme} = useThemeContext();

    const toggleTheme = () => {
        toggleDarkMode();
    }
    
    return (
        <button
          onClick={toggleTheme}
          className="p-1.5 cursor-pointer md:p-2.5 rounded-xl bg-secondary hover:bg-secondary-hover transition-all duration-200 text-text hover:text-text">
          {theme === "dark" 
          ? <Moon size={18} className="fill-current text-zinc-500"/> 
          : <Sun size={18} className="fill-current text-amber-600"/>}
        </button>
    )
}

export default ThemeButton;