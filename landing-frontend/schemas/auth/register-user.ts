import {z} from 'zod';
import {Role} from "@/enums";

const EmailString = z.string().pipe(
    z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email address" })
);

const CreateRoles = [Role.BUYER, Role.SELLER] as const;
const CreateRolesSchema = z.enum(CreateRoles);

export const RegisterUserSchema = z.object({
    email: EmailString,
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    roles: z.array(CreateRolesSchema).nonempty("At least one role is required"),
});

export const RegisterFormSchema = RegisterUserSchema.extend({
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
});

export type RegisterUserType = z.infer<typeof RegisterUserSchema>;
export type RegisterFormType = z.infer<typeof RegisterFormSchema>;



