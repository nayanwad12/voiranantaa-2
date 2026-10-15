import type { Metadata } from "next";
import { DraftPage } from "@/components/ui/DraftPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <DraftPage
      label="Legal"
      title="Privacy Policy"
      intro="How VOIRTALES collects, uses, stores and protects the personal information you share through this website. The approved policy will be published here before any registration opens."
      outline={[
        "What we collect through participant, partner, visitor, contact and newsletter forms",
        "Why we collect it and the legal basis for processing",
        "Uploaded files: access control, storage location and retention period",
        "Payment processing and the role of the payment provider",
        "Who we share data with (judges, venue, service providers) and why",
        "Data retention and deletion",
        "Your rights: access, correction, deletion and withdrawing consent",
        "Newsletter consent, confirmation and unsubscribe",
        "Contact details for privacy requests",
      ]}
    />
  );
}
