"use client";
import { FC, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  Download,
  RotateCcw,
  ShoppingCart,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { StoreForm } from "../organisms/setting/Storeform";
import { Button } from "../ui/button";
import { StatCard } from "../molecules/widgets/StatCard";
import { LineChartAtom } from "../atoms/LineChart";
import { DynamicPieChart } from "../atoms/PieChart";
import { FilterTabs } from "../organisms/table/TableFilter";
import { DynamicBarChart } from "../atoms/BarChart";
import SelectField from "../atoms/SelectField";
import { InputField } from "../atoms/input";
import { useForm, FormProvider } from "react-hook-form";
import { BestSellingProducts } from "../organisms/table/BestSellingProducts";

type StatColor = "blue" | "green" | "orange" | "purple" | "red" | "violet";

interface StatDataItem {
  icon: React.ReactNode;
  value: number;
  label: string;
  subLabel?: string;
  change?: string;
  color: StatColor;
}

const chartData = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];
const orderStatusData = [
  { name: "Completed", value: 65 },
  { name: "Pending", value: 20 },
  { name: "Canceled", value: 10 },
  { name: "Returned", value: 5 },
];

const productPerformance = [
  { name: "Engine Parts", value: 16000 },
  { name: "Suspension", value: 12000 },
  { name: "Brake Pads", value: 8000 },
  { name: "Tires", value: 4000 },
  { name: "Body Parts", value: 1500 },
];

const bestSellingProducts = [
    {
      productName: "Brake Pads - Premium",
      quantitySold: 156,
      revenue: "$7,800",
      platformCommission: "$25.00",
      trend: "+12%",
    },
    {
      productName: "Engine Oil Filter",
      quantitySold: 143,
      revenue: "$2,860",
      platformCommission: "$25.00",
      trend: "+8%",
    },
    {
      productName: "Shock Absorber Set",
      quantitySold: 89,
      revenue: "$9,900",
      platformCommission: "$25.00",
      trend: "+15%",
    },
    {
      productName: "Headlight Assembly",
      quantitySold: 76,
      revenue: "$6,080",
      platformCommission: "$25.00",
      trend: "+5%",
    },
    {
      productName: "Air Filter",
      quantitySold: 124,
      revenue: "$1,240",
      platformCommission: "$25.00",
      trend: "+3%",
    },
  ];
export const ReportTemplate: FC = () => {
  const { i18n, t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("Category");
  const [currentPage, setCurrentPage] = useState(1);
  const methods = useForm();
  const statsData: StatDataItem[] = [
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      value: 248,
      label: t("stats.total"),
      subLabel: t("stats.totalProducts_sub"),
      color: "blue",
      change: "+12 from yesterday",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      value: 23,
      label: t("stats.newOrders"),
      subLabel: t("stats.newOrders_sub"),
      color: "green",
      change: "+8 from yesterday",
    },
    {
      icon: <BadgeDollarSign className="w-5 h-5" />,
      value: 17,
      label: t("stats.inProgress"),
      subLabel: t("stats.inProgress_sub"),
      color: "purple",
      change: "-3 from yesterday",
    },
    {
      icon: <RotateCcw className="w-5 h-5" />,
      value: 3,
      label: t("stats.returns"),
      subLabel: t("stats.returns_sub"),
      color: "orange",
      change: "+1 from yesterday",
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      value: 8,
      label: t("stats.messages"),
      subLabel: t("stats.messages_sub"),
      color: "violet",
      change: "+2 from yesterday",
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto md:p-6 ">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <h3 className="text-lg  md:text-2xl font-bold">
              {t("salesreport.title") || "Sales Reports"}
            </h3>
            <p className="text-sm text-gray-500">
              {t("salesreport.description") || "Analyze your performance and track growth"}
             </p>
          </div>

          <div className="flex-shrink-0">
            <div className="flex gap-2">
              <Button
                variant={"outline"}
                className="py-2 px-4 font-bold text-gray-900 w-auto bg-white border border-gray-300"
              >
                <Download /> {t("salesreport.exportPdf")}
              </Button>
              <Button
                variant={"outline"}
                className="py-2 px-4 font-bold text-gray-900 w-auto bg-white border border-gray-300"
              >
                <Download /> {t("salesreport.exportExcel")}
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-5 mt-5">
          {/* filter section  */}
          <div className="w-full h-auto p-3 bg-white rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">{t("salesreport.filters")}</h3>
            </div>
            <FormProvider {...methods}>
  <form
    onSubmit={methods.handleSubmit((data) => console.log(data))}
    className="grid grid-cols-1 md:grid-cols-3 gap-6"
  >
    <div>
      <InputField
        className="bg-[var(--theme-light-gray)] py-1 w-full"
        label={t("salesreport.dateRange")}
        name="datarange"
        placeholder={t("salesreport.dateRangePlaceholder")}
        type="date"
      />
    </div>

    <div>
      <SelectField
        className="bg-[var(--theme-light-gray)] py-1 w-full"
        label={t("salesreport.productCategory")}
        name="productName"
        options={[]}
        placeholder={t("salesreport.productCategoryPlaceholder")}
      />
    </div>

    <div>
      <SelectField
        className="bg-[var(--theme-light-gray)] py-1 w-full"
        label={t("salesreport.timePeriod")}
        name="timePeriod"
        options={[]}
        placeholder={t("salesreport.timePeriodPlaceholder")}
      />
    </div>
  </form>
</FormProvider>

          </div>

          {/* stats cards */}
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
          {/* charts 2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* line chart */}
            <div className="w-full h-auto p-3 bg-white rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {t("salesreport.salesTrend")}
                </h3>
              </div>
              <LineChartAtom
                data={chartData}
                xKey="name"
                lines={[
                  { dataKey: "pv", color: "#8884d8" },
                  { dataKey: "uv", color: "#82ca9d" },
                ]}
                height={350}
              />
            </div>
            {/* pie chart */}
            <div className="w-full h-auto p-3 bg-white rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {t("salesreport.orderStatusBreakdown")}
                </h3>
              </div>
              <DynamicPieChart data={orderStatusData} />

              <div className="py-3 border-t border-gray-200 grid grid-cols-3 gap-4 ">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-md font-bold">122</span>
                  <p className="text-lg"> {t("salesreport.totalOrders")}</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-md font-bold">$8,420</span>
                  <p className="text-lg">{t("salesreport.netProfit")}</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-md font-bold">4.8</span>
                  <p className="text-lg">{t("salesreport.avgRating")}</p>
                </div>
              </div>
            </div>

            {/* bar chart */}
            <div className="w-full h-auto p-3 bg-white rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {t("salesreport.productCategoryPerformance")}
                </h3>
                <div className="flex-shrink-0">
                  <FilterTabs
                    filters={[t("salesreport.category"), t("salesreport.subcategory")].map((tabKey) => t(tabKey))}
                    activeFilter={activeFilter}
                    onChange={(f) => {
                      setActiveFilter(f);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
              <DynamicBarChart
                data={productPerformance}
                barColor="#3B82F6" // blue-500
              />
            </div>
            {/*  top selling */}
            <div className="w-full h-auto p-3 bg-white rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">
                 {t("salesreport.topSellingProducts")}
                </h3>
               
              </div>
              <BestSellingProducts products={bestSellingProducts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
