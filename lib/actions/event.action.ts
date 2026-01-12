"use server";

import connectDB from "@/lib/mongodb";
import { Event, type EventDocument } from "@/database";
import { cacheLife } from "next/cache";
import { StrippedEventDocument } from "@/database/event.model";
import { stripEvent } from "../utils";

export type GetSimilarEventsOptions = {
  slug: string;
  /** Maximum number of similar events to return. */
  limit?: number;
};

export const findEventBySlug = async (
  slug: string
): Promise<EventDocument | null> => {
  const normalizedSlug = slug.trim().toLowerCase();

  // Basic input validation for slug and limit
  if (!normalizedSlug) {
    throw new Error("A non-empty slug is required to fetch similar events.");
  }

  const baseEvent = await Event.findOne({ slug: normalizedSlug })
    .lean<EventDocument>()
    .exec();

  return baseEvent;
};

export const findEventById = async (
  eventId: string
): Promise<EventDocument | null> => {
  const normalizedId = eventId.trim();

  // Basic input validation for slug and limit
  if (!normalizedId) {
    throw new Error("A non-empty id is required to fetch similar events.");
  }

  const baseEvent = await Event.findOne({ _id: normalizedId })
    .lean<EventDocument>()
    .exec();

  return baseEvent;
};

// Server action: find events similar to a given event slug based on shared tags
export const getSimilarEventsBySlug = async ({
  slug,
  limit = 3,
}: GetSimilarEventsOptions): Promise<StrippedEventDocument[]> => {
  "use cache";
  cacheLife("hours");

  if (!Number.isFinite(limit) || limit <= 0) {
    throw new Error("The 'limit' option must be a positive number.");
  }

  await connectDB();

  // Load the base event first; if it does not exist, there is nothing to recommend
  const baseEvent = await findEventBySlug(slug);

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

  return similar.map<StrippedEventDocument>((event) => stripEvent(event));
};
