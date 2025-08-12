"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { HiOutlineChevronLeft } from "react-icons/hi";

interface StyledPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showText?: boolean;
  buttonWrapperClassName?: string;
}

export const StyledPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showText = false,
  buttonWrapperClassName = "flex justify-center"
}: StyledPaginationProps) => {
  const { t, i18n } = useTranslation("common");
  const direction = i18n.dir();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={cn(className)}>
      <div
        className={cn(
          buttonWrapperClassName,
          "items-center flex-wrap gap-2",
         
        )}
      >
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "flex items-center gap-1 px-3 h-9  border border-gray-300 bg-gray-200 text-sm font-medium text-gray-700",
            currentPage === 1 && "pointer-events-none opacity-50",
            "hover:bg-gray-300 transition"
          )}
        >
          {/* Chevron flips for RTL */}
          <HiOutlineChevronLeft className={`w-4 h-4  ${direction === "rtl" ? "rotate-180" : "rotate-0 "} `} />
          {showText && t("pagination.prev")}
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {getPageNumbers().map((page, index) => (
            <span key={index}>
              {page === "..." ? (
                <span className="px-2 text-gray-400">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={cn(
                    "w-9 h-9  text-sm text-center font-semibold",
                    page === currentPage
                      ? "bg-[var(--theme-color-accent)] text-white"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  )}
                >
                  {page}
                </button>
              )}
            </span>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "flex items-center gap-1 px-3 h-9 border border-gray-300 bg-gray-200 text-sm font-medium text-gray-700",
            currentPage === totalPages && "pointer-events-none opacity-50",
            "hover:bg-gray-300 transition"
          )}
        >
          {showText && t("pagination.next")}
          {/* Reverse chevron for LTR/RTL */}
          <HiOutlineChevronLeft className={`w-4 h-4  ${direction === "rtl" ? "rotate-0" : "rotate-180 "} `} />
        </button>
      </div>
    </div>
  );
};
