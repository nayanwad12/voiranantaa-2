import { Intro } from "@/components/landing/Intro";
import { ElementPill } from "@/components/landing/ElementPill";
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
import { Partners } from "@/components/landing/Partners";
import { Finale } from "@/components/landing/Finale";

/**
 * Edition 01 — the descent from Sky to Earth.
 * Each section names the shape the universe takes behind it (data-form)
 * and the element it belongs to (data-element).
 */
export default function HomePage() {
  return (
    <main id="main" data-scene="0" className="relative">
      <Intro />
      <ElementPill />

      {/* 01 SKY */}
      <Hero />
      <Idea />

      {/* 02 AIR */}
      <Gate index={2} name="Air" subject="The theme" form={2} />
      <Theme />
      <RasaGallery />
      <GradientBand />

      {/* 03 SPACE */}
      <Gate index={3} name="Space" subject="The challenge" form={4} />
      <Categories />
      <Challenge />

      {/* 04 WATER */}
      <Gate index={4} name="Water" subject="The live experience" form={6} />
      <Live />
      <Journey />

      {/* 05 EARTH */}
      <Gate index={5} name="Earth" subject="Make it real" form={8} />
      <OpenCall />
      <Partners />
      <Finale />
    </main>
  );
}
