"use client";

import { useAuthContext } from "@/app/lib/contexts/AppContext";
import LogoAvatar from "@/components/global/LogoAvatar";
import { format } from "date-fns";

export default function OrgProfile() {
  const { org } = useAuthContext();

  return (
    <div className="space-y-3">
      <div className="card rounded-md">
        <div className="card-body space-y-6">
          <div className="space-y-2">
            <LogoAvatar id={org.id} name={org.name} size="xl" />
            <h2 className="text-3xl font-medium">{org.name}</h2>

            <div className="flex flex-row">
              <span>{org?.location?.name}</span>
              {org.foundingDate && (
                <>
                  <div className="divider divider-horizontal"></div>
                  <span>{`Since ${format(org.foundingDate, "MMMM, yyyy")}`}</span>
                </>
              )}
            </div>
          </div>

          <div>
            <span className="text-xl font-medium">About Us</span>
            <p>{org.aboutUs}</p>
          </div>

          <div>
            <span className="text-xl font-medium">Mission</span>
            <p>{org.mission}</p>
          </div>
        </div>
      </div>

      <div className="card rounded-md">
        <div className="card-body">
          <h4 className="card-title">Contact Information</h4>

          <div className="grid grid-cols-2 gap-y-6">
            <div>
              <span className="text-sm">Email</span>
              <p className="text-xl">{org.contactEmail || "N/A"}</p>
            </div>

            <div>
              <span className="text-sm">Phone</span>
              <p className="text-xl">{org.contactPhone || "N/A"}</p>
            </div>

            <div>
              <span className="text-sm">Website</span>
              <p className="text-xl">{org.websiteUrl || "N/A"}</p>
            </div>

            <div>
              <span className="text-sm">Location</span>
              <p className="text-xl">{org?.location?.name || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
