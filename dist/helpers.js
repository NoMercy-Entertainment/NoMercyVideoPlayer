const c = (n) => {
  n = parseInt(n, 10);
  let e = parseInt(`${n / (3600 * 24)}`, 10), t = a(parseInt(`${n % 86400 / 3600}`, 10), 2), r = a(parseInt(`${n % 3600 / 60}`, 10), 2), s = a(parseInt(`${n % 60}`, 10), 2);
  return `${r}`.length === 1 && (r = `0${r}`), `${s}`.length === 1 && (s = `0${s}`), e === 0 ? e = "" : e = `${e}:`, t === 0 ? t = "00:" : t = `${t}:`, r === 0 ? r = "00:" : r = `${r}:`, t == "00:" && e == "" && (t = ""), (e + t + r + s).replace("NaN:NaN:NaN:NaN", "00:00");
}, l = (n) => {
  if (!n)
    return 0;
  const e = n.split(":").map((t) => parseInt(t, 10));
  return e.length < 3 && e.unshift(0), +e[0] * 60 * 60 + +e[1] * 60 + +e[2];
}, a = (n, e = 2) => {
  if (typeof n < "u") {
    const t = e - n.toString().length + 1;
    return Array(+(t > 0 && t)).join("0") + n;
  }
  return "";
};
export {
  l as c,
  c as h,
  a as p
};
