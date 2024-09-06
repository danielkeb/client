"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import { useIsClient } from "@/app/lib/contexts/useIsClient";
import LogoAvatar from "@/components/global/LogoAvatar";

export default function EditLogo() {
  const { org, getUser } = useAuthContext();
  const { addAlert, dismissAlert } = useAlertsContext();
  const isClient = useIsClient();

  const handleLogoUpload = async (e: any) => {
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/files/logo/update/${org?.id}`,
        { logo: e && e.target.files[0] },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.status === 201) {
        getUser();
      }
    } catch (error: any) {
      const id = addAlert({
        severity: "error",
        message:
          error?.response?.data?.message ||
          "Failed to update profile picture. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/files/deleteLogo/${org?.id}`,
      );

      if (res.status === 200) {
        getUser();
      }
    } catch (error: any) {
      const id = addAlert({
        severity: "error",
        message:
          error?.response?.data?.message ||
          "Failed to remove profile picture. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  return (
    <div className="space-y-1">
      <div className="card rounded-md">
        <div className="card-body">
          <p className="card-title">Profile Picture</p>
          <div>
            <LogoAvatar id={org.id} name={org.name} size="xl" />
          </div>

          <div className="mt-4 flex gap-6">
            <input
              id="fileInput"
              accept="image/*"
              type="file"
              hidden
              onChange={handleLogoUpload}
            ></input>
            <button
              className="btn btn-primary"
              onClick={() =>
                isClient && document.getElementById("fileInput")?.click()
              }
            >
              Update logo
            </button>

            <div>
              <button
                className="btn btn-error"
                disabled={org.logoId === null}
                onClick={handleDelete}
              >
                Remove logo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
