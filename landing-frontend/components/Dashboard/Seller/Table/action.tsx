"use client"

import {Row} from "@tanstack/react-table"
import {MoreHorizontal, Edit, Send} from "lucide-react"
import {Button} from "@/components/ui/button"
import {CreatePropertyDTO, PropertySchema, UpdatePropertyDTO} from "@/schemas/property/property-schema"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UpdatePropertyDialog from "@/components/Dashboard/Seller/Dialog/update-property-dialog";
import React from "react";
import {IProperty} from "@/interfaces/property/property.interface";
import {useMutation, useQueryClient} from "react-query";
import SellerPropertyService from "@/services/property/seller-property-serive";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function SellerPropertyRowActions<TData>({row}: DataTableRowActionsProps<TData>) {
    const property = PropertySchema.parse(row.original)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const queryClient = useQueryClient()

    const updatePropertyMutation = useMutation({
        mutationFn: async ({data, id}: { data: CreatePropertyDTO; id: string }) => {
            await SellerPropertyService.updateProperty(id, data);
        },
        onSuccess: () => {
            setIsDialogOpen(false)
            queryClient
                .invalidateQueries({ queryKey: ["seller-properties"] })
                .then(() => {
                    console.log("Query invalidated successfully");
                })
                .catch((err) => {
                    console.error("Invalidation failed:", err);
                });
        },
        onError: (error: any) => {
            console.error("Update property error:", error)
        }
    });

    const SubmitPropertyMutation = useMutation({
        mutationFn: async (id: string) => {
            await SellerPropertyService.submitForApproval(id);
        },
        onSuccess: () => {
            queryClient
                .invalidateQueries({ queryKey: ["seller-properties"] })
                .then(() => {
                    console.log("Query invalidated successfully");
                })
                .catch((err) => {
                    console.error("Invalidation failed:", err);
                });
        },
        onError: (error: any) => {
            console.error("Submitting approval error:", error)
        }
    });

    const handleEditProperty = (data: UpdatePropertyDTO) => {
        // Ensure we have the property ID and merge with updated data
        const {id, ...updateData} = data;

        updatePropertyMutation.mutate({data: updateData, id});
    }

    const handleSubmit = () => {
        SubmitPropertyMutation.mutate(property.id)
    }

    return (
        <>
            <UpdatePropertyDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleEditProperty}
                initialData={row.original as IProperty}
                trigger={null}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="data-[state=open]:bg-muted size-8"
                    >
                        <MoreHorizontal/>
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                        Edit
                        <DropdownMenuShortcut>
                            <Edit className="mr-2 h-4 w-4"/>
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator/>

                    <DropdownMenuItem onClick={handleSubmit}>
                        Submit
                        <DropdownMenuShortcut>
                            <Send className="mr-2 h-4 w-4"/>
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}