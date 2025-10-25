"use client"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {CreatePropertyDTO, CreatePropertySchema} from "@/schemas/property/property-schema";
import React, {useState} from "react";
import {StateEnum, StatusEnum, TypeEnum} from "@/enums";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useMutation} from "react-query";
import SellerPropertyService from "@/services/property/seller-property-serive";

interface PropertyDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onDraft: (data: CreatePropertyDTO) => void;
    initialData?: Partial<CreatePropertyDTO>;
    trigger?: React.ReactNode;
}

export default function PropertyDialog({isOpen, onClose, onDraft, initialData, trigger,}: PropertyDialogProps) {
    const defaultPropertyValues: CreatePropertyDTO = {
        title: initialData?.title || "",
        description: initialData?.description || "",
        type: initialData?.type || TypeEnum.House,
        status: initialData?.status || StatusEnum.Available,
        location: {
            address: initialData?.location?.address || "",
            city: initialData?.location?.city || "",
            state: initialData?.location?.state || StateEnum.Madhesh,
            country: initialData?.location?.country || "Nepal",
            zipcode: initialData?.location?.zipcode || 44600,
            latitude: initialData?.location?.latitude || 0,
            longitude: initialData?.location?.longitude || 0,
        },
    }

    const form = useForm<CreatePropertyDTO>({
        resolver: zodResolver(CreatePropertySchema),
        defaultValues: defaultPropertyValues
    })

    const handleSubmit = (data: CreatePropertyDTO) => {
        onDraft(data);
        setTimeout(() => {
            onClose();
            form.reset();
        }, 500);
    };



    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose();
                form.reset(); // Reset form when dialog closes
            }
        }}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle
                        className="flex justify-center text-2xl font-bold">{initialData ? "Update Property" : "Create Property"}</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4 p-4 flex flex-col"
                >
                    {/* Title */}
                    <div className="flex flex-col gap-1">
                        <Label>Title</Label>
                        <Input {...form.register("title")} placeholder="Property Title"/>
                        {form.formState.errors.title && (
                            <p className="text-red-400 text-sm">{form.formState.errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <Label>Description</Label>
                        <Input {...form.register("description")} placeholder="Property Description"/>
                        {form.formState.errors.description && (
                            <p className="text-red-400 text-sm">{form.formState.errors.description.message}</p>
                        )}
                    </div>

                    {/* Type, Status, State */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Type */}
                        <div className="flex flex-col gap-1">
                            <Label>Type</Label>
                            <Select
                                value={form.watch('type')}
                                onValueChange={(value) => form.setValue('type', value as TypeEnum)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(TypeEnum).map((type) => (
                                        <SelectItem value={type} key={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status */}
                        <div className="flex flex-col gap-1">
                            <Label>Status</Label>
                            <Select
                                value={form.watch('status')}
                                onValueChange={(value) => form.setValue('status', value as StatusEnum)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(StatusEnum).map((status) => (
                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* State */}
                        <div className="flex flex-col gap-1">
                            <Label>State</Label>
                            <Select
                                value={form.watch('location.state')}
                                onValueChange={(value) => form.setValue('location.state', value as StateEnum)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select State"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(StateEnum).map((state) => (
                                        <SelectItem key={state} value={state}>{state}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col gap-2">
                        <Label>Address</Label>
                        <Input {...form.register("location.address")} placeholder="Address"/>
                        {form.formState.errors.location?.address && (
                            <p className="text-red-400 text-sm">{form.formState.errors.location.address.message}</p>
                        )}

                        <Label>City</Label>
                        <Input {...form.register("location.city")} placeholder="City"/>
                        {form.formState.errors.location?.city && (
                            <p className="text-red-400 text-sm">{form.formState.errors.location.city.message}</p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <Label>Country</Label>
                                <Input {...form.register("location.country")} placeholder="Country"/>
                                {form.formState.errors.location?.country && (
                                    <p className="text-red-400 text-sm">{form.formState.errors.location.country.message}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label>Zipcode</Label>
                                <Input
                                    type="number"
                                    {...form.register("location.zipcode", {valueAsNumber: true})}
                                    placeholder="Zipcode"
                                />
                                {form.formState.errors.location?.zipcode && (
                                    <p className="text-red-400 text-sm">{form.formState.errors.location.zipcode.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button className="bg-blue-500" type="submit">{initialData ? "Update" : "Draft"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}