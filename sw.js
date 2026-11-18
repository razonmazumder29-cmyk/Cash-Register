// ইন্টারনেট ছাড়াও অ্যাপ চালানোর জন্য। নতুন ভার্সন দিলে VERSION বদলান।
var VERSION='cashreg-v1';
var FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(FILES);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==VERSION;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
// নেটওয়ার্ক আগে (নতুন ভার্সন পেতে), না পেলে ক্যাশ থেকে
self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET')return;
  var url=new URL(req.url);
  if(url.origin!==location.origin)return;
  e.respondWith(fetch(req).then(function(res){
    var copy=res.clone();
    caches.open(VERSION).then(function(c){c.put(req,copy);});
    return res;
  }).catch(function(){return caches.match(req).then(function(r){return r||caches.match('./index.html');});}));
});
