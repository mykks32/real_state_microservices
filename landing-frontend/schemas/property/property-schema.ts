import { z } from "zod";
import { TypeEnum as TypeEnumTS } from "@/enums/type.enum";
import { StatusEnum as StatusEnumTS } from "@/enums/status.enum";
import { ApprovalStatusEnum as ApprovalStatusEnumTS } from "@/enums/approval-status.enum";
import { CreateLocationSchema, LocationSchema } from "@/schemas/property/location-schema";
import { BaseSchema } from "@/schemas/common/base-schema";

// Convert enums
const TypeEnum = z.enum(Object.values(TypeEnumTS) as [string, ...string[]]);
const StatusEnum = z.enum(Object.values(StatusEnumTS) as [string, ...string[]]);
const ApprovalStatusEnum = z.enum(Object.values(ApprovalStatusEnumTS) as [string, ...string[]]);

// Create property request schema (no BaseSchema fields)
export const CreatePropertySchema = z.object({
    title: z.string().min(1, "Title is required").max(150, "Title max length is 150"),
    description: z.string().max(500).optional(),
    type: TypeEnum,
    status: StatusEnum,
    location: CreateLocationSchema,
});

export const UpdatePropertySchema = CreatePropertySchema.extend({
    id: z.string()
})

export type CreatePropertyDTO = z.infer<typeof CreatePropertySchema>;
export type UpdatePropertyDTO = z.infer<typeof UpdatePropertySchema>;

// Full property schema (response/entity)
export const PropertySchema = CreatePropertySchema.extend({
    ...BaseSchema.shape,
    id: z.string(),
    approvalStatus: ApprovalStatusEnum,
    ownerId: z.string().optional(),
    location: LocationSchema,
});

export type IPropertySchema = z.infer<typeof PropertySchema>;