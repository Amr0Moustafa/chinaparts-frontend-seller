"use client";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";


interface ActionButtonsProps {
  onContact?: () => void;
  onPrint?: () => void;
}

export const ActionButtons: FC<ActionButtonsProps> = ({ onContact, onPrint }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3 ">
      <Button
        onClick={onContact}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-base font-medium"
      >
        
       {t("orderdetails.contactcustomer")}
      </Button>

      <Button
        variant="outline"
        onClick={onPrint}
        className="w-full py-6 border border-gray-300 text-base font-medium hover:bg-gray-50"
      >
        
        {t("orderdetails.printinvoice")}
      </Button>
    </div>
  );
};
