"use client";

import { useTheme } from "@/app/hooks/useTheme";
import { motion } from "framer-motion";
import Image from "next/image";

export default function FestivalDecorations() {
    const theme = useTheme();

    if (!theme || theme.name === "Tech") return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
            {/* Pongal Decorations - Sugarcane and Pots on sides */}
            {theme.name === "Pongal" && (
                <>
                    {/* Left Side - Sugarcane */}
                    <motion.div
                        className="absolute left-0 bottom-0 w-32 h-96 opacity-30"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 0.3 }}
                        transition={{ duration: 1 }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1587411768941-6dc7f0e3b0c2?w=400&q=80"
                            alt="Sugarcane"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </motion.div>

                    {/* Right Side - Pongal Pot */}
                    <motion.div
                        className="absolute right-0 bottom-0 w-40 h-64 opacity-30"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 0.3 }}
                        transition={{ duration: 1 }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&q=80"
                            alt="Pongal Pot"
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </motion.div>
                </>
            )}

            {/* Holi Decorations - Color splashes on sides */}
            {theme.name === "Holi" && (
                <>
                    {/* Left Side */}
                    <motion.div
                        className="absolute left-0 top-1/4 w-48 h-48 opacity-25"
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1583241800698-2d3d3d0c6b0d?w=400&q=80"
                            alt="Holi Colors"
                            fill
                            className="object-cover rounded-full blur-sm"
                            unoptimized
                        />
                    </motion.div>

                    {/* Right Side */}
                    <motion.div
                        className="absolute right-0 top-1/3 w-48 h-48 opacity-25"
                        animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1583241800698-2d3d3d0c6b0d?w=400&q=80"
                            alt="Holi Colors"
                            fill
                            className="object-cover rounded-full blur-sm"
                            unoptimized
                        />
                    </motion.div>
                </>
            )}

            {/* Independence Day - Flags on sides */}
            {theme.name === "Independence Day" && (
                <>
                    {/* Left Side Flag */}
                    <motion.div
                        className="absolute left-4 top-20 w-32 h-48 opacity-25"
                        animate={{ rotate: [-2, 2, -2] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1597426890881-e6f6e8e6e2e3?w=400&q=80"
                            alt="Indian Flag"
                            fill
                            className="object-cover rounded"
                            unoptimized
                        />
                    </motion.div>

                    {/* Right Side Flag */}
                    <motion.div
                        className="absolute right-4 top-20 w-32 h-48 opacity-25"
                        animate={{ rotate: [2, -2, 2] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1597426890881-e6f6e8e6e2e3?w=400&q=80"
                            alt="Indian Flag"
                            fill
                            className="object-cover rounded"
                            unoptimized
                        />
                    </motion.div>
                </>
            )}

            {/* Ganesh Chaturthi - Lotus on sides */}
            {theme.name === "Ganesh Chaturthi" && (
                <>
                    {/* Left Side */}
                    <motion.div
                        className="absolute left-0 bottom-10 w-40 h-40 opacity-25"
                        animate={{ y: [-10, 10, -10], rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1508766206392-8bd5cf550d1c?w=400&q=80"
                            alt="Lotus"
                            fill
                            className="object-cover rounded-full"
                            unoptimized
                        />
                    </motion.div>

                    {/* Right Side */}
                    <motion.div
                        className="absolute right-0 bottom-10 w-40 h-40 opacity-25"
                        animate={{ y: [-10, 10, -10], rotate: [360, 0] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1508766206392-8bd5cf550d1c?w=400&q=80"
                            alt="Lotus"
                            fill
                            className="object-cover rounded-full"
                            unoptimized
                        />
                    </motion.div>
                </>
            )}

            {/* Navratri - Garba patterns on sides */}
            {theme.name === "Navratri" && (
                <>
                    {/* Left Side */}
                    <motion.div
                        className="absolute left-0 top-1/3 w-40 h-40 opacity-20"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80"
                            alt="Garba"
                            fill
                            className="object-cover rounded-full"
                            unoptimized
                        />
                    </motion.div>

                    {/* Right Side */}
                    <motion.div
                        className="absolute right-0 top-1/3 w-40 h-40 opacity-20"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80"
                            alt="Garba"
                            fill
                            className="object-cover rounded-full"
                            unoptimized
                        />
                    </motion.div>
                </>
            )}

            {/* Diwali - Diyas on sides */}
            {theme.name === "Diwali" && (
                <>
                    {/* Left Side - Stack of Diyas */}
                    <div className="absolute left-0 bottom-0 flex flex-col gap-4 p-4">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={`diya-left-${i}`}
                                className="w-16 h-16 opacity-30"
                                animate={{
                                    opacity: [0.25, 0.35, 0.25],
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                }}
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1605811625530-d3a3a5e3b3e3?w=400&q=80"
                                    alt="Diya"
                                    fill
                                    className="object-cover rounded-full"
                                    unoptimized
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Side - Stack of Diyas */}
                    <div className="absolute right-0 bottom-0 flex flex-col gap-4 p-4">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={`diya-right-${i}`}
                                className="w-16 h-16 opacity-30"
                                animate={{
                                    opacity: [0.25, 0.35, 0.25],
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                }}
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1605811625530-d3a3a5e3b3e3?w=400&q=80"
                                    alt="Diya"
                                    fill
                                    className="object-cover rounded-full"
                                    unoptimized
                                />
                            </motion.div>
                        ))}
                    </div>
                </>
            )}

            {/* Children's Day - Balloons on sides */}
            {theme.name === "Children's Day" && (
                <>
                    {/* Left Side */}
                    <motion.div
                        className="absolute left-4 bottom-20 w-24 h-32 opacity-40"
                        animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80"
                            alt="Balloon"
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </motion.div>

                    {/* Right Side */}
                    <motion.div
                        className="absolute right-4 bottom-20 w-24 h-32 opacity-40"
                        animate={{ y: [-10, 10, -10], x: [5, -5, 5] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80"
                            alt="Balloon"
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </motion.div>
                </>
            )}

            {/* Christmas - Snow/Trees on sides */}
            {theme.name === "Christmas" && (
                <>
                    {/* Left Side */}
                    <motion.div
                        className="absolute left-0 bottom-0 w-48 h-64 opacity-25"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 0.25 }}
                        transition={{ duration: 1 }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=400&q=80"
                            alt="Christmas"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </motion.div>

                    {/* Right Side */}
                    <motion.div
                        className="absolute right-0 bottom-0 w-48 h-64 opacity-25"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 0.25 }}
                        transition={{ duration: 1 }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=400&q=80"
                            alt="Christmas"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </motion.div>
                </>
            )}
        </div>
    );
}
