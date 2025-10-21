"use client";

import { useState, useEffect } from "react";
import {
    Pagination,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationProps {
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
    onPageChange: (page: number) => void;
}

const PaginationImpl = ({ meta, onPageChange }: PaginationProps) => {
    const [currentPage, setCurrentPage] = useState(meta.currentPage);

    useEffect(() => {
        setCurrentPage(meta.currentPage);
    }, [meta.currentPage]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > meta.totalPages) return;
        setCurrentPage(page);
        onPageChange(page);
    };

    const renderPages = () => {
        const pages: (number | string)[] = [];
        const { totalPages } = meta;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, "...", totalPages);
            } else if (currentPage > totalPages - 4) {
                pages.push(
                    1,
                    "...",
                    totalPages - 4,
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                );
            } else {
                pages.push(
                    1,
                    "...",
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    "...",
                    totalPages
                );
            }
        }

        return pages.map((page, idx) =>
            typeof page === "number" ? (
                <PaginationLink
                    key={idx}
                    isActive={currentPage === page}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </PaginationLink>
            ) : (
                <PaginationEllipsis key={idx} />
            )
        );
    };

    return (
        <Pagination className="flex items-center justify-center gap-2 mt-6">
            <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                isActive={currentPage !== 1}
            >
                Previous
            </PaginationPrevious>

            {renderPages()}

            <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                isActive={currentPage !== meta.totalPages}
            >
                Next
            </PaginationNext>
        </Pagination>
    );
};

export default PaginationImpl;