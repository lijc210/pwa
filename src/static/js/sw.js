// 定义静态资源列表
const staticAssets = [
  "/",
  "/index.html",
  "/static/js/sw.js",
  "/static/js/app.js",
  "/static/css/app.css",
];
const staticCacheName = "static-assets";
const dynamicCacheName = "dynamic-assets";

// 当 Service Worker 安装时触发，用于缓存静态资源
self.addEventListener("install", async (event) => {
  console.log("sw install"); // 在控制台输出安装信息

  // 打开staticCache缓存
  const cache = await caches.open(staticCacheName);

  // 将静态资源添加到缓存中
  cache.addAll(staticAssets);
});

// 当页面发起网络请求时触发，用于拦截网络请求并处理缓存
self.addEventListener("fetch", async (event) => {
  console.log("sw fetch"); // 在控制台输出网络请求信息

  // 获取请求对象
  const req = event.request;
  // 解析请求的 URL
  const url = new URL(req.url);

  // 如果请求的是同源资源，则使用缓存优先策略
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req)); // 使用 cacheFirst 函数处理请求
  } else {
    // 否则使用网络优先策略
    // event.respondWith(networkFirst(req)); // 使用 networkFirst 函数处理请求
    event.respondWith(cacheFirst(req)); // 使用 cacheFirst 函数处理请求
  }
});

// 定义缓存优先策略：先检查缓存是否有匹配的资源，若有则直接返回缓存中的响应，否则向网络发起请求获取响应
async function cacheFirst(req) {
  // 尝试从缓存中获取匹配请求的响应
  const cachedResponse = await caches.match(req);
  // 如果缓存中存在匹配的响应，则直接返回缓存中的响应，否则向网络发起请求获取响应
  console.log("cache first", cachedResponse);
  if (cachedResponse) {
    return cachedResponse;
  } else {
    // 向网络发起请求获取响应
    const res = await fetch(req);
    // 将获取的响应存入缓存中
    const cache = await caches.open(dynamicCacheName);
    cache.put(req, res.clone());
    // 返回获取的响应
    return res;
  }
}

// 定义网络优先策略：先向网络发起请求获取响应，若请求失败则从缓存中获取响应，若缓存中没有则返回错误信息
async function networkFirst(req) {
  // 打开dynamicCache缓存
  const cache = await caches.open(dynamicCacheName);

  try {
    // 向网络发起请求获取响应
    const res = await fetch(req);
    // 将获取的响应存入缓存中
    cache.put(req, res.clone());
    // 返回获取的响应
    console.log("network first", res);
    return res;
  } catch (error) {
    // 如果请求失败，则从缓存中获取匹配请求的响应
    return await cache.match(req);
  }
}
