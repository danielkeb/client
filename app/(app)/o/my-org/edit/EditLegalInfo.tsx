"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import { useIsClient } from "@/app/lib/contexts/useIsClient";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EditLegalInfo() {
  const { org, getUser } = useAuthContext();
  const { addAlert, dismissAlert } = useAlertsContext();
  const isClient = useIsClient();
  const [permit, setPermit] = useState<string | null>();

  const handlePermitUpload = async (e: any) => {
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/files/uploadPermit/${org?.id}`,
        { permit: e && e.target.files[0] },
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
          message: "Permit uploaded successfully",
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
          "Failed to upload permit. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  useEffect(() => {
    async function getPermit() {
      try {
        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/files/getPermit/${org.id}`,
          {
            responseType: "blob",
          },
        );

        if (response.status === 200) {
          const url = URL.createObjectURL(response.data);
          setPermit(url);
        }
      } catch (e) {
        setPermit(null);
      }
    }

    if (org.id !== undefined) {
      getPermit();
    }
  }, [org.id, org.permitId]);

  return (
    <div className="card rounded-md">
      <div className="card-body">
        <h2 className="card-title">Legal Information</h2>

        <div className="space-x-2">
          <button
            className="btn btn-primary"
            onClick={() =>
              isClient && document.getElementById("permitInput")?.click()
            }
          >
            Upload permit
          </button>
          {permit && org.permitId && (
            <Link className="btn" href={permit} target="_blank">
              Show permit
            </Link>
          )}
          <input
            id="permitInput"
            accept="application/pdf"
            type="file"
            hidden
            onChange={handlePermitUpload}
          ></input>
        </div>
      </div>
    </div>
  );
}
