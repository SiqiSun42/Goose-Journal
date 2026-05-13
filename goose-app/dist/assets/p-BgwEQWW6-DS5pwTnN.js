import { a as o$1, w } from "./index-jIKUKRM8.js";
const o = (o2) => {
  if (void 0 === o$1) return;
  let s, p, u, l = 0;
  const d = o2.getBoolean("animated", true) && o2.getBoolean("rippleEffect", true), v = /* @__PURE__ */ new WeakMap(), m = () => {
    u && clearTimeout(u), u = void 0, s && (j(false), s = void 0);
  }, T = (t, o3) => {
    if (t && t === s) return;
    u && clearTimeout(u), u = void 0;
    const { x: i2, y: r2 } = w(o3);
    if (s) {
      if (v.has(s)) throw new Error("internal error");
      s.classList.contains(a) || w$1(s, i2, r2), j(true);
    }
    if (t) {
      const e = v.get(t);
      e && (clearTimeout(e), v.delete(t)), t.classList.remove(a);
      const o4 = () => {
        w$1(t, i2, r2), u = void 0;
      };
      n(t) ? o4() : u = setTimeout(o4, c);
    }
    s = t;
  }, w$1 = (t, e, o3) => {
    if (l = Date.now(), t.classList.add(a), !d) return;
    const i2 = r(t);
    null !== i2 && (b(), p = i2.addRipple(e, o3));
  }, b = () => {
    void 0 !== p && (p.then(((t) => t())), p = void 0);
  }, j = (t) => {
    b();
    const e = s;
    if (!e) return;
    const o3 = f - Date.now() + l;
    if (t && o3 > 0 && !n(e)) {
      const t2 = setTimeout((() => {
        e.classList.remove(a), v.delete(e);
      }), f);
      v.set(e, t2);
    } else e.classList.remove(a);
  };
  o$1.addEventListener("ionGestureCaptured", m), o$1.addEventListener("pointerdown", ((t) => {
    s || 2 === t.button || T(i(t), t);
  }), true), o$1.addEventListener("pointerup", ((t) => {
    T(void 0, t);
  }), true), o$1.addEventListener("pointercancel", m, true);
}, i = (t) => {
  if (void 0 === t.composedPath) return t.target.closest(".ion-activatable");
  {
    const e = t.composedPath();
    for (let t2 = 0; t2 < e.length - 2; t2++) {
      const o2 = e[t2];
      if (!(o2 instanceof ShadowRoot) && o2.classList.contains("ion-activatable")) return o2;
    }
  }
}, n = (t) => t.classList.contains("ion-activatable-instant"), r = (t) => {
  if (t.shadowRoot) {
    const e = t.shadowRoot.querySelector("ion-ripple-effect");
    if (e) return e;
  }
  return t.querySelector("ion-ripple-effect");
}, a = "ion-activated", c = 100, f = 150;
export {
  o as startTapClick
};
