"use client";

import { StatCard } from "@/components/molecules/widgets/StatCard";
import { HiOutlineCube, HiOutlineXCircle } from "react-icons/hi2";
import { LuPackageCheck } from "react-icons/lu";
import { FaBoxOpen } from "react-icons/fa";

import { Column, DynamicTable } from "../organisms/table/DynamicTable";
import { useState } from "react";
import { StyledPagination } from "../molecules/pagination/Pagination";
import { useTranslation } from "react-i18next";
import { Button } from "../atoms/Button";
import { redirect, useRouter } from "next/navigation";
import { useGetProductsQuery, useDeleteProductMutation } from "@/features/products";
import { Product } from "@/types/product";
import { StatusSwitcher } from "../molecules/product/StatusSwitcher";


export const ProductTemplate = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Delete state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const { data: productdata, isLoading: productloading } = useGetProductsQuery(
    {
      page: currentPage,
      per_page: PAGE_SIZE,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const pagination = productdata?.meta;
  const productData = productdata?.data || [];

  // Handle confirmed delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id).unwrap();
      setProductToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const productColumns: Column<Product>[] = [
    {
      id: "name",
      header: t("table.productName"),
      accessor: (row: any) => row.name,
    },
    {
      id: "sku",
      header: t("table.sku"),
      accessor: (row: any) => row.sku || "—",
    },
    {
      id: "category",
      header: t("table.category"),
      accessor: (row: any) => (
        <span className="font-medium">{row?.category?.name}</span>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      accessor: (row: any) => (
        <StatusSwitcher id={row.id} currentStatus={row.status} />
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              {t("products.deleteTitle") || "Delete Product"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {t("products.deleteConfirm") ||
                `Are you sure you want to delete`}{" "}
              <span className="font-semibold text-gray-800">
                "{productToDelete.name}"
              </span>
              ? {t("products.deleteWarning") || "This action cannot be undone."}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
              >
                {t("common.cancel") || "Cancel"}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting && (
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                )}
                {t("common.delete") || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 mb-3">
        <h3 className="text-lg md:text-2xl font-bold">{t("product.title")}</h3>
        <div className="flex-shrink-0">
          <Button
            text={t("products.addproduct") || "Add New Product"}
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
          onDelete={(item) => setProductToDelete(item)}
        />

        {/* Pagination */}
        <div className="flex items-center justify-center md:justify-between mt-6 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-4 w-full">
            <StyledPagination
              currentPage={currentPage}
              totalPages={pagination?.total || 1}
              onPageChange={setCurrentPage}
              showText={false}
              buttonWrapperClassName="flex justify-between w-full"
            />
          </div>

          <span className="hidden md:flex text-sm text-gray-500 w-full flex items-end justify-end">
            {t("category.showing")} {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, pagination?.total || 0)}{" "}
            {t("category.of")} {pagination?.total || 0}{" "}
            {t("category.products")}
          </span>
        </div>
      </div>
    </div>
  );
};