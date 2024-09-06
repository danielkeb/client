"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import {
  contactEmailValidation,
  locationValidation,
  phoneValidation,
  urlValidation,
} from "@/app/lib/forms/validationSchemas";
import { SelectInput, TextInput } from "@/components/formElements";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

type Texts = {
  [key: string]: any;
};

export default function EditContactInfo({ locations }: any) {
  const { org, getUser } = useAuthContext();
  const [isOrgLoaded, setIsOrgLoaded] = useState(false);
  const [initialValues, setInitialValues] = useState<Texts>({});
  const { addAlert, dismissAlert } = useAlertsContext();

  const handleSubmit = async (updates: any) => {
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
    if (org && Object.keys(org).length > 0) {
      setIsOrgLoaded(true);
      setInitialValues({
        websiteUrl: org.websiteUrl,
        contactEmail: org.contactEmail,
        contactPhone: org.contactPhone,
        locationId: org.locationId,
      });
    }
  }, [org]);

  return (
    <div className="card rounded-md">
      <div className="card-body">
        <div className="card-title">Contact Information</div>
        {isOrgLoaded && (
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
              websiteUrl: urlValidation,
              contactEmail: contactEmailValidation,
              contactPhone: phoneValidation,
              locationId: locationValidation,
            })}
            onSubmit={async (values) => {
              handleSubmit(values);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-2">
                <div className="flex gap-4">
                  <TextInput
                    label="Contact Phone"
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

                <div className="flex gap-4">
                  <div className="flex-grow">
                    <TextInput
                      label="Website URL"
                      props={{
                        name: "websiteUrl",
                        type: "text",
                      }}
                    />
                  </div>

                  <div className="flex-grow">
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
