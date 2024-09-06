"use client";

import { fetchUser } from "@/app/lib/users";
import "@/app/styles.css";
import PageNotFoundImage from "@/public/img/404-page-image.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SocialLinks from "../components/SocialLinks";
import UserProfile from "../components/UserProfile";

export default function OtherUserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const username = pathname.split("/")[2];
  const [user, setUser] = useState<any>();
  const router = useRouter();

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
    <>
      {user ? (
        <div className="layout-container">
          {/* Sidebar */}
          <div className="layout-left-child">
            <div>
              {user && (
                <UserProfile
                  id={user.id}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  username={user.username}
                  email={user.email}
                  createdAt={user.createdAt}
                  ownProfile={false}
                  badge={
                    user.badges &&
                    user.badges.length > 0 &&
                    user.badges[user.badges.length - 1]
                  }
                />
              )}

              {user && user.socialLinks.length > 0 && (
                <SocialLinks socialLinks={user.socialLinks} />
              )}
            </div>
          </div>

          {/* Profile + setting + edit */}
          <div className="layout-right-child">{children}</div>
        </div>
      ) : (
        <main className="flex flex-col items-center justify-center gap-12 py-24">
          <div className="flex justify-center">
            <Image
              src={PageNotFoundImage}
              alt="Page not found illustration"
              style={{ width: "60%", height: "auto" }}
            />
          </div>

          <div className="prose space-y-4 text-center lg:prose-lg">
            <h1>404 - Page not found</h1>
            <p>Oops! The page you are looking for could not be found.</p>
          </div>

          <div className="inline-flex gap-6">
            <div onClick={() => router.refresh()}>
              <button className="btn btn-outline">Try Again</button>
            </div>
            <Link href="/">
              <button className="btn btn-primary">Go to home page</button>
            </Link>
          </div>
        </main>
      )}
    </>
  );
}
