export function FormAlert({ message, tone = "error" }: { message: string; tone?: "error" | "info" }) {
  const color = tone === "error" ? "var(--red)" : "var(--blue)";
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className="glass relative overflow-hidden rounded-xl px-5 py-4 text-[0.95rem] text-paper"
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px]" style={{ background: color }} />
      {message}
    </div>
  );
}
