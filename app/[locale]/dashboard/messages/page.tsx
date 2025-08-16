import { MessagesTemplate } from "@/components/template/MessagesTemplate";
import { ProductTemplate } from "@/components/template/ProductTemplate";



export default async function Messages() {
  return (
    <section id="messages-page" className=" min-h-screen ">
     <MessagesTemplate/>
    </section>
  );
}