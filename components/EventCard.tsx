import { EventType } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const EventCard = ({ title, image, slug, location, date, time }: EventType) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
      <img
        src={image}
        alt={title}
        width={410}
        height={300}
        className="poster"
      />
      <div className="flex flex-row gap-2">
        <img src="/icons/pin.svg" alt="location" width={14} height={14} />
        <p>{location}</p>
      </div>
      <p className="title">{title}</p>
      <div className="datetime">
        <div>
          <img src="/icons/calendar.svg" alt="date" width={14} height={14} />
          <p>{formatDate(date)}</p>
        </div>
        <div>
          <img src="/icons/clock.svg" alt="time" width={14} height={14} />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
