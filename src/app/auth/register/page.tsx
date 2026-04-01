"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Chrome, Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(password);
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      // Auto sign in after registration
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) throw new Error("Auto login failed");

      toast.success("Account created! Welcome aboard!");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ps5-void flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-glow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ps5-blue/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-ps5-blue rounded-2xl flex items-center justify-center shadow-ps5-blue">
              <span className="text-white font-display font-black text-xl">P5</span>
            </div>
            <span className="font-display font-bold text-xl text-white">PS5 Trailers</span>
          </Link>
        </div>

        <div className="bg-ps5-surface border border-ps5-border rounded-2xl p-8 shadow-2xl">
          <h1 className="font-display font-bold text-2xl text-white mb-1">Create account</h1>
          <p className="text-ps5-text-secondary text-sm mb-6">Join PS5 Trailers today</p>

          {/* Google */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all mb-5"
          >
            <Chrome size={18} className="text-blue-600" />
            Continue with Google
          </button>

          <div className="relative flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-ps5-border" />
            <span className="text-ps5-text-muted text-xs">or create with email</span>
            <div className="flex-1 h-px bg-ps5-border" />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-ps5-danger/10 border border-ps5-danger/30 rounded-xl mb-4">
              <AlertCircle size={16} className="text-ps5-danger flex-shrink-0" />
              <p className="text-ps5-danger text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ps5-text-secondary mb-2">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ps5-text-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  placeholder="Your name"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ps5-text-secondary mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ps5-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ps5-text-secondary mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ps5-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className="input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ps5-text-muted hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i < strength ? strengthColors[strength - 1] : "bg-ps5-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strength >= 3 ? "text-green-400" : strength >= 2 ? "text-yellow-400" : "text-red-400"}`}>
                    {password.length > 0 && strengthLabels[strength - 1]}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-ps5-blue hover:bg-ps5-blue-light text-white font-bold rounded-xl transition-all shadow-ps5-blue-sm disabled:opacity-60 mt-2"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
              Create Account
            </button>
          </form>

          <p className="text-center text-ps5-text-secondary text-sm mt-5">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-ps5-blue font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
