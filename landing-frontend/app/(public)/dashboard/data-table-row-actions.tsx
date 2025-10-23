"use client"

import {Row} from "@tanstack/react-table"
import {MoreHorizontal} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {PropertySchema} from "@/schemas/property-schema";
import {useMutation, useQueryClient} from "react-query";
import PropertyService from "@/services/property-service";
import {toast} from "sonner";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function DataTableRowActions<TData>({
                                               row,
                                           }: DataTableRowActionsProps<TData>) {
    const property = PropertySchema.parse(row.original)

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (action: "approve" | "reject" | "archive" | "delete") => {
            switch (action) {
                case "approve":
                    return await PropertyService.approveProperty(property.id)
                case "reject":
                    return await PropertyService.rejectProperty(property.id)
                case "archive":
                    return await PropertyService.archiveProperty(property.id)
                case "delete":
                    return await PropertyService.deleteProperty(property.id)
                default:
                    throw new Error("Invalid action")
            }
        },
        onSuccess: (response, action) => {
            if (response?.success) {
                toast.success(`Property ${action}d successfully.`)
                // ✅ Invalidate and refetch approved property list
                queryClient.invalidateQueries({queryKey: ["approvedProperties"]})
            } else {
                toast.error(`Failed to ${action} property.`)
            }
        },
        onError: (_, action) => {
            toast.error(`Error while trying to ${action} property.`)
        },
    })

    const handleAction = (action: "approve" | "reject" | "archive" | "delete") => {
        mutation.mutate(action)
    }

    return (
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
                <DropdownMenuItem
                    disabled={mutation.isLoading}
                    onClick={() => handleAction("approve")}
                >
                    Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={mutation.isLoading}
                    onClick={() => handleAction("reject")}
                >
                    Reject
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={mutation.isLoading}
                    onClick={() => handleAction("archive")}
                >
                    Archive
                </DropdownMenuItem>

                <DropdownMenuSeparator/>

                <DropdownMenuItem
                    disabled={mutation.isLoading}
                    onClick={() => handleAction("delete")}
                    className="text-red-600 focus:text-red-600"
                >
                    Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}