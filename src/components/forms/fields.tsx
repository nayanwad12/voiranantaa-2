import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

const control =
  "w-full rounded-lg border border-line bg-ink/60 px-4 py-3.5 font-sans text-[1rem] font-normal text-paper placeholder:text-mute/60 transition-colors focus:border-blue focus:outline-none aria-[invalid=true]:border-red";

type ShellProps = {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
};

export function FieldShell({ id, label, hint, error, optional, children, className }: ShellProps) {
  return (
    <div className={cx("grid gap-2", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-4 font-sans text-[0.8rem] font-medium uppercase tracking-[0.12em] text-paper">
        <span>{label}</span>
        {optional && <span className="text-[0.68rem] tracking-[0.14em] text-mute">Optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-mute">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-red">
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: ReactNode) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

type Common = { id: string; label: ReactNode; hint?: ReactNode; error?: string; optional?: boolean; className?: string };

export function TextField({ id, label, hint, error, optional, className, ...input }: Common & ComponentProps<"input">) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <input
        id={id}
        className={control}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...input}
      />
    </FieldShell>
  );
}

export function TextArea({ id, label, hint, error, optional, className, ...input }: Common & ComponentProps<"textarea">) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <textarea
        id={id}
        rows={5}
        className={cx(control, "min-h-[8rem] resize-y leading-relaxed")}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...input}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  hint,
  error,
  optional,
  className,
  options,
  placeholder = "Select…",
  ...input
}: Common & ComponentProps<"select"> & { options: readonly { value: string; label: string }[]; placeholder?: string }) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <select
        id={id}
        className={cx(control, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 stroke=%22%238db8ff%22 fill=%22none%22/></svg>')] bg-[length:12px_8px] bg-[right_1rem_center] bg-no-repeat pr-10")}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        defaultValue=""
        {...input}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function CheckboxField({
  id,
  label,
  error,
  className,
  ...input
}: { id: string; label: ReactNode; error?: string; className?: string } & ComponentProps<"input">) {
  return (
    <div className={cx("grid gap-1.5", className)}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-[0.95rem] leading-relaxed text-paper/90">
        <input
          id={id}
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-[3px] border border-mute/60 bg-ink transition-colors checked:border-blue checked:bg-blue checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 12%22><path d=%22M2.5 6.2l2.3 2.3 4.7-4.9%22 stroke=%22%2305070d%22 stroke-width=%221.8%22 fill=%22none%22/></svg>')] aria-[invalid=true]:border-red"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...input}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="pl-7 text-sm font-medium text-red">
          {error}
        </p>
      )}
    </div>
  );
}

/** A group of selectable chips/cards (checkbox or radio) with one shared label. */
export function ChoiceGroup({
  legend,
  name,
  type,
  options,
  error,
  hint,
  inputProps,
  columns = "sm:grid-cols-2",
}: {
  legend: ReactNode;
  name: string;
  type: "checkbox" | "radio";
  options: readonly { value: string; label: ReactNode; description?: ReactNode }[];
  error?: string;
  hint?: ReactNode;
  inputProps: ComponentProps<"input">;
  columns?: string;
}) {
  return (
    <fieldset className="grid gap-3" aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}>
      <legend className="mb-1 font-sans text-[0.8rem] font-medium uppercase tracking-[0.12em] text-paper">{legend}</legend>
      {hint && (
        <p id={`${name}-hint`} className="-mt-1 text-sm text-mute">
          {hint}
        </p>
      )}
      <div className={cx("grid gap-3", columns)}>
        {options.map((o) => (
          <label
            key={o.value}
            className="group relative flex cursor-pointer flex-col gap-1 rounded-lg border border-line bg-ink/50 px-4 py-3.5 transition-colors hover:border-blue-soft has-[:checked]:border-blue has-[:checked]:bg-blue/10 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue"
          >
            <span className="flex items-center gap-3">
              <input type={type} value={o.value} className="peer sr-only" {...inputProps} />
              <span
                aria-hidden="true"
                className={cx(
                  "h-3.5 w-3.5 shrink-0 border border-mute/70 transition-colors peer-checked:border-blue peer-checked:bg-blue",
                  type === "radio" ? "rounded-full" : "rounded-[3px]",
                )}
              />
              <span className="font-sans text-[0.9rem] font-medium uppercase tracking-[0.08em] text-paper">{o.label}</span>
            </span>
            {o.description && <span className="pl-[1.6rem] text-sm text-mute">{o.description}</span>}
          </label>
        ))}
      </div>
      {error && (
        <p id={`${name}-error`} role="alert" className="text-sm font-medium text-red">
          {error}
        </p>
      )}
    </fieldset>
  );
}
