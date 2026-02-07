import React from "react";
import { useFormContext } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  name: string;
  options: Option[];
  placeholder?: string;
  className?: string; // ✅ allow custom styles
  disabled?: boolean;
  onChange?:(e:any)=>void;
}

const SelectField: React.FC<Props> = ({
  label,
  name,
  options,
  placeholder,
  className,
  disabled,
  onChange
}) => {
  const {
    register,
    formState: { errors }
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className={`space-y-2`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        {...register(name)}
        className={`w-full px-4 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500  ${className || ""}`}
        disabled={disabled}
        onChange={onChange}
      >
        <option value="">{placeholder || "Select an option"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default SelectField;
