"use client";

import { FC } from "react";
import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Card, CardContent } from "@/components/ui/card";
import { InputField } from "@/components/atoms/input";
import { Label } from "@/components/ui/label";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { User, ShieldCheck, Building, Bell } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { accountschema } from "@/lib/validation";
import { Button } from "@/components/ui/button";

export const AccountSettingsForm: FC = () => {
  const { t } = useTranslation();

  const methods = useForm<AccountFormValues>({
    resolver: yupResolver(accountschema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      taxId: "",
      registrationNumber: "",
      taxCertificate: null,
      commercialRegistration: null,
      notifications: {
        newOrders: false,
        customerMessages: false,
        lowStock: false,
        weeklyReports: false,
        marketingEmails: false,
      },
    },
  });

  const { handleSubmit, setValue } = methods;

  const handleFileChange = (
    field: keyof AccountFormValues,
    fileList: FileList | null
  ) => {
    if (fileList && fileList.length > 0) {
      setValue(field, fileList[0]);
    }
  };

  const onSubmit = (data: FieldValues) => {
    console.log("Submitted:", data);
    toast.success(t("account.toast.success"));
  };

  return (
    <FormProvider {...methods}>
      <form id="account-settings-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Info */}
          <Card className="bg-white border border-gray-300">
            <div className="px-4">
              <SectionHeader
                icon={User}
                title={t("account.personalInfo") || "Personal Information"}
              />
            </div>
            <CardContent className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-2 ">
              <InputField
                name="firstName"
                label={t("account.firstName")}
                className="bg-[var(--theme-light-gray)]"
                labelColor="text-gray-900"
              />
              <InputField
                name="lastName"
                label={t("account.lastName")}
                className="bg-[var(--theme-light-gray)]"
                labelColor="text-gray-900"
              />
              <InputField
                name="email"
                type="email"
                label={t("account.email")}
                className="bg-[var(--theme-light-gray)]"
                labelColor="text-gray-900"
              />
              <InputField
                name="phone"
                label={t("account.phone")}
                className="bg-[var(--theme-light-gray)]"
                labelColor="text-gray-900"
              />
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-white border border-gray-300">
            <div className="px-4">
              <SectionHeader
                icon={ShieldCheck}
                title={t("account.securitySettings") || "Security Settings"}
              />
            </div>
            <CardContent className="space-y-3">
              <InputField
                name="currentPassword"
                type="password"
                label={t("account.currentPassword")}
                className="bg-[var(--theme-light-gray)]"
                labelColor="text-gray-900"
              />
              <InputField
                name="newPassword"
                type="password"
                label={t("account.newPassword")}
                className="bg-[var(--theme-light-gray)]"
                labelColor="text-gray-900"
              />
              <InputField
                name="confirmPassword"
                type="password"
                label={t("account.confirmPassword")}
                className="bg-[var(--theme-light-gray)]"
                labelColor="text-gray-900"
              />
              <div className="flex items-center gap-2">
                <Checkbox
                  id="twoFactor"
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white data-[state=checked]:border-orange-500 border-gray-500"
                />
                <Label htmlFor="twoFactor">
                  {t("account.enableTwoFactor")}
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Company Legal Info */}
          <Card className="bg-white border border-gray-300">
            <div className="px-4">
              <SectionHeader
                icon={Building}
                title={t("account.companyLegal") || "Company Legal Information"}
              />
            </div>
            <CardContent className="space-y-3">
              <InputField
                name="taxId"
                label={t("account.taxId")}
                className="bg-[var(--theme-light-gray)]"
                labelColor="text-gray-900"
              />
              <InputField
                name="registrationNumber"
                label={t("account.registrationNumber")}
                className="bg-[var(--theme-light-gray)]"
                labelColor="text-gray-900"
              />
              <div>
                <InputField
                  name="taxCertificate"
                  label={t("account.taxCertificate")}
                  className="bg-[var(--theme-light-gray)]"
                  labelColor="text-gray-900"
                  type="file"
                  onChange={(e) =>
                    handleFileChange("taxCertificate", e.target.files)
                  }
                />
              </div>
              <div>
                <InputField
                  name="commercialRegistration"
                  label={t("account.commercialRegistration")}
                  className="bg-[var(--theme-light-gray)]"
                  labelColor="text-gray-900"
                  type="file"
                  onChange={(e) =>
                    handleFileChange("commercialRegistration", e.target.files)
                  }
                />
              </div>
              <div className="pt-2">
      <Button
        variant="outline"
className=" border border-gray-300 px-4 py-4 rounded-lg w-full "
        onClick={() => {
          // Open modal or handle legal info update
          console.log("Update Legal Info clicked");
        }}
      >
        {t("account.updateLegal")}
      </Button>
    </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="bg-white border border-gray-300">
            <div className="px-4">
              <SectionHeader
                icon={Bell}
                title={t("account.notifications") || "Notification Preferences"}
              />
            </div>
            <CardContent className="space-y-3">
              {[
                { key: "newOrders", label: t("account.newOrders") },
                {
                  key: "customerMessages",
                  label: t("account.customerMessages"),
                },
                { key: "lowStock", label: t("account.lowStock") },
                { key: "weeklyReports", label: t("account.weeklyReports") },
                { key: "marketingEmails", label: t("account.marketingEmails") },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-2 pt-2"
                >
                  <Label htmlFor={key} className="text-sm font-semibold">
                    {label}
                  </Label>
                  <Checkbox
                    id={key}
                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white data-[state=checked]:border-orange-500 border-gray-500"
                    onCheckedChange={(checked) =>
                      setValue(
                        `notifications.${
                          key as keyof AccountFormValues["notifications"]
                        }`,
                        !!checked
                      )
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </form>
    </FormProvider>
  );
};
