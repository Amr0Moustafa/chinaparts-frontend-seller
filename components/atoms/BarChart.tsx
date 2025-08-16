"use client";

import { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type BarChartDataItem = {
  name: string; // X-axis label
  value: number; // Y-axis value
};

type DynamicBarChartProps = {
  data: BarChartDataItem[];
  xKey?: string; // defaults to "name"
  yKey?: string; // defaults to "value"
  barColor?: string; // defaults to theme color
};

export const DynamicBarChart: FC<DynamicBarChartProps> = ({
  data,
  xKey = "name",
  yKey = "value",
  barColor = "#4F46E5", // indigo-600
}) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey={xKey} stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip />
          <Bar dataKey={yKey} fill={barColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
