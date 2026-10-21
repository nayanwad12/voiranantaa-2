import { edition } from "@/content/edition";
import { Arrow, ButtonLink } from "@/components/ui/Button";

export function ParticipateCTA() {
  if (edition.registrationOpen) {
    return (
      <ButtonLink href="/participate/register" className="w-full py-5 text-[0.85rem]">
        Register to participate <Arrow />
      </ButtonLink>
    );
  }
  return (
    <div className="grid gap-4">
      <div className="glass flex flex-col gap-1 rounded-xl px-6 py-5">
        <span className="label text-mute">Registration opens</span>
        <span className="font-display text-2xl font-bold uppercase">{edition.registrationOpensLabel}</span>
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <ButtonLink href="/participate" variant="text">
          Read the brief <Arrow />
        </ButtonLink>
        <ButtonLink href="/participate/register" variant="text">
          Preview the application
        </ButtonLink>
      </div>
    </div>
  );
}
