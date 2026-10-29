/**
 * Projeto em destaque (estudo de caso). Aparece logo depois dos números da capa.
 * Regras: sem valores em dinheiro (só percentuais), sem nome de empresa parceira,
 * sem número de alunos ou de avaliações.
 */

export const featured = {
  id: "destaque",
  eyebrow: "Projeto em destaque",
  kicker: "EdTech · simulação clínica com IA · cofundador",
  title: "Dewe",
  highlight: "96%",
  highlightLabel: "de fidelidade do paciente simulado, numa bateria de casos com armadilhas",
  highlightNote: "5 casos, 3 repetições cada, roteiros cheios de armadilhas",
  lede: "O aluno de medicina atende por voz um paciente simulado por IA. Depois recebe uma avaliação comentada, com base nas diretrizes clínicas.",
  problem:
    "O estudante tem pouca chance de praticar anamnese e conduta antes de atender gente de verdade. Corrigir isso à mão também não escala para o professor.",
  built: {
    intro: "A plataforma inteira, do banco à voz:",
    items: [
      "consulta por voz em tempo real;",
      "avaliação por IA com rubrica e material de referência (RAG);",
      "professor montando o caso numa entrevista com a IA;",
      "turmas com atividades valendo nota ou como treino;",
      "simulação seriada: consulta inicial, retorno com os exames pedidos e especialista, com o paciente lembrando da consulta anterior.",
    ],
  },
  decisions: [
    {
      title: "Motor de voz",
      text: "Comparei modelos de voz direta com uma cadeia de fala para texto, modelo de linguagem e texto para fala. A cadeia acertou 96% contra 92% e custou 45% menos por consulta. Em troca, demora mais para começar a falar: 3,2 s contra 1,8 s.",
    },
    {
      title: "Gabarito",
      text: "A resposta certa nunca chega ao navegador do aluno antes da hora, e isso é coberto por testes.",
    },
  ],
  scale: [
    { value: "1.000+", label: "commits desde maio de 2026" },
    { value: "3.900", label: "testes automatizados" },
    { value: "79", label: "migrações de banco" },
    { value: "PT · EN", label: "bilíngue" },
  ],
  stack: ["Next.js", "Gemini", "ElevenLabs", "PostgreSQL + pgvector", "Railway", "Cloudflare"],
  link: { label: "deweai.com", href: "https://deweai.com" },
};
