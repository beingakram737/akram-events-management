import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Today date (for disabling past dates)
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !date || !location || !description) {
      setError("All fields are required");
      return;
    }

    // ✅ JS safety check (extra protection)
    const selectedDate = new Date(date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (selectedDate < now) {
      setError("Event date cannot be in the past");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please login again.");
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/events`,
        {
          title,
          date,
          location,
          description,
          organizer: user?.name || "Admin",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/admin/dashboard", { replace: true });

    } catch (err) {
      console.error("Error creating event:", err);
      setError(
        err.response?.data?.error ||
          "Failed to create event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-xl rounded bg-white p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Create New Event
        </h1>

        {error && (
          <div className="mb-4 rounded bg-red-100 px-4 py-2 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />

          {/* ✅ Past dates disabled */}
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />

          <textarea
            rows="4"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
