"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

// Atoms
import { Button } from "@/components/atoms/Button";
import { InputField } from "@/components/atoms/input";
import SelectField from "@/components/atoms/SelectField";
import { StepperRegister } from "@/components/molecules/stepperregister/StepperRegister";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { ProgressBar } from "@/components/atoms/ProgressBar";

// Icons
import {
  Upload,
  User,
  Store,
  FileText,
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Textarea } from "../ui/textarea";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormValues = {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  postalCode: string;
  // Step 2
  storeName: string;
  storeUrl: string;
  storeCategory: string;
  storeDescription: string;
  // Step 3
  legalName: string;
  businessType: string;
  taxId: string;
  legalAddress: string;
  legalCity: string;
  legalPostal: string;
};

// ─── Step Meta ────────────────────────────────────────────────────────────────

const STEP_META = [
  { icon: User, label: "Personal Information" },
  { icon: Store, label: "Store Information" },
  { icon: FileText, label: "Company Legal Information" },
  { icon: ClipboardCheck, label: "Review & Submit" },
];

// ─── File Upload Zone ─────────────────────────────────────────────────────────

const FileUploadZone = ({ label, hint }: { label: string; hint?: string }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 group">
      <input type="file" className="hidden" />
      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
        <Upload className="w-5 h-5 text-orange-500" />
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">
          <span className="text-orange-500 font-semibold">Click to upload</span>{" "}
          or drag & drop
        </p>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
    </label>
  </div>
);

// ─── Review Section Card ──────────────────────────────────────────────────────

const ReviewCard = ({
  title,
  step,
  fields,
}: {
  title: string;
  step: number;
  fields: { label: string; value: string }[];
}) => (
  <div className="border border-gray-100 rounded-xl overflow-hidden">
    <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">{step}</span>
        </div>
        <span className="text-sm font-bold text-gray-800">{title}</span>
      </div>
      <StatusBadge label="Completed" color="green" />
    </div>
    <div className="px-5 py-4 grid grid-cols-2 gap-x-8 gap-y-3">
      {fields.map(({ label, value }) => (
        <div key={label}>
          <p className="text-xs text-gray-400 font-medium">{label}</p>
          <p className="text-sm font-semibold text-gray-800 mt-0.5">
            {value || "—"}
          </p>
        </div>
      ))}
    </div>
  </div>
);

// ─── Step Content ─────────────────────────────────────────────────────────────

const StepPersonal = () => (
  <div className="bg-white px-4 py-4 rounded-lg grid grid-cols-2 gap-x-5 gap-y-4">
    <InputField
      className="bg-gray-100"
      label="First Name"
      name="firstName"
      placeholder="e.g. Jane"
    />
    <InputField
      className="bg-gray-100"
      label="Last Name"
      name="lastName"
      placeholder="e.g. Smith"
    />
    <InputField
        className="bg-gray-100"
        label="Email Address"
        name="email"
        type="email"
        placeholder="jane@example.com"
      />
    <InputField
      className="bg-gray-100"
      label="Phone Number"
      name="phone"
      placeholder="+1 (555) 000-0000"
    />

    <InputField
      className="bg-gray-100"
      label="Password"
      name="password"
      type="password"
      placeholder="@JbjjKnkjnk600202"
      onChange={(e) => {}}
    />
    <InputField
      className="bg-gray-100"
      label="Confirm Password"
      name="confirmPassword"
      type="password"
      placeholder="@JbjjKnkjnk600202"
      onChange={(e) => {}}
    />
  </div>
);

const StepStore = () => (
  <div className="bg-white px-4 py-4 rounded-lg grid grid-cols-2 gap-x-5 gap-y-4">
    <div className="col-span-2">
      <InputField
        label="Store Name"
        name="storeName"
        placeholder="e.g. Jane's Boutique"
        className="bg-gray-100"
      />
    </div>

    <div className="col-span-2 ">
      <label className={`text-md font-medium text-gray-500  `}>
        Store Description
      </label>
      <Textarea
        name="storeDescription"
        placeholder="Briefly describe your store..."
      />
    </div>
    <div className="col-span-2">
      <FileUploadZone label="Store Logo" hint="PNG, JPG up to 2MB" />
    </div>
  </div>
);

const StepLegal = () => (
  <div className="bg-white px-4 py-4 rounded-lg grid grid-cols-2 gap-x-5 gap-y-4">
    <div className="col-span-2">
      <InputField
        className="bg-gray-100"
        label="Legal Business Name"
        name="legalName"
        placeholder="Jane Smith LLC"
      />
    </div>
    <SelectField
      label="Business Type"
      name="businessType"
      placeholder="Select type"
      options={[
        { value: "sole", label: "Sole Proprietorship" },
        { value: "llc", label: "LLC" },
        { value: "corp", label: "Corporation" },
        { value: "partner", label: "Partnership" },
      ]}
    />
    <InputField
      className="bg-gray-100"
      label="Tax ID / EIN"
      name="taxId"
      placeholder="XX-XXXXXXX"
    />
    <div className="col-span-2">
      <InputField
        className="bg-gray-100"
        label="Registered Address"
        name="legalAddress"
        placeholder="123 Business Ave"
      />
    </div>
    <InputField
      className="bg-gray-100"
      label="City"
      name="legalCity"
      placeholder="New York"
    />
    <InputField
      className="bg-gray-100"
      label="Postal Code"
      name="legalPostal"
      placeholder="10001"
    />
    <div className="col-span-2">
      <FileUploadZone
        label="Business Registration Document"
        hint="PDF, PNG, JPG up to 10MB"
      />
    </div>
  </div>
);

const StepReview = ({ values }: { values: FormValues }) => (
  <div className="flex flex-col gap-4">
    <ReviewCard
      title="Personal Information"
      step={1}
      fields={[
        { label: "Full Name", value: `${values.firstName} ${values.lastName}` },
        { label: "Email", value: values.email },
        { label: "Phone", value: values.phone },
        { label: "Country", value: values.country },
        { label: "Address", value: values.address },
        {
          label: "City / Postal",
          value: `${values.city} ${values.postalCode}`,
        },
      ]}
    />
    <ReviewCard
      title="Store Information"
      step={2}
      fields={[
        { label: "Store Name", value: values.storeName },
        { label: "Store URL", value: values.storeUrl },
        { label: "Category", value: values.storeCategory },
        { label: "Description", value: values.storeDescription },
      ]}
    />
    <ReviewCard
      title="Company Legal Information"
      step={3}
      fields={[
        { label: "Legal Name", value: values.legalName },
        { label: "Business Type", value: values.businessType },
        { label: "Tax ID", value: values.taxId },
        {
          label: "City / Postal",
          value: `${values.legalCity} ${values.legalPostal}`,
        },
      ]}
    />

    {/* Terms notice */}
    <div className="bg-orange-50 border border-orange-100 rounded-xl px-5 py-4">
      <p className="text-sm text-orange-800 leading-relaxed">
        By submitting, you confirm all information is accurate and you agree to
        our{" "}
        <span className="text-orange-500 font-semibold cursor-pointer hover:underline">
          Terms of Service
        </span>{" "}
        and{" "}
        <span className="text-orange-500 font-semibold cursor-pointer hover:underline">
          Privacy Policy
        </span>
        .
      </p>
    </div>
  </div>
);

// ─── Main Template ────────────────────────────────────────────────────────────

export const SignupPageTemplate = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const methods = useForm<FormValues>({ mode: "onChange" });
  const { handleSubmit, watch } = methods;
  const values = watch();

  const stepMeta = STEP_META[currentStep - 1];
  const StepIcon = stepMeta.icon;

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, totalSteps));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const onSubmit = (data: FormValues) => {
    console.log("Submitted:", data);
    // handle submission
  };

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-screen bg-gray-50 font-sans">
        {/* ── Sidebar Stepper ── */}
        <StepperRegister currentStep={currentStep} />

        {/* ── Main Content ── */}
        <main className="flex-1 flex flex-col  px-10 py-10 overflow-y-auto">
          {/* Step badge */}
          <span className="text-[11px] font-semibold text-orange-500 uppercase tracking-widest mb-2">
            Step {currentStep} of {totalSteps}
          </span>

          {/* Heading */}
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
              <StepIcon className="w-5 h-5 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {stepMeta.label}
            </h1>
          </div>

          <p className="text-sm text-gray-500 mb-8 ml-12">
            {currentStep === 1 &&
              "Tell us about yourself. This info will be used to set up your account."}
            {currentStep === 2 &&
              "Set up your store details. This is how customers will find and recognize you."}
            {currentStep === 3 &&
              "We need this to verify your business and ensure compliance."}
            {currentStep === 4 &&
              "Please review your information carefully before submitting."}
          </p>

          {/* Step progress bar (thin, top of form area) */}
          {/* <div className="mb-8">
            <ProgressBar value={currentStep} max={totalSteps} width="w-full" />
          </div> */}

          {/* Form content */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col flex-1 gap-0"
          >
            <div className="flex-1">
              {currentStep === 1 && <StepPersonal />}
              {currentStep === 2 && <StepStore />}
              {currentStep === 3 && <StepLegal />}
              {currentStep === 4 && (
                <StepReview values={values as FormValues} />
              )}
            </div>

            {/* ── Navigation ── */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-sm shadow-orange-200 transition-all duration-200 hover:shadow-md hover:shadow-orange-200 hover:-translate-y-0.5"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-sm shadow-orange-200 transition-all duration-200 hover:shadow-md hover:shadow-orange-200 hover:-translate-y-0.5"
                >
                  Submit Application →
                </button>
              )}
            </div>
          </form>
        </main>
      </div>
    </FormProvider>
  );
};

export default SignupPageTemplate;
