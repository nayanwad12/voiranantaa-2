import type { Metadata } from "next";
import { DraftPage } from "@/components/ui/DraftPage";

export const metadata: Metadata = { title: "Accessibility" };

export default function AccessibilityPage() {
  return (
    <DraftPage
      label="Utility"
      title="Accessibility"
      intro="We want everyone to be able to explore VOIRANANTAA. This site respects your device's reduced-motion setting, supports keyboard navigation and works without the animated background."
      outline={[
        "Standards we aim to meet (WCAG 2.2 AA)",
        "Reduced motion: smooth scrolling, reveals and background animation are paused",
        "Keyboard and screen-reader support across navigation and forms",
        "Known limitations and how we are addressing them",
        "Accessibility at the live event: venue access and support",
        "How to report a barrier or request an alternative format",
      ]}
    />
  );
}
