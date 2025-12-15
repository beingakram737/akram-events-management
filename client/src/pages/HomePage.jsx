import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/events`
        );
        setEvents(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // 🔍 FILTER LOGIC
  const filteredEvents = events.filter((event) =>
    `${event.title} ${event.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="mx-auto max-w-6xl px-4">

        {/* 🔍 SEARCH BAR */}
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 w-full rounded border px-4 py-2 focus:ring-2 focus:ring-indigo-500"
        />

        {/* 📜 SCROLL AREA */}
        <div
          className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${
            filteredEvents.length > 10
              ? "max-h-[600px] overflow-y-auto pr-2"
              : ""
          }`}
        >
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <p className="mt-6 text-center text-gray-500">
            No events found
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
