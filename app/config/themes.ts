// Festival theme configuration
export interface FestivalTheme {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background?: string;
    };
    decorations: string[];
    animations: string;
    pattern: string;
}

export const festivalThemes: Record<string, FestivalTheme> = {
    pongal: {
        name: "Pongal",
        colors: {
            primary: "#FF6B35",
            secondary: "#F7931E",
            accent: "#FFC107",
            background: "#FFF8E1"
        },
        decorations: ["sugarcane", "pot", "kolam", "sun"],
        animations: "floating-flowers",
        pattern: "kolam"
    },
    holi: {
        name: "Holi",
        colors: {
            primary: "#FF1744",
            secondary: "#00E676",
            accent: "#FFEA00",
            background: "#FFF3E0"
        },
        decorations: ["colors", "water-balloon", "gulal"],
        animations: "color-splash",
        pattern: "paint-splatter"
    },
    independence: {
        name: "Independence Day",
        colors: {
            primary: "#FF9933",
            secondary: "#138808",
            accent: "#000080",
            background: "#FFFFFF"
        },
        decorations: ["flag", "chakra", "tricolor"],
        animations: "waving-flag",
        pattern: "tricolor-stripes"
    },
    ganesh: {
        name: "Ganesh Chaturthi",
        colors: {
            primary: "#DC143C",
            secondary: "#FFD700",
            accent: "#FF8C00"
        },
        decorations: ["ganesha", "modak", "lotus", "diya"],
        animations: "floating-lotus",
        pattern: "mandala"
    },
    navratri: {
        name: "Navratri",
        colors: {
            primary: "#6A0DAD",
            secondary: "#FFD700",
            accent: "#DC143C"
        },
        decorations: ["dandiya", "garba", "goddess"],
        animations: "spinning-garba",
        pattern: "garba-circle"
    },
    diwali: {
        name: "Diwali",
        colors: {
            primary: "#FF6F00",
            secondary: "#FFD600",
            accent: "#FF9100"
        },
        decorations: ["diya", "fireworks", "rangoli", "lantern"],
        animations: "sparkling-lights",
        pattern: "diya-pattern"
    },
    childrensDay: {
        name: "Children's Day",
        colors: {
            primary: "#FF6B9D",
            secondary: "#4FC3F7",
            accent: "#FFD54F"
        },
        decorations: ["balloon", "toy", "confetti", "star"],
        animations: "floating-balloons",
        pattern: "playful-shapes"
    },
    christmas: {
        name: "Christmas",
        colors: {
            primary: "#C41E3A",
            secondary: "#0F8644",
            accent: "#FFD700",
            background: "#F5F5F5"
        },
        decorations: ["tree", "snowflake", "bell", "gift", "star"],
        animations: "falling-snow",
        pattern: "snowflakes"
    },
    default: {
        name: "Tech",
        colors: {
            primary: "#6366F1",
            secondary: "#EC4899",
            accent: "#10B981"
        },
        decorations: ["code", "circuit", "tech"],
        animations: "matrix-rain",
        pattern: "grid"
    }
};

// Get festival theme based on current month
export function getCurrentFestivalTheme(): FestivalTheme {
    const month = new Date().getMonth() + 1; // 1-12
    const day = new Date().getDate();

    // January: Pongal (mid-month)
    if (month === 1) return festivalThemes.pongal;

    // March: Holi
    if (month === 3) return festivalThemes.holi;

    // August: Independence Day
    if (month === 8) return festivalThemes.independence;

    // September: Ganesh Chaturthi
    if (month === 9) return festivalThemes.ganesh;

    // October: Navratri/Dussehra
    if (month === 10) return festivalThemes.navratri;

    // November: Diwali (early) or Children's Day (14th)
    if (month === 11) {
        if (day >= 10 && day <= 20) return festivalThemes.diwali;
        return festivalThemes.childrensDay;
    }

    // December: Christmas
    if (month === 12) return festivalThemes.christmas;

    // Default tech theme
    return festivalThemes.default;
}
