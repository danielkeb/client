"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import Toggle from "@/components/global/Toggle";
import SettingItemText from "../../components/SettingItemText";

export default function ProjectSetting() {
  const { user } = useAuthContext();
  const { addAlert, dismissAlert } = useAlertsContext();

  const handleTimePreferenceChange = async (value: string) => {
    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/update`,
        {
          timePreference: value.split(" ").join("_").toUpperCase(),
        },
      );

      if (res.status === 200) {
        user.timePreference = value;
        const id = addAlert({
          severity: "success",
          message: "Successfully updated your time preference.",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
      }
    } catch (error) {
      const id = addAlert({
        severity: "error",
        message: "Failed to update your time preference. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  const handleLocationPreferenceChange = async (value: string) => {
    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/update`,
        {
          locationPreference: value.split(" ").join("_").toUpperCase(),
        },
      );

      if (res.status === 200) {
        user.timePreference = value;
        const id = addAlert({
          severity: "success",
          message: "Successfully updated your location preference.",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
      }
    } catch (error) {
      const id = addAlert({
        severity: "error",
        message: "Failed to update your location preference. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  return (
    <div className="space-y-1">
      <p>Project</p>
      <div className="card rounded-md">
        <div className="card-body space-y-3">
          <div className="setting-item">
            <SettingItemText
              title="Time Preference"
              subtitle="Customize your preferred time availability settings"
            />

            {user.timePreference && (
              <Toggle
                options={["Short Term", "Long Term", "Both"]}
                selected={
                  user.timePreference === "SHORT_TERM"
                    ? 0
                    : user.timePreference === "LONG_TERM"
                      ? 1
                      : 2
                }
                onChange={handleTimePreferenceChange}
              />
            )}
          </div>

          <div className="setting-item">
            <SettingItemText
              title="Locations Preference"
              subtitle="Customize your preferred location settings"
            />

            {user.locationPreference && (
              <Toggle
                options={["In Person", "Remote", "Both"]}
                selected={
                  user.locationPreference === "IN_PERSON"
                    ? 0
                    : user.locationPreference === "REMOTE"
                      ? 1
                      : 2
                }
                onChange={handleLocationPreferenceChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
