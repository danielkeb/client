"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import { useIsClient } from "@/app/lib/contexts/useIsClient";
import SettingItemText from "../../components/SettingItemText";

export default function DangerZone() {
  const { logout, setIsLoggedIn, setToken, setUser } = useAuthContext();
  const { addAlert, dismissAlert } = useAlertsContext();
  const isClient = useIsClient();

  const handleDeactivate = async () => {
    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/deactivateAccount`,
      );

      if (res.status === 200) {
        setToken("");
        setUser(null);
        logout();
        setIsLoggedIn(false);
      }
    } catch (error) {
      const id = addAlert({
        severity: "error",
        message: "Failed to deactivate account. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/delete`,
      );

      if (res.status === 200) {
        setToken("");
        setUser(null);
        logout();
        setIsLoggedIn(false);
      }
    } catch (error) {
      const id = addAlert({
        severity: "error",
        message: "Failed to delete account. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  return (
    <div className="space-y-1">
      <p className="text-error">Danger Zone</p>
      <div className="card rounded-md border border-error">
        <div className="card-body flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <SettingItemText
              title="Deactivate Account"
              subtitle="Your account will not be visible publicly."
            />

            <div
              onClick={() =>
                isClient &&
                (
                  document.getElementById(
                    "deactivate_account_modal",
                  ) as HTMLDialogElement
                ).showModal()
              }
            >
              <button className="btn btn-error">Deactivate Account</button>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between">
            <SettingItemText
              title="Delete Account"
              subtitle="Deletes your account and all data connected to it"
            />

            <div
              onClick={() =>
                isClient &&
                (
                  document.getElementById(
                    "delete_account_modal",
                  ) as HTMLDialogElement
                ).showModal()
              }
            >
              <button className="btn btn-error">Delete Account</button>
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate account modal */}
      <dialog id="deactivate_account_modal" className="modal">
        <div className="prose modal-box rounded-md lg:prose-lg">
          <h3>Deactivate Account</h3>
          <p className="text-text-200">
            Your profile will not be displayed publicly. You can log back in any
            time you want to reactivate your account.
          </p>

          <div className="modal-action">
            <form method="dialog">
              <div className="mt-5 flex flex-row justify-end gap-4">
                <div>
                  <button className="btn btn-outline">Cancel</button>
                </div>
                <div onClick={handleDeactivate}>
                  <button className="btn btn-error">Deactivate</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      {/* Delete account modal */}
      <dialog id="delete_account_modal" className="modal">
        <div className="prose modal-box rounded-md lg:prose-lg">
          <h3>Delete Account</h3>
          <p className="text-text-200">
            Are you sure you want to delete your account.{" "}
            <strong>This action is not reversible.</strong>
          </p>

          <div className="modal-action">
            <form method="dialog">
              <div className="mt-5 flex flex-row justify-end gap-4">
                <div>
                  <button className="btn btn-outline">Cancel</button>
                </div>
                <div onClick={handleDelete}>
                  <button className="btn btn-error">Delete</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
