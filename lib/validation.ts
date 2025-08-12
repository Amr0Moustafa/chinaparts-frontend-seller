import * as yup from "yup";
const passwordRules =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,128}$/;
export const SignupSchema = yup.object({
  storeName: yup
    .string()
    .trim()
    .min(2, "Store name must be at least 2 characters")
    .max(50, "Store name can't exceed 50 characters")
    .required("Store name is required"),

  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Enter a valid email address")
    .required("Email is required"),

  phone: yup
    .string()
    .trim()
    .required("Phone number is required")
    .test(
      "is-valid-phone",
      "Enter a valid phone number (e.g., +1234567890)",
      (value) => {
        if (!value) return false;
        // E.164-ish simple fallback regex: starts with + and 7-15 digits
        const e164 = /^\+\d{7,15}$/;
        return e164.test(value);
      }
    ),

  password: yup
    .string()
    .required("Password is required")
    .matches(
      passwordRules,
      "Password must be 8+ chars and include uppercase, lowercase, number, and special character"
    ),

  // confirmPassword: yup
  //   .string()
  //   .required("Please confirm your password")
  //   .oneOf([yup.ref("password")], "Passwords must match"),
});

export const SignInSchema = yup.object({
  phone: yup
    .string()
    .trim()
    .required("Phone number is required")
    .test(
      "is-valid-phone",
      "Enter a valid phone number (e.g., +1234567890)",
      (value) => {
        if (!value) return false;
        // E.164-ish simple fallback regex: starts with + and 7-15 digits
        const e164 = /^\+\d{7,15}$/;
        return e164.test(value);
      }
    ),

  password: yup
    .string()
    .required("Password is required")
    .matches(
      passwordRules,
      "Password must be 8+ chars and include uppercase, lowercase, number, and special character"
    ),
});

// validationSchema.ts
import * as Yup from "yup";

export const createCouponSchema = Yup.object().shape({
  productName: Yup.string().required("Product name is required"),
  couponCode: Yup.string().required("Coupon code is required"),
  couponTitle: Yup.string().required("Coupon title is required"),
  discountType: Yup.string().required("Discount type is required"),
  discountValue: Yup.string().required("Discount value is required"),
  minimumOrderValue: Yup.number()
    .typeError("Must be a number")
    .positive("Must be positive")
    .required("Minimum order value is required"),
  usageLimit: Yup.number()
    .typeError("Must be a number")
    .positive("Must be positive")
    .required("Usage limit is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date cannot be before start date"),
});

export const createProductOfferSchema = yup.object().shape({
  offerName: yup.string().required("Offer Name is required"),
  productName: yup.string().required("Product Name is required"),
  originalPrice: yup
    .number()
    .typeError("Must be a number")
    .required("Original Price is required"),
  offerPrice: yup
    .number()
    .typeError("Must be a number")
    .required("Offer Price is required"),
  startDate: yup.string().required("Start Date is required"),
  endDate: yup.string().required("End Date is required"),
});

export const storeSchema = yup.object().shape({
  storeName: yup.string().required("Store name is required"),
  storeDescription: yup.string(),
  businessAddress: yup.string().required("Business address is required"),
  mainImage: yup
    .mixed<File>()
    .required("Main image is required")
    .test(
      "fileType",
      "Only PNG, JPEG, and WEBP are allowed",
      (value) =>
        value instanceof File &&
        ["image/png", "image/jpeg", "image/webp"].includes(value.type)
    ),
  city: yup.string().required("City is required"),
  zipCode: yup.string().required("ZIP Code is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),

  shippingCompanies: yup
    .array()
    .of(
      yup.object().shape({
        companyName: yup.string().required("Company name is required"),
        companyContact: yup.string().required("Contact number is required"),
        companyLogo: yup
          .mixed<File>()
          .nullable()
          .test(
            "fileType",
            "Only PNG, JPEG, and WEBP are allowed",
            (value) =>
              !value ||
              (value instanceof File &&
                ["image/png", "image/jpeg", "image/webp"].includes(value.type))
          ),
      })
    )
    .min(1, "At least one shipping company is required")
    .max(3, "You can only add up to 3 shipping companies"),
});


 export const accountschema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  confirmPassword: yup.string().oneOf([yup.ref("newPassword")], "Passwords must match"),
});