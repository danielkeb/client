"use client";

import { useState } from "react";
import SignUpFormContainer from "./SignUpFormContainer";
import VerifyEmail from "./VerifyEmail";

export default function SignUp() {
  const [email, setEmail] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  return (
    <>
      {/* email not sent */}
      {!emailSent ? (
        <SignUpFormContainer setEmail={setEmail} setEmailSent={setEmailSent} />
      ) : (
        <VerifyEmail email={email} />
      )}
    </>
  );
}
