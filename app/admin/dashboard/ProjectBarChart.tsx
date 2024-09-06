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
} from "recharts";

export default function ProjectBarChart() {
  const [selected, setSelected] = useState<"duration" | "location">("duration");
  const [data, setData] = useState<Array<any>>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/stats/projectStat`,
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
        <div className="mb-2 flex flex-row items-center justify-between">
          <div className="card-title">Projects</div>

          <select
            className="select"
            onChange={(e) =>
              setSelected(e && (e.target.value as "duration" | "location"))
            }
          >
            <option value="duration">By project duration</option>
            <option value="location">By project location</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data && data}>
            <Tooltip
              cursor={{ fill: "#4E4E55" }}
              contentStyle={{ backgroundColor: "#3b3c3f", borderRadius: 5 }}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#4E4E55" />
            <XAxis dataKey="name" />
            <Legend />
            <Bar
              dataKey={selected === "duration" ? "longTerm" : "inPerson"}
              fill="#8884d8"
              label={{ fill: "white" }}
            />
            <Bar
              dataKey={selected === "duration" ? "shortTerm" : "remote"}
              fill="#82ca9d"
              label={{ fill: "white" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
