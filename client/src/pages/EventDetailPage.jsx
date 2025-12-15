import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirmType, setConfirmType] = useState(null); // "register" | "cancel"

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/events/${id}`
        );
        setEvent(res.data.data);
      } catch {
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;
  if (!event) return null;

  const isRegistered =
    user &&
    event.registeredUsers?.some((u) => u._id === user._id);

  const canCancel = () => {
    const diff =
      (new Date(event.date) - new Date()) /
      (1000 * 60 * 60 * 24);
    return diff > 15;
  };

  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/events/${event._id}/register`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigate("/", { replace: true });
  };

  const handleCancel = async () => {
    const token = localStorage.getItem("token");
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/events/${event._id}/register`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* 🔔 CONFIRM MODAL */}
      <ConfirmModal
        isOpen={confirmType !== null}
        title="Please Confirm"
        message={
          confirmType === "register"
            ? "Do you really want to register for this event?"
            : "Do you really want to cancel your registration?"
        }
        confirmText="Yes, Continue"
        onCancel={() => setConfirmType(null)}
        onConfirm={() => {
          confirmType === "register"
            ? handleRegister()
            : handleCancel();
          setConfirmType(null);
        }}
      />

      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-3xl mx-auto bg-white p-6 shadow rounded">
          <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
          <p>📅 {format(new Date(event.date), "dd MMM yyyy")}</p>
          <p>📍 {event.location}</p>
          <p className="mt-4">{event.description}</p>

          {user && user.role !== "admin" && (
            <div className="mt-6 space-y-2">
              {!isRegistered && (
                <button
                  onClick={() => setConfirmType("register")}
                  className="rounded bg-green-600 px-4 py-2 text-white"
                >
                  Register for this Event
                </button>
              )}

              {isRegistered && (
                <>
                  <button
                    disabled={!canCancel()}
                    onClick={() => setConfirmType("cancel")}
                    className={`px-4 py-2 rounded text-white ${
                      canCancel()
                        ? "bg-red-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Cancel Registration
                  </button>
                </>
              )}
            </div>
          )}

          <Link to="/" className="block mt-6 text-indigo-600">
            ← Back to Events
          </Link>
        </div>
      </div>
    </>
  );
};

export default EventDetailPage;
