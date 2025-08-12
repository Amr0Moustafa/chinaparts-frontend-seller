"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/molecules/widgets/StatCard";
import { Button } from "../atoms/Button";
import { StyledPagination } from "../molecules/pagination/Pagination";
import { DynamicTable } from "../organisms/table/DynamicTable";

// Icons

import { FaUsers  } from "react-icons/fa";
import { Coupon } from "@/types/coupon";
import { BadgePercent ,BadgeDollarSign } from 'lucide-react'

import { IoStatsChartOutline } from "react-icons/io5";

// Table column type
type Column<T> = {
  header: string;
  accessor: keyof T;
};

export const CouponsTemplate = () => {
  const { t } = useTranslation();

  // Example coupon data
  const couponData: Coupon[] = [
    {
      code: "RET01",
      title: "15% Off Brake Parts Brake System",
      discount: "15% Percentage",
      minOrder: "$50",
      usage: "23/100",
      date: "2024-01-15",
      status: "Scheduled",
    },
    {
      code: "RET01",
      title: "15% Off Brake Parts All Products",
      discount: "15% Fixed Amount",
      minOrder: "$50",
      usage: "23/100",
      date: "2024-01-15",
      status: "Expired",
    },
    {
      code: "RET01",
      title: "15% Off Brake Parts Brake System",
      discount: "15% Percentage",
      minOrder: "$50",
      usage: "23/100",
      date: "2024-01-14",
      status: "Active",
    },
    {
      code: "RET01",
      title: "15% Off Brake Parts All Products",
      discount: "15% Fixed Amount",
      minOrder: "$50",
      usage: "23/100",
      date: "2024-01-14",
      status: "Active",
    },
    {
      code: "RET01",
      title: "15% Off Brake Parts Brake System",
      discount: "15% Fixed Amount",
      minOrder: "$50",
      usage: "23/100",
      date: "2024-01-13",
      status: "Expired",
    },
  ];

  // Table columns
  const couponColumns: Column<Coupon>[] = [
    { header: t("coupons.table.couponCode") || "Coupon Code", accessor: "code" },
    { header: t("coupons.table.title") || "Title", accessor: "title" },
    { header: t("coupons.table.discount") || "Discount", accessor: "discount" },
    { header: t("coupons.table.minOrder") || "Min Order", accessor: "minOrder" },
    { header: t("coupons.table.usage") || "Usage", accessor: "usage" },
    { header: t("coupons.table.date") || "Date", accessor: "date" },
    { header: t("coupons.table.status") || "Status", accessor: "status" },
  ];

  // Pagination
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(couponData.length / PAGE_SIZE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return couponData.slice(start, start + PAGE_SIZE);
  }, [currentPage, couponData]);

  // Function to render colored status badge
  const renderStatus = (status: Coupon["status"]) => {
    let colorClass = "";
    switch (status) {
      case "Active":
        colorClass = "bg-blue-100 text-blue-700";
        break;
      case "Expired":
        colorClass = "bg-red-100 text-red-700";
        break;
      case "Scheduled":
        colorClass = "bg-green-100 text-green-700";
        break;
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen md:max-w-5xl 2xl:max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <h3 className="text-lg md:text-2xl font-bold">
          {t("coupons.title") || "Discount Coupons"}
        </h3>
        <div className="flex-shrink-0">
          <Button
            text={t("coupons.createOffer") || "Create Offer"}
            className="py-3 px-5 font-bold text-gray-900 w-auto"
            onClick={() => redirect("/dashboard/coupons/create")}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<BadgePercent className="w-7 h-7" />}
          value={2}
          label={t("coupons.stats.activeOffers") || "Active Offers"}
          color="green"
          home={false}
        />
        <StatCard
          icon={<FaUsers  className="w-7 h-7" />}
          value={45}
          label={t("coupons.stats.totalRedemptions") || "Total Redemptions"}
          color="blue"
          home={false}
        />
        <StatCard
          icon={<BadgeDollarSign className="w-7 h-7" />}
          value={"$2.340"}
          label={t("coupons.stats.discountGiven") || "Discount Given"}
          color="purple"
          home={false}
        />
        <StatCard
          icon={<IoStatsChartOutline className="w-7 h-7" />}
          value={"+23%"}
          label={t("coupons.stats.avgOrderIncrease") || "Avg. Order Increase"}
          color="green"
          home={false}
        />
      </div>

      {/* Coupon Table */}
      <DynamicTable
        title={t("coupons.table.couponList") || "Coupons"}
        columns={couponColumns}
        data={paginatedData.map((coupon) => ({
          ...coupon,
          status: renderStatus(coupon.status), // Replace with badge
        }))}
        onShow={(item) => console.log("Show:", item)}
        onEdit={(item) => console.log("Edit:", item)}
        onDelete={(item) => console.log("Delete:", item)}
        dialogshow={true}
        dialogdelete={true}
        showFilters={true}
        filters={["All Coupons","Active", "Expired", "Scheduled"]}
      />

      {/* Pagination */}
      <div className="flex items-center justify-center md:justify-between mt-6 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4 w-full">
          <StyledPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showText={false}
            buttonWrapperClassName="flex justify-between w-full"
          />
        </div>

        <span className="hidden md:flex text-sm text-gray-500 w-full flex items-end justify-end">
          {t("coupons.category.showing") || "Showing"} {(currentPage - 1) * PAGE_SIZE + 1}–
          {Math.min(currentPage * PAGE_SIZE, couponData.length)}{" "}
          {t("coupons.category.of") || "of"} {couponData.length}{" "}
          {t("coupons.category.coupons") || "coupons"}
        </span>
      </div>
    </div>
  );
};
