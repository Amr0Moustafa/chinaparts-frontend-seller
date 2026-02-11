"use client";

import { StatCard } from "@/components/molecules/widgets/StatCard";
import { HiOutlineCube, HiOutlineXCircle } from "react-icons/hi2";
import { LuPackageCheck } from "react-icons/lu";
import { FaBoxOpen } from "react-icons/fa";

import { Column, DynamicTable } from "../organisms/table/DynamicTable";
import { useMemo, useState } from "react";
import { StyledPagination } from "../molecules/pagination/Pagination";
import { useTranslation } from "react-i18next";
import { Button } from "../atoms/Button";
import { redirect, useRouter } from "next/navigation";
import { useGetProductsQuery } from "@/features/products";
import { Product } from "@/types/product";
import { StatusSwitcher } from "../molecules/product/StatusSwitcher";


export const ProductTemplate = () => {
  const { t } = useTranslation();
  
   const router=useRouter()
   const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const { data: productdata, isLoading: productloading } =
    useGetProductsQuery(
      {
        page: currentPage,
        per_page: PAGE_SIZE, 
        
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );
  // Pagination
  const pagination=productdata?.meta 
    const productData=productdata?.data || [];
 
   
 const productColumns: Column<Product>[] = [
  {
    id: "name",
    header: t("table.productName"),
    accessor: (row:any) => row.name,
  },
  {
    id: "sku",
    header: t("table.sku"),
    accessor: (row:any) => row.sku || "—",
  },
  {
    id: "category",
    header: t("table.category"),
    accessor: (row:any) => (
      <span className="font-medium">
        {row?.category?.name} 
      </span>
    ),
  },
  // {
  //   id: "stock",
  //   header: t("table.stock"),
  //   accessor: (row:any) => (
  //     <span
  //       className={
  //         row.stock > 0 ? "text-green-600 font-medium" : "text-red-600"
  //       }
  //     >
  //       {row.stock}
  //     </span>
  //   ),
  // },
  // {
  //   id: "status",
  //   header: t("table.status"),
  //   accessor: (row:any) => (
  //     <span
  //       className={`px-2 py-1 rounded text-xs font-medium ${
  //         row.status_label === "Active"
  //           ? "bg-green-100 text-green-700"
  //           : "bg-gray-100 text-gray-600"
  //       }`}
  //     >
  //       {row.status_label}
  //     </span>
  //   ),
  // },
  {
  id: "status",
  header: t("table.status"),
  accessor: (row: any) => (
    <StatusSwitcher
      id={row.id}
      currentStatus={row.status}
    />
  ),
}
  
];
  

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h3 className="text-lg  md:text-2xl font-bold">{t("product.title")}</h3>
        <div className="flex-shrink-0">
          <Button
            text="Add New Product"
            className="py-3 px-5 font-bold text-gray-900 w-auto"
            onClick={() => redirect("/dashboard/products/create")}
          />
        </div>
      </div>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<HiOutlineCube className="w-7 h-7" />}
            value={12}
            label={t("stats.total")}
            color="green"
            home={false}
          />
          <StatCard
            icon={<LuPackageCheck className="w-7 h-7" />}
            value={8}
            label={t("stats.active")}
            color="blue"
            home={false}
          />
          <StatCard
            icon={<HiOutlineXCircle className="w-7 h-7" />}
            value={45}
            label={t("stats.inactive")}
            color="orange"
            home={false}
          />
          <StatCard
            icon={<FaBoxOpen className="w-7 h-7" />}
            value={65}
            label={t("stats.outOfStock")}
            color="purple"
            home={false}
          />
        </div>

        {/* Product Table */}
        <DynamicTable
          title={t("table.productInventory")}
          columns={productColumns}
          data={productData}
          onShow={(item) => router.push(`/dashboard/products/${item.id}/show`)}
          onEdit={(item) => router.push(`/dashboard/products/${item.id}/update`)}
          onDelete={(item) => console.log("Delete:", item)}
          
        />

        {/* Pagination */}
        <div className="flex items-center justify-center md:justify-between mt-6 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-4 w-full">
            <StyledPagination
              currentPage={currentPage}
              totalPages={pagination?.total||1}
              onPageChange={setCurrentPage}
              showText={false}
              buttonWrapperClassName="flex justify-between w-full"
            />
          </div>

          <span className=" hidden md:flex text-sm text-gray-500 w-full flex items-end justify-end">
            {t("category.showing")} {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, pagination?.total||0)}{" "}
            {t("category.of")} {pagination?.total||0} {t("category.products")}
          </span>
        </div>
      </div>
    </div>
  );
};
