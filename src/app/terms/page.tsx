import type { Metadata } from "next";
import { DraftPage } from "@/components/ui/DraftPage";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <DraftPage
      label="Legal"
      title="Terms & Conditions"
      intro="The terms that govern use of this website and participation in VOIRANANTAA Edition 01 / Infinite Raga. Final wording will be approved and published before registration opens."
      outline={[
        "Eligibility and applicant obligations",
        "Submission format: concept proposal and/or completed artwork",
        "Originality, authorship and the AI / machine-use policy",
        "Intellectual property, image and publicity permissions",
        "Material (95 / 5) verification and safety compliance",
        "Selection, judging and the finality of decisions",
        "Fees, payment and refunds",
        "Changes to dates, venue or format",
        "Liability and governing law",
      ]}
    />
  );
}
