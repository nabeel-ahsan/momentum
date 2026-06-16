import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SessionChart = ({chartData}) => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer minWidth="0%" minHeight="0%" width="99%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" stroke="#888888" />
          <YAxis allowDecimals={false} stroke="#888888" />
          <Tooltip cursor={{ fill: "#333" }} />
          <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SessionChart;
