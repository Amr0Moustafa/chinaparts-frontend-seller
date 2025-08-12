"use client";
import { LinkText } from "@/components/atoms/LinkText";
import { SignInForm } from "@/components/molecules/auth/SignInForm";
import { SocialLoginButtons } from "@/components/molecules/auth/SocialLoginButtons";
import { useTranslation } from "react-i18next";

export const SignInSection = () => {
   const { t } = useTranslation();
  return (
    <div className="flex flex-col  justify-center px-12 w-full max-w-[700px] ">
      <h1 className=" text-2xl text-center xl:text-4xl font-extrabold leading-tight">
        {t("signin.heading.prefix")}
        <span className="relative ms-2 ">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-black from-2% to-orange-500 to-35%">
            {t("signin.heading.highlight1")}
          </span>
        </span>
        <span className="relative ms-2 inline-block ">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-black from-15% to-orange-500 to-35%">
            {t("signin.heading.highlight2")}
          </span>
        </span>
      </h1>
      <p className="text-sm lg:text-md mt-5 text-gray-500 mb-6 text-center">
        {t("signin.description")}
        
      </p>
      <SignInForm />

      <div className="my-6 flex items-center text-gray-400 text-md">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="px-4">{t("signin.or")}</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <SocialLoginButtons />
      <p className="text-center text-md mt-5">
        {t("signin.haveAccount")} <LinkText href="/auth/register" text={t("signin.registerNow")} />
      </p>
    </div>
  );
};
