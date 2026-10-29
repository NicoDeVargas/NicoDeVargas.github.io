/**
 * Conteúdo dos capítulos e projetos. Edite aqui; o site lê tudo deste arquivo.
 *
 * - `highlight`: o número de destaque (ex.: "−71%"). Sem número? Deixe vazio e
 *   o cartão usa uma capitular (a inicial do projeto).
 * - `media`: vídeo/print do projeto (opcional). Sem mídia, o cartão é só
 *   texto: setor, número, nome, frase e tags.
 * - Nunca coloque nome de cliente: descreva pelo setor.
 */

export type PlateName = "hippogriff" | "paradise" | "idylls" | "orlando9" | "tage";

export type Link = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  /** Linha curta acima do título (setor, formato, contexto). */
  kicker: string;
  highlight?: string;
  highlightLabel?: string;
  description: string;
  /** Fatos curtos, um por linha. */
  facts?: string[];
  stack?: string[];
  links?: Link[];
  /** Mídia opcional (caminho em /public). */
  media?: { type: "video" | "image"; src: string; alt: string; poster?: string };
  /** Prancha larga de destaque. */
  featured?: boolean;
};

export type Chapter = {
  id: string;
  numeral: string;
  title: string;
  subtitle: string;
  intro: string;
  plate: PlateName;
  /** Ponto da gravura que fica em quadro (como object-position, 0–1). */
  focus: [number, number];
  /** Título da gravura, para o crédito. */
  plateTitle: string;
  projects: Project[];
};

export const chapters: Chapter[] = [
  {
    id: "ia-aplicada",
    numeral: "I",
    title: "IA aplicada",
    subtitle: "Produtos em produção para clientes",
    intro:
      "Agentes de voz, RAG e infraestrutura que rodam todo dia com usuários reais. Cada decisão de arquitetura vem com uma medida antes e depois.",
    plate: "hippogriff",
    focus: [0.5, 0.9],
    plateTitle: "Orlando Furioso — a batalha do hipogrifo",
    projects: [
      {
        slug: "simuladores-voz",
        title: "Simuladores de venda por voz",
        kicker: "Treinamento de vendas · varejo, consórcio, telecom",
        highlight: "−71%",
        highlightLabel: "de custo por simulação",
        description: "Vendedores treinam conversando por voz com um cliente simulado.",
        facts: ["Mais de 100 vendedores treinados"],
        stack: ["Next.js", "Gemini", "ElevenLabs", "AWS"],
      },
      {
        slug: "rag-grafos",
        title: "RAG híbrido com grafos",
        kicker: "Copiloto de vendas B2B · tecnologia",
        highlight: "40% → 0%",
        highlightLabel: "alucinação de produtos",
        description: "Copiloto de vendas B2B que responde sobre o catálogo sem inventar produto, medido em 1.000 perguntas.",
        stack: ["PostgreSQL", "Grafos", "RAG"],
      },
      {
        slug: "agente-crm",
        title: "Agente de CRM por voz",
        kicker: "Pós-reunião · vendas consultivas",
        highlight: "2 min",
        highlightLabel: "para registrar uma reunião (antes 10–20 min)",
        description: "Depois de cada reunião, a IA entrevista o vendedor por voz e preenche o CRM.",
        facts: ["Campos vazios no CRM: 45% → 0%"],
        stack: ["Agentes de voz", "LLM", "CRM"],
      },
      {
        slug: "aws-multicliente",
        title: "Arquitetura AWS multi-cliente",
        kicker: "Infraestrutura · desenhada por mim",
        highlight: "2 dias",
        highlightLabel: "para subir um cliente novo",
        description: "Uma base única que atende vários clientes isolados.",
        facts: ["~60% menos custo de AWS nos pilotos"],
        stack: ["ECS", "RDS", "S3", "Lambda", "CloudFormation", "CDK"],
      },
    ],
  },
  {
    id: "pesquisa-modelos",
    numeral: "II",
    title: "Pesquisa de modelos",
    subtitle: "Treinar, medir, comparar",
    intro:
      "Quando a pergunta é qual modelo, qual motor ou qual formato, eu monto o experimento e deixo os números decidirem.",
    plate: "paradise",
    focus: [0.55, 0.38],
    plateTitle: "Paraíso Perdido, livro III",
    projects: [
      {
        slug: "qwen3-npc-lora",
        title: "Fine-tuning do Qwen3-8B para NPCs",
        kicker: "LoRA · NPCs que devolvem ações em JSON",
        highlight: "11% → 93%",
        highlightLabel: "ações corretas",
        description: "Personagens de jogo que respondem com fala e uma ação válida para o jogo.",
        facts: ["97,5% das falas aprovadas pelo validador do jogo", "Achado: requantizar o modelo fundido derruba de 90% para 30%"],
        stack: ["Qwen3-8B", "PyTorch", "PEFT", "llama.cpp"],
        links: [{ label: "Código", href: "https://github.com/NicoDeVargas/qwen3-npc-dialogue-lora" }],
      },
      {
        slug: "benchmark-voz",
        title: "Benchmark de motores de voz",
        kicker: "Avaliação · custo, latência e segurança",
        highlight: "3 × 12",
        highlightLabel: "motores × ataques de prompt",
        description: "Três motores de voz comparados em custo, latência e resistência a 12 ataques de prompt.",
        stack: ["STT", "LLM", "TTS", "Avaliação"],
      },
    ],
  },
  {
    id: "games",
    numeral: "III",
    title: "Games",
    subtitle: "Onde testo IA de verdade",
    intro:
      "Jogo é o laboratório mais honesto: se o modelo erra, o jogador vê na hora.",
    plate: "idylls",
    focus: [0.5, 0.55],
    plateTitle: "Idílios do Rei",
    projects: [
      {
        slug: "rpg-labirinto",
        title: "RPG Labirinto",
        kicker: "Godot · diálogos gerados por IA",
        highlight: "100% local",
        highlightLabel: "IA rodando no computador do jogador",
        description: "RPG em Godot em que os personagens conversam com um modelo treinado por mim, rodando no computador do jogador.",
        stack: ["Godot", "llama.cpp", "LoRA"],
      },
      {
        slug: "travessia-ia",
        title: "Travessia IA",
        kicker: "Jogo ao vivo · evento corporativo",
        highlight: "1 noite",
        highlightLabel: "do zero ao telão",
        description: "Jogo ao vivo no telão, com votação pelo celular, para cerca de 25 executivos.",
        stack: ["Next.js", "Tempo real"],
      },
    ],
  },
  {
    id: "produtos-web",
    numeral: "IV",
    title: "Produtos e web",
    subtitle: "Apps e landing pages",
    intro:
      "Produtos inteiros, do banco à interface, e páginas que precisam vender no primeiro scroll.",
    plate: "orlando9",
    focus: [0.55, 0.5],
    plateTitle: "Orlando Furioso, canto IV",
    projects: [
      {
        slug: "dewe",
        title: "Dewe",
        kicker: "EdTech · simulações educacionais e clínicas",
        description: "Plataforma EdTech de simulações educacionais e clínicas em tempo real com IA.",
        // TODO(dono): confirmar a descrição acima, listar a stack e adicionar link e imagem/vídeo.
        stack: ["IA em tempo real", "EdTech"],
        featured: true,
      },
      {
        slug: "fluente",
        title: "Fluente",
        kicker: "Educação · leitura infantil",
        highlight: "palavra a palavra",
        highlightLabel: "a leitura avaliada palavra por palavra",
        description: "Mede a fluência de leitura de crianças, sem LLM na nota.",
        stack: ["Next.js", "AssemblyAI"],
        links: [
          { label: "Demo", href: "https://fluente-black.vercel.app" },
          { label: "Código", href: "https://github.com/NicoDeVargas/fluente-ia-avaliador-de-leitura" },
        ],
      },
      {
        slug: "sinal-de-alarme",
        title: "Sinal de Alarme",
        kicker: "Saúde · hackathon AssemblyAI",
        description: "Treino por voz para reconhecer os sinais de alarme da dengue, feito no hackathon de agentes de voz da AssemblyAI.",
        stack: ["AssemblyAI", "Agente de voz"],
        links: [
          {
            label: "Código",
            href: "https://github.com/NicoDeVargas/sinal-de-alarme-AssemblyAI-Voice-Agent-Hackathon",
          },
        ],
      },
      {
        slug: "landing-pages",
        title: "Deletrica e Cafelipe",
        kicker: "Landing pages",
        description: "Landing pages feitas de ponta a ponta.",
        // TODO(dono): adicionar print (media) e links das duas páginas.
        stack: ["Web", "Landing page"],
      },
    ],
  },
];
