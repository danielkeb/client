import clsx from "clsx";
import { BiInfoCircle } from "react-icons/bi";
import { CiWarning } from "react-icons/ci";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdOutlineDangerous } from "react-icons/md";

const variants = {
  success: "alert-success",
  error: "alert-error",
  warning: "alert-warning",
  info: "alert-info",
  "": "",
};

const icons = {
  info: <BiInfoCircle size={24} />,
  warning: <CiWarning size={24} />,
  success: <FaRegCircleCheck size={24} />,
  error: <MdOutlineDangerous size={24} />,
  "": "",
};

function Alert({
  message = "",
  severity = "info",
}: {
  message: string;
  severity: "success" | "error" | "warning" | "info" | "";
  timeout?: number;
  handleDismiss?: () => void;
}) {
  return (
    message?.length && (
      <div
        role="alert"
        className={clsx("alert items-start rounded-md", variants[severity])}
      >
        {icons[severity]}
        <span>{message}</span>
      </div>
    )
  );
}

const AlertsWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pointer-events-none fixed right-0 top-0 z-50 w-full min-w-fit max-w-sm space-y-4 p-4">
      {children}
    </div>
  );
};

export { Alert, AlertsWrapper };
