"use server";

import connectDB from "@/lib/mongodb";
import { Event, type EventDocument } from "@/database";

export type GetSimilarEventsOptions = {
  slug: string;
  /** Maximum number of similar events to return. */
  limit?: number;
};

// Public shape returned to the UI for similar events
export type SimilarEvent = Pick<
  EventDocument,
  | "title"
  | "slug"
  | "description"
  | "overview"
  | "image"
  | "venue"
  | "location"
  | "date"
  | "time"
  | "mode"
  | "audience"
  | "organizer"
  | "tags"
> & { _id: string };

// Server action: find events similar to a given event slug based on shared tags
export const getSimilarEventsBySlug = async ({
  slug,
  limit = 3,
}: GetSimilarEventsOptions): Promise<SimilarEvent[]> => {
  const normalizedSlug = slug.trim().toLowerCase();

  // Basic input validation for slug and limit
  if (!normalizedSlug) {
    throw new Error("A non-empty slug is required to fetch similar events.");
  }

  if (!Number.isFinite(limit) || limit <= 0) {
    throw new Error("The 'limit' option must be a positive number.");
  }

  await connectDB();

  // Load the base event first; if it does not exist, there is nothing to recommend
  const baseEvent = await Event.findOne({ slug: normalizedSlug })
    .lean<EventDocument>()
    .exec();

  if (!baseEvent) {
    return [];
  }

  const baseTags = Array.isArray(baseEvent.tags) ? baseEvent.tags : [];

  // Without tags, we cannot build a meaningful similarity query yet
  if (baseTags.length === 0) {
    return [];
  }

  // Recommend events that share at least one tag, excluding the base event itself
  const similar = await Event.find({
    _id: { $ne: baseEvent._id },
    tags: { $in: baseTags },
  })
    .limit(limit)
    .lean<Array<EventDocument>>()
    .exec();

  return similar.map<SimilarEvent>((event) => ({
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
    mode: event.mode,
    audience: event.audience,
    organizer: event.organizer,
    tags: event.tags,
  }));
};
