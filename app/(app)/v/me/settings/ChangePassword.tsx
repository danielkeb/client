"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import {
  passwordValidation,
  repeatPasswordValidation,
} from "@/app/lib/forms/validationSchemas";
import { TextInput } from "@/components/formElements";
import { Form, Formik } from "formik";
import * as Yup from "yup";

export default function ChangePassword() {
  const { addAlert, dismissAlert } = useAlertsContext();

  const handleSubmit = async (values: any) => {
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/updatePassword`,
        {
          password: values.password,
          currentPassword: values.currentPassword,
        },
      );

      if (res.status === 201) {
        const id = addAlert({
          severity: "success",
          message: "Password changed successfully",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
      }
    } catch (error) {
      const id = addAlert({
        severity: "error",
        message: "Failed to change password",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  return (
    <div className="space-y-1">
      <p>Change Password</p>
      <div className="setting-item card rounded-md">
        <div className="card-body flex w-full flex-row items-center justify-between">
          <Formik
            initialValues={{
              currentPassword: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={Yup.object({
              currentPassword: passwordValidation,
              password: passwordValidation,
              confirmPassword: repeatPasswordValidation,
            })}
            onSubmit={async (values) => {
              handleSubmit(values);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex w-1/2 flex-col">
                <TextInput
                  label="Current Password"
                  props={{
                    name: "currentPassword",
                    type: "password",
                  }}
                />

                <TextInput
                  label="New Password"
                  props={{
                    name: "password",
                    type: "password",
                  }}
                />

                <TextInput
                  label="Confirm Password"
                  props={{
                    name: "confirmPassword",
                    type: "password",
                  }}
                />

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="btn btn-primary"
                >
                  Update
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
