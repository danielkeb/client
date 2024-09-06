import React from "react";

export default function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card rounded-md">
      <div className="card-body">
        <div className="card-title">{title}</div>

        <div>{children}</div>
      </div>
    </div>
  );
}
