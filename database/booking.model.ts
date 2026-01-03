import mongoose, {
  Schema,
  type Document,
  type Model,
  type Types,
} from "mongoose";
import { Event } from "./event.model";

export interface BookingAttrs {
  eventId: Types.ObjectId;
  email: string;
}

export interface BookingDocument extends BookingAttrs, Document {
  createdAt: Date;
  updatedAt: Date;
}

export type BookingModel = Model<BookingDocument>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<BookingDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean => EMAIL_REGEX.test(value),
        message: "Email must be a valid email address.",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure the referenced event exists and email is valid
bookingSchema.pre<BookingDocument>("save", async function () {
  // pre<BookingDocument> says that "this" is a BookingDocument
  // Only check when creating or when the reference changes
  if (this.isNew || this.isModified("eventId")) {
    try {
      const eventExists = await Event.exists({ _id: this.eventId });
      if (!eventExists) {
        return new Error(
          "Cannot create booking: referenced event does not exist."
        );
      }
    } catch (error) {
      return error as Error;
    }
  }

  // Defensive email validation before persisting
  if (!EMAIL_REGEX.test(this.email)) {
    return new Error("Email must be a valid email address.");
  }
});

// index on eventId for faster queries
bookingSchema.index({ eventId: 1 });

// compound index for common queries (events bookings by date)
bookingSchema.index({ eventId: 1, createdAt: -1 });

// index on email for user booking lookups
bookingSchema.index({ email: 1 });

// Enforce one booking per events per email
bookingSchema.index(
  { eventId: 1, email: 1 },
  { unique: true, name: "unique_event_email" }
);

// Use existing model in dev to avoid OverwriteModelError in Next.js hot reload
export const Booking: BookingModel =
  (mongoose.models.Booking as BookingModel | undefined) ||
  mongoose.model<BookingDocument>("Booking", bookingSchema);
