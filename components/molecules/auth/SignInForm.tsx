"use client";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InputField } from "@/components/atoms/input";
import { Button } from "@/components/atoms/Button";
import { LinkText } from "@/components/atoms/LinkText";
import { SignInSchema } from "@/lib/validation";
import { redirect } from "next/navigation";

type SignInFormValues = yup.InferType<typeof SignInSchema>;

export const SignInForm = () => {
  const methods = useForm<SignInFormValues>({
    resolver: yupResolver(SignInSchema),
    shouldFocusError: true,
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Signup Data:", data);
    redirect("/dashboard");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
       
        <InputField
          label="Phone number"
          name="phone"
          placeholder="(+966) 3111613203651"
          className="bg-[var(--theme-light-gray)] py-3"
          onChange={(e) => methods.setValue("phone", e.target.value)}
        /> 
        {methods.formState.errors.phone && (
          <span className="text-sm text-red-500 mt-3 mb-3">
            {methods.formState.errors.phone.message}
          </span>
        )}
       

        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="@JbjjKnkjnk600202"
          className="bg-[var(--theme-light-gray)] py-3"
          onChange={(e) => methods.setValue("password", e.target.value)}
        />
         {methods.formState.errors.password && (
          <span className="text-sm text-red-500 mt-3 mb-3">
            {methods.formState.errors.password.message}
          </span>
        )}
        <Button
          text="Sign In"
          type="submit"
          className="py-3 font-bold text-gray-900 mt-3"
        />
      </form>
    </FormProvider>
  );
};
