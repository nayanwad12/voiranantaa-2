"use client";

import { useRef, useState } from "react";
import { UPLOAD_RULES } from "@/lib/schemas";
import { cx } from "@/lib/cx";

const fmt = (bytes: number) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/** Proposal uploads with clear type and size limits, validated as files are added. */
export function FileDrop({
  id,
  files,
  onChange,
  error,
}: {
  id: string;
  files: File[];
  onChange: (files: File[]) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const add = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...files];
    const rejected: string[] = [];
    for (const f of Array.from(incoming)) {
      if (!(UPLOAD_RULES.types as readonly string[]).includes(f.type)) rejected.push(`${f.name} (type)`);
      else if (f.size > UPLOAD_RULES.maxBytes) rejected.push(`${f.name} (over 10 MB)`);
      else if (next.length >= UPLOAD_RULES.maxFiles) rejected.push(`${f.name} (limit of ${UPLOAD_RULES.maxFiles})`);
      else if (!next.some((n) => n.name === f.name && n.size === f.size)) next.push(f);
    }
    setNotice(rejected.length ? `Not added: ${rejected.join(", ")}` : null);
    onChange(next);
    if (inputRef.current) inputRef.current.value = "";
  };

  const message = error ?? notice;

  return (
    <div className="grid gap-3">
      <span id={`${id}-label`} className="font-sans text-[0.8rem] font-medium uppercase tracking-[0.12em] text-paper">
        Proposal uploads
      </span>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
        className={cx(
          "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center transition-colors",
          drag ? "border-blue bg-blue/10" : error ? "border-red" : "border-line bg-ink/40",
        )}
      >
        <p className="text-paper">Drag files here, or</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="border border-line px-5 py-2.5 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] hover:border-blue"
        >
          Choose files
        </button>
        <p id={`${id}-hint`} className="text-sm text-mute">
          {UPLOAD_RULES.label}
        </p>
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple
          accept={UPLOAD_RULES.accept}
          className="sr-only"
          aria-labelledby={`${id}-label`}
          aria-describedby={message ? `${id}-error` : `${id}-hint`}
          onChange={(e) => add(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <ul className="grid gap-2" aria-label="Selected files">
          {files.map((f, i) => (
            <li key={f.name + f.size} className="glass flex items-center justify-between gap-4 rounded-lg px-4 py-3 text-sm">
              <span className="truncate text-paper">{f.name}</span>
              <span className="flex shrink-0 items-center gap-4 text-mute">
                {fmt(f.size)}
                <button
                  type="button"
                  onClick={() => onChange(files.filter((_, j) => j !== i))}
                  className="text-blue-soft underline-offset-4 hover:underline"
                  aria-label={`Remove ${f.name}`}
                >
                  Remove
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      {message && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-red">
          {message}
        </p>
      )}
    </div>
  );
}
