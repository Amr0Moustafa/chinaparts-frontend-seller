"use client"
import { useState } from "react";

// Types
interface ReserveEntry {
  id: string;
  reserveId: string;
  orderId: string;
  amount: string;
  holdDate: string;
  releaseDate: string;
  status: "held" | "released";
}

// Mock Data
const reserveData: ReserveEntry[] = [
  { id: "1", reserveId: "RSV-128", orderId: "ORD-9642", amount: "62.58 SAR", holdDate: "2026-01-15", releaseDate: "2026-02-14 13", status: "held" },
  { id: "2", reserveId: "RSV-128", orderId: "ORD-9643", amount: "60.58 SAR", holdDate: "2026-01-15", releaseDate: "2026-02-22 11", status: "held" },
  { id: "3", reserveId: "RSV-128", orderId: "ORD-9642", amount: "62.58 SAR", holdDate: "2026-01-15", releaseDate: "2026-02-22 13", status: "held" },
  { id: "4", reserveId: "RSV-128", orderId: "ORD-9643", amount: "62.58 SAR", holdDate: "2026-01-15", releaseDate: "2026-02-14 13", status: "held" },
  { id: "5", reserveId: "RSV-128", orderId: "ORD-9642", amount: "62.58 SAR", holdDate: "2026-01-15", releaseDate: "2026-02-14 12", status: "released" },
];

// Icons
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
const ChevronRightSmall = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const InfoIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" d="M12 16v-4m0-4h.01" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const LockIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path strokeLinecap="round" d="M8 11V7a4 4 0 018 0v4" />
  </svg>
);

// Status Badge
function StatusBadge({ status }: { status: ReserveEntry["status"] }) {
  if (status === "released") {
    return (
      <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
        Released
      </span>
    );
  }
  return (
    <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
      held
    </span>
  );
}

export default function ReserveDetails() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = 24;
  const itemsPerPage = 16;

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <main className="p-6 space-y-5 max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="hover:text-orange-500 cursor-pointer transition-colors">Merchant</span>
          <ChevronRightSmall />
          <span className="hover:text-orange-500 cursor-pointer transition-colors">Wallet Overview</span>
          <ChevronRightSmall />
          <span className="text-orange-500 font-medium">Reserve Details</span>
        </nav>

        {/* Page Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">Wallet Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Percentage held, auto-released after 30 days</p>
        </div>

        {/* Top Section: Total Reserve + Info Banner */}
        <div className="flex gap-4 flex-wrap">
          {/* Total Reserve Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 min-w-[180px]">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
              <LockIcon />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Total held</p>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">560.50 SAR</p>
            </div>
          </div>

          {/* Why does reserve exist? */}
          <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 min-w-[260px]">
            <div className="text-blue-500 mt-0.5 shrink-0">
              <InfoIcon />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">Why does reserve exist?</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                5% of each order is held as reserve to cover disputes or returns. The amount is automatically
                released after 30 days if no dispute occurs.
              </p>
            </div>
          </div>
        </div>

        {/* Reserve Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["RESERVE ID", "ORDER ID", "AMOUNT", "HOLD DATE", "RELEASE DATE", "STATUS"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 px-3 text-[11px] font-bold tracking-widest text-gray-400 uppercase whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reserveData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="py-3 px-3 text-xs text-gray-700 font-medium">{row.reserveId}</td>
                    <td className="py-3 px-3">
                      <span className="text-xs text-orange-500 hover:text-orange-600 cursor-pointer font-medium underline underline-offset-2">
                        {row.orderId}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs font-semibold text-gray-800">{row.amount}</td>
                    <td className="py-3 px-3 text-xs text-gray-600">{row.holdDate}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-xs text-orange-500 font-medium">
                        <CalendarIcon />
                        <span className="underline underline-offset-2 cursor-pointer hover:text-orange-600">
                          {row.releaseDate}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={row.status} />
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
  );
}