"use client";
import React from "react";
import type { TopSellingProduct } from "@/types/product";
import { TopSellingProductRow } from "@/components/molecules/product/TopSellingProductRow";
import { RecentOrders } from "@/types/order";
import { RecentOrderRow } from "@/components/molecules/product/RecentOrderRow";
import { redirect } from "next/navigation";
import { Bell } from "lucide-react";
import { NotificationItem } from "@/types/notification";
import { NotificationRow } from "@/components/molecules/product/NotificationRow";
import { useTranslation } from "react-i18next";
interface Props {
  notifications: NotificationItem[];
  className?: string;
}

export const RecentNotficationsCard: React.FC<Props> = ({
  notifications,
  className = "",
}) => {

    const { t } = useTranslation();
  return (
    <div className={`max-w-2xl w-full bg-white   overflow-hidden ${className}`}>
      <div className=" flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="text-orange-500" />
          <h2 className="text-lg font-semibold text-slate-800">
            {t("recentnotif.title")}
          </h2>
        </div>
        <a
          className="text-sm text-orange-500 hover:underline"
          onClick={() => {
            redirect("/dashboard/notifications");
          }}
        >
         {t("recentnotif.viewall")}
        </a>
      </div>
      <div className="divide-y divide-gray-100 space-y-5 mt-5">
        {notifications.map((notify, idx) => (
          <NotificationRow key={idx} notification={notify} />
        ))}
      </div>
    </div>
  );
};
