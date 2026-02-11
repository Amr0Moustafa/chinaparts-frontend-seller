/* =====================================================
ORDERS & SUB-ORDERS TYPES (FULL FILE)
Matches API responses + UI needs
===================================================== */

/* =============================
SHARED TYPES
============================= */

export type OrderStatus =
| "pending"
| "processing"
| "shipped"
| "delivered"
| "cancelled"
| "failed";

export type StatusColor = "green" | "red" | "yellow" | "blue" | string;

/* =============================
SUB-ORDERS API TYPES
============================= */

export interface SubOrderCustomer {
id: number;
name: string;
}

export interface SubOrder {
id: number;
sub_order_number: string;
order_number: string;
order_id: number;

status: OrderStatus;
status_label: string;
status_color: StatusColor;

subtotal: string;
tax: string;
total: string;

tracking_number: string | null;
carrier: string | null;

items_count: number;

customer: SubOrderCustomer;

shipped_at: string | null;
delivered_at: string | null;

created_at: string;
updated_at: string;
}

export interface SubOrdersResponse {
success: boolean;
message: string;
data: SubOrder[];
}

/* =============================
DASHBOARD / RECENT ORDERS
============================= */

export interface RecentOrders {
id: number;
customer: string;
price: number;
status: string;
}

export const mapSubOrderToRecentOrder = (
order: SubOrder
): RecentOrders => ({
id: order.id,
customer: order.customer.name,
price: Number(order.total),
status: order.status_label,
});

/* =============================
ORDER LIST (GENERIC)
============================= */

export interface Order {
id: string;
customer: string;
product: string;
amount: string;
date: string;
status: OrderStatus;
}

/* =============================
ORDER PRODUCT TYPES
============================= */

export type OrderProduct = {
image?: string;
name: string;
sku: string;
orderDate: string;
quantity: number;
price: number;
};

export interface OrderProductInformationProps {
product: OrderProduct;
}

export interface OrderProductDetails {
name: string;
sku: string;
orderDate: string;
quantity: number;
price: number;
image: string;
}

/* =============================
CUSTOMER & PAYMENT
============================= */

export interface Customer {
name: string;
email: string;
phone: string;
address: string;
}

export interface Payment {
subtotal: number;
tax: number;
shipping: number;
total: number;
}

/* =============================
ORDER TIMELINE
============================= */

export interface TimelineEntry {
icon: string;
title: string;
date: string;
isActive?: boolean;
isCompleted?: boolean;
}

/* =============================
FULL ORDER DETAILS VIEW
============================= */

export interface OrderDataDetails {
  orderId: string;
  product: {
    name: string;
    sku: string;
    orderDate: string;
    quantity: number;
    price: number;
    image: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  payment: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  status: string;
  timeline: Array<{
    icon: string;
    title: string;
    date: string;
    isCompleted?: boolean;
    isActive?: boolean;
  }>;
}