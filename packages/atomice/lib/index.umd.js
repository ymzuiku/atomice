(function(o,s){typeof exports=="object"&&typeof module<"u"?s(exports,require("react")):typeof define=="function"&&define.amd?define(["exports","react"],s):(o=typeof globalThis<"u"?globalThis:o||self,s(o.atomice={},o.React))})(this,function(o,s){"use strict";var E=Object.defineProperty;var J=(o,s,u)=>s in o?E(o,s,{enumerable:!0,configurable:!0,writable:!0,value:u}):o[s]=u;var h=(o,s,u)=>(J(o,typeof s!="symbol"?s+"":s,u),u);class u{constructor(n){h(this,"timer",null);h(this,"lastTime",0);this.delay=n}throttle(n){const i=Date.now();!this.timer||i-this.lastTime>=this.delay?(n(),this.lastTime=i):(this.timer&&clearTimeout(this.timer),this.timer=setTimeout(()=>{n(),this.lastTime=Date.now()},this.delay))}clear(){this.timer&&(clearTimeout(this.timer),this.timer=null)}}const V=new u(16),p=new u(16),f=typeof window>"u";let c=!1;function S(e,n,i={}){const m=[],T=JSON.stringify({v:n});let y=!1;const t={value:n,events:new Set([]),setValue:()=>{},loadStorage:async()=>{},getDefaultValue:()=>JSON.parse(T).v,listen:r=>{m.push(r)},Render:({children:r})=>r(n)};return t.Render=g(({children:r})=>(d(t),r?r(t.value,t.setValue):t.value)),t.setValue=async r=>{if(typeof r=="function"&&(r=r(t.value)),r!==t.value&&(t.value=r,await Promise.all(m.map(a=>Promise.resolve(a(t.value)))),setTimeout(()=>{p.throttle(()=>{t.events.forEach(a=>{a(t.value)})})}),!f&&e))if(i.saveStorage)i.saveStorage(t.value);else{const a=i.storageType==="sessionStorage"?sessionStorage:localStorage,l=JSON.stringify({v:t.value});t.value===""||t.value===null||t.value===void 0||l===T?a.removeItem(e):a.setItem(e,l)}},e&&(t.loadStorage=()=>{if(!(!e||f||y))if(c=!0,y=!0,i.loadStorage)i.loadStorage(e).then(r=>{t.setValue(r)});else{const a=(i.storageType==="sessionStorage"?sessionStorage:localStorage).getItem(e);if(typeof a=="string")try{const l=JSON.parse(a).v;t.setValue(l)}catch{}}},e&&(c?t.loadStorage():setTimeout(()=>{t.loadStorage()},500))),t}function v(e){return S("",e)}const w=[];function d(e){const[n,i]=s.useState(e.value);return s.useMemo(()=>{e.events.add(i)},[]),s.useEffect(()=>(e.events.add(i),e.loadStorage(),()=>{e.events.delete(i)}),w),[n,i]}function R(e){const[n]=d(e);return n}function A(e){const n=()=>{if(!f){if(!c){setTimeout(n);return}e()}};n()}function M({children:e}){return s.useRef(e).current}function g(e){return s.memo(e,()=>!1)}function O(e){if(f)return;const n=()=>{c?e():setTimeout(n,50)};n()}function C(e,n){const i=v(e());return n.forEach(m=>{m.listen(()=>{V.throttle(()=>{i.setValue(e())})})}),i}o.Block=M,o.atom=v,o.atomWithComputed=C,o.atomWithStorage=S,o.onMount=O,o.onStorageLoaded=A,o.staticComponent=g,o.useAtom=d,o.useAtomValue=R,Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})});
