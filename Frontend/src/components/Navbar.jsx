import React, { useState } from "react";
import { Menu, User, LogOut, ChevronDown, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LOGOUT } from "../Redux/Auth/ActionType";
import { useDispatch, useSelector } from "react-redux";

function Navbar() {
  const [open, setOpen] = useState(false); // profile dropdown
  const [sidebar, setSidebar] = useState(false); // mobile sidebar
  const location = useLocation();
  const dispatch = useDispatch();
  const { email } = useSelector((store) => store.authStore);
  const navigate = useNavigate();

  const linkBase = "block rounded-md px-3 py-2 text-sm font-medium";
  const active = "bg-blue-700 text-white";
  const inactive = "text-gray-700 hover:bg-gray-100";

  return (
    <nav className="sticky top-0 z-9999 w-full border-b border-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile only) */}
            <button className="sm:hidden" onClick={() => setSidebar(true)}>
              <Menu className="h-6 w-6 text-white/90" />
            </button>

            <span className="text-lg sm:text-xl font-semibold tracking-tight text-white">DONGBAOOI</span>

            {/* Desktop Links */}
            <div className="hidden sm:flex items-center gap-2 ml-4">
              <Link to="/" className={`${linkBase} ${location.pathname === "/" ? active : "text-white/90 hover:bg-white/15"}`}>
                Dashboard
              </Link>
              <Link to="/zones" className={`${linkBase} ${location.pathname.startsWith("/zones") ? active : "text-white/90 hover:bg-white/15"}`}>
                Vùng thảm họa
              </Link>
              <Link to="/sos" className={`${linkBase} ${location.pathname.startsWith("/sos") ? active : "text-white/90 hover:bg-white/15"}`}>
                Yêu cầu SOS
              </Link>
            </div>
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white shadow-sm ring-1 ring-white/20 hover:bg-white/15"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-blue-700 text-xs font-semibold">
                {email[0]?.toUpperCase()}
              </span>
              <span className="hidden sm:inline">{email.split("@")[0].toUpperCase()}</span>
              <ChevronDown className="h-4 w-4 text-white/90" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                >
                  <User className="h-4 w-4" /> Profile
                </button>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => dispatch({ type: LOGOUT })}
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebar && (
        <div className="fixed inset-0 z-50 flex">
          {/* Sidebar */}
          <div className="w-64 bg-slate-950 shadow-lg p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Menu</h2>
              <button onClick={() => setSidebar(false)}>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              <Link to="/" onClick={() => setSidebar(false)} className={`${linkBase} ${location.pathname === "/" ? active : inactive}`}>
                Dashboard
              </Link>
              <Link
                to="/zones"
                onClick={() => setSidebar(false)}
                className={`${linkBase} ${location.pathname.startsWith("/zones") ? active : inactive}`}
              >
                Vùng thảm họa
              </Link>
              <Link to="/sos" onClick={() => setSidebar(false)} className={`${linkBase} ${location.pathname.startsWith("/sos") ? active : inactive}`}>
                Yêu cầu SOS
              </Link>
            </nav>
          </div>

          {/* Overlay (click outside to close) */}
          <div className="flex-1 bg-black/40" onClick={() => setSidebar(false)} />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
