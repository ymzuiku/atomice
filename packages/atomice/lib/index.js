var h = Object.defineProperty;
var v = (e, t, s) => t in e ? h(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var c = (e, t, s) => (v(e, typeof t != "symbol" ? t + "" : t, s), s);
import { useState as g, useMemo as T, useEffect as p, useRef as w, memo as V } from "react";
class d {
  constructor(t) {
    c(this, "timer", null);
    c(this, "lastTime", 0);
    this.delay = t;
  }
  throttle(t) {
    const s = Date.now();
    !this.timer || s - this.lastTime >= this.delay ? (t(), this.lastTime = s) : (this.timer && clearTimeout(this.timer), this.timer = setTimeout(() => {
      t(), this.lastTime = Date.now();
    }, this.delay));
  }
  clear() {
    this.timer && (clearTimeout(this.timer), this.timer = null);
  }
}
const y = new d(16), R = new d(16), u = typeof window > "u";
let l = !1;
function A(e, t, s = {}) {
  const i = [], f = JSON.stringify({ v: t });
  let m = !1;
  const r = {
    value: t,
    events: /* @__PURE__ */ new Set([]),
    setValue: () => {
    },
    loadStorage: async () => {
    },
    getDefaultValue: () => JSON.parse(f).v,
    listen: (o) => {
      i.push(o);
    },
    Render: ({ children: o }) => o(t)
  };
  return r.Render = N(({ children: o }) => (S(r), o ? o(r.value, r.setValue) : r.value)), r.setValue = async (o) => {
    if (typeof o == "function" && (o = o(r.value)), o !== r.value && (r.value = o, await Promise.all(
      i.map((n) => Promise.resolve(n(r.value)))
    ), setTimeout(() => {
      R.throttle(() => {
        r.events.forEach((n) => {
          n(r.value);
        });
      });
    }), !u && e))
      if (s.saveStorage)
        s.saveStorage(r.value);
      else {
        const n = s.storageType === "sessionStorage" ? sessionStorage : localStorage, a = JSON.stringify({ v: r.value });
        r.value === "" || r.value === null || r.value === void 0 || a === f ? n.removeItem(e) : n.setItem(e, a);
      }
  }, e && (r.loadStorage = () => {
    if (!(!e || u || m))
      if (l = !0, m = !0, s.loadStorage)
        s.loadStorage(e).then((o) => {
          r.setValue(o);
        });
      else {
        const n = (s.storageType === "sessionStorage" ? sessionStorage : localStorage).getItem(e);
        if (typeof n == "string")
          try {
            const a = JSON.parse(n).v;
            r.setValue(a);
          } catch {
          }
      }
  }, e && (l ? r.loadStorage() : setTimeout(() => {
    r.loadStorage();
  }, 500))), r;
}
function E(e) {
  return A("", e);
}
const J = [];
function S(e) {
  const [t, s] = g(e.value);
  return T(() => {
    e.events.add(s);
  }, []), p(() => (e.events.add(s), e.loadStorage(), () => {
    e.events.delete(s);
  }), J), [t, s];
}
function I(e) {
  const [t] = S(e);
  return t;
}
function M(e) {
  const t = () => {
    if (!u) {
      if (!l) {
        setTimeout(t);
        return;
      }
      e();
    }
  };
  t();
}
function P({ children: e }) {
  return w(e).current;
}
function N(e) {
  return V(e, () => !1);
}
function B(e) {
  if (u)
    return;
  const t = () => {
    l ? e() : setTimeout(t, 50);
  };
  t();
}
function C(e, t) {
  const s = E(e());
  return t.forEach((i) => {
    i.listen(() => {
      y.throttle(() => {
        s.setValue(e());
      });
    });
  }), s;
}
export {
  P as Block,
  E as atom,
  C as atomWithComputed,
  A as atomWithStorage,
  B as onMount,
  M as onStorageLoaded,
  N as staticComponent,
  S as useAtom,
  I as useAtomValue
};
