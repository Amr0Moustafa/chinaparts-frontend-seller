"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface LineChartAtomProps {
  data: any[];
  lines: { dataKey: string; color: string }[];
  xKey: string;
  height?: number;
  margin?: { top?: number; right?: number; left?: number; bottom?: number };
}

export const LineChartAtom = ({
  data,
  lines,
  xKey,
  height = 300,
  margin = { top: 5, right: 30, left: 20, bottom: 5 },
}: LineChartAtomProps) => {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
