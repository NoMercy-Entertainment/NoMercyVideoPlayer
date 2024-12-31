const o = (e) => {
  e = parseInt(e, 10);
  let t = parseInt(`${e / (3600 * 24)}`, 10), n = i(parseInt(`${e % 86400 / 3600}`, 10), 2), r = i(parseInt(`${e % 3600 / 60}`, 10), 2), s = i(parseInt(`${e % 60}`, 10), 2);
  return `${r}`.length === 1 && (r = `0${r}`), `${s}`.length === 1 && (s = `0${s}`), t === 0 ? t = "" : t = `${t}:`, n === 0 ? n = "00:" : n = `${n}:`, r === 0 ? r = "00:" : r = `${r}:`, n == "00:" && t == "" && (n = ""), (t + n + r + s).replace("NaN:NaN:NaN:NaN", "00:00");
}, i = (e, t = 2) => {
  if (typeof e < "u") {
    const n = t - e.toString().length + 1;
    return Array(+(n > 0 && n)).join("0") + e;
  }
  return "";
}, u = (e, t) => !e || !Array.isArray(e) ? [] : e.filter((n, r, s) => s.map((a) => a[t]).indexOf(n[t]) === r), c = (e, t = [":", "!", "?"]) => {
  if (!e)
    return "";
  if (e.split("").some((n) => t.includes(n))) {
    const n = new RegExp(t.map((s) => s == "?" ? `\\${s}` : s).join("|"), "u"), r = new RegExp(t.map((s) => s == "?" ? `\\${s}\\s` : `${s}\\s`).join("|"), "u");
    if (n && r && e.match(r))
      return e.replace(e.match(r)[0], `${e.match(n)[0]}
`);
  }
  return e;
}, p = (e) => e ? e.split("/").join(`\\
`) : "", f = (e, t) => e.reduce((n, r) => Math.abs(n) > Math.abs(r - t) ? r - t : n, 1 / 0) + t, l = (e, t = 360) => {
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
  p as a,
  c as b,
  l as c,
  o as h,
  $ as l,
  f as n,
  i as p,
  u
};
