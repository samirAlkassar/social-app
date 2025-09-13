import {Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useThemeContext } from "@/app/context/useTheme";

const ThemeButton = () => {
    const {toggleDarkMode, theme} = useThemeContext();
    const [darkMode, setDarkMode] = useState(false);

    const toggleTheme = () => {
        toggleDarkMode();
        if (theme === "dark") {
            setDarkMode(true);
        } else (setDarkMode(false))

    }
    return (
        <button
          onClick={toggleTheme}
          className="p-1.5 cursor-pointer md:p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 text-neutral-600 hover:text-neutral-800">
          {theme === "dark" 
          ? <Moon size={18} className="fill-current text-zinc-500"/> 
          : <Sun size={18} className="fill-current text-amber-600"/>}
        </button>
    )
}

export default ThemeButton;