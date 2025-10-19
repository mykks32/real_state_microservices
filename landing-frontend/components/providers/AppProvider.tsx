"use client";

import React, {ReactNode, useMemo} from "react";
import {QueryClient, QueryClientProvider} from "react-query";
import {toast} from "sonner";
import useAuthInitialization from "@/hooks/useAuthIntialization";

interface AppProviderProps {
    children: ReactNode;
}

export default function AppProvider({children}: { children: ReactNode }) {
    // Initialize authentication
    useAuthInitialization();


    // Memoize QueryClient to avoid unnecessary re-renders
    const queryClient = useMemo(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        retry: false,
                    },
                    mutations: {
                        onError: (error: any) => {
                            const errorMessage =
                                error?.response?.data?.error ||
                                error?.response?.data?.message ||
                                "Uh oh! Something went wrong.";

                            toast.error(errorMessage);
                        },
                    },
                },
            }),
        [toast]
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}