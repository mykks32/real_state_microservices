import { z } from "zod";

// Base schema
export const BaseSchema = z.object({
    createdAt: z.string().min(1, "createdAt is required"),
    updatedAt: z.string().min(1, "updatedAt is required"),
});

export type IBase = z.infer<typeof BaseSchema>;