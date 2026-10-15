import type { Metadata } from "next";
import { PartnerForm } from "@/components/forms/PartnerForm";

export const metadata: Metadata = {
  title: "Partner enquiry",
  description: "Build the infinite with us — partnership enquiry.",
};

export default function PartnerEnquiryPage() {
  return (
    <main id="main" data-scene="4" data-scene-dim="0.75">
      <div className="page-x mx-auto grid max-w-page gap-14 pb-32 pt-[calc(var(--header-h)+4rem)] lg:grid-cols-[0.8fr_1.6fr] lg:gap-20">
        <aside className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
          <p className="label mb-5">Partners / Enquiry</p>
          <h1 className="display-lg">Build the infinite with us.</h1>
          <p className="body-copy mt-8">
            Tell us about your organisation and what you would like to contribute. We&rsquo;ll confirm receipt by
            email and follow up personally.
          </p>
        </aside>
        <PartnerForm />
      </div>
    </main>
  );
}
