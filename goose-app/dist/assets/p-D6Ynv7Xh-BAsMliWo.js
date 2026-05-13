import { t as t$1 } from "./index-jIKUKRM8.js";
const t = "ionKeyboardDidShow", o = "ionKeyboardDidHide";
let i = {}, a = {}, d = false;
const s = () => {
  i = {}, a = {}, d = false;
}, n = (t2) => {
  if (t$1.getEngine()) r(t2);
  else {
    if (!t2.visualViewport) return;
    a = g(t2.visualViewport), t2.visualViewport.onresize = () => {
      D(t2), p() || b(t2) ? f(t2) : c(t2) && h(t2);
    };
  }
}, r = (e) => {
  e.addEventListener("keyboardDidShow", ((t2) => f(e, t2))), e.addEventListener("keyboardDidHide", (() => h(e)));
}, f = (e, t2) => {
  w(e, t2), d = true;
}, h = (e) => {
  y(e), d = false;
}, p = () => !d && i.width === a.width && (i.height - a.height) * a.scale > 150, b = (e) => d && !c(e), c = (e) => d && a.height === e.innerHeight, w = (e, o2) => {
  const i2 = new CustomEvent(t, { detail: { keyboardHeight: o2 ? o2.keyboardHeight : e.innerHeight - a.height } });
  e.dispatchEvent(i2);
}, y = (e) => {
  const t2 = new CustomEvent(o);
  e.dispatchEvent(t2);
}, D = (e) => {
  i = Object.assign({}, a), a = g(e.visualViewport);
}, g = (e) => ({ width: Math.round(e.width), height: Math.round(e.height), offsetTop: e.offsetTop, offsetLeft: e.offsetLeft, pageTop: e.pageTop, pageLeft: e.pageLeft, scale: e.scale });
export {
  o as KEYBOARD_DID_CLOSE,
  t as KEYBOARD_DID_OPEN,
  g as copyVisualViewport,
  c as keyboardDidClose,
  p as keyboardDidOpen,
  b as keyboardDidResize,
  s as resetKeyboardAssist,
  h as setKeyboardClose,
  f as setKeyboardOpen,
  n as startKeyboardAssist,
  D as trackViewportChanges
};
