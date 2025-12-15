import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const token = localStorage.getItem("token");
  const today = new Date().toISOString().split("T")[0];

  /* ================= FETCH EVENT ================= */
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/events/${id}`
        );

        const e = res.data.data;
        setTitle(e.title);
        setDate(e.date.split("T")[0]);
        setLocation(e.location);
        setDescription(e.description);
      } catch (err) {
        setError("Failed to load event");
      }
    };

    fetchEvent();
  }, [id]);

  /* ================= UPDATE EVENT ================= */
  const updateEvent = async () => {
    setError("");

    if (new Date(date) < new Date(today)) {
      setError("Past date is not allowed");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/events/${id}`,
        { title, date, location, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to update event"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE EVENT ================= */
  const deleteEvent = async () => {
    try {
      setLoading(true);

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/events/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/admin/dashboard", { replace: true });
    } catch {
      setError("Failed to delete event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ UPDATE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={showUpdateConfirm}
        title="Update Event"
        message="Are you sure you want to update this event?"
        confirmText="Yes, Update"
        onCancel={() => setShowUpdateConfirm(false)}
        onConfirm={() => {
          setShowUpdateConfirm(false);
          updateEvent();
        }}
      />

      {/* ❌ DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Event"
        message="This action cannot be undone. Are you sure?"
        confirmText="Yes, Delete"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          deleteEvent();
        }}
      />

      <div className="min-h-screen bg-gray-100 py-10">
        <div className="mx-auto max-w-xl rounded bg-white p-6 shadow">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">
            Edit Event
          </h1>

          {error && (
            <div className="mb-4 rounded bg-red-100 px-4 py-2 text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="w-full rounded border px-3 py-2"
            />

            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded border px-3 py-2"
            />

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full rounded border px-3 py-2"
            />

            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full rounded border px-3 py-2"
            />

            {/* 🔵 UPDATE */}
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowUpdateConfirm(true)}
              className="w-full rounded bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Event"}
            </button>
          </form>

          {/* 🔴 DELETE */}
          <button
            disabled={loading}
            onClick={() => setShowDeleteConfirm(true)}
            className="mt-4 w-full rounded bg-red-600 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            Delete Event
          </button>
        </div>
      </div>
    </>
  );
};

export default EditEventPage;
