import {IProperty} from "@/interfaces/property/property.interface";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {StatusEnum, ApprovalStatusEnum, TypeEnum} from "@/enums";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

interface PropertyHeaderProps {
    property: IProperty;
    formatType: (type: TypeEnum) => string;
    getStatusColor: (status: StatusEnum) => string;
    getApprovalStatusColor: (status: ApprovalStatusEnum) => string;
}

export default function PropertyHeaderCard({
                                               property,
                                               formatType,
                                               getStatusColor,
                                               getApprovalStatusColor
                                           }: PropertyHeaderProps) {
    return (
        <Card className="bg-transparent shadow-lg border-slate-500/20 p-4">
            <CardHeader>
                <div className="flex flex-col gap-6 items-center sm:flex-row sm:justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            {property.title}
                        </CardTitle>
                        <div className="text-lg text-muted-foreground flex flex-wrap items-center gap-2">
                            <span className="font-medium">{formatType(property.type)}</span>
                            <span>•</span>
                            <span>
                                            {property.location.city}, {property.location.state}
                                        </span>
                            {property.location.address && (
                                <>
                                    <span>•</span>
                                    <span className="text-sm">{property.location.address}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center justify-between h-full gap-4">
                        <div className="flex gap-2 flex-wrap">
                            <Badge className={`text-sm px-3 py-1 ${getStatusColor(property.status)}`}>
                                {property.status.replace(/_/g, ' ')}
                            </Badge>
                            {/*<Badge*/}
                            {/*    variant="outline"*/}
                            {/*    className={`text-sm px-3 py-1 ${getApprovalStatusColor(property.approvalStatus)}`}*/}
                            {/*>*/}
                            {/*    {property.approvalStatus.replace(/_/g, ' ')}*/}
                            {/*</Badge>*/}
                        </div>
                        {/* Actions Card */}
                        <Button className="p-6 hover:scale-105 hover:bg-teal-500 bg-blue-500 border text-2xl">
                            Enquiry
                        </Button>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}