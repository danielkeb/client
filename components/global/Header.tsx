"use client";

import { useAuthContext } from "@/app/lib/contexts/AppContext";
import { useIsClient } from "@/app/lib/contexts/useIsClient";
import UserAvatar from "@/components/global/UserAvatar";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { BiDonateHeart, BiFile, BiLogOut, BiUserCircle } from "react-icons/bi";
import { GrOrganization } from "react-icons/gr";

export default function Header() {
  const { user, logout, org } = useAuthContext();
  const [dropdownHidden, setDropdownHidden] = useState<boolean>(true);
  const popupRef = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();

  // Menu items of the dropdown
  const menuItems = [
    {
      label: "Profile",
      icon: <BiUserCircle size={24} />,
      href: "/v/me",
    },
    // { label: "Tasks", icon: <BiListCheck size={24} />, href: "#" },
    {
      label: "My Applications",
      icon: <BiFile size={24} />,
      href: "/v/me/applications",
    },
    {
      label: "Settings",
      icon: <AiOutlineSetting size={24} />,
      href: "/v/me/settings",
    },
  ];

  const handleLogout = () => {
    logout();
  };

  const handleMenuItemClick = () => {
    setDropdownHidden(true);
  };

  // Close the dropdown if the user clicks outside the dropdown area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setDropdownHidden(true);
      }
    }

    if (!isClient) {
      document.body.addEventListener("click", handleClickOutside);
    }

    return () => {
      if (!isClient) {
        document.body.removeEventListener("click", handleClickOutside);
      }
    };
  }, [isClient]);

  return (
    <div className="sticky top-0 z-10 bg-primary py-2">
      <div className="container flex w-full items-center justify-between bg-primary">
        {/* Logo section of the header */}
        <Link
          href="/home?status=NOT_STARTED&time=BOTH&location=ALL"
          className="flex items-center gap-2 text-primary-content"
        >
          <BiDonateHeart size={28} />
          <span className="text-xl font-medium">VolunteerLink</span>
        </Link>

        {/* Notification + search + user avatar */}
        <div className="flex items-center gap-4">
          {/* User avatar */}
          <div className="relative">
            {user && (
              <div
                onClick={() => {
                  setDropdownHidden(!dropdownHidden);
                }}
                className="flex cursor-pointer flex-row items-center gap-4"
              >
                <p className="text-xl text-primary-content">{`Hi, ${user.firstName} ${user.lastName}`}</p>
                <UserAvatar
                  email={user.email}
                  name={user.firstName}
                  size="base"
                />
              </div>
            )}

            {/* Dropdown menu items */}
            <div
              ref={popupRef}
              className={clsx(
                dropdownHidden ? "hidden" : "block",
                "absolute right-0 mt-3 w-64 overflow-clip rounded-md bg-base-100 shadow-md lg:left-1/2 lg:-translate-x-1/2",
              )}
            >
              {menuItems.map((item) => {
                return (
                  <Link
                    key={item.label}
                    onClick={handleMenuItemClick}
                    className="flex items-center gap-4 px-4 py-2 text-lg transition-colors duration-300 hover:bg-base-200"
                    href={item.href}
                  >
                    <div>{item.icon}</div>
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <hr className="border-neutral-content" />

              {user && user.organizationId ? (
                <Link
                  onClick={handleMenuItemClick}
                  className="flex items-center gap-4 px-4 py-2 text-lg transition-colors duration-300 hover:bg-base-200"
                  href="/o/my-org"
                >
                  <div>
                    <GrOrganization size={20} />
                  </div>
                  <span>Switch to Organization Profile</span>
                </Link>
              ) : (
                <Link
                  onClick={handleMenuItemClick}
                  className="flex items-center gap-4 px-4 py-2 text-lg transition-colors duration-300 hover:bg-base-200"
                  href="/o/create-organization"
                >
                  <div>
                    <GrOrganization size={20} />
                  </div>
                  <span>Create Organization</span>
                </Link>
              )}

              <hr className="border-neutral-content" />

              <div
                onClick={handleLogout}
                className="flex cursor-pointer items-center gap-4 px-4 py-2 text-lg transition-colors duration-300 hover:bg-base-200"
              >
                <BiLogOut size={24} />
                <span>Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
