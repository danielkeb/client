"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import UserAvatar from "@/components/global/UserAvatar";
import { Table } from "antd";
import { formatDate } from "date-fns";
import { useEffect, useState } from "react";
import TableContainer from "../components/TableContainer";

export default function ReportsPage() {
  const [reports, setReports] = useState<Array<any>>();
  const [stats, setStats] = useState<any>();
  const { addAlert, dismissAlert } = useAlertsContext();

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (_: any, record: any, index: number) => index + 1,
    },
    {
      title: "Reporter",
      dataIndex: "reporter",
      key: "reporter",
      render: (reporter: any) => (
        <UserAvatar
          email={reporter.email}
          name={`${reporter.firstName} ${reporter.lastName}`}
          size="xs"
        />
      ),
      width: "5%",
    },
    {
      title: "Content Type",
      dataIndex: "contentType",
      key: "contentType",
      width: "5%",
      filters: [
        {
          text: "User",
          value: "USER",
        },
        {
          text: "Organization",
          value: "ORGANIZATION",
        },
        {
          text: "Projects",
          value: "PROJECT",
        },
      ],
      onFilter: (value: any, record: any) => record.contentType === value,
    },
    {
      title: "Content Id",
      dataIndex: "contentId",
      key: "contentId",
      width: "20%",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: "10%",
      filters: [
        {
          text: "Fake",
          value: "FAKE",
        },
        {
          text: "Scam",
          value: "SCAM",
        },
        {
          text: "Inappropriate Content",
          value: "INAPPROPRIATE_CONTENT",
        },
        {
          text: "Spam",
          value: "SPAM",
        },
        {
          text: "Impersonation",
          value: "IMPERSONATION",
        },
        {
          text: "Privacy Violation",
          value: "PRIVACY_VIOLATION",
        },
        {
          text: "Other",
          value: "OTHER",
        },
      ],
      onFilter: (value: any, record: any) => record.reason === value,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string) => (
        <div className="text-left">
          {description.slice(0, 50)}
          {description.length > 50 && (
            <span className="tooltip text-left" data-tip={description}>
              ...
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => (
        <>
          {status === "RESOLVED" ? (
            <div className="badge badge-success">Resolved</div>
          ) : (
            <button
              className="btn btn-sm"
              onClick={() => {
                resolveReport(record.id);
              }}
            >
              Resolve
            </button>
          )}
        </>
      ),
      filters: [
        {
          text: "Resolved",
          value: "RESOLVED",
        },
        {
          text: "Active",
          value: "ACTIVE",
        },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => (
        <div>{formatDate(createdAt, "MMM dd, yyyy")}</div>
      ),
      sorter: (a: any, b: any) => a.createdAt.localeCompare(b.createdAt),
    },
  ];

  const resolveReport = async (id: string) => {
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/${id}/resolve`,
      );

      if (res.status === 201) {
        const id = addAlert({
          message: "Successful resolved a report",
          severity: "success",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);

        fetchData();
        fetchStats();
      }
    } catch (error: any) {
      const id = addAlert({
        message: error?.response?.data?.message || "Failed to resolve a report",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  const fetchData = async () => {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/reports`,
    );

    if (res.status === 200) {
      setReports(res.data);
    }
  };

  const fetchStats = async () => {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/stats/reportStat`,
    );

    if (res.status === 200) {
      setStats(res.data);
    }
  };

  useEffect(() => {
    fetchData();
    fetchStats();
  }, []);

  return (
    <div className="space-y-3 overflow-x-auto">
      <div className="card-title">Reports</div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">
        <div className="card card-compact rounded-md bg-gradient-to-tl from-info/50 to-info/25 duration-300 hover:scale-[0.98]">
          <div className="card-body">
            <span className="font-bold">Fake</span>
            <span>{`${stats && stats.fake.active} active, ${stats && stats.fake.resolved} resolved`}</span>
          </div>
        </div>
        <div className="card card-compact rounded-md bg-gradient-to-tl from-info/50 to-info/25 duration-300 hover:scale-[0.98]">
          <div className="card-body">
            <span className="font-bold">Scam</span>
            <span>{`${stats && stats.scam.active} active, ${stats && stats.scam.resolved} resolved`}</span>
          </div>
        </div>
        <div className="card card-compact rounded-md bg-gradient-to-tl from-info/50 to-info/25 duration-300 hover:scale-[0.98]">
          <div className="card-body">
            <span className="font-bold">Inappropriate content</span>
            <span>{`${stats && stats.inappropriate_content.active} active, ${stats && stats.inappropriate_content.resolved} resolved`}</span>
          </div>
        </div>
        <div className="card card-compact rounded-md bg-gradient-to-tl from-info/50 to-info/25 duration-300 hover:scale-[0.98]">
          <div className="card-body">
            <span className="font-bold">Spam</span>
            <span>{`${stats && stats.spam.active} active, ${stats && stats.spam.resolved} resolved`}</span>
          </div>
        </div>
        <div className="card card-compact rounded-md bg-gradient-to-tl from-info/50 to-info/25 duration-300 hover:scale-[0.98]">
          <div className="card-body">
            <span className="font-bold">Impersonation</span>
            <span>{`${stats && stats.impersonation.active} active, ${stats && stats.impersonation.resolved} resolved`}</span>
          </div>
        </div>
        <div className="card card-compact rounded-md bg-gradient-to-tl from-info/50 to-info/25 duration-300 hover:scale-[0.98]">
          <div className="card-body">
            <span className="font-bold">Privacy Violation</span>
            <span>{`${stats && stats.privacy.active} active, ${stats && stats.privacy.resolved} resolved`}</span>
          </div>
        </div>
        <div className="card card-compact rounded-md bg-gradient-to-tl from-info/50 to-info/25 duration-300 hover:scale-[0.98]">
          <div className="card-body">
            <span className="font-bold">Other</span>
            <span>{`${stats && stats.other.active} active, ${stats && stats.other.resolved} resolved`}</span>
          </div>
        </div>
      </div>

      <TableContainer>
        <Table columns={columns} dataSource={reports} />
      </TableContainer>
    </div>
  );
}
