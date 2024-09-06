import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { emailValidation } from "@/app/lib/forms/validationSchemas";
import { TextInput } from "@/components/formElements";
import axios from "axios";
import { Form, Formik } from "formik";
import Link from "next/link";
import * as Yup from "yup";

export default function RequestPasswordResetForm({
  setEmailSent,
  setEmail,
}: {
  setEmailSent: (success: boolean) => void;
  setEmail: (email: string) => void;
}) {
  const { addAlert, dismissAlert } = useAlertsContext();

  const handleSubmit = async (values: any) => {
    setEmail(values.email);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgotPassword`,
        values,
      );

      if (res.status === 201) {
        setEmailSent(true);
      }
    } catch (error: any) {
      const id = addAlert({
        severity: "error",
        message:
          error?.response?.data?.message ||
          "Failed to send password reset code. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  return (
    <>
      <div className="mb-3 space-y-2">
        <h3 className="text-3xl font-medium leading-9">
          Forgot your password?
        </h3>
        <p className="font-normal leading-tight">
          Don’t worry. We will send you a password rest instruction. Just type
          in your email.
        </p>
      </div>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={Yup.object({
          email: emailValidation,
        })}
        onSubmit={async (values) => {
          handleSubmit(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <TextInput
              label="Email"
              props={{
                name: "email",
                type: "email",
                autoComplete: "off",
              }}
            />

            <button className="btn btn-primary" disabled={isSubmitting}>
              Send
            </button>
          </Form>
        )}
      </Formik>

      <Link className="self-center" href="/sign-in">
        <span>Did you remember you password? </span>
        <span className="text-base-content underline">Sign in.</span>
      </Link>
    </>
  );
}
