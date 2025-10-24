"use client";

import React, { Suspense, lazy } from "react";
import { IProperty } from "@/interfaces/property/property.interface";
import PaginationImpl from "@/components/common/Pagination";
import { Spinner } from "@/components/ui/spinner";

// Lazy load PropertyCard
const PropertyCard = lazy(() => import("./PropertyCard"));

interface IFeedResults {
    loading: boolean;
    data: IProperty[];
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
    onPageChange: (page: number, size: number) => void;
    isFetching?: boolean;
}

// Loading fallback for individual property cards
const PropertyCardFallback: React.FC = () => (
    <div className="w-full h-80 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50">
        <Spinner className="w-6 h-6 text-blue-500" />
    </div>
);

const FeedResults: React.FC<IFeedResults> = ({
                                                 loading,
                                                 data,
                                                 meta,
                                                 onPageChange,
                                                 isFetching = false
                                             }) => {
    // Show loading indicator for pagination when isFetching is true
    if (isFetching && data.length > 0) {
        return (
            <div className="flex flex-col justify-center items-center h-96 w-full gap-4">
                <Spinner className="w-12 h-12 text-blue-500" />
                <p className="text-lg font-medium text-gray-700">Loading more properties...</p>
            </div>
        );
    }

    // Show main loading when initial load
    if (loading && data.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-96 w-full gap-4">
                <Spinner className="w-12 h-12 text-blue-500" />
                <p className="text-lg font-medium text-gray-700">Loading properties...</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-8 pb-20">
            {/* Results Count */}
            {!loading && data.length > 0 && (
                <p className="text-2xl font-semibold">
                    {meta.totalItems} {meta.totalItems === 1 ? "Result" : "Results"} Found
                </p>
            )}

            {/* Properties Grid with Suspense boundary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.length > 0 ? (
                    data.map((property) => (
                        <Suspense key={property.id} fallback={<PropertyCardFallback />}>
                            <PropertyCard property={property} />
                        </Suspense>
                    ))
                ) : (
                    <div className="col-span-full text-center text-muted-foreground text-lg py-10">
                        <p>No properties found matching your criteria</p>
                    </div>
                )}
            </div>

            {/* Pagination - Only show if we have items and not currently fetching */}
            {meta.totalItems > 0 && !isFetching && (
                <PaginationImpl meta={meta} onPageChange={onPageChange} />
            )}

            {/* Loading overlay for pagination */}
            {isFetching && (
                <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
                        <Spinner className="w-6 h-6 text-blue-500" />
                        <p className="text-lg font-medium">Loading more properties...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedResults;