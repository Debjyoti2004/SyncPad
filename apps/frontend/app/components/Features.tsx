import { Squares } from "../components/ui/squares-background"
import { PenTool, Share2, Users, Layers, Zap, Lock } from "lucide-react"

const features = [
  {
    icon: <PenTool className="h-8 w-8 mb-2" />,
    title: "Intuitive Drawing Tools",
    description: "Easy-to-use pens, shapes, and text tools for quick sketches and diagrams.",
  },
  {
    icon: <Share2 className="h-8 w-8 mb-2" />,
    title: "Real-time Collaboration",
    description: "Work together with your team in real-time, no matter where they are.",
  },
  {
    icon: <Users className="h-8 w-8 mb-2" />,
    title: "Multi-User Editing",
    description: "Multiple users can edit the same drawing simultaneously.",
  },
  {
    icon: <Layers className="h-8 w-8 mb-2" />,
    title: "Infinite Canvas",
    description: "Unlimited space to bring your ideas to life, with easy navigation.",
  },
  {
    icon: <Zap className="h-8 w-8 mb-2" />,
    title: "Lightning Fast",
    description: "Optimized for speed and responsiveness, even with complex drawings.",
  },
  {
    icon: <Lock className="h-8 w-8 mb-2" />,
    title: "Secure and Private",
    description: "Your drawings are encrypted and stored securely.",
  },
]

export function Features() {
  return (
    <div className="relative h-[140vh] py-16 overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <Squares squareSize={40} borderColor="#333" hoverFillColor="#222" />
      </div>
      <div className="relative z-10 container mx-auto translate-y-[100%] px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Powerful Features for Your Creativity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        </div>
      </div>
    </div>
  )
}

