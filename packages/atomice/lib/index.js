import { useRef as v, memo as S, useState as g, useMemo as m, useEffect as R } from "react";
const f = typeof window > "u";
let u = !1;
function h(e, n, s = {}) {
  const l = [], i = [], c = JSON.stringify({ v: n });
  let d = !1;
  const t = {
    value: n,
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
    Render: ({ children: r }) => r(n)
  };
  return s.after && t.addAfter(s.after), s.before && t.addBefore(s.before), t.Render = V(({ children: r }) => (B(t), r ? r(t.value) : t.value)), t.setValue = async (r) => {
    if (typeof r == "function" && (r = r(t.value)), r !== t.value) {
      t.value = r;
      for (const o of l)
        await Promise.resolve(o());
      if (setTimeout(() => {
        t.events.forEach((o) => {
          o(t.value);
        });
      }), !f && e)
        if (s.saveStorage)
          s.saveStorage(t.value);
        else {
          const o = s.storage === "sessionStorage" ? sessionStorage : localStorage, a = JSON.stringify({ v: t.value });
          t.value === "" || t.value === null || t.value === void 0 || a === c ? o.removeItem(e) : o.setItem(e, a);
        }
      for (const o of i)
        o();
    }
  }, e && (t.loadStorage = () => {
    if (!(!e || f || d))
      if (u = !0, d = !0, s.loadStorage)
        s.loadStorage(e).then((r) => {
          t.setValue(r);
        });
      else {
        const o = (s.storage === "sessionStorage" ? sessionStorage : localStorage).getItem(e);
        if (typeof o == "string")
          try {
            const a = JSON.parse(o).v;
            t.setValue(a);
          } catch {
          }
      }
  }, u && t.loadStorage()), t;
}
function J(e, n) {
  return h("", e, n);
}
const A = [];
function B(e) {
  const [n, s] = g(e.value);
  return m(() => {
    e.events.add(s);
  }, []), R(() => (e.events.add(s), e.loadStorage(), () => {
    e.events.delete(s);
  }), A), [n, e.setValue];
}
function N(e) {
  const n = () => {
    if (!f) {
      if (!u) {
        setTimeout(n);
        return;
      }
      e();
    }
  };
  n();
}
function O({ children: e }) {
  return v(e).current;
}
function V(e) {
  return S(e, () => !1);
}
export {
  O as Block,
  J as atom,
  h as atomWithStorage,
  N as onStorageLoaded,
  V as staticComponent
};
