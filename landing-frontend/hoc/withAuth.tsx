import {ComponentType, useEffect} from "react";
import {useRouter} from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import Loading from "@/components/common/loading";

const withAuth = (WrappedComponent: ComponentType<any>) => {
    return (props: any) => {
        const user = useAuthStore((state) => state.user);
        const loading = useAuthStore((state) => state.loading);
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.push("/auth/login");
            }
        }, [loading, user, router]);

        if (loading) {
            return <Loading message="Loading Login"/>;
        }

        if (!user) {
            return <Loading message="Loading Login"/>;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;