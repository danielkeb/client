"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import { useIsClient } from "@/app/lib/contexts/useIsClient";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EditCV() {
  const { user, getUser } = useAuthContext();
  const { addAlert, dismissAlert } = useAlertsContext();
  const isClient = useIsClient();
  const [cv, setCv] = useState<string | null>();

  const handleCVUpload = async (e: any) => {
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/files/uploadCV/${user?.id}`,
        { cv: e && e.target.files[0] },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.status === 201) {
        getUser();
        const id = addAlert({
          severity: "success",
          message: "CV uploaded successfully",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
      }
    } catch (error: any) {
      const id = addAlert({
        severity: "error",
        message:
          error?.response?.data?.message ||
          "Failed to upload CV. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  useEffect(() => {
    async function getCV() {
      try {
        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/files/getCV/${user.id}`,
          {
            responseType: "blob",
          },
        );

        if (response.status === 200) {
          const url = URL.createObjectURL(response.data);
          setCv(url);
        }
      } catch (e) {
        setCv(null);
      }
    }

    if (user && user.id !== undefined) {
      getCV();
    }
  }, [user]);

  return (
    <div className="space-y-1">
      <p>CV</p>
      <div className="card rounded-md">
        <div className="card-body">
          <div className="space-x-2">
            <input
              id="cvInput"
              accept="application/pdf"
              type="file"
              hidden
              onChange={handleCVUpload}
            ></input>
            <button
              className="btn btn-primary"
              onClick={() =>
                isClient && document.getElementById("cvInput")?.click()
              }
            >
              Upload CV
            </button>
            {cv && user && user.cvId && (
              <Link className="btn" href={cv} target="_blank">
                Show CV
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
