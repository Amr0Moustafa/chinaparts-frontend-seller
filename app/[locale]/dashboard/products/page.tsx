import { ProductTemplate } from "@/components/template/ProductTemplate";



export default async function Products() {
  return (
    <section id="products-page" className=" min-h-screen ">
      <ProductTemplate/>
    </section>
  );
}