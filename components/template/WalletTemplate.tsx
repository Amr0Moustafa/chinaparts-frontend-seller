"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock2, Settings } from "lucide-react";

import {
  useGetWalletQuery,
  useGetWalletTransactionsQuery,
} from "@/features/wallet";
import type { WalletTransactionFilters } from "@/features/wallet";

// -------------------------------------------------------
// Types
// -------------------------------------------------------

interface LedgerEntry {
  id: string;
  date: string;
  type: string;
  type_label:string;
  reference_id: string;
  amount: string;
  bucket: "Payable" | "Pending" | "Reserve" | "Disputes";
  bucket_label:string
}

// -------------------------------------------------------
// Bucket Badge
// -------------------------------------------------------

const bucketStyles: Record<string, string> = {
  Payable: "bg-green-100 text-green-700 border border-green-200",
  Pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Reserved: "bg-blue-100 text-blue-700 border border-blue-200",
  Disputes: "bg-red-100 text-red-700 border border-red-200",
};

function BucketBadge({ type }: { type: LedgerEntry["bucket_label"] }) {
  const { t } = useTranslation();
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${bucketStyles[type]}`}>
      {t(`wallet.bucket_labels.${type}`)}
    </span>
  );
}

// -------------------------------------------------------
// Stat Card
// -------------------------------------------------------

function StatCard({
  label,
  amount,
  icon,
  iconColor,
  negative,
}: {
  label: string;
  amount: string;
  icon: React.ReactNode;
  iconColor: string;
  negative?: boolean;
}) {
  return (
    <div
      className={`flex-1 rounded-xl p-4 border ${
        negative ? "bg-red-50 border-red-300" : "bg-white border-gray-200"
      } shadow-sm min-w-[140px]`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${negative ? "text-red-600" : "text-gray-500"}`}>
          {label}
        </span>
        <span className={iconColor}>{icon}</span>
      </div>
      <p className={`text-lg font-bold tracking-tight ${negative ? "text-red-600" : "text-gray-900"}`}>
        {amount}
      </p>
    </div>
  );
}

// -------------------------------------------------------
// Skeletons
// -------------------------------------------------------

function SkeletonCard() {
  return (
    <div className="flex-1 rounded-xl p-4 border bg-white border-gray-200 shadow-sm min-w-[140px] animate-pulse">
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
      <div className="h-5 bg-gray-100 rounded w-3/4" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="py-3 px-3">
          <div className="h-3 bg-gray-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// -------------------------------------------------------
// Inline Icons
// -------------------------------------------------------

const CheckIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" d="M12 6v6l4 2" />
  </svg>
);
const AlertIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// -------------------------------------------------------
// Main Template
// -------------------------------------------------------

export const WalletTemplate = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const PAGE_SIZE = 16;

  // ── State ──
  const [payoutMethod, setPayoutMethod] = useState<"manual" | "automatic">("manual");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters] = useState<WalletTransactionFilters>({});

  // ── RTK Query ──
  const {
    data: walletData,
    isLoading: walletLoading,
    isError: walletError,
  } = useGetWalletQuery();

  const {
    data: txData,
    isLoading: txLoading,
    isError: txError,
  } = useGetWalletTransactionsQuery(
    { ...filters, page: currentPage, per_page: PAGE_SIZE },
    { refetchOnMountOrArgChange: true }
  );
  

  // ── Derived ──
  const wallet = walletData?.data ?? walletData;
  const transactions: LedgerEntry[] =
    txData?.data?.data ?? txData?.data ?? txData ?? [];
  const totalItems: number =
    txData?.data?.total ?? txData?.total ?? transactions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const stats = {
    payable:          wallet?.payable_balance  ?? "0.00",
    pending:          wallet?.pending_balance  ?? "0.00",
    reserved:         wallet?.reserved_balance ?? "0.00",
    disputes:         wallet?.disputes_balance ?? "0.00",
    negative_balance: wallet?.negative_balance ??  "0.00",
  };

  return (
    <div className="min-h-screen space-y-6" dir={isRTL ? "rtl" : "ltr"}>

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg md:text-2xl font-bold text-gray-900">
            {t("wallet.title")}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {t("wallet.subtitle")}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm">
          <Clock2 className="w-4 h-4" />
          {t("wallet.available_24")}
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="flex gap-4 flex-wrap">
        {walletLoading ? (
          [1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)
        ) : walletError ? (
          <p className="text-sm text-red-500">{t("wallet.error")}</p>
        ) : (
          <>
            <StatCard
              label={t("wallet.stats.payable")}
              amount={stats.payable}
              icon={<CheckIcon />}
              iconColor="text-green-500 bg-green-200 p-1 rounded-full"
            />
            <StatCard
              label={t("wallet.stats.pending")}
              amount={stats.pending}
              icon={<ClockIcon />}
              iconColor="text-yellow-500 bg-yellow-200 p-1 rounded-full"
            />
            <StatCard
              label={t("wallet.stats.reserved")}
              amount={stats.reserved}
              icon={<ClockIcon />}
              iconColor="text-blue-500 bg-blue-200 p-1 rounded-full"
            />
            <StatCard
              label={t("wallet.stats.disputes")}
              amount={stats.disputes}
              icon={<AlertIcon />}
              iconColor="text-orange-500 bg-orange-200 p-1 rounded-full"
            />
            <StatCard
              label={t("wallet.stats.negative_balance")}
              amount={stats.negative_balance}
              icon={<AlertIcon />}
              iconColor="text-red-500 bg-red-200 p-1 rounded-full"
              negative
            />
          </>
        )}
      </div>

      {/* ── Payout Method ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {t("wallet.payout_method.title")}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          {t("wallet.payout_method.description")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Manual */}
          <label
            className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              payoutMethod === "manual"
                ? "border-orange-400 bg-orange-50"
                : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="payout"
              value="manual"
              checked={payoutMethod === "manual"}
              onChange={() => setPayoutMethod("manual")}
              className="mt-0.5 accent-orange-500"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {t("wallet.payout_method.manual_title")}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {t("wallet.payout_method.manual_desc")}
              </p>
            </div>
          </label>

          {/* Automatic */}
          <label
            className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              payoutMethod === "automatic"
                ? "border-orange-400 bg-orange-50"
                : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="payout"
              value="automatic"
              checked={payoutMethod === "automatic"}
              onChange={() => setPayoutMethod("automatic")}
              className="mt-0.5 accent-orange-500"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {t("wallet.payout_method.auto_title")}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {t("wallet.payout_method.auto_desc")}
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* ── Ledger ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              {t("wallet.ledger.title")}
            </h2>
            <p className="text-xs text-gray-500">
              {t("wallet.ledger.description")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
              <SearchIcon />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <DownloadIcon />
              {t("wallet.ledger.export")}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {(["date", "type", "reference", "amount", "bucket"] as const).map((col) => (
                  <th
                    key={col}
                    className="text-left py-2 px-3 text-[11px] font-bold tracking-widest text-gray-400 uppercase"
                  >
                    {t(`wallet.ledger.columns.${col}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {txLoading ? (
                [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)
              ) : txError ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-sm text-red-500">
                    {t("wallet.ledger.error")}
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-sm text-gray-400">
                    {t("wallet.ledger.empty")}
                  </td>
                </tr>
              ) : (
                transactions.map((row: LedgerEntry) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="py-3 px-3 text-gray-600 text-xs">{row.date}</td>
                    <td className="py-3 px-3 text-xs font-medium text-gray-800">{row.type_label}</td>
                    <td className="py-3 px-3">
                      <span className="text-xs text-orange-500 hover:text-orange-600 cursor-pointer font-medium underline underline-offset-2">
                        {row.reference_id}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs font-semibold text-gray-800">{row.amount}</td>
                    <td className="py-3 px-3">
                      <BucketBadge type={row.bucket_label} />
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

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isRTL ? <ChevronLeft /> : <ChevronRight />}
            </button>
          </div>

          <span className="text-sm text-gray-500">
            {t("wallet.pagination.showing")}{" "}
            {totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, totalItems)}{" "}
            {t("wallet.pagination.of")} {totalItems}{" "}
            {t("wallet.pagination.transactions")}
          </span>
        </div>
      </div>

    </div>
  );
};