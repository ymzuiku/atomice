import { useState as v, useMemo as S, useEffect as g, useRef as m, memo as R } from "react";
const f = typeof window > "u";
let u = !1;
function h(e, o, s = {}) {
  const l = [], i = [], c = JSON.stringify({ v: o });
  let d = !1;
  const t = {
    value: o,
    events: /* @__PURE__ */ new Set([]),
    setValue: () => {
    },
    loadStorage: async () => {
    },
    getDefaultValue: () => JSON.parse(c).v,
    addAfter: (r) => {
      i.push(r);
    },
    addBefore: (r) => {
      l.push(r);
    },
    Render: ({ children: r }) => r(o)
  };
  return s.after && t.addAfter(s.after), s.before && t.addBefore(s.before), t.Render = w(({ children: r }) => (V(t), r ? r(t.value) : t.value)), t.setValue = async (r) => {
    if (typeof r == "function" && (r = r(t.value)), r !== t.value) {
      t.value = r;
      for (const n of l)
        await Promise.resolve(n());
      if (setTimeout(() => {
        t.events.forEach((n) => {
          n(t.value);
        });
      }), !f && e)
        if (s.saveStorage)
          s.saveStorage(t.value);
        else {
          const n = s.storage === "sessionStorage" ? sessionStorage : localStorage, a = JSON.stringify({ v: t.value });
          t.value === "" || t.value === null || t.value === void 0 || a === c ? n.removeItem(e) : n.setItem(e, a);
        }
      for (const n of i)
        n();
    }
  }, e && (t.loadStorage = () => {
    if (!(!e || f || d))
      if (u = !0, d = !0, s.loadStorage)
        s.loadStorage(e).then((r) => {
          t.setValue(r);
        });
      else {
        const n = (s.storage === "sessionStorage" ? sessionStorage : localStorage).getItem(e);
        if (typeof n == "string")
          try {
            const a = JSON.parse(n).v;
            t.setValue(a);
          } catch {
          }
      }
  }, u && t.loadStorage()), t;
}
function J(e, o) {
  return h("", e, o);
}
const A = [];
function V(e) {
  const [o, s] = v(e.value);
  return S(() => {
    e.events.add(s);
  }, []), g(() => (e.events.add(s), e.loadStorage(), () => {
    e.events.delete(s);
  }), A), [o, e.setValue];
}
function N(e) {
  const o = () => {
    if (!f) {
      if (!u) {
        setTimeout(o);
        return;
      }
      e();
    }
  };
  o();
}
function O({ children: e }) {
  return m(e).current;
}
function w(e) {
  return R(e, () => !1);
}
export {
  O as Block,
  J as atom,
  h as atomWithStorage,
  N as onStorageLoaded,
  w as staticComponent,
  V as useRerender
};
