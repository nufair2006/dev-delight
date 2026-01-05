import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event, type EventDocument } from "@/database";

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

// GET /api/events/[slug] - returns a single event by its slug
export async function GET(
  _req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  const { slug } = await params;

  // Validate slug presence and basic shape early
  if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
    return NextResponse.json(
      { error: "A non-empty 'slug' parameter is required." },
      { status: 400 }
    );
  }

  try {
    // Ensure database connection is established before querying
    await connectDB();

    const normalizedSlug = slug.trim().toLowerCase();

    // Find the event by its slug; lean() returns a plain JSON-serializable object
    const event = await Event.findOne({ slug: normalizedSlug })
      .lean<EventDocument>()
      .exec();

    if (!event) {
      return NextResponse.json(
        { error: "Event not found for the provided slug." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { event, message: "Event Fetched Successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    // In production, you might log this to an observability platform instead
    console.error("[GET /api/events/[slug]] Unexpected error", error);

    return NextResponse.json(
      { error: "An unexpected error occurred while fetching the event." },
      { status: 500 }
    );
  }
}
