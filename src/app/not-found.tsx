import { Arrow, ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main id="main" data-scene="2" data-scene-dim="0.2">
      <section className="page-x mx-auto flex min-h-[100svh] max-w-page flex-col justify-center pt-[var(--header-h)]">
        <p className="label mb-6">404 / Lost in space</p>
        <h1 className="display-xl max-w-4xl">This page drifted out of orbit.</h1>
        <div className="mt-12">
          <ButtonLink href="/">
            Return home <Arrow />
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
