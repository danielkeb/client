"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import {
  reportDescriptionValidation,
  reportReasonValidation,
} from "@/app/lib/forms/validationSchemas";
import { REPORT_REASONS } from "@/app/lib/reportReasons";
import { SelectInput } from "@/components/formElements";
import TextAreaInput from "@/components/formElements/TextAreaInput";
import UserAvatar from "@/components/global/UserAvatar";
import { format } from "date-fns";
import { Form, Formik } from "formik";
import Link from "next/link";
import { BiDotsVerticalRounded, BiSolidPencil } from "react-icons/bi";
import { RiErrorWarningFill } from "react-icons/ri";
import * as Yup from "yup";
import BadgeCard from "./BadgeCard";

export default function UserProfile({
  id,
  firstName,
  lastName,
  username,
  email,
  createdAt,
  ownProfile,
  badge,
}: {
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  createdAt: string;
  ownProfile: boolean;
  badge?: any;
}) {
  const { addAlert, dismissAlert } = useAlertsContext();

  const handleReport = async (values: any) => {
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reports`,
        {
          contentType: "USER",
          contentId: id,
          reason: values.reason,
          description: values.description,
        },
      );

      if (res.status === 201) {
        (
          document.getElementById("report_user_modal") as HTMLDialogElement
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

  return (
    <>
      <div className="card-body flex flex-row items-center gap-6 rounded-t bg-primary text-primary-content">
        <UserAvatar email={email} name={firstName} size="lg" />

        <div className="flex flex-grow flex-col">
          <div className="flex flex-row items-center gap-3 capitalize">
            <span className="text-2xl">{`${firstName} ${lastName}`}</span>
            {badge && <BadgeCard badge={badge} size="sm" />}
          </div>
          <span className="text-lg">{`@${username}`}</span>
          <span className="font-light">{`Joined on ${createdAt && format(createdAt, "MMMM yyyy")}`}</span>
        </div>

        {/* Show the edit icon if the user is viewing his/her own profile */}
        {ownProfile ? (
          <Link href="/v/me/edit">
            <BiSolidPencil size={28} />
          </Link>
        ) : (
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
                        "report_user_modal",
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
        )}
      </div>

      {/* Report user modal */}
      <dialog id="report_user_modal" className="modal">
        <div className="prose modal-box rounded-md lg:prose-lg">
          <h3>Report User</h3>

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
