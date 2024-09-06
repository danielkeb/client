"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import {
  reportDescriptionValidation,
  reportReasonValidation,
} from "@/app/lib/forms/validationSchemas";
import { REPORT_REASONS } from "@/app/lib/reportReasons";
import "@/app/styles.css";
import { SelectInput } from "@/components/formElements";
import TextAreaInput from "@/components/formElements/TextAreaInput";
import LogoAvatar from "@/components/global/LogoAvatar";
import PageNotFoundImage from "@/public/img/404-page-image.svg";
import axios from "axios";
import clsx from "clsx";
import { format } from "date-fns";
import { Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { GoProject } from "react-icons/go";
import { RiErrorWarningFill } from "react-icons/ri";
import * as Yup from "yup";

export default function OrgProfileSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [org, setOrg] = useState<any>();
  const [active, setActive] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { addAlert, dismissAlert } = useAlertsContext();

  const handleReport = async (values: any) => {
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reports`,
        {
          contentType: "ORGANIZATION",
          contentId: org.id,
          reason: values.reason,
          description: values.description,
        },
      );

      if (res.status === 201) {
        (
          document.getElementById("report_org_modal") as HTMLDialogElement
        ).close();

        const id = addAlert({
          severity: "success",
          message: "Report submitted successfully",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
      }
    } catch (error: any) {
      const id = addAlert({
        severity: "error",
        message:
          error?.response?.data?.message ||
          "Failed to submit report. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  useEffect(() => {
    const gerOrg = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/organizations/${pathname.split("/")[2]}`,
        );

        if (res.status === 200) {
          setOrg(res.data);
        }
      } catch (error) {
        setOrg(null);
      }
    };

    gerOrg();
  }, [pathname]);

  useEffect(() => {
    if (pathname.split("/")[3] === "projects") {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [pathname]);

  return (
    <>
      {org ? (
        <div className="layout-container">
          {/* Sidebar */}
          <div className="space-y-3">
            <div className="layout-left-child">
              <div className="card rounded-md">
                <div className="card-body">
                  <div
                    className={clsx(
                      "badge",
                      org?.verified ? "badge-success" : "badge-error",
                    )}
                  >
                    {org?.verified ? "Verified" : "Not Verified"}
                  </div>
                  <LogoAvatar id={org?.id} name={org?.name} size="xl" />
                  <Link href={`/o/${org?.id}`}>
                    <h2 className="text-3xl font-medium">{org?.name}</h2>
                  </Link>

                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row">
                      <span>{org?.location?.name}</span>
                      {org?.foundingDate && (
                        <>
                          <div className="divider divider-horizontal"></div>
                          <span>{`Since ${format(org?.foundingDate, "MMMM, yyyy")}`}</span>
                        </>
                      )}
                    </div>

                    <details className="dropdown dropdown-end">
                      <summary className="btn btn-ghost px-1 py-0">
                        <BiDotsVerticalRounded size={28} />
                      </summary>

                      <ul className="menu dropdown-content z-[1] rounded-md bg-base-100 text-base-content shadow">
                        <li>
                          <div
                            className="flex flex-row items-center gap-2 pl-1"
                            onClick={() => {
                              (
                                document.getElementById(
                                  "report_org_modal",
                                ) as HTMLDialogElement
                              ).showModal();
                            }}
                          >
                            <RiErrorWarningFill size={20} />
                            <span>Report</span>
                          </div>
                        </li>
                      </ul>
                    </details>
                  </div>
                </div>
              </div>

              <div className="flex flex-row lg:flex-col">
                <Link href={`/o/${org?.id}/projects`}>
                  <div
                    className={clsx(
                      active
                        ? "bg-primary text-primary-content"
                        : "bg-base-100 text-base-content",
                      "flex cursor-pointer flex-row items-center gap-4 rounded-md border border-neutral/10 p-4 font-medium hover:bg-opacity-50 lg:gap-7 lg:p-6",
                    )}
                  >
                    <div>
                      <GoProject size={28} />
                    </div>

                    <div className="flex flex-col">
                      <span className="lg:text-2xl">Projects</span>
                      <span className="line-clamp-1 font-light">
                        {org?._count &&
                          `${org?._count.projects} Finished, ${org?.projects.length - org?._count.projects} In Progress`}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="layout-right-child">{children}</div>
        </div>
      ) : (
        <main className="flex flex-col items-center justify-center gap-12 py-24">
          <div className="flex justify-center">
            <Image
              src={PageNotFoundImage}
              alt="Page not found illustration"
              style={{ width: "60%", height: "auto" }}
            />
          </div>

          <div className="prose space-y-4 text-center lg:prose-lg">
            <h1>404 - Page not found</h1>
            <p>Oops! The page you are looking for could not be found.</p>
          </div>

          <div className="inline-flex gap-6">
            <div onClick={() => router.refresh()}>
              <button className="btn btn-outline">Try Again</button>
            </div>
            <Link href="/">
              <button className="btn btn-primary">Go to home page</button>
            </Link>
          </div>
        </main>
      )}

      {/* Report org modal */}
      <dialog id="report_org_modal" className="modal">
        <div className="prose modal-box rounded-md lg:prose-lg">
          <h3>Report Organization</h3>

          <Formik
            initialValues={{
              reason: "",
              description: "",
            }}
            validationSchema={Yup.object({
              reason: reportReasonValidation,
              description: reportDescriptionValidation,
            })}
            onSubmit={(values) => {
              handleReport(values);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <SelectInput
                  label="Reason"
                  props={{
                    name: "reason",
                  }}
                >
                  <option value="">Select reason</option>
                  {REPORT_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </SelectInput>

                <TextAreaInput
                  label="Description"
                  props={{
                    name: "description",
                    id: "description",
                    rows: 5,
                    maxLength: 500,
                    placeholder: "Any additional information you want to add?",
                  }}
                />

                <div className="modal-action mt-5 flex flex-row justify-end gap-4">
                  <div>
                    <button
                      disabled={isSubmitting}
                      type="reset"
                      className="btn btn-outline"
                      onClick={() => {
                        (
                          document.getElementById(
                            "report_user_modal",
                          ) as HTMLDialogElement
                        ).close();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  <div>
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="btn btn-primary"
                    >
                      Report
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </dialog>
    </>
  );
}
