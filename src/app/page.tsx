import { Intro } from "@/components/landing/Intro";
import { ElementPill } from "@/components/landing/ElementPill";
import { ApplyOverlay } from "@/components/landing/ApplyOverlay";
import { Hero } from "@/components/landing/Hero";
import { Idea } from "@/components/landing/Idea";
import { Gate } from "@/components/landing/Gate";
import { Theme } from "@/components/landing/Theme";
import { RasaGallery } from "@/components/landing/RasaGallery";
import { GradientBand } from "@/components/landing/GradientBand";
import { Categories } from "@/components/landing/Categories";
import { Challenge } from "@/components/landing/Challenge";
import { Live } from "@/components/landing/Live";
import { Journey } from "@/components/landing/Journey";
import { OpenCall } from "@/components/landing/OpenCall";
import { HowToParticipate } from "@/components/landing/HowToParticipate";
import { Selection } from "@/components/landing/Selection";
import { Partners } from "@/components/landing/Partners";
import { Attend } from "@/components/landing/Attend";
import { Connect } from "@/components/landing/Connect";
import { Finale } from "@/components/landing/Finale";

/** Section anchor for the nav and menu. Sits outside pinned scenes so its position never moves. */
function Anchor({ id }: { id: string }) {
  return <span id={id} aria-hidden="true" className="block h-0" />;
}

/**
 * Edition 01 — everything on one page: the descent from Sky to Earth.
 * Each section names the shape the universe takes behind it (data-form)
 * and the element it belongs to (data-element).
 */
export default function HomePage() {
  return (
    <main id="main" data-scene="0" className="relative">
      <Anchor id="top" />
      <Intro />
      <ElementPill />
      <ApplyOverlay />

      {/* 01 SKY — the edition and the idea */}
      <Hero />
      <Anchor id="idea" />
      <Idea />

      {/* 02 AIR — the theme */}
      <Gate index={2} name="Air" subject="The theme" form={2} />
      <Anchor id="theme" />
      <Theme />
      <Anchor id="rasas" />
      <RasaGallery />
      <GradientBand />

      {/* 03 SPACE — the competition */}
      <Gate index={3} name="Space" subject="The competition" form={4} />
      <Anchor id="categories" />
      <Categories />
      <Anchor id="challenge" />
      <Challenge />

      {/* 04 WATER — the experience and the journey */}
      <Gate index={4} name="Water" subject="The live experience" form={6} />
      <Anchor id="experience" />
      <Live />
      <Anchor id="journey" />
      <Journey />

      {/* 05 EARTH — make it real */}
      <Gate index={5} name="Earth" subject="Make it real" form={8} />
      <Anchor id="participate" />
      <OpenCall />
      <Anchor id="how-to-participate" />
      <HowToParticipate />
      <Selection />
      <Anchor id="partners" />
      <Partners />
      <Anchor id="attend" />
      <Attend />
      <Connect />
      <Finale />
    </main>
  );
}
