"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application Error:", error);
    }, [error]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-bg-dark text-white p-4 text-center">
            <h2 className="text-2xl font-bold text-red-500">Something went wrong!</h2>
            <p className="text-dim max-w-md">{error.message || "An unexpected error occurred."}</p>
            <button
                onClick={() => reset()}
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/80 transition-colors font-bold"
            >
                Try again
            </button>
        </div>
    );
}
