const o = (e) => {
  e = parseInt(e, 10);
  let t = parseInt(`${e / (3600 * 24)}`, 10), n = s(parseInt(`${e % 86400 / 3600}`, 10), 2), r = s(parseInt(`${e % 3600 / 60}`, 10), 2), i = s(parseInt(`${e % 60}`, 10), 2);
  return `${r}`.length === 1 && (r = `0${r}`), `${i}`.length === 1 && (i = `0${i}`), t === 0 ? t = "" : t = `${t}:`, n === 0 ? n = "00:" : n = `${n}:`, r === 0 ? r = "00:" : r = `${r}:`, n == "00:" && t == "" && (n = ""), (t + n + r + i).replace("NaN:NaN:NaN:NaN", "00:00");
}, s = (e, t = 2) => {
  if (typeof e < "u") {
    const n = t - e.toString().length + 1;
    return Array(+(n > 0 && n)).join("0") + e;
  }
  return "";
}, u = (e, t) => !e || !Array.isArray(e) ? [] : e.filter((n, r, i) => i.map((a) => a[t]).indexOf(n[t]) === r), p = (e, t = [":", "!", "?"]) => {
  if (!e)
    return "";
  if (e.split("").some((n) => t.includes(n))) {
    const n = new RegExp(t.map((i) => i == "?" ? `\\${i}` : i).join("|"), "u"), r = new RegExp(t.map((i) => i == "?" ? `\\${i}\\s` : `${i}\\s`).join("|"), "u");
    if (n && r && e.match(r))
      return e.replace(e.match(r)[0], `${e.match(n)[0]}
`);
  }
  return e;
}, c = (e) => e ? e.split("/").join(`\\
`) : "", l = (e, t = 360) => {
  if (!e)
    return "";
  const n = e.substring(0, t).split(".");
  return n.pop(n.length), `${n.join(".")}.`;
}, f = (e, t = !1) => {
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
  c as a,
  p as b,
  l as c,
  o as h,
  f as l,
  s as p,
  u
};
