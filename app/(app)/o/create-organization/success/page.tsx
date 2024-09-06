"use client";

import { useAuthContext } from "@/app/lib/contexts/AppContext";
import DoneImage from "@/public/img/done-image.svg";
import Image from "next/image";
import Link from "next/link";

export default function SuccessfullyCreated() {
  const { org } = useAuthContext();

  return (
    <div className="flex flex-col items-center justify-center gap-24">
      <div className="SuccessMessage flex flex-col items-center justify-start gap-16">
        <Image
          src={DoneImage}
          alt="An image with check mark"
          style={{ width: "50%" }}
        />
        <div className="prose text-pretty text-center lg:prose-lg">
          <h2 className="">
            You have successful created an organization profile.
          </h2>
          <p className="">
            Your organization profile is now ready for viewing and management.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-start gap-6">
        {org && (
          <Link href="/o/my-org">
            <button className="btn btn-primary">
              Switch to Organization Profile
            </button>
          </Link>
        )}
        <Link href="/home?status=NOT_STARTED&time=BOTH&location=ALL">
          <button className="btn">Stay on Personal Profile</button>
        </Link>
      </div>
    </div>
  );
}
