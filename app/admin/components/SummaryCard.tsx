import clsx from "clsx";

export default function SummaryCard({
  bgClass,
  title,
  value,
  icon,
}: {
  bgClass: string;
  title: string;
  value: number | typeof NaN;
  icon: JSX.Element;
}) {
  return (
    <div
      className={clsx(
        "card rounded-md duration-300 hover:scale-[0.98]",
        bgClass,
      )}
    >
      <div className="card-body flex flex-row items-end justify-between">
        <div className="space-y-2">
          <div className="text-sm">{title}</div>
          <p className="text-5xl font-semibold">{value}</p>
        </div>

        <div>{icon}</div>
      </div>
    </div>
  );
}
