"use client";

import { redirect } from "next/navigation";
import { useAuthContext } from "./lib/contexts/AppContext";

export default function AuthChecker({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = useAuthContext();

  return (
    <>
      {isLoggedIn
        ? redirect("/home?status=NOT_STARTED&time=BOTH&location=ALL")
        : children}
    </>
  );
}
