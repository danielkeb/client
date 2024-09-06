"use client";

import axiosInstance from "@/app/axiosInstance";
import { useEffect, useState } from "react";
import { FaProjectDiagram } from "react-icons/fa";
import { HiMiniBuildingLibrary } from "react-icons/hi2";
import { LuUsers } from "react-icons/lu";
import SummaryCard from "../components/SummaryCard";

export default function Summary() {
  const [summary, setSummary] = useState<any>();

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/stats/summary`,
      );

      if (res.status === 200) {
        setSummary(res.data);
      }
    };

    fetchSummary();
  }, []);
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        bgClass="bg-gradient-to-tl from-success/75 to-success/50"
        title="Total users"
        value={summary?.users?.total | NaN}
        icon={<LuUsers size={40} />}
      />

      <SummaryCard
        bgClass="bg-gradient-to-tl from-warning/75 to-warning/50"
        title="Total projects"
        value={summary?.projects?.total | NaN}
        icon={<FaProjectDiagram size={40} />}
      />

      <SummaryCard
        bgClass="bg-gradient-to-tl from-info/75 to-info/50"
        title="Total organizations"
        value={summary?.organizations?.total | NaN}
        icon={<HiMiniBuildingLibrary size={40} />}
      />

      <SummaryCard
        bgClass="bg-gradient-to-tl from-error/75 to-error/50"
        title="Deactivated account"
        value={summary?.users?.deactivatedAccounts | NaN}
        icon={<LuUsers size={40} />}
      />
    </div>
  );
}
