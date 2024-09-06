"use client";

import axiosInstance from "@/app/axiosInstance";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "../components/ChartCard";

export default function VerifiedAndUnverified() {
  const [data, setData] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/stats/verifiedAndNotVerified`,
      );

      if (res.status === 200) {
        setData(res.data);
      }
    };

    fetchData();
  }, []);

  return (
    <ChartCard title="Verified and Unverified">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart layout="vertical" data={data}>
          <Tooltip
            cursor={{ fill: "#4E4E55" }}
            contentStyle={{ backgroundColor: "#3b3c3f", borderRadius: 5 }}
          />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" stroke="#4E4E55" />
          <Bar dataKey="verified" fill="#8884d8" label={{ fill: "white" }} />
          <Bar dataKey="unverified" fill="#82ca9d" label={{ fill: "white" }} />
          <XAxis type="number" hide />
          <YAxis dataKey={"name"} type="category" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
