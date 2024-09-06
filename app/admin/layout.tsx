"use client";

import UserAvatar from "@/components/global/UserAvatar";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BiDonateHeart,
  BiDotsVerticalRounded,
  BiSolidDashboard,
} from "react-icons/bi";
import { FaProjectDiagram } from "react-icons/fa";
import { GiSkills } from "react-icons/gi";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { IoMdSettings } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { MdReport } from "react-icons/md";
import { useAuthContext } from "../lib/contexts/AppContext";
import { useIsClient } from "../lib/contexts/useIsClient";

export default function AdminPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuthContext();
  const [dropdownHidden, setDropdownHidden] = useState<boolean>(true);
  const popupRef = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();
  const pathname = usePathname();

  const sidebarItems = [
    {
      label: "Dashboard",
      icon: <BiSolidDashboard size={24} />,
      href: "/admin/dashboard",
    },
    {
      label: "Users",
      icon: <LuUsers size={24} />,
      href: "/admin/users",
    },
    {
      label: "Organizations",
      icon: <HiMiniBuildingOffice size={24} />,
      href: "/admin/organizations",
    },
    {
      label: "Projects",
      icon: <FaProjectDiagram size={24} />,
      href: "/admin/projects",
    },
    {
      label: "Skills",
      icon: <GiSkills size={24} />,
      href: "/admin/skills",
    },
    {
      label: "Categories",
      icon: <GiSkills size={24} />,
      href: "/admin/categories",
    },
    {
      label: "Locations",
      icon: <IoLocationSharp size={24} />,
      href: "/admin/locations",
    },
    {
      label: "Reports",
      icon: <MdReport size={24} />,
      href: "/admin/reports",
    },
  ];

  const handleLogout = () => {
    logout();
  };

  const handleMenuItemClick = () => {
    setDropdownHidden(true);
  };

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
    <>
      {user && (
        <div className="grid grid-cols-[auto,1fr]">
          <div className="drawer lg:drawer-open">
            <input
              id="my-drawer-2"
              type="checkbox"
              className="drawer-toggle z-[auto9999999] block bg-red-600"
              placeholder="Open sidebar"
            />
            <div className="drawer-side">
              <div className="flex min-h-full flex-col gap-2 bg-base-200 p-4 text-base-content">
                <div className="self-center">
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-2"
                  >
                    <BiDonateHeart size={28} />
                    <span className="bg-base-200 text-xl font-medium">
                      VolunteerLink
                    </span>
                  </Link>
                </div>

                <div className="divider"></div>

                <ul className="menu w-80 flex-grow space-y-2 p-0">
                  {sidebarItems.map((item, index) => (
                    <li
                      key={index}
                      className={clsx(
                        pathname === item.href &&
                          "rounded-md bg-primary text-primary-content",
                      )}
                    >
                      <Link
                        href={item.href}
                        onClick={handleMenuItemClick}
                        className="flex items-center gap-3"
                      >
                        <span>{item.icon}</span>
                        <span className="text-lg">{item.label}</span>
                      </Link>
                    </li>
                  ))}

                  <div className="divider"></div>

                  <li
                    className={clsx(
                      pathname === "/admin/settings" &&
                        "rounded-md bg-primary text-primary-content",
                    )}
                  >
                    <Link
                      href="/admin/settings"
                      onClick={handleMenuItemClick}
                      className="flex items-center gap-3"
                    >
                      <span>
                        <IoMdSettings size={24} />
                      </span>
                      <span className="text-lg">Settings</span>
                    </Link>
                  </li>
                </ul>

                <div className="divider"></div>

                <div className="relative">
                  <div
                    onClick={() => {
                      setDropdownHidden(!dropdownHidden);
                    }}
                    className="flex flex-row items-center justify-between gap-4"
                  >
                    <div className="flex flex-row items-center gap-4">
                      <UserAvatar
                        email={user.email}
                        name={user.firstName}
                        size="base"
                      />
                      <div className="flex flex-col">
                        <p className="text-xl">{`${user.firstName} ${user.lastName}`}</p>
                        <p className="text-sm">{`@${user?.username}`}</p>
                      </div>
                    </div>

                    <details className="dropdown dropdown-end dropdown-top">
                      <summary className="btn btn-ghost px-1 py-0">
                        <BiDotsVerticalRounded size={28} />
                      </summary>
                      <ul className="menu dropdown-content z-[1] w-52 rounded-md bg-base-100 p-2 shadow">
                        <li>
                          <span onClick={handleLogout}>Logout</span>
                        </li>
                      </ul>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">{children}</div>
        </div>
      )}
    </>
  );
}
