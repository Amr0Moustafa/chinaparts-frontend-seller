export type Payment = {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
};

export interface PaymentInformationProps {
  payment: Payment;
}