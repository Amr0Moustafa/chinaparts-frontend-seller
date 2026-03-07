"use client"


import { Clock2, Settings } from "lucide-react";
import { useState } from "react";

// Types
interface LedgerEntry {
  id: string;
  date: string;
  type: string;
  reference: string;
  amount: string;
  bucket: "Payable" | "Pending" | "Reserve" | "Disputes";
}

// Mock Data
const ledgerData: LedgerEntry[] = [
  { id: "1", date: "2026-01-15", type: "Order Payment", reference: "PB-2024-001", amount: "245,800.50 SAR", bucket: "Payable" },
  { id: "2", date: "2026-01-15", type: "Order Payment", reference: "PB-2024-001", amount: "245,800.50 SAR", bucket: "Pending" },
  { id: "3", date: "2026-01-15", type: "Chargeback", reference: "PB-2024-001", amount: "245,800.50 SAR", bucket: "Reserve" },
  { id: "4", date: "2026-01-15", type: "Order Payment", reference: "PB-2024-001", amount: "245,800.50 SAR", bucket: "Disputes" },
  { id: "5", date: "2026-01-15", type: "Order Payment", reference: "PB-2024-001", amount: "245,800.50 SAR", bucket: "Payable" },
];

const bucketStyles: Record<string, string> = {
  Payable: "bg-green-100 text-green-700 border border-green-200",
  Pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Reserve: "bg-blue-100 text-blue-700 border border-blue-200",
  Disputes: "bg-red-100 text-red-700 border border-red-200",
};

// Stat Card
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
        negative
          ? "bg-red-50 border-red-300"
          : "bg-white border-gray-200"
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

// Badge
function Bucket({ type }: { type: LedgerEntry["bucket"] }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${bucketStyles[type]}`}>
      {type}
    </span>
  );
}

// Icons (inline SVG)
const CheckIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="5" y="11" width="14" height="10" rx="2" /><path strokeLinecap="round" d="M8 11V7a4 4 0 018 0v4" />
  </svg>
);
const AlertIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
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

// Main Component
export default function WalletTemplate() {
  const [payoutMethod, setPayoutMethod] = useState<"manual" | "automatic">("manual");
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = 24;
  const itemsPerPage = 16;

  return (
    <div className="flex h-screen  font-sans text-gray-800 overflow-hidden">
      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Page header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Wallet Overview</h1>
              <p className="text-sm text-gray-500 mt-0.5">Analyze your performance and track growth</p>
            </div>
            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm">
              <Clock2  className="w-4 h-4 " />
              Available 24 hours before payout
            </button>
          </div>

          {/* Stat Cards */}
          <div className="flex gap-4 flex-wrap">
            <StatCard
              label="Payable"
              amount="128,750.50 SAR"
              icon={<CheckIcon />}
              iconColor="text-green-500 bg-green-200 p-1 rounded-full"
            />
            <StatCard
              label="Pending"
              amount="45,200.00 SAR"
              icon={<ClockIcon />}
              iconColor="text-yellow-500 bg-yellow-200 p-1 rounded-full"
            />
            <StatCard
              label="Reserved"
              amount="18,900.00 SAR"
              icon={<ClockIcon />}
              iconColor="text-blue-500 bg-blue-200 p-1 rounded-full"
            />
            <StatCard
              label="Disputes"
              amount="3,400.00 SAR"
              icon={<AlertIcon />}
              iconColor="text-orange-500 bg-orange-200 p-1 rounded-full"
            />
            <StatCard
              label="Negative Balance"
              amount="-2,100.00 SAR"
              icon={<AlertIcon />}
              iconColor="text-red-500 bg-red-200 p-1 rounded-full"
              negative
            />
          </div>

          {/* Payout Method */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6  rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 " />
              </div>
              <span className="text-sm font-semibold text-gray-800"> 
                Payout Method
                </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Choose to receive your earnings automatically every week or request withdrawals manually.
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
                  <p className="text-sm font-semibold text-gray-800">Manual Withdrawal Request</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    You request withdrawal yourself during the 24-hour window before payout.
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
                  <p className="text-sm font-semibold text-gray-800">Automatic Weekly Transfer</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Your payable balance is transferred automatically every Thursday.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Ledger */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Ledger</h2>
                <p className="text-xs text-gray-500">View all financial transactions related to your wallet.</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                  <SearchIcon />
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <DownloadIcon />
                  Export Statement
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["DATE", "TYPE", "REFERENCE", "AMOUNT", "BUCKET"].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-3 text-[11px] font-bold tracking-widest text-gray-400 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ledgerData.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-50 hover:bg-gray-50/70 transition-colors ${
                        i % 2 === 0 ? "" : ""
                      }`}
                    >
                      <td className="py-3 px-3 text-gray-600 text-xs">{row.date}</td>
                      <td className="py-3 px-3 text-xs font-medium text-gray-800">{row.type}</td>
                      <td className="py-3 px-3">
                        <span className="text-xs text-orange-500 hover:text-orange-600 cursor-pointer font-medium underline underline-offset-2">
                          {row.reference}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs font-semibold text-gray-800">{row.amount}</td>
                      <td className="py-3 px-3">
                        <Bucket type={row.bucket} />
                      </td>
                    </tr>
                  ))}
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
                  <ChevronLeft />
                </button>
                {[1, 2].map((page) => (
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
                  onClick={() => setCurrentPage((p) => Math.min(2, p + 1))}
                  disabled={currentPage === 2}
                  className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight />
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} products
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}