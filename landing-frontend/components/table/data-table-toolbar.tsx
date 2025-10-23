"use client"

import {Table} from "@tanstack/react-table"
import {X} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {DataTableFacetedFilter} from "@/components/table/data-table-faceted-filter";
import {approvalStatuses} from "@/app/(public)/dashboard/data";

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
                                            table,
                                        }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Filter tasks..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="h-8 border border-black w-[150px] lg:w-[250px]"
                />
                {table.getColumn("approvalStatus") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("approvalStatus")}
                        title="approval status"
                        options={approvalStatuses}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.resetColumnFilters()}
                    >
                        Reset
                        <X/>
                    </Button>
                )}
            </div>
        </div>
    )
}