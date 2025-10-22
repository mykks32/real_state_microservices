import { IProperty } from "@/interfaces/property/property.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PropertySidebarProps {
    property: IProperty;
}

export default function PropertySidebar({ property }: PropertySidebarProps) {
    return (
        <div className="space-y-6">
            {/* Location Card */}
            <Card className="bg-transparent shadow-lg border-slate-500/20">
                <CardHeader>
                    <CardTitle className="text-xl">Location</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {property.location.address && (
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Address</p>
                                <p className="font-medium">{property.location.address}</p>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">City</p>
                                <p className="font-medium">{property.location.city}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">State</p>
                                <p className="font-medium">{property.location.state}</p>
                            </div>
                        </div>
                        {property.location.country && (
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Country</p>
                                <p className="font-medium">{property.location.country}</p>
                            </div>
                        )}
                        {property.location.zipcode && (
                            <div>
                                <p className="text-sm text-gray-600 mb-1">ZIP Code</p>
                                <p className="font-medium">{property.location.zipcode}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}