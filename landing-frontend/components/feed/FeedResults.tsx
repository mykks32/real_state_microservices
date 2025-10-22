"use client";

import React from "react";
import PropertyCard from "./PropertyCard";
import {IProperty} from "@/interfaces/property/property.interface";
import PaginationImpl from "@/components/common/Pagination";
import {Spinner} from "@/components/ui/spinner";

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
        {/* Loading indicator for pagination */
        }
        if (loading && data.length > 0) {
            return (<div className="flex flex-col justify-center items-center h-96 w-full gap-4">
                <Spinner className="w-12 h-12 text-blue-500"/>
                <p className="text-lg font-medium text-gray-700">Loading, please wait...</p>
            </div>)
        }
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
                            <Spinner/>
                        </div>
                    ) : data.length > 0 ? (
                        data.map((property) => (
                            <PropertyCard key={property.id} property={property}/>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-muted-foreground text-lg py-10">
                            {loading ? (
                                <Spinner/>
                            ) : (
                                <p>No properties found matching your criteria</p>
                            )}
                        </div>
                    )}
                </div>


                {/* Pagination */}
                {meta.totalItems > 0 && <PaginationImpl meta={meta} onPageChange={onPageChange}/>}


            </div>
        );
    }
;

export default FeedResults;