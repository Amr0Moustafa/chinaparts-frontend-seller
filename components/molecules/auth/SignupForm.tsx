"use client";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InputField } from "@/components/atoms/input";
import { Button } from "@/components/atoms/Button";
import { LinkText } from "@/components/atoms/LinkText";
import { SignupSchema } from "@/lib/validation";

type SignupFormValues = yup.InferType<typeof SignupSchema>;



export const SignupForm = () => {
  const methods = useForm<SignupFormValues>({
    resolver: yupResolver(SignupSchema),
    shouldFocusError: true,
    defaultValues: {
      storeName: "",
      phone: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = (data: any) => {
    console.log("Signup Data:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4" >
         <InputField label="Store Name" name="storeName" placeholder="e.g. China Auto Store" className="bg-[var(--theme-light-gray)] py-3"  onChange={(e)=>methods.setValue("storeName", e.target.value)}/>
         {methods.formState.errors.storeName && (
          <span className="text-sm text-red-500 mt-3 mb-3">
            {methods.formState.errors.storeName.message}
          </span>
        )}
        <InputField label="Phone number" name="phone" placeholder="(+966) 3111613203651" className="bg-[var(--theme-light-gray)] py-3"  onChange={(e)=>methods.setValue("phone", e.target.value)}/>
        {methods.formState.errors.phone && (
          <span className="text-sm text-red-500 mt-3 mb-3">
            {methods.formState.errors.phone.message}
          </span>
        )}
        <InputField label="Email" name="email" type="email" placeholder="Email" className="bg-[var(--theme-light-gray)] py-3"  onChange={(e)=>methods.setValue("email", e.target.value)}/>
        {methods.formState.errors.email && (
          <span className="text-sm text-red-500 mt-3 mb-3">
            {methods.formState.errors.email.message}
          </span>
        )}
        <InputField label="Password" name="password" type="password" placeholder="@JbjjKnkjnk600202" className="bg-[var(--theme-light-gray)] py-3" onChange={(e)=>methods.setValue("password", e.target.value)}/>
        {methods.formState.errors.password && (
          <span className="text-sm text-red-500 mt-3 mb-3">
            {methods.formState.errors.password.message}
          </span>
        )}
        <Button text="Sign Up" type="submit" className="py-3 font-bold text-gray-900 mt-3" />
        
      </form>
    </FormProvider>
  );
};
