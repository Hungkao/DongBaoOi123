import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from "react-leaflet";
import { AlertTriangle, MapPin, Shield, Info, Droplets, Flame, Wind, Zap, CloudRain, Mountain, ArrowLeft } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
import L from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentActiveZone } from "../Redux/DisasterZone/Action";
import { toast } from "sonner";
import { getSosByZone } from "../Redux/SOS/Action";
import { getSafetyTips } from "../Redux/SafetyTips/Action";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ZonesDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const zoneId = parseInt(id);
  const dispatch = useDispatch();
  const disasterStore = useSelector((store) => store.disasterStore);
  const sosStore = useSelector((store) => store.sosStore);
  const safetyTipsStore = useSelector((store) => store.safetyTipsStore);

  useEffect(() => {
    dispatch(getCurrentActiveZone(zoneId)).then(() => {
      if (disasterStore?.currentZoneError !== null) {
        toast.error("Failed to fetch zone. Try again later");
      }
    });
  }, [zoneId, dispatch]);

  // Sample safety tips with extensive data
  useEffect(() => {
    dispatch(getSafetyTips(zoneId)).then(() => {
      if (safetyTipsStore?.safetyTipsError !== null) {
        toast.error("Could not load safety Tips.");
      }
    });
  }, [zoneId, dispatch]);

  // Sample SOS requests
  useEffect(() => {
    dispatch(getSosByZone(zoneId)).then(() => {
      if (sosStore?.zoneSosError !== null) {
        toast.error("Lấy dữ liệu yêu cầu SOS thất bại. Vui lòng thử lại sau.");
      }
    });
  }, [zoneId, dispatch]);

  const sosRequests = sosStore?.zoneSos || [];

  // Local state for SOS to allow status updates
  const [allSos, setAllSos] = useState(sosRequests);

  // Find the current zone or use default
  const currentZone = disasterStore?.currentZone || {
    id: zoneId,
    name: "Cập nhật khu vực lũ lụt ở Hà Nội",
    disasterType: "Lũ lụt",
    dangerLevel: "HIGH",
    centerLatitude: 19.08,
    centerLongitude: 72.88,
    radius: 20,
  };

  const sampleTips = safetyTipsStore?.safetyTips || [];

  // Tips filters
  const localTips = useMemo(() => sampleTips.filter((t) => t?.disasterZoneDto !== null), [sampleTips, zoneId, currentZone?.disasterType]);

  const generalTips = useMemo(() => sampleTips.filter((t) => t?.disasterZoneDto === null), [sampleTips, currentZone?.disasterType, zoneId]);

  // Pagination for tips (3 per page)
  const pageSize = 3;
  const [localPage, setLocalPage] = useState(1);
  const [generalPage, setGeneralPage] = useState(1);

  const localTotalPages = Math.max(1, Math.ceil(localTips.length / pageSize));
  const generalTotalPages = Math.max(1, Math.ceil(generalTips.length / pageSize));

  const paginatedLocalTips = useMemo(() => localTips.slice((localPage - 1) * pageSize, localPage * pageSize), [localTips, localPage]);

  const paginatedGeneralTips = useMemo(() => generalTips.slice((generalPage - 1) * pageSize, generalPage * pageSize), [generalTips, generalPage]);

  // Icons
  const getDisasterIcon = (type) => {
    switch (type) {
      case "LŨ LỤT":
        return <Droplets className="w-5 h-5 text-blue-400" />;
      case "BÃO/SIÊU BÃO":
        return <Mountain className="w-5 h-5 text-orange-400" />;
      case "SẠT LỞ ĐẤT":
        return <Mountain className="w-5 h-5 text-amber-400" />;
      case "CHÁY RỪNG":
        return <Flame className="w-5 h-5 text-red-500" />;
      case "CHÁY NHÀ":
        return <AlertTriangle className="w-5 h-5 text-pink-400" />;
      case "MƯA ĐÁ":
        return <CloudRain className="w-5 h-5 text-cyan-200" />;
      case "NGẬP ÚNG":
        return <Droplets className="w-5 h-5 text-indigo-400" />;
      case "HẠN HÁN":
        return <Wind className="w-5 h-5 text-purple-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-slate-300" />;
    }

  };

  const getDangerBadgeStyle = (level) => {
    switch (level) {
      case "HIGH":
        return "bg-red-900/30 text-red-300 ring-red-700/40";
      case "MEDIUM":
        return "bg-yellow-900/30 text-yellow-300 ring-yellow-700/40";
      case "LOW":
        return "bg-green-900/30 text-green-300 ring-green-700/40";
      default:
        return "bg-slate-800 text-slate-300 ring-slate-700";
    }
  };
  const getDisasterBorderColor = (type) => {
    switch (type) {
      case "LŨ LỤT":
        return "border-blue-400";
      case "BÃO/SIÊU BÃO":
        return "border-orange-400";
      case "SẠT LỞ ĐẤT":
        return "border-amber-400";
      case "CHÁY RỪNG":
        return "border-red-500";
      case "CHÁY NHÀ":
        return "border-pink-400";
      case "NGẬP ÚNG":
        return "border-indigo-400";
      case "MƯA ĐÁ":
        return "border-cyan-200"; // màu tượng trưng mưa đá/giông
      case "HẠN HÁN":
        return "border-purple-400";
      default:
        return "border-slate-400";
    }

  };

  // Bright status badge for SOS
  const sosBadgeClass = (status) => {
    const map = {
      PENDING: "bg-red-600/20 text-red-300 ring-red-500/40",
      HANDLING: "bg-yellow-600/20 text-yellow-300 ring-yellow-500/40",
      COMPLETED: "bg-green-600/20 text-green-300 ring-green-500/40",
      CANCELLED: "bg-slate-600/20 text-slate-300 ring-slate-500/40",
      ACKNOWLEDGED: "bg-yellow-600/20 text-yellow-300 ring-yellow-500/40",
      RESOLVED: "bg-green-600/20 text-green-300 ring-green-500/40",
    };
    const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset";
    return `${base} ${map[status] || "bg-slate-800 text-slate-300 ring-slate-700"}`;
  };

  // Pagination helpers (shadcn-like numeric)
  const getPageNumbers = (total, current) => {
    const pages = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (current > 3) pages.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  };

  const Pagination = ({ current, total, onChange }) => (
    <div className="mt-4 flex items-center justify-center space-x-1">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-slate-700 bg-slate-900 hover:bg-slate-800 hover:text-slate-100 h-9 w-9 text-slate-300 disabled:opacity-50"
      >
        ‹
      </button>
      {getPageNumbers(total, current).map((p, idx) => (
        <button
          key={idx}
          onClick={() => typeof p === "number" && onChange(p)}
          disabled={p === "..."}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 w-9 ${
            p === current
              ? "bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-600"
              : "border border-slate-700 bg-slate-900 hover:bg-slate-800 hover:text-slate-100 text-slate-300"
          } ${p === "..." ? "cursor-default" : "cursor-pointer"}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-slate-700 bg-slate-900 hover:bg-slate-800 hover:text-slate-100 h-9 w-9 text-slate-300 disabled:opacity-50"
      >
        ›
      </button>
    </div>
  );

  // Change SOS status handler (exclude Cancelled)
  const changeSosStatus = (id, next) => {
    setAllSos((prev) => prev.map((s) => (s.id === id ? { ...s, sosStatus: next, updatedAt: new Date().toISOString() } : s)));
  };

  function MapUpdater({ center }) {
    const map = useMap();
    if (center) {
      map.setView(center, 11); // update view when center changes
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="w-full rounded-2xl shadow-lg border border-slate-800 bg-slate-900 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/zones")}
                className="flex items-center space-x-2 text-slate-400 hover:text-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back to Zones</span>
              </button>
              <div className="flex items-center space-x-2">
                {getDisasterIcon(currentZone.disasterType)}
                <h1 className="text-slate-100 text-2xl font-bold">{currentZone.name}</h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-300 text-lg font-semibold capitalize">{currentZone?.disasterType?.replace("_", " ")}</span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${getDangerBadgeStyle(
                    currentZone?.dangerLevel
                  )}`}
                >
                  {currentZone.dangerLevel} Rủi ro
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <MapPin className="w-5 h-5" />
              <span className="text-sm">
                {currentZone?.centerLatitude?.toFixed(4)}, {currentZone?.centerLongitude?.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Full-width Map */}
        <div className="bg-slate-800 rounded-xl shadow p-6 mb-8">
          <h2 className="text-slate-100 text-2xl font-bold flex items-center mb-4">
            <MapPin className="w-6 h-6 mr-3 text-blue-400" />
            Bản đồ khu vực
          </h2>
          <div className="h-96 bg-slate-800 rounded-xl overflow-hidden">
            <MapContainer
              center={[currentZone.centerLatitude, currentZone.centerLongitude]}
              zoom={11}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
              className="rounded-xl"
            >
              <MapUpdater center={[currentZone.centerLatitude, currentZone.centerLongitude]} />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
              <Marker position={[currentZone.centerLatitude, currentZone.centerLongitude]}>
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold text-slate-900">{currentZone.name}</h3>
                    <p className="text-sm text-slate-600">{currentZone.disasterType.replace("_", " ")}</p>
                    <p className="text-sm text-slate-600">Bán kính: {currentZone.radius} km</p>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[currentZone.centerLatitude, currentZone.centerLongitude]}
                radius={currentZone.radius * 1000}
                pathOptions={{
                  color: currentZone.dangerLevel === "HIGH" ? "#ef4444" : currentZone.dangerLevel === "MEDIUM" ? "#f59e0b" : "#10b981",
                  fillColor: currentZone.dangerLevel === "HIGH" ? "#fecaca" : currentZone.dangerLevel === "MEDIUM" ? "#fef3c7" : "#d1fae5",
                  fillOpacity: 0.2,
                }}
              />

              {/* SOS markers */}
              {sosRequests.map((s) => (
                <Marker
                  key={s.id}
                  position={[s.latitude, s.longitude]}
                  icon={L.icon({
                    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
                    iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                  })}
                >
                  <Popup>
                    <div className="space-y-1">
                      <div className="text-xs text-slate-700">{s.message}</div>
                      <div className="text-[11px] text-slate-500">
                        {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {s.sosStatus} • {new Date(s.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Tips two columns below */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Local Tips */}
          <div className="bg-slate-800 rounded-xl shadow p-6 flex flex-col min-h-80">
            <h2 className="text-slate-100 text-2xl font-bold flex items-center mb-6">
              <Shield className="w-6 h-6 mr-3 text-yellow-400" />
              Mẹo an toàn tại địa phương
            </h2>
            <div className="space-y-4">
              {localTips.length === 0 && (
                <div className="text-center mt-17 text-amber-500 text-lg">
                  <p>Chưa có mẹo an toàn riêng cho khu vực nào.</p>
                  <p>Tìm nơi trú ẩn gần nhất và chờ cứu hộ.</p>
                </div>
              )}
              {paginatedLocalTips.map((tip) => (
                <div
                  key={tip.id}
                  className={`bg-slate-800 hover:bg-slate-700 transition rounded-xl shadow p-4 border-l-4 ${getDisasterBorderColor(
                    tip.disasterType
                  )}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">{getDisasterIcon(tip.disasterType)}</div>
                    <div className="flex-1">
                      <h3 className="text-slate-300 text-lg font-semibold mb-2">{tip.title}</h3>
                      <p className="text-slate-400 text-sm">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto">
              {localTips.length > 3 && <Pagination current={localPage} total={localTotalPages} onChange={setLocalPage} />}
            </div>
          </div>

          {/* Right: General Tips */}
          <div className="bg-slate-800 rounded-xl shadow p-6 flex flex-col min-h-80">
            <h2 className="text-slate-100 text-2xl font-bold flex items-center mb-6">
              <Info className="w-6 h-6 mr-3 text-green-400" />
              Mẹo an toàn chung
            </h2>
            <div className="space-y-4">
              {generalTips.length === 0 && (
                <div className="text-center mt-17 text-amber-500 text-lg">
                  <p>Chưa có mẹo an toàn chung nào.</p>
                  <p>Tìm nơi trú ẩn gần nhất và chờ cứu hộ.</p>
                </div>
              )}
              {paginatedGeneralTips.map((tip) => (
                <div
                  key={tip.id}
                  className={`bg-slate-800 hover:bg-slate-700 transition rounded-xl shadow p-4 border-l-4 ${getDisasterBorderColor(
                    tip.disasterType
                  )}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Info className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-slate-300 text-lg font-semibold mb-2">{tip.title}</h3>
                      <p className="text-slate-400 text-sm">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto">
              {generalTips.length > 3 && <Pagination current={generalPage} total={generalTotalPages} onChange={setGeneralPage} />}
            </div>
          </div>
        </div>

        {/* SOS Requests List under tips */}
        <div className="mt-8 bg-slate-800 rounded-xl shadow p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-slate-100 text-2xl font-bold flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
              Yêu cầu SOS
            </h2>
            <button
              onClick={() => navigate("/sos")}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700"
            >
              Xem tất cả yêu cầu SOS
            </button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {sosRequests.length === 0 && <div className="text-slate-400 text-sm">Không có yêu cầu SOS nào cho khu vực này.</div>}
            {sosRequests.map((s) => (
              <div key={s.id} className="rounded-lg border-l-4 border-red-500 bg-slate-900/60 p-4 shadow hover:bg-slate-900">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-300">{s.message}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {s.sosStatus} • {new Date(s.updatedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={sosBadgeClass(s.sosStatus)}>{s.sosStatus}</span>
                    <select
                      className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
                      value={s.sosStatus}
                      onChange={(e) => changeSosStatus(s.id, e.target.value)}
                    >
                      {["PENDING", "HANDLING", "COMPLETED"].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone Information Stats */}
        <div className="mt-8">
          <h2 className="text-slate-100 text-2xl font-bold flex items-center mb-6">
            <AlertTriangle className="w-6 h-6 mr-3 text-slate-400" />
            Thống kê khu vực
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-700/30 rounded-xl p-6 hover:from-blue-900/30 hover:to-blue-800/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-100">{currentZone.radius} km</div>
                  <div className="text-slate-400 text-sm mt-1">Bán kính ảnh hưởng</div>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <MapPin className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-700/30 rounded-xl p-6 hover:from-yellow-900/30 hover:to-yellow-800/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-100">{localTips.length}</div>
                  <div className="text-slate-400 text-sm mt-1">Mẹo an toàn địa phương</div>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <Shield className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-700/30 rounded-xl p-6 hover:from-green-900/30 hover:to-green-800/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-100">{generalTips.length}</div>
                  <div className="text-slate-400 text-sm mt-1">Mẹo an toàn chung</div>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Info className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-rose-900/20 to-rose-800/10 border border-rose-700/30 rounded-xl p-6 hover:from-rose-900/30 hover:to-rose-800/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-100">{sosRequests.length}</div>
                  <div className="text-slate-400 text-sm mt-1">Yêu cầu SOS</div>
                </div>
                <div className="p-3 bg-rose-500/20 rounded-lg">
                  <AlertTriangle className="w-8 h-8 text-rose-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZonesDetailsPage;
