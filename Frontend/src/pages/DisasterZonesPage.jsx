import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Plus, X, Pencil, Trash2, Map as MapIcon, Filter, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createDisasterZone, deleteDisasterZone, getAllDisasterZones, udpateDisasterZone } from "../Redux/DisasterZone/Action.js";
import { toast } from "sonner";
import RestrictedButton from "../components/RestrictedButton.jsx";

// Ensure Leaflet default marker icons render in bundlers
function useLeafletDefaultIcon() {
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);
}

const dangerBadgeClass = (level) => {
  const map = {
    HIGH: "bg-red-900/30 text-red-300 ring-red-700/40",
    MEDIUM: "bg-yellow-900/30 text-yellow-300 ring-yellow-700/40",
    LOW: "bg-green-900/30 text-green-300 ring-green-700/40",
  };
  return `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
    map[level] || "bg-slate-800 text-slate-300 ring-slate-700"
  }`;
};

const circleStyleForDanger = (level) => {
  switch (level) {
    case "HIGH":
      return { color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.4 };
    case "MEDIUM":
      return { color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 0.3 };
    case "LOW":
      return { color: "#10b981", fillColor: "#10b981", fillOpacity: 0.2 };
    default:
      return { color: "#64748b", fillColor: "#64748b", fillOpacity: 0.2 };
  }
};

function MiniZoneMap({ lat, lng, radiusKm = 5, dangerLevel = "LOW" }) {
  useLeafletDefaultIcon();
  const position = [lat, lng];
  return (
    <div className="h-40 w-full overflow-hidden rounded-lg relative z-0">
      <MapContainer center={position} zoom={8} scrollWheelZoom={false} className="h-full w-full" style={{ zIndex: 1 }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          subdomains={["a", "b", "c"]}
        />
        <Marker position={position} />
        <Circle center={position} radius={radiusKm * 1000} pathOptions={circleStyleForDanger(dangerLevel)} />
      </MapContainer>
    </div>
  );
}

function Modal({ title, children, onClose, footer }) {
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          <button onClick={onClose} className="rounded-md p-1 text-slate-300 hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-4 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-800 px-4 py-3">{footer}</div>}
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <>
      <style>{`
        .pagination-container {
          --background: 0 0% 3.9%;
          --foreground: 0 0% 98%;
          --card: 0 0% 3.9%;
          --card-foreground: 0 0% 98%;
          --popover: 0 0% 3.9%;
          --popover-foreground: 0 0% 98%;
          --primary: 0 0% 98%;
          --primary-foreground: 0 0% 9%;
          --secondary: 0 0% 14.9%;
          --secondary-foreground: 0 0% 98%;
          --muted: 0 0% 14.9%;
          --muted-foreground: 0 0% 63.9%;
          --accent: 0 0% 14.9%;
          --accent-foreground: 0 0% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 0 0% 98%;
          --border: 0 0% 14.9%;
          --input: 0 0% 14.9%;
          --ring: 0 0% 83.1%;
        }
      `}</style>
      <div className="pagination-container flex items-center justify-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-700 bg-slate-900 hover:bg-slate-800 hover:text-slate-100 h-10 w-10 text-slate-300"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Quay lại trang trước</span>
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border h-10 w-10 ${
              page === currentPage
                ? "bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600"
                : "bg-slate-900 hover:bg-slate-800 hover:text-slate-100 border-slate-700 text-slate-300"
            } ${page === "..." ? "cursor-default" : "cursor-pointer"}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-700 bg-slate-900 hover:bg-slate-800 hover:text-slate-100 h-10 w-10 text-slate-300"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Sang trang kế tiếp</span>
        </button>
      </div>
    </>
  );
}

function DisasterZonesPage() {
  useLeafletDefaultIcon();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // list all disaster zones
  const disasterStore = useSelector((store) => store.disasterStore);
  useEffect(() => {
    dispatch(getAllDisasterZones());
  }, [dispatch]);

  // Placeholder dataset
  const [zones, setZones] = useState([]);

  useEffect(() => {
    if (disasterStore?.allZones) {
      setZones(disasterStore.allZones);
    }
  }, [disasterStore.allZones]);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dangerFilter, setDangerFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeZone, setActiveZone] = useState(null);

  // Form state for Add/Edit
  const [form, setForm] = useState({
    name: "",
    disasterType: "Lũ lụt",
    dangerLevel: "LOW",
    centerLatitude: "",
    centerLongitude: "",
    radius: "",
  });

  const filteredZones = useMemo(() => {
    return zones.filter((z) => {
      const matchesSearch = z.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = !typeFilter || z.disasterType === typeFilter;
      const matchesDanger = !dangerFilter || z.dangerLevel === dangerFilter;
      return matchesSearch && matchesType && matchesDanger;
    });
  }, [zones, search, typeFilter, dangerFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredZones.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedZones = filteredZones.slice(startIndex, endIndex);

  function resetFilters() {
    setSearch("");
    setTypeFilter("");
    setDangerFilter("");
    setCurrentPage(1);
  }

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, dangerFilter]);

  function openAdd() {
    setForm({ name: "", disasterType: "Lũ lụt", dangerLevel: "LOW", centerLatitude: "", centerLongitude: "", radius: "" });
    setIsAddOpen(true);
  }
  function openEdit(zone) {
    setActiveZone(zone);
    setForm({
      name: zone.name,
      disasterType: zone.disasterType,
      dangerLevel: zone.dangerLevel,
      centerLatitude: String(zone.centerLatitude),
      centerLongitude: String(zone.centerLongitude),
      radius: String(zone.radius),
    });
    setIsEditOpen(true);
  }
  function openDelete(zone) {
    setActiveZone(zone);
    setIsDeleteOpen(true);
  }

  function handleSave() {
    const newZone = {
      name: form.name.trim() || "Khu vực mới",
      disasterType: form.disasterType,
      dangerLevel: form.dangerLevel,
      centerLatitude: parseFloat(form.centerLatitude) || 0,
      centerLongitude: parseFloat(form.centerLongitude) || 0,
      radius: parseFloat(form.radius) || 1,
    };
    dispatch(createDisasterZone(newZone))
      .then(() => {
        dispatch(getAllDisasterZones());
        toast.success(`Khu vực "${newZone.name}" created successfully`);
        setIsAddOpen(false);
      })
      .catch((err) => {
        toast.error("Tạo khu vực thất bại. Vui lòng thử lại");
      });
  }

  function handleUpdate() {
    if (!activeZone) return;
    const updatedZone = {
      name: form.name.trim() || z.name,
      disasterType: form.disasterType,
      dangerLevel: form.dangerLevel,
      centerLatitude: parseFloat(form.centerLatitude) || z.centerLatitude,
      centerLongitude: parseFloat(form.centerLongitude) || z.centerLongitude,
      radius: parseFloat(form.radius) || z.radius,
    };

    dispatch(udpateDisasterZone({ zoneData: updatedZone, id: activeZone.id }))
      .then(() => {
        dispatch(getAllDisasterZones());
        if (disasterStore?.udpateZoneError == null) {
          toast.success(`Khu vực "${updatedZone.name}" updated successfully`);
        }
        setIsEditOpen(false);
      })
      .catch((err) => {
        toast.error("Cập nhật khu vực thất bại. Vui lòng thử lại");
      });
  }

  function handleDelete() {
    if (!activeZone) return;
    dispatch(deleteDisasterZone(activeZone.id))
      .then(() => {
        dispatch(getAllDisasterZones());
        if (disasterStore?.deleteZoneError == null) {
          toast.success("Xóa khu vực thành công");
        }
        setIsDeleteOpen(false);
      })
      .catch((error) => {
        toast.error("Xóa khu vực thất bại. Vui lòng thử lại");
      });
  }

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

  const dangerOptions = ["", "LOW", "MEDIUM", "HIGH"];

  return (
    <div className="min-h-screen bg-slate-950">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">Quản lí khu vực thảm họa</h1>
              <p className="mt-1 text-sm text-slate-400">View, add, and manage khuu vực thảm họa</p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700"
            >
              Back to Dashboard
            </button>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 shadow-lg p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <label className="sr-only">Tìm kiếm theo tên khu vực</label>
              <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus-within:ring-2 focus-within:ring-indigo-600">
                <Filter className="mr-2 h-4 w-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm theo tên khu vực"
                  className="w-full bg-transparent outline-none placeholder:text-slate-500"
                />
              </div>
            </div>
            <div>
              <label className="sr-only">Lọc theo loại thảm họa</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                {typeOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-900">
                    {opt || "Lọc theo loại thảm họa"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="sr-only">Lọc theo mức độ nguy hiểm</label>
              <select
                value={dangerFilter}
                onChange={(e) => setDangerFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                {dangerOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-900">
                    {opt || "Lọc theo mức độ nguy hiểm"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetFilters}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
              >
                Làm mới bộ lọc
              </button>
            </div>
            <div className="flex items-center justify-end lg:col-span-1">
              <button
                onClick={openAdd}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4" /> Khu vực mới
              </button>
            </div>
          </div>
        </section>

        {/* Zones Grid */}
        {disasterStore?.allZonesError && <p className="text-red-500 text-center">Có lỗi xảy ra! Vui lòng làm mới trang</p>}
        {disasterStore?.allZonesLoading && <p className="text-green-500 text-center">Đang lấy tất cả các khu vực đang hoạt động…</p>}
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedZones.map((z) => (
              <div key={z.id} className="group rounded-2xl border border-slate-800 bg-slate-900 shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-4">
                  <div
                    className="flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-800/50 rounded-lg p-2 -m-2 transition-colors"
                    onClick={() => navigate(`/zones/${z.id}`)}
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{z.name}</div>
                      <div className="text-xs text-slate-400">{z.disasterType}</div>
                    </div>
                    <span className={dangerBadgeClass(z.dangerLevel)}>{z.dangerLevel}</span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div>
                      <div className="text-slate-400">Tâm (vĩ độ, kinh độ)</div>
                      <div>
                        {z.centerLatitude.toFixed(4)}, {z.centerLongitude.toFixed(4)}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">Bán kính</div>
                      <div>{z.radius} km</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <MiniZoneMap lat={z.centerLatitude} lng={z.centerLongitude} radiusKm={z.radius} dangerLevel={z.dangerLevel} />
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(z)}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Chỉnh sửa
                      </button>
                      <button
                        onClick={() => openDelete(z)}
                        className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Xóa
                      </button>
                    </div>
                    <button
                      onClick={() => navigate(`/zones/${z.id}`)}
                      className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                      <Eye className="h-3.5 w-3.5" /> Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </section>
      </main>

      {/* Add Zone Modal */}
      {isAddOpen && (
        <Modal
          title="Add Zone"
          onClose={() => setIsAddOpen(false)}
          footer={
            <>
              <button
                onClick={() => setIsAddOpen(false)}
                className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button onClick={handleSave} className="rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700">
                {disasterStore?.createZoneLoading || disasterStore?.updateZoneLoading ? "Processing" : "Save"}
              </button>
            </>
          }
        >
          {/* Simple form fields */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-300">Tên</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300">Loại thảm họa</label>
              <select
                value={form.disasterType}
                onChange={(e) => setForm({ ...form, disasterType: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              >
                {typeOptions.filter(Boolean).map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-900">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300">Mức độ nguy hiểm</label>
              <select
                value={form.dangerLevel}
                onChange={(e) => setForm({ ...form, dangerLevel: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              >
                {dangerOptions.filter(Boolean).map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-900">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300">Kinh độ</label>
              <input
                value={form.centerLatitude}
                onChange={(e) => setForm({ ...form, centerLatitude: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300">Vĩ độ</label>
              <input
                value={form.centerLongitude}
                onChange={(e) => setForm({ ...form, centerLongitude: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300">Bán kính (km)</label>
              <input
                value={form.radius}
                onChange={(e) => setForm({ ...form, radius: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Zone Modal */}
      {isEditOpen && (
        <Modal
          title="Edit Zone"
          onClose={() => setIsEditOpen(false)}
          footer={
            <>
              <button
                onClick={() => setIsEditOpen(false)}
                className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800"
              >
                Hủy
              </button>
              <RestrictedButton
                onClick={handleUpdate}
                className="rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
              >
                Cập nhật
              </RestrictedButton>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-300">Tên</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300">Loại thảm họa</label>
              <select
                value={form.disasterType}
                onChange={(e) => setForm({ ...form, disasterType: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              >
                {typeOptions.filter(Boolean).map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-900">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300">Mức độ nguy hiểm</label>
              <select
                value={form.dangerLevel}
                onChange={(e) => setForm({ ...form, dangerLevel: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              >
                {dangerOptions.filter(Boolean).map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-900">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300">Kinh độ</label>
              <input
                value={form.centerLatitude}
                onChange={(e) => setForm({ ...form, centerLatitude: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300">Vĩ độ</label>
              <input
                value={form.centerLongitude}
                onChange={(e) => setForm({ ...form, centerLongitude: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300">Bán kính (km)</label>
              <input
                value={form.radius}
                onChange={(e) => setForm({ ...form, radius: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <Modal
          title="Delete Zone"
          onClose={() => setIsDeleteOpen(false)}
          footer={
            <>
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800"
              >
                Cancel
              </button>
              <RestrictedButton
                disabled={disasterStore?.deleteZoneLoading}
                onClick={handleDelete}
                className="rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
              >
                {disasterStore?.deleteZoneLoading ? "Processing" : "Confirm"}
              </RestrictedButton>
            </>
          }
        >
          <p className="text-sm text-slate-300">Bạn có chắc muốn xóa khu vực này ?</p>
        </Modal>
      )}
    </div>
  );
}

export default DisasterZonesPage;
