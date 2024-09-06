"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useIsClient } from "@/app/lib/contexts/useIsClient";
import { SelectInput, TextInput } from "@/components/formElements";
import TextAreaInput from "@/components/formElements/TextAreaInput";
import { Table } from "antd";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import TableContainer from "../components/TableContainer";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Array<any>>();
  const [categories, setCategories] = useState<Array<any>>();
  const [currentSkill, setCurrentSkill] = useState<any>(null);
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
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_: any, record: any) => record.category.name,
      sorter: (a: any, b: any) =>
        a.category.name.localeCompare(b.category.name),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string) => (
        <div className="text-left">
          {description.slice(0, 100)}
          {description.length > 100 && (
            <span className="tooltip text-left" data-tip={description}>
              ...
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Users count",
      dataIndex: "usersCount",
      key: "usersCount",
      render: (_: any, record: any) => record._count.users,
      sorter: (a: any, b: any) => a._count.users - b._count.users,
    },
    {
      title: "Projects count",
      dataIndex: "projectsCount",
      key: "projectsCount",
      render: (_: any, record: any) => record._count.projects,
      sorter: (a: any, b: any) => a._count.projects - b._count.projects,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setCurrentSkill(record);
              showModal("add_skill_modal");
            }}
            className="btn btn-primary btn-sm"
          >
            Edit
          </button>
          <button
            onClick={() => {
              handleDelete(record.id);
            }}
            className="btn btn-error btn-sm"
          >
            Delete
          </button>
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

  const handleAdd = async (values: {
    name: string;
    description: string;
    categoryId: string;
  }) => {
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/skills`,
        values,
      );

      if (res.status === 201) {
        const id = addAlert({
          message: "Skill added successfully",
          severity: "success",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
        fetchSkills();
      }
    } catch (error: any) {
      const id = addAlert({
        message: error?.response?.data?.message || "Failed to add skill",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    } finally {
      closeModal("add_skill_modal");
    }
  };

  const handleUpdate = async (
    values: { name: string; description: string; categoryId: string },
    id: string,
  ) => {
    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/skills/${id}`,
        values,
      );

      if (res.status === 200) {
        const id = addAlert({
          message: "Skill updated successfully",
          severity: "success",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
        fetchSkills();
      }
    } catch (error: any) {
      const id = addAlert({
        message: error?.response?.data?.message || "Failed to update skill",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    } finally {
      closeModal("add_skill_modal");
      setCurrentSkill(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/skills/${id}`,
      );

      if (res.status === 200) {
        const id = addAlert({
          message: "Skill deleted successfully",
          severity: "success",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
        fetchSkills();
      }
    } catch (error: any) {
      const id = addAlert({
        message: error?.response?.data?.message || "Failed to delete skill",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    } finally {
      closeModal("add_skill_modal");
      setCurrentSkill(null);
    }
  };

  const fetchSkills = async () => {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/skills`,
    );

    if (res.status === 200) {
      setSkills(res.data);
    }
  };

  const fetchSkillCategories = async () => {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/skill-categories`,
    );

    if (res.status === 200) {
      setCategories(res.data);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchSkillCategories();
  }, []);

  return (
    <>
      <div className="space-y-3 overflow-x-auto">
        <div className="flex flex-row items-center justify-between">
          <div className="card-title">Skills</div>

          <button
            className="btn btn-primary"
            onClick={() => showModal("add_skill_modal")}
          >
            Add Skill
          </button>
        </div>

        <TableContainer>
          <Table columns={columns} dataSource={skills} />
        </TableContainer>
      </div>

      {/* Add skill dialog */}
      <dialog id="add_skill_modal" className="modal">
        <div className="modal-box">
          <div className="card-title">Add skill</div>
          <Formik
            initialValues={{
              name: currentSkill ? currentSkill.name : "",
              description: currentSkill ? currentSkill.description : "",
              categoryId: currentSkill ? currentSkill.categoryId : "",
            }}
            validationSchema={Yup.object({
              name: Yup.string(),
              description: Yup.string(),
              categoryId: Yup.string(),
            })}
            onSubmit={async (values, { resetForm }) => {
              currentSkill
                ? handleUpdate(values, currentSkill.id)
                : handleAdd(values);

              resetForm();
            }}
          >
            <Form className="flex flex-col gap-4">
              <TextInput
                label="Name"
                props={{
                  name: "name",
                  type: "text",
                }}
              />

              <TextAreaInput
                label="Description"
                props={{
                  name: "description",
                  rows: 5,
                }}
              />

              <SelectInput
                label="Category"
                props={{
                  name: "categoryId",
                }}
              >
                <option value="">--Select category--</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </SelectInput>

              <div className="space-x-2">
                <button
                  type="reset"
                  className="btn btn-outline"
                  onClick={() => closeModal("add_skill_modal")}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentSkill ? "Update" : "Add"}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </dialog>
    </>
  );
}
