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

export default function PopularSkillsChart() {
  const [selected, setSelected] = useState<"user" | "project" | "both">("both");
  const [data, setData] = useState<Array<any>>();

  const both = data?.map((item: any) => ({
    name: item.name,
    usage: (item._count.users || 0) + (item._count.projects || 0),
  }));

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/stats/popularSkills`,
      );

      if (res.status === 200) {
        setData(res.data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="card rounded-md">
      <div className="card-body">
        <div className="card-title">Top 10 Popular Skills</div>

        {data && data[0]._count.project !== 0 && data[0]._count.users !== 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={both}>
              <Tooltip
                cursor={{ fill: "#4E4E55" }}
                contentStyle={{ backgroundColor: "#3b3c3f", borderRadius: 5 }}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#4E4E55" />
              <XAxis type="number" hide />
              <YAxis dataKey={"name"} type="category" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="usage"
                fill="#8884d8"
                label={{ fill: "white", content: () => "Usage" }}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="italic">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
