"use client"

import {Row} from "@tanstack/react-table"
import {MoreHorizontal, Edit, Send} from "lucide-react"
import {Button} from "@/components/ui/button"
import {PropertySchema} from "@/schemas/property/property-schema"
// import {useQueryClient} from "react-query"
import {toast} from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function SellerPropertyRowActions<TData>({row}: DataTableRowActionsProps<TData>) {
    const property = PropertySchema.parse(row.original)
    // const queryClient = useQueryClient()

    const handleEdit = () => {
        toast(`Edit property ${property.title} clicked`)
        // TODO: open edit modal or navigate to edit page
    }

    const handleSubmit = () => {
        toast(`Submit property ${property.title} clicked`)
        // TODO: call API to submit property for approval
        // Invalidate queries if needed
        // queryClient.invalidateQueries({queryKey: ["sellerProperties"]})
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
                <DropdownMenuItem onClick={handleEdit}>
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
    )
}