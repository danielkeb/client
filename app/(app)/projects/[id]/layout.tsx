"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import { useIsClient } from "@/app/lib/contexts/useIsClient";
import {
  reportDescriptionValidation,
  reportReasonValidation,
} from "@/app/lib/forms/validationSchemas";
import { REPORT_REASONS } from "@/app/lib/reportReasons";
import "@/app/styles.css";
import { SelectInput } from "@/components/formElements";
import TextAreaInput from "@/components/formElements/TextAreaInput";
import LogoAvatar from "@/components/global/LogoAvatar";
import axios from "axios";
import clsx from "clsx";
import { Form, Formik } from "formik";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BiDotsVerticalRounded, BiFile } from "react-icons/bi";
import { GoTasklist } from "react-icons/go";
import { MdOutlineRateReview } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";
import * as Yup from "yup";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [applied, setApplied] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [project, setProject] = useState<any>();
  const [isOwner, setIsOwner] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);
  const { addAlert, dismissAlert } = useAlertsContext();
  const isClient = useIsClient();
  const [activeIndex, setActiveIndex] = useState(-1);
  const { org, user } = useAuthContext();
  const pathname = usePathname();

  const handleReport = async (values: any) => {
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reports`,
        {
          contentType: "PROJECT",
          contentId: project.id,
          reason: values.reason,
          description: values.description,
        },
      );

      if (res.status === 201) {
        (
          document.getElementById("report_project_modal") as HTMLDialogElement
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
    if (pathname.includes("applications")) {
      setActiveIndex(0);
    } else if (pathname.includes("tasks")) {
      setActiveIndex(1);
    } else if (pathname.includes("reviews")) {
      setActiveIndex(2);
    } else {
      setActiveIndex(-1);
    }
  }, [pathname]);

  const showModal = (id: string) => {
    isClient && (document.getElementById(id) as HTMLDialogElement).showModal();
  };

  const closeModal = (id: string) => {
    isClient && (document.getElementById(id) as HTMLDialogElement).close();
  };

  const handleApply = async (values: any) => {
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${project?.id}/apply`,
        values,
      );

      if (res.status === 201) {
        setApplied(true);
        const id = addAlert({
          severity: "success",
          message: "Applied to project successfully",
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
          "Failed to apply to project. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    } finally {
      closeModal("apply_to_projects_modal");
    }
  };

  const handleReview = async (values: any) => {
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${project?.id}`,
        {
          comment: values.comment,
          rating: Number(values.rating),
        },
      );

      if (res.status === 201) {
        setReviewed(true);
        window.location.reload();
        const id = addAlert({
          severity: "success",
          message: "Project successfully reviewed",
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
          "Failed to add review to project. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    } finally {
      closeModal("review_projects_modal");
    }
  };

  // Check if already applied and already reviewed the project
  useEffect(() => {
    const checkApplied = async () => {
      try {
        const res = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/applications/check/${project?.id}`,
        );

        if (res.status === 200 && res.data.applied) {
          setApplied(res.data.applied);
        }
      } catch (error) {
        setApplied(false);
      }
    };

    const checkReviewed = async () => {
      try {
        const res = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/check/${project?.id}`,
        );

        if (res.status === 200 && res.data.reviewed) {
          setReviewed(res.data.reviewed);
        }
      } catch (error) {
        setReviewed(false);
      }
    };

    if (project?.id) {
      checkApplied();
      checkReviewed();
    }
  }, [pathname, project]);

  // Check if project owner
  useEffect(() => {
    const checkOwner = () => {
      const res = org.projects.some((item: any) => {
        return item.id === project.id;
      });
      setIsOwner(res);
    };

    // Is participating
    if (user && user.applications && project) {
      const participating = user.applications.some((item: any) => {
        return item.status === "ACCEPTED" && item.projectId === project.id;
      });
      setIsParticipating(participating);
    }
    if (org?.projects && project) {
      checkOwner();
    }
  }, [org, project, user]);

  //   Fetch project
  useEffect(() => {
    const fetchProject = async (id: string) => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
        );

        if (res.status === 200) {
          setProject(res.data);
        }
      } catch (error) {
        const id = addAlert({
          severity: "error",
          message: "Failed to retrieve project. Please try again.",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
      }
    };

    fetchProject(pathname.split("/")[2]);
  }, [addAlert, dismissAlert, pathname]);

  return (
    <>
      <div className="layout-container">
        <div className="layout-left-child">
          <div className="card rounded-md">
            <div className="card-body space-y-3">
              <div className="flex flex-col gap-1">
                <div className="flex flex-row items-center gap-2">
                  <LogoAvatar
                    id={project?.organization?.id}
                    name={project?.organization?.name}
                    size="sm"
                  />
                  <p>{project?.organization?.name}</p>
                </div>
                <Link href={`/projects/${project?.id}`}>
                  <h1 className="text-2xl font-bold">{project?.title}</h1>
                </Link>
              </div>

              <div className="flex flex-row gap-2">
                {isOwner && project?.status !== "DONE" ? (
                  <Link
                    href={`/projects/${project.id}/edit`}
                    className="w-fit flex-grow"
                  >
                    <button className="btn btn-primary w-full">
                      Edit Project
                    </button>
                  </Link>
                ) : project?.status !== "DONE" ? (
                  <button
                    className={clsx(
                      "btn btn-primary flex-grow",
                      applied && "btn-disabled",
                    )}
                    onClick={() => {
                      if (!applied) {
                        showModal("apply_to_projects_modal");
                      }
                    }}
                  >
                    {applied ? "You have already applied." : "Apply"}
                  </button>
                ) : !reviewed ? (
                  <button
                    className="btn btn-primary flex-grow"
                    onClick={() => {
                      if (!reviewed) {
                        showModal("review_projects_modal");
                      }
                    }}
                  >
                    Add review
                  </button>
                ) : (
                  <></>
                )}

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
                              "report_project_modal",
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
            {isOwner && (
              <Link href={`/projects/${project?.id}/applications`}>
                <div
                  className={clsx(
                    activeIndex === 0
                      ? "bg-primary text-primary-content"
                      : "bg-base-100 text-base-content",
                    "flex cursor-pointer flex-row items-center gap-4 rounded-md rounded-b-none border border-neutral/10 p-4 font-medium hover:bg-opacity-50 lg:gap-7 lg:p-6",
                  )}
                >
                  <div>
                    <BiFile size={28} />
                  </div>

                  <div className="flex flex-col">
                    <span className="lg:text-2xl">Applications</span>
                    <span className="line-clamp-1 font-light">
                      {`${project?.applications?.length} applications`}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {(isOwner || isParticipating) && (
              <Link href={`/projects/${project?.id}/tasks`}>
                <div
                  className={clsx(
                    activeIndex === 1
                      ? "bg-primary text-primary-content"
                      : "bg-base-100 text-base-content",
                    "flex cursor-pointer flex-row items-center gap-4 rounded-none border border-neutral/10 p-4 font-medium hover:bg-opacity-50 lg:gap-7 lg:p-6",
                  )}
                >
                  <div>
                    <GoTasklist size={28} />
                  </div>

                  <div className="flex flex-col">
                    <span className="lg:text-2xl">Tasks</span>
                    <span className="line-clamp-1 font-light">
                      {`${project?._count?.tasks} open tasks`}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {project?.status === "DONE" && (
              <Link href={`/projects/${project?.id}/reviews`}>
                <div
                  className={clsx(
                    activeIndex === 2
                      ? "bg-primary text-primary-content"
                      : "bg-base-100 text-base-content",
                    "flex cursor-pointer flex-row items-center gap-4 rounded-md rounded-t-none border border-neutral/10 p-4 font-medium hover:bg-opacity-50 lg:gap-7 lg:p-6",
                  )}
                >
                  <div>
                    <MdOutlineRateReview size={28} />
                  </div>

                  <div className="flex flex-col">
                    <span className="lg:text-2xl">Reviews</span>
                    <span className="line-clamp-1 font-light">
                      {`${project?.reviews?.length} reviews`}
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>

        <div className="layout-right-child">
          <div>{children}</div>
        </div>
      </div>

      {/* Apply to project modal */}
      <dialog id="apply_to_projects_modal" className="modal">
        <div className="prose modal-box rounded-md lg:prose-lg">
          <h3>Cover Letter</h3>
          <p className="leading-tight">
            Write a short message to the organization. You can include things
            like: why are you qualified for this position, what skills you have,
            etc.
          </p>

          <Formik
            initialValues={{
              message: "",
            }}
            validationSchema={Yup.object({
              message: Yup.string().max(
                500,
                "Message must not exceed 500 characters",
              ),
            })}
            onSubmit={(values) => {
              handleApply(values);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <TextAreaInput
                  label="Message (Optional)"
                  props={{
                    name: "message",
                    rows: 5,
                    maxLength: 500,
                    placeholder: "Write a short message",
                  }}
                />

                <div className="modal-action mt-5 flex flex-row justify-end gap-4">
                  <div onClick={() => closeModal("apply_to_projects_modal")}>
                    <button
                      disabled={isSubmitting}
                      type="reset"
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                  <div>
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="btn btn-success"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </dialog>

      {/* Review project modal */}
      <dialog id="review_projects_modal" className="modal">
        <div className="prose modal-box rounded-md lg:prose-lg">
          <h3>Add Review</h3>

          <Formik
            initialValues={{
              rating: 0,
              comment: "",
            }}
            validationSchema={Yup.object({
              rating: Yup.number().required("Rating is required").min(0).max(5),
              comment: Yup.string().max(
                500,
                "Comment must not exceed 500 characters",
              ),
            })}
            onSubmit={(values) => {
              handleReview(values);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <SelectInput
                  label="Rating"
                  props={{
                    name: "rating",
                  }}
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </SelectInput>

                <TextAreaInput
                  label="Comment (Optional)"
                  props={{
                    name: "comment",
                    rows: 5,
                    maxLength: 500,
                    placeholder: "Write a short message",
                  }}
                />

                <div className="modal-action mt-5 flex flex-row justify-end gap-4">
                  <div onClick={() => closeModal("review_projects_modal")}>
                    <button
                      disabled={isSubmitting}
                      type="reset"
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                  <div>
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="btn btn-success"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </dialog>

      {/* Report project modal */}
      <dialog id="report_project_modal" className="modal">
        <div className="prose modal-box rounded-md lg:prose-lg">
          <h3>Report Project</h3>

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
                            "report_project_modal",
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
