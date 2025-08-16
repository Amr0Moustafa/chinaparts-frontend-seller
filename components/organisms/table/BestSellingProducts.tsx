"use client";

import { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

type Product = {
  productName: string;
  quantitySold: number;
  revenue: string;
  platformCommission: string;
  trend: string;
};

interface BestSellingProductsProps {
  products: Product[];
}

export const BestSellingProducts: FC<BestSellingProductsProps> = ({
  products,
}) => {
  const { i18n , t } = useTranslation();
  const direction = i18n.dir();
  return (
    <Table>
      <TableHeader className="border-0">
        <TableRow className="border-t border-gray-300 ">
          <TableHead className={direction === "ltr" ? "text-left" : "text-right"}>{t("salesreport.bestSelling.productName")}</TableHead>
          <TableHead  className={direction === "ltr" ? "text-left" : "text-right"}>{t("salesreport.bestSelling.quantitySold")}</TableHead>
          <TableHead  className={direction === "ltr" ? "text-left" : "text-right"}>{t("salesreport.bestSelling.revenue")}</TableHead>
          <TableHead  className={direction === "ltr" ? "text-left" : "text-right"}>{t("salesreport.bestSelling.platformCommission")}</TableHead>
          <TableHead  className={direction === "ltr" ? "text-left" : "text-right"}>{t("salesreport.bestSelling.trend")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, idx) => (
          <TableRow className="border-t border-gray-300" key={idx}>
            <TableCell>{product.productName}</TableCell>
            <TableCell>{product.quantitySold}</TableCell>
            <TableCell>{product.revenue}</TableCell>
            <TableCell>{product.platformCommission}</TableCell>
            <TableCell
              className={
                product.trend.startsWith("+")
                  ? "text-green-600 font-medium"
                  : "text-red-600 font-medium"
              }
            >
              {product.trend}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
