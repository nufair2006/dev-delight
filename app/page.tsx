import EventCard from "@/components/EventCard";
import ExploreButton from "@/components/ExploreButton";
import { events } from "@/lib/constants";
import React from "react";

const Page = () => {
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
          {events.map((e) => (
            <li key={e.title}>
              <EventCard {...e} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;
