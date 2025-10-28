import { getHeroCarousel } from "@/api/contents/getHeroCarousel";
import HTMLServerParser from "@/components/HTMLServerParser";

export default async function Hero() {
  const hero = await getHeroCarousel();

  if (!hero) {
    return <>Failed to fetch hero.</>;
  }

  return (
    <section className="lg:h-[850px] z-0">
      <HTMLServerParser content={hero.LW3CNTSTR} />
    </section>
  );
}
