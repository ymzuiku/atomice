import { useState as S, useMemo as v, useEffect as g, useRef as m, memo as R } from "react";
const u = typeof window > "u";
let f = !1;
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
  return s.after && t.addAfter(s.after), s.before && t.addBefore(s.before), t.Render = V(({ children: r }) => (T(t), r ? r(t.value) : t.value)), t.setValue = async (r) => {
    if (typeof r == "function" && (r = r(t.value)), r !== t.value) {
      t.value = r;
      for (const n of l)
        await Promise.resolve(n());
      if (setTimeout(() => {
        t.events.forEach((n) => {
          n(t.value);
        });
      }), !u && e)
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
    if (!(!e || u || d))
      if (f = !0, d = !0, s.loadStorage)
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
  }, e && (f ? t.loadStorage() : setTimeout(() => {
    t.loadStorage();
  }, 500))), t;
}
function B(e, o) {
  return h("", e, o);
}
const A = [];
function T(e) {
  const [o, s] = S(e.value);
  return v(() => {
    e.events.add(s);
  }, []), g(() => (e.events.add(s), e.loadStorage(), () => {
    e.events.delete(s);
  }), A), [o, e.setValue];
}
function J(e) {
  const o = () => {
    if (!u) {
      if (!f) {
        setTimeout(o);
        return;
      }
      e();
    }
  };
  o();
}
function N({ children: e }) {
  return m(e).current;
}
function V(e) {
  return R(e, () => !1);
}
function O(e) {
  const o = () => {
    f ? e() : setTimeout(o, 50);
  };
  o();
}
export {
  N as Block,
  B as atom,
  h as atomWithStorage,
  O as onMount,
  J as onStorageLoaded,
  V as staticComponent,
  T as useRerender
};
