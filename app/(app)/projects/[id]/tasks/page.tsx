"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import { useIsClient } from "@/app/lib/contexts/useIsClient";
import { SelectInput, TextInput } from "@/components/formElements";
import TextAreaInput from "@/components/formElements/TextAreaInput";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import TaskCard from "../components/TaskCard";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Array<any> | null>();
  const [participants, setParticipants] = useState<Array<any> | null>();
  const [progressData, setProgressData] = useState<any | null>();
  const [hideCompleted, setHideCompleted] = useState(true);
  const pathname = usePathname();
  const isClient = useIsClient();
  const { addAlert, dismissAlert } = useAlertsContext();
  const { user } = useAuthContext();
  const [isOwner, setIsOwner] = useState(false);

  const showModal = (id: string) => {
    isClient && (document.getElementById(id) as HTMLDialogElement).showModal();
  };

  const closeModal = (id: string) => {
    isClient && (document.getElementById(id) as HTMLDialogElement).close();
  };

  const fetchTasks = async (id: string) => {
    try {
      const res = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`,
      );

      if (res.status === 200) {
        setTasks(res.data);
      }
    } catch (error) {
      setTasks(null);
    }
  };

  const fetchProjectProgress = async (id: string) => {
    try {
      const res = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/stats/${id}/progress`,
      );

      if (res.status === 200) {
        setProgressData(res.data);
      }
    } catch (error) {
      setProgressData(null);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      values.deadline = new Date(values.deadline).toISOString();
      values.priority = parseInt(values.priority);

      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${pathname.split("/")[2]}`,
        values,
      );

      if (res.status === 201) {
        fetchTasks(pathname.split("/")[2]);
        fetchProjectProgress(pathname.split("/")[2]);
        const id = addAlert({
          message: "Task added successful",
          severity: "success",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
      }
    } catch (error: any) {
      const id = addAlert({
        message:
          error?.response?.data?.message ||
          "Failed to add task. Please try again.",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    } finally {
      closeModal("add_task_modal");
    }
  };

  const handleStatusChange = async (id: string) => {
    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`,
      );

      if (res.status === 200) {
        fetchTasks(pathname.split("/")[2]);
        fetchProjectProgress(pathname.split("/")[2]);
        const id = addAlert({
          message: "Task status changed successful",
          severity: "success",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
      }
    } catch (error: any) {
      const id = addAlert({
        message:
          error?.response?.data?.message ||
          "Failed to change task status. Please try again.",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`,
      );

      if (res.status === 200) {
        fetchTasks(pathname.split("/")[2]);
        fetchProjectProgress(pathname.split("/")[2]);
        const id = addAlert({
          message: "Task deleted successful",
          severity: "success",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
      }
    } catch (error: any) {
      const id = addAlert({
        message:
          error?.response?.data?.message ||
          "Failed to delete task. Please try again.",
        severity: "error",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  useEffect(() => {
    const fetchParticipants = async (id: string) => {
      try {
        const res = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/participants`,
        );

        if (res.status === 200) {
          setParticipants(res.data);
        }
      } catch (error) {
        setParticipants(null);
      }
    };

    const checkOwner = async (id: string) => {
      try {
        const res = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/check-owner`,
        );

        console.log(res.status);

        if (res.status === 200) {
          setIsOwner(res.data.isOwner);
        }
      } catch (error) {
        setIsOwner(false);
      }
    };

    if (pathname) {
      fetchTasks(pathname.split("/")[2]);
      fetchParticipants(pathname.split("/")[2]);
      fetchProjectProgress(pathname.split("/")[2]);
      checkOwner(pathname.split("/")[2]);
    }
  }, [pathname, user?.id]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-grow">
            <h3>{`Project Progress - ${(Math.round(progressData?.progress * 100) / 100).toFixed(2)}% (${progressData?.completedTasks}/${progressData?.openTasks + progressData?.completedTasks} tasks)`}</h3>
            <progress
              className={clsx(
                "progress w-full",
                progressData?.progress <= 25 && "progress-error",
                progressData?.progress <= 75 && "progress-warning",
                progressData?.progress <= 100 && "progress-success",
              )}
              value={progressData?.progress !== null && progressData?.progress}
              max="100"
            ></progress>
          </div>

          {isOwner && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => showModal("add_task_modal")}
            >
              Add Task
            </button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4>All tasks</h4>

            <div className="flex items-center gap-2">
              <span>Show completed</span>
              <input
                type="checkbox"
                className="checkbox checkbox-sm bg-base-100"
                onChange={() => setHideCompleted(!hideCompleted)}
              />
            </div>
          </div>

          <div className="space-y-3">
            {tasks && tasks.length > 0 ? (
              tasks.map((task, index) => {
                return (
                  <TaskCard
                    key={index}
                    task={task}
                    handleStatusChange={handleStatusChange}
                    handleDelete={handleDelete}
                    isOwner={isOwner}
                    hideCompleted={hideCompleted}
                  />
                );
              })
            ) : (
              <p className="text-center italic">No tasks found</p>
            )}
          </div>
        </div>
      </div>

      {/* Add task dialog */}
      <dialog id="add_task_modal" className="modal">
        <div className="prose modal-box rounded-md lg:prose-lg">
          <h3>Add task</h3>

          <Formik
            initialValues={{
              title: "",
              description: "",
              deadline: "",
              assignedToId: "",
              priority: 4,
            }}
            validationSchema={Yup.object({
              title: Yup.string()
                .required("Title is required")
                .min(5, "Title must be at least 5 characters long"),
              description: Yup.string()
                .optional()
                .max(100, "Description must not exceed 100 characters"),
              deadline: Yup.date()
                .required("Deadline is required")
                .min(new Date(), "Start date must be greater than today"),
              assignedToId: Yup.string().required("Assigned to id is required"),
              priority: Yup.number()
                .optional()
                .min(1, "Priority must be at least 1")
                .max(4, "Priority must be at most 4"),
            })}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values);
              resetForm();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <TextInput
                  label="Title"
                  required
                  props={{
                    name: "title",
                    type: "text",
                  }}
                />

                <TextAreaInput
                  label="Description"
                  props={{
                    name: "description",
                    rows: 5,
                    placeholder: "Enter task description",
                  }}
                />

                <div className="grid grid-cols-2 gap-6">
                  <TextInput
                    label="Deadline"
                    required
                    props={{
                      name: "deadline",
                      type: "date",
                    }}
                  />

                  <SelectInput
                    label="Priority"
                    props={{
                      name: "priority",
                    }}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </SelectInput>
                </div>

                {participants && participants.length > 0 ? (
                  <SelectInput
                    required
                    label="Assign To"
                    props={{
                      name: "assignedToId",
                    }}
                  >
                    <option value="">Unassigned</option>
                    {participants.map((participant, index) => {
                      return (
                        <option key={index} value={participant.user.id}>
                          {`${participant.user.firstName} ${participant.user.lastName}`}
                        </option>
                      );
                    })}
                  </SelectInput>
                ) : (
                  <span className="mb-2 italic">
                    There are no participants in this project. Review some
                    application to choose participants.
                  </span>
                )}

                <div className="flex w-full items-center justify-end gap-2">
                  <button
                    disabled={isSubmitting}
                    type="reset"
                    className="btn btn-outline"
                    onClick={() => closeModal("add_task_modal")}
                  >
                    Cancel
                  </button>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="btn btn-primary"
                  >
                    Add
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
