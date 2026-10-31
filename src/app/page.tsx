import { Intro } from "@/components/landing/Intro";
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
 * Edition 01 — everything on one page, in five chapters. Each section names
 * the mood of the background behind it (data-form); each chapter has its
 * own element: sky, air, fire, water, earth.
 */
export default function HomePage() {
  return (
    <main id="main" data-scene="0" className="relative">
      <Anchor id="top" />
      <Intro />
      <ApplyOverlay />

      {/* 01 The edition and the idea — sky */}
      <Hero />
      <Anchor id="idea" />
      <Idea />

      {/* 02 The theme — air */}
      <Gate index={2} name="The Theme" subject="Infinite Raga" form={2} />
      <Anchor id="theme" />
      <Theme />
      <Anchor id="rasas" />
      <RasaGallery />
      <GradientBand />

      {/* 03 The competition — fire */}
      <Gate index={3} name="The Competition" subject="Two categories · One challenge" form={4} />
      <Anchor id="categories" />
      <Categories />
      <Anchor id="challenge" />
      <Challenge />

      {/* 04 The live experience and the journey — water */}
      <Gate index={4} name="The Live Experience" subject="Five minutes on stage" form={6} />
      <Anchor id="experience" />
      <Live />
      <Anchor id="journey" />
      <Journey />

      {/* 05 Vision: make it real — earth */}
      <Gate index={5} name="Vision" subject="Make it real" form={8} />
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
