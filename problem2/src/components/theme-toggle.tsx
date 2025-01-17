import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch.tsx";

export function ThemeToggle() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(document.documentElement.classList.contains("dark"));
  }, []);

  const handleCheck = (checked: boolean) => {
    setChecked(checked);

    document.documentElement.classList.toggle("dark", checked);
    localStorage.setItem("theme", checked ? "dark" : "light");

    document.documentElement.classList.add("disable-transition");
    setTimeout(() => {
      document.documentElement.classList.remove("disable-transition");
    }, 1);
  };

  return (
    <div className="fixed right-6 top-4 flex items-center gap-3">
      <label htmlFor="theme-toggle" className="sr-only">
        Toggle Theme
      </label>
      <SunIcon size={16} />
      <Switch
        checked={checked}
        onCheckedChange={handleCheck}
        id="theme-toggle"
      />
      <MoonIcon size={16} />
    </div>
  );
}
