export type ReturnRequest = {
  id: string;
  product: string;
  customer: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
  amount: string;
};