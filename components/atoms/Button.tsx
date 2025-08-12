interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  className?: string;
}

export const Button = ({ text, className, ...props }: ButtonProps) => (
  <button
    {...props}
    className={`bg-orange-500  w-full py-2 rounded-md hover:bg-orange-600 transition ${className}`}
  >
    {text}
  </button>
);
