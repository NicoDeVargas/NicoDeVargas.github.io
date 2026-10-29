# Portfólio — Nicolas de Vargas

Site pessoal em Next.js (App Router, TypeScript), exportado como HTML estático. Gravuras de Gustave Doré recoloridas em violeta, reveladas por um shader WebGL amarrado à rolagem.

## Rodar localmente

```bash
npm install
npm run dev            # http://localhost:3000 (desenvolvimento)
npm run build          # gera out/ (site estático)
npm start              # serve out/ em http://localhost:3000
npm run lint
```

Requer Node 20+.

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Título da capa, frase, números, links, "Sobre", rodapé | `content/site.ts` |
| Capítulos e projetos (texto, número de destaque, stack, links, mídia) | `content/projects.ts` |
| Dados do mapa de commits | `content/contributions.json` (gerado por script) |
| Estilos | `app/globals.css` |
| Shader da gravura | `lib/engraving-gl.ts` |

Projetos sem número de destaque usam uma capitular; sem mídia, usam um recorte ampliado da gravura do capítulo (`detail`). Para pôr vídeo ou print, coloque o arquivo em `public/media/` e preencha `media` no projeto.

Pendências marcadas com `TODO(dono)` no conteúdo: stack, link e imagem do Dewe; prints e links de Deletrica e Cafelipe; domínio final em `site.url`.

## Commits reais (duas contas)

O site lê `content/contributions.json`. O arquivo do repositório é de **exemplo** (`"exemplo": true`) e o site avisa isso na tela. Para gravar os números reais:

```bash
GITHUB_TOKEN_PESSOAL=ghp_... GITHUB_TOKEN_EMPRESA=ghp_... npm run contributions   # ano corrente
GITHUB_TOKEN_PESSOAL=... GITHUB_TOKEN_EMPRESA=... node scripts/fetch-contributions.mjs 2026
npm run build
```

- Cada token deve ser da própria conta (NicoDeVargas e Ai4Sellers-Git). Um token clássico com `read:user` basta; para contar repositórios privados, ele precisa enxergá-los (ou ative "Include private contributions" no perfil).
- O script consulta `viewer.contributionsCollection` na GraphQL API, soma os dois calendários e grava `exemplo: false`. Nenhum nome de repositório é consultado nem gravado.
- O número grande da capa usa `totalCommitContributions` (só commits); o mapa usa o calendário de contribuições (commits, PRs, issues e revisões), como o GitHub.

## Imagens

As gravuras já processadas estão em `public/img/` (AVIF + WebP em várias larguras) com o manifesto `content/images.json`. Para refazer (ex.: trocar recorte ou prancha):

```bash
python3 scripts/process-images.py [nome ...]   # baixa do Wikimedia Commons, recorta e recolore → assets-src/colored/
node scripts/build-images.mjs [nome ...]        # gera AVIF/WebP responsivos (lento: ~1–2 min por prancha)
```

Recolorização: `ImageOps.colorize(cinza, black="#3b2bb8", mid="#8f84e0", white="#fbf8ec")`.

## Publicar

### Vercel

Importe o repositório; o preset Next.js funciona sem configuração (`output: "export"` gera `out/`).

### GitHub Pages

1. Em **Settings → Pages**, escolha **Source: GitHub Actions**.
2. Faça push na `main`. O workflow `.github/workflows/pages.yml` faz o build e publica.
3. O prefixo de URL é automático: repositório de projeto → `https://<user>.github.io/<repo>/`; repositório `<user>.github.io` → raiz. Para forçar outro prefixo, crie a variável de repositório `BASE_PATH` (ex.: `/portfolio`).

Build local com prefixo: `BASE_PATH=/portfolio npm run build`. O arquivo `.nojekyll` vai junto (em `public/` e no workflow).

## Movimento e acessibilidade

- Com `prefers-reduced-motion: reduce`: sem shader (imagens estáticas), sem animações de entrada, carrossel sem rolagem suave, números já no valor final e pássaros parados.
- Sem WebGL: a gravura é revelada por uma máscara CSS amarrada ao mesmo progresso.
- Capítulos: o shader grava cada gravura uma vez ao entrar na tela (sem amarrar à rolagem). Projetos em carrossel: setas, arrastar, swipe, teclado (← → Home End).

## Créditos

Gravuras de Gustave Doré (1832–1883), domínio público, via Wikimedia Commons. Links de cada prancha em `content/site.ts` e no rodapé do site.
