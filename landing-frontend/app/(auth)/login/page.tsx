"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/stores/useAuthStore";
import Footer from "@/components/common/Footer";

// Schema using Zod
const loginSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuthStore();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const loginMutation = useMutation({
        mutationFn: async (data: LoginFormValues) => {
            await login(data.email, data.password);
        },
        onSuccess: () => {
            toast.success("Login successful!");
            setTimeout(() => router.push("/dashboard"), 500);
        },
        onError: (err: any) => {
            const msg = err?.message || err?.response?.data?.message || "Invalid credentials";
            setError(msg);
            toast.error(msg);
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        setError(null);
        loginMutation.mutate(data);
    };

    return (
        <div className="relative min-h-screen w-screen flex items-center justify-center overflow-hidden">


            {/* Optional: Decorative Blob or Overlay */}
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-none"></div>

            {/* Login Form */}
            <div className="relative z-10 w-full max-w-md space-y-6 bg-blue-900/10 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-white">Sign In</h1>
                    <p className="text-sm text-blue-200/70">
                        New here?{" "}
                        <a href="/register" className="text-brown-400 hover:text-blue-300 font-medium">
                            Create account
                        </a>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label className="text-white/80">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-violet-500/50 pointer-events-none"/>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                disabled={loginMutation.isLoading}
                                className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/40"
                                {...form.register("email")}
                            />
                        </div>
                        {form.formState.errors.email && (
                            <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label className="text-white/80">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-violet-500/50 pointer-events-none"/>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                disabled={loginMutation.isLoading}
                                className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/40"
                                {...form.register("password")}
                            />
                        </div>
                        {form.formState.errors.password && (
                            <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3">
                            <p className="text-xs text-red-400 text-center">{error}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={loginMutation.isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-3"
                    >
                        {loginMutation.isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/80 border-t-white rounded-full animate-spin"/>
                                Signing in...
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
                <p className="text-xs text-center text-white/80">
                    By signing in, you agree to our Terms & Conditions
                </p>
            </div>
        </div>
    );
}