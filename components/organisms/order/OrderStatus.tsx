"use client";
import { FC, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { Package, Loader2, CheckCircle, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useUpdateSubOrderStatusMutation } from "@/features/sellerSubOrders";

type BadgeColor = "green" | "red" | "orange" | "yellow" | "blue" | "gray";

interface OrderStatusProps {
  status: string;
  orderId: number;
  canUpdate?: boolean;
}

const statusToColorMap: Record<string, BadgeColor> = {
  all: "gray",
  pending: "orange",
  confirmed: "blue",
  processing: "yellow",
  shipped: "blue",
  out_for_delivery: "orange",
  delivered: "green",
  cancelled: "red",
  refunded: "gray",
};

const statusDisplayNames: Record<string, string> = {
  all: "All",
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const OrderStatus: FC<OrderStatusProps> = ({ 
  status, 
  orderId,
  canUpdate = true 
}) => {
  // Normalize the initial status
  const normalizeStatus = (stat: string) => {
    return stat?.toLowerCase().replace(/\s+/g, '_') || "pending";
  };

  const [selectedStatus, setSelectedStatus] = useState(normalizeStatus(status));
  const [updateMessage, setUpdateMessage] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const { t } = useTranslation();
  
  const [updateStatus, { isLoading: isUpdating }] = useUpdateSubOrderStatusMutation();

  // Update local state when prop changes
  useEffect(() => {
    console.log('Status prop changed:', status);
    if (status) {
      const normalized = normalizeStatus(status);
      console.log('Normalized status:', normalized);
      setSelectedStatus(normalized);
    }
  }, [status]);

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (updateMessage.type) {
      const timer = setTimeout(() => {
        setUpdateMessage({ type: null, message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [updateMessage]);

  const handleStatusChange = async (newStatus: string) => {
    console.log('Attempting to change status to:', newStatus);
    console.log('Current status:', selectedStatus);
    
    

    try {
      const result = await updateStatus({
        id: orderId,
        status: newStatus,
      }).unwrap();

      console.log('Status update successful:', result);

      // Optimistically update local state
      setSelectedStatus(newStatus);
      
      setUpdateMessage({
        type: 'success',
        message: `Order status updated to ${statusDisplayNames[newStatus]}`
      });
    } catch (error: any) {
      console.error('Status update failed:', error);
      const errorMessage = error?.data?.message || "Failed to update order status";
      
      setUpdateMessage({
        type: 'error',
        message: errorMessage
      });
    }
  };

  const badgeColor = statusToColorMap[selectedStatus] || "gray";

  // Filter out "all" from the dropdown options
  const availableStatuses = Object.keys(statusToColorMap).filter(
    (statusKey) => statusKey !== "all"
  );

  console.log('Current selectedStatus:', selectedStatus);
  console.log('Display name:', statusDisplayNames[selectedStatus]);

  return (
    <Card className="bg-white border border-gray-300">
      <div className="px-4">
        <SectionHeader
          icon={Package}
          title={t("orderdetails.orderStatus.title")}
          actionButton={
            <div className="flex items-center gap-2">
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-orange-500" />}
              <StatusBadge 
                label={statusDisplayNames[selectedStatus] || selectedStatus} 
                color={badgeColor} 
              />
            </div>
          }
        />
      </div>

      <CardContent className="pt-0">
        {/* Success/Error Message */}
        {updateMessage.type && (
          <div
            className={`mb-3 p-3 rounded-lg flex items-start gap-2 ${
              updateMessage.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {updateMessage.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <p
              className={`text-sm ${
                updateMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {updateMessage.message}
            </p>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-3">
          {t("orderdetails.orderStatus.updateLabel")}
        </p>
        <Select
          value={selectedStatus}
          onValueChange={handleStatusChange}
          // disabled={!canUpdate || isUpdating}
        >
          <SelectTrigger className="w-full border-gray-300 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <SelectValue>
              {statusDisplayNames[selectedStatus] || selectedStatus}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="border-gray-300 bg-white">
            {availableStatuses.map((statusKey) => (
              <SelectItem 
                key={statusKey} 
                value={statusKey}
                className="cursor-pointer hover:bg-gray-100"
              >
                {statusDisplayNames[statusKey]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};