import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon paths for Leaflet when bundling
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

const statusBadgeClass = (status) => {
  const map = {
    HIGH: "bg-red-100 text-red-800 ring-red-200",
    MEDIUM: "bg-yellow-100 text-yellow-800 ring-yellow-200",
    LOW: "bg-green-100 text-green-800 ring-green-200",
  };
  return `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
    map[status] || "bg-gray-100 text-gray-800 ring-gray-200"
  }`;
};

function getCircleStyle(dangerLevel) {
  const styles = {
    HIGH: { color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.4 },
    MEDIUM: { color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 0.3 },
    LOW: { color: "#10b981", fillColor: "#10b981", fillOpacity: 0.2 },
  };
  return styles[dangerLevel] || { color: "#64748b", fillColor: "#64748b", fillOpacity: 0.2 };
}

function MapOverview({ zones = [] }) {
  useLeafletDefaultIcon();
  const hasZones = Array.isArray(zones) && zones.length > 0;

  return (
    <div className="w-full rounded-2xl shadow-lg border border-slate-800 bg-slate-900 p-4">
      <div className="mb-1">
        <h3 className="text-sm font-semibold text-slate-100">Tổng quan bản đồ</h3>
        <p className="text-xs text-slate-400">Phân bố địa lý của các khu vực thảm họa ở Việt Nam</p>
      </div>

      {!hasZones ? (
        <div className="mt-3 h-[32rem] w-full rounded-xl bg-slate-800 grid place-items-center text-slate-400">Không có khu vực nào</div>
      ) : (
        <div className="mt-3 h-[32rem] w-full overflow-hidden rounded-xl">
          <MapContainer center={[14.0583, 108.2772]} zoom={7} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              subdomains={["a", "b", "c"]}
            />
            {zones.map((z) => (
              <Marker key={z.id} position={[z.centerLatitude, z.centerLongitude]}>
                <Popup>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-slate-900">{z.name}</div>
                    <div className="text-xs text-slate-700">Type: {z.disasterType || "Unknown"}</div>
                    <div className="text-xs">
                      Nguy hiểm: <span className={statusBadgeClass(z.dangerLevel)}>{z.dangerLevel || "Unknown"}</span>
                    </div>
                  </div>
                </Popup>
                <Circle center={[z.centerLatitude, z.centerLongitude]} radius={(z.radius || 0) * 1000} pathOptions={getCircleStyle(z.dangerLevel)} />
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default MapOverview;
