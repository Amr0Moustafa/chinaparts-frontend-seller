"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

import { X } from "lucide-react";
import Image from "next/image";
import { ProductDetailsDialogProps } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ActionDialogProps {
  orderId: string;
  title: string;
  description: string;
  type: "approve" | "reject";
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}
export const ActionDialog = ({
  orderId,
  title,
  description,
  type,
  isOpen,
  onClose,
  onConfirm,
}: ActionDialogProps) => {
  const { i18n, t } = useTranslation();
  const direction = i18n.dir();

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  return (
    <DialogContent
      showCloseButton={false}
      className={`w-full max-w-md border-2 border-0 bg-white rounded-lg shadow-lg p-0 ${
        direction === "rtl" ? "text-right" : "text-left"
      }`}
    >
      {/* Header */}
      <div className=" px-4 py-3  rounded-t-lg">
        <div className="flex justify-between items-center">
          <DialogTitle className=" font-semibold text-lg lg:text-2xl">
            {title} #{orderId}
          </DialogTitle>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
          <DialogDescription className="text-lg  leading-relaxed mb-6">
          {description}
        </DialogDescription>
        {type === "reject" && (
          <>
          <DialogDescription className="text-md font-bold leading-relaxed mb-6">
          {description}
        </DialogDescription>
          <div className="mb-6">
            <textarea
              placeholder="Reason for rejection..."
              className="w-full p-3 border border-gray-300 rounded-md resize-none h-20 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          </>
          
        )}

        {/* Action Buttons */}
       <div className=" dialog_footer flex justify-end gap-3 mt-5">
 
 <DialogClose asChild>
  <Button
    variant="outline"
    className="md:py-2 md:px-3 font-bold text-gray-900 bg-white border border-gray-300"
  >
    Cancel
  </Button>
</DialogClose>

<DialogClose asChild>
   <Button
    onClick={handleConfirm}
    className={`py-3 px-5 font-bold bg-orange-500 hover:bg-orange-600 `}
  >
    {type === "approve" ? t("confirm") : t("submit")}
  </Button>
</DialogClose>
 
</div>

      </div>
    </DialogContent>
  );
};

export const ApproveDialog = (props: Omit<ActionDialogProps, "type">) => (
  <ActionDialog {...props} type="approve" />
);

export const RejectDialog = (props: Omit<ActionDialogProps, "type">) => (
  <ActionDialog {...props} type="reject" />
);
