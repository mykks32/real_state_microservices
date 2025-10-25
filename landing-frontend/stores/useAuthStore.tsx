import { create } from "zustand";
import { IUser } from "@/interfaces/auth/IUser";
import { devtools } from "zustand/middleware";
import authService from "@/services/auth/auth-service";
import { ILoginResponse, IMeResponse } from "@/interfaces/auth/IAuthResponse";

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
            accessToken: null,

            login: async (email: string, password: string) => {
                set({ loading: true });
                try {
                    const response = await authService.login({ email, password });

                    if (!response) {
                        throw new Error("No response received");
                    }

                    if (response.statusCode === 200 && response.data) {
                        const loginData = response.data as ILoginResponse;
                        set({
                            user: loginData.user,
                            accessToken: loginData.accessToken,
                            loading: false
                        });
                    } else {
                        console.error(response.message || "Login failed");
                    }
                } catch (error) {
                    set({ loading: false });
                    console.error(error);
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
                        accessToken: null,
                        loading: false
                    });
                }
            },

            initialize: async () => {
                set({ loading: true });
                try {
                    const response = await authService.me();

                    if (response && response.statusCode === 200 && response.data) {
                        const meData = response.data as IMeResponse;
                        set({
                            user: meData.user,
                            accessToken: meData.accessToken,
                            loading: false
                        });
                    } else {
                        set({
                            user: null,
                            accessToken: null,
                            loading: false
                        });
                    }
                } catch (error) {
                    console.error("Auth initialization error:", error);
                    set({
                        user: null,
                        accessToken: null,
                        loading: false
                    });
                }
            }
        }),
        {
            name: "auth-storage"
        }
    )
);

export default useAuthStore;