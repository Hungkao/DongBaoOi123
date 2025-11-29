import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Phone, Mail, User, Edit2, Shield } from "lucide-react";
import { toast } from "sonner";
import { getMyDetails, updateMyDetails } from "../Redux/Auth/Action";
import { mySos } from "../Redux/SOS/Action";

function ProfilePage() {
  const dispatch = useDispatch();
  const authStore = useSelector((store) => store.authStore);
  const sosStore = useSelector((store) => store.sosStore);

  const { currentUser, currentUserLoading } = authStore;
  const { mySos: sosRequests, mySosLoading } = sosStore;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState({ fullname: "", phoneNumber: "", address: "" });

  useEffect(() => {
    dispatch(getMyDetails());
    dispatch(mySos());
  }, [dispatch, authStore?.updateUserLoading]);

  useEffect(() => {
    if (currentUser) {
      setForm({
        fullname: currentUser.fullname || "",
        phoneNumber: currentUser.phoneNumber || "",
        address: currentUser.address || "",
      });
    }
  }, [currentUser]);

  const handleUpdate = async () => {
    try {
      dispatch(updateMyDetails(form)).then(() => {
        if (authStore?.updateUserError !== null) {
          toast.error("Failed to update profile!!");
        } else {
          toast.success("Profile updated successfully");
        }
      });
      dispatch(getMyDetails());
      setIsEditOpen(false);
    } catch {
      toast.error("Something went wrong.");
    }
  };

  if (currentUserLoading || mySosLoading) {
    return <div className="text-center text-slate-400">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* User Info Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl relative">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <User className="h-7 w-7 text-indigo-400" /> Profile
          </h2>
          <div className="space-y-4 text-slate-300">
            <p className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" /> {currentUser?.fullname}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" /> {currentUser?.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" /> {currentUser?.phoneNumber || "Not added"}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" /> {currentUser?.address || "Not provided"}
            </p>
            <p className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-slate-400" /> Vai trò: {currentUser?.role}
            </p>
          </div>
          <button
            onClick={() => setIsEditOpen(true)}
            className="absolute top-6 right-6 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 flex items-center gap-1 shadow"
          >
            <Edit2 className="h-4 w-4" /> Sửa
          </button>
        </div>

        {/* SOS History */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Yêu cầu SOS của tôi</h2>
          {sosRequests?.length > 0 ? (
            <ul className="space-y-3">
              {sosRequests.map((s) => (
                <li key={s.id} className="border border-slate-800 rounded-lg p-4 bg-slate-950/60 hover:bg-slate-950 transition text-slate-200 shadow">
                  <p className="font-semibold">{s.message}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {s.disasterType} • {s.sosStatus} • {new Date(s.updatedAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400">Chưa có yêu cầu SOS nào được gửi.</p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Chỉnh sửa Profile</h2>

            <input
              type="text"
              placeholder="Họ và tên"
              value={form.fullname}
              onChange={(e) => setForm({ ...form, fullname: e.target.value })}
              className="w-full mb-3 px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="w-full mb-3 px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Địa chỉ"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full mb-3 px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-indigo-500"
            />

            {/* Non-editable fields (just show) */}
            <div className="mb-3 text-slate-400 text-sm">
              <p>
                Email: <span className="text-slate-200">{currentUser?.email}</span>
              </p>
              <p>
                Vai trò: <span className="text-slate-200">{currentUser?.role}</span>
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 rounded-md bg-slate-700 text-slate-200 hover:bg-slate-600">
                Hủy
              </button>
              <button
                disabled={authStore?.updateUserLoading}
                onClick={handleUpdate}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 shadow"
              >
                {authStore?.updateUserLoading ? "Processing..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
