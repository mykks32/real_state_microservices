"use client"

import React, { useState, useCallback, useMemo } from "react";
import FeedFilters from "@/components/feed/FeedFilters";
import FeedResults from "@/components/feed/FeedResults";
import { IFilter } from "@/interfaces/common/IFilter";
import { useQuery } from "react-query";
import PublicPropertyService from "@/services/property/public-property-service";
import { Button } from "@/components/ui/button";

// Constants
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const STALE_TIME = 1000 * 60 * 5; // 5 minutes

const defaultFilters: IFilter = {
    status: undefined,
    type: undefined,
    state: undefined,
    page: DEFAULT_PAGE,
    size: DEFAULT_PAGE_SIZE,
};

const Feed = () => {
    const [pagination, setPagination] = useState({
        pageIndex: DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
    })
    const [appliedFilters, setAppliedFilters] = useState<IFilter>(defaultFilters);
    const [currentFilters, setCurrentFilters] = useState<IFilter>(defaultFilters);

    // Build query key
    const queryKey = useMemo(() => [
        "properties",
        {
            status: appliedFilters.status,
            type: appliedFilters.type,
            state: appliedFilters.state,
            page: pagination.pageIndex,
            size: pagination.pageSize,
        }
    ], [appliedFilters.status, appliedFilters.type, appliedFilters.state, pagination.pageIndex, pagination.pageSize]);

    // React Query hook
    const {
        data,
        isLoading,
        isError,
        error,
        isFetching
    } = useQuery({
        queryKey,
        queryFn: () =>
            PublicPropertyService.filterProperties({
                status: appliedFilters.status,
                type: appliedFilters.type,
                state: appliedFilters.state,
                page: pagination.pageIndex,
                size: pagination.pageSize,
            }),
        staleTime: STALE_TIME,
        retry: 2,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    // Memoized data extraction
    const { properties, meta } = useMemo(() => {
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

    const clearFilter = useCallback(() => {
        const clearedFilters = defaultFilters;
        setCurrentFilters(clearedFilters);
        setAppliedFilters(clearedFilters);
        setPagination({
            pageIndex: DEFAULT_PAGE,
            pageSize: DEFAULT_PAGE_SIZE,
        });
    }, []);

    const onSearch = useCallback((newFilter: IFilter) => {
        setAppliedFilters(newFilter);
        setPagination({
            pageIndex: DEFAULT_PAGE,
            pageSize: DEFAULT_PAGE_SIZE,
        });
    }, []);

    const onFilterChange = useCallback((newFilter: IFilter) => {
        setCurrentFilters(newFilter);
    }, []);

    const onPageChange = useCallback((newPage: number, newPageSize: number) => {
        setPagination({
            pageIndex: newPage,
            pageSize: newPageSize
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // Handle loading and error states
    if (isError) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred while loading properties.";
        return (
            <div className="w-[80%] xl:w-[90%] m-auto relative sm:w-[95%]">
                <div className="text-center py-8">
                    <h3 className="text-lg font-semibold text-red-600">
                        Error loading properties
                    </h3>
                    <p className="text-muted-foreground mt-2">
                        {errorMessage || "Please try again later"}
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-4"
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-[80%] xl:w-[90%] m-auto relative sm:w-[95%]">
            <h2 className="font-bold text-3xl tracking-wide leading-[60px] mb-6">
                What are you looking for?
            </h2>

            <div>
                <FeedFilters
                    filter={currentFilters}
                    setFilter={onFilterChange}
                    clearFilter={clearFilter}
                    onSearch={onSearch}
                    isLoading={isFetching}
                />

                <FeedResults
                    data={properties}
                    loading={isLoading}
                    meta={meta}
                    onPageChange={onPageChange}
                    isFetching={isFetching}
                />
            </div>
        </div>
    );
};

export default Feed;