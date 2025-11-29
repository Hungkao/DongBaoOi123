import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { createSosRequest } from "../../Redux/SOS/Action";

export default function AddSosModal({ open, onClose }) {
  const dispatch = useDispatch();
  const sosStore = useSelector((store) => store.sosStore);

  const [message, setMessage] = useState("");
  const [disasterType, setDisasterType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message || !disasterType) {
      toast.error("Please enter a message and select a disaster type");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const payload = {
          message,
          disasterType,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };

        try {
          await dispatch(createSosRequest(payload)); // enable once endpoint is ready
          if (sosStore?.createSosError !== null) {
            toast.success("SOS Sent!");
          }
          onClose();
        } catch (err) {
          toast.error("Could not send SOS request");
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.error("Could not fetch your current location");
        setLoading(false);
      }
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="relative w-full max-w-md rounded-xl bg-slate-900 p-6 border border-slate-700 shadow-lg z-10">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Yêu cầu SOS mới</h2>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your emergency..."
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 mb-3"
        />

        <select
          value={disasterType}
          onChange={(e) => setDisasterType(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 mb-4"
        >
          <option value="">Chọn loại thảm họa</option>
          {["LŨ LỤT", "CHÁY NHÀ", "SẠT LỞ ĐẤT", "BÃO/SIÊU BÃO", "HỐ SỤT ĐẤT", "TRIỀU CƯỜNG", "CHÁY RỪNG", "MƯA ĐÁ"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-800 text-slate-200 hover:bg-slate-700">
            Hủy 
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send SOS"}
          </button>
        </div>
      </div>
    </div>
  );
}
