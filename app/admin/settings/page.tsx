import EditAvatar from "@/app/(app)/v/me/edit/EditAvatar";
import EditPersonalInfo from "@/app/(app)/v/me/edit/EditPersonalInfo";
import AppearanceSetting from "@/app/(app)/v/me/settings/AppearanceSetting";
import ChangePassword from "@/app/(app)/v/me/settings/ChangePassword";
import DangerZone from "@/app/(app)/v/me/settings/DangerZone";
import { fetchLocations } from "@/app/lib/locations";

export default async function SettingsPage() {
  const locations = await fetchLocations();
  return (
    <div className="mx-auto w-full space-y-3 md:w-3/4 xl:w-1/2">
      <EditAvatar />

      <EditPersonalInfo locations={locations} />

      <AppearanceSetting />

      <ChangePassword />

      <DangerZone />
    </div>
  );
}
