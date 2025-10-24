"use client"

import {DataTable} from "@/components/table/data-table";
import {columns} from "@/app/(public)/dashboard/columns";
import {TabsContent} from "@/components/ui/tabs";
import {Spinner} from "@/components/ui/spinner";
import {useCallback, useMemo, useState} from "react";
import {useQuery} from "react-query";
import PropertyService from "@/services/property-service";
import PaginationImpl from "@/components/common/Pagination";

// Constants
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const STALE_TIME = 1000 * 60 * 5;

export default function PropertyTab() {
    const [pagination, setPagination] = useState({
        pageIndex: DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
    })

    const queryKey = useMemo(() => [
        "all-properties",
        {
            page: pagination.pageIndex,
            size: pagination.pageSize,
        }
    ], [pagination.pageIndex, pagination.pageSize]);

    // React Query hook
    const {data, isLoading, isError, error} = useQuery({
        queryKey,
        queryFn: () => PropertyService.getAllProperties(pagination.pageIndex, pagination.pageSize),
        staleTime: STALE_TIME, // 5 minutes
        retry: 2,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    // Memoized data extraction
    const {properties, meta} = useMemo(() => {
        const propertiesData = data?.data || [];
        const metaData = data?.meta || {
            totalItems: 0,
            totalPages: 0,
            currentPage: pagination.pageIndex,
            pageSize: pagination.pageSize,
        };

        return {
            properties: propertiesData,
            meta: metaData
        };
    }, [data, pagination.pageIndex, pagination.pageSize]);

    // Called when user changes page
    const onPageChange = useCallback((newPage: number, newPageSize: number) => {
        setPagination({
            pageIndex: newPage,
            pageSize: newPageSize
        });
        window.scrollTo({top: 0, behavior: "smooth"});
    }, []);

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
        <TabsContent value="property">
            <DataTable columns={columns} data={properties}/>
            <PaginationImpl meta={meta} onPageChange={onPageChange} />
        </TabsContent>
    )
}