"use client";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { User } from "lucide-react";
import type { CustomerInformationProps } from "@/types/customer";
import { useTranslation } from "react-i18next";


export const CustomerInformation = ({ customer }: CustomerInformationProps) =>{
const { t } = useTranslation();
return(
  <Card className="bg-white border border-gray-300">
    <div className="px-4">
 <SectionHeader icon={User} title={t("orderdetails.customerInformation.title")} />
    </div>
   
    <CardContent className="pt-0 space-y-4">
      <div>
        <h4 className="font-bold text-gray-900 mb-1">{customer.name}</h4>
        <p className="text-sm font-bold text-gray-600">{customer.email}</p>
        <p className="text-sm font-bold text-gray-600">{customer.phone}</p>
      </div>
      <div>
        <h5 className="font-bold text-gray-900 mb-2">{t("orderdetails.customerInformation.shippingAddress")}</h5>
        <p className="text-sm font-bold text-gray-600 leading-relaxed">{customer.address}</p>
      </div>
    </CardContent>
  </Card>
);

} 

