import { useEffect, useState } from "react";
import { Lock, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { register, login } from "../../Redux/Auth/Action";
import { useNavigate } from "react-router-dom";

function Auth() {
  // "login" | "register" | "admin"
  const [mode, setMode] = useState("login");
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  // Pre-filled admin credentials
  const adminEmail = "admin@example.com";
  const adminPassword = "admin";

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isAdmin = mode === "admin";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((store) => store.authStore);

  const updateFormFields = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      dispatch(register(userData));
    } else if (isLogin) {
      dispatch(login({ email: userData.email, password: userData.password }));
    } else {
      dispatch(login({ email: adminEmail, password: adminPassword }));
    }
  };

  // now after submitting it will work.
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-slate-950">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=1920&auto=format&fit=crop"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl p-6">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-3 text-xl font-bold text-slate-100">
            {isLogin && "Welcome Back"}
            {isRegister && "Create an Account"}
            {isAdmin && "Admin Login"}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {isLogin && "Login to manage disaster zones and SOS requests"}
            {isRegister && "Register to gain access to admin features"}
            {isAdmin && "Login as admin to access all system features"}
          </p>
        </div>

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <label className="block text-sm text-slate-300 mb-1">Username</label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
                <User className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter username"
                  className="w-full text-slate-100 outline-none placeholder-slate-500 bg-slate-800"
                  onChange={(e) => updateFormFields(e)}
                  value={userData.fullname}
                  name="fullname"
                />
              </div>
            </div>
          )}

          <div>
        <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              type="email"  // <-- SỬA DÒNG NÀY (từ 'password' thành 'email')
              placeholder="you@example.com"
              // XÓA DÒNG: defaultValue={isAdmin ? adminEmail : ""}
              // XÓA DÒNG: readOnly={isAdmin}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              onChange={(e) => updateFormFields(e)}
              value={userData.email}
              name="email"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              // XÓA DÒNG: defaultValue={isAdmin ? adminPassword : ""}
              // XÓA DÒNG: readOnly={isAdmin}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              onChange={(e) => updateFormFields(e)}
              value={userData.password}
              name="password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg px-4 py-2 mt-2 text-white font-medium shadow ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
            }`}
          >
            {loading ? "Processing..." : isLogin ? "Login" : isRegister ? "Register" : isAdmin ? "Login as admin" : "Submit"}
          </button>
        </form>

        {error && (
          <p className="text-center mt-2 text-red-500 text-sm">{isRegister ? "Email already registered. Try to Login." : "Something went wrong"}</p>
        )}

        {/* Toggle */}
        <div className="mt-4 text-center text-sm text-slate-400 space-y-2">
          {isLogin && (
            <>
              Bạn chưa có tài khoản?{" "}
              <button type="button" onClick={() => setMode("register")} className="text-blue-400 hover:underline">
                Đăng ký
              </button>
              <br />
              Truy cập quyền quản trị?{" "}
              <button type="button" onClick={() => setMode("admin")} className="text-blue-400 hover:underline">
                Login as Admin
              </button>
            </>
          )}

          {isRegister && (
            <>
              Bạn đã có tài khoản?{" "}
              <button type="button" onClick={() => setMode("login")} className="text-blue-400 hover:underline">
                Login
              </button>
              <br />
              Truy cập quyền quản trị?{" "}
              <button type="button" onClick={() => setMode("admin")} className="text-blue-400 hover:underline">
                Login as Admin
              </button>
            </>
          )}

          {isAdmin && (
            <>
              Bạn không phải admin?{" "}
              <button type="button" onClick={() => setMode("login")} className="text-blue-400 hover:underline">
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
