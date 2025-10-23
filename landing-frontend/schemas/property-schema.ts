import { z } from "zod";

// Enums matching your actual TypeScript enums
export const TypeEnum = z.enum(["House", "Land"]);
export const StatusEnum = z.enum(["Available", "Sold", "Rented"]);
export const ApprovalStatusEnum = z.enum([
    "draft",
    "pending_approval",
    "approved",
    "rejected",
    "archived",
]);
export const StateEnum = z.enum([
    "Koshi",
    "Madhesh",
    "Bagmati",
    "Gandaki",
    "Lumbini",
    "Karnali",
    "Sudurpashchim",
]);

// Base schema as string timestamps
export const BaseSchema = z.object({
    createdAt: z.string().min(1, "createdAt is required"),
    updatedAt: z.string().min(1, "updatedAt is required"),
});

// Location schema
export const LocationSchema = BaseSchema.extend({
    id: z.number().int().positive(),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: StateEnum,
    country: z.string().min(1, "Country is required"),
    zipcode: z.number().int().nonnegative(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

// Property schema
export const PropertySchema = BaseSchema.extend({
    id: z.string(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    type: TypeEnum,
    status: StatusEnum,
    approvalStatus: ApprovalStatusEnum,
    ownerId: z.string().optional(),
    location: LocationSchema,
});

// Types
export type IBase = z.infer<typeof BaseSchema>;
export type ILocation = z.infer<typeof LocationSchema>;
export type IProperty = z.infer<typeof PropertySchema>;
