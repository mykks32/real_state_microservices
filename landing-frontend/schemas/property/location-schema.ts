import { z } from "zod";
import { StateEnum as StateEnumTS } from "@/enums/state.enum";
import { BaseSchema } from "@/schemas/common/base-schema";

// Convert enum
const StateEnum = z.enum(Object.values(StateEnumTS) as [string, ...string[]]);

// Location schema for create request (no id, timestamps)
export const CreateLocationSchema = z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: StateEnum,
    country: z.string().min(1, "Country is required"),
    zipcode: z.number().int().nonnegative(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

// Location schema for full entity (includes BaseSchema)
export const LocationSchema = CreateLocationSchema.extend({
    ...BaseSchema.shape,
    id: z.number(),
});

export type ILocationCreate = z.infer<typeof CreateLocationSchema>;
export type ILocation = z.infer<typeof LocationSchema>;