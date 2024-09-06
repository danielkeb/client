import { fetchLocations } from "@/app/lib/locations";
import EditContactInfo from "./EditContactInfo";
import EditDetails from "./EditDetails";
import EditLegalInfo from "./EditLegalInfo";
import EditLogo from "./EditLogo";

export default async function EditOrgProfile() {
  const location = await fetchLocations();

  return (
    <>
      <EditLogo />

      <EditDetails />

      <EditContactInfo locations={location} />

      <EditLegalInfo />
    </>
  );
}
