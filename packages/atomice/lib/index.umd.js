(function(r,f){typeof exports=="object"&&typeof module<"u"?f(exports,require("react")):typeof define=="function"&&define.amd?define(["exports","react"],f):(r=typeof globalThis<"u"?globalThis:r||self,f(r.atomice={},r.React))})(this,function(r,f){"use strict";const i=typeof window>"u";let d=!1;function l(e,a,o={}){const S=[],v=[],g=JSON.stringify({v:a});let m=!1;const t={value:a,events:new Set([]),setValue:()=>{},loadStorage:async()=>{},getDefaultValue:()=>JSON.parse(g).v,addAfter:n=>{v.push(n)},addBefore:n=>{S.push(n)},Render:({children:n})=>n(a)};return o.after&&t.addAfter(o.after),o.before&&t.addBefore(o.before),t.Render=c(({children:n})=>(y(t),n?n(t.value):t.value)),t.setValue=async n=>{if(typeof n=="function"&&(n=n(t.value)),n!==t.value){t.value=n;for(const s of S)await Promise.resolve(s());if(setTimeout(()=>{t.events.forEach(s=>{s(t.value)})}),!i&&e)if(o.saveStorage)o.saveStorage(t.value);else{const s=o.storage==="sessionStorage"?sessionStorage:localStorage,u=JSON.stringify({v:t.value});t.value===""||t.value===null||t.value===void 0||u===g?s.removeItem(e):s.setItem(e,u)}for(const s of v)s()}},e&&(t.loadStorage=()=>{if(!(!e||i||m))if(d=!0,m=!0,o.loadStorage)o.loadStorage(e).then(n=>{t.setValue(n)});else{const s=(o.storage==="sessionStorage"?sessionStorage:localStorage).getItem(e);if(typeof s=="string")try{const u=JSON.parse(s).v;t.setValue(u)}catch{}}},d&&t.loadStorage()),t}function h(e,a){return l("",e,a)}const R=[];function y(e){const[a,o]=f.useState(e.value);return f.useMemo(()=>{e.events.add(o)},[]),f.useEffect(()=>(e.events.add(o),e.loadStorage(),()=>{e.events.delete(o)}),R),[a,e.setValue]}function B(e){const a=()=>{if(!i){if(!d){setTimeout(a);return}e()}};a()}function T({children:e}){return f.useRef(e).current}function c(e){return f.memo(e,()=>!1)}r.Block=T,r.atom=h,r.atomWithStorage=l,r.onStorageLoaded=B,r.staticComponent=c,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})});
