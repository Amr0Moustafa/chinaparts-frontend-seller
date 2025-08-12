"use client";

import { StatCard } from "@/components/molecules/widgets/StatCard";
import { Package, CircleCheckBig, CircleX, Hourglass } from "lucide-react";
import { DynamicTable } from "../organisms/table/DynamicTable";
import { useMemo, useState } from "react";
import { StyledPagination } from "../molecules/pagination/Pagination";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { ReturnRequest } from "@/types/returns";
import { HiMiniHandThumbDown } from "react-icons/hi2";
import { FaLuggageCart } from "react-icons/fa";

type Column<T> = {
  header: string;
  accessor: keyof T;
};

const returnsData: ReturnRequest[] = [
  {
    id: "RT2101",
    product: "EMBR Brake Pads Set",
    customer: "Mohamed Ashraf",
    reason: "Product not as described",
    status: "Pending",
    date: "2024-01-15",
    amount: "$99.99",
  },
  {
    id: "RT2102",
    product: "EMBR Brake Pads Set",
    customer: "Mohamed Ashraf",
    reason: "Product not as described",
    status: "Approved",
    date: "2024-01-15",
    amount: "$99.99",
  },
  {
    id: "RT2103",
    product: "EMBR Brake Pads Set",
    customer: "Mohamed Ashraf",
    reason: "Product not as described",
    status: "Approved",
    date: "2024-01-14",
    amount: "$99.99",
  },
  {
    id: "RT2104",
    product: "EMBR Brake Pads Set",
    customer: "Mohamed Ashraf",
    reason: "Product not as described",
    status: "Rejected",
    date: "2024-01-14",
    amount: "$99.99",
  },
];

export const ReturnsTemplate = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const columns: Column<ReturnRequest>[] = [
    { header: "Return ID", accessor: "id" },
    { header: "Product", accessor: "product" },
    { header: "Customer", accessor: "customer" },
    { header: "Reason", accessor: "reason" },
    { header: "Status", accessor: "status" },
    { header: "Date", accessor: "date" },
    { header: "Amount", accessor: "amount" },
  ];

  // Pagination
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(returnsData.length / PAGE_SIZE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return returnsData.slice(start, start + PAGE_SIZE);
  }, [currentPage]);

  return (
    <div className="min-h-screen">
      <h3 className="text-lg md:text-2xl font-bold mb-4">Returns Management</h3>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Hourglass className="w-7 h-7" />} value={12} label="Pending Returns" color="violet" home={false} />
        <StatCard icon={<CircleCheckBig className="w-7 h-7" />} value={45} label="Approved" color="green" home={false} />
        <StatCard icon={<HiMiniHandThumbDown className="w-7 h-7 rotate-y-180" />} value={8} label="Rejected" color="red" home={false} />
        <StatCard icon={<FaLuggageCart className="w-7 h-7" />} value={65} label="Total Returns" color="gray" home={false} />
      </div>

      {/* Table */}
      <DynamicTable
        title={t("returns.returnsrequest")}
        columns={columns}
        data={paginatedData}
        onShow={(item) => router.push(`/dashboard/returns/${item.id}`)}
        onAccept={(item) => console.log("Approve:", item)}
        onReject={(item) => console.log("Reject:", item)}
        dialogaccept={true}
        dialogreject={true}
        dialogshow={false}
        showFilters={true}
        filters={["All Returns", "Pending", "Approved", "Rejected"]}
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
          Showing {(currentPage - 1) * PAGE_SIZE + 1}–
          {Math.min(currentPage * PAGE_SIZE, returnsData.length)} of {returnsData.length} returns
        </span>
      </div>
    </div>
  );
};
