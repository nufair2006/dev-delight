"use client";
import { bookEvent } from "@/lib/actions/booking.action";
import React, { useState } from "react";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";

const BookingForm = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const posthog = usePostHog();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter an email address.");
      return;
    }
    if (!eventId) {
      alert("Please refresh the page or try again.");
      return;
    }
    const { success, error } = await bookEvent({ eventId, email });
    if (success) {
      setSubmitted(true);
      posthog.capture("event_booked", { eventId, slug, email });
      toast.success("Booking successful!");
    } else {
      toast.error(error || "Something went wrong. Please try again.");
      posthog.captureException(error);
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for your booking!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Email Address"
            />
          </div>
          <button type="submit" className="button-submit">
            Book
          </button>
        </form>
      )}
    </div>
  );
};

export default BookingForm;
