"use client";

import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../atoms/Button";
import { AccountSettingsForm } from "../organisms/account/AccountSettingsForm";

export const AccountSettingsTemplate: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <h3 className="text-lg md:text-2xl font-bold">
            {t("account.title") || "Account Settings"}
          </h3>

          <div className="flex-shrink-0">
            <Button
              text={t("account.saveChanges") || "Save Changes"}
              form="account-settings-form" // link to form submit
              type="submit"
              className="py-3 px-5 font-bold text-gray-900 w-auto"
            />
          </div>
        </div>

        <AccountSettingsForm />
      </div>
    </div>
  );
};
