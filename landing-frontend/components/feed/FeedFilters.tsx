"use client";

import React, { useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { StateEnum, StatusEnum, TypeEnum } from "@/enums";
import { IFilter } from "@/interfaces/common/IFilter";

interface FeedFiltersProps {
    filter: IFilter;
    setFilter: (filter: IFilter) => void;
    clearFilter: () => void;
    onSearch: (filter: IFilter) => void;
    isLoading?: boolean;
}

const FeedFilters: React.FC<FeedFiltersProps> = ({
                                                     filter,
                                                     setFilter,
                                                     clearFilter,
                                                     onSearch,
                                                     isLoading = false,
                                                 }) => {
    const handleStatusChange = useCallback((value: string) => {
        const newFilter = {
            ...filter,
            status: value === "ALL" ? undefined : (value as StatusEnum),
        };
        setFilter(newFilter);
    }, [filter, setFilter]);

    const handleTypeChange = useCallback((value: string) => {
        const newFilter = {
            ...filter,
            type: value === "ALL" ? undefined : (value as TypeEnum),
        };
        setFilter(newFilter);
    }, [filter, setFilter]);

    const handleStateChange = useCallback((value: string) => {
        const newFilter = {
            ...filter,
            state: value === "ALL" ? undefined : (value as StateEnum),
        };

        setFilter(newFilter);
    }, [filter, setFilter]);

    const hasActiveFilters = filter.status || filter.type || filter.state;

    return (
        <div className="w-full shadow-lg border bg-slate-900/10 border-slate-900/10 rounded-2xl p-4 sm:p-4 flex flex-col gap-5 mb-8">
            {/* Status & Type */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Status */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-muted-foreground">
                        Status
                    </span>
                    <Tabs
                        value={filter.status || "ALL"}
                        onValueChange={handleStatusChange}
                    >
                        <TabsList className="bg-slate-900/10">
                            {/* All option */}
                            <TabsTrigger
                                value="ALL"
                                className="rounded-md px-4 py-1.5 text-sm data-[state=active]:font-medium"
                            >
                                All
                            </TabsTrigger>

                            {/* Individual status options */}
                            {Object.values(StatusEnum).map((status) => (
                                <TabsTrigger
                                    key={status}
                                    value={status}
                                    className="rounded-md px-4 py-1.5 text-sm data-[state=active]:font-medium"
                                >
                                    {status}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Type */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-muted-foreground">
                        Type
                    </span>
                    <Tabs
                        value={filter.type || "ALL"}
                        onValueChange={handleTypeChange}
                    >
                        <TabsList className="bg-slate-900/10">
                            {/* All option */}
                            <TabsTrigger
                                value="ALL"
                                className="rounded-md px-4 py-1.5 text-sm data-[state=active]:font-medium"
                            >
                                All
                            </TabsTrigger>

                            {/* Individual type options */}
                            {Object.values(TypeEnum).map((type) => (
                                <TabsTrigger
                                    key={type}
                                    value={type}
                                    className="rounded-md px-4 py-1.5 text-sm data-[state=active]:font-medium"
                                >
                                    {type}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* State & Buttons */}
            <div className="flex flex-wrap items-end gap-4">
                {/* State */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-muted-foreground">
                        State
                    </span>
                    <Select
                        value={filter.state || "ALL"}
                        onValueChange={handleStateChange}
                    >
                        <SelectTrigger className="w-[180px] bg-slate-900/10 border-slate-500/10 h-9 text-sm">
                            <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>States</SelectLabel>
                                <SelectItem value="ALL">All States</SelectItem>
                                {Object.values(StateEnum).map((state) => (
                                    <SelectItem key={state} value={state}>
                                        {state}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 ml-auto">
                    <Button
                        onClick={clearFilter}
                        disabled={isLoading || !hasActiveFilters}
                        variant="outline"
                        className="px-6 py-3 text-lg font-semibold rounded-md bg-slate-900/10 border-slate-500/10"
                    >
                        Clear All
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={() => onSearch(filter)}
                        className="px-10 py-3 text-lg bg-blue-500 font-semibold rounded-md"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Searching...
                            </>
                        ) : (
                            'Search'
                        )}
                    </Button>
                </div>
            </div>
            {/* Active filters indicator */}
            <div
                className={`flex items-center gap-1 text-sm text-muted-foreground transition-all duration-200 ease-in-out overflow-hidden ${
                    hasActiveFilters ? "opacity-100 max-h-20 mt-2" : "opacity-0 max-h-0 mt-0"
                }`}
            >
                {hasActiveFilters && (
                    <>
                        <span>filters:</span>
                        {filter.status && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                    Status: {filter.status}
                </span>
                        )}
                        {filter.type && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
                    Type: {filter.type}
                </span>
                        )}
                        {filter.state && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs">
                    State: {filter.state}
                </span>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FeedFilters;