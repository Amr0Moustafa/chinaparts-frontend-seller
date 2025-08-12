import { OrderDetailsTemplate } from "@/components/template/OrderDetailsTemplate";

export default async function Orderdetails() {
  return (
    <section id="orderdetails-page" className=" min-h-screen ">
      <OrderDetailsTemplate/>
    </section>
  );
}