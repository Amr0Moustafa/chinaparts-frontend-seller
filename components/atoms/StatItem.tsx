type StatItemProps = {
  value: string;
  label: string;
};

export const StatItem = ({ value, label }: StatItemProps) => (
  <div className="text-center">
    <div className="text-xl font-semibold">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);
