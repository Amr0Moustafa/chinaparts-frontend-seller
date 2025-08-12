"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { OrderData } from "@/types/chart";
import { useTranslation } from "react-i18next";

type OrdersChartProps = {
  data: OrderData[];
};

export const OrdersChart = ({ data }: OrdersChartProps) =>{
    const { i18n }=useTranslation()
    const isRTL = i18n.dir() === "rtl"; 
   return  (
   <ResponsiveContainer width="100%" height={250}>
    <BarChart
      data={data}
      layout="horizontal"
      barCategoryGap={12}
      margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
    >
      <XAxis
        dataKey="day"
        reversed={isRTL}
        textAnchor={isRTL ? "end" : "start"}
        tick={{ transform: isRTL ? "translate(0,0) scale(-1,1)" : undefined }}
      />
      <YAxis />
      <Tooltip
        contentStyle={{ direction: isRTL ? "rtl" : "ltr" }}
        wrapperStyle={{ direction: isRTL ? "rtl" : "ltr" }}
      />
      <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);
}
