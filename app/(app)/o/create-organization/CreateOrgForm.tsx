"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import {
  contactEmailValidation,
  foundingDateValidation,
  locationValidation,
  missionTextValidation,
  orgNameValidation,
  phoneValidation,
  urlValidation,
} from "@/app/lib/forms/validationSchemas";
import { SelectInput, TextInput } from "@/components/formElements";
import TextAreaInput from "@/components/formElements/TextAreaInput";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

export default function CreateOrgForm({ locations }: { locations: any }) {
  const { getUser } = useAuthContext();
  const { addAlert, dismissAlert } = useAlertsContext();
  const [values, setValues] = useState<any>();
  const router = useRouter();

  const handleSubmit = async () => {
    const filteredValues: any = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => {
        return value !== null && value !== undefined && value !== "";
      }),
    );

    if (filteredValues.foundingDate) {
      filteredValues.foundingDate = new Date(
        filteredValues.foundingDate,
      ).toISOString();
    }

    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/organizations`,
        filteredValues,
      );

      if (res.status === 201) {
        await getUser();
        router.replace("/o/create-organization/success");
      }
    } catch (error: any) {
      const id = addAlert({
        severity: "error",
        message:
          error.response.data.message ||
          "Failed to create organization. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          mission: "",
          websiteUrl: "",
          contactPhone: "",
          contactEmail: "",
          locationId: "",
          foundingDate: "",
          consent: false,
        }}
        validationSchema={Yup.object({
          name: orgNameValidation,
          mission: missionTextValidation,
          webkitURL: urlValidation,
          contactPhone: phoneValidation,
          locationId: locationValidation,
          contactEmail: contactEmailValidation,
          foundingDate: foundingDateValidation,
          consent: Yup.boolean().oneOf(
            [true],
            "You must accept the terms and conditions",
          ),
        })}
        onSubmit={async (values) => {
          setValues(values);
          (
            document.getElementById(
              "confirm_creation_dialog",
            ) as HTMLDialogElement
          ).showModal();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <TextInput
              label="Organization Name"
              required
              props={{
                name: "name",
                type: "text",
              }}
            />

            <TextAreaInput
              label="Mission"
              props={{
                name: "mission",
                rows: 8,
                placeholder: "Enter mission statement here...",
              }}
            />

            <TextInput
              label="Website URL"
              props={{
                name: "websiteUrl",
                type: "text",
              }}
            />

            <SelectInput
              label="Location"
              required
              props={{
                name: "locationId",
              }}
            >
              <option>--Select your location--</option>
              {locations?.map((location: any) => {
                return (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                );
              })}
            </SelectInput>

            <div className="flex flex-row gap-4">
              <TextInput
                label="Contact Phone"
                required
                props={{
                  name: "contactPhone",
                  type: "text",
                }}
              />

              <TextInput
                label="Contact Email"
                props={{
                  name: "contactEmail",
                  type: "text",
                }}
              />
            </div>

            <div className="w-1/2 pr-3">
              <TextInput
                label="Founding Date"
                props={{
                  name: "foundingDate",
                  type: "date",
                }}
              />
            </div>

            <div className="mt-4 flex items-center gap-4">
              <TextInput
                label=""
                props={{
                  name: "consent",
                  type: "checkbox",
                }}
              />
              <p>
                I verify that I am an authorized representative of this
                organization and have the right to act on its behalf in the
                creation and management of this profile.
              </p>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="btn btn-primary"
            >
              Create
            </button>
          </Form>
        )}
      </Formik>

      {/* Confirm creation modal */}
      <dialog id="confirm_creation_dialog" className="modal">
        <div className="prose modal-box rounded-md lg:prose-lg">
          <h3>Confirm</h3>
          <p className="leading-tight">
            Please ensure that all provided information are correct. Your status
            is currently pending, you should submit your permit in the
            organization profile section.
          </p>

          <div className="modal-action">
            <form method="dialog">
              <div className="mt-5 flex flex-row justify-end gap-4">
                <div>
                  <button className="btn btn-outline">Keep Editing</button>
                </div>
                <div>
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    Accept and Continue
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
