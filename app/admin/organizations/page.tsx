"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useIsClient } from "@/app/lib/contexts/useIsClient";
import { Table } from "antd";
import { formatDate } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import TableContainer from "../components/TableContainer";

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Array<any>>();
  const isClient = useIsClient();
  const { addAlert, dismissAlert } = useAlertsContext();

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (_: any, record: any, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Mission",
      dataIndex: "mission",
      key: "mission",
      render: (mission: string) => (
        <>
          {mission ? (
            <div className="text-left">
              {mission.slice(0, 10)}
              {mission.length > 10 && (
                <span className="tooltip text-left" data-tip={mission}>
                  ...
                </span>
              )}
            </div>
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      title: "About Us",
      dataIndex: "aboutUs",
      key: "aboutUs",
      render: (aboutUs: string) => (
        <>
          {aboutUs ? (
            <div className="text-left">
              {aboutUs.slice(0, 10)}
              {aboutUs.length > 10 && (
                <span className="tooltip text-left" data-tip={aboutUs}>
                  ...
                </span>
              )}
            </div>
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      title: "Website URL",
      dataIndex: "websiteUrl",
      key: "websiteUrl",
      render: (websiteUrl: string) => (
        <>
          {websiteUrl ? (
            <Link href={websiteUrl} target="_blank">
              {websiteUrl}
            </Link>
          ) : (
            "-"
          )}
        </>
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
      title: "Email",
      dataIndex: "contactEmail",
      key: "contactEmail",
      render: (contactEmail: any) => (
        <>{contactEmail ? <span>{contactEmail}</span> : "-"}</>
      ),
    },
    {
      title: "Phone",
      dataIndex: "contactPhone",
      key: "contactPhone",
      render: (contactPhone: any) => <span>{contactPhone}</span>,
    },
    {
      title: "Founding Date",
      dataIndex: "foundingDate",
      key: "foundingDate",
      render: (foundingDate: any) => (
        <>
          {foundingDate ? (
            <span>{formatDate(foundingDate, "MMM dd, yyyy")}</span>
          ) : (
            "-"
          )}
        </>
      ),
      sorter: (a: any, b: any) => a.foundingDate.localeCompare(b.foundingDate),
    },
    {
      title: "Permit",
      dataIndex: "permit",
      key: "permit",
      render: (_: any, record: any) => (
        <>
          {record.permitId ? (
            <button className="btn btn-xs" onClick={() => getPermit(record.id)}>
              Show permit
            </button>
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      title: "Verified",
      dataIndex: "verified",
      key: "verified",
      render: (_: any, record: any) => (
        <>
          {record.verified ? (
            <div className="badge badge-success">Verified</div>
          ) : (
            <button
              className="btn btn-primary btn-xs"
              onClick={() => handleUpdate({ verified: true }, record.id)}
            >
              Approve
            </button>
          )}
        </>
      ),
      filters: [
        {
          text: "Verified",
          value: true,
        },
        {
          text: "Not verified",
          value: false,
        },
      ],
      onFilter: (value: any, record: any) => record.verified === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: any) => (
        <>
          {record.isActive ? (
            <button
              className="btn btn-error btn-xs"
              onClick={() => handleUpdate({ isActive: false }, record.id)}
            >
              Deactivate
            </button>
          ) : (
            <button
              className="btn btn-success btn-xs"
              onClick={() => handleUpdate({ isActive: true }, record.id)}
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
          text: "Deactivated",
          value: false,
        },
      ],
      onFilter: (value: any, record: any) => record.isActive === value,
    },
  ];

  async function getPermit(id: string) {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/files/getPermit/${id}`,
        {
          responseType: "blob",
        },
      );

      if (response.status === 200) {
        const url = URL.createObjectURL(response.data);
        if (isClient) {
          const link = document.createElement("a");
          link.href = url;
          link.target = "_blank";
          link.click();
        }
      }
    } catch (error: any) {
      const id = addAlert({
        message: error?.response?.data?.message || "Failed to get permit",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  }

  const handleUpdate = async (values: any, id: string) => {
    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/organizations/${id}`,
        values,
      );

      if (res.status === 200) {
        const id = addAlert({
          message: "Organization updated successfully",
          severity: "success",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
        fetchOrgs();
      }
    } catch (error: any) {
      const id = addAlert({
        message:
          error?.response?.data?.message || "Failed to update organization",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  const fetchOrgs = async () => {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/organizations`,
    );

    if (res.status === 200) {
      setOrgs(res.data);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  return (
    <>
      <div className="space-y-3 overflow-x-auto">
        <div className="card-title">Organizations</div>

        <TableContainer>
          <Table columns={columns} dataSource={orgs} />
        </TableContainer>
      </div>
    </>
  );
}
