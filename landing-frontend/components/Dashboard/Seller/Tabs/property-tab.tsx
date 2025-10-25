"use client"

import {DataTable} from "@/components/table/data-table";
import {columns} from "@/components/Dashboard/Seller/Table/columns";
import {TabsContent} from "@/components/ui/tabs";
import {Spinner} from "@/components/ui/spinner";
import {useMemo} from "react";
import {useQuery} from "react-query";
import SellerPropertyService from "@/services/property/seller-property-serive";

// Constants
const STALE_TIME = 1000 * 60 * 5;

export default function PropertyTab() {

    // React Query hook
    const {data, isLoading, isError, error} = useQuery({
        queryKey: ["seller-property"],
        queryFn: () => SellerPropertyService.getMyProperties(),
        staleTime: STALE_TIME, // 5 minutes
        retry: 2,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    // Memoized data extraction
    const {properties} = useMemo(() => {
        const propertiesData = data?.data || [];

        return {
            properties: propertiesData,
        };
    }, [data]);


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner/>
            </div>
        );
    }

    if (isError) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred while loading properties.";

        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Error loading properties: {errorMessage}</p>
            </div>
        );
    }

    return (
        <TabsContent value="seller-property">
            <DataTable columns={columns} data={properties}/>
        </TabsContent>
    )
}