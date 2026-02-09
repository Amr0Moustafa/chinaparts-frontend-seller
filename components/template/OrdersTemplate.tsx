"use client";

import { StatCard } from "@/components/molecules/widgets/StatCard";
import { Truck, Package, CircleCheckBig, ShoppingCart, CircleX } from "lucide-react";
import { DynamicTable, Column } from "../organisms/table/DynamicTable";
import { useMemo, useState } from "react";
import { StyledPagination } from "../molecules/pagination/Pagination";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { SubOrder } from "@/types/order";
import {
  useGetSubOrdersQuery,
  useGetSubOrdersSalesReportQuery,
  useUpdateSubOrderStatusMutation,
} from "@/features/sellerSubOrders";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const OrderTemplate = () => {
  const { t } = useTranslation();
  const router = useRouter();

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // ✅ Mutation hook for updating order status
  const [updateStatus, { isLoading: isUpdating }] = useUpdateSubOrderStatusMutation();

  // ✅ Fetch orders from API with pagination
  const { 
    data: ordersResponse, 
    isLoading: ordersLoading, 
    error: ordersError 
  } = useGetSubOrdersQuery(
    { page: currentPage, per_page: PAGE_SIZE },
    { refetchOnMountOrArgChange: true }
  );
  
  const { data: salesReportResponse } = useGetSubOrdersSalesReportQuery();

  // ✅ Extract data and meta
  const orders: SubOrder[] = ordersResponse?.data || [];
  const meta = ordersResponse?.meta || {
    current_page: 1,
    from: 0,
    last_page: 1,
    per_page: PAGE_SIZE,
    to: 0,
    total: 0,
  };
  const salesReport = salesReportResponse?.data || {};

  // ✅ Calculate stats from sales report
  const stats = useMemo(() => {
    if (salesReport) {
      return {
        processing: salesReport.processing_count || 0,
        shipped: salesReport.shipped_count || 0,
        delivered: salesReport.delivered_count || 0,
        total: salesReport.total_orders || meta.total,
        rejected: salesReport.rejected_count || 0,
      };
    }

    // Fallback: Calculate from meta or orders array
    return {
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      total: meta.total,
      rejected: orders.filter((o) =>  o.status === "cancelled").length,
    };
  }, [orders, salesReport, meta.total]);

  // ✅ Handle accept order (confirm)
  const handleAcceptOrder = async (item: SubOrder) => {
    try {
      await updateStatus({
        id: item.id,
        status: "confirmed",
      }).unwrap();
      
      // Optional: Show success message
      console.log(`Order ${item.sub_order_number} confirmed successfully`);
    } catch (error) {
      // Optional: Show error message
      console.error("Failed to confirm order:", error);
    }
  };

  // ✅ Handle reject order (cancel) with notes
  const handleRejectOrder = async (item: SubOrder & { reject_notes?: string }) => {
    try {
      const payload: any = {
        id: item.id,
        status: "cancelled",
      };

      // Add notes if provided
      if (item.reject_notes) {
        payload.notes = item.reject_notes;
      }

      await updateStatus(payload).unwrap();
      
      // Optional: Show success message
      console.log(`Order ${item.sub_order_number} cancelled successfully`);
    } catch (error) {
      // Optional: Show error message
      console.error("Failed to cancel order:", error);
    }
  };

  // ✅ Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ Table columns using accessor functions for custom rendering
  const orderColumns: Column<SubOrder>[] = [
    { 
      id: "sub_order_number",
      header: t("order.table.orderId"), 
      accessor: "sub_order_number"
    },
    { 
      id: "customer",
      header: t("order.table.customer"), 
      accessor: (item:any) => item.customer?.name || "N/A"
    },
    { 
      id: "total",
      header: t("order.table.amount"), 
      accessor: (item:any) => `$${parseFloat(item.total).toFixed(2)}`
    },
    { 
      id: "created_at",
      header: t("order.table.date"), 
      accessor: (item:any) => new Date(item.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    { 
      id: "status",
      header: t("order.table.status"), 
      accessor: (item) => {
        const statusColors: Record<string, string> = {
          pending: "bg-orange-100 text-orange-800",
          confirmed: "bg-blue-100 text-blue-800",
          processing: "bg-yellow-100 text-yellow-800",
          shipped: "bg-blue-100 text-blue-800",
          out_for_delivery: "bg-orange-100 text-orange-800",
          delivered: "bg-green-100 text-green-800",
          cancelled: "bg-red-100 text-red-800",
          refunded: "bg-gray-100 text-gray-800",
        };

        const colorClass = statusColors[item.status] || "bg-gray-100 text-gray-800";

        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${colorClass}`}>
            {item.status_label || item.status}
          </span>
        );
      }
    },
  ];

  // ✅ Type guard for error handling
  const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError => {
    return error && typeof error === 'object' && 'status' in error;
  };

  // ✅ Get error message safely
  const getErrorMessage = (): string => {
    if (!ordersError) return "";
    
    if (isFetchBaseQueryError(ordersError)) {
      // FetchBaseQueryError
      if (ordersError.data && typeof ordersError.data === 'object' && 'message' in ordersError.data) {
        return (ordersError.data as { message: string }).message;
      }
      return `Error: ${ordersError.status}`;
    } else {
      // SerializedError
      return ordersError.message || "An unknown error occurred";
    }
  };

  // ✅ Loading state
  if (ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (ordersError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold mb-2">Error Loading Orders</h3>
            <p className="text-red-600 text-sm">
              {getErrorMessage() || "Failed to load orders. Please try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h3 className="text-lg md:text-2xl font-bold">{t("order.title")}</h3>
      </div>
      
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            icon={<Package className="w-7 h-7" />}
            value={stats.processing}
            label={t("order.stats.processing")}
            color="green"
            home={false}
          />
          <StatCard
            icon={<Truck className="w-7 h-7" />}
            value={stats.shipped}
            label={t("order.stats.shipped")}
            color="orange"
            home={false}
          />
          <StatCard
            icon={<CircleCheckBig className="w-7 h-7" />}
            value={stats.delivered}
            label={t("order.stats.delivered")}
            color="blue"
            home={false}
          />
          <StatCard
            icon={<ShoppingCart className="w-7 h-7" />}
            value={stats.total}
            label={t("order.stats.totalOrders")}
            color="purple"
            home={false}
          />
          <StatCard
            icon={<CircleX className="w-7 h-7" />}
            value={stats.rejected}
            label={t("order.stats.rejected")}
            color="red"
            home={false}
          />
        </div>

        {/* Orders Table */}
        <DynamicTable
          title={t("orderchart.recentorders.title")}
          columns={orderColumns}
          data={orders}
          onShow={(item) => router.push(`/dashboard/orders/${item.id}`)}
          onAccept={handleAcceptOrder}
          onReject={handleRejectOrder}
          dialogaccept={true}
          dialogreject={true}
          dialogshow={false}
        />

        {/* Pagination */}
        {meta.total > 0 && (
          <div className="flex items-center justify-center md:justify-between mt-6 bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-4 w-full">
              <StyledPagination
                currentPage={meta.current_page}
                totalPages={meta.last_page}
                onPageChange={handlePageChange}
                showText={false}
                buttonWrapperClassName="flex justify-between w-full"
              />
            </div>

            <span className="hidden md:flex text-sm text-gray-500 w-full items-end justify-end">
              {t("category.showing")} {meta.from}–{meta.to}{" "}
              {t("category.of")} {meta.total} {t("category.products")}
            </span>
          </div>
        )}

        {/* Empty State */}
        {meta.total === 0 && !ordersLoading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Orders Yet</h3>
            <p className="text-gray-500">Your orders will appear here once customers start purchasing.</p>
          </div>
        )}
      </div>
    </div>
  );
};