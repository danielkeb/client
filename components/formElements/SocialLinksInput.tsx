"use client";

import clsx from "clsx";
import { useField } from "formik";
import {
  FaBehance,
  FaDribbble,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

export default function SocialLinksInput({
  label,
  classes,
}: {
  label: string;
  classes?: string;
}) {
  const pickIcon = (label: string) => {
    switch (label) {
      case "Dribbble":
        return <FaDribbble size={18} />;
      case "LinkedIn":
        return <FaLinkedin size={18} />;
      case "GitHub":
        return <FaGithub size={18} />;
      case "Behance":
        return <FaBehance size={18} />;
      case "Instagram":
        return <FaInstagram size={18} />;
      case "Website":
        return <FaGlobe size={18} />;
      default:
        return;
    }
  };

  const [field, meta] = useField(label);

  return (
    <div className="flex flex-col">
      <div className="flex w-full flex-row">
        <div className="flex min-w-[20%] flex-row items-center gap-4 border border-r-0 border-neutral bg-base-200/60 px-5 py-2 text-lg">
          <div>{pickIcon(label)}</div>
          <span>{label}</span>
        </div>

        <div className="w-full">
          <input
            {...field}
            name={label}
            id={label}
            type="text"
            className={clsx(
              meta.error && meta.touched
                ? "border-error focus:border-error focus:ring-error"
                : "focus:border-accent-200 focus:ring-accent-200",
              "w-full bg-base-100 py-3",
            )}
          />
        </div>
      </div>
      <div className="ml-[20%] min-h-[1.2rem] w-full py-1 text-sm text-error">
        {meta.error && meta.touched ? meta.error : ""}
      </div>
    </div>
  );
}
