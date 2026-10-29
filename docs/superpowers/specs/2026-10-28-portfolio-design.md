# Portfólio Nicolas de Vargas — design

Data: 2026-10-28 · Status: aprovado para implementação

## Intenção

Nos primeiros segundos o site precisa dizer três coisas: **curioso por várias áreas**, **produz muito**, e **o acabamento prova que domina desenvolvimento**. A versão anterior pareceu amadora (cartões genéricos, placeholder listrado, nenhum movimento, arte desbotada só no topo). A nova tem que parecer trabalho de estúdio: espaço generoso, escala tipográfica pensada, movimento amarrado à rolagem, nada de template.

## Linguagem visual

- Base: protótipo A. Tinta violeta `#3b2bb8`, papel creme `#fbf8ec`, meio-tom `#8f84e0`.
- Tipografia: Cormorant Garamond (títulos, números grandes, capitulares) + Inter (texto). Eyebrows em caixa alta espaçada. Algarismos alinhados (`lnum`) nos números grandes.
- Escala (fluida com `clamp`): texto 17px · h3 36px · h2 de capítulo até 144px · h1 até 100px · estatísticas até 150px.
- Gravuras de Gustave Doré (domínio público, Wikimedia Commons) recoloridas com `ImageOps.colorize(black=#3b2bb8, mid=#8f84e0, white=#fbf8ec)`. A arte aparece em tela cheia e com força total; o creme só cobre onde há texto.
- Molduras: caixas retas com fio de 1px (sem cantos arredondados), como etiquetas de prancha impressa.
- Referências: tavus.io/griffin (título serifado grande, três estatísticas enormes, tom de revista) e o rodapé "Hashi" (gravura violeta com pássaros voando).

## Estrutura

1. **Capa** — hipogrifo do Doré em tela cheia (WebGL), gravado na tela uma vez ao carregar (~2 s). Texto à direita sobre um véu creme lateral, para não lavar a arte. Título editável em `content/site.ts`. Botões "Ver projetos" e "Currículo". Logo abaixo, três números enormes que contam ao aparecer: commits em 2026 (duas contas), 100+ vendedores treinados, 4 áreas. O tamanho dos números segue a largura do grid (`cqi`), igual nas três colunas, para caberem com folga de 375 a 1440 px.
2. **Quatro capítulos** (IA aplicada, Pesquisa de modelos, Games, Produtos e web), cada um com uma seção de altura natural (~uma tela no desktop): a gravura de fundo é gravada pelo shader **uma vez** ao entrar na tela (1,2 s, sem amarrar ao scroll, sem pin), e os projetos da área ficam num **carrossel horizontal** (rolagem nativa com scroll-snap, setas, arrastar com o mouse, swipe, teclado ← → Home End, indicador "01 / 04" com traços clicáveis; sem autoplay). Revisão de 28/10: o dono achou cansativas as animações amarradas à rolagem; a página caiu de ~24.900 px para ~8.900 px no desktop. Cada cartão traz uma frase curta sobre o que é ou o resultado, sem receita técnica (stack só como tags), e o número de destaque. Projetos sem número usam uma capitular serifada; projetos sem mídia usam um recorte ampliado da própria gravura (nunca caixa listrada). Dewe ganha prancha larga de destaque.
3. **Mapa de commits** de 2026 no formato do GitHub, em violeta, com total, melhor dia, maior sequência e mês mais ativo.
4. **Sobre** curto com foto em duotone violeta.
5. **Rodapé** no padrão das referências Evernote/Noetic/Hashi: papel creme em cima (logo, frase, e-mail grande, ícones em caixinhas, colunas serifadas de links e créditos) e, embaixo, uma paisagem larga do Doré ("Lavadeiras às margens do Tejo", *L'Espagne*, 1874) que nasce do papel (topo dissolvido por máscara, névoa creme), com parallax suave, pássaros em SVG e a linha de copyright por cima. A linha traz "Em Belo Horizonte, HH:MM" ao vivo (fuso de São Paulo).

## Decisões técnicas

- Next.js (App Router, TypeScript), `output: "export"`, pronto para Vercel. Sem `next/image` (export estático): `<picture>` com AVIF + WebP em 4 larguras.
- **Assinatura: shader de gravura** em WebGL puro (um quad, uma textura, sem biblioteca). A textura vem da própria `<img>` já carregada (sem download duplo). Revelação: a tela é dividida em linhas finas; cada linha é "riscada" da esquerda para a direita com atraso aleatório, os traços escuros aparecem primeiro como hachura que engrossa até virar a imagem inteira. Roda uma vez por gravura; ao terminar, o canvas é descartado e fica a `<img>` com o mesmo enquadramento (GPU liberada).
- Fallbacks: sem WebGL → máscara CSS com o mesmo tempo; com `prefers-reduced-motion` → imagem estática, sem animações de entrada, carrossel sem rolagem suave, números já no valor final.
- GSAP + ScrollTrigger só para entradas que disparam uma vez. Lenis removido: rolagem nativa, que também deixa o carrossel horizontal natural no trackpad e no toque.
- Conteúdo centralizado em `content/site.ts` e `content/projects.ts`.
- Commits: `scripts/fetch-contributions.mjs` consulta a GraphQL do GitHub (`viewer.contributionsCollection`) com `GITHUB_TOKEN_PESSOAL` e `GITHUB_TOKEN_EMPRESA`, soma os dois calendários e grava `content/contributions.json`. Nenhum nome de repositório é consultado nem gravado. Sem tokens, o repositório traz um JSON de exemplo com `"exemplo": true`, e o site sinaliza isso.
- Hospedagem: Vercel ou GitHub Pages. `basePath`/`assetPrefix` vêm de `BASE_PATH` (vazio na Vercel e em site de usuário; `/<repo>` em repo de projeto); workflow `.github/workflows/pages.yml` com `actions/deploy-pages` e `.nojekyll`.
- Imagens: `scripts/process-images.py` (download + recolorização em PIL) e `scripts/build-images.mjs` (sharp → AVIF/WebP responsivos).

## Restrições

- Todo texto em pt-BR. Nenhum nome de cliente da empresa; projetos descritos por setor.
- Não inventar números: só os fornecidos pelo dono. Sem valores em dólar no site (só o percentual de custo).
- Celular (375px) e desktop; sem rolagem horizontal; contraste AA; foco visível; `alt` nas imagens.

## Em aberto

- Título da capa (escolhido provisoriamente: "Engenheiro de IA. Levo ideias de protótipo a produto, e meço o resultado.").
- Dados reais de commits (depende dos tokens).
- Dewe: stack, link e imagem. Deletrica e Cafelipe: imagem e link. Vídeos/prints dos projetos.
- A gravura de Games (Idylls of the King 14) só existe em 930px no Commons; foi ampliada com Lanczos e fica um pouco macia em telas grandes. Trocar por outra prancha se incomodar.
