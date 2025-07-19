"use client"

import { motion } from "framer-motion"
import Button from "../components/ui/button"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation";

export const Hero = () => {
    const route = useRouter()
    return (
        <div className="w-full h-[94vh] flex flex-col items-center justify-start relative">
            {/* Animated Blobs */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full filter blur-3xl opacity-40"
                animate={{
                    x: ["-25%", "25%", "-25%"],
                    y: ["-25%", "25%", "-25%"],
                    backgroundColor: ["#06b6d4", "#8b5cf6", "#06b6d4"], // Vibrant teal and purple
                }}
                transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 20,
                    ease: "easeInOut",
                }}
                style={{
                    top: "-20%",
                    left: "-10%",
                }}
            />
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full filter blur-3xl opacity-40"
                animate={{
                    x: ["25%", "-25%", "25%"],
                    y: ["25%", "-25%", "25%"],
                    backgroundColor: ["#3b82f6", "#10b981", "#3b82f6"], // Vibrant blue and green
                }}
                transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 25,
                    ease: "easeInOut",
                }}
                style={{
                    bottom: "-10%",
                    right: "-5%",
                }}
            />
            <motion.div
                className="absolute w-[550px] h-[550px] rounded-full filter blur-3xl opacity-40"
                animate={{
                    x: ["-15%", "15%", "-15%"],
                    y: ["10%", "-10%", "10%"],
                    backgroundColor: ["#f472b6", "#fbbf24", "#f472b6"], // Vibrant pink and yellow
                }}
                transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 22,
                    ease: "easeInOut",
                }}
                style={{
                    top: "40%",
                    left: "60%",
                }}
            />

            <motion.p
                className="text-5xl font-bold mt-28 relative z-20"
                animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                    duration: 5,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                }}
                style={{
                    backgroundSize: "200% auto",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundImage: "linear-gradient(to right, #1a1a1a, #4a4a4a, #7a7a7a, #4a4a4a, #1a1a1a)",
                }}
            >
                Ideate. Collaborate. Share.
            </motion.p>
            <p className="mt-4 w-2/4 text-center text-muted-foreground relative z-20">
                A dynamic tool designed for collaborative ideation and drawing on a shared canvas, enabling real-time
                interaction and creativity among users.
            </p>

            <Button
                label="Get Started"
                icon={ArrowRight}
                className="mt-8 flex gap-2 relative z-20"
                onClick={() => { 
                    route.push("/room/create")
                }}
            />

            <div className="w-4/6 bg-black h-3/4 absolute -bottom-[37%] rounded-xl overflow-hidden scale-110 z-30">
                <video width="100%" height="100%" autoPlay loop muted>
                    <source src="/Demo-vid.mp4" type="video/mp4" />
                </video>
            </div>
        </div>
    )
}

