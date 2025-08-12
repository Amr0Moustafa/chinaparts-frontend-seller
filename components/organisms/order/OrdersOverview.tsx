"use client";
import { OrdersChart } from "@/components/molecules/order/OrdersChart";
import { StatItem } from "@/components/atoms/StatItem";
import { OrderData } from "@/types/chart";
import { useTranslation } from "react-i18next";

type OrdersOverviewProps = {
  data: OrderData[];
  totalOrders: number;
  revenue: number;
  rating: number;
};

export const OrdersOverview = ({
  data,
  totalOrders,
  revenue,
  rating,
}: OrdersOverviewProps) => {
    const { t } = useTranslation();
  return (
    <div className=" space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {/* {t('orderchart.order_trend')} (Last 7 Days) */}
          {t('orderchart.order_trend')}
        </h3>
        <span className="text-sm text-green-600 font-medium">
          +15% {t('orderchart.vs_last_week')}
        </span>
      </div>

      <OrdersChart data={data} />

      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <StatItem value={totalOrders.toString()} label={t('orderchart.total_orders')} />
        <StatItem value={`$${revenue.toLocaleString()}`} label={t('orderchart.Revenue')} />
        <StatItem value={rating.toString()} label={t('orderchart.avg_rating')} />
      </div>
    </div>
  );
};
