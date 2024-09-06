import { fetchLocations } from "@/app/lib/locations";
import CreateOrgForm from "./CreateOrgForm";

export default async function CreateOrganization() {
  const locations = await fetchLocations();

  return (
    <div className="my-12 flex flex-col items-center justify-center gap-6">
      <div className="prose lg:prose-lg">
        <h2 className="text-center">Create an organization profile</h2>
        <p>
          Fill out the following form in order to create an organization profile
        </p>
      </div>

      <div className="card w-5/6 rounded-md lg:w-3/4 xl:w-1/2">
        <div className="card-body">
          <CreateOrgForm locations={locations} />
        </div>
      </div>
    </div>
  );
}
