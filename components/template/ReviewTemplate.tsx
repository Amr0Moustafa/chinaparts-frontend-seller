"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import { DynamicTable, Column } from "../organisms/table/DynamicTable";
import { StyledPagination } from "../molecules/pagination/Pagination";
import { StatCard } from "@/components/molecules/widgets/StatCard";
import { Button } from "../atoms/Button";

import {
  HiOutlineStar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineXMark,
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineCalendar,
  HiOutlineChatBubbleLeftEllipsis,
} from "react-icons/hi2";

import { useGetReviewsQuery } from "@/features/reviews";
import { Review } from "@/types/review";

// -------------------------------------------------------
// Review Detail Dialog
// -------------------------------------------------------
interface ReviewDialogProps {
  review: Review | null;
  onClose: () => void;
}

const ReviewDialog = ({ review, onClose }: ReviewDialogProps) => {
  if (!review) return null;

  const statusConfig = {
    0: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
    1: { label: "Approved", className: "bg-green-100 text-green-700" },
    2: { label: "Rejected", className: "bg-red-100 text-red-700" },
  };

  const status = statusConfig[review.status as 0 | 1 | 2] ?? statusConfig[0];

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Review Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">

          {/* Rating + Status row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl ${
                    i < review.rating ? "text-yellow-400" : "text-gray-200"
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="ml-2 text-gray-500 text-sm font-medium">
                {review.rating} / 5
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
            >
              {review.status_label ?? status.label}
            </span>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
              <HiOutlineUser className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Customer</p>
                <p className="text-sm font-semibold text-gray-700">
                  {review.customer?.name ?? "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
              <HiOutlineShoppingBag className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Product</p>
                <p className="text-sm font-semibold text-gray-700">
                  {review.product?.name ?? "—"}
                </p>
              </div>
            </div>

            {review.created_at && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 col-span-2">
                <HiOutlineCalendar className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Date</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {new Date(review.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Comment */}
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineChatBubbleLeftEllipsis className="w-4 h-4 text-indigo-500" />
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                Comment
              </p>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {review.comment || "No comment provided."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------
// Main Template
// -------------------------------------------------------
export const ReviewTemplate = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const PAGE_SIZE = 10;

  // -----------------------
  // STATE
  // -----------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [rating, setRating] = useState<number | undefined>();
  const [status, setStatus] = useState<number | undefined>();
  const [search, setSearch] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null); // 👈 NEW

  // -----------------------
  // API
  // -----------------------
  const { data, isLoading } = useGetReviewsQuery(
    {
      page: currentPage,
      per_page: PAGE_SIZE,
      rating,
      status,
      search: search || undefined,
      sort_by: "created_at",
      sort_order: "desc",
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const reviews = data?.data ?? [];
  const pagination = data?.meta;

  // -----------------------
  // STATS
  // -----------------------
  const stats = useMemo(() => {
    if (!reviews.length)
      return { avgRating: 0, approved: 0, pending: 0, rejected: 0 };

    const avgRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    return {
      avgRating: avgRating.toFixed(1),
      approved: reviews.filter((r) => r.status === 1).length,
      pending: reviews.filter((r) => r.status === 0).length,
      rejected: reviews.filter((r) => r.status === 2).length,
    };
  }, [reviews]);

  // -----------------------
  // TABLE COLUMNS
  // -----------------------
  const columns: Column<Review>[] = [
    {
      id: "product",
      header: t("reviews.product"),
      accessor: (row) => row.product?.name ?? "—",
    },
    {
      id: "customer",
      header: t("reviews.customer"),
      accessor: (row) => row.customer?.name ?? "—",
    },
    {
      id: "rating",
      header: t("reviews.rating"),
      accessor: (row) => (
        <span className="flex items-center gap-1 font-medium">
          {row.rating} ⭐
        </span>
      ),
    },
    {
      id: "comment",
      header: t("reviews.comment"),
      accessor: (row) => (
        <p className="line-clamp-2 max-w-xs text-gray-600">{row.comment}</p>
      ),
    },
    {
      id: "status",
      header: t("reviews.status"),
      accessor: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold
          ${
            row.status === 1
              ? "bg-green-100 text-green-700"
              : row.status === 0
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status_label}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-2xl font-bold">
          {t("reviews.title") || "Product Reviews"}
        </h3>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<HiOutlineStar className="w-7 h-7" />}
          value={stats.avgRating}
          label="Average Rating"
          color="purple"
          home={false}
        />
        <StatCard
          icon={<HiOutlineCheckCircle className="w-7 h-7" />}
          value={stats.approved}
          label="Approved"
          color="green"
          home={false}
        />
        <StatCard
          icon={<HiOutlineClock className="w-7 h-7" />}
          value={stats.pending}
          label="Pending"
          color="orange"
          home={false}
        />
        <StatCard
          icon={<HiOutlineXCircle className="w-7 h-7" />}
          value={stats.rejected}
          label="Rejected"
          color="red"
          home={false}
        />
      </div>

      {/* ================= FILTERS ================= */}
      <div className="bg-white p-4 rounded-xl shadow grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
        <input
          placeholder="Search reviews..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-60"
          value={search}
          onChange={(e) => {
            setCurrentPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={rating ?? ""}
          onChange={(e) => {
            setCurrentPage(1);
            setRating(e.target.value ? Number(e.target.value) : undefined);
          }}
        >
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Stars
            </option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={status ?? ""}
          onChange={(e) => {
            setCurrentPage(1);
            setStatus(e.target.value ? Number(e.target.value) : undefined);
          }}
        >
          <option value="">All Status</option>
          <option value={0}>Pending</option>
          <option value={1}>Approved</option>
          <option value={2}>Rejected</option>
        </select>

        <Button
          text="Reset"
          className="px-4 py-2"
          onClick={() => {
            setRating(undefined);
            setStatus(undefined);
            setSearch("");
            setCurrentPage(1);
          }}
        />
      </div>

      {/* ================= TABLE ================= */}
      <DynamicTable
        title="Reviews"
        columns={columns}
        data={reviews}
        isLoading={isLoading}
        onShow={(item) => setSelectedReview(item)} // 👈 opens dialog
      />

      {/* ================= PAGINATION ================= */}
      <div className="flex items-center justify-center md:justify-between mt-6 bg-white p-4 rounded-lg shadow">
        <StyledPagination
          currentPage={currentPage}
          totalPages={pagination?.total || 1}
          onPageChange={setCurrentPage}
          showText={false}
          buttonWrapperClassName="flex justify-between w-full"
        />
        <span className="hidden md:flex text-sm text-gray-500">
          Showing {(currentPage - 1) * PAGE_SIZE + 1}–
          {Math.min(currentPage * PAGE_SIZE, pagination?.total || 0)} of{" "}
          {pagination?.total || 0} reviews
        </span>
      </div>

      {/* ================= DIALOG ================= */}
      <ReviewDialog
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
};