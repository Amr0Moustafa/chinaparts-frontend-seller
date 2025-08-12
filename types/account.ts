interface AccountFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  taxId: string;
  registrationNumber: string;
  taxCertificate: File | null;
  commercialRegistration: File | null;
  notifications: {
    newOrders: boolean;
    customerMessages: boolean;
    lowStock: boolean;
    weeklyReports: boolean;
    marketingEmails: boolean;
  };
}