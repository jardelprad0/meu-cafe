/* Duas estratégias, porque as duas coisas envelhecem de forma diferente:

   - HTML: rede primeiro, cache como reserva. O app inteiro vive no index.html,
     então uma versão publicada chega sozinha na próxima abertura, sem depender
     de eu lembrar de trocar o nome do cache a cada mudança.
   - Ícones e manifest: cache primeiro. Não mudam, e ler do disco é instantâneo.

   Bump em CACHE agora é opcional: serve para descartar estáticos antigos, não
   para entregar código novo. */
const CACHE = "meu-cafe-v4";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest",
                "./icon-180.png", "./icon-192.png", "./icon-512.png", "./icon-512-maskable.png"];
const NET_TIMEOUT = 3500;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const isHTML = req =>
  req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");

/* rede com prazo: sem isso, uma conexão ruim segura a abertura do app até o
   timeout do navegador, mesmo havendo uma cópia boa no cache */
function fromNetwork(req, ms){
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    fetch(req).then(
      res => { clearTimeout(timer); resolve(res); },
      err => { clearTimeout(timer); reject(err); }
    );
  });
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  if (isHTML(req)) {
    e.respondWith(
      fromNetwork(req, NET_TIMEOUT).then(res => {
        /* guarda nas duas chaves: a abertura pode ser em "./" ou em
           "./index.html", e as duas precisam da versão fresca na reserva */
        if (res.ok) {
          const a = res.clone(), b = res.clone();
          caches.open(CACHE).then(c => { c.put("./index.html", a); c.put("./", b); }).catch(() => {});
        }
        return res;
      }).catch(() =>
        caches.match(req).then(hit => hit || caches.match("./index.html"))
      )
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }))
  );
});
