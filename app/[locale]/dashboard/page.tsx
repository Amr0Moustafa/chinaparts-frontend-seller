import { DashboardTemplate } from "@/components/template/DashboardTemplate";
import Image from "next/image";

export default async function Home() {
  return (
    <section id="home-page" className=" min-h-screen ">
      <DashboardTemplate />
    </section>
  );
}
