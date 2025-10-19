"use client";

import React, { useState } from "react";
import { Mail, Lock, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const validateForm = () => {
        if (!email || !username || !password) {
            toast.error("Please fill in all fields");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Email must be valid");
            return false;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }

        if (username.length < 3) {
            toast.error("Username must be at least 3 characters");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // API call to register user
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message || "Registration failed");
                setLoading(false);
                return;
            }

            const data = await response.json();
            setSubmitted(true);
            setLoading(false);
            toast.success("Account created successfully!");

            // Reset form
            setTimeout(() => {
                setEmail("");
                setUsername("");
                setPassword("");
                setSubmitted(false);
                // Redirect to login or dashboard
                // window.location.href = "/login";
            }, 2000);
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6 bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-white">Create Account</h1>
                    <p className="text-sm text-blue-200/70">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                            Sign In
                        </a>
                    </p>
                </div>

                {/* Success Message */}
                {submitted && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-center">
                        <p className="text-green-300 text-sm font-medium flex items-center justify-center gap-2">
                            <CheckCircle className="h-4 w-4" /> Account created successfully!
                        </p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label className="text-white/80">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-400/50 pointer-events-none" />
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="user@example.com"
                                disabled={loading}
                                className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/40"
                            />
                        </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                        <Label className="text-white/80">Username</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-blue-400/50 pointer-events-none" />
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="srikriydv"
                                disabled={loading}
                                className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/40"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label className="text-white/80">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-400/50 pointer-events-none" />
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                disabled={loading}
                                className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/40"
                            />
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-2 text-sm">
                        <input type="checkbox" className="w-4 h-4 rounded accent-blue-500 mt-1" required />
                        <label className="text-white/60">
                            I agree to the{" "}
                            <a href="#" className="text-blue-400 hover:text-blue-300">
                                Terms & Conditions
                            </a>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading || submitted}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating Account...
                            </div>
                        ) : submitted ? (
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                Account Created
                            </div>
                        ) : (
                            "Create Account"
                        )}
                    </Button>
                </form>

                {/* Footer */}
                <p className="text-xs text-center text-white/40">
                    Your data is secure and encrypted
                </p>
            </div>
        </div>
    );
}