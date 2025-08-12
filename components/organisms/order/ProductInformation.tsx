"use client";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { OrderProductInformationProps } from "@/types/order";
import { Package } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export const ProductInformation = ({ product }:OrderProductInformationProps) => {
  const { t } = useTranslation();
  return(
  <Card className="bg-white border border-gray-300">
    <div className="px-4">
          <SectionHeader icon={Package} title={t("orderdetails.productInformation.title")} />

    </div>
    <CardContent className="pt-0">
      <div className="flex gap-4">
        <div className="shrink-0">
          <Image 
            src={product.image || "/api/placeholder/80/80"} 
            alt={product.name}
            className="w-40 h-40 object-cover rounded-lg border border-gray-200"
            width={80}
            height={80}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p className="font-bold">{t("orderdetails.productInformation.sku")}: <span className="text-gray-900">{product.sku}</span></p>
            <p className="font-bold">{t("orderdetails.productInformation.orderDate")}: <span className="text-gray-900">{product.orderDate}</span></p>
            <p className="font-bold">{t("orderdetails.productInformation.quantity")}: <span className="text-gray-900">{product.quantity}</span></p>
          </div>
          <p className="font-semibold text-orange-500 mt-2">${product.price}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
}