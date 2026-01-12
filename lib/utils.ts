import { EventAttrs, EventDocument } from "@/database";
import { StrippedEventDocument } from "@/database/event.model";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function stripEvent(event: EventDocument): StrippedEventDocument {
  return {
    _id: event._id.toString(),
    title: event.title,
    slug: event.slug,
    description: event.description,
    overview: event.overview,
    image: event.image,
    venue: event.venue,
    location: event.location,
    date: event.date,
    time: event.time,
    agenda: event.agenda,
    mode: event.mode,
    audience: event.audience,
    organizer: event.organizer,
    tags: event.tags,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}
