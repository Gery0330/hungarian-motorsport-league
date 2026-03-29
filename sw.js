self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open("hml-cache").then(cache=>{
      return cache.addAll([
        "/",
        "/index.html",
        "/live.html",
        "/hall-of-fame.html"
      ]);
    })
  );
});