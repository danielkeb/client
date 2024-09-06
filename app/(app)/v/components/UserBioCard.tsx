"use client";

import clsx from "clsx";
import { useState } from "react";

export default function UserBioCard({ bio }: { bio: string }) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="card rounded-md">
      <div className="card-body">
        <h5 className="card-title">Bio</h5>

        <div>
          <p
            className={clsx(
              isExpanded ? "" : "line-clamp-3",
              "mb-2 text-pretty",
            )}
          >
            {bio}
          </p>

          <span
            className="cursor-pointer text-sm text-neutral"
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? "Show less" : "Show more"}
          </span>
        </div>
      </div>
    </div>
  );
}
