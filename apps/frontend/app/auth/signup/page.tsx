"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postJSON } from "../../../lib/api";
import { CreateUserSchema } from "@repo/common/types";
import { BACKEND_URL } from "../../config";
import Button from "../../components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Mail, User, Image, Lock, ArrowRight, Sparkles } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    image: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    if (!formData.name.trim()) {
      setError("Name is required.");
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      name: formData.name.trim(),
      image: formData.image.trim() || undefined,
    };

    const parsed = CreateUserSchema.safeParse(payload);
    if (!parsed.success) {
      setError("Invalid input: " + Object.values(parsed.error.flatten().fieldErrors).flat().join(", "));
      setLoading(false);
      return;
    }

    try {
      const res = await postJSON(`${BACKEND_URL}/signup`, parsed.data);
      localStorage.setItem("token", res.token);
      localStorage.setItem("ownerId", res.user.id);
      toast.success("Signup successful!");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Account creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1426] flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Create Your Workspace on <span className="text-purple-400">SyncPad</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Build collaborative spaces where ideas come to life through interactive whiteboards
          </p>
        </div>

        <div className="bg-[#1A2332] rounded-2xl border border-gray-700/50 p-8 shadow-xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField("")}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-11 pr-4 py-3 bg-[#0F1419] border rounded-xl text-white placeholder-gray-500 transition-colors ${focusedField === "name"
                      ? "border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      : "border-gray-600 hover:border-gray-500"
                    }`}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-11 pr-4 py-3 bg-[#0F1419] border rounded-xl text-white placeholder-gray-500 transition-colors ${focusedField === "email"
                      ? "border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      : "border-gray-600 hover:border-gray-500"
                    }`}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-11 pr-12 py-3 bg-[#0F1419] border rounded-xl text-white placeholder-gray-500 transition-colors ${focusedField === "password"
                      ? "border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      : "border-gray-600 hover:border-gray-500"
                    }`}
                  placeholder="Create a secure password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="pt-2">
              <Button
                label="Create Workspace"
                onClick={handleSubmit}
                loading={loading}
                loadingText="Creating Your Workspace..."
                icon={ArrowRight}
                className="w-full"
                disabled={!formData.name.trim() || !formData.email.trim() || !formData.password.trim()}
              />
            </div>
          </div>

          <div className="mt-6 text-center pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Already have a workspace?{" "}
              <button
                onClick={() => router.push("/auth/signin")}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-xs leading-relaxed">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}