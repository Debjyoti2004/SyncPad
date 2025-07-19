import { ReactNode } from "react";

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex flex-col gap-4 transition-all hover:shadow-lg hover:scale-[1.015] hover:border-white/20">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white w-fit shadow-sm">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">{description}</p>
        </div>
    );
}
