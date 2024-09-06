import { fetchLocations } from "@/app/lib/locations";
import DetailsHeader from "../../components/DetailsHeader";
import EditAvatar from "./EditAvatar";
import EditCV from "./EditCV";
import EditEducationInfo from "./EditEducationInfo";
import EditPersonalInfo from "./EditPersonalInfo";
import EditSkills from "./EditSkills";
import EditSocialLinks from "./EditSocialLinks";

export default async function EditProfile() {
  const locations = await fetchLocations();

  return (
    <div>
      <DetailsHeader href="/v/me" text="Edit Profile" />

      <div className="space-y-3">
        <EditAvatar />

        <EditPersonalInfo locations={locations} />

        <EditCV />

        <EditSocialLinks />

        <EditSkills />

        <EditEducationInfo />
      </div>
    </div>
  );
}
