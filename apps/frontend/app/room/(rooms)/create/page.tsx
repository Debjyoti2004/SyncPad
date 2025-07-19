"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateRoomSchema } from "@repo/common/types";
import { postWithAuthJSON } from "../../../../lib/api";
import { BACKEND_URL } from "../../../config";
import { Plus, Globe, Lock, Loader2, AlertCircle } from "lucide-react";
import JoinRoomSection from "../join/page";
import OwnerRoomsSection from "../../owner/page";
import Button from "../../../components/ui/button";

export default function CreateRoomPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: true,
  });

  const [error, setError] = useState("");
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
    setError("");
    setLoading(true);

    const parsed = CreateRoomSchema.safeParse(formData);
    if (!parsed.success) {
      setError(
        "Validation Error: " +
          Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")
      );
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found. Please sign in.");
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
      router.push(`/whiteboard/${res.room.slug}`);
    } catch (err: any) {
      setError(err.message || "Room creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_25%,_rgba(255,255,255,0.01)_50%,_transparent_75%)] bg-[length:60px_60px]"></div>
      
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
            Create Your Workspace
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Build collaborative spaces where ideas come to life through interactive whiteboards
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Create New Room</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter a memorable room name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description <span className="text-slate-500">(optional)</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Describe what this room will be used for..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                <input
                  type="checkbox"
                  name="isPublic"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="isPublic" className="flex items-center gap-2 cursor-pointer">
                  {formData.isPublic ? (
                    <Globe className="w-5 h-5 text-green-400" />
                  ) : (
                    <Lock className="w-5 h-5 text-orange-400" />
                  )}
                  <span className="text-slate-200 font-medium">
                    {formData.isPublic ? "Public Room" : "Private Room"}
                  </span>
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.name.trim()}
                loading={loading}
                icon={Plus}
                loadingIcon={Loader2}
                loadingText="Creating Room..."
                label="Create Room"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              />
            </div>
          </div>

          <JoinRoomSection />
        </div>

        <div className="relative mb-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-6 py-2 bg-slate-800 text-slate-400 rounded-full border border-slate-700">
              Your Rooms
            </span>
          </div>
        </div>
        <OwnerRoomsSection />
      </div>
    </div>
  );
}
