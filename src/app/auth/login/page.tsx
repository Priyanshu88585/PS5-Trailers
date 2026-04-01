"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Chrome, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        toast.success("Welcome back!");
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-ps5-void flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-blue-glow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ps5-blue/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-ps5-blue rounded-2xl flex items-center justify-center shadow-ps5-blue">
              <span className="text-white font-display font-black text-xl">P5</span>
            </div>
            <span className="font-display font-bold text-xl text-white">PS5 Trailers</span>
          </Link>
        </div>

        <div className="bg-ps5-surface border border-ps5-border rounded-2xl p-8 shadow-2xl">
          <h1 className="font-display font-bold text-2xl text-white mb-1">Sign in</h1>
          <p className="text-ps5-text-secondary text-sm mb-6">Access your PS5 Trailers account</p>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all duration-200 mb-5 disabled:opacity-70"
          >
            <Chrome size={18} className="text-blue-600" />
            Continue with Google
          </button>

          <div className="relative flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-ps5-border" />
            <span className="text-ps5-text-muted text-xs font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-ps5-border" />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-ps5-danger/10 border border-ps5-danger/30 rounded-xl mb-4">
              <AlertCircle size={16} className="text-ps5-danger flex-shrink-0" />
              <p className="text-ps5-danger text-sm">{error}</p>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
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
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-ps5-text-secondary">Password</label>
                <button type="button" className="text-ps5-blue text-sm hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ps5-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
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
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-ps5-blue hover:bg-ps5-blue-light text-white font-bold rounded-xl transition-all shadow-ps5-blue-sm disabled:opacity-60 mt-2"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
              Sign In
            </button>
          </form>

          <p className="text-center text-ps5-text-secondary text-sm mt-5">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-ps5-blue font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>

        <p className="text-center text-ps5-text-muted text-xs mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
