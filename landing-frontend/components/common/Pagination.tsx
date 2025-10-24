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
    onPageChange: (page: number, size: number) => void;
    pageSizeOptions?: number[];
}

const PaginationImpl = ({ meta, onPageChange, pageSizeOptions = [10, 15, 20, 25] }: PaginationProps) => {
    const [currentPage, setCurrentPage] = useState(meta.currentPage);
    const [currentSize, setCurrentSize] = useState(meta.pageSize);

    useEffect(() => {
        setCurrentPage(meta.currentPage);
        setCurrentSize(meta.pageSize);
    }, [meta.currentPage, meta.pageSize]);

    const handlePageChange = (page: number, size: number = currentSize) => {
        if (page < 1 || page > meta.totalPages || page === currentPage) return;
        setCurrentPage(page);
        setCurrentSize(size);
        onPageChange(page, size);
    };

    const handleSizeChange = (newSize: number) => {
        if (newSize === currentSize) return;

        // When page size changes, reset to first page to avoid invalid page numbers
        const newTotalPages = Math.ceil(meta.totalItems / newSize);
        const newPage = 1; // Reset to first page

        setCurrentPage(newPage);
        setCurrentSize(newSize);
        onPageChange(newPage, newSize);
    };

    const renderPages = () => {
        const pages: (number | string)[] = [];
        const { totalPages, currentPage } = meta;

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
                    key={`${page}-${idx}`}
                    isActive={currentPage === page}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </PaginationLink>
            ) : (
                <PaginationEllipsis key={`ellipsis-${idx}`} />
            )
        );
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
                <label htmlFor="page-size" className="text-sm text-gray-600">
                    Rows per page:
                </label>
                <select
                    id="page-size"
                    value={currentSize}
                    onChange={(e) => handleSizeChange(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {pageSizeOptions.map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            {/* Pagination Controls */}
            <Pagination className="flex items-center justify-center gap-2">
                <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    isActive={currentPage === 1}
                >
                    Previous
                </PaginationPrevious>

                {renderPages()}

                <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    isActive={currentPage === meta.totalPages}
                >
                    Next
                </PaginationNext>
            </Pagination>

            {/* Page Info */}
            <div className="text-sm text-gray-600">
                Showing {((currentPage-1) * currentSize)} to{" "}
                {Math.min((currentPage) * currentSize, meta.totalItems)} of{" "}
                {meta.totalItems} entries
            </div>
        </div>
    );
};

export default PaginationImpl;