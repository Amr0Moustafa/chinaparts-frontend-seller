export interface Coupon{
  code: string;
  title: string;
  discount: string;
  minOrder: string;
  usage: string;
  date: string;
  status: "Active" | "Expired" | "Scheduled";
};