import { ReactNode } from "react";

interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const IconButton = ({ icon, onClick, className }: IconButtonProps) => (
  <button
    onClick={onClick}
    className={`p-3 border rounded-full hover:bg-gray-100 transition ${className}`}
  >
    {icon}
  </button>
);