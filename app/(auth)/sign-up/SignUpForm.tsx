"use client";

import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { SelectInput, TextInput } from "@/components/formElements";
import axios from "axios";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import {
  emailValidation,
  firstNameValidation,
  lastNameValidation,
  locationValidation,
  passwordValidation,
  repeatPasswordValidation,
  usernameValidation,
} from "../../lib/forms/validationSchemas";

export default function SignUpForm({
  locations,
  setEmail,
  setEmailSent,
}: {
  locations: { id: string; name: string }[];
  setEmail: (email: string) => void;
  setEmailSent: (success: boolean) => void;
}) {
  const { addAlert, dismissAlert } = useAlertsContext();

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        locationId: "",
        password: "",
        repeatPassword: "",
      }}
      validationSchema={Yup.object({
        firstName: firstNameValidation,
        lastName: lastNameValidation,
        email: emailValidation,
        username: usernameValidation,
        locationId: locationValidation,
        password: passwordValidation,
        repeatPassword: repeatPasswordValidation,
      })}
      onSubmit={async (values) => {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
            values,
          );

          if (res.status === 201) {
            setEmail(values.email);
            setEmailSent(true);
          }
        } catch (error: any) {
          const id = addAlert({
            severity: "error",
            message:
              error?.response?.data?.message ||
              "Failed to sign up. Please try again.",
          });
          setTimeout(() => {
            dismissAlert(id);
          }, 3000);
        }
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
              props={{ name: "lastName", type: "text", autoComplete: "off" }}
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

          {/* <SelectInput
  label="Location"
  props={{
    name: "locationId",
    disabled: !locations || locations.length === 0, // Disable if locations is null, undefined, or empty
  }}
>
  <option value="">--Select your location--</option>
  {locations?.length > 0 ? (
    locations.map((location) => (
      <option key={location.id} value={location.id}>
        {location.name}
      </option>
    ))
  ) : (
    <option disabled>No locations available</option>
  )}
</SelectInput> */}


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

          <button
            disabled={isSubmitting}
            type="submit"
            className="btn btn-primary"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}
