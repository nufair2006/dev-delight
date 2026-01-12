"use server";
import { Booking } from "@/database";
import connectDB from "../mongodb";
import { findEventById } from "./event.action";

export const bookEvent = async ({
  eventId,
  email,
}: {
  eventId: string;
  email: string;
}) => {
  try {
    await connectDB();
    const event = await findEventById(eventId);

    if (!event) {
      return { success: false, error: "Event not found" };
    }
    await Booking.create({ email, eventId });
    // we cannot pass an object that contains methods like toJSON() without serializing it first. you either strip and send a normal document or
    return { success: true };
  } catch (error) {
    console.error("Error booking event:", error);
    return { success: false, error: "Error booking event: " + error };
  }
};
