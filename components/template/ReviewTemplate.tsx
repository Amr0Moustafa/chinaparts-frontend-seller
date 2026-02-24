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
} from "react-icons/hi2";

import { useGetReviewsQuery } from "@/features/reviews";
import { Review } from "@/types/review";

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
      return {
        avgRating: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
      };

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
        <p className="line-clamp-2 max-w-xs text-gray-600">
          {row.comment}
        </p>
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
        {/* Search */}
        <input
          placeholder="Search reviews..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-60"
          value={search}
          onChange={(e) => {
            setCurrentPage(1);
            setSearch(e.target.value);
          }}
        />

        {/* Rating Filter */}
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={rating ?? ""}
          onChange={(e) => {
            setCurrentPage(1);
            setRating(
              e.target.value ? Number(e.target.value) : undefined
            );
          }}
        >
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Stars
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={status ?? ""}
          onChange={(e) => {
            setCurrentPage(1);
            setStatus(
              e.target.value ? Number(e.target.value) : undefined
            );
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
        // onShow={(item) =>
        //   router.push(`/dashboard/reviews/${item.id}`)
        // }
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
          {Math.min(
            currentPage * PAGE_SIZE,
            pagination?.total || 0
          )}{" "}
          of {pagination?.total || 0} reviews
        </span>
      </div>
    </div>
  );
};