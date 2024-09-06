import formatDuration from "@/app/lib/formatDuration";
import LogoAvatar from "@/components/global/LogoAvatar";
import { formatDate } from "date-fns";
import Link from "next/link";

export default function ProjectList({ projects }: { projects: any[] }) {
  const calculateOpenPositions = (skillsRequired: any) => {
    let initialValue = 0;

    let sum = skillsRequired.reduce((totalValue: any, currentSkill: any) => {
      return totalValue + currentSkill.vacancies;
    }, initialValue);

    return sum;
  };

  return (
    <div className="space-y-3">
      {projects &&
        projects.map((project, index) => (
          <Link
            key={index}
            href={`/projects/${project.id}`}
            className="flex hover:bg-opacity-50"
          >
            <div className="card flex-grow rounded-md hover:bg-opacity-50">
              <div className="card-body space-y-3">
                <div className="flex flex-row items-center gap-3">
                  <LogoAvatar
                    id={project?.organization?.id}
                    name={project?.organization?.name}
                    size="base"
                  />
                  <div className="flex-grow space-y-2">
                    <div className="flex flex-row items-center gap-2">
                      <span className="line-clamp-1 text-2xl font-bold">
                        {project.title}
                      </span>
                      {project.recommended && (
                        <span className="badge badge-success">Recommended</span>
                      )}
                    </div>
                    <span>{project?.organization?.name}</span>
                  </div>
                </div>

                <p className="line-clamp-3 text-pretty leading-tight">
                  {project.description}
                </p>

                <div className="flex flex-row flex-wrap gap-2">
                  {/* Location */}
                  {project.locationId ? (
                    <div className="badge badge-primary flex flex-row gap-2 py-2 pl-0">
                      <div className="badge badge-accent">In Person</div>
                      <div className="py-2">{project.location.name}</div>
                    </div>
                  ) : (
                    <div className="badge badge-accent">Remote</div>
                  )}

                  <div className="badge badge-primary flex flex-row gap-2 py-2 pl-0">
                    <div className="badge badge-accent">
                      {project.timeCommitment.split("_").join(" ")}
                    </div>
                    <div className="py-2">
                      {formatDuration(project.startDate, project.endDate)}
                    </div>
                  </div>

                  <div className="badge badge-primary flex flex-row gap-2 py-2 pl-0">
                    <div className="badge badge-accent">Start Date</div>
                    <div className="py-2">
                      {formatDate(project.startDate, "MMM dd, yyyy")}
                    </div>
                  </div>

                  <div className="badge badge-primary flex flex-row gap-2 py-2 pl-0">
                    <div className="badge badge-accent">End Date</div>
                    <div className="py-2">
                      {formatDate(project.endDate, "MMM dd, yyyy")}
                    </div>
                  </div>

                  <div className="badge badge-primary flex flex-row gap-2 py-2 pl-0">
                    <div className="badge badge-accent">Status</div>
                    <div className="py-2">
                      {project.status.split("_").join(" ")}
                    </div>
                  </div>

                  <div className="badge badge-primary flex flex-row gap-2 py-2 pl-0">
                    <div className="badge badge-accent">
                      {calculateOpenPositions(project.skillsRequired)}
                    </div>
                    <div className="py-2">Open positions</div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}
