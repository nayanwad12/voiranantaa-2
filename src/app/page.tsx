import { Chapter } from "@/components/home/Chapter";
import { ElementIndicator } from "@/components/home/ElementIndicator";
import { Hero } from "@/components/home/Hero";
import {
  Categories,
  Challenge,
  Idea,
  Journey,
  LiveExperience,
  OpenCall,
  Partners,
  Theme,
  Voirtales,
} from "@/components/home/sections";

/**
 * Edition 01 — the descent. One continuous scroll from Sky to Earth;
 * the universe behind the page changes world as each chapter passes.
 */
export default function HomePage() {
  return (
    <main id="main" data-scene="0" data-scene-dim="0.12">
      <ElementIndicator />
      <Chapter index={0}>
        <Hero />
        <Idea />
      </Chapter>
      <Chapter index={1}>
        <Theme />
        <Categories />
      </Chapter>
      <Chapter index={2}>
        <Challenge />
        <LiveExperience />
      </Chapter>
      <Chapter index={3}>
        <Journey />
        <OpenCall />
      </Chapter>
      <Chapter index={4}>
        <Partners />
        <Voirtales />
      </Chapter>
    </main>
  );
}
