export const dayCards = [
  {
    id: "day-0",
    day: "Day 0",
    title: "Arrival preview",
    accent: "#D9EEF7",
    active: false,
  },
  {
    id: "day-1",
    day: "Day 1",
    title: "Arrival & Exploration",
    accent: "#F7F6EE",
    active: true,
    timeline: [
      "09:00 - Check-in",
      "12:00 - Local Lunch",
      "15:00 - City Center",
    ],
  },
  {
    id: "day-2",
    day: "Day 2",
    title: "Slow morning plan",
    accent: "#DFF3EE",
    active: false,
  },
] as const;