"use client";

import axiosInstance from "@/app/axiosInstance";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Applications() {
  const [pendingApplications, setPendingApplications] =
    useState<Array<any> | null>();
  const [acceptedApplications, setAcceptedApplications] =
    useState<Array<any> | null>();
  const [rejectedApplications, setRejectedApplications] =
    useState<Array<any> | null>();

  useEffect(() => {
    const getMyApplications = async () => {
      try {
        const res = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/applications/myApplications`,
        );

        if (res.status === 200) {
          setPendingApplications(res.data.pending);
          setAcceptedApplications(res.data.accepted);
          setRejectedApplications(res.data.rejected);
        }
      } catch (error) {
        setPendingApplications(null);
        setAcceptedApplications(null);
        setRejectedApplications(null);
      }
    };

    getMyApplications();
  }, []);

  return (
    <div className="space-y-3">
      <div>
        <div>
          <span>Pending Applications</span>
          <div className="divider mt-0"></div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {pendingApplications && pendingApplications.length > 0 ? (
            pendingApplications.map((application, index) => (
              <Link key={index} href={`/projects/${application.project.id}`}>
                <div className="card rounded-md">
                  <div className="card-body space-y-2">
                    <div>
                      <span className="text-sm">Status</span>
                      <div className="badge badge-warning block">
                        {application.status}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm">Project Title</span>
                      <div className="text-xl">{application.project.title}</div>
                    </div>

                    <div>
                      <span className="text-sm">Date</span>
                      <div className="text-xl">
                        {format(application.createdAt, "dd MMM yyyy")}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center italic">
              You don&apos;t have any pending applications.
            </div>
          )}
        </div>
      </div>

      <div>
        <div>
          <span>Accepted Applications</span>
          <div className="divider mt-0"></div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {acceptedApplications && acceptedApplications.length > 0 ? (
            acceptedApplications.map((application, index) => (
              <Link key={index} href={`/projects/${application.project.id}`}>
                <div className="card card-compact rounded-md">
                  <div className="card-body space-y-3">
                    <div>
                      <span className="text-sm">Status</span>
                      <div className="badge badge-success block">
                        {application.status}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm">Project Title</span>
                      <div className="text-xl">{application.project.title}</div>
                    </div>

                    <div>
                      <span className="text-sm">Date</span>
                      <div className="text-xl">
                        {format(application.createdAt, "dd MMM yyyy")}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center italic">
              You don&apos;t have any accepted applications.
            </div>
          )}
        </div>
      </div>

      <div>
        <div>
          <span>Rejected Applications</span>
          <div className="divider mt-0"></div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {rejectedApplications && rejectedApplications.length > 0 ? (
            rejectedApplications.map((application, index) => (
              <Link key={index} href={`/projects/${application.project.id}`}>
                <div className="card card-compact rounded-md">
                  <div className="card-body space-y-3">
                    <div>
                      <span className="text-sm">Status</span>
                      <div className="badge badge-error block">
                        {application.status}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm">Project Title</span>
                      <div className="text-xl">{application.project.title}</div>
                    </div>

                    <div>
                      <span className="text-sm">Date</span>
                      <div className="text-xl">
                        {format(application.createdAt, "dd MMM yyyy")}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center italic">
              You don&apos;t have any rejected applications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
