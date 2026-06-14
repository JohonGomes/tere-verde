import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface SectionDividerProps {
  fromColor: string;
  toColor: string;
  height?: string;
}

export function SectionDivider({ fromColor, toColor, height = "h-12" }: SectionDividerProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes recommends checking mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-full ${height}`}
        style={{
          background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`
        }}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  const getDarkColor = (color: string) => {
    const c = color.trim().toLowerCase();
    
    // Forest green primary color (with opacity)
    if (c.includes("47") && c.includes("92") && c.includes("74")) {
      return "rgb(20 42 34 / 0.95)";
    }

    // Map light colors to corresponding dark mode slate/zinc values
    if (c === "#ffffff") return "#09090b"; // zinc-950
    if (c === "#e8ebe9") return "#0f1110";
    if (c === "#e8f2ef") return "#0f1211";
    if (c === "#f5f1ed") return "#12110f";
    if (c === "#edf2f3") return "#101213";
    
    // If it's a light transparent value
    if (c.includes("244") && c.includes("246") && c.includes("245")) {
      return "rgba(9, 9, 11, 0.5)";
    }

    return color;
  };

  const finalFrom = isDark ? getDarkColor(fromColor) : fromColor;
  const finalTo = isDark ? getDarkColor(toColor) : toColor;

  return (
    <div
      className={`w-full ${height}`}
      style={{
        background: `linear-gradient(to bottom, ${finalFrom}, ${finalTo})`
      }}
    />
  );
}
