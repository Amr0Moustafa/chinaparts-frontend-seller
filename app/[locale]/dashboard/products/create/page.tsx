import { CreateProductTemplate } from "@/components/template/CreateProductTemplate";



export default async function CreateProduct() {
    return(
        <section id="create-product-page" className=" min-h-screen ">
          <CreateProductTemplate/>
        </section>
    )
}