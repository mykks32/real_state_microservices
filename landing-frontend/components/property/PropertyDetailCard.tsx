import { IProperty } from "@/interfaces/property/property.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusEnum, ApprovalStatusEnum, TypeEnum } from "@/enums";

interface PropertyMainContentProps {
    property: IProperty;
}

export default function PropertyMainContent({ property }: PropertyMainContentProps) {
    const formatType = (type: TypeEnum) => {
        return type.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            {property.description && (
                <Card className="bg-transparent shadow-lg border-slate-500/20">
                    <CardHeader>
                        <CardTitle className="text-xl">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {property.description}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Property Details Card */}
            <Card className="bg-transparent shadow-lg border-slate-500/20">
                <CardHeader>
                    <CardTitle className="text-xl">Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600 font-medium">Property Type</span>
                                <span className="font-semibold">{formatType(property.type)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600 font-medium">Status</span>
                                <span className="font-semibold">{property.status.replace(/_/g, ' ')}</span>
                            </div>
                            {/*<div className="flex justify-between items-center py-2 border-b">*/}
                            {/*    <span className="text-gray-600 font-medium">Approval Status</span>*/}
                            {/*    <span className="font-semibold">{property.approvalStatus.replace(/_/g, ' ')}</span>*/}
                            {/*</div>*/}
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600 font-medium">Created</span>
                                <span className="font-semibold text-sm">
                                    {new Date(property.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600 font-medium">Last Updated</span>
                                <span className="font-semibold text-sm">
                                    {new Date(property.updatedAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            {/*{property.ownerId && (*/}
                            {/*    <div className="flex justify-between items-center py-2 border-b">*/}
                            {/*        <span className="text-gray-600 font-medium">Owner ID</span>*/}
                            {/*        <span className="font-semibold text-xs font-mono">{property.ownerId}</span>*/}
                            {/*    </div>*/}
                            {/*)}*/}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}