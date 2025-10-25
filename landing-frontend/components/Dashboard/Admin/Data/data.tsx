import { HelpCircle, Timer, CheckCircle, XCircle, Archive } from "lucide-react";
import { ApprovalStatusEnum } from "@/enums/approval-status.enum";

export const approvalStatuses = [
    {
        value: ApprovalStatusEnum.Draft,
        label: "Draft",
        icon: HelpCircle,
    },
    {
        value: ApprovalStatusEnum.PendingApproval,
        label: "Pending Approval",
        icon: Timer,
    },
    {
        value: ApprovalStatusEnum.Approved,
        label: "Approved",
        icon: CheckCircle,
    },
    {
        value: ApprovalStatusEnum.Rejected,
        label: "Rejected",
        icon: XCircle,
    },
    {
        value: ApprovalStatusEnum.Archived,
        label: "Archived",
        icon: Archive,
    },
];
