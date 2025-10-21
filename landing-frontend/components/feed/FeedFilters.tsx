"use client";

import React, {useState} from "react";
import {z} from "zod";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {StateEnum, StatusEnum, TypeEnum} from "@/enums";
import {IFilter} from "@/interfaces/common/IFilter";

interface FeedFiltersProps {
    filter: IFilter;
    setFilter: React.Dispatch<React.SetStateAction<IFilter>>;
    clearFilter: () => void;
    onSearch: (filter: IFilter) => void;
}

const FeedFilters: React.FC<FeedFiltersProps> = ({filter, setFilter, clearFilter, onSearch}) => {


    return (
        <div className="w-full shadow-lg border bg-slate-900/10 border-slate-900/10 rounded-2xl p-5 sm:p-4 flex flex-col gap-5 mb-8">
            {/* Status & Type */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Status */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-muted-foreground">Status</span>
                    <Tabs
                        value={filter.status}
                        onValueChange={(value) =>
                            setFilter((prev) => ({...prev, status: value as StatusEnum}))
                        }
                    ><TabsList className="bg-slate-900/10">
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
                    <span className="text-sm font-medium text-muted-foreground">Type</span>
                    <Tabs
                        value={filter.type}
                        onValueChange={(value) =>
                            setFilter((prev) => ({...prev, type: value as TypeEnum}))
                        }
                    >
                        <TabsList className="bg-slate-900/10">
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

            {/* State & Price */}
            <div className="flex flex-wrap items-end gap-4">
                {/* State */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-muted-foreground">State</span>
                    <Select
                        value={filter.state}
                        onValueChange={(value) =>
                            setFilter((prev) => ({...prev, state: value as StateEnum}))
                        }
                    >
                        <SelectTrigger className="w-[180px] bg-slate-900/10 border-slate-500/10 h-9 text-sm">
                            <SelectValue placeholder="Select State"/>
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

                {/* Price */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-muted-foreground">Price Range</span>
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Min"
                            className="w-24 h-9 text-sm bg-slate-900/10 border-slate-500/10"
                            value={filter.minPrice}
                            onChange={(e) =>
                                setFilter((prev) => ({
                                    ...prev,
                                    minPrice: Number(e.target.value),
                                }))
                            }
                        />
                        <span className="text-muted-foreground font-medium">-</span>
                        <Input
                            type="number"
                            placeholder="Max"
                            className="w-24 h-9 text-sm bg-slate-900/10 border-slate-500/10"
                            value={filter.maxPrice}
                            onChange={(e) =>
                                setFilter((prev) => ({
                                    ...prev,
                                    maxPrice: Number(e.target.value),
                                }))
                            }
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 ml-auto">
                    <Button
                        onClick={clearFilter}
                        variant="outline"
                        className="px-6 py-3 text-lg font-semibold rounded-md bg-slate-900/10 border-slate-500/10"
                    >
                        Clear
                    </Button>
                    <Button
                        onClick={() => onSearch(filter)}
                        className="px-10 py-3 text-lg bg-blue-500 font-semibold rounded-md"
                    >
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FeedFilters;