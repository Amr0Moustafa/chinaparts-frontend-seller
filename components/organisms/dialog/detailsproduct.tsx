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

export const ProductDetailsDialog = ({
  product,
}: ProductDetailsDialogProps) => {
  const { i18n, t } = useTranslation();
  const direction = i18n.dir();
  return (
    <DialogContent
      showCloseButton={false}
      className={`w-full max-w-md sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl border-0  bg-white max-h-[90vh] overflow-y-auto flex flex-col ${
        direction === "rtl" ? "text-right" : "text-left"
      }`}
    >
      <div className="dialog_header flex justify-between items-start">
        <DialogHeader>
          <DialogTitle className="font-bold">Product Details</DialogTitle>
        </DialogHeader>
        <DialogClose asChild>
          <Button className="bg-red-100" variant="ghost" size="icon">
            <X className="w-5 h-5 text-red-700" />
          </Button>
        </DialogClose>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2  mt-4">
        {/* Image */}
        <div className="bg-muted flex items-center justify-center p-4 rounded-lg">
          <Image
            src={product.imageSrc}
            alt={product.name}
            width={200}
            height={200}
            className="object-contain"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full
    ${product.status === "Active" ? "bg-green-100 text-green-600" : ""}
    ${product.status === "Inactive" ? "bg-gray-100 text-gray-600" : ""}
    ${product.status === "Out of Stock" ? "bg-red-100 text-red-600" : ""}
  `}
            >
              {product.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 font-bold">SKU: {product.sku}</p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-bold">{product.price}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Stock</p>
              <p className="font-bold">{product.stock}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Coupons</p>
              <p className="font-bold">{product.coupon}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Offers</p>
              <p className="font-bold">{product.offer}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 ">
        <p className="text-sm font-medium mb-1">Product Description</p>
        <div className="bg-gray-50 h-[130px] border border-gray-200 p-3 rounded-md p-4 text-sm text-gray-500">
          {product.description}
        </div>
      </div>
    </DialogContent>
  );
};
