"use client";

import DetailsHeader from "@/app/(app)/v/components/DetailsHeader";
import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import {
  locationValidation,
  projectDescriptionValidation,
  projectEndDateValidation,
  projectStartDateValidation,
  projectTitleValidation,
} from "@/app/lib/forms/validationSchemas";
import { fetchLocations } from "@/app/lib/locations";
import "@/app/styles.css";
import { SelectInput, TextInput } from "@/components/formElements";
import TextAreaInput from "@/components/formElements/TextAreaInput";
import axios from "axios";
import { differenceInDays, format } from "date-fns";
import { Form, Formik } from "formik";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
import * as Yup from "yup";

// Project duration more than 90 days is considered long term
const SHORT_TERM_THRESHOLD = 90; // in days

export default function EditProjects() {
  const [locations, setLocations] = useState<any>();
  const [project, setProject] = useState<any>();
  const pathname = usePathname();
  const { addAlert, dismissAlert } = useAlertsContext();
  const [skills, setSkills] = useState<any>();

  const handleSubmit = async (values: any) => {
    // Calculate the duration in days and set the time commitment
    let timeCommitment;
    const difference = differenceInDays(values.endDate, values.startDate);
    timeCommitment =
      difference <= SHORT_TERM_THRESHOLD ? "SHORT_TERM" : "LONG_TERM";

    // Change date to ISO format
    values.startDate = new Date(values.startDate).toISOString();
    values.endDate = new Date(values.endDate).toISOString();

    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${project?.id}/edit`,
        {
          ...values,
          timeCommitment,
        },
      );

      if (res.status === 200) {
        const id = addAlert({
          severity: "success",
          message: "Project updated successfully",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
      }
    } catch (error: any) {
      const id = addAlert({
        severity: "error",
        message:
          error?.response?.data?.message ||
          "Failed to update project. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  const handleDelete = async (skillId: string) => {
    try {
      const res = await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${project?.id}/skills/${skillId}`,
      );

      if (res.status === 200) {
        const id = addAlert({
          severity: "success",
          message: "Skill deleted successfully",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
      }
    } catch (error: any) {
      const id = addAlert({
        severity: "error",
        message:
          error?.response?.data?.message ||
          "Failed to delete skill. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  // Fetch project
  useEffect(() => {
    const fetchProject = async (id: string) => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
        );

        if (res.status === 200) {
          setProject(res.data);
        }
      } catch (error) {
        const id = addAlert({
          severity: "error",
          message: "Failed to retrieve project. Please try again.",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
      }
    };

    fetchLocations().then((data) => {
      setLocations(data);
    });

    fetchProject(pathname.split("/")[2]);
  }, [addAlert, dismissAlert, pathname]);

  // Get skills at page load
  useEffect(() => {
    const getSkills = async () => {
      try {
        const res = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/skills`,
        );

        if (res.status === 200) {
          setSkills(res.data);
        }
      } catch (error) {}
    };

    getSkills();
  }, []);

  const handleAdd = async (values: any) => {
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${project?.id}/skills`,
        {
          ...values,
        },
      );

      if (res.status === 201) {
        (
          document.getElementById("add_skill_dialog") as HTMLDialogElement
        ).close();

        const id = addAlert({
          severity: "success",
          message: "Skill added successfully",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
      }
    } catch (error: any) {
      const id = addAlert({
        severity: "error",
        message:
          error?.response?.data?.message ||
          "Failed to add skill. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <DetailsHeader href={`/projects/${project?.id}`} text="Edit Project" />

        <div className="card rounded-md">
          <div className="card-body">
            {project && (
              <Formik
                initialValues={{
                  title: project?.title,
                  description: project?.description,
                  locationId: project?.locationId,
                  startDate: format(project?.startDate, "yyyy-MM-dd"),
                  endDate: format(project?.endDate, "yyyy-MM-dd"),
                  status: project?.status,
                }}
                validationSchema={Yup.object({
                  title: projectTitleValidation,
                  description: projectDescriptionValidation,
                  locationId: locationValidation,
                  startDate: projectStartDateValidation,
                  endDate: projectEndDateValidation,
                  status: Yup.string().required(),
                })}
                onSubmit={async (values) => {
                  handleSubmit(values);
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="flex flex-col gap-4">
                    <TextInput
                      label="Project title"
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
                        maxLength: 500,
                      }}
                    />

                    <div className="flex flex-row gap-3">
                      <TextInput
                        label="Start Date"
                        required
                        props={{
                          name: "startDate",
                          type: "date",
                        }}
                      />

                      <TextInput
                        label="End Date"
                        required
                        props={{
                          name: "endDate",
                          type: "date",
                        }}
                      />

                      <div>
                        <SelectInput
                          label="Project status"
                          props={{
                            name: "status",
                          }}
                        >
                          <option>--Change status--</option>
                          <option value="NOT_STARTED">Not Started</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="DONE">Done</option>
                        </SelectInput>
                      </div>
                    </div>

                    <div className="w-1/2">
                      <SelectInput
                        label="Location"
                        props={{
                          name: "locationId",
                        }}
                      >
                        <option>--Select your location--</option>
                        {locations.map((location: any) => {
                          return (
                            <option key={location.id} value={location.id}>
                              {location.name}
                            </option>
                          );
                        })}
                      </SelectInput>
                    </div>

                    <div className="space-x-2">
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                      <button
                        disabled={isSubmitting}
                        type="reset"
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>

        <div className="card rounded-md">
          <div className="card-body">
            <div className="card-title">Required Skills</div>

            {project && project.skillsRequired?.length > 0 && (
              <>
                {project.skillsRequired?.map((skill: any, index: number) => {
                  return (
                    <div key={index} className="flex flex-row justify-between">
                      <div className="flex flex-row items-center gap-2">
                        <p className="badge badge-primary badge-lg flex-grow-0">
                          {skill.vacancies}
                        </p>
                        <p className="line-clamp-1 text-lg">
                          {skill.skill.name}
                        </p>
                      </div>

                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          handleDelete(skill.skillId);
                        }}
                      >
                        <BiX />
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            <button
              className="btn btn-primary mt-4 w-fit"
              onClick={() => {
                (
                  document.getElementById(
                    "add_skill_dialog",
                  ) as HTMLDialogElement
                ).showModal();
              }}
            >
              Add Skill
            </button>
          </div>
        </div>
      </div>

      {/* Add skill modal */}
      <dialog id="add_skill_dialog" className="modal">
        <div className="prose modal-box rounded-md lg:prose-lg">
          <h3>Add Skill</h3>

          <Formik
            initialValues={{
              skillId: "",
              vacancies: "",
            }}
            validationSchema={Yup.object({
              skillId: Yup.string().required(),
              vacancies: Yup.number()
                .required()
                .min(1, "Number of open positions must be at least 1"),
            })}
            onSubmit={async (values) => {
              handleAdd(values);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4">
                <SelectInput
                  label="Skill"
                  props={{
                    name: "skillId",
                  }}
                >
                  <option>--Select skill--</option>
                  {skills &&
                    skills.length > 0 &&
                    skills.map((skill: any, index: number) => (
                      <option key={index} value={skill.id}>
                        {skill.name}
                      </option>
                    ))}
                </SelectInput>

                <div className="w-1/4">
                  <TextInput
                    label="Vacancies"
                    props={{
                      name: "vacancies",
                      type: "number",
                    }}
                  />
                </div>

                <div className="space-x-2">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                  <button
                    disabled={isSubmitting}
                    type="reset"
                    className="btn btn-outline"
                    onClick={() => {
                      (
                        document.getElementById(
                          "add_skill_dialog",
                        ) as HTMLDialogElement
                      ).close();
                    }}
                  >
                    Cancel
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
