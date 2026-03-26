import { Fragment, type ReactNode } from "react";

const linkClass =
  "break-all text-[#E5FF00] underline decoration-[#E5FF00]/50 underline-offset-2 hover:text-white hover:decoration-white";

function linkifyLine(line: string, lineKey: number): ReactNode {
  const parts = line.split(/(https?:\/\/\S+)/gi);
  return parts.map((part, i) => {
    if (/^https?:\/\//i.test(part)) {
      const href = part.replace(/[.,;:!?)]+$/, "");
      const tail = part.slice(href.length);
      return (
        <Fragment key={`${lineKey}-${i}`}>
          <a href={href} rel="ugc noopener noreferrer" target="_blank" className={linkClass}>
            {href}
          </a>
          {tail}
        </Fragment>
      );
    }
    return <Fragment key={`${lineKey}-${i}`}>{part}</Fragment>;
  });
}

/**
 * URLs en texto plano → enlaces con rel="ugc" (contenido generado por usuario).
 */
export function linkifyTextWithUgc(text: string): ReactNode {
  const lines = text.split("\n");
  return lines.map((line, li) => (
    <Fragment key={li}>
      {li > 0 ? "\n" : null}
      {linkifyLine(line, li)}
    </Fragment>
  ));
}
