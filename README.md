# Bancada — registro de café

App de página única para registrar extrações de café e receber sugestão de moagem
em cliques de moedor manual (12 cliques por volta, padrão do iCoffee M3 Pro).

Métodos: V60, café passado, prensa francesa e espresso 15 bar.

Não tem servidor, não tem conta, não tem rastreamento. Os dados ficam no
`localStorage` do próprio navegador, e há exportação/importação em JSON na aba
Histórico para backup e troca de aparelho.

## Arquivos

| arquivo | função |
|---|---|
| `index.html` | o app inteiro (HTML, CSS e JS, sem dependências externas) |
| `manifest.webmanifest` | metadados para instalar como app |
| `sw.js` | service worker: faz o app abrir mesmo sem internet |
| `icon-*.png` | ícones |

## Publicar no GitHub Pages

1. Crie um repositório novo, por exemplo `bancada-cafe`.
2. Envie todos os arquivos desta pasta para a raiz do repositório
   (pelo site do GitHub: **Add file › Upload files**, arraste tudo, **Commit**).
3. No repositório: **Settings › Pages**.
4. Em *Source*, escolha **Deploy from a branch**; branch `main`, pasta `/ (root)`. Salve.
5. Aguarde um ou dois minutos. O endereço será
   `https://SEU-USUARIO.github.io/bancada-cafe/`.

O repositório pode ser público ou privado — no plano gratuito, o Pages exige
repositório público.

## Instalar no iPhone

1. Abra o endereço acima **no Safari** (não funciona pelo Chrome no iOS).
2. Toque no botão de compartilhar (o quadrado com a seta para cima).
3. Escolha **Adicionar à Tela de Início**.
4. Confirme. O ícone aparece junto dos outros apps e abre em tela cheia, sem
   barra de navegador.

No Android é o mesmo caminho pelo Chrome: menu **⋮ › Instalar app**.

## Sobre os dados

- Ficam apenas neste navegador, neste aparelho.
- Apagar os dados do site, "limpar histórico e dados" ou desinstalar remove tudo.
- iOS pode descartar dados de sites não usados por várias semanas; instalar na
  tela de início reduz esse risco, mas o backup é o que garante.
- Use **Histórico › Exportar JSON** de vez em quando. Para restaurar ou migrar,
  use **Importar** — ele mescla, não sobrescreve.

## Ajustar as referências de moagem

As faixas iniciais estão no topo do `<script>` em `index.html`, no objeto
`METHODS`. Cada método tem `baseClicks` (ponto de partida), `min` e `max` (a
faixa destacada no mostrador), `baseOutput`, `baseRatio` e `target` (tempo alvo em
segundos). Se o seu moedor tiver outro número de cliques por volta, mude a
constante `CPT`.
