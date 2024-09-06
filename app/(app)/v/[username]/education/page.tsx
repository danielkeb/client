"use client";

import { fetchUser } from "@/app/lib/users";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import DetailsHeader from "../../components/DetailsHeader";
import UserEducationInfoCard from "../../components/UserEducationInfoCard";

export default function UserSkills() {
  const pathname = usePathname();
  const username = pathname.split("/")[2];
  const [user, setUser] = useState<any>();

  useEffect(() => {
    async function getUserData() {
      const res = await fetchUser(username);

      if (res) {
        setUser(res);
      }
    }

    getUserData();
  }, [username]);

  return (
    <div>
      <DetailsHeader href={`/v/${user && user.username}`} text="Education" />

      <div className="card">
        <div className="card-body">
          {user && user.education && user.education.length > 0 && (
            <UserEducationInfoCard educationInfo={user.education} />
          )}
        </div>
      </div>
    </div>
  );
}
