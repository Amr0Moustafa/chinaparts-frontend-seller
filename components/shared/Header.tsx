"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { HiOutlineBars3, HiOutlineChatBubbleOvalLeftEllipsis, HiOutlineBell } from "react-icons/hi2";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { LanguageSelector } from "../atoms/languageselector";
import { useRouter } from "next/navigation";


const Header: FC = () => {
  const { i18n,t } = useTranslation();
  const direction = i18n.dir();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      {/* Mobile header with sheet trigger */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
        <div className="flex items-center gap-2">
          <Image src="/logo.webp" alt="Logo" width={120} height={120} className="h-8 w-auto" />
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Sheet  open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button aria-label="Open menu" className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                <HiOutlineBars3 className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side={direction === 'rtl' ?"right":"left"} className="w-[85%] sm:w-[300px] p-5">
              <div className="flex items-center justify-between px-6 py-4 ">
                <div className="flex items-center gap-2">
                  <Image src="/logo.webp" alt="Logo" width={120} height={120} className="h-8 w-auto" />
                </div>
                
              </div>
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop header (can reuse same layout minus sheet trigger) */}
      <header className="hidden md:flex items-center justify-end px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-6">
          <LanguageSelector />
          <button onClick={()=>router.push("/dashboard/messages")} className="relative cursor-pointer">
            <HiOutlineChatBubbleOvalLeftEllipsis className="w-7 h-7 text-gray-600" />
            <span className="absolute -top-1.5 -right-1 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-white bg-orange-500 rounded-full">
              0
            </span>
          </button>
          <button  className="relative">
            <HiOutlineBell className="w-7 h-7 text-gray-600" />
            <span className="absolute -top-1.5 -right-1 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-white bg-orange-500 rounded-full">
              2
            </span>
          </button>
          <div className="flex items-center gap-3 bg-orange-50 px-3 py-1 rounded-full">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-600 font-semibold">
              M
            </div>
            <div className="text-sm">
              <div className="font-medium">Mohamed's Auto Parts</div>
              <div className="text-xs text-gray-500">Premium Seller</div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
