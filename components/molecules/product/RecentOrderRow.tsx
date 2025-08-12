import type { RecentOrders } from "@/types/order";
import { StatusBadge } from "@/components/atoms/StatusBadge";

const statusToColor: Record<
  string,
  "green" | "red" | "orange" | "yellow" | "blue"
> = {
  Pending: "yellow",
  Shipped: "blue",
  Completed: "green",
  Processing: "orange",
  Failed: "red",
};
export const RecentOrderRow = ({ order }: { order: RecentOrders }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-[#FFFAF5] rounded-md">
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
          <span>{order.id}</span>
          <StatusBadge
            label={order.status}
            color={statusToColor[order.status]}
          />
        </div>
        <div className="mt-1 text-sm text-slate-700 font-semibold">
          {order.customer}
        </div>
        <div className="text-xs text-slate-500">{order.product}</div>
        <div className="mt-1">
          <div className="text-sm font-semibold text-green-600">
            ${order.price.toFixed(2)}
          </div>
        </div>
      </div>
      <button className="text-slate-500 hover:text-slate-700 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
        </svg>
      </button>
    </div>
  );
};
