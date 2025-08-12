"use client";
import { FC } from "react";
import { Package, CheckCircle, Truck, MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import { ProductInformation } from "@/components/organisms/order/ProductInformation";
import { CustomerInformation } from "@/components/organisms/order/CustomerInformation";
import { PaymentInformation } from "@/components/organisms/order/PaymentInformation";
import { OrderStatus } from "@/components/organisms/order/OrderStatus";
import { OrderTimeline } from "@/components/organisms/order/OrderTimeline";
import { ActionButtons } from "@/components/molecules/order/ActionButtons";
import { OrderDataDetails } from "@/types/order";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

export const OrderDetailsTemplate: FC = () => {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const direction = i18n.dir();
  // Sample data (replace with props or API data)
  const orderData:OrderDataDetails  = {
    orderId: "ORD-001",
    product: {
      name: "Air Filter - Honda Civic",
      sku: "AF-HC-2024",
      orderDate: "June 10, 2024",
      quantity: 1,
      price: 24.99,
      image: "/images/product/Vector.png",
    },
    customer: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, Apt 4B, New York, NY 10001",
    },
    payment: {
      subtotal: 516.88,
      tax: 52.12,
      shipping: 5.99,
      total: 524.99,
    },
    status: "Shipped",
    timeline: [
  { icon: "Package", title: "Order Processed", date: "June 13, 2024 - 2:30 PM", isCompleted: true },
  { icon: "CheckCircle", title: "Shipped", date: "June 14, 2024 - 2:30 PM", isActive: true },
  { icon: "Truck", title: "Out for Delivery", date: "June 14, 2024 - 2:30 PM", isActive: false },
  { icon: "MapPin", title: "Delivered", date: "June 14, 2024 - 2:30 PM", isActive: false },
]

  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto md:p-6 ">
         <div className="flex items-center   mb-6 ">
          {direction === 'rtl' ? (<ArrowRight onClick={() => router.back()} className="text-orange-500" />) : (<ArrowLeft  onClick={() => router.back()} className="text-orange-500" />) }
                 
                 <h5 className="text-xl font-bold text-slate-800">{t("orderdetails.title")}</h5>
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
                <ActionButtons />
                </div>            
          </div>
        </div>
      </div>
    </div>
  );
};
