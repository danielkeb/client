import { fetchLocations } from "@/app/lib/locations";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

export default async function SignUpFormContainer({
  setEmail,
  setEmailSent,
}: {
  setEmail: (email: string) => void;
  setEmailSent: (success: boolean) => void;
}) {
  const locations = await fetchLocations();

  return (
    <>
      <div className="mb-3 space-y-2">
        <h3 className="text-3xl font-medium leading-9">Create an account</h3>
        <p className="font-normal leading-tight">
          By creating an account you agree to our{" "}
          <span className="text-base-content underline">
            <Link href="/tos">terms of service </Link>
          </span>
          and{" "}
          <span className="text-base-content underline">
            <Link href="/privacy">privacy policy</Link>
          </span>
          .
        </p>
      </div>

      <SignUpForm
        locations={locations}
        setEmail={setEmail}
        setEmailSent={setEmailSent}
      />

      <Link className="self-center" href="/sign-in">
        <span>Already have an account? </span>
        <span className="text-base-content underline">Sign in.</span>
      </Link>
    </>
  );
}
