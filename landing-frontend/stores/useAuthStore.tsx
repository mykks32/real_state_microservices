import { create } from "zustand";
import { IUser } from "@/interfaces/auth/IUser";
import { devtools } from "zustand/middleware";
import authService from "@/services/auth-service";
import { ILoginResponse } from "@/interfaces/auth/IAuthResponse";

interface AuthStore {
    user: Omit<IUser, "password"> | null;
    loading: boolean;
    accessToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    initialize: () => Promise<void>;
}

const useAuthStore = create<AuthStore>()(
    devtools(
        (set) => ({
            user: null,
            loading: true,
            accessToken: "",

            login: async (email: string, password: string) => {
                set({ loading: true });
                try {
                    const response: ILoginResponse = await authService.login({ email, password });
                    set({
                        accessToken: response.accessToken,
                        loading: false
                    });
                } catch (error) {
                    set({ loading: false });
                    throw error;
                }
            },

            logout: async () => {
                set({ loading: true });
                try {
                    await authService.logout();
                } catch (error) {
                    console.error("Logout error:", error);
                } finally {
                    set({
                        user: null,
                        accessToken: "",
                        loading: false
                    });
                }
            },

            initialize: async () => {
                set({ loading: true });
                try {
                    const response = await authService.me();
                    set({
                        user: response.user,
                        accessToken: response.accessToken,
                        loading: false
                    });
                } catch (error) {
                    console.error("Auth initialization error:", error);
                    set({
                        user: null,
                        accessToken: "",
                        loading: false
                    });
                }
            }
        })
    )
);

export default useAuthStore;