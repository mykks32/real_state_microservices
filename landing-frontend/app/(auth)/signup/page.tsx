"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import { Mail, User, Lock, EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthService from "@/services/auth/auth-service";
import {RegisterFormSchema, RegisterFormType, RegisterUserType} from "@/schemas/auth/register-user";
import {Role, TypeEnum} from "@/enums";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const defaultFormValues: RegisterFormType = {
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
    roles: [Role.BUYER],
};

export default function SignUpPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<RegisterFormType>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: defaultFormValues,
    });

    const registerMutation = useMutation({
        mutationFn: async (data: RegisterFormType) => {
            // Only send backend fields
            const payload: RegisterUserType = {
                email: data.email,
                username: data.username,
                password: data.password,
                roles: data.roles,
            };
            await AuthService.register(payload);
        },
        onSuccess: () => {
            setTimeout(() => router.replace("/login"), 500);
        },
        onError: (err: any) => {
            const msg =
                err?.message || err?.response?.data?.message || "Registration failed";
            setError(msg);
        },
    });

    const onSubmit = (data: RegisterFormType) => {
        console.log("form data", form.watch())
        setError(null);
        registerMutation.mutate(data);
    };

    return (
        <div className="h-full w-screen flex items-center justify-center overflow-hidden">
            <div className="space-y-4 w-xs md:min-w-md bg-slate-900/20 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">Create Account</h1>
                    <p className="text-sm text-blue-200/70">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                            Sign In
                        </a>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-1">
                        <Label className="text-white/80">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-violet-500/50 pointer-events-none" />
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

                    <div className="flex flex-row gap-4 w-full items-center">
                        {/* Username — takes remaining space */}
                        <div className="flex-1 space-y-1">
                            <Label className="text-white/80">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-violet-500/50 pointer-events-none" />
                                <Input
                                    type="text"
                                    placeholder="Username"
                                    disabled={registerMutation.isLoading}
                                    className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/40 w-full"
                                    {...form.register("username")}
                                />
                            </div>
                            {form.formState.errors.username && (
                                <p className="text-xs text-red-400">{form.formState.errors.username.message}</p>
                            )}
                        </div>

                        {/* Role Selection */}
                        <div className="w-40 space-y-1">
                            <Label className="text-white/80">Role</Label>
                            <Select
                                disabled={registerMutation.isLoading}
                                value={form.watch("roles")[0]} // Get the first role from array
                                onValueChange={(value) => form.setValue("roles", [value as Role.SELLER | Role.BUYER])}
                            >
                                <SelectTrigger className="bg-white/5 border-white/20 text-white w-full">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={Role.BUYER}>{Role.BUYER}</SelectItem>
                                    <SelectItem value={Role.SELLER}>{Role.SELLER}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* Password */}
                    <div className="space-y-1">
                        <Label className="text-white/80">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-violet-500/50 pointer-events-none" />
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                disabled={registerMutation.isLoading}
                                className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder-white/40"
                                {...form.register("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-3 text-violet-400/70 hover:text-violet-300 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {form.formState.errors.password && (
                            <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password (frontend only) */}
                    <div className="space-y-1">
                        <Label className="text-white/80">Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-violet-500/50 pointer-events-none" />
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                disabled={registerMutation.isLoading}
                                className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder-white/40"
                                {...form.register("password_confirmation")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-3 top-3 text-violet-400/70 hover:text-violet-300 focus:outline-none"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {form.formState.errors.password_confirmation && (
                            <p className="text-xs text-red-400">{form.formState.errors.password_confirmation.message}</p>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3">
                            <p className="text-xs text-red-400 text-center">{error}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={registerMutation.isLoading}
                        className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3"
                    >
                        {registerMutation.isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/80 border-t-white rounded-full animate-spin" />
                                Creating account...
                            </div>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}