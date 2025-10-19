import {create} from "zustand";
import AuthService from "@/services/auth-service";
import {IUser} from "@/interfaces/auth/IUser";
import {devtools} from "zustand/middleware";

interface AuthState {
    user: Omit<IUser, 'password'> | null;
    accessToken: string | null;
    loading: boolean;
    initialize: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(devtools((set) => ({
    user: null,
    accessToken: null,
    loading: true,

    initialize: async () => {
        set({loading: true});
        try {
            const data = await AuthService.me(); // fetch current user using cookie
            set({user: data.user, accessToken: data.accessToken});
        } catch {
            set({user: null, accessToken: null});
        } finally {
            set({loading: false});
        }
    }
    ,

    login: async (email, password) => {
        set({loading: true});
        try {
            const data = await AuthService.login({email, password});
            set({accessToken: data.accessToken, user: data.user ?? null});
        } finally {
            set({loading: false});
        }
    },

    logout:
        async () => {
            set({loading: true});
            try {
                await AuthService.logout();
                set({user: null, accessToken: null});
            } finally {
                set({loading: false});
            }
        },
})));

export default useAuthStore;