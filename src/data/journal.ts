export interface JournalEntry {
  id: number;
  dayNumber: number;
  title: string;
  slug: string;
  content: string;
  date: string | null;
}

const dayFiles = import.meta.glob<string>("/day*.txt", {
  eager: true,
  query: "?raw",
  import: "default",
});

const specialTitles: Record<number, string> = {
  1: "A Little About Me",
};

const specialDates: Record<number, string> = {
  1: "2026-11-11",
};

export const journalEntries: JournalEntry[] = Object.entries(dayFiles)
  .flatMap(([filePath, content]) => {
    const match = filePath.match(/\/day(\d+)\.txt$/i);
    if (!match) return [];

    const dayNumber = Number(match[1]);
    if (!Number.isSafeInteger(dayNumber) || dayNumber < 1) return [];

    return [{
      id: dayNumber,
      dayNumber,
      title: specialTitles[dayNumber] || `Day ${dayNumber}`,
      slug: `day-${dayNumber}`,
      content,
      date: specialDates[dayNumber] || null,
    }];
  })
  .sort((a, b) => b.dayNumber - a.dayNumber);

export function getJournalEntry(dayNumber: number): JournalEntry | undefined {
  return journalEntries.find((entry) => entry.dayNumber === dayNumber);
}
