import { createFileRoute } from "@tanstack/react-router";
import DashboardApp from "@/components/DashboardApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FocusFlow — Student Dashboard" },
      {
        name: "description",
        content:
          "FocusFlow is a playful student dashboard: task board, pomodoro timer, schedule timeline, focus analytics, and switchable themes.",
      },
      { property: "og:title", content: "FocusFlow — Student Dashboard" },
      {
        property: "og:description",
        content:
          "Task board, pomodoro timer, schedule timeline, and focus analytics in one playful student dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <DashboardApp />;
}
