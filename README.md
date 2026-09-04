# Meu Café — registro de extração

No ar em **[jardelprad0.github.io/meu-cafe](https://jardelprad0.github.io/meu-cafe/)**

App de página única para registrar extrações de café e receber sugestão de moagem
em cliques de moedor manual (12 cliques por volta, padrão do iCoffee M3 Pro).

Métodos: V60, café passado, prensa francesa e espresso 15 bar.

Não tem servidor, não tem conta, não tem rastreamento. Os dados ficam no
`localStorage` do próprio navegador, e há exportação/importação em JSON em
**Configurações** para backup e troca de aparelho.

## Configurações

A engrenagem no topo abre uma gaveta lateral com:

- **Moedor** — cliques por volta do seu moedor (4 a 60, padrão 12). Muda a
  leitura da sugestão em voltas e as marcas do mostrador; o número de cliques
  em si não muda.
- **Backup** — exportar e importar JSON.
- **Neste aparelho** — cafés, extrações, fotos e espaço ocupado.
- **Zona de risco** — apagar tudo, com confirmação.

A preferência do moedor vai junto no `localStorage` e no arquivo exportado.

## Foto do pacote

Cada café aceita uma foto do pacote, tirada na hora ou escolhida da galeria —
pelo formulário de cadastro ou pelo botão na lista, para cafés já cadastrados.

A imagem é reduzida no próprio navegador antes de salvar: no máximo 640 px no
lado maior, JPEG a 72%, o que costuma dar uns 60 KB por foto. A orientação do
EXIF é resolvida via `createImageBitmap`, senão foto de iPhone entra deitada.

O `localStorage` guarda por volta de 5 MB no total. Se uma foto não couber, o
app desfaz a operação e avisa em vez de fingir que salvou. As fotos vão junto no
JSON exportado, então o arquivo de backup cresce com elas.

## Arquivos

| arquivo | função |
| --- | --- |
| `index.html` | o app inteiro (HTML, CSS e JS, sem dependências externas) |
| `manifest.webmanifest` | metadados para instalar como app |
| `sw.js` | service worker: faz o app abrir mesmo sem internet |
| `icon-*.png` | ícones |

## Layout

Uma coluna de 560 px (`--shell`) centralizada, com cabeçalho, abas e conteúdo
alinhados na mesma largura. Até 819 px de tela as abas ficam fixas embaixo, ao
alcance do polegar; de 820 px para cima elas sobem para o topo, logo abaixo do
cabeçalho, e a barra fixa some. O mostrador de moagem tem teto de 340 px para
não virar um relógio de parede no desktop, e encolhe em telas baixas (celular
deitado). Testado de 320 px a 1600 px, sem rolagem horizontal.

## Publicação

Já está publicado pelo GitHub Pages, servindo a branch `main` a partir da raiz
(**Settings › Pages**). Todo `git push` para `main` republica em um ou dois
minutos.

## Instalar no iPhone

1. Abra [jardelprad0.github.io/meu-cafe](https://jardelprad0.github.io/meu-cafe/)
   **no Safari** (não funciona pelo Chrome no iOS).
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
- Use **Configurações › Exportar JSON** de vez em quando. Para restaurar ou
  migrar, use **Importar** — ele mescla, não sobrescreve.

## Ajustar as referências de moagem

As faixas iniciais estão no topo do `<script>` em `index.html`, no objeto
`METHODS`. Cada método tem `baseClicks` (ponto de partida), `min` e `max` (a
faixa destacada no mostrador), `baseOutput`, `baseRatio` e `target` (tempo alvo em
segundos).

Os cliques por volta do moedor não ficam mais no código — são ajustados em
**Configurações › Moedor**. O valor inicial está em `DEFAULTS.cpt`.

## Publicar uma mudança

O `sw.js` serve tudo do cache primeiro, então **toda mudança no `index.html`
precisa de um bump na constante `CACHE`** (`meu-cafe-v2` → `v3`, e assim por
diante). Sem isso o app já instalado continua abrindo a versão antiga
indefinidamente. Depois é só `git push` para `main`.
