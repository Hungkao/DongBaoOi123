import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import SOSTableRow from "../components/SOSTableRow";
import ZoneActivityChart from "../components/ZoneActivityChart";
import MapOverview from "../components/MapOverview";
import { ShieldAlert, Activity, Map as MapIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getDashboardSummay, getRecentSos, getZoneActivity } from "../Redux/Dashboard/Action";
import { p } from "framer-motion/client";
import { getAllDisasterZones } from "../Redux/DisasterZone/Action";

function DashboardPage() {
  const dispatch = useDispatch();
  const dashboardStore = useSelector((store) => store.dashboardStore);
  const disasterStore = useSelector((store) => store.disasterStore);

  // GET STATS FOR THE DASHBOARD
  useEffect(() => {
    dispatch(getDashboardSummay());
  }, [dispatch]);

  const { totalZones = 0, activeDisasters = 0, criticalZones = 0, pendingSos = 0 } = dashboardStore.dashboardSummary || {};

  const statCards = [
    { title: "Tổng số loại thảm họa", value: totalZones, subtitle: "Các thảm họa được theo dõi", color: "blue", icon: "map" },
    { title: "Các khu vực thảm họa đang hoạt động", value: activeDisasters, subtitle: "Các tình huống khẩn cấp đang diễn ra", color: "yellow", icon: "alert-triangle" },
    { title: "Khu vực nguy cấp", value: criticalZones, subtitle: "Khu vực rủi ro cao", color: "red", icon: "flame" },
    { title: "Yêu cầu SOS", value: pendingSos, subtitle: "Các phản hồi đang chờ", color: "green", icon: "life-buoy" },
  ];

  // GET RECENT SOS FOR THE DASHBOARD
  useEffect(() => {
    dispatch(getRecentSos());
  }, [dispatch]);

  const sosRows = dashboardStore?.listSos?.slice(0, 9) || [];

  // ZONE ACTIVITY
  useEffect(() => {
    dispatch(getZoneActivity());
  }, [dispatch]);

  const zoneStats = dashboardStore?.stats || {};
  const zoneActivityData =
    zoneStats?.dates?.map((date, index) => ({
      date,
      activeDisasters: zoneStats?.activeDisasters[index] ?? 0,
      sosRequests: zoneStats?.sosCounts[index] ?? 0,
    })) || [];

  // GET ALL DISASTER ZONES FOR THE MAP.
  useEffect(() => {
    dispatch(getAllDisasterZones());
  }, []);

  const sampleZones = disasterStore?.allZones || [];

  return (
    <div className="min-h-screen bg-slate-950">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Section */}
        <section>
          <div className="flex items-start gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-100">Quản lý thảm họa</h1>
              <p className="mt-1 text-sm text-slate-400">Tổng quan về các khu vực đang hoạt động và các yêu cầu SOS</p>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section>
          {dashboardStore.summaryLoading && <p className="text-amber-400 mb-4 mt-0 text-center">Đang cập nhật số liệu…</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s) => (
              <StatsCard key={s.title} title={s.title} value={s.value} subtitle={s.subtitle} color={s.color} icon={s.icon} />
            ))}
          </div>
        </section>

        {/* Two-Column Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Recent SOS Requests */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-800/60 flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-slate-100">Các yêu cầu SOS gần đây</h2>
                {dashboardStore.loadingSos && <p className="text-slate-500 text-sm">Đang cập nhật...</p>}
              </div>
              <div className="px-4 py-2 text-xs text-slate-400">Các yêu cầu khẩn cấp mới nhất từ các khu vực bị ảnh hưởng</div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800">
                  <thead className="bg-slate-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Vĩ độ</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">King độ</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Lời nhắn</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Thời gian</th>
                      {/* <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Action</th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {sosRows.map((r, idx) => (
                      <SOSTableRow key={idx} {...r} onResolve={() => {}} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Zone Activity and Quick Actions */}
          <div>
            <ZoneActivityChart data={zoneActivityData} />
            {/* Quick Actions (separate card) */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 shadow-lg p-4">
              <div className="mb-1">
                <h2 className="text-sm font-semibold text-slate-100">Hành động nhanh</h2>
                <p className="text-xs text-slate-400">Các hành động ứng phó khẩn cấp phổ biến</p>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2">
                <Link
                  to="/zones"
                  className="group flex items-center gap-3 rounded-xl border border-blue-900/50 bg-blue-950/40 px-3 py-2 hover:bg-blue-950/60 focus:outline-none focus:ring-2 focus:ring-blue-700/50"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-blue-300 ring-1 ring-blue-900/60">
                    <MapIcon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-slate-100">Xem tất cả các khu vực</span>
                    <span className="block text-xs text-slate-400">Khu vực thảm họa</span>
                  </span>
                </Link>

                <Link
                  to="/report"
                  className="group flex items-center gap-3 rounded-xl border border-emerald-900/50 bg-emerald-950/40 px-3 py-2 hover:bg-emerald-950/60 focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-emerald-300 ring-1 ring-emerald-900/60">
                    {/* Using MapIcon as placeholder in this snippet */}
                    <MapIcon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-slate-100">Báo cáo SOS</span>
                    <span className="block text-xs text-slate-400">Cứu trợ khẩn cấp</span>
                  </span>
                </Link>

                <Link
                  to="/contacts"
                  className="group flex items-center gap-3 rounded-xl border border-amber-900/50 bg-amber-950/40 px-3 py-2 hover:bg-amber-950/60 focus:outline-none focus:ring-2 focus:ring-amber-700/50"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-amber-300 ring-1 ring-amber-900/60">
                    <MapIcon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-slate-100">Liên hệ khẩn cấp</span>
                    <span className="block text-xs text-slate-400">Nhân sự chính</span>
                  </span>
                </Link>

                <Link
                  to="/sos"
                  className="group flex items-center gap-3 rounded-xl border border-indigo-900/50 bg-indigo-950/40 px-3 py-2 hover:bg-indigo-950/60 focus:outline-none focus:ring-2 focus:ring-indigo-700/50"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-indigo-300 ring-1 ring-indigo-900/60">
                    <MapIcon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-slate-100">Tất cả các yêu cầu SOS</span>
                    <span className="block text-xs text-slate-400">Xem đầy đủ</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Full-Width Map Overview */}
        <section>
          <MapOverview zones={sampleZones} />
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-500 py-6">DongBaoOi© 2025</footer>
      </main>
    </div>
  );
}

export default DashboardPage;
