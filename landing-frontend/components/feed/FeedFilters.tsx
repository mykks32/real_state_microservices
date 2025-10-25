"use client";

import React from "react";
import {IFilter} from "@/interfaces/common/IFilter";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import FeedFiltersContents from "@/components/feed/FeedFiltersContent";

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
                                                     isLoading,
                                                 }) => {
    return (
        <div>
            <div>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full md:hidden"
                    defaultValue="filter"
                >
                    <AccordionItem value="filter">
                        <div
                            className="w-full shadow-lg border bg-slate-900/10 border-slate-900/10 rounded-2xl py-2 px-4 sm:p-4 flex flex-col gap-5 mb-8">
                            <AccordionTrigger className="py-2">Filters</AccordionTrigger>
                            <AccordionContent>
                                <FeedFiltersContents
                                    filter={filter}
                                    setFilter={setFilter}
                                    clearFilter={clearFilter}
                                    onSearch={onSearch}
                                    isLoading={isLoading}
                                />
                            </AccordionContent>
                        </div>
                    </AccordionItem>
                </Accordion>
                <div></div>
                {/* Always visible content on large screens */}
                <div className="hidden md:block w-full">
                    <div
                        className="w-full shadow-lg border bg-slate-900/10 border-slate-900/10 rounded-2xl py-2 px-4 sm:p-4 flex flex-col gap-5 mb-8">
                        <FeedFiltersContents
                            filter={filter}
                            setFilter={setFilter}
                            clearFilter={clearFilter}
                            onSearch={onSearch}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedFilters;