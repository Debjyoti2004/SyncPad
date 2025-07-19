"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const Hero = () => {
    const router = useRouter();

    return (
        <div className="w-full h-screen flex flex-col items-center justify-start relative text-white px-4 sm:px-6">
            <motion.div
                className="absolute w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] rounded-full filter blur-3xl opacity-30"
                animate={{
                    x: ["-25%", "25%", "-25%"],
                    y: ["-25%", "25%", "-25%"],
                    backgroundColor: ["#06b6d4", "#8b5cf6", "#06b6d4"],
                }}
                transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
                style={{ top: "-20%", left: "-10%" }}
            />
            <motion.div
                className="absolute w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full filter blur-3xl opacity-30"
                animate={{
                    x: ["25%", "-25%", "25%"],
                    y: ["25%", "-25%", "25%"],
                    backgroundColor: ["#3b82f6", "#10b981", "#3b82f6"],
                }}
                transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
                style={{ bottom: "-10%", right: "-5%" }}
            />
            <motion.div
                className="absolute w-[450px] sm:w-[550px] h-[450px] sm:h-[550px] rounded-full filter blur-3xl opacity-30"
                animate={{
                    x: ["-15%", "15%", "-15%"],
                    y: ["10%", "-10%", "10%"],
                    backgroundColor: ["#f472b6", "#fbbf24", "#f472b6"],
                }}
                transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
                style={{ top: "40%", left: "60%" }}
            />

            <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mt-32 text-center relative z-20 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-400 to-gray-100 animate-gradient"
            >
                Ideate. Collaborate. Share.
            </motion.h1>

            <p className="mt-4 max-w-xl sm:max-w-2xl text-center text-gray-300 text-base sm:text-lg relative z-20">
                A dynamic tool designed for collaborative ideation and drawing on a shared canvas, enabling real-time interaction and creativity among users.
            </p>

            <button
                onClick={() => router.push("/room/create")}
                className="mt-8 px-5 sm:px-6 py-3 rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold flex items-center gap-2 transition-all shadow-lg z-20"
            >
                Get Started
                <ArrowRight className="w-5 h-5" />
            </button>

            <div className="w-full sm:w-5/6 md:w-4/6 bg-black h-60 sm:h-[50vh] md:h-3/4 absolute -bottom-[35%] sm:-bottom-[30%] rounded-xl overflow-hidden z-10 shadow-2xl border border-gray-800">
                <video width="100%" height="100%" autoPlay loop muted>
                    <source src="/Demo-vid.mp4" type="video/mp4" />
                </video>
            </div>
        </div>
    );
};
