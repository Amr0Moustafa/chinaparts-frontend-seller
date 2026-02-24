"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineArrowPath,
  HiOutlineChatBubbleOvalLeftEllipsis,
  HiOutlineChartBar,
  HiOutlineTag,
  HiOutlineCog6Tooth,
  HiOutlineUserCircle,
  
} from "react-icons/hi2";
import { Percent,Star } from "lucide-react";
import { FiShoppingCart } from "react-icons/fi";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const NAV_DEFS = [
  { key: "dashboard", href: "/dashboard", icon: HiOutlineHome },
  { key: "products", href: "/dashboard/products", icon: HiOutlineCube },
  { key: "orders", href: "/dashboard/orders", icon: FiShoppingCart },
  { key: "returns", href: "/dashboard/returns", icon: HiOutlineArrowPath },
  {
    key: "messages",
    href: "/dashboard/messages",
    icon: HiOutlineChatBubbleOvalLeftEllipsis,
  },
  { key: "reviews", href: "/dashboard/reviews", icon: Star  },
  { key: "reports", href: "/dashboard/reports", icon: HiOutlineChartBar },
  { key: "coupons", href: "/dashboard/coupons", icon: HiOutlineTag },
  { key: "productoffers", href: "/dashboard/offers", icon: Percent },
  { key: "settings", href: "/dashboard/settings", icon: HiOutlineCog6Tooth },
  { key: "account", href: "/dashboard/account", icon: HiOutlineUserCircle },
];

const stripLocale = (path: string) => {
  return path
    // Remove leading locale
    .replace(/^\/(en|ar|zh)(?=\/|$)/, "")
    // Remove trailing /create or /update (with or without slash)
    .replace(/\/(create|edit)\/?$/, "");
};

const normalize = (p: string) => stripLocale(p).replace(/\/+$/, "");
const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const pathnameRaw = usePathname() || "";
  const pathname = normalize(pathnameRaw);
  

  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
        {NAV_DEFS.map((def) => {
          const label = t(`sidebar.nav.${def.key}`) || def.key;
          const active = pathname === def.href ;
          
          return (
            <Link
              key={def.href}
              href={def.href}
              className={clsx(
                "group flex items-center gap-3 px-4 py-2 rounded-md text-base font-medium transition",
                active 
                  ? "bg-orange-500 text-white font-semibold"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              )}
            >
              <def.icon
                className={clsx(
                  "flex-shrink-0 w-5 h-5 lg:w-6 lg:h-6",
                  active
                    ? "text-white"
                    : "group-hover:text-orange-600 text-gray-500"
                )}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
