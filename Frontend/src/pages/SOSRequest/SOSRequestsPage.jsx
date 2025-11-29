import React, { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  AlertTriangle,
  Search,
  Filter as FilterIcon,
  MapPin,
  Info,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Mountain,
  Wind,
  Zap,
  Flame,
  CloudRain,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { getEveryoneSos, udpateSosStatus } from "../../Redux/SOS/Action";
import { toast } from "sonner";
import AddSosModal from "./AddSosModal.jsx";

// Colored marker icons
const redIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const yellowIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const statusToIcon = (status) => {
  switch (status) {
    case "PENDING":
      return redIcon;
    case "HANDLING":
      return yellowIcon;
    case "COMPLETED":
      return greenIcon;
    case "CANCELLED":
      return blueIcon;
    default:
      return redIcon;
  }
};

<button className="bg-in"></button>;

const statusBadge = (status) => {
  const map = {
    PENDING: "bg-red-900/30 text-red-300 ring-red-700/40",
    HANDLING: "bg-yellow-900/30 text-yellow-300 ring-yellow-700/40",
    COMPLETED: "bg-green-900/30 text-green-300 ring-green-700/40",
    CANCELLED: "bg-blue-900/30 text-blue-300 ring-blue-700/40",
  };
  return `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${map[status] || ""}`;
};

const riskBadge = (level) => {
  const map = {
    HIGH: "bg-red-900/30 text-red-300 ring-red-700/40",
    MEDIUM: "bg-yellow-900/30 text-yellow-300 ring-yellow-700/40",
    LOW: "bg-green-900/30 text-green-300 ring-green-700/40",
  };
  return `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
    map[level] || "bg-slate-800 text-slate-300 ring-slate-700"
  }`;
};

const disasterIcon = (type) => {
  switch (type) {
    case "LŨ LỤT":
      return <Droplets className="h-4 w-4 text-blue-400" />;
    case "BÃO/SIÊU BÃO":
      return <Mountain className="h-4 w-4 text-orange-400" />;
    case "CHÁY NHÀ":
      return <Mountain className="h-4 w-4 text-green-400" />;
    case "CHÁY RỪNG":
      return <CloudRain className="h-4 w-4 text-purple-400" />;
    case "MƯA ĐÁ":
      return <Flame className="h-4 w-4 text-red-400" />;
    case "NGẬP ÚNG":
      return <Wind className="h-4 w-4 text-cyan-400" />;
    case "SẠT LỞ ĐẤT":
      return <Info className="h-4 w-4 text-yellow-400" />; // pick a better icon if you want
    case "Hạn hán":
      return <CloudRain className="h-4 w-4 text-slate-200" />; // snowflake icon if available
    default:
      return <Info className="h-4 w-4 text-slate-300" />;
  }
};

export default function SOSRequestsPage() {
  const dispatch = useDispatch();
  const sosStore = useSelector((store) => store.sosStore);
  const { isAdmin } = useSelector((store) => store.authStore);
  // After const sosStore...
  const [localStatus, setLocalStatus] = useState({});

  useEffect(() => {
    dispatch(getEveryoneSos());
  }, [dispatch]);

  // Normalize data
  const [sos, setSos] = useState([]);

  useEffect(() => {
    if (sosStore?.allSos) {
      const normalized = sosStore.allSos.map((r) => ({
        id: r.id,
        userId: r.user_id || r.userId || "Unknown",
        message: r.message,
        latitude: r.latitude,
        longitude: r.longitude,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        status: r.sosStatus,
        zoneId: r.disasterZoneDto?.id || null,
        zoneName: r.disasterZoneDto?.name || "No Zone",
        disasterType: r.disasterZoneDto?.disasterType || "UNKNOWN",
        dangerLevel: r.disasterZoneDto?.dangerLevel || "N/A",
      }));
      setSos(normalized);

      // Initialize localStatus for each row
      const statusMap = {};
      normalized.forEach((r) => {
        statusMap[r.id] = r.status;
      });
      setLocalStatus(statusMap);
    }
  }, [sosStore?.allSos]);

  // Add request
  const [showAddModal, setShowAddModal] = useState(false);

  // Filters
  const statuses = ["PENDING", "COMPLETED", "HANDLING", "CANCELLED"];
  const typeOptions = [
  "",
  "LŨ LỤT",
  "BÃO/SIÊU BÃO",
  "SẠT LỞ ĐẤT",
  "CHÁY RỪNG",
  "CHÁY NHÀ",
  "MƯA ĐÁ",
  "NGẬP ÚNG",
  "HẠN HÁN"
  ];

  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [zoneNameFilter, setZoneNameFilter] = useState("");
  const [zoneIdFilter, setZoneIdFilter] = useState("");

  const hasZoneFilter = zoneNameFilter.trim() !== "" || zoneIdFilter.trim() !== "";

  const filtered = useMemo(
    () =>
      (sos || []).filter((r) => {
        const matchesZoneName = !zoneNameFilter || (r.zoneName || "").toLowerCase().includes(zoneNameFilter.toLowerCase());

        const matchesZoneId = !zoneIdFilter || String(r.zoneId || "") === zoneIdFilter.trim();

        if (zoneNameFilter && !matchesZoneName) return false;
        if (zoneIdFilter && !matchesZoneId) return false;

        const matchesType = hasZoneFilter ? true : !typeFilter || r.disasterType === typeFilter;

        const matchesStatus = !statusFilter || r.status === statusFilter;

        return matchesType && matchesStatus;
      }),
    [sos, typeFilter, statusFilter, zoneNameFilter, zoneIdFilter, hasZoneFilter]
  );

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => {
    setPage(1);
  }, [typeFilter, statusFilter, zoneNameFilter, zoneIdFilter]);
  const paginated = useMemo(() => filtered.slice((page - 1) * perPage, page * perPage), [filtered, page]);

  // Analytics
  const byStatus = useMemo(() => statuses.map((s) => ({ name: s, value: filtered.filter((r) => r.status === s).length })), [filtered]);
  const byType = useMemo(() => typeOptions.map((t) => ({ name: t, value: filtered.filter((r) => r.disasterType === t).length })), [filtered]);
  const topZones = useMemo(() => {
    const counts = filtered.reduce((acc, r) => {
      acc[r.zoneName] = (acc[r.zoneName] || 0) + 1;
      return acc;
    }, {});
    const risks = filtered.reduce((acc, r) => {
      const rank = r.dangerLevel === "HIGH" ? 3 : r.dangerLevel === "MEDIUM" ? 2 : 1;
      acc[r.zoneName] = Math.max(acc[r.zoneName] || 0, rank);
      return acc;
    }, {});
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([zone, count]) => ({ zone, count, risk: risks[zone] === 3 ? "HIGH" : risks[zone] === 2 ? "MEDIUM" : "LOW" }));
  }, [filtered]);

  const updateStatus = (id, next) => {
    dispatch(udpateSosStatus({ sosId: id, status: next })).then((result) => {
      if (udpateSosStatus.rejected.match(result)) {
        toast.error("Failed to update status");
      } else {
        toast.success("Status updated successfully");
      }
    });
  };

  // Interactive filter handlers from analytics
  const setFilterStatus = (s) => setStatusFilter((prev) => (prev === s ? "" : s));
  const setFilterType = (t) => setTypeFilter((prev) => (prev === t ? "" : t));
  const clearFilters = () => {
    setTypeFilter("");
    setStatusFilter("");
    setZoneNameFilter("");
    setZoneIdFilter("");
  };

  // Horizontal bar data with percentages
  const statusTotal = byStatus.reduce((sum, s) => sum + s.value, 0) || 1;
  const statusBarData = byStatus.map((s) => ({ name: s.name, count: s.value, pct: Math.round((s.value / statusTotal) * 100) }));
  const typeTotal = byType.reduce((sum, t) => sum + t.value, 0) || 1;
  const typeBarData = byType.map((t) => ({ name: t.name, count: t.value, pct: Math.round((t.value / typeTotal) * 100) }));

  const barColorForStatus = (name) => {
    switch (name) {
      case "PENDING":
        return "#ef4444"; // red
      case "HANDLING":
        return "#f59e0b"; // yellow
      case "COMPLETED":
        return "#10b981"; // green
      case "CANCELLED":
        return "#3b82f6"; // blue
      default:
        return "#94a3b8"; // gray fallback
    }
  };

  const barColorForType = (name) =>
    ({
        "LŨ LỤT": "#3b82f6",
        "BÃO/SIÊU BÃO": "#f59e0b",
        "SẠT LỞ ĐẤT": "#22c55e",
        "CHÁY RỪNG": "#fbbf24",
        "CHÁY NHÀ": "#06b6d4",
        "MƯA ĐÁ": "#ef4444",
        "NGẬP ÚNG": "#8b5cf6",
        "HẠN HÁN": "#b45309",
    }[name] || "#94a3b8");

  // Hover highlights
  const [hoverStatus, setHoverStatus] = useState(null);
  const [hoverType, setHoverType] = useState(null);

  const shade = (hex, factor = 0.85) => {
    const h = hex.replace("#", "");
    const r = Math.floor(parseInt(h.substring(0, 2), 16) * factor);
    const g = Math.floor(parseInt(h.substring(2, 4), 16) * factor);
    const b = Math.floor(parseInt(h.substring(4, 6), 16) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <section className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">Yêu cầu SOS</h1>
            <p className="mt-1 text-sm text-slate-400">Xem tất cả các yêu cầu SOS trên toàn Việt Nam</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                dispatch(getEveryoneSos()).then(() => {
                  if (sosStore?.allSos !== null) {
                    toast.info("All sos requests are up to date");
                  }
                });
              }}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 active:bg-indigo-900"
            >
              Tải lại
            </button>
            <button
              onClick={() => {
                setShowAddModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 shadow hover:bg-slate-700"
            >
              Thêm yêu cầu
            </button>
            <AddSosModal open={showAddModal} onClose={() => setShowAddModal(false)} />
          </div>
        </section>

        {/* Filters */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 shadow-lg p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Lọc theo tên khu vực</label>
              <input
                value={zoneNameFilter}
                onChange={(e) => setZoneNameFilter(e.target.value)}
                placeholder="e.g. Hà Nội"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Lọc theo ID khu vực</label>
              <input
                value={zoneIdFilter}
                onChange={(e) => setZoneIdFilter(e.target.value)}
                placeholder="e.g. 1"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Lọc theo loại thảm họa</label>
              <select
                value={hasZoneFilter ? "" : typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                disabled={hasZoneFilter}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  hasZoneFilter
                    ? "border-slate-800 bg-slate-900 text-slate-500 cursor-not-allowed"
                    : "border-slate-800 bg-slate-950 text-slate-200 focus:ring-indigo-600"
                }`}
              >
                <option value="" className="bg-slate-900">
                  Tất cả loại thảm họa
                </option>
                {typeOptions.map((t) => (
                  <option key={t} value={t} className="bg-slate-900">
                    {t}
                  </option>
                ))}
              </select>
              {hasZoneFilter && <div className="mt-1 text-[11px] text-slate-500">Bộ lọc loại thảm họa bị vô hiệu khi lọc theo khu vực</div>}
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Lọc theo trạng thái</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="" className="bg-slate-900">
                  Tất cả trạng thái
                </option>
                {statuses.map((s) => (
                  <option key={s} value={s} className="bg-slate-900">
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          </div>
        </section>

        {/* Map section */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 shadow-lg p-4">
          <h2 className="text-slate-100 text-xl font-bold mb-3 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-400" /> Tổng quan bản đồ Việt Nam
          </h2>
          <div className="h-[520px] rounded-lg overflow-hidden">
            <MapContainer center={[14.0583, 108.2772]} zoom={7} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
              {filtered.map((r) => (
                <Marker key={r.id} position={[r.latitude, r.longitude]} icon={statusToIcon(localStatus[r.id] || r.status)}>
                  <Popup>
                    <div className="text-xs space-y-1">
                      <div className="font-semibold text-slate-900">{r.message}</div>
                      <div className="text-slate-700">User ID: {r.userId}</div>
                      <div className="text-slate-700">Khu vực: {r.zoneName || "Not Assigned"}</div>
                      <div className="text-slate-700">
                        Type: {r.disasterType !== "UNKNOWN" ? r.disasterType : "N/A"} • Rủi ro: {r.dangerLevel}
                      </div>
                      <div className="text-slate-700">Trạng thái: {r.status}</div>
                      <div className="text-slate-700">{new Date(r.updatedAt).toLocaleString()}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          {/* Legend */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-xs text-slate-300 bg-slate-950/60 border border-slate-800 rounded-lg p-3">
              <div className="font-semibold text-slate-200 mb-2">Chú thích trạng thái</div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-red-500" /> Pending
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-yellow-400" /> Handling
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-green-500" /> Completed
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-blue-500" /> Cancelled
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-300 bg-slate-950/60 border border-slate-800 rounded-lg p-3">
              <div className="font-semibold text-slate-200 mb-2">Disaster Type Icons</div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1">{disasterIcon("LŨ LỤT")} Lũ lụt</span>
                <span className="inline-flex items-center gap-1">{disasterIcon("BÃO/SIÊU BÃO")} Bão/Siêu bão</span>
                <span className="inline-flex items-center gap-1">{disasterIcon("SẠT LỞ ĐẤT")} Sạt lở đất</span>
                <span className="inline-flex items-center gap-1">{disasterIcon("CHÁY RỪNG")} Cháy rừng</span>
                <span className="inline-flex items-center gap-1">{disasterIcon("CHÁY NHÀ")} Cháy nhà</span>
                <span className="inline-flex items-center gap-1">{disasterIcon("MƯA ĐÁ")} Mưa đá</span>
                <span className="inline-flex items-center gap-1">{disasterIcon("NGẬP ÚNG")} Ngập úng</span>
                <span className="inline-flex items-center gap-1">{disasterIcon("HẠN HÁN")} Hạn hán</span>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics with bars and rich zone cards */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column: bars */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-100 text-lg font-semibold">Theo trạng thái</h3>
                <span className="text-xs text-slate-400">Nhấn vào thanh để lọc</span>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusBarData} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" tickFormatter={(v) => `${v}`} stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ background: "#0f172a", border: "1px solid #334155", color: "#e2e8f0", fontSize: 12 }}
                      itemStyle={{ color: "#ffffff" }}
                      formatter={(value, name, props) => {
                        const count = statusBarData.find((s) => s.name === props.payload.name)?.count || 0;
                        return [`Count: ${count} (${props.payload.pct}%)`, props.payload.name];
                      }}
                    />

                    <Bar dataKey="pct" radius={[4, 4, 4, 4]} background={{ fill: "#0f172a" }} cursor="pointer">
                      {statusBarData.map((entry, index) => {
                        const base = barColorForStatus(entry.name);
                        const isActive = statusFilter === entry.name;
                        return <Cell key={index} fill={isActive ? base : shade(base, hoverStatus === entry.name ? 1.0 : 0.75)} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex items-center justify-end gap-4 text-xs text-slate-400">
                {statusBarData.map((s) => (
                  <span key={s.name} className="inline-flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: barColorForStatus(s.name) }}></span>
                    {s.name}: <span className="text-slate-300 font-medium">{s.count}</span> ({s.pct}%)
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-100 text-lg font-semibold">Theo loại thảm họa</h3>
                <span className="text-xs text-slate-400">Nhấn vào thanh để lọc</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeBarData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 11 }} angle={-20} textAnchor="end" height={50} />
                    <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ background: "#0f172a", border: "1px solid #334155", color: "#e2e8f0", fontSize: 12 }}
                      itemStyle={{ color: "#ffffff" }}
                      formatter={(v, n, p) => [`${v} (${p.payload.pct}%)`, p.payload.name]}
                    />
                    <Bar
                      dataKey="count"
                      radius={[4, 4, 0, 0]}
                      background={{ fill: "#0f172a" }}
                      cursor="pointer"
                      onClick={(d) => setFilterType(d.name)}
                    >
                      {typeBarData.map((entry, index) => {
                        const base = barColorForType(entry.name);
                        const isActive = typeFilter === entry.name;
                        return (
                          <Cell
                            key={`cell-t-${index}`}
                            fill={isActive ? base : shade(base, hoverType === entry.name ? 1.0 : 0.75)}
                            onMouseEnter={() => setHoverType(entry.name)}
                            onMouseLeave={() => setHoverType(null)}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-400">
                {typeBarData.map((t) => (
                  <span key={t.name} className="inline-flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded" style={{ backgroundColor: barColorForType(t.name) }}></span>
                    {t.name}: <span className="text-slate-300 font-medium">{t.count}</span> ({t.pct}%)
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Top zones rich cards */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-slate-100 text-lg font-semibold">5 khu vực hàng đầu</h3>
            {topZones.map((z, idx) => (
              <div
                key={z.zone}
                className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-slate-100 font-semibold">
                      {idx + 1}. {z.zone}
                    </div>
                    <div className="text-slate-400 text-sm">
                      Yêu cầu: <span className="text-slate-200 font-medium">{z.count}</span>
                    </div>
                  </div>
                  <span className={`${riskBadge(z.risk)} ml-3`}>{z.risk} Rủi ro</span>
                </div>
                {/* Mini sparkline (placeholder bars) */}
                <div className="mt-3 flex items-end gap-1 h-10">
                  {[...Array(10)].map((_, i) => {
                    const h = Math.floor((Math.sin((i + idx) * 1.3) + 1) * 20) + 5; // placeholder variability
                    return <span key={i} className="w-2 rounded bg-indigo-600/40" style={{ height: `${h}px` }}></span>;
                  })}
                </div>
              </div>
            ))}
            {topZones.length === 0 && <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-slate-400 text-sm">Không có dữ liệu</div>}
          </div>
        </section>

        {/* List of SOS Requests */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 shadow-lg p-4">
          <h2 className="text-slate-100 text-xl font-bold mb-3 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-400" /> Yêu cầu
          </h2>
          <div className="space-y-3">
            {paginated.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-100 text-sm font-semibold">
                      {disasterIcon(r.disasterType)} <span>{r.message}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">User ID: {r.userId}</div>
                    <div className="text-[11px] text-slate-400">
                      {r.zoneName !== "No Zone" ? `${r.zoneName} • ${r.disasterType}` : "Ngoài tất cả các khu vực"}
                    </div>
                    <div className="text-[11px] text-slate-500">{new Date(r.updatedAt).toLocaleString()}</div>
                    <div className="text-[11px] text-slate-400">
                      {r.zoneName !== "No Zone" ? `${r.zoneName} • ${r.disasterType}` : "Ngoài tất cả các khu vực"}
                    </div>
                    <span className={`${riskBadge(r.dangerLevel)} mt-1`}>{r.dangerLevel !== "N/A" ? `${r.dangerLevel} RISK` : "No Zone"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={statusBadge(localStatus[r.id] || r.status)}>{localStatus[r.id] || r.status}</span>

                    <select
                      value={localStatus[r.id] || r.status}
                      onChange={async (e) => {
                        if (!isAdmin) {
                          toast.error("Chỉ quản trị viên mới có thể cập nhật trạng thái");
                          return;
                        }
                        const nextStatus = e.target.value;

                        // Optimistic UI
                        setLocalStatus((prev) => ({ ...prev, [r.id]: nextStatus }));

                        // Call backend
                        const result = await dispatch(udpateSosStatus({ sosId: r.id, status: nextStatus }));

                        setLocalStatus((prev) => ({ ...prev, [r.id]: r.status }));
                        dispatch(getEveryoneSos());
                      }}
                      className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
                    >
                      {["PENDING", "HANDLING", "COMPLETED", "CANCELLED"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
            {paginated.length === 0 && <div className="text-slate-400 text-sm">Không tìm thấy yêu cầu nào.</div>}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center space-x-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-slate-700 bg-slate-900 hover:bg-slate-800 hover:text-slate-100 h-9 w-9 text-slate-300 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {(() => {
                const pages = [];
                const max = 5;
                if (totalPages <= max) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else if (page <= 3) {
                  pages.push(1, 2, 3, 4, "...", totalPages);
                } else if (page >= totalPages - 2) {
                  pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                } else {
                  pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
                }
                return pages;
              })().map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof p === "number" && setPage(p)}
                  disabled={p === "..."}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 w-9 ${
                    p === page
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-600"
                      : "border border-slate-700 bg-slate-900 hover:bg-slate-800 hover:text-slate-100 text-slate-300"
                  } ${p === "..." ? "cursor-default" : "cursor-pointer"}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-slate-700 bg-slate-900 hover:bg-slate-800 hover:text-slate-100 h-9 w-9 text-slate-300 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
