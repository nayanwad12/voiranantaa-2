import type { Metadata } from "next";
import { DraftPage } from "@/components/ui/DraftPage";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <DraftPage
      label="Legal"
      title="Refund Policy"
      intro="When application fees can and cannot be refunded. The approved policy will be published before registration and payment open."
      outline={[
        "Application fees: student and other",
        "Withdrawal before and after the registration closing date",
        "Ineligible or incomplete applications",
        "Failed or duplicate payments",
        "Changes or cancellation by the organisers",
        "How to request a refund and expected timelines",
      ]}
    />
  );
}
