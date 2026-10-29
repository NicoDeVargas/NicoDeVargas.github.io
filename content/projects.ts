/**
 * Conteúdo dos capítulos e projetos. Edite aqui; o site lê tudo deste arquivo.
 *
 * - `highlight`: o número de destaque (ex.: "−71%"). Sem número? Deixe vazio e
 *   o cartão usa uma capitular (a inicial do projeto).
 * - `media`: vídeo/print do projeto. Sem mídia, o cartão mostra um recorte
 *   ampliado da gravura do capítulo (`detail`).
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
  /** Recorte da gravura usado quando não há mídia: centro (0–1) e ampliação. */
  detail?: { x: number; y: number; zoom: number };
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
        highlightLabel: "custo por simulação",
        description:
          "O vendedor treina conversando por voz com um cliente simulado. Propus e validei com benchmark próprio uma arquitetura em cascata (STT → LLM → TTS) no lugar de uma API realtime.",
        facts: [
          "Mais de 1.000 vendedores treinados",
          "100+ sessões simultâneas no lançamento",
          "US$ 0,48 → US$ 0,14 por simulação",
        ],
        stack: ["Next.js", "Gemini", "ElevenLabs", "AWS"],
        detail: { x: 0.36, y: 0.5, zoom: 2.6 },
      },
      {
        slug: "rag-grafos",
        title: "RAG híbrido com grafos",
        kicker: "Copiloto de vendas B2B · tecnologia",
        highlight: "40% → 0%",
        highlightLabel: "alucinação de produtos",
        description:
          "O copiloto passou de RAG puro em PostgreSQL para RAG híbrido com grafos. Medido numa bateria de 1.000 perguntas sobre o catálogo.",
        stack: ["PostgreSQL", "Grafos", "RAG"],
        detail: { x: 0.53, y: 0.14, zoom: 3 },
      },
      {
        slug: "agente-crm",
        title: "Agente de CRM por voz",
        kicker: "Pós-reunião · vendas consultivas",
        highlight: "2 min",
        highlightLabel: "para registrar uma reunião (antes 10–20 min)",
        description:
          "Depois de cada reunião, a IA entrevista o vendedor por voz e preenche o CRM sozinha.",
        facts: ["Campos vazios no CRM: 45% → 0%"],
        stack: ["Agentes de voz", "LLM", "CRM"],
        detail: { x: 0.27, y: 0.86, zoom: 2.4 },
      },
      {
        slug: "aws-multicliente",
        title: "Arquitetura AWS multi-cliente",
        kicker: "Infraestrutura · desenhada por mim",
        highlight: "2 dias",
        highlightLabel: "para subir um cliente novo",
        description:
          "Uma base única que atende vários clientes isolados. Nos pilotos, serverless cortou cerca de 60% do custo de AWS.",
        facts: ["~60% menos custo de AWS nos pilotos"],
        stack: ["ECS", "RDS", "S3", "Lambda", "CloudFormation", "CDK"],
        detail: { x: 0.8, y: 0.3, zoom: 2.2 },
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
        description:
          "Treinei um adaptador LoRA para que personagens de jogo respondam com fala e ação estruturada. O validador do jogo aprovou 97,5% das falas.",
        facts: [
          "97,5% das falas aprovadas pelo validador",
          "Achado: fundir o adaptador e requantizar para Q4 derruba de 90% para 30%",
        ],
        stack: ["Qwen3-8B", "PyTorch", "PEFT", "llama.cpp"],
        links: [{ label: "Código", href: "https://github.com/NicoDeVargas/qwen3-npc-dialogue-lora" }],
        detail: { x: 0.6, y: 0.45, zoom: 2.4 },
      },
      {
        slug: "benchmark-voz",
        title: "Benchmark de motores de voz",
        kicker: "Avaliação · custo, latência e segurança",
        highlight: "3 × 12",
        highlightLabel: "motores × ataques de prompt",
        description:
          "Três motores de voz comparados em custo, latência e resistência a 12 ataques de prompt. Foi ele que validou a arquitetura em cascata dos simuladores.",
        stack: ["STT", "LLM", "TTS", "Avaliação"],
        detail: { x: 0.5, y: 0.78, zoom: 2.2 },
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
        highlightLabel: "modelo treinado por mim, rodando no computador do jogador",
        description:
          "Um RPG em Godot em que os personagens conversam com diálogos gerados por um modelo que eu treinei, rodando local via llama.cpp.",
        stack: ["Godot", "llama.cpp", "LoRA"],
        detail: { x: 0.55, y: 0.55, zoom: 2.4 },
      },
      {
        slug: "travessia-ia",
        title: "Travessia IA",
        kicker: "Jogo ao vivo · evento corporativo",
        highlight: "1 noite",
        highlightLabel: "do zero ao telão",
        description:
          "Jogo ao vivo no telão com votação pelo celular para cerca de 25 executivos. Construído em uma noite.",
        stack: ["Next.js", "Tempo real"],
        detail: { x: 0.25, y: 0.3, zoom: 2.2 },
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
        description:
          "Plataforma EdTech de simulações educacionais e clínicas em tempo real com IA. Um produto inteiro, com muitas stacks envolvidas, do tempo real à interface.",
        // TODO(dono): confirmar a descrição acima, listar a stack e adicionar link e imagem/vídeo.
        stack: ["IA em tempo real", "EdTech"],
        featured: true,
        detail: { x: 0.58, y: 0.48, zoom: 2 },
      },
      {
        slug: "fluente",
        title: "Fluente",
        kicker: "Educação · leitura infantil",
        highlight: "palavra a palavra",
        highlightLabel: "sem LLM na nota",
        description:
          "Mede a fluência de leitura de crianças palavra por palavra, sem LLM na nota.",
        stack: ["Next.js", "AssemblyAI"],
        links: [
          { label: "Demo", href: "https://fluente-black.vercel.app" },
          { label: "Código", href: "https://github.com/NicoDeVargas/fluente-ia-avaliador-de-leitura" },
        ],
        detail: { x: 0.3, y: 0.2, zoom: 2.6 },
      },
      {
        slug: "sinal-de-alarme",
        title: "Sinal de Alarme",
        kicker: "Saúde · hackathon AssemblyAI",
        description:
          "Treino por voz para reconhecer os sinais de alarme da dengue, feito no hackathon de agentes de voz da AssemblyAI.",
        stack: ["AssemblyAI", "Agente de voz"],
        links: [
          {
            label: "Código",
            href: "https://github.com/NicoDeVargas/sinal-de-alarme-AssemblyAI-Voice-Agent-Hackathon",
          },
        ],
        detail: { x: 0.75, y: 0.75, zoom: 2.6 },
      },
      {
        slug: "landing-pages",
        title: "Deletrica e Cafelipe",
        kicker: "Landing pages",
        description: "Landing pages de ponta a ponta: texto, design e código.",
        // TODO(dono): adicionar print (media) e links das duas páginas.
        stack: ["Web", "Landing page"],
        detail: { x: 0.2, y: 0.8, zoom: 2.4 },
      },
    ],
  },
];
