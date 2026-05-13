import { a as o, t, l, e, f as f$1, u as u$1, i, d, g as d$1, h as i$1, j as c } from "./index-jIKUKRM8.js";
const u = /* @__PURE__ */ new WeakMap(), f = (o2, n, t2, i2 = 0, r = false) => {
  u.has(o2) !== t2 && (t2 ? w(o2, n, i2, r) : p(o2, n));
}, w = (o2, n, t2, i2 = false) => {
  const r = n.parentNode, a = n.cloneNode(false);
  a.classList.add("cloned-input"), a.tabIndex = -1, i2 && (a.disabled = true);
  const e2 = "rtl" === o2.ownerDocument.dir;
  a.style.insetInlineStart = e2 ? r.offsetWidth - n.offsetLeft - n.offsetWidth + "px" : `${n.offsetLeft}px`, r.appendChild(a), u.set(o2, a);
  const s = e2 ? 9999 : -9999;
  o2.style.pointerEvents = "none", n.style.transform = `translate3d(${s}px,${t2}px,0) scale(0)`;
}, p = (o2, n) => {
  const t2 = u.get(o2);
  t2 && (u.delete(o2), t2.remove()), o2.style.pointerEvents = "", n.style.transform = "";
}, m = "input, textarea, [no-blur], [contenteditable]", b = "$ionPaddingTimer", y = (o2, n, t2) => {
  const i2 = o2[b];
  i2 && clearTimeout(i2), n > 0 ? o2.style.setProperty("--keyboard-offset", `${n}px`) : o2[b] = setTimeout((() => {
    o2.style.setProperty("--keyboard-offset", "0px"), t2 && t2();
  }), 120);
}, S = (o2, n, t2) => {
  o2.addEventListener("focusout", (() => {
    n && y(n, 0, t2);
  }), { once: true });
};
let h = 0;
const D = "data-ionic-skip-scroll-assist", v = (o2) => {
  var n;
  if (document.activeElement === o2) return;
  const t2 = o2.getAttribute("id"), i2 = o2.closest(`label[for="${t2}"]`), r = null === (n = document.activeElement) || void 0 === n ? void 0 : n.closest(`label[for="${t2}"]`);
  null !== i2 && i2 === r || (o2.setAttribute(D, "true"), o2.focus());
}, x = async (o2, n, r, a, e2, d2, c$1 = false, l2 = 0, u2 = true) => {
  if (!r && !a) return;
  const w2 = ((o3, n2, t2, i2) => {
    var r2;
    return ((o4, n3, t3, i3) => {
      const r3 = o4.top, a2 = o4.bottom, e3 = n3.top, s = e3 + 15, d3 = Math.min(n3.bottom, i3 - t3) - 50 - a2, c2 = s - r3, l3 = Math.round(d3 < 0 ? -d3 : c2 > 0 ? -c2 : 0), u3 = Math.min(l3, r3 - e3), f2 = Math.abs(u3);
      return { scrollAmount: u3, scrollDuration: Math.min(400, Math.max(150, f2 / 0.3)), scrollPadding: t3, inputSafeY: 4 - (r3 - s) };
    })((null !== (r2 = o3.closest("ion-item,[ion-item]")) && void 0 !== r2 ? r2 : o3).getBoundingClientRect(), n2.getBoundingClientRect(), t2, i2);
  })(o2, r || a, e2, l2);
  if (r && Math.abs(w2.scrollAmount) < 4) return v(n), void (d2 && null !== r && (y(r, h), S(n, r, (() => h = 0))));
  if (f(o2, n, true, w2.inputSafeY, c$1), v(n), d$1((() => o2.click())), d2 && r && (h = w2.scrollPadding, y(r, h)), "undefined" != typeof window) {
    let a2;
    const e3 = async () => {
      void 0 !== a2 && clearTimeout(a2), window.removeEventListener("ionKeyboardDidShow", s), window.removeEventListener("ionKeyboardDidShow", e3), r && await c(r, 0, w2.scrollAmount, w2.scrollDuration), f(o2, n, false, w2.inputSafeY), document.activeElement === n && v(n), d2 && S(n, r, (() => h = 0));
    }, s = () => {
      window.removeEventListener("ionKeyboardDidShow", s), window.addEventListener("ionKeyboardDidShow", e3);
    };
    if (r) {
      const o3 = await i$1(r);
      if (u2 && w2.scrollAmount > o3.scrollHeight - o3.clientHeight - o3.scrollTop) return "password" === n.type ? (w2.scrollAmount += 50, window.addEventListener("ionKeyboardDidShow", s)) : window.addEventListener("ionKeyboardDidShow", e3), void (a2 = setTimeout(e3, 1e3));
    }
    e3();
  }
}, M = async (t$1, i$12) => {
  if (void 0 === o) return;
  const s = "ios" === i$12, u2 = "android" === i$12, w2 = t$1.getNumber("keyboardHeight", 290), p2 = t$1.getBoolean("scrollAssist", true), b2 = t$1.getBoolean("hideCaretOnScroll", s), y2 = t$1.getBoolean("inputBlurring", false), S2 = t$1.getBoolean("scrollPadding", true), h2 = Array.from(o.querySelectorAll("ion-input, ion-textarea")), v2 = /* @__PURE__ */ new WeakMap(), M2 = /* @__PURE__ */ new WeakMap(), K = await t.getResizeMode(), g = async (n) => {
    await new Promise(((o2) => e(n, o2)));
    const t2 = n.shadowRoot || n, i$13 = t2.querySelector("input") || t2.querySelector("textarea"), s2 = f$1(n), l$1 = s2 ? null : n.closest("ion-footer");
    if (i$13) {
      if (s2 && b2 && !v2.has(n)) {
        const o2 = ((o3, n2, t3) => {
          if (!t3 || !n2) return () => {
          };
          const i2 = (t4) => {
            var i3;
            (i3 = n2) === i3.getRootNode().activeElement && f(o3, n2, t4);
          }, r = () => f(o3, n2, false), s3 = () => i2(true), d2 = () => i2(false);
          return l(t3, "ionScrollStart", s3), l(t3, "ionScrollEnd", d2), n2.addEventListener("blur", r), () => {
            u$1(t3, "ionScrollStart", s3), u$1(t3, "ionScrollEnd", d2), n2.removeEventListener("blur", r);
          };
        })(n, i$13, s2);
        v2.set(n, o2);
      }
      if ("date" !== i$13.type && "datetime-local" !== i$13.type && (s2 || l$1) && p2 && !M2.has(n)) {
        const t3 = ((n2, t4, i$14, r, a, e2, s3, d$12 = false) => {
          const l2 = e2 && (void 0 === s3 || s3.mode === i.None);
          let u3 = false;
          const f2 = void 0 !== d ? d.innerHeight : 0, w3 = (o2) => {
            false !== u3 ? x(n2, t4, i$14, r, o2.detail.keyboardHeight, l2, d$12, f2, false) : u3 = true;
          }, p3 = () => {
            u3 = false, null == d || d.removeEventListener("ionKeyboardDidShow", w3), n2.removeEventListener("focusout", p3);
          }, m2 = async () => {
            t4.hasAttribute(D) ? t4.removeAttribute(D) : (x(n2, t4, i$14, r, a, l2, d$12, f2), null == d || d.addEventListener("ionKeyboardDidShow", w3), n2.addEventListener("focusout", p3));
          };
          return n2.addEventListener("focusin", m2), () => {
            n2.removeEventListener("focusin", m2), null == d || d.removeEventListener("ionKeyboardDidShow", w3), n2.removeEventListener("focusout", p3);
          };
        })(n, i$13, s2, l$1, w2, S2, K, u2);
        M2.set(n, t3);
      }
    }
  };
  y2 && (() => {
    let o2 = true, n = false;
    const t2 = document;
    l(t2, "ionScrollStart", (() => {
      n = true;
    })), t2.addEventListener("focusin", (() => {
      o2 = true;
    }), true), t2.addEventListener("touchend", ((i2) => {
      if (n) return void (n = false);
      const r = t2.activeElement;
      if (!r) return;
      if (r.matches(m)) return;
      const a = i2.target;
      a !== r && (a.matches(m) || a.closest(m) || (o2 = false, setTimeout((() => {
        o2 || r.blur();
      }), 50)));
    }), false);
  })();
  for (const o2 of h2) g(o2);
  o.addEventListener("ionInputDidLoad", ((o2) => {
    g(o2.detail);
  })), o.addEventListener("ionInputDidUnload", ((o2) => {
    ((o3) => {
      if (b2) {
        const n = v2.get(o3);
        n && n(), v2.delete(o3);
      }
      if (p2) {
        const n = M2.get(o3);
        n && n(), M2.delete(o3);
      }
    })(o2.detail);
  }));
};
export {
  M as startInputShims
};
