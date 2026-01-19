"use client";

import { useTheme } from "@/app/hooks/useTheme";
import Image from "next/image";

export function GridBackground() {
    const theme = useTheme();

    // Festival background images mapping
    const festivalBackgrounds: Record<string, string> = {
        "Pongal": "/assets/festivals/pongal_kolam_1767586362272.png",
        "Holi": "/assets/festivals/holi_colors_1767586399391.png",
        "Independence Day": "/assets/festivals/indian_flag_1767586416588.png",
        "Diwali": "/assets/festivals/diya_lamp_1767586381922.png",
        "Children's Day": "/assets/festivals/balloon_colorful_1767586442164.png",
        "Christmas": "/assets/festivals/snowflake_christmas_1767586459617.png",
    };

    const backgroundImage = theme && festivalBackgrounds[theme.name];

    return (
        <>
            {/* Festival Background */}
            {backgroundImage ? (
                <div className="fixed inset-0 -z-10">
                    <Image
                        src={backgroundImage}
                        alt={`${theme.name} Background`}
                        fill
                        className="object-cover opacity-5"
                        priority
                    />
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/95 via-bg-dark/90 to-bg-dark/95" />
                </div>
            ) : (
                /* Default Tech Grid Background */
                <div className="fixed inset-0 -z-10">
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: "50px 50px",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-dark/50 to-bg-dark" />
                </div>
            )}
        </>
    );
}
