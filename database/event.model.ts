import mongoose, { Schema, type Document, type Model } from "mongoose";

// Shape of an Event document stored in MongoDB
export interface EventAttrs {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO string
  time: string; // HH:MM 24-hour format
  mode: string; // e.g. "online", "offline", "hybrid"
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}

export interface EventDocument extends EventAttrs, Document {
  createdAt: Date;
  updatedAt: Date;
}

export type EventModel = Model<EventDocument>;

// Helper to generate a URL-safe slug from the title
const slugify = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Normalize a date-like string into an ISO date-time string
const normalizeDateToIso = (value: string): string | null => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
};

// Normalize human-entered times into HH:MM (24-hour) format
const normalizeTime = (value: string): string | null => {
  const trimmed = value.trim().toLowerCase();

  // Handle formats like "9:30 am" / "09:30 pm"
  const twelveHourMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/);
  if (twelveHourMatch) {
    let hour = Number.parseInt(twelveHourMatch[1], 10);
    const minute = Number.parseInt(twelveHourMatch[2], 10);
    const meridiem = twelveHourMatch[3];

    if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
      return null;
    }

    if (hour === 12) {
      hour = meridiem === "am" ? 0 : 12;
    } else if (meridiem === "pm") {
      hour += 12;
    }

    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  }

  // Handle 24-hour formats like "9:30" / "09:30"
  const twentyFourMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourMatch) {
    const hour = Number.parseInt(twentyFourMatch[1], 10);
    const minute = Number.parseInt(twentyFourMatch[2], 10);

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return null;
    }

    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  }

  return null;
};

const eventSchema = new Schema<EventDocument, EventModel>(
  {
    title: { type: String, required: true, trim: true },
    // Slug is unique and generated in a pre-save hook
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean =>
          Array.isArray(value) && value.length > 0 && value.every((item) => item.trim().length > 0),
        message: "Agenda must contain at least one non-empty item.",
      },
    },
    organizer: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean =>
          Array.isArray(value) && value.length > 0 && value.every((item) => item.trim().length > 0),
        message: "Tags must contain at least one non-empty item.",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save hook for slug generation, date/time normalization, and extra validation
eventSchema.pre<EventDocument>("save", function preSave(next) {
  // Regenerate slug only when the title changes
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }

  // Guard against accidentally missing or empty required string fields
  const requiredStringFields: (keyof EventAttrs)[] = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];

  for (const field of requiredStringFields) {
    const value = this[field] as unknown;
    if (typeof value !== "string" || value.trim().length === 0) {
      return next(new Error(`Field "${String(field)}" is required and cannot be empty.`));
    }
  }

  // Normalize the date field into ISO format
  if (this.isModified("date")) {
    const normalizedDate = normalizeDateToIso(this.date);
    if (!normalizedDate) {
      return next(new Error("Invalid date value; unable to convert to ISO format."));
    }
    this.date = normalizedDate;
  }

  // Normalize the time field into a consistent HH:MM 24-hour format
  if (this.isModified("time")) {
    const normalizedTime = normalizeTime(this.time);
    if (!normalizedTime) {
      return next(new Error("Invalid time value; expected formats like '09:30' or '9:30 am'."));
    }
    this.time = normalizedTime;
  }

  next();
});

// Use existing model in dev to avoid OverwriteModelError in Next.js hot reload
export const Event: EventModel =
  (mongoose.models.Event as EventModel | undefined) ||
  mongoose.model<EventDocument, EventModel>("Event", eventSchema);
