import BookingForm from "@/components/BookingForm";
import EventCard from "@/components/EventCard";
import {
  getSimilarEventsBySlug,
  SimilarEvent,
} from "@/lib/actions/event.action";
import { BASE_URL } from "@/lib/env";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import React from "react";

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => {
  return (
    <div className="flex-row-gap-2 items-center">
      <img src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
};

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => {
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agendaItems.map((item, index) => {
          return <li key={index}>{item}</li>;
        })}
      </ul>
    </div>
  );
};

const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag, index) => {
        return (
          <div className="pill" key={index}>
            {tag}
          </div>
        );
      })}
    </div>
  );
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  let event;
  try {
    const response = await fetch(`${BASE_URL}/api/events/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 404) return notFound();
      throw new Error(`Failed to fetch event: ${response.statusText}`);
    }

    const data = await response.json();
    event = data.event;
    if (!event) return notFound();
  } catch (error) {
    console.error("Error fetching event:", error);
    return notFound();
  }
  const {
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
  } = event;

  const bookingsCount = 10;

  let similarEvents: SimilarEvent[] = [];
  try {
    similarEvents = await getSimilarEventsBySlug({
      slug,
      limit: 5,
    });
  } catch (error) {
    console.error("Error fetching similar events:", error);
  }

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>
      <div className="details">
        {/* Left Side - Event Content */}
        <div className="content">
          <img
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="Calendar"
              label={formatDate(date)}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="audience"
              label={audience}
            />
          </section>
          {/* data returns in the format of string[] and it contains one element which is like ['AGENDA 1', 'AGENDA 2'] */}
          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>About Organizer</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tags={tags} />
        </div>
        {/* Right Side - Event Booking */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookingsCount > 0 ? (
              <p className="text-sm">
                Join {bookingsCount} people already signed up
              </p>
            ) : (
              <p className="text-sm">Be the first to sign up</p>
            )}
            <BookingForm />
          </div>
        </aside>
      </div>
      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents &&
            similarEvents.length > 0 &&
            similarEvents.map((event) => {
              return <EventCard key={event._id} {...event} />;
            })}
        </div>
      </div>
    </section>
  );
};

export default Page;
