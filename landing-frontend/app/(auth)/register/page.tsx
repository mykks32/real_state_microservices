"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { Mail, User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/stores/useAuthStore";
import AuthService from "@/services/auth-service";

// Schema using Zod for registration
const registerSchema = z.object({
    email: z.string().email("Enter a valid email"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { email: "", username: "", password: "" },
    });

    const registerMutation = useMutation({
        mutationFn: async (data: RegisterFormValues) => {
            await AuthService.register(data);
        },
        onSuccess: () => {
            toast.success("Account created successfully!");
            setTimeout(() => router.push("/login"), 500);
        },
        onError: (err: any) => {
            const msg = err?.message || err?.response?.data?.message || "Registration failed";
            setError(msg);
            toast.error(msg);
        },
    });

    const onSubmit = (data: RegisterFormValues) => {
        setError(null);
        registerMutation.mutate(data);
    };

    return (
        <div className="h-full w-screen flex items-center justify-center overflow-hidden">

            {/* Registration Form */}
            <div className="w-full max-w-max md:max-w-md space-y-6 bg-slate-900/20 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-white">Create Account</h1>
                    <p className="text-sm text-blue-200/70">
                        Already have an account?{" "}
                        <a href="/login" className="text-brown-400 hover:text-blue-300 font-medium">
                            Sign In
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
                                disabled={registerMutation.isLoading}
                                className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/40"
                                {...form.register("email")}
                            />
                        </div>
                        {form.formState.errors.email && (
                            <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
                        )}
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                        <Label className="text-white/80">Username</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-violet-500/50 pointer-events-none"/>
                            <Input
                                type="text"
                                placeholder="Username"
                                disabled={registerMutation.isLoading}
                                className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/40"
                                {...form.register("username")}
                            />
                        </div>
                        {form.formState.errors.username && (
                            <p className="text-xs text-red-400">{form.formState.errors.username.message}</p>
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
                                disabled={registerMutation.isLoading}
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
                        disabled={registerMutation.isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-3"
                    >
                        {registerMutation.isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/80 border-t-white rounded-full animate-spin"/>
                                Creating account...
                            </div>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>
                </form>

                <p className="text-xs text-center text-white/80">
                    By creating an account, you agree to our Terms & Conditions
                </p>
            </div>
        </div>
    );
}