import AgePieChart from "./AgePieChart";
import GenderPieChart from "./GenderPieChart";
import PopularSkillsChart from "./PopularSkillsChart";
import ProjectBarChart from "./ProjectBarChart";
import Summary from "./Summary";
import VerifiedAndUnverified from "./VerifiedAndUnverified";

export default function DashboardPage() {
  return (
    <div className="space-y-3">
      <Summary />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-4">
        <AgePieChart />

        <GenderPieChart />

        <div className="col-span-2">
          <VerifiedAndUnverified />
        </div>

        <div className="col-span-2">
          <ProjectBarChart />
        </div>

        <div className="col-span-2">
          <PopularSkillsChart />
        </div>
      </div>
    </div>
  );
}
