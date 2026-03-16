"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetWalletReservesQuery } from "@/features/wallet";
import type { WalletReserveFilters } from "@/features/wallet";

// -------------------------------------------------------
// Types
// -------------------------------------------------------

interface ReserveEntry {
  id: string;
  reserveId: string;
  sub_order_id: string;
  amount: string;
  hold_date: string;
  release_date: string;
  status: "held" | "released";
}

// -------------------------------------------------------
// Icons
// -------------------------------------------------------

const ChevronLeft = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRight = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const ChevronRightSmall = () => (
  <svg
    width="12"
    height="12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const ChevronLeftSmall = () => (
  <svg
    width="12"
    height="12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const InfoIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" d="M12 16v-4m0-4h.01" />
  </svg>
);
const CalendarIcon = () => (
  <svg
    width="13"
    height="13"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const LockIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path strokeLinecap="round" d="M8 11V7a4 4 0 018 0v4" />
  </svg>
);

// -------------------------------------------------------
// Skeletons
// -------------------------------------------------------

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="py-3 px-3">
          <div className="h-3 bg-gray-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// -------------------------------------------------------
// Status Badge
// -------------------------------------------------------

function StatusBadge({ status }: { status: ReserveEntry["status"] }) {
  const { t } = useTranslation();
  if (status === "released") {
    return (
      <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
        {t("reserve.status_labels.released")}
      </span>
    );
  }
  return (
    <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
      {t("reserve.status_labels.held")}
    </span>
  );
}

// -------------------------------------------------------
// Main Component
// -------------------------------------------------------

export default function ReserveDetails() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const PAGE_SIZE = 16;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters] = useState<WalletReserveFilters>({});

  // ── RTK Query ──
  const {
    data: reserveData,
    isLoading,
    isError,
  } = useGetWalletReservesQuery(
    { ...filters, page: currentPage, per_page: PAGE_SIZE },
    { refetchOnMountOrArgChange: true },
  );

  // ── Derived ──
  // Safely extract array from any nesting the API might return
  const rawReserves = reserveData?.data?.reserves ?? [];
  const reserves: ReserveEntry[] = Array.isArray(rawReserves)
    ? rawReserves
    : [];

  const totalItems: number =
    reserveData?.data?.total ??
    reserveData?.meta?.total ??
    reserveData?.total ??
    reserves.length;

  const totalHeld: string = reserveData?.data?.total_held ?? "0";

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  // breadcrumb chevron based on direction
  const BreadcrumbSep = () =>
    isRTL ? <ChevronLeftSmall /> : <ChevronRightSmall />;

  return (
    <div
      className="min-h-screen font-sans text-gray-800"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <main className="p-6 space-y-5 mx-auto">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="hover:text-orange-500 cursor-pointer transition-colors">
            {t("reserve.breadcrumb.merchant")}
          </span>
          <BreadcrumbSep />
          <span className="hover:text-orange-500 cursor-pointer transition-colors">
            {t("reserve.breadcrumb.wallet_overview")}
          </span>
          <BreadcrumbSep />
          <span className="text-orange-500 font-medium">
            {t("reserve.breadcrumb.reserve_details")}
          </span>
        </nav>

        {/* ── Page Header ── */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t("reserve.title")}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {t("reserve.subtitle")}
          </p>
        </div>

        {/* ── Top Section ── */}
        <div className="flex gap-4 flex-wrap">
          {/* Total held card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 min-w-[180px]">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
              <LockIcon />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">
                {t("reserve.total_held_label")}
              </p>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">
                {totalHeld}
              </p>
            </div>
          </div>

          {/* Info banner */}
          <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 min-w-[260px]">
            <div className="text-blue-500 mt-0.5 shrink-0">
              <InfoIcon />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">
                {t("reserve.info.title")}
              </p>
              <p className="text-xs text-blue-700 leading-relaxed">
                {t("reserve.info.description")}
              </p>
            </div>
          </div>
        </div>

        {/* ── Reserve Table ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {(
                    [
                      "reserve_id",
                      "order_id",
                      "amount",
                      "hold_date",
                      "release_date",
                      "status",
                    ] as const
                  ).map((col) => (
                    <th
                      key={col}
                      className="text-left py-2 px-3 text-[11px] font-bold tracking-widest text-gray-400 uppercase whitespace-nowrap"
                    >
                      {t(`reserve.columns.${col}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-sm text-red-500"
                    >
                      {t("reserve.error")}
                    </td>
                  </tr>
                ) : reserves.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-sm text-gray-400"
                    >
                      {t("reserve.empty")}
                    </td>
                  </tr>
                ) : (
                  reserves.map((row: ReserveEntry) => (
                    <tr
                      key={row.id}
                      className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="py-3 px-3 text-xs text-gray-700 font-medium">
                        {row.id}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs text-orange-500 hover:text-orange-600 cursor-pointer font-medium underline underline-offset-2">
                          {row.sub_order_id}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs font-semibold text-gray-800">
                        {row.amount}
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-600">
                        {row.hold_date}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 text-xs text-orange-500 font-medium">
                          <CalendarIcon />
                          <span className="underline underline-offset-2 cursor-pointer hover:text-orange-600">
                            {row.release_date}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isRTL ? <ChevronRight /> : <ChevronLeft />}
              </button>

              {Array.from(
                { length: Math.min(totalPages, 5) },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 flex items-center justify-center rounded text-xs font-semibold transition-colors ${
                    currentPage === page
                      ? "bg-orange-500 text-white border border-orange-500"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isRTL ? <ChevronLeft /> : <ChevronRight />}
              </button>
            </div>

            <p className="text-xs text-gray-400">
              {t("reserve.pagination.showing")}{" "}
              {totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, totalItems)}{" "}
              {t("reserve.pagination.of")} {totalItems}{" "}
              {t("reserve.pagination.reserves")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
