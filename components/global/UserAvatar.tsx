"use client";

import axiosInstance from "@/app/axiosInstance";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function UserAvatar({
  email,
  name,
  size,
  classes,
}: {
  email: string;
  name: string;
  size: "xxs" | "xs" | "sm" | "base" | "lg" | "xl";
  classes?: string;
}) {
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    async function getAvatar() {
      try {
        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/files/getProfilePicture/${email}`,
          {
            responseType: "blob",
          },
        );

        if (response.status === 200) {
          const url = URL.createObjectURL(response.data);
          setAvatar(url);
        }
      } catch (e) {
        setAvatar(null);
      }
    }

    if (email !== undefined) {
      getAvatar();
    }
  }, [email, name]);

  const sizeMap = {
    xxs: 4,
    xs: 6,
    sm: 8,
    base: 10,
    lg: 20,
    xl: 32,
  };

  const getSize = () => sizeMap[size];

  const renderFallback = () => (
    <div className={clsx("avatar placeholder", classes)}>
      <div
        className={clsx(
          "rounded-full bg-neutral text-neutral-content",
          size === "xxs" && "w-4",
          size === "xs" && "w-6",
          size === "sm" && "w-8",
          size === "base" && "w-10",
          size === "lg" && "w-20",
          size === "xl" && "w-32",
        )}
      >
        <span className={clsx("text-sm", size === "xxs" && "text-xs")}>
          {name && name.charAt(0).toUpperCase()}
        </span>
      </div>
    </div>
  );

  return (
    <div className="tooltip flex" data-tip={name}>
      {avatar ? (
        <div className={clsx("avatar", classes)}>
          <div
            className={clsx(
              "rounded-full",
              size === "xxs" && "w-4",
              size === "xs" && "w-6",
              size === "sm" && "w-8",
              size === "base" && "w-10",
              size === "lg" && "w-20",
              size === "xl" && "w-32",
            )}
          >
            <Image
              src={avatar}
              width={getSize()}
              height={getSize()}
              alt={name}
              className="h-full w-full rounded-full"
            />
          </div>
        </div>
      ) : (
        renderFallback()
      )}
    </div>
  );
}
