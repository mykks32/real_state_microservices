"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Badge} from "@/components/ui/badge"
import {Checkbox} from "@/components/ui/checkbox"

import {DataTableColumnHeader} from "@/components/table/data-table-column-header"
import {Action} from "./action"
import {IProperty} from "@/interfaces/property/property.interface"
import {StatusEnum, TypeEnum, ApprovalStatusEnum, StateEnum} from "@/enums"

// Columns definition
export const columns: ColumnDef<IProperty>[] = [
    {
        accessorKey: "id",
        header: ({column}) => <DataTableColumnHeader column={column} title="ID"/>,
        cell: ({row}) => <div className="w-full truncate">{row.getValue<string>("id")}</div>,
    },
    {
        accessorKey: "title",
        header: ({column}) => <DataTableColumnHeader column={column} title="Title"/>,
        cell: ({row}) => (
            <div className="max-w-[300px] truncate font-medium">{row.getValue<string>("title")}</div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "type",
        header: ({column}) => <DataTableColumnHeader column={column} title="Type"/>,
        cell: ({row}) => {
            const type = row.getValue<TypeEnum>("type")
            return <Badge variant="secondary">{type}</Badge>
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "status",
        header: ({column}) => <DataTableColumnHeader column={column} title="Status"/>,
        cell: ({row}) => {
            const status = row.getValue<StatusEnum>("status");
            const color: "default" | "secondary" | "destructive" | "outline" =
                status === StatusEnum.Available ? "secondary" : "destructive";

            return <Badge variant={color}>{status}</Badge>;
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "approvalStatus",
        header: ({column}) => <DataTableColumnHeader column={column} title="Approval"/>,
        cell: ({row}) => {
            const approval = row.getValue<ApprovalStatusEnum>("approvalStatus");

            let color: "default" | "secondary" | "destructive" | "outline" = "default";

            switch (approval) {
                case ApprovalStatusEnum.Approved:
                    color = "secondary"; // or "default"
                    break;
                case ApprovalStatusEnum.Rejected:
                    color = "destructive";
                    break;
                case ApprovalStatusEnum.PendingApproval:
                    color = "outline"; // instead of "warning"
                    break;
                case ApprovalStatusEnum.Draft:
                case ApprovalStatusEnum.Archived:
                    color = "default";
                    break;
            }
            return <Badge variant={color}>{approval}</Badge>;

        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "ownerId",
        header: ({column}) => <DataTableColumnHeader column={column} title="Owner"/>,
        cell: ({row}) => <div className="truncate">{row.getValue<string | undefined>("ownerId") ?? "-"}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "location",
        header: ({column}) => <DataTableColumnHeader column={column} title="Location"/>,
        cell: ({row}) => {
            const location = row.getValue<{ address: string; city: string; state: StateEnum }>("location")
            return location ? (
                <div className="truncate">
                    {location.address}, {location.city} ({location.state})
                </div>
            ) : (
                "-"
            )
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "actions",
        cell: ({row}) => <Action row={row}/>,
    },
]