import { useState } from "react";
import TimelineEvent from "./TimelineEvent";
import type { TimelineEvent as TimelineEventType } from "../data/memories";

export default function Timeline({ events }: { events: TimelineEventType[] }) {
  const [openId, setOpenId] = useState<string | null>(events[0]?.id ?? null);

  return (
    <ol className="relative mx-auto w-full max-w-2xl space-y-4 pt-8">
      <span aria-hidden="true" className="absolute bottom-4 left-[12px] top-8 w-px bg-gradient-to-b from-violet-300/50 via-fuchsia-300/30 to-amber-200/40 sm:left-[16px]" />
      {events.map((event, i) => (
        <TimelineEvent
          key={event.id} event={event} index={i}
          open={openId === event.id}
          onToggle={() => setOpenId(openId === event.id ? null : event.id)}
        />
      ))}
    </ol>
  );
}
