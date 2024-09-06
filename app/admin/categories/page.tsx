"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useIsClient } from "@/app/lib/contexts/useIsClient";
import { TextInput } from "@/components/formElements";
import TextAreaInput from "@/components/formElements/TextAreaInput";
import { Table } from "antd";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import TableContainer from "../components/TableContainer";

export default function SkillCategoriesPage() {
  const [categories, setCategories] = useState<Array<any>>();
  const [currentCategory, setCurrentCategory] = useState<any>(null);
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
      title: "Skills count",
      dataIndex: "skills",
      key: "skills",
      render: (_: any, record: any) => record._count.skills,
      sorter: (a: any, b: any) => a._count.skills - b._count.skills,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setCurrentCategory(record);
              showModal("add_category_modal");
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

  const handleAdd = async (values: { name: string; description: string }) => {
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/skill-categories`,
        values,
      );

      if (res.status === 201) {
        const id = addAlert({
          message: "Category added successfully",
          severity: "success",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
        fetchCategories();
      }
    } catch (error: any) {
      const id = addAlert({
        message: error?.response?.data?.message || "Failed to add category",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    } finally {
      closeModal("add_category_modal");
    }
  };

  const handleUpdate = async (
    values: { name: string; description: string },
    id: string,
  ) => {
    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/skill-categories/${id}`,
        values,
      );

      if (res.status === 200) {
        const id = addAlert({
          message: "Category updated successfully",
          severity: "success",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
        fetchCategories();
      }
    } catch (error: any) {
      const id = addAlert({
        message: error?.response?.data?.message || "Failed to update category",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    } finally {
      closeModal("add_category_modal");
      setCurrentCategory(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/skill-categories/${id}`,
      );

      if (res.status === 200) {
        const id = addAlert({
          message: "Category deleted successfully",
          severity: "success",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
        fetchCategories();
      }
    } catch (error: any) {
      const id = addAlert({
        message: error?.response?.data?.message || "Failed to delete category",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    } finally {
      closeModal("add_category_modal");
      setCurrentCategory(null);
    }
  };

  const fetchCategories = async () => {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/skill-categories`,
    );

    if (res.status === 200) {
      setCategories(res.data);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <div className="space-y-3 overflow-x-auto">
        <div className="flex flex-row items-center justify-between">
          <div className="card-title">Categories</div>

          <button
            className="btn btn-primary"
            onClick={() => showModal("add_category_modal")}
          >
            Add category
          </button>
        </div>

        <TableContainer>
          <Table columns={columns} dataSource={categories} />
        </TableContainer>
      </div>

      {/* Add category dialog */}
      <dialog id="add_category_modal" className="modal">
        <div className="modal-box">
          <div className="card-title">Add category</div>
          <Formik
            initialValues={{
              name: currentCategory ? currentCategory.name : "",
              description: currentCategory ? currentCategory.description : "",
            }}
            validationSchema={Yup.object({
              name: Yup.string(),
              description: Yup.string(),
            })}
            onSubmit={async (values, { resetForm }) => {
              currentCategory
                ? handleUpdate(values, currentCategory.id)
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

              <div className="space-x-2">
                <button
                  type="reset"
                  className="btn btn-outline"
                  onClick={() => closeModal("add_category_modal")}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentCategory ? "Update" : "Add"}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </dialog>
    </>
  );
}
