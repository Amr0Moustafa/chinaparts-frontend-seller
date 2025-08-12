"use client";

import { useMemo, useState } from "react";
import { redirect } from "next/navigation";
import { useTranslation } from "react-i18next";
import { StatCard } from "@/components/molecules/widgets/StatCard";
import { Button } from "../atoms/Button";
import { StyledPagination } from "../molecules/pagination/Pagination";
import { DynamicTable } from "../organisms/table/DynamicTable";
import { BadgePercent, BadgeDollarSign } from "lucide-react";
import { FaUsers } from "react-icons/fa";
import { IoStatsChartOutline } from "react-icons/io5";


type Column<T> = {
  header: string;
  accessor: keyof T;
};

export const ProductOffersTemplate = () => {
  const { t } = useTranslation();

  const offerData = [
    {
      product: "Brake Pads - Toyota Camry 2018-2022",
      originalPrice: "$59.99",
      offerPrice: "$49.99",
      discount: "17% OFF",
      validPeriod: "2025-07-15 to 2025-07-31",
      sales: "15 sold",
      status: t("offers.status.scheduled")
    },
    {
      product: "Brake Pads - Toyota Camry 2018-2022",
      originalPrice: "$59.99",
      offerPrice: "$49.99",
      discount: "17% OFF",
      validPeriod: "2025-07-01 to 2025-07-10",
      sales: "25 sold",
      status: t("offers.status.active")
    },
    {
      product: "Brake Pads - Toyota Camry 2018-2022",
      originalPrice: "$59.99",
      offerPrice: "$49.99",
      discount: "17% OFF",
      validPeriod: "2025-06-01 to 2025-06-15",
      sales: "10 sold",
      status: t("offers.status.expired")
    }
  ];

  const offerColumns: Column<typeof offerData[number]>[] = [
    { header: t("offers.table.product"), accessor: "product" },
    { header: t("offers.table.originalPrice"), accessor: "originalPrice" },
    { header: t("offers.table.offerPrice"), accessor: "offerPrice" },
    { header: t("offers.table.discount"), accessor: "discount" },
    { header: t("offers.table.validPeriod"), accessor: "validPeriod" },
    { header: t("offers.table.sales"), accessor: "sales" },
    { header: t("offers.table.status"), accessor: "status" }
  ];

  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(offerData.length / PAGE_SIZE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return offerData.slice(start, start + PAGE_SIZE);
  }, [currentPage, offerData]);

  const renderStatus = (status: string) => {
    let colorClass = "";
    switch (status) {
      case t("offers.status.active"):
        colorClass = "bg-blue-100 text-blue-700";
        break;
      case t("offers.status.expired"):
        colorClass = "bg-red-100 text-red-700";
        break;
      case t("offers.status.scheduled"):
        colorClass = "bg-green-100 text-green-700";
        break;
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
        {status}
      </span>
    );
  };

  const renderDiscount = (discount: string) => (
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
      {discount}
    </span>
  );

  return (
    <div className="min-h-screen md:max-w-5xl 2xl:max-w-full">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h3 className="text-lg md:text-2xl font-bold">{t("offers.title")}</h3>
        <div className="flex-shrink-0">
 <Button
          text={t("offers.createOffer")}
          className="py-3 px-5 font-bold text-gray-900 w-auto"
          onClick={() => redirect("/dashboard/offers/create")}
        />
        </div>
       
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<BadgePercent className="w-7 h-7" />} value={2} label={t("offers.stats.activeOffers")} color="green" home={false} />
        <StatCard icon={<FaUsers className="w-7 h-7" />} value={45} label={t("offers.stats.totalRedemptions")} color="blue" home={false} />
        <StatCard icon={<BadgeDollarSign className="w-7 h-7" />} value="$2,340" label={t("offers.stats.discountGiven")} color="purple" home={false} />
        <StatCard icon={<IoStatsChartOutline className="w-7 h-7" />} value="+23%" label={t("offers.stats.avgOrderIncrease")} color="green" home={false} />
      </div>

      <DynamicTable
        title={t("offers.filters.active")}
        columns={offerColumns}
        data={paginatedData.map((offer) => ({
          ...offer,
          discount: renderDiscount(offer.discount),
          status: renderStatus(offer.status)
        }))}
        onShow={(item) => console.log("Show:", item)}
        onEdit={(item) => console.log("Edit:", item)}
        onDelete={(item) => console.log("Delete:", item)}
        dialogshow={true}
        dialogdelete={true}
        showFilters={true}
        filters={[
          t("offers.filters.all"),
          t("offers.filters.active"),
          t("offers.filters.expired"),
          t("offers.filters.scheduled")
        ]}
      />

      <div className="flex items-center justify-center md:justify-between mt-6 bg-white p-4 rounded-lg shadow">
        <StyledPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showText={false}
          buttonWrapperClassName="flex justify-between w-full"
        />
        <span className="hidden md:flex text-sm text-gray-500 w-full flex items-end justify-end">
          {t("offers.pagination.showing")} {(currentPage - 1) * PAGE_SIZE + 1}–
          {Math.min(currentPage * PAGE_SIZE, offerData.length)} {t("offers.pagination.of")} {offerData.length} {t("offers.pagination.offers")}
        </span>
      </div>
    </div>
  );
};
