/**
 * Textos gerais do site. Edite à vontade: título da capa, números, links.
 */

export const site = {
  name: "Nicolas de Vargas",
  url: "https://nicodevargas.github.io", // TODO(dono): trocar pelo domínio final.
  description:
    "Engenheiro de IA em Belo Horizonte. Agentes de voz, RAG, fine-tuning de modelos, jogos e produtos web, levados de protótipo a produção com resultado medido.",

  hero: {
    eyebrow: "AI Engineer · Belo Horizonte",
    // Título da capa. Cada item vira uma linha no desktop.
    title: ["Engenheiro de IA.", "Levo ideias de protótipo a produto,", "e meço o resultado."],
    lede:
      "Estudante de Engenharia da Computação no CEFET-MG e desenvolvedor de IA na AI4Sellers. Curioso por quase tudo: voz, RAG, treino de modelos, jogos e web.",
    primary: { label: "Ver projetos", href: "#projetos" },
    secondary: { label: "Currículo", href: "/curriculo-nicolas-de-vargas.pdf" },
  },

  // O primeiro número vem de content/contributions.json (soma das duas contas).
  stats: [
    { key: "commits", value: 0, suffix: "", label: "commits em 2026, somando duas contas do GitHub" },
    { key: "vendedores", value: 100, suffix: "+", label: "vendedores treinados com os simuladores que construí" },
    { key: "areas", value: 4, suffix: "", label: "áreas: IA aplicada, modelos, games e web" },
  ],

  about: {
    eyebrow: "Sobre",
    title: "Gosto de construir a coisa inteira e depois medir se funcionou.",
    paragraphs: [
      "Sou Nicolas, estudante de Engenharia da Computação no CEFET-MG e desenvolvedor de IA na AI4Sellers, em Belo Horizonte.",
      "No trabalho, coloco em produção agentes de voz, RAG e a infraestrutura que sustenta tudo isso. Fora dele, treino modelos pequenos, faço jogos para testar IA de verdade e construo produtos web do zero.",
    ],
    photoAlt: "Retrato de Nicolas de Vargas em duotone violeta",
  },

  contact: {
    email: "nicolas.vargas8@gmail.com",
    linkedin: "https://www.linkedin.com/in/nicolas-de-vargas-446435221/",
    github: "https://github.com/NicoDeVargas",
    resume: "/curriculo-nicolas-de-vargas.pdf",
  },

  footer: {
    line: "Engenheiro de IA. Construo, coloco em produção e meço.",
    cta: "Tem um problema que pede IA de verdade?",
  },
};

export const credits = [
  {
    title: "Orlando Furioso — batalha do hipogrifo",
    href: "https://commons.wikimedia.org/wiki/File:Orlando_Furioso_hippogriff_battle.png",
  },
  { title: "Paraíso Perdido, prancha 12", href: "https://commons.wikimedia.org/wiki/File:Paradise_Lost_12.jpg" },
  { title: "Idílios do Rei, prancha 14", href: "https://commons.wikimedia.org/wiki/File:Idylls_of_the_King_14.jpg" },
  { title: "Orlando Furioso, prancha 9", href: "https://commons.wikimedia.org/wiki/File:Orlando_Furioso_9.jpg" },
  {
    title: "Lavadeiras às margens do Tejo (L’Espagne, 1874)",
    href: "https://commons.wikimedia.org/wiki/File:%22Lavanderas_(laveuses);_bords_du_tage,_environs_de_Tol%C3%A8de%22_(19314442854).jpg",
  },
];
