"use client";

import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import { useIsClient } from "@/app/lib/contexts/useIsClient";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, KeyboardEvent, useEffect, useRef } from "react";

export default function VerifyEmail({ email }: { email: string | null }) {
  const { setUser, setIsLoggedIn, setToken } = useAuthContext();
  const { addAlert, dismissAlert } = useAlertsContext();
  const inputs = useRef<HTMLInputElement[]>([]);
  const isClient = useIsClient();

  const router = useRouter();

  useEffect(() => {
    inputs.current[0].focus(); // Focus on the first input initially
  }, []);

  const handleInputChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const input = e && e.target;
    const value = input.value;

    // If the input is filled and not the last one
    if (value.length === input.maxLength && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus(); // Move focus to the next input
    }
  };

  const handleBackspace = (index: number, e: KeyboardEvent) => {
    const input = e && (e.target as HTMLInputElement);
    const value = input.value;

    // If the input is empty and not the first one
    if (value.length === 0 && index > 0) {
      inputs.current[index - 1].focus(); // Move focus to the previous input
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let code = "";
    inputs.current.forEach((input) => {
      code += input.value;
    });

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verifyEmail`,
        {
          code: code,
          email: email,
        },
      );

      if (res.status === 201) {
        // Set the token inside the cookie
        const expiresIn = new Date(Date.now() + 48 * 60 * 60 * 1000); // Expires in 2 day
        if (isClient) {
          document.cookie = `token=${res.data.token}; expires=${expiresIn.toUTCString()}; Secure; path=/`;
        }
        // Set user and token
        setToken(res.data.token);
        setUser(res.data);
        setIsLoggedIn(true);

        router.replace("/");
      }
    } catch (error: any) {
      const id = addAlert({
        severity: "error",
        message:
          error?.response?.data?.message ||
          "Failed to verify email. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  return (
    <>
      <div className="mb-3 space-y-2">
        <h3 className="text-3xl font-medium leading-9">Check your inbox.</h3>
        <p className="font-normal leading-tight">
          Enter the six digit email verification code sent to {email}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-4 [&>input]:w-[calc(100%/6)] [&>input]:text-center [&>input]:text-xl">
          {Array.from({ length: 6 }, (_, index) => (
            <input
              className="bg-base-100 text-base-content focus:border-primary focus:ring-primary"
              key={index}
              ref={(ref) => (inputs.current[index] = ref as HTMLInputElement)}
              type="text"
              maxLength={1}
              onChange={(e) => handleInputChange(index, e)}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  handleBackspace(index, e as KeyboardEvent<HTMLInputElement>);
                }
              }}
            />
          ))}
        </div>

        <button className="btn btn-primary">Verify</button>
      </form>
    </>
  );
}
