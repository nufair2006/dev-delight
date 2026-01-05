import EventCard from "@/components/EventCard";
import ExploreButton from "@/components/ExploreButton";
import { EventDocument } from "@/database";
import { BASE_URL } from "@/lib/env";
import { cacheLife } from "next/cache";
import React from "react";

const Page = async () => {
  "use cache";
  cacheLife("hours"); // cache the page result for an hour and then revalidate it
  let events = [];
  try {
    if (!BASE_URL) {
      throw new Error("BASE_URL is not configured");
    }
    const response = await fetch(`${BASE_URL}/api/events`);
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    const data = await response.json();
    events = data.events ?? [];
  } catch (error) {
    console.error("Error fetching events:", error);
  }

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Developer Experience in Sri Lanka
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and More in One Spot
      </p>
      <ExploreButton />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((e: EventDocument) => (
              <li key={e._id.toString()}>
                <EventCard {...e} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;
