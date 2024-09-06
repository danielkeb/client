"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useIsClient } from "@/app/lib/contexts/useIsClient";
import { TextInput } from "@/components/formElements";
import { Table } from "antd";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import * as Yup from "yup";
import TableContainer from "../components/TableContainer";

export default function LocationsPage() {
  const [locations, setLocations] = useState<Array<any>>();
  const [currentLocation, setCurrentLocation] = useState<any>(null);
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
      title: "Short Code",
      dataIndex: "code",
      key: "code",
      width: "10%",
      render: (code: any) => (
        <div className="badge badge-primary rounded-md">{code}</div>
      ),
      sorter: (a: any, b: any) => a.code.localeCompare(b.code),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "50%",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Users Count",
      dataIndex: "users",
      key: "users",
      render: (_: any, record: any) => <span>{record._count.users}</span>,
      sorter: (a: any, b: any) => a._count.users - b._count.users,
    },
    {
      title: "Organizations Count",
      dataIndex: "organizations",
      key: "organizations",
      render: (_: any, record: any) => (
        <span>{record._count.organizations}</span>
      ),
      sorter: (a: any, b: any) =>
        a._count.organizations - b._count.organizations,
    },
    {
      title: "Projects Count",
      dataIndex: "projects",
      key: "projects",
      render: (_: any, record: any) => <span>{record._count.projects}</span>,
      sorter: (a: any, b: any) => a._count.projects - b._count.projects,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex flex-row gap-2">
          <div
            className="cursor-pointer"
            onClick={() => {
              setCurrentLocation(record);
              showModal("add_location_modal");
            }}
          >
            <MdEdit size={16} />
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              setCurrentLocation(record);
              handleDelete(record.id);
            }}
          >
            <MdDelete size={16} />
          </div>
        </div>
      ),
    },
  ];

  const showModal = (id: string) => {
    isClient && (document.getElementById(id) as HTMLDialogElement).showModal();
  };

  const closeModal = (id: string) => {
    isClient && (document.getElementById(id) as HTMLDialogElement).close();
  };

  const handleAdd = async (values: { name: string; code: string }) => {
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/locations`,
        {
          name: values.name,
          code: values.code.toUpperCase(),
        },
      );

      if (res.status === 201) {
        const id = addAlert({
          message: "Location added successfully",
          severity: "success",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
        fetchLocations();
      }
    } catch (error: any) {
      const id = addAlert({
        message: error?.response?.data?.message || "Failed to add location",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    } finally {
      closeModal("add_location_modal");
    }
  };

  const handleUpdate = async (
    values: { name: string; code: string },
    id: string,
  ) => {
    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/locations/${id}`,
        {
          name: values.name,
          code: values.code.toUpperCase(),
        },
      );

      if (res.status === 200) {
        const id = addAlert({
          message: "Location updated successfully",
          severity: "success",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
        fetchLocations();
      }
    } catch (error: any) {
      const id = addAlert({
        message: error?.response?.data?.message || "Failed to update location",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    } finally {
      closeModal("add_location_modal");
      setCurrentLocation(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/locations/${id}`,
      );

      if (res.status === 200) {
        const id = addAlert({
          message: "Location deleted successfully",
          severity: "success",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
        fetchLocations();
      }
    } catch (error: any) {
      const id = addAlert({
        message: error?.response?.data?.message || "Failed to delete location",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    } finally {
      closeModal("add_location_modal");
      setCurrentLocation(null);
    }
  };

  const fetchLocations = async () => {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/locations`,
    );

    if (res.status === 200) {
      setLocations(res.data);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <>
      <div className="space-y-3 overflow-x-auto">
        <div className="flex flex-row items-center justify-between">
          <div className="card-title">Locations</div>

          <button
            className="btn btn-primary"
            onClick={() => showModal("add_location_modal")}
          >
            Add location
          </button>
        </div>

        <TableContainer>
          <Table columns={columns} dataSource={locations} />
        </TableContainer>
      </div>

      {/* Add location dialog */}
      <dialog id="add_location_modal" className="modal">
        <div className="modal-box">
          <div className="card-title">Add location</div>
          <Formik
            initialValues={{
              name: currentLocation ? currentLocation.name : "",
              code: currentLocation ? currentLocation.code : "",
            }}
            validationSchema={Yup.object({
              name: Yup.string(),
              code: Yup.string(),
            })}
            onSubmit={async (values, { resetForm }) => {
              currentLocation
                ? handleUpdate(values, currentLocation.id)
                : handleAdd(values);

              resetForm();
            }}
          >
            <Form className="flex flex-col gap-4">
              <TextInput
                label="Short Code"
                props={{
                  name: "code",
                  type: "text",
                }}
              />

              <TextInput
                label="Name"
                props={{
                  name: "name",
                  type: "text",
                }}
              />

              <div className="space-x-2">
                <button
                  type="reset"
                  className="btn btn-outline"
                  onClick={() => closeModal("add_location_modal")}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentLocation ? "Update" : "Add"}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </dialog>
    </>
  );
}
