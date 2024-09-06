"use client";

import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import { useIsClient } from "@/app/lib/contexts/useIsClient";
import {
  emailValidation,
  passwordValidation,
} from "@/app/lib/forms/validationSchemas";
import { TextInput } from "@/components/formElements";
import axios from "axios";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

export default function SignInForm() {
  const router = useRouter();

  const { setUser, setToken, setIsLoggedIn } = useAuthContext();
  const { addAlert, dismissAlert } = useAlertsContext();
  const isClient = useIsClient();

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={Yup.object({
        email: emailValidation,
        password: passwordValidation,
      })}
      onSubmit={async (values) => {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/signIn`,
            values,
          );

          const expiresIn = new Date(Date.now() + 48 * 60 * 60 * 1000); // Expires in 2 day
          if (isClient) {
            document.cookie = `token=${res.data.token}; expires=${expiresIn.toUTCString()}; Secure; path=/`;
          }
          setToken(res.data.token);
          setUser(res.data);
          setIsLoggedIn(true);

          if (res.data.role.name === "Admin") {
            router.replace("/admin/dashboard");
          } else {
            router.replace("/home?status=NOT_STARTED&time=BOTH&location=ALL");
          }
        } catch (error: any) {
          const id = addAlert({
            severity: "error",
            message:
              error?.response?.data?.message ||
              "Failed to sign in. Please try again.",
          });
          setTimeout(() => {
            dismissAlert(id);
          }, 3000);
        }
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

          <TextInput
            label="Password"
            props={{
              name: "password",
              type: "password",
            }}
          />
          <Link
            className="text-accent-200 self-end text-sm leading-tight underline"
            href="/forgot-password"
          >
            Forgot password?
          </Link>

          <button
            disabled={isSubmitting}
            type="submit"
            className="btn btn-primary"
          >
            Sign In
          </button>
        </Form>
      )}
    </Formik>
  );
}
