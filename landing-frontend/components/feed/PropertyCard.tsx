"use client";

import React from "react";
import {IProperty} from "@/interfaces/property/property.interface";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {StatusEnum, ApprovalStatusEnum} from "@/enums";
import Link from "next/link";

interface IPropertyCardProps {
    property: IProperty;
}

const PropertyCard = ({property}: IPropertyCardProps) => {
    // Color styles for Status
    const getStatusColor = (status: StatusEnum) => {
        switch (status) {
            case StatusEnum.Available:
                return "bg-green-100 text-green-800";
            case StatusEnum.Sold:
                return "bg-red-100 text-red-800";
            case StatusEnum.Rented:
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Color styles for ApprovalStatus
    const getApprovalStatusColor = (status: ApprovalStatusEnum) => {
        switch (status) {
            case ApprovalStatusEnum.Approved:
                return "bg-green-100 text-green-800";
            case ApprovalStatusEnum.PendingApproval:
                return "bg-yellow-100 text-yellow-800";
            case ApprovalStatusEnum.Rejected:
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <Card
            className="w-full shadow-lg border bg-slate-900/10 border-slate-900/10 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg font-semibold line-clamp-2 flex-1 text-gray-900">
                        {property.title}
                    </CardTitle>
                    <Badge className={`text-xs ${getStatusColor(property.status)}`}>
                        {property.status}
                    </Badge>
                </div>

                <CardDescription className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{property.type}</span>
                    <span>•</span>
                    <span>
            {property.location.city}, {property.location.state}
          </span>
                </CardDescription>
            </CardHeader>

            <CardContent className="pb-3">
                {property.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {property.description}
                    </p>
                )}

                <div className="flex justify-between items-center mt-3">
                    <Badge
                        variant="outline"
                        className={`text-xs ${getApprovalStatusColor(property.approvalStatus)}`}
                    >
                        {property.approvalStatus}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
            Updated:{" "}
                        {new Date(property.updatedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
          </span>
                </div>
            </CardContent>

            <CardFooter>
                <Link href={`/property/${property.id}`} passHref>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        View Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default PropertyCard;