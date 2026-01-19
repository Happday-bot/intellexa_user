"use client";

import { useState, useEffect } from "react";
import { getCurrentFestivalTheme, FestivalTheme } from "@/app/config/themes";

export function useTheme() {
    const [theme, setTheme] = useState<FestivalTheme | null>(null);

    useEffect(() => {
        const currentTheme = getCurrentFestivalTheme();
        setTheme(currentTheme);

        // Apply CSS variables to root
        if (typeof document !== "undefined") {
            const root = document.documentElement;
            root.style.setProperty("--festival-primary", currentTheme.colors.primary);
            root.style.setProperty("--festival-secondary", currentTheme.colors.secondary);
            root.style.setProperty("--festival-accent", currentTheme.colors.accent);
            if (currentTheme.colors.background) {
                root.style.setProperty("--festival-background", currentTheme.colors.background);
            }
        }
    }, []);

    return theme;
}
