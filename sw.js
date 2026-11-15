const CACHE="drp-v3";
const FILES=["./","index.html","manifest.webmanifest","logo.png","icon-192.png","icon-512.png","icon-maskable-512.png","apple-touch-icon.png","lib/xlsx.mini.min.js","lib/jspdf.umd.min.js","lib/jspdf.plugin.autotable.min.js","lib/zxing-reader.js","lib/zxing_reader.wasm"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
// network first (so data.dat is always fresh when online), cached copy when offline
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);if(u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(u.pathname.endsWith("data.dat")?"data.dat":e.request,c))}return r})
    .catch(()=>caches.match(u.pathname.endsWith("data.dat")?"data.dat":e.request).then(m=>m||caches.match("index.html"))));
});
