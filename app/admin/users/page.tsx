"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import {
  emailValidation,
  firstNameValidation,
  lastNameValidation,
  passwordValidation,
  repeatPasswordValidation,
  usernameValidation,
} from "@/app/lib/forms/validationSchemas";
import { TextInput } from "@/components/formElements";
import UserAvatar from "@/components/global/UserAvatar";
import { Table } from "antd";
import { formatDate } from "date-fns";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import TableContainer from "../components/TableContainer";

export default function UsersPage() {
  const [users, setUsers] = useState<Array<any>>();
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
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <UserAvatar
            email={record.email}
            name={`${record.firstName} ${record.lastName}`}
            size="xs"
          />
          <span>{`${record.firstName} ${record.lastName}`}</span>
        </div>
      ),
      sorter: (a: any, b: any) =>
        a.firstName.localeCompare(b.firstName, { sensitivity: "accent" }),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a: any, b: any) =>
        a.username.localeCompare(b.username, { sensitivity: "accent" }),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Male", value: "MALE" },
        { text: "Female", value: "FEMALE" },
      ],
      onFilter: (value: any, record: any) => record.gender === value,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a: any, b: any) => a.age - b.age,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
      render: (bio: string) => (
        <>
          {bio ? (
            <div className="text-left">
              {bio.slice(0, 10)}
              {bio.length > 10 && (
                <span className="tooltip text-left" data-tip={bio}>
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
      title: "Organization",
      dataIndex: "organization",
      key: "organization",
      render: (_: any, record: any) => (
        <>
          {record.organizationId ? (
            <span className="text-left">{record.organization.name}</span>
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
      render: (_: any, record: any) => (
        <>
          {record.locationId ? (
            <span className="text-left">{record.location.name}</span>
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      title: "Last logged in",
      dataIndex: "lastLoggedInAt",
      key: "lastLoggedInAt",
      render: (lastLoggedInAt: any) => (
        <>
          {lastLoggedInAt && formatDate(lastLoggedInAt, "MMM dd, yyyy hh:mm a")}
        </>
      ),
      sorter: (a: any, b: any) =>
        a.lastLoggedInAt.localeCompare(b.lastLoggedInAt),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (_: any, record: any) => (
        <span className="text-left">{record.role.name}</span>
      ),
      filters: [
        {
          text: "Admin",
          value: "Admin",
        },
        {
          text: "Volunteer",
          value: "Volunteer",
        },
      ],
      onFilter: (value: any, record: any) => record.role.name === value,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createAt",
      render: (createdAt: any) => (
        <span>{formatDate(createdAt, "MMM dd, yyyy")}</span>
      ),
      sorter: (a: any, b: any) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: "Is Active?",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: any, record: any) => (
        <>
          {isActive ? (
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
          text: "Deactivated",
          value: false,
        },
      ],
      onFilter: (value: any, record: any) => record.isActive === value,
    },
  ];

  const handleUpdate = async (id: string, values: any) => {
    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        values,
      );

      if (res.status === 200) {
        const id = addAlert({
          message: "Updated successfully",
          severity: "success",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
        fetchUsers();
      }
    } catch (error: any) {
      const id = addAlert({
        message: error?.response?.data?.message || "Failed to update user",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  const handleAdd = async (values: any) => {
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register-admin`,
        values,
      );

      if (res.status === 201) {
        const id = addAlert({
          severity: "success",
          message: "Admin created successfully.",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
        fetchUsers();
        (
          document.getElementById("add_admin_modal") as HTMLDialogElement
        ).close();
      }
    } catch (error: any) {
      const id = addAlert({
        severity: "error",
        message:
          error?.response?.data?.message ||
          "Failed to create admin. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  const fetchUsers = async () => {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
    );

    if (res.status === 200) {
      setUsers(res.data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-row items-center justify-between">
          <div className="card-title">Users</div>

          <button
            className="btn btn-primary"
            onClick={() =>
              (
                document.getElementById("add_admin_modal") as HTMLDialogElement
              ).showModal()
            }
          >
            Add Admin
          </button>
        </div>

        <TableContainer>
          <Table columns={columns} dataSource={users} />
        </TableContainer>

        {/* <table className="table table-zebra">
s
              <th>Social Links</th>
              <th>Created at</th>
              <th>Is Active?</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              <>
                {users.map((user, index) => {
                  return (
                    <tr key={index}>

                      <td>
                        {user?.socialLinks?.map((link: any, index: number) => {
                          return (
                            link.url && (
                              <span key={index}>{`${link.url}, `}</span>
                            )
                          );
                        })}
                      </td>

                      <td></td>
                      <td>
                        {user.isActive ? (
                          <button
                            className="btn btn-error btn-xs"
                            onClick={() =>
                              handleUpdate(user.id, { isActive: false })
                            }
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className="btn btn-success btn-xs"
                            onClick={() =>
                              handleUpdate(user.id, { isActive: true })
                            }
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </>
            ) : (
              <tr className="text-center italic">
                <td colSpan={14}>There are no users data</td>
              </tr>
            )}
          </tbody>
        </table> */}
      </div>

      <dialog id="add_admin_modal" className="modal">
        <div className="modal-box">
          <h3 className="card-title mb-3">Add a new admin</h3>

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              username: "",
              password: "",
              repeatPassword: "",
            }}
            validationSchema={Yup.object({
              firstName: firstNameValidation,
              lastName: lastNameValidation,
              email: emailValidation,
              username: usernameValidation,
              password: passwordValidation,
              repeatPassword: repeatPasswordValidation,
            })}
            onSubmit={async (values) => {
              handleAdd(values);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-2">
                <div className="flex flex-grow gap-4 xl:flex-row">
                  <TextInput
                    label="First Name"
                    props={{
                      name: "firstName",
                      type: "text",
                      autoComplete: "off",
                    }}
                  />

                  <TextInput
                    label="Last Name"
                    props={{
                      name: "lastName",
                      type: "text",
                      autoComplete: "off",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-4 xl:flex-row">
                  <TextInput
                    label="Email"
                    props={{
                      name: "email",
                      type: "email",
                      autoComplete: "off",
                    }}
                  />

                  <TextInput
                    label="Username"
                    props={{
                      name: "username",
                      type: "text",
                      autoComplete: "off",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-4 xl:flex-row">
                  <TextInput
                    label="Password"
                    props={{
                      name: "password",
                      type: "password",
                    }}
                  />

                  <TextInput
                    label="Repeat Password"
                    props={{
                      name: "repeatPassword",
                      type: "password",
                    }}
                  />
                </div>

                <div className="flex flex-row gap-2">
                  <button
                    disabled={isSubmitting}
                    type="reset"
                    className="btn btn-outline flex-grow"
                    onClick={() =>
                      (
                        document.getElementById(
                          "add_admin_modal",
                        ) as HTMLDialogElement
                      ).close()
                    }
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="btn btn-primary flex-grow"
                  >
                    Submit
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </dialog>
    </>
  );
}
