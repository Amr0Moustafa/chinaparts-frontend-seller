"use client";

import { HiOutlineGlobeAlt, HiOutlineChatBubbleOvalLeftEllipsis, HiOutlineBell } from "react-icons/hi2";

import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import i18nConfig from "@/i18nConfig";
import { useEffect } from "react";

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation("common");
  const router = useRouter();
  const currentPathname = usePathname();

  // Sync i18n with URL on load
  useEffect(() => {
    const pathnameSegments = currentPathname.split("/");
    const urlLocale = pathnameSegments[1];
    const isValidLocale = i18nConfig.locales.includes(urlLocale);
    if (isValidLocale && i18n.language !== urlLocale) {
      i18n.changeLanguage(urlLocale);
    }
  }, [currentPathname]);

  const currentLocale: string = i18n.resolvedLanguage || i18nConfig.defaultLocale;

  // Set <html lang="">
  useEffect(() => {
    document.documentElement.lang = currentLocale;
  }, [currentLocale]);

  const handleLanguageChange = (newLocale: string) => {
    const segments = currentPathname.split("/");
    const currentPathLocale = segments[1];
    const isValidLocale = i18nConfig.locales.includes(currentPathLocale);

    // Avoid reload if already on selected language
    if (isValidLocale && currentPathLocale === newLocale) return;

    // Update the locale in the path
    const newSegments = [...segments];
    if (isValidLocale) {
      newSegments[1] = newLocale;
    } else {
      newSegments.splice(1, 0, newLocale);
    }

    const newPath = newSegments.join("/") || "/";

    // Store in cookie
    const expires = new Date(Date.now() + 30 * 86400 * 1000).toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    
    router.push(newPath);
    router.refresh();
    i18n.changeLanguage(newLocale);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 outline-none">
          <HiOutlineGlobeAlt className="w-5 h-5" />
         
          <span className="text-sm"> <span>
            {currentLocale === "en" && t("language.english")}
            {currentLocale === "ar" && t("language.arabic")}
            {currentLocale === "zh" && t("language.chinese")}
          </span> ▼</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
          {t("language.english")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("ar")}>
          {t("language.arabic")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("zh")}>
          {t("language.chinese")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
