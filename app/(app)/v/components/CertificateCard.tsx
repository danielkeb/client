"use client";

import axiosInstance from "@/app/axiosInstance";
import { formatDate } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CertificatesCard({
  certificate,
}: {
  certificate: any;
}) {
  const [file, setFile] = useState<string | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/files/certificates/${certificate.id}`,
          {
            responseType: "blob",
          },
        );

        if (res.status === 200) {
          const url = URL.createObjectURL(res.data);
          setFile(url);
        }
      } catch (error) {
        setFile(null);
      }
    };

    fetchFile();
  }, [certificate.id]);

  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <p className="text-xl font-medium">{certificate.project.title}</p>
        <p>{certificate.project.organization.name}</p>
        <p>{formatDate(certificate.dateGiven, "MMM, yyyy")}</p>
      </div>

      {file && (
        <Link href={file} target="_blank">
          <button className="btn btn-outline">View Certificate</button>
        </Link>
      )}
    </div>
  );
}
