import MemoryCard from "./MemoryCard";
import type { Memory } from "../data/memories";

export default function MemoryGrid({ memories }: { memories: Memory[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
      {memories.map((m, i) => (
        <MemoryCard
          key={m.id} title={m.title} description={m.description}
          category={m.category} icon={m.icon} date={m.date} index={i}
        />
      ))}
    </div>
  );
}
