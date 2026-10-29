import { About } from "@/components/About";
import { Chapter } from "@/components/Chapter";
import { CommitMap } from "@/components/CommitMap";
import { FeaturedCase } from "@/components/FeaturedCase";
import { Footer } from "@/components/Footer";
import { Hero, Stats } from "@/components/Hero";
import { Motion } from "@/components/Motion";
import { Nav } from "@/components/Nav";
import { chapters } from "@/content/projects";

export default function Home() {
  return (
    <>
      <a className="skip" href="#projetos">
        Pular para os projetos
      </a>
      <Motion />
      <Nav />
      <main>
        <Hero />
        <Stats />
        <FeaturedCase />
        <div id="projetos" className="chapters">
          <div className="chapters__lead">
            <p className="eyebrow">Projetos · quatro capítulos</p>
            <h2 className="section-title" data-lines>
              <span className="line">
                <span>Quatro áreas,</span>
              </span>{" "}
              <span className="line">
                <span>
                  <em>uma mesma mania:</em>
                </span>
              </span>{" "}
              <span className="line">
                <span>medir o resultado.</span>
              </span>
            </h2>
          </div>
          {chapters.map((c) => (
            <Chapter key={c.id} chapter={c} />
          ))}
        </div>
        <CommitMap />
        <About />
      </main>
      <Footer />
    </>
  );
}
