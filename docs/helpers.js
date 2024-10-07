const o = (n) => {
  n = parseInt(n, 10);
  let t = parseInt(`${n / (3600 * 24)}`, 10), e = a(parseInt(`${n % 86400 / 3600}`, 10), 2), r = a(parseInt(`${n % 3600 / 60}`, 10), 2), s = a(parseInt(`${n % 60}`, 10), 2);
  return `${r}`.length === 1 && (r = `0${r}`), `${s}`.length === 1 && (s = `0${s}`), t === 0 ? t = "" : t = `${t}:`, e === 0 ? e = "00:" : e = `${e}:`, r === 0 ? r = "00:" : r = `${r}:`, e == "00:" && t == "" && (e = ""), (t + e + r + s).replace("NaN:NaN:NaN:NaN", "00:00");
}, u = (n) => {
  if (!n)
    return 0;
  const t = n.split(":").map((e) => parseInt(e, 10));
  return t.length < 3 && t.unshift(0), +t[0] * 60 * 60 + +t[1] * 60 + +t[2];
}, a = (n, t = 2) => {
  if (typeof n < "u") {
    const e = t - n.toString().length + 1;
    return Array(+(e > 0 && e)).join("0") + n;
  }
  return "";
}, c = (n, t) => !n || !Array.isArray(n) ? [] : n.filter((e, r, s) => s.map((i) => i[t]).indexOf(e[t]) === r), l = (n, t = 360) => {
  if (!n)
    return "";
  const e = n.substring(0, t).split(".");
  return e.pop(e.length), `${e.join(".")}.`;
}, f = (n, t = !1) => {
  if (!n)
    return "";
  const e = n.match(/S\d{2}E\d{2}/u);
  if (e) {
    const r = n.split(/\sS\d{2}E\d{2}\s/u);
    return t ? `${e[0]} ${r[1]}` : `${r[0]} 
${e[0]} ${r[1]}`;
  }
  return n;
};
export {
  l as a,
  u as c,
  o as h,
  f as l,
  a as p,
  c as u
};
