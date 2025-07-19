import { Squares } from "../components/ui/squares-background";
import { PenTool, Share2, Users, Layers, Zap, Lock } from "lucide-react";
import { FeatureCard } from "../components/ui/FeatureCard";

const features = [
    {
        icon: <PenTool className="h-6 w-6" />,
        title: "Intuitive Drawing Tools",
        description: "Easy-to-use pens, shapes, and text tools for quick sketches and diagrams.",
    },
    {
        icon: <Share2 className="h-6 w-6" />,
        title: "Real-time Collaboration",
        description: "Work together with your team in real-time, no matter where they are.",
    },
    {
        icon: <Users className="h-6 w-6" />,
        title: "Multi-User Editing",
        description: "Multiple users can edit the same drawing simultaneously.",
    },
    {
        icon: <Layers className="h-6 w-6" />,
        title: "Infinite Canvas",
        description: "Unlimited space to bring your ideas to life, with easy navigation.",
    },
    {
        icon: <Zap className="h-6 w-6" />,
        title: "Lightning Fast",
        description: "Optimized for speed and responsiveness, even with complex drawings.",
    },
    {
        icon: <Lock className="h-6 w-6" />,
        title: "Secure and Private",
        description: "Your drawings are encrypted and stored securely.",
    },
];

export function Features() {
    return (
        <div className="relative py-24 bg-[#0B0F1A] overflow-hidden">
            <div className="absolute inset-0 opacity-20">
                <Squares squareSize={40} borderColor="#333" hoverFillColor="#1c1c1c" />
            </div>

            <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-24 pt-96">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
                    Powerful Features for Your Creativity
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
