if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,t)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let o={};const l=e=>i(e,r),d={module:{uri:r},exports:o,require:l};s[r]=Promise.all(n.map((e=>d[e]||l(e)))).then((e=>(t(...e),o)))}}define(["./workbox-b3e22772"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index.a3c5e729.css",revision:null},{url:"assets/index.f54de9f7.js",revision:null},{url:"index.html",revision:"c58679e7c1bd19d71a67f8e2c0621b5b"},{url:"lofifm.png",revision:"4d062e26f2d3fcdbee25f043dae068ff"},{url:"manifest.webmanifest",revision:"73d79304ef3341939d4e9a42b86ad57e"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));