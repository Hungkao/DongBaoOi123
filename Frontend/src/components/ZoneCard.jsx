import React from "react";

const levelColorClasses = {
  Red: {
    badge: "bg-red-100 text-red-800 ring-red-200",
    text: "text-red-700",
  },
  Yellow: {
    badge: "bg-yellow-100 text-yellow-800 ring-yellow-200",
    text: "text-yellow-700",
  },
  Green: {
    badge: "bg-green-100 text-green-800 ring-green-200",
    text: "text-green-700",
  },
};

function ZoneCard({ name, type, dangerLevel }) {
  const normalized = (dangerLevel || "").trim();
  const color = levelColorClasses[normalized] || levelColorClasses.Green;

  return (
    <div className="w-full rounded-xl shadow-sm border border-gray-200 bg-white p-4 sm:p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">Loại thảm họa: <span className="font-medium text-gray-800">{type}</span></p>
        </div>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${color.badge}`}>
          Danger: {normalized || "Unknown"}
        </span>
      </div>

      <div className="mt-1 text-sm">
        <span className={`font-medium ${color.text}`}>Mức độ nguy hiểm:</span>
        <span className="ml-1 text-gray-800">{normalized || "Unknown"}</span>
      </div>

      <div className="pt-2">
        <button
          type="button"
          className="inline-flex w-full sm:w-auto justify-center items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}

export default ZoneCard;


