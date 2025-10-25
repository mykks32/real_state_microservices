import { notFound } from 'next/navigation';
import { IProperty } from "@/interfaces/property/property.interface";
import { StatusEnum, ApprovalStatusEnum, TypeEnum } from "@/enums";
import PropertyMainContent from "@/components/property/PropertyDetailCard";
import PropertySidebar from "@/components/property/PropertySideBar";
import PropertyHeaderCard from "@/components/property/PropertyHeaderCard";
import PublicPropertyService from "@/services/property/public-property-service";

export default async function PropertyDetailPage({
                                                     params,
                                                 }: {
    params: Promise<{ propertyId: string }>;
}) {
    const { propertyId } = await params;

    const response = await PublicPropertyService.getPropertyById(propertyId);

    if (!response?.success || !response.data) {
        notFound();
    }

    const property: IProperty = response.data;

    // Color styles for Status
    const getStatusColor = (status: StatusEnum) => {
        switch (status) {
            case StatusEnum.Available:
                return "bg-green-100 text-green-800 border-green-200";
            case StatusEnum.Sold:
                return "bg-red-100 text-red-800 border-red-200";
            case StatusEnum.Rented:
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    // Color styles for ApprovalStatus
    const getApprovalStatusColor = (status: ApprovalStatusEnum) => {
        switch (status) {
            case ApprovalStatusEnum.Approved:
                return "bg-green-100 text-green-800 border-green-200";
            case ApprovalStatusEnum.PendingApproval:
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case ApprovalStatusEnum.Rejected:
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    // Format type enum for display
    const formatType = (type: TypeEnum) => {
        return type.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <section>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header Card */}
                    <PropertyHeaderCard
                        property={property}
                        formatType={formatType}
                        getStatusColor={getStatusColor}
                        getApprovalStatusColor={getApprovalStatusColor}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <PropertyMainContent property={property} />
                        <PropertySidebar property={property} />
                    </div>
                </div>
            </div>
        </section>
    );
}