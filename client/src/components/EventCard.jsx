// 📁 client/src/components/EventCard.jsx

import { Link } from "react-router-dom";
import { format } from "date-fns";

const EventCard = ({ event }) => {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl">
      {/* Card Body */}
      <div className="p-5">
        {/* Title */}
        <h2 className="mb-2 text-xl font-semibold text-gray-800">
          {event.title}
        </h2>

        {/* Date */}
        <p className="mb-1 text-sm text-gray-500">
          📅 {format(new Date(event.date), "dd MMM yyyy")}
        </p>

        {/* Location */}
        <p className="mb-3 text-sm text-gray-500">
          📍 {event.location}
        </p>

        {/* Description */}
        <p className="mb-4 line-clamp-3 text-sm text-gray-700">
          {event.description}
        </p>

        {/* Action */}
        <Link
          to={`/event/${event._id}`}
          className="inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
