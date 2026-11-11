import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    key++;
    if (token.startsWith("**")) nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith("*")) nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    else if (token.startsWith("`")) nodes.push(<code key={key} className="rounded bg-white/10 px-1 text-[0.9em]">{token.slice(1, -1)}</code>);
    else {
      const link = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (link) {
        const href = link[2];
        const safe = /^(https?:\/\/|\/)/.test(href) ? href : "#";
        nodes.push(<a key={key} href={safe} target={safe.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-violet-300 underline decoration-violet-300/40 underline-offset-2 hover:text-violet-200">{link[1]}</a>);
      }
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function BlogContent({ content }: { content: string }) {
  const blocks = content.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="blog-body space-y-5 text-[17px] leading-[1.85] text-violet-50/95">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return <h2 key={i} className="font-serif-display pt-4 text-2xl leading-snug text-white">{renderInline(block.slice(3))}</h2>;
        }
        if (block.startsWith("# ")) {
          return <h1 key={i} className="font-serif-display pt-4 text-3xl leading-snug text-white">{renderInline(block.slice(2))}</h1>;
        }
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-•*]\s+/.test(l))) {
          return (
            <ul key={i} className="list-disc space-y-2 pl-6 marker:text-violet-300/60">
              {lines.map((l, j) => <li key={j}>{renderInline(l.replace(/^\s*[-•*]\s+/, ""))}</li>)}
            </ul>
          );
        }
        if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
          return (
            <ol key={i} className="list-decimal space-y-2 pl-6 marker:text-violet-300/60">
              {lines.map((l, j) => <li key={j}>{renderInline(l.replace(/^\s*\d+\.\s+/, ""))}</li>)}
            </ol>
          );
        }
        if (block.startsWith("> ")) {
          return <blockquote key={i} className="border-l-2 border-violet-300/50 pl-4 italic text-violet-100/90">{renderInline(block.slice(2).replace(/\n/g, " "))}</blockquote>;
        }
        return <p key={i} className="whitespace-pre-wrap">{renderInline(block)}</p>;
      })}
    </div>
  );
}
