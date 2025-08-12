"use client";
import { LinkText } from "@/components/atoms/LinkText";
import { SignupForm } from "@/components/molecules/auth/SignupForm";
import { SocialLoginButtons } from "@/components/molecules/auth/SocialLoginButtons";
import { useTranslation } from "react-i18next";

export const SignupSection = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col  justify-center px-12 w-full max-w-[700px] ">
      <h1 className=" text-2xl text-center xl:text-4xl font-extrabold leading-tight">
        {t("signup.heading.prefix")}
        <span className="relative ms-2 ">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-black from-2% to-orange-500 to-15%">
            {t("signup.heading.highlight")}
          </span>
        </span>
      </h1>
      <p className="text-sm lg:text-lg mt-5 text-gray-900 mb-6 text-center">
        {t("signup.description")}
      </p>
      <SignupForm />

    <div className="my-6 flex items-center text-gray-400 text-md">
      <hr className="flex-grow border-t border-gray-300" />
      <span className="px-4">{t("signup.or")}</span>
      <hr className="flex-grow border-t border-gray-300" />
    </div>

    <SocialLoginButtons />
    <p className="text-center text-md mt-5">
      {t("signup.haveAccount")} <LinkText href="/auth/login" text={t("signup.signIn")} />
    </p>
  </div>
)};
