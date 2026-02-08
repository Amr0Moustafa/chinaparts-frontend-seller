"use client";
import { FC } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProductInformation } from "@/components/organisms/order/ProductInformation";
import { CustomerInformation } from "@/components/organisms/order/CustomerInformation";
import { PaymentInformation } from "@/components/organisms/order/PaymentInformation";
import { OrderStatus } from "@/components/organisms/order/OrderStatus";
import { OrderTimeline } from "@/components/organisms/order/OrderTimeline";
import { ActionButtons } from "@/components/molecules/order/ActionButtons";
import { OrderDataDetails, SubOrder } from "@/types/order";
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import { useGetSubOrderByIdQuery } from "@/features/sellerSubOrders";

export const OrderDetailsTemplate: FC = () => {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const direction = i18n.dir();
  
  const orderId = Number(params?.id);

  // Fetch order details from API
  const { data: orderResponse, isLoading, error } = useGetSubOrderByIdQuery(orderId, {
    skip: !orderId,
  });

  // Transform API data to match component structure
  const transformOrderData = (apiData: any): OrderDataDetails => {
    // Get first item for product display (or combine all items if needed)
    const firstItem = apiData.items[0];
    
    // Calculate shipping (you might need to adjust this based on your data)
    const subtotal = parseFloat(apiData.subtotal);
    const tax = parseFloat(apiData.tax);
    const total = parseFloat(apiData.total);
    const shipping = total - subtotal - tax;

    // Build timeline from status history
    const timeline = apiData.status_history.map((history:any, index:any) => {
      const isCompleted = index < apiData.status_history.length - 1;
      const isActive = index === apiData.status_history.length - 1;
      
      return {
        icon: getIconForStatus(history.to_status),
        title: history.to_status.replace(/_/g, ' ').replace(/\b\w/g, (l:any) => l.toUpperCase()),
        date: new Date(history.created_at).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        isCompleted,
        isActive,
      };
    });

    return {
      orderId: apiData.sub_order_number,
      product: {
        name: firstItem.product_name,
        sku: firstItem.product_sku,
        orderDate: new Date(apiData.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        quantity: firstItem.quantity,
        price: parseFloat(firstItem.price),
        image: firstItem.product_image,
      },
      customer: {
        name: `${apiData.customer.first_name} ${apiData.customer.last_name}`,
        email: apiData.customer.email,
        phone: apiData.customer.phone,
        address: buildAddress(apiData.shipping_address),
      },
      payment: {
        subtotal,
        tax,
        shipping: shipping > 0 ? shipping : 0,
        total,
      },
      status: apiData.status_label,
      timeline,
    };
  };

  // Helper function to get icon name based on status
  const getIconForStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: "Package",
      confirmed: "CheckCircle",
      shipped: "Truck",
      out_for_delivery: "Truck",
      delivered: "MapPin",
      cancelled: "XCircle",
    };
    return statusMap[status] || "Package";
  };

  // Helper function to build address string
  const buildAddress = (address: any['shipping_address']): string => {
    const parts = [
      address.address_line_1,
      address.address_line_2,
      address.city,
      address.state,
      address.country,
      address.postal_code,
    ].filter(Boolean);
    
    return parts.join(", ");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !orderResponse?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold mb-2">Error Loading Order</h3>
            <p className="text-red-600 text-sm">
              Failed to load order details. Please try again.
            </p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const orderData = transformOrderData(orderResponse.data);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto md:p-6">
        <div className="flex items-center gap-3 mb-6">
          {direction === 'rtl' ? (
            <ArrowRight 
              onClick={() => router.back()} 
              className="text-orange-500 cursor-pointer hover:text-orange-600" 
            />
          ) : (
            <ArrowLeft 
              onClick={() => router.back()} 
              className="text-orange-500 cursor-pointer hover:text-orange-600" 
            />
          )}
          <h5 className="text-xl font-bold text-slate-800">
            {t("orderdetails.title")} - {orderData.orderId}
          </h5>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <ProductInformation product={orderData.product} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomerInformation customer={orderData.customer} />
              <PaymentInformation payment={orderData.payment} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <OrderStatus status={orderData.status} />
            <OrderTimeline timeline={orderData.timeline} />
            <div className="bg-white border border-gray-300 p-4 rounded-lg">
              <ActionButtons 
                orderId={orderResponse.data.id}
                canUpdate={orderResponse.data.can_be_updated}
                canCancel={orderResponse.data.can_be_cancelled}
              />
            </div>
          </div>
        </div>

        {/* Additional Items Section (if multiple items) */}
        {orderResponse.data.items.length > 1 && (
          <div className="mt-6 bg-white border border-gray-300 p-6 rounded-lg">
            <h6 className="text-lg font-bold mb-4">All Items in this Order</h6>
            <div className="space-y-4">
              {orderResponse.data.items.map((item:any) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img 
                    src={item.product_image} 
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h6 className="font-semibold">{item.product_name}</h6>
                    <p className="text-sm text-gray-600">SKU: {item.product_sku}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${parseFloat(item.total).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">${parseFloat(item.price).toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};