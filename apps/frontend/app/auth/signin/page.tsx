"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SigninSchema } from "@repo/common/types";
import { postJSON } from "../../../lib/api";
import Button from "../../components/ui/button";
import { BACKEND_URL } from "../../config";
import { Eye, EyeOff, Mail, Lock, LogIn, Sparkles } from "lucide-react";

export default function SigninPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    const parsed = SigninSchema.safeParse(formData);

    if (!parsed.success) {
      setError(
        "Invalid input: " +
          Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")
      );
      setLoading(false);
      return;
    }

    try {
      const res = await postJSON(`${BACKEND_URL}/signin`, parsed.data);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Sign in failed. Please check your credentials.");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_25%,_rgba(255,255,255,0.01)_50%,_transparent_75%)] bg-[length:60px_60px]"></div>
      
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">SyncPad</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Sign in to access your collaborative workspace
          </p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-600/30 shadow-2xl shadow-black/40 p-8 relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur opacity-30"></div>
          <div className="relative bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-600/20">
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2 tracking-wide">
                  <Mail className="w-4 h-4 text-purple-400" />
                  EMAIL ADDRESS
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    onKeyPress={handleKeyPress}
                    className={`w-full px-5 py-4 bg-slate-700/30 border-2 rounded-2xl text-white placeholder-slate-400 transition-all duration-300 ${
                      focusedField === "email"
                        ? "border-purple-500 shadow-lg shadow-purple-500/20 bg-slate-700/50"
                        : "border-slate-600/40 hover:border-slate-500/60 group-hover:bg-slate-700/40"
                    } focus:outline-none backdrop-blur-sm`}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2 tracking-wide">
                  <Lock className="w-4 h-4 text-purple-400" />
                  PASSWORD
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    onKeyPress={handleKeyPress}
                    className={`w-full px-5 py-4 pr-14 bg-slate-700/30 border-2 rounded-2xl text-white placeholder-slate-400 transition-all duration-300 ${
                      focusedField === "password"
                        ? "border-purple-500 shadow-lg shadow-purple-500/20 bg-slate-700/50"
                        : "border-slate-600/40 hover:border-slate-500/60 group-hover:bg-slate-700/40"
                    } focus:outline-none backdrop-blur-sm`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="pt-2">
                <Button
                  label="Sign In"
                  onClick={handleSubmit}
                  loading={loading}
                  loadingText="Signing In..."
                  icon={LogIn}
                  className="w-full"
                  disabled={!formData.email.trim() || !formData.password.trim()}
                />
              </div>
            </div>

            <div className="mt-8 text-center pt-6 border-t border-slate-600/30">
              <p className="text-slate-400 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => router.push("/auth/signup")}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline"
                >
                  Create Workspace
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto">
            Secure access to your collaborative whiteboard workspace.{" "}
            <a href="https://www.linkedin.com/in/debjyotishit/" className="text-purple-400 hover:text-purple-300 transition-colors hover:underline">
              Need help?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}