"use client";

import { useAuthContext } from "@/app/lib/contexts/AppContext";
import DetailsHeader from "../../components/DetailsHeader";
import UserEducationInfoCard from "../../components/UserEducationInfoCard";

export default function UserSkills() {
  const { user } = useAuthContext();

  return (
    <div>
      <DetailsHeader href="/v/me" text="Education" />

      <div className="card rounded-md">
        <div className="card-body">
          {user?.education?.length > 0 && (
            <UserEducationInfoCard educationInfo={user.education} />
          )}
        </div>
      </div>
    </div>
  );
}
