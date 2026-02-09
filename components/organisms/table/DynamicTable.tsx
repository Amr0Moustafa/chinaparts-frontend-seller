"use client";

import React, { useMemo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { FaRegEye, FaCheck } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ApproveDialog, RejectDialog } from "../dialog/actiondialog";
import { ProductDetailsDialog } from "../dialog/detailsproduct";

/* ==================== Types ==================== */
export interface Column<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

export interface DynamicTableProps<T extends Record<string, any>> {
  title: string;
  columns: Column<T>[];
  data: T[];
  
  // Action handlers
  onShow?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onAccept?: (row: T) => void | Promise<void>;
  onReject?: (row: T) => void | Promise<void>;
  
  // Dialog options
  dialogshow?: boolean;
  dialogdelete?: boolean;
  dialogaccept?: boolean;
  dialogreject?: boolean;
  
  // Filters
  showFilters?: boolean;
  filters?: string[];
  
  // Pagination
  showPagination?: boolean;
  itemsPerPage?: number;
  
  // Loading state
  isLoading?: boolean;
  
  // Empty state
  emptyMessage?: string;
}

/* ==================== Filter Tabs Component ==================== */
interface FilterTabsProps {
  filters: string[];
  activeFilter: string;
  onChange: (filter: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = React.memo(({ 
  filters, 
  activeFilter, 
  onChange 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={clsx(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            activeFilter === filter
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          {t(`filters.${filter}`)}
        </button>
      ))}
    </div>
  );
});

FilterTabs.displayName = "FilterTabs";

/* ==================== Action Buttons Component ==================== */
interface ActionButtonsProps<T> {
  row: T;
  onShow?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onAccept?: (row: T) => void | Promise<void>;
  onReject?: (row: T) => void | Promise<void>;
  dialogshow?: boolean;
  dialogdelete?: boolean;
  dialogaccept?: boolean;
  dialogreject?: boolean;
}

function ActionButtons<T extends Record<string, any>>({
  row,
  onShow,
  onEdit,
  onDelete,
  onAccept,
  onReject,
  dialogshow,
  dialogdelete,
  dialogaccept,
  dialogreject,
}: ActionButtonsProps<T>) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");

  const handleAcceptConfirm = async () => {
    if (onAccept) {
      await onAccept(row);
      setIsDialogOpen(false);
    }
  };

  const handleRejectConfirm = async (notes?: string) => {
    if (onReject) {
      // Pass the row with notes to the handler
      await onReject({ ...row, reject_notes: notes || rejectNotes });
      setRejectDialogOpen(false);
      setRejectNotes(""); // Clear notes after submission
    }
  };

  return (
    <div className="flex gap-2">
      {/* Show/View Button */}
      {onShow && (
        dialogshow ? (
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="text-gray-700 hover:text-gray-900 transition-colors"
                aria-label={t("table.view")}
              >
                <FaRegEye className="w-5 h-5" />
              </button>
            </DialogTrigger>
            <ProductDetailsDialog product={row} />
          </Dialog>
        ) : (
          <button
            onClick={() => onShow(row)}
            className="text-gray-700 hover:text-gray-900 transition-colors"
            aria-label={t("table.view")}
          >
            <FaRegEye className="w-5 h-5" />
          </button>
        )
      )}

      {/* Edit Button */}
      {onEdit && (
        <button
          onClick={() => onEdit(row)}
          className="text-blue-600 hover:text-blue-800 transition-colors"
          aria-label={t("table.edit")}
        >
          <BiEdit className="w-5 h-5" />
        </button>
      )}

      {/* Delete Button */}
      {onDelete && (
        dialogdelete ? (
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="text-red-600 hover:text-red-800 transition-colors"
                aria-label={t("table.delete")}
              >
                <MdDeleteOutline className="w-5 h-5" />
              </button>
            </DialogTrigger>
            {/* Add DeleteDialog component */}
          </Dialog>
        ) : (
          <button
            onClick={() => onDelete(row)}
            className="text-red-600 hover:text-red-800 transition-colors"
            aria-label={t("table.delete")}
          >
            <MdDeleteOutline className="w-5 h-5" />
          </button>
        )
      )}

      {/* Accept Button */}
      {onAccept && (
        dialogaccept ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                className="text-green-600 hover:text-green-800 transition-colors"
                aria-label={t("table.accept")}
              >
                <FaCheck className="w-5 h-5" />
              </button>
            </DialogTrigger>
            <ApproveDialog
              title={t("dialog.approve.title")}
              description={t("dialog.approve.description")}
              orderId={row.id}
              onConfirm={handleAcceptConfirm}
            />
          </Dialog>
        ) : (
          <button
            onClick={() => onAccept(row)}
            className="text-green-600 hover:text-green-800 transition-colors"
            aria-label={t("table.accept")}
          >
            <FaCheck className="w-5 h-5" />
          </button>
        )
      )}

      {/* Reject Button */}
      {onReject && (
        dialogreject ? (
          <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
            <DialogTrigger asChild>
              <button
                className="text-red-600 hover:text-red-800 transition-colors"
                aria-label={t("table.reject")}
              >
                <IoClose className="w-5 h-5" />
              </button>
            </DialogTrigger>
            <RejectDialog
              title={t("dialog.reject.title")}
              description={t("dialog.reject.description")}
              orderId={row.id}
              onConfirm={handleRejectConfirm}
            />
          </Dialog>
        ) : (
          <button
            onClick={() => onReject(row)}
            className="text-red-600 hover:text-red-800 transition-colors"
            aria-label={t("table.reject")}
          >
            <IoClose className="w-5 h-5" />
          </button>
        )
      )}
    </div>
  );
}

/* ==================== Helper Functions ==================== */
const formatValue = (value: any): React.ReactNode => {
  if (value === null || value === undefined) return "—";
  if (React.isValidElement(value)) return value;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const getCellValue = <T,>(
  row: T, 
  accessor: keyof T | ((row: T) => React.ReactNode)
): React.ReactNode => {
  if (typeof accessor === "function") {
    return accessor(row);
  }
  const value = row[accessor];
  return formatValue(value);
};

/* ==================== Main Component ==================== */
export function DynamicTable<T extends Record<string, any>>({
  title,
  columns,
  data,
  onShow,
  onEdit,
  onDelete,
  onAccept,
  onReject,
  dialogshow,
  dialogdelete,
  dialogaccept,
  dialogreject,
  showFilters = false,
  filters = [],
  showPagination = false,
  itemsPerPage = 10,
  isLoading = false,
  emptyMessage,
}: DynamicTableProps<T>) {
  const { i18n, t } = useTranslation();
  const direction = i18n.dir();
  
  /* ------------------ State ------------------ */
  const [activeFilter, setActiveFilter] = useState(filters[0] ?? "");
  const [currentPage, setCurrentPage] = useState(1);

  /* ------------------ Computed Values ------------------ */
  const hasActions = Boolean(onShow || onEdit || onDelete || onAccept || onReject);

  // Filtered data
  const filteredData = useMemo(() => {
    if (!showFilters || !activeFilter) return data;
    // Add your filter logic here
    return data;
  }, [data, activeFilter, showFilters]);

  // Paginated data
  const paginatedData = useMemo(() => {
    if (!showPagination) return filteredData;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage, showPagination]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  /* ------------------ Handlers ------------------ */
  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  /* ------------------ Render ------------------ */
  return (
    <div className="bg-white shadow-md rounded-lg lg:p-4 p-2">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h4 className="text-lg lg:text-xl font-bold text-gray-800">{title}</h4>
        {showFilters && (
          <FilterTabs
            filters={filters}
            activeFilter={activeFilter}
            onChange={handleFilterChange}
          />
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
        </div>
      ) : paginatedData.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p className="text-lg font-medium">{emptyMessage || t("table.noData")}</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table
                className="min-w-full divide-y divide-gray-200 text-sm"
                dir={direction}
              >
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.id}
                        className={clsx(
                          "px-4 py-3 font-semibold text-gray-900 uppercase tracking-wider",
                          direction === "rtl" ? "text-right" : "text-left",
                          col.className
                        )}
                      >
                        {col.header}
                      </th>
                    ))}
                    {hasActions && (
                      <th className="px-4 py-3 font-semibold text-gray-900 uppercase tracking-wider">
                        {t("table.actions")}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedData.map((row, rowIdx) => (
                    <tr key={row.id || rowIdx} className="hover:bg-gray-50 transition-colors">
                      {columns.map((col) => (
                        <td
                          key={col.id}
                          className={clsx(
                            "px-4 py-3 whitespace-nowrap",
                            direction === "rtl" ? "text-right" : "text-left",
                            col.className
                          )}
                        >
                          {formatValue(getCellValue(row, col.accessor))}
                        </td>
                      ))}
                      {hasActions && (
                        <td className="px-4 py-3 whitespace-nowrap">
                          <ActionButtons
                            row={row}
                            onShow={onShow}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAccept={onAccept}
                            onReject={onReject}
                            dialogshow={dialogshow}
                            dialogdelete={dialogdelete}
                            dialogaccept={dialogaccept}
                            dialogreject={dialogreject}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4" dir={direction}>
            {paginatedData.map((row, rowIdx) => (
              <div
                key={row.id || rowIdx}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
              >
                {columns.map((col) => (
                  <div key={col.id} className="flex justify-between mb-2 last:mb-0">
                    <div className="text-xs font-semibold text-gray-500 uppercase">
                      {col.header}
                    </div>
                    <div className="text-sm">
                      {formatValue(getCellValue(row, col.accessor))}
                    </div>
                  </div>
                ))}
                {hasActions && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <ActionButtons
                      row={row}
                      onShow={onShow}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onAccept={onAccept}
                      onReject={onReject}
                      dialogshow={dialogshow}
                      dialogdelete={dialogdelete}
                      dialogaccept={dialogaccept}
                      dialogreject={dialogreject}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {showPagination && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {t("table.showing")} {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} {t("table.of")}{" "}
                {filteredData.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                  {t("table.previous")}
                </button>
                <span className="px-3 py-1">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                  {t("table.next")}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}