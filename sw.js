const CACHE='pf-v6';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest']).catch(()=>{})));});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})());});
self.addEventListener('fetch',e=>{
  const req=e.request, url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==location.origin)return;            // let Firebase & cross-origin hit network
  e.respondWith((async()=>{
    try{const fresh=await fetch(req);(await caches.open(CACHE)).put(req,fresh.clone());return fresh;}  // online: fresh + update cache
    catch(err){const c=await caches.match(req);if(c)return c;if(req.mode==='navigate'){const i=await caches.match('./index.html');if(i)return i;}throw err;} // offline: cache
  })());
});
