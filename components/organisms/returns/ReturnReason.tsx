import { AlertCircle } from "lucide-react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { useTranslation } from "react-i18next";

interface ReturnReasonProps {
  reason: string;
}

export const ReturnReason: React.FC<ReturnReasonProps> = ({ reason }) => {
    const { t } =useTranslation()
    return(
  <div className=" p-6">
    <SectionHeader  title={t("returnsdetails.returnReason")} />
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="font-bold text-sm leading-relaxed">{reason}</p>
    </div>
  </div>
);
}

