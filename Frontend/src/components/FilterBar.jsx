import React, { useState } from "react";

function FilterBar({ searchPlaceholder, dropdownOptions = [], onReset }) {
  const [search, setSearch] = useState("");
  const [filterOne, setFilterOne] = useState(dropdownOptions[0] || "");
  const [filterTwo, setFilterTwo] = useState(dropdownOptions[0] || "");

  const handleReset = () => {
    setSearch("");
    setFilterOne(dropdownOptions[0] || "");
    setFilterTwo(dropdownOptions[0] || "");
    if (onReset) onReset();
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="flex-1">
          <label className="sr-only" htmlFor="filter-search">Tìm Kiếm</label>
          <input
            id="filter-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:w-auto md:grid-cols-2">
          <div>
            <label className="sr-only" htmlFor="filter-one">Bộ lọc cấp một</label>
            <select
              id="filter-one"
              value={filterOne}
              onChange={(e) => setFilterOne(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dropdownOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="sr-only" htmlFor="filter-two">Filter two</label>
            <select
              id="filter-two"
              value={filterTwo}
              onChange={(e) => setFilterTwo(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dropdownOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:ml-auto">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex w-full md:w-auto items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Làm mới bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;



