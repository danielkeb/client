"use client";

import axiosInstance from "@/app/axiosInstance";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ApplicationCard from "../components/ApplicationCard";

export default function ApplicationsPage() {
  const [pending, setPending] = useState<Array<any> | null>();
  const [rejected, setRejected] = useState<Array<any> | null>();
  const [accepted, setAccepted] = useState<Array<any> | null>();
  const pathname = usePathname();

  const getApplications = async (id: string) => {
    try {
      const res = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${id}`,
      );

      if (res.status === 200) {
        setPending(res.data.pending);
        setRejected(res.data.rejected);
        setAccepted(res.data.accepted);
      }
    } catch (error) {
      setPending(null);
      setRejected(null);
      setAccepted(null);
    }
  };

  useEffect(() => {
    if (pathname) {
      getApplications(pathname.split("/")[2]);
    }
  }, [pathname]);

  return (
    <div className="space-y-3">
      <div>
        <div>
          <span>Pending Applications</span>
          <div className="divider mt-0"></div>
        </div>

        {pending && pending.length > 0 ? (
          <div className="join join-vertical w-full rounded-md">
            {pending.map((application: any, index: number) => {
              return (
                <ApplicationCard
                  key={index}
                  application={application}
                  getApplications={getApplications}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center italic">No pending applications</p>
        )}
      </div>

      <div>
        <div>
          <span>Accepted Applications</span>
          <div className="divider mt-0"></div>
        </div>

        {accepted && accepted.length > 0 ? (
          <div className="join join-vertical w-full rounded-md">
            {accepted.map((application: any, index: number) => {
              return (
                <ApplicationCard
                  key={index}
                  application={application}
                  getApplications={getApplications}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center italic">No accepted applications</p>
        )}
      </div>

      <div>
        <div>
          <span>Rejected Applications</span>
          <div className="divider mt-0"></div>
        </div>

        {rejected && rejected.length > 0 ? (
          <div className="join join-vertical w-full rounded-md">
            {rejected.map((application: any, index: number) => {
              return (
                <ApplicationCard
                  key={index}
                  application={application}
                  getApplications={getApplications}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center italic">No rejected applications</p>
        )}
      </div>
    </div>
  );
}
