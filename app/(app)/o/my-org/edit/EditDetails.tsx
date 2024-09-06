"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import {
  foundingDateValidation,
  missionTextValidation,
  orgNameValidation,
} from "@/app/lib/forms/validationSchemas";
import { TextInput } from "@/components/formElements";
import TextAreaInput from "@/components/formElements/TextAreaInput";
import { format } from "date-fns";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

type Texts = {
  [key: string]: any;
};

export default function EditDetails() {
  const { org, getUser } = useAuthContext();
  const [isOrgLoaded, setIsOrgLoaded] = useState(false);
  const [initialValues, setInitialValues] = useState<Texts>({});
  const { addAlert, dismissAlert } = useAlertsContext();

  const handleSubmit = async (updates: any) => {
    updates.foundingDate = new Date(updates.foundingDate).toISOString();
    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/organizations/${org.id}`,
        updates,
      );

      if (res.status === 200) {
        getUser();
        const id = addAlert({
          severity: "success",
          message: "Organization details updated successfully",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
      }
    } catch (error: any) {
      const id = addAlert({
        severity: "error",
        message:
          error.response.data.message ||
          "Failed to update organization. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  useEffect(() => {
    if (Object.keys(org).length > 0) {
      setIsOrgLoaded(true);
      setInitialValues({
        name: org.name,
        mission: org.mission,
        aboutUs: org.aboutUs,
        foundingDate: org.foundingDate
          ? format(org.foundingDate, "yyy-MM-dd")
          : "",
      });
    }
  }, [org]);

  return (
    <div className="card rounded-md">
      <div className="card-body">
        <div className="card-title">Organization Details</div>
        {isOrgLoaded && (
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
              name: orgNameValidation,
              mission: missionTextValidation,
              aboutUs: missionTextValidation,
              foundingDate: foundingDateValidation,
            })}
            onSubmit={async (values) => {
              handleSubmit(values);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-2">
                <TextInput
                  label="Name"
                  props={{
                    name: "name",
                    type: "text",
                    autoComplete: "off",
                  }}
                />

                <TextAreaInput
                  label="Mission"
                  props={{
                    name: "mission",
                    rows: 3,
                  }}
                />

                <TextAreaInput
                  label="About Us"
                  props={{
                    name: "aboutUs",
                    rows: 3,
                  }}
                />

                <div className="w-1/3">
                  <TextInput
                    label="Founding Date"
                    props={{
                      name: "foundingDate",
                      id: "foundingDate",
                      type: "date",
                    }}
                  />
                </div>

                <div className="space-x-2">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                  <button
                    disabled={isSubmitting}
                    className="btn btn-outline btn-error"
                    type="reset"
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
  );
}
