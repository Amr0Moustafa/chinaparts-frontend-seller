"use client";
import { FC, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { Package } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

type BadgeColor = "green" | "red" | "orange" | "yellow" | "blue" | "gray";

interface OrderStatusProps {
  status: string;
}

const statusToColorMap: Record<string, BadgeColor> = {
  processing: "yellow",
  Shipped: "blue",
  delivered: "green",
  cancelled: "red",
  pending: "orange",
  returned: "gray",
};

const colorMap: Record<BadgeColor, string> = {
  green: "bg-green-100 text-green-600",
  red: "bg-red-100 text-red-600",
  orange: "bg-orange-100 text-orange-600",
  yellow: "bg-yellow-100 text-yellow-600",
  blue: "bg-blue-100 text-blue-600",
  gray: "bg-gray-100 text-gray-600",
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const [selectedStatus, setSelectedStatus] = useState(status || "processing");
  const { t } = useTranslation();
  const badgeColor = statusToColorMap[selectedStatus.toLowerCase()] || "gray";

  return (
    <Card className="bg-white border border-gray-300">
      <div className="px-4">
        {" "}
        <SectionHeader
          icon={Package}
          title={t("orderdetails.orderStatus.title")}
          actionButton={
            <StatusBadge label={selectedStatus} color={badgeColor} />
          }
        />
      </div>

      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-3">
          {t("orderdetails.orderStatus.updateLabel")}
        </p>
        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value)}
        >
          <SelectTrigger className="w-full border-gray-300 bg-gray-200 text-gray-500 outline-none ring-orange-500  ">
            <SelectValue
              placeholder={t("orderdetails.orderStatus.selectPlaceholder")}
            />
          </SelectTrigger>
          <SelectContent className="border-gray-300 bg-white">
            {Object.keys(statusToColorMap).map((statusKey) => (
              <SelectItem key={statusKey} value={statusKey}>
                {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
