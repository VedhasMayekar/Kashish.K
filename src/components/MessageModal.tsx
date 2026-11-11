import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Send, X } from "lucide-react";
import { submitMessage } from "../api";

interface Props { open: boolean; onClose: () => void; blogId?: number | null; blogLabel?: string | null }

const CONFIRMATION = "Your message has been sent successfully. Thank you for sharing your thoughts.";

export default function MessageModal({ open, onClose, blogId, blogLabel }: Props) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const close = () => { onClose(); setTimeout(() => { setStatus("idle"); setError(""); }, 300); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || status === "sending") return;
    setStatus("sending"); setError("");
    try {
      await submitMessage({ senderName: name.trim(), message: message.trim(), blogId: blogId ?? null });
      setName(""); setMessage(""); setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const inputCls = "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-violet-200/40 outline-none transition focus:border-violet-300/50";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={close} role="dialog" aria-modal="true" aria-label="Send a message"
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }} transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-[#0b0b1e] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.6)] sm:rounded-3xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif-display text-2xl text-white">Send a message</h2>
                <p className="mt-1 text-sm text-violet-200/70">
                  No account needed. Leave your name blank if you like.
                  {blogLabel ? <span className="mt-1 block text-violet-300/80">Re: {blogLabel}</span> : null}
                </p>
              </div>
              <button type="button" onClick={close} aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-violet-100 transition hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>

            {status === "done" ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-300" aria-hidden="true" />
                <p className="mt-4 text-base leading-relaxed text-violet-50">{CONFIRMATION}</p>
                <button type="button" onClick={close}
                  className="mt-6 rounded-full bg-gradient-to-r from-violet-400/90 to-fuchsia-400/70 px-6 py-3 text-sm font-semibold text-white">Done</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="msg-name" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-violet-200/70">
                    Name <span className="normal-case tracking-normal text-violet-200/50">(optional)</span>
                  </label>
                  <input id="msg-name" type="text" value={name} maxLength={80} onChange={(e) => setName(e.target.value)}
                    placeholder="Any name or nickname" autoComplete="off" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="msg-body" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-violet-200/70">Message</label>
                  <textarea id="msg-body" value={message} maxLength={4000} rows={5} required onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write whatever is on your mind..." className={inputCls + " resize-y leading-relaxed"} />
                  <p className="mt-1 text-right text-[11px] tabular-nums text-violet-200/50">{message.length} / 4000</p>
                </div>
                {error && <p role="alert" className="rounded-2xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
                <button type="submit" disabled={status === "sending" || !message.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-400/90 to-fuchsia-400/70 px-6 py-3.5 text-base font-semibold text-white shadow-[0_0_28px_rgba(216,180,254,0.35)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50">
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {status === "sending" ? "Sending..." : "Send message"}
                </button>
                <p className="text-center text-[11px] leading-relaxed text-violet-200/50">
                  You can send as many messages as you like — no account, no lock, no limit beyond simple spam protection.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
