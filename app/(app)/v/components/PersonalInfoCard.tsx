import "@/app/styles.css";

export default function PersonalInfoCard({
  firstName,
  lastName,
  gender,
  locationName,
  age,
  email,
}: {
  firstName: string;
  lastName: string;
  gender: string;
  locationName: string;
  age: number;
  email: string;
}) {
  return (
    <div className="card rounded-md">
      <div className="card-body">
        <h3 className="card-title">Personal Information</h3>

        <div className="3xl:grid-cols-3 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="personal-info-key">Name</p>
            <p className="personal-info-value capitalize">{`${firstName} ${lastName}`}</p>
          </div>

          <div>
            <p className="personal-info-key">Gender</p>
            <p className="personal-info-value capitalize">{`${gender || "N/A"}`}</p>
          </div>

          <div>
            <p className="personal-info-key">Location</p>
            <p className="personal-info-value">{`${locationName}`}</p>
          </div>

          <div>
            <p className="personal-info-key">Age</p>
            <p className="personal-info-value">{`${age || "N/A"}`}</p>
          </div>

          <div>
            <p className="personal-info-key">Email</p>
            <p className="personal-info-value">{`${email}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
