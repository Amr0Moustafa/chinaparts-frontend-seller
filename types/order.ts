export interface RecentOrders{
    id: string;
    customer: string;
    product: string;
    price: number;
    status: string; // e.g., "Pending", "Shipped", "Delivered"
}
export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Failed';

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  date: string;
  status: OrderStatus;
}

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

import { LucideIcon } from "lucide-react";

export interface OrderProductDetails {
  name: string;
  sku: string;
  orderDate: string;
  quantity: number;
  price: number;
  image: string;
}

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



export interface TimelineEntry {
  icon: string;
  title: string;
  date: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

export interface OrderDataDetails {
  orderId: string;
  product: OrderProductDetails;
  customer: Customer;
  payment: Payment;
  status: OrderStatus;
  timeline: TimelineEntry[];
}
