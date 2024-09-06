"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import { useIsClient } from "@/app/lib/contexts/useIsClient";
import {
  descriptionValidation,
  endDateValidation,
  fieldNameValidation,
  instituteValidation,
  startDateValidation,
} from "@/app/lib/forms/validationSchemas";
import { TextInput } from "@/components/formElements";
import TextAreaInput from "@/components/formElements/TextAreaInput";
import { format } from "date-fns";
import { Form, Formik } from "formik";
import { useState } from "react";
import { BiPlus, BiSolidPencil, BiSolidTrashAlt } from "react-icons/bi";
import * as Yup from "yup";

export default function EditEducationInfo() {
  const { user, getUser } = useAuthContext();
  const { addAlert, dismissAlert } = useAlertsContext();
  const [currentEditing, setCurrentEditing] = useState<any>();
  const [currentDeleting, setCurrentDeleting] = useState<any>();
  const isClient = useIsClient();

  const formatDate = (date: string) => {
    return format(date, "yyy-MM-dd");
  };

  const showModal = (id: string) => {
    isClient && (document.getElementById(id) as HTMLDialogElement).showModal();
  };

  const closeModal = (id: string) => {
    isClient && (document.getElementById(id) as HTMLDialogElement).close();
  };

  const handleSave = async (values: any) => {
    if (values.stillStudying || values.endDate === "") {
      values.endDate = null;
    } else {
      values.endDate = new Date(values.endDate).toISOString();
    }
    values.startDate = new Date(values.startDate).toISOString();

    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/update`,
        {
          education: [values],
        },
      );

      if (res.status === 200) {
        getUser();
      }
    } catch (error) {
      const id = addAlert({
        severity: "error",
        message: "Failed to add education info. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    } finally {
      closeModal("add_education_info_modal");
    }
  };

  const handleUpdate = async (values: any) => {
    if (values.stillStudying || values.endDate === "") {
      values.endDate = null;
    } else {
      values.endDate = new Date(values.endDate).toISOString();
    }
    format(values.startDate, "yyyy-MM-dd:hh:mm:ss");
    values.startDate = new Date(values.startDate).toISOString();

    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/education/update/${currentEditing.id}`,
        values,
      );

      if (res.status === 200) {
        getUser();
      }
    } catch (error) {
      const id = addAlert({
        severity: "error",
        message: "Failed to update education info. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    } finally {
      closeModal("edit_education_info_modal");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/education/remove/${currentDeleting.id}`,
      );

      if (res.status === 200) {
        getUser();
      }
    } catch (error) {
      const id = addAlert({
        severity: "error",
        message: "Failed to delete education info. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  return (
    <div className="space-y-1">
      <p>Education Information</p>

      {/* Display existing education info */}
      <div className="card rounded-md">
        <div className="card-body">
          {user?.education?.length > 0 ? (
            user.education.map((item: any, index: number) => (
              <div key={index} className="flex flex-row items-center gap-8">
                <div className="flex-grow space-y-1 py-2">
                  <div>
                    <span className="block text-xl">{item.field}</span>
                    <div>
                      <span className="text-lg">{item.institute}</span>
                      <span className="px-3">
                        {`${format(item.startDate, "MMMM yyyy")}`}
                        {" - "}
                        {item.endDate
                          ? `${format(item.endDate, "MMMM yyyy")}`
                          : "present"}
                      </span>
                    </div>
                  </div>
                  <p className="line-clamp-1 font-light">{item.description}</p>
                </div>

                <div className="flex flex-row gap-4">
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setCurrentEditing(item);
                      showModal("edit_education_info_modal");
                    }}
                  >
                    <BiSolidPencil size={20} />
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setCurrentDeleting(item);
                      showModal("delete_education_info_modal");
                    }}
                  >
                    <BiSolidTrashAlt size={20} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No education info added</div>
          )}

          {/* Add education info button */}
          <div
            className="w-full pt-10"
            onClick={() => showModal("add_education_info_modal")}
          >
            <button className="btn btn-primary mt-4 w-full">
              <BiPlus size={24} />
              Add Education Info
            </button>
          </div>
        </div>
      </div>

      {/* Add education info modal */}
      <dialog id="add_education_info_modal" className="modal">
        <div className="prose modal-box rounded-md lg:prose-lg">
          <h3>Add Education Info</h3>

          <Formik
            initialValues={{
              field: "",
              institute: "",
              startDate: "",
              endDate: "",
              stillStudying: false,
              description: "",
            }}
            validationSchema={Yup.object({
              field: fieldNameValidation,
              institute: instituteValidation,
              startDate: startDateValidation,
              endDate: endDateValidation,
              stillStudying: Yup.boolean(),
              description: descriptionValidation,
            })}
            onSubmit={(values) => {
              handleSave(values);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <TextInput
                  label="Field"
                  props={{
                    name: "field",
                    id: "field",
                    type: "text",
                    placeholder: "What field did you study?",
                  }}
                />

                <TextInput
                  label="School/Institute name"
                  props={{
                    name: "institute",
                    id: "institute",
                    type: "text",
                    placeholder: "Where did you study?",
                  }}
                />

                <div className="flex flex-row gap-4">
                  <TextInput
                    label="Start Date"
                    props={{
                      name: "startDate",
                      id: "startDate",
                      type: "date",
                    }}
                  />

                  <div className="flex w-1/2 flex-col">
                    <TextInput
                      label="End Date"
                      props={{
                        name: "endDate",
                        id: "endDate",
                        type: "date",
                      }}
                    />

                    <TextInput
                      label="Still studying?"
                      props={{
                        name: "stillStudying",
                        type: "checkbox",
                      }}
                    />
                  </div>
                </div>

                <TextAreaInput
                  label="Description"
                  props={{
                    name: "description",
                    id: "description",
                    rows: 5,
                    maxLength: 500,
                    placeholder: "Tell us a little about your education",
                  }}
                />

                <div className="modal-action mt-5 flex flex-row justify-end gap-4">
                  <div onClick={() => closeModal("add_education_info_modal")}>
                    <button
                      disabled={isSubmitting}
                      type="reset"
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                  <div>
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="btn btn-success"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </dialog>

      {/* Edit education info modal */}
      <dialog id="edit_education_info_modal" className="modal">
        <div className="prose modal-box rounded-md lg:prose-lg">
          <h3>Edit Education Info</h3>

          {currentEditing && (
            <Formik
              initialValues={{
                field: currentEditing?.field,
                institute: currentEditing?.institute,
                startDate: formatDate(currentEditing?.startDate),
                endDate: formatDate(currentEditing?.endDate),
                stillStudying: false,
                description: currentEditing?.description,
              }}
              validationSchema={Yup.object({
                field: fieldNameValidation,
                institute: instituteValidation,
                startDate: startDateValidation,
                endDate: endDateValidation,
                stillStudying: Yup.boolean(),
                description: descriptionValidation,
              })}
              onSubmit={(values) => {
                handleUpdate(values);
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <TextInput
                    label="Field"
                    props={{
                      name: "field",
                      id: "field",
                      type: "text",
                      placeholder: "What field did you study?",
                    }}
                  />

                  <TextInput
                    label="School/Institute name"
                    props={{
                      name: "institute",
                      id: "institute",
                      type: "text",
                      placeholder: "Where did you study?",
                    }}
                  />

                  <div className="flex flex-row gap-4">
                    <TextInput
                      label="Start Date"
                      props={{
                        name: "startDate",
                        id: "startDate",
                        type: "date",
                      }}
                    />

                    <div className="flex w-1/2 flex-col">
                      <TextInput
                        label="End Date"
                        props={{
                          name: "endDate",
                          id: "endDate",
                          type: "date",
                        }}
                      />

                      <TextInput
                        label="Still studying?"
                        props={{
                          name: "stillStudying",
                          type: "checkbox",
                        }}
                      />
                    </div>
                  </div>

                  <TextAreaInput
                    label="Description"
                    props={{
                      name: "description",
                      id: "description",
                      rows: 5,
                      maxLength: 500,
                      placeholder: "Tell us a little about your education",
                    }}
                  />

                  <div className="modal-action mt-5 flex flex-row justify-end gap-4">
                    <div
                      onClick={() => {
                        setCurrentEditing(null);
                        closeModal("edit_education_info_modal");
                      }}
                    >
                      <button
                        disabled={isSubmitting}
                        type="reset"
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                    <div>
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="btn btn-success"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </dialog>

      {/* Delete education info dialog */}
      <dialog id="delete_education_info_modal" className="modal">
        {currentDeleting && (
          <div className="prose modal-box rounded-md lg:prose-lg">
            <h3>Delete Education Info</h3>
            <p className="text-text-200">
              Are you sure you want to delete this education info from your
              account.
            </p>

            <div>
              <p>
                <span className="font-medium">{`${currentDeleting.field}`}</span>{" "}
                from{" "}
                <span className="font-medium">{`${currentDeleting.institute}`}</span>
              </p>
            </div>

            <p>This action is not reversible.</p>

            <div className="modal-action">
              <form method="dialog">
                <div className="mt-5 flex flex-row justify-end gap-4">
                  <div>
                    <button className="btn btn-outline">Cancel</button>
                  </div>
                  <div onClick={handleDelete}>
                    <button className="btn btn-error">Delete</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
