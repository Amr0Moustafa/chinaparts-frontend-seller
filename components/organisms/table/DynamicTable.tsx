"use client";

import React, { useEffect, useState } from "react";
import { FaRegEye, FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { BiEdit } from "react-icons/bi";
import { MdDeleteOutline, MdContentCopy } from "react-icons/md";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ProductDetailsDialog } from "../dialog/detailsproduct";
import { Package, CheckCircle, Truck } from "lucide-react";

import {
  ActionDialog,
  ApproveDialog,
  RejectDialog,
} from "../dialog/actiondialog";
import { FilterTabs } from "./TableFilter";
import { ProgressBar } from "@/components/atoms/ProgressBar";

type Column<T> = {
  header: string;
  accessor: keyof T;
};

type DynamicTableProps<T> = {
  title: string;
  columns: Column<T>[];
  data: T[];
  onShow?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onAccept?: (item: T) => void;
  onReject?: (item: T) => void;
  dialogshow?: boolean;
  dialogdelete?: boolean;
  dialogaccept?: boolean;
  dialogreject?: boolean;
  showFilters?: boolean;
  filters?: string[];
};

/* ------------------------
   Coupon / small cell components
   These will be used if your data contains coupon-like values.
   You can also use them directly in column renderers if preferred.
   ------------------------ */

type CouponRow = {
  code: string;
  title: string;
  subtitle?: string;
  discount?: string | { amount: string | number; type?: string };
  minOrder?: string | number;
};

function formatCurrency(v: string | number | undefined) {
  if (v == null) return "";
  if (typeof v === "number") return `$${v}`;
  if (typeof v === "string") {
    if (v.trim() === "") return "";
    if (/^\$/.test(v.trim())) return v;
    const num = Number(v);
    return Number.isFinite(num) ? `$${num}` : v;
  }
  return String(v);
}

/* Coupon code capsule with copy button */
export function CouponCodeCell({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore clipboard failures
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 text-sm text-gray-700 font-medium select-all">
        <span className="tracking-wider">{code}</span>
      </div>

      <button
        onClick={handleCopy}
        title={copied ? "Copied" : "Copy"}
        aria-label={copied ? "Copied" : `Copy coupon ${code}`}
        className={clsx(
          "p-1 rounded-md transition-colors",
          copied
            ? "bg-green-50 text-green-600"
            : "hover:bg-gray-100 text-gray-600"
        )}
      >
        {copied ? (
          <FaCheck className="w-4 h-4" />
        ) : (
          <MdContentCopy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

/* Title cell: bold orange title + small subtitle */
export function TitleCell({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="text-sm font-semibold text-orange-600 leading-tight">
        {title}
      </div>
      {subtitle ? (
        <div className="text-xs  text-gray-500 mt-1">{subtitle}</div>
      ) : null}
    </div>
  );
}

/* Discount cell: amount (orange) and small type below */
export function DiscountCell({
  discount,
}: {
  discount?: string | { amount: string | number; type?: string };
}) {
  if (!discount) return null;

  let amountText = "";
  let typeText = "";

  if (typeof discount === "string") {
    const pctMatch = discount.match(/(\d+%?)/);
    if (pctMatch) amountText = pctMatch[1];
    // try to detect explicit type words
    const typeMatch = discount.match(
      /(Percentage|Fixed Amount|Fixed|percentage|fixed amount)/i
    );
    if (typeMatch) typeText = typeMatch[1];
    else {
      // anything else after the amount that looks like a word
      const rest = discount.replace(amountText, "").trim();
      if (rest) typeText = rest;
    }
  } else {
    amountText = String(discount.amount);
    typeText = discount.type ?? "";
  }

  // If amount looks numeric (no %) and type contains fixed => show as currency
  if (!amountText.includes("%") && /fixed/i.test(typeText)) {
    const num = Number(amountText);
    if (Number.isFinite(num)) amountText = `$${num}`;
  }

  return (
    <div className="flex flex-col">
      <div className="text-sm font-semibold text-orange-600">{amountText}</div>
      {typeText ? (
        <div className="text-sm font-bold text-gray-500 mt-1">{typeText}</div>
      ) : null}
    </div>
  );
}

/* Min order small cell */
export function MinOrderCell({ minOrder }: { minOrder?: string | number }) {
  return (
    <div className="text-sm text-gray-700">{formatCurrency(minOrder)}</div>
  );
}

/* Full coupon row cell (if you want to render the whole row as a single composed component) */
export function CouponCell({ row }: { row: CouponRow }) {
  return (
    <div className="w-full flex items-start gap-6 py-2">
      <div className="w-36">
        <CouponCodeCell code={row.code} />
      </div>

      <div className="flex-1">
        <TitleCell title={row.title} subtitle={row.subtitle} />
      </div>

      <div className="w-36">
        <DiscountCell discount={row.discount} />
      </div>

      <div className="w-28">
        <MinOrderCell minOrder={row.minOrder} />
      </div>
    </div>
  );
}

/* ------------------------
   Main DynamicTable component
   ------------------------ */

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
  filters,
}: DynamicTableProps<T>) {
  const { i18n, t } = useTranslation();
  const direction = i18n.dir();
  const [activeFilter, setActiveFilter] = useState(filters?.[0] ?? "");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="bg-white shadow-md rounded-lg lg:p-4 p-2 ">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h4 className="text-lg lg:text-xl font-bold text-gray-800">{title}</h4>
        {showFilters && (
          <FilterTabs
            filters={filters ?? []}
            activeFilter={activeFilter}
            onChange={(f) => {
              setActiveFilter(f);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto  ">
          <table
            className="min-w-full divide-y divide-gray-200 text-sm"
            dir={direction}
          >
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={clsx(
                      "px-4 py-3 font-semibold text-gray-900 uppercase tracking-wider",
                      direction === "rtl" ? "text-right" : "text-left"
                    )}
                  >
                    {col.header}
                  </th>
                ))}
                {(onShow || onEdit || onDelete || onAccept || onReject) && (
                  <th className="px-4 py-3 font-semibold text-gray-900 uppercase tracking-wider">
                    {t("table.actions")}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50">
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={clsx(
                        "px-4 py-3 whitespace-nowrap align-top",
                        direction === "rtl" ? "text-right" : "text-left"
                      )}
                    >
                      {formatValue(row[col.accessor])}
                    </td>
                  ))}
                  {(onShow || onEdit || onDelete || onAccept || onReject) && (
                    <td className="px-4 py-3 whitespace-nowrap flex gap-2">
                      {onShow && (
                        dialogshow ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                onClick={() => onShow(row)}
                                className="text-gray-700 hover:underline"
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
                            className="text-gray-700 hover:underline"
                            aria-label={t("table.view")}
                          >
                            <FaRegEye className="w-5 h-5" />
                          </button>
                        )
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="text-blue-600 hover:underline"
                          aria-label={t("table.edit")}
                        >
                          <BiEdit className="w-5 h-5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="text-red-600 hover:underline"
                          aria-label={t("table.delete")}
                        >
                          <MdDeleteOutline className="w-5 h-5" />
                        </button>
                      )}
                      {onAccept && (
                        dialogaccept ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                onClick={() => onAccept(row)}
                                className="text-green-600 hover:underline"
                                aria-label={t("table.accept")}
                              >
                                <FaCheck className="w-5 h-5" />
                              </button>
                            </DialogTrigger>
                            <ApproveDialog
                              title="Approve Order"
                              description="Please confirm before shipment."
                              orderId={row.id}
                              onConfirm={() => onAccept(row)}
                            />
                          </Dialog>
                        ) : (
                          <button
                            onClick={() => onAccept(row)}
                            className="text-green-600 hover:underline"
                            aria-label={t("table.accept")}
                          >
                            <FaCheck className="w-5 h-5" />
                          </button>
                        )
                      )}
                      {onReject && (
                        dialogreject ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                onClick={() => onReject(row)}
                                className="text-red-600 hover:underline"
                                aria-label={t("table.reject")}
                              >
                                <IoClose className="w-5 h-5" />
                              </button>
                            </DialogTrigger>
                            <RejectDialog
                              title="Reject Order"
                              description="Please provide the reason."
                              orderId={row.id}
                              onConfirm={() => onReject(row)}
                            />
                          </Dialog>
                        ) : (
                          <button
                            onClick={() => onReject(row)}
                            className="text-red-600 hover:underline"
                            aria-label={t("table.reject")}
                          >
                            <IoClose className="w-5 h-5" />
                          </button>
                        )
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Stacked Cards */}
      <div className="md:hidden space-y-4" dir={direction}>
        {data.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex flex-col"
          >
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex justify-between mb-2 last:mb-0">
                <div className="text-[10px] font-semibold text-gray-500 uppercase">
                  {col.header}
                </div>
                <div>{formatValue(row[col.accessor])}</div>
              </div>
            ))}
            {(onShow || onEdit || onDelete || onAccept || onReject) && (
              <div className="mt-3 flex flex-wrap gap-3">
                {/* Action buttons same as desktop but with labels */}
                {/* ... keep same logic but with text-xs label */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------
   Value formatter
   - Handles numbers, common status badges, progress fractions,
   - coupon code capsule (short uppercase token),
   - discount strings (e.g., "15% Percentage" or "15 Fixed Amount"),
   - coupon object (if someone passes full row/object)
   ------------------------ */

function isCouponCodeLike(v: string) {
  // heuristic: short, uppercase letters/digits, hyphen/underscore allowed, no spaces
  return /^[A-Z0-9_-]{3,12}$/.test(v);
}
function isDateLike(v: string) {
  // Detects YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, etc.
  return /^\d{4}-\d{2}-\d{2}$/.test(v) || 
         /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(v) || 
         !isNaN(Date.parse(v));
}

function formatDateValue(v: string) {
  const date = new Date(v);
  if (isNaN(date.getTime())) return v; // fallback if invalid date
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function parseDiscountString(v: string) {
  // Try to extract amount and type
  const amtMatch = v.match(/(\d+%?|\$\d+(?:\.\d{1,2})?)/);
  const typeMatch = v.match(
    /(Percentage|Fixed Amount|Fixed|percentage|fixed amount|percentage type)/i
  );
  return {
    amount: amtMatch?.[1] ?? v,
    type: typeMatch?.[1] ?? v.replace(amtMatch?.[1] ?? "", "").trim(),
  };
}

function formatValue(value: any): React.ReactNode {
  // If someone passed a coupon-like object, render composed CouponCell
  if (
    value &&
    typeof value === "object" &&
    "code" in value &&
    "title" in value
  ) {
    const row: CouponRow = {
      code: String(value.code),
      title: String(value.title),
      subtitle: value.subtitle ?? value.subtitleText ?? value.description,
      discount: value.discount ?? value.discountText,
      minOrder: value.minOrder ?? value.min_order ?? value.min,
    };
    return <CouponCell row={row} />;
  }

  if (typeof value === "number") {
    return <span>{value}</span>;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    const lower = trimmed.toLowerCase();

    // Fraction / Usage pattern: "23/100"
    const frac = trimmed.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
    if (frac) {
      const num = parseInt(frac[1], 10);
      const den = parseInt(frac[2], 10);
      return <ProgressBar value={num} max={den} />;
    }
      if (isDateLike(trimmed)) {
    return <span className="text-sm text-gray-700">{formatDateValue(trimmed)}</span>;
  }
    // Coupon code capsule (heuristic)
    if (isCouponCodeLike(trimmed)) {
      return <CouponCodeCell code={trimmed} />;
    }
   


    // Discount patterns (e.g., "15% Percentage", "15 Fixed Amount", "$5 Fixed Amount", "15%")
    // only treat as discount when relatively short (avoids mis-detecting titles like "15% Off Brake Parts")
    if (
      trimmed.length <= 40 &&
      (trimmed.includes("%") || /\b(fixed|percentage|%|\$)\b/i.test(trimmed))
    ) {
      const { amount, type } = parseDiscountString(trimmed);
      // If parse yields amount equal to whole string and no explicit type, still render amount
      return <DiscountCell discount={type ? `${amount} ${type}` : amount} />;
    }

    // Status badges
    if (lower.includes("pending")) {
      return (
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-600">
          {value}
        </span>
      );
    }
    if (lower.includes("approved")) {
      return (
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-600">
          {value}
        </span>
      );
    }
    if (lower.includes("rejected")) {
      return (
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-600">
          {value}
        </span>
      );
    }
    if (lower.includes("processing")) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-blue-600">
          <Package className="w-4 h-4" /> {value}
        </span>
      );
    }

    if (lower.includes("shipped")) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-orange-50 text-orange-600">
          <Truck className="w-4 h-4" /> {value}
        </span>
      );
    }

    if (lower.includes("delivered")) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-green-600">
          <CheckCircle className="w-4 h-4" /> {value}
        </span>
      );
    }

    // active / inactive
    if (lower.includes("active")) {
      return (
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-600">
          {value}
        </span>
      );
    }
    if (lower.includes("inactive")) {
      return (
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-200 text-gray-500">
          {value}
        </span>
      );
    }

    // Units logic: "5 units", "0 units"
    if (trimmed.toLowerCase().includes("units")) {
      const number = parseInt(trimmed, 10);
      return (
        <span
          className={clsx(
            "text-xs font-semibold px-2 py-1 rounded-full",
            number > 0
              ? "bg-blue-100 text-blue-600"
              : "bg-orange-100 text-orange-600"
          )}
        >
          {value}
        </span>
      );
    }

    // Currency (min order) plain formatting when it looks like a number or starts with $
    if (/^\$?\d+(\.\d{1,2})?$/.test(trimmed)) {
      return (
        <span className="text-sm text-gray-700">{formatCurrency(trimmed)}</span>
      );
    }

    // For longer strings that look like a title/subtitle, render TitleCell-like view smartly
    // Heuristic: contains more than 2 words and includes "off" or is relatively long -> treat as title line
    if (trimmed.split(/\s+/).length >= 3 && /off/i.test(trimmed)) {
      // show first part bold orange, rest as subtitle if there's a linebreak
      const parts = trimmed.split(/\s*-\s*|\n/);
      const title = parts[0];
      const subtitle = parts.slice(1).join(" ").trim() || undefined;
      return <TitleCell title={title} subtitle={subtitle} />;
    }

    // fallback plain string
    return <span>{value}</span>;
  }

  return value;
}
