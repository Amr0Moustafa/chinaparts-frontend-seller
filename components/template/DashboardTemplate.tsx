"use client";

import { useTranslation } from "react-i18next";
import { StatCard } from "@/components/molecules/widgets/StatCard";
import { ChartColumn } from "lucide-react";
import {
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineChatBubbleLeftEllipsis,
} from "react-icons/hi2";
import { Plus, Package, MessageSquare, Percent, Store } from "lucide-react";

import { HiOutlineClipboardCheck, HiOutlineReply } from "react-icons/hi";
import { QuickActionCard } from "../molecules/widgets/QuickActionCard";
import { TopSellingProduct } from "@/types/product";
import { TopSellingProducts } from "../organisms/product/TopSellingProducts";
import { RecentOrders } from "@/types/order";
import { RecentOrdersCard } from "../organisms/product/RecentOrdersCard";
import { NotificationItem } from "@/types/notification";
import { RecentNotficationsCard } from "../organisms/product/RecentNotficationsCard";
import { OrderData } from "@/types/chart";
import { OrdersOverview } from "../organisms/order/OrdersOverview";

type StatColor = "blue" | "green" | "orange" | "purple" | "red" | "violet";

interface StatDataItem {
  icon: React.ReactNode;
  value: number;
  label: string;
  subLabel?: string;
  change?: string;
  color: StatColor;
}





export const sampleTopSelling: TopSellingProduct[] = [
  {
    id: "1",
    title: "BMW Brake Pads Set",
    imageUrl: "/images/product/Vector.png",
    sold: 45,
    price: 2250,
    rating: 4.9,
  },
  {
    id: "2",
    title: "Mercedes Oil Filter",
    imageUrl: "/images/mercedes-oil-filter.png",
    sold: 38,
    price: 1520,
    rating: 4.8,
  },
  {
    id: "3",
    title: "Audi Headlight Assembly",
    imageUrl: "/images/audi-headlight.png",
    sold: 28,
    price: 2800,
    rating: 4.7,
  },
  {
    id: "4",
    title: "Toyota Spark Plugs",
    imageUrl: "/images/toyota-spark-plugs.png",
    sold: 23,
    price: 920,
    rating: 4.9,
  },
];

export const orders: RecentOrders[] = [
  {
    id: "ORD-001",
    customer: "John Smith",
    product: "Brake Pads - Toyota Camry",
    price: 89.99,
    status: "Pending",
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    product: "Air Filter - Honda Civic",
    price: 24.99,
    status: "Shipped",
  },
  {
    id: "ORD-003",
    customer: "Mike Wilson",
    product: "Oil Filter - Ford F-150",
    price: 15.99,
    status: "Completed",
  },
  {
    id: "ORD-004",
    customer: "Lisa Davis",
    product: "Spark Plugs - BMW 3 Series",
    price: 45.99,
    status: "Processing",
  },
  {
    id: "ORD-005",
    customer: "Emma Brown",
    product: "Battery - Nissan Altima",
    price: 129.99,
    status: "Pending",
  },
  {
    id: "ORD-006",
    customer: "Liam Johnson",
    product: "Tires - Hyundai Elantra",
    price: 399.99,
    status: "Shipped",
  },
  {
    id: "ORD-007",
    customer: "Olivia Lee",
    product: "Wiper Blades - Mazda CX-5",
    price: 19.99,
    status: "Completed",
  },
  {
    id: "ORD-008",
    customer: "Noah Garcia",
    product: "AC Compressor - Chevy Malibu",
    price: 229.5,
    status: "Processing",
  },
];
const notifications: NotificationItem[] = [
  {
    id: "ORD-005",
    type: "order",
    title: "New Order Received",
    message: "Order #ORD-005 from Alex Chen",
    time: "2 minutes ago",
    icon: "order-icon",
  },
  {
    id: "MSG-001",
    type: "message",
    title: "Customer Message",
    message: "Question about brake pad compatibility",
    time: "15 minutes ago",
    icon: "message-icon",
  },
  {
    id: "ORD-001",
    type: "return",
    title: "Return Request",
    message: "Return requested for Order #ORD-001",
    time: "1 hour ago",
    icon: "return-icon",
  },
  {
    id: "MILE-050",
    type: "milestone",
    title: "Sales Milestone",
    message: "You reached $5,000 in monthly sales!",
    time: "3 hours ago",
    icon: "milestone-icon",
  },
  {
    id: "ORD-003",
    type: "completion",
    title: "Order Completed",
    message: "Order #ORD-003 marked as delivered",
    time: "5 hours ago",
    icon: "check-icon",
  },
];

const ordersData: OrderData[] = [
  { day: "Mon", orders: 12 },
  { day: "Tue", orders: 17 },
  { day: "Wed", orders: 9 },
  { day: "Thu", orders: 20 },
  { day: "Fri", orders: 14 },
  { day: "Sat", orders: 28 },
  { day: "Sun", orders: 18 },
];
export const DashboardTemplate = () => {
  const { t } = useTranslation();
  const quickActions = [
    {
      title: t("quickActions.addProduct.title"),
      subtitle: t("quickActions.addProduct.subtitle"),
      icon: <Plus size={20} />,
      href: "/dashboard/products/create",
    },
    {
      title: t("quickActions.manageOrders.title"),
      subtitle: t("quickActions.manageOrders.subtitle"),
      icon: <Package size={20} />,
      href: "/dashboard/orders",
    },
    {
      title: t("quickActions.replyMessages.title"),
      subtitle: t("quickActions.replyMessages.subtitle"),
      icon: <MessageSquare size={20} />,
      href: "/dashboard/messages",
    },
    {
      title: t("quickActions.createOffers.title"),
      subtitle: t("quickActions.createOffers.subtitle"),
      icon: <Percent size={20} />,
      text: "text-purple-600",
      href: "/dashboard/offers/create",
    },
    {
      title: t("quickActions.editStore.title"),
      subtitle: t("quickActions.editStore.subtitle"),
      icon: <Store size={20} />,
      href: "/dashboard/settings",
    },
  ];
  const statsData :StatDataItem[] = [
    {
      icon: <HiOutlineCube className="w-5 h-5" />,
      value: 248,
      label: t("stats.total"),
      subLabel: t("stats.totalProducts_sub"),
      color: "blue",
      change: "+12 from yesterday",
    },
    {
      icon: <HiOutlineShoppingCart className="w-5 h-5" />,
      value: 23,
      label: t("stats.newOrders"),
      subLabel: t("stats.newOrders_sub"),
      color: "green",
      change: "+8 from yesterday",
    },
    {
      icon: <HiOutlineClipboardCheck className="w-5 h-5" />,
      value: 17,
      label: t("stats.inProgress"),
      subLabel: t("stats.inProgress_sub"),
      color: "orange",
      change: "-3 from yesterday",
    },
    {
      icon: <HiOutlineReply className="w-5 h-5" />,
      value: 3,
      label: t("stats.returns"),
      subLabel: t("stats.returns_sub"),
      color: "purple",
      change: "+1 from yesterday",
    },
    {
      icon: <HiOutlineChatBubbleLeftEllipsis className="w-5 h-5" />,
      value: 8,
      label: t("stats.messages"),
      subLabel: t("stats.messages_sub"),
      color: "red",
      change: "+2 from yesterday",
    },
  ];
  return (
    <div className="min-h-screen">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              subLabel={stat.subLabel}
              color={stat.color}
              change={stat.change}
              home={true}
            />
          ))}
        </div>
        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 ">
          <div className="flex items-center gap-3 mb-4 ">
            <ChartColumn className="text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900 ">{t("quickActions.title")}</h2>
          </div>

          <div className="grid   grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                title={action.title}
                subtitle={action.subtitle}
                icon={action.icon}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Orders */}
          <div className="p-6 bg-white rounded-lg md:col-span-7">
            <OrdersOverview
              data={ordersData}
              totalOrders={122}
              revenue={8420}
              rating={4.8}
            />
          </div>
          {/* Top Selling Products */}
          <div className="p-6 bg-white rounded-lg md:col-span-5">
            <TopSellingProducts products={sampleTopSelling} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent Orders */}
          <div className="p-6 bg-white rounded-lg">
            <RecentOrdersCard orders={orders.slice(0, 4)} />
          </div>
          {/* Recent Notifications  */}
          <div className="p-6 bg-white rounded-lg">
            <RecentNotficationsCard notifications={notifications} />
          </div>
        </div>
      </div>
    </div>
  );
};
