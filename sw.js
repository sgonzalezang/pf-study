/* STCL Fall 2026 — network-first shell SW. Bump CACHE to force-update installed PWAs. */
const CACHE="stcl-fall-2026-v6";
self.addEventListener("install",e=>{self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const url=new URL(e.request.url);
  if(url.hostname.endsWith("firebaseio.com")) return;
  if(url.origin!==location.origin) return;
  e.respondWith(
    fetch(e.request).then(res=>{
      if(e.request.method==="GET" && res.ok){ const c=res.clone(); caches.open(CACHE).then(x=>x.put(e.request,c)); }
      return res;
    }).catch(()=> caches.match(e.request).then(h=> h || caches.match("./index.html")))
  );
});
