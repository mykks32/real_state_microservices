"use client";

import useAuthStore from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

const Dashboard: React.FC = () => {
    const user = useAuthStore(state => state.user);
    const loading = useAuthStore(state => state.loading); // make sure your store has a loading flag
    const logout = useAuthStore(state => state.logout);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

    if (loading || !user) {
        // Show loader while user data is being fetched
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen gap-4">
            <Button onClick={handleLogout}>Logout</Button>
            <h1>Welcome, {user.username}</h1>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    );
};

export default Dashboard;