import { useRef as S, memo as g, useMemo as v, useState as m, useEffect as R } from "react";
const f = typeof window > "u";
let u = !1;
function B(e, o, s = {}) {
  const l = [], c = [], i = JSON.stringify({ v: o });
  let d = !1;
  const t = {
    value: o,
    events: /* @__PURE__ */ new Set([]),
    setValue: () => {
    },
    loadStorage: async () => {
    },
    getDefaultValue: () => JSON.parse(i).v,
    addAfter: (r) => {
      c.push(r);
    },
    addBefore: (r) => {
      l.push(r);
    },
    Render: ({ children: r }) => r(o)
  };
  return s.after && t.addAfter(s.after), s.before && t.addBefore(s.before), t.Render = V(({ children: r }) => (A(t), r ? r(t.value) : t.value)), t.setValue = async (r) => {
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
          t.value === "" || t.value === null || t.value === void 0 || a === i ? n.removeItem(e) : n.setItem(e, a);
        }
      for (const n of c)
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
  return B("", e, o);
}
const h = [];
function A(e) {
  const [o, s] = m(e.value);
  return v(() => {
    e.events.add(s);
  }, []), R(() => (e.events.add(s), e.loadStorage(), () => {
    e.events.delete(s);
  }), h), [o, e.setValue];
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
  return S(e).current;
}
function V(e) {
  return g(e, () => !1);
}
function E(e) {
  return v(e, []);
}
export {
  O as Block,
  J as atom,
  B as atomWithStorage,
  N as onStorageLoaded,
  V as staticComponent,
  E as useBlock
};
