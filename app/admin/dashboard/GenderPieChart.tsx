"use client";

import axiosInstance from "@/app/axiosInstance";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import ChartCard from "../components/ChartCard";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function GenderPieChart() {
  const [data, setData] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/stats/age-and-gender`,
      );

      if (res.status === 200) {
        setData(res.data);
      }
    };

    fetchData();
  }, []);

  return (
    <ChartCard title="Gender Distribution">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data && data.gender}
            dataKey="value"
            paddingAngle={5}
            innerRadius={"50%"}
            outerRadius={"80%"}
            fill="#8884d8"
            legendType="circle"
            label
          >
            {data &&
              data.gender.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
          </Pie>
          <Legend align="left" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#3b3c3f",
              borderRadius: 5,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
