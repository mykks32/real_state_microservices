"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import {Mail, Lock, EyeOff, Eye} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/stores/useAuthStore";

// Schema using Zod
const loginSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

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
            setTimeout(() => router.push("/dashboard"), 500);
        },
        onError: (err: any) => {
            const msg = err?.message || err?.response?.data?.message || "Invalid credentials";
            setError(msg);
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        setError(null);
        loginMutation.mutate(data);
    };

    return (
        <div className="flex-1 flex justify-center items-center px-4">

            {/* Login Form */}
            <div className="w-full max-w-md gap-2 flex flex-col backdrop-blur-lg p-6 rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-black">Sign In</h1>
                    <p className="text-sm text-black">
                        New here?{" "}
                        <a href="/signup" className="text-blue-500 hover:text-blue-300 font-medium">
                            Create account
                        </a>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label className="text-black">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-black pointer-events-none"/>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                disabled={loginMutation.isLoading}
                                className="pl-10 border-black text-black placeholder:text-black"
                                {...form.register("email")}
                            />
                        </div>
                        {form.formState.errors.email && (
                            <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label className="text-black">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-black pointer-events-none"/>
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                disabled={loginMutation.isLoading}
                                className="pl-10 border-black text-black placeholder:text-black"
                                {...form.register("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-3 text-black hover:text-violet-300 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
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
                                <div className="w-4 h-4 border-2 text-white rounded-full animate-spin"/>
                                Signing in...
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
                <p className="text-xs text-center text-black">
                    By signing in, you agree to our Terms & Conditions
                </p>
            </div>
        </div>
    );
}