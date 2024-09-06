"use client";

import { useAuthContext } from "@/app/lib/contexts/AppContext";
import DetailsHeader from "../../components/DetailsHeader";
import UserSkillsCard from "../../components/UserSkillsCard";

export default function UserSkills() {
  const { user } = useAuthContext();

  return (
    <div>
      <DetailsHeader href="/v/me" text="Skills" />

      <div className="card rounded-md">
        <div className="card-body">
          {user?.skills?.length > 0 && <UserSkillsCard skills={user.skills} />}
        </div>
      </div>
    </div>
  );
}
