export type EventType = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventType[] = [
  {
    title: "Tech Innovators Conference 2025",
    image: "/images/event1.png",
    slug: "tech-innovators-conference-2025",
    location: "Colombo, Sri Lanka",
    date: "March 15, 2025",
    time: "9:00 AM – 5:00 PM",
  },
  {
    title: "Startup Pitch Night",
    image: "/images/event2.png",
    slug: "startup-pitch-night",
    location: "Kandy, Sri Lanka",
    date: "April 2, 2025",
    time: "6:30 PM – 9:30 PM",
  },
  {
    title: "UI/UX Design Workshop",
    image: "/images/event3.png",
    slug: "ui-ux-design-workshop",
    location: "Batticaloa, Sri Lanka",
    date: "April 20, 2025",
    time: "10:00 AM – 3:00 PM",
  },
  {
    title: "AI & Machine Learning Summit",
    image: "/images/event4.png",
    slug: "ai-machine-learning-summit",
    location: "Colombo, Sri Lanka",
    date: "May 8, 2025",
    time: "8:30 AM – 4:30 PM",
  },
  {
    title: "Full-Stack Developer Meetup",
    image: "/images/event5.png",
    slug: "full-stack-developer-meetup",
    location: "Galle, Sri Lanka",
    date: "May 25, 2025",
    time: "5:00 PM – 8:00 PM",
  },
  {
    title: "Product Management Masterclass",
    image: "/images/event6.png",
    slug: "product-management-masterclass",
    location: "Negombo, Sri Lanka",
    date: "June 10, 2025",
    time: "9:30 AM – 2:30 PM",
  },
];
