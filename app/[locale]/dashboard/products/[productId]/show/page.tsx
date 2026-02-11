import ProductDetailsTemplate from "@/components/template/ProductDetailsTemplate";


export default async function CreateProduct() {
    return(
        <section id="show-product-page" className=" min-h-screen ">
          <ProductDetailsTemplate />
        </section>
    )
}