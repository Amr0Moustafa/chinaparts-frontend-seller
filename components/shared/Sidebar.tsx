
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
import { Percent } from "lucide-react";
import { FiShoppingCart } from "react-icons/fi";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const NAV_DEFS = [
  { key: "dashboard", href: "/dashboard", icon: HiOutlineHome },
  { key: "products", href: "/dashboard/products", icon: HiOutlineCube },
  { key: "orders", href: "/dashboard/orders", icon: FiShoppingCart },
  { key: "returns", href: "/dashboard/returns", icon: HiOutlineArrowPath },
  { key: "messages", href: "/dashboard/messages", icon: HiOutlineChatBubbleOvalLeftEllipsis },
  { key: "reports", href: "/dashboard/reports", icon: HiOutlineChartBar },
  { key: "coupons", href: "/dashboard/coupons", icon: HiOutlineTag },
  { key: "productoffers", href: "/dashboard/offers", icon: Percent },
  { key: "settings", href: "/dashboard/settings", icon: HiOutlineCog6Tooth },
  { key: "account", href: "/dashboard/account", icon: HiOutlineUserCircle },
];

const normalize = (p: string) => p.replace(/\/+$/, "");

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const pathnameRaw = usePathname() || "";
  const pathname = normalize(pathnameRaw);

  const isActive = (href: string) => {
    const target = normalize(href);
    if (target === "/dashboard") {
      return pathname === "/dashboard" || pathname === "";
    }
    return pathname === target || pathname.startsWith(target + "/");
  };

  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
        {NAV_DEFS.map((def) => {
          const label = t(`sidebar.nav.${def.key}`) || def.key;
          const active = isActive(def.href);
          return (
            <Link
              key={def.href}
              href={def.href}
              className={clsx(
                "group flex items-center gap-3 px-4 py-2 rounded-md text-base font-medium transition",
                active
                  ? "bg-orange-50 text-orange-600 font-semibold ring-1 ring-orange-200"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              )}
            >
              <def.icon
                className={clsx(
                  "flex-shrink-0 w-5 h-5 lg:w-6 lg:h-6",
                  active
                    ? "text-orange-600"
                    : "group-hover:text-orange-600 text-gray-500"
                )}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">{t("sidebar.sellerLabel") || "Premium Seller"}</div>
        <div className="mt-1 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
            M
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">
              {t("sidebar.sellerName") || "Mohamed's Auto Parts"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
