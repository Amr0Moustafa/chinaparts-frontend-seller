import clsx from "clsx";

export function ProgressBar({
  value,
  max,
  width = "w-28",
}: {
  value: number;
  max: number;
  width?: string;
}) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  const fillColor =
    pct >= 66 ? "bg-green-500" : pct >= 34 ? "bg-orange-500" : "bg-red-500";

  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm font-medium">{`${value}/${max}`}</div>
      <div className={clsx("h-2 bg-gray-100 rounded-full overflow-hidden", width)}>
        <div
          className={clsx("h-full rounded-full transition-all duration-300", fillColor)}
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
    </div>
  );
}
