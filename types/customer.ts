export type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export interface CustomerInformationProps {
  customer: Customer;
}


export interface ReturnsCustomer {
  name: string;
  orderId: string;
  returnDate: string;
}