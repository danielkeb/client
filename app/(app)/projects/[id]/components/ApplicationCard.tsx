"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import UserAvatar from "@/components/global/UserAvatar";
import clsx from "clsx";
import { format } from "date-fns";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

export default function ApplicationCard({
  application,
  getApplications,
}: {
  application: any;
  getApplications: any;
}) {
  const [cv, setCv] = useState<string | null>();
  const { addAlert, dismissAlert } = useAlertsContext();
  const pathname = usePathname();

  const handleAccept = async (applicationId: string) => {
    try {
      const res = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/accept/${applicationId}`,
      );

      if (res.status === 200) {
        const id = addAlert({
          severity: "success",
          message: "Application accepted successfully",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);

        getApplications(pathname.split("/")[2]);
      }
    } catch (error) {
      const id = addAlert({
        severity: "error",
        message: "Failed to accept application. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      const res = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/reject/${applicationId}`,
      );

      if (res.status === 200) {
        const id = addAlert({
          severity: "success",
          message: "Application rejected successfully",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);

        getApplications(pathname.split("/")[2]);
      }
    } catch (error) {
      const id = addAlert({
        severity: "error",
        message: "Failed to reject application. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  useEffect(() => {
    async function getCV() {
      try {
        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/files/getCV/${application.userId}`,
          {
            responseType: "blob",
          },
        );

        if (response.status === 200) {
          const url = URL.createObjectURL(response.data);
          setCv(url);
        }
      } catch (e) {
        setCv(null);
      }
    }

    if (application.userId !== undefined) {
      getCV();
    }
  }, [application.userId]);

  return (
    <>
      {application && (
        <div className="collapse join-item collapse-arrow">
          <input
            id={`${application.id}`}
            type="radio"
            name={`${application.status}`}
          />
          <div
            className="collapse-title flex flex-row items-center gap-3 text-xl font-medium"
            onClick={() =>
              document.getElementById(`${application.id}`)?.click()
            }
          >
            <UserAvatar
              email={application.user.email}
              name={application.user.firstName}
              size="sm"
            />
            <div className="flex flex-col">
              <span>{`${application.user.firstName} ${application.user.lastName}`}</span>
              <div
                className={clsx(
                  "badge badge-xs",
                  application.status === "PENDING" && "badge-warning",
                  application.status === "ACCEPTED" && "badge-success",
                  application.status === "REJECTED" && "badge-error",
                )}
              >{`${application.status}`}</div>
            </div>
          </div>

          <div className="collapse-content space-y-4">
            <div>
              <p className="text-sm">Application Date</p>
              <p className="text-xl font-medium">
                {format(application.createdAt, "MMM dd, yyyy")}
              </p>
            </div>

            <div>
              <p className="text-sm">Message</p>
              <p>{application.message || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm">Bio</p>
              <p className="text-xl font-medium">
                {application.user.bio || "N/A"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm">Email</p>
                <p className="text-xl font-medium">
                  {application.user.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm">Username</p>
                <p className="text-xl font-medium">
                  {application.user.username || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm">Age</p>
                <p className="text-xl font-medium">
                  {application.user.age || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm">Gender</p>
                <p className="text-xl font-medium">
                  {application.user.gender || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm">Location</p>
                <p className="text-xl font-medium">
                  {application?.user?.location?.name || "N/A"}
                </p>
              </div>
              {cv && (
                <div className="space-y-1">
                  <p className="text-sm">CV</p>
                  <Link className="link link-primary" href={cv} target="_blank">
                    View CV
                  </Link>
                </div>
              )}
            </div>

            <div>
              <Link
                href={`/v/${application.userId}`}
                target="_blank"
                className="link link-primary flex flex-row items-center gap-2"
              >
                <span>View full profile</span>
                <FaArrowUpRightFromSquare />
              </Link>
            </div>

            {application.status === "PENDING" && (
              <div className="space-x-2 pt-4">
                <button
                  className="btn btn-success"
                  onClick={() => handleAccept(application.id)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => handleReject(application.id)}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
