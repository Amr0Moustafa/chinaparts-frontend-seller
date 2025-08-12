"use client";

import { StatCard } from "@/components/molecules/widgets/StatCard";
import { HiOutlineCube, HiOutlineXCircle } from "react-icons/hi2";
import { LuPackageCheck } from "react-icons/lu";
import { FaBoxOpen } from "react-icons/fa";

import { DynamicTable } from "../organisms/table/DynamicTable";
import { useMemo, useState } from "react";
import { StyledPagination } from "../molecules/pagination/Pagination";
import { useTranslation } from "react-i18next";
import { Button } from "../atoms/Button";
import { redirect } from "next/navigation";
type Product = {
  name: string;
  sku: string;
  price: string;
  stock: string;
  status: string;
};
type Column<T> = {
  header: string;
  accessor: keyof T;
};

export const ProductTemplate = () => {
  const { t } = useTranslation();
   const productData = [
  {
    name: "Brake Pads - Toyota Camry",
    sku: "BP-TC-001",
    price: "$89.99",
    stock: "25 units",
    coupon: "BRAKE15",
    offer: "10% off ",
    description: "High-quality brake pads compatible with Toyota Camry models.",
    imageSrc: "/images/product/Vector.png",
    status: "Active",
  },
  {
    name: "Air Filter - Honda Civic",
    sku: "AF-HC-002",
    price: "$24.99",
    stock: "0 units",
    coupon: "",
    offer: "",
    description: "OEM replacement air filter for Honda Civic.",
    imageSrc: "/images/products/air-filter-civic.jpg",
    status: "Inactive",
  },
  {
    name: "Oil Filter - Ford F-150",
    sku: "OF-FF-003",
    price: "$15.99",
    stock: "25 units",
    coupon: "SAVE5",
    offer: "Buy 2 get 1 free",
    description: "Durable oil filter for Ford F-150 trucks.",
    imageSrc: "/images/products/oil-filter-f150.jpg",
    status: "Active",
  },
  {
    name: "Spark Plugs - BMW 3 Series",
    sku: "SP-BM-004",
    price: "$24.99",
    stock: "0 units",
    coupon: "",
    offer: "",
    description: "Premium spark plugs for BMW 3 Series.",
    imageSrc: "/images/products/spark-plugs-bmw.jpg",
    status: "Inactive",
  },
  {
    name: "Fuel Pump - Chevrolet Silverado",
    sku: "FP-CS-005",
    price: "$129.99",
    stock: "10 units",
    coupon: "PUMP10",
    offer: "Free shipping",
    description: "Reliable fuel pump for Chevy Silverado.",
    imageSrc: "/images/products/fuel-pump-silverado.jpg",
    status: "Active",
  },
  {
    name: "Alternator - Nissan Altima",
    sku: "ALT-NA-006",
    price: "$199.99",
    stock: "0 units",
    coupon: "",
    offer: "",
    description: "High-output alternator for Nissan Altima.",
    imageSrc: "/images/products/alternator-altima.jpg",
    status: "Inactive",
  },
  {
    name: "Radiator Hose - Subaru Outback",
    sku: "RH-SO-007",
    price: "$34.50",
    stock: "5 units",
    coupon: "HOSE5",
    offer: "5% off",
    description: "Flexible radiator hose for Subaru Outback.",
    imageSrc: "/images/products/radiator-hose-outback.jpg",
    status: "Active",
  },
  {
    name: "Brake Disc - Mercedes C-Class",
    sku: "BD-MC-008",
    price: "$149.00",
    stock: "0 units",
    coupon: "",
    offer: "",
    description: "Precision brake disc for Mercedes C-Class.",
    imageSrc: "/images/products/brake-disc-mercedes.jpg",
    status: "Inactive",
  },
  {
    name: "Air Conditioning Compressor - Toyota Corolla",
    sku: "ACC-TC-009",
    price: "$249.99",
    stock: "3 units",
    coupon: "COOL20",
    offer: "20% off",
    description: "AC compressor for Toyota Corolla models.",
    imageSrc: "/images/products/ac-compressor-corolla.jpg",
    status: "Active",
  },
  {
    name: "Wheel Bearing - Audi A4",
    sku: "WB-AA-010",
    price: "$89.49",
    stock: "0 units",
    coupon: "",
    offer: "",
    description: "Durable wheel bearing for Audi A4.",
    imageSrc: "/images/products/wheel-bearing-audi.jpg",
    status: "Inactive",
  },
];


  const productColumns: Column<Product>[] = [
    { header: t("table.productName"), accessor: "name" },
    { header: t("table.sku"), accessor: "sku" },
    { header: t("table.price"), accessor: "price" },
    { header: t("table.stock"), accessor: "stock" },
    { header: t("table.status"), accessor: "status" },
  ];

  // Pagination
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(productData.length / PAGE_SIZE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return productData.slice(start, start + PAGE_SIZE);
  }, [currentPage, productData]);
  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-3">
       <h3 className="text-lg  md:text-2xl font-bold">{t("product.title")}</h3>
    <div className="flex-shrink-0">
      <Button
        text="Add New Product"
        className="py-3 px-5 font-bold text-gray-900 w-auto"
        onClick={()=>redirect("/dashboard/products/create")}
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
          title= {t("table.productInventory")}
          columns={productColumns}
          data={paginatedData}
          onShow={(item) => console.log("Show:", item)}
          onEdit={(item) => console.log("Edit:", item)}
          onDelete={(item) => console.log("Delete:", item)}
          dialogshow={true}
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
            {Math.min(currentPage * PAGE_SIZE, productData.length)}{" "}
            {t("category.of")} {productData.length} {t("category.products")}
          </span>
        </div>
      </div>
    </div>
  );
};
