export type StoreFormValues = {
    storeDescription?: string | undefined;
    storeName: string;
    businessAddress: string;
    mainImage: File | null;
    city: string;
    zipCode: string;
    phoneNumber: string;
    email: string;
    shippingCompanies: {
      companyName: string;
      companyContact: string;
      companyLogo: File | null;
    }[];
}