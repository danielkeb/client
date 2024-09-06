"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { Table } from "antd";
import { formatDate } from "date-fns";
import { useEffect, useState } from "react";
import TableContainer from "../components/TableContainer";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Array<any>>();
  const { addAlert, dismissAlert } = useAlertsContext();

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (_: any, record: any, index: number) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a: any, b: any) => a.title.localeCompare(b.title),
    },
    {
      title: "Organization",
      dataIndex: "organization",
      key: "organization",
      render: (_: any, record: any) => <span>{record.organization.name}</span>,
      sorter: (a: any, b: any) =>
        a.organization.name.localeCompare(b.organization.name),
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
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (_: any, record: any) => <span>{record.location.name}</span>,
      sorter: (a: any, b: any) =>
        a.location.name.localeCompare(b.location.name),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (_: any, record: any) => (
        <span>{formatDate(record.startDate, "MMM dd, yyyy")}</span>
      ),
      sorter: (a: any, b: any) => a.startDate.localeCompare(b.startDate),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (_: any, record: any) => (
        <span>{formatDate(record.endDate, "MMM dd, yyyy")}</span>
      ),
      sorter: (a: any, b: any) => a.endDate.localeCompare(b.endDate),
    },
    {
      title: "Applications",
      dataIndex: "applications",
      key: "applications",
      render: (_: any, record: any) => (
        <span>{record?.applications?.length || 0}</span>
      ),
      sorter: (a: any, b: any) => a.applications.length - b.applications.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Not Started",
          value: "NOT_STARTED",
        },
        {
          text: "In Progress",
          value: "IN_PROGRESS",
        },
        {
          text: "Done",
          value: "DONE",
        },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: "Is Active?",
      dataIndex: "isActive",
      key: "isActive",
      render: (_: any, record: any) => (
        <>
          {record.isActive ? (
            <button
              className="btn btn-error btn-xs"
              onClick={() => handleUpdate(record.id, { isActive: false })}
            >
              Deactivate
            </button>
          ) : (
            <button
              className="btn btn-success btn-xs"
              onClick={() => handleUpdate(record.id, { isActive: true })}
            >
              Activate
            </button>
          )}
        </>
      ),
      filters: [
        {
          text: "Active",
          value: true,
        },
        {
          text: "Inactive",
          value: false,
        },
      ],
      onFilter: (value: any, record: any) => record.isActive === value,
    },
  ];

  const handleUpdate = async (id: string, values: any) => {
    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/edit`,
        values,
      );

      if (res.status === 200) {
        const id = addAlert({
          message: "Deactivate successful updated successfully",
          severity: "success",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
        fetchProjects();
      }
    } catch (error: any) {
      const id = addAlert({
        message:
          error?.response?.data?.message || "Failed to deactivate project",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  const fetchProjects = async () => {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/projects`,
    );

    if (res.status === 200) {
      setProjects(res.data);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="space-y-3 overflow-x-auto">
      <div className="card-title">Projects</div>

      <TableContainer>
        <Table columns={columns} dataSource={projects} />
      </TableContainer>
    </div>
  );
}
