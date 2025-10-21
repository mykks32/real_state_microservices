"use client"

import React, {useState} from "react";
import {IProperty} from "@/interfaces/property/property.interface";
import FeedFilters from "@/components/feed/FeedFilters";
import FeedResults from "@/components/feed/FeedResults";
import {ApprovalStatusEnum, StateEnum, StatusEnum, TypeEnum} from "@/enums";
import {z} from "zod";
import {IFilter} from "@/interfaces/common/IFilter";
import {useQuery} from "react-query";
import PropertyService from "@/services/property-service";

const defaultProperties: IProperty[] = [
    {
        "id": "1a2b3c4d-0001",
        "title": "Luxury Villa in Bagmati",
        "description": "Spacious villa with modern amenities",
        "type": TypeEnum.House,
        "status": StatusEnum.Available,
        "approvalStatus": ApprovalStatusEnum.Approved,
        "ownerId": "owner-uuid-001",
        "createdAt": "2025-10-21T07:00:00Z",
        "updatedAt": "2025-10-21T07:00:00Z",
        "location": {
            "id": 1,
            "address": "Pulchowk, Lalitpur",
            "city": "Kathmandu",
            "state": StateEnum.Bagmati,
            "country": "Nepal",
            "zipcode": 44700,
            "latitude": 27.6828,
            "longitude": 85.3136,
            "createdAt": "2025-10-21T07:00:00Z",
            "updatedAt": "2025-10-21T07:00:00Z"
        }
    },
]

const defaultFilters: IFilter = {
    status: StatusEnum.Available,
    type: TypeEnum.House,
    state: StateEnum.Bagmati,
    minPrice: 1,
    maxPrice: 100000,
}

const filterSchema = z.object({
    status: z.object(Object.values(StateEnum)),
    type: z.object(Object.values(TypeEnum)),
    state: z.object(Object.values(StateEnum)), // etc.
    minPrice: z.number().min(0),
    maxPrice: z.number().min(0),
});

export type FilterFormValues = z.infer<typeof filterSchema>;

const Feed = () => {
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [filter, setFilter] = useState<IFilter>(defaultFilters);

    // React Query hook
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["approvedProperties", page, size],
        queryFn: () => PropertyService.approvedProperty(page, size),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });

    const properties = data?.data || defaultProperties;
    const meta = data?.meta || {
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 10,
    };

    const clearFilter = () => {
        setFilter(defaultFilters);
    }

    const onSearch = (filter: IFilter) => {
        console.log(filter);
    };

    const onPageChange = (newPage: number) => {
        setPage(newPage);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <main className="bg-gradient-to-br from-blue-900/30 via-red-800/10 to-violet-900/30 backdrop-blur-lg">
            {/* content */}
            <div className="w-[80%] xl:w-[90%] m-auto relative sm:w-[95%]">
                <h2 className="pt-10 font-bold text-3xl tracking-wide leading-[60px]">
                    What are you looking for?
                </h2>

                <div>
                    {/* filters */}
                    <FeedFilters
                        filter={filter}
                        setFilter={setFilter}
                        clearFilter={clearFilter}
                        onSearch={onSearch}
                    />

                    {/* results */}
                    <FeedResults
                        data={properties}
                        loading={isLoading}
                        meta={meta}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
        </main>
    );
};

export default Feed;