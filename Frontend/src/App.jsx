import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.jsx";
import DisasterZonesPage from "./pages/DisasterZonesPage.jsx";
import ZonesDetailsPage from "./pages/ZonesDetailsPage.jsx";
import Navbar from "./components/Navbar.jsx";
import SOSRequestsPage from "./pages/SOSRequest/SOSRequestsPage.jsx";
import Auth from "./pages/auth/Auth";
import { useDispatch, useSelector } from "react-redux";
import { isTokenValid } from "./Redux/Auth/isTokenValid.js";
import { LOGOUT } from "./Redux/Auth/ActionType.js";
import { Toaster } from "sonner";
import ProfilePage from "./pages/ProfilePage.jsx";

function App() {
  const { isAuthenticated, accessToken } = useSelector((store) => store.authStore);
  const dispatch = useDispatch();

  useEffect(() => {
    if (accessToken && !isTokenValid(accessToken)) {
      dispatch({ type: LOGOUT });
    }
  }, [accessToken, dispatch]);

  return (
    <>
      <Toaster richColors position="top-right" />
      {!isAuthenticated ? (
        <Auth />
      ) : (
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/zones" element={<DisasterZonesPage />} />
            <Route path="/zones/:id" element={<ZonesDetailsPage />} />
            <Route path="/sos" element={<SOSRequestsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
