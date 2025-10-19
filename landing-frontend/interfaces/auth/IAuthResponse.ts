import { IUser } from "./IUser";

export interface ILoginResponse {
    accessToken: string;
    user?: Omit<IUser, 'password'>;
}

export interface IRegisterResponse {
    user: Omit<IUser, 'password'>;
}

export interface IMeResponse {
    user: Omit<IUser, 'password'>;
    accessToken: string | null;
}