import { OrderTemplate } from "@/components/template/OrdersTemplate";



export default async function Orders() {
  return (
    <section id="order-page" className=" min-h-screen ">
      <OrderTemplate/>
    </section>
  );
}