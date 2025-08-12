
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { PaymentInformationProps } from "@/types/payment";
import { useTranslation } from "react-i18next";


export const PaymentInformation = ({ payment }: PaymentInformationProps) => {
   const { t } = useTranslation();
  return(
  <Card className="bg-white border border-gray-300">
   
   <div className="px-4">
         <SectionHeader icon={CreditCard} title={t("orderdetails.paymentInformation.title")} />
    </div>
    <CardContent className="pt-0 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-bold">{t("orderdetails.paymentInformation.subtotal")}</span>
        <span className="font-medium">${payment.subtotal}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-bold">{t("orderdetails.paymentInformation.tax")}</span>
        <span className="font-medium">${payment.tax}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-bold">{t("orderdetails.paymentInformation.shipping")}</span>
        <span className="font-medium">${payment.shipping}</span>
      </div>
      <Separator className="my-3" />
      <div className="flex justify-between items-center font-semibold text-lg">
        <span className="font-bold">{t("orderdetails.paymentInformation.total")}</span>
        <span>${payment.total}</span>
      </div>
    </CardContent>
  </Card>
);
}

