import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function ZoneActivityChart({ data = [] }) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="w-full rounded-2xl shadow-lg border border-slate-800 bg-slate-900 p-4">
      <div className="mb-1">
        <h3 className="text-sm font-semibold text-slate-100">Hoạt động khu vực</h3>
        <p className="text-xs text-slate-400">Các thảm họa và yêu cầu SOS đang hoạt động trong 7 ngày qua</p>
      </div>

      <div className="mt-3 h-64 w-full">
        {!hasData ? (
          <div className="h-full w-full rounded-xl bg-slate-800 grid place-items-center text-slate-400">
            Không có dữ liệu hoạt động
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1f2937", borderRadius: 12 }}
                labelStyle={{ color: "#e2e8f0" }}
                itemStyle={{ color: "#e2e8f0" }}
              />
              <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} />
              <Line type="monotone" dataKey="activeDisasters" name="Active Disasters" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="sosRequests" name="SOS Requests" stroke="#3b82f6" strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 6 }} legendType="square" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ZoneActivityChart;


