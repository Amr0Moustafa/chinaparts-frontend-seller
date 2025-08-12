"use client";
import { FC } from "react";
import {
  Package,
  CheckCircle,
  Truck,
  MapPin,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { ProductInformation } from "@/components/organisms/returns/ProductInformation";
import { CustomerInformation } from "@/components/organisms/returns/CustomerInformation";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { ReturnsCustomer } from "@/types/customer";
import { ReturnsProduct } from "@/types/product";
import ActionOptions from "../organisms/returns/ActionOptions";
import { ReturnReason } from "../organisms/returns/ReturnReason";
import AddNotes from "../organisms/returns/AddNotes";
import {Button} from "@/components/ui/button";
import { FaLuggageCart } from "react-icons/fa";
export const customer: ReturnsCustomer = {
  name: "Mohamed Ashraf",
  orderId: "ORD-2024-001",
  returnDate: "2024-01-15",
};

export const product: ReturnsProduct = {
  name: "BMW Brake Pads Set",
  price: 89.99,
  image: "/images/product/Vector.png",
  sku: "AF-HC-2024",
  partNumber: "AF-HC-2024",
};

export const reason =
  "The brake pads received do not match the specifications listed. Customer claims they are for a different BMW model.";

export const notes = "";
type ReturnDetailsTemplateProps = {
  orderId: string;
};
export const ReturnDetailsTemplate: FC<ReturnDetailsTemplateProps> = ({orderId}) => {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const direction = i18n.dir();

  const handleApprove = () => {
    console.log("✅ Approve Return clicked");
    // Add approve logic here
  };

  const handleReject = () => {
    console.log("❌ Reject Return clicked");
    // Add reject logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto  md:p-6 ">
        <div className="flex items-center   mb-6 ">
          {direction === "rtl" ? (
            <ArrowRight
              onClick={() => router.back()}
              className="text-orange-500"
            />
          ) : (
            <ArrowLeft
              onClick={() => router.back()}
              className="text-orange-500"
            />
          )}

          <h5 className="text-xl font-bold text-slate-800">
            {t("returnsdetails.title")}
          </h5>
        </div>

        {/* Main Content  */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="py-3 px-4 border-b border-gray-200 flex items-center flex-col  md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
         <FaLuggageCart className="w-5 h-5 text-orange-500" />
          <h5 className="text-xl font-bold text-slate-800">
            {t("returnsdetails.title")} -{orderId}
          </h5> 
            </div>
           
            <div className="flex gap-2 md:mt-0 mt-2">
     <Button
                onClick={handleApprove}
                className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md"
              >
                {t("returnsdetails.approveButton")}
              </Button>
              <Button
                onClick={handleReject}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md"
              >
               {t("returnsdetails.rejectButton")}
              </Button>
    </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div>
              <CustomerInformation customer={customer} />
            </div>
            <div>
              <ProductInformation product={product} />
            </div>

          </div>
          <ReturnReason reason={reason} />
          <AddNotes notes={notes} setNotes={() => {}}/>
            <div className="flex items-center justify-start w-full">
            <ActionOptions onMessageCustomer={() => {}} onUploadImages={() => {}}/>
    
            </div>
        </div>
      </div>
    </div>
  );
};
