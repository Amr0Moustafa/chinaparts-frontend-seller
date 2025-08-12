import { ReturnDetailsTemplate } from "@/components/template/ReturnDetailsTemplate";

export default async function Returndetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return (
    <section id="returndetails-page" className="min-h-screen">
      <ReturnDetailsTemplate orderId={id} />
    </section>
  );
}