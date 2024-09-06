import UserAvatar from "@/components/global/UserAvatar";
import clsx from "clsx";
import { formatDate } from "date-fns";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsCalendar2Day } from "react-icons/bs";
import { IoMdFlag } from "react-icons/io";

export default function TaskCard({
  task,
  handleStatusChange,
  handleDelete,
  isOwner,
  hideCompleted,
}: {
  task: any;
  handleStatusChange: any;
  handleDelete: any;
  isOwner: boolean;
  hideCompleted?: boolean;
}) {
  return (
    <div
      className={clsx(
        "card card-compact rounded-md",
        task.status === "COMPLETED" && hideCompleted && "hidden",
        task.status === "COMPLETED" && "brightness-75",
      )}
    >
      <div className="card-body flex flex-row items-start gap-3">
        <div>
          <input
            type="radio"
            className={clsx(
              task.priority === 3 && "radio-info",
              task.priority === 2 && "radio-warning",
              task.priority === 1 && "radio-error",
              "radio radio-sm border-2 bg-base-100",
            )}
            checked={task.status === "COMPLETED"}
            onClick={() => handleStatusChange(task.id)}
          />
        </div>

        <div className="flex-grow space-y-3">
          <div>
            <h4
              className={clsx(
                task.status === "COMPLETED" && "text-neutral line-through",
                "text-lg font-semibold leading-none",
              )}
            >
              {task?.title}
            </h4>
            <p
              className={clsx(
                task.status === "COMPLETED" && "line-through",
                "line-clamp-1 text-sm text-neutral hover:line-clamp-none",
              )}
            >
              {task?.description}
            </p>
          </div>

          <div className="flex flex-row items-center gap-3">
            <div className="flex items-center justify-center gap-2">
              <UserAvatar
                email={task.assignedTo.email}
                name={`${task.assignedTo.firstName} ${task.assignedTo.lastName}`}
                size="xxs"
              />
              <span>{`${task.assignedTo.firstName} ${task.assignedTo.lastName}`}</span>
            </div>

            <div className="flex gap-2">
              <BsCalendar2Day size={16} />
              <span>{formatDate(task.deadline, "MMM dd, yyyy")}</span>
            </div>

            <div className="flex items-center gap-1">
              <IoMdFlag
                size={16}
                className={clsx(
                  task.priority === 1 && "text-error",
                  task.priority === 2 && "text-warning",
                  task.priority === 3 && "text-info",
                )}
              />
              <span>{`P${task.priority}`}</span>
            </div>
          </div>
        </div>

        {isOwner && (
          <details className="dropdown dropdown-end dropdown-bottom">
            <summary className="btn btn-ghost px-1 py-0">
              <BiDotsVerticalRounded size={20} />
            </summary>
            <ul className="menu dropdown-content z-[1] w-52 rounded-md bg-base-100 p-2 shadow">
              <li>
                <span onClick={() => handleDelete(task.id)}>Delete</span>
              </li>
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
