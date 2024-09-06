import { useAuthContext } from "@/app/lib/contexts/AppContext";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CVCard({ id }: { id: string }) {
  const { user } = useAuthContext();
  const [cv, setCv] = useState<string | null>();

  useEffect(() => {
    async function getCV() {
      try {
        const response = await axios.get(
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

    if (user.id !== undefined) {
      getCV();
    }
  }, [user.cvId, user.id]);

  return (
    <div className="card rounded-md">
      <div className="card-body">
        <h5 className="card-title">CV</h5>
        <div className="space-x-2">
          {cv && user.cvId && (
            <Link className="btn" href={cv} target="_blank">
              Show CV
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
