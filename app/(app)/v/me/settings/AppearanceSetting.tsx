"use client";

import Toggle from "@/components/global/Toggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import SettingItemText from "../../components/SettingItemText";

export default function AppearanceSetting() {
  const themeOptions = ["Light", "System", "Dark"];

  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  const handleChange = (newValue: string) => {
    setTheme(newValue.toLowerCase());
  };

  // If the useEffect runs, its means that the component is mounted
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-1">
      <p>Appearance</p>
      <div className="setting-item card rounded-md">
        <div className="card-body flex w-full flex-row items-center justify-between">
          <SettingItemText
            title="Theme"
            subtitle="Customize the appearance of the website"
          />

          <Toggle
            options={themeOptions}
            selected={theme === "light" ? 0 : theme === "dark" ? 2 : 1}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
