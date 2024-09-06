import formatDuration from "@/app/lib/formatDuration";
import { format } from "date-fns";

export default function ContributionsCard({
  contributions,
}: {
  contributions: Array<any> | null;
}) {
  return (
    <div>
      {contributions?.map((contribution, index) => {
        return (
          <div key={index} className="space-y-2">
            <div>
              <p className="text-xl">{contribution.project.title}</p>
              <p className="text-sm">
                {contribution.project.organization.name}
              </p>
            </div>

            <p className="text-sm">
              {formatDuration(
                contribution.project.startDate,
                contribution.project.endDate,
              )}{" "}
              <span>{`(${format(contribution.project.startDate, "MMM yyyy")} - ${format(contribution.project.endDate, "MMM yyyy")})`}</span>
            </p>
            <p>{contribution.project.description}</p>

            <div className="divider"></div>
          </div>
        );
      })}
    </div>
  );
}
