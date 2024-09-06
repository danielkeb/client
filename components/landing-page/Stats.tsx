import { fetchStats } from "@/app/lib/stats";

export default async function Stats() {
  const res = await fetchStats();

  const stats = [
    {
      key: "Users",
      value: res?.users?.total || 0,
      description: "The total number of registered users on the platform.",
    },
    {
      key: "Organizations",
      value: res?.organizations?.total || 0,
      description:
        "The total number of organizations that have registered and created profiles.",
    },
    {
      key: "Projects",
      value: res?.projects?.total || 0,
      description:
        "The total number of active projects currently listed on the platform.",
    },
  ];

  return (
    <div className="container -mt-16 flex flex-col justify-center gap-16 md:flex-row">
      {stats.map((item) => (
        <div
          key={item.key}
          className="card rounded-md px-8 py-10 shadow-md duration-200 hover:scale-105 hover:shadow-2xl xl:max-w-[280px]"
        >
          <div className="prose text-center lg:prose-lg">
            <h1>{item.value}</h1>
            <p className="font-semibold">{item.key}</p>
          </div>
          <p className="text-center text-sm font-light">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
