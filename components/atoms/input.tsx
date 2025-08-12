interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelColor?: string;
  className?: string;
}

export const InputField = ({ label, className ,labelColor="text-gray-500", ...props }: InputFieldProps) => (
  <div className="flex flex-col gap-1">
    {label && <label className={`text-md font-medium ${labelColor}`}>{label}</label>}
    <input
      className={`border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
      {...props}
    />
  </div>
);
