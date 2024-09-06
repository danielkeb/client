import clsx from "clsx";
import Link from "next/link";
import { BiSolidPencil } from "react-icons/bi";

export default function ProjectList({
  projects,
  isDone,
  own,
}: {
  projects: any[];
  isDone: boolean;
  own: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {projects &&
        projects.map((project, index) => (
          <Link
            key={index}
            href={`/projects/${project.id}`}
            className="flex hover:bg-opacity-50"
          >
            <div
              className={clsx(
                "card flex-grow rounded-md hover:bg-opacity-50",
                isDone && "card-compact rounded",
              )}
            >
              <div className="card-body space-y-3">
                <div className="flex flex-row items-center justify-between gap-2">
                  <span className="text-2xl font-bold">{project.title}</span>

                  {own && (
                    <Link href={`/projects/${project.id}/edit`}>
                      <div>
                        <BiSolidPencil size={20} />
                      </div>
                    </Link>
                  )}
                </div>
                <p className="line-clamp-2 text-pretty leading-tight">
                  {project.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}
