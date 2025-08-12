"use client";

import { StatCard } from "@/components/molecules/widgets/StatCard";
import { Truck ,Package ,CircleCheckBig ,ShoppingCart,CircleX } from "lucide-react";


import { DynamicTable } from "../organisms/table/DynamicTable";
import { useMemo, useState } from "react";
import { StyledPagination } from "../molecules/pagination/Pagination";
import { useTranslation } from "react-i18next";
import { Button } from "../atoms/Button";
import { redirect, useRouter } from "next/navigation";
import { Order } from "@/types/order";



type Column<T> = {
  header: string;
  accessor: keyof T;
};
const testOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "Mike Johnson",
    product: "Brake Pads - Toyota Camry",
    amount: "$39.99",
    date: "2024-01-15",
    status: "Processing",
  },
  {
    id: "ORD-002",
    customer: "Sarah Chen",
    product: "Air Filter - Honda Civic",
    amount: "$24.99",
    date: "2024-01-15",
    status: "Shipped",
  },
  {
    id: "ORD-003",
    customer: "David Wilson",
    product: "Oil Filter - Ford F-150",
    amount: "$15.99",
    date: "2024-01-14",
    status: "Delivered",
  },
  {
    id: "ORD-004",
    customer: "Lisa Brown",
    product: "Spark Plugs - BMW 3 Series",
    amount: "$45.99",
    date: "2024-01-14",
    status: "Processing",
  },
  {
    id: "ORD-005",
    customer: "James Miller",
    product: "Brake Pads - Honda Accord",
    amount: "$79.99",
    date: "2024-01-13",
    status: "Shipped",
  },
];
export const OrderTemplate = () => {
  const { t } = useTranslation();
const router = useRouter();

  const orderColumns: Column<Order>[] = [
    { header: t("order.table.orderId"), accessor: "id" },
    { header: t("order.table.customer"), accessor: "customer" },
    { header: t("order.table.product"), accessor: "product" },
    { header: t("order.table.amount"), accessor: "amount" },
    { header: t("order.table.date"), accessor: "date" },
    { header: t("order.table.status"), accessor: "status" },
  ];

  // Pagination
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(testOrders.length / PAGE_SIZE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return testOrders.slice(start, start + PAGE_SIZE);
  }, [currentPage, testOrders]);
  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h3 className="text-lg  md:text-2xl font-bold">{t("order.title")}</h3>
      </div>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            icon={<Package className="w-7 h-7" />}
            value={12}
            label={t("order.stats.processing")}
            color="green"
            home={false}
          />
          <StatCard
            icon={<Truck className="w-7 h-7" />}
            value={8}
            label={t("order.stats.shipped")}
            color="orange"
            home={false}
          />
          <StatCard
            icon={<CircleCheckBig className="w-7 h-7" />}
            value={45}
            label={t("order.stats.delivered")}
            color="blue"
            home={false}
          />
          <StatCard
            icon={<ShoppingCart className="w-7 h-7" />}
            value={65}
            label={t("order.stats.totalOrders")}
            color="purple"
            home={false}
          />
          
           <StatCard
            icon={<CircleX className="w-7 h-7" />}
            value={65}
            label={t("order.stats.rejected")}
            color="red"
            home={false}
          />
        </div>

        {/* order Table */}
        <DynamicTable
        title= {t("orderchart.recentorders.title")}
          columns={orderColumns}
          data={paginatedData}
          onShow={(item) =>  router.push(`/dashboard/orders/${item.id}`)}
          onAccept={(item) => console.log("Edit:", item)}
          onReject={(item) => console.log("Delete:", item)}
          dialogaccept={true}
          dialogreject={true}
          dialogshow={false}
          
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

          <span className=" hidden md:flex text-sm text-gray-500 w-full flex items-end justify-end">
            {t("category.showing")} {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, testOrders.length)}{" "}
            {t("category.of")} {testOrders.length} {t("category.products")}
          </span>
        </div>
      </div>
    </div>
  );
};
