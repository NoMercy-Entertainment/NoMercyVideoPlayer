const o = (e) => {
  e = parseInt(e, 10);
  let t = parseInt(`${e / (3600 * 24)}`, 10), n = a(parseInt(`${e % 86400 / 3600}`, 10), 2), r = a(parseInt(`${e % 3600 / 60}`, 10), 2), s = a(parseInt(`${e % 60}`, 10), 2);
  return `${r}`.length === 1 && (r = `0${r}`), `${s}`.length === 1 && (s = `0${s}`), t === 0 ? t = "" : t = `${t}:`, n === 0 ? n = "00:" : n = `${n}:`, r === 0 ? r = "00:" : r = `${r}:`, n == "00:" && t == "" && (n = ""), (t + n + r + s).replace("NaN:NaN:NaN:NaN", "00:00");
}, u = (e) => {
  if (!e)
    return 0;
  const t = e.split(":").map((n) => parseInt(n, 10));
  return t.length < 3 && t.unshift(0), +t[0] * 60 * 60 + +t[1] * 60 + +t[2];
}, a = (e, t = 2) => {
  if (typeof e < "u") {
    const n = t - e.toString().length + 1;
    return Array(+(n > 0 && n)).join("0") + e;
  }
  return "";
}, c = (e, t) => !e || !Array.isArray(e) ? [] : e.filter((n, r, s) => s.map((i) => i[t]).indexOf(n[t]) === r), f = (e, t = [":", "!", "?"]) => {
  if (!e)
    return "";
  if (e.split("").some((n) => t.includes(n))) {
    const n = new RegExp(t.map((s) => s == "?" ? `\\${s}` : s).join("|"), "u"), r = new RegExp(t.map((s) => s == "?" ? `\\${s}\\s` : `${s}\\s`).join("|"), "u");
    if (n && r && e.match(r))
      return e.replace(e.match(r)[0], `${e.match(n)[0]}
`);
  }
  return e;
}, p = (e, t) => e.reduce((n, r) => Math.abs(n) > Math.abs(r - t) ? r - t : n, 1 / 0) + t, l = (e, t = 360) => {
  if (!e)
    return "";
  const n = e.substring(0, t).split(".");
  return n.pop(n.length), `${n.join(".")}.`;
}, $ = (e, t = !1) => {
  if (!e)
    return "";
  const n = e.match(/S\d{2}E\d{2}/u);
  if (n) {
    const r = e.split(/\sS\d{2}E\d{2}\s/u);
    return t ? `${n[0]} ${r[1]}` : `${r[0]} 
${n[0]} ${r[1]}`;
  }
  return e;
};
export {
  l as a,
  f as b,
  u as c,
  o as h,
  $ as l,
  p as n,
  a as p,
  c as u
};
