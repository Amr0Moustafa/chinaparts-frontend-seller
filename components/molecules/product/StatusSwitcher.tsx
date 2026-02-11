"use client";

import { motion } from "framer-motion";
import { useUpdateProductStatusMutation } from "@/features/products";
import { useState } from "react";

type Props = {
  id: number | string;
  currentStatus: number;
};

const STATUS_OPTIONS = [
  { label: "Active", value: 1, color: "bg-green-500" },
  { label: "Inactive", value: 0, color: "bg-red-500" },
  { label: "Draft", value: 2, color: "bg-gray-500" },
];

export const StatusSwitcher = ({ id, currentStatus }: Props) => {
  const [updateStatus] = useUpdateProductStatusMutation();
  const [localStatus, setLocalStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (value: number) => {
    if (value === localStatus) return;

    setLocalStatus(value); // optimistic
    setLoading(true);

    try {
      await updateStatus({ id, status: value }).unwrap();
    } catch (error) {
      setLocalStatus(currentStatus); // revert on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center bg-gray-100 rounded-full p-1 w-[220px]">
      {/* Animated background indicator */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`absolute top-1 bottom-1 w-[70px] rounded-full ${
          STATUS_OPTIONS.find((s) => s.value === localStatus)?.color
        }`}
        style={{
          left:
            localStatus === 1
              ? "4px"
              : localStatus === 0
              ? "74px"
              : "144px",
        }}
      />

      {STATUS_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => handleChange(option.value)}
          disabled={loading}
          className={`relative z-10 flex-1 text-xs font-semibold transition-all duration-200 py-2 rounded-full ${
            localStatus === option.value
              ? "text-white"
              : "text-gray-600 hover:text-gray-900"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
