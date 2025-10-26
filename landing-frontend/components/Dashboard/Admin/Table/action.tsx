"use client"

import {Row} from "@tanstack/react-table"
import {MoreHorizontal, Check, X, Archive, Trash} from "lucide-react"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {PropertySchema} from "@/schemas/property/property-schema"
import {useMutation, useQueryClient} from "react-query"
import AdminPropertyService from "@/services/property/admin-property-service"
import {toast} from "sonner"
import {ApprovalStatusEnum} from "@/enums"

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function Action<TData>({row}: DataTableRowActionsProps<TData>) {
    const property = PropertySchema.parse(row.original)
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (action: "approve" | "reject" | "archive" | "delete") => {
            switch (action) {
                case "approve":
                    return await AdminPropertyService.approveProperty(property.id)
                case "reject":
                    return await AdminPropertyService.rejectProperty(property.id)
                case "archive":
                    return await AdminPropertyService.archiveProperty(property.id)
                case "delete":
                    return await AdminPropertyService.deleteProperty(property.id)
            }
        },
        onSuccess: (response, action) => {
            if (response?.success) {
                toast.success(`Property ${action}d successfully.`)
                queryClient.invalidateQueries({queryKey: ["all-properties"]})
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

    const approvalStatus = property.approvalStatus as ApprovalStatusEnum

    const canApprove = approvalStatus === ApprovalStatusEnum.PendingApproval
    const canReject = approvalStatus === ApprovalStatusEnum.PendingApproval
    const canArchive = approvalStatus === ApprovalStatusEnum.Approved
    const canDelete =
        approvalStatus === ApprovalStatusEnum.Rejected ||
        approvalStatus === ApprovalStatusEnum.Archived ||
        approvalStatus === ApprovalStatusEnum.Draft

    const hasButtonsAboveSeparator = canApprove || canReject || canArchive

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted size-8">
                    <MoreHorizontal/>
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[180px]">
                {canApprove && (
                    <DropdownMenuItem className="flex justify-between" disabled={mutation.isLoading} onClick={() => handleAction("approve")}>
                        Approve
                        <Check className="mr-2 h-4 w-4"/>
                    </DropdownMenuItem>
                )}

                {canReject && (
                    <DropdownMenuItem className="flex justify-between" disabled={mutation.isLoading} onClick={() => handleAction("reject")}>
                        Reject
                        <X className="mr-2 h-4 w-4"/>
                    </DropdownMenuItem>
                )}

                {canArchive && (
                    <DropdownMenuItem className="flex justify-between" disabled={mutation.isLoading} onClick={() => handleAction("archive")}>
                        Archive
                        <Archive className="mr-2 h-4 w-4"/>
                    </DropdownMenuItem>
                )}

                {hasButtonsAboveSeparator && canDelete && <DropdownMenuSeparator/>}

                {canDelete && (
                    <DropdownMenuItem
                        disabled={mutation.isLoading}
                        onClick={() => handleAction("delete")}
                        className="text-red-600 flex justify-between focus:text-red-600"
                    >
                        Delete
                        <Trash className="mr-2 h-4 w-4"/>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}