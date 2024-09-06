"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import Toggle from "@/components/global/Toggle";
import SettingItemText from "../../components/SettingItemText";

// Define a type for the texts object
type Texts = {
  [key: string]: { title: string; subtitle: string };
};

export default function NotificationSetting() {
  const { user } = useAuthContext();
  const { addAlert, dismissAlert } = useAlertsContext();

  const texts: Texts = {
    task_assigned: {
      title: "Tasks",
      subtitle: "Get notified when a new task is assigned to you",
    },
    new_project_recommendation: {
      title: "New Projects",
      subtitle:
        "Get notified when there is a new project recommendation for you",
    },
    project_status_update: {
      title: "Project Status",
      subtitle: "Get notified when a project status is updated",
    },
    deadlines: {
      title: "Deadlines",
      subtitle: "Get notified when a task deadline is approaching",
    },
    application_status_update: {
      title: "Applications",
      subtitle: "Get notified when your application status is updated",
    },
    badge_and_certificate: {
      title: "Profile",
      subtitle:
        "Get notified when a new badge or certificate is awarded to you",
    },
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    // Select the index of the changed option
    const indexToBeUpdated = user.notificationPreference.findIndex(
      (option: any) => option.option === key,
    );

    // Update the value of the selected option
    user.notificationPreference[indexToBeUpdated].value = value;

    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/update`,
        {
          notificationPreference: user.notificationPreference,
        },
      );

      if (res.status === 200) {
        const id = addAlert({
          severity: "success",
          message: "Successfully updated your notification settings.",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
      }
    } catch (error) {
      const id = addAlert({
        severity: "error",
        message:
          "Failed to update your notification settings. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  return (
    <>
      {user && user.notificationPreference && (
        <div className="space-y-1">
          <p>Notification</p>
          <div className="card rounded-md">
            <div className="card-body space-y-3">
              {user?.notificationPreference?.map(
                (item: { option: string; value: boolean }, index: number) => (
                  <div key={index} className="setting-item">
                    <SettingItemText
                      title={texts[item.option].title}
                      subtitle={texts[item.option].subtitle}
                    />

                    <Toggle
                      options={["OFF", "ON"]}
                      selected={item.value ? 1 : 0}
                      onChange={(newValue: string) =>
                        handleNotificationChange(item.option, newValue === "ON")
                      }
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
