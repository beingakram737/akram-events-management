import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔴 Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    const fetchAdminEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/events/admin`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setEvents(res.data.data);
      } catch (err) {
        console.error("Admin fetch error:", err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminEvents();
  }, []);

  const handleDeleteEvent = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/events/${selectedEventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEvents((prev) =>
        prev.filter((e) => e._id !== selectedEventId)
      );
    } catch {
      alert("Failed to delete event");
    } finally {
      setShowDeleteConfirm(false);
      setSelectedEventId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-20 text-lg">
        Loading admin dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center mt-20 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <>
      {/* ✅ DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Event"
        message="Are you sure you want to delete this event?"
        confirmText="Yes, Delete"
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSelectedEventId(null);
        }}
        onConfirm={handleDeleteEvent}
      />

      <div className="min-h-screen bg-gray-100 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          {/* HEADER */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>

            <Link
              to="/admin/create-event"
              className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              + Create Event
            </Link>
          </div>

          {/* TABLE */}
          {events.length === 0 ? (
            <div className="rounded bg-white p-6 text-gray-600 shadow">
              No events found
            </div>
          ) : (
            <div className="overflow-x-auto rounded bg-white shadow">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-50 text-black">
                  <tr>
                    <th className="px-6 py-3 text-left font-bold">
                      Event Title
                    </th>
                    <th className="px-6 py-3 text-center font-bold">
                      Date
                    </th>
                    <th className="px-6 py-3 text-center font-bold">
                      Registrations
                    </th>
                    <th className="px-6 py-3 text-center font-bold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event._id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {event.title}
                      </td>

                      <td className="px-6 py-4 text-center text-gray-600">
                        {new Date(event.date).toDateString()}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/admin/event/${event._id}/users`}
                          className="font-medium text-indigo-600 hover:underline"
                        >
                          {event.registeredUsers?.length || 0} users
                        </Link>
                      </td>

                      <td className="px-6 py-4 text-center space-x-4">
                        <Link
                          to={`/admin/edit/${event._id}`}
                          className="font-medium text-indigo-600 hover:underline"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedEventId(event._id);
                            setShowDeleteConfirm(true);
                          }}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
