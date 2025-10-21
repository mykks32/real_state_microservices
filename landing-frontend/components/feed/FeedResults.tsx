"use client";

import React, {useState, useEffect} from "react";
import PropertyCard from "./PropertyCard";
import {IProperty} from "@/interfaces/property/property.interface";
import Loading from "@/components/common/loading";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import PaginationImpl from "@/components/common/Pagination";

interface IFeedResults {
    loading: boolean;
    data: IProperty[];
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
    onPageChange: (page: number) => void;
}

const FeedResults: React.FC<IFeedResults> = ({loading, data, meta, onPageChange}) => {

        return (
            <div className="w-full flex flex-col gap-8 pb-20">
                {!loading && data.length > 0 && (
                    <p className="text-2xl font-semibold">
                        {data.length} {data.length === 1 ? "Result" : "Results"}
                    </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {loading && data.length === 0 ? (
                        <div className="col-span-full flex justify-center items-center h-[200px] rounded-xl">
                            <Loading message="Loading properties..."/>
                        </div>
                    ) : data.length > 0 ? (
                        data.map((property) => (
                            <PropertyCard key={property.id} property={property}/>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-muted-foreground text-lg py-10">
                            {loading ? (
                                <Loading message="Applying filters..."/>
                            ) : (
                                <p>No properties found matching your criteria</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <PaginationImpl meta={meta} onPageChange={onPageChange}/>

                {/* Loading indicator for pagination */}
                {loading && data.length > 0 && (
                    <div className="flex justify-center mt-4">
                        <Loading message="Loading more properties..."/>
                    </div>
                )}
            </div>
        );
    }
;

export default FeedResults;