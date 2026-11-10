import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

interface Props {
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  onRestart: () => void;
}

export default function SceneNavigation({ onPrev, onNext, isFirst, isLast, onRestart }: Props) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3">
        <button
          type="button" onClick={onPrev} disabled={isFirst} aria-label="Previous scene"
          className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-violet-100 backdrop-blur transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {isLast ? (
          <button
            type="button" onClick={onRestart} aria-label="Back to the beginning"
            className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-violet-100 backdrop-blur transition hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Begin again</span>
          </button>
        ) : (
          <p className="hidden text-[11px] uppercase tracking-[0.25em] text-violet-200/60 md:block">
            Arrow keys / swipe to continue
          </p>
        )}

        <button
          type="button" onClick={onNext} disabled={isLast} aria-label="Next scene"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-400/80 to-fuchsia-400/60 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_22px_rgba(216,180,254,0.35)] transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span>Continue</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
