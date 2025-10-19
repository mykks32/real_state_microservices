import { useEffect } from "react";
import useAuthStore from "@/stores/useAuthStore";

const useAuthInitialization = () => {
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        initialize().catch((err) => {
            console.error("Auth initialization failed:", err);
        });
    }, [initialize]);
};

export default useAuthInitialization;
