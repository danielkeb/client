"use client";

import { useAuthContext } from "@/app/lib/contexts/AppContext";
import "@/app/styles.css";
import React, { useEffect, useState } from "react";
import SideNav from "../components/SideNav";
import SocialLinks from "../components/SocialLinks";
import UserProfile from "../components/UserProfile";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthContext();
  const [hasSocialLinks, setHasSocialLinks] = useState(false);

  useEffect(() => {
    const checking = user?.socialLinks?.some(
      (link: { platform: string; url: string }) => {
        if (link.url !== null) {
          return true;
        }
      },
    );

    setHasSocialLinks(checking);
  }, [user]);

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <div className="layout-left-child">
        <div>
          {user && (
            <UserProfile
              firstName={user.firstName}
              lastName={user.lastName}
              username={user.username}
              email={user.email}
              createdAt={user.createdAt}
              ownProfile={true}
              badge={
                user.badges &&
                user.badges.length > 0 &&
                user.badges[user.badges.length - 1]
              }
            />
          )}

          {hasSocialLinks && <SocialLinks socialLinks={user.socialLinks} />}
        </div>

        <SideNav />
      </div>

      {/* Profile + setting + edit */}
      <div className="layout-right-child">{children}</div>
    </div>
  );
}
