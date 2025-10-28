"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils/cn";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export interface GenericPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  className?: string;
  showTotal?: boolean;
  showPageInfo?: boolean;
}

export function GenericPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = false,
  showFirstLast = true,
  maxVisiblePages = 5,
  className,
  showTotal = true,
  showPageInfo = true,
}: GenericPaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const half = Math.floor(maxVisiblePages / 2);

    pages.push(1); // luôn có trang đầu tiên

    if (currentPage > half + 1) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - half);
    const end = Math.min(totalPages - 1, currentPage + half);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - half - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
      onPageChange(1);
    }
  };

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {/* Thông tin tổng quan bên trái */}
      <div className="flex items-center gap-4">
        {showTotal && (
          <div className="text-sm text-muted-foreground">
            Tổng cộng: {totalItems.toLocaleString()} mục
          </div>
        )}

        {showPageInfo && totalItems > 0 && (
          <div className="text-sm text-muted-foreground">
            Hiển thị {startItem.toLocaleString()} - {endItem.toLocaleString()} /{" "}
            {totalItems.toLocaleString()} mục
          </div>
        )}
      </div>

      {/* Bộ điều hướng bên phải */}
      <div className="flex items-center gap-4">
        {/* Chọn số mục mỗi trang */}
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Hiển thị</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm bg-background"
              aria-label="Số mục mỗi trang"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-muted-foreground">mục/trang</span>
          </div>
        )}

        {/* Nút điều hướng trang */}
        <div className="flex items-center gap-3">
          {/* Nút về trang đầu */}
          {showFirstLast && (
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
              aria-label="Về trang đầu"
              className="h-8 w-8 cursor-pointer"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Nút lùi trang */}
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            aria-label="Trang trước"
            className="h-8 w-8 border border-[#FE6B6E] disabled:bg-opacity-100 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 text-[#FE6B6E]" />
          </Button>

          {/* Số trang */}
          {getVisiblePages().map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              disabled={page === "..."}
              onClick={() => typeof page === "number" && handlePageChange(page)}
              className={`h-8 w-8 border text-[#FE6B6E] duration-100 font-bold text-sm 
                ${
                  currentPage === page
                    ? "border-[#FE6B6E] bg-white hover:bg-white hover:border-[#FE6B6E] cursor-pointer-none"
                    : "border-none shadow-none"
                }
                `}
              aria-label={
                page === "..." ? "Nhiều trang hơn" : `Tới trang ${page}`
              }
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Button>
          ))}

          {/* Nút tiến trang */}
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            aria-label="Trang sau"
            className="h-8 w-8 border-[#FE6B6E] disabled:bg-opacity-100 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4 text-[#FE6B6E]" />
          </Button>

          {/* Nút tới trang cuối */}
          {showFirstLast && (
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
              aria-label="Tới trang cuối"
              className="h-8 w-8 cursor-pointer"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
