const i = (e) => {
  e = parseInt(e, 10);
  let r = parseInt(`${e / (3600 * 24)}`, 10), n = a(parseInt(`${e % 86400 / 3600}`, 10), 2), t = a(parseInt(`${e % 3600 / 60}`, 10), 2), s = a(parseInt(`${e % 60}`, 10), 2);
  return `${t}`.length === 1 && (t = `0${t}`), `${s}`.length === 1 && (s = `0${s}`), r === 0 ? r = "" : r = `${r}:`, n === 0 ? n = "00:" : n = `${n}:`, t === 0 ? t = "00:" : t = `${t}:`, n == "00:" && r == "" && (n = ""), (r + n + t + s).replace("NaN:NaN:NaN:NaN", "00:00");
}, a = (e, r = 2) => {
  if (typeof e < "u") {
    const n = r - e.toString().length + 1;
    return Array(+(n > 0 && n)).join("0") + e;
  }
  return "";
}, l = (e, r) => !e || !Array.isArray(e) ? [] : e.filter((n, t, s) => s.map((f) => f[r]).indexOf(n[r]) === t);
export {
  i as h,
  a as p,
  l as u
};
