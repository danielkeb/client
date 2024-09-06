"use client";

import axiosInstance from "@/app/axiosInstance";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ReviewCard from "../components/ReviewCard";

export default function ApplicationsPage() {
  const [reviews, setReviews] = useState<Array<any> | null>();
  const pathname = usePathname();

  useEffect(() => {
    const getReviews = async (projectId: string) => {
      try {
        const res = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/${projectId}`,
        );

        if (res.status === 200) {
          setReviews(res.data);
        }
      } catch (error) {
        setReviews(null);
      }
    };

    if (pathname) {
      getReviews(pathname.split("/")[2]);
    }
  }, [pathname]);

  return (
    <div className="columns-2 gap-3">
      {reviews && reviews.length > 0 ? (
        <>
          {reviews.map((review, index) => {
            return <ReviewCard key={index} review={review} />;
          })}
        </>
      ) : (
        <div>No reviews yet</div>
      )}
    </div>
  );
}
