"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateRoomSchema } from "@repo/common/types";
import { postWithAuthJSON } from "../../../../lib/api";
import { BACKEND_URL } from "../../../config";
import {
  Plus,
  Globe,
  Lock,
  Loader2,
  Sparkles,
} from "lucide-react";
import JoinRoomSection from "../join/page";
import OwnerRoomsSection from "../../owner/page";
import Button from "../../../components/ui/button";
import toast, { Toaster } from "react-hot-toast";

export default function CreateRoomPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const inputValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const parsed = CreateRoomSchema.safeParse(formData);
    if (!parsed.success) {
      toast.error(
        "Validation Error: " +
        Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")
      );
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found. Please sign in.");
      setLoading(false);
      return;
    }

    try {
      const res = await postWithAuthJSON(
        `${BACKEND_URL}/rooms`,
        parsed.data,
        token
      );

      localStorage.setItem("latestSlug", res.room.slug);
      toast.success("Room created successfully!");
      router.push(`/whiteboard/${res.room.slug}`);
    } catch (err: any) {
      toast.error(err.message || "Room creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-right" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_1200px_800px_at_50%_-20%,_rgba(59,130,246,0.08),_transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_80%_100%,_rgba(147,51,234,0.06),_transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_35%,_rgba(255,255,255,0.005)_50%,_transparent_65%)] bg-[length:40px_40px]"></div>

      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-blue-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Premium Workspace</span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
            Create Your Workspace
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Build collaborative spaces where ideas come to life through interactive whiteboards
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 transition-opacity duration-300"></div>
            <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-zinc-700/50 p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Create New Room</h2>
                  <p className="text-slate-400 text-sm">Start a new collaborative session</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Room Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter a memorable room name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-zinc-800/70 border border-zinc-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 hover:border-zinc-500/70"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Description <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe what this room will be used for..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-5 py-4 bg-zinc-800/70 border border-zinc-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none hover:border-zinc-500/70"
                  />
                </div>

                <div className="relative flex items-center justify-between p-5 bg-zinc-800/50 rounded-2xl border border-zinc-700/30">
                  <label htmlFor="isPublic" className="flex items-center gap-3 cursor-pointer">
                    {formData.isPublic ? (
                      <Globe className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-amber-400" />
                    )}
                    <div>
                      <span className="text-slate-100 font-semibold block">
                        {formData.isPublic ? "Public Room" : "Private Room"}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {formData.isPublic
                          ? "Anyone with the code can join"
                          : "Only invited members can join"}
                      </span>
                    </div>
                  </label>

                  <div className="ml-auto">
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="isPublic"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 relative" />
                    </label>
                  </div>
                </div>

                <Button
                  label={loading ? "Creating..." : "Create Room"}
                  onClick={handleSubmit}
                  loading={loading}
                  loadingIcon={Loader2}
                  icon={Plus}
                  variant="primary"
                  size="md"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <JoinRoomSection />
        </div>

        <div className="relative mb-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gradient-to-r from-transparent via-zinc-600/50 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="px-8 py-3 bg-gradient-to-r from-zinc-900 to-zinc-800 text-slate-200 rounded-full border border-zinc-600/50 shadow-lg">
              <span className="font-semibold">Your Rooms</span>
            </div>
          </div>
        </div>

        <OwnerRoomsSection />
      </div>
    </div>
  );
}
