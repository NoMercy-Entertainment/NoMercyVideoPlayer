var hr = (a, e, t) => {
  if (!e.has(a))
    throw TypeError("Cannot " + t);
};
var Ks = (a, e, t) => {
  if (e.has(a))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(a) : e.set(a, t);
};
var Ws = (a, e, t) => (hr(a, e, "access private method"), t);
(function() {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload"))
    return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]'))
    s(i);
  new MutationObserver((i) => {
    for (const n of i)
      if (n.type === "childList")
        for (const r of n.addedNodes)
          r.tagName === "LINK" && r.rel === "modulepreload" && s(r);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(i) {
    const n = {};
    return i.integrity && (n.integrity = i.integrity), i.referrerPolicy && (n.referrerPolicy = i.referrerPolicy), i.crossOrigin === "use-credentials" ? n.credentials = "include" : i.crossOrigin === "anonymous" ? n.credentials = "omit" : n.credentials = "same-origin", n;
  }
  function s(i) {
    if (i.ep)
      return;
    i.ep = !0;
    const n = t(i);
    fetch(i.href, n);
  }
})();
class ur {
  constructor() {
    this.eventElement = {}, this.container = {}, this.videoElement = {}, this.overlay = {}, this.subtitleOverlay = {}, this.subtitleText = {}, this.translations = {}, this.playerId = "", this.setupTime = 0, this.message = {}, this.options = {
      muted: !1,
      autoPlay: !1,
      controls: !1,
      debug: !1,
      accessToken: "",
      basePath: "",
      playbackRates: [0.5, 1, 1.5, 2],
      stretching: "uniform",
      controlsTimeout: 3e3,
      displayLanguage: "en",
      preload: "auto",
      playlist: [],
      disableMediaControls: !1,
      disableControls: !1,
      disableTouchControls: !1,
      doubleClickDelay: 300
    }, this.hasPipEventHandler = !1, this.hasTheaterEventHandler = !1, this.hasBackEventHandler = !1, this.hasCloseEventHandler = !1, this.eventElement = document.createElement("div");
  }
  emit(e, t) {
    var s, i;
    !t || typeof t == "string" ? t = t ?? "" : typeof t == "object" && (t = { ...t ?? {} }), (i = (s = this.eventElement) == null ? void 0 : s.dispatchEvent) == null || i.call(s, new CustomEvent(e, {
      detail: t
    }));
  }
  on(e, t) {
    var s;
    this.eventHooks(e, !0), (s = this.eventElement) == null || s.addEventListener(e, (i) => t(i.detail));
  }
  off(e, t) {
    var s;
    this.eventHooks(e, !1), (s = this.eventElement) == null || s.removeEventListener(e, () => t());
  }
  once(e, t) {
    var s;
    this.eventHooks(e, !0), (s = this.eventElement) == null || s.addEventListener(e, (i) => t(i.detail), { once: !0 });
  }
  /**
      * Sets the enabled state of various event hooks.
      * @param event - The event to enable/disable.
      * @param enabled - Whether the event should be enabled or disabled.
      */
  eventHooks(e, t) {
    e == "pip" ? this.hasPipEventHandler = t : e == "theaterMode" ? this.hasTheaterEventHandler = t : e == "back" ? this.hasBackEventHandler = t : e == "close" && (this.hasCloseEventHandler = t);
  }
}
function dr(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var Qi = { exports: {} };
(function(a, e) {
  (function(t) {
    var s = /^(?=((?:[a-zA-Z0-9+\-.]+:)?))\1(?=((?:\/\/[^\/?#]*)?))\2(?=((?:(?:[^?#\/]*\/)*[^;?#\/]*)?))\3((?:;[^?#]*)?)(\?[^#]*)?(#[^]*)?$/, i = /^(?=([^\/?#]*))\1([^]*)$/, n = /(?:\/|^)\.(?=\/)/g, r = /(?:\/|^)\.\.\/(?!\.\.\/)[^\/]*(?=\/)/g, o = {
      // If opts.alwaysNormalize is true then the path will always be normalized even when it starts with / or //
      // E.g
      // With opts.alwaysNormalize = false (default, spec compliant)
      // http://a.com/b/cd + /e/f/../g => http://a.com/e/f/../g
      // With opts.alwaysNormalize = true (not spec compliant)
      // http://a.com/b/cd + /e/f/../g => http://a.com/e/g
      buildAbsoluteURL: function(l, c, h) {
        if (h = h || {}, l = l.trim(), c = c.trim(), !c) {
          if (!h.alwaysNormalize)
            return l;
          var u = o.parseURL(l);
          if (!u)
            throw new Error("Error trying to parse base URL.");
          return u.path = o.normalizePath(
            u.path
          ), o.buildURLFromParts(u);
        }
        var d = o.parseURL(c);
        if (!d)
          throw new Error("Error trying to parse relative URL.");
        if (d.scheme)
          return h.alwaysNormalize ? (d.path = o.normalizePath(d.path), o.buildURLFromParts(d)) : c;
        var f = o.parseURL(l);
        if (!f)
          throw new Error("Error trying to parse base URL.");
        if (!f.netLoc && f.path && f.path[0] !== "/") {
          var m = i.exec(f.path);
          f.netLoc = m[1], f.path = m[2];
        }
        f.netLoc && !f.path && (f.path = "/");
        var p = {
          // 2c) Otherwise, the embedded URL inherits the scheme of
          // the base URL.
          scheme: f.scheme,
          netLoc: d.netLoc,
          path: null,
          params: d.params,
          query: d.query,
          fragment: d.fragment
        };
        if (!d.netLoc && (p.netLoc = f.netLoc, d.path[0] !== "/"))
          if (!d.path)
            p.path = f.path, d.params || (p.params = f.params, d.query || (p.query = f.query));
          else {
            var g = f.path, v = g.substring(0, g.lastIndexOf("/") + 1) + d.path;
            p.path = o.normalizePath(v);
          }
        return p.path === null && (p.path = h.alwaysNormalize ? o.normalizePath(d.path) : d.path), o.buildURLFromParts(p);
      },
      parseURL: function(l) {
        var c = s.exec(l);
        return c ? {
          scheme: c[1] || "",
          netLoc: c[2] || "",
          path: c[3] || "",
          params: c[4] || "",
          query: c[5] || "",
          fragment: c[6] || ""
        } : null;
      },
      normalizePath: function(l) {
        for (l = l.split("").reverse().join("").replace(n, ""); l.length !== (l = l.replace(r, "")).length; )
          ;
        return l.split("").reverse().join("");
      },
      buildURLFromParts: function(l) {
        return l.scheme + l.netLoc + l.path + l.params + l.query + l.fragment;
      }
    };
    a.exports = o;
  })();
})(Qi);
var Ls = Qi.exports;
function zs(a, e) {
  var t = Object.keys(a);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(a);
    e && (s = s.filter(function(i) {
      return Object.getOwnPropertyDescriptor(a, i).enumerable;
    })), t.push.apply(t, s);
  }
  return t;
}
function ce(a) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? zs(Object(t), !0).forEach(function(s) {
      pr(a, s, t[s]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(a, Object.getOwnPropertyDescriptors(t)) : zs(Object(t)).forEach(function(s) {
      Object.defineProperty(a, s, Object.getOwnPropertyDescriptor(t, s));
    });
  }
  return a;
}
function fr(a, e) {
  if (typeof a != "object" || !a)
    return a;
  var t = a[Symbol.toPrimitive];
  if (t !== void 0) {
    var s = t.call(a, e || "default");
    if (typeof s != "object")
      return s;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(a);
}
function mr(a) {
  var e = fr(a, "string");
  return typeof e == "symbol" ? e : String(e);
}
function pr(a, e, t) {
  return e = mr(e), e in a ? Object.defineProperty(a, e, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : a[e] = t, a;
}
function ne() {
  return ne = Object.assign ? Object.assign.bind() : function(a) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var s in t)
        Object.prototype.hasOwnProperty.call(t, s) && (a[s] = t[s]);
    }
    return a;
  }, ne.apply(this, arguments);
}
const O = Number.isFinite || function(a) {
  return typeof a == "number" && isFinite(a);
}, gr = Number.isSafeInteger || function(a) {
  return typeof a == "number" && Math.abs(a) <= yr;
}, yr = Number.MAX_SAFE_INTEGER || 9007199254740991;
let y = /* @__PURE__ */ function(a) {
  return a.MEDIA_ATTACHING = "hlsMediaAttaching", a.MEDIA_ATTACHED = "hlsMediaAttached", a.MEDIA_DETACHING = "hlsMediaDetaching", a.MEDIA_DETACHED = "hlsMediaDetached", a.BUFFER_RESET = "hlsBufferReset", a.BUFFER_CODECS = "hlsBufferCodecs", a.BUFFER_CREATED = "hlsBufferCreated", a.BUFFER_APPENDING = "hlsBufferAppending", a.BUFFER_APPENDED = "hlsBufferAppended", a.BUFFER_EOS = "hlsBufferEos", a.BUFFER_FLUSHING = "hlsBufferFlushing", a.BUFFER_FLUSHED = "hlsBufferFlushed", a.MANIFEST_LOADING = "hlsManifestLoading", a.MANIFEST_LOADED = "hlsManifestLoaded", a.MANIFEST_PARSED = "hlsManifestParsed", a.LEVEL_SWITCHING = "hlsLevelSwitching", a.LEVEL_SWITCHED = "hlsLevelSwitched", a.LEVEL_LOADING = "hlsLevelLoading", a.LEVEL_LOADED = "hlsLevelLoaded", a.LEVEL_UPDATED = "hlsLevelUpdated", a.LEVEL_PTS_UPDATED = "hlsLevelPtsUpdated", a.LEVELS_UPDATED = "hlsLevelsUpdated", a.AUDIO_TRACKS_UPDATED = "hlsAudioTracksUpdated", a.AUDIO_TRACK_SWITCHING = "hlsAudioTrackSwitching", a.AUDIO_TRACK_SWITCHED = "hlsAudioTrackSwitched", a.AUDIO_TRACK_LOADING = "hlsAudioTrackLoading", a.AUDIO_TRACK_LOADED = "hlsAudioTrackLoaded", a.SUBTITLE_TRACKS_UPDATED = "hlsSubtitleTracksUpdated", a.SUBTITLE_TRACKS_CLEARED = "hlsSubtitleTracksCleared", a.SUBTITLE_TRACK_SWITCH = "hlsSubtitleTrackSwitch", a.SUBTITLE_TRACK_LOADING = "hlsSubtitleTrackLoading", a.SUBTITLE_TRACK_LOADED = "hlsSubtitleTrackLoaded", a.SUBTITLE_FRAG_PROCESSED = "hlsSubtitleFragProcessed", a.CUES_PARSED = "hlsCuesParsed", a.NON_NATIVE_TEXT_TRACKS_FOUND = "hlsNonNativeTextTracksFound", a.INIT_PTS_FOUND = "hlsInitPtsFound", a.FRAG_LOADING = "hlsFragLoading", a.FRAG_LOAD_EMERGENCY_ABORTED = "hlsFragLoadEmergencyAborted", a.FRAG_LOADED = "hlsFragLoaded", a.FRAG_DECRYPTED = "hlsFragDecrypted", a.FRAG_PARSING_INIT_SEGMENT = "hlsFragParsingInitSegment", a.FRAG_PARSING_USERDATA = "hlsFragParsingUserdata", a.FRAG_PARSING_METADATA = "hlsFragParsingMetadata", a.FRAG_PARSED = "hlsFragParsed", a.FRAG_BUFFERED = "hlsFragBuffered", a.FRAG_CHANGED = "hlsFragChanged", a.FPS_DROP = "hlsFpsDrop", a.FPS_DROP_LEVEL_CAPPING = "hlsFpsDropLevelCapping", a.MAX_AUTO_LEVEL_UPDATED = "hlsMaxAutoLevelUpdated", a.ERROR = "hlsError", a.DESTROYING = "hlsDestroying", a.KEY_LOADING = "hlsKeyLoading", a.KEY_LOADED = "hlsKeyLoaded", a.LIVE_BACK_BUFFER_REACHED = "hlsLiveBackBufferReached", a.BACK_BUFFER_REACHED = "hlsBackBufferReached", a.STEERING_MANIFEST_LOADED = "hlsSteeringManifestLoaded", a;
}({}), K = /* @__PURE__ */ function(a) {
  return a.NETWORK_ERROR = "networkError", a.MEDIA_ERROR = "mediaError", a.KEY_SYSTEM_ERROR = "keySystemError", a.MUX_ERROR = "muxError", a.OTHER_ERROR = "otherError", a;
}({}), A = /* @__PURE__ */ function(a) {
  return a.KEY_SYSTEM_NO_KEYS = "keySystemNoKeys", a.KEY_SYSTEM_NO_ACCESS = "keySystemNoAccess", a.KEY_SYSTEM_NO_SESSION = "keySystemNoSession", a.KEY_SYSTEM_NO_CONFIGURED_LICENSE = "keySystemNoConfiguredLicense", a.KEY_SYSTEM_LICENSE_REQUEST_FAILED = "keySystemLicenseRequestFailed", a.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED = "keySystemServerCertificateRequestFailed", a.KEY_SYSTEM_SERVER_CERTIFICATE_UPDATE_FAILED = "keySystemServerCertificateUpdateFailed", a.KEY_SYSTEM_SESSION_UPDATE_FAILED = "keySystemSessionUpdateFailed", a.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED = "keySystemStatusOutputRestricted", a.KEY_SYSTEM_STATUS_INTERNAL_ERROR = "keySystemStatusInternalError", a.MANIFEST_LOAD_ERROR = "manifestLoadError", a.MANIFEST_LOAD_TIMEOUT = "manifestLoadTimeOut", a.MANIFEST_PARSING_ERROR = "manifestParsingError", a.MANIFEST_INCOMPATIBLE_CODECS_ERROR = "manifestIncompatibleCodecsError", a.LEVEL_EMPTY_ERROR = "levelEmptyError", a.LEVEL_LOAD_ERROR = "levelLoadError", a.LEVEL_LOAD_TIMEOUT = "levelLoadTimeOut", a.LEVEL_PARSING_ERROR = "levelParsingError", a.LEVEL_SWITCH_ERROR = "levelSwitchError", a.AUDIO_TRACK_LOAD_ERROR = "audioTrackLoadError", a.AUDIO_TRACK_LOAD_TIMEOUT = "audioTrackLoadTimeOut", a.SUBTITLE_LOAD_ERROR = "subtitleTrackLoadError", a.SUBTITLE_TRACK_LOAD_TIMEOUT = "subtitleTrackLoadTimeOut", a.FRAG_LOAD_ERROR = "fragLoadError", a.FRAG_LOAD_TIMEOUT = "fragLoadTimeOut", a.FRAG_DECRYPT_ERROR = "fragDecryptError", a.FRAG_PARSING_ERROR = "fragParsingError", a.FRAG_GAP = "fragGap", a.REMUX_ALLOC_ERROR = "remuxAllocError", a.KEY_LOAD_ERROR = "keyLoadError", a.KEY_LOAD_TIMEOUT = "keyLoadTimeOut", a.BUFFER_ADD_CODEC_ERROR = "bufferAddCodecError", a.BUFFER_INCOMPATIBLE_CODECS_ERROR = "bufferIncompatibleCodecsError", a.BUFFER_APPEND_ERROR = "bufferAppendError", a.BUFFER_APPENDING_ERROR = "bufferAppendingError", a.BUFFER_STALLED_ERROR = "bufferStalledError", a.BUFFER_FULL_ERROR = "bufferFullError", a.BUFFER_SEEK_OVER_HOLE = "bufferSeekOverHole", a.BUFFER_NUDGE_ON_STALL = "bufferNudgeOnStall", a.INTERNAL_EXCEPTION = "internalException", a.INTERNAL_ABORTED = "aborted", a.UNKNOWN = "unknown", a;
}({});
const Be = function() {
}, hs = {
  trace: Be,
  debug: Be,
  log: Be,
  warn: Be,
  info: Be,
  error: Be
};
let st = hs;
function vr(a) {
  const e = self.console[a];
  return e ? e.bind(self.console, `[${a}] >`) : Be;
}
function Cr(a, ...e) {
  e.forEach(function(t) {
    st[t] = a[t] ? a[t].bind(a) : vr(t);
  });
}
function Tr(a, e) {
  if (typeof console == "object" && a === !0 || typeof a == "object") {
    Cr(
      a,
      // Remove out from list here to hard-disable a log-level
      // 'trace',
      "debug",
      "log",
      "info",
      "warn",
      "error"
    );
    try {
      st.log(`Debug logs enabled for "${e}" in hls.js version 1.5.13`);
    } catch {
      st = hs;
    }
  } else
    st = hs;
}
const S = st, Er = /^(\d+)x(\d+)$/, Ys = /(.+?)=(".*?"|.*?)(?:,|$)/g;
class se {
  constructor(e) {
    typeof e == "string" && (e = se.parseAttrList(e)), ne(this, e);
  }
  get clientAttrs() {
    return Object.keys(this).filter((e) => e.substring(0, 2) === "X-");
  }
  decimalInteger(e) {
    const t = parseInt(this[e], 10);
    return t > Number.MAX_SAFE_INTEGER ? 1 / 0 : t;
  }
  hexadecimalInteger(e) {
    if (this[e]) {
      let t = (this[e] || "0x").slice(2);
      t = (t.length & 1 ? "0" : "") + t;
      const s = new Uint8Array(t.length / 2);
      for (let i = 0; i < t.length / 2; i++)
        s[i] = parseInt(t.slice(i * 2, i * 2 + 2), 16);
      return s;
    } else
      return null;
  }
  hexadecimalIntegerAsNumber(e) {
    const t = parseInt(this[e], 16);
    return t > Number.MAX_SAFE_INTEGER ? 1 / 0 : t;
  }
  decimalFloatingPoint(e) {
    return parseFloat(this[e]);
  }
  optionalFloat(e, t) {
    const s = this[e];
    return s ? parseFloat(s) : t;
  }
  enumeratedString(e) {
    return this[e];
  }
  bool(e) {
    return this[e] === "YES";
  }
  decimalResolution(e) {
    const t = Er.exec(this[e]);
    if (t !== null)
      return {
        width: parseInt(t[1], 10),
        height: parseInt(t[2], 10)
      };
  }
  static parseAttrList(e) {
    let t;
    const s = {}, i = '"';
    for (Ys.lastIndex = 0; (t = Ys.exec(e)) !== null; ) {
      let n = t[2];
      n.indexOf(i) === 0 && n.lastIndexOf(i) === n.length - 1 && (n = n.slice(1, -1));
      const r = t[1].trim();
      s[r] = n;
    }
    return s;
  }
}
function xr(a) {
  return a !== "ID" && a !== "CLASS" && a !== "START-DATE" && a !== "DURATION" && a !== "END-DATE" && a !== "END-ON-NEXT";
}
function Sr(a) {
  return a === "SCTE35-OUT" || a === "SCTE35-IN";
}
class Ji {
  constructor(e, t) {
    if (this.attr = void 0, this._startDate = void 0, this._endDate = void 0, this._badValueForSameId = void 0, t) {
      const s = t.attr;
      for (const i in s)
        if (Object.prototype.hasOwnProperty.call(e, i) && e[i] !== s[i]) {
          S.warn(`DATERANGE tag attribute: "${i}" does not match for tags with ID: "${e.ID}"`), this._badValueForSameId = i;
          break;
        }
      e = ne(new se({}), s, e);
    }
    if (this.attr = e, this._startDate = new Date(e["START-DATE"]), "END-DATE" in this.attr) {
      const s = new Date(this.attr["END-DATE"]);
      O(s.getTime()) && (this._endDate = s);
    }
  }
  get id() {
    return this.attr.ID;
  }
  get class() {
    return this.attr.CLASS;
  }
  get startDate() {
    return this._startDate;
  }
  get endDate() {
    if (this._endDate)
      return this._endDate;
    const e = this.duration;
    return e !== null ? new Date(this._startDate.getTime() + e * 1e3) : null;
  }
  get duration() {
    if ("DURATION" in this.attr) {
      const e = this.attr.decimalFloatingPoint("DURATION");
      if (O(e))
        return e;
    } else if (this._endDate)
      return (this._endDate.getTime() - this._startDate.getTime()) / 1e3;
    return null;
  }
  get plannedDuration() {
    return "PLANNED-DURATION" in this.attr ? this.attr.decimalFloatingPoint("PLANNED-DURATION") : null;
  }
  get endOnNext() {
    return this.attr.bool("END-ON-NEXT");
  }
  get isValid() {
    return !!this.id && !this._badValueForSameId && O(this.startDate.getTime()) && (this.duration === null || this.duration >= 0) && (!this.endOnNext || !!this.class);
  }
}
class $t {
  constructor() {
    this.aborted = !1, this.loaded = 0, this.retry = 0, this.total = 0, this.chunkCount = 0, this.bwEstimate = 0, this.loading = {
      start: 0,
      first: 0,
      end: 0
    }, this.parsing = {
      start: 0,
      end: 0
    }, this.buffering = {
      start: 0,
      first: 0,
      end: 0
    };
  }
}
var X = {
  AUDIO: "audio",
  VIDEO: "video",
  AUDIOVIDEO: "audiovideo"
};
class en {
  constructor(e) {
    this._byteRange = null, this._url = null, this.baseurl = void 0, this.relurl = void 0, this.elementaryStreams = {
      [X.AUDIO]: null,
      [X.VIDEO]: null,
      [X.AUDIOVIDEO]: null
    }, this.baseurl = e;
  }
  // setByteRange converts a EXT-X-BYTERANGE attribute into a two element array
  setByteRange(e, t) {
    const s = e.split("@", 2);
    let i;
    s.length === 1 ? i = (t == null ? void 0 : t.byteRangeEndOffset) || 0 : i = parseInt(s[1]), this._byteRange = [i, parseInt(s[0]) + i];
  }
  get byteRange() {
    return this._byteRange ? this._byteRange : [];
  }
  get byteRangeStartOffset() {
    return this.byteRange[0];
  }
  get byteRangeEndOffset() {
    return this.byteRange[1];
  }
  get url() {
    return !this._url && this.baseurl && this.relurl && (this._url = Ls.buildAbsoluteURL(this.baseurl, this.relurl, {
      alwaysNormalize: !0
    })), this._url || "";
  }
  set url(e) {
    this._url = e;
  }
}
class Gt extends en {
  constructor(e, t) {
    super(t), this._decryptdata = null, this.rawProgramDateTime = null, this.programDateTime = null, this.tagList = [], this.duration = 0, this.sn = 0, this.levelkeys = void 0, this.type = void 0, this.loader = null, this.keyLoader = null, this.level = -1, this.cc = 0, this.startPTS = void 0, this.endPTS = void 0, this.startDTS = void 0, this.endDTS = void 0, this.start = 0, this.deltaPTS = void 0, this.maxStartPTS = void 0, this.minEndPTS = void 0, this.stats = new $t(), this.data = void 0, this.bitrateTest = !1, this.title = null, this.initSegment = null, this.endList = void 0, this.gap = void 0, this.urlId = 0, this.type = e;
  }
  get decryptdata() {
    const {
      levelkeys: e
    } = this;
    if (!e && !this._decryptdata)
      return null;
    if (!this._decryptdata && this.levelkeys && !this.levelkeys.NONE) {
      const t = this.levelkeys.identity;
      if (t)
        this._decryptdata = t.getDecryptData(this.sn);
      else {
        const s = Object.keys(this.levelkeys);
        if (s.length === 1)
          return this._decryptdata = this.levelkeys[s[0]].getDecryptData(this.sn);
      }
    }
    return this._decryptdata;
  }
  get end() {
    return this.start + this.duration;
  }
  get endProgramDateTime() {
    if (this.programDateTime === null || !O(this.programDateTime))
      return null;
    const e = O(this.duration) ? this.duration : 0;
    return this.programDateTime + e * 1e3;
  }
  get encrypted() {
    var e;
    if ((e = this._decryptdata) != null && e.encrypted)
      return !0;
    if (this.levelkeys) {
      const t = Object.keys(this.levelkeys), s = t.length;
      if (s > 1 || s === 1 && this.levelkeys[t[0]].encrypted)
        return !0;
    }
    return !1;
  }
  setKeyFormat(e) {
    if (this.levelkeys) {
      const t = this.levelkeys[e];
      t && !this._decryptdata && (this._decryptdata = t.getDecryptData(this.sn));
    }
  }
  abortRequests() {
    var e, t;
    (e = this.loader) == null || e.abort(), (t = this.keyLoader) == null || t.abort();
  }
  setElementaryStreamInfo(e, t, s, i, n, r = !1) {
    const {
      elementaryStreams: o
    } = this, l = o[e];
    if (!l) {
      o[e] = {
        startPTS: t,
        endPTS: s,
        startDTS: i,
        endDTS: n,
        partial: r
      };
      return;
    }
    l.startPTS = Math.min(l.startPTS, t), l.endPTS = Math.max(l.endPTS, s), l.startDTS = Math.min(l.startDTS, i), l.endDTS = Math.max(l.endDTS, n);
  }
  clearElementaryStreamInfo() {
    const {
      elementaryStreams: e
    } = this;
    e[X.AUDIO] = null, e[X.VIDEO] = null, e[X.AUDIOVIDEO] = null;
  }
}
class br extends en {
  constructor(e, t, s, i, n) {
    super(s), this.fragOffset = 0, this.duration = 0, this.gap = !1, this.independent = !1, this.relurl = void 0, this.fragment = void 0, this.index = void 0, this.stats = new $t(), this.duration = e.decimalFloatingPoint("DURATION"), this.gap = e.bool("GAP"), this.independent = e.bool("INDEPENDENT"), this.relurl = e.enumeratedString("URI"), this.fragment = t, this.index = i;
    const r = e.enumeratedString("BYTERANGE");
    r && this.setByteRange(r, n), n && (this.fragOffset = n.fragOffset + n.duration);
  }
  get start() {
    return this.fragment.start + this.fragOffset;
  }
  get end() {
    return this.start + this.duration;
  }
  get loaded() {
    const {
      elementaryStreams: e
    } = this;
    return !!(e.audio || e.video || e.audiovideo);
  }
}
const Lr = 10;
class Ar {
  constructor(e) {
    this.PTSKnown = !1, this.alignedSliding = !1, this.averagetargetduration = void 0, this.endCC = 0, this.endSN = 0, this.fragments = void 0, this.fragmentHint = void 0, this.partList = null, this.dateRanges = void 0, this.live = !0, this.ageHeader = 0, this.advancedDateTime = void 0, this.updated = !0, this.advanced = !0, this.availabilityDelay = void 0, this.misses = 0, this.startCC = 0, this.startSN = 0, this.startTimeOffset = null, this.targetduration = 0, this.totalduration = 0, this.type = null, this.url = void 0, this.m3u8 = "", this.version = null, this.canBlockReload = !1, this.canSkipUntil = 0, this.canSkipDateRanges = !1, this.skippedSegments = 0, this.recentlyRemovedDateranges = void 0, this.partHoldBack = 0, this.holdBack = 0, this.partTarget = 0, this.preloadHint = void 0, this.renditionReports = void 0, this.tuneInGoal = 0, this.deltaUpdateFailed = void 0, this.driftStartTime = 0, this.driftEndTime = 0, this.driftStart = 0, this.driftEnd = 0, this.encryptedFragments = void 0, this.playlistParsingError = null, this.variableList = null, this.hasVariableRefs = !1, this.fragments = [], this.encryptedFragments = [], this.dateRanges = {}, this.url = e;
  }
  reloaded(e) {
    if (!e) {
      this.advanced = !0, this.updated = !0;
      return;
    }
    const t = this.lastPartSn - e.lastPartSn, s = this.lastPartIndex - e.lastPartIndex;
    this.updated = this.endSN !== e.endSN || !!s || !!t || !this.live, this.advanced = this.endSN > e.endSN || t > 0 || t === 0 && s > 0, this.updated || this.advanced ? this.misses = Math.floor(e.misses * 0.6) : this.misses = e.misses + 1, this.availabilityDelay = e.availabilityDelay;
  }
  get hasProgramDateTime() {
    return this.fragments.length ? O(this.fragments[this.fragments.length - 1].programDateTime) : !1;
  }
  get levelTargetDuration() {
    return this.averagetargetduration || this.targetduration || Lr;
  }
  get drift() {
    const e = this.driftEndTime - this.driftStartTime;
    return e > 0 ? (this.driftEnd - this.driftStart) * 1e3 / e : 1;
  }
  get edge() {
    return this.partEnd || this.fragmentEnd;
  }
  get partEnd() {
    var e;
    return (e = this.partList) != null && e.length ? this.partList[this.partList.length - 1].end : this.fragmentEnd;
  }
  get fragmentEnd() {
    var e;
    return (e = this.fragments) != null && e.length ? this.fragments[this.fragments.length - 1].end : 0;
  }
  get age() {
    return this.advancedDateTime ? Math.max(Date.now() - this.advancedDateTime, 0) / 1e3 : 0;
  }
  get lastPartIndex() {
    var e;
    return (e = this.partList) != null && e.length ? this.partList[this.partList.length - 1].index : -1;
  }
  get lastPartSn() {
    var e;
    return (e = this.partList) != null && e.length ? this.partList[this.partList.length - 1].fragment.sn : this.endSN;
  }
}
function As(a) {
  return Uint8Array.from(atob(a), (e) => e.charCodeAt(0));
}
function wr(a) {
  const e = us(a).subarray(0, 16), t = new Uint8Array(16);
  return t.set(e, 16 - e.length), t;
}
function Ir(a) {
  const e = function(s, i, n) {
    const r = s[i];
    s[i] = s[n], s[n] = r;
  };
  e(a, 0, 3), e(a, 1, 2), e(a, 4, 5), e(a, 6, 7);
}
function Rr(a) {
  const e = a.split(":");
  let t = null;
  if (e[0] === "data" && e.length === 2) {
    const s = e[1].split(";"), i = s[s.length - 1].split(",");
    if (i.length === 2) {
      const n = i[0] === "base64", r = i[1];
      n ? (s.splice(-1, 1), t = As(r)) : t = wr(r);
    }
  }
  return t;
}
function us(a) {
  return Uint8Array.from(unescape(encodeURIComponent(a)), (e) => e.charCodeAt(0));
}
const je = typeof self < "u" ? self : void 0;
var te = {
  CLEARKEY: "org.w3.clearkey",
  FAIRPLAY: "com.apple.fps",
  PLAYREADY: "com.microsoft.playready",
  WIDEVINE: "com.widevine.alpha"
}, me = {
  CLEARKEY: "org.w3.clearkey",
  FAIRPLAY: "com.apple.streamingkeydelivery",
  PLAYREADY: "com.microsoft.playready",
  WIDEVINE: "urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed"
};
function Zs(a) {
  switch (a) {
    case me.FAIRPLAY:
      return te.FAIRPLAY;
    case me.PLAYREADY:
      return te.PLAYREADY;
    case me.WIDEVINE:
      return te.WIDEVINE;
    case me.CLEARKEY:
      return te.CLEARKEY;
  }
}
var tn = {
  WIDEVINE: "edef8ba979d64acea3c827dcd51d21ed"
};
function kr(a) {
  if (a === tn.WIDEVINE)
    return te.WIDEVINE;
}
function qs(a) {
  switch (a) {
    case te.FAIRPLAY:
      return me.FAIRPLAY;
    case te.PLAYREADY:
      return me.PLAYREADY;
    case te.WIDEVINE:
      return me.WIDEVINE;
    case te.CLEARKEY:
      return me.CLEARKEY;
  }
}
function Kt(a) {
  const {
    drmSystems: e,
    widevineLicenseUrl: t
  } = a, s = e ? [te.FAIRPLAY, te.WIDEVINE, te.PLAYREADY, te.CLEARKEY].filter((i) => !!e[i]) : [];
  return !s[te.WIDEVINE] && t && s.push(te.WIDEVINE), s;
}
const sn = function(a) {
  return je != null && (a = je.navigator) != null && a.requestMediaKeySystemAccess ? self.navigator.requestMediaKeySystemAccess.bind(self.navigator) : null;
}();
function Dr(a, e, t, s) {
  let i;
  switch (a) {
    case te.FAIRPLAY:
      i = ["cenc", "sinf"];
      break;
    case te.WIDEVINE:
    case te.PLAYREADY:
      i = ["cenc"];
      break;
    case te.CLEARKEY:
      i = ["cenc", "keyids"];
      break;
    default:
      throw new Error(`Unknown key-system: ${a}`);
  }
  return Mr(i, e, t, s);
}
function Mr(a, e, t, s) {
  return [{
    initDataTypes: a,
    persistentState: s.persistentState || "optional",
    distinctiveIdentifier: s.distinctiveIdentifier || "optional",
    sessionTypes: s.sessionTypes || [s.sessionType || "temporary"],
    audioCapabilities: e.map((n) => ({
      contentType: `audio/mp4; codecs="${n}"`,
      robustness: s.audioRobustness || "",
      encryptionScheme: s.audioEncryptionScheme || null
    })),
    videoCapabilities: t.map((n) => ({
      contentType: `video/mp4; codecs="${n}"`,
      robustness: s.videoRobustness || "",
      encryptionScheme: s.videoEncryptionScheme || null
    }))
  }];
}
function $e(a, e, t) {
  return Uint8Array.prototype.slice ? a.slice(e, t) : new Uint8Array(Array.prototype.slice.call(a, e, t));
}
const ws = (a, e) => e + 10 <= a.length && a[e] === 73 && a[e + 1] === 68 && a[e + 2] === 51 && a[e + 3] < 255 && a[e + 4] < 255 && a[e + 6] < 128 && a[e + 7] < 128 && a[e + 8] < 128 && a[e + 9] < 128, nn = (a, e) => e + 10 <= a.length && a[e] === 51 && a[e + 1] === 68 && a[e + 2] === 73 && a[e + 3] < 255 && a[e + 4] < 255 && a[e + 6] < 128 && a[e + 7] < 128 && a[e + 8] < 128 && a[e + 9] < 128, nt = (a, e) => {
  const t = e;
  let s = 0;
  for (; ws(a, e); ) {
    s += 10;
    const i = Vt(a, e + 6);
    s += i, nn(a, e + 10) && (s += 10), e += s;
  }
  if (s > 0)
    return a.subarray(t, t + s);
}, Vt = (a, e) => {
  let t = 0;
  return t = (a[e] & 127) << 21, t |= (a[e + 1] & 127) << 14, t |= (a[e + 2] & 127) << 7, t |= a[e + 3] & 127, t;
}, Pr = (a, e) => ws(a, e) && Vt(a, e + 6) + 10 <= a.length - e, Is = (a) => {
  const e = an(a);
  for (let t = 0; t < e.length; t++) {
    const s = e[t];
    if (rn(s))
      return Ur(s);
  }
}, rn = (a) => a && a.key === "PRIV" && a.info === "com.apple.streaming.transportStreamTimestamp", Fr = (a) => {
  const e = String.fromCharCode(a[0], a[1], a[2], a[3]), t = Vt(a, 4), s = 10;
  return {
    type: e,
    size: t,
    data: a.subarray(s, s + t)
  };
}, an = (a) => {
  let e = 0;
  const t = [];
  for (; ws(a, e); ) {
    const s = Vt(a, e + 6);
    e += 10;
    const i = e + s;
    for (; e + 8 < i; ) {
      const n = Fr(a.subarray(e)), r = _r(n);
      r && t.push(r), e += n.size + 10;
    }
    nn(a, e) && (e += 10);
  }
  return t;
}, _r = (a) => a.type === "PRIV" ? Or(a) : a.type[0] === "W" ? Br(a) : Nr(a), Or = (a) => {
  if (a.size < 2)
    return;
  const e = Ie(a.data, !0), t = new Uint8Array(a.data.subarray(e.length + 1));
  return {
    key: a.type,
    info: e,
    data: t.buffer
  };
}, Nr = (a) => {
  if (a.size < 2)
    return;
  if (a.type === "TXXX") {
    let t = 1;
    const s = Ie(a.data.subarray(t), !0);
    t += s.length + 1;
    const i = Ie(a.data.subarray(t));
    return {
      key: a.type,
      info: s,
      data: i
    };
  }
  const e = Ie(a.data.subarray(1));
  return {
    key: a.type,
    data: e
  };
}, Br = (a) => {
  if (a.type === "WXXX") {
    if (a.size < 2)
      return;
    let t = 1;
    const s = Ie(a.data.subarray(t), !0);
    t += s.length + 1;
    const i = Ie(a.data.subarray(t));
    return {
      key: a.type,
      info: s,
      data: i
    };
  }
  const e = Ie(a.data);
  return {
    key: a.type,
    data: e
  };
}, Ur = (a) => {
  if (a.data.byteLength === 8) {
    const e = new Uint8Array(a.data), t = e[3] & 1;
    let s = (e[4] << 23) + (e[5] << 15) + (e[6] << 7) + e[7];
    return s /= 45, t && (s += 4772185884e-2), Math.round(s);
  }
}, Ie = (a, e = !1) => {
  const t = $r();
  if (t) {
    const c = t.decode(a);
    if (e) {
      const h = c.indexOf("\0");
      return h !== -1 ? c.substring(0, h) : c;
    }
    return c.replace(/\0/g, "");
  }
  const s = a.length;
  let i, n, r, o = "", l = 0;
  for (; l < s; ) {
    if (i = a[l++], i === 0 && e)
      return o;
    if (i === 0 || i === 3)
      continue;
    switch (i >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        o += String.fromCharCode(i);
        break;
      case 12:
      case 13:
        n = a[l++], o += String.fromCharCode((i & 31) << 6 | n & 63);
        break;
      case 14:
        n = a[l++], r = a[l++], o += String.fromCharCode((i & 15) << 12 | (n & 63) << 6 | (r & 63) << 0);
        break;
    }
  }
  return o;
};
let Wt;
function $r() {
  if (!navigator.userAgent.includes("PlayStation 4"))
    return !Wt && typeof self.TextDecoder < "u" && (Wt = new self.TextDecoder("utf-8")), Wt;
}
const Se = {
  hexDump: function(a) {
    let e = "";
    for (let t = 0; t < a.length; t++) {
      let s = a[t].toString(16);
      s.length < 2 && (s = "0" + s), e += s;
    }
    return e;
  }
}, wt = Math.pow(2, 32) - 1, Vr = [].push, on = {
  video: 1,
  audio: 2,
  id3: 3,
  text: 4
};
function re(a) {
  return String.fromCharCode.apply(null, a);
}
function ln(a, e) {
  const t = a[e] << 8 | a[e + 1];
  return t < 0 ? 65536 + t : t;
}
function V(a, e) {
  const t = cn(a, e);
  return t < 0 ? 4294967296 + t : t;
}
function js(a, e) {
  let t = V(a, e);
  return t *= Math.pow(2, 32), t += V(a, e + 4), t;
}
function cn(a, e) {
  return a[e] << 24 | a[e + 1] << 16 | a[e + 2] << 8 | a[e + 3];
}
function zt(a, e, t) {
  a[e] = t >> 24, a[e + 1] = t >> 16 & 255, a[e + 2] = t >> 8 & 255, a[e + 3] = t & 255;
}
function Hr(a) {
  const e = a.byteLength;
  for (let t = 0; t < e; ) {
    const s = V(a, t);
    if (s > 8 && a[t + 4] === 109 && a[t + 5] === 111 && a[t + 6] === 111 && a[t + 7] === 102)
      return !0;
    t = s > 1 ? t + s : e;
  }
  return !1;
}
function W(a, e) {
  const t = [];
  if (!e.length)
    return t;
  const s = a.byteLength;
  for (let i = 0; i < s; ) {
    const n = V(a, i), r = re(a.subarray(i + 4, i + 8)), o = n > 1 ? i + n : s;
    if (r === e[0])
      if (e.length === 1)
        t.push(a.subarray(i + 8, o));
      else {
        const l = W(a.subarray(i + 8, o), e.slice(1));
        l.length && Vr.apply(t, l);
      }
    i = o;
  }
  return t;
}
function Gr(a) {
  const e = [], t = a[0];
  let s = 8;
  const i = V(a, s);
  s += 4;
  let n = 0, r = 0;
  t === 0 ? (n = V(a, s), r = V(a, s + 4), s += 8) : (n = js(a, s), r = js(a, s + 8), s += 16), s += 2;
  let o = a.length + r;
  const l = ln(a, s);
  s += 2;
  for (let c = 0; c < l; c++) {
    let h = s;
    const u = V(a, h);
    h += 4;
    const d = u & 2147483647;
    if ((u & 2147483648) >>> 31 === 1)
      return S.warn("SIDX has hierarchical references (not supported)"), null;
    const m = V(a, h);
    h += 4, e.push({
      referenceSize: d,
      subsegmentDuration: m,
      // unscaled
      info: {
        duration: m / i,
        start: o,
        end: o + d - 1
      }
    }), o += d, h += 4, s = h;
  }
  return {
    earliestPresentationTime: n,
    timescale: i,
    version: t,
    referencesCount: l,
    references: e
  };
}
function hn(a) {
  const e = [], t = W(a, ["moov", "trak"]);
  for (let i = 0; i < t.length; i++) {
    const n = t[i], r = W(n, ["tkhd"])[0];
    if (r) {
      let o = r[0];
      const l = V(r, o === 0 ? 12 : 20), c = W(n, ["mdia", "mdhd"])[0];
      if (c) {
        o = c[0];
        const h = V(c, o === 0 ? 12 : 20), u = W(n, ["mdia", "hdlr"])[0];
        if (u) {
          const d = re(u.subarray(8, 12)), f = {
            soun: X.AUDIO,
            vide: X.VIDEO
          }[d];
          if (f) {
            const m = W(n, ["mdia", "minf", "stbl", "stsd"])[0], p = Kr(m);
            e[l] = {
              timescale: h,
              type: f
            }, e[f] = ce({
              timescale: h,
              id: l
            }, p);
          }
        }
      }
    }
  }
  return W(a, ["moov", "mvex", "trex"]).forEach((i) => {
    const n = V(i, 4), r = e[n];
    r && (r.default = {
      duration: V(i, 12),
      flags: V(i, 20)
    });
  }), e;
}
function Kr(a) {
  const e = a.subarray(8), t = e.subarray(8 + 78), s = re(e.subarray(4, 8));
  let i = s;
  const n = s === "enca" || s === "encv";
  if (n) {
    const o = W(e, [s])[0].subarray(s === "enca" ? 28 : 78);
    W(o, ["sinf"]).forEach((c) => {
      const h = W(c, ["schm"])[0];
      if (h) {
        const u = re(h.subarray(4, 8));
        if (u === "cbcs" || u === "cenc") {
          const d = W(c, ["frma"])[0];
          d && (i = re(d));
        }
      }
    });
  }
  switch (i) {
    case "avc1":
    case "avc2":
    case "avc3":
    case "avc4": {
      const r = W(t, ["avcC"])[0];
      i += "." + lt(r[1]) + lt(r[2]) + lt(r[3]);
      break;
    }
    case "mp4a": {
      const r = W(e, [s])[0], o = W(r.subarray(28), ["esds"])[0];
      if (o && o.length > 12) {
        let l = 4;
        if (o[l++] !== 3)
          break;
        l = Yt(o, l), l += 2;
        const c = o[l++];
        if (c & 128 && (l += 2), c & 64 && (l += o[l++]), o[l++] !== 4)
          break;
        l = Yt(o, l);
        const h = o[l++];
        if (h === 64)
          i += "." + lt(h);
        else
          break;
        if (l += 12, o[l++] !== 5)
          break;
        l = Yt(o, l);
        const u = o[l++];
        let d = (u & 248) >> 3;
        d === 31 && (d += 1 + ((u & 7) << 3) + ((o[l] & 224) >> 5)), i += "." + d;
      }
      break;
    }
    case "hvc1":
    case "hev1": {
      const r = W(t, ["hvcC"])[0], o = r[1], l = ["", "A", "B", "C"][o >> 6], c = o & 31, h = V(r, 2), u = (o & 32) >> 5 ? "H" : "L", d = r[12], f = r.subarray(6, 12);
      i += "." + l + c, i += "." + h.toString(16).toUpperCase(), i += "." + u + d;
      let m = "";
      for (let p = f.length; p--; ) {
        const g = f[p];
        (g || m) && (m = "." + g.toString(16).toUpperCase() + m);
      }
      i += m;
      break;
    }
    case "dvh1":
    case "dvhe": {
      const r = W(t, ["dvcC"])[0], o = r[2] >> 1 & 127, l = r[2] << 5 & 32 | r[3] >> 3 & 31;
      i += "." + xe(o) + "." + xe(l);
      break;
    }
    case "vp09": {
      const r = W(t, ["vpcC"])[0], o = r[4], l = r[5], c = r[6] >> 4 & 15;
      i += "." + xe(o) + "." + xe(l) + "." + xe(c);
      break;
    }
    case "av01": {
      const r = W(t, ["av1C"])[0], o = r[1] >>> 5, l = r[1] & 31, c = r[2] >>> 7 ? "H" : "M", h = (r[2] & 64) >> 6, u = (r[2] & 32) >> 5, d = o === 2 && h ? u ? 12 : 10 : h ? 10 : 8, f = (r[2] & 16) >> 4, m = (r[2] & 8) >> 3, p = (r[2] & 4) >> 2, g = r[2] & 3, v = 1, C = 1, E = 1, T = 0;
      i += "." + o + "." + xe(l) + c + "." + xe(d) + "." + f + "." + m + p + g + "." + xe(v) + "." + xe(C) + "." + xe(E) + "." + T;
      break;
    }
  }
  return {
    codec: i,
    encrypted: n
  };
}
function Yt(a, e) {
  const t = e + 5;
  for (; a[e++] & 128 && e < t; )
    ;
  return e;
}
function lt(a) {
  return ("0" + a.toString(16).toUpperCase()).slice(-2);
}
function xe(a) {
  return (a < 10 ? "0" : "") + a;
}
function Wr(a, e) {
  if (!a || !e)
    return a;
  const t = e.keyId;
  return t && e.isCommonEncryption && W(a, ["moov", "trak"]).forEach((i) => {
    const r = W(i, ["mdia", "minf", "stbl", "stsd"])[0].subarray(8);
    let o = W(r, ["enca"]);
    const l = o.length > 0;
    l || (o = W(r, ["encv"])), o.forEach((c) => {
      const h = l ? c.subarray(28) : c.subarray(78);
      W(h, ["sinf"]).forEach((d) => {
        const f = un(d);
        if (f) {
          const m = f.subarray(8, 24);
          m.some((p) => p !== 0) || (S.log(`[eme] Patching keyId in 'enc${l ? "a" : "v"}>sinf>>tenc' box: ${Se.hexDump(m)} -> ${Se.hexDump(t)}`), f.set(t, 8));
        }
      });
    });
  }), a;
}
function un(a) {
  const e = W(a, ["schm"])[0];
  if (e) {
    const t = re(e.subarray(4, 8));
    if (t === "cbcs" || t === "cenc")
      return W(a, ["schi", "tenc"])[0];
  }
  return S.error("[eme] missing 'schm' box"), null;
}
function zr(a, e) {
  return W(e, ["moof", "traf"]).reduce((t, s) => {
    const i = W(s, ["tfdt"])[0], n = i[0], r = W(s, ["tfhd"]).reduce((o, l) => {
      const c = V(l, 4), h = a[c];
      if (h) {
        let u = V(i, 4);
        if (n === 1) {
          if (u === wt)
            return S.warn("[mp4-demuxer]: Ignoring assumed invalid signed 64-bit track fragment decode time"), o;
          u *= wt + 1, u += V(i, 8);
        }
        const d = h.timescale || 9e4, f = u / d;
        if (O(f) && (o === null || f < o))
          return f;
      }
      return o;
    }, null);
    return r !== null && O(r) && (t === null || r < t) ? r : t;
  }, null);
}
function Yr(a, e) {
  let t = 0, s = 0, i = 0;
  const n = W(a, ["moof", "traf"]);
  for (let r = 0; r < n.length; r++) {
    const o = n[r], l = W(o, ["tfhd"])[0], c = V(l, 4), h = e[c];
    if (!h)
      continue;
    const u = h.default, d = V(l, 0) | (u == null ? void 0 : u.flags);
    let f = u == null ? void 0 : u.duration;
    d & 8 && (d & 2 ? f = V(l, 12) : f = V(l, 8));
    const m = h.timescale || 9e4, p = W(o, ["trun"]);
    for (let g = 0; g < p.length; g++) {
      if (t = Zr(p[g]), !t && f) {
        const v = V(p[g], 4);
        t = f * v;
      }
      h.type === X.VIDEO ? s += t / m : h.type === X.AUDIO && (i += t / m);
    }
  }
  if (s === 0 && i === 0) {
    let r = 1 / 0, o = 0, l = 0;
    const c = W(a, ["sidx"]);
    for (let h = 0; h < c.length; h++) {
      const u = Gr(c[h]);
      if (u != null && u.references) {
        r = Math.min(r, u.earliestPresentationTime / u.timescale);
        const d = u.references.reduce((f, m) => f + m.info.duration || 0, 0);
        o = Math.max(o, d + u.earliestPresentationTime / u.timescale), l = o - r;
      }
    }
    if (l && O(l))
      return l;
  }
  return s || i;
}
function Zr(a) {
  const e = V(a, 0);
  let t = 8;
  e & 1 && (t += 4), e & 4 && (t += 4);
  let s = 0;
  const i = V(a, 4);
  for (let n = 0; n < i; n++) {
    if (e & 256) {
      const r = V(a, t);
      s += r, t += 4;
    }
    e & 512 && (t += 4), e & 1024 && (t += 4), e & 2048 && (t += 4);
  }
  return s;
}
function qr(a, e, t) {
  W(e, ["moof", "traf"]).forEach((s) => {
    W(s, ["tfhd"]).forEach((i) => {
      const n = V(i, 4), r = a[n];
      if (!r)
        return;
      const o = r.timescale || 9e4;
      W(s, ["tfdt"]).forEach((l) => {
        const c = l[0], h = t * o;
        if (h) {
          let u = V(l, 4);
          if (c === 0)
            u -= h, u = Math.max(u, 0), zt(l, 4, u);
          else {
            u *= Math.pow(2, 32), u += V(l, 8), u -= h, u = Math.max(u, 0);
            const d = Math.floor(u / (wt + 1)), f = Math.floor(u % (wt + 1));
            zt(l, 4, d), zt(l, 8, f);
          }
        }
      });
    });
  });
}
function jr(a) {
  const e = {
    valid: null,
    remainder: null
  }, t = W(a, ["moof"]);
  if (t.length < 2)
    return e.remainder = a, e;
  const s = t[t.length - 1];
  return e.valid = $e(a, 0, s.byteOffset - 8), e.remainder = $e(a, s.byteOffset - 8), e;
}
function ve(a, e) {
  const t = new Uint8Array(a.length + e.length);
  return t.set(a), t.set(e, a.length), t;
}
function Xs(a, e) {
  const t = [], s = e.samples, i = e.timescale, n = e.id;
  let r = !1;
  return W(s, ["moof"]).map((l) => {
    const c = l.byteOffset - 8;
    W(l, ["traf"]).map((u) => {
      const d = W(u, ["tfdt"]).map((f) => {
        const m = f[0];
        let p = V(f, 4);
        return m === 1 && (p *= Math.pow(2, 32), p += V(f, 8)), p / i;
      })[0];
      return d !== void 0 && (a = d), W(u, ["tfhd"]).map((f) => {
        const m = V(f, 4), p = V(f, 0) & 16777215, g = (p & 1) !== 0, v = (p & 2) !== 0, C = (p & 8) !== 0;
        let E = 0;
        const T = (p & 16) !== 0;
        let x = 0;
        const I = (p & 32) !== 0;
        let L = 8;
        m === n && (g && (L += 8), v && (L += 4), C && (E = V(f, L), L += 4), T && (x = V(f, L), L += 4), I && (L += 4), e.type === "video" && (r = Xr(e.codec)), W(u, ["trun"]).map((w) => {
          const R = w[0], k = V(w, 0) & 16777215, M = (k & 1) !== 0;
          let _ = 0;
          const P = (k & 4) !== 0, G = (k & 256) !== 0;
          let B = 0;
          const U = (k & 512) !== 0;
          let Z = 0;
          const Q = (k & 1024) !== 0, $ = (k & 2048) !== 0;
          let F = 0;
          const q = V(w, 4);
          let z = 8;
          M && (_ = V(w, z), z += 4), P && (z += 4);
          let j = _ + c;
          for (let ie = 0; ie < q; ie++) {
            if (G ? (B = V(w, z), z += 4) : B = E, U ? (Z = V(w, z), z += 4) : Z = x, Q && (z += 4), $ && (R === 0 ? F = V(w, z) : F = cn(w, z), z += 4), e.type === X.VIDEO) {
              let ae = 0;
              for (; ae < Z; ) {
                const he = V(s, j);
                if (j += 4, Qr(r, s[j])) {
                  const pe = s.subarray(j, j + he);
                  dn(pe, r ? 2 : 1, a + F / i, t);
                }
                j += he, ae += he + 4;
              }
            }
            a += B / i;
          }
        }));
      });
    });
  }), t;
}
function Xr(a) {
  if (!a)
    return !1;
  const e = a.indexOf("."), t = e < 0 ? a : a.substring(0, e);
  return t === "hvc1" || t === "hev1" || // Dolby Vision
  t === "dvh1" || t === "dvhe";
}
function Qr(a, e) {
  if (a) {
    const t = e >> 1 & 63;
    return t === 39 || t === 40;
  } else
    return (e & 31) === 6;
}
function dn(a, e, t, s) {
  const i = fn(a);
  let n = 0;
  n += e;
  let r = 0, o = 0, l = 0;
  for (; n < i.length; ) {
    r = 0;
    do {
      if (n >= i.length)
        break;
      l = i[n++], r += l;
    } while (l === 255);
    o = 0;
    do {
      if (n >= i.length)
        break;
      l = i[n++], o += l;
    } while (l === 255);
    const c = i.length - n;
    let h = n;
    if (o < c)
      n += o;
    else if (o > c) {
      S.error(`Malformed SEI payload. ${o} is too small, only ${c} bytes left to parse.`);
      break;
    }
    if (r === 4) {
      if (i[h++] === 181) {
        const d = ln(i, h);
        if (h += 2, d === 49) {
          const f = V(i, h);
          if (h += 4, f === 1195456820) {
            const m = i[h++];
            if (m === 3) {
              const p = i[h++], g = 31 & p, v = 64 & p, C = v ? 2 + g * 3 : 0, E = new Uint8Array(C);
              if (v) {
                E[0] = p;
                for (let T = 1; T < C; T++)
                  E[T] = i[h++];
              }
              s.push({
                type: m,
                payloadType: r,
                pts: t,
                bytes: E
              });
            }
          }
        }
      }
    } else if (r === 5 && o > 16) {
      const u = [];
      for (let m = 0; m < 16; m++) {
        const p = i[h++].toString(16);
        u.push(p.length == 1 ? "0" + p : p), (m === 3 || m === 5 || m === 7 || m === 9) && u.push("-");
      }
      const d = o - 16, f = new Uint8Array(d);
      for (let m = 0; m < d; m++)
        f[m] = i[h++];
      s.push({
        payloadType: r,
        pts: t,
        uuid: u.join(""),
        userData: Ie(f),
        userDataBytes: f
      });
    }
  }
}
function fn(a) {
  const e = a.byteLength, t = [];
  let s = 1;
  for (; s < e - 2; )
    a[s] === 0 && a[s + 1] === 0 && a[s + 2] === 3 ? (t.push(s + 2), s += 2) : s++;
  if (t.length === 0)
    return a;
  const i = e - t.length, n = new Uint8Array(i);
  let r = 0;
  for (s = 0; s < i; r++, s++)
    r === t[0] && (r++, t.shift()), n[s] = a[r];
  return n;
}
function Jr(a) {
  const e = a[0];
  let t = "", s = "", i = 0, n = 0, r = 0, o = 0, l = 0, c = 0;
  if (e === 0) {
    for (; re(a.subarray(c, c + 1)) !== "\0"; )
      t += re(a.subarray(c, c + 1)), c += 1;
    for (t += re(a.subarray(c, c + 1)), c += 1; re(a.subarray(c, c + 1)) !== "\0"; )
      s += re(a.subarray(c, c + 1)), c += 1;
    s += re(a.subarray(c, c + 1)), c += 1, i = V(a, 12), n = V(a, 16), o = V(a, 20), l = V(a, 24), c = 28;
  } else if (e === 1) {
    c += 4, i = V(a, c), c += 4;
    const u = V(a, c);
    c += 4;
    const d = V(a, c);
    for (c += 4, r = 2 ** 32 * u + d, gr(r) || (r = Number.MAX_SAFE_INTEGER, S.warn("Presentation time exceeds safe integer limit and wrapped to max safe integer in parsing emsg box")), o = V(a, c), c += 4, l = V(a, c), c += 4; re(a.subarray(c, c + 1)) !== "\0"; )
      t += re(a.subarray(c, c + 1)), c += 1;
    for (t += re(a.subarray(c, c + 1)), c += 1; re(a.subarray(c, c + 1)) !== "\0"; )
      s += re(a.subarray(c, c + 1)), c += 1;
    s += re(a.subarray(c, c + 1)), c += 1;
  }
  const h = a.subarray(c, a.byteLength);
  return {
    schemeIdUri: t,
    value: s,
    timeScale: i,
    presentationTime: r,
    presentationTimeDelta: n,
    eventDuration: o,
    id: l,
    payload: h
  };
}
function ea(a, ...e) {
  const t = e.length;
  let s = 8, i = t;
  for (; i--; )
    s += e[i].byteLength;
  const n = new Uint8Array(s);
  for (n[0] = s >> 24 & 255, n[1] = s >> 16 & 255, n[2] = s >> 8 & 255, n[3] = s & 255, n.set(a, 4), i = 0, s = 8; i < t; i++)
    n.set(e[i], s), s += e[i].byteLength;
  return n;
}
function ta(a, e, t) {
  if (a.byteLength !== 16)
    throw new RangeError("Invalid system id");
  let s, i;
  if (e) {
    s = 1, i = new Uint8Array(e.length * 16);
    for (let o = 0; o < e.length; o++) {
      const l = e[o];
      if (l.byteLength !== 16)
        throw new RangeError("Invalid key");
      i.set(l, o * 16);
    }
  } else
    s = 0, i = new Uint8Array();
  let n;
  s > 0 ? (n = new Uint8Array(4), e.length > 0 && new DataView(n.buffer).setUint32(0, e.length, !1)) : n = new Uint8Array();
  const r = new Uint8Array(4);
  return t && t.byteLength > 0 && new DataView(r.buffer).setUint32(0, t.byteLength, !1), ea(
    [112, 115, 115, 104],
    new Uint8Array([
      s,
      0,
      0,
      0
      // Flags
    ]),
    a,
    // 16 bytes
    n,
    i,
    r,
    t || new Uint8Array()
  );
}
function sa(a) {
  if (!(a instanceof ArrayBuffer) || a.byteLength < 32)
    return null;
  const e = {
    version: 0,
    systemId: "",
    kids: null,
    data: null
  }, t = new DataView(a), s = t.getUint32(0);
  if (a.byteLength !== s && s > 44 || t.getUint32(4) !== 1886614376 || (e.version = t.getUint32(8) >>> 24, e.version > 1))
    return null;
  e.systemId = Se.hexDump(new Uint8Array(a, 12, 16));
  const n = t.getUint32(28);
  if (e.version === 0) {
    if (s - 32 < n)
      return null;
    e.data = new Uint8Array(a, 32, n);
  } else if (e.version === 1) {
    e.kids = [];
    for (let r = 0; r < n; r++)
      e.kids.push(new Uint8Array(a, 32 + r * 16, 16));
  }
  return e;
}
let ct = {};
class rt {
  static clearKeyUriToKeyIdMap() {
    ct = {};
  }
  constructor(e, t, s, i = [1], n = null) {
    this.uri = void 0, this.method = void 0, this.keyFormat = void 0, this.keyFormatVersions = void 0, this.encrypted = void 0, this.isCommonEncryption = void 0, this.iv = null, this.key = null, this.keyId = null, this.pssh = null, this.method = e, this.uri = t, this.keyFormat = s, this.keyFormatVersions = i, this.iv = n, this.encrypted = e ? e !== "NONE" : !1, this.isCommonEncryption = this.encrypted && e !== "AES-128";
  }
  isSupported() {
    if (this.method) {
      if (this.method === "AES-128" || this.method === "NONE")
        return !0;
      if (this.keyFormat === "identity")
        return this.method === "SAMPLE-AES";
      switch (this.keyFormat) {
        case me.FAIRPLAY:
        case me.WIDEVINE:
        case me.PLAYREADY:
        case me.CLEARKEY:
          return ["ISO-23001-7", "SAMPLE-AES", "SAMPLE-AES-CENC", "SAMPLE-AES-CTR"].indexOf(this.method) !== -1;
      }
    }
    return !1;
  }
  getDecryptData(e) {
    if (!this.encrypted || !this.uri)
      return null;
    if (this.method === "AES-128" && this.uri && !this.iv) {
      typeof e != "number" && (this.method === "AES-128" && !this.iv && S.warn(`missing IV for initialization segment with method="${this.method}" - compliance issue`), e = 0);
      const s = ia(e);
      return new rt(this.method, this.uri, "identity", this.keyFormatVersions, s);
    }
    const t = Rr(this.uri);
    if (t)
      switch (this.keyFormat) {
        case me.WIDEVINE:
          this.pssh = t, t.length >= 22 && (this.keyId = t.subarray(t.length - 22, t.length - 6));
          break;
        case me.PLAYREADY: {
          const s = new Uint8Array([154, 4, 240, 121, 152, 64, 66, 134, 171, 146, 230, 91, 224, 136, 95, 149]);
          this.pssh = ta(s, null, t);
          const i = new Uint16Array(t.buffer, t.byteOffset, t.byteLength / 2), n = String.fromCharCode.apply(null, Array.from(i)), r = n.substring(n.indexOf("<"), n.length), c = new DOMParser().parseFromString(r, "text/xml").getElementsByTagName("KID")[0];
          if (c) {
            const h = c.childNodes[0] ? c.childNodes[0].nodeValue : c.getAttribute("VALUE");
            if (h) {
              const u = As(h).subarray(0, 16);
              Ir(u), this.keyId = u;
            }
          }
          break;
        }
        default: {
          let s = t.subarray(0, 16);
          if (s.length !== 16) {
            const i = new Uint8Array(16);
            i.set(s, 16 - s.length), s = i;
          }
          this.keyId = s;
          break;
        }
      }
    if (!this.keyId || this.keyId.byteLength !== 16) {
      let s = ct[this.uri];
      if (!s) {
        const i = Object.keys(ct).length % Number.MAX_SAFE_INTEGER;
        s = new Uint8Array(16), new DataView(s.buffer, 12, 4).setUint32(0, i), ct[this.uri] = s;
      }
      this.keyId = s;
    }
    return this;
  }
}
function ia(a) {
  const e = new Uint8Array(16);
  for (let t = 12; t < 16; t++)
    e[t] = a >> 8 * (15 - t) & 255;
  return e;
}
const mn = /\{\$([a-zA-Z0-9-_]+)\}/g;
function Qs(a) {
  return mn.test(a);
}
function fe(a, e, t) {
  if (a.variableList !== null || a.hasVariableRefs)
    for (let s = t.length; s--; ) {
      const i = t[s], n = e[i];
      n && (e[i] = ds(a, n));
    }
}
function ds(a, e) {
  if (a.variableList !== null || a.hasVariableRefs) {
    const t = a.variableList;
    return e.replace(mn, (s) => {
      const i = s.substring(2, s.length - 1), n = t == null ? void 0 : t[i];
      return n === void 0 ? (a.playlistParsingError || (a.playlistParsingError = new Error(`Missing preceding EXT-X-DEFINE tag for Variable Reference: "${i}"`)), s) : n;
    });
  }
  return e;
}
function Js(a, e, t) {
  let s = a.variableList;
  s || (a.variableList = s = {});
  let i, n;
  if ("QUERYPARAM" in e) {
    i = e.QUERYPARAM;
    try {
      const r = new self.URL(t).searchParams;
      if (r.has(i))
        n = r.get(i);
      else
        throw new Error(`"${i}" does not match any query parameter in URI: "${t}"`);
    } catch (r) {
      a.playlistParsingError || (a.playlistParsingError = new Error(`EXT-X-DEFINE QUERYPARAM: ${r.message}`));
    }
  } else
    i = e.NAME, n = e.VALUE;
  i in s ? a.playlistParsingError || (a.playlistParsingError = new Error(`EXT-X-DEFINE duplicate Variable Name declarations: "${i}"`)) : s[i] = n || "";
}
function na(a, e, t) {
  const s = e.IMPORT;
  if (t && s in t) {
    let i = a.variableList;
    i || (a.variableList = i = {}), i[s] = t[s];
  } else
    a.playlistParsingError || (a.playlistParsingError = new Error(`EXT-X-DEFINE IMPORT attribute not found in Multivariant Playlist: "${s}"`));
}
function Ve(a = !0) {
  return typeof self > "u" ? void 0 : (a || !self.MediaSource) && self.ManagedMediaSource || self.MediaSource || self.WebKitMediaSource;
}
function ra(a) {
  return typeof self < "u" && a === self.ManagedMediaSource;
}
const It = {
  audio: {
    a3ds: 1,
    "ac-3": 0.95,
    "ac-4": 1,
    alac: 0.9,
    alaw: 1,
    dra1: 1,
    "dts+": 1,
    "dts-": 1,
    dtsc: 1,
    dtse: 1,
    dtsh: 1,
    "ec-3": 0.9,
    enca: 1,
    fLaC: 0.9,
    // MP4-RA listed codec entry for FLAC
    flac: 0.9,
    // legacy browser codec name for FLAC
    FLAC: 0.9,
    // some manifests may list "FLAC" with Apple's tools
    g719: 1,
    g726: 1,
    m4ae: 1,
    mha1: 1,
    mha2: 1,
    mhm1: 1,
    mhm2: 1,
    mlpa: 1,
    mp4a: 1,
    "raw ": 1,
    Opus: 1,
    opus: 1,
    // browsers expect this to be lowercase despite MP4RA says 'Opus'
    samr: 1,
    sawb: 1,
    sawp: 1,
    sevc: 1,
    sqcp: 1,
    ssmv: 1,
    twos: 1,
    ulaw: 1
  },
  video: {
    avc1: 1,
    avc2: 1,
    avc3: 1,
    avc4: 1,
    avcp: 1,
    av01: 0.8,
    drac: 1,
    dva1: 1,
    dvav: 1,
    dvh1: 0.7,
    dvhe: 0.7,
    encv: 1,
    hev1: 0.75,
    hvc1: 0.75,
    mjp2: 1,
    mp4v: 1,
    mvc1: 1,
    mvc2: 1,
    mvc3: 1,
    mvc4: 1,
    resv: 1,
    rv60: 1,
    s263: 1,
    svc1: 1,
    svc2: 1,
    "vc-1": 1,
    vp08: 1,
    vp09: 0.9
  },
  text: {
    stpp: 1,
    wvtt: 1
  }
};
function aa(a, e) {
  const t = It[e];
  return !!t && !!t[a.slice(0, 4)];
}
function Zt(a, e, t = !0) {
  return !a.split(",").some((s) => !pn(s, e, t));
}
function pn(a, e, t = !0) {
  var s;
  const i = Ve(t);
  return (s = i == null ? void 0 : i.isTypeSupported(at(a, e))) != null ? s : !1;
}
function at(a, e) {
  return `${e}/mp4;codecs="${a}"`;
}
function ei(a) {
  if (a) {
    const e = a.substring(0, 4);
    return It.video[e];
  }
  return 2;
}
function Rt(a) {
  return a.split(",").reduce((e, t) => {
    const s = It.video[t];
    return s ? (s * 2 + e) / (e ? 3 : 2) : (It.audio[t] + e) / (e ? 2 : 1);
  }, 0);
}
const qt = {};
function oa(a, e = !0) {
  if (qt[a])
    return qt[a];
  const t = {
    flac: ["flac", "fLaC", "FLAC"],
    opus: ["opus", "Opus"]
  }[a];
  for (let s = 0; s < t.length; s++)
    if (pn(t[s], "audio", e))
      return qt[a] = t[s], t[s];
  return a;
}
const la = /flac|opus/i;
function kt(a, e = !0) {
  return a.replace(la, (t) => oa(t.toLowerCase(), e));
}
function ti(a, e) {
  return a && a !== "mp4a" ? a : e && e.split(",")[0];
}
function ca(a) {
  const e = a.split(",");
  for (let t = 0; t < e.length; t++) {
    const s = e[t].split(".");
    if (s.length > 2) {
      let i = s.shift() + ".";
      i += parseInt(s.shift()).toString(16), i += ("000" + parseInt(s.shift()).toString(16)).slice(-4), e[t] = i;
    }
  }
  return e.join(",");
}
const si = /#EXT-X-STREAM-INF:([^\r\n]*)(?:[\r\n](?:#[^\r\n]*)?)*([^\r\n]+)|#EXT-X-(SESSION-DATA|SESSION-KEY|DEFINE|CONTENT-STEERING|START):([^\r\n]*)[\r\n]+/g, ii = /#EXT-X-MEDIA:(.*)/g, ha = /^#EXT(?:INF|-X-TARGETDURATION):/m, ni = new RegExp([
  /#EXTINF:\s*(\d*(?:\.\d+)?)(?:,(.*)\s+)?/.source,
  // duration (#EXTINF:<duration>,<title>), group 1 => duration, group 2 => title
  /(?!#) *(\S[^\r\n]*)/.source,
  // segment URI, group 3 => the URI (note newline is not eaten)
  /#EXT-X-BYTERANGE:*(.+)/.source,
  // next segment's byterange, group 4 => range spec (x@y)
  /#EXT-X-PROGRAM-DATE-TIME:(.+)/.source,
  // next segment's program date/time group 5 => the datetime spec
  /#.*/.source
  // All other non-segment oriented tags will match with all groups empty
].join("|"), "g"), ua = new RegExp([/#(EXTM3U)/.source, /#EXT-X-(DATERANGE|DEFINE|KEY|MAP|PART|PART-INF|PLAYLIST-TYPE|PRELOAD-HINT|RENDITION-REPORT|SERVER-CONTROL|SKIP|START):(.+)/.source, /#EXT-X-(BITRATE|DISCONTINUITY-SEQUENCE|MEDIA-SEQUENCE|TARGETDURATION|VERSION): *(\d+)/.source, /#EXT-X-(DISCONTINUITY|ENDLIST|GAP|INDEPENDENT-SEGMENTS)/.source, /(#)([^:]*):(.*)/.source, /(#)(.*)(?:.*)\r?\n?/.source].join("|"));
class Ae {
  static findGroup(e, t) {
    for (let s = 0; s < e.length; s++) {
      const i = e[s];
      if (i.id === t)
        return i;
    }
  }
  static resolve(e, t) {
    return Ls.buildAbsoluteURL(t, e, {
      alwaysNormalize: !0
    });
  }
  static isMediaPlaylist(e) {
    return ha.test(e);
  }
  static parseMasterPlaylist(e, t) {
    const s = Qs(e), i = {
      contentSteering: null,
      levels: [],
      playlistParsingError: null,
      sessionData: null,
      sessionKeys: null,
      startTimeOffset: null,
      variableList: null,
      hasVariableRefs: s
    }, n = [];
    si.lastIndex = 0;
    let r;
    for (; (r = si.exec(e)) != null; )
      if (r[1]) {
        var o;
        const c = new se(r[1]);
        fe(i, c, ["CODECS", "SUPPLEMENTAL-CODECS", "ALLOWED-CPC", "PATHWAY-ID", "STABLE-VARIANT-ID", "AUDIO", "VIDEO", "SUBTITLES", "CLOSED-CAPTIONS", "NAME"]);
        const h = ds(i, r[2]), u = {
          attrs: c,
          bitrate: c.decimalInteger("BANDWIDTH") || c.decimalInteger("AVERAGE-BANDWIDTH"),
          name: c.NAME,
          url: Ae.resolve(h, t)
        }, d = c.decimalResolution("RESOLUTION");
        d && (u.width = d.width, u.height = d.height), da(c.CODECS, u), (o = u.unknownCodecs) != null && o.length || n.push(u), i.levels.push(u);
      } else if (r[3]) {
        const c = r[3], h = r[4];
        switch (c) {
          case "SESSION-DATA": {
            const u = new se(h);
            fe(i, u, ["DATA-ID", "LANGUAGE", "VALUE", "URI"]);
            const d = u["DATA-ID"];
            d && (i.sessionData === null && (i.sessionData = {}), i.sessionData[d] = u);
            break;
          }
          case "SESSION-KEY": {
            const u = ri(h, t, i);
            u.encrypted && u.isSupported() ? (i.sessionKeys === null && (i.sessionKeys = []), i.sessionKeys.push(u)) : S.warn(`[Keys] Ignoring invalid EXT-X-SESSION-KEY tag: "${h}"`);
            break;
          }
          case "DEFINE": {
            {
              const u = new se(h);
              fe(i, u, ["NAME", "VALUE", "QUERYPARAM"]), Js(i, u, t);
            }
            break;
          }
          case "CONTENT-STEERING": {
            const u = new se(h);
            fe(i, u, ["SERVER-URI", "PATHWAY-ID"]), i.contentSteering = {
              uri: Ae.resolve(u["SERVER-URI"], t),
              pathwayId: u["PATHWAY-ID"] || "."
            };
            break;
          }
          case "START": {
            i.startTimeOffset = ai(h);
            break;
          }
        }
      }
    const l = n.length > 0 && n.length < i.levels.length;
    return i.levels = l ? n : i.levels, i.levels.length === 0 && (i.playlistParsingError = new Error("no levels found in manifest")), i;
  }
  static parseMasterPlaylistMedia(e, t, s) {
    let i;
    const n = {}, r = s.levels, o = {
      AUDIO: r.map((c) => ({
        id: c.attrs.AUDIO,
        audioCodec: c.audioCodec
      })),
      SUBTITLES: r.map((c) => ({
        id: c.attrs.SUBTITLES,
        textCodec: c.textCodec
      })),
      "CLOSED-CAPTIONS": []
    };
    let l = 0;
    for (ii.lastIndex = 0; (i = ii.exec(e)) !== null; ) {
      const c = new se(i[1]), h = c.TYPE;
      if (h) {
        const u = o[h], d = n[h] || [];
        n[h] = d, fe(s, c, ["URI", "GROUP-ID", "LANGUAGE", "ASSOC-LANGUAGE", "STABLE-RENDITION-ID", "NAME", "INSTREAM-ID", "CHARACTERISTICS", "CHANNELS"]);
        const f = c.LANGUAGE, m = c["ASSOC-LANGUAGE"], p = c.CHANNELS, g = c.CHARACTERISTICS, v = c["INSTREAM-ID"], C = {
          attrs: c,
          bitrate: 0,
          id: l++,
          groupId: c["GROUP-ID"] || "",
          name: c.NAME || f || "",
          type: h,
          default: c.bool("DEFAULT"),
          autoselect: c.bool("AUTOSELECT"),
          forced: c.bool("FORCED"),
          lang: f,
          url: c.URI ? Ae.resolve(c.URI, t) : ""
        };
        if (m && (C.assocLang = m), p && (C.channels = p), g && (C.characteristics = g), v && (C.instreamId = v), u != null && u.length) {
          const E = Ae.findGroup(u, C.groupId) || u[0];
          oi(C, E, "audioCodec"), oi(C, E, "textCodec");
        }
        d.push(C);
      }
    }
    return n;
  }
  static parseLevelPlaylist(e, t, s, i, n, r) {
    const o = new Ar(t), l = o.fragments;
    let c = null, h = 0, u = 0, d = 0, f = 0, m = null, p = new Gt(i, t), g, v, C, E = -1, T = !1, x = null;
    for (ni.lastIndex = 0, o.m3u8 = e, o.hasVariableRefs = Qs(e); (g = ni.exec(e)) !== null; ) {
      T && (T = !1, p = new Gt(i, t), p.start = d, p.sn = h, p.cc = f, p.level = s, c && (p.initSegment = c, p.rawProgramDateTime = c.rawProgramDateTime, c.rawProgramDateTime = null, x && (p.setByteRange(x), x = null)));
      const R = g[1];
      if (R) {
        p.duration = parseFloat(R);
        const k = (" " + g[2]).slice(1);
        p.title = k || null, p.tagList.push(k ? ["INF", R, k] : ["INF", R]);
      } else if (g[3]) {
        if (O(p.duration)) {
          p.start = d, C && hi(p, C, o), p.sn = h, p.level = s, p.cc = f, l.push(p);
          const k = (" " + g[3]).slice(1);
          p.relurl = ds(o, k), li(p, m), m = p, d += p.duration, h++, u = 0, T = !0;
        }
      } else if (g[4]) {
        const k = (" " + g[4]).slice(1);
        m ? p.setByteRange(k, m) : p.setByteRange(k);
      } else if (g[5])
        p.rawProgramDateTime = (" " + g[5]).slice(1), p.tagList.push(["PROGRAM-DATE-TIME", p.rawProgramDateTime]), E === -1 && (E = l.length);
      else {
        if (g = g[0].match(ua), !g) {
          S.warn("No matches on slow regex match for level playlist!");
          continue;
        }
        for (v = 1; v < g.length && !(typeof g[v] < "u"); v++)
          ;
        const k = (" " + g[v]).slice(1), M = (" " + g[v + 1]).slice(1), _ = g[v + 2] ? (" " + g[v + 2]).slice(1) : "";
        switch (k) {
          case "PLAYLIST-TYPE":
            o.type = M.toUpperCase();
            break;
          case "MEDIA-SEQUENCE":
            h = o.startSN = parseInt(M);
            break;
          case "SKIP": {
            const P = new se(M);
            fe(o, P, ["RECENTLY-REMOVED-DATERANGES"]);
            const G = P.decimalInteger("SKIPPED-SEGMENTS");
            if (O(G)) {
              o.skippedSegments = G;
              for (let U = G; U--; )
                l.unshift(null);
              h += G;
            }
            const B = P.enumeratedString("RECENTLY-REMOVED-DATERANGES");
            B && (o.recentlyRemovedDateranges = B.split("	"));
            break;
          }
          case "TARGETDURATION":
            o.targetduration = Math.max(parseInt(M), 1);
            break;
          case "VERSION":
            o.version = parseInt(M);
            break;
          case "INDEPENDENT-SEGMENTS":
          case "EXTM3U":
            break;
          case "ENDLIST":
            o.live = !1;
            break;
          case "#":
            (M || _) && p.tagList.push(_ ? [M, _] : [M]);
            break;
          case "DISCONTINUITY":
            f++, p.tagList.push(["DIS"]);
            break;
          case "GAP":
            p.gap = !0, p.tagList.push([k]);
            break;
          case "BITRATE":
            p.tagList.push([k, M]);
            break;
          case "DATERANGE": {
            const P = new se(M);
            fe(o, P, ["ID", "CLASS", "START-DATE", "END-DATE", "SCTE35-CMD", "SCTE35-OUT", "SCTE35-IN"]), fe(o, P, P.clientAttrs);
            const G = new Ji(P, o.dateRanges[P.ID]);
            G.isValid || o.skippedSegments ? o.dateRanges[G.id] = G : S.warn(`Ignoring invalid DATERANGE tag: "${M}"`), p.tagList.push(["EXT-X-DATERANGE", M]);
            break;
          }
          case "DEFINE": {
            {
              const P = new se(M);
              fe(o, P, ["NAME", "VALUE", "IMPORT", "QUERYPARAM"]), "IMPORT" in P ? na(o, P, r) : Js(o, P, t);
            }
            break;
          }
          case "DISCONTINUITY-SEQUENCE":
            f = parseInt(M);
            break;
          case "KEY": {
            const P = ri(M, t, o);
            if (P.isSupported()) {
              if (P.method === "NONE") {
                C = void 0;
                break;
              }
              C || (C = {}), C[P.keyFormat] && (C = ne({}, C)), C[P.keyFormat] = P;
            } else
              S.warn(`[Keys] Ignoring invalid EXT-X-KEY tag: "${M}"`);
            break;
          }
          case "START":
            o.startTimeOffset = ai(M);
            break;
          case "MAP": {
            const P = new se(M);
            if (fe(o, P, ["BYTERANGE", "URI"]), p.duration) {
              const G = new Gt(i, t);
              ci(G, P, s, C), c = G, p.initSegment = c, c.rawProgramDateTime && !p.rawProgramDateTime && (p.rawProgramDateTime = c.rawProgramDateTime);
            } else {
              const G = p.byteRangeEndOffset;
              if (G) {
                const B = p.byteRangeStartOffset;
                x = `${G - B}@${B}`;
              } else
                x = null;
              ci(p, P, s, C), c = p, T = !0;
            }
            break;
          }
          case "SERVER-CONTROL": {
            const P = new se(M);
            o.canBlockReload = P.bool("CAN-BLOCK-RELOAD"), o.canSkipUntil = P.optionalFloat("CAN-SKIP-UNTIL", 0), o.canSkipDateRanges = o.canSkipUntil > 0 && P.bool("CAN-SKIP-DATERANGES"), o.partHoldBack = P.optionalFloat("PART-HOLD-BACK", 0), o.holdBack = P.optionalFloat("HOLD-BACK", 0);
            break;
          }
          case "PART-INF": {
            const P = new se(M);
            o.partTarget = P.decimalFloatingPoint("PART-TARGET");
            break;
          }
          case "PART": {
            let P = o.partList;
            P || (P = o.partList = []);
            const G = u > 0 ? P[P.length - 1] : void 0, B = u++, U = new se(M);
            fe(o, U, ["BYTERANGE", "URI"]);
            const Z = new br(U, p, t, B, G);
            P.push(Z), p.duration += Z.duration;
            break;
          }
          case "PRELOAD-HINT": {
            const P = new se(M);
            fe(o, P, ["URI"]), o.preloadHint = P;
            break;
          }
          case "RENDITION-REPORT": {
            const P = new se(M);
            fe(o, P, ["URI"]), o.renditionReports = o.renditionReports || [], o.renditionReports.push(P);
            break;
          }
          default:
            S.warn(`line parsed but not handled: ${g}`);
            break;
        }
      }
    }
    m && !m.relurl ? (l.pop(), d -= m.duration, o.partList && (o.fragmentHint = m)) : o.partList && (li(p, m), p.cc = f, o.fragmentHint = p, C && hi(p, C, o));
    const I = l.length, L = l[0], w = l[I - 1];
    if (d += o.skippedSegments * o.targetduration, d > 0 && I && w) {
      o.averagetargetduration = d / I;
      const R = w.sn;
      o.endSN = R !== "initSegment" ? R : 0, o.live || (w.endList = !0), L && (o.startCC = L.cc);
    } else
      o.endSN = 0, o.startCC = 0;
    return o.fragmentHint && (d += o.fragmentHint.duration), o.totalduration = d, o.endCC = f, E > 0 && fa(l, E), o;
  }
}
function ri(a, e, t) {
  var s, i;
  const n = new se(a);
  fe(t, n, ["KEYFORMAT", "KEYFORMATVERSIONS", "URI", "IV", "URI"]);
  const r = (s = n.METHOD) != null ? s : "", o = n.URI, l = n.hexadecimalInteger("IV"), c = n.KEYFORMATVERSIONS, h = (i = n.KEYFORMAT) != null ? i : "identity";
  o && n.IV && !l && S.error(`Invalid IV: ${n.IV}`);
  const u = o ? Ae.resolve(o, e) : "", d = (c || "1").split("/").map(Number).filter(Number.isFinite);
  return new rt(r, u, h, d, l);
}
function ai(a) {
  const t = new se(a).decimalFloatingPoint("TIME-OFFSET");
  return O(t) ? t : null;
}
function da(a, e) {
  let t = (a || "").split(/[ ,]+/).filter((s) => s);
  ["video", "audio", "text"].forEach((s) => {
    const i = t.filter((n) => aa(n, s));
    i.length && (e[`${s}Codec`] = i.join(","), t = t.filter((n) => i.indexOf(n) === -1));
  }), e.unknownCodecs = t;
}
function oi(a, e, t) {
  const s = e[t];
  s && (a[t] = s);
}
function fa(a, e) {
  let t = a[e];
  for (let s = e; s--; ) {
    const i = a[s];
    if (!i)
      return;
    i.programDateTime = t.programDateTime - i.duration * 1e3, t = i;
  }
}
function li(a, e) {
  a.rawProgramDateTime ? a.programDateTime = Date.parse(a.rawProgramDateTime) : e != null && e.programDateTime && (a.programDateTime = e.endProgramDateTime), O(a.programDateTime) || (a.programDateTime = null, a.rawProgramDateTime = null);
}
function ci(a, e, t, s) {
  a.relurl = e.URI, e.BYTERANGE && a.setByteRange(e.BYTERANGE), a.level = t, a.sn = "initSegment", s && (a.levelkeys = s), a.initSegment = null;
}
function hi(a, e, t) {
  a.levelkeys = e;
  const {
    encryptedFragments: s
  } = t;
  (!s.length || s[s.length - 1].levelkeys !== e) && Object.keys(e).some((i) => e[i].isCommonEncryption) && s.push(a);
}
var Y = {
  MANIFEST: "manifest",
  LEVEL: "level",
  AUDIO_TRACK: "audioTrack",
  SUBTITLE_TRACK: "subtitleTrack"
}, H = {
  MAIN: "main",
  AUDIO: "audio",
  SUBTITLE: "subtitle"
};
function ui(a) {
  const {
    type: e
  } = a;
  switch (e) {
    case Y.AUDIO_TRACK:
      return H.AUDIO;
    case Y.SUBTITLE_TRACK:
      return H.SUBTITLE;
    default:
      return H.MAIN;
  }
}
function jt(a, e) {
  let t = a.url;
  return (t === void 0 || t.indexOf("data:") === 0) && (t = e.url), t;
}
class ma {
  constructor(e) {
    this.hls = void 0, this.loaders = /* @__PURE__ */ Object.create(null), this.variableList = null, this.hls = e, this.registerListeners();
  }
  startLoad(e) {
  }
  stopLoad() {
    this.destroyInternalLoaders();
  }
  registerListeners() {
    const {
      hls: e
    } = this;
    e.on(y.MANIFEST_LOADING, this.onManifestLoading, this), e.on(y.LEVEL_LOADING, this.onLevelLoading, this), e.on(y.AUDIO_TRACK_LOADING, this.onAudioTrackLoading, this), e.on(y.SUBTITLE_TRACK_LOADING, this.onSubtitleTrackLoading, this);
  }
  unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(y.MANIFEST_LOADING, this.onManifestLoading, this), e.off(y.LEVEL_LOADING, this.onLevelLoading, this), e.off(y.AUDIO_TRACK_LOADING, this.onAudioTrackLoading, this), e.off(y.SUBTITLE_TRACK_LOADING, this.onSubtitleTrackLoading, this);
  }
  /**
   * Returns defaults or configured loader-type overloads (pLoader and loader config params)
   */
  createInternalLoader(e) {
    const t = this.hls.config, s = t.pLoader, i = t.loader, n = s || i, r = new n(t);
    return this.loaders[e.type] = r, r;
  }
  getInternalLoader(e) {
    return this.loaders[e.type];
  }
  resetInternalLoader(e) {
    this.loaders[e] && delete this.loaders[e];
  }
  /**
   * Call `destroy` on all internal loader instances mapped (one per context type)
   */
  destroyInternalLoaders() {
    for (const e in this.loaders) {
      const t = this.loaders[e];
      t && t.destroy(), this.resetInternalLoader(e);
    }
  }
  destroy() {
    this.variableList = null, this.unregisterListeners(), this.destroyInternalLoaders();
  }
  onManifestLoading(e, t) {
    const {
      url: s
    } = t;
    this.variableList = null, this.load({
      id: null,
      level: 0,
      responseType: "text",
      type: Y.MANIFEST,
      url: s,
      deliveryDirectives: null
    });
  }
  onLevelLoading(e, t) {
    const {
      id: s,
      level: i,
      pathwayId: n,
      url: r,
      deliveryDirectives: o
    } = t;
    this.load({
      id: s,
      level: i,
      pathwayId: n,
      responseType: "text",
      type: Y.LEVEL,
      url: r,
      deliveryDirectives: o
    });
  }
  onAudioTrackLoading(e, t) {
    const {
      id: s,
      groupId: i,
      url: n,
      deliveryDirectives: r
    } = t;
    this.load({
      id: s,
      groupId: i,
      level: null,
      responseType: "text",
      type: Y.AUDIO_TRACK,
      url: n,
      deliveryDirectives: r
    });
  }
  onSubtitleTrackLoading(e, t) {
    const {
      id: s,
      groupId: i,
      url: n,
      deliveryDirectives: r
    } = t;
    this.load({
      id: s,
      groupId: i,
      level: null,
      responseType: "text",
      type: Y.SUBTITLE_TRACK,
      url: n,
      deliveryDirectives: r
    });
  }
  load(e) {
    var t;
    const s = this.hls.config;
    let i = this.getInternalLoader(e);
    if (i) {
      const c = i.context;
      if (c && c.url === e.url && c.level === e.level) {
        S.trace("[playlist-loader]: playlist request ongoing");
        return;
      }
      S.log(`[playlist-loader]: aborting previous loader for type: ${e.type}`), i.abort();
    }
    let n;
    if (e.type === Y.MANIFEST ? n = s.manifestLoadPolicy.default : n = ne({}, s.playlistLoadPolicy.default, {
      timeoutRetry: null,
      errorRetry: null
    }), i = this.createInternalLoader(e), O((t = e.deliveryDirectives) == null ? void 0 : t.part)) {
      let c;
      if (e.type === Y.LEVEL && e.level !== null ? c = this.hls.levels[e.level].details : e.type === Y.AUDIO_TRACK && e.id !== null ? c = this.hls.audioTracks[e.id].details : e.type === Y.SUBTITLE_TRACK && e.id !== null && (c = this.hls.subtitleTracks[e.id].details), c) {
        const h = c.partTarget, u = c.targetduration;
        if (h && u) {
          const d = Math.max(h * 3, u * 0.8) * 1e3;
          n = ne({}, n, {
            maxTimeToFirstByteMs: Math.min(d, n.maxTimeToFirstByteMs),
            maxLoadTimeMs: Math.min(d, n.maxTimeToFirstByteMs)
          });
        }
      }
    }
    const r = n.errorRetry || n.timeoutRetry || {}, o = {
      loadPolicy: n,
      timeout: n.maxLoadTimeMs,
      maxRetry: r.maxNumRetry || 0,
      retryDelay: r.retryDelayMs || 0,
      maxRetryDelay: r.maxRetryDelayMs || 0
    }, l = {
      onSuccess: (c, h, u, d) => {
        const f = this.getInternalLoader(u);
        this.resetInternalLoader(u.type);
        const m = c.data;
        if (m.indexOf("#EXTM3U") !== 0) {
          this.handleManifestParsingError(c, u, new Error("no EXTM3U delimiter"), d || null, h);
          return;
        }
        h.parsing.start = performance.now(), Ae.isMediaPlaylist(m) ? this.handleTrackOrLevelPlaylist(c, h, u, d || null, f) : this.handleMasterPlaylist(c, h, u, d);
      },
      onError: (c, h, u, d) => {
        this.handleNetworkError(h, u, !1, c, d);
      },
      onTimeout: (c, h, u) => {
        this.handleNetworkError(h, u, !0, void 0, c);
      }
    };
    i.load(e, o, l);
  }
  handleMasterPlaylist(e, t, s, i) {
    const n = this.hls, r = e.data, o = jt(e, s), l = Ae.parseMasterPlaylist(r, o);
    if (l.playlistParsingError) {
      this.handleManifestParsingError(e, s, l.playlistParsingError, i, t);
      return;
    }
    const {
      contentSteering: c,
      levels: h,
      sessionData: u,
      sessionKeys: d,
      startTimeOffset: f,
      variableList: m
    } = l;
    this.variableList = m;
    const {
      AUDIO: p = [],
      SUBTITLES: g,
      "CLOSED-CAPTIONS": v
    } = Ae.parseMasterPlaylistMedia(r, o, l);
    p.length && !p.some((E) => !E.url) && h[0].audioCodec && !h[0].attrs.AUDIO && (S.log("[playlist-loader]: audio codec signaled in quality level, but no embedded audio track signaled, create one"), p.unshift({
      type: "main",
      name: "main",
      groupId: "main",
      default: !1,
      autoselect: !1,
      forced: !1,
      id: -1,
      attrs: new se({}),
      bitrate: 0,
      url: ""
    })), n.trigger(y.MANIFEST_LOADED, {
      levels: h,
      audioTracks: p,
      subtitles: g,
      captions: v,
      contentSteering: c,
      url: o,
      stats: t,
      networkDetails: i,
      sessionData: u,
      sessionKeys: d,
      startTimeOffset: f,
      variableList: m
    });
  }
  handleTrackOrLevelPlaylist(e, t, s, i, n) {
    const r = this.hls, {
      id: o,
      level: l,
      type: c
    } = s, h = jt(e, s), u = 0, d = O(l) ? l : O(o) ? o : 0, f = ui(s), m = Ae.parseLevelPlaylist(e.data, h, d, f, u, this.variableList);
    if (c === Y.MANIFEST) {
      const p = {
        attrs: new se({}),
        bitrate: 0,
        details: m,
        name: "",
        url: h
      };
      r.trigger(y.MANIFEST_LOADED, {
        levels: [p],
        audioTracks: [],
        url: h,
        stats: t,
        networkDetails: i,
        sessionData: null,
        sessionKeys: null,
        contentSteering: null,
        startTimeOffset: null,
        variableList: null
      });
    }
    t.parsing.end = performance.now(), s.levelDetails = m, this.handlePlaylistLoaded(m, e, t, s, i, n);
  }
  handleManifestParsingError(e, t, s, i, n) {
    this.hls.trigger(y.ERROR, {
      type: K.NETWORK_ERROR,
      details: A.MANIFEST_PARSING_ERROR,
      fatal: t.type === Y.MANIFEST,
      url: e.url,
      err: s,
      error: s,
      reason: s.message,
      response: e,
      context: t,
      networkDetails: i,
      stats: n
    });
  }
  handleNetworkError(e, t, s = !1, i, n) {
    let r = `A network ${s ? "timeout" : "error" + (i ? " (status " + i.code + ")" : "")} occurred while loading ${e.type}`;
    e.type === Y.LEVEL ? r += `: ${e.level} id: ${e.id}` : (e.type === Y.AUDIO_TRACK || e.type === Y.SUBTITLE_TRACK) && (r += ` id: ${e.id} group-id: "${e.groupId}"`);
    const o = new Error(r);
    S.warn(`[playlist-loader]: ${r}`);
    let l = A.UNKNOWN, c = !1;
    const h = this.getInternalLoader(e);
    switch (e.type) {
      case Y.MANIFEST:
        l = s ? A.MANIFEST_LOAD_TIMEOUT : A.MANIFEST_LOAD_ERROR, c = !0;
        break;
      case Y.LEVEL:
        l = s ? A.LEVEL_LOAD_TIMEOUT : A.LEVEL_LOAD_ERROR, c = !1;
        break;
      case Y.AUDIO_TRACK:
        l = s ? A.AUDIO_TRACK_LOAD_TIMEOUT : A.AUDIO_TRACK_LOAD_ERROR, c = !1;
        break;
      case Y.SUBTITLE_TRACK:
        l = s ? A.SUBTITLE_TRACK_LOAD_TIMEOUT : A.SUBTITLE_LOAD_ERROR, c = !1;
        break;
    }
    h && this.resetInternalLoader(e.type);
    const u = {
      type: K.NETWORK_ERROR,
      details: l,
      fatal: c,
      url: e.url,
      loader: h,
      context: e,
      error: o,
      networkDetails: t,
      stats: n
    };
    if (i) {
      const d = (t == null ? void 0 : t.url) || e.url;
      u.response = ce({
        url: d,
        data: void 0
      }, i);
    }
    this.hls.trigger(y.ERROR, u);
  }
  handlePlaylistLoaded(e, t, s, i, n, r) {
    const o = this.hls, {
      type: l,
      level: c,
      id: h,
      groupId: u,
      deliveryDirectives: d
    } = i, f = jt(t, i), m = ui(i), p = typeof i.level == "number" && m === H.MAIN ? c : void 0;
    if (!e.fragments.length) {
      const v = new Error("No Segments found in Playlist");
      o.trigger(y.ERROR, {
        type: K.NETWORK_ERROR,
        details: A.LEVEL_EMPTY_ERROR,
        fatal: !1,
        url: f,
        error: v,
        reason: v.message,
        response: t,
        context: i,
        level: p,
        parent: m,
        networkDetails: n,
        stats: s
      });
      return;
    }
    e.targetduration || (e.playlistParsingError = new Error("Missing Target Duration"));
    const g = e.playlistParsingError;
    if (g) {
      o.trigger(y.ERROR, {
        type: K.NETWORK_ERROR,
        details: A.LEVEL_PARSING_ERROR,
        fatal: !1,
        url: f,
        error: g,
        reason: g.message,
        response: t,
        context: i,
        level: p,
        parent: m,
        networkDetails: n,
        stats: s
      });
      return;
    }
    switch (e.live && r && (r.getCacheAge && (e.ageHeader = r.getCacheAge() || 0), (!r.getCacheAge || isNaN(e.ageHeader)) && (e.ageHeader = 0)), l) {
      case Y.MANIFEST:
      case Y.LEVEL:
        o.trigger(y.LEVEL_LOADED, {
          details: e,
          level: p || 0,
          id: h || 0,
          stats: s,
          networkDetails: n,
          deliveryDirectives: d
        });
        break;
      case Y.AUDIO_TRACK:
        o.trigger(y.AUDIO_TRACK_LOADED, {
          details: e,
          id: h || 0,
          groupId: u || "",
          stats: s,
          networkDetails: n,
          deliveryDirectives: d
        });
        break;
      case Y.SUBTITLE_TRACK:
        o.trigger(y.SUBTITLE_TRACK_LOADED, {
          details: e,
          id: h || 0,
          groupId: u || "",
          stats: s,
          networkDetails: n,
          deliveryDirectives: d
        });
        break;
    }
  }
}
function gn(a, e) {
  let t;
  try {
    t = new Event("addtrack");
  } catch {
    t = document.createEvent("Event"), t.initEvent("addtrack", !1, !1);
  }
  t.track = a, e.dispatchEvent(t);
}
function yn(a, e) {
  const t = a.mode;
  if (t === "disabled" && (a.mode = "hidden"), a.cues && !a.cues.getCueById(e.id))
    try {
      if (a.addCue(e), !a.cues.getCueById(e.id))
        throw new Error(`addCue is failed for: ${e}`);
    } catch (s) {
      S.debug(`[texttrack-utils]: ${s}`);
      try {
        const i = new self.TextTrackCue(e.startTime, e.endTime, e.text);
        i.id = e.id, a.addCue(i);
      } catch (i) {
        S.debug(`[texttrack-utils]: Legacy TextTrackCue fallback failed: ${i}`);
      }
    }
  t === "disabled" && (a.mode = t);
}
function Ye(a) {
  const e = a.mode;
  if (e === "disabled" && (a.mode = "hidden"), a.cues)
    for (let t = a.cues.length; t--; )
      a.removeCue(a.cues[t]);
  e === "disabled" && (a.mode = e);
}
function fs(a, e, t, s) {
  const i = a.mode;
  if (i === "disabled" && (a.mode = "hidden"), a.cues && a.cues.length > 0) {
    const n = ga(a.cues, e, t);
    for (let r = 0; r < n.length; r++)
      (!s || s(n[r])) && a.removeCue(n[r]);
  }
  i === "disabled" && (a.mode = i);
}
function pa(a, e) {
  if (e < a[0].startTime)
    return 0;
  const t = a.length - 1;
  if (e > a[t].endTime)
    return -1;
  let s = 0, i = t;
  for (; s <= i; ) {
    const n = Math.floor((i + s) / 2);
    if (e < a[n].startTime)
      i = n - 1;
    else if (e > a[n].startTime && s < t)
      s = n + 1;
    else
      return n;
  }
  return a[s].startTime - e < e - a[i].startTime ? s : i;
}
function ga(a, e, t) {
  const s = [], i = pa(a, e);
  if (i > -1)
    for (let n = i, r = a.length; n < r; n++) {
      const o = a[n];
      if (o.startTime >= e && o.endTime <= t)
        s.push(o);
      else if (o.startTime > t)
        return s;
    }
  return s;
}
function Ct(a) {
  const e = [];
  for (let t = 0; t < a.length; t++) {
    const s = a[t];
    (s.kind === "subtitles" || s.kind === "captions") && s.label && e.push(a[t]);
  }
  return e;
}
var Ee = {
  audioId3: "org.id3",
  dateRange: "com.apple.quicktime.HLS",
  emsg: "https://aomedia.org/emsg/ID3"
};
const ya = 0.25;
function ms() {
  if (!(typeof self > "u"))
    return self.VTTCue || self.TextTrackCue;
}
function di(a, e, t, s, i) {
  let n = new a(e, t, "");
  try {
    n.value = s, i && (n.type = i);
  } catch {
    n = new a(e, t, JSON.stringify(i ? ce({
      type: i
    }, s) : s));
  }
  return n;
}
const ht = (() => {
  const a = ms();
  try {
    a && new a(0, Number.POSITIVE_INFINITY, "");
  } catch {
    return Number.MAX_VALUE;
  }
  return Number.POSITIVE_INFINITY;
})();
function Xt(a, e) {
  return a.getTime() / 1e3 - e;
}
function va(a) {
  return Uint8Array.from(a.replace(/^0x/, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")).buffer;
}
class Ca {
  constructor(e) {
    this.hls = void 0, this.id3Track = null, this.media = null, this.dateRangeCuesAppended = {}, this.hls = e, this._registerListeners();
  }
  destroy() {
    this._unregisterListeners(), this.id3Track = null, this.media = null, this.dateRangeCuesAppended = {}, this.hls = null;
  }
  _registerListeners() {
    const {
      hls: e
    } = this;
    e.on(y.MEDIA_ATTACHED, this.onMediaAttached, this), e.on(y.MEDIA_DETACHING, this.onMediaDetaching, this), e.on(y.MANIFEST_LOADING, this.onManifestLoading, this), e.on(y.FRAG_PARSING_METADATA, this.onFragParsingMetadata, this), e.on(y.BUFFER_FLUSHING, this.onBufferFlushing, this), e.on(y.LEVEL_UPDATED, this.onLevelUpdated, this);
  }
  _unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(y.MEDIA_ATTACHED, this.onMediaAttached, this), e.off(y.MEDIA_DETACHING, this.onMediaDetaching, this), e.off(y.MANIFEST_LOADING, this.onManifestLoading, this), e.off(y.FRAG_PARSING_METADATA, this.onFragParsingMetadata, this), e.off(y.BUFFER_FLUSHING, this.onBufferFlushing, this), e.off(y.LEVEL_UPDATED, this.onLevelUpdated, this);
  }
  // Add ID3 metatadata text track.
  onMediaAttached(e, t) {
    this.media = t.media;
  }
  onMediaDetaching() {
    this.id3Track && (Ye(this.id3Track), this.id3Track = null, this.media = null, this.dateRangeCuesAppended = {});
  }
  onManifestLoading() {
    this.dateRangeCuesAppended = {};
  }
  createTrack(e) {
    const t = this.getID3Track(e.textTracks);
    return t.mode = "hidden", t;
  }
  getID3Track(e) {
    if (this.media) {
      for (let t = 0; t < e.length; t++) {
        const s = e[t];
        if (s.kind === "metadata" && s.label === "id3")
          return gn(s, this.media), s;
      }
      return this.media.addTextTrack("metadata", "id3");
    }
  }
  onFragParsingMetadata(e, t) {
    if (!this.media)
      return;
    const {
      hls: {
        config: {
          enableEmsgMetadataCues: s,
          enableID3MetadataCues: i
        }
      }
    } = this;
    if (!s && !i)
      return;
    const {
      samples: n
    } = t;
    this.id3Track || (this.id3Track = this.createTrack(this.media));
    const r = ms();
    if (r)
      for (let o = 0; o < n.length; o++) {
        const l = n[o].type;
        if (l === Ee.emsg && !s || !i)
          continue;
        const c = an(n[o].data);
        if (c) {
          const h = n[o].pts;
          let u = h + n[o].duration;
          u > ht && (u = ht), u - h <= 0 && (u = h + ya);
          for (let f = 0; f < c.length; f++) {
            const m = c[f];
            if (!rn(m)) {
              this.updateId3CueEnds(h, l);
              const p = di(r, h, u, m, l);
              p && this.id3Track.addCue(p);
            }
          }
        }
      }
  }
  updateId3CueEnds(e, t) {
    var s;
    const i = (s = this.id3Track) == null ? void 0 : s.cues;
    if (i)
      for (let n = i.length; n--; ) {
        const r = i[n];
        r.type === t && r.startTime < e && r.endTime === ht && (r.endTime = e);
      }
  }
  onBufferFlushing(e, {
    startOffset: t,
    endOffset: s,
    type: i
  }) {
    const {
      id3Track: n,
      hls: r
    } = this;
    if (!r)
      return;
    const {
      config: {
        enableEmsgMetadataCues: o,
        enableID3MetadataCues: l
      }
    } = r;
    if (n && (o || l)) {
      let c;
      i === "audio" ? c = (h) => h.type === Ee.audioId3 && l : i === "video" ? c = (h) => h.type === Ee.emsg && o : c = (h) => h.type === Ee.audioId3 && l || h.type === Ee.emsg && o, fs(n, t, s, c);
    }
  }
  onLevelUpdated(e, {
    details: t
  }) {
    if (!this.media || !t.hasProgramDateTime || !this.hls.config.enableDateRangeMetadataCues)
      return;
    const {
      dateRangeCuesAppended: s,
      id3Track: i
    } = this, {
      dateRanges: n
    } = t, r = Object.keys(n);
    if (i) {
      const h = Object.keys(s).filter((u) => !r.includes(u));
      for (let u = h.length; u--; ) {
        const d = h[u];
        Object.keys(s[d].cues).forEach((f) => {
          i.removeCue(s[d].cues[f]);
        }), delete s[d];
      }
    }
    const o = t.fragments[t.fragments.length - 1];
    if (r.length === 0 || !O(o == null ? void 0 : o.programDateTime))
      return;
    this.id3Track || (this.id3Track = this.createTrack(this.media));
    const l = o.programDateTime / 1e3 - o.start, c = ms();
    for (let h = 0; h < r.length; h++) {
      const u = r[h], d = n[u], f = Xt(d.startDate, l), m = s[u], p = (m == null ? void 0 : m.cues) || {};
      let g = (m == null ? void 0 : m.durationKnown) || !1, v = ht;
      const C = d.endDate;
      if (C)
        v = Xt(C, l), g = !0;
      else if (d.endOnNext && !g) {
        const T = r.reduce((x, I) => {
          if (I !== d.id) {
            const L = n[I];
            if (L.class === d.class && L.startDate > d.startDate && (!x || d.startDate < x.startDate))
              return L;
          }
          return x;
        }, null);
        T && (v = Xt(T.startDate, l), g = !0);
      }
      const E = Object.keys(d.attr);
      for (let T = 0; T < E.length; T++) {
        const x = E[T];
        if (!xr(x))
          continue;
        const I = p[x];
        if (I)
          g && !m.durationKnown && (I.endTime = v);
        else if (c) {
          let L = d.attr[x];
          Sr(x) && (L = va(L));
          const w = di(c, f, v, {
            key: x,
            data: L
          }, Ee.dateRange);
          w && (w.id = u, this.id3Track.addCue(w), p[x] = w);
        }
      }
      s[u] = {
        cues: p,
        dateRange: d,
        durationKnown: g
      };
    }
  }
}
class Ta {
  constructor(e) {
    this.hls = void 0, this.config = void 0, this.media = null, this.levelDetails = null, this.currentTime = 0, this.stallCount = 0, this._latency = null, this.timeupdateHandler = () => this.timeupdate(), this.hls = e, this.config = e.config, this.registerListeners();
  }
  get latency() {
    return this._latency || 0;
  }
  get maxLatency() {
    const {
      config: e,
      levelDetails: t
    } = this;
    return e.liveMaxLatencyDuration !== void 0 ? e.liveMaxLatencyDuration : t ? e.liveMaxLatencyDurationCount * t.targetduration : 0;
  }
  get targetLatency() {
    const {
      levelDetails: e
    } = this;
    if (e === null)
      return null;
    const {
      holdBack: t,
      partHoldBack: s,
      targetduration: i
    } = e, {
      liveSyncDuration: n,
      liveSyncDurationCount: r,
      lowLatencyMode: o
    } = this.config, l = this.hls.userConfig;
    let c = o && s || t;
    (l.liveSyncDuration || l.liveSyncDurationCount || c === 0) && (c = n !== void 0 ? n : r * i);
    const h = i, u = 1;
    return c + Math.min(this.stallCount * u, h);
  }
  get liveSyncPosition() {
    const e = this.estimateLiveEdge(), t = this.targetLatency, s = this.levelDetails;
    if (e === null || t === null || s === null)
      return null;
    const i = s.edge, n = e - t - this.edgeStalled, r = i - s.totalduration, o = i - (this.config.lowLatencyMode && s.partTarget || s.targetduration);
    return Math.min(Math.max(r, n), o);
  }
  get drift() {
    const {
      levelDetails: e
    } = this;
    return e === null ? 1 : e.drift;
  }
  get edgeStalled() {
    const {
      levelDetails: e
    } = this;
    if (e === null)
      return 0;
    const t = (this.config.lowLatencyMode && e.partTarget || e.targetduration) * 3;
    return Math.max(e.age - t, 0);
  }
  get forwardBufferLength() {
    const {
      media: e,
      levelDetails: t
    } = this;
    if (!e || !t)
      return 0;
    const s = e.buffered.length;
    return (s ? e.buffered.end(s - 1) : t.edge) - this.currentTime;
  }
  destroy() {
    this.unregisterListeners(), this.onMediaDetaching(), this.levelDetails = null, this.hls = this.timeupdateHandler = null;
  }
  registerListeners() {
    this.hls.on(y.MEDIA_ATTACHED, this.onMediaAttached, this), this.hls.on(y.MEDIA_DETACHING, this.onMediaDetaching, this), this.hls.on(y.MANIFEST_LOADING, this.onManifestLoading, this), this.hls.on(y.LEVEL_UPDATED, this.onLevelUpdated, this), this.hls.on(y.ERROR, this.onError, this);
  }
  unregisterListeners() {
    this.hls.off(y.MEDIA_ATTACHED, this.onMediaAttached, this), this.hls.off(y.MEDIA_DETACHING, this.onMediaDetaching, this), this.hls.off(y.MANIFEST_LOADING, this.onManifestLoading, this), this.hls.off(y.LEVEL_UPDATED, this.onLevelUpdated, this), this.hls.off(y.ERROR, this.onError, this);
  }
  onMediaAttached(e, t) {
    this.media = t.media, this.media.addEventListener("timeupdate", this.timeupdateHandler);
  }
  onMediaDetaching() {
    this.media && (this.media.removeEventListener("timeupdate", this.timeupdateHandler), this.media = null);
  }
  onManifestLoading() {
    this.levelDetails = null, this._latency = null, this.stallCount = 0;
  }
  onLevelUpdated(e, {
    details: t
  }) {
    this.levelDetails = t, t.advanced && this.timeupdate(), !t.live && this.media && this.media.removeEventListener("timeupdate", this.timeupdateHandler);
  }
  onError(e, t) {
    var s;
    t.details === A.BUFFER_STALLED_ERROR && (this.stallCount++, (s = this.levelDetails) != null && s.live && S.warn("[playback-rate-controller]: Stall detected, adjusting target latency"));
  }
  timeupdate() {
    const {
      media: e,
      levelDetails: t
    } = this;
    if (!e || !t)
      return;
    this.currentTime = e.currentTime;
    const s = this.computeLatency();
    if (s === null)
      return;
    this._latency = s;
    const {
      lowLatencyMode: i,
      maxLiveSyncPlaybackRate: n
    } = this.config;
    if (!i || n === 1 || !t.live)
      return;
    const r = this.targetLatency;
    if (r === null)
      return;
    const o = s - r, l = Math.min(this.maxLatency, r + t.targetduration);
    if (o < l && o > 0.05 && this.forwardBufferLength > 1) {
      const h = Math.min(2, Math.max(1, n)), u = Math.round(2 / (1 + Math.exp(-0.75 * o - this.edgeStalled)) * 20) / 20;
      e.playbackRate = Math.min(h, Math.max(1, u));
    } else
      e.playbackRate !== 1 && e.playbackRate !== 0 && (e.playbackRate = 1);
  }
  estimateLiveEdge() {
    const {
      levelDetails: e
    } = this;
    return e === null ? null : e.edge + e.age;
  }
  computeLatency() {
    const e = this.estimateLiveEdge();
    return e === null ? null : e - this.currentTime;
  }
}
const ps = ["NONE", "TYPE-0", "TYPE-1", null];
function Ea(a) {
  return ps.indexOf(a) > -1;
}
const Dt = ["SDR", "PQ", "HLG"];
function xa(a) {
  return !!a && Dt.indexOf(a) > -1;
}
var Tt = {
  No: "",
  Yes: "YES",
  v2: "v2"
};
function fi(a) {
  const {
    canSkipUntil: e,
    canSkipDateRanges: t,
    age: s
  } = a, i = s < e / 2;
  return e && i ? t ? Tt.v2 : Tt.Yes : Tt.No;
}
class mi {
  constructor(e, t, s) {
    this.msn = void 0, this.part = void 0, this.skip = void 0, this.msn = e, this.part = t, this.skip = s;
  }
  addDirectives(e) {
    const t = new self.URL(e);
    return this.msn !== void 0 && t.searchParams.set("_HLS_msn", this.msn.toString()), this.part !== void 0 && t.searchParams.set("_HLS_part", this.part.toString()), this.skip && t.searchParams.set("_HLS_skip", this.skip), t.href;
  }
}
class Xe {
  constructor(e) {
    this._attrs = void 0, this.audioCodec = void 0, this.bitrate = void 0, this.codecSet = void 0, this.url = void 0, this.frameRate = void 0, this.height = void 0, this.id = void 0, this.name = void 0, this.videoCodec = void 0, this.width = void 0, this.details = void 0, this.fragmentError = 0, this.loadError = 0, this.loaded = void 0, this.realBitrate = 0, this.supportedPromise = void 0, this.supportedResult = void 0, this._avgBitrate = 0, this._audioGroups = void 0, this._subtitleGroups = void 0, this._urlId = 0, this.url = [e.url], this._attrs = [e.attrs], this.bitrate = e.bitrate, e.details && (this.details = e.details), this.id = e.id || 0, this.name = e.name, this.width = e.width || 0, this.height = e.height || 0, this.frameRate = e.attrs.optionalFloat("FRAME-RATE", 0), this._avgBitrate = e.attrs.decimalInteger("AVERAGE-BANDWIDTH"), this.audioCodec = e.audioCodec, this.videoCodec = e.videoCodec, this.codecSet = [e.videoCodec, e.audioCodec].filter((t) => !!t).map((t) => t.substring(0, 4)).join(","), this.addGroupId("audio", e.attrs.AUDIO), this.addGroupId("text", e.attrs.SUBTITLES);
  }
  get maxBitrate() {
    return Math.max(this.realBitrate, this.bitrate);
  }
  get averageBitrate() {
    return this._avgBitrate || this.realBitrate || this.bitrate;
  }
  get attrs() {
    return this._attrs[0];
  }
  get codecs() {
    return this.attrs.CODECS || "";
  }
  get pathwayId() {
    return this.attrs["PATHWAY-ID"] || ".";
  }
  get videoRange() {
    return this.attrs["VIDEO-RANGE"] || "SDR";
  }
  get score() {
    return this.attrs.optionalFloat("SCORE", 0);
  }
  get uri() {
    return this.url[0] || "";
  }
  hasAudioGroup(e) {
    return pi(this._audioGroups, e);
  }
  hasSubtitleGroup(e) {
    return pi(this._subtitleGroups, e);
  }
  get audioGroups() {
    return this._audioGroups;
  }
  get subtitleGroups() {
    return this._subtitleGroups;
  }
  addGroupId(e, t) {
    if (t) {
      if (e === "audio") {
        let s = this._audioGroups;
        s || (s = this._audioGroups = []), s.indexOf(t) === -1 && s.push(t);
      } else if (e === "text") {
        let s = this._subtitleGroups;
        s || (s = this._subtitleGroups = []), s.indexOf(t) === -1 && s.push(t);
      }
    }
  }
  // Deprecated methods (retained for backwards compatibility)
  get urlId() {
    return 0;
  }
  set urlId(e) {
  }
  get audioGroupIds() {
    return this.audioGroups ? [this.audioGroupId] : void 0;
  }
  get textGroupIds() {
    return this.subtitleGroups ? [this.textGroupId] : void 0;
  }
  get audioGroupId() {
    var e;
    return (e = this.audioGroups) == null ? void 0 : e[0];
  }
  get textGroupId() {
    var e;
    return (e = this.subtitleGroups) == null ? void 0 : e[0];
  }
  addFallback() {
  }
}
function pi(a, e) {
  return !e || !a ? !1 : a.indexOf(e) !== -1;
}
function Qt(a, e) {
  const t = e.startPTS;
  if (O(t)) {
    let s = 0, i;
    e.sn > a.sn ? (s = t - a.start, i = a) : (s = a.start - t, i = e), i.duration !== s && (i.duration = s);
  } else
    e.sn > a.sn ? a.cc === e.cc && a.minEndPTS ? e.start = a.start + (a.minEndPTS - a.start) : e.start = a.start + a.duration : e.start = Math.max(a.start - e.duration, 0);
}
function vn(a, e, t, s, i, n) {
  s - t <= 0 && (S.warn("Fragment should have a positive duration", e), s = t + e.duration, n = i + e.duration);
  let o = t, l = s;
  const c = e.startPTS, h = e.endPTS;
  if (O(c)) {
    const g = Math.abs(c - t);
    O(e.deltaPTS) ? e.deltaPTS = Math.max(g, e.deltaPTS) : e.deltaPTS = g, o = Math.max(t, c), t = Math.min(t, c), i = Math.min(i, e.startDTS), l = Math.min(s, h), s = Math.max(s, h), n = Math.max(n, e.endDTS);
  }
  const u = t - e.start;
  e.start !== 0 && (e.start = t), e.duration = s - e.start, e.startPTS = t, e.maxStartPTS = o, e.startDTS = i, e.endPTS = s, e.minEndPTS = l, e.endDTS = n;
  const d = e.sn;
  if (!a || d < a.startSN || d > a.endSN)
    return 0;
  let f;
  const m = d - a.startSN, p = a.fragments;
  for (p[m] = e, f = m; f > 0; f--)
    Qt(p[f], p[f - 1]);
  for (f = m; f < p.length - 1; f++)
    Qt(p[f], p[f + 1]);
  return a.fragmentHint && Qt(p[p.length - 1], a.fragmentHint), a.PTSKnown = a.alignedSliding = !0, u;
}
function Sa(a, e) {
  let t = null;
  const s = a.fragments;
  for (let l = s.length - 1; l >= 0; l--) {
    const c = s[l].initSegment;
    if (c) {
      t = c;
      break;
    }
  }
  a.fragmentHint && delete a.fragmentHint.endPTS;
  let i = 0, n;
  if (Aa(a, e, (l, c) => {
    l.relurl && (i = l.cc - c.cc), O(l.startPTS) && O(l.endPTS) && (c.start = c.startPTS = l.startPTS, c.startDTS = l.startDTS, c.maxStartPTS = l.maxStartPTS, c.endPTS = l.endPTS, c.endDTS = l.endDTS, c.minEndPTS = l.minEndPTS, c.duration = l.endPTS - l.startPTS, c.duration && (n = c), e.PTSKnown = e.alignedSliding = !0), c.elementaryStreams = l.elementaryStreams, c.loader = l.loader, c.stats = l.stats, l.initSegment && (c.initSegment = l.initSegment, t = l.initSegment);
  }), t && (e.fragmentHint ? e.fragments.concat(e.fragmentHint) : e.fragments).forEach((c) => {
    var h;
    c && (!c.initSegment || c.initSegment.relurl === ((h = t) == null ? void 0 : h.relurl)) && (c.initSegment = t);
  }), e.skippedSegments)
    if (e.deltaUpdateFailed = e.fragments.some((l) => !l), e.deltaUpdateFailed) {
      S.warn("[level-helper] Previous playlist missing segments skipped in delta playlist");
      for (let l = e.skippedSegments; l--; )
        e.fragments.shift();
      e.startSN = e.fragments[0].sn, e.startCC = e.fragments[0].cc;
    } else
      e.canSkipDateRanges && (e.dateRanges = ba(a.dateRanges, e.dateRanges, e.recentlyRemovedDateranges));
  const r = e.fragments;
  if (i) {
    S.warn("discontinuity sliding from playlist, take drift into account");
    for (let l = 0; l < r.length; l++)
      r[l].cc += i;
  }
  e.skippedSegments && (e.startCC = e.fragments[0].cc), La(a.partList, e.partList, (l, c) => {
    c.elementaryStreams = l.elementaryStreams, c.stats = l.stats;
  }), n ? vn(e, n, n.startPTS, n.endPTS, n.startDTS, n.endDTS) : Cn(a, e), r.length && (e.totalduration = e.edge - r[0].start), e.driftStartTime = a.driftStartTime, e.driftStart = a.driftStart;
  const o = e.advancedDateTime;
  if (e.advanced && o) {
    const l = e.edge;
    e.driftStart || (e.driftStartTime = o, e.driftStart = l), e.driftEndTime = o, e.driftEnd = l;
  } else
    e.driftEndTime = a.driftEndTime, e.driftEnd = a.driftEnd, e.advancedDateTime = a.advancedDateTime;
}
function ba(a, e, t) {
  const s = ne({}, a);
  return t && t.forEach((i) => {
    delete s[i];
  }), Object.keys(e).forEach((i) => {
    const n = new Ji(e[i].attr, s[i]);
    n.isValid ? s[i] = n : S.warn(`Ignoring invalid Playlist Delta Update DATERANGE tag: "${JSON.stringify(e[i].attr)}"`);
  }), s;
}
function La(a, e, t) {
  if (a && e) {
    let s = 0;
    for (let i = 0, n = a.length; i <= n; i++) {
      const r = a[i], o = e[i + s];
      r && o && r.index === o.index && r.fragment.sn === o.fragment.sn ? t(r, o) : s--;
    }
  }
}
function Aa(a, e, t) {
  const s = e.skippedSegments, i = Math.max(a.startSN, e.startSN) - e.startSN, n = (a.fragmentHint ? 1 : 0) + (s ? e.endSN : Math.min(a.endSN, e.endSN)) - e.startSN, r = e.startSN - a.startSN, o = e.fragmentHint ? e.fragments.concat(e.fragmentHint) : e.fragments, l = a.fragmentHint ? a.fragments.concat(a.fragmentHint) : a.fragments;
  for (let c = i; c <= n; c++) {
    const h = l[r + c];
    let u = o[c];
    s && !u && c < s && (u = e.fragments[c] = h), h && u && t(h, u);
  }
}
function Cn(a, e) {
  const t = e.startSN + e.skippedSegments - a.startSN, s = a.fragments;
  t < 0 || t >= s.length || gs(e, s[t].start);
}
function gs(a, e) {
  if (e) {
    const t = a.fragments;
    for (let s = a.skippedSegments; s < t.length; s++)
      t[s].start += e;
    a.fragmentHint && (a.fragmentHint.start += e);
  }
}
function wa(a, e = 1 / 0) {
  let t = 1e3 * a.targetduration;
  if (a.updated) {
    const s = a.fragments, i = 4;
    if (s.length && t * i > e) {
      const n = s[s.length - 1].duration * 1e3;
      n < t && (t = n);
    }
  } else
    t /= 2;
  return Math.round(t);
}
function Ia(a, e, t) {
  if (!(a != null && a.details))
    return null;
  const s = a.details;
  let i = s.fragments[e - s.startSN];
  return i || (i = s.fragmentHint, i && i.sn === e) ? i : e < s.startSN && t && t.sn === e ? t : null;
}
function gi(a, e, t) {
  var s;
  return a != null && a.details ? Tn((s = a.details) == null ? void 0 : s.partList, e, t) : null;
}
function Tn(a, e, t) {
  if (a)
    for (let s = a.length; s--; ) {
      const i = a[s];
      if (i.index === t && i.fragment.sn === e)
        return i;
    }
  return null;
}
function En(a) {
  a.forEach((e, t) => {
    const {
      details: s
    } = e;
    s != null && s.fragments && s.fragments.forEach((i) => {
      i.level = t;
    });
  });
}
function Mt(a) {
  switch (a.details) {
    case A.FRAG_LOAD_TIMEOUT:
    case A.KEY_LOAD_TIMEOUT:
    case A.LEVEL_LOAD_TIMEOUT:
    case A.MANIFEST_LOAD_TIMEOUT:
      return !0;
  }
  return !1;
}
function yi(a, e) {
  const t = Mt(e);
  return a.default[`${t ? "timeout" : "error"}Retry`];
}
function Rs(a, e) {
  const t = a.backoff === "linear" ? 1 : Math.pow(2, e);
  return Math.min(t * a.retryDelayMs, a.maxRetryDelayMs);
}
function vi(a) {
  return ce(ce({}, a), {
    errorRetry: null,
    timeoutRetry: null
  });
}
function Pt(a, e, t, s) {
  if (!a)
    return !1;
  const i = s == null ? void 0 : s.code, n = e < a.maxNumRetry && (Ra(i) || !!t);
  return a.shouldRetry ? a.shouldRetry(a, e, t, s, n) : n;
}
function Ra(a) {
  return a === 0 && navigator.onLine === !1 || !!a && (a < 400 || a > 499);
}
const xn = {
  /**
   * Searches for an item in an array which matches a certain condition.
   * This requires the condition to only match one item in the array,
   * and for the array to be ordered.
   *
   * @param list The array to search.
   * @param comparisonFn
   *      Called and provided a candidate item as the first argument.
   *      Should return:
   *          > -1 if the item should be located at a lower index than the provided item.
   *          > 1 if the item should be located at a higher index than the provided item.
   *          > 0 if the item is the item you're looking for.
   *
   * @returns the object if found, otherwise returns null
   */
  search: function(a, e) {
    let t = 0, s = a.length - 1, i = null, n = null;
    for (; t <= s; ) {
      i = (t + s) / 2 | 0, n = a[i];
      const r = e(n);
      if (r > 0)
        t = i + 1;
      else if (r < 0)
        s = i - 1;
      else
        return n;
    }
    return null;
  }
};
function ka(a, e, t) {
  if (e === null || !Array.isArray(a) || !a.length || !O(e))
    return null;
  const s = a[0].programDateTime;
  if (e < (s || 0))
    return null;
  const i = a[a.length - 1].endProgramDateTime;
  if (e >= (i || 0))
    return null;
  t = t || 0;
  for (let n = 0; n < a.length; ++n) {
    const r = a[n];
    if (Ma(e, t, r))
      return r;
  }
  return null;
}
function Ft(a, e, t = 0, s = 0, i = 5e-3) {
  let n = null;
  if (a) {
    n = e[a.sn - e[0].sn + 1] || null;
    const o = a.endDTS - t;
    o > 0 && o < 15e-7 && (t += 15e-7);
  } else
    t === 0 && e[0].start === 0 && (n = e[0]);
  if (n && ((!a || a.level === n.level) && ys(t, s, n) === 0 || Da(n, a, Math.min(i, s))))
    return n;
  const r = xn.search(e, ys.bind(null, t, s));
  return r && (r !== a || !n) ? r : n;
}
function Da(a, e, t) {
  if (e && e.start === 0 && e.level < a.level && (e.endPTS || 0) > 0) {
    const s = e.tagList.reduce((i, n) => (n[0] === "INF" && (i += parseFloat(n[1])), i), t);
    return a.start <= s;
  }
  return !1;
}
function ys(a = 0, e = 0, t) {
  if (t.start <= a && t.start + t.duration > a)
    return 0;
  const s = Math.min(e, t.duration + (t.deltaPTS ? t.deltaPTS : 0));
  return t.start + t.duration - s <= a ? 1 : t.start - s > a && t.start ? -1 : 0;
}
function Ma(a, e, t) {
  const s = Math.min(e, t.duration + (t.deltaPTS ? t.deltaPTS : 0)) * 1e3;
  return (t.endProgramDateTime || 0) - s > a;
}
function Pa(a, e) {
  return xn.search(a, (t) => t.cc < e ? 1 : t.cc > e ? -1 : 0);
}
var ue = {
  DoNothing: 0,
  SendEndCallback: 1,
  SendAlternateToPenaltyBox: 2,
  RemoveAlternatePermanently: 3,
  InsertDiscontinuity: 4,
  RetryRequest: 5
}, Ce = {
  None: 0,
  MoveAllAlternatesMatchingHost: 1,
  MoveAllAlternatesMatchingHDCP: 2,
  SwitchToSDR: 4
};
class Fa {
  constructor(e) {
    this.hls = void 0, this.playlistError = 0, this.penalizedRenditions = {}, this.log = void 0, this.warn = void 0, this.error = void 0, this.hls = e, this.log = S.log.bind(S, "[info]:"), this.warn = S.warn.bind(S, "[warning]:"), this.error = S.error.bind(S, "[error]:"), this.registerListeners();
  }
  registerListeners() {
    const e = this.hls;
    e.on(y.ERROR, this.onError, this), e.on(y.MANIFEST_LOADING, this.onManifestLoading, this), e.on(y.LEVEL_UPDATED, this.onLevelUpdated, this);
  }
  unregisterListeners() {
    const e = this.hls;
    e && (e.off(y.ERROR, this.onError, this), e.off(y.ERROR, this.onErrorOut, this), e.off(y.MANIFEST_LOADING, this.onManifestLoading, this), e.off(y.LEVEL_UPDATED, this.onLevelUpdated, this));
  }
  destroy() {
    this.unregisterListeners(), this.hls = null, this.penalizedRenditions = {};
  }
  startLoad(e) {
  }
  stopLoad() {
    this.playlistError = 0;
  }
  getVariantLevelIndex(e) {
    return (e == null ? void 0 : e.type) === H.MAIN ? e.level : this.hls.loadLevel;
  }
  onManifestLoading() {
    this.playlistError = 0, this.penalizedRenditions = {};
  }
  onLevelUpdated() {
    this.playlistError = 0;
  }
  onError(e, t) {
    var s, i;
    if (t.fatal)
      return;
    const n = this.hls, r = t.context;
    switch (t.details) {
      case A.FRAG_LOAD_ERROR:
      case A.FRAG_LOAD_TIMEOUT:
      case A.KEY_LOAD_ERROR:
      case A.KEY_LOAD_TIMEOUT:
        t.errorAction = this.getFragRetryOrSwitchAction(t);
        return;
      case A.FRAG_PARSING_ERROR:
        if ((s = t.frag) != null && s.gap) {
          t.errorAction = {
            action: ue.DoNothing,
            flags: Ce.None
          };
          return;
        }
      case A.FRAG_GAP:
      case A.FRAG_DECRYPT_ERROR: {
        t.errorAction = this.getFragRetryOrSwitchAction(t), t.errorAction.action = ue.SendAlternateToPenaltyBox;
        return;
      }
      case A.LEVEL_EMPTY_ERROR:
      case A.LEVEL_PARSING_ERROR:
        {
          var o, l;
          const c = t.parent === H.MAIN ? t.level : n.loadLevel;
          t.details === A.LEVEL_EMPTY_ERROR && ((o = t.context) != null && (l = o.levelDetails) != null && l.live) ? t.errorAction = this.getPlaylistRetryOrSwitchAction(t, c) : (t.levelRetry = !1, t.errorAction = this.getLevelSwitchAction(t, c));
        }
        return;
      case A.LEVEL_LOAD_ERROR:
      case A.LEVEL_LOAD_TIMEOUT:
        typeof (r == null ? void 0 : r.level) == "number" && (t.errorAction = this.getPlaylistRetryOrSwitchAction(t, r.level));
        return;
      case A.AUDIO_TRACK_LOAD_ERROR:
      case A.AUDIO_TRACK_LOAD_TIMEOUT:
      case A.SUBTITLE_LOAD_ERROR:
      case A.SUBTITLE_TRACK_LOAD_TIMEOUT:
        if (r) {
          const c = n.levels[n.loadLevel];
          if (c && (r.type === Y.AUDIO_TRACK && c.hasAudioGroup(r.groupId) || r.type === Y.SUBTITLE_TRACK && c.hasSubtitleGroup(r.groupId))) {
            t.errorAction = this.getPlaylistRetryOrSwitchAction(t, n.loadLevel), t.errorAction.action = ue.SendAlternateToPenaltyBox, t.errorAction.flags = Ce.MoveAllAlternatesMatchingHost;
            return;
          }
        }
        return;
      case A.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED:
        {
          const c = n.levels[n.loadLevel], h = c == null ? void 0 : c.attrs["HDCP-LEVEL"];
          h ? t.errorAction = {
            action: ue.SendAlternateToPenaltyBox,
            flags: Ce.MoveAllAlternatesMatchingHDCP,
            hdcpLevel: h
          } : this.keySystemError(t);
        }
        return;
      case A.BUFFER_ADD_CODEC_ERROR:
      case A.REMUX_ALLOC_ERROR:
      case A.BUFFER_APPEND_ERROR:
        t.errorAction = this.getLevelSwitchAction(t, (i = t.level) != null ? i : n.loadLevel);
        return;
      case A.INTERNAL_EXCEPTION:
      case A.BUFFER_APPENDING_ERROR:
      case A.BUFFER_FULL_ERROR:
      case A.LEVEL_SWITCH_ERROR:
      case A.BUFFER_STALLED_ERROR:
      case A.BUFFER_SEEK_OVER_HOLE:
      case A.BUFFER_NUDGE_ON_STALL:
        t.errorAction = {
          action: ue.DoNothing,
          flags: Ce.None
        };
        return;
    }
    t.type === K.KEY_SYSTEM_ERROR && this.keySystemError(t);
  }
  keySystemError(e) {
    const t = this.getVariantLevelIndex(e.frag);
    e.levelRetry = !1, e.errorAction = this.getLevelSwitchAction(e, t);
  }
  getPlaylistRetryOrSwitchAction(e, t) {
    const s = this.hls, i = yi(s.config.playlistLoadPolicy, e), n = this.playlistError++;
    if (Pt(i, n, Mt(e), e.response))
      return {
        action: ue.RetryRequest,
        flags: Ce.None,
        retryConfig: i,
        retryCount: n
      };
    const o = this.getLevelSwitchAction(e, t);
    return i && (o.retryConfig = i, o.retryCount = n), o;
  }
  getFragRetryOrSwitchAction(e) {
    const t = this.hls, s = this.getVariantLevelIndex(e.frag), i = t.levels[s], {
      fragLoadPolicy: n,
      keyLoadPolicy: r
    } = t.config, o = yi(e.details.startsWith("key") ? r : n, e), l = t.levels.reduce((h, u) => h + u.fragmentError, 0);
    if (i && (e.details !== A.FRAG_GAP && i.fragmentError++, Pt(o, l, Mt(e), e.response)))
      return {
        action: ue.RetryRequest,
        flags: Ce.None,
        retryConfig: o,
        retryCount: l
      };
    const c = this.getLevelSwitchAction(e, s);
    return o && (c.retryConfig = o, c.retryCount = l), c;
  }
  getLevelSwitchAction(e, t) {
    const s = this.hls;
    t == null && (t = s.loadLevel);
    const i = this.hls.levels[t];
    if (i) {
      var n, r;
      const c = e.details;
      i.loadError++, c === A.BUFFER_APPEND_ERROR && i.fragmentError++;
      let h = -1;
      const {
        levels: u,
        loadLevel: d,
        minAutoLevel: f,
        maxAutoLevel: m
      } = s;
      s.autoLevelEnabled || (s.loadLevel = -1);
      const p = (n = e.frag) == null ? void 0 : n.type, v = (p === H.AUDIO && c === A.FRAG_PARSING_ERROR || e.sourceBufferName === "audio" && (c === A.BUFFER_ADD_CODEC_ERROR || c === A.BUFFER_APPEND_ERROR)) && u.some(({
        audioCodec: I
      }) => i.audioCodec !== I), E = e.sourceBufferName === "video" && (c === A.BUFFER_ADD_CODEC_ERROR || c === A.BUFFER_APPEND_ERROR) && u.some(({
        codecSet: I,
        audioCodec: L
      }) => i.codecSet !== I && i.audioCodec === L), {
        type: T,
        groupId: x
      } = (r = e.context) != null ? r : {};
      for (let I = u.length; I--; ) {
        const L = (I + d) % u.length;
        if (L !== d && L >= f && L <= m && u[L].loadError === 0) {
          var o, l;
          const w = u[L];
          if (c === A.FRAG_GAP && p === H.MAIN && e.frag) {
            const R = u[L].details;
            if (R) {
              const k = Ft(e.frag, R.fragments, e.frag.start);
              if (k != null && k.gap)
                continue;
            }
          } else {
            if (T === Y.AUDIO_TRACK && w.hasAudioGroup(x) || T === Y.SUBTITLE_TRACK && w.hasSubtitleGroup(x))
              continue;
            if (p === H.AUDIO && (o = i.audioGroups) != null && o.some((R) => w.hasAudioGroup(R)) || p === H.SUBTITLE && (l = i.subtitleGroups) != null && l.some((R) => w.hasSubtitleGroup(R)) || v && i.audioCodec === w.audioCodec || !v && i.audioCodec !== w.audioCodec || E && i.codecSet === w.codecSet)
              continue;
          }
          h = L;
          break;
        }
      }
      if (h > -1 && s.loadLevel !== h)
        return e.levelRetry = !0, this.playlistError = 0, {
          action: ue.SendAlternateToPenaltyBox,
          flags: Ce.None,
          nextAutoLevel: h
        };
    }
    return {
      action: ue.SendAlternateToPenaltyBox,
      flags: Ce.MoveAllAlternatesMatchingHost
    };
  }
  onErrorOut(e, t) {
    var s;
    switch ((s = t.errorAction) == null ? void 0 : s.action) {
      case ue.DoNothing:
        break;
      case ue.SendAlternateToPenaltyBox:
        this.sendAlternateToPenaltyBox(t), !t.errorAction.resolved && t.details !== A.FRAG_GAP ? t.fatal = !0 : /MediaSource readyState: ended/.test(t.error.message) && (this.warn(`MediaSource ended after "${t.sourceBufferName}" sourceBuffer append error. Attempting to recover from media error.`), this.hls.recoverMediaError());
        break;
    }
    if (t.fatal) {
      this.hls.stopLoad();
      return;
    }
  }
  sendAlternateToPenaltyBox(e) {
    const t = this.hls, s = e.errorAction;
    if (!s)
      return;
    const {
      flags: i,
      hdcpLevel: n,
      nextAutoLevel: r
    } = s;
    switch (i) {
      case Ce.None:
        this.switchLevel(e, r);
        break;
      case Ce.MoveAllAlternatesMatchingHDCP:
        n && (t.maxHdcpLevel = ps[ps.indexOf(n) - 1], s.resolved = !0), this.warn(`Restricting playback to HDCP-LEVEL of "${t.maxHdcpLevel}" or lower`);
        break;
    }
    s.resolved || this.switchLevel(e, r);
  }
  switchLevel(e, t) {
    t !== void 0 && e.errorAction && (this.warn(`switching to level ${t} after ${e.details}`), this.hls.nextAutoLevel = t, e.errorAction.resolved = !0, this.hls.nextLoadLevel = this.hls.nextAutoLevel);
  }
}
class ks {
  constructor(e, t) {
    this.hls = void 0, this.timer = -1, this.requestScheduled = -1, this.canLoad = !1, this.log = void 0, this.warn = void 0, this.log = S.log.bind(S, `${t}:`), this.warn = S.warn.bind(S, `${t}:`), this.hls = e;
  }
  destroy() {
    this.clearTimer(), this.hls = this.log = this.warn = null;
  }
  clearTimer() {
    this.timer !== -1 && (self.clearTimeout(this.timer), this.timer = -1);
  }
  startLoad() {
    this.canLoad = !0, this.requestScheduled = -1, this.loadPlaylist();
  }
  stopLoad() {
    this.canLoad = !1, this.clearTimer();
  }
  switchParams(e, t, s) {
    const i = t == null ? void 0 : t.renditionReports;
    if (i) {
      let n = -1;
      for (let r = 0; r < i.length; r++) {
        const o = i[r];
        let l;
        try {
          l = new self.URL(o.URI, t.url).href;
        } catch (c) {
          S.warn(`Could not construct new URL for Rendition Report: ${c}`), l = o.URI || "";
        }
        if (l === e) {
          n = r;
          break;
        } else
          l === e.substring(0, l.length) && (n = r);
      }
      if (n !== -1) {
        const r = i[n], o = parseInt(r["LAST-MSN"]) || (t == null ? void 0 : t.lastPartSn);
        let l = parseInt(r["LAST-PART"]) || (t == null ? void 0 : t.lastPartIndex);
        if (this.hls.config.lowLatencyMode) {
          const h = Math.min(t.age - t.partTarget, t.targetduration);
          l >= 0 && h > t.partTarget && (l += 1);
        }
        const c = s && fi(s);
        return new mi(o, l >= 0 ? l : void 0, c);
      }
    }
  }
  loadPlaylist(e) {
    this.requestScheduled === -1 && (this.requestScheduled = self.performance.now());
  }
  shouldLoadPlaylist(e) {
    return this.canLoad && !!e && !!e.url && (!e.details || e.details.live);
  }
  shouldReloadPlaylist(e) {
    return this.timer === -1 && this.requestScheduled === -1 && this.shouldLoadPlaylist(e);
  }
  playlistLoaded(e, t, s) {
    const {
      details: i,
      stats: n
    } = t, r = self.performance.now(), o = n.loading.first ? Math.max(0, r - n.loading.first) : 0;
    if (i.advancedDateTime = Date.now() - o, i.live || s != null && s.live) {
      if (i.reloaded(s), s && this.log(`live playlist ${e} ${i.advanced ? "REFRESHED " + i.lastPartSn + "-" + i.lastPartIndex : i.updated ? "UPDATED" : "MISSED"}`), s && i.fragments.length > 0 && Sa(s, i), !this.canLoad || !i.live)
        return;
      let l, c, h;
      if (i.canBlockReload && i.endSN && i.advanced) {
        const g = this.hls.config.lowLatencyMode, v = i.lastPartSn, C = i.endSN, E = i.lastPartIndex, T = E !== -1, x = v === C, I = g ? 0 : E;
        T ? (c = x ? C + 1 : v, h = x ? I : E + 1) : c = C + 1;
        const L = i.age, w = L + i.ageHeader;
        let R = Math.min(w - i.partTarget, i.targetduration * 1.5);
        if (R > 0) {
          if (s && R > s.tuneInGoal)
            this.warn(`CDN Tune-in goal increased from: ${s.tuneInGoal} to: ${R} with playlist age: ${i.age}`), R = 0;
          else {
            const k = Math.floor(R / i.targetduration);
            if (c += k, h !== void 0) {
              const M = Math.round(R % i.targetduration / i.partTarget);
              h += M;
            }
            this.log(`CDN Tune-in age: ${i.ageHeader}s last advanced ${L.toFixed(2)}s goal: ${R} skip sn ${k} to part ${h}`);
          }
          i.tuneInGoal = R;
        }
        if (l = this.getDeliveryDirectives(i, t.deliveryDirectives, c, h), g || !x) {
          this.loadPlaylist(l);
          return;
        }
      } else
        (i.canBlockReload || i.canSkipUntil) && (l = this.getDeliveryDirectives(i, t.deliveryDirectives, c, h));
      const u = this.hls.mainForwardBufferInfo, d = u ? u.end - u.len : 0, f = (i.edge - d) * 1e3, m = wa(i, f);
      i.updated && r > this.requestScheduled + m && (this.requestScheduled = n.loading.start), c !== void 0 && i.canBlockReload ? this.requestScheduled = n.loading.first + m - (i.partTarget * 1e3 || 1e3) : this.requestScheduled === -1 || this.requestScheduled + m < r ? this.requestScheduled = r : this.requestScheduled - r <= 0 && (this.requestScheduled += m);
      let p = this.requestScheduled - r;
      p = Math.max(0, p), this.log(`reload live playlist ${e} in ${Math.round(p)} ms`), this.timer = self.setTimeout(() => this.loadPlaylist(l), p);
    } else
      this.clearTimer();
  }
  getDeliveryDirectives(e, t, s, i) {
    let n = fi(e);
    return t != null && t.skip && e.deltaUpdateFailed && (s = t.msn, i = t.part, n = Tt.No), new mi(s, i, n);
  }
  checkRetry(e) {
    const t = e.details, s = Mt(e), i = e.errorAction, {
      action: n,
      retryCount: r = 0,
      retryConfig: o
    } = i || {}, l = !!i && !!o && (n === ue.RetryRequest || !i.resolved && n === ue.SendAlternateToPenaltyBox);
    if (l) {
      var c;
      if (this.requestScheduled = -1, r >= o.maxNumRetry)
        return !1;
      if (s && (c = e.context) != null && c.deliveryDirectives)
        this.warn(`Retrying playlist loading ${r + 1}/${o.maxNumRetry} after "${t}" without delivery-directives`), this.loadPlaylist();
      else {
        const h = Rs(o, r);
        this.timer = self.setTimeout(() => this.loadPlaylist(), h), this.warn(`Retrying playlist loading ${r + 1}/${o.maxNumRetry} after "${t}" in ${h}ms`);
      }
      e.levelRetry = !0, i.resolved = !0;
    }
    return l;
  }
}
class He {
  //  About half of the estimated value will be from the last |halfLife| samples by weight.
  constructor(e, t = 0, s = 0) {
    this.halfLife = void 0, this.alpha_ = void 0, this.estimate_ = void 0, this.totalWeight_ = void 0, this.halfLife = e, this.alpha_ = e ? Math.exp(Math.log(0.5) / e) : 0, this.estimate_ = t, this.totalWeight_ = s;
  }
  sample(e, t) {
    const s = Math.pow(this.alpha_, e);
    this.estimate_ = t * (1 - s) + s * this.estimate_, this.totalWeight_ += e;
  }
  getTotalWeight() {
    return this.totalWeight_;
  }
  getEstimate() {
    if (this.alpha_) {
      const e = 1 - Math.pow(this.alpha_, this.totalWeight_);
      if (e)
        return this.estimate_ / e;
    }
    return this.estimate_;
  }
}
class _a {
  constructor(e, t, s, i = 100) {
    this.defaultEstimate_ = void 0, this.minWeight_ = void 0, this.minDelayMs_ = void 0, this.slow_ = void 0, this.fast_ = void 0, this.defaultTTFB_ = void 0, this.ttfb_ = void 0, this.defaultEstimate_ = s, this.minWeight_ = 1e-3, this.minDelayMs_ = 50, this.slow_ = new He(e), this.fast_ = new He(t), this.defaultTTFB_ = i, this.ttfb_ = new He(e);
  }
  update(e, t) {
    const {
      slow_: s,
      fast_: i,
      ttfb_: n
    } = this;
    s.halfLife !== e && (this.slow_ = new He(e, s.getEstimate(), s.getTotalWeight())), i.halfLife !== t && (this.fast_ = new He(t, i.getEstimate(), i.getTotalWeight())), n.halfLife !== e && (this.ttfb_ = new He(e, n.getEstimate(), n.getTotalWeight()));
  }
  sample(e, t) {
    e = Math.max(e, this.minDelayMs_);
    const s = 8 * t, i = e / 1e3, n = s / i;
    this.fast_.sample(i, n), this.slow_.sample(i, n);
  }
  sampleTTFB(e) {
    const t = e / 1e3, s = Math.sqrt(2) * Math.exp(-Math.pow(t, 2) / 2);
    this.ttfb_.sample(s, Math.max(e, 5));
  }
  canEstimate() {
    return this.fast_.getTotalWeight() >= this.minWeight_;
  }
  getEstimate() {
    return this.canEstimate() ? Math.min(this.fast_.getEstimate(), this.slow_.getEstimate()) : this.defaultEstimate_;
  }
  getEstimateTTFB() {
    return this.ttfb_.getTotalWeight() >= this.minWeight_ ? this.ttfb_.getEstimate() : this.defaultTTFB_;
  }
  destroy() {
  }
}
const Sn = {
  supported: !0,
  configurations: [],
  decodingInfoResults: [{
    supported: !0,
    powerEfficient: !0,
    smooth: !0
  }]
}, Ci = {};
function Oa(a, e, t, s, i, n) {
  const r = a.audioCodec ? a.audioGroups : null, o = n == null ? void 0 : n.audioCodec, l = n == null ? void 0 : n.channels, c = l ? parseInt(l) : o ? 1 / 0 : 2;
  let h = null;
  if (r != null && r.length)
    try {
      r.length === 1 && r[0] ? h = e.groups[r[0]].channels : h = r.reduce((u, d) => {
        if (d) {
          const f = e.groups[d];
          if (!f)
            throw new Error(`Audio track group ${d} not found`);
          Object.keys(f.channels).forEach((m) => {
            u[m] = (u[m] || 0) + f.channels[m];
          });
        }
        return u;
      }, {
        2: 0
      });
    } catch {
      return !0;
    }
  return a.videoCodec !== void 0 && (a.width > 1920 && a.height > 1088 || a.height > 1920 && a.width > 1088 || a.frameRate > Math.max(s, 30) || a.videoRange !== "SDR" && a.videoRange !== t || a.bitrate > Math.max(i, 8e6)) || !!h && O(c) && Object.keys(h).some((u) => parseInt(u) > c);
}
function Na(a, e, t) {
  const s = a.videoCodec, i = a.audioCodec;
  if (!s || !i || !t)
    return Promise.resolve(Sn);
  const n = {
    width: a.width,
    height: a.height,
    bitrate: Math.ceil(Math.max(a.bitrate * 0.9, a.averageBitrate)),
    // Assume a framerate of 30fps since MediaCapabilities will not accept Level default of 0.
    framerate: a.frameRate || 30
  }, r = a.videoRange;
  r !== "SDR" && (n.transferFunction = r.toLowerCase());
  const o = s.split(",").map((l) => ({
    type: "media-source",
    video: ce(ce({}, n), {}, {
      contentType: at(l, "video")
    })
  }));
  return i && a.audioGroups && a.audioGroups.forEach((l) => {
    var c;
    l && ((c = e.groups[l]) == null || c.tracks.forEach((h) => {
      if (h.groupId === l) {
        const u = h.channels || "", d = parseFloat(u);
        O(d) && d > 2 && o.push.apply(o, i.split(",").map((f) => ({
          type: "media-source",
          audio: {
            contentType: at(f, "audio"),
            channels: "" + d
            // spatialRendering:
            //   audioCodec === 'ec-3' && channels.indexOf('JOC'),
          }
        })));
      }
    }));
  }), Promise.all(o.map((l) => {
    const c = Ba(l);
    return Ci[c] || (Ci[c] = t.decodingInfo(l));
  })).then((l) => ({
    supported: !l.some((c) => !c.supported),
    configurations: o,
    decodingInfoResults: l
  })).catch((l) => ({
    supported: !1,
    configurations: o,
    decodingInfoResults: [],
    error: l
  }));
}
function Ba(a) {
  const {
    audio: e,
    video: t
  } = a, s = t || e;
  if (s) {
    const i = s.contentType.split('"')[1];
    if (t)
      return `r${t.height}x${t.width}f${Math.ceil(t.framerate)}${t.transferFunction || "sd"}_${i}_${Math.ceil(t.bitrate / 1e5)}`;
    if (e)
      return `c${e.channels}${e.spatialRendering ? "s" : "n"}_${i}`;
  }
  return "";
}
function Ua() {
  if (typeof matchMedia == "function") {
    const a = matchMedia("(dynamic-range: high)"), e = matchMedia("bad query");
    if (a.media !== e.media)
      return a.matches === !0;
  }
  return !1;
}
function $a(a, e) {
  let t = !1, s = [];
  return a && (t = a !== "SDR", s = [a]), e && (s = e.allowedVideoRanges || Dt.slice(0), t = e.preferHDR !== void 0 ? e.preferHDR : Ua(), t ? s = s.filter((i) => i !== "SDR") : s = ["SDR"]), {
    preferHDR: t,
    allowedVideoRanges: s
  };
}
function Va(a, e, t, s, i) {
  const n = Object.keys(a), r = s == null ? void 0 : s.channels, o = s == null ? void 0 : s.audioCodec, l = r && parseInt(r) === 2;
  let c = !0, h = !1, u = 1 / 0, d = 1 / 0, f = 1 / 0, m = 0, p = [];
  const {
    preferHDR: g,
    allowedVideoRanges: v
  } = $a(e, i);
  for (let x = n.length; x--; ) {
    const I = a[n[x]];
    c = I.channels[2] > 0, u = Math.min(u, I.minHeight), d = Math.min(d, I.minFramerate), f = Math.min(f, I.minBitrate);
    const L = v.filter((w) => I.videoRanges[w] > 0);
    L.length > 0 && (h = !0, p = L);
  }
  u = O(u) ? u : 0, d = O(d) ? d : 0;
  const C = Math.max(1080, u), E = Math.max(30, d);
  return f = O(f) ? f : t, t = Math.max(f, t), h || (e = void 0, p = []), {
    codecSet: n.reduce((x, I) => {
      const L = a[I];
      if (I === x)
        return x;
      if (L.minBitrate > t)
        return ke(I, `min bitrate of ${L.minBitrate} > current estimate of ${t}`), x;
      if (!L.hasDefaultAudio)
        return ke(I, "no renditions with default or auto-select sound found"), x;
      if (o && I.indexOf(o.substring(0, 4)) % 5 !== 0)
        return ke(I, `audio codec preference "${o}" not found`), x;
      if (r && !l) {
        if (!L.channels[r])
          return ke(I, `no renditions with ${r} channel sound found (channels options: ${Object.keys(L.channels)})`), x;
      } else if ((!o || l) && c && L.channels[2] === 0)
        return ke(I, "no renditions with stereo sound found"), x;
      return L.minHeight > C ? (ke(I, `min resolution of ${L.minHeight} > maximum of ${C}`), x) : L.minFramerate > E ? (ke(I, `min framerate of ${L.minFramerate} > maximum of ${E}`), x) : p.some((w) => L.videoRanges[w] > 0) ? L.maxScore < m ? (ke(I, `max score of ${L.maxScore} < selected max of ${m}`), x) : x && (Rt(I) >= Rt(x) || L.fragmentError > a[x].fragmentError) ? x : (m = L.maxScore, I) : (ke(I, `no variants with VIDEO-RANGE of ${JSON.stringify(p)} found`), x);
    }, void 0),
    videoRanges: p,
    preferHDR: g,
    minFramerate: d,
    minBitrate: f
  };
}
function ke(a, e) {
  S.log(`[abr] start candidates with "${a}" ignored because ${e}`);
}
function Ha(a) {
  return a.reduce((e, t) => {
    let s = e.groups[t.groupId];
    s || (s = e.groups[t.groupId] = {
      tracks: [],
      channels: {
        2: 0
      },
      hasDefault: !1,
      hasAutoSelect: !1
    }), s.tracks.push(t);
    const i = t.channels || "2";
    return s.channels[i] = (s.channels[i] || 0) + 1, s.hasDefault = s.hasDefault || t.default, s.hasAutoSelect = s.hasAutoSelect || t.autoselect, s.hasDefault && (e.hasDefaultAudio = !0), s.hasAutoSelect && (e.hasAutoSelectAudio = !0), e;
  }, {
    hasDefaultAudio: !1,
    hasAutoSelectAudio: !1,
    groups: {}
  });
}
function Ga(a, e, t, s) {
  return a.slice(t, s + 1).reduce((i, n) => {
    if (!n.codecSet)
      return i;
    const r = n.audioGroups;
    let o = i[n.codecSet];
    o || (i[n.codecSet] = o = {
      minBitrate: 1 / 0,
      minHeight: 1 / 0,
      minFramerate: 1 / 0,
      maxScore: 0,
      videoRanges: {
        SDR: 0
      },
      channels: {
        2: 0
      },
      hasDefaultAudio: !r,
      fragmentError: 0
    }), o.minBitrate = Math.min(o.minBitrate, n.bitrate);
    const l = Math.min(n.height, n.width);
    return o.minHeight = Math.min(o.minHeight, l), o.minFramerate = Math.min(o.minFramerate, n.frameRate), o.maxScore = Math.max(o.maxScore, n.score), o.fragmentError += n.fragmentError, o.videoRanges[n.videoRange] = (o.videoRanges[n.videoRange] || 0) + 1, r && r.forEach((c) => {
      if (!c)
        return;
      const h = e.groups[c];
      h && (o.hasDefaultAudio = o.hasDefaultAudio || e.hasDefaultAudio ? h.hasDefault : h.hasAutoSelect || !e.hasDefaultAudio && !e.hasAutoSelectAudio, Object.keys(h.channels).forEach((u) => {
        o.channels[u] = (o.channels[u] || 0) + h.channels[u];
      }));
    }), i;
  }, {});
}
function we(a, e, t) {
  if ("attrs" in a) {
    const s = e.indexOf(a);
    if (s !== -1)
      return s;
  }
  for (let s = 0; s < e.length; s++) {
    const i = e[s];
    if (Ze(a, i, t))
      return s;
  }
  return -1;
}
function Ze(a, e, t) {
  const {
    groupId: s,
    name: i,
    lang: n,
    assocLang: r,
    characteristics: o,
    default: l
  } = a, c = a.forced;
  return (s === void 0 || e.groupId === s) && (i === void 0 || e.name === i) && (n === void 0 || e.lang === n) && (n === void 0 || e.assocLang === r) && (l === void 0 || e.default === l) && (c === void 0 || e.forced === c) && (o === void 0 || Ka(o, e.characteristics)) && (t === void 0 || t(a, e));
}
function Ka(a, e = "") {
  const t = a.split(","), s = e.split(",");
  return t.length === s.length && !t.some((i) => s.indexOf(i) === -1);
}
function Ge(a, e) {
  const {
    audioCodec: t,
    channels: s
  } = a;
  return (t === void 0 || (e.audioCodec || "").substring(0, 4) === t.substring(0, 4)) && (s === void 0 || s === (e.channels || "2"));
}
function Wa(a, e, t, s, i) {
  const n = e[s], o = e.reduce((d, f, m) => {
    const p = f.uri;
    return (d[p] || (d[p] = [])).push(m), d;
  }, {})[n.uri];
  o.length > 1 && (s = Math.max.apply(Math, o));
  const l = n.videoRange, c = n.frameRate, h = n.codecSet.substring(0, 4), u = Ti(e, s, (d) => {
    if (d.videoRange !== l || d.frameRate !== c || d.codecSet.substring(0, 4) !== h)
      return !1;
    const f = d.audioGroups, m = t.filter((p) => !f || f.indexOf(p.groupId) !== -1);
    return we(a, m, i) > -1;
  });
  return u > -1 ? u : Ti(e, s, (d) => {
    const f = d.audioGroups, m = t.filter((p) => !f || f.indexOf(p.groupId) !== -1);
    return we(a, m, i) > -1;
  });
}
function Ti(a, e, t) {
  for (let s = e; s; s--)
    if (t(a[s]))
      return s;
  for (let s = e + 1; s < a.length; s++)
    if (t(a[s]))
      return s;
  return -1;
}
class za {
  constructor(e) {
    this.hls = void 0, this.lastLevelLoadSec = 0, this.lastLoadedFragLevel = -1, this.firstSelection = -1, this._nextAutoLevel = -1, this.nextAutoLevelKey = "", this.audioTracksByGroup = null, this.codecTiers = null, this.timer = -1, this.fragCurrent = null, this.partCurrent = null, this.bitrateTestDelay = 0, this.bwEstimator = void 0, this._abandonRulesCheck = () => {
      const {
        fragCurrent: t,
        partCurrent: s,
        hls: i
      } = this, {
        autoLevelEnabled: n,
        media: r
      } = i;
      if (!t || !r)
        return;
      const o = performance.now(), l = s ? s.stats : t.stats, c = s ? s.duration : t.duration, h = o - l.loading.start, u = i.minAutoLevel;
      if (l.aborted || l.loaded && l.loaded === l.total || t.level <= u) {
        this.clearTimer(), this._nextAutoLevel = -1;
        return;
      }
      if (!n || r.paused || !r.playbackRate || !r.readyState)
        return;
      const d = i.mainForwardBufferInfo;
      if (d === null)
        return;
      const f = this.bwEstimator.getEstimateTTFB(), m = Math.abs(r.playbackRate);
      if (h <= Math.max(f, 1e3 * (c / (m * 2))))
        return;
      const p = d.len / m, g = l.loading.first ? l.loading.first - l.loading.start : -1, v = l.loaded && g > -1, C = this.getBwEstimate(), E = i.levels, T = E[t.level], x = l.total || Math.max(l.loaded, Math.round(c * T.averageBitrate / 8));
      let I = v ? h - g : h;
      I < 1 && v && (I = Math.min(h, l.loaded * 8 / C));
      const L = v ? l.loaded * 1e3 / I : 0, w = L ? (x - l.loaded) / L : x * 8 / C + f / 1e3;
      if (w <= p)
        return;
      const R = L ? L * 8 : C;
      let k = Number.POSITIVE_INFINITY, M;
      for (M = t.level - 1; M > u; M--) {
        const P = E[M].maxBitrate;
        if (k = this.getTimeToLoadFrag(f / 1e3, R, c * P, !E[M].details), k < p)
          break;
      }
      if (k >= w || k > c * 10)
        return;
      i.nextLoadLevel = i.nextAutoLevel = M, v ? this.bwEstimator.sample(h - Math.min(f, g), l.loaded) : this.bwEstimator.sampleTTFB(h);
      const _ = E[M].maxBitrate;
      this.getBwEstimate() * this.hls.config.abrBandWidthUpFactor > _ && this.resetEstimator(_), this.clearTimer(), S.warn(`[abr] Fragment ${t.sn}${s ? " part " + s.index : ""} of level ${t.level} is loading too slowly;
      Time to underbuffer: ${p.toFixed(3)} s
      Estimated load time for current fragment: ${w.toFixed(3)} s
      Estimated load time for down switch fragment: ${k.toFixed(3)} s
      TTFB estimate: ${g | 0} ms
      Current BW estimate: ${O(C) ? C | 0 : "Unknown"} bps
      New BW estimate: ${this.getBwEstimate() | 0} bps
      Switching to level ${M} @ ${_ | 0} bps`), i.trigger(y.FRAG_LOAD_EMERGENCY_ABORTED, {
        frag: t,
        part: s,
        stats: l
      });
    }, this.hls = e, this.bwEstimator = this.initEstimator(), this.registerListeners();
  }
  resetEstimator(e) {
    e && (S.log(`setting initial bwe to ${e}`), this.hls.config.abrEwmaDefaultEstimate = e), this.firstSelection = -1, this.bwEstimator = this.initEstimator();
  }
  initEstimator() {
    const e = this.hls.config;
    return new _a(e.abrEwmaSlowVoD, e.abrEwmaFastVoD, e.abrEwmaDefaultEstimate);
  }
  registerListeners() {
    const {
      hls: e
    } = this;
    e.on(y.MANIFEST_LOADING, this.onManifestLoading, this), e.on(y.FRAG_LOADING, this.onFragLoading, this), e.on(y.FRAG_LOADED, this.onFragLoaded, this), e.on(y.FRAG_BUFFERED, this.onFragBuffered, this), e.on(y.LEVEL_SWITCHING, this.onLevelSwitching, this), e.on(y.LEVEL_LOADED, this.onLevelLoaded, this), e.on(y.LEVELS_UPDATED, this.onLevelsUpdated, this), e.on(y.MAX_AUTO_LEVEL_UPDATED, this.onMaxAutoLevelUpdated, this), e.on(y.ERROR, this.onError, this);
  }
  unregisterListeners() {
    const {
      hls: e
    } = this;
    e && (e.off(y.MANIFEST_LOADING, this.onManifestLoading, this), e.off(y.FRAG_LOADING, this.onFragLoading, this), e.off(y.FRAG_LOADED, this.onFragLoaded, this), e.off(y.FRAG_BUFFERED, this.onFragBuffered, this), e.off(y.LEVEL_SWITCHING, this.onLevelSwitching, this), e.off(y.LEVEL_LOADED, this.onLevelLoaded, this), e.off(y.LEVELS_UPDATED, this.onLevelsUpdated, this), e.off(y.MAX_AUTO_LEVEL_UPDATED, this.onMaxAutoLevelUpdated, this), e.off(y.ERROR, this.onError, this));
  }
  destroy() {
    this.unregisterListeners(), this.clearTimer(), this.hls = this._abandonRulesCheck = null, this.fragCurrent = this.partCurrent = null;
  }
  onManifestLoading(e, t) {
    this.lastLoadedFragLevel = -1, this.firstSelection = -1, this.lastLevelLoadSec = 0, this.fragCurrent = this.partCurrent = null, this.onLevelsUpdated(), this.clearTimer();
  }
  onLevelsUpdated() {
    this.lastLoadedFragLevel > -1 && this.fragCurrent && (this.lastLoadedFragLevel = this.fragCurrent.level), this._nextAutoLevel = -1, this.onMaxAutoLevelUpdated(), this.codecTiers = null, this.audioTracksByGroup = null;
  }
  onMaxAutoLevelUpdated() {
    this.firstSelection = -1, this.nextAutoLevelKey = "";
  }
  onFragLoading(e, t) {
    const s = t.frag;
    if (!this.ignoreFragment(s)) {
      if (!s.bitrateTest) {
        var i;
        this.fragCurrent = s, this.partCurrent = (i = t.part) != null ? i : null;
      }
      this.clearTimer(), this.timer = self.setInterval(this._abandonRulesCheck, 100);
    }
  }
  onLevelSwitching(e, t) {
    this.clearTimer();
  }
  onError(e, t) {
    if (!t.fatal)
      switch (t.details) {
        case A.BUFFER_ADD_CODEC_ERROR:
        case A.BUFFER_APPEND_ERROR:
          this.lastLoadedFragLevel = -1, this.firstSelection = -1;
          break;
        case A.FRAG_LOAD_TIMEOUT: {
          const s = t.frag, {
            fragCurrent: i,
            partCurrent: n
          } = this;
          if (s && i && s.sn === i.sn && s.level === i.level) {
            const r = performance.now(), o = n ? n.stats : s.stats, l = r - o.loading.start, c = o.loading.first ? o.loading.first - o.loading.start : -1;
            if (o.loaded && c > -1) {
              const u = this.bwEstimator.getEstimateTTFB();
              this.bwEstimator.sample(l - Math.min(u, c), o.loaded);
            } else
              this.bwEstimator.sampleTTFB(l);
          }
          break;
        }
      }
  }
  getTimeToLoadFrag(e, t, s, i) {
    const n = e + s / t, r = i ? this.lastLevelLoadSec : 0;
    return n + r;
  }
  onLevelLoaded(e, t) {
    const s = this.hls.config, {
      loading: i
    } = t.stats, n = i.end - i.start;
    O(n) && (this.lastLevelLoadSec = n / 1e3), t.details.live ? this.bwEstimator.update(s.abrEwmaSlowLive, s.abrEwmaFastLive) : this.bwEstimator.update(s.abrEwmaSlowVoD, s.abrEwmaFastVoD);
  }
  onFragLoaded(e, {
    frag: t,
    part: s
  }) {
    const i = s ? s.stats : t.stats;
    if (t.type === H.MAIN && this.bwEstimator.sampleTTFB(i.loading.first - i.loading.start), !this.ignoreFragment(t)) {
      if (this.clearTimer(), t.level === this._nextAutoLevel && (this._nextAutoLevel = -1), this.firstSelection = -1, this.hls.config.abrMaxWithRealBitrate) {
        const n = s ? s.duration : t.duration, r = this.hls.levels[t.level], o = (r.loaded ? r.loaded.bytes : 0) + i.loaded, l = (r.loaded ? r.loaded.duration : 0) + n;
        r.loaded = {
          bytes: o,
          duration: l
        }, r.realBitrate = Math.round(8 * o / l);
      }
      if (t.bitrateTest) {
        const n = {
          stats: i,
          frag: t,
          part: s,
          id: t.type
        };
        this.onFragBuffered(y.FRAG_BUFFERED, n), t.bitrateTest = !1;
      } else
        this.lastLoadedFragLevel = t.level;
    }
  }
  onFragBuffered(e, t) {
    const {
      frag: s,
      part: i
    } = t, n = i != null && i.stats.loaded ? i.stats : s.stats;
    if (n.aborted || this.ignoreFragment(s))
      return;
    const r = n.parsing.end - n.loading.start - Math.min(n.loading.first - n.loading.start, this.bwEstimator.getEstimateTTFB());
    this.bwEstimator.sample(r, n.loaded), n.bwEstimate = this.getBwEstimate(), s.bitrateTest ? this.bitrateTestDelay = r / 1e3 : this.bitrateTestDelay = 0;
  }
  ignoreFragment(e) {
    return e.type !== H.MAIN || e.sn === "initSegment";
  }
  clearTimer() {
    this.timer > -1 && (self.clearInterval(this.timer), this.timer = -1);
  }
  get firstAutoLevel() {
    const {
      maxAutoLevel: e,
      minAutoLevel: t
    } = this.hls, s = this.getBwEstimate(), i = this.hls.config.maxStarvationDelay, n = this.findBestLevel(s, t, e, 0, i, 1, 1);
    if (n > -1)
      return n;
    const r = this.hls.firstLevel, o = Math.min(Math.max(r, t), e);
    return S.warn(`[abr] Could not find best starting auto level. Defaulting to first in playlist ${r} clamped to ${o}`), o;
  }
  get forcedAutoLevel() {
    return this.nextAutoLevelKey ? -1 : this._nextAutoLevel;
  }
  // return next auto level
  get nextAutoLevel() {
    const e = this.forcedAutoLevel, s = this.bwEstimator.canEstimate(), i = this.lastLoadedFragLevel > -1;
    if (e !== -1 && (!s || !i || this.nextAutoLevelKey === this.getAutoLevelKey()))
      return e;
    const n = s && i ? this.getNextABRAutoLevel() : this.firstAutoLevel;
    if (e !== -1) {
      const r = this.hls.levels;
      if (r.length > Math.max(e, n) && r[e].loadError <= r[n].loadError)
        return e;
    }
    return this._nextAutoLevel = n, this.nextAutoLevelKey = this.getAutoLevelKey(), n;
  }
  getAutoLevelKey() {
    return `${this.getBwEstimate()}_${this.getStarvationDelay().toFixed(2)}`;
  }
  getNextABRAutoLevel() {
    const {
      fragCurrent: e,
      partCurrent: t,
      hls: s
    } = this, {
      maxAutoLevel: i,
      config: n,
      minAutoLevel: r
    } = s, o = t ? t.duration : e ? e.duration : 0, l = this.getBwEstimate(), c = this.getStarvationDelay();
    let h = n.abrBandWidthFactor, u = n.abrBandWidthUpFactor;
    if (c) {
      const g = this.findBestLevel(l, r, i, c, 0, h, u);
      if (g >= 0)
        return g;
    }
    let d = o ? Math.min(o, n.maxStarvationDelay) : n.maxStarvationDelay;
    if (!c) {
      const g = this.bitrateTestDelay;
      g && (d = (o ? Math.min(o, n.maxLoadingDelay) : n.maxLoadingDelay) - g, S.info(`[abr] bitrate test took ${Math.round(1e3 * g)}ms, set first fragment max fetchDuration to ${Math.round(1e3 * d)} ms`), h = u = 1);
    }
    const f = this.findBestLevel(l, r, i, c, d, h, u);
    if (S.info(`[abr] ${c ? "rebuffering expected" : "buffer is empty"}, optimal quality level ${f}`), f > -1)
      return f;
    const m = s.levels[r], p = s.levels[s.loadLevel];
    return (m == null ? void 0 : m.bitrate) < (p == null ? void 0 : p.bitrate) ? r : s.loadLevel;
  }
  getStarvationDelay() {
    const e = this.hls, t = e.media;
    if (!t)
      return 1 / 0;
    const s = t && t.playbackRate !== 0 ? Math.abs(t.playbackRate) : 1, i = e.mainForwardBufferInfo;
    return (i ? i.len : 0) / s;
  }
  getBwEstimate() {
    return this.bwEstimator.canEstimate() ? this.bwEstimator.getEstimate() : this.hls.config.abrEwmaDefaultEstimate;
  }
  findBestLevel(e, t, s, i, n, r, o) {
    var l;
    const c = i + n, h = this.lastLoadedFragLevel, u = h === -1 ? this.hls.firstLevel : h, {
      fragCurrent: d,
      partCurrent: f
    } = this, {
      levels: m,
      allAudioTracks: p,
      loadLevel: g,
      config: v
    } = this.hls;
    if (m.length === 1)
      return 0;
    const C = m[u], E = !!(C != null && (l = C.details) != null && l.live), T = g === -1 || h === -1;
    let x, I = "SDR", L = (C == null ? void 0 : C.frameRate) || 0;
    const {
      audioPreference: w,
      videoPreference: R
    } = v, k = this.audioTracksByGroup || (this.audioTracksByGroup = Ha(p));
    if (T) {
      if (this.firstSelection !== -1)
        return this.firstSelection;
      const B = this.codecTiers || (this.codecTiers = Ga(m, k, t, s)), U = Va(B, I, e, w, R), {
        codecSet: Z,
        videoRanges: Q,
        minFramerate: $,
        minBitrate: F,
        preferHDR: q
      } = U;
      x = Z, I = q ? Q[Q.length - 1] : Q[0], L = $, e = Math.max(e, F), S.log(`[abr] picked start tier ${JSON.stringify(U)}`);
    } else
      x = C == null ? void 0 : C.codecSet, I = C == null ? void 0 : C.videoRange;
    const M = f ? f.duration : d ? d.duration : 0, _ = this.bwEstimator.getEstimateTTFB() / 1e3, P = [];
    for (let B = s; B >= t; B--) {
      var G;
      const U = m[B], Z = B > u;
      if (!U)
        continue;
      if (v.useMediaCapabilities && !U.supportedResult && !U.supportedPromise) {
        const ie = navigator.mediaCapabilities;
        typeof (ie == null ? void 0 : ie.decodingInfo) == "function" && Oa(U, k, I, L, e, w) ? (U.supportedPromise = Na(U, k, ie), U.supportedPromise.then((ae) => {
          if (!this.hls)
            return;
          U.supportedResult = ae;
          const he = this.hls.levels, pe = he.indexOf(U);
          ae.error ? S.warn(`[abr] MediaCapabilities decodingInfo error: "${ae.error}" for level ${pe} ${JSON.stringify(ae)}`) : ae.supported || (S.warn(`[abr] Unsupported MediaCapabilities decodingInfo result for level ${pe} ${JSON.stringify(ae)}`), pe > -1 && he.length > 1 && (S.log(`[abr] Removing unsupported level ${pe}`), this.hls.removeLevel(pe)));
        })) : U.supportedResult = Sn;
      }
      if (x && U.codecSet !== x || I && U.videoRange !== I || Z && L > U.frameRate || !Z && L > 0 && L < U.frameRate || U.supportedResult && !((G = U.supportedResult.decodingInfoResults) != null && G[0].smooth)) {
        P.push(B);
        continue;
      }
      const Q = U.details, $ = (f ? Q == null ? void 0 : Q.partTarget : Q == null ? void 0 : Q.averagetargetduration) || M;
      let F;
      Z ? F = o * e : F = r * e;
      const q = M && i >= M * 2 && n === 0 ? m[B].averageBitrate : m[B].maxBitrate, z = this.getTimeToLoadFrag(_, F, q * $, Q === void 0);
      if (
        // if adjusted bw is greater than level bitrate AND
        F >= q && // no level change, or new level has no error history
        (B === h || U.loadError === 0 && U.fragmentError === 0) && // fragment fetchDuration unknown OR live stream OR fragment fetchDuration less than max allowed fetch duration, then this level matches
        // we don't account for max Fetch Duration for live streams, this is to avoid switching down when near the edge of live sliding window ...
        // special case to support startLevel = -1 (bitrateTest) on live streams : in that case we should not exit loop so that findBestLevel will return -1
        (z <= _ || !O(z) || E && !this.bitrateTestDelay || z < c)
      ) {
        const ie = this.forcedAutoLevel;
        return B !== g && (ie === -1 || ie !== g) && (P.length && S.trace(`[abr] Skipped level(s) ${P.join(",")} of ${s} max with CODECS and VIDEO-RANGE:"${m[P[0]].codecs}" ${m[P[0]].videoRange}; not compatible with "${C.codecs}" ${I}`), S.info(`[abr] switch candidate:${u}->${B} adjustedbw(${Math.round(F)})-bitrate=${Math.round(F - q)} ttfb:${_.toFixed(1)} avgDuration:${$.toFixed(1)} maxFetchDuration:${c.toFixed(1)} fetchDuration:${z.toFixed(1)} firstSelection:${T} codecSet:${x} videoRange:${I} hls.loadLevel:${g}`)), T && (this.firstSelection = B), B;
      }
    }
    return -1;
  }
  set nextAutoLevel(e) {
    const {
      maxAutoLevel: t,
      minAutoLevel: s
    } = this.hls, i = Math.min(Math.max(e, s), t);
    this._nextAutoLevel !== i && (this.nextAutoLevelKey = "", this._nextAutoLevel = i);
  }
}
class Ya {
  constructor() {
    this._boundTick = void 0, this._tickTimer = null, this._tickInterval = null, this._tickCallCount = 0, this._boundTick = this.tick.bind(this);
  }
  destroy() {
    this.onHandlerDestroying(), this.onHandlerDestroyed();
  }
  onHandlerDestroying() {
    this.clearNextTick(), this.clearInterval();
  }
  onHandlerDestroyed() {
  }
  hasInterval() {
    return !!this._tickInterval;
  }
  hasNextTick() {
    return !!this._tickTimer;
  }
  /**
   * @param millis - Interval time (ms)
   * @eturns True when interval has been scheduled, false when already scheduled (no effect)
   */
  setInterval(e) {
    return this._tickInterval ? !1 : (this._tickCallCount = 0, this._tickInterval = self.setInterval(this._boundTick, e), !0);
  }
  /**
   * @returns True when interval was cleared, false when none was set (no effect)
   */
  clearInterval() {
    return this._tickInterval ? (self.clearInterval(this._tickInterval), this._tickInterval = null, !0) : !1;
  }
  /**
   * @returns True when timeout was cleared, false when none was set (no effect)
   */
  clearNextTick() {
    return this._tickTimer ? (self.clearTimeout(this._tickTimer), this._tickTimer = null, !0) : !1;
  }
  /**
   * Will call the subclass doTick implementation in this main loop tick
   * or in the next one (via setTimeout(,0)) in case it has already been called
   * in this tick (in case this is a re-entrant call).
   */
  tick() {
    this._tickCallCount++, this._tickCallCount === 1 && (this.doTick(), this._tickCallCount > 1 && this.tickImmediate(), this._tickCallCount = 0);
  }
  tickImmediate() {
    this.clearNextTick(), this._tickTimer = self.setTimeout(this._boundTick, 0);
  }
  /**
   * For subclass to implement task logic
   * @abstract
   */
  doTick() {
  }
}
var le = {
  NOT_LOADED: "NOT_LOADED",
  APPENDING: "APPENDING",
  PARTIAL: "PARTIAL",
  OK: "OK"
};
class Za {
  constructor(e) {
    this.activePartLists = /* @__PURE__ */ Object.create(null), this.endListFragments = /* @__PURE__ */ Object.create(null), this.fragments = /* @__PURE__ */ Object.create(null), this.timeRanges = /* @__PURE__ */ Object.create(null), this.bufferPadding = 0.2, this.hls = void 0, this.hasGaps = !1, this.hls = e, this._registerListeners();
  }
  _registerListeners() {
    const {
      hls: e
    } = this;
    e.on(y.BUFFER_APPENDED, this.onBufferAppended, this), e.on(y.FRAG_BUFFERED, this.onFragBuffered, this), e.on(y.FRAG_LOADED, this.onFragLoaded, this);
  }
  _unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(y.BUFFER_APPENDED, this.onBufferAppended, this), e.off(y.FRAG_BUFFERED, this.onFragBuffered, this), e.off(y.FRAG_LOADED, this.onFragLoaded, this);
  }
  destroy() {
    this._unregisterListeners(), this.fragments = // @ts-ignore
    this.activePartLists = // @ts-ignore
    this.endListFragments = this.timeRanges = null;
  }
  /**
   * Return a Fragment or Part with an appended range that matches the position and levelType
   * Otherwise, return null
   */
  getAppendedFrag(e, t) {
    const s = this.activePartLists[t];
    if (s)
      for (let i = s.length; i--; ) {
        const n = s[i];
        if (!n)
          break;
        const r = n.end;
        if (n.start <= e && r !== null && e <= r)
          return n;
      }
    return this.getBufferedFrag(e, t);
  }
  /**
   * Return a buffered Fragment that matches the position and levelType.
   * A buffered Fragment is one whose loading, parsing and appending is done (completed or "partial" meaning aborted).
   * If not found any Fragment, return null
   */
  getBufferedFrag(e, t) {
    const {
      fragments: s
    } = this, i = Object.keys(s);
    for (let n = i.length; n--; ) {
      const r = s[i[n]];
      if ((r == null ? void 0 : r.body.type) === t && r.buffered) {
        const o = r.body;
        if (o.start <= e && e <= o.end)
          return o;
      }
    }
    return null;
  }
  /**
   * Partial fragments effected by coded frame eviction will be removed
   * The browser will unload parts of the buffer to free up memory for new buffer data
   * Fragments will need to be reloaded when the buffer is freed up, removing partial fragments will allow them to reload(since there might be parts that are still playable)
   */
  detectEvictedFragments(e, t, s, i) {
    this.timeRanges && (this.timeRanges[e] = t);
    const n = (i == null ? void 0 : i.fragment.sn) || -1;
    Object.keys(this.fragments).forEach((r) => {
      const o = this.fragments[r];
      if (!o || n >= o.body.sn)
        return;
      if (!o.buffered && !o.loaded) {
        o.body.type === s && this.removeFragment(o.body);
        return;
      }
      const l = o.range[e];
      l && l.time.some((c) => {
        const h = !this.isTimeBuffered(c.startPTS, c.endPTS, t);
        return h && this.removeFragment(o.body), h;
      });
    });
  }
  /**
   * Checks if the fragment passed in is loaded in the buffer properly
   * Partially loaded fragments will be registered as a partial fragment
   */
  detectPartialFragments(e) {
    const t = this.timeRanges, {
      frag: s,
      part: i
    } = e;
    if (!t || s.sn === "initSegment")
      return;
    const n = Ke(s), r = this.fragments[n];
    if (!r || r.buffered && s.gap)
      return;
    const o = !s.relurl;
    Object.keys(t).forEach((l) => {
      const c = s.elementaryStreams[l];
      if (!c)
        return;
      const h = t[l], u = o || c.partial === !0;
      r.range[l] = this.getBufferedTimes(s, i, u, h);
    }), r.loaded = null, Object.keys(r.range).length ? (r.buffered = !0, (r.body.endList = s.endList || r.body.endList) && (this.endListFragments[r.body.type] = r), ut(r) || this.removeParts(s.sn - 1, s.type)) : this.removeFragment(r.body);
  }
  removeParts(e, t) {
    const s = this.activePartLists[t];
    s && (this.activePartLists[t] = s.filter((i) => i.fragment.sn >= e));
  }
  fragBuffered(e, t) {
    const s = Ke(e);
    let i = this.fragments[s];
    !i && t && (i = this.fragments[s] = {
      body: e,
      appendedPTS: null,
      loaded: null,
      buffered: !1,
      range: /* @__PURE__ */ Object.create(null)
    }, e.gap && (this.hasGaps = !0)), i && (i.loaded = null, i.buffered = !0);
  }
  getBufferedTimes(e, t, s, i) {
    const n = {
      time: [],
      partial: s
    }, r = e.start, o = e.end, l = e.minEndPTS || o, c = e.maxStartPTS || r;
    for (let h = 0; h < i.length; h++) {
      const u = i.start(h) - this.bufferPadding, d = i.end(h) + this.bufferPadding;
      if (c >= u && l <= d) {
        n.time.push({
          startPTS: Math.max(r, i.start(h)),
          endPTS: Math.min(o, i.end(h))
        });
        break;
      } else if (r < d && o > u) {
        const f = Math.max(r, i.start(h)), m = Math.min(o, i.end(h));
        m > f && (n.partial = !0, n.time.push({
          startPTS: f,
          endPTS: m
        }));
      } else if (o <= u)
        break;
    }
    return n;
  }
  /**
   * Gets the partial fragment for a certain time
   */
  getPartialFragment(e) {
    let t = null, s, i, n, r = 0;
    const {
      bufferPadding: o,
      fragments: l
    } = this;
    return Object.keys(l).forEach((c) => {
      const h = l[c];
      h && ut(h) && (i = h.body.start - o, n = h.body.end + o, e >= i && e <= n && (s = Math.min(e - i, n - e), r <= s && (t = h.body, r = s)));
    }), t;
  }
  isEndListAppended(e) {
    const t = this.endListFragments[e];
    return t !== void 0 && (t.buffered || ut(t));
  }
  getState(e) {
    const t = Ke(e), s = this.fragments[t];
    return s ? s.buffered ? ut(s) ? le.PARTIAL : le.OK : le.APPENDING : le.NOT_LOADED;
  }
  isTimeBuffered(e, t, s) {
    let i, n;
    for (let r = 0; r < s.length; r++) {
      if (i = s.start(r) - this.bufferPadding, n = s.end(r) + this.bufferPadding, e >= i && t <= n)
        return !0;
      if (t <= i)
        return !1;
    }
    return !1;
  }
  onFragLoaded(e, t) {
    const {
      frag: s,
      part: i
    } = t;
    if (s.sn === "initSegment" || s.bitrateTest)
      return;
    const n = i ? null : t, r = Ke(s);
    this.fragments[r] = {
      body: s,
      appendedPTS: null,
      loaded: n,
      buffered: !1,
      range: /* @__PURE__ */ Object.create(null)
    };
  }
  onBufferAppended(e, t) {
    const {
      frag: s,
      part: i,
      timeRanges: n
    } = t;
    if (s.sn === "initSegment")
      return;
    const r = s.type;
    if (i) {
      let o = this.activePartLists[r];
      o || (this.activePartLists[r] = o = []), o.push(i);
    }
    this.timeRanges = n, Object.keys(n).forEach((o) => {
      const l = n[o];
      this.detectEvictedFragments(o, l, r, i);
    });
  }
  onFragBuffered(e, t) {
    this.detectPartialFragments(t);
  }
  hasFragment(e) {
    const t = Ke(e);
    return !!this.fragments[t];
  }
  hasParts(e) {
    var t;
    return !!((t = this.activePartLists[e]) != null && t.length);
  }
  removeFragmentsInRange(e, t, s, i, n) {
    i && !this.hasGaps || Object.keys(this.fragments).forEach((r) => {
      const o = this.fragments[r];
      if (!o)
        return;
      const l = o.body;
      l.type !== s || i && !l.gap || l.start < t && l.end > e && (o.buffered || n) && this.removeFragment(l);
    });
  }
  removeFragment(e) {
    const t = Ke(e);
    e.stats.loaded = 0, e.clearElementaryStreamInfo();
    const s = this.activePartLists[e.type];
    if (s) {
      const i = e.sn;
      this.activePartLists[e.type] = s.filter((n) => n.fragment.sn !== i);
    }
    delete this.fragments[t], e.endList && delete this.endListFragments[e.type];
  }
  removeAllFragments() {
    this.fragments = /* @__PURE__ */ Object.create(null), this.endListFragments = /* @__PURE__ */ Object.create(null), this.activePartLists = /* @__PURE__ */ Object.create(null), this.hasGaps = !1;
  }
}
function ut(a) {
  var e, t, s;
  return a.buffered && (a.body.gap || ((e = a.range.video) == null ? void 0 : e.partial) || ((t = a.range.audio) == null ? void 0 : t.partial) || ((s = a.range.audiovideo) == null ? void 0 : s.partial));
}
function Ke(a) {
  return `${a.type}_${a.level}_${a.sn}`;
}
const qa = {
  length: 0,
  start: () => 0,
  end: () => 0
};
class ee {
  /**
   * Return true if `media`'s buffered include `position`
   */
  static isBuffered(e, t) {
    try {
      if (e) {
        const s = ee.getBuffered(e);
        for (let i = 0; i < s.length; i++)
          if (t >= s.start(i) && t <= s.end(i))
            return !0;
      }
    } catch {
    }
    return !1;
  }
  static bufferInfo(e, t, s) {
    try {
      if (e) {
        const i = ee.getBuffered(e), n = [];
        let r;
        for (r = 0; r < i.length; r++)
          n.push({
            start: i.start(r),
            end: i.end(r)
          });
        return this.bufferedInfo(n, t, s);
      }
    } catch {
    }
    return {
      len: 0,
      start: t,
      end: t,
      nextStart: void 0
    };
  }
  static bufferedInfo(e, t, s) {
    t = Math.max(0, t), e.sort(function(c, h) {
      const u = c.start - h.start;
      return u || h.end - c.end;
    });
    let i = [];
    if (s)
      for (let c = 0; c < e.length; c++) {
        const h = i.length;
        if (h) {
          const u = i[h - 1].end;
          e[c].start - u < s ? e[c].end > u && (i[h - 1].end = e[c].end) : i.push(e[c]);
        } else
          i.push(e[c]);
      }
    else
      i = e;
    let n = 0, r, o = t, l = t;
    for (let c = 0; c < i.length; c++) {
      const h = i[c].start, u = i[c].end;
      if (t + s >= h && t < u)
        o = h, l = u, n = l - t;
      else if (t + s < h) {
        r = h;
        break;
      }
    }
    return {
      len: n,
      start: o || 0,
      end: l || 0,
      nextStart: r
    };
  }
  /**
   * Safe method to get buffered property.
   * SourceBuffer.buffered may throw if SourceBuffer is removed from it's MediaSource
   */
  static getBuffered(e) {
    try {
      return e.buffered;
    } catch (t) {
      return S.log("failed to get media.buffered", t), qa;
    }
  }
}
class Ds {
  constructor(e, t, s, i = 0, n = -1, r = !1) {
    this.level = void 0, this.sn = void 0, this.part = void 0, this.id = void 0, this.size = void 0, this.partial = void 0, this.transmuxing = dt(), this.buffering = {
      audio: dt(),
      video: dt(),
      audiovideo: dt()
    }, this.level = e, this.sn = t, this.id = s, this.size = i, this.part = n, this.partial = r;
  }
}
function dt() {
  return {
    start: 0,
    executeStart: 0,
    executeEnd: 0,
    end: 0
  };
}
function Et(a, e) {
  for (let s = 0, i = a.length; s < i; s++) {
    var t;
    if (((t = a[s]) == null ? void 0 : t.cc) === e)
      return a[s];
  }
  return null;
}
function ja(a, e, t) {
  return !!(e && (t.endCC > t.startCC || a && a.cc < t.startCC));
}
function Xa(a, e) {
  const t = a.fragments, s = e.fragments;
  if (!s.length || !t.length) {
    S.log("No fragments to align");
    return;
  }
  const i = Et(t, s[0].cc);
  if (!i || i && !i.startPTS) {
    S.log("No frag in previous level to align on");
    return;
  }
  return i;
}
function Ei(a, e) {
  if (a) {
    const t = a.start + e;
    a.start = a.startPTS = t, a.endPTS = t + a.duration;
  }
}
function bn(a, e) {
  const t = e.fragments;
  for (let s = 0, i = t.length; s < i; s++)
    Ei(t[s], a);
  e.fragmentHint && Ei(e.fragmentHint, a), e.alignedSliding = !0;
}
function Qa(a, e, t) {
  e && (Ja(a, t, e), !t.alignedSliding && e && _t(t, e), !t.alignedSliding && e && !t.skippedSegments && Cn(e, t));
}
function Ja(a, e, t) {
  if (ja(a, t, e)) {
    const s = Xa(t, e);
    s && O(s.start) && (S.log(`Adjusting PTS using last level due to CC increase within current level ${e.url}`), bn(s.start, e));
  }
}
function _t(a, e) {
  if (!a.hasProgramDateTime || !e.hasProgramDateTime)
    return;
  const t = a.fragments, s = e.fragments;
  if (!t.length || !s.length)
    return;
  let i, n;
  const r = Math.min(e.endCC, a.endCC);
  e.startCC < r && a.startCC < r && (i = Et(s, r), n = Et(t, r)), (!i || !n) && (i = s[Math.floor(s.length / 2)], n = Et(t, i.cc) || t[Math.floor(t.length / 2)]);
  const o = i.programDateTime, l = n.programDateTime;
  if (!o || !l)
    return;
  const c = (l - o) / 1e3 - (n.start - i.start);
  bn(c, a);
}
const xi = Math.pow(2, 17);
class eo {
  constructor(e) {
    this.config = void 0, this.loader = null, this.partLoadTimeout = -1, this.config = e;
  }
  destroy() {
    this.loader && (this.loader.destroy(), this.loader = null);
  }
  abort() {
    this.loader && this.loader.abort();
  }
  load(e, t) {
    const s = e.url;
    if (!s)
      return Promise.reject(new Me({
        type: K.NETWORK_ERROR,
        details: A.FRAG_LOAD_ERROR,
        fatal: !1,
        frag: e,
        error: new Error(`Fragment does not have a ${s ? "part list" : "url"}`),
        networkDetails: null
      }));
    this.abort();
    const i = this.config, n = i.fLoader, r = i.loader;
    return new Promise((o, l) => {
      if (this.loader && this.loader.destroy(), e.gap)
        if (e.tagList.some((f) => f[0] === "GAP")) {
          l(bi(e));
          return;
        } else
          e.gap = !1;
      const c = this.loader = e.loader = n ? new n(i) : new r(i), h = Si(e), u = vi(i.fragLoadPolicy.default), d = {
        loadPolicy: u,
        timeout: u.maxLoadTimeMs,
        maxRetry: 0,
        retryDelay: 0,
        maxRetryDelay: 0,
        highWaterMark: e.sn === "initSegment" ? 1 / 0 : xi
      };
      e.stats = c.stats, c.load(h, d, {
        onSuccess: (f, m, p, g) => {
          this.resetLoader(e, c);
          let v = f.data;
          p.resetIV && e.decryptdata && (e.decryptdata.iv = new Uint8Array(v.slice(0, 16)), v = v.slice(16)), o({
            frag: e,
            part: null,
            payload: v,
            networkDetails: g
          });
        },
        onError: (f, m, p, g) => {
          this.resetLoader(e, c), l(new Me({
            type: K.NETWORK_ERROR,
            details: A.FRAG_LOAD_ERROR,
            fatal: !1,
            frag: e,
            response: ce({
              url: s,
              data: void 0
            }, f),
            error: new Error(`HTTP Error ${f.code} ${f.text}`),
            networkDetails: p,
            stats: g
          }));
        },
        onAbort: (f, m, p) => {
          this.resetLoader(e, c), l(new Me({
            type: K.NETWORK_ERROR,
            details: A.INTERNAL_ABORTED,
            fatal: !1,
            frag: e,
            error: new Error("Aborted"),
            networkDetails: p,
            stats: f
          }));
        },
        onTimeout: (f, m, p) => {
          this.resetLoader(e, c), l(new Me({
            type: K.NETWORK_ERROR,
            details: A.FRAG_LOAD_TIMEOUT,
            fatal: !1,
            frag: e,
            error: new Error(`Timeout after ${d.timeout}ms`),
            networkDetails: p,
            stats: f
          }));
        },
        onProgress: (f, m, p, g) => {
          t && t({
            frag: e,
            part: null,
            payload: p,
            networkDetails: g
          });
        }
      });
    });
  }
  loadPart(e, t, s) {
    this.abort();
    const i = this.config, n = i.fLoader, r = i.loader;
    return new Promise((o, l) => {
      if (this.loader && this.loader.destroy(), e.gap || t.gap) {
        l(bi(e, t));
        return;
      }
      const c = this.loader = e.loader = n ? new n(i) : new r(i), h = Si(e, t), u = vi(i.fragLoadPolicy.default), d = {
        loadPolicy: u,
        timeout: u.maxLoadTimeMs,
        maxRetry: 0,
        retryDelay: 0,
        maxRetryDelay: 0,
        highWaterMark: xi
      };
      t.stats = c.stats, c.load(h, d, {
        onSuccess: (f, m, p, g) => {
          this.resetLoader(e, c), this.updateStatsFromPart(e, t);
          const v = {
            frag: e,
            part: t,
            payload: f.data,
            networkDetails: g
          };
          s(v), o(v);
        },
        onError: (f, m, p, g) => {
          this.resetLoader(e, c), l(new Me({
            type: K.NETWORK_ERROR,
            details: A.FRAG_LOAD_ERROR,
            fatal: !1,
            frag: e,
            part: t,
            response: ce({
              url: h.url,
              data: void 0
            }, f),
            error: new Error(`HTTP Error ${f.code} ${f.text}`),
            networkDetails: p,
            stats: g
          }));
        },
        onAbort: (f, m, p) => {
          e.stats.aborted = t.stats.aborted, this.resetLoader(e, c), l(new Me({
            type: K.NETWORK_ERROR,
            details: A.INTERNAL_ABORTED,
            fatal: !1,
            frag: e,
            part: t,
            error: new Error("Aborted"),
            networkDetails: p,
            stats: f
          }));
        },
        onTimeout: (f, m, p) => {
          this.resetLoader(e, c), l(new Me({
            type: K.NETWORK_ERROR,
            details: A.FRAG_LOAD_TIMEOUT,
            fatal: !1,
            frag: e,
            part: t,
            error: new Error(`Timeout after ${d.timeout}ms`),
            networkDetails: p,
            stats: f
          }));
        }
      });
    });
  }
  updateStatsFromPart(e, t) {
    const s = e.stats, i = t.stats, n = i.total;
    if (s.loaded += i.loaded, n) {
      const l = Math.round(e.duration / t.duration), c = Math.min(Math.round(s.loaded / n), l), u = (l - c) * Math.round(s.loaded / c);
      s.total = s.loaded + u;
    } else
      s.total = Math.max(s.loaded, s.total);
    const r = s.loading, o = i.loading;
    r.start ? r.first += o.first - o.start : (r.start = o.start, r.first = o.first), r.end = o.end;
  }
  resetLoader(e, t) {
    e.loader = null, this.loader === t && (self.clearTimeout(this.partLoadTimeout), this.loader = null), t.destroy();
  }
}
function Si(a, e = null) {
  const t = e || a, s = {
    frag: a,
    part: e,
    responseType: "arraybuffer",
    url: t.url,
    headers: {},
    rangeStart: 0,
    rangeEnd: 0
  }, i = t.byteRangeStartOffset, n = t.byteRangeEndOffset;
  if (O(i) && O(n)) {
    var r;
    let o = i, l = n;
    if (a.sn === "initSegment" && ((r = a.decryptdata) == null ? void 0 : r.method) === "AES-128") {
      const c = n - i;
      c % 16 && (l = n + (16 - c % 16)), i !== 0 && (s.resetIV = !0, o = i - 16);
    }
    s.rangeStart = o, s.rangeEnd = l;
  }
  return s;
}
function bi(a, e) {
  const t = new Error(`GAP ${a.gap ? "tag" : "attribute"} found`), s = {
    type: K.MEDIA_ERROR,
    details: A.FRAG_GAP,
    fatal: !1,
    frag: a,
    error: t,
    networkDetails: null
  };
  return e && (s.part = e), (e || a).stats.aborted = !0, new Me(s);
}
class Me extends Error {
  constructor(e) {
    super(e.error.message), this.data = void 0, this.data = e;
  }
}
class to {
  constructor(e, t) {
    this.subtle = void 0, this.aesIV = void 0, this.subtle = e, this.aesIV = t;
  }
  decrypt(e, t) {
    return this.subtle.decrypt({
      name: "AES-CBC",
      iv: this.aesIV
    }, t, e);
  }
}
class so {
  constructor(e, t) {
    this.subtle = void 0, this.key = void 0, this.subtle = e, this.key = t;
  }
  expandKey() {
    return this.subtle.importKey("raw", this.key, {
      name: "AES-CBC"
    }, !1, ["encrypt", "decrypt"]);
  }
}
function io(a) {
  const e = a.byteLength, t = e && new DataView(a.buffer).getUint8(e - 1);
  return t ? $e(a, 0, e - t) : a;
}
class no {
  constructor() {
    this.rcon = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], this.subMix = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)], this.invSubMix = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)], this.sBox = new Uint32Array(256), this.invSBox = new Uint32Array(256), this.key = new Uint32Array(0), this.ksRows = 0, this.keySize = 0, this.keySchedule = void 0, this.invKeySchedule = void 0, this.initTable();
  }
  // Using view.getUint32() also swaps the byte order.
  uint8ArrayToUint32Array_(e) {
    const t = new DataView(e), s = new Uint32Array(4);
    for (let i = 0; i < 4; i++)
      s[i] = t.getUint32(i * 4);
    return s;
  }
  initTable() {
    const e = this.sBox, t = this.invSBox, s = this.subMix, i = s[0], n = s[1], r = s[2], o = s[3], l = this.invSubMix, c = l[0], h = l[1], u = l[2], d = l[3], f = new Uint32Array(256);
    let m = 0, p = 0, g = 0;
    for (g = 0; g < 256; g++)
      g < 128 ? f[g] = g << 1 : f[g] = g << 1 ^ 283;
    for (g = 0; g < 256; g++) {
      let v = p ^ p << 1 ^ p << 2 ^ p << 3 ^ p << 4;
      v = v >>> 8 ^ v & 255 ^ 99, e[m] = v, t[v] = m;
      const C = f[m], E = f[C], T = f[E];
      let x = f[v] * 257 ^ v * 16843008;
      i[m] = x << 24 | x >>> 8, n[m] = x << 16 | x >>> 16, r[m] = x << 8 | x >>> 24, o[m] = x, x = T * 16843009 ^ E * 65537 ^ C * 257 ^ m * 16843008, c[v] = x << 24 | x >>> 8, h[v] = x << 16 | x >>> 16, u[v] = x << 8 | x >>> 24, d[v] = x, m ? (m = C ^ f[f[f[T ^ C]]], p ^= f[f[p]]) : m = p = 1;
    }
  }
  expandKey(e) {
    const t = this.uint8ArrayToUint32Array_(e);
    let s = !0, i = 0;
    for (; i < t.length && s; )
      s = t[i] === this.key[i], i++;
    if (s)
      return;
    this.key = t;
    const n = this.keySize = t.length;
    if (n !== 4 && n !== 6 && n !== 8)
      throw new Error("Invalid aes key size=" + n);
    const r = this.ksRows = (n + 6 + 1) * 4;
    let o, l;
    const c = this.keySchedule = new Uint32Array(r), h = this.invKeySchedule = new Uint32Array(r), u = this.sBox, d = this.rcon, f = this.invSubMix, m = f[0], p = f[1], g = f[2], v = f[3];
    let C, E;
    for (o = 0; o < r; o++) {
      if (o < n) {
        C = c[o] = t[o];
        continue;
      }
      E = C, o % n === 0 ? (E = E << 8 | E >>> 24, E = u[E >>> 24] << 24 | u[E >>> 16 & 255] << 16 | u[E >>> 8 & 255] << 8 | u[E & 255], E ^= d[o / n | 0] << 24) : n > 6 && o % n === 4 && (E = u[E >>> 24] << 24 | u[E >>> 16 & 255] << 16 | u[E >>> 8 & 255] << 8 | u[E & 255]), c[o] = C = (c[o - n] ^ E) >>> 0;
    }
    for (l = 0; l < r; l++)
      o = r - l, l & 3 ? E = c[o] : E = c[o - 4], l < 4 || o <= 4 ? h[l] = E : h[l] = m[u[E >>> 24]] ^ p[u[E >>> 16 & 255]] ^ g[u[E >>> 8 & 255]] ^ v[u[E & 255]], h[l] = h[l] >>> 0;
  }
  // Adding this as a method greatly improves performance.
  networkToHostOrderSwap(e) {
    return e << 24 | (e & 65280) << 8 | (e & 16711680) >> 8 | e >>> 24;
  }
  decrypt(e, t, s) {
    const i = this.keySize + 6, n = this.invKeySchedule, r = this.invSBox, o = this.invSubMix, l = o[0], c = o[1], h = o[2], u = o[3], d = this.uint8ArrayToUint32Array_(s);
    let f = d[0], m = d[1], p = d[2], g = d[3];
    const v = new Int32Array(e), C = new Int32Array(v.length);
    let E, T, x, I, L, w, R, k, M, _, P, G, B, U;
    const Z = this.networkToHostOrderSwap;
    for (; t < v.length; ) {
      for (M = Z(v[t]), _ = Z(v[t + 1]), P = Z(v[t + 2]), G = Z(v[t + 3]), L = M ^ n[0], w = G ^ n[1], R = P ^ n[2], k = _ ^ n[3], B = 4, U = 1; U < i; U++)
        E = l[L >>> 24] ^ c[w >> 16 & 255] ^ h[R >> 8 & 255] ^ u[k & 255] ^ n[B], T = l[w >>> 24] ^ c[R >> 16 & 255] ^ h[k >> 8 & 255] ^ u[L & 255] ^ n[B + 1], x = l[R >>> 24] ^ c[k >> 16 & 255] ^ h[L >> 8 & 255] ^ u[w & 255] ^ n[B + 2], I = l[k >>> 24] ^ c[L >> 16 & 255] ^ h[w >> 8 & 255] ^ u[R & 255] ^ n[B + 3], L = E, w = T, R = x, k = I, B = B + 4;
      E = r[L >>> 24] << 24 ^ r[w >> 16 & 255] << 16 ^ r[R >> 8 & 255] << 8 ^ r[k & 255] ^ n[B], T = r[w >>> 24] << 24 ^ r[R >> 16 & 255] << 16 ^ r[k >> 8 & 255] << 8 ^ r[L & 255] ^ n[B + 1], x = r[R >>> 24] << 24 ^ r[k >> 16 & 255] << 16 ^ r[L >> 8 & 255] << 8 ^ r[w & 255] ^ n[B + 2], I = r[k >>> 24] << 24 ^ r[L >> 16 & 255] << 16 ^ r[w >> 8 & 255] << 8 ^ r[R & 255] ^ n[B + 3], C[t] = Z(E ^ f), C[t + 1] = Z(I ^ m), C[t + 2] = Z(x ^ p), C[t + 3] = Z(T ^ g), f = M, m = _, p = P, g = G, t = t + 4;
    }
    return C.buffer;
  }
}
const ro = 16;
class Ms {
  constructor(e, {
    removePKCS7Padding: t = !0
  } = {}) {
    if (this.logEnabled = !0, this.removePKCS7Padding = void 0, this.subtle = null, this.softwareDecrypter = null, this.key = null, this.fastAesKey = null, this.remainderData = null, this.currentIV = null, this.currentResult = null, this.useSoftware = void 0, this.useSoftware = e.enableSoftwareAES, this.removePKCS7Padding = t, t)
      try {
        const s = self.crypto;
        s && (this.subtle = s.subtle || s.webkitSubtle);
      } catch {
      }
    this.useSoftware = !this.subtle;
  }
  destroy() {
    this.subtle = null, this.softwareDecrypter = null, this.key = null, this.fastAesKey = null, this.remainderData = null, this.currentIV = null, this.currentResult = null;
  }
  isSync() {
    return this.useSoftware;
  }
  flush() {
    const {
      currentResult: e,
      remainderData: t
    } = this;
    if (!e || t)
      return this.reset(), null;
    const s = new Uint8Array(e);
    return this.reset(), this.removePKCS7Padding ? io(s) : s;
  }
  reset() {
    this.currentResult = null, this.currentIV = null, this.remainderData = null, this.softwareDecrypter && (this.softwareDecrypter = null);
  }
  decrypt(e, t, s) {
    return this.useSoftware ? new Promise((i, n) => {
      this.softwareDecrypt(new Uint8Array(e), t, s);
      const r = this.flush();
      r ? i(r.buffer) : n(new Error("[softwareDecrypt] Failed to decrypt data"));
    }) : this.webCryptoDecrypt(new Uint8Array(e), t, s);
  }
  // Software decryption is progressive. Progressive decryption may not return a result on each call. Any cached
  // data is handled in the flush() call
  softwareDecrypt(e, t, s) {
    const {
      currentIV: i,
      currentResult: n,
      remainderData: r
    } = this;
    this.logOnce("JS AES decrypt"), r && (e = ve(r, e), this.remainderData = null);
    const o = this.getValidChunk(e);
    if (!o.length)
      return null;
    i && (s = i);
    let l = this.softwareDecrypter;
    l || (l = this.softwareDecrypter = new no()), l.expandKey(t);
    const c = n;
    return this.currentResult = l.decrypt(o.buffer, 0, s), this.currentIV = $e(o, -16).buffer, c || null;
  }
  webCryptoDecrypt(e, t, s) {
    if (this.key !== t || !this.fastAesKey) {
      if (!this.subtle)
        return Promise.resolve(this.onWebCryptoError(e, t, s));
      this.key = t, this.fastAesKey = new so(this.subtle, t);
    }
    return this.fastAesKey.expandKey().then((i) => this.subtle ? (this.logOnce("WebCrypto AES decrypt"), new to(this.subtle, new Uint8Array(s)).decrypt(e.buffer, i)) : Promise.reject(new Error("web crypto not initialized"))).catch((i) => (S.warn(`[decrypter]: WebCrypto Error, disable WebCrypto API, ${i.name}: ${i.message}`), this.onWebCryptoError(e, t, s)));
  }
  onWebCryptoError(e, t, s) {
    this.useSoftware = !0, this.logEnabled = !0, this.softwareDecrypt(e, t, s);
    const i = this.flush();
    if (i)
      return i.buffer;
    throw new Error("WebCrypto and softwareDecrypt: failed to decrypt data");
  }
  getValidChunk(e) {
    let t = e;
    const s = e.length - e.length % ro;
    return s !== e.length && (t = $e(e, 0, s), this.remainderData = $e(e, s)), t;
  }
  logOnce(e) {
    this.logEnabled && (S.log(`[decrypter]: ${e}`), this.logEnabled = !1);
  }
}
const ao = {
  toString: function(a) {
    let e = "";
    const t = a.length;
    for (let s = 0; s < t; s++)
      e += `[${a.start(s).toFixed(3)}-${a.end(s).toFixed(3)}]`;
    return e;
  }
}, D = {
  STOPPED: "STOPPED",
  IDLE: "IDLE",
  KEY_LOADING: "KEY_LOADING",
  FRAG_LOADING: "FRAG_LOADING",
  FRAG_LOADING_WAITING_RETRY: "FRAG_LOADING_WAITING_RETRY",
  WAITING_TRACK: "WAITING_TRACK",
  PARSING: "PARSING",
  PARSED: "PARSED",
  ENDED: "ENDED",
  ERROR: "ERROR",
  WAITING_INIT_PTS: "WAITING_INIT_PTS",
  WAITING_LEVEL: "WAITING_LEVEL"
};
class Ps extends Ya {
  constructor(e, t, s, i, n) {
    super(), this.hls = void 0, this.fragPrevious = null, this.fragCurrent = null, this.fragmentTracker = void 0, this.transmuxer = null, this._state = D.STOPPED, this.playlistType = void 0, this.media = null, this.mediaBuffer = null, this.config = void 0, this.bitrateTest = !1, this.lastCurrentTime = 0, this.nextLoadPosition = 0, this.startPosition = 0, this.startTimeOffset = null, this.loadedmetadata = !1, this.retryDate = 0, this.levels = null, this.fragmentLoader = void 0, this.keyLoader = void 0, this.levelLastLoaded = null, this.startFragRequested = !1, this.decrypter = void 0, this.initPTS = [], this.onvseeking = null, this.onvended = null, this.logPrefix = "", this.log = void 0, this.warn = void 0, this.playlistType = n, this.logPrefix = i, this.log = S.log.bind(S, `${i}:`), this.warn = S.warn.bind(S, `${i}:`), this.hls = e, this.fragmentLoader = new eo(e.config), this.keyLoader = s, this.fragmentTracker = t, this.config = e.config, this.decrypter = new Ms(e.config), e.on(y.MANIFEST_LOADED, this.onManifestLoaded, this);
  }
  doTick() {
    this.onTickEnd();
  }
  onTickEnd() {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startLoad(e) {
  }
  stopLoad() {
    this.fragmentLoader.abort(), this.keyLoader.abort(this.playlistType);
    const e = this.fragCurrent;
    e != null && e.loader && (e.abortRequests(), this.fragmentTracker.removeFragment(e)), this.resetTransmuxer(), this.fragCurrent = null, this.fragPrevious = null, this.clearInterval(), this.clearNextTick(), this.state = D.STOPPED;
  }
  _streamEnded(e, t) {
    if (t.live || e.nextStart || !e.end || !this.media)
      return !1;
    const s = t.partList;
    if (s != null && s.length) {
      const n = s[s.length - 1];
      return ee.isBuffered(this.media, n.start + n.duration / 2);
    }
    const i = t.fragments[t.fragments.length - 1].type;
    return this.fragmentTracker.isEndListAppended(i);
  }
  getLevelDetails() {
    if (this.levels && this.levelLastLoaded !== null) {
      var e;
      return (e = this.levelLastLoaded) == null ? void 0 : e.details;
    }
  }
  onMediaAttached(e, t) {
    const s = this.media = this.mediaBuffer = t.media;
    this.onvseeking = this.onMediaSeeking.bind(this), this.onvended = this.onMediaEnded.bind(this), s.addEventListener("seeking", this.onvseeking), s.addEventListener("ended", this.onvended);
    const i = this.config;
    this.levels && i.autoStartLoad && this.state === D.STOPPED && this.startLoad(i.startPosition);
  }
  onMediaDetaching() {
    const e = this.media;
    e != null && e.ended && (this.log("MSE detaching and video ended, reset startPosition"), this.startPosition = this.lastCurrentTime = 0), e && this.onvseeking && this.onvended && (e.removeEventListener("seeking", this.onvseeking), e.removeEventListener("ended", this.onvended), this.onvseeking = this.onvended = null), this.keyLoader && this.keyLoader.detach(), this.media = this.mediaBuffer = null, this.loadedmetadata = !1, this.fragmentTracker.removeAllFragments(), this.stopLoad();
  }
  onMediaSeeking() {
    const {
      config: e,
      fragCurrent: t,
      media: s,
      mediaBuffer: i,
      state: n
    } = this, r = s ? s.currentTime : 0, o = ee.bufferInfo(i || s, r, e.maxBufferHole);
    if (this.log(`media seeking to ${O(r) ? r.toFixed(3) : r}, state: ${n}`), this.state === D.ENDED)
      this.resetLoadingState();
    else if (t) {
      const l = e.maxFragLookUpTolerance, c = t.start - l, h = t.start + t.duration + l;
      if (!o.len || h < o.start || c > o.end) {
        const u = r > h;
        (r < c || u) && (u && t.loader && (this.log("seeking outside of buffer while fragment load in progress, cancel fragment load"), t.abortRequests(), this.resetLoadingState()), this.fragPrevious = null);
      }
    }
    s && (this.fragmentTracker.removeFragmentsInRange(r, 1 / 0, this.playlistType, !0), this.lastCurrentTime = r), !this.loadedmetadata && !o.len && (this.nextLoadPosition = this.startPosition = r), this.tickImmediate();
  }
  onMediaEnded() {
    this.startPosition = this.lastCurrentTime = 0;
  }
  onManifestLoaded(e, t) {
    this.startTimeOffset = t.startTimeOffset, this.initPTS = [];
  }
  onHandlerDestroying() {
    this.hls.off(y.MANIFEST_LOADED, this.onManifestLoaded, this), this.stopLoad(), super.onHandlerDestroying(), this.hls = null;
  }
  onHandlerDestroyed() {
    this.state = D.STOPPED, this.fragmentLoader && this.fragmentLoader.destroy(), this.keyLoader && this.keyLoader.destroy(), this.decrypter && this.decrypter.destroy(), this.hls = this.log = this.warn = this.decrypter = this.keyLoader = this.fragmentLoader = this.fragmentTracker = null, super.onHandlerDestroyed();
  }
  loadFragment(e, t, s) {
    this._loadFragForPlayback(e, t, s);
  }
  _loadFragForPlayback(e, t, s) {
    const i = (n) => {
      if (this.fragContextChanged(e)) {
        this.warn(`Fragment ${e.sn}${n.part ? " p: " + n.part.index : ""} of level ${e.level} was dropped during download.`), this.fragmentTracker.removeFragment(e);
        return;
      }
      e.stats.chunkCount++, this._handleFragmentLoadProgress(n);
    };
    this._doFragLoad(e, t, s, i).then((n) => {
      if (!n)
        return;
      const r = this.state;
      if (this.fragContextChanged(e)) {
        (r === D.FRAG_LOADING || !this.fragCurrent && r === D.PARSING) && (this.fragmentTracker.removeFragment(e), this.state = D.IDLE);
        return;
      }
      "payload" in n && (this.log(`Loaded fragment ${e.sn} of level ${e.level}`), this.hls.trigger(y.FRAG_LOADED, n)), this._handleFragmentLoadComplete(n);
    }).catch((n) => {
      this.state === D.STOPPED || this.state === D.ERROR || (this.warn(`Frag error: ${(n == null ? void 0 : n.message) || n}`), this.resetFragmentLoading(e));
    });
  }
  clearTrackerIfNeeded(e) {
    var t;
    const {
      fragmentTracker: s
    } = this;
    if (s.getState(e) === le.APPENDING) {
      const n = e.type, r = this.getFwdBufferInfo(this.mediaBuffer, n), o = Math.max(e.duration, r ? r.len : this.config.maxBufferLength), l = this.backtrackFragment;
      ((l ? e.sn - l.sn : 0) === 1 || this.reduceMaxBufferLength(o, e.duration)) && s.removeFragment(e);
    } else
      ((t = this.mediaBuffer) == null ? void 0 : t.buffered.length) === 0 ? s.removeAllFragments() : s.hasParts(e.type) && (s.detectPartialFragments({
        frag: e,
        part: null,
        stats: e.stats,
        id: e.type
      }), s.getState(e) === le.PARTIAL && s.removeFragment(e));
  }
  checkLiveUpdate(e) {
    if (e.updated && !e.live) {
      const t = e.fragments[e.fragments.length - 1];
      this.fragmentTracker.detectPartialFragments({
        frag: t,
        part: null,
        stats: t.stats,
        id: t.type
      });
    }
    e.fragments[0] || (e.deltaUpdateFailed = !0);
  }
  flushMainBuffer(e, t, s = null) {
    if (!(e - t))
      return;
    const i = {
      startOffset: e,
      endOffset: t,
      type: s
    };
    this.hls.trigger(y.BUFFER_FLUSHING, i);
  }
  _loadInitSegment(e, t) {
    this._doFragLoad(e, t).then((s) => {
      if (!s || this.fragContextChanged(e) || !this.levels)
        throw new Error("init load aborted");
      return s;
    }).then((s) => {
      const {
        hls: i
      } = this, {
        payload: n
      } = s, r = e.decryptdata;
      if (n && n.byteLength > 0 && r != null && r.key && r.iv && r.method === "AES-128") {
        const o = self.performance.now();
        return this.decrypter.decrypt(new Uint8Array(n), r.key.buffer, r.iv.buffer).catch((l) => {
          throw i.trigger(y.ERROR, {
            type: K.MEDIA_ERROR,
            details: A.FRAG_DECRYPT_ERROR,
            fatal: !1,
            error: l,
            reason: l.message,
            frag: e
          }), l;
        }).then((l) => {
          const c = self.performance.now();
          return i.trigger(y.FRAG_DECRYPTED, {
            frag: e,
            payload: l,
            stats: {
              tstart: o,
              tdecrypt: c
            }
          }), s.payload = l, this.completeInitSegmentLoad(s);
        });
      }
      return this.completeInitSegmentLoad(s);
    }).catch((s) => {
      this.state === D.STOPPED || this.state === D.ERROR || (this.warn(s), this.resetFragmentLoading(e));
    });
  }
  completeInitSegmentLoad(e) {
    const {
      levels: t
    } = this;
    if (!t)
      throw new Error("init load aborted, missing levels");
    const s = e.frag.stats;
    this.state = D.IDLE, e.frag.data = new Uint8Array(e.payload), s.parsing.start = s.buffering.start = self.performance.now(), s.parsing.end = s.buffering.end = self.performance.now(), this.tick();
  }
  fragContextChanged(e) {
    const {
      fragCurrent: t
    } = this;
    return !e || !t || e.sn !== t.sn || e.level !== t.level;
  }
  fragBufferedComplete(e, t) {
    var s, i, n, r;
    const o = this.mediaBuffer ? this.mediaBuffer : this.media;
    if (this.log(`Buffered ${e.type} sn: ${e.sn}${t ? " part: " + t.index : ""} of ${this.playlistType === H.MAIN ? "level" : "track"} ${e.level} (frag:[${((s = e.startPTS) != null ? s : NaN).toFixed(3)}-${((i = e.endPTS) != null ? i : NaN).toFixed(3)}] > buffer:${o ? ao.toString(ee.getBuffered(o)) : "(detached)"})`), e.sn !== "initSegment") {
      var l;
      if (e.type !== H.SUBTITLE) {
        const h = e.elementaryStreams;
        if (!Object.keys(h).some((u) => !!h[u])) {
          this.state = D.IDLE;
          return;
        }
      }
      const c = (l = this.levels) == null ? void 0 : l[e.level];
      c != null && c.fragmentError && (this.log(`Resetting level fragment error count of ${c.fragmentError} on frag buffered`), c.fragmentError = 0);
    }
    this.state = D.IDLE, o && (!this.loadedmetadata && e.type == H.MAIN && o.buffered.length && ((n = this.fragCurrent) == null ? void 0 : n.sn) === ((r = this.fragPrevious) == null ? void 0 : r.sn) && (this.loadedmetadata = !0, this.seekToStartPos()), this.tick());
  }
  seekToStartPos() {
  }
  _handleFragmentLoadComplete(e) {
    const {
      transmuxer: t
    } = this;
    if (!t)
      return;
    const {
      frag: s,
      part: i,
      partsLoaded: n
    } = e, r = !n || n.length === 0 || n.some((l) => !l), o = new Ds(s.level, s.sn, s.stats.chunkCount + 1, 0, i ? i.index : -1, !r);
    t.flush(o);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _handleFragmentLoadProgress(e) {
  }
  _doFragLoad(e, t, s = null, i) {
    var n;
    const r = t == null ? void 0 : t.details;
    if (!this.levels || !r)
      throw new Error(`frag load aborted, missing level${r ? "" : " detail"}s`);
    let o = null;
    if (e.encrypted && !((n = e.decryptdata) != null && n.key) ? (this.log(`Loading key for ${e.sn} of [${r.startSN}-${r.endSN}], ${this.logPrefix === "[stream-controller]" ? "level" : "track"} ${e.level}`), this.state = D.KEY_LOADING, this.fragCurrent = e, o = this.keyLoader.load(e).then((h) => {
      if (!this.fragContextChanged(h.frag))
        return this.hls.trigger(y.KEY_LOADED, h), this.state === D.KEY_LOADING && (this.state = D.IDLE), h;
    }), this.hls.trigger(y.KEY_LOADING, {
      frag: e
    }), this.fragCurrent === null && (o = Promise.reject(new Error("frag load aborted, context changed in KEY_LOADING")))) : !e.encrypted && r.encryptedFragments.length && this.keyLoader.loadClear(e, r.encryptedFragments), s = Math.max(e.start, s || 0), this.config.lowLatencyMode && e.sn !== "initSegment") {
      const h = r.partList;
      if (h && i) {
        s > e.end && r.fragmentHint && (e = r.fragmentHint);
        const u = this.getNextPart(h, e, s);
        if (u > -1) {
          const d = h[u];
          this.log(`Loading part sn: ${e.sn} p: ${d.index} cc: ${e.cc} of playlist [${r.startSN}-${r.endSN}] parts [0-${u}-${h.length - 1}] ${this.logPrefix === "[stream-controller]" ? "level" : "track"}: ${e.level}, target: ${parseFloat(s.toFixed(3))}`), this.nextLoadPosition = d.start + d.duration, this.state = D.FRAG_LOADING;
          let f;
          return o ? f = o.then((m) => !m || this.fragContextChanged(m.frag) ? null : this.doFragPartsLoad(e, d, t, i)).catch((m) => this.handleFragLoadError(m)) : f = this.doFragPartsLoad(e, d, t, i).catch((m) => this.handleFragLoadError(m)), this.hls.trigger(y.FRAG_LOADING, {
            frag: e,
            part: d,
            targetBufferTime: s
          }), this.fragCurrent === null ? Promise.reject(new Error("frag load aborted, context changed in FRAG_LOADING parts")) : f;
        } else if (!e.url || this.loadedEndOfParts(h, s))
          return Promise.resolve(null);
      }
    }
    this.log(`Loading fragment ${e.sn} cc: ${e.cc} ${r ? "of [" + r.startSN + "-" + r.endSN + "] " : ""}${this.logPrefix === "[stream-controller]" ? "level" : "track"}: ${e.level}, target: ${parseFloat(s.toFixed(3))}`), O(e.sn) && !this.bitrateTest && (this.nextLoadPosition = e.start + e.duration), this.state = D.FRAG_LOADING;
    const l = this.config.progressive;
    let c;
    return l && o ? c = o.then((h) => !h || this.fragContextChanged(h == null ? void 0 : h.frag) ? null : this.fragmentLoader.load(e, i)).catch((h) => this.handleFragLoadError(h)) : c = Promise.all([this.fragmentLoader.load(e, l ? i : void 0), o]).then(([h]) => (!l && h && i && i(h), h)).catch((h) => this.handleFragLoadError(h)), this.hls.trigger(y.FRAG_LOADING, {
      frag: e,
      targetBufferTime: s
    }), this.fragCurrent === null ? Promise.reject(new Error("frag load aborted, context changed in FRAG_LOADING")) : c;
  }
  doFragPartsLoad(e, t, s, i) {
    return new Promise((n, r) => {
      var o;
      const l = [], c = (o = s.details) == null ? void 0 : o.partList, h = (u) => {
        this.fragmentLoader.loadPart(e, u, i).then((d) => {
          l[u.index] = d;
          const f = d.part;
          this.hls.trigger(y.FRAG_LOADED, d);
          const m = gi(s, e.sn, u.index + 1) || Tn(c, e.sn, u.index + 1);
          if (m)
            h(m);
          else
            return n({
              frag: e,
              part: f,
              partsLoaded: l
            });
        }).catch(r);
      };
      h(t);
    });
  }
  handleFragLoadError(e) {
    if ("data" in e) {
      const t = e.data;
      e.data && t.details === A.INTERNAL_ABORTED ? this.handleFragLoadAborted(t.frag, t.part) : this.hls.trigger(y.ERROR, t);
    } else
      this.hls.trigger(y.ERROR, {
        type: K.OTHER_ERROR,
        details: A.INTERNAL_EXCEPTION,
        err: e,
        error: e,
        fatal: !0
      });
    return null;
  }
  _handleTransmuxerFlush(e) {
    const t = this.getCurrentContext(e);
    if (!t || this.state !== D.PARSING) {
      !this.fragCurrent && this.state !== D.STOPPED && this.state !== D.ERROR && (this.state = D.IDLE);
      return;
    }
    const {
      frag: s,
      part: i,
      level: n
    } = t, r = self.performance.now();
    s.stats.parsing.end = r, i && (i.stats.parsing.end = r), this.updateLevelTiming(s, i, n, e.partial);
  }
  getCurrentContext(e) {
    const {
      levels: t,
      fragCurrent: s
    } = this, {
      level: i,
      sn: n,
      part: r
    } = e;
    if (!(t != null && t[i]))
      return this.warn(`Levels object was unset while buffering fragment ${n} of level ${i}. The current chunk will not be buffered.`), null;
    const o = t[i], l = r > -1 ? gi(o, n, r) : null, c = l ? l.fragment : Ia(o, n, s);
    return c ? (s && s !== c && (c.stats = s.stats), {
      frag: c,
      part: l,
      level: o
    }) : null;
  }
  bufferFragmentData(e, t, s, i, n) {
    var r;
    if (!e || this.state !== D.PARSING)
      return;
    const {
      data1: o,
      data2: l
    } = e;
    let c = o;
    if (o && l && (c = ve(o, l)), !((r = c) != null && r.length))
      return;
    const h = {
      type: e.type,
      frag: t,
      part: s,
      chunkMeta: i,
      parent: t.type,
      data: c
    };
    if (this.hls.trigger(y.BUFFER_APPENDING, h), e.dropped && e.independent && !s) {
      if (n)
        return;
      this.flushBufferGap(t);
    }
  }
  flushBufferGap(e) {
    const t = this.media;
    if (!t)
      return;
    if (!ee.isBuffered(t, t.currentTime)) {
      this.flushMainBuffer(0, e.start);
      return;
    }
    const s = t.currentTime, i = ee.bufferInfo(t, s, 0), n = e.duration, r = Math.min(this.config.maxFragLookUpTolerance * 2, n * 0.25), o = Math.max(Math.min(e.start - r, i.end - r), s + r);
    e.start - o > r && this.flushMainBuffer(o, e.start);
  }
  getFwdBufferInfo(e, t) {
    const s = this.getLoadPosition();
    return O(s) ? this.getFwdBufferInfoAtPos(e, s, t) : null;
  }
  getFwdBufferInfoAtPos(e, t, s) {
    const {
      config: {
        maxBufferHole: i
      }
    } = this, n = ee.bufferInfo(e, t, i);
    if (n.len === 0 && n.nextStart !== void 0) {
      const r = this.fragmentTracker.getBufferedFrag(t, s);
      if (r && n.nextStart < r.end)
        return ee.bufferInfo(e, t, Math.max(n.nextStart, i));
    }
    return n;
  }
  getMaxBufferLength(e) {
    const {
      config: t
    } = this;
    let s;
    return e ? s = Math.max(8 * t.maxBufferSize / e, t.maxBufferLength) : s = t.maxBufferLength, Math.min(s, t.maxMaxBufferLength);
  }
  reduceMaxBufferLength(e, t) {
    const s = this.config, i = Math.max(Math.min(e - t, s.maxBufferLength), t), n = Math.max(e - t * 3, s.maxMaxBufferLength / 2, i);
    return n >= i ? (s.maxMaxBufferLength = n, this.warn(`Reduce max buffer length to ${n}s`), !0) : !1;
  }
  getAppendedFrag(e, t = H.MAIN) {
    const s = this.fragmentTracker.getAppendedFrag(e, H.MAIN);
    return s && "fragment" in s ? s.fragment : s;
  }
  getNextFragment(e, t) {
    const s = t.fragments, i = s.length;
    if (!i)
      return null;
    const {
      config: n
    } = this, r = s[0].start;
    let o;
    if (t.live) {
      const l = n.initialLiveManifestSize;
      if (i < l)
        return this.warn(`Not enough fragments to start playback (have: ${i}, need: ${l})`), null;
      (!t.PTSKnown && !this.startFragRequested && this.startPosition === -1 || e < r) && (o = this.getInitialLiveFragment(t, s), this.startPosition = this.nextLoadPosition = o ? this.hls.liveSyncPosition || o.start : e);
    } else
      e <= r && (o = s[0]);
    if (!o) {
      const l = n.lowLatencyMode ? t.partEnd : t.fragmentEnd;
      o = this.getFragmentAtPosition(e, l, t);
    }
    return this.mapToInitFragWhenRequired(o);
  }
  isLoopLoading(e, t) {
    const s = this.fragmentTracker.getState(e);
    return (s === le.OK || s === le.PARTIAL && !!e.gap) && this.nextLoadPosition > t;
  }
  getNextFragmentLoopLoading(e, t, s, i, n) {
    const r = e.gap, o = this.getNextFragment(this.nextLoadPosition, t);
    if (o === null)
      return o;
    if (e = o, r && e && !e.gap && s.nextStart) {
      const l = this.getFwdBufferInfoAtPos(this.mediaBuffer ? this.mediaBuffer : this.media, s.nextStart, i);
      if (l !== null && s.len + l.len >= n)
        return this.log(`buffer full after gaps in "${i}" playlist starting at sn: ${e.sn}`), null;
    }
    return e;
  }
  mapToInitFragWhenRequired(e) {
    return e != null && e.initSegment && !(e != null && e.initSegment.data) && !this.bitrateTest ? e.initSegment : e;
  }
  getNextPart(e, t, s) {
    let i = -1, n = !1, r = !0;
    for (let o = 0, l = e.length; o < l; o++) {
      const c = e[o];
      if (r = r && !c.independent, i > -1 && s < c.start)
        break;
      const h = c.loaded;
      h ? i = -1 : (n || c.independent || r) && c.fragment === t && (i = o), n = h;
    }
    return i;
  }
  loadedEndOfParts(e, t) {
    const s = e[e.length - 1];
    return s && t > s.start && s.loaded;
  }
  /*
   This method is used find the best matching first fragment for a live playlist. This fragment is used to calculate the
   "sliding" of the playlist, which is its offset from the start of playback. After sliding we can compute the real
   start and end times for each fragment in the playlist (after which this method will not need to be called).
  */
  getInitialLiveFragment(e, t) {
    const s = this.fragPrevious;
    let i = null;
    if (s) {
      if (e.hasProgramDateTime && (this.log(`Live playlist, switching playlist, load frag with same PDT: ${s.programDateTime}`), i = ka(t, s.endProgramDateTime, this.config.maxFragLookUpTolerance)), !i) {
        const n = s.sn + 1;
        if (n >= e.startSN && n <= e.endSN) {
          const r = t[n - e.startSN];
          s.cc === r.cc && (i = r, this.log(`Live playlist, switching playlist, load frag with next SN: ${i.sn}`));
        }
        i || (i = Pa(t, s.cc), i && this.log(`Live playlist, switching playlist, load frag with same CC: ${i.sn}`));
      }
    } else {
      const n = this.hls.liveSyncPosition;
      n !== null && (i = this.getFragmentAtPosition(n, this.bitrateTest ? e.fragmentEnd : e.edge, e));
    }
    return i;
  }
  /*
  This method finds the best matching fragment given the provided position.
   */
  getFragmentAtPosition(e, t, s) {
    const {
      config: i
    } = this;
    let {
      fragPrevious: n
    } = this, {
      fragments: r,
      endSN: o
    } = s;
    const {
      fragmentHint: l
    } = s, {
      maxFragLookUpTolerance: c
    } = i, h = s.partList, u = !!(i.lowLatencyMode && h != null && h.length && l);
    u && l && !this.bitrateTest && (r = r.concat(l), o = l.sn);
    let d;
    if (e < t) {
      const f = e > t - c ? 0 : c;
      d = Ft(n, r, e, f);
    } else
      d = r[r.length - 1];
    if (d) {
      const f = d.sn - s.startSN, m = this.fragmentTracker.getState(d);
      if ((m === le.OK || m === le.PARTIAL && d.gap) && (n = d), n && d.sn === n.sn && (!u || h[0].fragment.sn > d.sn) && n && d.level === n.level) {
        const g = r[f + 1];
        d.sn < o && this.fragmentTracker.getState(g) !== le.OK ? d = g : d = null;
      }
    }
    return d;
  }
  synchronizeToLiveEdge(e) {
    const {
      config: t,
      media: s
    } = this;
    if (!s)
      return;
    const i = this.hls.liveSyncPosition, n = s.currentTime, r = e.fragments[0].start, o = e.edge, l = n >= r - t.maxFragLookUpTolerance && n <= o;
    if (i !== null && s.duration > i && (n < i || !l)) {
      const c = t.liveMaxLatencyDuration !== void 0 ? t.liveMaxLatencyDuration : t.liveMaxLatencyDurationCount * e.targetduration;
      (!l && s.readyState < 4 || n < o - c) && (this.loadedmetadata || (this.nextLoadPosition = i), s.readyState && (this.warn(`Playback: ${n.toFixed(3)} is located too far from the end of live sliding playlist: ${o}, reset currentTime to : ${i.toFixed(3)}`), s.currentTime = i));
    }
  }
  alignPlaylists(e, t, s) {
    const i = e.fragments.length;
    if (!i)
      return this.warn("No fragments in live playlist"), 0;
    const n = e.fragments[0].start, r = !t, o = e.alignedSliding && O(n);
    if (r || !o && !n) {
      const {
        fragPrevious: l
      } = this;
      Qa(l, s, e);
      const c = e.fragments[0].start;
      return this.log(`Live playlist sliding: ${c.toFixed(2)} start-sn: ${t ? t.startSN : "na"}->${e.startSN} prev-sn: ${l ? l.sn : "na"} fragments: ${i}`), c;
    }
    return n;
  }
  waitForCdnTuneIn(e) {
    return e.live && e.canBlockReload && e.partTarget && e.tuneInGoal > Math.max(e.partHoldBack, e.partTarget * 3);
  }
  setStartPosition(e, t) {
    let s = this.startPosition;
    if (s < t && (s = -1), s === -1 || this.lastCurrentTime === -1) {
      const i = this.startTimeOffset !== null, n = i ? this.startTimeOffset : e.startTimeOffset;
      n !== null && O(n) ? (s = t + n, n < 0 && (s += e.totalduration), s = Math.min(Math.max(t, s), t + e.totalduration), this.log(`Start time offset ${n} found in ${i ? "multivariant" : "media"} playlist, adjust startPosition to ${s}`), this.startPosition = s) : e.live ? s = this.hls.liveSyncPosition || t : this.startPosition = s = 0, this.lastCurrentTime = s;
    }
    this.nextLoadPosition = s;
  }
  getLoadPosition() {
    const {
      media: e
    } = this;
    let t = 0;
    return this.loadedmetadata && e ? t = e.currentTime : this.nextLoadPosition && (t = this.nextLoadPosition), t;
  }
  handleFragLoadAborted(e, t) {
    this.transmuxer && e.sn !== "initSegment" && e.stats.aborted && (this.warn(`Fragment ${e.sn}${t ? " part " + t.index : ""} of level ${e.level} was aborted`), this.resetFragmentLoading(e));
  }
  resetFragmentLoading(e) {
    (!this.fragCurrent || !this.fragContextChanged(e) && this.state !== D.FRAG_LOADING_WAITING_RETRY) && (this.state = D.IDLE);
  }
  onFragmentOrKeyLoadError(e, t) {
    if (t.chunkMeta && !t.frag) {
      const h = this.getCurrentContext(t.chunkMeta);
      h && (t.frag = h.frag);
    }
    const s = t.frag;
    if (!s || s.type !== e || !this.levels)
      return;
    if (this.fragContextChanged(s)) {
      var i;
      this.warn(`Frag load error must match current frag to retry ${s.url} > ${(i = this.fragCurrent) == null ? void 0 : i.url}`);
      return;
    }
    const n = t.details === A.FRAG_GAP;
    n && this.fragmentTracker.fragBuffered(s, !0);
    const r = t.errorAction, {
      action: o,
      retryCount: l = 0,
      retryConfig: c
    } = r || {};
    if (r && o === ue.RetryRequest && c) {
      this.resetStartWhenNotLoaded(this.levelLastLoaded);
      const h = Rs(c, l);
      this.warn(`Fragment ${s.sn} of ${e} ${s.level} errored with ${t.details}, retrying loading ${l + 1}/${c.maxNumRetry} in ${h}ms`), r.resolved = !0, this.retryDate = self.performance.now() + h, this.state = D.FRAG_LOADING_WAITING_RETRY;
    } else if (c && r)
      if (this.resetFragmentErrors(e), l < c.maxNumRetry)
        !n && o !== ue.RemoveAlternatePermanently && (r.resolved = !0);
      else {
        S.warn(`${t.details} reached or exceeded max retry (${l})`);
        return;
      }
    else
      (r == null ? void 0 : r.action) === ue.SendAlternateToPenaltyBox ? this.state = D.WAITING_LEVEL : this.state = D.ERROR;
    this.tickImmediate();
  }
  reduceLengthAndFlushBuffer(e) {
    if (this.state === D.PARSING || this.state === D.PARSED) {
      const t = e.frag, s = e.parent, i = this.getFwdBufferInfo(this.mediaBuffer, s), n = i && i.len > 0.5;
      n && this.reduceMaxBufferLength(i.len, (t == null ? void 0 : t.duration) || 10);
      const r = !n;
      return r && this.warn(`Buffer full error while media.currentTime is not buffered, flush ${s} buffer`), t && (this.fragmentTracker.removeFragment(t), this.nextLoadPosition = t.start), this.resetLoadingState(), r;
    }
    return !1;
  }
  resetFragmentErrors(e) {
    e === H.AUDIO && (this.fragCurrent = null), this.loadedmetadata || (this.startFragRequested = !1), this.state !== D.STOPPED && (this.state = D.IDLE);
  }
  afterBufferFlushed(e, t, s) {
    if (!e)
      return;
    const i = ee.getBuffered(e);
    this.fragmentTracker.detectEvictedFragments(t, i, s), this.state === D.ENDED && this.resetLoadingState();
  }
  resetLoadingState() {
    this.log("Reset loading state"), this.fragCurrent = null, this.fragPrevious = null, this.state = D.IDLE;
  }
  resetStartWhenNotLoaded(e) {
    if (!this.loadedmetadata) {
      this.startFragRequested = !1;
      const t = e ? e.details : null;
      t != null && t.live ? (this.startPosition = -1, this.setStartPosition(t, 0), this.resetLoadingState()) : this.nextLoadPosition = this.startPosition;
    }
  }
  resetWhenMissingContext(e) {
    this.warn(`The loading context changed while buffering fragment ${e.sn} of level ${e.level}. This chunk will not be buffered.`), this.removeUnbufferedFrags(), this.resetStartWhenNotLoaded(this.levelLastLoaded), this.resetLoadingState();
  }
  removeUnbufferedFrags(e = 0) {
    this.fragmentTracker.removeFragmentsInRange(e, 1 / 0, this.playlistType, !1, !0);
  }
  updateLevelTiming(e, t, s, i) {
    var n;
    const r = s.details;
    if (!r) {
      this.warn("level.details undefined");
      return;
    }
    if (!Object.keys(e.elementaryStreams).reduce((l, c) => {
      const h = e.elementaryStreams[c];
      if (h) {
        const u = h.endPTS - h.startPTS;
        if (u <= 0)
          return this.warn(`Could not parse fragment ${e.sn} ${c} duration reliably (${u})`), l || !1;
        const d = i ? 0 : vn(r, e, h.startPTS, h.endPTS, h.startDTS, h.endDTS);
        return this.hls.trigger(y.LEVEL_PTS_UPDATED, {
          details: r,
          level: s,
          drift: d,
          type: c,
          frag: e,
          start: h.startPTS,
          end: h.endPTS
        }), !0;
      }
      return l;
    }, !1) && ((n = this.transmuxer) == null ? void 0 : n.error) === null) {
      const l = new Error(`Found no media in fragment ${e.sn} of level ${e.level} resetting transmuxer to fallback to playlist timing`);
      if (s.fragmentError === 0 && (s.fragmentError++, e.gap = !0, this.fragmentTracker.removeFragment(e), this.fragmentTracker.fragBuffered(e, !0)), this.warn(l.message), this.hls.trigger(y.ERROR, {
        type: K.MEDIA_ERROR,
        details: A.FRAG_PARSING_ERROR,
        fatal: !1,
        error: l,
        frag: e,
        reason: `Found no media in msn ${e.sn} of level "${s.url}"`
      }), !this.hls)
        return;
      this.resetTransmuxer();
    }
    this.state = D.PARSED, this.hls.trigger(y.FRAG_PARSED, {
      frag: e,
      part: t
    });
  }
  resetTransmuxer() {
    this.transmuxer && (this.transmuxer.destroy(), this.transmuxer = null);
  }
  recoverWorkerError(e) {
    e.event === "demuxerWorker" && (this.fragmentTracker.removeAllFragments(), this.resetTransmuxer(), this.resetStartWhenNotLoaded(this.levelLastLoaded), this.resetLoadingState());
  }
  set state(e) {
    const t = this._state;
    t !== e && (this._state = e, this.log(`${t}->${e}`));
  }
  get state() {
    return this._state;
  }
}
class Ln {
  constructor() {
    this.chunks = [], this.dataLength = 0;
  }
  push(e) {
    this.chunks.push(e), this.dataLength += e.length;
  }
  flush() {
    const {
      chunks: e,
      dataLength: t
    } = this;
    let s;
    if (e.length)
      e.length === 1 ? s = e[0] : s = oo(e, t);
    else
      return new Uint8Array(0);
    return this.reset(), s;
  }
  reset() {
    this.chunks.length = 0, this.dataLength = 0;
  }
}
function oo(a, e) {
  const t = new Uint8Array(e);
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const n = a[i];
    t.set(n, s), s += n.length;
  }
  return t;
}
function lo() {
  return typeof __HLS_WORKER_BUNDLE__ == "function";
}
function co() {
  const a = new self.Blob([`var exports={};var module={exports:exports};function define(f){f()};define.amd=true;(${__HLS_WORKER_BUNDLE__.toString()})(true);`], {
    type: "text/javascript"
  }), e = self.URL.createObjectURL(a);
  return {
    worker: new self.Worker(e),
    objectURL: e
  };
}
function ho(a) {
  const e = new self.URL(a, self.location.href).href;
  return {
    worker: new self.Worker(e),
    scriptURL: e
  };
}
function Le(a = "", e = 9e4) {
  return {
    type: a,
    id: -1,
    pid: -1,
    inputTimeScale: e,
    sequenceNumber: -1,
    samples: [],
    dropped: 0
  };
}
class Fs {
  constructor() {
    this._audioTrack = void 0, this._id3Track = void 0, this.frameIndex = 0, this.cachedData = null, this.basePTS = null, this.initPTS = null, this.lastPTS = null;
  }
  resetInitSegment(e, t, s, i) {
    this._id3Track = {
      type: "id3",
      id: 3,
      pid: -1,
      inputTimeScale: 9e4,
      sequenceNumber: 0,
      samples: [],
      dropped: 0
    };
  }
  resetTimeStamp(e) {
    this.initPTS = e, this.resetContiguity();
  }
  resetContiguity() {
    this.basePTS = null, this.lastPTS = null, this.frameIndex = 0;
  }
  canParse(e, t) {
    return !1;
  }
  appendFrame(e, t, s) {
  }
  // feed incoming data to the front of the parsing pipeline
  demux(e, t) {
    this.cachedData && (e = ve(this.cachedData, e), this.cachedData = null);
    let s = nt(e, 0), i = s ? s.length : 0, n;
    const r = this._audioTrack, o = this._id3Track, l = s ? Is(s) : void 0, c = e.length;
    for ((this.basePTS === null || this.frameIndex === 0 && O(l)) && (this.basePTS = uo(l, t, this.initPTS), this.lastPTS = this.basePTS), this.lastPTS === null && (this.lastPTS = this.basePTS), s && s.length > 0 && o.samples.push({
      pts: this.lastPTS,
      dts: this.lastPTS,
      data: s,
      type: Ee.audioId3,
      duration: Number.POSITIVE_INFINITY
    }); i < c; ) {
      if (this.canParse(e, i)) {
        const h = this.appendFrame(r, e, i);
        h ? (this.frameIndex++, this.lastPTS = h.sample.pts, i += h.length, n = i) : i = c;
      } else
        Pr(e, i) ? (s = nt(e, i), o.samples.push({
          pts: this.lastPTS,
          dts: this.lastPTS,
          data: s,
          type: Ee.audioId3,
          duration: Number.POSITIVE_INFINITY
        }), i += s.length, n = i) : i++;
      if (i === c && n !== c) {
        const h = $e(e, n);
        this.cachedData ? this.cachedData = ve(this.cachedData, h) : this.cachedData = h;
      }
    }
    return {
      audioTrack: r,
      videoTrack: Le(),
      id3Track: o,
      textTrack: Le()
    };
  }
  demuxSampleAes(e, t, s) {
    return Promise.reject(new Error(`[${this}] This demuxer does not support Sample-AES decryption`));
  }
  flush(e) {
    const t = this.cachedData;
    return t && (this.cachedData = null, this.demux(t, 0)), {
      audioTrack: this._audioTrack,
      videoTrack: Le(),
      id3Track: this._id3Track,
      textTrack: Le()
    };
  }
  destroy() {
  }
}
const uo = (a, e, t) => {
  if (O(a))
    return a * 90;
  const s = t ? t.baseTime * 9e4 / t.timescale : 0;
  return e * 9e4 + s;
};
function fo(a, e, t, s) {
  let i, n, r, o;
  const l = navigator.userAgent.toLowerCase(), c = s, h = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350];
  i = ((e[t + 2] & 192) >>> 6) + 1;
  const u = (e[t + 2] & 60) >>> 2;
  if (u > h.length - 1) {
    const d = new Error(`invalid ADTS sampling index:${u}`);
    a.emit(y.ERROR, y.ERROR, {
      type: K.MEDIA_ERROR,
      details: A.FRAG_PARSING_ERROR,
      fatal: !0,
      error: d,
      reason: d.message
    });
    return;
  }
  return r = (e[t + 2] & 1) << 2, r |= (e[t + 3] & 192) >>> 6, S.log(`manifest codec:${s}, ADTS type:${i}, samplingIndex:${u}`), /firefox/i.test(l) ? u >= 6 ? (i = 5, o = new Array(4), n = u - 3) : (i = 2, o = new Array(2), n = u) : l.indexOf("android") !== -1 ? (i = 2, o = new Array(2), n = u) : (i = 5, o = new Array(4), s && (s.indexOf("mp4a.40.29") !== -1 || s.indexOf("mp4a.40.5") !== -1) || !s && u >= 6 ? n = u - 3 : ((s && s.indexOf("mp4a.40.2") !== -1 && (u >= 6 && r === 1 || /vivaldi/i.test(l)) || !s && r === 1) && (i = 2, o = new Array(2)), n = u)), o[0] = i << 3, o[0] |= (u & 14) >> 1, o[1] |= (u & 1) << 7, o[1] |= r << 3, i === 5 && (o[1] |= (n & 14) >> 1, o[2] = (n & 1) << 7, o[2] |= 8, o[3] = 0), {
    config: o,
    samplerate: h[u],
    channelCount: r,
    codec: "mp4a.40." + i,
    manifestCodec: c
  };
}
function An(a, e) {
  return a[e] === 255 && (a[e + 1] & 246) === 240;
}
function wn(a, e) {
  return a[e + 1] & 1 ? 7 : 9;
}
function _s(a, e) {
  return (a[e + 3] & 3) << 11 | a[e + 4] << 3 | (a[e + 5] & 224) >>> 5;
}
function mo(a, e) {
  return e + 5 < a.length;
}
function Ot(a, e) {
  return e + 1 < a.length && An(a, e);
}
function po(a, e) {
  return mo(a, e) && An(a, e) && _s(a, e) <= a.length - e;
}
function go(a, e) {
  if (Ot(a, e)) {
    const t = wn(a, e);
    if (e + t >= a.length)
      return !1;
    const s = _s(a, e);
    if (s <= t)
      return !1;
    const i = e + s;
    return i === a.length || Ot(a, i);
  }
  return !1;
}
function In(a, e, t, s, i) {
  if (!a.samplerate) {
    const n = fo(e, t, s, i);
    if (!n)
      return;
    a.config = n.config, a.samplerate = n.samplerate, a.channelCount = n.channelCount, a.codec = n.codec, a.manifestCodec = n.manifestCodec, S.log(`parsed codec:${a.codec}, rate:${n.samplerate}, channels:${n.channelCount}`);
  }
}
function Rn(a) {
  return 1024 * 9e4 / a;
}
function yo(a, e) {
  const t = wn(a, e);
  if (e + t <= a.length) {
    const s = _s(a, e) - t;
    if (s > 0)
      return {
        headerLength: t,
        frameLength: s
      };
  }
}
function kn(a, e, t, s, i) {
  const n = Rn(a.samplerate), r = s + i * n, o = yo(e, t);
  let l;
  if (o) {
    const {
      frameLength: u,
      headerLength: d
    } = o, f = d + u, m = Math.max(0, t + f - e.length);
    m ? (l = new Uint8Array(f - d), l.set(e.subarray(t + d, e.length), 0)) : l = e.subarray(t + d, t + f);
    const p = {
      unit: l,
      pts: r
    };
    return m || a.samples.push(p), {
      sample: p,
      length: f,
      missing: m
    };
  }
  const c = e.length - t;
  return l = new Uint8Array(c), l.set(e.subarray(t, e.length), 0), {
    sample: {
      unit: l,
      pts: r
    },
    length: c,
    missing: -1
  };
}
let ft = null;
const vo = [32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160], Co = [44100, 48e3, 32e3, 22050, 24e3, 16e3, 11025, 12e3, 8e3], To = [
  // MPEG 2.5
  [
    0,
    // Reserved
    72,
    // Layer3
    144,
    // Layer2
    12
    // Layer1
  ],
  // Reserved
  [
    0,
    // Reserved
    0,
    // Layer3
    0,
    // Layer2
    0
    // Layer1
  ],
  // MPEG 2
  [
    0,
    // Reserved
    72,
    // Layer3
    144,
    // Layer2
    12
    // Layer1
  ],
  // MPEG 1
  [
    0,
    // Reserved
    144,
    // Layer3
    144,
    // Layer2
    12
    // Layer1
  ]
], Eo = [
  0,
  // Reserved
  1,
  // Layer3
  1,
  // Layer2
  4
  // Layer1
];
function Dn(a, e, t, s, i) {
  if (t + 24 > e.length)
    return;
  const n = Mn(e, t);
  if (n && t + n.frameLength <= e.length) {
    const r = n.samplesPerFrame * 9e4 / n.sampleRate, o = s + i * r, l = {
      unit: e.subarray(t, t + n.frameLength),
      pts: o,
      dts: o
    };
    return a.config = [], a.channelCount = n.channelCount, a.samplerate = n.sampleRate, a.samples.push(l), {
      sample: l,
      length: n.frameLength,
      missing: 0
    };
  }
}
function Mn(a, e) {
  const t = a[e + 1] >> 3 & 3, s = a[e + 1] >> 1 & 3, i = a[e + 2] >> 4 & 15, n = a[e + 2] >> 2 & 3;
  if (t !== 1 && i !== 0 && i !== 15 && n !== 3) {
    const r = a[e + 2] >> 1 & 1, o = a[e + 3] >> 6, l = t === 3 ? 3 - s : s === 3 ? 3 : 4, c = vo[l * 14 + i - 1] * 1e3, u = Co[(t === 3 ? 0 : t === 2 ? 1 : 2) * 3 + n], d = o === 3 ? 1 : 2, f = To[t][s], m = Eo[s], p = f * 8 * m, g = Math.floor(f * c / u + r) * m;
    if (ft === null) {
      const E = (navigator.userAgent || "").match(/Chrome\/(\d+)/i);
      ft = E ? parseInt(E[1]) : 0;
    }
    return !!ft && ft <= 87 && s === 2 && c >= 224e3 && o === 0 && (a[e + 3] = a[e + 3] | 128), {
      sampleRate: u,
      channelCount: d,
      frameLength: g,
      samplesPerFrame: p
    };
  }
}
function Os(a, e) {
  return a[e] === 255 && (a[e + 1] & 224) === 224 && (a[e + 1] & 6) !== 0;
}
function Pn(a, e) {
  return e + 1 < a.length && Os(a, e);
}
function xo(a, e) {
  return Os(a, e) && 4 <= a.length - e;
}
function Fn(a, e) {
  if (e + 1 < a.length && Os(a, e)) {
    const s = Mn(a, e);
    let i = 4;
    s != null && s.frameLength && (i = s.frameLength);
    const n = e + i;
    return n === a.length || Pn(a, n);
  }
  return !1;
}
class So extends Fs {
  constructor(e, t) {
    super(), this.observer = void 0, this.config = void 0, this.observer = e, this.config = t;
  }
  resetInitSegment(e, t, s, i) {
    super.resetInitSegment(e, t, s, i), this._audioTrack = {
      container: "audio/adts",
      type: "audio",
      id: 2,
      pid: -1,
      sequenceNumber: 0,
      segmentCodec: "aac",
      samples: [],
      manifestCodec: t,
      duration: i,
      inputTimeScale: 9e4,
      dropped: 0
    };
  }
  // Source for probe info - https://wiki.multimedia.cx/index.php?title=ADTS
  static probe(e) {
    if (!e)
      return !1;
    const t = nt(e, 0);
    let s = (t == null ? void 0 : t.length) || 0;
    if (Fn(e, s))
      return !1;
    for (let i = e.length; s < i; s++)
      if (go(e, s))
        return S.log("ADTS sync word found !"), !0;
    return !1;
  }
  canParse(e, t) {
    return po(e, t);
  }
  appendFrame(e, t, s) {
    In(e, this.observer, t, s, e.manifestCodec);
    const i = kn(e, t, s, this.basePTS, this.frameIndex);
    if (i && i.missing === 0)
      return i;
  }
}
const bo = /\/emsg[-/]ID3/i;
class Lo {
  constructor(e, t) {
    this.remainderData = null, this.timeOffset = 0, this.config = void 0, this.videoTrack = void 0, this.audioTrack = void 0, this.id3Track = void 0, this.txtTrack = void 0, this.config = t;
  }
  resetTimeStamp() {
  }
  resetInitSegment(e, t, s, i) {
    const n = this.videoTrack = Le("video", 1), r = this.audioTrack = Le("audio", 1), o = this.txtTrack = Le("text", 1);
    if (this.id3Track = Le("id3", 1), this.timeOffset = 0, !(e != null && e.byteLength))
      return;
    const l = hn(e);
    if (l.video) {
      const {
        id: c,
        timescale: h,
        codec: u
      } = l.video;
      n.id = c, n.timescale = o.timescale = h, n.codec = u;
    }
    if (l.audio) {
      const {
        id: c,
        timescale: h,
        codec: u
      } = l.audio;
      r.id = c, r.timescale = h, r.codec = u;
    }
    o.id = on.text, n.sampleDuration = 0, n.duration = r.duration = i;
  }
  resetContiguity() {
    this.remainderData = null;
  }
  static probe(e) {
    return Hr(e);
  }
  demux(e, t) {
    this.timeOffset = t;
    let s = e;
    const i = this.videoTrack, n = this.txtTrack;
    if (this.config.progressive) {
      this.remainderData && (s = ve(this.remainderData, e));
      const o = jr(s);
      this.remainderData = o.remainder, i.samples = o.valid || new Uint8Array();
    } else
      i.samples = s;
    const r = this.extractID3Track(i, t);
    return n.samples = Xs(t, i), {
      videoTrack: i,
      audioTrack: this.audioTrack,
      id3Track: r,
      textTrack: this.txtTrack
    };
  }
  flush() {
    const e = this.timeOffset, t = this.videoTrack, s = this.txtTrack;
    t.samples = this.remainderData || new Uint8Array(), this.remainderData = null;
    const i = this.extractID3Track(t, this.timeOffset);
    return s.samples = Xs(e, t), {
      videoTrack: t,
      audioTrack: Le(),
      id3Track: i,
      textTrack: Le()
    };
  }
  extractID3Track(e, t) {
    const s = this.id3Track;
    if (e.samples.length) {
      const i = W(e.samples, ["emsg"]);
      i && i.forEach((n) => {
        const r = Jr(n);
        if (bo.test(r.schemeIdUri)) {
          const o = O(r.presentationTime) ? r.presentationTime / r.timeScale : t + r.presentationTimeDelta / r.timeScale;
          let l = r.eventDuration === 4294967295 ? Number.POSITIVE_INFINITY : r.eventDuration / r.timeScale;
          l <= 1e-3 && (l = Number.POSITIVE_INFINITY);
          const c = r.payload;
          s.samples.push({
            data: c,
            len: c.byteLength,
            dts: o,
            pts: o,
            type: Ee.emsg,
            duration: l
          });
        }
      });
    }
    return s;
  }
  demuxSampleAes(e, t, s) {
    return Promise.reject(new Error("The MP4 demuxer does not support SAMPLE-AES decryption"));
  }
  destroy() {
  }
}
const _n = (a, e) => {
  let t = 0, s = 5;
  e += s;
  const i = new Uint32Array(1), n = new Uint32Array(1), r = new Uint8Array(1);
  for (; s > 0; ) {
    r[0] = a[e];
    const o = Math.min(s, 8), l = 8 - o;
    n[0] = 4278190080 >>> 24 + l << l, i[0] = (r[0] & n[0]) >> l, t = t ? t << o | i[0] : i[0], e += 1, s -= o;
  }
  return t;
};
class Ao extends Fs {
  constructor(e) {
    super(), this.observer = void 0, this.observer = e;
  }
  resetInitSegment(e, t, s, i) {
    super.resetInitSegment(e, t, s, i), this._audioTrack = {
      container: "audio/ac-3",
      type: "audio",
      id: 2,
      pid: -1,
      sequenceNumber: 0,
      segmentCodec: "ac3",
      samples: [],
      manifestCodec: t,
      duration: i,
      inputTimeScale: 9e4,
      dropped: 0
    };
  }
  canParse(e, t) {
    return t + 64 < e.length;
  }
  appendFrame(e, t, s) {
    const i = On(e, t, s, this.basePTS, this.frameIndex);
    if (i !== -1)
      return {
        sample: e.samples[e.samples.length - 1],
        length: i,
        missing: 0
      };
  }
  static probe(e) {
    if (!e)
      return !1;
    const t = nt(e, 0);
    if (!t)
      return !1;
    const s = t.length;
    return e[s] === 11 && e[s + 1] === 119 && Is(t) !== void 0 && // check the bsid to confirm ac-3
    _n(e, s) < 16;
  }
}
function On(a, e, t, s, i) {
  if (t + 8 > e.length || e[t] !== 11 || e[t + 1] !== 119)
    return -1;
  const n = e[t + 4] >> 6;
  if (n >= 3)
    return -1;
  const o = [48e3, 44100, 32e3][n], l = e[t + 4] & 63, h = [64, 69, 96, 64, 70, 96, 80, 87, 120, 80, 88, 120, 96, 104, 144, 96, 105, 144, 112, 121, 168, 112, 122, 168, 128, 139, 192, 128, 140, 192, 160, 174, 240, 160, 175, 240, 192, 208, 288, 192, 209, 288, 224, 243, 336, 224, 244, 336, 256, 278, 384, 256, 279, 384, 320, 348, 480, 320, 349, 480, 384, 417, 576, 384, 418, 576, 448, 487, 672, 448, 488, 672, 512, 557, 768, 512, 558, 768, 640, 696, 960, 640, 697, 960, 768, 835, 1152, 768, 836, 1152, 896, 975, 1344, 896, 976, 1344, 1024, 1114, 1536, 1024, 1115, 1536, 1152, 1253, 1728, 1152, 1254, 1728, 1280, 1393, 1920, 1280, 1394, 1920][l * 3 + n] * 2;
  if (t + h > e.length)
    return -1;
  const u = e[t + 6] >> 5;
  let d = 0;
  u === 2 ? d += 2 : (u & 1 && u !== 1 && (d += 2), u & 4 && (d += 2));
  const f = (e[t + 6] << 8 | e[t + 7]) >> 12 - d & 1, p = [2, 1, 2, 3, 3, 4, 4, 5][u] + f, g = e[t + 5] >> 3, v = e[t + 5] & 7, C = new Uint8Array([n << 6 | g << 1 | v >> 2, (v & 3) << 6 | u << 3 | f << 2 | l >> 4, l << 4 & 224]), E = 1536 / o * 9e4, T = s + i * E, x = e.subarray(t, t + h);
  return a.config = C, a.channelCount = p, a.samplerate = o, a.samples.push({
    unit: x,
    pts: T
  }), h;
}
class wo {
  constructor() {
    this.VideoSample = null;
  }
  createVideoSample(e, t, s, i) {
    return {
      key: e,
      frame: !1,
      pts: t,
      dts: s,
      units: [],
      debug: i,
      length: 0
    };
  }
  getLastNalUnit(e) {
    var t;
    let s = this.VideoSample, i;
    if ((!s || s.units.length === 0) && (s = e[e.length - 1]), (t = s) != null && t.units) {
      const n = s.units;
      i = n[n.length - 1];
    }
    return i;
  }
  pushAccessUnit(e, t) {
    if (e.units.length && e.frame) {
      if (e.pts === void 0) {
        const s = t.samples, i = s.length;
        if (i) {
          const n = s[i - 1];
          e.pts = n.pts, e.dts = n.dts;
        } else {
          t.dropped++;
          return;
        }
      }
      t.samples.push(e);
    }
    e.debug.length && S.log(e.pts + "/" + e.dts + ":" + e.debug);
  }
}
class Li {
  constructor(e) {
    this.data = void 0, this.bytesAvailable = void 0, this.word = void 0, this.bitsAvailable = void 0, this.data = e, this.bytesAvailable = e.byteLength, this.word = 0, this.bitsAvailable = 0;
  }
  // ():void
  loadWord() {
    const e = this.data, t = this.bytesAvailable, s = e.byteLength - t, i = new Uint8Array(4), n = Math.min(4, t);
    if (n === 0)
      throw new Error("no bytes available");
    i.set(e.subarray(s, s + n)), this.word = new DataView(i.buffer).getUint32(0), this.bitsAvailable = n * 8, this.bytesAvailable -= n;
  }
  // (count:int):void
  skipBits(e) {
    let t;
    e = Math.min(e, this.bytesAvailable * 8 + this.bitsAvailable), this.bitsAvailable > e ? (this.word <<= e, this.bitsAvailable -= e) : (e -= this.bitsAvailable, t = e >> 3, e -= t << 3, this.bytesAvailable -= t, this.loadWord(), this.word <<= e, this.bitsAvailable -= e);
  }
  // (size:int):uint
  readBits(e) {
    let t = Math.min(this.bitsAvailable, e);
    const s = this.word >>> 32 - t;
    if (e > 32 && S.error("Cannot read more than 32 bits at a time"), this.bitsAvailable -= t, this.bitsAvailable > 0)
      this.word <<= t;
    else if (this.bytesAvailable > 0)
      this.loadWord();
    else
      throw new Error("no bits available");
    return t = e - t, t > 0 && this.bitsAvailable ? s << t | this.readBits(t) : s;
  }
  // ():uint
  skipLZ() {
    let e;
    for (e = 0; e < this.bitsAvailable; ++e)
      if (this.word & 2147483648 >>> e)
        return this.word <<= e, this.bitsAvailable -= e, e;
    return this.loadWord(), e + this.skipLZ();
  }
  // ():void
  skipUEG() {
    this.skipBits(1 + this.skipLZ());
  }
  // ():void
  skipEG() {
    this.skipBits(1 + this.skipLZ());
  }
  // ():uint
  readUEG() {
    const e = this.skipLZ();
    return this.readBits(e + 1) - 1;
  }
  // ():int
  readEG() {
    const e = this.readUEG();
    return 1 & e ? 1 + e >>> 1 : -1 * (e >>> 1);
  }
  // Some convenience functions
  // :Boolean
  readBoolean() {
    return this.readBits(1) === 1;
  }
  // ():int
  readUByte() {
    return this.readBits(8);
  }
  // ():int
  readUShort() {
    return this.readBits(16);
  }
  // ():int
  readUInt() {
    return this.readBits(32);
  }
  /**
   * Advance the ExpGolomb decoder past a scaling list. The scaling
   * list is optionally transmitted as part of a sequence parameter
   * set and is not relevant to transmuxing.
   * @param count the number of entries in this scaling list
   * @see Recommendation ITU-T H.264, Section 7.3.2.1.1.1
   */
  skipScalingList(e) {
    let t = 8, s = 8, i;
    for (let n = 0; n < e; n++)
      s !== 0 && (i = this.readEG(), s = (t + i + 256) % 256), t = s === 0 ? t : s;
  }
  /**
   * Read a sequence parameter set and return some interesting video
   * properties. A sequence parameter set is the H264 metadata that
   * describes the properties of upcoming video frames.
   * @returns an object with configuration parsed from the
   * sequence parameter set, including the dimensions of the
   * associated video frames.
   */
  readSPS() {
    let e = 0, t = 0, s = 0, i = 0, n, r, o;
    const l = this.readUByte.bind(this), c = this.readBits.bind(this), h = this.readUEG.bind(this), u = this.readBoolean.bind(this), d = this.skipBits.bind(this), f = this.skipEG.bind(this), m = this.skipUEG.bind(this), p = this.skipScalingList.bind(this);
    l();
    const g = l();
    if (c(5), d(3), l(), m(), g === 100 || g === 110 || g === 122 || g === 244 || g === 44 || g === 83 || g === 86 || g === 118 || g === 128) {
      const I = h();
      if (I === 3 && d(1), m(), m(), d(1), u())
        for (r = I !== 3 ? 8 : 12, o = 0; o < r; o++)
          u() && (o < 6 ? p(16) : p(64));
    }
    m();
    const v = h();
    if (v === 0)
      h();
    else if (v === 1)
      for (d(1), f(), f(), n = h(), o = 0; o < n; o++)
        f();
    m(), d(1);
    const C = h(), E = h(), T = c(1);
    T === 0 && d(1), d(1), u() && (e = h(), t = h(), s = h(), i = h());
    let x = [1, 1];
    if (u() && u())
      switch (l()) {
        case 1:
          x = [1, 1];
          break;
        case 2:
          x = [12, 11];
          break;
        case 3:
          x = [10, 11];
          break;
        case 4:
          x = [16, 11];
          break;
        case 5:
          x = [40, 33];
          break;
        case 6:
          x = [24, 11];
          break;
        case 7:
          x = [20, 11];
          break;
        case 8:
          x = [32, 11];
          break;
        case 9:
          x = [80, 33];
          break;
        case 10:
          x = [18, 11];
          break;
        case 11:
          x = [15, 11];
          break;
        case 12:
          x = [64, 33];
          break;
        case 13:
          x = [160, 99];
          break;
        case 14:
          x = [4, 3];
          break;
        case 15:
          x = [3, 2];
          break;
        case 16:
          x = [2, 1];
          break;
        case 255: {
          x = [l() << 8 | l(), l() << 8 | l()];
          break;
        }
      }
    return {
      width: Math.ceil((C + 1) * 16 - e * 2 - t * 2),
      height: (2 - T) * (E + 1) * 16 - (T ? 2 : 4) * (s + i),
      pixelRatio: x
    };
  }
  readSliceType() {
    return this.readUByte(), this.readUEG(), this.readUEG();
  }
}
class Io extends wo {
  parseAVCPES(e, t, s, i, n) {
    const r = this.parseAVCNALu(e, s.data);
    let o = this.VideoSample, l, c = !1;
    s.data = null, o && r.length && !e.audFound && (this.pushAccessUnit(o, e), o = this.VideoSample = this.createVideoSample(!1, s.pts, s.dts, "")), r.forEach((h) => {
      var u;
      switch (h.type) {
        case 1: {
          let p = !1;
          l = !0;
          const g = h.data;
          if (c && g.length > 4) {
            const v = new Li(g).readSliceType();
            (v === 2 || v === 4 || v === 7 || v === 9) && (p = !0);
          }
          if (p) {
            var d;
            (d = o) != null && d.frame && !o.key && (this.pushAccessUnit(o, e), o = this.VideoSample = null);
          }
          o || (o = this.VideoSample = this.createVideoSample(!0, s.pts, s.dts, "")), o.frame = !0, o.key = p;
          break;
        }
        case 5:
          l = !0, (u = o) != null && u.frame && !o.key && (this.pushAccessUnit(o, e), o = this.VideoSample = null), o || (o = this.VideoSample = this.createVideoSample(!0, s.pts, s.dts, "")), o.key = !0, o.frame = !0;
          break;
        case 6: {
          l = !0, dn(h.data, 1, s.pts, t.samples);
          break;
        }
        case 7: {
          var f, m;
          l = !0, c = !0;
          const p = h.data, v = new Li(p).readSPS();
          if (!e.sps || e.width !== v.width || e.height !== v.height || ((f = e.pixelRatio) == null ? void 0 : f[0]) !== v.pixelRatio[0] || ((m = e.pixelRatio) == null ? void 0 : m[1]) !== v.pixelRatio[1]) {
            e.width = v.width, e.height = v.height, e.pixelRatio = v.pixelRatio, e.sps = [p], e.duration = n;
            const C = p.subarray(1, 4);
            let E = "avc1.";
            for (let T = 0; T < 3; T++) {
              let x = C[T].toString(16);
              x.length < 2 && (x = "0" + x), E += x;
            }
            e.codec = E;
          }
          break;
        }
        case 8:
          l = !0, e.pps = [h.data];
          break;
        case 9:
          l = !0, e.audFound = !0, o && this.pushAccessUnit(o, e), o = this.VideoSample = this.createVideoSample(!1, s.pts, s.dts, "");
          break;
        case 12:
          l = !0;
          break;
        default:
          l = !1, o && (o.debug += "unknown NAL " + h.type + " ");
          break;
      }
      o && l && o.units.push(h);
    }), i && o && (this.pushAccessUnit(o, e), this.VideoSample = null);
  }
  parseAVCNALu(e, t) {
    const s = t.byteLength;
    let i = e.naluState || 0;
    const n = i, r = [];
    let o = 0, l, c, h, u = -1, d = 0;
    for (i === -1 && (u = 0, d = t[0] & 31, i = 0, o = 1); o < s; ) {
      if (l = t[o++], !i) {
        i = l ? 0 : 1;
        continue;
      }
      if (i === 1) {
        i = l ? 0 : 2;
        continue;
      }
      if (!l)
        i = 3;
      else if (l === 1) {
        if (c = o - i - 1, u >= 0) {
          const f = {
            data: t.subarray(u, c),
            type: d
          };
          r.push(f);
        } else {
          const f = this.getLastNalUnit(e.samples);
          f && (n && o <= 4 - n && f.state && (f.data = f.data.subarray(0, f.data.byteLength - n)), c > 0 && (f.data = ve(f.data, t.subarray(0, c)), f.state = 0));
        }
        o < s ? (h = t[o] & 31, u = o, d = h, i = 0) : i = -1;
      } else
        i = 0;
    }
    if (u >= 0 && i >= 0) {
      const f = {
        data: t.subarray(u, s),
        type: d,
        state: i
      };
      r.push(f);
    }
    if (r.length === 0) {
      const f = this.getLastNalUnit(e.samples);
      f && (f.data = ve(f.data, t));
    }
    return e.naluState = i, r;
  }
}
class Ro {
  constructor(e, t, s) {
    this.keyData = void 0, this.decrypter = void 0, this.keyData = s, this.decrypter = new Ms(t, {
      removePKCS7Padding: !1
    });
  }
  decryptBuffer(e) {
    return this.decrypter.decrypt(e, this.keyData.key.buffer, this.keyData.iv.buffer);
  }
  // AAC - encrypt all full 16 bytes blocks starting from offset 16
  decryptAacSample(e, t, s) {
    const i = e[t].unit;
    if (i.length <= 16)
      return;
    const n = i.subarray(16, i.length - i.length % 16), r = n.buffer.slice(n.byteOffset, n.byteOffset + n.length);
    this.decryptBuffer(r).then((o) => {
      const l = new Uint8Array(o);
      i.set(l, 16), this.decrypter.isSync() || this.decryptAacSamples(e, t + 1, s);
    });
  }
  decryptAacSamples(e, t, s) {
    for (; ; t++) {
      if (t >= e.length) {
        s();
        return;
      }
      if (!(e[t].unit.length < 32) && (this.decryptAacSample(e, t, s), !this.decrypter.isSync()))
        return;
    }
  }
  // AVC - encrypt one 16 bytes block out of ten, starting from offset 32
  getAvcEncryptedData(e) {
    const t = Math.floor((e.length - 48) / 160) * 16 + 16, s = new Int8Array(t);
    let i = 0;
    for (let n = 32; n < e.length - 16; n += 160, i += 16)
      s.set(e.subarray(n, n + 16), i);
    return s;
  }
  getAvcDecryptedUnit(e, t) {
    const s = new Uint8Array(t);
    let i = 0;
    for (let n = 32; n < e.length - 16; n += 160, i += 16)
      e.set(s.subarray(i, i + 16), n);
    return e;
  }
  decryptAvcSample(e, t, s, i, n) {
    const r = fn(n.data), o = this.getAvcEncryptedData(r);
    this.decryptBuffer(o.buffer).then((l) => {
      n.data = this.getAvcDecryptedUnit(r, l), this.decrypter.isSync() || this.decryptAvcSamples(e, t, s + 1, i);
    });
  }
  decryptAvcSamples(e, t, s, i) {
    if (e instanceof Uint8Array)
      throw new Error("Cannot decrypt samples of type Uint8Array");
    for (; ; t++, s = 0) {
      if (t >= e.length) {
        i();
        return;
      }
      const n = e[t].units;
      for (; !(s >= n.length); s++) {
        const r = n[s];
        if (!(r.data.length <= 48 || r.type !== 1 && r.type !== 5) && (this.decryptAvcSample(e, t, s, i, r), !this.decrypter.isSync()))
          return;
      }
    }
  }
}
const oe = 188;
class _e {
  constructor(e, t, s) {
    this.observer = void 0, this.config = void 0, this.typeSupported = void 0, this.sampleAes = null, this.pmtParsed = !1, this.audioCodec = void 0, this.videoCodec = void 0, this._duration = 0, this._pmtId = -1, this._videoTrack = void 0, this._audioTrack = void 0, this._id3Track = void 0, this._txtTrack = void 0, this.aacOverFlow = null, this.remainderData = null, this.videoParser = void 0, this.observer = e, this.config = t, this.typeSupported = s, this.videoParser = new Io();
  }
  static probe(e) {
    const t = _e.syncOffset(e);
    return t > 0 && S.warn(`MPEG2-TS detected but first sync word found @ offset ${t}`), t !== -1;
  }
  static syncOffset(e) {
    const t = e.length;
    let s = Math.min(oe * 5, t - oe) + 1, i = 0;
    for (; i < s; ) {
      let n = !1, r = -1, o = 0;
      for (let l = i; l < t; l += oe)
        if (e[l] === 71 && (t - l === oe || e[l + oe] === 71)) {
          if (o++, r === -1 && (r = l, r !== 0 && (s = Math.min(r + oe * 99, e.length - oe) + 1)), n || (n = vs(e, l) === 0), n && o > 1 && (r === 0 && o > 2 || l + oe > s))
            return r;
        } else {
          if (o)
            return -1;
          break;
        }
      i++;
    }
    return -1;
  }
  /**
   * Creates a track model internal to demuxer used to drive remuxing input
   */
  static createTrack(e, t) {
    return {
      container: e === "video" || e === "audio" ? "video/mp2t" : void 0,
      type: e,
      id: on[e],
      pid: -1,
      inputTimeScale: 9e4,
      sequenceNumber: 0,
      samples: [],
      dropped: 0,
      duration: e === "audio" ? t : void 0
    };
  }
  /**
   * Initializes a new init segment on the demuxer/remuxer interface. Needed for discontinuities/track-switches (or at stream start)
   * Resets all internal track instances of the demuxer.
   */
  resetInitSegment(e, t, s, i) {
    this.pmtParsed = !1, this._pmtId = -1, this._videoTrack = _e.createTrack("video"), this._audioTrack = _e.createTrack("audio", i), this._id3Track = _e.createTrack("id3"), this._txtTrack = _e.createTrack("text"), this._audioTrack.segmentCodec = "aac", this.aacOverFlow = null, this.remainderData = null, this.audioCodec = t, this.videoCodec = s, this._duration = i;
  }
  resetTimeStamp() {
  }
  resetContiguity() {
    const {
      _audioTrack: e,
      _videoTrack: t,
      _id3Track: s
    } = this;
    e && (e.pesData = null), t && (t.pesData = null), s && (s.pesData = null), this.aacOverFlow = null, this.remainderData = null;
  }
  demux(e, t, s = !1, i = !1) {
    s || (this.sampleAes = null);
    let n;
    const r = this._videoTrack, o = this._audioTrack, l = this._id3Track, c = this._txtTrack;
    let h = r.pid, u = r.pesData, d = o.pid, f = l.pid, m = o.pesData, p = l.pesData, g = null, v = this.pmtParsed, C = this._pmtId, E = e.length;
    if (this.remainderData && (e = ve(this.remainderData, e), E = e.length, this.remainderData = null), E < oe && !i)
      return this.remainderData = e, {
        audioTrack: o,
        videoTrack: r,
        id3Track: l,
        textTrack: c
      };
    const T = Math.max(0, _e.syncOffset(e));
    E -= (E - T) % oe, E < e.byteLength && !i && (this.remainderData = new Uint8Array(e.buffer, E, e.buffer.byteLength - E));
    let x = 0;
    for (let L = T; L < E; L += oe)
      if (e[L] === 71) {
        const w = !!(e[L + 1] & 64), R = vs(e, L), k = (e[L + 3] & 48) >> 4;
        let M;
        if (k > 1) {
          if (M = L + 5 + e[L + 4], M === L + oe)
            continue;
        } else
          M = L + 4;
        switch (R) {
          case h:
            w && (u && (n = We(u)) && this.videoParser.parseAVCPES(r, c, n, !1, this._duration), u = {
              data: [],
              size: 0
            }), u && (u.data.push(e.subarray(M, L + oe)), u.size += L + oe - M);
            break;
          case d:
            if (w) {
              if (m && (n = We(m)))
                switch (o.segmentCodec) {
                  case "aac":
                    this.parseAACPES(o, n);
                    break;
                  case "mp3":
                    this.parseMPEGPES(o, n);
                    break;
                  case "ac3":
                    this.parseAC3PES(o, n);
                    break;
                }
              m = {
                data: [],
                size: 0
              };
            }
            m && (m.data.push(e.subarray(M, L + oe)), m.size += L + oe - M);
            break;
          case f:
            w && (p && (n = We(p)) && this.parseID3PES(l, n), p = {
              data: [],
              size: 0
            }), p && (p.data.push(e.subarray(M, L + oe)), p.size += L + oe - M);
            break;
          case 0:
            w && (M += e[M] + 1), C = this._pmtId = ko(e, M);
            break;
          case C: {
            w && (M += e[M] + 1);
            const _ = Do(e, M, this.typeSupported, s, this.observer);
            h = _.videoPid, h > 0 && (r.pid = h, r.segmentCodec = _.segmentVideoCodec), d = _.audioPid, d > 0 && (o.pid = d, o.segmentCodec = _.segmentAudioCodec), f = _.id3Pid, f > 0 && (l.pid = f), g !== null && !v && (S.warn(`MPEG-TS PMT found at ${L} after unknown PID '${g}'. Backtracking to sync byte @${T} to parse all TS packets.`), g = null, L = T - 188), v = this.pmtParsed = !0;
            break;
          }
          case 17:
          case 8191:
            break;
          default:
            g = R;
            break;
        }
      } else
        x++;
    x > 0 && Nt(this.observer, new Error(`Found ${x} TS packet/s that do not start with 0x47`)), r.pesData = u, o.pesData = m, l.pesData = p;
    const I = {
      audioTrack: o,
      videoTrack: r,
      id3Track: l,
      textTrack: c
    };
    return i && this.extractRemainingSamples(I), I;
  }
  flush() {
    const {
      remainderData: e
    } = this;
    this.remainderData = null;
    let t;
    return e ? t = this.demux(e, -1, !1, !0) : t = {
      videoTrack: this._videoTrack,
      audioTrack: this._audioTrack,
      id3Track: this._id3Track,
      textTrack: this._txtTrack
    }, this.extractRemainingSamples(t), this.sampleAes ? this.decrypt(t, this.sampleAes) : t;
  }
  extractRemainingSamples(e) {
    const {
      audioTrack: t,
      videoTrack: s,
      id3Track: i,
      textTrack: n
    } = e, r = s.pesData, o = t.pesData, l = i.pesData;
    let c;
    if (r && (c = We(r)) ? (this.videoParser.parseAVCPES(s, n, c, !0, this._duration), s.pesData = null) : s.pesData = r, o && (c = We(o))) {
      switch (t.segmentCodec) {
        case "aac":
          this.parseAACPES(t, c);
          break;
        case "mp3":
          this.parseMPEGPES(t, c);
          break;
        case "ac3":
          this.parseAC3PES(t, c);
          break;
      }
      t.pesData = null;
    } else
      o != null && o.size && S.log("last AAC PES packet truncated,might overlap between fragments"), t.pesData = o;
    l && (c = We(l)) ? (this.parseID3PES(i, c), i.pesData = null) : i.pesData = l;
  }
  demuxSampleAes(e, t, s) {
    const i = this.demux(e, s, !0, !this.config.progressive), n = this.sampleAes = new Ro(this.observer, this.config, t);
    return this.decrypt(i, n);
  }
  decrypt(e, t) {
    return new Promise((s) => {
      const {
        audioTrack: i,
        videoTrack: n
      } = e;
      i.samples && i.segmentCodec === "aac" ? t.decryptAacSamples(i.samples, 0, () => {
        n.samples ? t.decryptAvcSamples(n.samples, 0, 0, () => {
          s(e);
        }) : s(e);
      }) : n.samples && t.decryptAvcSamples(n.samples, 0, 0, () => {
        s(e);
      });
    });
  }
  destroy() {
    this._duration = 0;
  }
  parseAACPES(e, t) {
    let s = 0;
    const i = this.aacOverFlow;
    let n = t.data;
    if (i) {
      this.aacOverFlow = null;
      const u = i.missing, d = i.sample.unit.byteLength;
      if (u === -1)
        n = ve(i.sample.unit, n);
      else {
        const f = d - u;
        i.sample.unit.set(n.subarray(0, u), f), e.samples.push(i.sample), s = i.missing;
      }
    }
    let r, o;
    for (r = s, o = n.length; r < o - 1 && !Ot(n, r); r++)
      ;
    if (r !== s) {
      let u;
      const d = r < o - 1;
      if (d ? u = `AAC PES did not start with ADTS header,offset:${r}` : u = "No ADTS header found in AAC PES", Nt(this.observer, new Error(u), d), !d)
        return;
    }
    In(e, this.observer, n, r, this.audioCodec);
    let l;
    if (t.pts !== void 0)
      l = t.pts;
    else if (i) {
      const u = Rn(e.samplerate);
      l = i.sample.pts + u;
    } else {
      S.warn("[tsdemuxer]: AAC PES unknown PTS");
      return;
    }
    let c = 0, h;
    for (; r < o; )
      if (h = kn(e, n, r, l, c), r += h.length, h.missing) {
        this.aacOverFlow = h;
        break;
      } else
        for (c++; r < o - 1 && !Ot(n, r); r++)
          ;
  }
  parseMPEGPES(e, t) {
    const s = t.data, i = s.length;
    let n = 0, r = 0;
    const o = t.pts;
    if (o === void 0) {
      S.warn("[tsdemuxer]: MPEG PES unknown PTS");
      return;
    }
    for (; r < i; )
      if (Pn(s, r)) {
        const l = Dn(e, s, r, o, n);
        if (l)
          r += l.length, n++;
        else
          break;
      } else
        r++;
  }
  parseAC3PES(e, t) {
    {
      const s = t.data, i = t.pts;
      if (i === void 0) {
        S.warn("[tsdemuxer]: AC3 PES unknown PTS");
        return;
      }
      const n = s.length;
      let r = 0, o = 0, l;
      for (; o < n && (l = On(e, s, o, i, r++)) > 0; )
        o += l;
    }
  }
  parseID3PES(e, t) {
    if (t.pts === void 0) {
      S.warn("[tsdemuxer]: ID3 PES unknown PTS");
      return;
    }
    const s = ne({}, t, {
      type: this._videoTrack ? Ee.emsg : Ee.audioId3,
      duration: Number.POSITIVE_INFINITY
    });
    e.samples.push(s);
  }
}
function vs(a, e) {
  return ((a[e + 1] & 31) << 8) + a[e + 2];
}
function ko(a, e) {
  return (a[e + 10] & 31) << 8 | a[e + 11];
}
function Do(a, e, t, s, i) {
  const n = {
    audioPid: -1,
    videoPid: -1,
    id3Pid: -1,
    segmentVideoCodec: "avc",
    segmentAudioCodec: "aac"
  }, r = (a[e + 1] & 15) << 8 | a[e + 2], o = e + 3 + r - 4, l = (a[e + 10] & 15) << 8 | a[e + 11];
  for (e += 12 + l; e < o; ) {
    const c = vs(a, e), h = (a[e + 3] & 15) << 8 | a[e + 4];
    switch (a[e]) {
      case 207:
        if (!s) {
          Jt("ADTS AAC");
          break;
        }
      case 15:
        n.audioPid === -1 && (n.audioPid = c);
        break;
      case 21:
        n.id3Pid === -1 && (n.id3Pid = c);
        break;
      case 219:
        if (!s) {
          Jt("H.264");
          break;
        }
      case 27:
        n.videoPid === -1 && (n.videoPid = c, n.segmentVideoCodec = "avc");
        break;
      case 3:
      case 4:
        !t.mpeg && !t.mp3 ? S.log("MPEG audio found, not supported in this browser") : n.audioPid === -1 && (n.audioPid = c, n.segmentAudioCodec = "mp3");
        break;
      case 193:
        if (!s) {
          Jt("AC-3");
          break;
        }
      case 129:
        t.ac3 ? n.audioPid === -1 && (n.audioPid = c, n.segmentAudioCodec = "ac3") : S.log("AC-3 audio found, not supported in this browser");
        break;
      case 6:
        if (n.audioPid === -1 && h > 0) {
          let u = e + 5, d = h;
          for (; d > 2; ) {
            switch (a[u]) {
              case 106:
                t.ac3 !== !0 ? S.log("AC-3 audio found, not supported in this browser for now") : (n.audioPid = c, n.segmentAudioCodec = "ac3");
                break;
            }
            const m = a[u + 1] + 2;
            u += m, d -= m;
          }
        }
        break;
      case 194:
      case 135:
        return Nt(i, new Error("Unsupported EC-3 in M2TS found")), n;
      case 36:
        return Nt(i, new Error("Unsupported HEVC in M2TS found")), n;
    }
    e += h + 5;
  }
  return n;
}
function Nt(a, e, t) {
  S.warn(`parsing error: ${e.message}`), a.emit(y.ERROR, y.ERROR, {
    type: K.MEDIA_ERROR,
    details: A.FRAG_PARSING_ERROR,
    fatal: !1,
    levelRetry: t,
    error: e,
    reason: e.message
  });
}
function Jt(a) {
  S.log(`${a} with AES-128-CBC encryption found in unencrypted stream`);
}
function We(a) {
  let e = 0, t, s, i, n, r;
  const o = a.data;
  if (!a || a.size === 0)
    return null;
  for (; o[0].length < 19 && o.length > 1; )
    o[0] = ve(o[0], o[1]), o.splice(1, 1);
  if (t = o[0], (t[0] << 16) + (t[1] << 8) + t[2] === 1) {
    if (s = (t[4] << 8) + t[5], s && s > a.size - 6)
      return null;
    const c = t[7];
    c & 192 && (n = (t[9] & 14) * 536870912 + // 1 << 29
    (t[10] & 255) * 4194304 + // 1 << 22
    (t[11] & 254) * 16384 + // 1 << 14
    (t[12] & 255) * 128 + // 1 << 7
    (t[13] & 254) / 2, c & 64 ? (r = (t[14] & 14) * 536870912 + // 1 << 29
    (t[15] & 255) * 4194304 + // 1 << 22
    (t[16] & 254) * 16384 + // 1 << 14
    (t[17] & 255) * 128 + // 1 << 7
    (t[18] & 254) / 2, n - r > 60 * 9e4 && (S.warn(`${Math.round((n - r) / 9e4)}s delta between PTS and DTS, align them`), n = r)) : r = n), i = t[8];
    let h = i + 9;
    if (a.size <= h)
      return null;
    a.size -= h;
    const u = new Uint8Array(a.size);
    for (let d = 0, f = o.length; d < f; d++) {
      t = o[d];
      let m = t.byteLength;
      if (h)
        if (h > m) {
          h -= m;
          continue;
        } else
          t = t.subarray(h), m -= h, h = 0;
      u.set(t, e), e += m;
    }
    return s && (s -= i + 3), {
      data: u,
      pts: n,
      dts: r,
      len: s
    };
  }
  return null;
}
class Mo extends Fs {
  resetInitSegment(e, t, s, i) {
    super.resetInitSegment(e, t, s, i), this._audioTrack = {
      container: "audio/mpeg",
      type: "audio",
      id: 2,
      pid: -1,
      sequenceNumber: 0,
      segmentCodec: "mp3",
      samples: [],
      manifestCodec: t,
      duration: i,
      inputTimeScale: 9e4,
      dropped: 0
    };
  }
  static probe(e) {
    if (!e)
      return !1;
    const t = nt(e, 0);
    let s = (t == null ? void 0 : t.length) || 0;
    if (t && e[s] === 11 && e[s + 1] === 119 && Is(t) !== void 0 && // check the bsid to confirm ac-3 or ec-3 (not mp3)
    _n(e, s) <= 16)
      return !1;
    for (let i = e.length; s < i; s++)
      if (Fn(e, s))
        return S.log("MPEG Audio sync word found !"), !0;
    return !1;
  }
  canParse(e, t) {
    return xo(e, t);
  }
  appendFrame(e, t, s) {
    if (this.basePTS !== null)
      return Dn(e, t, s, this.basePTS, this.frameIndex);
  }
}
class Ai {
  static getSilentFrame(e, t) {
    switch (e) {
      case "mp4a.40.2":
        if (t === 1)
          return new Uint8Array([0, 200, 0, 128, 35, 128]);
        if (t === 2)
          return new Uint8Array([33, 0, 73, 144, 2, 25, 0, 35, 128]);
        if (t === 3)
          return new Uint8Array([0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 142]);
        if (t === 4)
          return new Uint8Array([0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 128, 44, 128, 8, 2, 56]);
        if (t === 5)
          return new Uint8Array([0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 130, 48, 4, 153, 0, 33, 144, 2, 56]);
        if (t === 6)
          return new Uint8Array([0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 130, 48, 4, 153, 0, 33, 144, 2, 0, 178, 0, 32, 8, 224]);
        break;
      default:
        if (t === 1)
          return new Uint8Array([1, 64, 34, 128, 163, 78, 230, 128, 186, 8, 0, 0, 0, 28, 6, 241, 193, 10, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 94]);
        if (t === 2)
          return new Uint8Array([1, 64, 34, 128, 163, 94, 230, 128, 186, 8, 0, 0, 0, 0, 149, 0, 6, 241, 161, 10, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 94]);
        if (t === 3)
          return new Uint8Array([1, 64, 34, 128, 163, 94, 230, 128, 186, 8, 0, 0, 0, 0, 149, 0, 6, 241, 161, 10, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 94]);
        break;
    }
  }
}
const Fe = Math.pow(2, 32) - 1;
class b {
  static init() {
    b.types = {
      avc1: [],
      // codingname
      avcC: [],
      btrt: [],
      dinf: [],
      dref: [],
      esds: [],
      ftyp: [],
      hdlr: [],
      mdat: [],
      mdhd: [],
      mdia: [],
      mfhd: [],
      minf: [],
      moof: [],
      moov: [],
      mp4a: [],
      ".mp3": [],
      dac3: [],
      "ac-3": [],
      mvex: [],
      mvhd: [],
      pasp: [],
      sdtp: [],
      stbl: [],
      stco: [],
      stsc: [],
      stsd: [],
      stsz: [],
      stts: [],
      tfdt: [],
      tfhd: [],
      traf: [],
      trak: [],
      trun: [],
      trex: [],
      tkhd: [],
      vmhd: [],
      smhd: []
    };
    let e;
    for (e in b.types)
      b.types.hasOwnProperty(e) && (b.types[e] = [e.charCodeAt(0), e.charCodeAt(1), e.charCodeAt(2), e.charCodeAt(3)]);
    const t = new Uint8Array([
      0,
      // version 0
      0,
      0,
      0,
      // flags
      0,
      0,
      0,
      0,
      // pre_defined
      118,
      105,
      100,
      101,
      // handler_type: 'vide'
      0,
      0,
      0,
      0,
      // reserved
      0,
      0,
      0,
      0,
      // reserved
      0,
      0,
      0,
      0,
      // reserved
      86,
      105,
      100,
      101,
      111,
      72,
      97,
      110,
      100,
      108,
      101,
      114,
      0
      // name: 'VideoHandler'
    ]), s = new Uint8Array([
      0,
      // version 0
      0,
      0,
      0,
      // flags
      0,
      0,
      0,
      0,
      // pre_defined
      115,
      111,
      117,
      110,
      // handler_type: 'soun'
      0,
      0,
      0,
      0,
      // reserved
      0,
      0,
      0,
      0,
      // reserved
      0,
      0,
      0,
      0,
      // reserved
      83,
      111,
      117,
      110,
      100,
      72,
      97,
      110,
      100,
      108,
      101,
      114,
      0
      // name: 'SoundHandler'
    ]);
    b.HDLR_TYPES = {
      video: t,
      audio: s
    };
    const i = new Uint8Array([
      0,
      // version 0
      0,
      0,
      0,
      // flags
      0,
      0,
      0,
      1,
      // entry_count
      0,
      0,
      0,
      12,
      // entry_size
      117,
      114,
      108,
      32,
      // 'url' type
      0,
      // version 0
      0,
      0,
      1
      // entry_flags
    ]), n = new Uint8Array([
      0,
      // version
      0,
      0,
      0,
      // flags
      0,
      0,
      0,
      0
      // entry_count
    ]);
    b.STTS = b.STSC = b.STCO = n, b.STSZ = new Uint8Array([
      0,
      // version
      0,
      0,
      0,
      // flags
      0,
      0,
      0,
      0,
      // sample_size
      0,
      0,
      0,
      0
      // sample_count
    ]), b.VMHD = new Uint8Array([
      0,
      // version
      0,
      0,
      1,
      // flags
      0,
      0,
      // graphicsmode
      0,
      0,
      0,
      0,
      0,
      0
      // opcolor
    ]), b.SMHD = new Uint8Array([
      0,
      // version
      0,
      0,
      0,
      // flags
      0,
      0,
      // balance
      0,
      0
      // reserved
    ]), b.STSD = new Uint8Array([
      0,
      // version 0
      0,
      0,
      0,
      // flags
      0,
      0,
      0,
      1
    ]);
    const r = new Uint8Array([105, 115, 111, 109]), o = new Uint8Array([97, 118, 99, 49]), l = new Uint8Array([0, 0, 0, 1]);
    b.FTYP = b.box(b.types.ftyp, r, l, r, o), b.DINF = b.box(b.types.dinf, b.box(b.types.dref, i));
  }
  static box(e, ...t) {
    let s = 8, i = t.length;
    const n = i;
    for (; i--; )
      s += t[i].byteLength;
    const r = new Uint8Array(s);
    for (r[0] = s >> 24 & 255, r[1] = s >> 16 & 255, r[2] = s >> 8 & 255, r[3] = s & 255, r.set(e, 4), i = 0, s = 8; i < n; i++)
      r.set(t[i], s), s += t[i].byteLength;
    return r;
  }
  static hdlr(e) {
    return b.box(b.types.hdlr, b.HDLR_TYPES[e]);
  }
  static mdat(e) {
    return b.box(b.types.mdat, e);
  }
  static mdhd(e, t) {
    t *= e;
    const s = Math.floor(t / (Fe + 1)), i = Math.floor(t % (Fe + 1));
    return b.box(b.types.mdhd, new Uint8Array([
      1,
      // version 1
      0,
      0,
      0,
      // flags
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      // creation_time
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      // modification_time
      e >> 24 & 255,
      e >> 16 & 255,
      e >> 8 & 255,
      e & 255,
      // timescale
      s >> 24,
      s >> 16 & 255,
      s >> 8 & 255,
      s & 255,
      i >> 24,
      i >> 16 & 255,
      i >> 8 & 255,
      i & 255,
      85,
      196,
      // 'und' language (undetermined)
      0,
      0
    ]));
  }
  static mdia(e) {
    return b.box(b.types.mdia, b.mdhd(e.timescale, e.duration), b.hdlr(e.type), b.minf(e));
  }
  static mfhd(e) {
    return b.box(b.types.mfhd, new Uint8Array([
      0,
      0,
      0,
      0,
      // flags
      e >> 24,
      e >> 16 & 255,
      e >> 8 & 255,
      e & 255
      // sequence_number
    ]));
  }
  static minf(e) {
    return e.type === "audio" ? b.box(b.types.minf, b.box(b.types.smhd, b.SMHD), b.DINF, b.stbl(e)) : b.box(b.types.minf, b.box(b.types.vmhd, b.VMHD), b.DINF, b.stbl(e));
  }
  static moof(e, t, s) {
    return b.box(b.types.moof, b.mfhd(e), b.traf(s, t));
  }
  static moov(e) {
    let t = e.length;
    const s = [];
    for (; t--; )
      s[t] = b.trak(e[t]);
    return b.box.apply(null, [b.types.moov, b.mvhd(e[0].timescale, e[0].duration)].concat(s).concat(b.mvex(e)));
  }
  static mvex(e) {
    let t = e.length;
    const s = [];
    for (; t--; )
      s[t] = b.trex(e[t]);
    return b.box.apply(null, [b.types.mvex, ...s]);
  }
  static mvhd(e, t) {
    t *= e;
    const s = Math.floor(t / (Fe + 1)), i = Math.floor(t % (Fe + 1)), n = new Uint8Array([
      1,
      // version 1
      0,
      0,
      0,
      // flags
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      // creation_time
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      // modification_time
      e >> 24 & 255,
      e >> 16 & 255,
      e >> 8 & 255,
      e & 255,
      // timescale
      s >> 24,
      s >> 16 & 255,
      s >> 8 & 255,
      s & 255,
      i >> 24,
      i >> 16 & 255,
      i >> 8 & 255,
      i & 255,
      0,
      1,
      0,
      0,
      // 1.0 rate
      1,
      0,
      // 1.0 volume
      0,
      0,
      // reserved
      0,
      0,
      0,
      0,
      // reserved
      0,
      0,
      0,
      0,
      // reserved
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      64,
      0,
      0,
      0,
      // transformation: unity matrix
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // pre_defined
      255,
      255,
      255,
      255
      // next_track_ID
    ]);
    return b.box(b.types.mvhd, n);
  }
  static sdtp(e) {
    const t = e.samples || [], s = new Uint8Array(4 + t.length);
    let i, n;
    for (i = 0; i < t.length; i++)
      n = t[i].flags, s[i + 4] = n.dependsOn << 4 | n.isDependedOn << 2 | n.hasRedundancy;
    return b.box(b.types.sdtp, s);
  }
  static stbl(e) {
    return b.box(b.types.stbl, b.stsd(e), b.box(b.types.stts, b.STTS), b.box(b.types.stsc, b.STSC), b.box(b.types.stsz, b.STSZ), b.box(b.types.stco, b.STCO));
  }
  static avc1(e) {
    let t = [], s = [], i, n, r;
    for (i = 0; i < e.sps.length; i++)
      n = e.sps[i], r = n.byteLength, t.push(r >>> 8 & 255), t.push(r & 255), t = t.concat(Array.prototype.slice.call(n));
    for (i = 0; i < e.pps.length; i++)
      n = e.pps[i], r = n.byteLength, s.push(r >>> 8 & 255), s.push(r & 255), s = s.concat(Array.prototype.slice.call(n));
    const o = b.box(b.types.avcC, new Uint8Array([
      1,
      // version
      t[3],
      // profile
      t[4],
      // profile compat
      t[5],
      // level
      255,
      // lengthSizeMinusOne, hard-coded to 4 bytes
      224 | e.sps.length
      // 3bit reserved (111) + numOfSequenceParameterSets
    ].concat(t).concat([
      e.pps.length
      // numOfPictureParameterSets
    ]).concat(s))), l = e.width, c = e.height, h = e.pixelRatio[0], u = e.pixelRatio[1];
    return b.box(
      b.types.avc1,
      new Uint8Array([
        0,
        0,
        0,
        // reserved
        0,
        0,
        0,
        // reserved
        0,
        1,
        // data_reference_index
        0,
        0,
        // pre_defined
        0,
        0,
        // reserved
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        // pre_defined
        l >> 8 & 255,
        l & 255,
        // width
        c >> 8 & 255,
        c & 255,
        // height
        0,
        72,
        0,
        0,
        // horizresolution
        0,
        72,
        0,
        0,
        // vertresolution
        0,
        0,
        0,
        0,
        // reserved
        0,
        1,
        // frame_count
        18,
        100,
        97,
        105,
        108,
        // dailymotion/hls.js
        121,
        109,
        111,
        116,
        105,
        111,
        110,
        47,
        104,
        108,
        115,
        46,
        106,
        115,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        // compressorname
        0,
        24,
        // depth = 24
        17,
        17
      ]),
      // pre_defined = -1
      o,
      b.box(b.types.btrt, new Uint8Array([
        0,
        28,
        156,
        128,
        // bufferSizeDB
        0,
        45,
        198,
        192,
        // maxBitrate
        0,
        45,
        198,
        192
      ])),
      // avgBitrate
      b.box(b.types.pasp, new Uint8Array([
        h >> 24,
        // hSpacing
        h >> 16 & 255,
        h >> 8 & 255,
        h & 255,
        u >> 24,
        // vSpacing
        u >> 16 & 255,
        u >> 8 & 255,
        u & 255
      ]))
    );
  }
  static esds(e) {
    const t = e.config.length;
    return new Uint8Array([
      0,
      // version 0
      0,
      0,
      0,
      // flags
      3,
      // descriptor_type
      23 + t,
      // length
      0,
      1,
      // es_id
      0,
      // stream_priority
      4,
      // descriptor_type
      15 + t,
      // length
      64,
      // codec : mpeg4_audio
      21,
      // stream_type
      0,
      0,
      0,
      // buffer_size
      0,
      0,
      0,
      0,
      // maxBitrate
      0,
      0,
      0,
      0,
      // avgBitrate
      5
      // descriptor_type
    ].concat([t]).concat(e.config).concat([6, 1, 2]));
  }
  static audioStsd(e) {
    const t = e.samplerate;
    return new Uint8Array([
      0,
      0,
      0,
      // reserved
      0,
      0,
      0,
      // reserved
      0,
      1,
      // data_reference_index
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // reserved
      0,
      e.channelCount,
      // channelcount
      0,
      16,
      // sampleSize:16bits
      0,
      0,
      0,
      0,
      // reserved2
      t >> 8 & 255,
      t & 255,
      //
      0,
      0
    ]);
  }
  static mp4a(e) {
    return b.box(b.types.mp4a, b.audioStsd(e), b.box(b.types.esds, b.esds(e)));
  }
  static mp3(e) {
    return b.box(b.types[".mp3"], b.audioStsd(e));
  }
  static ac3(e) {
    return b.box(b.types["ac-3"], b.audioStsd(e), b.box(b.types.dac3, e.config));
  }
  static stsd(e) {
    return e.type === "audio" ? e.segmentCodec === "mp3" && e.codec === "mp3" ? b.box(b.types.stsd, b.STSD, b.mp3(e)) : e.segmentCodec === "ac3" ? b.box(b.types.stsd, b.STSD, b.ac3(e)) : b.box(b.types.stsd, b.STSD, b.mp4a(e)) : b.box(b.types.stsd, b.STSD, b.avc1(e));
  }
  static tkhd(e) {
    const t = e.id, s = e.duration * e.timescale, i = e.width, n = e.height, r = Math.floor(s / (Fe + 1)), o = Math.floor(s % (Fe + 1));
    return b.box(b.types.tkhd, new Uint8Array([
      1,
      // version 1
      0,
      0,
      7,
      // flags
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      // creation_time
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      // modification_time
      t >> 24 & 255,
      t >> 16 & 255,
      t >> 8 & 255,
      t & 255,
      // track_ID
      0,
      0,
      0,
      0,
      // reserved
      r >> 24,
      r >> 16 & 255,
      r >> 8 & 255,
      r & 255,
      o >> 24,
      o >> 16 & 255,
      o >> 8 & 255,
      o & 255,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // reserved
      0,
      0,
      // layer
      0,
      0,
      // alternate_group
      0,
      0,
      // non-audio track volume
      0,
      0,
      // reserved
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      64,
      0,
      0,
      0,
      // transformation: unity matrix
      i >> 8 & 255,
      i & 255,
      0,
      0,
      // width
      n >> 8 & 255,
      n & 255,
      0,
      0
      // height
    ]));
  }
  static traf(e, t) {
    const s = b.sdtp(e), i = e.id, n = Math.floor(t / (Fe + 1)), r = Math.floor(t % (Fe + 1));
    return b.box(
      b.types.traf,
      b.box(b.types.tfhd, new Uint8Array([
        0,
        // version 0
        0,
        0,
        0,
        // flags
        i >> 24,
        i >> 16 & 255,
        i >> 8 & 255,
        i & 255
        // track_ID
      ])),
      b.box(b.types.tfdt, new Uint8Array([
        1,
        // version 1
        0,
        0,
        0,
        // flags
        n >> 24,
        n >> 16 & 255,
        n >> 8 & 255,
        n & 255,
        r >> 24,
        r >> 16 & 255,
        r >> 8 & 255,
        r & 255
      ])),
      b.trun(e, s.length + 16 + // tfhd
      20 + // tfdt
      8 + // traf header
      16 + // mfhd
      8 + // moof header
      8),
      // mdat header
      s
    );
  }
  /**
   * Generate a track box.
   * @param track a track definition
   */
  static trak(e) {
    return e.duration = e.duration || 4294967295, b.box(b.types.trak, b.tkhd(e), b.mdia(e));
  }
  static trex(e) {
    const t = e.id;
    return b.box(b.types.trex, new Uint8Array([
      0,
      // version 0
      0,
      0,
      0,
      // flags
      t >> 24,
      t >> 16 & 255,
      t >> 8 & 255,
      t & 255,
      // track_ID
      0,
      0,
      0,
      1,
      // default_sample_description_index
      0,
      0,
      0,
      0,
      // default_sample_duration
      0,
      0,
      0,
      0,
      // default_sample_size
      0,
      1,
      0,
      1
      // default_sample_flags
    ]));
  }
  static trun(e, t) {
    const s = e.samples || [], i = s.length, n = 12 + 16 * i, r = new Uint8Array(n);
    let o, l, c, h, u, d;
    for (t += 8 + n, r.set([
      e.type === "video" ? 1 : 0,
      // version 1 for video with signed-int sample_composition_time_offset
      0,
      15,
      1,
      // flags
      i >>> 24 & 255,
      i >>> 16 & 255,
      i >>> 8 & 255,
      i & 255,
      // sample_count
      t >>> 24 & 255,
      t >>> 16 & 255,
      t >>> 8 & 255,
      t & 255
      // data_offset
    ], 0), o = 0; o < i; o++)
      l = s[o], c = l.duration, h = l.size, u = l.flags, d = l.cts, r.set([
        c >>> 24 & 255,
        c >>> 16 & 255,
        c >>> 8 & 255,
        c & 255,
        // sample_duration
        h >>> 24 & 255,
        h >>> 16 & 255,
        h >>> 8 & 255,
        h & 255,
        // sample_size
        u.isLeading << 2 | u.dependsOn,
        u.isDependedOn << 6 | u.hasRedundancy << 4 | u.paddingValue << 1 | u.isNonSync,
        u.degradPrio & 61440,
        u.degradPrio & 15,
        // sample_flags
        d >>> 24 & 255,
        d >>> 16 & 255,
        d >>> 8 & 255,
        d & 255
        // sample_composition_time_offset
      ], 12 + 16 * o);
    return b.box(b.types.trun, r);
  }
  static initSegment(e) {
    b.types || b.init();
    const t = b.moov(e);
    return ve(b.FTYP, t);
  }
}
b.types = void 0;
b.HDLR_TYPES = void 0;
b.STTS = void 0;
b.STSC = void 0;
b.STCO = void 0;
b.STSZ = void 0;
b.VMHD = void 0;
b.SMHD = void 0;
b.STSD = void 0;
b.FTYP = void 0;
b.DINF = void 0;
const Nn = 9e4;
function Ns(a, e, t = 1, s = !1) {
  const i = a * e * t;
  return s ? Math.round(i) : i;
}
function Po(a, e, t = 1, s = !1) {
  return Ns(a, e, 1 / t, s);
}
function tt(a, e = !1) {
  return Ns(a, 1e3, 1 / Nn, e);
}
function Fo(a, e = 1) {
  return Ns(a, Nn, 1 / e);
}
const _o = 10 * 1e3, wi = 1024, Oo = 1152, No = 1536;
let ze = null, es = null;
class xt {
  constructor(e, t, s, i = "") {
    if (this.observer = void 0, this.config = void 0, this.typeSupported = void 0, this.ISGenerated = !1, this._initPTS = null, this._initDTS = null, this.nextAvcDts = null, this.nextAudioPts = null, this.videoSampleDuration = null, this.isAudioContiguous = !1, this.isVideoContiguous = !1, this.videoTrackConfig = void 0, this.observer = e, this.config = t, this.typeSupported = s, this.ISGenerated = !1, ze === null) {
      const r = (navigator.userAgent || "").match(/Chrome\/(\d+)/i);
      ze = r ? parseInt(r[1]) : 0;
    }
    if (es === null) {
      const n = navigator.userAgent.match(/Safari\/(\d+)/i);
      es = n ? parseInt(n[1]) : 0;
    }
  }
  destroy() {
    this.config = this.videoTrackConfig = this._initPTS = this._initDTS = null;
  }
  resetTimeStamp(e) {
    S.log("[mp4-remuxer]: initPTS & initDTS reset"), this._initPTS = this._initDTS = e;
  }
  resetNextTimestamp() {
    S.log("[mp4-remuxer]: reset next timestamp"), this.isVideoContiguous = !1, this.isAudioContiguous = !1;
  }
  resetInitSegment() {
    S.log("[mp4-remuxer]: ISGenerated flag reset"), this.ISGenerated = !1, this.videoTrackConfig = void 0;
  }
  getVideoStartPts(e) {
    let t = !1;
    const s = e.reduce((i, n) => {
      const r = n.pts - i;
      return r < -4294967296 ? (t = !0, ye(i, n.pts)) : r > 0 ? i : n.pts;
    }, e[0].pts);
    return t && S.debug("PTS rollover detected"), s;
  }
  remux(e, t, s, i, n, r, o, l) {
    let c, h, u, d, f, m, p = n, g = n;
    const v = e.pid > -1, C = t.pid > -1, E = t.samples.length, T = e.samples.length > 0, x = o && E > 0 || E > 1;
    if ((!v || T) && (!C || x) || this.ISGenerated || o) {
      if (this.ISGenerated) {
        var L, w, R, k;
        const G = this.videoTrackConfig;
        G && (t.width !== G.width || t.height !== G.height || ((L = t.pixelRatio) == null ? void 0 : L[0]) !== ((w = G.pixelRatio) == null ? void 0 : w[0]) || ((R = t.pixelRatio) == null ? void 0 : R[1]) !== ((k = G.pixelRatio) == null ? void 0 : k[1])) && this.resetInitSegment();
      } else
        u = this.generateIS(e, t, n, r);
      const M = this.isVideoContiguous;
      let _ = -1, P;
      if (x && (_ = Bo(t.samples), !M && this.config.forceKeyFrameOnDiscontinuity))
        if (m = !0, _ > 0) {
          S.warn(`[mp4-remuxer]: Dropped ${_} out of ${E} video samples due to a missing keyframe`);
          const G = this.getVideoStartPts(t.samples);
          t.samples = t.samples.slice(_), t.dropped += _, g += (t.samples[0].pts - G) / t.inputTimeScale, P = g;
        } else
          _ === -1 && (S.warn(`[mp4-remuxer]: No keyframe found out of ${E} video samples`), m = !1);
      if (this.ISGenerated) {
        if (T && x) {
          const G = this.getVideoStartPts(t.samples), U = (ye(e.samples[0].pts, G) - G) / t.inputTimeScale;
          p += Math.max(0, U), g += Math.max(0, -U);
        }
        if (T) {
          if (e.samplerate || (S.warn("[mp4-remuxer]: regenerate InitSegment as audio detected"), u = this.generateIS(e, t, n, r)), h = this.remuxAudio(e, p, this.isAudioContiguous, r, C || x || l === H.AUDIO ? g : void 0), x) {
            const G = h ? h.endPTS - h.startPTS : 0;
            t.inputTimeScale || (S.warn("[mp4-remuxer]: regenerate InitSegment as video detected"), u = this.generateIS(e, t, n, r)), c = this.remuxVideo(t, g, M, G);
          }
        } else
          x && (c = this.remuxVideo(t, g, M, 0));
        c && (c.firstKeyFrame = _, c.independent = _ !== -1, c.firstKeyFramePTS = P);
      }
    }
    return this.ISGenerated && this._initPTS && this._initDTS && (s.samples.length && (f = Bn(s, n, this._initPTS, this._initDTS)), i.samples.length && (d = Un(i, n, this._initPTS))), {
      audio: h,
      video: c,
      initSegment: u,
      independent: m,
      text: d,
      id3: f
    };
  }
  generateIS(e, t, s, i) {
    const n = e.samples, r = t.samples, o = this.typeSupported, l = {}, c = this._initPTS;
    let h = !c || i, u = "audio/mp4", d, f, m;
    if (h && (d = f = 1 / 0), e.config && n.length) {
      switch (e.timescale = e.samplerate, e.segmentCodec) {
        case "mp3":
          o.mpeg ? (u = "audio/mpeg", e.codec = "") : o.mp3 && (e.codec = "mp3");
          break;
        case "ac3":
          e.codec = "ac-3";
          break;
      }
      l.audio = {
        id: "audio",
        container: u,
        codec: e.codec,
        initSegment: e.segmentCodec === "mp3" && o.mpeg ? new Uint8Array(0) : b.initSegment([e]),
        metadata: {
          channelCount: e.channelCount
        }
      }, h && (m = e.inputTimeScale, !c || m !== c.timescale ? d = f = n[0].pts - Math.round(m * s) : h = !1);
    }
    if (t.sps && t.pps && r.length) {
      if (t.timescale = t.inputTimeScale, l.video = {
        id: "main",
        container: "video/mp4",
        codec: t.codec,
        initSegment: b.initSegment([t]),
        metadata: {
          width: t.width,
          height: t.height
        }
      }, h)
        if (m = t.inputTimeScale, !c || m !== c.timescale) {
          const p = this.getVideoStartPts(r), g = Math.round(m * s);
          f = Math.min(f, ye(r[0].dts, p) - g), d = Math.min(d, p - g);
        } else
          h = !1;
      this.videoTrackConfig = {
        width: t.width,
        height: t.height,
        pixelRatio: t.pixelRatio
      };
    }
    if (Object.keys(l).length)
      return this.ISGenerated = !0, h ? (this._initPTS = {
        baseTime: d,
        timescale: m
      }, this._initDTS = {
        baseTime: f,
        timescale: m
      }) : d = m = void 0, {
        tracks: l,
        initPTS: d,
        timescale: m
      };
  }
  remuxVideo(e, t, s, i) {
    const n = e.inputTimeScale, r = e.samples, o = [], l = r.length, c = this._initPTS;
    let h = this.nextAvcDts, u = 8, d = this.videoSampleDuration, f, m, p = Number.POSITIVE_INFINITY, g = Number.NEGATIVE_INFINITY, v = !1;
    if (!s || h === null) {
      const $ = t * n, F = r[0].pts - ye(r[0].dts, r[0].pts);
      ze && h !== null && Math.abs($ - F - h) < 15e3 ? s = !0 : h = $ - F;
    }
    const C = c.baseTime * n / c.timescale;
    for (let $ = 0; $ < l; $++) {
      const F = r[$];
      F.pts = ye(F.pts - C, h), F.dts = ye(F.dts - C, h), F.dts < r[$ > 0 ? $ - 1 : $].dts && (v = !0);
    }
    v && r.sort(function($, F) {
      const q = $.dts - F.dts, z = $.pts - F.pts;
      return q || z;
    }), f = r[0].dts, m = r[r.length - 1].dts;
    const E = m - f, T = E ? Math.round(E / (l - 1)) : d || e.inputTimeScale / 30;
    if (s) {
      const $ = f - h, F = $ > T, q = $ < -1;
      if ((F || q) && (F ? S.warn(`AVC: ${tt($, !0)} ms (${$}dts) hole between fragments detected at ${t.toFixed(3)}`) : S.warn(`AVC: ${tt(-$, !0)} ms (${$}dts) overlapping between fragments detected at ${t.toFixed(3)}`), !q || h >= r[0].pts || ze)) {
        f = h;
        const z = r[0].pts - $;
        if (F)
          r[0].dts = f, r[0].pts = z;
        else
          for (let j = 0; j < r.length && !(r[j].dts > z); j++)
            r[j].dts -= $, r[j].pts -= $;
        S.log(`Video: Initial PTS/DTS adjusted: ${tt(z, !0)}/${tt(f, !0)}, delta: ${tt($, !0)} ms`);
      }
    }
    f = Math.max(0, f);
    let x = 0, I = 0, L = f;
    for (let $ = 0; $ < l; $++) {
      const F = r[$], q = F.units, z = q.length;
      let j = 0;
      for (let ie = 0; ie < z; ie++)
        j += q[ie].data.length;
      I += j, x += z, F.length = j, F.dts < L ? (F.dts = L, L += T / 4 | 0 || 1) : L = F.dts, p = Math.min(F.pts, p), g = Math.max(F.pts, g);
    }
    m = r[l - 1].dts;
    const w = I + 4 * x + 8;
    let R;
    try {
      R = new Uint8Array(w);
    } catch ($) {
      this.observer.emit(y.ERROR, y.ERROR, {
        type: K.MUX_ERROR,
        details: A.REMUX_ALLOC_ERROR,
        fatal: !1,
        error: $,
        bytes: w,
        reason: `fail allocating video mdat ${w}`
      });
      return;
    }
    const k = new DataView(R.buffer);
    k.setUint32(0, w), R.set(b.types.mdat, 4);
    let M = !1, _ = Number.POSITIVE_INFINITY, P = Number.POSITIVE_INFINITY, G = Number.NEGATIVE_INFINITY, B = Number.NEGATIVE_INFINITY;
    for (let $ = 0; $ < l; $++) {
      const F = r[$], q = F.units;
      let z = 0;
      for (let ae = 0, he = q.length; ae < he; ae++) {
        const pe = q[ae], et = pe.data, Ht = pe.data.byteLength;
        k.setUint32(u, Ht), u += 4, R.set(et, u), u += Ht, z += 4 + Ht;
      }
      let j;
      if ($ < l - 1)
        d = r[$ + 1].dts - F.dts, j = r[$ + 1].pts - F.pts;
      else {
        const ae = this.config, he = $ > 0 ? F.dts - r[$ - 1].dts : T;
        if (j = $ > 0 ? F.pts - r[$ - 1].pts : T, ae.stretchShortVideoTrack && this.nextAudioPts !== null) {
          const pe = Math.floor(ae.maxBufferHole * n), et = (i ? p + i * n : this.nextAudioPts) - F.pts;
          et > pe ? (d = et - he, d < 0 ? d = he : M = !0, S.log(`[mp4-remuxer]: It is approximately ${et / 90} ms to the next segment; using duration ${d / 90} ms for the last video frame.`)) : d = he;
        } else
          d = he;
      }
      const ie = Math.round(F.pts - F.dts);
      _ = Math.min(_, d), G = Math.max(G, d), P = Math.min(P, j), B = Math.max(B, j), o.push(new Ii(F.key, d, z, ie));
    }
    if (o.length) {
      if (ze) {
        if (ze < 70) {
          const $ = o[0].flags;
          $.dependsOn = 2, $.isNonSync = 0;
        }
      } else if (es && B - P < G - _ && T / G < 0.025 && o[0].cts === 0) {
        S.warn("Found irregular gaps in sample duration. Using PTS instead of DTS to determine MP4 sample duration.");
        let $ = f;
        for (let F = 0, q = o.length; F < q; F++) {
          const z = $ + o[F].duration, j = $ + o[F].cts;
          if (F < q - 1) {
            const ie = z + o[F + 1].cts;
            o[F].duration = ie - j;
          } else
            o[F].duration = F ? o[F - 1].duration : T;
          o[F].cts = 0, $ = z;
        }
      }
    }
    d = M || !d ? T : d, this.nextAvcDts = h = m + d, this.videoSampleDuration = d, this.isVideoContiguous = !0;
    const U = b.moof(e.sequenceNumber++, f, ne({}, e, {
      samples: o
    })), Z = "video", Q = {
      data1: U,
      data2: R,
      startPTS: p / n,
      endPTS: (g + d) / n,
      startDTS: f / n,
      endDTS: h / n,
      type: Z,
      hasAudio: !1,
      hasVideo: !0,
      nb: o.length,
      dropped: e.dropped
    };
    return e.samples = [], e.dropped = 0, Q;
  }
  getSamplesPerFrame(e) {
    switch (e.segmentCodec) {
      case "mp3":
        return Oo;
      case "ac3":
        return No;
      default:
        return wi;
    }
  }
  remuxAudio(e, t, s, i, n) {
    const r = e.inputTimeScale, o = e.samplerate ? e.samplerate : r, l = r / o, c = this.getSamplesPerFrame(e), h = c * l, u = this._initPTS, d = e.segmentCodec === "mp3" && this.typeSupported.mpeg, f = [], m = n !== void 0;
    let p = e.samples, g = d ? 0 : 8, v = this.nextAudioPts || -1;
    const C = t * r, E = u.baseTime * r / u.timescale;
    if (this.isAudioContiguous = s = s || p.length && v > 0 && (i && Math.abs(C - v) < 9e3 || Math.abs(ye(p[0].pts - E, C) - v) < 20 * h), p.forEach(function(U) {
      U.pts = ye(U.pts - E, C);
    }), !s || v < 0) {
      if (p = p.filter((U) => U.pts >= 0), !p.length)
        return;
      n === 0 ? v = 0 : i && !m ? v = Math.max(0, C) : v = p[0].pts;
    }
    if (e.segmentCodec === "aac") {
      const U = this.config.maxAudioFramesDrift;
      for (let Z = 0, Q = v; Z < p.length; Z++) {
        const $ = p[Z], F = $.pts, q = F - Q, z = Math.abs(1e3 * q / r);
        if (q <= -U * h && m)
          Z === 0 && (S.warn(`Audio frame @ ${(F / r).toFixed(3)}s overlaps nextAudioPts by ${Math.round(1e3 * q / r)} ms.`), this.nextAudioPts = v = Q = F);
        else if (q >= U * h && z < _o && m) {
          let j = Math.round(q / h);
          Q = F - j * h, Q < 0 && (j--, Q += h), Z === 0 && (this.nextAudioPts = v = Q), S.warn(`[mp4-remuxer]: Injecting ${j} audio frame @ ${(Q / r).toFixed(3)}s due to ${Math.round(1e3 * q / r)} ms gap.`);
          for (let ie = 0; ie < j; ie++) {
            const ae = Math.max(Q, 0);
            let he = Ai.getSilentFrame(e.manifestCodec || e.codec, e.channelCount);
            he || (S.log("[mp4-remuxer]: Unable to get silent frame for given audio codec; duplicating last frame instead."), he = $.unit.subarray()), p.splice(Z, 0, {
              unit: he,
              pts: ae
            }), Q += h, Z++;
          }
        }
        $.pts = Q, Q += h;
      }
    }
    let T = null, x = null, I, L = 0, w = p.length;
    for (; w--; )
      L += p[w].unit.byteLength;
    for (let U = 0, Z = p.length; U < Z; U++) {
      const Q = p[U], $ = Q.unit;
      let F = Q.pts;
      if (x !== null) {
        const z = f[U - 1];
        z.duration = Math.round((F - x) / l);
      } else if (s && e.segmentCodec === "aac" && (F = v), T = F, L > 0) {
        L += g;
        try {
          I = new Uint8Array(L);
        } catch (z) {
          this.observer.emit(y.ERROR, y.ERROR, {
            type: K.MUX_ERROR,
            details: A.REMUX_ALLOC_ERROR,
            fatal: !1,
            error: z,
            bytes: L,
            reason: `fail allocating audio mdat ${L}`
          });
          return;
        }
        d || (new DataView(I.buffer).setUint32(0, L), I.set(b.types.mdat, 4));
      } else
        return;
      I.set($, g);
      const q = $.byteLength;
      g += q, f.push(new Ii(!0, c, q, 0)), x = F;
    }
    const R = f.length;
    if (!R)
      return;
    const k = f[f.length - 1];
    this.nextAudioPts = v = x + l * k.duration;
    const M = d ? new Uint8Array(0) : b.moof(e.sequenceNumber++, T / l, ne({}, e, {
      samples: f
    }));
    e.samples = [];
    const _ = T / r, P = v / r, B = {
      data1: M,
      data2: I,
      startPTS: _,
      endPTS: P,
      startDTS: _,
      endDTS: P,
      type: "audio",
      hasAudio: !0,
      hasVideo: !1,
      nb: R
    };
    return this.isAudioContiguous = !0, B;
  }
  remuxEmptyAudio(e, t, s, i) {
    const n = e.inputTimeScale, r = e.samplerate ? e.samplerate : n, o = n / r, l = this.nextAudioPts, c = this._initDTS, h = c.baseTime * 9e4 / c.timescale, u = (l !== null ? l : i.startDTS * n) + h, d = i.endDTS * n + h, f = o * wi, m = Math.ceil((d - u) / f), p = Ai.getSilentFrame(e.manifestCodec || e.codec, e.channelCount);
    if (S.warn("[mp4-remuxer]: remux empty Audio"), !p) {
      S.trace("[mp4-remuxer]: Unable to remuxEmptyAudio since we were unable to get a silent frame for given audio codec");
      return;
    }
    const g = [];
    for (let v = 0; v < m; v++) {
      const C = u + v * f;
      g.push({
        unit: p,
        pts: C,
        dts: C
      });
    }
    return e.samples = g, this.remuxAudio(e, t, s, !1);
  }
}
function ye(a, e) {
  let t;
  if (e === null)
    return a;
  for (e < a ? t = -8589934592 : t = 8589934592; Math.abs(a - e) > 4294967296; )
    a += t;
  return a;
}
function Bo(a) {
  for (let e = 0; e < a.length; e++)
    if (a[e].key)
      return e;
  return -1;
}
function Bn(a, e, t, s) {
  const i = a.samples.length;
  if (!i)
    return;
  const n = a.inputTimeScale;
  for (let o = 0; o < i; o++) {
    const l = a.samples[o];
    l.pts = ye(l.pts - t.baseTime * n / t.timescale, e * n) / n, l.dts = ye(l.dts - s.baseTime * n / s.timescale, e * n) / n;
  }
  const r = a.samples;
  return a.samples = [], {
    samples: r
  };
}
function Un(a, e, t) {
  const s = a.samples.length;
  if (!s)
    return;
  const i = a.inputTimeScale;
  for (let r = 0; r < s; r++) {
    const o = a.samples[r];
    o.pts = ye(o.pts - t.baseTime * i / t.timescale, e * i) / i;
  }
  a.samples.sort((r, o) => r.pts - o.pts);
  const n = a.samples;
  return a.samples = [], {
    samples: n
  };
}
class Ii {
  constructor(e, t, s, i) {
    this.size = void 0, this.duration = void 0, this.cts = void 0, this.flags = void 0, this.duration = t, this.size = s, this.cts = i, this.flags = {
      isLeading: 0,
      isDependedOn: 0,
      hasRedundancy: 0,
      degradPrio: 0,
      dependsOn: e ? 2 : 1,
      isNonSync: e ? 0 : 1
    };
  }
}
class Uo {
  constructor() {
    this.emitInitSegment = !1, this.audioCodec = void 0, this.videoCodec = void 0, this.initData = void 0, this.initPTS = null, this.initTracks = void 0, this.lastEndTime = null;
  }
  destroy() {
  }
  resetTimeStamp(e) {
    this.initPTS = e, this.lastEndTime = null;
  }
  resetNextTimestamp() {
    this.lastEndTime = null;
  }
  resetInitSegment(e, t, s, i) {
    this.audioCodec = t, this.videoCodec = s, this.generateInitSegment(Wr(e, i)), this.emitInitSegment = !0;
  }
  generateInitSegment(e) {
    let {
      audioCodec: t,
      videoCodec: s
    } = this;
    if (!(e != null && e.byteLength)) {
      this.initTracks = void 0, this.initData = void 0;
      return;
    }
    const i = this.initData = hn(e);
    i.audio && (t = Ri(i.audio, X.AUDIO)), i.video && (s = Ri(i.video, X.VIDEO));
    const n = {};
    i.audio && i.video ? n.audiovideo = {
      container: "video/mp4",
      codec: t + "," + s,
      initSegment: e,
      id: "main"
    } : i.audio ? n.audio = {
      container: "audio/mp4",
      codec: t,
      initSegment: e,
      id: "audio"
    } : i.video ? n.video = {
      container: "video/mp4",
      codec: s,
      initSegment: e,
      id: "main"
    } : S.warn("[passthrough-remuxer.ts]: initSegment does not contain moov or trak boxes."), this.initTracks = n;
  }
  remux(e, t, s, i, n, r) {
    var o, l;
    let {
      initPTS: c,
      lastEndTime: h
    } = this;
    const u = {
      audio: void 0,
      video: void 0,
      text: i,
      id3: s,
      initSegment: void 0
    };
    O(h) || (h = this.lastEndTime = n || 0);
    const d = t.samples;
    if (!(d != null && d.length))
      return u;
    const f = {
      initPTS: void 0,
      timescale: 1
    };
    let m = this.initData;
    if ((o = m) != null && o.length || (this.generateInitSegment(d), m = this.initData), !((l = m) != null && l.length))
      return S.warn("[passthrough-remuxer.ts]: Failed to generate initSegment."), u;
    this.emitInitSegment && (f.tracks = this.initTracks, this.emitInitSegment = !1);
    const p = Yr(d, m), g = zr(m, d), v = g === null ? n : g;
    ($o(c, v, n, p) || f.timescale !== c.timescale && r) && (f.initPTS = v - n, c && c.timescale === 1 && S.warn(`Adjusting initPTS by ${f.initPTS - c.baseTime}`), this.initPTS = c = {
      baseTime: f.initPTS,
      timescale: 1
    });
    const C = e ? v - c.baseTime / c.timescale : h, E = C + p;
    qr(m, d, c.baseTime / c.timescale), p > 0 ? this.lastEndTime = E : (S.warn("Duration parsed from mp4 should be greater than zero"), this.resetNextTimestamp());
    const T = !!m.audio, x = !!m.video;
    let I = "";
    T && (I += "audio"), x && (I += "video");
    const L = {
      data1: d,
      startPTS: C,
      startDTS: C,
      endPTS: E,
      endDTS: E,
      type: I,
      hasAudio: T,
      hasVideo: x,
      nb: 1,
      dropped: 0
    };
    return u.audio = L.type === "audio" ? L : void 0, u.video = L.type !== "audio" ? L : void 0, u.initSegment = f, u.id3 = Bn(s, n, c, c), i.samples.length && (u.text = Un(i, n, c)), u;
  }
}
function $o(a, e, t, s) {
  if (a === null)
    return !0;
  const i = Math.max(s, 1), n = e - a.baseTime / a.timescale;
  return Math.abs(n - t) > i;
}
function Ri(a, e) {
  const t = a == null ? void 0 : a.codec;
  if (t && t.length > 4)
    return t;
  if (e === X.AUDIO) {
    if (t === "ec-3" || t === "ac-3" || t === "alac")
      return t;
    if (t === "fLaC" || t === "Opus")
      return kt(t, !1);
    const s = "mp4a.40.5";
    return S.info(`Parsed audio codec "${t}" or audio object type not handled. Using "${s}"`), s;
  }
  return S.warn(`Unhandled video codec "${t}"`), t === "hvc1" || t === "hev1" ? "hvc1.1.6.L120.90" : t === "av01" ? "av01.0.04M.08" : "avc1.42e01e";
}
let Pe;
try {
  Pe = self.performance.now.bind(self.performance);
} catch {
  S.debug("Unable to use Performance API on this environment"), Pe = je == null ? void 0 : je.Date.now;
}
const St = [{
  demux: Lo,
  remux: Uo
}, {
  demux: _e,
  remux: xt
}, {
  demux: So,
  remux: xt
}, {
  demux: Mo,
  remux: xt
}];
St.splice(2, 0, {
  demux: Ao,
  remux: xt
});
class ki {
  constructor(e, t, s, i, n) {
    this.async = !1, this.observer = void 0, this.typeSupported = void 0, this.config = void 0, this.vendor = void 0, this.id = void 0, this.demuxer = void 0, this.remuxer = void 0, this.decrypter = void 0, this.probe = void 0, this.decryptionPromise = null, this.transmuxConfig = void 0, this.currentTransmuxState = void 0, this.observer = e, this.typeSupported = t, this.config = s, this.vendor = i, this.id = n;
  }
  configure(e) {
    this.transmuxConfig = e, this.decrypter && this.decrypter.reset();
  }
  push(e, t, s, i) {
    const n = s.transmuxing;
    n.executeStart = Pe();
    let r = new Uint8Array(e);
    const {
      currentTransmuxState: o,
      transmuxConfig: l
    } = this;
    i && (this.currentTransmuxState = i);
    const {
      contiguous: c,
      discontinuity: h,
      trackSwitch: u,
      accurateTimeOffset: d,
      timeOffset: f,
      initSegmentChange: m
    } = i || o, {
      audioCodec: p,
      videoCodec: g,
      defaultInitPts: v,
      duration: C,
      initSegmentData: E
    } = l, T = Vo(r, t);
    if (T && T.method === "AES-128") {
      const w = this.getDecrypter();
      if (w.isSync()) {
        let R = w.softwareDecrypt(r, T.key.buffer, T.iv.buffer);
        if (s.part > -1 && (R = w.flush()), !R)
          return n.executeEnd = Pe(), ts(s);
        r = new Uint8Array(R);
      } else
        return this.decryptionPromise = w.webCryptoDecrypt(r, T.key.buffer, T.iv.buffer).then((R) => {
          const k = this.push(R, null, s);
          return this.decryptionPromise = null, k;
        }), this.decryptionPromise;
    }
    const x = this.needsProbing(h, u);
    if (x) {
      const w = this.configureTransmuxer(r);
      if (w)
        return S.warn(`[transmuxer] ${w.message}`), this.observer.emit(y.ERROR, y.ERROR, {
          type: K.MEDIA_ERROR,
          details: A.FRAG_PARSING_ERROR,
          fatal: !1,
          error: w,
          reason: w.message
        }), n.executeEnd = Pe(), ts(s);
    }
    (h || u || m || x) && this.resetInitSegment(E, p, g, C, t), (h || m || x) && this.resetInitialTimestamp(v), c || this.resetContiguity();
    const I = this.transmux(r, T, f, d, s), L = this.currentTransmuxState;
    return L.contiguous = !0, L.discontinuity = !1, L.trackSwitch = !1, n.executeEnd = Pe(), I;
  }
  // Due to data caching, flush calls can produce more than one TransmuxerResult (hence the Array type)
  flush(e) {
    const t = e.transmuxing;
    t.executeStart = Pe();
    const {
      decrypter: s,
      currentTransmuxState: i,
      decryptionPromise: n
    } = this;
    if (n)
      return n.then(() => this.flush(e));
    const r = [], {
      timeOffset: o
    } = i;
    if (s) {
      const u = s.flush();
      u && r.push(this.push(u, null, e));
    }
    const {
      demuxer: l,
      remuxer: c
    } = this;
    if (!l || !c)
      return t.executeEnd = Pe(), [ts(e)];
    const h = l.flush(o);
    return bt(h) ? h.then((u) => (this.flushRemux(r, u, e), r)) : (this.flushRemux(r, h, e), r);
  }
  flushRemux(e, t, s) {
    const {
      audioTrack: i,
      videoTrack: n,
      id3Track: r,
      textTrack: o
    } = t, {
      accurateTimeOffset: l,
      timeOffset: c
    } = this.currentTransmuxState;
    S.log(`[transmuxer.ts]: Flushed fragment ${s.sn}${s.part > -1 ? " p: " + s.part : ""} of level ${s.level}`);
    const h = this.remuxer.remux(i, n, r, o, c, l, !0, this.id);
    e.push({
      remuxResult: h,
      chunkMeta: s
    }), s.transmuxing.executeEnd = Pe();
  }
  resetInitialTimestamp(e) {
    const {
      demuxer: t,
      remuxer: s
    } = this;
    !t || !s || (t.resetTimeStamp(e), s.resetTimeStamp(e));
  }
  resetContiguity() {
    const {
      demuxer: e,
      remuxer: t
    } = this;
    !e || !t || (e.resetContiguity(), t.resetNextTimestamp());
  }
  resetInitSegment(e, t, s, i, n) {
    const {
      demuxer: r,
      remuxer: o
    } = this;
    !r || !o || (r.resetInitSegment(e, t, s, i), o.resetInitSegment(e, t, s, n));
  }
  destroy() {
    this.demuxer && (this.demuxer.destroy(), this.demuxer = void 0), this.remuxer && (this.remuxer.destroy(), this.remuxer = void 0);
  }
  transmux(e, t, s, i, n) {
    let r;
    return t && t.method === "SAMPLE-AES" ? r = this.transmuxSampleAes(e, t, s, i, n) : r = this.transmuxUnencrypted(e, s, i, n), r;
  }
  transmuxUnencrypted(e, t, s, i) {
    const {
      audioTrack: n,
      videoTrack: r,
      id3Track: o,
      textTrack: l
    } = this.demuxer.demux(e, t, !1, !this.config.progressive);
    return {
      remuxResult: this.remuxer.remux(n, r, o, l, t, s, !1, this.id),
      chunkMeta: i
    };
  }
  transmuxSampleAes(e, t, s, i, n) {
    return this.demuxer.demuxSampleAes(e, t, s).then((r) => ({
      remuxResult: this.remuxer.remux(r.audioTrack, r.videoTrack, r.id3Track, r.textTrack, s, i, !1, this.id),
      chunkMeta: n
    }));
  }
  configureTransmuxer(e) {
    const {
      config: t,
      observer: s,
      typeSupported: i,
      vendor: n
    } = this;
    let r;
    for (let d = 0, f = St.length; d < f; d++) {
      var o;
      if ((o = St[d].demux) != null && o.probe(e)) {
        r = St[d];
        break;
      }
    }
    if (!r)
      return new Error("Failed to find demuxer by probing fragment data");
    const l = this.demuxer, c = this.remuxer, h = r.remux, u = r.demux;
    (!c || !(c instanceof h)) && (this.remuxer = new h(s, t, i, n)), (!l || !(l instanceof u)) && (this.demuxer = new u(s, t, i), this.probe = u.probe);
  }
  needsProbing(e, t) {
    return !this.demuxer || !this.remuxer || e || t;
  }
  getDecrypter() {
    let e = this.decrypter;
    return e || (e = this.decrypter = new Ms(this.config)), e;
  }
}
function Vo(a, e) {
  let t = null;
  return a.byteLength > 0 && (e == null ? void 0 : e.key) != null && e.iv !== null && e.method != null && (t = e), t;
}
const ts = (a) => ({
  remuxResult: {},
  chunkMeta: a
});
function bt(a) {
  return "then" in a && a.then instanceof Function;
}
class Ho {
  constructor(e, t, s, i, n) {
    this.audioCodec = void 0, this.videoCodec = void 0, this.initSegmentData = void 0, this.duration = void 0, this.defaultInitPts = void 0, this.audioCodec = e, this.videoCodec = t, this.initSegmentData = s, this.duration = i, this.defaultInitPts = n || null;
  }
}
class Go {
  constructor(e, t, s, i, n, r) {
    this.discontinuity = void 0, this.contiguous = void 0, this.accurateTimeOffset = void 0, this.trackSwitch = void 0, this.timeOffset = void 0, this.initSegmentChange = void 0, this.discontinuity = e, this.contiguous = t, this.accurateTimeOffset = s, this.trackSwitch = i, this.timeOffset = n, this.initSegmentChange = r;
  }
}
var $n = { exports: {} };
(function(a) {
  var e = Object.prototype.hasOwnProperty, t = "~";
  function s() {
  }
  Object.create && (s.prototype = /* @__PURE__ */ Object.create(null), new s().__proto__ || (t = !1));
  function i(l, c, h) {
    this.fn = l, this.context = c, this.once = h || !1;
  }
  function n(l, c, h, u, d) {
    if (typeof h != "function")
      throw new TypeError("The listener must be a function");
    var f = new i(h, u || l, d), m = t ? t + c : c;
    return l._events[m] ? l._events[m].fn ? l._events[m] = [l._events[m], f] : l._events[m].push(f) : (l._events[m] = f, l._eventsCount++), l;
  }
  function r(l, c) {
    --l._eventsCount === 0 ? l._events = new s() : delete l._events[c];
  }
  function o() {
    this._events = new s(), this._eventsCount = 0;
  }
  o.prototype.eventNames = function() {
    var c = [], h, u;
    if (this._eventsCount === 0)
      return c;
    for (u in h = this._events)
      e.call(h, u) && c.push(t ? u.slice(1) : u);
    return Object.getOwnPropertySymbols ? c.concat(Object.getOwnPropertySymbols(h)) : c;
  }, o.prototype.listeners = function(c) {
    var h = t ? t + c : c, u = this._events[h];
    if (!u)
      return [];
    if (u.fn)
      return [u.fn];
    for (var d = 0, f = u.length, m = new Array(f); d < f; d++)
      m[d] = u[d].fn;
    return m;
  }, o.prototype.listenerCount = function(c) {
    var h = t ? t + c : c, u = this._events[h];
    return u ? u.fn ? 1 : u.length : 0;
  }, o.prototype.emit = function(c, h, u, d, f, m) {
    var p = t ? t + c : c;
    if (!this._events[p])
      return !1;
    var g = this._events[p], v = arguments.length, C, E;
    if (g.fn) {
      switch (g.once && this.removeListener(c, g.fn, void 0, !0), v) {
        case 1:
          return g.fn.call(g.context), !0;
        case 2:
          return g.fn.call(g.context, h), !0;
        case 3:
          return g.fn.call(g.context, h, u), !0;
        case 4:
          return g.fn.call(g.context, h, u, d), !0;
        case 5:
          return g.fn.call(g.context, h, u, d, f), !0;
        case 6:
          return g.fn.call(g.context, h, u, d, f, m), !0;
      }
      for (E = 1, C = new Array(v - 1); E < v; E++)
        C[E - 1] = arguments[E];
      g.fn.apply(g.context, C);
    } else {
      var T = g.length, x;
      for (E = 0; E < T; E++)
        switch (g[E].once && this.removeListener(c, g[E].fn, void 0, !0), v) {
          case 1:
            g[E].fn.call(g[E].context);
            break;
          case 2:
            g[E].fn.call(g[E].context, h);
            break;
          case 3:
            g[E].fn.call(g[E].context, h, u);
            break;
          case 4:
            g[E].fn.call(g[E].context, h, u, d);
            break;
          default:
            if (!C)
              for (x = 1, C = new Array(v - 1); x < v; x++)
                C[x - 1] = arguments[x];
            g[E].fn.apply(g[E].context, C);
        }
    }
    return !0;
  }, o.prototype.on = function(c, h, u) {
    return n(this, c, h, u, !1);
  }, o.prototype.once = function(c, h, u) {
    return n(this, c, h, u, !0);
  }, o.prototype.removeListener = function(c, h, u, d) {
    var f = t ? t + c : c;
    if (!this._events[f])
      return this;
    if (!h)
      return r(this, f), this;
    var m = this._events[f];
    if (m.fn)
      m.fn === h && (!d || m.once) && (!u || m.context === u) && r(this, f);
    else {
      for (var p = 0, g = [], v = m.length; p < v; p++)
        (m[p].fn !== h || d && !m[p].once || u && m[p].context !== u) && g.push(m[p]);
      g.length ? this._events[f] = g.length === 1 ? g[0] : g : r(this, f);
    }
    return this;
  }, o.prototype.removeAllListeners = function(c) {
    var h;
    return c ? (h = t ? t + c : c, this._events[h] && r(this, h)) : (this._events = new s(), this._eventsCount = 0), this;
  }, o.prototype.off = o.prototype.removeListener, o.prototype.addListener = o.prototype.on, o.prefixed = t, o.EventEmitter = o, a.exports = o;
})($n);
var Ko = $n.exports, Bs = /* @__PURE__ */ dr(Ko);
class Vn {
  constructor(e, t, s, i) {
    this.error = null, this.hls = void 0, this.id = void 0, this.observer = void 0, this.frag = null, this.part = null, this.useWorker = void 0, this.workerContext = null, this.onwmsg = void 0, this.transmuxer = null, this.onTransmuxComplete = void 0, this.onFlush = void 0;
    const n = e.config;
    this.hls = e, this.id = t, this.useWorker = !!n.enableWorker, this.onTransmuxComplete = s, this.onFlush = i;
    const r = (c, h) => {
      h = h || {}, h.frag = this.frag, h.id = this.id, c === y.ERROR && (this.error = h.error), this.hls.trigger(c, h);
    };
    this.observer = new Bs(), this.observer.on(y.FRAG_DECRYPTED, r), this.observer.on(y.ERROR, r);
    const o = Ve(n.preferManagedMediaSource) || {
      isTypeSupported: () => !1
    }, l = {
      mpeg: o.isTypeSupported("audio/mpeg"),
      mp3: o.isTypeSupported('audio/mp4; codecs="mp3"'),
      ac3: o.isTypeSupported('audio/mp4; codecs="ac-3"')
    };
    if (this.useWorker && typeof Worker < "u" && (n.workerPath || lo())) {
      try {
        n.workerPath ? (S.log(`loading Web Worker ${n.workerPath} for "${t}"`), this.workerContext = ho(n.workerPath)) : (S.log(`injecting Web Worker for "${t}"`), this.workerContext = co()), this.onwmsg = (u) => this.onWorkerMessage(u);
        const {
          worker: h
        } = this.workerContext;
        h.addEventListener("message", this.onwmsg), h.onerror = (u) => {
          const d = new Error(`${u.message}  (${u.filename}:${u.lineno})`);
          n.enableWorker = !1, S.warn(`Error in "${t}" Web Worker, fallback to inline`), this.hls.trigger(y.ERROR, {
            type: K.OTHER_ERROR,
            details: A.INTERNAL_EXCEPTION,
            fatal: !1,
            event: "demuxerWorker",
            error: d
          });
        }, h.postMessage({
          cmd: "init",
          typeSupported: l,
          vendor: "",
          id: t,
          config: JSON.stringify(n)
        });
      } catch (h) {
        S.warn(`Error setting up "${t}" Web Worker, fallback to inline`, h), this.resetWorker(), this.error = null, this.transmuxer = new ki(this.observer, l, n, "", t);
      }
      return;
    }
    this.transmuxer = new ki(this.observer, l, n, "", t);
  }
  resetWorker() {
    if (this.workerContext) {
      const {
        worker: e,
        objectURL: t
      } = this.workerContext;
      t && self.URL.revokeObjectURL(t), e.removeEventListener("message", this.onwmsg), e.onerror = null, e.terminate(), this.workerContext = null;
    }
  }
  destroy() {
    if (this.workerContext)
      this.resetWorker(), this.onwmsg = void 0;
    else {
      const t = this.transmuxer;
      t && (t.destroy(), this.transmuxer = null);
    }
    const e = this.observer;
    e && e.removeAllListeners(), this.frag = null, this.observer = null, this.hls = null;
  }
  push(e, t, s, i, n, r, o, l, c, h) {
    var u, d;
    c.transmuxing.start = self.performance.now();
    const {
      transmuxer: f
    } = this, m = r ? r.start : n.start, p = n.decryptdata, g = this.frag, v = !(g && n.cc === g.cc), C = !(g && c.level === g.level), E = g ? c.sn - g.sn : -1, T = this.part ? c.part - this.part.index : -1, x = E === 0 && c.id > 1 && c.id === (g == null ? void 0 : g.stats.chunkCount), I = !C && (E === 1 || E === 0 && (T === 1 || x && T <= 0)), L = self.performance.now();
    (C || E || n.stats.parsing.start === 0) && (n.stats.parsing.start = L), r && (T || !I) && (r.stats.parsing.start = L);
    const w = !(g && ((u = n.initSegment) == null ? void 0 : u.url) === ((d = g.initSegment) == null ? void 0 : d.url)), R = new Go(v, I, l, C, m, w);
    if (!I || v || w) {
      S.log(`[transmuxer-interface, ${n.type}]: Starting new transmux session for sn: ${c.sn} p: ${c.part} level: ${c.level} id: ${c.id}
        discontinuity: ${v}
        trackSwitch: ${C}
        contiguous: ${I}
        accurateTimeOffset: ${l}
        timeOffset: ${m}
        initSegmentChange: ${w}`);
      const k = new Ho(s, i, t, o, h);
      this.configureTransmuxer(k);
    }
    if (this.frag = n, this.part = r, this.workerContext)
      this.workerContext.worker.postMessage({
        cmd: "demux",
        data: e,
        decryptdata: p,
        chunkMeta: c,
        state: R
      }, e instanceof ArrayBuffer ? [e] : []);
    else if (f) {
      const k = f.push(e, p, c, R);
      bt(k) ? (f.async = !0, k.then((M) => {
        this.handleTransmuxComplete(M);
      }).catch((M) => {
        this.transmuxerError(M, c, "transmuxer-interface push error");
      })) : (f.async = !1, this.handleTransmuxComplete(k));
    }
  }
  flush(e) {
    e.transmuxing.start = self.performance.now();
    const {
      transmuxer: t
    } = this;
    if (this.workerContext)
      this.workerContext.worker.postMessage({
        cmd: "flush",
        chunkMeta: e
      });
    else if (t) {
      let s = t.flush(e);
      bt(s) || t.async ? (bt(s) || (s = Promise.resolve(s)), s.then((n) => {
        this.handleFlushResult(n, e);
      }).catch((n) => {
        this.transmuxerError(n, e, "transmuxer-interface flush error");
      })) : this.handleFlushResult(s, e);
    }
  }
  transmuxerError(e, t, s) {
    this.hls && (this.error = e, this.hls.trigger(y.ERROR, {
      type: K.MEDIA_ERROR,
      details: A.FRAG_PARSING_ERROR,
      chunkMeta: t,
      frag: this.frag || void 0,
      fatal: !1,
      error: e,
      err: e,
      reason: s
    }));
  }
  handleFlushResult(e, t) {
    e.forEach((s) => {
      this.handleTransmuxComplete(s);
    }), this.onFlush(t);
  }
  onWorkerMessage(e) {
    const t = e.data;
    if (!(t != null && t.event)) {
      S.warn(`worker message received with no ${t ? "event name" : "data"}`);
      return;
    }
    const s = this.hls;
    if (this.hls)
      switch (t.event) {
        case "init": {
          var i;
          const n = (i = this.workerContext) == null ? void 0 : i.objectURL;
          n && self.URL.revokeObjectURL(n);
          break;
        }
        case "transmuxComplete": {
          this.handleTransmuxComplete(t.data);
          break;
        }
        case "flush": {
          this.onFlush(t.data);
          break;
        }
        case "workerLog":
          S[t.data.logType] && S[t.data.logType](t.data.message);
          break;
        default: {
          t.data = t.data || {}, t.data.frag = this.frag, t.data.id = this.id, s.trigger(t.event, t.data);
          break;
        }
      }
  }
  configureTransmuxer(e) {
    const {
      transmuxer: t
    } = this;
    this.workerContext ? this.workerContext.worker.postMessage({
      cmd: "configure",
      config: e
    }) : t && t.configure(e);
  }
  handleTransmuxComplete(e) {
    e.chunkMeta.transmuxing.end = self.performance.now(), this.onTransmuxComplete(e);
  }
}
function Hn(a, e) {
  if (a.length !== e.length)
    return !1;
  for (let t = 0; t < a.length; t++)
    if (!Qe(a[t].attrs, e[t].attrs))
      return !1;
  return !0;
}
function Qe(a, e, t) {
  const s = a["STABLE-RENDITION-ID"];
  return s && !t ? s === e["STABLE-RENDITION-ID"] : !(t || ["LANGUAGE", "NAME", "CHARACTERISTICS", "AUTOSELECT", "DEFAULT", "FORCED", "ASSOC-LANGUAGE"]).some((i) => a[i] !== e[i]);
}
function Cs(a, e) {
  return e.label.toLowerCase() === a.name.toLowerCase() && (!e.language || e.language.toLowerCase() === (a.lang || "").toLowerCase());
}
const Di = 100;
class Wo extends Ps {
  constructor(e, t, s) {
    super(e, t, s, "[audio-stream-controller]", H.AUDIO), this.videoBuffer = null, this.videoTrackCC = -1, this.waitingVideoCC = -1, this.bufferedTrack = null, this.switchingTrack = null, this.trackId = -1, this.waitingData = null, this.mainDetails = null, this.flushing = !1, this.bufferFlushed = !1, this.cachedTrackLoadedData = null, this._registerListeners();
  }
  onHandlerDestroying() {
    this._unregisterListeners(), super.onHandlerDestroying(), this.mainDetails = null, this.bufferedTrack = null, this.switchingTrack = null;
  }
  _registerListeners() {
    const {
      hls: e
    } = this;
    e.on(y.MEDIA_ATTACHED, this.onMediaAttached, this), e.on(y.MEDIA_DETACHING, this.onMediaDetaching, this), e.on(y.MANIFEST_LOADING, this.onManifestLoading, this), e.on(y.LEVEL_LOADED, this.onLevelLoaded, this), e.on(y.AUDIO_TRACKS_UPDATED, this.onAudioTracksUpdated, this), e.on(y.AUDIO_TRACK_SWITCHING, this.onAudioTrackSwitching, this), e.on(y.AUDIO_TRACK_LOADED, this.onAudioTrackLoaded, this), e.on(y.ERROR, this.onError, this), e.on(y.BUFFER_RESET, this.onBufferReset, this), e.on(y.BUFFER_CREATED, this.onBufferCreated, this), e.on(y.BUFFER_FLUSHING, this.onBufferFlushing, this), e.on(y.BUFFER_FLUSHED, this.onBufferFlushed, this), e.on(y.INIT_PTS_FOUND, this.onInitPtsFound, this), e.on(y.FRAG_BUFFERED, this.onFragBuffered, this);
  }
  _unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(y.MEDIA_ATTACHED, this.onMediaAttached, this), e.off(y.MEDIA_DETACHING, this.onMediaDetaching, this), e.off(y.MANIFEST_LOADING, this.onManifestLoading, this), e.off(y.LEVEL_LOADED, this.onLevelLoaded, this), e.off(y.AUDIO_TRACKS_UPDATED, this.onAudioTracksUpdated, this), e.off(y.AUDIO_TRACK_SWITCHING, this.onAudioTrackSwitching, this), e.off(y.AUDIO_TRACK_LOADED, this.onAudioTrackLoaded, this), e.off(y.ERROR, this.onError, this), e.off(y.BUFFER_RESET, this.onBufferReset, this), e.off(y.BUFFER_CREATED, this.onBufferCreated, this), e.off(y.BUFFER_FLUSHING, this.onBufferFlushing, this), e.off(y.BUFFER_FLUSHED, this.onBufferFlushed, this), e.off(y.INIT_PTS_FOUND, this.onInitPtsFound, this), e.off(y.FRAG_BUFFERED, this.onFragBuffered, this);
  }
  // INIT_PTS_FOUND is triggered when the video track parsed in the stream-controller has a new PTS value
  onInitPtsFound(e, {
    frag: t,
    id: s,
    initPTS: i,
    timescale: n
  }) {
    if (s === "main") {
      const r = t.cc;
      this.initPTS[t.cc] = {
        baseTime: i,
        timescale: n
      }, this.log(`InitPTS for cc: ${r} found from main: ${i}`), this.videoTrackCC = r, this.state === D.WAITING_INIT_PTS && this.tick();
    }
  }
  startLoad(e) {
    if (!this.levels) {
      this.startPosition = e, this.state = D.STOPPED;
      return;
    }
    const t = this.lastCurrentTime;
    this.stopLoad(), this.setInterval(Di), t > 0 && e === -1 ? (this.log(`Override startPosition with lastCurrentTime @${t.toFixed(3)}`), e = t, this.state = D.IDLE) : (this.loadedmetadata = !1, this.state = D.WAITING_TRACK), this.nextLoadPosition = this.startPosition = this.lastCurrentTime = e, this.tick();
  }
  doTick() {
    switch (this.state) {
      case D.IDLE:
        this.doTickIdle();
        break;
      case D.WAITING_TRACK: {
        var e;
        const {
          levels: s,
          trackId: i
        } = this, n = s == null || (e = s[i]) == null ? void 0 : e.details;
        if (n) {
          if (this.waitForCdnTuneIn(n))
            break;
          this.state = D.WAITING_INIT_PTS;
        }
        break;
      }
      case D.FRAG_LOADING_WAITING_RETRY: {
        var t;
        const s = performance.now(), i = this.retryDate;
        if (!i || s >= i || (t = this.media) != null && t.seeking) {
          const {
            levels: n,
            trackId: r
          } = this;
          this.log("RetryDate reached, switch back to IDLE state"), this.resetStartWhenNotLoaded((n == null ? void 0 : n[r]) || null), this.state = D.IDLE;
        }
        break;
      }
      case D.WAITING_INIT_PTS: {
        const s = this.waitingData;
        if (s) {
          const {
            frag: i,
            part: n,
            cache: r,
            complete: o
          } = s;
          if (this.initPTS[i.cc] !== void 0) {
            this.waitingData = null, this.waitingVideoCC = -1, this.state = D.FRAG_LOADING;
            const l = r.flush(), c = {
              frag: i,
              part: n,
              payload: l,
              networkDetails: null
            };
            this._handleFragmentLoadProgress(c), o && super._handleFragmentLoadComplete(c);
          } else if (this.videoTrackCC !== this.waitingVideoCC)
            this.log(`Waiting fragment cc (${i.cc}) cancelled because video is at cc ${this.videoTrackCC}`), this.clearWaitingFragment();
          else {
            const l = this.getLoadPosition(), c = ee.bufferInfo(this.mediaBuffer, l, this.config.maxBufferHole);
            ys(c.end, this.config.maxFragLookUpTolerance, i) < 0 && (this.log(`Waiting fragment cc (${i.cc}) @ ${i.start} cancelled because another fragment at ${c.end} is needed`), this.clearWaitingFragment());
          }
        } else
          this.state = D.IDLE;
      }
    }
    this.onTickEnd();
  }
  clearWaitingFragment() {
    const e = this.waitingData;
    e && (this.fragmentTracker.removeFragment(e.frag), this.waitingData = null, this.waitingVideoCC = -1, this.state = D.IDLE);
  }
  resetLoadingState() {
    this.clearWaitingFragment(), super.resetLoadingState();
  }
  onTickEnd() {
    const {
      media: e
    } = this;
    e != null && e.readyState && (this.lastCurrentTime = e.currentTime);
  }
  doTickIdle() {
    const {
      hls: e,
      levels: t,
      media: s,
      trackId: i
    } = this, n = e.config;
    if (!s && (this.startFragRequested || !n.startFragPrefetch) || !(t != null && t[i]))
      return;
    const r = t[i], o = r.details;
    if (!o || o.live && this.levelLastLoaded !== r || this.waitForCdnTuneIn(o)) {
      this.state = D.WAITING_TRACK;
      return;
    }
    const l = this.mediaBuffer ? this.mediaBuffer : this.media;
    this.bufferFlushed && l && (this.bufferFlushed = !1, this.afterBufferFlushed(l, X.AUDIO, H.AUDIO));
    const c = this.getFwdBufferInfo(l, H.AUDIO);
    if (c === null)
      return;
    const {
      bufferedTrack: h,
      switchingTrack: u
    } = this;
    if (!u && this._streamEnded(c, o)) {
      e.trigger(y.BUFFER_EOS, {
        type: "audio"
      }), this.state = D.ENDED;
      return;
    }
    const d = this.getFwdBufferInfo(this.videoBuffer ? this.videoBuffer : this.media, H.MAIN), f = c.len, m = this.getMaxBufferLength(d == null ? void 0 : d.len), p = o.fragments, g = p[0].start;
    let v = this.flushing ? this.getLoadPosition() : c.end;
    if (u && s) {
      const x = this.getLoadPosition();
      h && !Qe(u.attrs, h.attrs) && (v = x), o.PTSKnown && x < g && (c.end > g || c.nextStart) && (this.log("Alt audio track ahead of main track, seek to start of alt audio track"), s.currentTime = g + 0.05);
    }
    if (f >= m && !u && v < p[p.length - 1].start)
      return;
    let C = this.getNextFragment(v, o), E = !1;
    if (C && this.isLoopLoading(C, v) && (E = !!C.gap, C = this.getNextFragmentLoopLoading(C, o, c, H.MAIN, m)), !C) {
      this.bufferFlushed = !0;
      return;
    }
    const T = d && C.start > d.end + o.targetduration;
    if (T || // Or wait for main buffer after buffing some audio
    !(d != null && d.len) && c.len) {
      const x = this.getAppendedFrag(C.start, H.MAIN);
      if (x === null || (E || (E = !!x.gap || !!T && d.len === 0), T && !E || E && c.nextStart && c.nextStart < x.end))
        return;
    }
    this.loadFragment(C, r, v);
  }
  getMaxBufferLength(e) {
    const t = super.getMaxBufferLength();
    return e ? Math.min(Math.max(t, e), this.config.maxMaxBufferLength) : t;
  }
  onMediaDetaching() {
    this.videoBuffer = null, this.bufferFlushed = this.flushing = !1, super.onMediaDetaching();
  }
  onAudioTracksUpdated(e, {
    audioTracks: t
  }) {
    this.resetTransmuxer(), this.levels = t.map((s) => new Xe(s));
  }
  onAudioTrackSwitching(e, t) {
    const s = !!t.url;
    this.trackId = t.id;
    const {
      fragCurrent: i
    } = this;
    i && (i.abortRequests(), this.removeUnbufferedFrags(i.start)), this.resetLoadingState(), s ? this.setInterval(Di) : this.resetTransmuxer(), s ? (this.switchingTrack = t, this.state = D.IDLE, this.flushAudioIfNeeded(t)) : (this.switchingTrack = null, this.bufferedTrack = t, this.state = D.STOPPED), this.tick();
  }
  onManifestLoading() {
    this.fragmentTracker.removeAllFragments(), this.startPosition = this.lastCurrentTime = 0, this.bufferFlushed = this.flushing = !1, this.levels = this.mainDetails = this.waitingData = this.bufferedTrack = this.cachedTrackLoadedData = this.switchingTrack = null, this.startFragRequested = !1, this.trackId = this.videoTrackCC = this.waitingVideoCC = -1;
  }
  onLevelLoaded(e, t) {
    this.mainDetails = t.details, this.cachedTrackLoadedData !== null && (this.hls.trigger(y.AUDIO_TRACK_LOADED, this.cachedTrackLoadedData), this.cachedTrackLoadedData = null);
  }
  onAudioTrackLoaded(e, t) {
    var s;
    if (this.mainDetails == null) {
      this.cachedTrackLoadedData = t;
      return;
    }
    const {
      levels: i
    } = this, {
      details: n,
      id: r
    } = t;
    if (!i) {
      this.warn(`Audio tracks were reset while loading level ${r}`);
      return;
    }
    this.log(`Audio track ${r} loaded [${n.startSN},${n.endSN}]${n.lastPartSn ? `[part-${n.lastPartSn}-${n.lastPartIndex}]` : ""},duration:${n.totalduration}`);
    const o = i[r];
    let l = 0;
    if (n.live || (s = o.details) != null && s.live) {
      this.checkLiveUpdate(n);
      const h = this.mainDetails;
      if (n.deltaUpdateFailed || !h)
        return;
      if (!o.details && n.hasProgramDateTime && h.hasProgramDateTime)
        _t(n, h), l = n.fragments[0].start;
      else {
        var c;
        l = this.alignPlaylists(n, o.details, (c = this.levelLastLoaded) == null ? void 0 : c.details);
      }
    }
    o.details = n, this.levelLastLoaded = o, !this.startFragRequested && (this.mainDetails || !n.live) && this.setStartPosition(this.mainDetails || n, l), this.state === D.WAITING_TRACK && !this.waitForCdnTuneIn(n) && (this.state = D.IDLE), this.tick();
  }
  _handleFragmentLoadProgress(e) {
    var t;
    const {
      frag: s,
      part: i,
      payload: n
    } = e, {
      config: r,
      trackId: o,
      levels: l
    } = this;
    if (!l) {
      this.warn(`Audio tracks were reset while fragment load was in progress. Fragment ${s.sn} of level ${s.level} will not be buffered`);
      return;
    }
    const c = l[o];
    if (!c) {
      this.warn("Audio track is undefined on fragment load progress");
      return;
    }
    const h = c.details;
    if (!h) {
      this.warn("Audio track details undefined on fragment load progress"), this.removeUnbufferedFrags(s.start);
      return;
    }
    const u = r.defaultAudioCodec || c.audioCodec || "mp4a.40.2";
    let d = this.transmuxer;
    d || (d = this.transmuxer = new Vn(this.hls, H.AUDIO, this._handleTransmuxComplete.bind(this), this._handleTransmuxerFlush.bind(this)));
    const f = this.initPTS[s.cc], m = (t = s.initSegment) == null ? void 0 : t.data;
    if (f !== void 0) {
      const g = i ? i.index : -1, v = g !== -1, C = new Ds(s.level, s.sn, s.stats.chunkCount, n.byteLength, g, v);
      d.push(n, m, u, "", s, i, h.totalduration, !1, C, f);
    } else {
      this.log(`Unknown video PTS for cc ${s.cc}, waiting for video PTS before demuxing audio frag ${s.sn} of [${h.startSN} ,${h.endSN}],track ${o}`);
      const {
        cache: p
      } = this.waitingData = this.waitingData || {
        frag: s,
        part: i,
        cache: new Ln(),
        complete: !1
      };
      p.push(new Uint8Array(n)), this.waitingVideoCC = this.videoTrackCC, this.state = D.WAITING_INIT_PTS;
    }
  }
  _handleFragmentLoadComplete(e) {
    if (this.waitingData) {
      this.waitingData.complete = !0;
      return;
    }
    super._handleFragmentLoadComplete(e);
  }
  onBufferReset() {
    this.mediaBuffer = this.videoBuffer = null, this.loadedmetadata = !1;
  }
  onBufferCreated(e, t) {
    const s = t.tracks.audio;
    s && (this.mediaBuffer = s.buffer || null), t.tracks.video && (this.videoBuffer = t.tracks.video.buffer || null);
  }
  onFragBuffered(e, t) {
    const {
      frag: s,
      part: i
    } = t;
    if (s.type !== H.AUDIO) {
      if (!this.loadedmetadata && s.type === H.MAIN) {
        const n = this.videoBuffer || this.media;
        n && ee.getBuffered(n).length && (this.loadedmetadata = !0);
      }
      return;
    }
    if (this.fragContextChanged(s)) {
      this.warn(`Fragment ${s.sn}${i ? " p: " + i.index : ""} of level ${s.level} finished buffering, but was aborted. state: ${this.state}, audioSwitch: ${this.switchingTrack ? this.switchingTrack.name : "false"}`);
      return;
    }
    if (s.sn !== "initSegment") {
      this.fragPrevious = s;
      const n = this.switchingTrack;
      n && (this.bufferedTrack = n, this.switchingTrack = null, this.hls.trigger(y.AUDIO_TRACK_SWITCHED, ce({}, n)));
    }
    this.fragBufferedComplete(s, i);
  }
  onError(e, t) {
    var s;
    if (t.fatal) {
      this.state = D.ERROR;
      return;
    }
    switch (t.details) {
      case A.FRAG_GAP:
      case A.FRAG_PARSING_ERROR:
      case A.FRAG_DECRYPT_ERROR:
      case A.FRAG_LOAD_ERROR:
      case A.FRAG_LOAD_TIMEOUT:
      case A.KEY_LOAD_ERROR:
      case A.KEY_LOAD_TIMEOUT:
        this.onFragmentOrKeyLoadError(H.AUDIO, t);
        break;
      case A.AUDIO_TRACK_LOAD_ERROR:
      case A.AUDIO_TRACK_LOAD_TIMEOUT:
      case A.LEVEL_PARSING_ERROR:
        !t.levelRetry && this.state === D.WAITING_TRACK && ((s = t.context) == null ? void 0 : s.type) === Y.AUDIO_TRACK && (this.state = D.IDLE);
        break;
      case A.BUFFER_APPEND_ERROR:
      case A.BUFFER_FULL_ERROR:
        if (!t.parent || t.parent !== "audio")
          return;
        if (t.details === A.BUFFER_APPEND_ERROR) {
          this.resetLoadingState();
          return;
        }
        this.reduceLengthAndFlushBuffer(t) && (this.bufferedTrack = null, super.flushMainBuffer(0, Number.POSITIVE_INFINITY, "audio"));
        break;
      case A.INTERNAL_EXCEPTION:
        this.recoverWorkerError(t);
        break;
    }
  }
  onBufferFlushing(e, {
    type: t
  }) {
    t !== X.VIDEO && (this.flushing = !0);
  }
  onBufferFlushed(e, {
    type: t
  }) {
    if (t !== X.VIDEO) {
      this.flushing = !1, this.bufferFlushed = !0, this.state === D.ENDED && (this.state = D.IDLE);
      const s = this.mediaBuffer || this.media;
      s && (this.afterBufferFlushed(s, t, H.AUDIO), this.tick());
    }
  }
  _handleTransmuxComplete(e) {
    var t;
    const s = "audio", {
      hls: i
    } = this, {
      remuxResult: n,
      chunkMeta: r
    } = e, o = this.getCurrentContext(r);
    if (!o) {
      this.resetWhenMissingContext(r);
      return;
    }
    const {
      frag: l,
      part: c,
      level: h
    } = o, {
      details: u
    } = h, {
      audio: d,
      text: f,
      id3: m,
      initSegment: p
    } = n;
    if (this.fragContextChanged(l) || !u) {
      this.fragmentTracker.removeFragment(l);
      return;
    }
    if (this.state = D.PARSING, this.switchingTrack && d && this.completeAudioSwitch(this.switchingTrack), p != null && p.tracks) {
      const g = l.initSegment || l;
      this._bufferInitSegment(h, p.tracks, g, r), i.trigger(y.FRAG_PARSING_INIT_SEGMENT, {
        frag: g,
        id: s,
        tracks: p.tracks
      });
    }
    if (d) {
      const {
        startPTS: g,
        endPTS: v,
        startDTS: C,
        endDTS: E
      } = d;
      c && (c.elementaryStreams[X.AUDIO] = {
        startPTS: g,
        endPTS: v,
        startDTS: C,
        endDTS: E
      }), l.setElementaryStreamInfo(X.AUDIO, g, v, C, E), this.bufferFragmentData(d, l, c, r);
    }
    if (m != null && (t = m.samples) != null && t.length) {
      const g = ne({
        id: s,
        frag: l,
        details: u
      }, m);
      i.trigger(y.FRAG_PARSING_METADATA, g);
    }
    if (f) {
      const g = ne({
        id: s,
        frag: l,
        details: u
      }, f);
      i.trigger(y.FRAG_PARSING_USERDATA, g);
    }
  }
  _bufferInitSegment(e, t, s, i) {
    if (this.state !== D.PARSING)
      return;
    t.video && delete t.video;
    const n = t.audio;
    if (!n)
      return;
    n.id = "audio";
    const r = e.audioCodec;
    this.log(`Init audio buffer, container:${n.container}, codecs[level/parsed]=[${r}/${n.codec}]`), r && r.split(",").length === 1 && (n.levelCodec = r), this.hls.trigger(y.BUFFER_CODECS, t);
    const o = n.initSegment;
    if (o != null && o.byteLength) {
      const l = {
        type: "audio",
        frag: s,
        part: null,
        chunkMeta: i,
        parent: s.type,
        data: o
      };
      this.hls.trigger(y.BUFFER_APPENDING, l);
    }
    this.tickImmediate();
  }
  loadFragment(e, t, s) {
    const i = this.fragmentTracker.getState(e);
    if (this.fragCurrent = e, this.switchingTrack || i === le.NOT_LOADED || i === le.PARTIAL) {
      var n;
      if (e.sn === "initSegment")
        this._loadInitSegment(e, t);
      else if ((n = t.details) != null && n.live && !this.initPTS[e.cc]) {
        this.log(`Waiting for video PTS in continuity counter ${e.cc} of live stream before loading audio fragment ${e.sn} of level ${this.trackId}`), this.state = D.WAITING_INIT_PTS;
        const r = this.mainDetails;
        r && r.fragments[0].start !== t.details.fragments[0].start && _t(t.details, r);
      } else
        this.startFragRequested = !0, super.loadFragment(e, t, s);
    } else
      this.clearTrackerIfNeeded(e);
  }
  flushAudioIfNeeded(e) {
    const {
      media: t,
      bufferedTrack: s
    } = this, i = s == null ? void 0 : s.attrs, n = e.attrs;
    t && i && (i.CHANNELS !== n.CHANNELS || s.name !== e.name || s.lang !== e.lang) && (this.log("Switching audio track : flushing all audio"), super.flushMainBuffer(0, Number.POSITIVE_INFINITY, "audio"), this.bufferedTrack = null);
  }
  completeAudioSwitch(e) {
    const {
      hls: t
    } = this;
    this.flushAudioIfNeeded(e), this.bufferedTrack = e, this.switchingTrack = null, t.trigger(y.AUDIO_TRACK_SWITCHED, ce({}, e));
  }
}
class zo extends ks {
  constructor(e) {
    super(e, "[audio-track-controller]"), this.tracks = [], this.groupIds = null, this.tracksInGroup = [], this.trackId = -1, this.currentTrack = null, this.selectDefaultTrack = !0, this.registerListeners();
  }
  registerListeners() {
    const {
      hls: e
    } = this;
    e.on(y.MANIFEST_LOADING, this.onManifestLoading, this), e.on(y.MANIFEST_PARSED, this.onManifestParsed, this), e.on(y.LEVEL_LOADING, this.onLevelLoading, this), e.on(y.LEVEL_SWITCHING, this.onLevelSwitching, this), e.on(y.AUDIO_TRACK_LOADED, this.onAudioTrackLoaded, this), e.on(y.ERROR, this.onError, this);
  }
  unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(y.MANIFEST_LOADING, this.onManifestLoading, this), e.off(y.MANIFEST_PARSED, this.onManifestParsed, this), e.off(y.LEVEL_LOADING, this.onLevelLoading, this), e.off(y.LEVEL_SWITCHING, this.onLevelSwitching, this), e.off(y.AUDIO_TRACK_LOADED, this.onAudioTrackLoaded, this), e.off(y.ERROR, this.onError, this);
  }
  destroy() {
    this.unregisterListeners(), this.tracks.length = 0, this.tracksInGroup.length = 0, this.currentTrack = null, super.destroy();
  }
  onManifestLoading() {
    this.tracks = [], this.tracksInGroup = [], this.groupIds = null, this.currentTrack = null, this.trackId = -1, this.selectDefaultTrack = !0;
  }
  onManifestParsed(e, t) {
    this.tracks = t.audioTracks || [];
  }
  onAudioTrackLoaded(e, t) {
    const {
      id: s,
      groupId: i,
      details: n
    } = t, r = this.tracksInGroup[s];
    if (!r || r.groupId !== i) {
      this.warn(`Audio track with id:${s} and group:${i} not found in active group ${r == null ? void 0 : r.groupId}`);
      return;
    }
    const o = r.details;
    r.details = t.details, this.log(`Audio track ${s} "${r.name}" lang:${r.lang} group:${i} loaded [${n.startSN}-${n.endSN}]`), s === this.trackId && this.playlistLoaded(s, t, o);
  }
  onLevelLoading(e, t) {
    this.switchLevel(t.level);
  }
  onLevelSwitching(e, t) {
    this.switchLevel(t.level);
  }
  switchLevel(e) {
    const t = this.hls.levels[e];
    if (!t)
      return;
    const s = t.audioGroups || null, i = this.groupIds;
    let n = this.currentTrack;
    if (!s || (i == null ? void 0 : i.length) !== (s == null ? void 0 : s.length) || s != null && s.some((o) => (i == null ? void 0 : i.indexOf(o)) === -1)) {
      this.groupIds = s, this.trackId = -1, this.currentTrack = null;
      const o = this.tracks.filter((d) => !s || s.indexOf(d.groupId) !== -1);
      if (o.length)
        this.selectDefaultTrack && !o.some((d) => d.default) && (this.selectDefaultTrack = !1), o.forEach((d, f) => {
          d.id = f;
        });
      else if (!n && !this.tracksInGroup.length)
        return;
      this.tracksInGroup = o;
      const l = this.hls.config.audioPreference;
      if (!n && l) {
        const d = we(l, o, Ge);
        if (d > -1)
          n = o[d];
        else {
          const f = we(l, this.tracks);
          n = this.tracks[f];
        }
      }
      let c = this.findTrackId(n);
      c === -1 && n && (c = this.findTrackId(null));
      const h = {
        audioTracks: o
      };
      this.log(`Updating audio tracks, ${o.length} track(s) found in group(s): ${s == null ? void 0 : s.join(",")}`), this.hls.trigger(y.AUDIO_TRACKS_UPDATED, h);
      const u = this.trackId;
      if (c !== -1 && u === -1)
        this.setAudioTrack(c);
      else if (o.length && u === -1) {
        var r;
        const d = new Error(`No audio track selected for current audio group-ID(s): ${(r = this.groupIds) == null ? void 0 : r.join(",")} track count: ${o.length}`);
        this.warn(d.message), this.hls.trigger(y.ERROR, {
          type: K.MEDIA_ERROR,
          details: A.AUDIO_TRACK_LOAD_ERROR,
          fatal: !0,
          error: d
        });
      }
    } else
      this.shouldReloadPlaylist(n) && this.setAudioTrack(this.trackId);
  }
  onError(e, t) {
    t.fatal || !t.context || t.context.type === Y.AUDIO_TRACK && t.context.id === this.trackId && (!this.groupIds || this.groupIds.indexOf(t.context.groupId) !== -1) && (this.requestScheduled = -1, this.checkRetry(t));
  }
  get allAudioTracks() {
    return this.tracks;
  }
  get audioTracks() {
    return this.tracksInGroup;
  }
  get audioTrack() {
    return this.trackId;
  }
  set audioTrack(e) {
    this.selectDefaultTrack = !1, this.setAudioTrack(e);
  }
  setAudioOption(e) {
    const t = this.hls;
    if (t.config.audioPreference = e, e) {
      const s = this.allAudioTracks;
      if (this.selectDefaultTrack = !1, s.length) {
        const i = this.currentTrack;
        if (i && Ze(e, i, Ge))
          return i;
        const n = we(e, this.tracksInGroup, Ge);
        if (n > -1) {
          const r = this.tracksInGroup[n];
          return this.setAudioTrack(n), r;
        } else if (i) {
          let r = t.loadLevel;
          r === -1 && (r = t.firstAutoLevel);
          const o = Wa(e, t.levels, s, r, Ge);
          if (o === -1)
            return null;
          t.nextLoadLevel = o;
        }
        if (e.channels || e.audioCodec) {
          const r = we(e, s);
          if (r > -1)
            return s[r];
        }
      }
    }
    return null;
  }
  setAudioTrack(e) {
    const t = this.tracksInGroup;
    if (e < 0 || e >= t.length) {
      this.warn(`Invalid audio track id: ${e}`);
      return;
    }
    this.clearTimer(), this.selectDefaultTrack = !1;
    const s = this.currentTrack, i = t[e], n = i.details && !i.details.live;
    if (e === this.trackId && i === s && n || (this.log(`Switching to audio-track ${e} "${i.name}" lang:${i.lang} group:${i.groupId} channels:${i.channels}`), this.trackId = e, this.currentTrack = i, this.hls.trigger(y.AUDIO_TRACK_SWITCHING, ce({}, i)), n))
      return;
    const r = this.switchParams(i.url, s == null ? void 0 : s.details, i.details);
    this.loadPlaylist(r);
  }
  findTrackId(e) {
    const t = this.tracksInGroup;
    for (let s = 0; s < t.length; s++) {
      const i = t[s];
      if (!(this.selectDefaultTrack && !i.default) && (!e || Ze(e, i, Ge)))
        return s;
    }
    if (e) {
      const {
        name: s,
        lang: i,
        assocLang: n,
        characteristics: r,
        audioCodec: o,
        channels: l
      } = e;
      for (let c = 0; c < t.length; c++) {
        const h = t[c];
        if (Ze({
          name: s,
          lang: i,
          assocLang: n,
          characteristics: r,
          audioCodec: o,
          channels: l
        }, h, Ge))
          return c;
      }
      for (let c = 0; c < t.length; c++) {
        const h = t[c];
        if (Qe(e.attrs, h.attrs, ["LANGUAGE", "ASSOC-LANGUAGE", "CHARACTERISTICS"]))
          return c;
      }
      for (let c = 0; c < t.length; c++) {
        const h = t[c];
        if (Qe(e.attrs, h.attrs, ["LANGUAGE"]))
          return c;
      }
    }
    return -1;
  }
  loadPlaylist(e) {
    const t = this.currentTrack;
    if (this.shouldLoadPlaylist(t) && t) {
      super.loadPlaylist();
      const s = t.id, i = t.groupId;
      let n = t.url;
      if (e)
        try {
          n = e.addDirectives(n);
        } catch (r) {
          this.warn(`Could not construct new URL with HLS Delivery Directives: ${r}`);
        }
      this.log(`loading audio-track playlist ${s} "${t.name}" lang:${t.lang} group:${i}`), this.clearTimer(), this.hls.trigger(y.AUDIO_TRACK_LOADING, {
        url: n,
        id: s,
        groupId: i,
        deliveryDirectives: e || null
      });
    }
  }
}
const Mi = 500;
class Yo extends Ps {
  constructor(e, t, s) {
    super(e, t, s, "[subtitle-stream-controller]", H.SUBTITLE), this.currentTrackId = -1, this.tracksBuffered = [], this.mainDetails = null, this._registerListeners();
  }
  onHandlerDestroying() {
    this._unregisterListeners(), super.onHandlerDestroying(), this.mainDetails = null;
  }
  _registerListeners() {
    const {
      hls: e
    } = this;
    e.on(y.MEDIA_ATTACHED, this.onMediaAttached, this), e.on(y.MEDIA_DETACHING, this.onMediaDetaching, this), e.on(y.MANIFEST_LOADING, this.onManifestLoading, this), e.on(y.LEVEL_LOADED, this.onLevelLoaded, this), e.on(y.ERROR, this.onError, this), e.on(y.SUBTITLE_TRACKS_UPDATED, this.onSubtitleTracksUpdated, this), e.on(y.SUBTITLE_TRACK_SWITCH, this.onSubtitleTrackSwitch, this), e.on(y.SUBTITLE_TRACK_LOADED, this.onSubtitleTrackLoaded, this), e.on(y.SUBTITLE_FRAG_PROCESSED, this.onSubtitleFragProcessed, this), e.on(y.BUFFER_FLUSHING, this.onBufferFlushing, this), e.on(y.FRAG_BUFFERED, this.onFragBuffered, this);
  }
  _unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(y.MEDIA_ATTACHED, this.onMediaAttached, this), e.off(y.MEDIA_DETACHING, this.onMediaDetaching, this), e.off(y.MANIFEST_LOADING, this.onManifestLoading, this), e.off(y.LEVEL_LOADED, this.onLevelLoaded, this), e.off(y.ERROR, this.onError, this), e.off(y.SUBTITLE_TRACKS_UPDATED, this.onSubtitleTracksUpdated, this), e.off(y.SUBTITLE_TRACK_SWITCH, this.onSubtitleTrackSwitch, this), e.off(y.SUBTITLE_TRACK_LOADED, this.onSubtitleTrackLoaded, this), e.off(y.SUBTITLE_FRAG_PROCESSED, this.onSubtitleFragProcessed, this), e.off(y.BUFFER_FLUSHING, this.onBufferFlushing, this), e.off(y.FRAG_BUFFERED, this.onFragBuffered, this);
  }
  startLoad(e) {
    this.stopLoad(), this.state = D.IDLE, this.setInterval(Mi), this.nextLoadPosition = this.startPosition = this.lastCurrentTime = e, this.tick();
  }
  onManifestLoading() {
    this.mainDetails = null, this.fragmentTracker.removeAllFragments();
  }
  onMediaDetaching() {
    this.tracksBuffered = [], super.onMediaDetaching();
  }
  onLevelLoaded(e, t) {
    this.mainDetails = t.details;
  }
  onSubtitleFragProcessed(e, t) {
    const {
      frag: s,
      success: i
    } = t;
    if (this.fragPrevious = s, this.state = D.IDLE, !i)
      return;
    const n = this.tracksBuffered[this.currentTrackId];
    if (!n)
      return;
    let r;
    const o = s.start;
    for (let c = 0; c < n.length; c++)
      if (o >= n[c].start && o <= n[c].end) {
        r = n[c];
        break;
      }
    const l = s.start + s.duration;
    r ? r.end = l : (r = {
      start: o,
      end: l
    }, n.push(r)), this.fragmentTracker.fragBuffered(s), this.fragBufferedComplete(s, null);
  }
  onBufferFlushing(e, t) {
    const {
      startOffset: s,
      endOffset: i
    } = t;
    if (s === 0 && i !== Number.POSITIVE_INFINITY) {
      const n = i - 1;
      if (n <= 0)
        return;
      t.endOffsetSubtitles = Math.max(0, n), this.tracksBuffered.forEach((r) => {
        for (let o = 0; o < r.length; ) {
          if (r[o].end <= n) {
            r.shift();
            continue;
          } else if (r[o].start < n)
            r[o].start = n;
          else
            break;
          o++;
        }
      }), this.fragmentTracker.removeFragmentsInRange(s, n, H.SUBTITLE);
    }
  }
  onFragBuffered(e, t) {
    if (!this.loadedmetadata && t.frag.type === H.MAIN) {
      var s;
      (s = this.media) != null && s.buffered.length && (this.loadedmetadata = !0);
    }
  }
  // If something goes wrong, proceed to next frag, if we were processing one.
  onError(e, t) {
    const s = t.frag;
    (s == null ? void 0 : s.type) === H.SUBTITLE && (t.details === A.FRAG_GAP && this.fragmentTracker.fragBuffered(s, !0), this.fragCurrent && this.fragCurrent.abortRequests(), this.state !== D.STOPPED && (this.state = D.IDLE));
  }
  // Got all new subtitle levels.
  onSubtitleTracksUpdated(e, {
    subtitleTracks: t
  }) {
    if (this.levels && Hn(this.levels, t)) {
      this.levels = t.map((s) => new Xe(s));
      return;
    }
    this.tracksBuffered = [], this.levels = t.map((s) => {
      const i = new Xe(s);
      return this.tracksBuffered[i.id] = [], i;
    }), this.fragmentTracker.removeFragmentsInRange(0, Number.POSITIVE_INFINITY, H.SUBTITLE), this.fragPrevious = null, this.mediaBuffer = null;
  }
  onSubtitleTrackSwitch(e, t) {
    var s;
    if (this.currentTrackId = t.id, !((s = this.levels) != null && s.length) || this.currentTrackId === -1) {
      this.clearInterval();
      return;
    }
    const i = this.levels[this.currentTrackId];
    i != null && i.details ? this.mediaBuffer = this.mediaBufferTimeRanges : this.mediaBuffer = null, i && this.setInterval(Mi);
  }
  // Got a new set of subtitle fragments.
  onSubtitleTrackLoaded(e, t) {
    var s;
    const {
      currentTrackId: i,
      levels: n
    } = this, {
      details: r,
      id: o
    } = t;
    if (!n) {
      this.warn(`Subtitle tracks were reset while loading level ${o}`);
      return;
    }
    const l = n[o];
    if (o >= n.length || !l)
      return;
    this.log(`Subtitle track ${o} loaded [${r.startSN},${r.endSN}]${r.lastPartSn ? `[part-${r.lastPartSn}-${r.lastPartIndex}]` : ""},duration:${r.totalduration}`), this.mediaBuffer = this.mediaBufferTimeRanges;
    let c = 0;
    if (r.live || (s = l.details) != null && s.live) {
      const u = this.mainDetails;
      if (r.deltaUpdateFailed || !u)
        return;
      const d = u.fragments[0];
      if (!l.details)
        r.hasProgramDateTime && u.hasProgramDateTime ? (_t(r, u), c = r.fragments[0].start) : d && (c = d.start, gs(r, c));
      else {
        var h;
        c = this.alignPlaylists(r, l.details, (h = this.levelLastLoaded) == null ? void 0 : h.details), c === 0 && d && (c = d.start, gs(r, c));
      }
    }
    l.details = r, this.levelLastLoaded = l, o === i && (!this.startFragRequested && (this.mainDetails || !r.live) && this.setStartPosition(this.mainDetails || r, c), this.tick(), r.live && !this.fragCurrent && this.media && this.state === D.IDLE && (Ft(null, r.fragments, this.media.currentTime, 0) || (this.warn("Subtitle playlist not aligned with playback"), l.details = void 0)));
  }
  _handleFragmentLoadComplete(e) {
    const {
      frag: t,
      payload: s
    } = e, i = t.decryptdata, n = this.hls;
    if (!this.fragContextChanged(t) && s && s.byteLength > 0 && i != null && i.key && i.iv && i.method === "AES-128") {
      const r = performance.now();
      this.decrypter.decrypt(new Uint8Array(s), i.key.buffer, i.iv.buffer).catch((o) => {
        throw n.trigger(y.ERROR, {
          type: K.MEDIA_ERROR,
          details: A.FRAG_DECRYPT_ERROR,
          fatal: !1,
          error: o,
          reason: o.message,
          frag: t
        }), o;
      }).then((o) => {
        const l = performance.now();
        n.trigger(y.FRAG_DECRYPTED, {
          frag: t,
          payload: o,
          stats: {
            tstart: r,
            tdecrypt: l
          }
        });
      }).catch((o) => {
        this.warn(`${o.name}: ${o.message}`), this.state = D.IDLE;
      });
    }
  }
  doTick() {
    if (!this.media) {
      this.state = D.IDLE;
      return;
    }
    if (this.state === D.IDLE) {
      const {
        currentTrackId: e,
        levels: t
      } = this, s = t == null ? void 0 : t[e];
      if (!s || !t.length || !s.details)
        return;
      const {
        config: i
      } = this, n = this.getLoadPosition(), r = ee.bufferedInfo(this.tracksBuffered[this.currentTrackId] || [], n, i.maxBufferHole), {
        end: o,
        len: l
      } = r, c = this.getFwdBufferInfo(this.media, H.MAIN), h = s.details, u = this.getMaxBufferLength(c == null ? void 0 : c.len) + h.levelTargetDuration;
      if (l > u)
        return;
      const d = h.fragments, f = d.length, m = h.edge;
      let p = null;
      const g = this.fragPrevious;
      if (o < m) {
        const v = i.maxFragLookUpTolerance, C = o > m - v ? 0 : v;
        p = Ft(g, d, Math.max(d[0].start, o), C), !p && g && g.start < d[0].start && (p = d[0]);
      } else
        p = d[f - 1];
      if (!p)
        return;
      if (p = this.mapToInitFragWhenRequired(p), p.sn !== "initSegment") {
        const v = p.sn - h.startSN, C = d[v - 1];
        C && C.cc === p.cc && this.fragmentTracker.getState(C) === le.NOT_LOADED && (p = C);
      }
      this.fragmentTracker.getState(p) === le.NOT_LOADED && this.loadFragment(p, s, o);
    }
  }
  getMaxBufferLength(e) {
    const t = super.getMaxBufferLength();
    return e ? Math.max(t, e) : t;
  }
  loadFragment(e, t, s) {
    this.fragCurrent = e, e.sn === "initSegment" ? this._loadInitSegment(e, t) : (this.startFragRequested = !0, super.loadFragment(e, t, s));
  }
  get mediaBufferTimeRanges() {
    return new Zo(this.tracksBuffered[this.currentTrackId] || []);
  }
}
class Zo {
  constructor(e) {
    this.buffered = void 0;
    const t = (s, i, n) => {
      if (i = i >>> 0, i > n - 1)
        throw new DOMException(`Failed to execute '${s}' on 'TimeRanges': The index provided (${i}) is greater than the maximum bound (${n})`);
      return e[i][s];
    };
    this.buffered = {
      get length() {
        return e.length;
      },
      end(s) {
        return t("end", s, e.length);
      },
      start(s) {
        return t("start", s, e.length);
      }
    };
  }
}
class qo extends ks {
  constructor(e) {
    super(e, "[subtitle-track-controller]"), this.media = null, this.tracks = [], this.groupIds = null, this.tracksInGroup = [], this.trackId = -1, this.currentTrack = null, this.selectDefaultTrack = !0, this.queuedDefaultTrack = -1, this.asyncPollTrackChange = () => this.pollTrackChange(0), this.useTextTrackPolling = !1, this.subtitlePollingInterval = -1, this._subtitleDisplay = !0, this.onTextTracksChanged = () => {
      if (this.useTextTrackPolling || self.clearInterval(this.subtitlePollingInterval), !this.media || !this.hls.config.renderTextTracksNatively)
        return;
      let t = null;
      const s = Ct(this.media.textTracks);
      for (let n = 0; n < s.length; n++)
        if (s[n].mode === "hidden")
          t = s[n];
        else if (s[n].mode === "showing") {
          t = s[n];
          break;
        }
      const i = this.findTrackForTextTrack(t);
      this.subtitleTrack !== i && this.setSubtitleTrack(i);
    }, this.registerListeners();
  }
  destroy() {
    this.unregisterListeners(), this.tracks.length = 0, this.tracksInGroup.length = 0, this.currentTrack = null, this.onTextTracksChanged = this.asyncPollTrackChange = null, super.destroy();
  }
  get subtitleDisplay() {
    return this._subtitleDisplay;
  }
  set subtitleDisplay(e) {
    this._subtitleDisplay = e, this.trackId > -1 && this.toggleTrackModes();
  }
  registerListeners() {
    const {
      hls: e
    } = this;
    e.on(y.MEDIA_ATTACHED, this.onMediaAttached, this), e.on(y.MEDIA_DETACHING, this.onMediaDetaching, this), e.on(y.MANIFEST_LOADING, this.onManifestLoading, this), e.on(y.MANIFEST_PARSED, this.onManifestParsed, this), e.on(y.LEVEL_LOADING, this.onLevelLoading, this), e.on(y.LEVEL_SWITCHING, this.onLevelSwitching, this), e.on(y.SUBTITLE_TRACK_LOADED, this.onSubtitleTrackLoaded, this), e.on(y.ERROR, this.onError, this);
  }
  unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(y.MEDIA_ATTACHED, this.onMediaAttached, this), e.off(y.MEDIA_DETACHING, this.onMediaDetaching, this), e.off(y.MANIFEST_LOADING, this.onManifestLoading, this), e.off(y.MANIFEST_PARSED, this.onManifestParsed, this), e.off(y.LEVEL_LOADING, this.onLevelLoading, this), e.off(y.LEVEL_SWITCHING, this.onLevelSwitching, this), e.off(y.SUBTITLE_TRACK_LOADED, this.onSubtitleTrackLoaded, this), e.off(y.ERROR, this.onError, this);
  }
  // Listen for subtitle track change, then extract the current track ID.
  onMediaAttached(e, t) {
    this.media = t.media, this.media && (this.queuedDefaultTrack > -1 && (this.subtitleTrack = this.queuedDefaultTrack, this.queuedDefaultTrack = -1), this.useTextTrackPolling = !(this.media.textTracks && "onchange" in this.media.textTracks), this.useTextTrackPolling ? this.pollTrackChange(500) : this.media.textTracks.addEventListener("change", this.asyncPollTrackChange));
  }
  pollTrackChange(e) {
    self.clearInterval(this.subtitlePollingInterval), this.subtitlePollingInterval = self.setInterval(this.onTextTracksChanged, e);
  }
  onMediaDetaching() {
    if (!this.media)
      return;
    self.clearInterval(this.subtitlePollingInterval), this.useTextTrackPolling || this.media.textTracks.removeEventListener("change", this.asyncPollTrackChange), this.trackId > -1 && (this.queuedDefaultTrack = this.trackId), Ct(this.media.textTracks).forEach((t) => {
      Ye(t);
    }), this.subtitleTrack = -1, this.media = null;
  }
  onManifestLoading() {
    this.tracks = [], this.groupIds = null, this.tracksInGroup = [], this.trackId = -1, this.currentTrack = null, this.selectDefaultTrack = !0;
  }
  // Fired whenever a new manifest is loaded.
  onManifestParsed(e, t) {
    this.tracks = t.subtitleTracks;
  }
  onSubtitleTrackLoaded(e, t) {
    const {
      id: s,
      groupId: i,
      details: n
    } = t, r = this.tracksInGroup[s];
    if (!r || r.groupId !== i) {
      this.warn(`Subtitle track with id:${s} and group:${i} not found in active group ${r == null ? void 0 : r.groupId}`);
      return;
    }
    const o = r.details;
    r.details = t.details, this.log(`Subtitle track ${s} "${r.name}" lang:${r.lang} group:${i} loaded [${n.startSN}-${n.endSN}]`), s === this.trackId && this.playlistLoaded(s, t, o);
  }
  onLevelLoading(e, t) {
    this.switchLevel(t.level);
  }
  onLevelSwitching(e, t) {
    this.switchLevel(t.level);
  }
  switchLevel(e) {
    const t = this.hls.levels[e];
    if (!t)
      return;
    const s = t.subtitleGroups || null, i = this.groupIds;
    let n = this.currentTrack;
    if (!s || (i == null ? void 0 : i.length) !== (s == null ? void 0 : s.length) || s != null && s.some((r) => (i == null ? void 0 : i.indexOf(r)) === -1)) {
      this.groupIds = s, this.trackId = -1, this.currentTrack = null;
      const r = this.tracks.filter((h) => !s || s.indexOf(h.groupId) !== -1);
      if (r.length)
        this.selectDefaultTrack && !r.some((h) => h.default) && (this.selectDefaultTrack = !1), r.forEach((h, u) => {
          h.id = u;
        });
      else if (!n && !this.tracksInGroup.length)
        return;
      this.tracksInGroup = r;
      const o = this.hls.config.subtitlePreference;
      if (!n && o) {
        this.selectDefaultTrack = !1;
        const h = we(o, r);
        if (h > -1)
          n = r[h];
        else {
          const u = we(o, this.tracks);
          n = this.tracks[u];
        }
      }
      let l = this.findTrackId(n);
      l === -1 && n && (l = this.findTrackId(null));
      const c = {
        subtitleTracks: r
      };
      this.log(`Updating subtitle tracks, ${r.length} track(s) found in "${s == null ? void 0 : s.join(",")}" group-id`), this.hls.trigger(y.SUBTITLE_TRACKS_UPDATED, c), l !== -1 && this.trackId === -1 && this.setSubtitleTrack(l);
    } else
      this.shouldReloadPlaylist(n) && this.setSubtitleTrack(this.trackId);
  }
  findTrackId(e) {
    const t = this.tracksInGroup, s = this.selectDefaultTrack;
    for (let i = 0; i < t.length; i++) {
      const n = t[i];
      if (!(s && !n.default || !s && !e) && (!e || Ze(n, e)))
        return i;
    }
    if (e) {
      for (let i = 0; i < t.length; i++) {
        const n = t[i];
        if (Qe(e.attrs, n.attrs, ["LANGUAGE", "ASSOC-LANGUAGE", "CHARACTERISTICS"]))
          return i;
      }
      for (let i = 0; i < t.length; i++) {
        const n = t[i];
        if (Qe(e.attrs, n.attrs, ["LANGUAGE"]))
          return i;
      }
    }
    return -1;
  }
  findTrackForTextTrack(e) {
    if (e) {
      const t = this.tracksInGroup;
      for (let s = 0; s < t.length; s++) {
        const i = t[s];
        if (Cs(i, e))
          return s;
      }
    }
    return -1;
  }
  onError(e, t) {
    t.fatal || !t.context || t.context.type === Y.SUBTITLE_TRACK && t.context.id === this.trackId && (!this.groupIds || this.groupIds.indexOf(t.context.groupId) !== -1) && this.checkRetry(t);
  }
  get allSubtitleTracks() {
    return this.tracks;
  }
  /** get alternate subtitle tracks list from playlist **/
  get subtitleTracks() {
    return this.tracksInGroup;
  }
  /** get/set index of the selected subtitle track (based on index in subtitle track lists) **/
  get subtitleTrack() {
    return this.trackId;
  }
  set subtitleTrack(e) {
    this.selectDefaultTrack = !1, this.setSubtitleTrack(e);
  }
  setSubtitleOption(e) {
    if (this.hls.config.subtitlePreference = e, e) {
      const t = this.allSubtitleTracks;
      if (this.selectDefaultTrack = !1, t.length) {
        const s = this.currentTrack;
        if (s && Ze(e, s))
          return s;
        const i = we(e, this.tracksInGroup);
        if (i > -1) {
          const n = this.tracksInGroup[i];
          return this.setSubtitleTrack(i), n;
        } else {
          if (s)
            return null;
          {
            const n = we(e, t);
            if (n > -1)
              return t[n];
          }
        }
      }
    }
    return null;
  }
  loadPlaylist(e) {
    super.loadPlaylist();
    const t = this.currentTrack;
    if (this.shouldLoadPlaylist(t) && t) {
      const s = t.id, i = t.groupId;
      let n = t.url;
      if (e)
        try {
          n = e.addDirectives(n);
        } catch (r) {
          this.warn(`Could not construct new URL with HLS Delivery Directives: ${r}`);
        }
      this.log(`Loading subtitle playlist for id ${s}`), this.hls.trigger(y.SUBTITLE_TRACK_LOADING, {
        url: n,
        id: s,
        groupId: i,
        deliveryDirectives: e || null
      });
    }
  }
  /**
   * Disables the old subtitleTrack and sets current mode on the next subtitleTrack.
   * This operates on the DOM textTracks.
   * A value of -1 will disable all subtitle tracks.
   */
  toggleTrackModes() {
    const {
      media: e
    } = this;
    if (!e)
      return;
    const t = Ct(e.textTracks), s = this.currentTrack;
    let i;
    if (s && (i = t.filter((n) => Cs(s, n))[0], i || this.warn(`Unable to find subtitle TextTrack with name "${s.name}" and language "${s.lang}"`)), [].slice.call(t).forEach((n) => {
      n.mode !== "disabled" && n !== i && (n.mode = "disabled");
    }), i) {
      const n = this.subtitleDisplay ? "showing" : "hidden";
      i.mode !== n && (i.mode = n);
    }
  }
  /**
   * This method is responsible for validating the subtitle index and periodically reloading if live.
   * Dispatches the SUBTITLE_TRACK_SWITCH event, which instructs the subtitle-stream-controller to load the selected track.
   */
  setSubtitleTrack(e) {
    const t = this.tracksInGroup;
    if (!this.media) {
      this.queuedDefaultTrack = e;
      return;
    }
    if (e < -1 || e >= t.length || !O(e)) {
      this.warn(`Invalid subtitle track id: ${e}`);
      return;
    }
    this.clearTimer(), this.selectDefaultTrack = !1;
    const s = this.currentTrack, i = t[e] || null;
    if (this.trackId = e, this.currentTrack = i, this.toggleTrackModes(), !i) {
      this.hls.trigger(y.SUBTITLE_TRACK_SWITCH, {
        id: e
      });
      return;
    }
    const n = !!i.details && !i.details.live;
    if (e === this.trackId && i === s && n)
      return;
    this.log(`Switching to subtitle-track ${e}` + (i ? ` "${i.name}" lang:${i.lang} group:${i.groupId}` : ""));
    const {
      id: r,
      groupId: o = "",
      name: l,
      type: c,
      url: h
    } = i;
    this.hls.trigger(y.SUBTITLE_TRACK_SWITCH, {
      id: r,
      groupId: o,
      name: l,
      type: c,
      url: h
    });
    const u = this.switchParams(i.url, s == null ? void 0 : s.details, i.details);
    this.loadPlaylist(u);
  }
}
class jo {
  constructor(e) {
    this.buffers = void 0, this.queues = {
      video: [],
      audio: [],
      audiovideo: []
    }, this.buffers = e;
  }
  append(e, t, s) {
    const i = this.queues[t];
    i.push(e), i.length === 1 && !s && this.executeNext(t);
  }
  insertAbort(e, t) {
    this.queues[t].unshift(e), this.executeNext(t);
  }
  appendBlocker(e) {
    let t;
    const s = new Promise((n) => {
      t = n;
    }), i = {
      execute: t,
      onStart: () => {
      },
      onComplete: () => {
      },
      onError: () => {
      }
    };
    return this.append(i, e), s;
  }
  executeNext(e) {
    const t = this.queues[e];
    if (t.length) {
      const s = t[0];
      try {
        s.execute();
      } catch (i) {
        S.warn(`[buffer-operation-queue]: Exception executing "${e}" SourceBuffer operation: ${i}`), s.onError(i);
        const n = this.buffers[e];
        n != null && n.updating || this.shiftAndExecuteNext(e);
      }
    }
  }
  shiftAndExecuteNext(e) {
    this.queues[e].shift(), this.executeNext(e);
  }
  current(e) {
    return this.queues[e][0];
  }
}
const Pi = /(avc[1234]|hvc1|hev1|dvh[1e]|vp09|av01)(?:\.[^.,]+)+/;
class Xo {
  constructor(e) {
    this.details = null, this._objectUrl = null, this.operationQueue = void 0, this.listeners = void 0, this.hls = void 0, this.bufferCodecEventsExpected = 0, this._bufferCodecEventsTotal = 0, this.media = null, this.mediaSource = null, this.lastMpegAudioChunk = null, this.appendSource = void 0, this.appendErrors = {
      audio: 0,
      video: 0,
      audiovideo: 0
    }, this.tracks = {}, this.pendingTracks = {}, this.sourceBuffer = void 0, this.log = void 0, this.warn = void 0, this.error = void 0, this._onEndStreaming = (s) => {
      this.hls && this.hls.pauseBuffering();
    }, this._onStartStreaming = (s) => {
      this.hls && this.hls.resumeBuffering();
    }, this._onMediaSourceOpen = () => {
      const {
        media: s,
        mediaSource: i
      } = this;
      this.log("Media source opened"), s && (s.removeEventListener("emptied", this._onMediaEmptied), this.updateMediaElementDuration(), this.hls.trigger(y.MEDIA_ATTACHED, {
        media: s,
        mediaSource: i
      })), i && i.removeEventListener("sourceopen", this._onMediaSourceOpen), this.checkPendingTracks();
    }, this._onMediaSourceClose = () => {
      this.log("Media source closed");
    }, this._onMediaSourceEnded = () => {
      this.log("Media source ended");
    }, this._onMediaEmptied = () => {
      const {
        mediaSrc: s,
        _objectUrl: i
      } = this;
      s !== i && S.error(`Media element src was set while attaching MediaSource (${i} > ${s})`);
    }, this.hls = e;
    const t = "[buffer-controller]";
    this.appendSource = ra(Ve(e.config.preferManagedMediaSource)), this.log = S.log.bind(S, t), this.warn = S.warn.bind(S, t), this.error = S.error.bind(S, t), this._initSourceBuffer(), this.registerListeners();
  }
  hasSourceTypes() {
    return this.getSourceBufferTypes().length > 0 || Object.keys(this.pendingTracks).length > 0;
  }
  destroy() {
    this.unregisterListeners(), this.details = null, this.lastMpegAudioChunk = null, this.hls = null;
  }
  registerListeners() {
    const {
      hls: e
    } = this;
    e.on(y.MEDIA_ATTACHING, this.onMediaAttaching, this), e.on(y.MEDIA_DETACHING, this.onMediaDetaching, this), e.on(y.MANIFEST_LOADING, this.onManifestLoading, this), e.on(y.MANIFEST_PARSED, this.onManifestParsed, this), e.on(y.BUFFER_RESET, this.onBufferReset, this), e.on(y.BUFFER_APPENDING, this.onBufferAppending, this), e.on(y.BUFFER_CODECS, this.onBufferCodecs, this), e.on(y.BUFFER_EOS, this.onBufferEos, this), e.on(y.BUFFER_FLUSHING, this.onBufferFlushing, this), e.on(y.LEVEL_UPDATED, this.onLevelUpdated, this), e.on(y.FRAG_PARSED, this.onFragParsed, this), e.on(y.FRAG_CHANGED, this.onFragChanged, this);
  }
  unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(y.MEDIA_ATTACHING, this.onMediaAttaching, this), e.off(y.MEDIA_DETACHING, this.onMediaDetaching, this), e.off(y.MANIFEST_LOADING, this.onManifestLoading, this), e.off(y.MANIFEST_PARSED, this.onManifestParsed, this), e.off(y.BUFFER_RESET, this.onBufferReset, this), e.off(y.BUFFER_APPENDING, this.onBufferAppending, this), e.off(y.BUFFER_CODECS, this.onBufferCodecs, this), e.off(y.BUFFER_EOS, this.onBufferEos, this), e.off(y.BUFFER_FLUSHING, this.onBufferFlushing, this), e.off(y.LEVEL_UPDATED, this.onLevelUpdated, this), e.off(y.FRAG_PARSED, this.onFragParsed, this), e.off(y.FRAG_CHANGED, this.onFragChanged, this);
  }
  _initSourceBuffer() {
    this.sourceBuffer = {}, this.operationQueue = new jo(this.sourceBuffer), this.listeners = {
      audio: [],
      video: [],
      audiovideo: []
    }, this.appendErrors = {
      audio: 0,
      video: 0,
      audiovideo: 0
    }, this.lastMpegAudioChunk = null;
  }
  onManifestLoading() {
    this.bufferCodecEventsExpected = this._bufferCodecEventsTotal = 0, this.details = null;
  }
  onManifestParsed(e, t) {
    let s = 2;
    (t.audio && !t.video || !t.altAudio) && (s = 1), this.bufferCodecEventsExpected = this._bufferCodecEventsTotal = s, this.log(`${this.bufferCodecEventsExpected} bufferCodec event(s) expected`);
  }
  onMediaAttaching(e, t) {
    const s = this.media = t.media, i = Ve(this.appendSource);
    if (s && i) {
      var n;
      const r = this.mediaSource = new i();
      this.log(`created media source: ${(n = r.constructor) == null ? void 0 : n.name}`), r.addEventListener("sourceopen", this._onMediaSourceOpen), r.addEventListener("sourceended", this._onMediaSourceEnded), r.addEventListener("sourceclose", this._onMediaSourceClose), this.appendSource && (r.addEventListener("startstreaming", this._onStartStreaming), r.addEventListener("endstreaming", this._onEndStreaming));
      const o = this._objectUrl = self.URL.createObjectURL(r);
      if (this.appendSource)
        try {
          s.removeAttribute("src");
          const l = self.ManagedMediaSource;
          s.disableRemotePlayback = s.disableRemotePlayback || l && r instanceof l, Fi(s), Qo(s, o), s.load();
        } catch {
          s.src = o;
        }
      else
        s.src = o;
      s.addEventListener("emptied", this._onMediaEmptied);
    }
  }
  onMediaDetaching() {
    const {
      media: e,
      mediaSource: t,
      _objectUrl: s
    } = this;
    if (t) {
      if (this.log("media source detaching"), t.readyState === "open")
        try {
          t.endOfStream();
        } catch (i) {
          this.warn(`onMediaDetaching: ${i.message} while calling endOfStream`);
        }
      this.onBufferReset(), t.removeEventListener("sourceopen", this._onMediaSourceOpen), t.removeEventListener("sourceended", this._onMediaSourceEnded), t.removeEventListener("sourceclose", this._onMediaSourceClose), this.appendSource && (t.removeEventListener("startstreaming", this._onStartStreaming), t.removeEventListener("endstreaming", this._onEndStreaming)), e && (e.removeEventListener("emptied", this._onMediaEmptied), s && self.URL.revokeObjectURL(s), this.mediaSrc === s ? (e.removeAttribute("src"), this.appendSource && Fi(e), e.load()) : this.warn("media|source.src was changed by a third party - skip cleanup")), this.mediaSource = null, this.media = null, this._objectUrl = null, this.bufferCodecEventsExpected = this._bufferCodecEventsTotal, this.pendingTracks = {}, this.tracks = {};
    }
    this.hls.trigger(y.MEDIA_DETACHED, void 0);
  }
  onBufferReset() {
    this.getSourceBufferTypes().forEach((e) => {
      this.resetBuffer(e);
    }), this._initSourceBuffer();
  }
  resetBuffer(e) {
    const t = this.sourceBuffer[e];
    try {
      if (t) {
        var s;
        this.removeBufferListeners(e), this.sourceBuffer[e] = void 0, (s = this.mediaSource) != null && s.sourceBuffers.length && this.mediaSource.removeSourceBuffer(t);
      }
    } catch (i) {
      this.warn(`onBufferReset ${e}`, i);
    }
  }
  onBufferCodecs(e, t) {
    const s = this.getSourceBufferTypes().length, i = Object.keys(t);
    if (i.forEach((r) => {
      if (s) {
        const l = this.tracks[r];
        if (l && typeof l.buffer.changeType == "function") {
          var o;
          const {
            id: c,
            codec: h,
            levelCodec: u,
            container: d,
            metadata: f
          } = t[r], m = ti(l.codec, l.levelCodec), p = m == null ? void 0 : m.replace(Pi, "$1");
          let g = ti(h, u);
          const v = (o = g) == null ? void 0 : o.replace(Pi, "$1");
          if (g && p !== v) {
            r.slice(0, 5) === "audio" && (g = kt(g, this.appendSource));
            const C = `${d};codecs=${g}`;
            this.appendChangeType(r, C), this.log(`switching codec ${m} to ${g}`), this.tracks[r] = {
              buffer: l.buffer,
              codec: h,
              container: d,
              levelCodec: u,
              metadata: f,
              id: c
            };
          }
        }
      } else
        this.pendingTracks[r] = t[r];
    }), s)
      return;
    const n = Math.max(this.bufferCodecEventsExpected - 1, 0);
    this.bufferCodecEventsExpected !== n && (this.log(`${n} bufferCodec event(s) expected ${i.join(",")}`), this.bufferCodecEventsExpected = n), this.mediaSource && this.mediaSource.readyState === "open" && this.checkPendingTracks();
  }
  appendChangeType(e, t) {
    const {
      operationQueue: s
    } = this, i = {
      execute: () => {
        const n = this.sourceBuffer[e];
        n && (this.log(`changing ${e} sourceBuffer type to ${t}`), n.changeType(t)), s.shiftAndExecuteNext(e);
      },
      onStart: () => {
      },
      onComplete: () => {
      },
      onError: (n) => {
        this.warn(`Failed to change ${e} SourceBuffer type`, n);
      }
    };
    s.append(i, e, !!this.pendingTracks[e]);
  }
  onBufferAppending(e, t) {
    const {
      hls: s,
      operationQueue: i,
      tracks: n
    } = this, {
      data: r,
      type: o,
      frag: l,
      part: c,
      chunkMeta: h
    } = t, u = h.buffering[o], d = self.performance.now();
    u.start = d;
    const f = l.stats.buffering, m = c ? c.stats.buffering : null;
    f.start === 0 && (f.start = d), m && m.start === 0 && (m.start = d);
    const p = n.audio;
    let g = !1;
    o === "audio" && (p == null ? void 0 : p.container) === "audio/mpeg" && (g = !this.lastMpegAudioChunk || h.id === 1 || this.lastMpegAudioChunk.sn !== h.sn, this.lastMpegAudioChunk = h);
    const v = l.start, C = {
      execute: () => {
        if (u.executeStart = self.performance.now(), g) {
          const E = this.sourceBuffer[o];
          if (E) {
            const T = v - E.timestampOffset;
            Math.abs(T) >= 0.1 && (this.log(`Updating audio SourceBuffer timestampOffset to ${v} (delta: ${T}) sn: ${l.sn})`), E.timestampOffset = v);
          }
        }
        this.appendExecutor(r, o);
      },
      onStart: () => {
      },
      onComplete: () => {
        const E = self.performance.now();
        u.executeEnd = u.end = E, f.first === 0 && (f.first = E), m && m.first === 0 && (m.first = E);
        const {
          sourceBuffer: T
        } = this, x = {};
        for (const I in T)
          x[I] = ee.getBuffered(T[I]);
        this.appendErrors[o] = 0, o === "audio" || o === "video" ? this.appendErrors.audiovideo = 0 : (this.appendErrors.audio = 0, this.appendErrors.video = 0), this.hls.trigger(y.BUFFER_APPENDED, {
          type: o,
          frag: l,
          part: c,
          chunkMeta: h,
          parent: l.type,
          timeRanges: x
        });
      },
      onError: (E) => {
        const T = {
          type: K.MEDIA_ERROR,
          parent: l.type,
          details: A.BUFFER_APPEND_ERROR,
          sourceBufferName: o,
          frag: l,
          part: c,
          chunkMeta: h,
          error: E,
          err: E,
          fatal: !1
        };
        if (E.code === DOMException.QUOTA_EXCEEDED_ERR)
          T.details = A.BUFFER_FULL_ERROR;
        else {
          const x = ++this.appendErrors[o];
          T.details = A.BUFFER_APPEND_ERROR, this.warn(`Failed ${x}/${s.config.appendErrorMaxRetry} times to append segment in "${o}" sourceBuffer`), x >= s.config.appendErrorMaxRetry && (T.fatal = !0);
        }
        s.trigger(y.ERROR, T);
      }
    };
    i.append(C, o, !!this.pendingTracks[o]);
  }
  onBufferFlushing(e, t) {
    const {
      operationQueue: s
    } = this, i = (n) => ({
      execute: this.removeExecutor.bind(this, n, t.startOffset, t.endOffset),
      onStart: () => {
      },
      onComplete: () => {
        this.hls.trigger(y.BUFFER_FLUSHED, {
          type: n
        });
      },
      onError: (r) => {
        this.warn(`Failed to remove from ${n} SourceBuffer`, r);
      }
    });
    t.type ? s.append(i(t.type), t.type) : this.getSourceBufferTypes().forEach((n) => {
      s.append(i(n), n);
    });
  }
  onFragParsed(e, t) {
    const {
      frag: s,
      part: i
    } = t, n = [], r = i ? i.elementaryStreams : s.elementaryStreams;
    r[X.AUDIOVIDEO] ? n.push("audiovideo") : (r[X.AUDIO] && n.push("audio"), r[X.VIDEO] && n.push("video"));
    const o = () => {
      const l = self.performance.now();
      s.stats.buffering.end = l, i && (i.stats.buffering.end = l);
      const c = i ? i.stats : s.stats;
      this.hls.trigger(y.FRAG_BUFFERED, {
        frag: s,
        part: i,
        stats: c,
        id: s.type
      });
    };
    n.length === 0 && this.warn(`Fragments must have at least one ElementaryStreamType set. type: ${s.type} level: ${s.level} sn: ${s.sn}`), this.blockBuffers(o, n);
  }
  onFragChanged(e, t) {
    this.trimBuffers();
  }
  // on BUFFER_EOS mark matching sourcebuffer(s) as ended and trigger checkEos()
  // an undefined data.type will mark all buffers as EOS.
  onBufferEos(e, t) {
    this.getSourceBufferTypes().reduce((i, n) => {
      const r = this.sourceBuffer[n];
      return r && (!t.type || t.type === n) && (r.ending = !0, r.ended || (r.ended = !0, this.log(`${n} sourceBuffer now EOS`))), i && !!(!r || r.ended);
    }, !0) && (this.log("Queueing mediaSource.endOfStream()"), this.blockBuffers(() => {
      this.getSourceBufferTypes().forEach((n) => {
        const r = this.sourceBuffer[n];
        r && (r.ending = !1);
      });
      const {
        mediaSource: i
      } = this;
      if (!i || i.readyState !== "open") {
        i && this.log(`Could not call mediaSource.endOfStream(). mediaSource.readyState: ${i.readyState}`);
        return;
      }
      this.log("Calling mediaSource.endOfStream()"), i.endOfStream();
    }));
  }
  onLevelUpdated(e, {
    details: t
  }) {
    t.fragments.length && (this.details = t, this.getSourceBufferTypes().length ? this.blockBuffers(this.updateMediaElementDuration.bind(this)) : this.updateMediaElementDuration());
  }
  trimBuffers() {
    const {
      hls: e,
      details: t,
      media: s
    } = this;
    if (!s || t === null || !this.getSourceBufferTypes().length)
      return;
    const n = e.config, r = s.currentTime, o = t.levelTargetDuration, l = t.live && n.liveBackBufferLength !== null ? n.liveBackBufferLength : n.backBufferLength;
    if (O(l) && l > 0) {
      const c = Math.max(l, o), h = Math.floor(r / o) * o - c;
      this.flushBackBuffer(r, o, h);
    }
    if (O(n.frontBufferFlushThreshold) && n.frontBufferFlushThreshold > 0) {
      const c = Math.max(n.maxBufferLength, n.frontBufferFlushThreshold), h = Math.max(c, o), u = Math.floor(r / o) * o + h;
      this.flushFrontBuffer(r, o, u);
    }
  }
  flushBackBuffer(e, t, s) {
    const {
      details: i,
      sourceBuffer: n
    } = this;
    this.getSourceBufferTypes().forEach((o) => {
      const l = n[o];
      if (l) {
        const c = ee.getBuffered(l);
        if (c.length > 0 && s > c.start(0)) {
          if (this.hls.trigger(y.BACK_BUFFER_REACHED, {
            bufferEnd: s
          }), i != null && i.live)
            this.hls.trigger(y.LIVE_BACK_BUFFER_REACHED, {
              bufferEnd: s
            });
          else if (l.ended && c.end(c.length - 1) - e < t * 2) {
            this.log(`Cannot flush ${o} back buffer while SourceBuffer is in ended state`);
            return;
          }
          this.hls.trigger(y.BUFFER_FLUSHING, {
            startOffset: 0,
            endOffset: s,
            type: o
          });
        }
      }
    });
  }
  flushFrontBuffer(e, t, s) {
    const {
      sourceBuffer: i
    } = this;
    this.getSourceBufferTypes().forEach((r) => {
      const o = i[r];
      if (o) {
        const l = ee.getBuffered(o), c = l.length;
        if (c < 2)
          return;
        const h = l.start(c - 1), u = l.end(c - 1);
        if (s > h || e >= h && e <= u)
          return;
        if (o.ended && e - u < 2 * t) {
          this.log(`Cannot flush ${r} front buffer while SourceBuffer is in ended state`);
          return;
        }
        this.hls.trigger(y.BUFFER_FLUSHING, {
          startOffset: h,
          endOffset: 1 / 0,
          type: r
        });
      }
    });
  }
  /**
   * Update Media Source duration to current level duration or override to Infinity if configuration parameter
   * 'liveDurationInfinity` is set to `true`
   * More details: https://github.com/video-dev/hls.js/issues/355
   */
  updateMediaElementDuration() {
    if (!this.details || !this.media || !this.mediaSource || this.mediaSource.readyState !== "open")
      return;
    const {
      details: e,
      hls: t,
      media: s,
      mediaSource: i
    } = this, n = e.fragments[0].start + e.totalduration, r = s.duration, o = O(i.duration) ? i.duration : 0;
    e.live && t.config.liveDurationInfinity ? (i.duration = 1 / 0, this.updateSeekableRange(e)) : (n > o && n > r || !O(r)) && (this.log(`Updating Media Source duration to ${n.toFixed(3)}`), i.duration = n);
  }
  updateSeekableRange(e) {
    const t = this.mediaSource, s = e.fragments;
    if (s.length && e.live && t != null && t.setLiveSeekableRange) {
      const n = Math.max(0, s[0].start), r = Math.max(n, n + e.totalduration);
      this.log(`Media Source duration is set to ${t.duration}. Setting seekable range to ${n}-${r}.`), t.setLiveSeekableRange(n, r);
    }
  }
  checkPendingTracks() {
    const {
      bufferCodecEventsExpected: e,
      operationQueue: t,
      pendingTracks: s
    } = this, i = Object.keys(s).length;
    if (i && (!e || i === 2 || "audiovideo" in s)) {
      this.createSourceBuffers(s), this.pendingTracks = {};
      const n = this.getSourceBufferTypes();
      if (n.length)
        this.hls.trigger(y.BUFFER_CREATED, {
          tracks: this.tracks
        }), n.forEach((r) => {
          t.executeNext(r);
        });
      else {
        const r = new Error("could not create source buffer for media codec(s)");
        this.hls.trigger(y.ERROR, {
          type: K.MEDIA_ERROR,
          details: A.BUFFER_INCOMPATIBLE_CODECS_ERROR,
          fatal: !0,
          error: r,
          reason: r.message
        });
      }
    }
  }
  createSourceBuffers(e) {
    const {
      sourceBuffer: t,
      mediaSource: s
    } = this;
    if (!s)
      throw Error("createSourceBuffers called when mediaSource was null");
    for (const n in e)
      if (!t[n]) {
        var i;
        const r = e[n];
        if (!r)
          throw Error(`source buffer exists for track ${n}, however track does not`);
        let o = ((i = r.levelCodec) == null ? void 0 : i.indexOf(",")) === -1 ? r.levelCodec : r.codec;
        o && n.slice(0, 5) === "audio" && (o = kt(o, this.appendSource));
        const l = `${r.container};codecs=${o}`;
        this.log(`creating sourceBuffer(${l})`);
        try {
          const c = t[n] = s.addSourceBuffer(l), h = n;
          this.addBufferListener(h, "updatestart", this._onSBUpdateStart), this.addBufferListener(h, "updateend", this._onSBUpdateEnd), this.addBufferListener(h, "error", this._onSBUpdateError), this.appendSource && this.addBufferListener(h, "bufferedchange", (u, d) => {
            const f = d.removedRanges;
            f != null && f.length && this.hls.trigger(y.BUFFER_FLUSHED, {
              type: n
            });
          }), this.tracks[n] = {
            buffer: c,
            codec: o,
            container: r.container,
            levelCodec: r.levelCodec,
            metadata: r.metadata,
            id: r.id
          };
        } catch (c) {
          this.error(`error while trying to add sourceBuffer: ${c.message}`), this.hls.trigger(y.ERROR, {
            type: K.MEDIA_ERROR,
            details: A.BUFFER_ADD_CODEC_ERROR,
            fatal: !1,
            error: c,
            sourceBufferName: n,
            mimeType: l
          });
        }
      }
  }
  get mediaSrc() {
    var e;
    const t = ((e = this.media) == null ? void 0 : e.firstChild) || this.media;
    return t == null ? void 0 : t.src;
  }
  _onSBUpdateStart(e) {
    const {
      operationQueue: t
    } = this;
    t.current(e).onStart();
  }
  _onSBUpdateEnd(e) {
    var t;
    if (((t = this.mediaSource) == null ? void 0 : t.readyState) === "closed") {
      this.resetBuffer(e);
      return;
    }
    const {
      operationQueue: s
    } = this;
    s.current(e).onComplete(), s.shiftAndExecuteNext(e);
  }
  _onSBUpdateError(e, t) {
    var s;
    const i = new Error(`${e} SourceBuffer error. MediaSource readyState: ${(s = this.mediaSource) == null ? void 0 : s.readyState}`);
    this.error(`${i}`, t), this.hls.trigger(y.ERROR, {
      type: K.MEDIA_ERROR,
      details: A.BUFFER_APPENDING_ERROR,
      sourceBufferName: e,
      error: i,
      fatal: !1
    });
    const n = this.operationQueue.current(e);
    n && n.onError(i);
  }
  // This method must result in an updateend event; if remove is not called, _onSBUpdateEnd must be called manually
  removeExecutor(e, t, s) {
    const {
      media: i,
      mediaSource: n,
      operationQueue: r,
      sourceBuffer: o
    } = this, l = o[e];
    if (!i || !n || !l) {
      this.warn(`Attempting to remove from the ${e} SourceBuffer, but it does not exist`), r.shiftAndExecuteNext(e);
      return;
    }
    const c = O(i.duration) ? i.duration : 1 / 0, h = O(n.duration) ? n.duration : 1 / 0, u = Math.max(0, t), d = Math.min(s, c, h);
    d > u && (!l.ending || l.ended) ? (l.ended = !1, this.log(`Removing [${u},${d}] from the ${e} SourceBuffer`), l.remove(u, d)) : r.shiftAndExecuteNext(e);
  }
  // This method must result in an updateend event; if append is not called, _onSBUpdateEnd must be called manually
  appendExecutor(e, t) {
    const s = this.sourceBuffer[t];
    if (!s) {
      if (!this.pendingTracks[t])
        throw new Error(`Attempting to append to the ${t} SourceBuffer, but it does not exist`);
      return;
    }
    s.ended = !1, s.appendBuffer(e);
  }
  // Enqueues an operation to each SourceBuffer queue which, upon execution, resolves a promise. When all promises
  // resolve, the onUnblocked function is executed. Functions calling this method do not need to unblock the queue
  // upon completion, since we already do it here
  blockBuffers(e, t = this.getSourceBufferTypes()) {
    if (!t.length) {
      this.log("Blocking operation requested, but no SourceBuffers exist"), Promise.resolve().then(e);
      return;
    }
    const {
      operationQueue: s
    } = this, i = t.map((n) => s.appendBlocker(n));
    Promise.all(i).then(() => {
      e(), t.forEach((n) => {
        const r = this.sourceBuffer[n];
        r != null && r.updating || s.shiftAndExecuteNext(n);
      });
    });
  }
  getSourceBufferTypes() {
    return Object.keys(this.sourceBuffer);
  }
  addBufferListener(e, t, s) {
    const i = this.sourceBuffer[e];
    if (!i)
      return;
    const n = s.bind(this, e);
    this.listeners[e].push({
      event: t,
      listener: n
    }), i.addEventListener(t, n);
  }
  removeBufferListeners(e) {
    const t = this.sourceBuffer[e];
    t && this.listeners[e].forEach((s) => {
      t.removeEventListener(s.event, s.listener);
    });
  }
}
function Fi(a) {
  const e = a.querySelectorAll("source");
  [].slice.call(e).forEach((t) => {
    a.removeChild(t);
  });
}
function Qo(a, e) {
  const t = self.document.createElement("source");
  t.type = "video/mp4", t.src = e, a.appendChild(t);
}
const Jo = {
  42: 225,
  // lowercase a, acute accent
  92: 233,
  // lowercase e, acute accent
  94: 237,
  // lowercase i, acute accent
  95: 243,
  // lowercase o, acute accent
  96: 250,
  // lowercase u, acute accent
  123: 231,
  // lowercase c with cedilla
  124: 247,
  // division symbol
  125: 209,
  // uppercase N tilde
  126: 241,
  // lowercase n tilde
  127: 9608,
  // Full block
  // THIS BLOCK INCLUDES THE 16 EXTENDED (TWO-BYTE) LINE 21 CHARACTERS
  // THAT COME FROM HI BYTE=0x11 AND LOW BETWEEN 0x30 AND 0x3F
  // THIS MEANS THAT \x50 MUST BE ADDED TO THE VALUES
  128: 174,
  // Registered symbol (R)
  129: 176,
  // degree sign
  130: 189,
  // 1/2 symbol
  131: 191,
  // Inverted (open) question mark
  132: 8482,
  // Trademark symbol (TM)
  133: 162,
  // Cents symbol
  134: 163,
  // Pounds sterling
  135: 9834,
  // Music 8'th note
  136: 224,
  // lowercase a, grave accent
  137: 32,
  // transparent space (regular)
  138: 232,
  // lowercase e, grave accent
  139: 226,
  // lowercase a, circumflex accent
  140: 234,
  // lowercase e, circumflex accent
  141: 238,
  // lowercase i, circumflex accent
  142: 244,
  // lowercase o, circumflex accent
  143: 251,
  // lowercase u, circumflex accent
  // THIS BLOCK INCLUDES THE 32 EXTENDED (TWO-BYTE) LINE 21 CHARACTERS
  // THAT COME FROM HI BYTE=0x12 AND LOW BETWEEN 0x20 AND 0x3F
  144: 193,
  // capital letter A with acute
  145: 201,
  // capital letter E with acute
  146: 211,
  // capital letter O with acute
  147: 218,
  // capital letter U with acute
  148: 220,
  // capital letter U with diaresis
  149: 252,
  // lowercase letter U with diaeresis
  150: 8216,
  // opening single quote
  151: 161,
  // inverted exclamation mark
  152: 42,
  // asterisk
  153: 8217,
  // closing single quote
  154: 9473,
  // box drawings heavy horizontal
  155: 169,
  // copyright sign
  156: 8480,
  // Service mark
  157: 8226,
  // (round) bullet
  158: 8220,
  // Left double quotation mark
  159: 8221,
  // Right double quotation mark
  160: 192,
  // uppercase A, grave accent
  161: 194,
  // uppercase A, circumflex
  162: 199,
  // uppercase C with cedilla
  163: 200,
  // uppercase E, grave accent
  164: 202,
  // uppercase E, circumflex
  165: 203,
  // capital letter E with diaresis
  166: 235,
  // lowercase letter e with diaresis
  167: 206,
  // uppercase I, circumflex
  168: 207,
  // uppercase I, with diaresis
  169: 239,
  // lowercase i, with diaresis
  170: 212,
  // uppercase O, circumflex
  171: 217,
  // uppercase U, grave accent
  172: 249,
  // lowercase u, grave accent
  173: 219,
  // uppercase U, circumflex
  174: 171,
  // left-pointing double angle quotation mark
  175: 187,
  // right-pointing double angle quotation mark
  // THIS BLOCK INCLUDES THE 32 EXTENDED (TWO-BYTE) LINE 21 CHARACTERS
  // THAT COME FROM HI BYTE=0x13 AND LOW BETWEEN 0x20 AND 0x3F
  176: 195,
  // Uppercase A, tilde
  177: 227,
  // Lowercase a, tilde
  178: 205,
  // Uppercase I, acute accent
  179: 204,
  // Uppercase I, grave accent
  180: 236,
  // Lowercase i, grave accent
  181: 210,
  // Uppercase O, grave accent
  182: 242,
  // Lowercase o, grave accent
  183: 213,
  // Uppercase O, tilde
  184: 245,
  // Lowercase o, tilde
  185: 123,
  // Open curly brace
  186: 125,
  // Closing curly brace
  187: 92,
  // Backslash
  188: 94,
  // Caret
  189: 95,
  // Underscore
  190: 124,
  // Pipe (vertical line)
  191: 8764,
  // Tilde operator
  192: 196,
  // Uppercase A, umlaut
  193: 228,
  // Lowercase A, umlaut
  194: 214,
  // Uppercase O, umlaut
  195: 246,
  // Lowercase o, umlaut
  196: 223,
  // Esszett (sharp S)
  197: 165,
  // Yen symbol
  198: 164,
  // Generic currency sign
  199: 9475,
  // Box drawings heavy vertical
  200: 197,
  // Uppercase A, ring
  201: 229,
  // Lowercase A, ring
  202: 216,
  // Uppercase O, stroke
  203: 248,
  // Lowercase o, strok
  204: 9487,
  // Box drawings heavy down and right
  205: 9491,
  // Box drawings heavy down and left
  206: 9495,
  // Box drawings heavy up and right
  207: 9499
  // Box drawings heavy up and left
}, Gn = (a) => String.fromCharCode(Jo[a] || a), Te = 15, De = 100, el = {
  17: 1,
  18: 3,
  21: 5,
  22: 7,
  23: 9,
  16: 11,
  19: 12,
  20: 14
}, tl = {
  17: 2,
  18: 4,
  21: 6,
  22: 8,
  23: 10,
  19: 13,
  20: 15
}, sl = {
  25: 1,
  26: 3,
  29: 5,
  30: 7,
  31: 9,
  24: 11,
  27: 12,
  28: 14
}, il = {
  25: 2,
  26: 4,
  29: 6,
  30: 8,
  31: 10,
  27: 13,
  28: 15
}, nl = ["white", "green", "blue", "cyan", "red", "yellow", "magenta", "black", "transparent"];
class rl {
  constructor() {
    this.time = null, this.verboseLevel = 0;
  }
  log(e, t) {
    if (this.verboseLevel >= e) {
      const s = typeof t == "function" ? t() : t;
      S.log(`${this.time} [${e}] ${s}`);
    }
  }
}
const Oe = function(e) {
  const t = [];
  for (let s = 0; s < e.length; s++)
    t.push(e[s].toString(16));
  return t;
};
class Kn {
  constructor() {
    this.foreground = "white", this.underline = !1, this.italics = !1, this.background = "black", this.flash = !1;
  }
  reset() {
    this.foreground = "white", this.underline = !1, this.italics = !1, this.background = "black", this.flash = !1;
  }
  setStyles(e) {
    const t = ["foreground", "underline", "italics", "background", "flash"];
    for (let s = 0; s < t.length; s++) {
      const i = t[s];
      e.hasOwnProperty(i) && (this[i] = e[i]);
    }
  }
  isDefault() {
    return this.foreground === "white" && !this.underline && !this.italics && this.background === "black" && !this.flash;
  }
  equals(e) {
    return this.foreground === e.foreground && this.underline === e.underline && this.italics === e.italics && this.background === e.background && this.flash === e.flash;
  }
  copy(e) {
    this.foreground = e.foreground, this.underline = e.underline, this.italics = e.italics, this.background = e.background, this.flash = e.flash;
  }
  toString() {
    return "color=" + this.foreground + ", underline=" + this.underline + ", italics=" + this.italics + ", background=" + this.background + ", flash=" + this.flash;
  }
}
class al {
  constructor() {
    this.uchar = " ", this.penState = new Kn();
  }
  reset() {
    this.uchar = " ", this.penState.reset();
  }
  setChar(e, t) {
    this.uchar = e, this.penState.copy(t);
  }
  setPenState(e) {
    this.penState.copy(e);
  }
  equals(e) {
    return this.uchar === e.uchar && this.penState.equals(e.penState);
  }
  copy(e) {
    this.uchar = e.uchar, this.penState.copy(e.penState);
  }
  isEmpty() {
    return this.uchar === " " && this.penState.isDefault();
  }
}
class ol {
  constructor(e) {
    this.chars = [], this.pos = 0, this.currPenState = new Kn(), this.cueStartTime = null, this.logger = void 0;
    for (let t = 0; t < De; t++)
      this.chars.push(new al());
    this.logger = e;
  }
  equals(e) {
    for (let t = 0; t < De; t++)
      if (!this.chars[t].equals(e.chars[t]))
        return !1;
    return !0;
  }
  copy(e) {
    for (let t = 0; t < De; t++)
      this.chars[t].copy(e.chars[t]);
  }
  isEmpty() {
    let e = !0;
    for (let t = 0; t < De; t++)
      if (!this.chars[t].isEmpty()) {
        e = !1;
        break;
      }
    return e;
  }
  /**
   *  Set the cursor to a valid column.
   */
  setCursor(e) {
    this.pos !== e && (this.pos = e), this.pos < 0 ? (this.logger.log(3, "Negative cursor position " + this.pos), this.pos = 0) : this.pos > De && (this.logger.log(3, "Too large cursor position " + this.pos), this.pos = De);
  }
  /**
   * Move the cursor relative to current position.
   */
  moveCursor(e) {
    const t = this.pos + e;
    if (e > 1)
      for (let s = this.pos + 1; s < t + 1; s++)
        this.chars[s].setPenState(this.currPenState);
    this.setCursor(t);
  }
  /**
   * Backspace, move one step back and clear character.
   */
  backSpace() {
    this.moveCursor(-1), this.chars[this.pos].setChar(" ", this.currPenState);
  }
  insertChar(e) {
    e >= 144 && this.backSpace();
    const t = Gn(e);
    if (this.pos >= De) {
      this.logger.log(0, () => "Cannot insert " + e.toString(16) + " (" + t + ") at position " + this.pos + ". Skipping it!");
      return;
    }
    this.chars[this.pos].setChar(t, this.currPenState), this.moveCursor(1);
  }
  clearFromPos(e) {
    let t;
    for (t = e; t < De; t++)
      this.chars[t].reset();
  }
  clear() {
    this.clearFromPos(0), this.pos = 0, this.currPenState.reset();
  }
  clearToEndOfRow() {
    this.clearFromPos(this.pos);
  }
  getTextString() {
    const e = [];
    let t = !0;
    for (let s = 0; s < De; s++) {
      const i = this.chars[s].uchar;
      i !== " " && (t = !1), e.push(i);
    }
    return t ? "" : e.join("");
  }
  setPenStyles(e) {
    this.currPenState.setStyles(e), this.chars[this.pos].setPenState(this.currPenState);
  }
}
class ss {
  constructor(e) {
    this.rows = [], this.currRow = Te - 1, this.nrRollUpRows = null, this.lastOutputScreen = null, this.logger = void 0;
    for (let t = 0; t < Te; t++)
      this.rows.push(new ol(e));
    this.logger = e;
  }
  reset() {
    for (let e = 0; e < Te; e++)
      this.rows[e].clear();
    this.currRow = Te - 1;
  }
  equals(e) {
    let t = !0;
    for (let s = 0; s < Te; s++)
      if (!this.rows[s].equals(e.rows[s])) {
        t = !1;
        break;
      }
    return t;
  }
  copy(e) {
    for (let t = 0; t < Te; t++)
      this.rows[t].copy(e.rows[t]);
  }
  isEmpty() {
    let e = !0;
    for (let t = 0; t < Te; t++)
      if (!this.rows[t].isEmpty()) {
        e = !1;
        break;
      }
    return e;
  }
  backSpace() {
    this.rows[this.currRow].backSpace();
  }
  clearToEndOfRow() {
    this.rows[this.currRow].clearToEndOfRow();
  }
  /**
   * Insert a character (without styling) in the current row.
   */
  insertChar(e) {
    this.rows[this.currRow].insertChar(e);
  }
  setPen(e) {
    this.rows[this.currRow].setPenStyles(e);
  }
  moveCursor(e) {
    this.rows[this.currRow].moveCursor(e);
  }
  setCursor(e) {
    this.logger.log(2, "setCursor: " + e), this.rows[this.currRow].setCursor(e);
  }
  setPAC(e) {
    this.logger.log(2, () => "pacData = " + JSON.stringify(e));
    let t = e.row - 1;
    if (this.nrRollUpRows && t < this.nrRollUpRows - 1 && (t = this.nrRollUpRows - 1), this.nrRollUpRows && this.currRow !== t) {
      for (let o = 0; o < Te; o++)
        this.rows[o].clear();
      const n = this.currRow + 1 - this.nrRollUpRows, r = this.lastOutputScreen;
      if (r) {
        const o = r.rows[n].cueStartTime, l = this.logger.time;
        if (o !== null && l !== null && o < l)
          for (let c = 0; c < this.nrRollUpRows; c++)
            this.rows[t - this.nrRollUpRows + c + 1].copy(r.rows[n + c]);
      }
    }
    this.currRow = t;
    const s = this.rows[this.currRow];
    if (e.indent !== null) {
      const n = e.indent, r = Math.max(n - 1, 0);
      s.setCursor(e.indent), e.color = s.chars[r].penState.foreground;
    }
    const i = {
      foreground: e.color,
      underline: e.underline,
      italics: e.italics,
      background: "black",
      flash: !1
    };
    this.setPen(i);
  }
  /**
   * Set background/extra foreground, but first do back_space, and then insert space (backwards compatibility).
   */
  setBkgData(e) {
    this.logger.log(2, () => "bkgData = " + JSON.stringify(e)), this.backSpace(), this.setPen(e), this.insertChar(32);
  }
  setRollUpRows(e) {
    this.nrRollUpRows = e;
  }
  rollUp() {
    if (this.nrRollUpRows === null) {
      this.logger.log(3, "roll_up but nrRollUpRows not set yet");
      return;
    }
    this.logger.log(1, () => this.getDisplayText());
    const e = this.currRow + 1 - this.nrRollUpRows, t = this.rows.splice(e, 1)[0];
    t.clear(), this.rows.splice(this.currRow, 0, t), this.logger.log(2, "Rolling up");
  }
  /**
   * Get all non-empty rows with as unicode text.
   */
  getDisplayText(e) {
    e = e || !1;
    const t = [];
    let s = "", i = -1;
    for (let n = 0; n < Te; n++) {
      const r = this.rows[n].getTextString();
      r && (i = n + 1, e ? t.push("Row " + i + ": '" + r + "'") : t.push(r.trim()));
    }
    return t.length > 0 && (e ? s = "[" + t.join(" | ") + "]" : s = t.join(`
`)), s;
  }
  getTextAndFormat() {
    return this.rows;
  }
}
class _i {
  constructor(e, t, s) {
    this.chNr = void 0, this.outputFilter = void 0, this.mode = void 0, this.verbose = void 0, this.displayedMemory = void 0, this.nonDisplayedMemory = void 0, this.lastOutputScreen = void 0, this.currRollUpRow = void 0, this.writeScreen = void 0, this.cueStartTime = void 0, this.logger = void 0, this.chNr = e, this.outputFilter = t, this.mode = null, this.verbose = 0, this.displayedMemory = new ss(s), this.nonDisplayedMemory = new ss(s), this.lastOutputScreen = new ss(s), this.currRollUpRow = this.displayedMemory.rows[Te - 1], this.writeScreen = this.displayedMemory, this.mode = null, this.cueStartTime = null, this.logger = s;
  }
  reset() {
    this.mode = null, this.displayedMemory.reset(), this.nonDisplayedMemory.reset(), this.lastOutputScreen.reset(), this.outputFilter.reset(), this.currRollUpRow = this.displayedMemory.rows[Te - 1], this.writeScreen = this.displayedMemory, this.mode = null, this.cueStartTime = null;
  }
  getHandler() {
    return this.outputFilter;
  }
  setHandler(e) {
    this.outputFilter = e;
  }
  setPAC(e) {
    this.writeScreen.setPAC(e);
  }
  setBkgData(e) {
    this.writeScreen.setBkgData(e);
  }
  setMode(e) {
    e !== this.mode && (this.mode = e, this.logger.log(2, () => "MODE=" + e), this.mode === "MODE_POP-ON" ? this.writeScreen = this.nonDisplayedMemory : (this.writeScreen = this.displayedMemory, this.writeScreen.reset()), this.mode !== "MODE_ROLL-UP" && (this.displayedMemory.nrRollUpRows = null, this.nonDisplayedMemory.nrRollUpRows = null), this.mode = e);
  }
  insertChars(e) {
    for (let s = 0; s < e.length; s++)
      this.writeScreen.insertChar(e[s]);
    const t = this.writeScreen === this.displayedMemory ? "DISP" : "NON_DISP";
    this.logger.log(2, () => t + ": " + this.writeScreen.getDisplayText(!0)), (this.mode === "MODE_PAINT-ON" || this.mode === "MODE_ROLL-UP") && (this.logger.log(1, () => "DISPLAYED: " + this.displayedMemory.getDisplayText(!0)), this.outputDataUpdate());
  }
  ccRCL() {
    this.logger.log(2, "RCL - Resume Caption Loading"), this.setMode("MODE_POP-ON");
  }
  ccBS() {
    this.logger.log(2, "BS - BackSpace"), this.mode !== "MODE_TEXT" && (this.writeScreen.backSpace(), this.writeScreen === this.displayedMemory && this.outputDataUpdate());
  }
  ccAOF() {
  }
  ccAON() {
  }
  ccDER() {
    this.logger.log(2, "DER- Delete to End of Row"), this.writeScreen.clearToEndOfRow(), this.outputDataUpdate();
  }
  ccRU(e) {
    this.logger.log(2, "RU(" + e + ") - Roll Up"), this.writeScreen = this.displayedMemory, this.setMode("MODE_ROLL-UP"), this.writeScreen.setRollUpRows(e);
  }
  ccFON() {
    this.logger.log(2, "FON - Flash On"), this.writeScreen.setPen({
      flash: !0
    });
  }
  ccRDC() {
    this.logger.log(2, "RDC - Resume Direct Captioning"), this.setMode("MODE_PAINT-ON");
  }
  ccTR() {
    this.logger.log(2, "TR"), this.setMode("MODE_TEXT");
  }
  ccRTD() {
    this.logger.log(2, "RTD"), this.setMode("MODE_TEXT");
  }
  ccEDM() {
    this.logger.log(2, "EDM - Erase Displayed Memory"), this.displayedMemory.reset(), this.outputDataUpdate(!0);
  }
  ccCR() {
    this.logger.log(2, "CR - Carriage Return"), this.writeScreen.rollUp(), this.outputDataUpdate(!0);
  }
  ccENM() {
    this.logger.log(2, "ENM - Erase Non-displayed Memory"), this.nonDisplayedMemory.reset();
  }
  ccEOC() {
    if (this.logger.log(2, "EOC - End Of Caption"), this.mode === "MODE_POP-ON") {
      const e = this.displayedMemory;
      this.displayedMemory = this.nonDisplayedMemory, this.nonDisplayedMemory = e, this.writeScreen = this.nonDisplayedMemory, this.logger.log(1, () => "DISP: " + this.displayedMemory.getDisplayText());
    }
    this.outputDataUpdate(!0);
  }
  ccTO(e) {
    this.logger.log(2, "TO(" + e + ") - Tab Offset"), this.writeScreen.moveCursor(e);
  }
  ccMIDROW(e) {
    const t = {
      flash: !1
    };
    if (t.underline = e % 2 === 1, t.italics = e >= 46, t.italics)
      t.foreground = "white";
    else {
      const s = Math.floor(e / 2) - 16, i = ["white", "green", "blue", "cyan", "red", "yellow", "magenta"];
      t.foreground = i[s];
    }
    this.logger.log(2, "MIDROW: " + JSON.stringify(t)), this.writeScreen.setPen(t);
  }
  outputDataUpdate(e = !1) {
    const t = this.logger.time;
    t !== null && this.outputFilter && (this.cueStartTime === null && !this.displayedMemory.isEmpty() ? this.cueStartTime = t : this.displayedMemory.equals(this.lastOutputScreen) || (this.outputFilter.newCue(this.cueStartTime, t, this.lastOutputScreen), e && this.outputFilter.dispatchCue && this.outputFilter.dispatchCue(), this.cueStartTime = this.displayedMemory.isEmpty() ? null : t), this.lastOutputScreen.copy(this.displayedMemory));
  }
  cueSplitAtTime(e) {
    this.outputFilter && (this.displayedMemory.isEmpty() || (this.outputFilter.newCue && this.outputFilter.newCue(this.cueStartTime, e, this.displayedMemory), this.cueStartTime = e));
  }
}
class Oi {
  constructor(e, t, s) {
    this.channels = void 0, this.currentChannel = 0, this.cmdHistory = cl(), this.logger = void 0;
    const i = this.logger = new rl();
    this.channels = [null, new _i(e, t, i), new _i(e + 1, s, i)];
  }
  getHandler(e) {
    return this.channels[e].getHandler();
  }
  setHandler(e, t) {
    this.channels[e].setHandler(t);
  }
  /**
   * Add data for time t in forms of list of bytes (unsigned ints). The bytes are treated as pairs.
   */
  addData(e, t) {
    this.logger.time = e;
    for (let s = 0; s < t.length; s += 2) {
      const i = t[s] & 127, n = t[s + 1] & 127;
      let r = !1, o = null;
      if (i === 0 && n === 0)
        continue;
      this.logger.log(3, () => "[" + Oe([t[s], t[s + 1]]) + "] -> (" + Oe([i, n]) + ")");
      const l = this.cmdHistory;
      if (i >= 16 && i <= 31) {
        if (ll(i, n, l)) {
          mt(null, null, l), this.logger.log(3, () => "Repeated command (" + Oe([i, n]) + ") is dropped");
          continue;
        }
        mt(i, n, this.cmdHistory), r = this.parseCmd(i, n), r || (r = this.parseMidrow(i, n)), r || (r = this.parsePAC(i, n)), r || (r = this.parseBackgroundAttributes(i, n));
      } else
        mt(null, null, l);
      if (!r && (o = this.parseChars(i, n), o)) {
        const h = this.currentChannel;
        h && h > 0 ? this.channels[h].insertChars(o) : this.logger.log(2, "No channel found yet. TEXT-MODE?");
      }
      !r && !o && this.logger.log(2, () => "Couldn't parse cleaned data " + Oe([i, n]) + " orig: " + Oe([t[s], t[s + 1]]));
    }
  }
  /**
   * Parse Command.
   * @returns True if a command was found
   */
  parseCmd(e, t) {
    const s = (e === 20 || e === 28 || e === 21 || e === 29) && t >= 32 && t <= 47, i = (e === 23 || e === 31) && t >= 33 && t <= 35;
    if (!(s || i))
      return !1;
    const n = e === 20 || e === 21 || e === 23 ? 1 : 2, r = this.channels[n];
    return e === 20 || e === 21 || e === 28 || e === 29 ? t === 32 ? r.ccRCL() : t === 33 ? r.ccBS() : t === 34 ? r.ccAOF() : t === 35 ? r.ccAON() : t === 36 ? r.ccDER() : t === 37 ? r.ccRU(2) : t === 38 ? r.ccRU(3) : t === 39 ? r.ccRU(4) : t === 40 ? r.ccFON() : t === 41 ? r.ccRDC() : t === 42 ? r.ccTR() : t === 43 ? r.ccRTD() : t === 44 ? r.ccEDM() : t === 45 ? r.ccCR() : t === 46 ? r.ccENM() : t === 47 && r.ccEOC() : r.ccTO(t - 32), this.currentChannel = n, !0;
  }
  /**
   * Parse midrow styling command
   */
  parseMidrow(e, t) {
    let s = 0;
    if ((e === 17 || e === 25) && t >= 32 && t <= 47) {
      if (e === 17 ? s = 1 : s = 2, s !== this.currentChannel)
        return this.logger.log(0, "Mismatch channel in midrow parsing"), !1;
      const i = this.channels[s];
      return i ? (i.ccMIDROW(t), this.logger.log(3, () => "MIDROW (" + Oe([e, t]) + ")"), !0) : !1;
    }
    return !1;
  }
  /**
   * Parse Preable Access Codes (Table 53).
   * @returns {Boolean} Tells if PAC found
   */
  parsePAC(e, t) {
    let s;
    const i = (e >= 17 && e <= 23 || e >= 25 && e <= 31) && t >= 64 && t <= 127, n = (e === 16 || e === 24) && t >= 64 && t <= 95;
    if (!(i || n))
      return !1;
    const r = e <= 23 ? 1 : 2;
    t >= 64 && t <= 95 ? s = r === 1 ? el[e] : sl[e] : s = r === 1 ? tl[e] : il[e];
    const o = this.channels[r];
    return o ? (o.setPAC(this.interpretPAC(s, t)), this.currentChannel = r, !0) : !1;
  }
  /**
   * Interpret the second byte of the pac, and return the information.
   * @returns pacData with style parameters
   */
  interpretPAC(e, t) {
    let s;
    const i = {
      color: null,
      italics: !1,
      indent: null,
      underline: !1,
      row: e
    };
    return t > 95 ? s = t - 96 : s = t - 64, i.underline = (s & 1) === 1, s <= 13 ? i.color = ["white", "green", "blue", "cyan", "red", "yellow", "magenta", "white"][Math.floor(s / 2)] : s <= 15 ? (i.italics = !0, i.color = "white") : i.indent = Math.floor((s - 16) / 2) * 4, i;
  }
  /**
   * Parse characters.
   * @returns An array with 1 to 2 codes corresponding to chars, if found. null otherwise.
   */
  parseChars(e, t) {
    let s, i = null, n = null;
    if (e >= 25 ? (s = 2, n = e - 8) : (s = 1, n = e), n >= 17 && n <= 19) {
      let r;
      n === 17 ? r = t + 80 : n === 18 ? r = t + 112 : r = t + 144, this.logger.log(2, () => "Special char '" + Gn(r) + "' in channel " + s), i = [r];
    } else
      e >= 32 && e <= 127 && (i = t === 0 ? [e] : [e, t]);
    return i && this.logger.log(3, () => "Char codes =  " + Oe(i).join(",")), i;
  }
  /**
   * Parse extended background attributes as well as new foreground color black.
   * @returns True if background attributes are found
   */
  parseBackgroundAttributes(e, t) {
    const s = (e === 16 || e === 24) && t >= 32 && t <= 47, i = (e === 23 || e === 31) && t >= 45 && t <= 47;
    if (!(s || i))
      return !1;
    let n;
    const r = {};
    e === 16 || e === 24 ? (n = Math.floor((t - 32) / 2), r.background = nl[n], t % 2 === 1 && (r.background = r.background + "_semi")) : t === 45 ? r.background = "transparent" : (r.foreground = "black", t === 47 && (r.underline = !0));
    const o = e <= 23 ? 1 : 2;
    return this.channels[o].setBkgData(r), !0;
  }
  /**
   * Reset state of parser and its channels.
   */
  reset() {
    for (let e = 0; e < Object.keys(this.channels).length; e++) {
      const t = this.channels[e];
      t && t.reset();
    }
    mt(null, null, this.cmdHistory);
  }
  /**
   * Trigger the generation of a cue, and the start of a new one if displayScreens are not empty.
   */
  cueSplitAtTime(e) {
    for (let t = 0; t < this.channels.length; t++) {
      const s = this.channels[t];
      s && s.cueSplitAtTime(e);
    }
  }
}
function mt(a, e, t) {
  t.a = a, t.b = e;
}
function ll(a, e, t) {
  return t.a === a && t.b === e;
}
function cl() {
  return {
    a: null,
    b: null
  };
}
class pt {
  constructor(e, t) {
    this.timelineController = void 0, this.cueRanges = [], this.trackName = void 0, this.startTime = null, this.endTime = null, this.screen = null, this.timelineController = e, this.trackName = t;
  }
  dispatchCue() {
    this.startTime !== null && (this.timelineController.addCues(this.trackName, this.startTime, this.endTime, this.screen, this.cueRanges), this.startTime = null);
  }
  newCue(e, t, s) {
    (this.startTime === null || this.startTime > e) && (this.startTime = e), this.endTime = t, this.screen = s, this.timelineController.createCaptionsTrack(this.trackName);
  }
  reset() {
    this.cueRanges = [], this.startTime = null;
  }
}
var Us = function() {
  if (je != null && je.VTTCue)
    return self.VTTCue;
  const a = ["", "lr", "rl"], e = ["start", "middle", "end", "left", "right"];
  function t(o, l) {
    if (typeof l != "string" || !Array.isArray(o))
      return !1;
    const c = l.toLowerCase();
    return ~o.indexOf(c) ? c : !1;
  }
  function s(o) {
    return t(a, o);
  }
  function i(o) {
    return t(e, o);
  }
  function n(o, ...l) {
    let c = 1;
    for (; c < arguments.length; c++) {
      const h = arguments[c];
      for (const u in h)
        o[u] = h[u];
    }
    return o;
  }
  function r(o, l, c) {
    const h = this, u = {
      enumerable: !0
    };
    h.hasBeenReset = !1;
    let d = "", f = !1, m = o, p = l, g = c, v = null, C = "", E = !0, T = "auto", x = "start", I = 50, L = "middle", w = 50, R = "middle";
    Object.defineProperty(h, "id", n({}, u, {
      get: function() {
        return d;
      },
      set: function(k) {
        d = "" + k;
      }
    })), Object.defineProperty(h, "pauseOnExit", n({}, u, {
      get: function() {
        return f;
      },
      set: function(k) {
        f = !!k;
      }
    })), Object.defineProperty(h, "startTime", n({}, u, {
      get: function() {
        return m;
      },
      set: function(k) {
        if (typeof k != "number")
          throw new TypeError("Start time must be set to a number.");
        m = k, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(h, "endTime", n({}, u, {
      get: function() {
        return p;
      },
      set: function(k) {
        if (typeof k != "number")
          throw new TypeError("End time must be set to a number.");
        p = k, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(h, "text", n({}, u, {
      get: function() {
        return g;
      },
      set: function(k) {
        g = "" + k, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(h, "region", n({}, u, {
      get: function() {
        return v;
      },
      set: function(k) {
        v = k, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(h, "vertical", n({}, u, {
      get: function() {
        return C;
      },
      set: function(k) {
        const M = s(k);
        if (M === !1)
          throw new SyntaxError("An invalid or illegal string was specified.");
        C = M, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(h, "snapToLines", n({}, u, {
      get: function() {
        return E;
      },
      set: function(k) {
        E = !!k, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(h, "line", n({}, u, {
      get: function() {
        return T;
      },
      set: function(k) {
        if (typeof k != "number" && k !== "auto")
          throw new SyntaxError("An invalid number or illegal string was specified.");
        T = k, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(h, "lineAlign", n({}, u, {
      get: function() {
        return x;
      },
      set: function(k) {
        const M = i(k);
        if (!M)
          throw new SyntaxError("An invalid or illegal string was specified.");
        x = M, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(h, "position", n({}, u, {
      get: function() {
        return I;
      },
      set: function(k) {
        if (k < 0 || k > 100)
          throw new Error("Position must be between 0 and 100.");
        I = k, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(h, "positionAlign", n({}, u, {
      get: function() {
        return L;
      },
      set: function(k) {
        const M = i(k);
        if (!M)
          throw new SyntaxError("An invalid or illegal string was specified.");
        L = M, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(h, "size", n({}, u, {
      get: function() {
        return w;
      },
      set: function(k) {
        if (k < 0 || k > 100)
          throw new Error("Size must be between 0 and 100.");
        w = k, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(h, "align", n({}, u, {
      get: function() {
        return R;
      },
      set: function(k) {
        const M = i(k);
        if (!M)
          throw new SyntaxError("An invalid or illegal string was specified.");
        R = M, this.hasBeenReset = !0;
      }
    })), h.displayState = void 0;
  }
  return r.prototype.getCueAsHTML = function() {
    return self.WebVTT.convertCueToDOMTree(self, this.text);
  }, r;
}();
class hl {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  decode(e, t) {
    if (!e)
      return "";
    if (typeof e != "string")
      throw new Error("Error - expected string data.");
    return decodeURIComponent(encodeURIComponent(e));
  }
}
function Wn(a) {
  function e(s, i, n, r) {
    return (s | 0) * 3600 + (i | 0) * 60 + (n | 0) + parseFloat(r || 0);
  }
  const t = a.match(/^(?:(\d+):)?(\d{2}):(\d{2})(\.\d+)?/);
  return t ? parseFloat(t[2]) > 59 ? e(t[2], t[3], 0, t[4]) : e(t[1], t[2], t[3], t[4]) : null;
}
class ul {
  constructor() {
    this.values = /* @__PURE__ */ Object.create(null);
  }
  // Only accept the first assignment to any key.
  set(e, t) {
    !this.get(e) && t !== "" && (this.values[e] = t);
  }
  // Return the value for a key, or a default value.
  // If 'defaultKey' is passed then 'dflt' is assumed to be an object with
  // a number of possible default values as properties where 'defaultKey' is
  // the key of the property that will be chosen; otherwise it's assumed to be
  // a single value.
  get(e, t, s) {
    return s ? this.has(e) ? this.values[e] : t[s] : this.has(e) ? this.values[e] : t;
  }
  // Check whether we have a value for a key.
  has(e) {
    return e in this.values;
  }
  // Accept a setting if its one of the given alternatives.
  alt(e, t, s) {
    for (let i = 0; i < s.length; ++i)
      if (t === s[i]) {
        this.set(e, t);
        break;
      }
  }
  // Accept a setting if its a valid (signed) integer.
  integer(e, t) {
    /^-?\d+$/.test(t) && this.set(e, parseInt(t, 10));
  }
  // Accept a setting if its a valid percentage.
  percent(e, t) {
    if (/^([\d]{1,3})(\.[\d]*)?%$/.test(t)) {
      const s = parseFloat(t);
      if (s >= 0 && s <= 100)
        return this.set(e, s), !0;
    }
    return !1;
  }
}
function zn(a, e, t, s) {
  const i = s ? a.split(s) : [a];
  for (const n in i) {
    if (typeof i[n] != "string")
      continue;
    const r = i[n].split(t);
    if (r.length !== 2)
      continue;
    const o = r[0], l = r[1];
    e(o, l);
  }
}
const Ts = new Us(0, 0, ""), gt = Ts.align === "middle" ? "middle" : "center";
function dl(a, e, t) {
  const s = a;
  function i() {
    const o = Wn(a);
    if (o === null)
      throw new Error("Malformed timestamp: " + s);
    return a = a.replace(/^[^\sa-zA-Z-]+/, ""), o;
  }
  function n(o, l) {
    const c = new ul();
    zn(o, function(d, f) {
      let m;
      switch (d) {
        case "region":
          for (let p = t.length - 1; p >= 0; p--)
            if (t[p].id === f) {
              c.set(d, t[p].region);
              break;
            }
          break;
        case "vertical":
          c.alt(d, f, ["rl", "lr"]);
          break;
        case "line":
          m = f.split(","), c.integer(d, m[0]), c.percent(d, m[0]) && c.set("snapToLines", !1), c.alt(d, m[0], ["auto"]), m.length === 2 && c.alt("lineAlign", m[1], ["start", gt, "end"]);
          break;
        case "position":
          m = f.split(","), c.percent(d, m[0]), m.length === 2 && c.alt("positionAlign", m[1], ["start", gt, "end", "line-left", "line-right", "auto"]);
          break;
        case "size":
          c.percent(d, f);
          break;
        case "align":
          c.alt(d, f, ["start", gt, "end", "left", "right"]);
          break;
      }
    }, /:/, /\s/), l.region = c.get("region", null), l.vertical = c.get("vertical", "");
    let h = c.get("line", "auto");
    h === "auto" && Ts.line === -1 && (h = -1), l.line = h, l.lineAlign = c.get("lineAlign", "start"), l.snapToLines = c.get("snapToLines", !0), l.size = c.get("size", 100), l.align = c.get("align", gt);
    let u = c.get("position", "auto");
    u === "auto" && Ts.position === 50 && (u = l.align === "start" || l.align === "left" ? 0 : l.align === "end" || l.align === "right" ? 100 : 50), l.position = u;
  }
  function r() {
    a = a.replace(/^\s+/, "");
  }
  if (r(), e.startTime = i(), r(), a.slice(0, 3) !== "-->")
    throw new Error("Malformed time stamp (time stamps must be separated by '-->'): " + s);
  a = a.slice(3), r(), e.endTime = i(), r(), n(a, e);
}
function Yn(a) {
  return a.replace(/<br(?: \/)?>/gi, `
`);
}
class fl {
  constructor() {
    this.state = "INITIAL", this.buffer = "", this.decoder = new hl(), this.regionList = [], this.cue = null, this.oncue = void 0, this.onparsingerror = void 0, this.onflush = void 0;
  }
  parse(e) {
    const t = this;
    e && (t.buffer += t.decoder.decode(e, {
      stream: !0
    }));
    function s() {
      let n = t.buffer, r = 0;
      for (n = Yn(n); r < n.length && n[r] !== "\r" && n[r] !== `
`; )
        ++r;
      const o = n.slice(0, r);
      return n[r] === "\r" && ++r, n[r] === `
` && ++r, t.buffer = n.slice(r), o;
    }
    function i(n) {
      zn(n, function(r, o) {
      }, /:/);
    }
    try {
      let n = "";
      if (t.state === "INITIAL") {
        if (!/\r\n|\n/.test(t.buffer))
          return this;
        n = s();
        const o = n.match(/^(ï»¿)?WEBVTT([ \t].*)?$/);
        if (!(o != null && o[0]))
          throw new Error("Malformed WebVTT signature.");
        t.state = "HEADER";
      }
      let r = !1;
      for (; t.buffer; ) {
        if (!/\r\n|\n/.test(t.buffer))
          return this;
        switch (r ? r = !1 : n = s(), t.state) {
          case "HEADER":
            /:/.test(n) ? i(n) : n || (t.state = "ID");
            continue;
          case "NOTE":
            n || (t.state = "ID");
            continue;
          case "ID":
            if (/^NOTE($|[ \t])/.test(n)) {
              t.state = "NOTE";
              break;
            }
            if (!n)
              continue;
            if (t.cue = new Us(0, 0, ""), t.state = "CUE", n.indexOf("-->") === -1) {
              t.cue.id = n;
              continue;
            }
          case "CUE":
            if (!t.cue) {
              t.state = "BADCUE";
              continue;
            }
            try {
              dl(n, t.cue, t.regionList);
            } catch {
              t.cue = null, t.state = "BADCUE";
              continue;
            }
            t.state = "CUETEXT";
            continue;
          case "CUETEXT":
            {
              const o = n.indexOf("-->") !== -1;
              if (!n || o && (r = !0)) {
                t.oncue && t.cue && t.oncue(t.cue), t.cue = null, t.state = "ID";
                continue;
              }
              if (t.cue === null)
                continue;
              t.cue.text && (t.cue.text += `
`), t.cue.text += n;
            }
            continue;
          case "BADCUE":
            n || (t.state = "ID");
        }
      }
    } catch {
      t.state === "CUETEXT" && t.cue && t.oncue && t.oncue(t.cue), t.cue = null, t.state = t.state === "INITIAL" ? "BADWEBVTT" : "BADCUE";
    }
    return this;
  }
  flush() {
    const e = this;
    try {
      if ((e.cue || e.state === "HEADER") && (e.buffer += `

`, e.parse()), e.state === "INITIAL" || e.state === "BADWEBVTT")
        throw new Error("Malformed WebVTT signature.");
    } catch (t) {
      e.onparsingerror && e.onparsingerror(t);
    }
    return e.onflush && e.onflush(), this;
  }
}
const ml = /\r\n|\n\r|\n|\r/g, is = function(e, t, s = 0) {
  return e.slice(s, s + t.length) === t;
}, pl = function(e) {
  let t = parseInt(e.slice(-3));
  const s = parseInt(e.slice(-6, -4)), i = parseInt(e.slice(-9, -7)), n = e.length > 9 ? parseInt(e.substring(0, e.indexOf(":"))) : 0;
  if (!O(t) || !O(s) || !O(i) || !O(n))
    throw Error(`Malformed X-TIMESTAMP-MAP: Local:${e}`);
  return t += 1e3 * s, t += 60 * 1e3 * i, t += 60 * 60 * 1e3 * n, t;
}, ns = function(e) {
  let t = 5381, s = e.length;
  for (; s; )
    t = t * 33 ^ e.charCodeAt(--s);
  return (t >>> 0).toString();
};
function $s(a, e, t) {
  return ns(a.toString()) + ns(e.toString()) + ns(t);
}
const gl = function(e, t, s) {
  let i = e[t], n = e[i.prevCC];
  if (!n || !n.new && i.new) {
    e.ccOffset = e.presentationOffset = i.start, i.new = !1;
    return;
  }
  for (; (r = n) != null && r.new; ) {
    var r;
    e.ccOffset += i.start - n.start, i.new = !1, i = n, n = e[i.prevCC];
  }
  e.presentationOffset = s;
};
function yl(a, e, t, s, i, n, r) {
  const o = new fl(), l = Ie(new Uint8Array(a)).trim().replace(ml, `
`).split(`
`), c = [], h = e ? Fo(e.baseTime, e.timescale) : 0;
  let u = "00:00.000", d = 0, f = 0, m, p = !0;
  o.oncue = function(g) {
    const v = t[s];
    let C = t.ccOffset;
    const E = (d - h) / 9e4;
    if (v != null && v.new && (f !== void 0 ? C = t.ccOffset = v.start : gl(t, s, E)), E) {
      if (!e) {
        m = new Error("Missing initPTS for VTT MPEGTS");
        return;
      }
      C = E - t.presentationOffset;
    }
    const T = g.endTime - g.startTime, x = ye((g.startTime + C - f) * 9e4, i * 9e4) / 9e4;
    g.startTime = Math.max(x, 0), g.endTime = Math.max(x + T, 0);
    const I = g.text.trim();
    g.text = decodeURIComponent(encodeURIComponent(I)), g.id || (g.id = $s(g.startTime, g.endTime, I)), g.endTime > 0 && c.push(g);
  }, o.onparsingerror = function(g) {
    m = g;
  }, o.onflush = function() {
    if (m) {
      r(m);
      return;
    }
    n(c);
  }, l.forEach((g) => {
    if (p)
      if (is(g, "X-TIMESTAMP-MAP=")) {
        p = !1, g.slice(16).split(",").forEach((v) => {
          is(v, "LOCAL:") ? u = v.slice(6) : is(v, "MPEGTS:") && (d = parseInt(v.slice(7)));
        });
        try {
          f = pl(u) / 1e3;
        } catch (v) {
          m = v;
        }
        return;
      } else
        g === "" && (p = !1);
    o.parse(g + `
`);
  }), o.flush();
}
const rs = "stpp.ttml.im1t", Zn = /^(\d{2,}):(\d{2}):(\d{2}):(\d{2})\.?(\d+)?$/, qn = /^(\d*(?:\.\d*)?)(h|m|s|ms|f|t)$/, vl = {
  left: "start",
  center: "center",
  right: "end",
  start: "start",
  end: "end"
};
function Ni(a, e, t, s) {
  const i = W(new Uint8Array(a), ["mdat"]);
  if (i.length === 0) {
    s(new Error("Could not parse IMSC1 mdat"));
    return;
  }
  const n = i.map((o) => Ie(o)), r = Po(e.baseTime, 1, e.timescale);
  try {
    n.forEach((o) => t(Cl(o, r)));
  } catch (o) {
    s(o);
  }
}
function Cl(a, e) {
  const i = new DOMParser().parseFromString(a, "text/xml").getElementsByTagName("tt")[0];
  if (!i)
    throw new Error("Invalid ttml");
  const n = {
    frameRate: 30,
    subFrameRate: 1,
    frameRateMultiplier: 0,
    tickRate: 0
  }, r = Object.keys(n).reduce((u, d) => (u[d] = i.getAttribute(`ttp:${d}`) || n[d], u), {}), o = i.getAttribute("xml:space") !== "preserve", l = Bi(as(i, "styling", "style")), c = Bi(as(i, "layout", "region")), h = as(i, "body", "[begin]");
  return [].map.call(h, (u) => {
    const d = jn(u, o);
    if (!d || !u.hasAttribute("begin"))
      return null;
    const f = ls(u.getAttribute("begin"), r), m = ls(u.getAttribute("dur"), r);
    let p = ls(u.getAttribute("end"), r);
    if (f === null)
      throw Ui(u);
    if (p === null) {
      if (m === null)
        throw Ui(u);
      p = f + m;
    }
    const g = new Us(f - e, p - e, d);
    g.id = $s(g.startTime, g.endTime, g.text);
    const v = c[u.getAttribute("region")], C = l[u.getAttribute("style")], E = Tl(v, C, l), {
      textAlign: T
    } = E;
    if (T) {
      const x = vl[T];
      x && (g.lineAlign = x), g.align = T;
    }
    return ne(g, E), g;
  }).filter((u) => u !== null);
}
function as(a, e, t) {
  const s = a.getElementsByTagName(e)[0];
  return s ? [].slice.call(s.querySelectorAll(t)) : [];
}
function Bi(a) {
  return a.reduce((e, t) => {
    const s = t.getAttribute("xml:id");
    return s && (e[s] = t), e;
  }, {});
}
function jn(a, e) {
  return [].slice.call(a.childNodes).reduce((t, s, i) => {
    var n;
    return s.nodeName === "br" && i ? t + `
` : (n = s.childNodes) != null && n.length ? jn(s, e) : e ? t + s.textContent.trim().replace(/\s+/g, " ") : t + s.textContent;
  }, "");
}
function Tl(a, e, t) {
  const s = "http://www.w3.org/ns/ttml#styling";
  let i = null;
  const n = [
    "displayAlign",
    "textAlign",
    "color",
    "backgroundColor",
    "fontSize",
    "fontFamily"
    // 'fontWeight',
    // 'lineHeight',
    // 'wrapOption',
    // 'fontStyle',
    // 'direction',
    // 'writingMode'
  ], r = a != null && a.hasAttribute("style") ? a.getAttribute("style") : null;
  return r && t.hasOwnProperty(r) && (i = t[r]), n.reduce((o, l) => {
    const c = os(e, s, l) || os(a, s, l) || os(i, s, l);
    return c && (o[l] = c), o;
  }, {});
}
function os(a, e, t) {
  return a && a.hasAttributeNS(e, t) ? a.getAttributeNS(e, t) : null;
}
function Ui(a) {
  return new Error(`Could not parse ttml timestamp ${a}`);
}
function ls(a, e) {
  if (!a)
    return null;
  let t = Wn(a);
  return t === null && (Zn.test(a) ? t = El(a, e) : qn.test(a) && (t = xl(a, e))), t;
}
function El(a, e) {
  const t = Zn.exec(a), s = (t[4] | 0) + (t[5] | 0) / e.subFrameRate;
  return (t[1] | 0) * 3600 + (t[2] | 0) * 60 + (t[3] | 0) + s / e.frameRate;
}
function xl(a, e) {
  const t = qn.exec(a), s = Number(t[1]);
  switch (t[2]) {
    case "h":
      return s * 3600;
    case "m":
      return s * 60;
    case "ms":
      return s * 1e3;
    case "f":
      return s / e.frameRate;
    case "t":
      return s / e.tickRate;
  }
  return s;
}
class Sl {
  constructor(e) {
    this.hls = void 0, this.media = null, this.config = void 0, this.enabled = !0, this.Cues = void 0, this.textTracks = [], this.tracks = [], this.initPTS = [], this.unparsedVttFrags = [], this.captionsTracks = {}, this.nonNativeCaptionsTracks = {}, this.cea608Parser1 = void 0, this.cea608Parser2 = void 0, this.lastCc = -1, this.lastSn = -1, this.lastPartIndex = -1, this.prevCC = -1, this.vttCCs = Vi(), this.captionsProperties = void 0, this.hls = e, this.config = e.config, this.Cues = e.config.cueHandler, this.captionsProperties = {
      textTrack1: {
        label: this.config.captionsTextTrack1Label,
        languageCode: this.config.captionsTextTrack1LanguageCode
      },
      textTrack2: {
        label: this.config.captionsTextTrack2Label,
        languageCode: this.config.captionsTextTrack2LanguageCode
      },
      textTrack3: {
        label: this.config.captionsTextTrack3Label,
        languageCode: this.config.captionsTextTrack3LanguageCode
      },
      textTrack4: {
        label: this.config.captionsTextTrack4Label,
        languageCode: this.config.captionsTextTrack4LanguageCode
      }
    }, e.on(y.MEDIA_ATTACHING, this.onMediaAttaching, this), e.on(y.MEDIA_DETACHING, this.onMediaDetaching, this), e.on(y.MANIFEST_LOADING, this.onManifestLoading, this), e.on(y.MANIFEST_LOADED, this.onManifestLoaded, this), e.on(y.SUBTITLE_TRACKS_UPDATED, this.onSubtitleTracksUpdated, this), e.on(y.FRAG_LOADING, this.onFragLoading, this), e.on(y.FRAG_LOADED, this.onFragLoaded, this), e.on(y.FRAG_PARSING_USERDATA, this.onFragParsingUserdata, this), e.on(y.FRAG_DECRYPTED, this.onFragDecrypted, this), e.on(y.INIT_PTS_FOUND, this.onInitPtsFound, this), e.on(y.SUBTITLE_TRACKS_CLEARED, this.onSubtitleTracksCleared, this), e.on(y.BUFFER_FLUSHING, this.onBufferFlushing, this);
  }
  destroy() {
    const {
      hls: e
    } = this;
    e.off(y.MEDIA_ATTACHING, this.onMediaAttaching, this), e.off(y.MEDIA_DETACHING, this.onMediaDetaching, this), e.off(y.MANIFEST_LOADING, this.onManifestLoading, this), e.off(y.MANIFEST_LOADED, this.onManifestLoaded, this), e.off(y.SUBTITLE_TRACKS_UPDATED, this.onSubtitleTracksUpdated, this), e.off(y.FRAG_LOADING, this.onFragLoading, this), e.off(y.FRAG_LOADED, this.onFragLoaded, this), e.off(y.FRAG_PARSING_USERDATA, this.onFragParsingUserdata, this), e.off(y.FRAG_DECRYPTED, this.onFragDecrypted, this), e.off(y.INIT_PTS_FOUND, this.onInitPtsFound, this), e.off(y.SUBTITLE_TRACKS_CLEARED, this.onSubtitleTracksCleared, this), e.off(y.BUFFER_FLUSHING, this.onBufferFlushing, this), this.hls = this.config = null, this.cea608Parser1 = this.cea608Parser2 = void 0;
  }
  initCea608Parsers() {
    if (this.config.enableCEA708Captions && (!this.cea608Parser1 || !this.cea608Parser2)) {
      const e = new pt(this, "textTrack1"), t = new pt(this, "textTrack2"), s = new pt(this, "textTrack3"), i = new pt(this, "textTrack4");
      this.cea608Parser1 = new Oi(1, e, t), this.cea608Parser2 = new Oi(3, s, i);
    }
  }
  addCues(e, t, s, i, n) {
    let r = !1;
    for (let o = n.length; o--; ) {
      const l = n[o], c = bl(l[0], l[1], t, s);
      if (c >= 0 && (l[0] = Math.min(l[0], t), l[1] = Math.max(l[1], s), r = !0, c / (s - t) > 0.5))
        return;
    }
    if (r || n.push([t, s]), this.config.renderTextTracksNatively) {
      const o = this.captionsTracks[e];
      this.Cues.newCue(o, t, s, i);
    } else {
      const o = this.Cues.newCue(null, t, s, i);
      this.hls.trigger(y.CUES_PARSED, {
        type: "captions",
        cues: o,
        track: e
      });
    }
  }
  // Triggered when an initial PTS is found; used for synchronisation of WebVTT.
  onInitPtsFound(e, {
    frag: t,
    id: s,
    initPTS: i,
    timescale: n
  }) {
    const {
      unparsedVttFrags: r
    } = this;
    s === "main" && (this.initPTS[t.cc] = {
      baseTime: i,
      timescale: n
    }), r.length && (this.unparsedVttFrags = [], r.forEach((o) => {
      this.onFragLoaded(y.FRAG_LOADED, o);
    }));
  }
  getExistingTrack(e, t) {
    const {
      media: s
    } = this;
    if (s)
      for (let i = 0; i < s.textTracks.length; i++) {
        const n = s.textTracks[i];
        if ($i(n, {
          name: e,
          lang: t,
          attrs: {}
        }))
          return n;
      }
    return null;
  }
  createCaptionsTrack(e) {
    this.config.renderTextTracksNatively ? this.createNativeTrack(e) : this.createNonNativeTrack(e);
  }
  createNativeTrack(e) {
    if (this.captionsTracks[e])
      return;
    const {
      captionsProperties: t,
      captionsTracks: s,
      media: i
    } = this, {
      label: n,
      languageCode: r
    } = t[e], o = this.getExistingTrack(n, r);
    if (o)
      s[e] = o, Ye(s[e]), gn(s[e], i);
    else {
      const l = this.createTextTrack("captions", n, r);
      l && (l[e] = !0, s[e] = l);
    }
  }
  createNonNativeTrack(e) {
    if (this.nonNativeCaptionsTracks[e])
      return;
    const t = this.captionsProperties[e];
    if (!t)
      return;
    const s = t.label, i = {
      _id: e,
      label: s,
      kind: "captions",
      default: t.media ? !!t.media.default : !1,
      closedCaptions: t.media
    };
    this.nonNativeCaptionsTracks[e] = i, this.hls.trigger(y.NON_NATIVE_TEXT_TRACKS_FOUND, {
      tracks: [i]
    });
  }
  createTextTrack(e, t, s) {
    const i = this.media;
    if (i)
      return i.addTextTrack(e, t, s);
  }
  onMediaAttaching(e, t) {
    this.media = t.media, this._cleanTracks();
  }
  onMediaDetaching() {
    const {
      captionsTracks: e
    } = this;
    Object.keys(e).forEach((t) => {
      Ye(e[t]), delete e[t];
    }), this.nonNativeCaptionsTracks = {};
  }
  onManifestLoading() {
    this.lastCc = -1, this.lastSn = -1, this.lastPartIndex = -1, this.prevCC = -1, this.vttCCs = Vi(), this._cleanTracks(), this.tracks = [], this.captionsTracks = {}, this.nonNativeCaptionsTracks = {}, this.textTracks = [], this.unparsedVttFrags = [], this.initPTS = [], this.cea608Parser1 && this.cea608Parser2 && (this.cea608Parser1.reset(), this.cea608Parser2.reset());
  }
  _cleanTracks() {
    const {
      media: e
    } = this;
    if (!e)
      return;
    const t = e.textTracks;
    if (t)
      for (let s = 0; s < t.length; s++)
        Ye(t[s]);
  }
  onSubtitleTracksUpdated(e, t) {
    const s = t.subtitleTracks || [], i = s.some((n) => n.textCodec === rs);
    if (this.config.enableWebVTT || i && this.config.enableIMSC1) {
      if (Hn(this.tracks, s)) {
        this.tracks = s;
        return;
      }
      if (this.textTracks = [], this.tracks = s, this.config.renderTextTracksNatively) {
        const r = this.media, o = r ? Ct(r.textTracks) : null;
        if (this.tracks.forEach((l, c) => {
          let h;
          if (o) {
            let u = null;
            for (let d = 0; d < o.length; d++)
              if (o[d] && $i(o[d], l)) {
                u = o[d], o[d] = null;
                break;
              }
            u && (h = u);
          }
          if (h)
            Ye(h);
          else {
            const u = Xn(l);
            h = this.createTextTrack(u, l.name, l.lang), h && (h.mode = "disabled");
          }
          h && this.textTracks.push(h);
        }), o != null && o.length) {
          const l = o.filter((c) => c !== null).map((c) => c.label);
          l.length && S.warn(`Media element contains unused subtitle tracks: ${l.join(", ")}. Replace media element for each source to clear TextTracks and captions menu.`);
        }
      } else if (this.tracks.length) {
        const r = this.tracks.map((o) => ({
          label: o.name,
          kind: o.type.toLowerCase(),
          default: o.default,
          subtitleTrack: o
        }));
        this.hls.trigger(y.NON_NATIVE_TEXT_TRACKS_FOUND, {
          tracks: r
        });
      }
    }
  }
  onManifestLoaded(e, t) {
    this.config.enableCEA708Captions && t.captions && t.captions.forEach((s) => {
      const i = /(?:CC|SERVICE)([1-4])/.exec(s.instreamId);
      if (!i)
        return;
      const n = `textTrack${i[1]}`, r = this.captionsProperties[n];
      r && (r.label = s.name, s.lang && (r.languageCode = s.lang), r.media = s);
    });
  }
  closedCaptionsForLevel(e) {
    const t = this.hls.levels[e.level];
    return t == null ? void 0 : t.attrs["CLOSED-CAPTIONS"];
  }
  onFragLoading(e, t) {
    if (this.enabled && t.frag.type === H.MAIN) {
      var s, i;
      const {
        cea608Parser1: n,
        cea608Parser2: r,
        lastSn: o
      } = this, {
        cc: l,
        sn: c
      } = t.frag, h = (s = (i = t.part) == null ? void 0 : i.index) != null ? s : -1;
      n && r && (c !== o + 1 || c === o && h !== this.lastPartIndex + 1 || l !== this.lastCc) && (n.reset(), r.reset()), this.lastCc = l, this.lastSn = c, this.lastPartIndex = h;
    }
  }
  onFragLoaded(e, t) {
    const {
      frag: s,
      payload: i
    } = t;
    if (s.type === H.SUBTITLE)
      if (i.byteLength) {
        const n = s.decryptdata, r = "stats" in t;
        if (n == null || !n.encrypted || r) {
          const o = this.tracks[s.level], l = this.vttCCs;
          l[s.cc] || (l[s.cc] = {
            start: s.start,
            prevCC: this.prevCC,
            new: !0
          }, this.prevCC = s.cc), o && o.textCodec === rs ? this._parseIMSC1(s, i) : this._parseVTTs(t);
        }
      } else
        this.hls.trigger(y.SUBTITLE_FRAG_PROCESSED, {
          success: !1,
          frag: s,
          error: new Error("Empty subtitle payload")
        });
  }
  _parseIMSC1(e, t) {
    const s = this.hls;
    Ni(t, this.initPTS[e.cc], (i) => {
      this._appendCues(i, e.level), s.trigger(y.SUBTITLE_FRAG_PROCESSED, {
        success: !0,
        frag: e
      });
    }, (i) => {
      S.log(`Failed to parse IMSC1: ${i}`), s.trigger(y.SUBTITLE_FRAG_PROCESSED, {
        success: !1,
        frag: e,
        error: i
      });
    });
  }
  _parseVTTs(e) {
    var t;
    const {
      frag: s,
      payload: i
    } = e, {
      initPTS: n,
      unparsedVttFrags: r
    } = this, o = n.length - 1;
    if (!n[s.cc] && o === -1) {
      r.push(e);
      return;
    }
    const l = this.hls, c = (t = s.initSegment) != null && t.data ? ve(s.initSegment.data, new Uint8Array(i)) : i;
    yl(c, this.initPTS[s.cc], this.vttCCs, s.cc, s.start, (h) => {
      this._appendCues(h, s.level), l.trigger(y.SUBTITLE_FRAG_PROCESSED, {
        success: !0,
        frag: s
      });
    }, (h) => {
      const u = h.message === "Missing initPTS for VTT MPEGTS";
      u ? r.push(e) : this._fallbackToIMSC1(s, i), S.log(`Failed to parse VTT cue: ${h}`), !(u && o > s.cc) && l.trigger(y.SUBTITLE_FRAG_PROCESSED, {
        success: !1,
        frag: s,
        error: h
      });
    });
  }
  _fallbackToIMSC1(e, t) {
    const s = this.tracks[e.level];
    s.textCodec || Ni(t, this.initPTS[e.cc], () => {
      s.textCodec = rs, this._parseIMSC1(e, t);
    }, () => {
      s.textCodec = "wvtt";
    });
  }
  _appendCues(e, t) {
    const s = this.hls;
    if (this.config.renderTextTracksNatively) {
      const i = this.textTracks[t];
      if (!i || i.mode === "disabled")
        return;
      e.forEach((n) => yn(i, n));
    } else {
      const i = this.tracks[t];
      if (!i)
        return;
      const n = i.default ? "default" : "subtitles" + t;
      s.trigger(y.CUES_PARSED, {
        type: "subtitles",
        cues: e,
        track: n
      });
    }
  }
  onFragDecrypted(e, t) {
    const {
      frag: s
    } = t;
    s.type === H.SUBTITLE && this.onFragLoaded(y.FRAG_LOADED, t);
  }
  onSubtitleTracksCleared() {
    this.tracks = [], this.captionsTracks = {};
  }
  onFragParsingUserdata(e, t) {
    this.initCea608Parsers();
    const {
      cea608Parser1: s,
      cea608Parser2: i
    } = this;
    if (!this.enabled || !s || !i)
      return;
    const {
      frag: n,
      samples: r
    } = t;
    if (!(n.type === H.MAIN && this.closedCaptionsForLevel(n) === "NONE"))
      for (let o = 0; o < r.length; o++) {
        const l = r[o].bytes;
        if (l) {
          const c = this.extractCea608Data(l);
          s.addData(r[o].pts, c[0]), i.addData(r[o].pts, c[1]);
        }
      }
  }
  onBufferFlushing(e, {
    startOffset: t,
    endOffset: s,
    endOffsetSubtitles: i,
    type: n
  }) {
    const {
      media: r
    } = this;
    if (!(!r || r.currentTime < s)) {
      if (!n || n === "video") {
        const {
          captionsTracks: o
        } = this;
        Object.keys(o).forEach((l) => fs(o[l], t, s));
      }
      if (this.config.renderTextTracksNatively && t === 0 && i !== void 0) {
        const {
          textTracks: o
        } = this;
        Object.keys(o).forEach((l) => fs(o[l], t, i));
      }
    }
  }
  extractCea608Data(e) {
    const t = [[], []], s = e[0] & 31;
    let i = 2;
    for (let n = 0; n < s; n++) {
      const r = e[i++], o = 127 & e[i++], l = 127 & e[i++];
      if (o === 0 && l === 0)
        continue;
      if ((4 & r) !== 0) {
        const h = 3 & r;
        (h === 0 || h === 1) && (t[h].push(o), t[h].push(l));
      }
    }
    return t;
  }
}
function Xn(a) {
  return a.characteristics && /transcribes-spoken-dialog/gi.test(a.characteristics) && /describes-music-and-sound/gi.test(a.characteristics) ? "captions" : "subtitles";
}
function $i(a, e) {
  return !!a && a.kind === Xn(e) && Cs(e, a);
}
function bl(a, e, t, s) {
  return Math.min(e, s) - Math.max(a, t);
}
function Vi() {
  return {
    ccOffset: 0,
    presentationOffset: 0,
    0: {
      start: 0,
      prevCC: -1,
      new: !0
    }
  };
}
class Vs {
  constructor(e) {
    this.hls = void 0, this.autoLevelCapping = void 0, this.firstLevel = void 0, this.media = void 0, this.restrictedLevels = void 0, this.timer = void 0, this.clientRect = void 0, this.streamController = void 0, this.hls = e, this.autoLevelCapping = Number.POSITIVE_INFINITY, this.firstLevel = -1, this.media = null, this.restrictedLevels = [], this.timer = void 0, this.clientRect = null, this.registerListeners();
  }
  setStreamController(e) {
    this.streamController = e;
  }
  destroy() {
    this.hls && this.unregisterListener(), this.timer && this.stopCapping(), this.media = null, this.clientRect = null, this.hls = this.streamController = null;
  }
  registerListeners() {
    const {
      hls: e
    } = this;
    e.on(y.FPS_DROP_LEVEL_CAPPING, this.onFpsDropLevelCapping, this), e.on(y.MEDIA_ATTACHING, this.onMediaAttaching, this), e.on(y.MANIFEST_PARSED, this.onManifestParsed, this), e.on(y.LEVELS_UPDATED, this.onLevelsUpdated, this), e.on(y.BUFFER_CODECS, this.onBufferCodecs, this), e.on(y.MEDIA_DETACHING, this.onMediaDetaching, this);
  }
  unregisterListener() {
    const {
      hls: e
    } = this;
    e.off(y.FPS_DROP_LEVEL_CAPPING, this.onFpsDropLevelCapping, this), e.off(y.MEDIA_ATTACHING, this.onMediaAttaching, this), e.off(y.MANIFEST_PARSED, this.onManifestParsed, this), e.off(y.LEVELS_UPDATED, this.onLevelsUpdated, this), e.off(y.BUFFER_CODECS, this.onBufferCodecs, this), e.off(y.MEDIA_DETACHING, this.onMediaDetaching, this);
  }
  onFpsDropLevelCapping(e, t) {
    const s = this.hls.levels[t.droppedLevel];
    this.isLevelAllowed(s) && this.restrictedLevels.push({
      bitrate: s.bitrate,
      height: s.height,
      width: s.width
    });
  }
  onMediaAttaching(e, t) {
    this.media = t.media instanceof HTMLVideoElement ? t.media : null, this.clientRect = null, this.timer && this.hls.levels.length && this.detectPlayerSize();
  }
  onManifestParsed(e, t) {
    const s = this.hls;
    this.restrictedLevels = [], this.firstLevel = t.firstLevel, s.config.capLevelToPlayerSize && t.video && this.startCapping();
  }
  onLevelsUpdated(e, t) {
    this.timer && O(this.autoLevelCapping) && this.detectPlayerSize();
  }
  // Only activate capping when playing a video stream; otherwise, multi-bitrate audio-only streams will be restricted
  // to the first level
  onBufferCodecs(e, t) {
    this.hls.config.capLevelToPlayerSize && t.video && this.startCapping();
  }
  onMediaDetaching() {
    this.stopCapping();
  }
  detectPlayerSize() {
    if (this.media) {
      if (this.mediaHeight <= 0 || this.mediaWidth <= 0) {
        this.clientRect = null;
        return;
      }
      const e = this.hls.levels;
      if (e.length) {
        const t = this.hls, s = this.getMaxLevel(e.length - 1);
        s !== this.autoLevelCapping && S.log(`Setting autoLevelCapping to ${s}: ${e[s].height}p@${e[s].bitrate} for media ${this.mediaWidth}x${this.mediaHeight}`), t.autoLevelCapping = s, t.autoLevelCapping > this.autoLevelCapping && this.streamController && this.streamController.nextLevelSwitch(), this.autoLevelCapping = t.autoLevelCapping;
      }
    }
  }
  /*
   * returns level should be the one with the dimensions equal or greater than the media (player) dimensions (so the video will be downscaled)
   */
  getMaxLevel(e) {
    const t = this.hls.levels;
    if (!t.length)
      return -1;
    const s = t.filter((i, n) => this.isLevelAllowed(i) && n <= e);
    return this.clientRect = null, Vs.getMaxLevelByMediaSize(s, this.mediaWidth, this.mediaHeight);
  }
  startCapping() {
    this.timer || (this.autoLevelCapping = Number.POSITIVE_INFINITY, self.clearInterval(this.timer), this.timer = self.setInterval(this.detectPlayerSize.bind(this), 1e3), this.detectPlayerSize());
  }
  stopCapping() {
    this.restrictedLevels = [], this.firstLevel = -1, this.autoLevelCapping = Number.POSITIVE_INFINITY, this.timer && (self.clearInterval(this.timer), this.timer = void 0);
  }
  getDimensions() {
    if (this.clientRect)
      return this.clientRect;
    const e = this.media, t = {
      width: 0,
      height: 0
    };
    if (e) {
      const s = e.getBoundingClientRect();
      t.width = s.width, t.height = s.height, !t.width && !t.height && (t.width = s.right - s.left || e.width || 0, t.height = s.bottom - s.top || e.height || 0);
    }
    return this.clientRect = t, t;
  }
  get mediaWidth() {
    return this.getDimensions().width * this.contentScaleFactor;
  }
  get mediaHeight() {
    return this.getDimensions().height * this.contentScaleFactor;
  }
  get contentScaleFactor() {
    let e = 1;
    if (!this.hls.config.ignoreDevicePixelRatio)
      try {
        e = self.devicePixelRatio;
      } catch {
      }
    return e;
  }
  isLevelAllowed(e) {
    return !this.restrictedLevels.some((s) => e.bitrate === s.bitrate && e.width === s.width && e.height === s.height);
  }
  static getMaxLevelByMediaSize(e, t, s) {
    if (!(e != null && e.length))
      return -1;
    const i = (o, l) => l ? o.width !== l.width || o.height !== l.height : !0;
    let n = e.length - 1;
    const r = Math.max(t, s);
    for (let o = 0; o < e.length; o += 1) {
      const l = e[o];
      if ((l.width >= r || l.height >= r) && i(l, e[o + 1])) {
        n = o;
        break;
      }
    }
    return n;
  }
}
class Ll {
  constructor(e) {
    this.hls = void 0, this.isVideoPlaybackQualityAvailable = !1, this.timer = void 0, this.media = null, this.lastTime = void 0, this.lastDroppedFrames = 0, this.lastDecodedFrames = 0, this.streamController = void 0, this.hls = e, this.registerListeners();
  }
  setStreamController(e) {
    this.streamController = e;
  }
  registerListeners() {
    this.hls.on(y.MEDIA_ATTACHING, this.onMediaAttaching, this);
  }
  unregisterListeners() {
    this.hls.off(y.MEDIA_ATTACHING, this.onMediaAttaching, this);
  }
  destroy() {
    this.timer && clearInterval(this.timer), this.unregisterListeners(), this.isVideoPlaybackQualityAvailable = !1, this.media = null;
  }
  onMediaAttaching(e, t) {
    const s = this.hls.config;
    if (s.capLevelOnFPSDrop) {
      const i = t.media instanceof self.HTMLVideoElement ? t.media : null;
      this.media = i, i && typeof i.getVideoPlaybackQuality == "function" && (this.isVideoPlaybackQualityAvailable = !0), self.clearInterval(this.timer), this.timer = self.setInterval(this.checkFPSInterval.bind(this), s.fpsDroppedMonitoringPeriod);
    }
  }
  checkFPS(e, t, s) {
    const i = performance.now();
    if (t) {
      if (this.lastTime) {
        const n = i - this.lastTime, r = s - this.lastDroppedFrames, o = t - this.lastDecodedFrames, l = 1e3 * r / n, c = this.hls;
        if (c.trigger(y.FPS_DROP, {
          currentDropped: r,
          currentDecoded: o,
          totalDroppedFrames: s
        }), l > 0 && r > c.config.fpsDroppedMonitoringThreshold * o) {
          let h = c.currentLevel;
          S.warn("drop FPS ratio greater than max allowed value for currentLevel: " + h), h > 0 && (c.autoLevelCapping === -1 || c.autoLevelCapping >= h) && (h = h - 1, c.trigger(y.FPS_DROP_LEVEL_CAPPING, {
            level: h,
            droppedLevel: c.currentLevel
          }), c.autoLevelCapping = h, this.streamController.nextLevelSwitch());
        }
      }
      this.lastTime = i, this.lastDroppedFrames = s, this.lastDecodedFrames = t;
    }
  }
  checkFPSInterval() {
    const e = this.media;
    if (e)
      if (this.isVideoPlaybackQualityAvailable) {
        const t = e.getVideoPlaybackQuality();
        this.checkFPS(e, t.totalVideoFrames, t.droppedVideoFrames);
      } else
        this.checkFPS(e, e.webkitDecodedFrameCount, e.webkitDroppedFrameCount);
  }
}
const yt = "[eme]";
class qe {
  constructor(e) {
    this.hls = void 0, this.config = void 0, this.media = null, this.keyFormatPromise = null, this.keySystemAccessPromises = {}, this._requestLicenseFailureCount = 0, this.mediaKeySessions = [], this.keyIdToKeySessionPromise = {}, this.setMediaKeysQueue = qe.CDMCleanupPromise ? [qe.CDMCleanupPromise] : [], this.onMediaEncrypted = this._onMediaEncrypted.bind(this), this.onWaitingForKey = this._onWaitingForKey.bind(this), this.debug = S.debug.bind(S, yt), this.log = S.log.bind(S, yt), this.warn = S.warn.bind(S, yt), this.error = S.error.bind(S, yt), this.hls = e, this.config = e.config, this.registerListeners();
  }
  destroy() {
    this.unregisterListeners(), this.onMediaDetached();
    const e = this.config;
    e.requestMediaKeySystemAccessFunc = null, e.licenseXhrSetup = e.licenseResponseCallback = void 0, e.drmSystems = e.drmSystemOptions = {}, this.hls = this.onMediaEncrypted = this.onWaitingForKey = this.keyIdToKeySessionPromise = null, this.config = null;
  }
  registerListeners() {
    this.hls.on(y.MEDIA_ATTACHED, this.onMediaAttached, this), this.hls.on(y.MEDIA_DETACHED, this.onMediaDetached, this), this.hls.on(y.MANIFEST_LOADING, this.onManifestLoading, this), this.hls.on(y.MANIFEST_LOADED, this.onManifestLoaded, this);
  }
  unregisterListeners() {
    this.hls.off(y.MEDIA_ATTACHED, this.onMediaAttached, this), this.hls.off(y.MEDIA_DETACHED, this.onMediaDetached, this), this.hls.off(y.MANIFEST_LOADING, this.onManifestLoading, this), this.hls.off(y.MANIFEST_LOADED, this.onManifestLoaded, this);
  }
  getLicenseServerUrl(e) {
    const {
      drmSystems: t,
      widevineLicenseUrl: s
    } = this.config, i = t[e];
    if (i)
      return i.licenseUrl;
    if (e === te.WIDEVINE && s)
      return s;
    throw new Error(`no license server URL configured for key-system "${e}"`);
  }
  getServerCertificateUrl(e) {
    const {
      drmSystems: t
    } = this.config, s = t[e];
    if (s)
      return s.serverCertificateUrl;
    this.log(`No Server Certificate in config.drmSystems["${e}"]`);
  }
  attemptKeySystemAccess(e) {
    const t = this.hls.levels, s = (r, o, l) => !!r && l.indexOf(r) === o, i = t.map((r) => r.audioCodec).filter(s), n = t.map((r) => r.videoCodec).filter(s);
    return i.length + n.length === 0 && n.push("avc1.42e01e"), new Promise((r, o) => {
      const l = (c) => {
        const h = c.shift();
        this.getMediaKeysPromise(h, i, n).then((u) => r({
          keySystem: h,
          mediaKeys: u
        })).catch((u) => {
          c.length ? l(c) : u instanceof ge ? o(u) : o(new ge({
            type: K.KEY_SYSTEM_ERROR,
            details: A.KEY_SYSTEM_NO_ACCESS,
            error: u,
            fatal: !0
          }, u.message));
        });
      };
      l(e);
    });
  }
  requestMediaKeySystemAccess(e, t) {
    const {
      requestMediaKeySystemAccessFunc: s
    } = this.config;
    if (typeof s != "function") {
      let i = `Configured requestMediaKeySystemAccess is not a function ${s}`;
      return sn === null && self.location.protocol === "http:" && (i = `navigator.requestMediaKeySystemAccess is not available over insecure protocol ${location.protocol}`), Promise.reject(new Error(i));
    }
    return s(e, t);
  }
  getMediaKeysPromise(e, t, s) {
    const i = Dr(e, t, s, this.config.drmSystemOptions), n = this.keySystemAccessPromises[e];
    let r = n == null ? void 0 : n.keySystemAccess;
    if (!r) {
      this.log(`Requesting encrypted media "${e}" key-system access with config: ${JSON.stringify(i)}`), r = this.requestMediaKeySystemAccess(e, i);
      const o = this.keySystemAccessPromises[e] = {
        keySystemAccess: r
      };
      return r.catch((l) => {
        this.log(`Failed to obtain access to key-system "${e}": ${l}`);
      }), r.then((l) => {
        this.log(`Access for key-system "${l.keySystem}" obtained`);
        const c = this.fetchServerCertificate(e);
        return this.log(`Create media-keys for "${e}"`), o.mediaKeys = l.createMediaKeys().then((h) => (this.log(`Media-keys created for "${e}"`), c.then((u) => u ? this.setMediaKeysServerCertificate(h, e, u) : h))), o.mediaKeys.catch((h) => {
          this.error(`Failed to create media-keys for "${e}"}: ${h}`);
        }), o.mediaKeys;
      });
    }
    return r.then(() => n.mediaKeys);
  }
  createMediaKeySessionContext({
    decryptdata: e,
    keySystem: t,
    mediaKeys: s
  }) {
    this.log(`Creating key-system session "${t}" keyId: ${Se.hexDump(e.keyId || [])}`);
    const i = s.createSession(), n = {
      decryptdata: e,
      keySystem: t,
      mediaKeys: s,
      mediaKeysSession: i,
      keyStatus: "status-pending"
    };
    return this.mediaKeySessions.push(n), n;
  }
  renewKeySession(e) {
    const t = e.decryptdata;
    if (t.pssh) {
      const s = this.createMediaKeySessionContext(e), i = this.getKeyIdString(t), n = "cenc";
      this.keyIdToKeySessionPromise[i] = this.generateRequestWithPreferredKeySession(s, n, t.pssh, "expired");
    } else
      this.warn("Could not renew expired session. Missing pssh initData.");
    this.removeSession(e);
  }
  getKeyIdString(e) {
    if (!e)
      throw new Error("Could not read keyId of undefined decryptdata");
    if (e.keyId === null)
      throw new Error("keyId is null");
    return Se.hexDump(e.keyId);
  }
  updateKeySession(e, t) {
    var s;
    const i = e.mediaKeysSession;
    return this.log(`Updating key-session "${i.sessionId}" for keyID ${Se.hexDump(((s = e.decryptdata) == null ? void 0 : s.keyId) || [])}
      } (data length: ${t && t.byteLength})`), i.update(t);
  }
  selectKeySystemFormat(e) {
    const t = Object.keys(e.levelkeys || {});
    return this.keyFormatPromise || (this.log(`Selecting key-system from fragment (sn: ${e.sn} ${e.type}: ${e.level}) key formats ${t.join(", ")}`), this.keyFormatPromise = this.getKeyFormatPromise(t)), this.keyFormatPromise;
  }
  getKeyFormatPromise(e) {
    return new Promise((t, s) => {
      const i = Kt(this.config), n = e.map(Zs).filter((r) => !!r && i.indexOf(r) !== -1);
      return this.getKeySystemSelectionPromise(n).then(({
        keySystem: r
      }) => {
        const o = qs(r);
        o ? t(o) : s(new Error(`Unable to find format for key-system "${r}"`));
      }).catch(s);
    });
  }
  loadKey(e) {
    const t = e.keyInfo.decryptdata, s = this.getKeyIdString(t), i = `(keyId: ${s} format: "${t.keyFormat}" method: ${t.method} uri: ${t.uri})`;
    this.log(`Starting session for key ${i}`);
    let n = this.keyIdToKeySessionPromise[s];
    return n || (n = this.keyIdToKeySessionPromise[s] = this.getKeySystemForKeyPromise(t).then(({
      keySystem: r,
      mediaKeys: o
    }) => (this.throwIfDestroyed(), this.log(`Handle encrypted media sn: ${e.frag.sn} ${e.frag.type}: ${e.frag.level} using key ${i}`), this.attemptSetMediaKeys(r, o).then(() => {
      this.throwIfDestroyed();
      const l = this.createMediaKeySessionContext({
        keySystem: r,
        mediaKeys: o,
        decryptdata: t
      }), c = "cenc";
      return this.generateRequestWithPreferredKeySession(l, c, t.pssh, "playlist-key");
    }))), n.catch((r) => this.handleError(r))), n;
  }
  throwIfDestroyed(e = "Invalid state") {
    if (!this.hls)
      throw new Error("invalid state");
  }
  handleError(e) {
    this.hls && (this.error(e.message), e instanceof ge ? this.hls.trigger(y.ERROR, e.data) : this.hls.trigger(y.ERROR, {
      type: K.KEY_SYSTEM_ERROR,
      details: A.KEY_SYSTEM_NO_KEYS,
      error: e,
      fatal: !0
    }));
  }
  getKeySystemForKeyPromise(e) {
    const t = this.getKeyIdString(e), s = this.keyIdToKeySessionPromise[t];
    if (!s) {
      const i = Zs(e.keyFormat), n = i ? [i] : Kt(this.config);
      return this.attemptKeySystemAccess(n);
    }
    return s;
  }
  getKeySystemSelectionPromise(e) {
    if (e.length || (e = Kt(this.config)), e.length === 0)
      throw new ge({
        type: K.KEY_SYSTEM_ERROR,
        details: A.KEY_SYSTEM_NO_CONFIGURED_LICENSE,
        fatal: !0
      }, `Missing key-system license configuration options ${JSON.stringify({
        drmSystems: this.config.drmSystems
      })}`);
    return this.attemptKeySystemAccess(e);
  }
  _onMediaEncrypted(e) {
    const {
      initDataType: t,
      initData: s
    } = e;
    if (this.debug(`"${e.type}" event: init data type: "${t}"`), s === null)
      return;
    let i, n;
    if (t === "sinf" && this.config.drmSystems[te.FAIRPLAY]) {
      const h = re(new Uint8Array(s));
      try {
        const u = As(JSON.parse(h).sinf), d = un(new Uint8Array(u));
        if (!d)
          return;
        i = d.subarray(8, 24), n = te.FAIRPLAY;
      } catch {
        this.warn('Failed to parse sinf "encrypted" event message initData');
        return;
      }
    } else {
      const h = sa(s);
      if (h === null)
        return;
      h.version === 0 && h.systemId === tn.WIDEVINE && h.data && (i = h.data.subarray(8, 24)), n = kr(h.systemId);
    }
    if (!n || !i)
      return;
    const r = Se.hexDump(i), {
      keyIdToKeySessionPromise: o,
      mediaKeySessions: l
    } = this;
    let c = o[r];
    for (let h = 0; h < l.length; h++) {
      const u = l[h], d = u.decryptdata;
      if (d.pssh || !d.keyId)
        continue;
      const f = Se.hexDump(d.keyId);
      if (r === f || d.uri.replace(/-/g, "").indexOf(r) !== -1) {
        c = o[f], delete o[f], d.pssh = new Uint8Array(s), d.keyId = i, c = o[r] = c.then(() => this.generateRequestWithPreferredKeySession(u, t, s, "encrypted-event-key-match"));
        break;
      }
    }
    c || (c = o[r] = this.getKeySystemSelectionPromise([n]).then(({
      keySystem: h,
      mediaKeys: u
    }) => {
      var d;
      this.throwIfDestroyed();
      const f = new rt("ISO-23001-7", r, (d = qs(h)) != null ? d : "");
      return f.pssh = new Uint8Array(s), f.keyId = i, this.attemptSetMediaKeys(h, u).then(() => {
        this.throwIfDestroyed();
        const m = this.createMediaKeySessionContext({
          decryptdata: f,
          keySystem: h,
          mediaKeys: u
        });
        return this.generateRequestWithPreferredKeySession(m, t, s, "encrypted-event-no-match");
      });
    })), c.catch((h) => this.handleError(h));
  }
  _onWaitingForKey(e) {
    this.log(`"${e.type}" event`);
  }
  attemptSetMediaKeys(e, t) {
    const s = this.setMediaKeysQueue.slice();
    this.log(`Setting media-keys for "${e}"`);
    const i = Promise.all(s).then(() => {
      if (!this.media)
        throw new Error("Attempted to set mediaKeys without media element attached");
      return this.media.setMediaKeys(t);
    });
    return this.setMediaKeysQueue.push(i), i.then(() => {
      this.log(`Media-keys set for "${e}"`), s.push(i), this.setMediaKeysQueue = this.setMediaKeysQueue.filter((n) => s.indexOf(n) === -1);
    });
  }
  generateRequestWithPreferredKeySession(e, t, s, i) {
    var n, r;
    const o = (n = this.config.drmSystems) == null || (r = n[e.keySystem]) == null ? void 0 : r.generateRequest;
    if (o)
      try {
        const m = o.call(this.hls, t, s, e);
        if (!m)
          throw new Error("Invalid response from configured generateRequest filter");
        t = m.initDataType, s = e.decryptdata.pssh = m.initData ? new Uint8Array(m.initData) : null;
      } catch (m) {
        var l;
        if (this.warn(m.message), (l = this.hls) != null && l.config.debug)
          throw m;
      }
    if (s === null)
      return this.log(`Skipping key-session request for "${i}" (no initData)`), Promise.resolve(e);
    const c = this.getKeyIdString(e.decryptdata);
    this.log(`Generating key-session request for "${i}": ${c} (init data type: ${t} length: ${s ? s.byteLength : null})`);
    const h = new Bs(), u = e._onmessage = (m) => {
      const p = e.mediaKeysSession;
      if (!p) {
        h.emit("error", new Error("invalid state"));
        return;
      }
      const {
        messageType: g,
        message: v
      } = m;
      this.log(`"${g}" message event for session "${p.sessionId}" message size: ${v.byteLength}`), g === "license-request" || g === "license-renewal" ? this.renewLicense(e, v).catch((C) => {
        this.handleError(C), h.emit("error", C);
      }) : g === "license-release" ? e.keySystem === te.FAIRPLAY && (this.updateKeySession(e, us("acknowledged")), this.removeSession(e)) : this.warn(`unhandled media key message type "${g}"`);
    }, d = e._onkeystatuseschange = (m) => {
      if (!e.mediaKeysSession) {
        h.emit("error", new Error("invalid state"));
        return;
      }
      this.onKeyStatusChange(e);
      const g = e.keyStatus;
      h.emit("keyStatus", g), g === "expired" && (this.warn(`${e.keySystem} expired for key ${c}`), this.renewKeySession(e));
    };
    e.mediaKeysSession.addEventListener("message", u), e.mediaKeysSession.addEventListener("keystatuseschange", d);
    const f = new Promise((m, p) => {
      h.on("error", p), h.on("keyStatus", (g) => {
        g.startsWith("usable") ? m() : g === "output-restricted" ? p(new ge({
          type: K.KEY_SYSTEM_ERROR,
          details: A.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED,
          fatal: !1
        }, "HDCP level output restricted")) : g === "internal-error" ? p(new ge({
          type: K.KEY_SYSTEM_ERROR,
          details: A.KEY_SYSTEM_STATUS_INTERNAL_ERROR,
          fatal: !0
        }, `key status changed to "${g}"`)) : g === "expired" ? p(new Error("key expired while generating request")) : this.warn(`unhandled key status change "${g}"`);
      });
    });
    return e.mediaKeysSession.generateRequest(t, s).then(() => {
      var m;
      this.log(`Request generated for key-session "${(m = e.mediaKeysSession) == null ? void 0 : m.sessionId}" keyId: ${c}`);
    }).catch((m) => {
      throw new ge({
        type: K.KEY_SYSTEM_ERROR,
        details: A.KEY_SYSTEM_NO_SESSION,
        error: m,
        fatal: !1
      }, `Error generating key-session request: ${m}`);
    }).then(() => f).catch((m) => {
      throw h.removeAllListeners(), this.removeSession(e), m;
    }).then(() => (h.removeAllListeners(), e));
  }
  onKeyStatusChange(e) {
    e.mediaKeysSession.keyStatuses.forEach((t, s) => {
      this.log(`key status change "${t}" for keyStatuses keyId: ${Se.hexDump("buffer" in s ? new Uint8Array(s.buffer, s.byteOffset, s.byteLength) : new Uint8Array(s))} session keyId: ${Se.hexDump(new Uint8Array(e.decryptdata.keyId || []))} uri: ${e.decryptdata.uri}`), e.keyStatus = t;
    });
  }
  fetchServerCertificate(e) {
    const t = this.config, s = t.loader, i = new s(t), n = this.getServerCertificateUrl(e);
    return n ? (this.log(`Fetching server certificate for "${e}"`), new Promise((r, o) => {
      const l = {
        responseType: "arraybuffer",
        url: n
      }, c = t.certLoadPolicy.default, h = {
        loadPolicy: c,
        timeout: c.maxLoadTimeMs,
        maxRetry: 0,
        retryDelay: 0,
        maxRetryDelay: 0
      }, u = {
        onSuccess: (d, f, m, p) => {
          r(d.data);
        },
        onError: (d, f, m, p) => {
          o(new ge({
            type: K.KEY_SYSTEM_ERROR,
            details: A.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED,
            fatal: !0,
            networkDetails: m,
            response: ce({
              url: l.url,
              data: void 0
            }, d)
          }, `"${e}" certificate request failed (${n}). Status: ${d.code} (${d.text})`));
        },
        onTimeout: (d, f, m) => {
          o(new ge({
            type: K.KEY_SYSTEM_ERROR,
            details: A.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED,
            fatal: !0,
            networkDetails: m,
            response: {
              url: l.url,
              data: void 0
            }
          }, `"${e}" certificate request timed out (${n})`));
        },
        onAbort: (d, f, m) => {
          o(new Error("aborted"));
        }
      };
      i.load(l, h, u);
    })) : Promise.resolve();
  }
  setMediaKeysServerCertificate(e, t, s) {
    return new Promise((i, n) => {
      e.setServerCertificate(s).then((r) => {
        this.log(`setServerCertificate ${r ? "success" : "not supported by CDM"} (${s == null ? void 0 : s.byteLength}) on "${t}"`), i(e);
      }).catch((r) => {
        n(new ge({
          type: K.KEY_SYSTEM_ERROR,
          details: A.KEY_SYSTEM_SERVER_CERTIFICATE_UPDATE_FAILED,
          error: r,
          fatal: !0
        }, r.message));
      });
    });
  }
  renewLicense(e, t) {
    return this.requestLicense(e, new Uint8Array(t)).then((s) => this.updateKeySession(e, new Uint8Array(s)).catch((i) => {
      throw new ge({
        type: K.KEY_SYSTEM_ERROR,
        details: A.KEY_SYSTEM_SESSION_UPDATE_FAILED,
        error: i,
        fatal: !0
      }, i.message);
    }));
  }
  unpackPlayReadyKeyMessage(e, t) {
    const s = String.fromCharCode.apply(null, new Uint16Array(t.buffer));
    if (!s.includes("PlayReadyKeyMessage"))
      return e.setRequestHeader("Content-Type", "text/xml; charset=utf-8"), t;
    const i = new DOMParser().parseFromString(s, "application/xml"), n = i.querySelectorAll("HttpHeader");
    if (n.length > 0) {
      let h;
      for (let u = 0, d = n.length; u < d; u++) {
        var r, o;
        h = n[u];
        const f = (r = h.querySelector("name")) == null ? void 0 : r.textContent, m = (o = h.querySelector("value")) == null ? void 0 : o.textContent;
        f && m && e.setRequestHeader(f, m);
      }
    }
    const l = i.querySelector("Challenge"), c = l == null ? void 0 : l.textContent;
    if (!c)
      throw new Error("Cannot find <Challenge> in key message");
    return us(atob(c));
  }
  setupLicenseXHR(e, t, s, i) {
    const n = this.config.licenseXhrSetup;
    return n ? Promise.resolve().then(() => {
      if (!s.decryptdata)
        throw new Error("Key removed");
      return n.call(this.hls, e, t, s, i);
    }).catch((r) => {
      if (!s.decryptdata)
        throw r;
      return e.open("POST", t, !0), n.call(this.hls, e, t, s, i);
    }).then((r) => (e.readyState || e.open("POST", t, !0), {
      xhr: e,
      licenseChallenge: r || i
    })) : (e.open("POST", t, !0), Promise.resolve({
      xhr: e,
      licenseChallenge: i
    }));
  }
  requestLicense(e, t) {
    const s = this.config.keyLoadPolicy.default;
    return new Promise((i, n) => {
      const r = this.getLicenseServerUrl(e.keySystem);
      this.log(`Sending license request to URL: ${r}`);
      const o = new XMLHttpRequest();
      o.responseType = "arraybuffer", o.onreadystatechange = () => {
        if (!this.hls || !e.mediaKeysSession)
          return n(new Error("invalid state"));
        if (o.readyState === 4)
          if (o.status === 200) {
            this._requestLicenseFailureCount = 0;
            let l = o.response;
            this.log(`License received ${l instanceof ArrayBuffer ? l.byteLength : l}`);
            const c = this.config.licenseResponseCallback;
            if (c)
              try {
                l = c.call(this.hls, o, r, e);
              } catch (h) {
                this.error(h);
              }
            i(l);
          } else {
            const l = s.errorRetry, c = l ? l.maxNumRetry : 0;
            if (this._requestLicenseFailureCount++, this._requestLicenseFailureCount > c || o.status >= 400 && o.status < 500)
              n(new ge({
                type: K.KEY_SYSTEM_ERROR,
                details: A.KEY_SYSTEM_LICENSE_REQUEST_FAILED,
                fatal: !0,
                networkDetails: o,
                response: {
                  url: r,
                  data: void 0,
                  code: o.status,
                  text: o.statusText
                }
              }, `License Request XHR failed (${r}). Status: ${o.status} (${o.statusText})`));
            else {
              const h = c - this._requestLicenseFailureCount + 1;
              this.warn(`Retrying license request, ${h} attempts left`), this.requestLicense(e, t).then(i, n);
            }
          }
      }, e.licenseXhr && e.licenseXhr.readyState !== XMLHttpRequest.DONE && e.licenseXhr.abort(), e.licenseXhr = o, this.setupLicenseXHR(o, r, e, t).then(({
        xhr: l,
        licenseChallenge: c
      }) => {
        e.keySystem == te.PLAYREADY && (c = this.unpackPlayReadyKeyMessage(l, c)), l.send(c);
      });
    });
  }
  onMediaAttached(e, t) {
    if (!this.config.emeEnabled)
      return;
    const s = t.media;
    this.media = s, s.addEventListener("encrypted", this.onMediaEncrypted), s.addEventListener("waitingforkey", this.onWaitingForKey);
  }
  onMediaDetached() {
    const e = this.media, t = this.mediaKeySessions;
    e && (e.removeEventListener("encrypted", this.onMediaEncrypted), e.removeEventListener("waitingforkey", this.onWaitingForKey), this.media = null), this._requestLicenseFailureCount = 0, this.setMediaKeysQueue = [], this.mediaKeySessions = [], this.keyIdToKeySessionPromise = {}, rt.clearKeyUriToKeyIdMap();
    const s = t.length;
    qe.CDMCleanupPromise = Promise.all(t.map((i) => this.removeSession(i)).concat(e == null ? void 0 : e.setMediaKeys(null).catch((i) => {
      this.log(`Could not clear media keys: ${i}`);
    }))).then(() => {
      s && (this.log("finished closing key sessions and clearing media keys"), t.length = 0);
    }).catch((i) => {
      this.log(`Could not close sessions and clear media keys: ${i}`);
    });
  }
  onManifestLoading() {
    this.keyFormatPromise = null;
  }
  onManifestLoaded(e, {
    sessionKeys: t
  }) {
    if (!(!t || !this.config.emeEnabled) && !this.keyFormatPromise) {
      const s = t.reduce((i, n) => (i.indexOf(n.keyFormat) === -1 && i.push(n.keyFormat), i), []);
      this.log(`Selecting key-system from session-keys ${s.join(", ")}`), this.keyFormatPromise = this.getKeyFormatPromise(s);
    }
  }
  removeSession(e) {
    const {
      mediaKeysSession: t,
      licenseXhr: s
    } = e;
    if (t) {
      this.log(`Remove licenses and keys and close session ${t.sessionId}`), e._onmessage && (t.removeEventListener("message", e._onmessage), e._onmessage = void 0), e._onkeystatuseschange && (t.removeEventListener("keystatuseschange", e._onkeystatuseschange), e._onkeystatuseschange = void 0), s && s.readyState !== XMLHttpRequest.DONE && s.abort(), e.mediaKeysSession = e.decryptdata = e.licenseXhr = void 0;
      const i = this.mediaKeySessions.indexOf(e);
      return i > -1 && this.mediaKeySessions.splice(i, 1), t.remove().catch((n) => {
        this.log(`Could not remove session: ${n}`);
      }).then(() => t.close()).catch((n) => {
        this.log(`Could not close session: ${n}`);
      });
    }
  }
}
qe.CDMCleanupPromise = void 0;
class ge extends Error {
  constructor(e, t) {
    super(t), this.data = void 0, e.error || (e.error = new Error(t)), this.data = e, e.err = e.error;
  }
}
var de;
(function(a) {
  a.MANIFEST = "m", a.AUDIO = "a", a.VIDEO = "v", a.MUXED = "av", a.INIT = "i", a.CAPTION = "c", a.TIMED_TEXT = "tt", a.KEY = "k", a.OTHER = "o";
})(de || (de = {}));
var Es;
(function(a) {
  a.DASH = "d", a.HLS = "h", a.SMOOTH = "s", a.OTHER = "o";
})(Es || (Es = {}));
var Ue;
(function(a) {
  a.OBJECT = "CMCD-Object", a.REQUEST = "CMCD-Request", a.SESSION = "CMCD-Session", a.STATUS = "CMCD-Status";
})(Ue || (Ue = {}));
const Al = {
  [Ue.OBJECT]: ["br", "d", "ot", "tb"],
  [Ue.REQUEST]: ["bl", "dl", "mtp", "nor", "nrr", "su"],
  [Ue.SESSION]: ["cid", "pr", "sf", "sid", "st", "v"],
  [Ue.STATUS]: ["bs", "rtp"]
};
class Je {
  constructor(e, t) {
    this.value = void 0, this.params = void 0, Array.isArray(e) && (e = e.map((s) => s instanceof Je ? s : new Je(s))), this.value = e, this.params = t;
  }
}
class Qn {
  constructor(e) {
    this.description = void 0, this.description = e;
  }
}
const wl = "Dict";
function Il(a) {
  return Array.isArray(a) ? JSON.stringify(a) : a instanceof Map ? "Map{}" : a instanceof Set ? "Set{}" : typeof a == "object" ? JSON.stringify(a) : String(a);
}
function Rl(a, e, t, s) {
  return new Error(`failed to ${a} "${Il(e)}" as ${t}`, {
    cause: s
  });
}
const Hi = "Bare Item", kl = "Boolean", Dl = "Byte Sequence", Ml = "Decimal", Pl = "Integer";
function Fl(a) {
  return a < -999999999999999 || 999999999999999 < a;
}
const _l = /[\x00-\x1f\x7f]+/, Ol = "Token", Nl = "Key";
function Re(a, e, t) {
  return Rl("serialize", a, e, t);
}
function Bl(a) {
  if (typeof a != "boolean")
    throw Re(a, kl);
  return a ? "?1" : "?0";
}
function Ul(a) {
  return btoa(String.fromCharCode(...a));
}
function $l(a) {
  if (ArrayBuffer.isView(a) === !1)
    throw Re(a, Dl);
  return `:${Ul(a)}:`;
}
function Jn(a) {
  if (Fl(a))
    throw Re(a, Pl);
  return a.toString();
}
function Vl(a) {
  return `@${Jn(a.getTime() / 1e3)}`;
}
function er(a, e) {
  if (a < 0)
    return -er(-a, e);
  const t = Math.pow(10, e);
  if (Math.abs(a * t % 1 - 0.5) < Number.EPSILON) {
    const i = Math.floor(a * t);
    return (i % 2 === 0 ? i : i + 1) / t;
  } else
    return Math.round(a * t) / t;
}
function Hl(a) {
  const e = er(a, 3);
  if (Math.floor(Math.abs(e)).toString().length > 12)
    throw Re(a, Ml);
  const t = e.toString();
  return t.includes(".") ? t : `${t}.0`;
}
const Gl = "String";
function Kl(a) {
  if (_l.test(a))
    throw Re(a, Gl);
  return `"${a.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}
function Wl(a) {
  return a.description || a.toString().slice(7, -1);
}
function Gi(a) {
  const e = Wl(a);
  if (/^([a-zA-Z*])([!#$%&'*+\-.^_`|~\w:/]*)$/.test(e) === !1)
    throw Re(e, Ol);
  return e;
}
function xs(a) {
  switch (typeof a) {
    case "number":
      if (!O(a))
        throw Re(a, Hi);
      return Number.isInteger(a) ? Jn(a) : Hl(a);
    case "string":
      return Kl(a);
    case "symbol":
      return Gi(a);
    case "boolean":
      return Bl(a);
    case "object":
      if (a instanceof Date)
        return Vl(a);
      if (a instanceof Uint8Array)
        return $l(a);
      if (a instanceof Qn)
        return Gi(a);
    default:
      throw Re(a, Hi);
  }
}
function Ss(a) {
  if (/^[a-z*][a-z0-9\-_.*]*$/.test(a) === !1)
    throw Re(a, Nl);
  return a;
}
function Hs(a) {
  return a == null ? "" : Object.entries(a).map(([e, t]) => t === !0 ? `;${Ss(e)}` : `;${Ss(e)}=${xs(t)}`).join("");
}
function tr(a) {
  return a instanceof Je ? `${xs(a.value)}${Hs(a.params)}` : xs(a);
}
function zl(a) {
  return `(${a.value.map(tr).join(" ")})${Hs(a.params)}`;
}
function Yl(a, e = {
  whitespace: !0
}) {
  if (typeof a != "object")
    throw Re(a, wl);
  const t = a instanceof Map ? a.entries() : Object.entries(a), s = e != null && e.whitespace ? " " : "";
  return Array.from(t).map(([i, n]) => {
    n instanceof Je || (n = new Je(n));
    let r = Ss(i);
    return n.value === !0 ? r += Hs(n.params) : (r += "=", Array.isArray(n.value) ? r += zl(n) : r += tr(n)), r;
  }).join(`,${s}`);
}
function Zl(a, e) {
  return Yl(a, e);
}
const ql = (a) => a === "ot" || a === "sf" || a === "st", jl = (a) => typeof a == "number" ? O(a) : a != null && a !== "" && a !== !1;
function Xl(a, e) {
  const t = new URL(a), s = new URL(e);
  if (t.origin !== s.origin)
    return a;
  const i = t.pathname.split("/").slice(1), n = s.pathname.split("/").slice(1, -1);
  for (; i[0] === n[0]; )
    i.shift(), n.shift();
  for (; n.length; )
    n.shift(), i.unshift("..");
  return i.join("/");
}
function Ql() {
  try {
    return crypto.randomUUID();
  } catch {
    try {
      const e = URL.createObjectURL(new Blob()), t = e.toString();
      return URL.revokeObjectURL(e), t.slice(t.lastIndexOf("/") + 1);
    } catch {
      let t = (/* @__PURE__ */ new Date()).getTime();
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (i) => {
        const n = (t + Math.random() * 16) % 16 | 0;
        return t = Math.floor(t / 16), (i == "x" ? n : n & 3 | 8).toString(16);
      });
    }
  }
}
const Lt = (a) => Math.round(a), Jl = (a, e) => (e != null && e.baseUrl && (a = Xl(a, e.baseUrl)), encodeURIComponent(a)), vt = (a) => Lt(a / 100) * 100, ec = {
  /**
   * Bitrate (kbps) rounded integer
   */
  br: Lt,
  /**
   * Duration (milliseconds) rounded integer
   */
  d: Lt,
  /**
   * Buffer Length (milliseconds) rounded nearest 100ms
   */
  bl: vt,
  /**
   * Deadline (milliseconds) rounded nearest 100ms
   */
  dl: vt,
  /**
   * Measured Throughput (kbps) rounded nearest 100kbps
   */
  mtp: vt,
  /**
   * Next Object Request URL encoded
   */
  nor: Jl,
  /**
   * Requested maximum throughput (kbps) rounded nearest 100kbps
   */
  rtp: vt,
  /**
   * Top Bitrate (kbps) rounded integer
   */
  tb: Lt
};
function tc(a, e) {
  const t = {};
  if (a == null || typeof a != "object")
    return t;
  const s = Object.keys(a).sort(), i = ne({}, ec, e == null ? void 0 : e.formatters), n = e == null ? void 0 : e.filter;
  return s.forEach((r) => {
    if (n != null && n(r))
      return;
    let o = a[r];
    const l = i[r];
    l && (o = l(o, e)), !(r === "v" && o === 1) && (r == "pr" && o === 1 || jl(o) && (ql(r) && typeof o == "string" && (o = new Qn(o)), t[r] = o));
  }), t;
}
function sr(a, e = {}) {
  return a ? Zl(tc(a, e), ne({
    whitespace: !1
  }, e)) : "";
}
function sc(a, e = {}) {
  if (!a)
    return {};
  const t = Object.entries(a), s = Object.entries(Al).concat(Object.entries((e == null ? void 0 : e.customHeaderMap) || {})), i = t.reduce((n, r) => {
    var o, l;
    const [c, h] = r, u = ((o = s.find((d) => d[1].includes(c))) == null ? void 0 : o[0]) || Ue.REQUEST;
    return (l = n[u]) != null || (n[u] = {}), n[u][c] = h, n;
  }, {});
  return Object.entries(i).reduce((n, [r, o]) => (n[r] = sr(o, e), n), {});
}
function ic(a, e, t) {
  return ne(a, sc(e, t));
}
const nc = "CMCD";
function rc(a, e = {}) {
  if (!a)
    return "";
  const t = sr(a, e);
  return `${nc}=${encodeURIComponent(t)}`;
}
const Ki = /CMCD=[^&#]+/;
function ac(a, e, t) {
  const s = rc(e, t);
  if (!s)
    return a;
  if (Ki.test(a))
    return a.replace(Ki, s);
  const i = a.includes("?") ? "&" : "?";
  return `${a}${i}${s}`;
}
class oc {
  // eslint-disable-line no-restricted-globals
  constructor(e) {
    this.hls = void 0, this.config = void 0, this.media = void 0, this.sid = void 0, this.cid = void 0, this.useHeaders = !1, this.includeKeys = void 0, this.initialized = !1, this.starved = !1, this.buffering = !0, this.audioBuffer = void 0, this.videoBuffer = void 0, this.onWaiting = () => {
      this.initialized && (this.starved = !0), this.buffering = !0;
    }, this.onPlaying = () => {
      this.initialized || (this.initialized = !0), this.buffering = !1;
    }, this.applyPlaylistData = (i) => {
      try {
        this.apply(i, {
          ot: de.MANIFEST,
          su: !this.initialized
        });
      } catch (n) {
        S.warn("Could not generate manifest CMCD data.", n);
      }
    }, this.applyFragmentData = (i) => {
      try {
        const n = i.frag, r = this.hls.levels[n.level], o = this.getObjectType(n), l = {
          d: n.duration * 1e3,
          ot: o
        };
        (o === de.VIDEO || o === de.AUDIO || o == de.MUXED) && (l.br = r.bitrate / 1e3, l.tb = this.getTopBandwidth(o) / 1e3, l.bl = this.getBufferLength(o)), this.apply(i, l);
      } catch (n) {
        S.warn("Could not generate segment CMCD data.", n);
      }
    }, this.hls = e;
    const t = this.config = e.config, {
      cmcd: s
    } = t;
    s != null && (t.pLoader = this.createPlaylistLoader(), t.fLoader = this.createFragmentLoader(), this.sid = s.sessionId || Ql(), this.cid = s.contentId, this.useHeaders = s.useHeaders === !0, this.includeKeys = s.includeKeys, this.registerListeners());
  }
  registerListeners() {
    const e = this.hls;
    e.on(y.MEDIA_ATTACHED, this.onMediaAttached, this), e.on(y.MEDIA_DETACHED, this.onMediaDetached, this), e.on(y.BUFFER_CREATED, this.onBufferCreated, this);
  }
  unregisterListeners() {
    const e = this.hls;
    e.off(y.MEDIA_ATTACHED, this.onMediaAttached, this), e.off(y.MEDIA_DETACHED, this.onMediaDetached, this), e.off(y.BUFFER_CREATED, this.onBufferCreated, this);
  }
  destroy() {
    this.unregisterListeners(), this.onMediaDetached(), this.hls = this.config = this.audioBuffer = this.videoBuffer = null, this.onWaiting = this.onPlaying = null;
  }
  onMediaAttached(e, t) {
    this.media = t.media, this.media.addEventListener("waiting", this.onWaiting), this.media.addEventListener("playing", this.onPlaying);
  }
  onMediaDetached() {
    this.media && (this.media.removeEventListener("waiting", this.onWaiting), this.media.removeEventListener("playing", this.onPlaying), this.media = null);
  }
  onBufferCreated(e, t) {
    var s, i;
    this.audioBuffer = (s = t.tracks.audio) == null ? void 0 : s.buffer, this.videoBuffer = (i = t.tracks.video) == null ? void 0 : i.buffer;
  }
  /**
   * Create baseline CMCD data
   */
  createData() {
    var e;
    return {
      v: 1,
      sf: Es.HLS,
      sid: this.sid,
      cid: this.cid,
      pr: (e = this.media) == null ? void 0 : e.playbackRate,
      mtp: this.hls.bandwidthEstimate / 1e3
    };
  }
  /**
   * Apply CMCD data to a request.
   */
  apply(e, t = {}) {
    ne(t, this.createData());
    const s = t.ot === de.INIT || t.ot === de.VIDEO || t.ot === de.MUXED;
    this.starved && s && (t.bs = !0, t.su = !0, this.starved = !1), t.su == null && (t.su = this.buffering);
    const {
      includeKeys: i
    } = this;
    i && (t = Object.keys(t).reduce((n, r) => (i.includes(r) && (n[r] = t[r]), n), {})), this.useHeaders ? (e.headers || (e.headers = {}), ic(e.headers, t)) : e.url = ac(e.url, t);
  }
  /**
   * The CMCD object type.
   */
  getObjectType(e) {
    const {
      type: t
    } = e;
    if (t === "subtitle")
      return de.TIMED_TEXT;
    if (e.sn === "initSegment")
      return de.INIT;
    if (t === "audio")
      return de.AUDIO;
    if (t === "main")
      return this.hls.audioTracks.length ? de.VIDEO : de.MUXED;
  }
  /**
   * Get the highest bitrate.
   */
  getTopBandwidth(e) {
    let t = 0, s;
    const i = this.hls;
    if (e === de.AUDIO)
      s = i.audioTracks;
    else {
      const n = i.maxAutoLevel, r = n > -1 ? n + 1 : i.levels.length;
      s = i.levels.slice(0, r);
    }
    for (const n of s)
      n.bitrate > t && (t = n.bitrate);
    return t > 0 ? t : NaN;
  }
  /**
   * Get the buffer length for a media type in milliseconds
   */
  getBufferLength(e) {
    const t = this.hls.media, s = e === de.AUDIO ? this.audioBuffer : this.videoBuffer;
    return !s || !t ? NaN : ee.bufferInfo(s, t.currentTime, this.config.maxBufferHole).len * 1e3;
  }
  /**
   * Create a playlist loader
   */
  createPlaylistLoader() {
    const {
      pLoader: e
    } = this.config, t = this.applyPlaylistData, s = e || this.config.loader;
    return class {
      constructor(n) {
        this.loader = void 0, this.loader = new s(n);
      }
      get stats() {
        return this.loader.stats;
      }
      get context() {
        return this.loader.context;
      }
      destroy() {
        this.loader.destroy();
      }
      abort() {
        this.loader.abort();
      }
      load(n, r, o) {
        t(n), this.loader.load(n, r, o);
      }
    };
  }
  /**
   * Create a playlist loader
   */
  createFragmentLoader() {
    const {
      fLoader: e
    } = this.config, t = this.applyFragmentData, s = e || this.config.loader;
    return class {
      constructor(n) {
        this.loader = void 0, this.loader = new s(n);
      }
      get stats() {
        return this.loader.stats;
      }
      get context() {
        return this.loader.context;
      }
      destroy() {
        this.loader.destroy();
      }
      abort() {
        this.loader.abort();
      }
      load(n, r, o) {
        t(n), this.loader.load(n, r, o);
      }
    };
  }
}
const lc = 3e5;
class cc {
  constructor(e) {
    this.hls = void 0, this.log = void 0, this.loader = null, this.uri = null, this.pathwayId = ".", this.pathwayPriority = null, this.timeToLoad = 300, this.reloadTimer = -1, this.updated = 0, this.started = !1, this.enabled = !0, this.levels = null, this.audioTracks = null, this.subtitleTracks = null, this.penalizedPathways = {}, this.hls = e, this.log = S.log.bind(S, "[content-steering]:"), this.registerListeners();
  }
  registerListeners() {
    const e = this.hls;
    e.on(y.MANIFEST_LOADING, this.onManifestLoading, this), e.on(y.MANIFEST_LOADED, this.onManifestLoaded, this), e.on(y.MANIFEST_PARSED, this.onManifestParsed, this), e.on(y.ERROR, this.onError, this);
  }
  unregisterListeners() {
    const e = this.hls;
    e && (e.off(y.MANIFEST_LOADING, this.onManifestLoading, this), e.off(y.MANIFEST_LOADED, this.onManifestLoaded, this), e.off(y.MANIFEST_PARSED, this.onManifestParsed, this), e.off(y.ERROR, this.onError, this));
  }
  startLoad() {
    if (this.started = !0, this.clearTimeout(), this.enabled && this.uri) {
      if (this.updated) {
        const e = this.timeToLoad * 1e3 - (performance.now() - this.updated);
        if (e > 0) {
          this.scheduleRefresh(this.uri, e);
          return;
        }
      }
      this.loadSteeringManifest(this.uri);
    }
  }
  stopLoad() {
    this.started = !1, this.loader && (this.loader.destroy(), this.loader = null), this.clearTimeout();
  }
  clearTimeout() {
    this.reloadTimer !== -1 && (self.clearTimeout(this.reloadTimer), this.reloadTimer = -1);
  }
  destroy() {
    this.unregisterListeners(), this.stopLoad(), this.hls = null, this.levels = this.audioTracks = this.subtitleTracks = null;
  }
  removeLevel(e) {
    const t = this.levels;
    t && (this.levels = t.filter((s) => s !== e));
  }
  onManifestLoading() {
    this.stopLoad(), this.enabled = !0, this.timeToLoad = 300, this.updated = 0, this.uri = null, this.pathwayId = ".", this.levels = this.audioTracks = this.subtitleTracks = null;
  }
  onManifestLoaded(e, t) {
    const {
      contentSteering: s
    } = t;
    s !== null && (this.pathwayId = s.pathwayId, this.uri = s.uri, this.started && this.startLoad());
  }
  onManifestParsed(e, t) {
    this.audioTracks = t.audioTracks, this.subtitleTracks = t.subtitleTracks;
  }
  onError(e, t) {
    const {
      errorAction: s
    } = t;
    if ((s == null ? void 0 : s.action) === ue.SendAlternateToPenaltyBox && s.flags === Ce.MoveAllAlternatesMatchingHost) {
      const i = this.levels;
      let n = this.pathwayPriority, r = this.pathwayId;
      if (t.context) {
        const {
          groupId: o,
          pathwayId: l,
          type: c
        } = t.context;
        o && i ? r = this.getPathwayForGroupId(o, c, r) : l && (r = l);
      }
      r in this.penalizedPathways || (this.penalizedPathways[r] = performance.now()), !n && i && (n = i.reduce((o, l) => (o.indexOf(l.pathwayId) === -1 && o.push(l.pathwayId), o), [])), n && n.length > 1 && (this.updatePathwayPriority(n), s.resolved = this.pathwayId !== r), s.resolved || S.warn(`Could not resolve ${t.details} ("${t.error.message}") with content-steering for Pathway: ${r} levels: ${i && i.length} priorities: ${JSON.stringify(n)} penalized: ${JSON.stringify(this.penalizedPathways)}`);
    }
  }
  filterParsedLevels(e) {
    this.levels = e;
    let t = this.getLevelsForPathway(this.pathwayId);
    if (t.length === 0) {
      const s = e[0].pathwayId;
      this.log(`No levels found in Pathway ${this.pathwayId}. Setting initial Pathway to "${s}"`), t = this.getLevelsForPathway(s), this.pathwayId = s;
    }
    return t.length !== e.length ? (this.log(`Found ${t.length}/${e.length} levels in Pathway "${this.pathwayId}"`), t) : e;
  }
  getLevelsForPathway(e) {
    return this.levels === null ? [] : this.levels.filter((t) => e === t.pathwayId);
  }
  updatePathwayPriority(e) {
    this.pathwayPriority = e;
    let t;
    const s = this.penalizedPathways, i = performance.now();
    Object.keys(s).forEach((n) => {
      i - s[n] > lc && delete s[n];
    });
    for (let n = 0; n < e.length; n++) {
      const r = e[n];
      if (r in s)
        continue;
      if (r === this.pathwayId)
        return;
      const o = this.hls.nextLoadLevel, l = this.hls.levels[o];
      if (t = this.getLevelsForPathway(r), t.length > 0) {
        this.log(`Setting Pathway to "${r}"`), this.pathwayId = r, En(t), this.hls.trigger(y.LEVELS_UPDATED, {
          levels: t
        });
        const c = this.hls.levels[o];
        l && c && this.levels && (c.attrs["STABLE-VARIANT-ID"] !== l.attrs["STABLE-VARIANT-ID"] && c.bitrate !== l.bitrate && this.log(`Unstable Pathways change from bitrate ${l.bitrate} to ${c.bitrate}`), this.hls.nextLoadLevel = o);
        break;
      }
    }
  }
  getPathwayForGroupId(e, t, s) {
    const i = this.getLevelsForPathway(s).concat(this.levels || []);
    for (let n = 0; n < i.length; n++)
      if (t === Y.AUDIO_TRACK && i[n].hasAudioGroup(e) || t === Y.SUBTITLE_TRACK && i[n].hasSubtitleGroup(e))
        return i[n].pathwayId;
    return s;
  }
  clonePathways(e) {
    const t = this.levels;
    if (!t)
      return;
    const s = {}, i = {};
    e.forEach((n) => {
      const {
        ID: r,
        "BASE-ID": o,
        "URI-REPLACEMENT": l
      } = n;
      if (t.some((h) => h.pathwayId === r))
        return;
      const c = this.getLevelsForPathway(o).map((h) => {
        const u = new se(h.attrs);
        u["PATHWAY-ID"] = r;
        const d = u.AUDIO && `${u.AUDIO}_clone_${r}`, f = u.SUBTITLES && `${u.SUBTITLES}_clone_${r}`;
        d && (s[u.AUDIO] = d, u.AUDIO = d), f && (i[u.SUBTITLES] = f, u.SUBTITLES = f);
        const m = ir(h.uri, u["STABLE-VARIANT-ID"], "PER-VARIANT-URIS", l), p = new Xe({
          attrs: u,
          audioCodec: h.audioCodec,
          bitrate: h.bitrate,
          height: h.height,
          name: h.name,
          url: m,
          videoCodec: h.videoCodec,
          width: h.width
        });
        if (h.audioGroups)
          for (let g = 1; g < h.audioGroups.length; g++)
            p.addGroupId("audio", `${h.audioGroups[g]}_clone_${r}`);
        if (h.subtitleGroups)
          for (let g = 1; g < h.subtitleGroups.length; g++)
            p.addGroupId("text", `${h.subtitleGroups[g]}_clone_${r}`);
        return p;
      });
      t.push(...c), Wi(this.audioTracks, s, l, r), Wi(this.subtitleTracks, i, l, r);
    });
  }
  loadSteeringManifest(e) {
    const t = this.hls.config, s = t.loader;
    this.loader && this.loader.destroy(), this.loader = new s(t);
    let i;
    try {
      i = new self.URL(e);
    } catch {
      this.enabled = !1, this.log(`Failed to parse Steering Manifest URI: ${e}`);
      return;
    }
    if (i.protocol !== "data:") {
      const h = (this.hls.bandwidthEstimate || t.abrEwmaDefaultEstimate) | 0;
      i.searchParams.set("_HLS_pathway", this.pathwayId), i.searchParams.set("_HLS_throughput", "" + h);
    }
    const n = {
      responseType: "json",
      url: i.href
    }, r = t.steeringManifestLoadPolicy.default, o = r.errorRetry || r.timeoutRetry || {}, l = {
      loadPolicy: r,
      timeout: r.maxLoadTimeMs,
      maxRetry: o.maxNumRetry || 0,
      retryDelay: o.retryDelayMs || 0,
      maxRetryDelay: o.maxRetryDelayMs || 0
    }, c = {
      onSuccess: (h, u, d, f) => {
        this.log(`Loaded steering manifest: "${i}"`);
        const m = h.data;
        if (m.VERSION !== 1) {
          this.log(`Steering VERSION ${m.VERSION} not supported!`);
          return;
        }
        this.updated = performance.now(), this.timeToLoad = m.TTL;
        const {
          "RELOAD-URI": p,
          "PATHWAY-CLONES": g,
          "PATHWAY-PRIORITY": v
        } = m;
        if (p)
          try {
            this.uri = new self.URL(p, i).href;
          } catch {
            this.enabled = !1, this.log(`Failed to parse Steering Manifest RELOAD-URI: ${p}`);
            return;
          }
        this.scheduleRefresh(this.uri || d.url), g && this.clonePathways(g);
        const C = {
          steeringManifest: m,
          url: i.toString()
        };
        this.hls.trigger(y.STEERING_MANIFEST_LOADED, C), v && this.updatePathwayPriority(v);
      },
      onError: (h, u, d, f) => {
        if (this.log(`Error loading steering manifest: ${h.code} ${h.text} (${u.url})`), this.stopLoad(), h.code === 410) {
          this.enabled = !1, this.log(`Steering manifest ${u.url} no longer available`);
          return;
        }
        let m = this.timeToLoad * 1e3;
        if (h.code === 429) {
          const p = this.loader;
          if (typeof (p == null ? void 0 : p.getResponseHeader) == "function") {
            const g = p.getResponseHeader("Retry-After");
            g && (m = parseFloat(g) * 1e3);
          }
          this.log(`Steering manifest ${u.url} rate limited`);
          return;
        }
        this.scheduleRefresh(this.uri || u.url, m);
      },
      onTimeout: (h, u, d) => {
        this.log(`Timeout loading steering manifest (${u.url})`), this.scheduleRefresh(this.uri || u.url);
      }
    };
    this.log(`Requesting steering manifest: ${i}`), this.loader.load(n, l, c);
  }
  scheduleRefresh(e, t = this.timeToLoad * 1e3) {
    this.clearTimeout(), this.reloadTimer = self.setTimeout(() => {
      var s;
      const i = (s = this.hls) == null ? void 0 : s.media;
      if (i && !i.ended) {
        this.loadSteeringManifest(e);
        return;
      }
      this.scheduleRefresh(e, this.timeToLoad * 1e3);
    }, t);
  }
}
function Wi(a, e, t, s) {
  a && Object.keys(e).forEach((i) => {
    const n = a.filter((r) => r.groupId === i).map((r) => {
      const o = ne({}, r);
      return o.details = void 0, o.attrs = new se(o.attrs), o.url = o.attrs.URI = ir(r.url, r.attrs["STABLE-RENDITION-ID"], "PER-RENDITION-URIS", t), o.groupId = o.attrs["GROUP-ID"] = e[i], o.attrs["PATHWAY-ID"] = s, o;
    });
    a.push(...n);
  });
}
function ir(a, e, t, s) {
  const {
    HOST: i,
    PARAMS: n,
    [t]: r
  } = s;
  let o;
  e && (o = r == null ? void 0 : r[e], o && (a = o));
  const l = new self.URL(a);
  return i && !o && (l.host = i), n && Object.keys(n).sort().forEach((c) => {
    c && l.searchParams.set(c, n[c]);
  }), l.href;
}
const hc = /^age:\s*[\d.]+\s*$/im;
class nr {
  constructor(e) {
    this.xhrSetup = void 0, this.requestTimeout = void 0, this.retryTimeout = void 0, this.retryDelay = void 0, this.config = null, this.callbacks = null, this.context = null, this.loader = null, this.stats = void 0, this.xhrSetup = e && e.xhrSetup || null, this.stats = new $t(), this.retryDelay = 0;
  }
  destroy() {
    this.callbacks = null, this.abortInternal(), this.loader = null, this.config = null, this.context = null, this.xhrSetup = null;
  }
  abortInternal() {
    const e = this.loader;
    self.clearTimeout(this.requestTimeout), self.clearTimeout(this.retryTimeout), e && (e.onreadystatechange = null, e.onprogress = null, e.readyState !== 4 && (this.stats.aborted = !0, e.abort()));
  }
  abort() {
    var e;
    this.abortInternal(), (e = this.callbacks) != null && e.onAbort && this.callbacks.onAbort(this.stats, this.context, this.loader);
  }
  load(e, t, s) {
    if (this.stats.loading.start)
      throw new Error("Loader can only be used once.");
    this.stats.loading.start = self.performance.now(), this.context = e, this.config = t, this.callbacks = s, this.loadInternal();
  }
  loadInternal() {
    const {
      config: e,
      context: t
    } = this;
    if (!e || !t)
      return;
    const s = this.loader = new self.XMLHttpRequest(), i = this.stats;
    i.loading.first = 0, i.loaded = 0, i.aborted = !1;
    const n = this.xhrSetup;
    n ? Promise.resolve().then(() => {
      if (!(this.loader !== s || this.stats.aborted))
        return n(s, t.url);
    }).catch((r) => {
      if (!(this.loader !== s || this.stats.aborted))
        return s.open("GET", t.url, !0), n(s, t.url);
    }).then(() => {
      this.loader !== s || this.stats.aborted || this.openAndSendXhr(s, t, e);
    }).catch((r) => {
      this.callbacks.onError({
        code: s.status,
        text: r.message
      }, t, s, i);
    }) : this.openAndSendXhr(s, t, e);
  }
  openAndSendXhr(e, t, s) {
    e.readyState || e.open("GET", t.url, !0);
    const i = t.headers, {
      maxTimeToFirstByteMs: n,
      maxLoadTimeMs: r
    } = s.loadPolicy;
    if (i)
      for (const o in i)
        e.setRequestHeader(o, i[o]);
    t.rangeEnd && e.setRequestHeader("Range", "bytes=" + t.rangeStart + "-" + (t.rangeEnd - 1)), e.onreadystatechange = this.readystatechange.bind(this), e.onprogress = this.loadprogress.bind(this), e.responseType = t.responseType, self.clearTimeout(this.requestTimeout), s.timeout = n && O(n) ? n : r, this.requestTimeout = self.setTimeout(this.loadtimeout.bind(this), s.timeout), e.send();
  }
  readystatechange() {
    const {
      context: e,
      loader: t,
      stats: s
    } = this;
    if (!e || !t)
      return;
    const i = t.readyState, n = this.config;
    if (!s.aborted && i >= 2 && (s.loading.first === 0 && (s.loading.first = Math.max(self.performance.now(), s.loading.start), n.timeout !== n.loadPolicy.maxLoadTimeMs && (self.clearTimeout(this.requestTimeout), n.timeout = n.loadPolicy.maxLoadTimeMs, this.requestTimeout = self.setTimeout(this.loadtimeout.bind(this), n.loadPolicy.maxLoadTimeMs - (s.loading.first - s.loading.start)))), i === 4)) {
      self.clearTimeout(this.requestTimeout), t.onreadystatechange = null, t.onprogress = null;
      const r = t.status, o = t.responseType !== "text";
      if (r >= 200 && r < 300 && (o && t.response || t.responseText !== null)) {
        s.loading.end = Math.max(self.performance.now(), s.loading.first);
        const l = o ? t.response : t.responseText, c = t.responseType === "arraybuffer" ? l.byteLength : l.length;
        if (s.loaded = s.total = c, s.bwEstimate = s.total * 8e3 / (s.loading.end - s.loading.first), !this.callbacks)
          return;
        const h = this.callbacks.onProgress;
        if (h && h(s, e, l, t), !this.callbacks)
          return;
        const u = {
          url: t.responseURL,
          data: l,
          code: r
        };
        this.callbacks.onSuccess(u, s, e, t);
      } else {
        const l = n.loadPolicy.errorRetry, c = s.retry, h = {
          url: e.url,
          data: void 0,
          code: r
        };
        Pt(l, c, !1, h) ? this.retry(l) : (S.error(`${r} while loading ${e.url}`), this.callbacks.onError({
          code: r,
          text: t.statusText
        }, e, t, s));
      }
    }
  }
  loadtimeout() {
    if (!this.config)
      return;
    const e = this.config.loadPolicy.timeoutRetry, t = this.stats.retry;
    if (Pt(e, t, !0))
      this.retry(e);
    else {
      var s;
      S.warn(`timeout while loading ${(s = this.context) == null ? void 0 : s.url}`);
      const i = this.callbacks;
      i && (this.abortInternal(), i.onTimeout(this.stats, this.context, this.loader));
    }
  }
  retry(e) {
    const {
      context: t,
      stats: s
    } = this;
    this.retryDelay = Rs(e, s.retry), s.retry++, S.warn(`${status ? "HTTP Status " + status : "Timeout"} while loading ${t == null ? void 0 : t.url}, retrying ${s.retry}/${e.maxNumRetry} in ${this.retryDelay}ms`), this.abortInternal(), this.loader = null, self.clearTimeout(this.retryTimeout), this.retryTimeout = self.setTimeout(this.loadInternal.bind(this), this.retryDelay);
  }
  loadprogress(e) {
    const t = this.stats;
    t.loaded = e.loaded, e.lengthComputable && (t.total = e.total);
  }
  getCacheAge() {
    let e = null;
    if (this.loader && hc.test(this.loader.getAllResponseHeaders())) {
      const t = this.loader.getResponseHeader("age");
      e = t ? parseFloat(t) : null;
    }
    return e;
  }
  getResponseHeader(e) {
    return this.loader && new RegExp(`^${e}:\\s*[\\d.]+\\s*$`, "im").test(this.loader.getAllResponseHeaders()) ? this.loader.getResponseHeader(e) : null;
  }
}
function uc() {
  if (
    // @ts-ignore
    self.fetch && self.AbortController && self.ReadableStream && self.Request
  )
    try {
      return new self.ReadableStream({}), !0;
    } catch {
    }
  return !1;
}
const dc = /(\d+)-(\d+)\/(\d+)/;
class zi {
  constructor(e) {
    this.fetchSetup = void 0, this.requestTimeout = void 0, this.request = null, this.response = null, this.controller = void 0, this.context = null, this.config = null, this.callbacks = null, this.stats = void 0, this.loader = null, this.fetchSetup = e.fetchSetup || gc, this.controller = new self.AbortController(), this.stats = new $t();
  }
  destroy() {
    this.loader = this.callbacks = this.context = this.config = this.request = null, this.abortInternal(), this.response = null, this.fetchSetup = this.controller = this.stats = null;
  }
  abortInternal() {
    this.controller && !this.stats.loading.end && (this.stats.aborted = !0, this.controller.abort());
  }
  abort() {
    var e;
    this.abortInternal(), (e = this.callbacks) != null && e.onAbort && this.callbacks.onAbort(this.stats, this.context, this.response);
  }
  load(e, t, s) {
    const i = this.stats;
    if (i.loading.start)
      throw new Error("Loader can only be used once.");
    i.loading.start = self.performance.now();
    const n = fc(e, this.controller.signal), r = s.onProgress, o = e.responseType === "arraybuffer", l = o ? "byteLength" : "length", {
      maxTimeToFirstByteMs: c,
      maxLoadTimeMs: h
    } = t.loadPolicy;
    this.context = e, this.config = t, this.callbacks = s, this.request = this.fetchSetup(e, n), self.clearTimeout(this.requestTimeout), t.timeout = c && O(c) ? c : h, this.requestTimeout = self.setTimeout(() => {
      this.abortInternal(), s.onTimeout(i, e, this.response);
    }, t.timeout), self.fetch(this.request).then((u) => {
      this.response = this.loader = u;
      const d = Math.max(self.performance.now(), i.loading.start);
      if (self.clearTimeout(this.requestTimeout), t.timeout = h, this.requestTimeout = self.setTimeout(() => {
        this.abortInternal(), s.onTimeout(i, e, this.response);
      }, h - (d - i.loading.start)), !u.ok) {
        const {
          status: f,
          statusText: m
        } = u;
        throw new yc(m || "fetch, bad network response", f, u);
      }
      return i.loading.first = d, i.total = pc(u.headers) || i.total, r && O(t.highWaterMark) ? this.loadProgressively(u, i, e, t.highWaterMark, r) : o ? u.arrayBuffer() : e.responseType === "json" ? u.json() : u.text();
    }).then((u) => {
      const d = this.response;
      if (!d)
        throw new Error("loader destroyed");
      self.clearTimeout(this.requestTimeout), i.loading.end = Math.max(self.performance.now(), i.loading.first);
      const f = u[l];
      f && (i.loaded = i.total = f);
      const m = {
        url: d.url,
        data: u,
        code: d.status
      };
      r && !O(t.highWaterMark) && r(i, e, u, d), s.onSuccess(m, i, e, d);
    }).catch((u) => {
      if (self.clearTimeout(this.requestTimeout), i.aborted)
        return;
      const d = u && u.code || 0, f = u ? u.message : null;
      s.onError({
        code: d,
        text: f
      }, e, u ? u.details : null, i);
    });
  }
  getCacheAge() {
    let e = null;
    if (this.response) {
      const t = this.response.headers.get("age");
      e = t ? parseFloat(t) : null;
    }
    return e;
  }
  getResponseHeader(e) {
    return this.response ? this.response.headers.get(e) : null;
  }
  loadProgressively(e, t, s, i = 0, n) {
    const r = new Ln(), o = e.body.getReader(), l = () => o.read().then((c) => {
      if (c.done)
        return r.dataLength && n(t, s, r.flush(), e), Promise.resolve(new ArrayBuffer(0));
      const h = c.value, u = h.length;
      return t.loaded += u, u < i || r.dataLength ? (r.push(h), r.dataLength >= i && n(t, s, r.flush(), e)) : n(t, s, h, e), l();
    }).catch(() => Promise.reject());
    return l();
  }
}
function fc(a, e) {
  const t = {
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
    signal: e,
    headers: new self.Headers(ne({}, a.headers))
  };
  return a.rangeEnd && t.headers.set("Range", "bytes=" + a.rangeStart + "-" + String(a.rangeEnd - 1)), t;
}
function mc(a) {
  const e = dc.exec(a);
  if (e)
    return parseInt(e[2]) - parseInt(e[1]) + 1;
}
function pc(a) {
  const e = a.get("Content-Range");
  if (e) {
    const s = mc(e);
    if (O(s))
      return s;
  }
  const t = a.get("Content-Length");
  if (t)
    return parseInt(t);
}
function gc(a, e) {
  return new self.Request(a.url, e);
}
class yc extends Error {
  constructor(e, t, s) {
    super(e), this.code = void 0, this.details = void 0, this.code = t, this.details = s;
  }
}
const vc = /\s/, Cc = {
  newCue(a, e, t, s) {
    const i = [];
    let n, r, o, l, c;
    const h = self.VTTCue || self.TextTrackCue;
    for (let d = 0; d < s.rows.length; d++)
      if (n = s.rows[d], o = !0, l = 0, c = "", !n.isEmpty()) {
        var u;
        for (let p = 0; p < n.chars.length; p++)
          vc.test(n.chars[p].uchar) && o ? l++ : (c += n.chars[p].uchar, o = !1);
        n.cueStartTime = e, e === t && (t += 1e-4), l >= 16 ? l-- : l++;
        const f = Yn(c.trim()), m = $s(e, t, f);
        a != null && (u = a.cues) != null && u.getCueById(m) || (r = new h(e, t, f), r.id = m, r.line = d + 1, r.align = "left", r.position = 10 + Math.min(80, Math.floor(l * 8 / 32) * 10), i.push(r));
      }
    return a && i.length && (i.sort((d, f) => d.line === "auto" || f.line === "auto" ? 0 : d.line > 8 && f.line > 8 ? f.line - d.line : d.line - f.line), i.forEach((d) => yn(a, d))), i;
  }
}, Tc = {
  maxTimeToFirstByteMs: 8e3,
  maxLoadTimeMs: 2e4,
  timeoutRetry: null,
  errorRetry: null
}, rr = ce(ce({
  autoStartLoad: !0,
  // used by stream-controller
  startPosition: -1,
  // used by stream-controller
  defaultAudioCodec: void 0,
  // used by stream-controller
  debug: !1,
  // used by logger
  capLevelOnFPSDrop: !1,
  // used by fps-controller
  capLevelToPlayerSize: !1,
  // used by cap-level-controller
  ignoreDevicePixelRatio: !1,
  // used by cap-level-controller
  preferManagedMediaSource: !0,
  initialLiveManifestSize: 1,
  // used by stream-controller
  maxBufferLength: 30,
  // used by stream-controller
  backBufferLength: 1 / 0,
  // used by buffer-controller
  frontBufferFlushThreshold: 1 / 0,
  maxBufferSize: 60 * 1e3 * 1e3,
  // used by stream-controller
  maxBufferHole: 0.1,
  // used by stream-controller
  highBufferWatchdogPeriod: 2,
  // used by stream-controller
  nudgeOffset: 0.1,
  // used by stream-controller
  nudgeMaxRetry: 3,
  // used by stream-controller
  maxFragLookUpTolerance: 0.25,
  // used by stream-controller
  liveSyncDurationCount: 3,
  // used by latency-controller
  liveMaxLatencyDurationCount: 1 / 0,
  // used by latency-controller
  liveSyncDuration: void 0,
  // used by latency-controller
  liveMaxLatencyDuration: void 0,
  // used by latency-controller
  maxLiveSyncPlaybackRate: 1,
  // used by latency-controller
  liveDurationInfinity: !1,
  // used by buffer-controller
  /**
   * @deprecated use backBufferLength
   */
  liveBackBufferLength: null,
  // used by buffer-controller
  maxMaxBufferLength: 600,
  // used by stream-controller
  enableWorker: !0,
  // used by transmuxer
  workerPath: null,
  // used by transmuxer
  enableSoftwareAES: !0,
  // used by decrypter
  startLevel: void 0,
  // used by level-controller
  startFragPrefetch: !1,
  // used by stream-controller
  fpsDroppedMonitoringPeriod: 5e3,
  // used by fps-controller
  fpsDroppedMonitoringThreshold: 0.2,
  // used by fps-controller
  appendErrorMaxRetry: 3,
  // used by buffer-controller
  loader: nr,
  // loader: FetchLoader,
  fLoader: void 0,
  // used by fragment-loader
  pLoader: void 0,
  // used by playlist-loader
  xhrSetup: void 0,
  // used by xhr-loader
  licenseXhrSetup: void 0,
  // used by eme-controller
  licenseResponseCallback: void 0,
  // used by eme-controller
  abrController: za,
  bufferController: Xo,
  capLevelController: Vs,
  errorController: Fa,
  fpsController: Ll,
  stretchShortVideoTrack: !1,
  // used by mp4-remuxer
  maxAudioFramesDrift: 1,
  // used by mp4-remuxer
  forceKeyFrameOnDiscontinuity: !0,
  // used by ts-demuxer
  abrEwmaFastLive: 3,
  // used by abr-controller
  abrEwmaSlowLive: 9,
  // used by abr-controller
  abrEwmaFastVoD: 3,
  // used by abr-controller
  abrEwmaSlowVoD: 9,
  // used by abr-controller
  abrEwmaDefaultEstimate: 5e5,
  // 500 kbps  // used by abr-controller
  abrEwmaDefaultEstimateMax: 5e6,
  // 5 mbps
  abrBandWidthFactor: 0.95,
  // used by abr-controller
  abrBandWidthUpFactor: 0.7,
  // used by abr-controller
  abrMaxWithRealBitrate: !1,
  // used by abr-controller
  maxStarvationDelay: 4,
  // used by abr-controller
  maxLoadingDelay: 4,
  // used by abr-controller
  minAutoBitrate: 0,
  // used by hls
  emeEnabled: !1,
  // used by eme-controller
  widevineLicenseUrl: void 0,
  // used by eme-controller
  drmSystems: {},
  // used by eme-controller
  drmSystemOptions: {},
  // used by eme-controller
  requestMediaKeySystemAccessFunc: sn,
  // used by eme-controller
  testBandwidth: !0,
  progressive: !1,
  lowLatencyMode: !0,
  cmcd: void 0,
  enableDateRangeMetadataCues: !0,
  enableEmsgMetadataCues: !0,
  enableID3MetadataCues: !0,
  useMediaCapabilities: !0,
  certLoadPolicy: {
    default: Tc
  },
  keyLoadPolicy: {
    default: {
      maxTimeToFirstByteMs: 8e3,
      maxLoadTimeMs: 2e4,
      timeoutRetry: {
        maxNumRetry: 1,
        retryDelayMs: 1e3,
        maxRetryDelayMs: 2e4,
        backoff: "linear"
      },
      errorRetry: {
        maxNumRetry: 8,
        retryDelayMs: 1e3,
        maxRetryDelayMs: 2e4,
        backoff: "linear"
      }
    }
  },
  manifestLoadPolicy: {
    default: {
      maxTimeToFirstByteMs: 1 / 0,
      maxLoadTimeMs: 2e4,
      timeoutRetry: {
        maxNumRetry: 2,
        retryDelayMs: 0,
        maxRetryDelayMs: 0
      },
      errorRetry: {
        maxNumRetry: 1,
        retryDelayMs: 1e3,
        maxRetryDelayMs: 8e3
      }
    }
  },
  playlistLoadPolicy: {
    default: {
      maxTimeToFirstByteMs: 1e4,
      maxLoadTimeMs: 2e4,
      timeoutRetry: {
        maxNumRetry: 2,
        retryDelayMs: 0,
        maxRetryDelayMs: 0
      },
      errorRetry: {
        maxNumRetry: 2,
        retryDelayMs: 1e3,
        maxRetryDelayMs: 8e3
      }
    }
  },
  fragLoadPolicy: {
    default: {
      maxTimeToFirstByteMs: 1e4,
      maxLoadTimeMs: 12e4,
      timeoutRetry: {
        maxNumRetry: 4,
        retryDelayMs: 0,
        maxRetryDelayMs: 0
      },
      errorRetry: {
        maxNumRetry: 6,
        retryDelayMs: 1e3,
        maxRetryDelayMs: 8e3
      }
    }
  },
  steeringManifestLoadPolicy: {
    default: {
      maxTimeToFirstByteMs: 1e4,
      maxLoadTimeMs: 2e4,
      timeoutRetry: {
        maxNumRetry: 2,
        retryDelayMs: 0,
        maxRetryDelayMs: 0
      },
      errorRetry: {
        maxNumRetry: 1,
        retryDelayMs: 1e3,
        maxRetryDelayMs: 8e3
      }
    }
  },
  // These default settings are deprecated in favor of the above policies
  // and are maintained for backwards compatibility
  manifestLoadingTimeOut: 1e4,
  manifestLoadingMaxRetry: 1,
  manifestLoadingRetryDelay: 1e3,
  manifestLoadingMaxRetryTimeout: 64e3,
  levelLoadingTimeOut: 1e4,
  levelLoadingMaxRetry: 4,
  levelLoadingRetryDelay: 1e3,
  levelLoadingMaxRetryTimeout: 64e3,
  fragLoadingTimeOut: 2e4,
  fragLoadingMaxRetry: 6,
  fragLoadingRetryDelay: 1e3,
  fragLoadingMaxRetryTimeout: 64e3
}, Ec()), {}, {
  subtitleStreamController: Yo,
  subtitleTrackController: qo,
  timelineController: Sl,
  audioStreamController: Wo,
  audioTrackController: zo,
  emeController: qe,
  cmcdController: oc,
  contentSteeringController: cc
});
function Ec() {
  return {
    cueHandler: Cc,
    // used by timeline-controller
    enableWebVTT: !0,
    // used by timeline-controller
    enableIMSC1: !0,
    // used by timeline-controller
    enableCEA708Captions: !0,
    // used by timeline-controller
    captionsTextTrack1Label: "English",
    // used by timeline-controller
    captionsTextTrack1LanguageCode: "en",
    // used by timeline-controller
    captionsTextTrack2Label: "Spanish",
    // used by timeline-controller
    captionsTextTrack2LanguageCode: "es",
    // used by timeline-controller
    captionsTextTrack3Label: "Unknown CC",
    // used by timeline-controller
    captionsTextTrack3LanguageCode: "",
    // used by timeline-controller
    captionsTextTrack4Label: "Unknown CC",
    // used by timeline-controller
    captionsTextTrack4LanguageCode: "",
    // used by timeline-controller
    renderTextTracksNatively: !0
  };
}
function xc(a, e) {
  if ((e.liveSyncDurationCount || e.liveMaxLatencyDurationCount) && (e.liveSyncDuration || e.liveMaxLatencyDuration))
    throw new Error("Illegal hls.js config: don't mix up liveSyncDurationCount/liveMaxLatencyDurationCount and liveSyncDuration/liveMaxLatencyDuration");
  if (e.liveMaxLatencyDurationCount !== void 0 && (e.liveSyncDurationCount === void 0 || e.liveMaxLatencyDurationCount <= e.liveSyncDurationCount))
    throw new Error('Illegal hls.js config: "liveMaxLatencyDurationCount" must be greater than "liveSyncDurationCount"');
  if (e.liveMaxLatencyDuration !== void 0 && (e.liveSyncDuration === void 0 || e.liveMaxLatencyDuration <= e.liveSyncDuration))
    throw new Error('Illegal hls.js config: "liveMaxLatencyDuration" must be greater than "liveSyncDuration"');
  const t = bs(a), s = ["manifest", "level", "frag"], i = ["TimeOut", "MaxRetry", "RetryDelay", "MaxRetryTimeout"];
  return s.forEach((n) => {
    const r = `${n === "level" ? "playlist" : n}LoadPolicy`, o = e[r] === void 0, l = [];
    i.forEach((c) => {
      const h = `${n}Loading${c}`, u = e[h];
      if (u !== void 0 && o) {
        l.push(h);
        const d = t[r].default;
        switch (e[r] = {
          default: d
        }, c) {
          case "TimeOut":
            d.maxLoadTimeMs = u, d.maxTimeToFirstByteMs = u;
            break;
          case "MaxRetry":
            d.errorRetry.maxNumRetry = u, d.timeoutRetry.maxNumRetry = u;
            break;
          case "RetryDelay":
            d.errorRetry.retryDelayMs = u, d.timeoutRetry.retryDelayMs = u;
            break;
          case "MaxRetryTimeout":
            d.errorRetry.maxRetryDelayMs = u, d.timeoutRetry.maxRetryDelayMs = u;
            break;
        }
      }
    }), l.length && S.warn(`hls.js config: "${l.join('", "')}" setting(s) are deprecated, use "${r}": ${JSON.stringify(e[r])}`);
  }), ce(ce({}, t), e);
}
function bs(a) {
  return a && typeof a == "object" ? Array.isArray(a) ? a.map(bs) : Object.keys(a).reduce((e, t) => (e[t] = bs(a[t]), e), {}) : a;
}
function Sc(a) {
  const e = a.loader;
  e !== zi && e !== nr ? (S.log("[config]: Custom loader detected, cannot enable progressive streaming"), a.progressive = !1) : uc() && (a.loader = zi, a.progressive = !0, a.enableSoftwareAES = !0, S.log("[config]: Progressive streaming enabled, using FetchLoader"));
}
let cs;
class bc extends ks {
  constructor(e, t) {
    super(e, "[level-controller]"), this._levels = [], this._firstLevel = -1, this._maxAutoLevel = -1, this._startLevel = void 0, this.currentLevel = null, this.currentLevelIndex = -1, this.manualLevelIndex = -1, this.steering = void 0, this.onParsedComplete = void 0, this.steering = t, this._registerListeners();
  }
  _registerListeners() {
    const {
      hls: e
    } = this;
    e.on(y.MANIFEST_LOADING, this.onManifestLoading, this), e.on(y.MANIFEST_LOADED, this.onManifestLoaded, this), e.on(y.LEVEL_LOADED, this.onLevelLoaded, this), e.on(y.LEVELS_UPDATED, this.onLevelsUpdated, this), e.on(y.FRAG_BUFFERED, this.onFragBuffered, this), e.on(y.ERROR, this.onError, this);
  }
  _unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(y.MANIFEST_LOADING, this.onManifestLoading, this), e.off(y.MANIFEST_LOADED, this.onManifestLoaded, this), e.off(y.LEVEL_LOADED, this.onLevelLoaded, this), e.off(y.LEVELS_UPDATED, this.onLevelsUpdated, this), e.off(y.FRAG_BUFFERED, this.onFragBuffered, this), e.off(y.ERROR, this.onError, this);
  }
  destroy() {
    this._unregisterListeners(), this.steering = null, this.resetLevels(), super.destroy();
  }
  stopLoad() {
    this._levels.forEach((t) => {
      t.loadError = 0, t.fragmentError = 0;
    }), super.stopLoad();
  }
  resetLevels() {
    this._startLevel = void 0, this.manualLevelIndex = -1, this.currentLevelIndex = -1, this.currentLevel = null, this._levels = [], this._maxAutoLevel = -1;
  }
  onManifestLoading(e, t) {
    this.resetLevels();
  }
  onManifestLoaded(e, t) {
    const s = this.hls.config.preferManagedMediaSource, i = [], n = {}, r = {};
    let o = !1, l = !1, c = !1;
    t.levels.forEach((h) => {
      var u, d;
      const f = h.attrs;
      let {
        audioCodec: m,
        videoCodec: p
      } = h;
      ((u = m) == null ? void 0 : u.indexOf("mp4a.40.34")) !== -1 && (cs || (cs = /chrome|firefox/i.test(navigator.userAgent)), cs && (h.audioCodec = m = void 0)), m && (h.audioCodec = m = kt(m, s)), ((d = p) == null ? void 0 : d.indexOf("avc1")) === 0 && (p = h.videoCodec = ca(p));
      const {
        width: g,
        height: v,
        unknownCodecs: C
      } = h;
      if (o || (o = !!(g && v)), l || (l = !!p), c || (c = !!m), C != null && C.length || m && !Zt(m, "audio", s) || p && !Zt(p, "video", s))
        return;
      const {
        CODECS: E,
        "FRAME-RATE": T,
        "HDCP-LEVEL": x,
        "PATHWAY-ID": I,
        RESOLUTION: L,
        "VIDEO-RANGE": w
      } = f, k = `${`${I || "."}-`}${h.bitrate}-${L}-${T}-${E}-${w}-${x}`;
      if (n[k])
        if (n[k].uri !== h.url && !h.attrs["PATHWAY-ID"]) {
          const M = r[k] += 1;
          h.attrs["PATHWAY-ID"] = new Array(M + 1).join(".");
          const _ = new Xe(h);
          n[k] = _, i.push(_);
        } else
          n[k].addGroupId("audio", f.AUDIO), n[k].addGroupId("text", f.SUBTITLES);
      else {
        const M = new Xe(h);
        n[k] = M, r[k] = 1, i.push(M);
      }
    }), this.filterAndSortMediaOptions(i, t, o, l, c);
  }
  filterAndSortMediaOptions(e, t, s, i, n) {
    let r = [], o = [], l = e;
    if ((s || i) && n && (l = l.filter(({
      videoCodec: m,
      videoRange: p,
      width: g,
      height: v
    }) => (!!m || !!(g && v)) && xa(p))), l.length === 0) {
      Promise.resolve().then(() => {
        if (this.hls) {
          t.levels.length && this.warn(`One or more CODECS in variant not supported: ${JSON.stringify(t.levels[0].attrs)}`);
          const m = new Error("no level with compatible codecs found in manifest");
          this.hls.trigger(y.ERROR, {
            type: K.MEDIA_ERROR,
            details: A.MANIFEST_INCOMPATIBLE_CODECS_ERROR,
            fatal: !0,
            url: t.url,
            error: m,
            reason: m.message
          });
        }
      });
      return;
    }
    if (t.audioTracks) {
      const {
        preferManagedMediaSource: m
      } = this.hls.config;
      r = t.audioTracks.filter((p) => !p.audioCodec || Zt(p.audioCodec, "audio", m)), Yi(r);
    }
    t.subtitles && (o = t.subtitles, Yi(o));
    const c = l.slice(0);
    l.sort((m, p) => {
      if (m.attrs["HDCP-LEVEL"] !== p.attrs["HDCP-LEVEL"])
        return (m.attrs["HDCP-LEVEL"] || "") > (p.attrs["HDCP-LEVEL"] || "") ? 1 : -1;
      if (s && m.height !== p.height)
        return m.height - p.height;
      if (m.frameRate !== p.frameRate)
        return m.frameRate - p.frameRate;
      if (m.videoRange !== p.videoRange)
        return Dt.indexOf(m.videoRange) - Dt.indexOf(p.videoRange);
      if (m.videoCodec !== p.videoCodec) {
        const g = ei(m.videoCodec), v = ei(p.videoCodec);
        if (g !== v)
          return v - g;
      }
      if (m.uri === p.uri && m.codecSet !== p.codecSet) {
        const g = Rt(m.codecSet), v = Rt(p.codecSet);
        if (g !== v)
          return v - g;
      }
      return m.averageBitrate !== p.averageBitrate ? m.averageBitrate - p.averageBitrate : 0;
    });
    let h = c[0];
    if (this.steering && (l = this.steering.filterParsedLevels(l), l.length !== c.length)) {
      for (let m = 0; m < c.length; m++)
        if (c[m].pathwayId === l[0].pathwayId) {
          h = c[m];
          break;
        }
    }
    this._levels = l;
    for (let m = 0; m < l.length; m++)
      if (l[m] === h) {
        var u;
        this._firstLevel = m;
        const p = h.bitrate, g = this.hls.bandwidthEstimate;
        if (this.log(`manifest loaded, ${l.length} level(s) found, first bitrate: ${p}`), ((u = this.hls.userConfig) == null ? void 0 : u.abrEwmaDefaultEstimate) === void 0) {
          const v = Math.min(p, this.hls.config.abrEwmaDefaultEstimateMax);
          v > g && g === rr.abrEwmaDefaultEstimate && (this.hls.bandwidthEstimate = v);
        }
        break;
      }
    const d = n && !i, f = {
      levels: l,
      audioTracks: r,
      subtitleTracks: o,
      sessionData: t.sessionData,
      sessionKeys: t.sessionKeys,
      firstLevel: this._firstLevel,
      stats: t.stats,
      audio: n,
      video: i,
      altAudio: !d && r.some((m) => !!m.url)
    };
    this.hls.trigger(y.MANIFEST_PARSED, f), (this.hls.config.autoStartLoad || this.hls.forceStartLoad) && this.hls.startLoad(this.hls.config.startPosition);
  }
  get levels() {
    return this._levels.length === 0 ? null : this._levels;
  }
  get level() {
    return this.currentLevelIndex;
  }
  set level(e) {
    const t = this._levels;
    if (t.length === 0)
      return;
    if (e < 0 || e >= t.length) {
      const h = new Error("invalid level idx"), u = e < 0;
      if (this.hls.trigger(y.ERROR, {
        type: K.OTHER_ERROR,
        details: A.LEVEL_SWITCH_ERROR,
        level: e,
        fatal: u,
        error: h,
        reason: h.message
      }), u)
        return;
      e = Math.min(e, t.length - 1);
    }
    const s = this.currentLevelIndex, i = this.currentLevel, n = i ? i.attrs["PATHWAY-ID"] : void 0, r = t[e], o = r.attrs["PATHWAY-ID"];
    if (this.currentLevelIndex = e, this.currentLevel = r, s === e && r.details && i && n === o)
      return;
    this.log(`Switching to level ${e} (${r.height ? r.height + "p " : ""}${r.videoRange ? r.videoRange + " " : ""}${r.codecSet ? r.codecSet + " " : ""}@${r.bitrate})${o ? " with Pathway " + o : ""} from level ${s}${n ? " with Pathway " + n : ""}`);
    const l = {
      level: e,
      attrs: r.attrs,
      details: r.details,
      bitrate: r.bitrate,
      averageBitrate: r.averageBitrate,
      maxBitrate: r.maxBitrate,
      realBitrate: r.realBitrate,
      width: r.width,
      height: r.height,
      codecSet: r.codecSet,
      audioCodec: r.audioCodec,
      videoCodec: r.videoCodec,
      audioGroups: r.audioGroups,
      subtitleGroups: r.subtitleGroups,
      loaded: r.loaded,
      loadError: r.loadError,
      fragmentError: r.fragmentError,
      name: r.name,
      id: r.id,
      uri: r.uri,
      url: r.url,
      urlId: 0,
      audioGroupIds: r.audioGroupIds,
      textGroupIds: r.textGroupIds
    };
    this.hls.trigger(y.LEVEL_SWITCHING, l);
    const c = r.details;
    if (!c || c.live) {
      const h = this.switchParams(r.uri, i == null ? void 0 : i.details, c);
      this.loadPlaylist(h);
    }
  }
  get manualLevel() {
    return this.manualLevelIndex;
  }
  set manualLevel(e) {
    this.manualLevelIndex = e, this._startLevel === void 0 && (this._startLevel = e), e !== -1 && (this.level = e);
  }
  get firstLevel() {
    return this._firstLevel;
  }
  set firstLevel(e) {
    this._firstLevel = e;
  }
  get startLevel() {
    if (this._startLevel === void 0) {
      const e = this.hls.config.startLevel;
      return e !== void 0 ? e : this.hls.firstAutoLevel;
    }
    return this._startLevel;
  }
  set startLevel(e) {
    this._startLevel = e;
  }
  onError(e, t) {
    t.fatal || !t.context || t.context.type === Y.LEVEL && t.context.level === this.level && this.checkRetry(t);
  }
  // reset errors on the successful load of a fragment
  onFragBuffered(e, {
    frag: t
  }) {
    if (t !== void 0 && t.type === H.MAIN) {
      const s = t.elementaryStreams;
      if (!Object.keys(s).some((n) => !!s[n]))
        return;
      const i = this._levels[t.level];
      i != null && i.loadError && (this.log(`Resetting level error count of ${i.loadError} on frag buffered`), i.loadError = 0);
    }
  }
  onLevelLoaded(e, t) {
    var s;
    const {
      level: i,
      details: n
    } = t, r = this._levels[i];
    if (!r) {
      var o;
      this.warn(`Invalid level index ${i}`), (o = t.deliveryDirectives) != null && o.skip && (n.deltaUpdateFailed = !0);
      return;
    }
    i === this.currentLevelIndex ? (r.fragmentError === 0 && (r.loadError = 0), this.playlistLoaded(i, t, r.details)) : (s = t.deliveryDirectives) != null && s.skip && (n.deltaUpdateFailed = !0);
  }
  loadPlaylist(e) {
    super.loadPlaylist();
    const t = this.currentLevelIndex, s = this.currentLevel;
    if (s && this.shouldLoadPlaylist(s)) {
      let i = s.uri;
      if (e)
        try {
          i = e.addDirectives(i);
        } catch (r) {
          this.warn(`Could not construct new URL with HLS Delivery Directives: ${r}`);
        }
      const n = s.attrs["PATHWAY-ID"];
      this.log(`Loading level index ${t}${(e == null ? void 0 : e.msn) !== void 0 ? " at sn " + e.msn + " part " + e.part : ""} with${n ? " Pathway " + n : ""} ${i}`), this.clearTimer(), this.hls.trigger(y.LEVEL_LOADING, {
        url: i,
        level: t,
        pathwayId: s.attrs["PATHWAY-ID"],
        id: 0,
        // Deprecated Level urlId
        deliveryDirectives: e || null
      });
    }
  }
  get nextLoadLevel() {
    return this.manualLevelIndex !== -1 ? this.manualLevelIndex : this.hls.nextAutoLevel;
  }
  set nextLoadLevel(e) {
    this.level = e, this.manualLevelIndex === -1 && (this.hls.nextAutoLevel = e);
  }
  removeLevel(e) {
    var t;
    const s = this._levels.filter((i, n) => n !== e ? !0 : (this.steering && this.steering.removeLevel(i), i === this.currentLevel && (this.currentLevel = null, this.currentLevelIndex = -1, i.details && i.details.fragments.forEach((r) => r.level = -1)), !1));
    En(s), this._levels = s, this.currentLevelIndex > -1 && (t = this.currentLevel) != null && t.details && (this.currentLevelIndex = this.currentLevel.details.fragments[0].level), this.hls.trigger(y.LEVELS_UPDATED, {
      levels: s
    });
  }
  onLevelsUpdated(e, {
    levels: t
  }) {
    this._levels = t;
  }
  checkMaxAutoUpdated() {
    const {
      autoLevelCapping: e,
      maxAutoLevel: t,
      maxHdcpLevel: s
    } = this.hls;
    this._maxAutoLevel !== t && (this._maxAutoLevel = t, this.hls.trigger(y.MAX_AUTO_LEVEL_UPDATED, {
      autoLevelCapping: e,
      levels: this.levels,
      maxAutoLevel: t,
      minAutoLevel: this.hls.minAutoLevel,
      maxHdcpLevel: s
    }));
  }
}
function Yi(a) {
  const e = {};
  a.forEach((t) => {
    const s = t.groupId || "";
    t.id = e[s] = e[s] || 0, e[s]++;
  });
}
class Lc {
  constructor(e) {
    this.config = void 0, this.keyUriToKeyInfo = {}, this.emeController = null, this.config = e;
  }
  abort(e) {
    for (const s in this.keyUriToKeyInfo) {
      const i = this.keyUriToKeyInfo[s].loader;
      if (i) {
        var t;
        if (e && e !== ((t = i.context) == null ? void 0 : t.frag.type))
          return;
        i.abort();
      }
    }
  }
  detach() {
    for (const e in this.keyUriToKeyInfo) {
      const t = this.keyUriToKeyInfo[e];
      (t.mediaKeySessionContext || t.decryptdata.isCommonEncryption) && delete this.keyUriToKeyInfo[e];
    }
  }
  destroy() {
    this.detach();
    for (const e in this.keyUriToKeyInfo) {
      const t = this.keyUriToKeyInfo[e].loader;
      t && t.destroy();
    }
    this.keyUriToKeyInfo = {};
  }
  createKeyLoadError(e, t = A.KEY_LOAD_ERROR, s, i, n) {
    return new Me({
      type: K.NETWORK_ERROR,
      details: t,
      fatal: !1,
      frag: e,
      response: n,
      error: s,
      networkDetails: i
    });
  }
  loadClear(e, t) {
    if (this.emeController && this.config.emeEnabled) {
      const {
        sn: s,
        cc: i
      } = e;
      for (let n = 0; n < t.length; n++) {
        const r = t[n];
        if (i <= r.cc && (s === "initSegment" || r.sn === "initSegment" || s < r.sn)) {
          this.emeController.selectKeySystemFormat(r).then((o) => {
            r.setKeyFormat(o);
          });
          break;
        }
      }
    }
  }
  load(e) {
    return !e.decryptdata && e.encrypted && this.emeController ? this.emeController.selectKeySystemFormat(e).then((t) => this.loadInternal(e, t)) : this.loadInternal(e);
  }
  loadInternal(e, t) {
    var s, i;
    t && e.setKeyFormat(t);
    const n = e.decryptdata;
    if (!n) {
      const c = new Error(t ? `Expected frag.decryptdata to be defined after setting format ${t}` : "Missing decryption data on fragment in onKeyLoading");
      return Promise.reject(this.createKeyLoadError(e, A.KEY_LOAD_ERROR, c));
    }
    const r = n.uri;
    if (!r)
      return Promise.reject(this.createKeyLoadError(e, A.KEY_LOAD_ERROR, new Error(`Invalid key URI: "${r}"`)));
    let o = this.keyUriToKeyInfo[r];
    if ((s = o) != null && s.decryptdata.key)
      return n.key = o.decryptdata.key, Promise.resolve({
        frag: e,
        keyInfo: o
      });
    if ((i = o) != null && i.keyLoadPromise) {
      var l;
      switch ((l = o.mediaKeySessionContext) == null ? void 0 : l.keyStatus) {
        case void 0:
        case "status-pending":
        case "usable":
        case "usable-in-future":
          return o.keyLoadPromise.then((c) => (n.key = c.keyInfo.decryptdata.key, {
            frag: e,
            keyInfo: o
          }));
      }
    }
    switch (o = this.keyUriToKeyInfo[r] = {
      decryptdata: n,
      keyLoadPromise: null,
      loader: null,
      mediaKeySessionContext: null
    }, n.method) {
      case "ISO-23001-7":
      case "SAMPLE-AES":
      case "SAMPLE-AES-CENC":
      case "SAMPLE-AES-CTR":
        return n.keyFormat === "identity" ? this.loadKeyHTTP(o, e) : this.loadKeyEME(o, e);
      case "AES-128":
        return this.loadKeyHTTP(o, e);
      default:
        return Promise.reject(this.createKeyLoadError(e, A.KEY_LOAD_ERROR, new Error(`Key supplied with unsupported METHOD: "${n.method}"`)));
    }
  }
  loadKeyEME(e, t) {
    const s = {
      frag: t,
      keyInfo: e
    };
    if (this.emeController && this.config.emeEnabled) {
      const i = this.emeController.loadKey(s);
      if (i)
        return (e.keyLoadPromise = i.then((n) => (e.mediaKeySessionContext = n, s))).catch((n) => {
          throw e.keyLoadPromise = null, n;
        });
    }
    return Promise.resolve(s);
  }
  loadKeyHTTP(e, t) {
    const s = this.config, i = s.loader, n = new i(s);
    return t.keyLoader = e.loader = n, e.keyLoadPromise = new Promise((r, o) => {
      const l = {
        keyInfo: e,
        frag: t,
        responseType: "arraybuffer",
        url: e.decryptdata.uri
      }, c = s.keyLoadPolicy.default, h = {
        loadPolicy: c,
        timeout: c.maxLoadTimeMs,
        maxRetry: 0,
        retryDelay: 0,
        maxRetryDelay: 0
      }, u = {
        onSuccess: (d, f, m, p) => {
          const {
            frag: g,
            keyInfo: v,
            url: C
          } = m;
          if (!g.decryptdata || v !== this.keyUriToKeyInfo[C])
            return o(this.createKeyLoadError(g, A.KEY_LOAD_ERROR, new Error("after key load, decryptdata unset or changed"), p));
          v.decryptdata.key = g.decryptdata.key = new Uint8Array(d.data), g.keyLoader = null, v.loader = null, r({
            frag: g,
            keyInfo: v
          });
        },
        onError: (d, f, m, p) => {
          this.resetLoader(f), o(this.createKeyLoadError(t, A.KEY_LOAD_ERROR, new Error(`HTTP Error ${d.code} loading key ${d.text}`), m, ce({
            url: l.url,
            data: void 0
          }, d)));
        },
        onTimeout: (d, f, m) => {
          this.resetLoader(f), o(this.createKeyLoadError(t, A.KEY_LOAD_TIMEOUT, new Error("key loading timed out"), m));
        },
        onAbort: (d, f, m) => {
          this.resetLoader(f), o(this.createKeyLoadError(t, A.INTERNAL_ABORTED, new Error("key loading aborted"), m));
        }
      };
      n.load(l, h, u);
    });
  }
  resetLoader(e) {
    const {
      frag: t,
      keyInfo: s,
      url: i
    } = e, n = s.loader;
    t.keyLoader === n && (t.keyLoader = null, s.loader = null), delete this.keyUriToKeyInfo[i], n && n.destroy();
  }
}
function ar() {
  return self.SourceBuffer || self.WebKitSourceBuffer;
}
function or() {
  if (!Ve())
    return !1;
  const e = ar();
  return !e || e.prototype && typeof e.prototype.appendBuffer == "function" && typeof e.prototype.remove == "function";
}
function Ac() {
  if (!or())
    return !1;
  const a = Ve();
  return typeof (a == null ? void 0 : a.isTypeSupported) == "function" && (["avc1.42E01E,mp4a.40.2", "av01.0.01M.08", "vp09.00.50.08"].some((e) => a.isTypeSupported(at(e, "video"))) || ["mp4a.40.2", "fLaC"].some((e) => a.isTypeSupported(at(e, "audio"))));
}
function wc() {
  var a;
  const e = ar();
  return typeof (e == null || (a = e.prototype) == null ? void 0 : a.changeType) == "function";
}
const Ic = 250, At = 2, Rc = 0.1, kc = 0.05;
class Dc {
  constructor(e, t, s, i) {
    this.config = void 0, this.media = null, this.fragmentTracker = void 0, this.hls = void 0, this.nudgeRetry = 0, this.stallReported = !1, this.stalled = null, this.moved = !1, this.seeking = !1, this.config = e, this.media = t, this.fragmentTracker = s, this.hls = i;
  }
  destroy() {
    this.media = null, this.hls = this.fragmentTracker = null;
  }
  /**
   * Checks if the playhead is stuck within a gap, and if so, attempts to free it.
   * A gap is an unbuffered range between two buffered ranges (or the start and the first buffered range).
   *
   * @param lastCurrentTime - Previously read playhead position
   */
  poll(e, t) {
    const {
      config: s,
      media: i,
      stalled: n
    } = this;
    if (i === null)
      return;
    const {
      currentTime: r,
      seeking: o
    } = i, l = this.seeking && !o, c = !this.seeking && o;
    if (this.seeking = o, r !== e) {
      if (this.moved = !0, o || (this.nudgeRetry = 0), n !== null) {
        if (this.stallReported) {
          const g = self.performance.now() - n;
          S.warn(`playback not stuck anymore @${r}, after ${Math.round(g)}ms`), this.stallReported = !1;
        }
        this.stalled = null;
      }
      return;
    }
    if (c || l) {
      this.stalled = null;
      return;
    }
    if (i.paused && !o || i.ended || i.playbackRate === 0 || !ee.getBuffered(i).length) {
      this.nudgeRetry = 0;
      return;
    }
    const h = ee.bufferInfo(i, r, 0), u = h.nextStart || 0;
    if (o) {
      const g = h.len > At, v = !u || t && t.start <= r || u - r > At && !this.fragmentTracker.getPartialFragment(r);
      if (g || v)
        return;
      this.moved = !1;
    }
    if (!this.moved && this.stalled !== null) {
      var d;
      if (!(h.len > 0) && !u)
        return;
      const v = Math.max(u, h.start || 0) - r, C = this.hls.levels ? this.hls.levels[this.hls.currentLevel] : null, T = (C == null || (d = C.details) == null ? void 0 : d.live) ? C.details.targetduration * 2 : At, x = this.fragmentTracker.getPartialFragment(r);
      if (v > 0 && (v <= T || x)) {
        i.paused || this._trySkipBufferHole(x);
        return;
      }
    }
    const f = self.performance.now();
    if (n === null) {
      this.stalled = f;
      return;
    }
    const m = f - n;
    if (!o && m >= Ic && (this._reportStall(h), !this.media))
      return;
    const p = ee.bufferInfo(i, r, s.maxBufferHole);
    this._tryFixBufferStall(p, m);
  }
  /**
   * Detects and attempts to fix known buffer stalling issues.
   * @param bufferInfo - The properties of the current buffer.
   * @param stalledDurationMs - The amount of time Hls.js has been stalling for.
   * @private
   */
  _tryFixBufferStall(e, t) {
    const {
      config: s,
      fragmentTracker: i,
      media: n
    } = this;
    if (n === null)
      return;
    const r = n.currentTime, o = i.getPartialFragment(r);
    o && (this._trySkipBufferHole(o) || !this.media) || (e.len > s.maxBufferHole || e.nextStart && e.nextStart - r < s.maxBufferHole) && t > s.highBufferWatchdogPeriod * 1e3 && (S.warn("Trying to nudge playhead over buffer-hole"), this.stalled = null, this._tryNudgeBuffer());
  }
  /**
   * Triggers a BUFFER_STALLED_ERROR event, but only once per stall period.
   * @param bufferLen - The playhead distance from the end of the current buffer segment.
   * @private
   */
  _reportStall(e) {
    const {
      hls: t,
      media: s,
      stallReported: i
    } = this;
    if (!i && s) {
      this.stallReported = !0;
      const n = new Error(`Playback stalling at @${s.currentTime} due to low buffer (${JSON.stringify(e)})`);
      S.warn(n.message), t.trigger(y.ERROR, {
        type: K.MEDIA_ERROR,
        details: A.BUFFER_STALLED_ERROR,
        fatal: !1,
        error: n,
        buffer: e.len
      });
    }
  }
  /**
   * Attempts to fix buffer stalls by jumping over known gaps caused by partial fragments
   * @param partial - The partial fragment found at the current time (where playback is stalling).
   * @private
   */
  _trySkipBufferHole(e) {
    const {
      config: t,
      hls: s,
      media: i
    } = this;
    if (i === null)
      return 0;
    const n = i.currentTime, r = ee.bufferInfo(i, n, 0), o = n < r.start ? r.start : r.nextStart;
    if (o) {
      const l = r.len <= t.maxBufferHole, c = r.len > 0 && r.len < 1 && i.readyState < 3, h = o - n;
      if (h > 0 && (l || c)) {
        if (h > t.maxBufferHole) {
          const {
            fragmentTracker: d
          } = this;
          let f = !1;
          if (n === 0) {
            const m = d.getAppendedFrag(0, H.MAIN);
            m && o < m.end && (f = !0);
          }
          if (!f) {
            const m = e || d.getAppendedFrag(n, H.MAIN);
            if (m) {
              let p = !1, g = m.end;
              for (; g < o; ) {
                const v = d.getPartialFragment(g);
                if (v)
                  g += v.duration;
                else {
                  p = !0;
                  break;
                }
              }
              if (p)
                return 0;
            }
          }
        }
        const u = Math.max(o + kc, n + Rc);
        if (S.warn(`skipping hole, adjusting currentTime from ${n} to ${u}`), this.moved = !0, this.stalled = null, i.currentTime = u, e && !e.gap) {
          const d = new Error(`fragment loaded with buffer holes, seeking from ${n} to ${u}`);
          s.trigger(y.ERROR, {
            type: K.MEDIA_ERROR,
            details: A.BUFFER_SEEK_OVER_HOLE,
            fatal: !1,
            error: d,
            reason: d.message,
            frag: e
          });
        }
        return u;
      }
    }
    return 0;
  }
  /**
   * Attempts to fix buffer stalls by advancing the mediaElement's current time by a small amount.
   * @private
   */
  _tryNudgeBuffer() {
    const {
      config: e,
      hls: t,
      media: s,
      nudgeRetry: i
    } = this;
    if (s === null)
      return;
    const n = s.currentTime;
    if (this.nudgeRetry++, i < e.nudgeMaxRetry) {
      const r = n + (i + 1) * e.nudgeOffset, o = new Error(`Nudging 'currentTime' from ${n} to ${r}`);
      S.warn(o.message), s.currentTime = r, t.trigger(y.ERROR, {
        type: K.MEDIA_ERROR,
        details: A.BUFFER_NUDGE_ON_STALL,
        error: o,
        fatal: !1
      });
    } else {
      const r = new Error(`Playhead still not moving while enough data buffered @${n} after ${e.nudgeMaxRetry} nudges`);
      S.error(r.message), t.trigger(y.ERROR, {
        type: K.MEDIA_ERROR,
        details: A.BUFFER_STALLED_ERROR,
        error: r,
        fatal: !0
      });
    }
  }
}
const Mc = 100;
class Pc extends Ps {
  constructor(e, t, s) {
    super(e, t, s, "[stream-controller]", H.MAIN), this.audioCodecSwap = !1, this.gapController = null, this.level = -1, this._forceStartLoad = !1, this.altAudio = !1, this.audioOnly = !1, this.fragPlaying = null, this.onvplaying = null, this.onvseeked = null, this.fragLastKbps = 0, this.couldBacktrack = !1, this.backtrackFragment = null, this.audioCodecSwitch = !1, this.videoBuffer = null, this._registerListeners();
  }
  _registerListeners() {
    const {
      hls: e
    } = this;
    e.on(y.MEDIA_ATTACHED, this.onMediaAttached, this), e.on(y.MEDIA_DETACHING, this.onMediaDetaching, this), e.on(y.MANIFEST_LOADING, this.onManifestLoading, this), e.on(y.MANIFEST_PARSED, this.onManifestParsed, this), e.on(y.LEVEL_LOADING, this.onLevelLoading, this), e.on(y.LEVEL_LOADED, this.onLevelLoaded, this), e.on(y.FRAG_LOAD_EMERGENCY_ABORTED, this.onFragLoadEmergencyAborted, this), e.on(y.ERROR, this.onError, this), e.on(y.AUDIO_TRACK_SWITCHING, this.onAudioTrackSwitching, this), e.on(y.AUDIO_TRACK_SWITCHED, this.onAudioTrackSwitched, this), e.on(y.BUFFER_CREATED, this.onBufferCreated, this), e.on(y.BUFFER_FLUSHED, this.onBufferFlushed, this), e.on(y.LEVELS_UPDATED, this.onLevelsUpdated, this), e.on(y.FRAG_BUFFERED, this.onFragBuffered, this);
  }
  _unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(y.MEDIA_ATTACHED, this.onMediaAttached, this), e.off(y.MEDIA_DETACHING, this.onMediaDetaching, this), e.off(y.MANIFEST_LOADING, this.onManifestLoading, this), e.off(y.MANIFEST_PARSED, this.onManifestParsed, this), e.off(y.LEVEL_LOADED, this.onLevelLoaded, this), e.off(y.FRAG_LOAD_EMERGENCY_ABORTED, this.onFragLoadEmergencyAborted, this), e.off(y.ERROR, this.onError, this), e.off(y.AUDIO_TRACK_SWITCHING, this.onAudioTrackSwitching, this), e.off(y.AUDIO_TRACK_SWITCHED, this.onAudioTrackSwitched, this), e.off(y.BUFFER_CREATED, this.onBufferCreated, this), e.off(y.BUFFER_FLUSHED, this.onBufferFlushed, this), e.off(y.LEVELS_UPDATED, this.onLevelsUpdated, this), e.off(y.FRAG_BUFFERED, this.onFragBuffered, this);
  }
  onHandlerDestroying() {
    this._unregisterListeners(), super.onHandlerDestroying();
  }
  startLoad(e) {
    if (this.levels) {
      const {
        lastCurrentTime: t,
        hls: s
      } = this;
      if (this.stopLoad(), this.setInterval(Mc), this.level = -1, !this.startFragRequested) {
        let i = s.startLevel;
        i === -1 && (s.config.testBandwidth && this.levels.length > 1 ? (i = 0, this.bitrateTest = !0) : i = s.firstAutoLevel), s.nextLoadLevel = i, this.level = s.loadLevel, this.loadedmetadata = !1;
      }
      t > 0 && e === -1 && (this.log(`Override startPosition with lastCurrentTime @${t.toFixed(3)}`), e = t), this.state = D.IDLE, this.nextLoadPosition = this.startPosition = this.lastCurrentTime = e, this.tick();
    } else
      this._forceStartLoad = !0, this.state = D.STOPPED;
  }
  stopLoad() {
    this._forceStartLoad = !1, super.stopLoad();
  }
  doTick() {
    switch (this.state) {
      case D.WAITING_LEVEL: {
        const {
          levels: t,
          level: s
        } = this, i = t == null ? void 0 : t[s], n = i == null ? void 0 : i.details;
        if (n && (!n.live || this.levelLastLoaded === i)) {
          if (this.waitForCdnTuneIn(n))
            break;
          this.state = D.IDLE;
          break;
        } else if (this.hls.nextLoadLevel !== this.level) {
          this.state = D.IDLE;
          break;
        }
        break;
      }
      case D.FRAG_LOADING_WAITING_RETRY:
        {
          var e;
          const t = self.performance.now(), s = this.retryDate;
          if (!s || t >= s || (e = this.media) != null && e.seeking) {
            const {
              levels: i,
              level: n
            } = this, r = i == null ? void 0 : i[n];
            this.resetStartWhenNotLoaded(r || null), this.state = D.IDLE;
          }
        }
        break;
    }
    this.state === D.IDLE && this.doTickIdle(), this.onTickEnd();
  }
  onTickEnd() {
    super.onTickEnd(), this.checkBuffer(), this.checkFragmentChanged();
  }
  doTickIdle() {
    const {
      hls: e,
      levelLastLoaded: t,
      levels: s,
      media: i
    } = this;
    if (t === null || !i && (this.startFragRequested || !e.config.startFragPrefetch) || this.altAudio && this.audioOnly)
      return;
    const n = e.nextLoadLevel;
    if (!(s != null && s[n]))
      return;
    const r = s[n], o = this.getMainFwdBufferInfo();
    if (o === null)
      return;
    const l = this.getLevelDetails();
    if (l && this._streamEnded(o, l)) {
      const p = {};
      this.altAudio && (p.type = "video"), this.hls.trigger(y.BUFFER_EOS, p), this.state = D.ENDED;
      return;
    }
    e.loadLevel !== n && e.manualLevel === -1 && this.log(`Adapting to level ${n} from level ${this.level}`), this.level = e.nextLoadLevel = n;
    const c = r.details;
    if (!c || this.state === D.WAITING_LEVEL || c.live && this.levelLastLoaded !== r) {
      this.level = n, this.state = D.WAITING_LEVEL;
      return;
    }
    const h = o.len, u = this.getMaxBufferLength(r.maxBitrate);
    if (h >= u)
      return;
    this.backtrackFragment && this.backtrackFragment.start > o.end && (this.backtrackFragment = null);
    const d = this.backtrackFragment ? this.backtrackFragment.start : o.end;
    let f = this.getNextFragment(d, c);
    if (this.couldBacktrack && !this.fragPrevious && f && f.sn !== "initSegment" && this.fragmentTracker.getState(f) !== le.OK) {
      var m;
      const g = ((m = this.backtrackFragment) != null ? m : f).sn - c.startSN, v = c.fragments[g - 1];
      v && f.cc === v.cc && (f = v, this.fragmentTracker.removeFragment(v));
    } else
      this.backtrackFragment && o.len && (this.backtrackFragment = null);
    if (f && this.isLoopLoading(f, d)) {
      if (!f.gap) {
        const g = this.audioOnly && !this.altAudio ? X.AUDIO : X.VIDEO, v = (g === X.VIDEO ? this.videoBuffer : this.mediaBuffer) || this.media;
        v && this.afterBufferFlushed(v, g, H.MAIN);
      }
      f = this.getNextFragmentLoopLoading(f, c, o, H.MAIN, u);
    }
    f && (f.initSegment && !f.initSegment.data && !this.bitrateTest && (f = f.initSegment), this.loadFragment(f, r, d));
  }
  loadFragment(e, t, s) {
    const i = this.fragmentTracker.getState(e);
    this.fragCurrent = e, i === le.NOT_LOADED || i === le.PARTIAL ? e.sn === "initSegment" ? this._loadInitSegment(e, t) : this.bitrateTest ? (this.log(`Fragment ${e.sn} of level ${e.level} is being downloaded to test bitrate and will not be buffered`), this._loadBitrateTestFrag(e, t)) : (this.startFragRequested = !0, super.loadFragment(e, t, s)) : this.clearTrackerIfNeeded(e);
  }
  getBufferedFrag(e) {
    return this.fragmentTracker.getBufferedFrag(e, H.MAIN);
  }
  followingBufferedFrag(e) {
    return e ? this.getBufferedFrag(e.end + 0.5) : null;
  }
  /*
    on immediate level switch :
     - pause playback if playing
     - cancel any pending load request
     - and trigger a buffer flush
  */
  immediateLevelSwitch() {
    this.abortCurrentFrag(), this.flushMainBuffer(0, Number.POSITIVE_INFINITY);
  }
  /**
   * try to switch ASAP without breaking video playback:
   * in order to ensure smooth but quick level switching,
   * we need to find the next flushable buffer range
   * we should take into account new segment fetch time
   */
  nextLevelSwitch() {
    const {
      levels: e,
      media: t
    } = this;
    if (t != null && t.readyState) {
      let s;
      const i = this.getAppendedFrag(t.currentTime);
      i && i.start > 1 && this.flushMainBuffer(0, i.start - 1);
      const n = this.getLevelDetails();
      if (n != null && n.live) {
        const o = this.getMainFwdBufferInfo();
        if (!o || o.len < n.targetduration * 2)
          return;
      }
      if (!t.paused && e) {
        const o = this.hls.nextLoadLevel, l = e[o], c = this.fragLastKbps;
        c && this.fragCurrent ? s = this.fragCurrent.duration * l.maxBitrate / (1e3 * c) + 1 : s = 0;
      } else
        s = 0;
      const r = this.getBufferedFrag(t.currentTime + s);
      if (r) {
        const o = this.followingBufferedFrag(r);
        if (o) {
          this.abortCurrentFrag();
          const l = o.maxStartPTS ? o.maxStartPTS : o.start, c = o.duration, h = Math.max(r.end, l + Math.min(Math.max(c - this.config.maxFragLookUpTolerance, c * (this.couldBacktrack ? 0.5 : 0.125)), c * (this.couldBacktrack ? 0.75 : 0.25)));
          this.flushMainBuffer(h, Number.POSITIVE_INFINITY);
        }
      }
    }
  }
  abortCurrentFrag() {
    const e = this.fragCurrent;
    switch (this.fragCurrent = null, this.backtrackFragment = null, e && (e.abortRequests(), this.fragmentTracker.removeFragment(e)), this.state) {
      case D.KEY_LOADING:
      case D.FRAG_LOADING:
      case D.FRAG_LOADING_WAITING_RETRY:
      case D.PARSING:
      case D.PARSED:
        this.state = D.IDLE;
        break;
    }
    this.nextLoadPosition = this.getLoadPosition();
  }
  flushMainBuffer(e, t) {
    super.flushMainBuffer(e, t, this.altAudio ? "video" : null);
  }
  onMediaAttached(e, t) {
    super.onMediaAttached(e, t);
    const s = t.media;
    this.onvplaying = this.onMediaPlaying.bind(this), this.onvseeked = this.onMediaSeeked.bind(this), s.addEventListener("playing", this.onvplaying), s.addEventListener("seeked", this.onvseeked), this.gapController = new Dc(this.config, s, this.fragmentTracker, this.hls);
  }
  onMediaDetaching() {
    const {
      media: e
    } = this;
    e && this.onvplaying && this.onvseeked && (e.removeEventListener("playing", this.onvplaying), e.removeEventListener("seeked", this.onvseeked), this.onvplaying = this.onvseeked = null, this.videoBuffer = null), this.fragPlaying = null, this.gapController && (this.gapController.destroy(), this.gapController = null), super.onMediaDetaching();
  }
  onMediaPlaying() {
    this.tick();
  }
  onMediaSeeked() {
    const e = this.media, t = e ? e.currentTime : null;
    O(t) && this.log(`Media seeked to ${t.toFixed(3)}`);
    const s = this.getMainFwdBufferInfo();
    if (s === null || s.len === 0) {
      this.warn(`Main forward buffer length on "seeked" event ${s ? s.len : "empty"})`);
      return;
    }
    this.tick();
  }
  onManifestLoading() {
    this.log("Trigger BUFFER_RESET"), this.hls.trigger(y.BUFFER_RESET, void 0), this.fragmentTracker.removeAllFragments(), this.couldBacktrack = !1, this.startPosition = this.lastCurrentTime = this.fragLastKbps = 0, this.levels = this.fragPlaying = this.backtrackFragment = this.levelLastLoaded = null, this.altAudio = this.audioOnly = this.startFragRequested = !1;
  }
  onManifestParsed(e, t) {
    let s = !1, i = !1;
    t.levels.forEach((n) => {
      const r = n.audioCodec;
      r && (s = s || r.indexOf("mp4a.40.2") !== -1, i = i || r.indexOf("mp4a.40.5") !== -1);
    }), this.audioCodecSwitch = s && i && !wc(), this.audioCodecSwitch && this.log("Both AAC/HE-AAC audio found in levels; declaring level codec as HE-AAC"), this.levels = t.levels, this.startFragRequested = !1;
  }
  onLevelLoading(e, t) {
    const {
      levels: s
    } = this;
    if (!s || this.state !== D.IDLE)
      return;
    const i = s[t.level];
    (!i.details || i.details.live && this.levelLastLoaded !== i || this.waitForCdnTuneIn(i.details)) && (this.state = D.WAITING_LEVEL);
  }
  onLevelLoaded(e, t) {
    var s;
    const {
      levels: i
    } = this, n = t.level, r = t.details, o = r.totalduration;
    if (!i) {
      this.warn(`Levels were reset while loading level ${n}`);
      return;
    }
    this.log(`Level ${n} loaded [${r.startSN},${r.endSN}]${r.lastPartSn ? `[part-${r.lastPartSn}-${r.lastPartIndex}]` : ""}, cc [${r.startCC}, ${r.endCC}] duration:${o}`);
    const l = i[n], c = this.fragCurrent;
    c && (this.state === D.FRAG_LOADING || this.state === D.FRAG_LOADING_WAITING_RETRY) && c.level !== t.level && c.loader && this.abortCurrentFrag();
    let h = 0;
    if (r.live || (s = l.details) != null && s.live) {
      var u;
      if (this.checkLiveUpdate(r), r.deltaUpdateFailed)
        return;
      h = this.alignPlaylists(r, l.details, (u = this.levelLastLoaded) == null ? void 0 : u.details);
    }
    if (l.details = r, this.levelLastLoaded = l, this.hls.trigger(y.LEVEL_UPDATED, {
      details: r,
      level: n
    }), this.state === D.WAITING_LEVEL) {
      if (this.waitForCdnTuneIn(r))
        return;
      this.state = D.IDLE;
    }
    this.startFragRequested ? r.live && this.synchronizeToLiveEdge(r) : this.setStartPosition(r, h), this.tick();
  }
  _handleFragmentLoadProgress(e) {
    var t;
    const {
      frag: s,
      part: i,
      payload: n
    } = e, {
      levels: r
    } = this;
    if (!r) {
      this.warn(`Levels were reset while fragment load was in progress. Fragment ${s.sn} of level ${s.level} will not be buffered`);
      return;
    }
    const o = r[s.level], l = o.details;
    if (!l) {
      this.warn(`Dropping fragment ${s.sn} of level ${s.level} after level details were reset`), this.fragmentTracker.removeFragment(s);
      return;
    }
    const c = o.videoCodec, h = l.PTSKnown || !l.live, u = (t = s.initSegment) == null ? void 0 : t.data, d = this._getAudioCodec(o), f = this.transmuxer = this.transmuxer || new Vn(this.hls, H.MAIN, this._handleTransmuxComplete.bind(this), this._handleTransmuxerFlush.bind(this)), m = i ? i.index : -1, p = m !== -1, g = new Ds(s.level, s.sn, s.stats.chunkCount, n.byteLength, m, p), v = this.initPTS[s.cc];
    f.push(n, u, d, c, s, i, l.totalduration, h, g, v);
  }
  onAudioTrackSwitching(e, t) {
    const s = this.altAudio;
    if (!!!t.url) {
      if (this.mediaBuffer !== this.media) {
        this.log("Switching on main audio, use media.buffered to schedule main fragment loading"), this.mediaBuffer = this.media;
        const r = this.fragCurrent;
        r && (this.log("Switching to main audio track, cancel main fragment load"), r.abortRequests(), this.fragmentTracker.removeFragment(r)), this.resetTransmuxer(), this.resetLoadingState();
      } else
        this.audioOnly && this.resetTransmuxer();
      const n = this.hls;
      s && (n.trigger(y.BUFFER_FLUSHING, {
        startOffset: 0,
        endOffset: Number.POSITIVE_INFINITY,
        type: null
      }), this.fragmentTracker.removeAllFragments()), n.trigger(y.AUDIO_TRACK_SWITCHED, t);
    }
  }
  onAudioTrackSwitched(e, t) {
    const s = t.id, i = !!this.hls.audioTracks[s].url;
    if (i) {
      const n = this.videoBuffer;
      n && this.mediaBuffer !== n && (this.log("Switching on alternate audio, use video.buffered to schedule main fragment loading"), this.mediaBuffer = n);
    }
    this.altAudio = i, this.tick();
  }
  onBufferCreated(e, t) {
    const s = t.tracks;
    let i, n, r = !1;
    for (const o in s) {
      const l = s[o];
      if (l.id === "main") {
        if (n = o, i = l, o === "video") {
          const c = s[o];
          c && (this.videoBuffer = c.buffer);
        }
      } else
        r = !0;
    }
    r && i ? (this.log(`Alternate track found, use ${n}.buffered to schedule main fragment loading`), this.mediaBuffer = i.buffer) : this.mediaBuffer = this.media;
  }
  onFragBuffered(e, t) {
    const {
      frag: s,
      part: i
    } = t;
    if (s && s.type !== H.MAIN)
      return;
    if (this.fragContextChanged(s)) {
      this.warn(`Fragment ${s.sn}${i ? " p: " + i.index : ""} of level ${s.level} finished buffering, but was aborted. state: ${this.state}`), this.state === D.PARSED && (this.state = D.IDLE);
      return;
    }
    const n = i ? i.stats : s.stats;
    this.fragLastKbps = Math.round(8 * n.total / (n.buffering.end - n.loading.first)), s.sn !== "initSegment" && (this.fragPrevious = s), this.fragBufferedComplete(s, i);
  }
  onError(e, t) {
    var s;
    if (t.fatal) {
      this.state = D.ERROR;
      return;
    }
    switch (t.details) {
      case A.FRAG_GAP:
      case A.FRAG_PARSING_ERROR:
      case A.FRAG_DECRYPT_ERROR:
      case A.FRAG_LOAD_ERROR:
      case A.FRAG_LOAD_TIMEOUT:
      case A.KEY_LOAD_ERROR:
      case A.KEY_LOAD_TIMEOUT:
        this.onFragmentOrKeyLoadError(H.MAIN, t);
        break;
      case A.LEVEL_LOAD_ERROR:
      case A.LEVEL_LOAD_TIMEOUT:
      case A.LEVEL_PARSING_ERROR:
        !t.levelRetry && this.state === D.WAITING_LEVEL && ((s = t.context) == null ? void 0 : s.type) === Y.LEVEL && (this.state = D.IDLE);
        break;
      case A.BUFFER_APPEND_ERROR:
      case A.BUFFER_FULL_ERROR:
        if (!t.parent || t.parent !== "main")
          return;
        if (t.details === A.BUFFER_APPEND_ERROR) {
          this.resetLoadingState();
          return;
        }
        this.reduceLengthAndFlushBuffer(t) && this.flushMainBuffer(0, Number.POSITIVE_INFINITY);
        break;
      case A.INTERNAL_EXCEPTION:
        this.recoverWorkerError(t);
        break;
    }
  }
  // Checks the health of the buffer and attempts to resolve playback stalls.
  checkBuffer() {
    const {
      media: e,
      gapController: t
    } = this;
    if (!(!e || !t || !e.readyState)) {
      if (this.loadedmetadata || !ee.getBuffered(e).length) {
        const s = this.state !== D.IDLE ? this.fragCurrent : null;
        t.poll(this.lastCurrentTime, s);
      }
      this.lastCurrentTime = e.currentTime;
    }
  }
  onFragLoadEmergencyAborted() {
    this.state = D.IDLE, this.loadedmetadata || (this.startFragRequested = !1, this.nextLoadPosition = this.startPosition), this.tickImmediate();
  }
  onBufferFlushed(e, {
    type: t
  }) {
    if (t !== X.AUDIO || this.audioOnly && !this.altAudio) {
      const s = (t === X.VIDEO ? this.videoBuffer : this.mediaBuffer) || this.media;
      this.afterBufferFlushed(s, t, H.MAIN), this.tick();
    }
  }
  onLevelsUpdated(e, t) {
    this.level > -1 && this.fragCurrent && (this.level = this.fragCurrent.level), this.levels = t.levels;
  }
  swapAudioCodec() {
    this.audioCodecSwap = !this.audioCodecSwap;
  }
  /**
   * Seeks to the set startPosition if not equal to the mediaElement's current time.
   */
  seekToStartPos() {
    const {
      media: e
    } = this;
    if (!e)
      return;
    const t = e.currentTime;
    let s = this.startPosition;
    if (s >= 0 && t < s) {
      if (e.seeking) {
        this.log(`could not seek to ${s}, already seeking at ${t}`);
        return;
      }
      const i = ee.getBuffered(e), r = (i.length ? i.start(0) : 0) - s;
      r > 0 && (r < this.config.maxBufferHole || r < this.config.maxFragLookUpTolerance) && (this.log(`adjusting start position by ${r} to match buffer start`), s += r, this.startPosition = s), this.log(`seek to target start position ${s} from current time ${t}`), e.currentTime = s;
    }
  }
  _getAudioCodec(e) {
    let t = this.config.defaultAudioCodec || e.audioCodec;
    return this.audioCodecSwap && t && (this.log("Swapping audio codec"), t.indexOf("mp4a.40.5") !== -1 ? t = "mp4a.40.2" : t = "mp4a.40.5"), t;
  }
  _loadBitrateTestFrag(e, t) {
    e.bitrateTest = !0, this._doFragLoad(e, t).then((s) => {
      const {
        hls: i
      } = this;
      if (!s || this.fragContextChanged(e))
        return;
      t.fragmentError = 0, this.state = D.IDLE, this.startFragRequested = !1, this.bitrateTest = !1;
      const n = e.stats;
      n.parsing.start = n.parsing.end = n.buffering.start = n.buffering.end = self.performance.now(), i.trigger(y.FRAG_LOADED, s), e.bitrateTest = !1;
    });
  }
  _handleTransmuxComplete(e) {
    var t;
    const s = "main", {
      hls: i
    } = this, {
      remuxResult: n,
      chunkMeta: r
    } = e, o = this.getCurrentContext(r);
    if (!o) {
      this.resetWhenMissingContext(r);
      return;
    }
    const {
      frag: l,
      part: c,
      level: h
    } = o, {
      video: u,
      text: d,
      id3: f,
      initSegment: m
    } = n, {
      details: p
    } = h, g = this.altAudio ? void 0 : n.audio;
    if (this.fragContextChanged(l)) {
      this.fragmentTracker.removeFragment(l);
      return;
    }
    if (this.state = D.PARSING, m) {
      if (m != null && m.tracks) {
        const E = l.initSegment || l;
        this._bufferInitSegment(h, m.tracks, E, r), i.trigger(y.FRAG_PARSING_INIT_SEGMENT, {
          frag: E,
          id: s,
          tracks: m.tracks
        });
      }
      const v = m.initPTS, C = m.timescale;
      O(v) && (this.initPTS[l.cc] = {
        baseTime: v,
        timescale: C
      }, i.trigger(y.INIT_PTS_FOUND, {
        frag: l,
        id: s,
        initPTS: v,
        timescale: C
      }));
    }
    if (u && p && l.sn !== "initSegment") {
      const v = p.fragments[l.sn - 1 - p.startSN], C = l.sn === p.startSN, E = !v || l.cc > v.cc;
      if (n.independent !== !1) {
        const {
          startPTS: T,
          endPTS: x,
          startDTS: I,
          endDTS: L
        } = u;
        if (c)
          c.elementaryStreams[u.type] = {
            startPTS: T,
            endPTS: x,
            startDTS: I,
            endDTS: L
          };
        else if (u.firstKeyFrame && u.independent && r.id === 1 && !E && (this.couldBacktrack = !0), u.dropped && u.independent) {
          const w = this.getMainFwdBufferInfo(), R = (w ? w.end : this.getLoadPosition()) + this.config.maxBufferHole, k = u.firstKeyFramePTS ? u.firstKeyFramePTS : T;
          if (!C && R < k - this.config.maxBufferHole && !E) {
            this.backtrack(l);
            return;
          } else
            E && (l.gap = !0);
          l.setElementaryStreamInfo(u.type, l.start, x, l.start, L, !0);
        } else
          C && T > At && (l.gap = !0);
        l.setElementaryStreamInfo(u.type, T, x, I, L), this.backtrackFragment && (this.backtrackFragment = l), this.bufferFragmentData(u, l, c, r, C || E);
      } else if (C || E)
        l.gap = !0;
      else {
        this.backtrack(l);
        return;
      }
    }
    if (g) {
      const {
        startPTS: v,
        endPTS: C,
        startDTS: E,
        endDTS: T
      } = g;
      c && (c.elementaryStreams[X.AUDIO] = {
        startPTS: v,
        endPTS: C,
        startDTS: E,
        endDTS: T
      }), l.setElementaryStreamInfo(X.AUDIO, v, C, E, T), this.bufferFragmentData(g, l, c, r);
    }
    if (p && f != null && (t = f.samples) != null && t.length) {
      const v = {
        id: s,
        frag: l,
        details: p,
        samples: f.samples
      };
      i.trigger(y.FRAG_PARSING_METADATA, v);
    }
    if (p && d) {
      const v = {
        id: s,
        frag: l,
        details: p,
        samples: d.samples
      };
      i.trigger(y.FRAG_PARSING_USERDATA, v);
    }
  }
  _bufferInitSegment(e, t, s, i) {
    if (this.state !== D.PARSING)
      return;
    this.audioOnly = !!t.audio && !t.video, this.altAudio && !this.audioOnly && delete t.audio;
    const {
      audio: n,
      video: r,
      audiovideo: o
    } = t;
    if (n) {
      let l = e.audioCodec;
      const c = navigator.userAgent.toLowerCase();
      if (this.audioCodecSwitch) {
        l && (l.indexOf("mp4a.40.5") !== -1 ? l = "mp4a.40.2" : l = "mp4a.40.5");
        const h = n.metadata;
        h && "channelCount" in h && (h.channelCount || 1) !== 1 && c.indexOf("firefox") === -1 && (l = "mp4a.40.5");
      }
      l && l.indexOf("mp4a.40.5") !== -1 && c.indexOf("android") !== -1 && n.container !== "audio/mpeg" && (l = "mp4a.40.2", this.log(`Android: force audio codec to ${l}`)), e.audioCodec && e.audioCodec !== l && this.log(`Swapping manifest audio codec "${e.audioCodec}" for "${l}"`), n.levelCodec = l, n.id = "main", this.log(`Init audio buffer, container:${n.container}, codecs[selected/level/parsed]=[${l || ""}/${e.audioCodec || ""}/${n.codec}]`);
    }
    r && (r.levelCodec = e.videoCodec, r.id = "main", this.log(`Init video buffer, container:${r.container}, codecs[level/parsed]=[${e.videoCodec || ""}/${r.codec}]`)), o && this.log(`Init audiovideo buffer, container:${o.container}, codecs[level/parsed]=[${e.codecs}/${o.codec}]`), this.hls.trigger(y.BUFFER_CODECS, t), Object.keys(t).forEach((l) => {
      const h = t[l].initSegment;
      h != null && h.byteLength && this.hls.trigger(y.BUFFER_APPENDING, {
        type: l,
        data: h,
        frag: s,
        part: null,
        chunkMeta: i,
        parent: s.type
      });
    }), this.tickImmediate();
  }
  getMainFwdBufferInfo() {
    return this.getFwdBufferInfo(this.mediaBuffer ? this.mediaBuffer : this.media, H.MAIN);
  }
  backtrack(e) {
    this.couldBacktrack = !0, this.backtrackFragment = e, this.resetTransmuxer(), this.flushBufferGap(e), this.fragmentTracker.removeFragment(e), this.fragPrevious = null, this.nextLoadPosition = e.start, this.state = D.IDLE;
  }
  checkFragmentChanged() {
    const e = this.media;
    let t = null;
    if (e && e.readyState > 1 && e.seeking === !1) {
      const s = e.currentTime;
      if (ee.isBuffered(e, s) ? t = this.getAppendedFrag(s) : ee.isBuffered(e, s + 0.1) && (t = this.getAppendedFrag(s + 0.1)), t) {
        this.backtrackFragment = null;
        const i = this.fragPlaying, n = t.level;
        (!i || t.sn !== i.sn || i.level !== n) && (this.fragPlaying = t, this.hls.trigger(y.FRAG_CHANGED, {
          frag: t
        }), (!i || i.level !== n) && this.hls.trigger(y.LEVEL_SWITCHED, {
          level: n
        }));
      }
    }
  }
  get nextLevel() {
    const e = this.nextBufferedFrag;
    return e ? e.level : -1;
  }
  get currentFrag() {
    const e = this.media;
    return e ? this.fragPlaying || this.getAppendedFrag(e.currentTime) : null;
  }
  get currentProgramDateTime() {
    const e = this.media;
    if (e) {
      const t = e.currentTime, s = this.currentFrag;
      if (s && O(t) && O(s.programDateTime)) {
        const i = s.programDateTime + (t - s.start) * 1e3;
        return new Date(i);
      }
    }
    return null;
  }
  get currentLevel() {
    const e = this.currentFrag;
    return e ? e.level : -1;
  }
  get nextBufferedFrag() {
    const e = this.currentFrag;
    return e ? this.followingBufferedFrag(e) : null;
  }
  get forceStartLoad() {
    return this._forceStartLoad;
  }
}
class J {
  /**
   * Get the video-dev/hls.js package version.
   */
  static get version() {
    return "1.5.13";
  }
  /**
   * Check if the required MediaSource Extensions are available.
   */
  static isMSESupported() {
    return or();
  }
  /**
   * Check if MediaSource Extensions are available and isTypeSupported checks pass for any baseline codecs.
   */
  static isSupported() {
    return Ac();
  }
  /**
   * Get the MediaSource global used for MSE playback (ManagedMediaSource, MediaSource, or WebKitMediaSource).
   */
  static getMediaSource() {
    return Ve();
  }
  static get Events() {
    return y;
  }
  static get ErrorTypes() {
    return K;
  }
  static get ErrorDetails() {
    return A;
  }
  /**
   * Get the default configuration applied to new instances.
   */
  static get DefaultConfig() {
    return J.defaultConfig ? J.defaultConfig : rr;
  }
  /**
   * Replace the default configuration applied to new instances.
   */
  static set DefaultConfig(e) {
    J.defaultConfig = e;
  }
  /**
   * Creates an instance of an HLS client that can attach to exactly one `HTMLMediaElement`.
   * @param userConfig - Configuration options applied over `Hls.DefaultConfig`
   */
  constructor(e = {}) {
    this.config = void 0, this.userConfig = void 0, this.coreComponents = void 0, this.networkControllers = void 0, this.started = !1, this._emitter = new Bs(), this._autoLevelCapping = -1, this._maxHdcpLevel = null, this.abrController = void 0, this.bufferController = void 0, this.capLevelController = void 0, this.latencyController = void 0, this.levelController = void 0, this.streamController = void 0, this.audioTrackController = void 0, this.subtitleTrackController = void 0, this.emeController = void 0, this.cmcdController = void 0, this._media = null, this.url = null, this.triggeringException = void 0, Tr(e.debug || !1, "Hls instance");
    const t = this.config = xc(J.DefaultConfig, e);
    this.userConfig = e, t.progressive && Sc(t);
    const {
      abrController: s,
      bufferController: i,
      capLevelController: n,
      errorController: r,
      fpsController: o
    } = t, l = new r(this), c = this.abrController = new s(this), h = this.bufferController = new i(this), u = this.capLevelController = new n(this), d = new o(this), f = new ma(this), m = new Ca(this), p = t.contentSteeringController, g = p ? new p(this) : null, v = this.levelController = new bc(this, g), C = new Za(this), E = new Lc(this.config), T = this.streamController = new Pc(this, C, E);
    u.setStreamController(T), d.setStreamController(T);
    const x = [f, v, T];
    g && x.splice(1, 0, g), this.networkControllers = x;
    const I = [c, h, u, d, m, C];
    this.audioTrackController = this.createController(t.audioTrackController, x);
    const L = t.audioStreamController;
    L && x.push(new L(this, C, E)), this.subtitleTrackController = this.createController(t.subtitleTrackController, x);
    const w = t.subtitleStreamController;
    w && x.push(new w(this, C, E)), this.createController(t.timelineController, I), E.emeController = this.emeController = this.createController(t.emeController, I), this.cmcdController = this.createController(t.cmcdController, I), this.latencyController = this.createController(Ta, I), this.coreComponents = I, x.push(l);
    const R = l.onErrorOut;
    typeof R == "function" && this.on(y.ERROR, R, l);
  }
  createController(e, t) {
    if (e) {
      const s = new e(this);
      return t && t.push(s), s;
    }
    return null;
  }
  // Delegate the EventEmitter through the public API of Hls.js
  on(e, t, s = this) {
    this._emitter.on(e, t, s);
  }
  once(e, t, s = this) {
    this._emitter.once(e, t, s);
  }
  removeAllListeners(e) {
    this._emitter.removeAllListeners(e);
  }
  off(e, t, s = this, i) {
    this._emitter.off(e, t, s, i);
  }
  listeners(e) {
    return this._emitter.listeners(e);
  }
  emit(e, t, s) {
    return this._emitter.emit(e, t, s);
  }
  trigger(e, t) {
    if (this.config.debug)
      return this.emit(e, e, t);
    try {
      return this.emit(e, e, t);
    } catch (s) {
      if (S.error("An internal error happened while handling event " + e + '. Error message: "' + s.message + '". Here is a stacktrace:', s), !this.triggeringException) {
        this.triggeringException = !0;
        const i = e === y.ERROR;
        this.trigger(y.ERROR, {
          type: K.OTHER_ERROR,
          details: A.INTERNAL_EXCEPTION,
          fatal: i,
          event: e,
          error: s
        }), this.triggeringException = !1;
      }
    }
    return !1;
  }
  listenerCount(e) {
    return this._emitter.listenerCount(e);
  }
  /**
   * Dispose of the instance
   */
  destroy() {
    S.log("destroy"), this.trigger(y.DESTROYING, void 0), this.detachMedia(), this.removeAllListeners(), this._autoLevelCapping = -1, this.url = null, this.networkControllers.forEach((t) => t.destroy()), this.networkControllers.length = 0, this.coreComponents.forEach((t) => t.destroy()), this.coreComponents.length = 0;
    const e = this.config;
    e.xhrSetup = e.fetchSetup = void 0, this.userConfig = null;
  }
  /**
   * Attaches Hls.js to a media element
   */
  attachMedia(e) {
    S.log("attachMedia"), this._media = e, this.trigger(y.MEDIA_ATTACHING, {
      media: e
    });
  }
  /**
   * Detach Hls.js from the media
   */
  detachMedia() {
    S.log("detachMedia"), this.trigger(y.MEDIA_DETACHING, void 0), this._media = null;
  }
  /**
   * Set the source URL. Can be relative or absolute.
   */
  loadSource(e) {
    this.stopLoad();
    const t = this.media, s = this.url, i = this.url = Ls.buildAbsoluteURL(self.location.href, e, {
      alwaysNormalize: !0
    });
    this._autoLevelCapping = -1, this._maxHdcpLevel = null, S.log(`loadSource:${i}`), t && s && (s !== i || this.bufferController.hasSourceTypes()) && (this.detachMedia(), this.attachMedia(t)), this.trigger(y.MANIFEST_LOADING, {
      url: e
    });
  }
  /**
   * Start loading data from the stream source.
   * Depending on default config, client starts loading automatically when a source is set.
   *
   * @param startPosition - Set the start position to stream from.
   * Defaults to -1 (None: starts from earliest point)
   */
  startLoad(e = -1) {
    S.log(`startLoad(${e})`), this.started = !0, this.networkControllers.forEach((t) => {
      t.startLoad(e);
    });
  }
  /**
   * Stop loading of any stream data.
   */
  stopLoad() {
    S.log("stopLoad"), this.started = !1, this.networkControllers.forEach((e) => {
      e.stopLoad();
    });
  }
  /**
   * Resumes stream controller segment loading if previously started.
   */
  resumeBuffering() {
    this.started && this.networkControllers.forEach((e) => {
      "fragmentLoader" in e && e.startLoad(-1);
    });
  }
  /**
   * Stops stream controller segment loading without changing 'started' state like stopLoad().
   * This allows for media buffering to be paused without interupting playlist loading.
   */
  pauseBuffering() {
    this.networkControllers.forEach((e) => {
      "fragmentLoader" in e && e.stopLoad();
    });
  }
  /**
   * Swap through possible audio codecs in the stream (for example to switch from stereo to 5.1)
   */
  swapAudioCodec() {
    S.log("swapAudioCodec"), this.streamController.swapAudioCodec();
  }
  /**
   * When the media-element fails, this allows to detach and then re-attach it
   * as one call (convenience method).
   *
   * Automatic recovery of media-errors by this process is configurable.
   */
  recoverMediaError() {
    S.log("recoverMediaError");
    const e = this._media;
    this.detachMedia(), e && this.attachMedia(e);
  }
  removeLevel(e) {
    this.levelController.removeLevel(e);
  }
  /**
   * @returns an array of levels (variants) sorted by HDCP-LEVEL, RESOLUTION (height), FRAME-RATE, CODECS, VIDEO-RANGE, and BANDWIDTH
   */
  get levels() {
    const e = this.levelController.levels;
    return e || [];
  }
  /**
   * Index of quality level (variant) currently played
   */
  get currentLevel() {
    return this.streamController.currentLevel;
  }
  /**
   * Set quality level index immediately. This will flush the current buffer to replace the quality asap. That means playback will interrupt at least shortly to re-buffer and re-sync eventually. Set to -1 for automatic level selection.
   */
  set currentLevel(e) {
    S.log(`set currentLevel:${e}`), this.levelController.manualLevel = e, this.streamController.immediateLevelSwitch();
  }
  /**
   * Index of next quality level loaded as scheduled by stream controller.
   */
  get nextLevel() {
    return this.streamController.nextLevel;
  }
  /**
   * Set quality level index for next loaded data.
   * This will switch the video quality asap, without interrupting playback.
   * May abort current loading of data, and flush parts of buffer (outside currently played fragment region).
   * @param newLevel - Pass -1 for automatic level selection
   */
  set nextLevel(e) {
    S.log(`set nextLevel:${e}`), this.levelController.manualLevel = e, this.streamController.nextLevelSwitch();
  }
  /**
   * Return the quality level of the currently or last (of none is loaded currently) segment
   */
  get loadLevel() {
    return this.levelController.level;
  }
  /**
   * Set quality level index for next loaded data in a conservative way.
   * This will switch the quality without flushing, but interrupt current loading.
   * Thus the moment when the quality switch will appear in effect will only be after the already existing buffer.
   * @param newLevel - Pass -1 for automatic level selection
   */
  set loadLevel(e) {
    S.log(`set loadLevel:${e}`), this.levelController.manualLevel = e;
  }
  /**
   * get next quality level loaded
   */
  get nextLoadLevel() {
    return this.levelController.nextLoadLevel;
  }
  /**
   * Set quality level of next loaded segment in a fully "non-destructive" way.
   * Same as `loadLevel` but will wait for next switch (until current loading is done).
   */
  set nextLoadLevel(e) {
    this.levelController.nextLoadLevel = e;
  }
  /**
   * Return "first level": like a default level, if not set,
   * falls back to index of first level referenced in manifest
   */
  get firstLevel() {
    return Math.max(this.levelController.firstLevel, this.minAutoLevel);
  }
  /**
   * Sets "first-level", see getter.
   */
  set firstLevel(e) {
    S.log(`set firstLevel:${e}`), this.levelController.firstLevel = e;
  }
  /**
   * Return the desired start level for the first fragment that will be loaded.
   * The default value of -1 indicates automatic start level selection.
   * Setting hls.nextAutoLevel without setting a startLevel will result in
   * the nextAutoLevel value being used for one fragment load.
   */
  get startLevel() {
    const e = this.levelController.startLevel;
    return e === -1 && this.abrController.forcedAutoLevel > -1 ? this.abrController.forcedAutoLevel : e;
  }
  /**
   * set  start level (level of first fragment that will be played back)
   * if not overrided by user, first level appearing in manifest will be used as start level
   * if -1 : automatic start level selection, playback will start from level matching download bandwidth
   * (determined from download of first segment)
   */
  set startLevel(e) {
    S.log(`set startLevel:${e}`), e !== -1 && (e = Math.max(e, this.minAutoLevel)), this.levelController.startLevel = e;
  }
  /**
   * Whether level capping is enabled.
   * Default value is set via `config.capLevelToPlayerSize`.
   */
  get capLevelToPlayerSize() {
    return this.config.capLevelToPlayerSize;
  }
  /**
   * Enables or disables level capping. If disabled after previously enabled, `nextLevelSwitch` will be immediately called.
   */
  set capLevelToPlayerSize(e) {
    const t = !!e;
    t !== this.config.capLevelToPlayerSize && (t ? this.capLevelController.startCapping() : (this.capLevelController.stopCapping(), this.autoLevelCapping = -1, this.streamController.nextLevelSwitch()), this.config.capLevelToPlayerSize = t);
  }
  /**
   * Capping/max level value that should be used by automatic level selection algorithm (`ABRController`)
   */
  get autoLevelCapping() {
    return this._autoLevelCapping;
  }
  /**
   * Returns the current bandwidth estimate in bits per second, when available. Otherwise, `NaN` is returned.
   */
  get bandwidthEstimate() {
    const {
      bwEstimator: e
    } = this.abrController;
    return e ? e.getEstimate() : NaN;
  }
  set bandwidthEstimate(e) {
    this.abrController.resetEstimator(e);
  }
  /**
   * get time to first byte estimate
   * @type {number}
   */
  get ttfbEstimate() {
    const {
      bwEstimator: e
    } = this.abrController;
    return e ? e.getEstimateTTFB() : NaN;
  }
  /**
   * Capping/max level value that should be used by automatic level selection algorithm (`ABRController`)
   */
  set autoLevelCapping(e) {
    this._autoLevelCapping !== e && (S.log(`set autoLevelCapping:${e}`), this._autoLevelCapping = e, this.levelController.checkMaxAutoUpdated());
  }
  get maxHdcpLevel() {
    return this._maxHdcpLevel;
  }
  set maxHdcpLevel(e) {
    Ea(e) && this._maxHdcpLevel !== e && (this._maxHdcpLevel = e, this.levelController.checkMaxAutoUpdated());
  }
  /**
   * True when automatic level selection enabled
   */
  get autoLevelEnabled() {
    return this.levelController.manualLevel === -1;
  }
  /**
   * Level set manually (if any)
   */
  get manualLevel() {
    return this.levelController.manualLevel;
  }
  /**
   * min level selectable in auto mode according to config.minAutoBitrate
   */
  get minAutoLevel() {
    const {
      levels: e,
      config: {
        minAutoBitrate: t
      }
    } = this;
    if (!e)
      return 0;
    const s = e.length;
    for (let i = 0; i < s; i++)
      if (e[i].maxBitrate >= t)
        return i;
    return 0;
  }
  /**
   * max level selectable in auto mode according to autoLevelCapping
   */
  get maxAutoLevel() {
    const {
      levels: e,
      autoLevelCapping: t,
      maxHdcpLevel: s
    } = this;
    let i;
    if (t === -1 && e != null && e.length ? i = e.length - 1 : i = t, s)
      for (let n = i; n--; ) {
        const r = e[n].attrs["HDCP-LEVEL"];
        if (r && r <= s)
          return n;
      }
    return i;
  }
  get firstAutoLevel() {
    return this.abrController.firstAutoLevel;
  }
  /**
   * next automatically selected quality level
   */
  get nextAutoLevel() {
    return this.abrController.nextAutoLevel;
  }
  /**
   * this setter is used to force next auto level.
   * this is useful to force a switch down in auto mode:
   * in case of load error on level N, hls.js can set nextAutoLevel to N-1 for example)
   * forced value is valid for one fragment. upon successful frag loading at forced level,
   * this value will be resetted to -1 by ABR controller.
   */
  set nextAutoLevel(e) {
    this.abrController.nextAutoLevel = e;
  }
  /**
   * get the datetime value relative to media.currentTime for the active level Program Date Time if present
   */
  get playingDate() {
    return this.streamController.currentProgramDateTime;
  }
  get mainForwardBufferInfo() {
    return this.streamController.getMainFwdBufferInfo();
  }
  /**
   * Find and select the best matching audio track, making a level switch when a Group change is necessary.
   * Updates `hls.config.audioPreference`. Returns the selected track, or null when no matching track is found.
   */
  setAudioOption(e) {
    var t;
    return (t = this.audioTrackController) == null ? void 0 : t.setAudioOption(e);
  }
  /**
   * Find and select the best matching subtitle track, making a level switch when a Group change is necessary.
   * Updates `hls.config.subtitlePreference`. Returns the selected track, or null when no matching track is found.
   */
  setSubtitleOption(e) {
    var t;
    return (t = this.subtitleTrackController) == null || t.setSubtitleOption(e), null;
  }
  /**
   * Get the complete list of audio tracks across all media groups
   */
  get allAudioTracks() {
    const e = this.audioTrackController;
    return e ? e.allAudioTracks : [];
  }
  /**
   * Get the list of selectable audio tracks
   */
  get audioTracks() {
    const e = this.audioTrackController;
    return e ? e.audioTracks : [];
  }
  /**
   * index of the selected audio track (index in audio track lists)
   */
  get audioTrack() {
    const e = this.audioTrackController;
    return e ? e.audioTrack : -1;
  }
  /**
   * selects an audio track, based on its index in audio track lists
   */
  set audioTrack(e) {
    const t = this.audioTrackController;
    t && (t.audioTrack = e);
  }
  /**
   * get the complete list of subtitle tracks across all media groups
   */
  get allSubtitleTracks() {
    const e = this.subtitleTrackController;
    return e ? e.allSubtitleTracks : [];
  }
  /**
   * get alternate subtitle tracks list from playlist
   */
  get subtitleTracks() {
    const e = this.subtitleTrackController;
    return e ? e.subtitleTracks : [];
  }
  /**
   * index of the selected subtitle track (index in subtitle track lists)
   */
  get subtitleTrack() {
    const e = this.subtitleTrackController;
    return e ? e.subtitleTrack : -1;
  }
  get media() {
    return this._media;
  }
  /**
   * select an subtitle track, based on its index in subtitle track lists
   */
  set subtitleTrack(e) {
    const t = this.subtitleTrackController;
    t && (t.subtitleTrack = e);
  }
  /**
   * Whether subtitle display is enabled or not
   */
  get subtitleDisplay() {
    const e = this.subtitleTrackController;
    return e ? e.subtitleDisplay : !1;
  }
  /**
   * Enable/disable subtitle display rendering
   */
  set subtitleDisplay(e) {
    const t = this.subtitleTrackController;
    t && (t.subtitleDisplay = e);
  }
  /**
   * get mode for Low-Latency HLS loading
   */
  get lowLatencyMode() {
    return this.config.lowLatencyMode;
  }
  /**
   * Enable/disable Low-Latency HLS part playlist and segment loading, and start live streams at playlist PART-HOLD-BACK rather than HOLD-BACK.
   */
  set lowLatencyMode(e) {
    this.config.lowLatencyMode = e;
  }
  /**
   * Position (in seconds) of live sync point (ie edge of live position minus safety delay defined by ```hls.config.liveSyncDuration```)
   * @returns null prior to loading live Playlist
   */
  get liveSyncPosition() {
    return this.latencyController.liveSyncPosition;
  }
  /**
   * Estimated position (in seconds) of live edge (ie edge of live playlist plus time sync playlist advanced)
   * @returns 0 before first playlist is loaded
   */
  get latency() {
    return this.latencyController.latency;
  }
  /**
   * maximum distance from the edge before the player seeks forward to ```hls.liveSyncPosition```
   * configured using ```liveMaxLatencyDurationCount``` (multiple of target duration) or ```liveMaxLatencyDuration```
   * @returns 0 before first playlist is loaded
   */
  get maxLatency() {
    return this.latencyController.maxLatency;
  }
  /**
   * target distance from the edge as calculated by the latency controller
   */
  get targetLatency() {
    return this.latencyController.targetLatency;
  }
  /**
   * the rate at which the edge of the current live playlist is advancing or 1 if there is none
   */
  get drift() {
    return this.latencyController.drift;
  }
  /**
   * set to true when startLoad is called before MANIFEST_PARSED event
   */
  get forceStartLoad() {
    return this.streamController.forceStartLoad;
  }
}
J.defaultConfig = void 0;
var Bt = {};
(function(a) {
  (function() {
    var e = {
      direction: "horizontal",
      snapToLines: !0,
      linePosition: "auto",
      lineAlign: "start",
      textPosition: "auto",
      positionAlign: "auto",
      size: 100,
      alignment: "center"
    }, t = function(o) {
      o || (o = {
        "&amp": "&",
        "&lt": "<",
        "&gt": ">",
        "&lrm": "‎",
        "&rlm": "‏",
        "&nbsp": " "
      }), this.entities = o, this.parse = function(l, c) {
        l = l.replace(/\0/g, "�");
        var h = /\r\n|\r|\n/, u = Date.now(), d = 0, f = l.split(h), m = !1, p = [], g = [], v = [];
        function C(B, U) {
          v.push({ message: B, line: d + 1, col: U });
        }
        var E = f[d], T = E.length, x = "WEBVTT", I = 0, L = x.length;
        for (E[0] === "\uFEFF" && (I = 1, L += 1), (T < L || E.indexOf(x) !== 0 + I || T > L && E[L] !== " " && E[L] !== "	") && C('No valid signature. (File needs to start with "WEBVTT".)'), d++; f[d] != "" && f[d] != null; ) {
          if (C("No blank line after the signature."), f[d].indexOf("-->") != -1) {
            m = !0;
            break;
          }
          d++;
        }
        for (; f[d] != null; ) {
          for (var w; !m && f[d] == ""; )
            d++;
          if (!m && f[d] == null)
            break;
          w = Object.assign({}, e, {
            id: "",
            startTime: 0,
            endTime: 0,
            pauseOnExit: !1,
            direction: "horizontal",
            snapToLines: !0,
            linePosition: "auto",
            lineAlign: "start",
            textPosition: "auto",
            positionAlign: "auto",
            size: 100,
            alignment: "center",
            text: "",
            tree: null
          });
          var R = !0;
          if (f[d].indexOf("-->") == -1) {
            if (w.id = f[d], /^NOTE($|[ \t])/.test(w.id)) {
              for (d++; f[d] != "" && f[d] != null; )
                f[d].indexOf("-->") != -1 && C("Cannot have timestamp in a comment."), d++;
              continue;
            }
            if (/^STYLE($|[ \t])/.test(w.id)) {
              var k = [], M = !1;
              for (d++; f[d] != "" && f[d] != null; )
                f[d].indexOf("-->") != -1 && (C("Cannot have timestamp in a style block."), M = !0), k.push(f[d]), d++;
              if (g.length) {
                C("Style blocks cannot appear after the first cue.");
                continue;
              }
              M || p.push(k.join(`
`));
              continue;
            }
            if (d++, f[d] == "" || f[d] == null) {
              C("Cue identifier cannot be standalone.");
              continue;
            }
            if (f[d].indexOf("-->") == -1) {
              R = !1, C("Cue identifier needs to be followed by timestamp.");
              continue;
            }
          }
          m = !1;
          var _ = new s(f[d], C), P = 0;
          if (g.length > 0 && (P = g[g.length - 1].startTime), R && !_.parse(w, P)) {
            for (w = null, d++; f[d] != "" && f[d] != null; ) {
              if (f[d].indexOf("-->") != -1) {
                m = !0;
                break;
              }
              d++;
            }
            continue;
          }
          for (d++; f[d] != "" && f[d] != null; ) {
            if (f[d].indexOf("-->") != -1) {
              C("Blank line missing before cue."), m = !0;
              break;
            }
            w.text != "" && (w.text += `
`), w.text += f[d], d++;
          }
          var G = new i(w.text, C, c, o);
          w.tree = G.parse(w.startTime, w.endTime), g.push(w);
        }
        return g.sort(function(B, U) {
          return B.startTime < U.startTime ? -1 : B.startTime > U.startTime ? 1 : B.endTime > U.endTime ? -1 : B.endTime < U.endTime ? 1 : 0;
        }), { cues: g, errors: v, time: Date.now() - u, styles: p };
      };
    }, s = function(u, l) {
      var c = /[\u0020\t\f]/, h = /[^\u0020\t\f]/, u = u, d = 0, f = function(C) {
        l(C, d + 1);
      };
      function m(C) {
        for (; u[d] != null && C.test(u[d]); )
          d++;
      }
      function p(C) {
        for (var E = ""; u[d] != null && C.test(u[d]); )
          E += u[d], d++;
        return E;
      }
      function g() {
        var C = "minutes", E, T, x, I;
        if (u[d] == null) {
          f("No timestamp found.");
          return;
        }
        if (!/\d/.test(u[d])) {
          f("Timestamp must start with a character in the range 0-9.");
          return;
        }
        if (E = p(/\d/), (E.length > 2 || parseInt(E, 10) > 59) && (C = "hours"), u[d] != ":") {
          f("No time unit separator found.");
          return;
        }
        if (d++, T = p(/\d/), T.length != 2) {
          f("Must be exactly two digits.");
          return;
        }
        if (C == "hours" || u[d] == ":") {
          if (u[d] != ":") {
            f("No seconds found or minutes is greater than 59.");
            return;
          }
          if (d++, x = p(/\d/), x.length != 2) {
            f("Must be exactly two digits.");
            return;
          }
        } else {
          if (E.length != 2) {
            f("Must be exactly two digits.");
            return;
          }
          x = T, T = E, E = "0";
        }
        if (u[d] != ".") {
          f('No decimal separator (".") found.');
          return;
        }
        if (d++, I = p(/\d/), I.length != 3) {
          f("Milliseconds must be given in three digits.");
          return;
        }
        if (parseInt(T, 10) > 59) {
          f("You cannot have more than 59 minutes.");
          return;
        }
        if (parseInt(x, 10) > 59) {
          f("You cannot have more than 59 seconds.");
          return;
        }
        return parseInt(E, 10) * 60 * 60 + parseInt(T, 10) * 60 + parseInt(x, 10) + parseInt(I, 10) / 1e3;
      }
      function v(C, E) {
        for (var T = C.split(c), x = [], I = 0; I < T.length; I++)
          if (T[I] != "") {
            var L = T[I].indexOf(":"), w = T[I].slice(0, L), R = T[I].slice(L + 1);
            if (x.indexOf(w) != -1 && f("Duplicate setting."), x.push(w), R == "") {
              f("No value for setting defined.");
              return;
            }
            if (w == "vertical") {
              if (R != "rl" && R != "lr") {
                f("Writing direction can only be set to 'rl' or 'rl'.");
                continue;
              }
              E.direction = R;
            } else if (w == "line") {
              if (/,/.test(R)) {
                var k = R.split(",");
                R = k[0];
                var M = k[1];
              }
              if (!/^[-\d](\d*)(\.\d+)?%?$/.test(R)) {
                f("Line position takes a number or percentage.");
                continue;
              }
              if (R.indexOf("-", 1) != -1) {
                f("Line position can only have '-' at the start.");
                continue;
              }
              if (R.indexOf("%") != -1 && R.indexOf("%") != R.length - 1) {
                f("Line position can only have '%' at the end.");
                continue;
              }
              if (R[0] == "-" && R[R.length - 1] == "%") {
                f("Line position cannot be a negative percentage.");
                continue;
              }
              var _ = R, P = !1;
              if (R[R.length - 1] == "%" && (P = !0, _ = R.slice(0, R.length - 1), parseInt(R, 10) > 100)) {
                f("Line position cannot be >100%.");
                continue;
              }
              if (_ === "" || isNaN(_) || !isFinite(_)) {
                f("Line position needs to be a number");
                continue;
              }
              if (M !== void 0) {
                if (!["start", "center", "end"].includes(M)) {
                  f("Line alignment needs to be one of start, center or end");
                  continue;
                }
                E.lineAlign = M;
              }
              E.snapToLines = !P, E.linePosition = parseFloat(_), parseFloat(_).toString() !== _ && (E.nonSerializable = !0);
            } else if (w == "position") {
              if (/,/.test(R)) {
                var k = R.split(",");
                R = k[0];
                var G = k[1];
              }
              if (R[R.length - 1] != "%") {
                f("Text position must be a percentage.");
                continue;
              }
              if (parseInt(R, 10) > 100 || parseInt(R, 10) < 0) {
                f("Text position needs to be between 0 and 100%.");
                continue;
              }
              if (_ = R.slice(0, R.length - 1), _ === "" || isNaN(_) || !isFinite(_)) {
                f("Line position needs to be a number");
                continue;
              }
              if (G !== void 0) {
                if (!["line-left", "center", "line-right"].includes(G)) {
                  f("Position alignment needs to be one of line-left, center or line-right");
                  continue;
                }
                E.positionAlign = G;
              }
              E.textPosition = parseFloat(_);
            } else if (w == "size") {
              if (R[R.length - 1] != "%") {
                f("Size must be a percentage.");
                continue;
              }
              if (parseInt(R, 10) > 100) {
                f("Size cannot be >100%.");
                continue;
              }
              var B = R.slice(0, R.length - 1);
              if (B === void 0 || B === "" || isNaN(B)) {
                f("Size needs to be a number"), B = 100;
                continue;
              } else if (B = parseFloat(B), B < 0 || B > 100) {
                f("Size needs to be between 0 and 100%.");
                continue;
              }
              E.size = B;
            } else if (w == "align") {
              var U = ["start", "center", "end", "left", "right"];
              if (U.indexOf(R) == -1) {
                f("Alignment can only be set to one of " + U.join(", ") + ".");
                continue;
              }
              E.alignment = R;
            } else
              f("Invalid setting.");
          }
      }
      this.parse = function(C, E) {
        if (m(c), C.startTime = g(), C.startTime != null) {
          if (C.startTime < E && f("Start timestamp is not greater than or equal to start timestamp of previous cue."), h.test(u[d]) && f("Timestamp not separated from '-->' by whitespace."), m(c), u[d] != "-") {
            f("No valid timestamp separator found.");
            return;
          }
          if (d++, u[d] != "-") {
            f("No valid timestamp separator found.");
            return;
          }
          if (d++, u[d] != ">") {
            f("No valid timestamp separator found.");
            return;
          }
          if (d++, h.test(u[d]) && f("'-->' not separated from timestamp by whitespace."), m(c), C.endTime = g(), C.endTime != null)
            return C.endTime <= C.startTime && f("End timestamp is not greater than start timestamp."), h.test(u[d]), m(c), v(u.substring(d), C), !0;
        }
      }, this.parseTimestamp = function() {
        var C = g();
        if (u[d] != null) {
          f("Timestamp must not have trailing characters.");
          return;
        }
        return C;
      };
    }, i = function(d, l, c, h) {
      this.entities = h;
      var u = this, d = d, f = 0, m = function(g) {
        c != "metadata" && l(g, f + 1);
      };
      this.parse = function(g, v) {
        function C(_) {
          const P = { ..._ };
          return _.children && (P.children = _.children.map(C)), P.parent && delete P.parent, P;
        }
        var E = { children: [] }, T = E, x = [];
        function I(_) {
          T.children.push({ type: "object", name: _[1], classes: _[2], children: [], parent: T }), T = T.children[T.children.length - 1];
        }
        function L(_) {
          for (var P = T; P; ) {
            if (P.name == _)
              return !0;
            P = P.parent;
          }
        }
        for (; d[f] != null; ) {
          var w = p();
          if (w[0] == "text")
            T.children.push({ type: "text", value: w[1], parent: T });
          else if (w[0] == "start tag") {
            c == "chapters" && m("Start tags not allowed in chapter title text.");
            var R = w[1];
            R != "v" && R != "lang" && w[3] != "" && m("Only <v> and <lang> can have an annotation."), R == "c" || R == "i" || R == "b" || R == "u" || R == "ruby" || R == "rt" && T.name == "ruby" ? I(w) : R == "v" ? (L("v") && m("<v> cannot be nested inside itself."), I(w), T.value = w[3], w[3] || m("<v> requires an annotation.")) : R == "lang" ? (I(w), T.value = w[3]) : m("Incorrect start tag.");
          } else if (w[0] == "end tag")
            c == "chapters" && m("End tags not allowed in chapter title text."), w[1] == T.name ? T = T.parent : w[1] == "ruby" && T.name == "rt" ? T = T.parent.parent : m("Incorrect end tag.");
          else if (w[0] == "timestamp") {
            c == "chapters" && m("Timestamp not allowed in chapter title text.");
            var k = new s(w[1], m), M = k.parseTimestamp();
            M != null && ((M <= g || M >= v) && m("Timestamp must be between start timestamp and end timestamp."), x.length > 0 && x[x.length - 1] >= M && m("Timestamp must be greater than any previous timestamp."), T.children.push({ type: "timestamp", value: M, parent: T }), x.push(M));
          }
        }
        for (; T.parent; )
          T.name != "v" && m("Required end tag missing."), T = T.parent;
        return C(E);
      };
      function p() {
        for (var g = "data", v = "", C = "", E = []; d[f - 1] != null || f == 0; ) {
          var T = d[f];
          if (g == "data")
            if (T == "&")
              C = T, g = "escape";
            else if (T == "<" && v == "")
              g = "tag";
            else {
              if (T == "<" || T == null)
                return ["text", v];
              v += T;
            }
          else if (g == "escape")
            if (T == "<" || T == null) {
              m("Incorrect escape.");
              let x;
              return (x = C.match(/^&#([0-9]+)$/)) ? v += String.fromCharCode(x[1]) : u.entities[C] ? v += u.entities[C] : v += C, ["text", v];
            } else if (T == "&")
              m("Incorrect escape."), v += C, C = T;
            else if (/[a-z#0-9]/i.test(T))
              C += T;
            else if (T == ";") {
              let x;
              (x = C.match(/^&#(x?[0-9]+)$/)) ? v += String.fromCharCode("0" + x[1]) : u.entities[C + T] ? v += u.entities[C + T] : (x = Object.keys(h).find((I) => C.startsWith(I))) ? v += u.entities[x] + C.slice(x.length) + T : (m("Incorrect escape."), v += C + ";"), g = "data";
            } else
              m("Incorrect escape."), v += C + T, g = "data";
          else if (g == "tag")
            if (T == "	" || T == `
` || T == "\f" || T == " ")
              g = "start tag annotation";
            else if (T == ".")
              g = "start tag class";
            else if (T == "/")
              g = "end tag";
            else if (/\d/.test(T))
              v = T, g = "timestamp tag";
            else {
              if (T == ">" || T == null)
                return T == ">" && f++, ["start tag", "", [], ""];
              v = T, g = "start tag";
            }
          else if (g == "start tag")
            if (T == "	" || T == "\f" || T == " ")
              g = "start tag annotation";
            else if (T == `
`)
              C = T, g = "start tag annotation";
            else if (T == ".")
              g = "start tag class";
            else {
              if (T == ">" || T == null)
                return T == ">" && f++, ["start tag", v, [], ""];
              v += T;
            }
          else if (g == "start tag class")
            if (T == "	" || T == "\f" || T == " ")
              C && E.push(C), C = "", g = "start tag annotation";
            else if (T == `
`)
              C && E.push(C), C = T, g = "start tag annotation";
            else if (T == ".")
              C && E.push(C), C = "";
            else {
              if (T == ">" || T == null)
                return T == ">" && f++, C && E.push(C), ["start tag", v, E, ""];
              C += T;
            }
          else if (g == "start tag annotation") {
            if (T == ">" || T == null)
              return T == ">" && f++, C = C.split(/[\u0020\t\f\r\n]+/).filter(function(x) {
                if (x)
                  return !0;
              }).join(" "), ["start tag", v, E, C];
            C += T;
          } else if (g == "end tag") {
            if (T == ">" || T == null)
              return T == ">" && f++, ["end tag", v];
            v += T;
          } else if (g == "timestamp tag") {
            if (T == ">" || T == null)
              return T == ">" && f++, ["timestamp", v];
            v += T;
          } else
            m("Never happens.");
          f++;
        }
      }
    }, n = function() {
      function o(d) {
        const f = ("00" + (d - Math.floor(d)).toFixed(3) * 1e3).slice(-3);
        let m = 0, p = 0, g = 0;
        return d >= 3600 && (m = Math.floor(d / 3600)), p = Math.floor((d - 3600 * m) / 60), g = Math.floor(d - 3600 * m - 60 * p), (m ? m + ":" : "") + ("" + p).padStart(2, "0") + ":" + ("" + g).padStart(2, "0") + "." + f;
      }
      function l(d) {
        var f = "";
        const m = Object.keys(e).filter((p) => d[p] !== e[p]);
        return m.includes("direction") && (f += " vertical:" + d.direction), m.includes("alignment") && (f += " align:" + d.alignment), m.includes("size") && (f += " size:" + d.size + "%"), (m.includes("lineAlign") || m.includes("linePosition")) && (f += " line:" + d.linePosition + (d.snapToLines ? "" : "%") + (d.lineAlign && d.lineAlign != e.lineAlign ? "," + d.lineAlign : "")), (m.includes("textPosition") || m.includes("positionAlign")) && (f += " position:" + d.textPosition + "%" + (d.positionAlign && d.positionAlign !== e.positionAlign ? "," + d.positionAlign : "")), f;
      }
      function c(d) {
        for (var f = "", m = 0; m < d.length; m++) {
          var p = d[m];
          if (p.type == "text")
            f += p.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          else if (p.type == "object") {
            if (f += "<" + p.name, p.classes)
              for (var g = 0; g < p.classes.length; g++)
                f += "." + p.classes[g];
            p.value && (f += " " + p.value), f += ">", p.children && (f += c(p.children)), f += "</" + p.name + ">";
          } else
            p.type == "timestamp" ? f += "<" + o(p.value) + ">" : f += "<" + p.value + ">";
        }
        return f;
      }
      function h(d) {
        return (d.id !== void 0 ? d.id + `
` : "") + o(d.startTime) + " --> " + o(d.endTime) + l(d) + `
` + c(d.tree.children) + `

`;
      }
      function u(d) {
        return `STYLE
` + d + `

`;
      }
      this.serialize = function(d, f) {
        var m = `WEBVTT

`;
        if (f)
          for (var p = 0; p < f.length; p++)
            m += u(f[p]);
        for (var p = 0; p < d.length; p++)
          m += h(d[p]);
        return m;
      };
    };
    function r(o) {
      o.WebVTTParser = t, o.WebVTTCueTimingsAndSettingsParser = s, o.WebVTTCueTextParser = i, o.WebVTTSerializer = n;
    }
    typeof window < "u" && r(window), r(a);
  })();
})(Bt);
const be = (a) => {
  a = parseInt(a, 10);
  let e = parseInt(`${a / (3600 * 24)}`, 10), t = it(parseInt(`${a % 86400 / 3600}`, 10), 2), s = it(parseInt(`${a % 3600 / 60}`, 10), 2), i = it(parseInt(`${a % 60}`, 10), 2);
  return `${s}`.length === 1 && (s = `0${s}`), `${i}`.length === 1 && (i = `0${i}`), e === 0 ? e = "" : e = `${e}:`, t === 0 ? t = "00:" : t = `${t}:`, s === 0 ? s = "00:" : s = `${s}:`, t == "00:" && e == "" && (t = ""), (e + t + s + i).replace("NaN:NaN:NaN:NaN", "00:00");
}, it = (a, e = 2) => {
  if (typeof a < "u") {
    const t = e - a.toString().length + 1;
    return Array(+(t > 0 && t)).join("0") + a;
  }
  return "";
}, Ne = /* @__PURE__ */ new Map();
class Fc extends ur {
  constructor(e) {
    if (super(), this.translations = {}, this.message = {}, this.leftTap = {}, this.rightTap = {}, this.leeway = 300, this.seekInterval = 10, this.tapCount = 0, this.chapters = {}, this.currentChapterFile = "", this.fonts = [], this.currentFontFile = "", this.currentSkipFile = "", this.currentSubtitleIndex = 0, this.subtitles = {}, this.currentSubtitleFile = "", this.currentSpriteFile = "", this.playlist = [], this.currentPlaylistItem = {}, this.currentIndex = 0, this.isPlaying = !1, this.muted = !1, this.volume = 100, this.lockActive = !1, this.plugins = {}, this.stretchOptions = [
      "uniform",
      "fill",
      "exactfit",
      "none"
    ], this.currentAspectRatio = this.options.stretching ?? "uniform", this.allowFullscreen = !0, this.shouldFloat = !1, this.firstFrame = !1, this.getFileContents = async ({ url: t, options: s, callback: i }) => {
      const n = {
        "Accept-Language": s.language || "en"
      };
      this.options.accessToken && !s.anonymous && (n.Authorization = `Bearer ${this.options.accessToken}`);
      let r = "";
      return this.options.basePath && !t.startsWith("http") && (r = this.options.basePath), await fetch(r + t, {
        ...s,
        headers: n
      }).then(async (o) => {
        switch (s.type) {
          case "blob":
            i(await o.blob());
            break;
          case "json":
            i(await o.json());
            break;
          case "arrayBuffer":
            i(await o.arrayBuffer());
            break;
          case "text":
          default:
            i(await o.text());
            break;
        }
      }).catch((o) => {
        console.error("Failed to fetch file contents", o);
      });
    }, this.inactivityTimeout = null, this.inactivityTime = 5e3, !e && Ne.size == 0)
      throw new Error("No player element found");
    if (!e && Ne.size > 0)
      return Ne.values().next().value;
    if (typeof e == "number")
      throw Ne.forEach((t, s) => {
        if (parseInt(s, 10) === e)
          return t;
      }), new Error("Player not found");
    return Ne.has(e) ? Ne.get(e) : this.init(e);
  }
  init(e) {
    const t = document.querySelector(`#${e}`);
    if (!t)
      throw new Error(`Player element with ID ${e} not found`);
    if (t.nodeName !== "DIV")
      throw new Error("Element must be a div element");
    return this.playerId = e, this.container = t, this.plugins = {}, this.fetchTranslationsFile().then(), this.styleContainer(), this.createVideoElement(), this.createSubtitleOverlay(), this.createOverlayElement(), this.createOverlayCenterMessage(), Ne.set(e, this), this._removeEvents(), this._addEvents(), this;
  }
  registerPlugin(e, t) {
    this.plugins[e] = t, t.initialize(this), console.log(`Plugin ${e} registered.`);
  }
  usePlugin(e) {
    this.plugins[e] ? this.plugins[e].use() : console.error(`Plugin ${e} is not registered.`);
  }
  /**
      * Appends script and stylesheet files to the document head.
      * @param {string | any[]} filePaths - The file paths to append to the document head.
      * @returns {Promise<void>} A promise that resolves when all files have been successfully appended, or rejects if any file fails to load.
      * @throws {Error} If an unsupported file type is provided.
      */
  appendScriptFilesToDocument(e) {
    Array.isArray(e) || (e = [e]);
    const t = e.map((s) => new Promise((i, n) => {
      let r;
      if (s.endsWith(".js") ? (r = document.createElement("script"), r.src = s) : s.endsWith(".css") ? (r = document.createElement("link"), r.rel = "stylesheet", r.href = s) : n(new Error("Unsupported file type")), !r)
        return n(new Error("File could not be loaded"));
      r.addEventListener("load", () => {
        i();
      }), r.addEventListener("error", (o) => {
        n(o);
      }), document.head.appendChild(r);
    }));
    return Promise.all(t);
  }
  /**
      * Displays a message for a specified amount of time.
      * @param data The message to display.
      * @param time The amount of time to display the message for, in milliseconds. Defaults to 2000.
      */
  displayMessage(e, t = 2e3) {
    clearTimeout(this.message), this.emit("display-message", e), this.message = setTimeout(() => {
      this.emit("remove-message", e);
    }, t);
  }
  /**
      * Returns the HTMLDivElement element with the specified player ID.
      * @returns The HTMLDivElement element with the specified player ID.
      */
  getElement() {
    return document.getElementById(this.playerId);
  }
  /**
      * Returns the HTMLVideoElement contained within the base element.
      * @returns The HTMLVideoElement contained within the base element.
      */
  getVideoElement() {
    return this.getElement().querySelector("video");
  }
  /**
      * Checks if the player element is currently in the viewport.
      * @returns {boolean} True if the player is in the viewport, false otherwise.
      */
  isInViewport() {
    const e = this.getVideoElement().getBoundingClientRect(), t = window.innerHeight || document.documentElement.clientHeight, s = window.innerWidth || document.documentElement.clientWidth, i = e.top <= t && e.top + e.height >= 0, n = e.left <= s && e.left + e.width >= 0;
    return i && n;
  }
  /**
      * Creates a new HTML element of the specified type and assigns the given ID to it.
      * @param type - The type of the HTML element to create.
      * @param id - The ID to assign to the new element.
      * @param unique - Whether to use an existing element with the specified ID if it already exists.
      * @returns An object with four methods:
      *   - `addClasses`: A function that adds the specified CSS class names to the element's class list and returns the next 3 functions.
      *   - `appendTo`: A function that appends the element to a parent element and returns the element.
      *   - `prependTo`: A function that prepends the element to a parent element and returns the element.
      *   - `get`: A function that returns the element.
      */
  createElement(e, t, s) {
    let i;
    return s ? i = document.getElementById(t) ?? document.createElement(e) : i = document.createElement(e), i.id = t, {
      addClasses: (n) => this.addClasses(i, n),
      appendTo: (n) => (n.appendChild(i), i),
      prependTo: (n) => (n.prepend(i), i),
      get: () => i
    };
  }
  /**
      * Adds the specified CSS class names to the given element's class list.
      *
      * @param el - The element to add the classes to.
      * @param names - An array of CSS class names to add.
      * @returns An object with three methods:
      *   - `appendTo`: A function that appends the element to a parent element and returns the element.
      *   - `prependTo`: A function that prepends the element to a parent element and returns the element.
      *   - `get`: A function that returns the element.
      * @template T - The type of the element to add the classes to.
      */
  addClasses(e, t) {
    var s;
    for (const i of t.filter(Boolean))
      (s = e.classList) == null || s.add(i.trim());
    return {
      appendTo: (i) => (i.appendChild(e), e),
      prependTo: (i) => (i.prepend(e), e),
      get: () => e
    };
  }
  styleContainer() {
    this.container.classList.add("nomercyplayer"), this.container.style.overflow = "hidden", this.container.style.position = "relative", this.container.style.display = "flex", this.container.style.width = "100%", this.container.style.height = "auto", this.container.style.aspectRatio = "16/9", this.container.style.zIndex = "0", this.container.style.alignItems = "center", this.container.style.justifyContent = "center";
  }
  createVideoElement() {
    this.videoElement = this.createElement("video", `${this.playerId}_video`, !0).appendTo(this.container), this.videoElement.style.width = "100%", this.videoElement.style.height = "100%", this.videoElement.style.objectFit = "contain", this.videoElement.style.zIndex = "0", this.videoElement.style.backgroundColor = "black", this.videoElement.style.display = "block", this.videoElement.style.position = "absolute", this.videoElement.muted = this.options.muted ?? localStorage.getItem("nmplayer-muted") === "true", this.videoElement.autoplay = this.options.autoPlay ?? !1, this.videoElement.controls = this.options.controls ?? !1, this.videoElement.preload = this.options.preload ?? "auto", this.videoElement.volume = localStorage.getItem("nmplayer-volume") ? parseFloat(localStorage.getItem("nmplayer-volume")) / 100 : 1, this.emit("ready");
  }
  createOverlayElement() {
    this.overlay = this.createElement("div", `${this.playerId}_overlay`, !0).addClasses(["overlay"]).appendTo(this.container), this.overlay.style.width = "100%", this.overlay.style.height = "100%", this.overlay.style.position = "absolute", this.overlay.style.zIndex = "10", this.overlay.style.display = "flex", this.overlay.style.flexDirection = "column", this.overlay.style.justifyContent = "center", this.overlay.style.alignItems = "center";
  }
  createOverlayCenterMessage() {
    const e = this.createElement("button", "player-message").addClasses(["player-message"]).appendTo(this.overlay);
    return e.style.display = "none", e.style.position = "absolute", e.style.zIndex = "100", e.style.left = "50%", e.style.top = "12%", e.style.transform = "translateX(-50%)", e.style.padding = "0.5rem 1rem", e.style.backgroundColor = "rgba(0, 0, 0, 0.95)", e.style.borderRadius = "0.375rem", e.style.pointerEvents = "none", e.style.textAlign = "center", this.on("display-message", (t) => {
      e.style.display = "flex", e.textContent = t;
    }), this.on("remove-message", () => {
      e.style.display = "none", e.textContent = "";
    }), e;
  }
  createSubtitleOverlay() {
    this.subtitleOverlay = this.createElement("div", "subtitle-overlay", !0).addClasses([
      "nm-absolute",
      "nm-w-full",
      "nm-text-center",
      "nm-text-white",
      "nm-text-xl",
      "nm-p-2",
      "nm-z-0",
      "nm-transition-all",
      "nm-duration-300"
    ]).appendTo(this.container), this.subtitleOverlay.style.bottom = "5%", this.subtitleOverlay.style.display = "none", this.container.appendChild(this.subtitleOverlay), this.subtitleText = this.createElement("span", "subtitle-text", !0).addClasses(["nm-text-center", "nm-whitespace-pre-line", "nm-font-bolder", "nm-font-[BBC]", "nm-leading-normal"]).appendTo(this.subtitleOverlay), this.subtitleText.style.fontSize = "clamp(20px, 150%, 36px)", this.subtitleText.style.textShadow = "black 0 0 4px, black 0 0 4px, black 0 0 4px, black 0 0 4px, black 0 0 4px, black 0 0 4px, black 0 0 4px", this.videoElement.addEventListener("timeupdate", this.checkSubtitles.bind(this));
  }
  checkSubtitles() {
    if (!this.subtitles || !this.subtitles.cues || this.subtitles.cues.length === 0)
      return;
    if (this.subtitles.errors.length > 0) {
      console.error("Error parsing subtitles:", this.subtitles.errors);
      return;
    }
    const e = this.videoElement.currentTime;
    let t = !1;
    this.subtitles.cues.forEach((s) => {
      e >= s.startTime && e <= s.endTime && (this.subtitleOverlay.style.display = "block", this.subtitleText.textContent = s.text, t = !0);
    }), t || (this.subtitleOverlay.style.display = "none");
  }
  hdrSupported() {
    return screen.colorDepth > 24 && window.matchMedia("(color-gamut: p3)").matches;
  }
  loadSource(e) {
    var t, s, i;
    this.videoElement.pause(), this.videoElement.removeAttribute("src"), (t = this.hls) == null || t.destroy(), e.endsWith(".m3u8") ? J.isSupported() ? (this.hls = new J({
      debug: this.options.debug ?? !1,
      enableWorker: !0,
      lowLatencyMode: !1,
      backBufferLength: 10,
      maxBufferLength: 10,
      testBandwidth: !0,
      videoPreference: {
        preferHDR: this.hdrSupported()
      },
      xhrSetup: (n) => {
        this.options.accessToken && n.setRequestHeader("authorization", `Bearer ${this.options.accessToken}`);
      }
    }), this.emit("hls"), (s = this.hls) == null || s.loadSource(e), (i = this.hls) == null || i.attachMedia(this.videoElement)) : this.videoElement.canPlayType("application/vnd.apple.mpegurl") && (this.videoElement.src = e) : this.videoElement.src = `${e}${this.options.accessToken ? `?token=${this.options.accessToken}` : ""}`, this.options.autoPlay && this.play().then();
  }
  addGainNode() {
    const e = new (window.AudioContext || window.webkitAudioContext)(), t = e.createMediaElementSource(this.videoElement), s = e.createGain();
    this.gainNode = s, s.gain.value = 1, t.connect(s), s.connect(e.destination), setTimeout(() => {
      this.emit("gain", this.getGain());
    }, 0);
  }
  removeGainNode() {
    var e;
    (e = this.gainNode) == null || e.disconnect();
  }
  setGain(e) {
    if (!this.gainNode)
      throw new Error("Gain node not found");
    this.gainNode.gain.value = e, this.emit("gain", this.getGain());
  }
  getGain() {
    if (!this.gainNode)
      throw new Error("Gain node not found");
    return {
      value: this.gainNode.gain.value,
      min: this.gainNode.gain.minValue,
      max: this.gainNode.gain.maxValue,
      defaultValue: this.gainNode.gain.defaultValue
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  videoPlayer_playEvent(e) {
    this.emit("beforePlay"), this.container.classList.remove("paused"), this.container.classList.add("playing"), this.emit("play");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  videoPlayer_onPlayingEvent(e) {
    this.videoElement.removeEventListener("playing", this.videoPlayer_onPlayingEvent), this.firstFrame || (this.emit("firstFrame"), this.firstFrame = !0), this.setMediaAPI(), this.on("playlistItem", () => {
      this.videoElement.addEventListener("playing", this.videoPlayer_onPlayingEvent), this.firstFrame = !1;
    }), setTimeout(() => {
      localStorage.getItem("nmplayer-subtitle-language") && localStorage.getItem("nmplayer-subtitle-type") && localStorage.getItem("nmplayer-subtitle-ext") ? this.setCurrentCaption(this.getTextTrackIndexBy(
        localStorage.getItem("nmplayer-subtitle-language"),
        localStorage.getItem("nmplayer-subtitle-type"),
        localStorage.getItem("nmplayer-subtitle-ext")
      )) : this.setCurrentCaption(-1);
    }, 300);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  videoPlayer_pauseEvent(e) {
    this.container.classList.remove("playing"), this.container.classList.add("paused"), this.emit("pause", this.videoElement);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  videoPlayer_endedEvent(e) {
    this.currentIndex < this.playlist.length - 1 ? this.playVideo(this.currentIndex + 1) : (console.log("Playlist completed."), this.isPlaying = !1, this.emit("playlistComplete"));
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  videoPlayer_errorEvent(e) {
    this.emit("error", this.videoElement);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  videoPlayer_waitingEvent(e) {
    this.emit("waiting", this.videoElement);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  videoPlayer_canplayEvent(e) {
    this.emit("canplay", this.videoElement);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  videoPlayer_loadedmetadataEvent(e) {
    var t, s;
    this.emit("loadedmetadata", this.videoElement), this.emit("duration", this.videoElement.duration), this.emit("time", this.videoPlayer_getTimeData()), this.emit("audioTracks", this.getAudioTracks()), this.emit("captionsList", this.getCaptionsList()), this.emit("levels", this.getQualityLevels()), this.emit("levelsChanging", {
      id: (t = this.hls) == null ? void 0 : t.loadLevel,
      name: (s = this.getQualityLevels().find((i) => {
        var n;
        return i.id === ((n = this.hls) == null ? void 0 : n.loadLevel);
      })) == null ? void 0 : s.name
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  videoPlayer_loadstartEvent(e) {
    this.emit("loadstart", this.videoElement);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  videoPlayer_timeupdateEvent(e) {
    this.emit("time", this.videoPlayer_getTimeData());
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  videoPlayer_durationchangeEvent(e) {
    this.emit("duration", this.videoElement.duration);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  videoPlayer_volumechangeEvent(e) {
    this.volume != Math.round(this.videoElement.volume * 100) && this.emit("volume", Math.round(this.videoElement.volume * 100)), this.muted != this.videoElement.muted && this.emit("mute", this.videoElement.muted), this.muted = this.videoElement.muted, this.volume = Math.round(this.videoElement.volume * 100);
  }
  videoPlayer_getTimeData() {
    return {
      currentTime: this.videoElement.currentTime,
      duration: this.videoElement.duration,
      percentage: this.videoElement.currentTime / this.videoElement.duration * 100,
      remaining: this.videoElement.duration - this.videoElement.currentTime,
      currentTimeHuman: be(this.videoElement.currentTime),
      durationHuman: be(this.videoElement.duration),
      remainingHuman: be(this.videoElement.duration - this.videoElement.currentTime)
    };
  }
  // 5 seconds of inactivity
  ui_addActiveClass() {
    this.container.classList.remove("inactive"), this.container.classList.add("active"), this.subtitleOverlay.style.bottom = "5rem", this.emit("active", !0);
  }
  ui_removeActiveClass() {
    this.container.classList.remove("active"), this.container.classList.add("inactive"), this.subtitleOverlay.style.bottom = "2rem", this.emit("active", !1);
  }
  ui_resetInactivityTimer(e) {
    if (this.inactivityTimeout && clearTimeout(this.inactivityTimeout), this.ui_addActiveClass(), this.lockActive)
      return;
    const t = e.target;
    t && (t.tagName === "BUTTON" || t.tagName === "INPUT") || (this.inactivityTimeout = setTimeout(() => {
      this.ui_removeActiveClass();
    }, this.inactivityTime));
  }
  handleMouseLeave(e) {
    if (this.lockActive)
      return;
    const t = e.relatedTarget;
    t && (t.tagName === "BUTTON" || t.tagName === "INPUT") || this.ui_removeActiveClass();
  }
  handleMouseEnter(e) {
    const t = e.target;
    t && (t.tagName === "BUTTON" || t.tagName === "INPUT") && this.ui_addActiveClass();
  }
  _addEvents() {
    this.videoElement.addEventListener("play", this.videoPlayer_playEvent.bind(this)), this.videoElement.addEventListener("playing", this.videoPlayer_onPlayingEvent.bind(this)), this.videoElement.addEventListener("pause", this.videoPlayer_pauseEvent.bind(this)), this.videoElement.addEventListener("ended", this.videoPlayer_endedEvent.bind(this)), this.videoElement.addEventListener("error", this.videoPlayer_errorEvent.bind(this)), this.videoElement.addEventListener("waiting", this.videoPlayer_waitingEvent.bind(this)), this.videoElement.addEventListener("canplay", this.videoPlayer_canplayEvent.bind(this)), this.videoElement.addEventListener("loadedmetadata", this.videoPlayer_loadedmetadataEvent.bind(this)), this.videoElement.addEventListener("loadstart", this.videoPlayer_loadstartEvent.bind(this)), this.videoElement.addEventListener("timeupdate", this.videoPlayer_timeupdateEvent.bind(this)), this.videoElement.addEventListener("durationchange", this.videoPlayer_durationchangeEvent.bind(this)), this.videoElement.addEventListener("volumechange", this.videoPlayer_volumechangeEvent.bind(this)), this.container.addEventListener("mousemove", this.ui_resetInactivityTimer.bind(this)), this.container.addEventListener("click", this.ui_resetInactivityTimer.bind(this)), this.container.addEventListener("mouseleave", this.handleMouseLeave.bind(this)), this.once("hls", () => {
      this.hls && (this.hls.on(J.Events.AUDIO_TRACK_LOADING, (e, t) => {
        console.log("Audio track loading", t);
      }), this.hls.on(J.Events.AUDIO_TRACK_LOADED, (e, t) => {
        var s;
        console.log("Audio tracks loaded", t), this.emit("audioTrackChanged", {
          id: t.id,
          name: (s = this.getAudioTracks().find((i) => i.id === t.id)) == null ? void 0 : s.name
        });
      }), this.hls.on(J.Events.AUDIO_TRACK_SWITCHING, (e, t) => {
        console.log("Audio track switching", t);
      }), this.hls.on(J.Events.AUDIO_TRACK_SWITCHED, (e, t) => {
        var s;
        console.log("Audio track switched", t), this.emit("audioTrackChanged", {
          id: t.id,
          name: (s = this.getAudioTracks().find((i) => i.id === t.id)) == null ? void 0 : s.name
        });
      }), this.hls.on(J.Events.ERROR, (e, t) => {
        console.error("HLS error", t);
      }), this.hls.on(J.Events.LEVEL_LOADED, (e, t) => {
        console.log("Level loaded", t), this.emit("levelsChanged", {
          id: t.level,
          name: this.getQualityLevels().find((s) => s.id === t.level).name
        });
      }), this.hls.on(J.Events.LEVEL_SWITCHED, (e, t) => {
        console.log("Level switched", t), this.emit("levelsChanged", {
          id: t.level,
          name: this.getQualityLevels().find((s) => s.id === t.level).name
        });
      }), this.hls.on(J.Events.LEVEL_SWITCHING, (e, t) => {
        console.log("Level switching", t), this.emit("levelsChanging", {
          id: t.level,
          name: this.getQualityLevels().find((s) => s.id === t.level).name
        });
      }), this.hls.on(J.Events.LEVEL_UPDATED, (e, t) => {
        console.log("Level updated", t), this.emit("levelsChanged", {
          id: t.level,
          name: this.getQualityLevels().find((s) => s.id === t.level).name
        });
      }), this.hls.on(J.Events.LEVELS_UPDATED, (e, t) => {
        console.log("Levels updated", t);
      }), this.hls.on(J.Events.MANIFEST_LOADED, (e, t) => {
        console.log("Manifest loaded", t);
      }), this.hls.on(J.Events.MANIFEST_PARSED, (e, t) => {
        console.log("Manifest parsed", t);
      }), this.hls.on(J.Events.MANIFEST_LOADING, (e, t) => {
        console.log("Manifest loading", t);
      }), this.hls.on(J.Events.STEERING_MANIFEST_LOADED, (e, t) => {
        console.log("Steering manifest loaded", t);
      }), this.hls.on(J.Events.MEDIA_ATTACHED, (e, t) => {
        console.log("Media attached", t);
      }), this.hls.on(J.Events.MEDIA_ATTACHING, (e, t) => {
        console.log("Media attaching", t);
      }), this.hls.on(J.Events.MEDIA_DETACHED, (e) => {
        console.log("Media detached", e);
      }), this.hls.on(J.Events.MEDIA_DETACHING, (e) => {
        console.log("Media detaching", e);
      }));
    }), this.once("playlistItem", () => {
      this.once("audio", () => {
        localStorage.getItem("nmplayer-audio-language") ? this.setCurrentAudioTrack(this.getAudioTrackIndexByLanguage(localStorage.getItem("nmplayer-audio-language"))) : this.setCurrentAudioTrack(0), this.once("play", () => {
          localStorage.getItem("nmplayer-audio-language") ? this.setCurrentAudioTrack(this.getAudioTrackIndexByLanguage(localStorage.getItem("nmplayer-audio-language"))) : this.setCurrentAudioTrack(0);
        });
      }), this.once("captionsList", () => {
        localStorage.getItem("nmplayer-subtitle-language") && localStorage.getItem("nmplayer-subtitle-type") && localStorage.getItem("nmplayer-subtitle-ext") ? this.setCurrentCaption(this.getTextTrackIndexBy(
          localStorage.getItem("nmplayer-subtitle-language"),
          localStorage.getItem("nmplayer-subtitle-type"),
          localStorage.getItem("nmplayer-subtitle-ext")
        )) : this.setCurrentCaption(-1);
      });
    });
  }
  _removeEvents() {
    this.videoElement.removeEventListener("play", this.videoPlayer_playEvent.bind(this)), this.videoElement.removeEventListener("playing", this.videoPlayer_onPlayingEvent.bind(this)), this.videoElement.removeEventListener("pause", this.videoPlayer_pauseEvent.bind(this)), this.videoElement.removeEventListener("ended", this.videoPlayer_endedEvent.bind(this)), this.videoElement.removeEventListener("error", this.videoPlayer_errorEvent.bind(this)), this.videoElement.removeEventListener("waiting", this.videoPlayer_waitingEvent.bind(this)), this.videoElement.removeEventListener("canplay", this.videoPlayer_canplayEvent.bind(this)), this.videoElement.removeEventListener("loadedmetadata", this.videoPlayer_loadedmetadataEvent.bind(this)), this.videoElement.removeEventListener("loadstart", this.videoPlayer_loadstartEvent.bind(this)), this.videoElement.removeEventListener("timeupdate", this.videoPlayer_timeupdateEvent.bind(this)), this.videoElement.removeEventListener("durationchange", this.videoPlayer_durationchangeEvent.bind(this)), this.videoElement.removeEventListener("volumechange", this.videoPlayer_volumechangeEvent.bind(this)), this.container.removeEventListener("mousemove", this.ui_resetInactivityTimer.bind(this)), this.container.removeEventListener("click", this.ui_resetInactivityTimer.bind(this)), this.container.removeEventListener("mouseleave", this.handleMouseLeave.bind(this));
  }
  getParameterByName(e, t = window.location.href) {
    e = e.replace(/[[\]]/gu, "\\$&");
    const i = new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`, "u").exec(t);
    return i ? i[2] ? decodeURIComponent(i[2].replace(/\+/gu, " ")) : "" : null;
  }
  /**
      * Sets up the media session API for the player.
      *
      * @remarks
      * This method sets up the media session API for the player, which allows the user to control media playback
      * using the media session controls on their device. It sets the metadata for the current media item, as well
      * as the action handlers for the media session controls.
      */
  setMediaAPI() {
    if ("mediaSession" in navigator) {
      const e = this.playlistItem();
      if (!(e != null && e.title))
        return;
      const t = e.title.replace("%S", this.localize("S")).replace("%E", this.localize("E"));
      this.setTitle(`${e.season ? `${e.show} -` : ""} ${t}`), navigator.mediaSession.metadata = new MediaMetadata({
        title: t,
        artist: e.show,
        album: e.season ? `S${it(e.season, 2)}E${it(e.episode, 2)}` : "",
        artwork: e.image ? [
          {
            src: e.image,
            type: `image/${e.image.split(".").at(-1)}`
          }
        ] : []
      }), typeof navigator.mediaSession.setActionHandler == "function" && (navigator.mediaSession.setActionHandler("previoustrack", this.previous.bind(this)), navigator.mediaSession.setActionHandler("nexttrack", this.next.bind(this)), navigator.mediaSession.setActionHandler("seekbackward", (s) => this.rewindVideo.bind(this)(s.seekTime)), navigator.mediaSession.setActionHandler("seekforward", (s) => this.forwardVideo.bind(this)(s.seekTime)), navigator.mediaSession.setActionHandler("seekto", (s) => this.seek(s.seekTime)), navigator.mediaSession.setActionHandler("play", this.play.bind(this)), navigator.mediaSession.setActionHandler("pause", this.pause.bind(this)));
    }
  }
  /**
      * Returns the localized string for the given value, if available.
      * If the value is not found in the translations, it returns the original value.
      * @param value - The string value to be localized.
      * @returns The localized string, if available. Otherwise, the original value.
      */
  localize(e) {
    return this.translations && this.translations[e] ? this.translations[e] : this.translations && this.translations[e] ? this.translations[e] : e;
  }
  /**
      * Sets the title of the document.
      * @param value - The new title to set.
      */
  setTitle(e) {
    document.title = e;
  }
  /**
      * Returns an array of subtitle tracks for the current playlist item.
      * @returns {Array} An array of subtitle tracks for the current playlist item.
      */
  getSubtitles() {
    var e;
    return (e = this.playlistItem().tracks) == null ? void 0 : e.filter((t) => t.kind === "subtitles").map((t, s) => {
      var i, n;
      return {
        ...t,
        id: s,
        ext: t.file.split(".").at(-1) ?? "vtt",
        type: (i = t.label) != null && i.includes("Full") || (n = t.label) != null && n.includes("full") ? "full" : "sign"
      };
    });
  }
  /**
      * Returns an array of audio tracks for the current playlist item.
      * @returns {Array} An array of audio tracks for the current playlist item.
      */
  getSubtitleFile() {
    var e;
    return (e = this.getCurrentCaptions()) == null ? void 0 : e.file;
  }
  /**
      * Returns the file associated with the thumbnail of the current playlist item.
      * @returns The file associated with the thumbnail of the current playlist item, or undefined if no thumbnail is found.
      */
  getTimeFile() {
    var e, t;
    return (t = (e = this.playlistItem().tracks) == null ? void 0 : e.find((s) => s.kind === "thumbnails")) == null ? void 0 : t.file;
  }
  /**
      * Returns the file associated with the sprite metadata of the current playlist item.
      * @returns The sprite file, or undefined if no sprite metadata is found.
      */
  getSpriteFile() {
    var e, t;
    return (t = (e = this.playlistItem().tracks) == null ? void 0 : e.find((s) => s.kind === "sprite")) == null ? void 0 : t.file;
  }
  /**
      * Returns the file associated with the chapter metadata of the current playlist item, if any.
      * @returns The chapter file, or undefined if no chapter metadata is found.
      */
  getChapterFile() {
    var e, t;
    return (t = (e = this.playlistItem().tracks) == null ? void 0 : e.find((s) => s.kind === "chapters")) == null ? void 0 : t.file;
  }
  /**
      * Returns the file associated with the chapter metadata of the current playlist item, if any.
      * @returns The chapter file, or undefined if no chapter metadata is found.
      */
  getSkipFile() {
    var e, t;
    return (t = (e = this.playlistItem().tracks) == null ? void 0 : e.find((s) => s.kind === "skippers")) == null ? void 0 : t.file;
  }
  /**
      * Fetches the skip file and parses it to get the skippers.
      * Emits the 'skippers' event with the parsed skippers.
      * If the video duration is not available yet, waits for the 'duration' event to be emitted before emitting the 'skippers' event.
      */
  fetchSkipFile() {
    this.skippers = [];
    const e = this.getSkipFile();
    e && this.currentSkipFile !== e && (this.currentSkipFile = e, this.getFileContents({
      url: e,
      options: {},
      callback: (t) => {
        const s = new window.WebVTTParser();
        this.skippers = s.parse(t, "metadata"), this.getDuration() ? this.emit("skippers", this.getSkippers()) : this.once("duration", () => {
          this.emit("skippers", this.getSkippers());
        });
      }
    }).then());
  }
  /**
      * Returns an array of skip objects, each containing information about the skip's ID, title, start and end times, and position within the video.
      * @returns {Array} An array of skip objects.
      */
  getSkippers() {
    var e, t;
    return ((t = (e = this.skippers) == null ? void 0 : e.cues) == null ? void 0 : t.map((s, i) => ({
      id: `Skip ${i}`,
      title: s.text,
      startTime: s.startTime,
      endTime: s.endTime,
      type: s.text.trim()
    }))) ?? [];
  }
  /**
      * Returns the current skip based on the current time.
      * @returns The current skip object or undefined if no skip is found.
      */
  getSkip() {
    var e;
    return (e = this.getSkippers()) == null ? void 0 : e.find((t) => this.getPosition() >= t.startTime && this.getPosition() <= t.endTime);
  }
  /**
      * Returns an array of available playback speeds.
      * If the player is a JWPlayer, it returns the playbackRates from the options object.
      * Otherwise, it returns the playbackRates from the player object.
      * @returns An array of available playback speeds.
      */
  getSpeeds() {
    return this.options.playbackRates ?? [];
  }
  /**
      * Returns the current playback speed of the player.
      * @returns The current playback speed of the player.
      */
  getSpeed() {
    return this.videoElement.playbackRate;
  }
  /**
      * Checks if the player has multiple speeds.
      * @returns {boolean} True if the player has multiple speeds, false otherwise.
      */
  hasSpeeds() {
    const e = this.getSpeeds();
    return e !== void 0 && e.length > 1;
  }
  setSpeed(e) {
    this.videoElement.playbackRate = e, this.emit("speed", e);
  }
  /**
      * Returns a boolean indicating whether the player has a Picture-in-Picture (PIP) event handler.
      * @returns {boolean} Whether the player has a PIP event handler.
      */
  hasPIP() {
    return this.hasPipEventHandler;
  }
  /**
      * Returns the file associated with the 'fonts' metadata item of the current playlist item, if it exists.
      * @returns {string | undefined} The file associated with the 'fonts' metadata item
      * of the current playlist item, or undefined if it does not exist.
      */
  getFontsFile() {
    var e, t;
    return (t = (e = this.playlistItem().tracks) == null ? void 0 : e.find((s) => s.kind === "fonts")) == null ? void 0 : t.file;
  }
  /**
      * Fetches the font file and updates the fonts array if the file has changed.
      * @returns {Promise<void>} A Promise that resolves when the font file has been fetched and the fonts array has been updated.
      */
  async fetchFontFile() {
    const e = this.getFontsFile();
    e && this.currentFontFile !== e && (this.currentFontFile = e, await this.getFileContents({
      url: e,
      options: {},
      callback: (t) => {
        this.fonts = JSON.parse(t).map((s) => {
          const i = e.replace(/\/[^/]*$/u, "");
          return {
            ...s,
            file: `${i}/fonts/${s.file}`
          };
        }), this.emit("fonts", this.fonts);
      }
    }));
  }
  /**
      * Fetches the translations file for the specified language or the user's browser language.
      * @returns A Promise that resolves when the translations file has been fetched and parsed.
      */
  async fetchTranslationsFile() {
    const t = `https://storage.nomercy.tv/laravel/player/translations/${this.options.language ?? navigator.language}.json`;
    await this.getFileContents({
      url: t,
      options: {},
      callback: (s) => {
        this.translations = JSON.parse(s), this.emit("translations", this.translations);
      }
    });
  }
  /**
      * Fetches the chapter file and parses it to get the chapters.
      * Emits the 'chapters' event with the parsed chapters.
      * If the video duration is not available yet, waits for the 'duration' event to be emitted before emitting the 'chapters' event.
      */
  fetchChapterFile() {
    const e = this.getChapterFile();
    e && this.currentChapterFile !== e && (this.currentChapterFile = e, this.getFileContents({
      url: e,
      options: {},
      callback: (t) => {
        const s = new Bt.WebVTTParser();
        this.chapters = s.parse(t, "metadata"), this.once("duration", () => {
          this.emit("chapters", this.getChapters());
        });
      }
    }).then());
  }
  /**
      * Returns an array of chapter objects, each containing information about the chapter's ID, title, start and end times, and position within the video.
      * @returns {Array} An array of chapter objects.
      */
  getChapters() {
    var e, t;
    return ((t = (e = this.chapters) == null ? void 0 : e.cues) == null ? void 0 : t.map((s, i) => {
      var r, o;
      const n = ((o = (r = this.chapters) == null ? void 0 : r.cues[i + 1]) == null ? void 0 : o.startTime) ?? this.getDuration();
      return {
        id: `Chapter ${i}`,
        title: s.text,
        left: s.startTime / this.getDuration() * 100,
        width: (n - s.startTime) / this.getDuration() * 100,
        startTime: s.startTime,
        endTime: n
      };
    })) ?? [];
  }
  /**
      * Returns the current chapter based on the current time.
      * @returns The current chapter object or undefined if no chapter is found.
      */
  getChapter() {
    var e;
    return (e = this.getChapters()) == null ? void 0 : e.find((t) => this.getPosition() >= t.startTime && this.getPosition() <= t.endTime);
  }
  fetchSubtitleFile() {
    const e = this.getSubtitleFile();
    e && this.currentSubtitleFile !== e && (this.currentSubtitleFile = e, this.emit("captionsChange", this.getCurrentCaptions()), this.getFileContents({
      url: e,
      options: {
        anonymous: !1
      },
      callback: (t) => {
        const s = new Bt.WebVTTParser();
        this.subtitles = s.parse(t, "metadata"), this.triggerStyledSubs(e), this.once("duration", () => {
          this.emit("subtitles", this.getSubtitles());
        });
      }
    }).then());
  }
  // Method to load and play a video from the playlist
  playVideo(e) {
    e >= 0 && e < this.playlist.length ? (this.currentPlaylistItem = this.playlist[e], this.subtitles = {}, this.subtitleText.textContent = "", this.subtitleOverlay.style.display = "none", setTimeout(() => {
      this.emit("playlistItem", this.currentPlaylistItem);
    }, 0), this.currentIndex = e, this.videoElement.poster = this.currentPlaylistItem.image ?? "", this.loadSource(this.currentPlaylistItem.file)) : console.log("No more videos in the playlist.");
  }
  /**
      * Fetches a playlist from the specified URL and returns it as a converted playlist for the current player.
      * @param url The URL to fetch the playlist from.
      * @returns The converted playlist for the current player.
      */
  async fetchPlaylist(e) {
    const t = {
      "Accept-Language": localStorage.getItem("nmplayer-NoMercy-displayLanguage") ?? navigator.language,
      "Content-Type": "application/json"
    };
    return this.options.accessToken && (t.Authorization = `Bearer ${this.options.accessToken}`), await (await fetch(e, {
      headers: t,
      method: "GET"
    })).json();
  }
  /**
      * Loads the playlist for the player based on the options provided.
      * If the playlist is a string, it will be fetched and parsed as JSON.
      * If the playlist is an array, it will be used directly.
      */
  loadPlaylist() {
    typeof this.options.playlist == "string" ? this.fetchPlaylist(this.options.playlist).then((e) => {
      this.playlist = e.map((t, s) => ({
        ...t,
        season: t.season ?? 1,
        episode: t.episode ?? s + 1
      })), setTimeout(() => {
        this.emit("playlist", this.playlist);
      }, 0);
    }) : Array.isArray(this.options.playlist) && (this.playlist = this.options.playlist.map((e, t) => ({
      ...e,
      season: e.season ?? 1,
      episode: e.episode ?? t + 1
    })), setTimeout(() => {
      this.emit("playlist", this.playlist);
    }, 0)), this.playVideo(0);
  }
  setPlaylist(e) {
    this.options.playlist = e, this.loadPlaylist();
  }
  /**
      * Returns a boolean indicating whether the current playlist item is the first item in the playlist.
      * @returns {boolean} True if the current playlist item is the first item in the playlist, false otherwise.
      */
  isFirstPlaylistItem() {
    return this.getPlaylistIndex() === 0;
  }
  /**
      * Returns the current source URL of the player.
      * If the player is a JWPlayer, it returns the file URL of the current playlist item.
      * Otherwise, it returns the URL of the first source in the current playlist item.
      * @returns The current source URL of the player, or undefined if there is no current source.
      */
  getCurrentSrc() {
    var e;
    return (e = this.playlistItem()) == null ? void 0 : e.file;
  }
  /**
      * Checks if the current playlist item is the last item in the playlist.
      * @returns {boolean} True if the current playlist item is the last item in the playlist, false otherwise.
      */
  isLastPlaylistItem() {
    return this.getPlaylistIndex() === this.getPlaylist().length - 1;
  }
  /**
      * Checks if the player has more than one playlist.
      * @returns {boolean} True if the player has more than one playlist, false otherwise.
      */
  hasPlaylists() {
    return this.getPlaylist().length > 1;
  }
  /**
      * Public API methods
      */
  /**
      * Determines if the current device is a mobile device.
      * @returns {boolean} True if the device is a mobile device, false otherwise.
      */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/iu.test(navigator.userAgent) && !this.options.disableTouchControls;
  }
  /**
      * Determines if the current device is a TV based on the user agent string or the window dimensions.
      * @returns {boolean} True if the current device is a TV, false otherwise.
      */
  isTv() {
    return /Playstation|webOS|AppleTV|AndroidTV|NetCast|NetTV|SmartTV|Tizen|TV/u.test(navigator.userAgent) || window.innerHeight == 540 && window.innerWidth == 960 || this.options.forceTvMode == !0;
  }
  // Setup
  setup(e) {
    return this.options = {
      ...this.options,
      ...e
    }, this.videoElement.controls = e.controls ?? !0, this.setupTime = Date.now(), this.loadPlaylist(), this;
  }
  remove() {
  }
  setConfig(e) {
    this.options = { ...this.options, ...e };
  }
  getProvider() {
  }
  getContainer() {
    return this.container;
  }
  getEnvironment() {
  }
  getPlugin() {
  }
  getRenderingMode() {
  }
  // Playlist
  getPlaylist() {
    return this.playlist;
  }
  getPlaylistIndex() {
    return this.playlist.indexOf(this.currentPlaylistItem);
  }
  getPlaylistItem(e) {
    return this.playlist[e];
  }
  load(e) {
    this.playlist = e;
  }
  playlistItem(e) {
    if (e === void 0)
      return this.currentPlaylistItem;
    this.playVideo(e);
  }
  next() {
    this.getPlaylistIndex() < this.playlist.length - 1 && this.playlistItem(this.getPlaylistIndex() + 1);
  }
  previous() {
    this.getPlaylistIndex() > 0 && this.playlistItem(this.getPlaylistIndex() - 1);
  }
  // Buffer
  getBuffer() {
    return this.videoElement.buffered;
  }
  // Playback
  getState() {
    return this.videoElement.paused ? "paused" : "playing";
  }
  play() {
    return this.options.autoPlay = !0, this.videoElement.play();
  }
  pause() {
    return this.videoElement.pause();
  }
  togglePlayback() {
    this.videoElement.paused ? this.play().then() : this.pause();
  }
  stop() {
    this.videoElement.pause(), this.videoElement.currentTime = 0;
  }
  // Seek
  getPosition() {
    return this.videoElement.currentTime;
  }
  getDuration() {
    return this.videoElement.duration;
  }
  seek(e) {
    return this.videoElement.currentTime = e;
  }
  seekByPercentage(e) {
    return this.videoElement.currentTime = this.videoElement.duration * e / 100;
  }
  /**
      * Rewinds the video by a specified time interval.
      * @param time - The time interval to rewind the video by. Defaults to 10 seconds if not provided.
      */
  rewindVideo(e = this.seekInterval ?? 10) {
    this.emit("remove-forward"), clearTimeout(this.leftTap), this.tapCount += e, this.emit("rewind", this.tapCount), this.leftTap = setTimeout(() => {
      this.emit("remove-rewind"), this.seek(this.getPosition() - this.tapCount), this.tapCount = 0;
    }, this.leeway);
  }
  /**
      * Forwards the video by the specified time interval.
      * @param time - The time interval to forward the video by, in seconds. Defaults to 10 seconds if not provided.
      */
  forwardVideo(e = this.seekInterval ?? 10) {
    this.emit("remove-rewind"), clearTimeout(this.rightTap), this.tapCount += e, this.emit("forward", this.tapCount), this.rightTap = setTimeout(() => {
      this.emit("remove-forward"), this.seek(this.getPosition() + this.tapCount), this.tapCount = 0;
    }, this.leeway);
  }
  // Volume
  getMute() {
    return this.videoElement.muted;
  }
  getVolume() {
    return this.videoElement.volume * 100;
  }
  setMute(e) {
    this.videoElement.muted = e;
  }
  toggleMute() {
    this.setMute(!this.videoElement.muted), localStorage.setItem("nmplayer-muted", this.videoElement.muted.toString()), this.videoElement.muted ? this.displayMessage(this.localize("Muted")) : this.displayMessage(`${this.localize("Volume")}: ${this.getVolume()}%`);
  }
  /**
      * Returns a boolean indicating whether the player is currently muted.
      * If the player is a JWPlayer, it will return the value of `player.getMute()`.
      * Otherwise, it will return the value of `player.muted()`.
      * @returns {boolean} A boolean indicating whether the player is currently muted.
      */
  isMuted() {
    return this.getMute();
  }
  /**
      * Increases the volume of the player by 10 units, up to a maximum of 100.
      */
  volumeUp() {
    this.getVolume() === 100 ? (this.setVolume(100), this.displayMessage(`${this.localize("Volume")}: 100%`)) : (this.setVolume(this.getVolume() + 10), this.displayMessage(`${this.localize("Volume")}: ${this.getVolume()}%`));
  }
  /**
      * Decreases the volume of the player by 10 units. If the volume is already at 0, the player is muted.
      */
  volumeDown() {
    this.getVolume() === 0 ? (this.setMute(!0), this.displayMessage(`${this.localize("Volume")}: ${this.getVolume()}%`)) : (this.setMute(!1), this.setVolume(this.getVolume() - 10), this.displayMessage(`${this.localize("Volume")}: ${this.getVolume()}%`));
  }
  setVolume(e) {
    this.videoElement.volume = e / 100, this.setMute(!1), localStorage.setItem("nmplayer-volume", e.toString());
  }
  // Resize
  getWidth() {
    this.videoElement.getBoundingClientRect().width;
  }
  getHeight() {
    this.videoElement.getBoundingClientRect().height;
  }
  getFullscreen() {
    return document.fullscreenElement === this.container;
  }
  resize() {
  }
  /**
      * Enters fullscreen mode for the player.
      */
  enterFullscreen() {
    navigator.userActivation.isActive && this.container.requestFullscreen().then(() => {
      this.emit("fullscreen", this.getFullscreen());
    });
  }
  /**
      * Exits fullscreen mode for the player.
      */
  exitFullscreen() {
    document.exitFullscreen().then(() => {
      this.emit("fullscreen", this.getFullscreen());
    }).catch((e) => {
      console.error(`Error attempting to exit fullscreen mode: ${e.message} (${e.name})`);
    });
  }
  /**
      * Toggles the fullscreen mode of the player.
      * If the player is currently in fullscreen mode, it exits fullscreen mode.
      * If the player is not in fullscreen mode, it enters fullscreen mode.
      */
  toggleFullscreen() {
    this.getFullscreen() ? this.exitFullscreen() : this.enterFullscreen();
  }
  // Audio
  getAudioTracks() {
    return this.hls ? this.hls.audioTracks.map((e, t) => ({ ...e, id: t })) : [];
  }
  getCurrentAudioTrack() {
    return this.hls ? this.hls.audioTrack : -1;
  }
  getCurrentAudioTrackName() {
    return this.hls ? this.hls.audioTracks[this.hls.audioTrack].name : "";
  }
  setCurrentAudioTrack(e) {
    var t;
    !e && e != 0 || !this.hls || (this.hls.audioTrack = e, localStorage.setItem("nmplayer-audio-language", (t = this.getAudioTracks()[e]) == null ? void 0 : t.lang));
  }
  /**
   * Returns the index of the audio track with the specified language.
   * @param language The language of the audio track to search for.
   * @returns The index of the audio track with the specified language, or -1 if no such track exists.
   */
  getAudioTrackIndexByLanguage(e) {
    return this.getAudioTracks().findIndex((t) => t.language == e);
  }
  /**
      * Returns a boolean indicating whether there are multiple audio tracks available.
      * @returns {boolean} True if there are multiple audio tracks, false otherwise.
      */
  hasAudioTracks() {
    return this.getAudioTracks().length > 1;
  }
  /**
      * Cycles to the next audio track in the playlist.
      * If there are no audio tracks, this method does nothing.
      * If the current track is the last track in the playlist, this method will cycle back to the first track.
      * Otherwise, this method will cycle to the next track in the playlist.
      * After cycling to the next track, this method will display a message indicating the new audio track.
      */
  cycleAudioTracks() {
    this.hasAudioTracks() && (this.getCurrentAudioTrack() === this.getAudioTracks().length - 1 ? this.setCurrentAudioTrack(0) : this.setCurrentAudioTrack(this.getCurrentAudioTrack() + 1), this.displayMessage(`${this.localize("Audio")}: ${this.localize(this.getCurrentAudioTrackName()) || this.localize("Unknown")}`));
  }
  // Quality
  getQualityLevels() {
    return this.hls ? this.hls.levels.map((e, t) => ({ ...e, id: t })).filter((e) => {
      var i;
      const t = (i = e._attrs.at(0)) == null ? void 0 : i["VIDEO-RANGE"];
      return this.hdrSupported() ? !0 : t !== "PQ";
    }) : [];
  }
  getCurrentQuality() {
    return this.hls ? this.hls.currentLevel : [];
  }
  getCurrentQualityName() {
    var e;
    return this.hls ? (e = this.hls.levels[this.hls.currentLevel]) == null ? void 0 : e.name : [];
  }
  setCurrentQuality(e) {
    !e && e != 0 || !this.hls || (this.hls.nextLevel = e);
  }
  /**
      * Returns a boolean indicating whether the player has more than one quality.
      * @returns {boolean} True if the player has more than one quality, false otherwise.
      */
  hasQualities() {
    return this.getQualityLevels().length > 1;
  }
  // Captions
  getCaptionsList() {
    return this.getSubtitles();
  }
  hasCaptions() {
    var e;
    return (((e = this.getSubtitles()) == null ? void 0 : e.length) ?? 0) > 0;
  }
  getCurrentCaptions() {
    var e;
    return (e = this.getSubtitles()) == null ? void 0 : e[this.currentSubtitleIndex];
  }
  getCurrentCaptionsName() {
    var e;
    return ((e = this.getCurrentCaptions()) == null ? void 0 : e.label) ?? "";
  }
  getCaptionIndex() {
    return this.currentSubtitleIndex;
  }
  /**
      * Returns the index of the text track that matches the specified language, type, and extension.
      * @param language The language of the text track.
      * @param type The type of the text track.
      * @param ext The extension of the text track.
      * @returns The index of the matching text track, or -1 if no match is found.
      */
  getTextTrackIndexBy(e, t, s) {
    var n, r;
    const i = (n = this.getCaptionsList()) == null ? void 0 : n.findIndex((o) => (o.file ?? o.id).endsWith(`${e}.${t}.${s}`));
    return i === -1 ? (r = this.getCaptionsList()) == null ? void 0 : r.findIndex((o) => o.language === e && o.type === t && o.ext === s) : i;
  }
  setCurrentCaption(e) {
    !e && e != 0 || (this.currentSubtitleIndex = e, this.fetchSubtitleFile());
  }
  getCaptionLanguage() {
    var e;
    return ((e = this.getCurrentCaptions()) == null ? void 0 : e.language) ?? "";
  }
  getCaptionLabel() {
    var e;
    return ((e = this.getCurrentCaptions()) == null ? void 0 : e.label) ?? "";
  }
  /**
      * Triggers the styled subtitles based on the provided file.
      * @param file - The file to extract language, type, and extension from.
      */
  triggerStyledSubs(e) {
    if (!e)
      return;
    const { language: t, type: s, ext: i } = this.getCurrentCaptions();
    localStorage.setItem("nmplayer-subtitle-language", t), localStorage.setItem("nmplayer-subtitle-type", s), localStorage.setItem("nmplayer-subtitle-ext", i);
  }
  /**
      * Cycles through the available subtitle tracks and sets the active track to the next one.
      * If there are no subtitle tracks, this method does nothing.
      * If the current track is the last one, this method sets the active track to the first one.
      * Otherwise, it sets the active track to the next one.
      * Finally, it displays a message indicating the current subtitle track.
      */
  cycleSubtitles() {
    this.hasCaptions() && (this.getCaptionIndex() === this.getCaptionsList().length - 1 ? this.setCurrentCaption(-1) : this.setCurrentCaption(this.getCaptionIndex() + 1), this.displayMessage(`${this.localize("Subtitle")}: ${this.getCaptionLanguage() + this.getCaptionLabel() || this.localize("Off")}`));
  }
  /**
      * Returns the current aspect ratio of the player.
      * If the player is a JWPlayer, it returns the current stretching mode.
      * Otherwise, it returns the current aspect ratio.
      * @returns The current aspect ratio of the player.
      */
  getCurrentAspect() {
    return this.currentAspectRatio;
  }
  /**
      * Sets the aspect ratio of the player.
      * @param aspect - The aspect ratio to set.
      */
  setAspect(e) {
    switch (this.currentAspectRatio = e, e) {
      case "fill":
        this.videoElement.style.objectFit = "fill";
        break;
      case "uniform":
        this.videoElement.style.objectFit = "contain";
        break;
      case "exactfit":
        this.videoElement.style.objectFit = "cover";
        break;
      case "none":
        this.videoElement.style.objectFit = "none";
        break;
    }
    this.displayMessage(`${this.localize("Aspect ratio")}: ${this.localize(e)}`);
  }
  /**
      * Cycles through the available aspect ratio options and sets the current aspect ratio to the next one.
      */
  cycleAspectRatio() {
    const e = this.stretchOptions.findIndex((t) => t == this.getCurrentAspect());
    e == this.stretchOptions.length - 1 ? this.setAspect(this.stretchOptions[0]) : this.setAspect(this.stretchOptions[e + 1]);
  }
  // Controls
  getControls() {
  }
  getSafeRegion() {
  }
  addButton() {
  }
  removeButton() {
  }
  setControls() {
  }
  setAllowFullscreen(e) {
    this.allowFullscreen = e;
  }
  // Floating Player
  setFloatingPlayer(e) {
    if (this.isMobile()) {
      this.shouldFloat = !1;
      return;
    }
    this.shouldFloat = e;
  }
  getFloat() {
  }
  // Advertising
  playAd() {
  }
  // Cast
  requestCast() {
  }
  stopCasting() {
  }
}
String.prototype.toTitleCase = function() {
  let a, e, t;
  t = this.replace(/([^\W_]+[^\s-]*) */gu, (n) => n.charAt(0).toUpperCase() + n.substring(1).toLowerCase());
  const s = ["A", "An", "The", "And", "But", "Or", "For", "Nor", "As", "At", "By", "For", "From", "In", "Into", "Near", "Of", "On", "Onto", "To", "With"];
  for (a = 0, e = s.length; a < e; a++)
    t = t.replace(new RegExp(`\\s${s[a]}\\s`, "gu"), (n) => n.toLowerCase());
  const i = ["Id", "Tv"];
  for (a = 0, e = i.length; a < e; a++)
    t = t.replace(new RegExp(`\\b${i[a]}\\b`, "gu"), i[a].toUpperCase());
  return t;
};
String.prototype.titleCase = function(a = navigator.language.split("-")[0], e = !0) {
  let t, s = [];
  if (t = this.replace(/([^\s:\-'])([^\s:\-']*)/gu, (n) => n.charAt(0).toUpperCase() + n.substring(1).toLowerCase()).replace(/Mc(.)/gu, (n, r) => `Mc${r.toUpperCase()}`), e) {
    s = ["A", "An", "The", "At", "By", "For", "In", "Of", "On", "To", "Up", "And", "As", "But", "Or", "Nor", "Not"], a == "FR" ? s = ["Un", "Une", "Le", "La", "Les", "Du", "De", "Des", "À", "Au", "Aux", "Par", "Pour", "Dans", "Sur", "Et", "Comme", "Mais", "Ou", "Où", "Ne", "Ni", "Pas"] : a == "NL" && (s = ["De", "Het", "Een", "En", "Van", "Naar", "Op", "Door", "Voor", "In", "Als", "Maar", "Waar", "Niet", "Bij", "Aan"]);
    for (let n = 0; n < s.length; n++)
      t = t.replace(new RegExp(`\\s${s[n]}\\s`, "gu"), (r) => r.toLowerCase());
  }
  const i = ["Id", "R&d"];
  for (let n = 0; n < i.length; n++)
    t = t.replace(new RegExp(`\\b${i[n]}\\b`, "gu"), i[n].toUpperCase());
  return t;
};
const lr = (a) => new Fc(a);
window.nmplayer = lr;
const _c = function(a) {
  let e = !1;
  try {
    if (typeof WebAssembly == "object" && typeof WebAssembly.instantiate == "function") {
      const n = new WebAssembly.Module(Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0));
      n instanceof WebAssembly.Module && (e = new WebAssembly.Instance(n) instanceof WebAssembly.Instance);
    }
  } catch {
  }
  const t = this;
  t.canvas = a.canvas, t.lossyRender = a.lossyRender, t.isOurCanvas = !1, t.video = a.video, t.canvasParent = null, t.fonts = a.fonts || [], t.availableFonts = a.availableFonts || [], t.defaultFont = a.defaultFont, t.onReadyEvent = a.onReady, e ? t.workerUrl = a.workerUrl || "subtitles-octopus-worker.js" : t.workerUrl = a.legacyWorkerUrl || "subtitles-octopus-worker-legacy.js", t.subUrl = a.subUrl, t.subContent = a.subContent || null, t.onErrorEvent = a.onError, t.debug = a.debug || !1, t.lastRenderTime = 0, t.pixelRatio = window.devicePixelRatio || 1, t.timeOffset = a.timeOffset || 0, t.hasAlphaBug = !1, function() {
    if (typeof ImageData.prototype.constructor == "function")
      try {
        new window.ImageData(new Uint8ClampedArray([
          0,
          0,
          0,
          0
        ]), 1, 1);
        return;
      } catch {
        console.log("detected that ImageData is not constructable despite browser saying so");
      }
    const r = document.createElement("canvas").getContext("2d", { willReadFrequently: !0 });
    window.ImageData = function() {
      let o = 0;
      if (arguments[0] instanceof Uint8ClampedArray)
        var l = arguments[o++];
      const c = arguments[o++], h = arguments[o], u = r.createImageData(c, h);
      return l && u.data.set(l), u;
    };
  }(), t.workerError = function(n) {
    console.error("Worker error: ", n), t.onErrorEvent && t.onErrorEvent(n), t.debug || t.dispose();
  }, t.init = function() {
    if (!window.Worker) {
      t.workerError("worker not supported");
      return;
    }
    t.worker || (t.worker = new Worker(t.workerUrl), t.worker.onmessage = t.onWorkerMessage, t.worker.onerror = t.workerError), t.workerActive = !1, t.createCanvas(), t.setVideo(a.video), t.setSubUrl(a.subUrl), t.worker.postMessage({
      target: "worker-init",
      width: t.canvas.width,
      height: t.canvas.height,
      URL: document.URL,
      currentScript: t.workerUrl,
      preMain: !0,
      fastRender: t.lossyRender,
      subUrl: t.subUrl,
      subContent: t.subContent,
      fonts: t.fonts,
      availableFonts: t.availableFonts,
      defaultFont: t.defaultFont,
      debug: t.debug
    });
  }, t.createCanvas = function() {
    t.canvas || (t.video ? (t.isOurCanvas = !0, t.canvas = document.createElement("canvas"), t.canvas.className = "libassjs-canvas", t.canvas.style.display = "none", t.canvasParent = document.createElement("div"), t.canvasParent.className = "libassjs-canvas-parent", t.canvasParent.appendChild(t.canvas), t.video.nextSibling ? t.video.parentNode.insertBefore(t.canvasParent, t.video.nextSibling) : t.video.parentNode.appendChild(t.canvasParent)) : t.canvas || t.workerError("Don't know where to render: you should give video or canvas in options.")), t.ctx = t.canvas.getContext("2d", { willReadFrequently: !0 }), t.bufferCanvas = document.createElement("canvas"), t.bufferCanvasCtx = t.bufferCanvas.getContext("2d", { willReadFrequently: !0 }), t.bufferCanvas.width = 1, t.bufferCanvas.height = 1;
    const n = new Uint8ClampedArray([
      0,
      255,
      0,
      0
    ]), r = new ImageData(n, 1, 1);
    t.bufferCanvasCtx.clearRect(0, 0, 1, 1), t.ctx.clearRect(0, 0, 1, 1);
    const o = t.ctx.getImageData(0, 0, 1, 1, { willReadFrequently: !0 }).data;
    t.bufferCanvasCtx.putImageData(r, 0, 0), t.ctx.drawImage(t.bufferCanvas, 0, 0);
    const l = t.ctx.getImageData(0, 0, 1, 1, { willReadFrequently: !0 }).data;
    t.hasAlphaBug = o[1] !== l[1], t.hasAlphaBug && console.log("Detected a browser having issue with transparent pixels, applying workaround");
  }, t.setVideo = function(n) {
    if (t.video = n, t.video) {
      const r = function() {
        t.setCurrentTime(n.currentTime + t.timeOffset);
      };
      t.video.addEventListener("timeupdate", r, !1), t.video.addEventListener("playing", () => {
        t.setIsPaused(!1, n.currentTime + t.timeOffset);
      }, !1), t.video.addEventListener("pause", () => {
        t.setIsPaused(!0, n.currentTime + t.timeOffset);
      }, !1), t.video.addEventListener("seeking", () => {
        t.video.removeEventListener("timeupdate", r);
      }, !1), t.video.addEventListener("seeked", () => {
        t.video.addEventListener("timeupdate", r, !1), t.setCurrentTime(n.currentTime + t.timeOffset);
      }, !1), t.video.addEventListener("ratechange", () => {
        t.setRate(n.playbackRate);
      }, !1), t.video.addEventListener("timeupdate", () => {
        t.setCurrentTime(n.currentTime + t.timeOffset);
      }, !1), t.video.addEventListener("waiting", () => {
        t.setIsPaused(!0, n.currentTime + t.timeOffset);
      }, !1), document.addEventListener("fullscreenchange", t.resizeWithTimeout, !1), document.addEventListener("mozfullscreenchange", t.resizeWithTimeout, !1), document.addEventListener("webkitfullscreenchange", t.resizeWithTimeout, !1), document.addEventListener("msfullscreenchange", t.resizeWithTimeout, !1), window.addEventListener("resize", t.resizeWithTimeout, !1), typeof ResizeObserver < "u" && (t.ro = new ResizeObserver(t.resizeWithTimeout), t.ro.observe(t.video)), t.video.videoWidth > 0 ? t.resize() : t.video.addEventListener("loadedmetadata", () => {
        t.resize();
      }, !1);
    }
  }, t.getVideoPosition = function() {
    const n = t.video.videoWidth / t.video.videoHeight, r = t.video.offsetWidth, o = t.video.offsetHeight, l = r / o;
    let c = r, h = o;
    l > n ? c = Math.floor(o * n) : h = Math.floor(r / n);
    const u = (r - c) / 2, d = (o - h) / 2;
    return {
      width: c,
      height: h,
      x: u,
      y: d
    };
  }, t.setSubUrl = function(n) {
    t.subUrl = n;
  }, t.renderFrameData = null;
  function s() {
    var n, r;
    const o = t.renderFramesData, l = performance.now();
    t.ctx.clearRect(0, 0, t.canvas.width, t.canvas.height);
    for (let c = 0; c < o.canvases.length; c++) {
      const h = o.canvases[c];
      t.bufferCanvas.width = h.w, t.bufferCanvas.height = h.h;
      const u = new Uint8ClampedArray(h.buffer);
      if (t.hasAlphaBug)
        for (let f = 3; f < u.length; f += 4)
          u[f] = u[f] >= 1 ? u[f] : 1;
      const d = new ImageData(u, h.w, h.h);
      t.bufferCanvasCtx.putImageData(d, 0, 0), t.ctx.drawImage(t.bufferCanvas, h.x, h.y);
    }
    if (t.debug) {
      const c = Math.round(performance.now() - l);
      (r = (n = window.socket) === null || n === void 0 ? void 0 : n.emit) === null || r === void 0 || r.call(n, "log", `${Math.round(o.spentTime)} ms (+ ${c} ms draw)`), console.log(`${Math.round(o.spentTime)} ms (+ ${c} ms draw)`), t.renderStart = performance.now();
    }
  }
  function i() {
    var n, r;
    const o = t.renderFramesData, l = performance.now();
    t.ctx.clearRect(0, 0, t.canvas.width, t.canvas.height);
    for (let c = 0; c < o.bitmaps.length; c++) {
      const h = o.bitmaps[c];
      t.ctx.drawImage(h.bitmap, h.x, h.y);
    }
    if (t.debug) {
      const c = Math.round(performance.now() - l);
      (r = (n = window.socket) === null || n === void 0 ? void 0 : n.emit) === null || r === void 0 || r.call(n, `${o.bitmaps.length} bitmaps, libass: ${Math.round(o.libassTime)}ms, decode: ${Math.round(o.decodeTime)}ms, draw: ${c}ms`), console.log(`${o.bitmaps.length} bitmaps, libass: ${Math.round(o.libassTime)}ms, decode: ${Math.round(o.decodeTime)}ms, draw: ${c}ms`), t.renderStart = performance.now();
    }
  }
  t.workerActive = !1, t.frameId = 0, t.onWorkerMessage = function(n) {
    t.workerActive || (t.workerActive = !0, t.onReadyEvent && t.onReadyEvent());
    const { data: r } = n;
    switch (r.target) {
      case "stdout": {
        console.log(r.content);
        break;
      }
      case "console-log": {
        console.log.apply(console, JSON.parse(r.content));
        break;
      }
      case "console-debug": {
        console.debug.apply(console, JSON.parse(r.content));
        break;
      }
      case "console-info": {
        console.info.apply(console, JSON.parse(r.content));
        break;
      }
      case "console-warn": {
        console.warn.apply(console, JSON.parse(r.content));
        break;
      }
      case "console-error": {
        console.error.apply(console, JSON.parse(r.content));
        break;
      }
      case "stderr": {
        console.error(r.content);
        break;
      }
      case "window": {
        window[r.method]();
        break;
      }
      case "canvas": {
        switch (r.op) {
          case "getContext": {
            t.ctx = t.canvas.getContext(r.type, r.attributes);
            break;
          }
          case "resize": {
            t.resize(r.width, r.height);
            break;
          }
          case "renderCanvas": {
            t.lastRenderTime < r.time && (t.lastRenderTime = r.time, t.renderFramesData = r, window.requestAnimationFrame(s));
            break;
          }
          case "renderMultiple": {
            t.lastRenderTime < r.time && (t.lastRenderTime = r.time, t.renderFramesData = r, window.requestAnimationFrame(s));
            break;
          }
          case "renderFastCanvas": {
            t.lastRenderTime < r.time && (t.lastRenderTime = r.time, t.renderFramesData = r, window.requestAnimationFrame(i));
            break;
          }
          case "setObjectProperty": {
            t.canvas[r.object][r.property] = r.value;
            break;
          }
          default:
            console.error(r);
            break;
        }
        break;
      }
      case "tick": {
        t.frameId = r.id, t.worker.postMessage({
          target: "tock",
          id: t.frameId
        });
        break;
      }
      case "custom": {
        if (t.onCustomMessage)
          t.onCustomMessage(n);
        else
          throw Error("Custom message received but client onCustomMessage not implemented.");
        break;
      }
      case "setimmediate": {
        t.worker.postMessage({
          target: "setimmediate"
        });
        break;
      }
      case "get-events": {
        console.log(r.target), console.log(r.events);
        break;
      }
      case "get-styles": {
        console.log(r.target), console.log(r.styles);
        break;
      }
      case "ready":
        break;
      default:
        throw Error("what? ", r.target);
    }
  }, t.resize = function(n, r, o, l) {
    let c = null;
    if (o = o || 0, l = l || 0, (!n || !r) && t.video) {
      c = t.getVideoPosition(), n = c.width * t.pixelRatio, r = c.height * t.pixelRatio;
      const h = t.canvasParent.getBoundingClientRect().top - t.video.getBoundingClientRect().top;
      o = c.y - h, l = c.x;
    }
    if (!n || !r) {
      t.video || console.error("width or height is 0. You should specify width & height for resize.");
      return;
    }
    (t.canvas.width !== n || t.canvas.height !== r || t.canvas.style.top !== o || t.canvas.style.left !== l) && (t.canvas.width = n, t.canvas.height = r, c !== null && (t.canvasParent.style.position = "relative", t.canvas.style.display = "block", t.canvas.style.position = "absolute", t.canvas.style.width = `${c.width}px`, t.canvas.style.height = `${c.height}px`, t.canvas.style.top = `${o}px`, t.canvas.style.left = `${l}px`, t.canvas.style.pointerEvents = "none"), t.worker.postMessage({
      target: "canvas",
      width: t.canvas.width,
      height: t.canvas.height
    }));
  }, t.resizeWithTimeout = function() {
    t.resize(), setTimeout(t.resize, 100);
  }, t.runBenchmark = function() {
    t.worker.postMessage({
      target: "runBenchmark"
    });
  }, t.customMessage = function(n, r) {
    r = r || {}, t.worker.postMessage({
      target: "custom",
      userData: n,
      preMain: r.preMain
    });
  }, t.setCurrentTime = function(n) {
    t.worker.postMessage({
      target: "video",
      currentTime: n
    });
  }, t.setTrackByUrl = function(n) {
    t.worker.postMessage({
      target: "set-track-by-url",
      url: n
    });
  }, t.setTrack = function(n) {
    t.worker.postMessage({
      target: "set-track",
      content: n
    });
  }, t.freeTrack = function() {
    t.worker.postMessage({
      target: "free-track"
    });
  }, t.render = t.setCurrentTime, t.setIsPaused = function(n, r) {
    t.worker.postMessage({
      target: "video",
      isPaused: n,
      currentTime: r
    });
  }, t.setRate = function(n) {
    t.worker.postMessage({
      target: "video",
      rate: n
    });
  }, t.dispose = function() {
    t.worker.postMessage({
      target: "destroy"
    }), t.worker.terminate(), t.workerActive = !1, t.video && document.body.contains(t.canvasParent) && t.video.parentNode.removeChild(t.canvasParent);
  }, t.createEvent = function(n) {
    t.worker.postMessage({
      target: "create-event",
      event: n
    });
  }, t.getEvents = function() {
    t.worker.postMessage({
      target: "get-events"
    });
  }, t.setEvent = function(n, r) {
    t.worker.postMessage({
      target: "set-event",
      event: n,
      index: r
    });
  }, t.removeEvent = function(n) {
    t.worker.postMessage({
      target: "remove-event",
      index: n
    });
  }, t.createStyle = function(n) {
    t.worker.postMessage({
      target: "create-style",
      style: n
    });
  }, t.getStyles = function() {
    t.worker.postMessage({
      target: "get-styles"
    });
  }, t.setStyle = function(n, r) {
    t.worker.postMessage({
      target: "set-style",
      style: n,
      index: r
    });
  }, t.removeStyle = function(n) {
    t.worker.postMessage({
      target: "remove-style",
      index: n
    });
  }, t.init();
};
class ot {
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialize(e) {
  }
  use() {
  }
}
class Oc extends ot {
  initialize(e) {
    this.player = e;
  }
  use() {
    this.player.on("captionsChange", this.opus.bind(this));
  }
  async opus() {
    var i, n;
    const e = this.player.getSubtitleFile() ?? null, t = (i = e == null ? void 0 : e.match(/\w+\.\w+\.\w+$/u)) == null ? void 0 : i[0];
    let [, , s] = t ? t.split(".") : [];
    if (s || (s = e.split(".").at(-1)), !(s != "ass" && s != "ssa") && e) {
      await this.player.fetchFontFile();
      const r = (n = this.player.fonts) == null ? void 0 : n.map((l) => `${this.player.options.basePath ?? ""}${l.file}${this.player.options.accessToken ? `?token=${this.player.options.accessToken}` : ""}`);
      this.player.getElement().querySelectorAll(".libassjs-canvas-parent").forEach((l) => l.remove());
      try {
        this.player.octopusInstance.dispose();
      } catch {
      }
      const o = {
        video: this.player.getVideoElement(),
        lossyRender: !0,
        subUrl: `${e}${this.player.options.accessToken ? `?token=${this.player.options.accessToken}` : ""}`,
        debug: this.player.options.debug,
        blendRender: !0,
        lazyFileLoading: !0,
        targetFps: 24,
        fonts: r,
        workerUrl: "/js/octopus/subtitles-octopus-worker.js",
        legacyWorkerUrl: "/js/octopus/subtitles-octopus-worker-legacy.js",
        onReady: async () => {
        },
        onError: (l) => {
          console.error("opus error", l);
        }
      };
      e && e.includes(".ass") && (this.player.octopusInstance = new _c(o));
    }
  }
}
const Zi = {
  back: {
    classes: [],
    hover: "M10.2949 19.7162C10.6883 20.1038 11.3215 20.0991 11.7091 19.7057C12.0967 19.3123 12.092 18.6792 11.6986 18.2915L6.32827 13.0001H19.9995C20.5517 13.0001 20.9995 12.5524 20.9995 12.0001C20.9995 11.4479 20.5517 11.0001 19.9995 11.0001H6.33488L11.6986 5.71525C12.092 5.32763 12.0967 4.69448 11.7091 4.30108C11.3215 3.90767 10.6883 3.90298 10.2949 4.29061L3.37073 11.113C2.87382 11.6026 2.87382 12.4042 3.37073 12.8938L10.2949 19.7162Z",
    normal: "M10.7327 19.7905C11.0326 20.0762 11.5074 20.0646 11.7931 19.7647C12.0787 19.4648 12.0672 18.99 11.7673 18.7043L5.51587 12.7497L20.25 12.7497C20.6642 12.7497 21 12.4139 21 11.9997C21 11.5855 20.6642 11.2497 20.25 11.2497L5.51577 11.2497L11.7673 5.29502C12.0672 5.00933 12.0787 4.5346 11.7931 4.23467C11.5074 3.93475 11.0326 3.9232 10.7327 4.20889L3.31379 11.2756C3.14486 11.4365 3.04491 11.6417 3.01393 11.8551C3.00479 11.9019 3 11.9503 3 11.9997C3 12.0493 3.00481 12.0977 3.01398 12.1446C3.04502 12.3579 3.14496 12.563 3.31379 12.7238L10.7327 19.7905Z",
    title: "Back"
  },
  checkmark: {
    classes: [],
    hover: "M8.5 16.5858L4.70711 12.7929C4.31658 12.4024 3.68342 12.4024 3.29289 12.7929C2.90237 13.1834 2.90237 13.8166 3.29289 14.2071L7.79289 18.7071C8.18342 19.0976 8.81658 19.0976 9.20711 18.7071L20.2071 7.70711C20.5976 7.31658 20.5976 6.68342 20.2071 6.29289C19.8166 5.90237 19.1834 5.90237 18.7929 6.29289L8.5 16.5858Z",
    normal: "M8.5 16.5858L4.70711 12.7929C4.31658 12.4024 3.68342 12.4024 3.29289 12.7929C2.90237 13.1834 2.90237 13.8166 3.29289 14.2071L7.79289 18.7071C8.18342 19.0976 8.81658 19.0976 9.20711 18.7071L20.2071 7.70711C20.5976 7.31658 20.5976 6.68342 20.2071 6.29289C19.8166 5.90237 19.1834 5.90237 18.7929 6.29289L8.5 16.5858Z",
    title: ""
  },
  chevronL: {
    classes: [],
    hover: "M15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L9.41421 12L15.7071 18.2929C16.0976 18.6834 16.0976 19.3166 15.7071 19.7071C15.3166 20.0976 14.6834 20.0976 14.2929 19.7071L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289Z",
    normal: "M15.5303 4.21967C15.8232 4.51256 15.8232 4.98744 15.5303 5.28033L8.81066 12L15.5303 18.7197C15.8232 19.0126 15.8232 19.4874 15.5303 19.7803C15.2374 20.0732 14.7626 20.0732 14.4697 19.7803L7.21967 12.5303C6.92678 12.2374 6.92678 11.7626 7.21967 11.4697L14.4697 4.21967C14.7626 3.92678 15.2374 3.92678 15.5303 4.21967Z",
    title: ""
  },
  chevronR: {
    classes: [],
    hover: "M8.29289 4.29289C7.90237 4.68342 7.90237 5.31658 8.29289 5.70711L14.5858 12L8.29289 18.2929C7.90237 18.6834 7.90237 19.3166 8.29289 19.7071C8.68342 20.0976 9.31658 20.0976 9.70711 19.7071L16.7071 12.7071C17.0976 12.3166 17.0976 11.6834 16.7071 11.2929L9.70711 4.29289C9.31658 3.90237 8.68342 3.90237 8.29289 4.29289Z",
    normal: "M8.46967 4.21967C8.17678 4.51256 8.17678 4.98744 8.46967 5.28033L15.1893 12L8.46967 18.7197C8.17678 19.0126 8.17678 19.4874 8.46967 19.7803C8.76256 20.0732 9.23744 20.0732 9.53033 19.7803L16.7803 12.5303C17.0732 12.2374 17.0732 11.7626 16.7803 11.4697L9.53033 4.21967C9.23744 3.92678 8.76256 3.92678 8.46967 4.21967Z",
    title: ""
  },
  close: {
    classes: [],
    hover: "M4.2097 4.3871L4.29289 4.29289C4.65338 3.93241 5.22061 3.90468 5.6129 4.2097L5.70711 4.29289L12 10.585L18.2929 4.29289C18.6834 3.90237 19.3166 3.90237 19.7071 4.29289C20.0976 4.68342 20.0976 5.31658 19.7071 5.70711L13.415 12L19.7071 18.2929C20.0676 18.6534 20.0953 19.2206 19.7903 19.6129L19.7071 19.7071C19.3466 20.0676 18.7794 20.0953 18.3871 19.7903L18.2929 19.7071L12 13.415L5.70711 19.7071C5.31658 20.0976 4.68342 20.0976 4.29289 19.7071C3.90237 19.3166 3.90237 18.6834 4.29289 18.2929L10.585 12L4.29289 5.70711C3.93241 5.34662 3.90468 4.77939 4.2097 4.3871L4.29289 4.29289L4.2097 4.3871Z",
    normal: "M4.39705 4.55379L4.46967 4.46967C4.73594 4.2034 5.1526 4.1792 5.44621 4.39705L5.53033 4.46967L12 10.939L18.4697 4.46967C18.7626 4.17678 19.2374 4.17678 19.5303 4.46967C19.8232 4.76256 19.8232 5.23744 19.5303 5.53033L13.061 12L19.5303 18.4697C19.7966 18.7359 19.8208 19.1526 19.6029 19.4462L19.5303 19.5303C19.2641 19.7966 18.8474 19.8208 18.5538 19.6029L18.4697 19.5303L12 13.061L5.53033 19.5303C5.23744 19.8232 4.76256 19.8232 4.46967 19.5303C4.17678 19.2374 4.17678 18.7626 4.46967 18.4697L10.939 12L4.46967 5.53033C4.2034 5.26406 4.1792 4.8474 4.39705 4.55379L4.46967 4.46967L4.39705 4.55379Z",
    title: ""
  },
  exitFullscreen: {
    classes: [],
    hover: "M21.7776 2.22205C22.0437 2.48828 22.0679 2.90495 21.8503 3.19858L21.7778 3.28271L15.555 9.50644L21.2476 9.50739C21.6273 9.50739 21.9411 9.78954 21.9908 10.1556L21.9976 10.2574C21.9976 10.6371 21.7155 10.9509 21.3494 11.0005L21.2476 11.0074L13.6973 11.005L13.6824 11.0038C13.6141 10.9986 13.5486 10.984 13.487 10.9614L13.3892 10.9159C13.1842 10.8058 13.037 10.6023 13.0034 10.3623L12.9961 10.2574V2.7535C12.9961 2.33929 13.3319 2.0035 13.7461 2.0035C14.1258 2.0035 14.4396 2.28565 14.4893 2.65173L14.4961 2.7535L14.496 8.44444L20.7178 2.22217C21.0104 1.92925 21.4849 1.92919 21.7776 2.22205ZM11.0025 13.7547V21.2586C11.0025 21.6728 10.6667 22.0086 10.2525 22.0086C9.8728 22.0086 9.55901 21.7265 9.50935 21.3604L9.5025 21.2586L9.502 15.5634L3.28039 21.7794C2.98753 22.0723 2.51266 22.0724 2.21973 21.7795C1.95343 21.5133 1.92918 21.0966 2.147 20.803L2.21961 20.7189L8.44 14.5044L2.75097 14.5047C2.37128 14.5047 2.05748 14.2226 2.00782 13.8565L2.00097 13.7547C2.00097 13.3405 2.33676 13.0047 2.75097 13.0047L10.3053 13.0066L10.3788 13.0153L10.4763 13.0387L10.5291 13.0574L10.6154 13.0982L10.7039 13.1557C10.7598 13.1979 10.8095 13.2477 10.8517 13.3035L10.9185 13.4095L10.9592 13.503L10.9806 13.5739L10.9919 13.6286L10.998 13.6864L10.9986 13.678L11.0025 13.7547Z",
    normal: "M21.7776 2.22205C22.0437 2.48828 22.0679 2.90495 21.8503 3.19858L21.7778 3.28271L15.555 9.50644L21.2476 9.50739C21.6273 9.50739 21.9411 9.78954 21.9908 10.1556L21.9976 10.2574C21.9976 10.6371 21.7155 10.9509 21.3494 11.0005L21.2476 11.0074L13.6973 11.005L13.6824 11.0038C13.6141 10.9986 13.5486 10.984 13.487 10.9614L13.3892 10.9159C13.1842 10.8058 13.037 10.6023 13.0034 10.3623L12.9961 10.2574V2.7535C12.9961 2.33929 13.3319 2.0035 13.7461 2.0035C14.1258 2.0035 14.4396 2.28565 14.4893 2.65173L14.4961 2.7535L14.496 8.44444L20.7178 2.22217C21.0104 1.92925 21.4849 1.92919 21.7776 2.22205ZM11.0025 13.7547V21.2586C11.0025 21.6728 10.6667 22.0086 10.2525 22.0086C9.8728 22.0086 9.55901 21.7265 9.50935 21.3604L9.5025 21.2586L9.502 15.5634L3.28039 21.7794C2.98753 22.0723 2.51266 22.0724 2.21973 21.7795C1.95343 21.5133 1.92918 21.0966 2.147 20.803L2.21961 20.7189L8.44 14.5044L2.75097 14.5047C2.37128 14.5047 2.05748 14.2226 2.00782 13.8565L2.00097 13.7547C2.00097 13.3405 2.33676 13.0047 2.75097 13.0047L10.3053 13.0066L10.3788 13.0153L10.4763 13.0387L10.5291 13.0574L10.6154 13.0982L10.7039 13.1557C10.7598 13.1979 10.8095 13.2477 10.8517 13.3035L10.9185 13.4095L10.9592 13.503L10.9806 13.5739L10.9919 13.6286L10.998 13.6864L10.9986 13.678L11.0025 13.7547Z",
    title: "Exit fullscreen"
  },
  fullscreen: {
    classes: [],
    hover: "M12.4958 3.00195L20.0515 3.00341L20.1724 3.01731L20.2601 3.03685L20.364 3.07133L20.4532 3.11166L20.5169 3.14728L20.5795 3.1888L20.6435 3.2387L20.7066 3.29703L20.801 3.40667L20.8726 3.51791L20.9261 3.63064L20.9615 3.73598L20.9771 3.80116L20.9863 3.85351L20.9973 4.00195V11.5058C20.9973 12.0581 20.5496 12.5058 19.9973 12.5058C19.4845 12.5058 19.0618 12.1198 19.004 11.6225L18.9973 11.5058L18.997 6.41595L6.41205 19L11.4996 19.0005C12.0124 19.0005 12.4351 19.3865 12.4928 19.8839L12.4996 20.0005C12.4996 20.5133 12.1135 20.936 11.6162 20.9938L11.4996 21.0005L3.93864 20.9987L3.84306 20.9885L3.76641 20.9735L3.68892 20.9517L3.61989 20.9265L3.5298 20.8843L3.44025 20.8306L3.34879 20.7611L3.3813 20.7877C3.31948 20.7392 3.26352 20.6836 3.21466 20.6221L3.16353 20.5517L3.12477 20.4882L3.09178 20.4237L3.05798 20.3423L3.03287 20.2627L3.00936 20.1509L3.00201 20.0897L2.99805 20.0005V12.4966C2.99805 11.9443 3.44576 11.4966 3.99805 11.4966C4.51088 11.4966 4.93355 11.8826 4.99132 12.38L4.99805 12.4966V17.585L17.582 5.00195H12.4958C11.9829 5.00195 11.5603 4.61591 11.5025 4.11857L11.4958 4.00195C11.4958 3.44967 11.9435 3.00195 12.4958 3.00195Z",
    normal: "M12.748 3.00122L20.3018 3.00173L20.402 3.01565L20.5009 3.04325L20.562 3.06918C20.641 3.10407 20.7149 3.1546 20.7798 3.21953L20.8206 3.26357L20.8811 3.34505L20.9183 3.41008L20.957 3.50039L20.9761 3.56452L20.9897 3.62846L20.999 3.72165L20.9996 11.2551C20.9996 11.6693 20.6638 12.0051 20.2496 12.0051C19.8699 12.0051 19.5561 11.723 19.5064 11.3569L19.4996 11.2551L19.499 5.55922L5.55905 19.5042L11.2496 19.5051C11.6293 19.5051 11.9431 19.7873 11.9927 20.1533L11.9996 20.2551C11.9996 20.6348 11.7174 20.9486 11.3513 20.9983L11.2496 21.0051L3.71372 21.0043L3.68473 21.0015C3.61867 20.9969 3.55596 20.983 3.49668 20.9619L3.40655 20.923L3.38936 20.9125C3.18516 20.8021 3.03871 20.5991 3.00529 20.3597L2.99805 20.2551V12.7512C2.99805 12.337 3.33383 12.0012 3.74805 12.0012C4.12774 12.0012 4.44154 12.2834 4.4912 12.6495L4.49805 12.7512V18.4432L18.438 4.50022L12.748 4.50122C12.3684 4.50122 12.0546 4.21907 12.0049 3.85299L11.998 3.75122C11.998 3.37152 12.2802 3.05773 12.6463 3.00807L12.748 3.00122Z",
    title: "Fullscreen"
  },
  home: {
    classes: [],
    hover: "M10.5492 2.53415C11.3872 1.82716 12.6128 1.82716 13.4508 2.53415L20.2008 8.22869C20.7076 8.6562 21 9.28545 21 9.94844V19.7514C21 20.7179 20.2165 21.5014 19.25 21.5014H16.25C15.2835 21.5014 14.5 20.7179 14.5 19.7514V14.7514C14.5 14.3372 14.1642 14.0014 13.75 14.0014H10.25C9.83579 14.0014 9.5 14.3372 9.5 14.7514V19.7514C9.5 20.7179 8.7165 21.5014 7.75 21.5014H4.75C3.7835 21.5014 3 20.7179 3 19.7514V9.94844C3 9.28545 3.29241 8.6562 3.79916 8.22869L10.5492 2.53415Z",
    normal: "M10.5495 2.53189C11.3874 1.82531 12.6126 1.82531 13.4505 2.5319L20.2005 8.224C20.7074 8.65152 21 9.2809 21 9.94406V19.7468C21 20.7133 20.2165 21.4968 19.25 21.4968H15.75C14.7835 21.4968 14 20.7133 14 19.7468V14.2468C14 14.1088 13.8881 13.9968 13.75 13.9968H10.25C10.1119 13.9968 9.99999 14.1088 9.99999 14.2468V19.7468C9.99999 20.7133 9.2165 21.4968 8.25 21.4968H4.75C3.7835 21.4968 3 20.7133 3 19.7468V9.94406C3 9.2809 3.29255 8.65152 3.79952 8.224L10.5495 2.53189ZM12.4835 3.6786C12.2042 3.44307 11.7958 3.44307 11.5165 3.6786L4.76651 9.37071C4.59752 9.51321 4.5 9.72301 4.5 9.94406V19.7468C4.5 19.8849 4.61193 19.9968 4.75 19.9968H8.25C8.38807 19.9968 8.49999 19.8849 8.49999 19.7468V14.2468C8.49999 13.2803 9.2835 12.4968 10.25 12.4968H13.75C14.7165 12.4968 15.5 13.2803 15.5 14.2468V19.7468C15.5 19.8849 15.6119 19.9968 15.75 19.9968H19.25C19.3881 19.9968 19.5 19.8849 19.5 19.7468V9.94406C19.5 9.72301 19.4025 9.51321 19.2335 9.37071L12.4835 3.6786Z",
    title: "Home"
  },
  language: {
    classes: [],
    hover: "M11.9996 1.99805C17.5233 1.99805 22.0011 6.47589 22.0011 11.9996C22.0011 17.5233 17.5233 22.0011 11.9996 22.0011C6.47589 22.0011 1.99805 17.5233 1.99805 11.9996C1.99805 6.47589 6.47589 1.99805 11.9996 1.99805ZM14.9385 16.4993H9.06069C9.71273 18.9135 10.8461 20.5011 11.9996 20.5011C13.1531 20.5011 14.2865 18.9135 14.9385 16.4993ZM7.50791 16.4999L4.78542 16.4998C5.74376 18.0328 7.17721 19.2384 8.87959 19.9104C8.35731 19.0906 7.92632 18.0643 7.60932 16.8949L7.50791 16.4999ZM19.2138 16.4998L16.4913 16.4999C16.1675 17.8337 15.6999 18.9995 15.1185 19.9104C16.7155 19.2804 18.0752 18.1814 19.0286 16.7833L19.2138 16.4998ZM7.09302 9.99895H3.73542L3.73066 10.0162C3.57858 10.6525 3.49805 11.3166 3.49805 11.9996C3.49805 13.0558 3.69064 14.0669 4.04261 14.9999L7.21577 14.9995C7.07347 14.0504 6.99805 13.0422 6.99805 11.9996C6.99805 11.3156 7.03051 10.6464 7.09302 9.99895ZM15.3965 9.99901H8.60267C8.53465 10.6393 8.49805 11.309 8.49805 11.9996C8.49805 13.0591 8.58419 14.0694 8.73778 14.9997H15.2614C15.415 14.0694 15.5011 13.0591 15.5011 11.9996C15.5011 11.309 15.4645 10.6393 15.3965 9.99901ZM20.2642 9.99811L16.9062 9.99897C16.9687 10.6464 17.0011 11.3156 17.0011 11.9996C17.0011 13.0422 16.9257 14.0504 16.7834 14.9995L19.9566 14.9999C20.3086 14.0669 20.5011 13.0558 20.5011 11.9996C20.5011 11.3102 20.4191 10.64 20.2642 9.99811ZM8.88065 4.08875L8.85774 4.09747C6.81043 4.91218 5.15441 6.49949 4.24975 8.49935L7.29787 8.49972C7.61122 6.74693 8.15807 5.221 8.88065 4.08875ZM11.9996 3.49805L11.8839 3.50335C10.6185 3.6191 9.39603 5.62107 8.82831 8.4993H15.1709C14.6048 5.62914 13.3875 3.63033 12.1259 3.50436L11.9996 3.49805ZM15.1196 4.08881L15.2264 4.2629C15.8957 5.37537 16.4038 6.83525 16.7013 8.49972L19.7494 8.49935C18.8848 6.58795 17.3338 5.05341 15.4108 4.21008L15.1196 4.08881Z",
    normal: "M8.90386 16.5008H15.0953C14.4754 19.7722 13.234 21.999 11.9996 21.999C10.8026 21.999 9.59902 19.9051 8.96191 16.7953L8.90386 16.5008H15.0953H8.90386ZM3.0654 16.501L7.37104 16.5008C7.73581 18.583 8.35409 20.3545 9.16323 21.5942C6.60039 20.8373 4.46673 19.0825 3.21175 16.7799L3.0654 16.501ZM16.6282 16.5008L20.9338 16.501C19.7025 18.9406 17.5013 20.8071 14.837 21.5939C15.5915 20.4362 16.1802 18.8162 16.5519 16.9129L16.6282 16.5008L20.9338 16.501L16.6282 16.5008ZM16.9311 10.0008L21.8011 10.0002C21.9323 10.6465 22.0011 11.3155 22.0011 12.0005C22.0011 13.0458 21.8408 14.0537 21.5433 15.0009H16.8407C16.946 14.0433 17.0011 13.0372 17.0011 12.0005C17.0011 11.5462 16.9906 11.0977 16.9698 10.6567L16.9311 10.0008L21.8011 10.0002L16.9311 10.0008ZM2.19811 10.0002L7.06814 10.0008C7.02189 10.6508 6.99805 11.319 6.99805 12.0005C6.99805 12.8299 7.03336 13.6396 7.10139 14.4207L7.15851 15.0009H2.45588C2.15841 14.0537 1.99805 13.0458 1.99805 12.0005C1.99805 11.3155 2.06692 10.6465 2.19811 10.0002ZM8.57509 10.0002H15.4241C15.4744 10.6459 15.5011 11.3147 15.5011 12.0005C15.5011 12.8381 15.4612 13.6505 15.3873 14.4262L15.3256 15.0009H8.67355C8.5605 14.0551 8.49805 13.0476 8.49805 12.0005C8.49805 11.4862 8.51312 10.9814 8.54185 10.4887L8.57509 10.0002H15.4241H8.57509ZM14.9439 2.57707L14.836 2.40684C17.8543 3.29781 20.2783 5.57442 21.3715 8.50016L16.7806 8.50045C16.4651 6.08353 15.8242 4.00785 14.9439 2.57707L14.836 2.40684L14.9439 2.57707ZM9.04137 2.44365L9.16315 2.40688C8.28239 3.75639 7.62778 5.736 7.28013 8.06062L7.21856 8.50045L2.62767 8.50016C3.70614 5.6139 6.07973 3.35936 9.04137 2.44365L9.16315 2.40688L9.04137 2.44365ZM11.9996 2.00195C13.3184 2.00195 14.6452 4.5437 15.2136 8.1854L15.2604 8.5002H8.73878C9.27819 4.69102 10.6431 2.00195 11.9996 2.00195Z",
    title: "Language"
  },
  languageOff: {
    classes: [],
    hover: "M8.90386 16.5008H15.0953C14.4754 19.7722 13.234 21.999 11.9996 21.999C10.8026 21.999 9.59902 19.9051 8.96191 16.7953L8.90386 16.5008H15.0953H8.90386ZM3.0654 16.501L7.37104 16.5008C7.73581 18.583 8.35409 20.3545 9.16323 21.5942C6.60039 20.8373 4.46673 19.0825 3.21175 16.7799L3.0654 16.501ZM16.6282 16.5008L20.9338 16.501C19.7025 18.9406 17.5013 20.8071 14.837 21.5939C15.5915 20.4362 16.1802 18.8162 16.5519 16.9129L16.6282 16.5008L20.9338 16.501L16.6282 16.5008ZM16.9311 10.0008L21.8011 10.0002C21.9323 10.6465 22.0011 11.3155 22.0011 12.0005C22.0011 13.0458 21.8408 14.0537 21.5433 15.0009H16.8407C16.946 14.0433 17.0011 13.0372 17.0011 12.0005C17.0011 11.5462 16.9906 11.0977 16.9698 10.6567L16.9311 10.0008L21.8011 10.0002L16.9311 10.0008ZM2.19811 10.0002L7.06814 10.0008C7.02189 10.6508 6.99805 11.319 6.99805 12.0005C6.99805 12.8299 7.03336 13.6396 7.10139 14.4207L7.15851 15.0009H2.45588C2.15841 14.0537 1.99805 13.0458 1.99805 12.0005C1.99805 11.3155 2.06692 10.6465 2.19811 10.0002ZM8.57509 10.0002H15.4241C15.4744 10.6459 15.5011 11.3147 15.5011 12.0005C15.5011 12.8381 15.4612 13.6505 15.3873 14.4262L15.3256 15.0009H8.67355C8.5605 14.0551 8.49805 13.0476 8.49805 12.0005C8.49805 11.4862 8.51312 10.9814 8.54185 10.4887L8.57509 10.0002H15.4241H8.57509ZM14.9439 2.57707L14.836 2.40684C17.8543 3.29781 20.2783 5.57442 21.3715 8.50016L16.7806 8.50045C16.4651 6.08353 15.8242 4.00785 14.9439 2.57707L14.836 2.40684L14.9439 2.57707ZM9.04137 2.44365L9.16315 2.40688C8.28239 3.75639 7.62778 5.736 7.28013 8.06062L7.21856 8.50045L2.62767 8.50016C3.70614 5.6139 6.07973 3.35936 9.04137 2.44365L9.16315 2.40688L9.04137 2.44365ZM11.9996 2.00195C13.3184 2.00195 14.6452 4.5437 15.2136 8.1854L15.2604 8.5002H8.73878C9.27819 4.69102 10.6431 2.00195 11.9996 2.00195Z",
    normal: "M11.9996 1.99805C17.5233 1.99805 22.0011 6.47589 22.0011 11.9996C22.0011 17.5233 17.5233 22.0011 11.9996 22.0011C6.47589 22.0011 1.99805 17.5233 1.99805 11.9996C1.99805 6.47589 6.47589 1.99805 11.9996 1.99805ZM14.9385 16.4993H9.06069C9.71273 18.9135 10.8461 20.5011 11.9996 20.5011C13.1531 20.5011 14.2865 18.9135 14.9385 16.4993ZM7.50791 16.4999L4.78542 16.4998C5.74376 18.0328 7.17721 19.2384 8.87959 19.9104C8.35731 19.0906 7.92632 18.0643 7.60932 16.8949L7.50791 16.4999ZM19.2138 16.4998L16.4913 16.4999C16.1675 17.8337 15.6999 18.9995 15.1185 19.9104C16.7155 19.2804 18.0752 18.1814 19.0286 16.7833L19.2138 16.4998ZM7.09302 9.99895H3.73542L3.73066 10.0162C3.57858 10.6525 3.49805 11.3166 3.49805 11.9996C3.49805 13.0558 3.69064 14.0669 4.04261 14.9999L7.21577 14.9995C7.07347 14.0504 6.99805 13.0422 6.99805 11.9996C6.99805 11.3156 7.03051 10.6464 7.09302 9.99895ZM15.3965 9.99901H8.60267C8.53465 10.6393 8.49805 11.309 8.49805 11.9996C8.49805 13.0591 8.58419 14.0694 8.73778 14.9997H15.2614C15.415 14.0694 15.5011 13.0591 15.5011 11.9996C15.5011 11.309 15.4645 10.6393 15.3965 9.99901ZM20.2642 9.99811L16.9062 9.99897C16.9687 10.6464 17.0011 11.3156 17.0011 11.9996C17.0011 13.0422 16.9257 14.0504 16.7834 14.9995L19.9566 14.9999C20.3086 14.0669 20.5011 13.0558 20.5011 11.9996C20.5011 11.3102 20.4191 10.64 20.2642 9.99811ZM8.88065 4.08875L8.85774 4.09747C6.81043 4.91218 5.15441 6.49949 4.24975 8.49935L7.29787 8.49972C7.61122 6.74693 8.15807 5.221 8.88065 4.08875ZM11.9996 3.49805L11.8839 3.50335C10.6185 3.6191 9.39603 5.62107 8.82831 8.4993H15.1709C14.6048 5.62914 13.3875 3.63033 12.1259 3.50436L11.9996 3.49805ZM15.1196 4.08881L15.2264 4.2629C15.8957 5.37537 16.4038 6.83525 16.7013 8.49972L19.7494 8.49935C18.8848 6.58795 17.3338 5.05341 15.4108 4.21008L15.1196 4.08881Z",
    title: "Language"
  },
  next: {
    classes: [],
    hover: "M2.99998 4.753C2.99998 3.34519 4.57779 2.51363 5.73913 3.30937L16.2376 10.5028C17.2478 11.1949 17.253 12.6839 16.2476 13.3831L5.74918 20.6847C4.58885 21.4917 2.99998 20.6613 2.99998 19.248V4.753ZM20.9999 3.75C20.9999 3.33579 20.6641 3 20.2499 3C19.8357 3 19.4999 3.33579 19.4999 3.75V20.25C19.4999 20.6642 19.8357 21 20.2499 21C20.6641 21 20.9999 20.6642 20.9999 20.25V3.75Z",
    normal: "M3 4.753C3 3.34519 4.57781 2.51363 5.73916 3.30937L16.2376 10.5028C17.2478 11.1949 17.253 12.6839 16.2477 13.3831L5.7492 20.6847C4.58887 21.4917 3 20.6613 3 19.248V4.753ZM4.89131 4.54677C4.7254 4.43309 4.5 4.55189 4.5 4.753V19.248C4.5 19.4499 4.72698 19.5685 4.89274 19.4532L15.3912 12.1517C15.5348 12.0518 15.5341 11.8391 15.3898 11.7402L4.89131 4.54677ZM20.9999 3.75C20.9999 3.33579 20.6641 3 20.2499 3C19.8357 3 19.4999 3.33579 19.4999 3.75V20.25C19.4999 20.6642 19.8357 21 20.2499 21C20.6641 21 20.9999 20.6642 20.9999 20.25V3.75Z",
    title: "Next"
  },
  pause: {
    classes: [],
    hover: "M5.74609 3C4.7796 3 3.99609 3.7835 3.99609 4.75V19.25C3.99609 20.2165 4.7796 21 5.74609 21H9.24609C10.2126 21 10.9961 20.2165 10.9961 19.25V4.75C10.9961 3.7835 10.2126 3 9.24609 3H5.74609ZM14.7461 3C13.7796 3 12.9961 3.7835 12.9961 4.75V19.25C12.9961 20.2165 13.7796 21 14.7461 21H18.2461C19.2126 21 19.9961 20.2165 19.9961 19.25V4.75C19.9961 3.7835 19.2126 3 18.2461 3H14.7461Z",
    normal: "M6.25 3C5.00736 3 4 4.00736 4 5.25V18.75C4 19.9926 5.00736 21 6.25 21H8.75C9.99264 21 11 19.9926 11 18.75V5.25C11 4.00736 9.99264 3 8.75 3H6.25ZM5.5 5.25C5.5 4.83579 5.83579 4.5 6.25 4.5H8.75C9.16421 4.5 9.5 4.83579 9.5 5.25V18.75C9.5 19.1642 9.16421 19.5 8.75 19.5H6.25C5.83579 19.5 5.5 19.1642 5.5 18.75V5.25ZM15.25 3C14.0074 3 13 4.00736 13 5.25V18.75C13 19.9926 14.0074 21 15.25 21H17.75C18.9926 21 20 19.9926 20 18.75V5.25C20 4.00736 18.9926 3 17.75 3H15.25ZM14.5 5.25C14.5 4.83579 14.8358 4.5 15.25 4.5H17.75C18.1642 4.5 18.5 4.83579 18.5 5.25V18.75C18.5 19.1642 18.1642 19.5 17.75 19.5H15.25C14.8358 19.5 14.5 19.1642 14.5 18.75V5.25Z",
    title: "Play"
  },
  pipEnter: {
    classes: [],
    hover: "M5.25 3C3.45507 3 2 4.45507 2 6.25V15.75C2 17.5449 3.45507 19 5.25 19H11V15C11 13.3431 12.3431 12 14 12H21C21.3506 12 21.6872 12.0602 22 12.1707V6.25C22 4.45507 20.5449 3 18.75 3H5.25ZM6.28033 6.21967L9.5 9.43934V7.75C9.5 7.33579 9.83579 7 10.25 7C10.6642 7 11 7.33579 11 7.75V11.25C11 11.6642 10.6642 12 10.25 12H6.75C6.33579 12 6 11.6642 6 11.25C6 10.8358 6.33579 10.5 6.75 10.5H8.43934L5.21967 7.28033C4.92678 6.98744 4.92678 6.51256 5.21967 6.21967C5.51256 5.92678 5.98744 5.92678 6.28033 6.21967ZM22 13.2676C21.7058 13.0974 21.3643 13 21 13H14C12.8954 13 12 13.8954 12 15V20C12 21.1046 12.8954 22 14 22H21C22.1046 22 23 21.1046 23 20V15C23 14.2597 22.5978 13.6134 22 13.2676Z",
    normal: "M2 6.25C2 4.45507 3.45507 3 5.25 3H18.75C20.5449 3 22 4.45507 22 6.25V12H20.5V6.25C20.5 5.2835 19.7165 4.5 18.75 4.5H5.25C4.2835 4.5 3.5 5.2835 3.5 6.25V15.75C3.5 16.7165 4.2835 17.5 5.25 17.5H11V19H5.25C3.45507 19 2 17.5449 2 15.75V6.25ZM14 13C12.8954 13 12 13.8954 12 15V20C12 21.1046 12.8954 22 14 22H21C22.1046 22 23 21.1046 23 20V15C23 13.8954 22.1046 13 21 13H14ZM5.21967 6.21967C5.51256 5.92678 5.98744 5.92678 6.28033 6.21967L9.5 9.43934V7.75C9.5 7.33579 9.83579 7 10.25 7C10.6642 7 11 7.33579 11 7.75V11.25C11 11.6642 10.6642 12 10.25 12H6.75C6.33579 12 6 11.6642 6 11.25C6 10.8358 6.33579 10.5 6.75 10.5H8.43934L5.21967 7.28033C4.92678 6.98744 4.92678 6.51256 5.21967 6.21967Z",
    title: "Exit Mini player"
  },
  pipExit: {
    classes: [],
    hover: "M10 11C11.1046 11 12 10.1046 12 9V4C12 2.89543 11.1046 2 10 2H3C1.89543 2 1 2.89543 1 4V9C1 9.75939 1.42323 10.4199 2.04668 10.7586C2.33007 10.9126 2.65482 11 3 11H10ZM10 12H3C2.64936 12 2.31278 11.9398 2 11.8293V17.75C2 19.5449 3.45507 21 5.25 21H18.75C20.5449 21 22 19.5449 22 17.75V8.25C22 6.45508 20.5449 5 18.75 5H13V9C13 10.6569 11.6569 12 10 12ZM14.25 16H15.9393L13.2197 13.2803C12.9268 12.9874 12.9268 12.5126 13.2197 12.2197C13.5126 11.9268 13.9874 11.9268 14.2803 12.2197L17 14.9393V13.25C17 12.8358 17.3358 12.5 17.75 12.5C18.1642 12.5 18.5 12.8358 18.5 13.25V16.75C18.5 17.1642 18.1642 17.5 17.75 17.5H14.25C13.8358 17.5 13.5 17.1642 13.5 16.75C13.5 16.3358 13.8358 16 14.25 16Z",
    normal: "M10 11C11.1046 11 12 10.1046 12 9V4C12 2.89543 11.1046 2 10 2H3C1.89543 2 1 2.89543 1 4V9C1 9.75939 1.42323 10.4199 2.04668 10.7586C2.33007 10.9126 2.65482 11 3 11H10ZM18.75 6.5H13V5H18.75C20.5449 5 22 6.45508 22 8.25V17.75C22 19.5449 20.5449 21 18.75 21H5.25C3.45507 21 2 19.5449 2 17.75V11.8293C2.31278 11.9398 2.64936 12 3 12H3.5V17.75C3.5 18.7165 4.2835 19.5 5.25 19.5H18.75C19.7165 19.5 20.5 18.7165 20.5 17.75V8.25C20.5 7.2835 19.7165 6.5 18.75 6.5ZM15.9393 16H14.25C13.8358 16 13.5 16.3358 13.5 16.75C13.5 17.1642 13.8358 17.5 14.25 17.5H17.75C18.1642 17.5 18.5 17.1642 18.5 16.75V13.25C18.5 12.8358 18.1642 12.5 17.75 12.5C17.3358 12.5 17 12.8358 17 13.25V14.9393L14.2803 12.2197C13.9874 11.9268 13.5126 11.9268 13.2197 12.2197C12.9268 12.5126 12.9268 12.9874 13.2197 13.2803L15.9393 16Z",
    title: "Miniplayer"
  },
  bigPlay: {
    classes: ["!w-14", "!h-14"],
    hover: "M5 5.27466C5 3.5678 6.82609 2.48249 8.32538 3.29828L20.687 10.0244C22.2531 10.8766 22.2531 13.125 20.687 13.9772L8.32538 20.7033C6.82609 21.5191 5 20.4338 5 18.727V5.27466Z",
    normal: "M5 5.27466C5 3.5678 6.82609 2.48249 8.32538 3.29828L20.687 10.0244C22.2531 10.8766 22.2531 13.125 20.687 13.9772L8.32538 20.7033C6.82609 21.5191 5 20.4338 5 18.727V5.27466Z",
    title: ""
  },
  play: {
    classes: [],
    hover: "M5 5.27466C5 3.5678 6.82609 2.48249 8.32538 3.29828L20.687 10.0244C22.2531 10.8766 22.2531 13.125 20.687 13.9772L8.32538 20.7033C6.82609 21.5191 5 20.4338 5 18.727V5.27466Z",
    normal: "M7.60846 4.61586C7.1087 4.34394 6.5 4.7057 6.5 5.27466V18.727C6.5 19.2959 7.1087 19.6577 7.60846 19.3858L19.97 12.6596C20.4921 12.3755 20.4921 11.6261 19.97 11.342L7.60846 4.61586ZM5 5.27466C5 3.5678 6.82609 2.48249 8.32538 3.29828L20.687 10.0244C22.2531 10.8766 22.2531 13.125 20.687 13.9772L8.32538 20.7033C6.82609 21.5191 5 20.4338 5 18.727V5.27466Z",
    title: "Pause"
  },
  playlist: {
    classes: [],
    hover: "M5.25 3C3.45507 3 2 4.45507 2 6.25V15.25C2 17.0449 3.45508 18.5 5.25 18.5H15.75C17.5449 18.5 19 17.0449 19 15.25V6.25C19 4.45507 17.5449 3 15.75 3H5.25ZM8 13.2493V7.75213C8 7.15927 8.65542 6.80079 9.15461 7.12063L13.7729 10.0796C14.0799 10.2763 14.08 10.7249 13.7729 10.9216L9.15462 13.8808C8.65544 14.2007 8 13.8422 8 13.2493ZM7.74983 21C6.59923 21 5.58828 20.4021 5.01074 19.5H16.2498C18.3209 19.5 19.9998 17.8211 19.9998 15.75V6.01089C20.9019 6.58843 21.4998 7.59938 21.4998 8.74999V15.75C21.4998 18.6495 19.1493 21 16.2498 21H7.74983Z",
    normal: "M8 7.7518V13.249C8 13.8419 8.65544 14.2003 9.15462 13.8805L13.7729 10.9213C14.08 10.7246 14.0799 10.276 13.7729 10.0793L9.15461 7.1203C8.65542 6.80047 8 7.15894 8 7.7518ZM5.25 3C3.45507 3 2 4.45507 2 6.25V15.25C2 17.0449 3.45508 18.5 5.25 18.5H15.75C17.5449 18.5 19 17.0449 19 15.25V6.25C19 4.45507 17.5449 3 15.75 3H5.25ZM3.5 6.25C3.5 5.2835 4.2835 4.5 5.25 4.5H15.75C16.7165 4.5 17.5 5.2835 17.5 6.25V15.25C17.5 16.2165 16.7165 17 15.75 17H5.25C4.2835 17 3.5 16.2165 3.5 15.25V6.25ZM5.01074 19.5C5.58828 20.4021 6.59923 21 7.74983 21H16.2498C19.1493 21 21.4998 18.6495 21.4998 15.75V8.74999C21.4998 7.59938 20.9019 6.58843 19.9998 6.01089V15.75C19.9998 17.8211 18.3209 19.5 16.2498 19.5H5.01074Z",
    title: "Playlist"
  },
  previous: {
    classes: [],
    hover: "M3 3.75C3 3.33579 3.33579 3 3.75 3C4.16421 3 4.5 3.33579 4.5 3.75V20.25C4.5 20.6642 4.16421 21 3.75 21C3.33579 21 3 20.6642 3 20.25V3.75ZM20.9999 4.753C20.9999 3.34519 19.4221 2.51363 18.2608 3.30937L7.76231 10.5028C6.75214 11.1949 6.74694 12.6839 7.75226 13.3831L18.2507 20.6847C19.4111 21.4917 20.9999 20.6613 20.9999 19.248V4.753Z",
    normal: "M20.9999 4.753C20.9999 3.34519 19.4221 2.51363 18.2607 3.30937L7.76228 10.5028C6.7521 11.1949 6.74691 12.6839 7.75223 13.3831L18.2507 20.6847C19.411 21.4917 20.9999 20.6613 20.9999 19.248V4.753ZM19.1086 4.54677C19.2745 4.43309 19.4999 4.55189 19.4999 4.753V19.248C19.4999 19.4499 19.2729 19.5685 19.1072 19.4532L8.60869 12.1517C8.46507 12.0518 8.46581 11.8391 8.61013 11.7402L19.1086 4.54677ZM3 3.75C3 3.33579 3.33579 3 3.75 3C4.16421 3 4.5 3.33579 4.5 3.75V20.25C4.5 20.6642 4.16421 21 3.75 21C3.33579 21 3 20.6642 3 20.25V3.75Z",
    title: "Previous"
  },
  quality: {
    classes: [],
    hover: "M14.5 14.5V9.5H14.75C15.7165 9.5 16.5 10.2835 16.5 11.25V12.75C16.5 13.7165 15.7165 14.5 14.75 14.5H14.5ZM5.25 3C3.45507 3 2 4.45507 2 6.25V17.75C2 19.5449 3.45507 21 5.25 21H18.75C20.5449 21 22 19.5449 22 17.75V6.25C22 4.45507 20.5449 3 18.75 3H5.25ZM7.25 8C7.66421 8 8 8.33579 8 8.75V11.5H10V8.75C10 8.33579 10.3358 8 10.75 8C11.1642 8 11.5 8.33579 11.5 8.75V15.25C11.5 15.6642 11.1642 16 10.75 16C10.3358 16 10 15.6642 10 15.25V13H8V15.25C8 15.6642 7.66421 16 7.25 16C6.83579 16 6.5 15.6642 6.5 15.25V8.75C6.5 8.33579 6.83579 8 7.25 8ZM13.75 8H14.75C16.5449 8 18 9.45507 18 11.25V12.75C18 14.5449 16.5449 16 14.75 16H13.75C13.3358 16 13 15.6642 13 15.25V8.75C13 8.33579 13.3358 8 13.75 8Z",
    normal: "M7.68182 8C8.05838 8 8.36364 8.33579 8.36364 8.75V11.5H10.1818V8.75C10.1818 8.33579 10.4871 8 10.8636 8C11.2402 8 11.5455 8.33579 11.5455 8.75V15.25C11.5455 15.6642 11.2402 16 10.8636 16C10.4871 16 10.1818 15.6642 10.1818 15.25V13H8.36364V15.25C8.36364 15.6642 8.05838 16 7.68182 16C7.30526 16 7 15.6642 7 15.25V8.75C7 8.33579 7.30526 8 7.68182 8ZM13.5909 8C13.2144 8 12.9091 8.33579 12.9091 8.75V15.25C12.9091 15.6642 13.2144 16 13.5909 16H14.5C16.1318 16 17.4545 14.5449 17.4545 12.75V11.25C17.4545 9.45507 16.1318 8 14.5 8H13.5909ZM14.2727 14.5V9.5H14.5C15.3786 9.5 16.0909 10.2835 16.0909 11.25V12.75C16.0909 13.7165 15.3786 14.5 14.5 14.5H14.2727ZM2 6.25C2 4.45507 3.3228 3 4.95455 3H19.0455C20.6772 3 22 4.45507 22 6.25V17.75C22 19.5449 20.6772 21 19.0455 21H4.95455C3.32279 21 2 19.5449 2 17.75V6.25ZM4.95455 4.5C4.07591 4.5 3.36364 5.2835 3.36364 6.25V17.75C3.36364 18.7165 4.07591 19.5 4.95455 19.5H19.0455C19.9241 19.5 20.6364 18.7165 20.6364 17.75V6.25C20.6364 5.2835 19.9241 4.5 19.0455 4.5H12H4.95455Z",
    title: "Quality"
  },
  seekBack: {
    classes: [],
    hover: "M3 2.25C2.44772 2.25 2 2.69772 2 3.25V9C2 9.55228 2.44772 10 3 10H8.25C8.80228 10 9.25 9.55228 9.25 9C9.25 8.44772 8.80228 8 8.25 8H4.86322C5.84764 6.82148 7.07149 5.88667 8.54543 5.43056C10.5599 4.80719 12.6883 4.86076 14.6512 5.5909C16.6322 6.3278 18.4615 7.82215 19.373 9.48443C19.6385 9.96869 20.2463 10.146 20.7306 9.88048C21.2149 9.61495 21.3922 9.00712 21.1267 8.52286C19.9517 6.38003 17.7122 4.59567 15.3485 3.71639C12.9665 2.83033 10.3848 2.76779 7.9542 3.51995C6.37802 4.00769 5.0679 4.8994 4 5.97875V3.25C4 2.69772 3.55228 2.25 3 2.25ZM9.75015 12C9.75015 11.5806 9.48843 11.2057 9.0947 11.0612C8.70097 10.9167 8.2589 11.0333 7.98758 11.3531C7.91356 11.4403 7.84033 11.5288 7.76611 11.6185C7.25079 12.2412 6.68817 12.921 5.48566 13.6425C5.01208 13.9266 4.85851 14.5409 5.14266 15.0145C5.42681 15.4881 6.04107 15.6416 6.51465 15.3575C6.9978 15.0676 7.40387 14.7762 7.75015 14.4929V19.9998C7.75015 20.5521 8.19795 20.9998 8.75028 20.9998C9.30252 20.9997 9.75015 20.552 9.75015 19.9998V12ZM16.25 11C14.8639 11 13.8505 11.6354 13.2417 12.6611C12.678 13.6107 12.5 14.8223 12.5 16C12.5 17.1777 12.678 18.3893 13.2417 19.3389C13.8505 20.3646 14.8639 21 16.25 21C17.6361 21 18.6495 20.3646 19.2583 19.3389C19.822 18.3893 20 17.1777 20 16C20 14.8223 19.822 13.6107 19.2583 12.6611C18.6495 11.6354 17.6361 11 16.25 11ZM14.5 16C14.5 14.9686 14.6658 14.1802 14.9615 13.682C15.212 13.26 15.5736 13 16.25 13C16.9264 13 17.288 13.26 17.5385 13.682C17.8342 14.1802 18 14.9686 18 16C18 17.0314 17.8342 17.8198 17.5385 18.318C17.288 18.74 16.9264 19 16.25 19C15.5736 19 15.212 18.74 14.9615 18.318C14.6658 17.8198 14.5 17.0314 14.5 16Z",
    normal: "M2.74999 2.5C2.33578 2.5 2 2.83579 2 3.25V8.75C2 9.16421 2.33578 9.5 2.74999 9.5H8.25011C8.66432 9.5 9.00011 9.16421 9.00011 8.75C9.00011 8.33579 8.66432 8 8.25011 8H4.34273C5.40077 6.60212 6.77033 5.4648 8.47169 4.93832C10.5381 4.29885 12.7232 4.35354 14.7384 5.10317C16.7673 5.85787 18.6479 7.38847 19.5922 9.11081C19.7914 9.47401 20.2473 9.607 20.6105 9.40785C20.9736 9.20871 21.1066 8.75284 20.9075 8.38964C19.7655 6.30687 17.5773 4.55877 15.2614 3.69728C12.9318 2.83072 10.4069 2.7693 8.02826 3.50536C6.14955 4.08673 4.65345 5.26153 3.49999 6.64949V3.25C3.49999 2.83579 3.1642 2.5 2.74999 2.5ZM8.95266 11.0278C9.27643 11.1186 9.50022 11.4138 9.50022 11.75V20.25C9.50022 20.6642 9.16443 21 8.75022 21C8.33601 21 8.00023 20.6642 8.00023 20.25V13.8328C7.61793 14.202 7.16004 14.5788 6.63611 14.8931C6.28093 15.1062 5.82024 14.9911 5.60713 14.6359C5.39402 14.2807 5.5092 13.82 5.86438 13.6069C6.53976 13.2017 7.10401 12.6421 7.50653 12.1678C7.70552 11.9334 7.85963 11.7261 7.96279 11.5793C8.01427 11.5061 8.05276 11.4483 8.07751 11.4103C8.08989 11.3913 8.0988 11.3772 8.10417 11.3687L8.10951 11.3602L8.11019 11.359C8.28503 11.072 8.629 10.9371 8.95266 11.0278ZM13.1988 12.629C13.7527 11.6377 14.6822 11 16.002 11C17.3218 11 18.2513 11.6377 18.8052 12.629C19.3266 13.5624 19.502 14.7762 19.502 16C19.502 17.2238 19.3266 18.4376 18.8052 19.371C18.2513 20.3623 17.3218 21 16.002 21C14.6822 21 13.7527 20.3623 13.1988 19.371C12.6774 18.4376 12.502 17.2238 12.502 16C12.502 14.7762 12.6774 13.5624 13.1988 12.629ZM14.5083 13.3606C14.1704 13.9654 14.002 14.8766 14.002 16C14.002 17.1234 14.1704 18.0346 14.5083 18.6394C14.8139 19.1863 15.2593 19.5 16.002 19.5C16.7447 19.5 17.1901 19.1863 17.4957 18.6394C17.8336 18.0346 18.002 17.1234 18.002 16C18.002 14.8766 17.8336 13.9654 17.4957 13.3606C17.1901 12.8137 16.7447 12.5 16.002 12.5C15.2593 12.5 14.8139 12.8137 14.5083 13.3606Z",
    title: "Seek Back"
  },
  seekForward: {
    classes: [],
    hover: "M21 2.25C21.5523 2.25 22 2.69772 22 3.25001V9.00005C22 9.55234 21.5523 10.0001 21 10.0001H15.75C15.1977 10.0001 14.75 9.55234 14.75 9.00005C14.75 8.44777 15.1977 8.00005 15.75 8.00005H19.1369C18.1525 6.82145 16.9286 5.88657 15.4546 5.43043C13.4401 4.80706 11.3117 4.86063 9.34883 5.59077C7.3678 6.32768 5.53848 7.82204 4.62703 9.48433C4.3615 9.9686 3.75367 10.1459 3.2694 9.88039C2.78514 9.61486 2.60782 9.00703 2.87335 8.52276C4.04829 6.37991 6.28776 4.59554 8.65155 3.71625C11.0335 2.83019 13.6152 2.76764 16.0458 3.51981C17.622 4.00755 18.9321 4.89926 20 5.97863V3.25001C20 2.69772 20.4477 2.25 21 2.25ZM9.0947 11.0611C9.48843 11.2056 9.75015 11.5805 9.75015 11.9999V19.9998C9.75015 20.552 9.30252 20.9997 8.75028 20.9998C8.19795 20.9998 7.75015 20.5521 7.75015 19.9998V14.4929C7.40387 14.7762 6.9978 15.0675 6.51465 15.3574C6.04107 15.6416 5.42681 15.488 5.14266 15.0144C4.85851 14.5409 5.01208 13.9266 5.48566 13.6424C6.68817 12.9209 7.25079 12.2411 7.76611 11.6184C7.84033 11.5288 7.91356 11.4403 7.98758 11.353C8.2589 11.0332 8.70097 10.9166 9.0947 11.0611ZM13.2417 12.6611C13.8505 11.6354 14.8639 10.9999 16.25 10.9999C17.6361 10.9999 18.6495 11.6354 19.2583 12.6611C19.822 13.6106 20 14.8222 20 16C20 17.1777 19.822 18.3893 19.2583 19.3389C18.6495 20.3645 17.6361 21 16.25 21C14.8639 21 13.8505 20.3645 13.2417 19.3389C12.678 18.3893 12.5 17.1777 12.5 16C12.5 14.8222 12.678 13.6106 13.2417 12.6611ZM14.9615 13.682C14.6658 14.1801 14.5 14.9686 14.5 16C14.5 17.0314 14.6658 17.8198 14.9615 18.318C15.212 18.74 15.5736 19 16.25 19C16.9264 19 17.288 18.74 17.5385 18.318C17.8342 17.8198 18 17.0314 18 16C18 14.9686 17.8342 14.1801 17.5385 13.682C17.288 13.2599 16.9264 12.9999 16.25 12.9999C15.5736 12.9999 15.212 13.2599 14.9615 13.682Z",
    normal: "M21.25 2.5C21.6642 2.5 22 2.83579 22 3.25V8.75C22 9.16421 21.6642 9.5 21.25 9.5H15.7499C15.3357 9.5 14.9999 9.16421 14.9999 8.75C14.9999 8.33578 15.3357 8 15.7499 8H19.6573C18.5992 6.60212 17.2297 5.4648 15.5283 4.93832C13.4619 4.29885 11.2768 4.35354 9.26156 5.10317C7.23271 5.85787 5.35214 7.38846 4.40776 9.11081C4.20861 9.47401 3.75274 9.607 3.38955 9.40785C3.02635 9.2087 2.89336 8.75283 3.09251 8.38964C4.23451 6.30687 6.42268 4.55877 8.73861 3.69728C11.0682 2.83072 13.5931 2.7693 15.9717 3.50536C17.8504 4.08673 19.3465 5.26153 20.5 6.64949V3.25C20.5 2.83579 20.8358 2.5 21.25 2.5ZM16.0018 11C14.6821 11 13.7525 11.6377 13.1987 12.629C12.6772 13.5624 12.5019 14.7762 12.5019 16C12.5019 17.2238 12.6772 18.4376 13.1987 19.371C13.7525 20.3623 14.6821 21 16.0018 21C17.3216 21 18.2512 20.3623 18.805 19.371C19.3265 18.4376 19.5018 17.2238 19.5018 16C19.5018 14.7762 19.3265 13.5624 18.805 12.629C18.2512 11.6377 17.3216 11 16.0018 11ZM14.0019 16C14.0019 14.8766 14.1703 13.9654 14.5082 13.3606C14.8137 12.8137 15.2591 12.5 16.0018 12.5C16.7446 12.5 17.19 12.8137 17.4955 13.3606C17.8334 13.9654 18.0018 14.8766 18.0018 16C18.0018 17.1234 17.8334 18.0346 17.4955 18.6394C17.19 19.1863 16.7446 19.5 16.0018 19.5C15.2591 19.5 14.8137 19.1863 14.5082 18.6394C14.1703 18.0346 14.0019 17.1234 14.0019 16ZM9.50005 11.75C9.50005 11.4138 9.27626 11.1186 8.9525 11.0278C8.62884 10.9371 8.28486 11.072 8.11003 11.359L8.10935 11.3602L8.10401 11.3687C8.09864 11.3772 8.08972 11.3913 8.07735 11.4103C8.05259 11.4483 8.0141 11.5061 7.96263 11.5793C7.85946 11.7261 7.70536 11.9334 7.50637 12.1678C7.10384 12.6421 6.5396 13.2016 5.86422 13.6069C5.50903 13.82 5.39386 14.2807 5.60697 14.6359C5.82008 14.9911 6.28077 15.1062 6.63595 14.8931C7.15988 14.5788 7.61776 14.202 8.00007 13.8328V20.25C8.00007 20.6642 8.33585 21 8.75006 21C9.16427 21 9.50005 20.6642 9.50005 20.25V11.75Z",
    title: "Seek Forward"
  },
  settings: {
    classes: [],
    hover: "M12.0132 2.25C12.7471 2.25846 13.4782 2.34326 14.1947 2.50304C14.5074 2.57279 14.7413 2.83351 14.7768 3.15196L14.947 4.67881C15.024 5.37986 15.6159 5.91084 16.3216 5.91158C16.5113 5.91188 16.6989 5.87238 16.8742 5.79483L18.2748 5.17956C18.5661 5.05159 18.9064 5.12136 19.1239 5.35362C20.1361 6.43464 20.8899 7.73115 21.3287 9.14558C21.4233 9.45058 21.3144 9.78203 21.0573 9.9715L19.8159 10.8866C19.4617 11.1468 19.2526 11.56 19.2526 11.9995C19.2526 12.4389 19.4617 12.8521 19.8166 13.1129L21.0592 14.0283C21.3163 14.2177 21.4253 14.5492 21.3307 14.8543C20.8921 16.2685 20.1387 17.5649 19.1271 18.6461C18.9098 18.8783 18.5697 18.9483 18.2785 18.8206L16.8721 18.2045C16.4698 18.0284 16.0077 18.0542 15.6275 18.274C15.2473 18.4937 14.9942 18.8812 14.9459 19.3177L14.7769 20.8444C14.742 21.1592 14.5131 21.4182 14.205 21.4915C12.7566 21.8361 11.2475 21.8361 9.79901 21.4915C9.49088 21.4182 9.26202 21.1592 9.22716 20.8444L9.05834 19.32C9.00875 18.8843 8.75532 18.498 8.3754 18.279C7.99549 18.06 7.53418 18.0343 7.13318 18.2094L5.72655 18.8256C5.4352 18.9533 5.09501 18.8833 4.87776 18.6509C3.8656 17.5685 3.11217 16.2705 2.67418 14.8548C2.57984 14.5499 2.68884 14.2186 2.94582 14.0293L4.18915 13.1133C4.54329 12.8531 4.75245 12.4399 4.75245 12.0005C4.75245 11.561 4.54329 11.1478 4.18869 10.8873L2.94614 9.97285C2.68877 9.78345 2.57967 9.45178 2.67434 9.14658C3.1131 7.73215 3.86692 6.43564 4.8791 5.35462C5.09657 5.12236 5.43691 5.05259 5.72822 5.18056L7.1286 5.79572C7.53154 5.97256 7.99478 5.94585 8.37675 5.72269C8.75707 5.50209 9.01026 5.11422 9.05914 4.67764L9.22922 3.15196C9.26474 2.83335 9.49884 2.57254 9.81178 2.50294C10.5291 2.34342 11.2609 2.25865 12.0132 2.25ZM12.0007 8.99995C10.3438 8.99995 9.00067 10.3431 9.00067 12C9.00067 13.6568 10.3438 15 12.0007 15C13.6575 15 15.0007 13.6568 15.0007 12C15.0007 10.3431 13.6575 8.99995 12.0007 8.99995Z",
    normal: "M12.0122 2.25C12.7462 2.25846 13.4773 2.34326 14.1937 2.50304C14.5064 2.57279 14.7403 2.83351 14.7758 3.15196L14.946 4.67881C15.0231 5.37986 15.615 5.91084 16.3206 5.91158C16.5103 5.91188 16.6979 5.87238 16.8732 5.79483L18.2738 5.17956C18.5651 5.05159 18.9055 5.12136 19.1229 5.35362C20.1351 6.43464 20.8889 7.73115 21.3277 9.14558C21.4223 9.45058 21.3134 9.78203 21.0564 9.9715L19.8149 10.8866C19.4607 11.1468 19.2516 11.56 19.2516 11.9995C19.2516 12.4389 19.4607 12.8521 19.8157 13.1129L21.0582 14.0283C21.3153 14.2177 21.4243 14.5492 21.3297 14.8543C20.8911 16.2685 20.1377 17.5649 19.1261 18.6461C18.9089 18.8783 18.5688 18.9483 18.2775 18.8206L16.8712 18.2045C16.4688 18.0284 16.0068 18.0542 15.6265 18.274C15.2463 18.4937 14.9933 18.8812 14.945 19.3177L14.7759 20.8444C14.741 21.1592 14.5122 21.4182 14.204 21.4915C12.7556 21.8361 11.2465 21.8361 9.79803 21.4915C9.48991 21.4182 9.26105 21.1592 9.22618 20.8444L9.05736 19.32C9.00777 18.8843 8.75434 18.498 8.37442 18.279C7.99451 18.06 7.5332 18.0343 7.1322 18.2094L5.72557 18.8256C5.43422 18.9533 5.09403 18.8833 4.87678 18.6509C3.86462 17.5685 3.11119 16.2705 2.6732 14.8548C2.57886 14.5499 2.68786 14.2186 2.94485 14.0293L4.18818 13.1133C4.54232 12.8531 4.75147 12.4399 4.75147 12.0005C4.75147 11.561 4.54232 11.1478 4.18771 10.8873L2.94516 9.97285C2.6878 9.78345 2.5787 9.45178 2.67337 9.14658C3.11212 7.73215 3.86594 6.43564 4.87813 5.35462C5.09559 5.12236 5.43594 5.05259 5.72724 5.18056L7.12762 5.79572C7.53056 5.97256 7.9938 5.94585 8.37577 5.72269C8.75609 5.50209 9.00929 5.11422 9.05817 4.67764L9.22824 3.15196C9.26376 2.83335 9.49786 2.57254 9.8108 2.50294C10.5281 2.34342 11.26 2.25865 12.0122 2.25ZM12.0124 3.7499C11.5583 3.75524 11.1056 3.79443 10.6578 3.86702L10.5489 4.84418C10.4471 5.75368 9.92003 6.56102 9.13042 7.01903C8.33597 7.48317 7.36736 7.53903 6.52458 7.16917L5.62629 6.77456C5.05436 7.46873 4.59914 8.25135 4.27852 9.09168L5.07632 9.67879C5.81513 10.2216 6.25147 11.0837 6.25147 12.0005C6.25147 12.9172 5.81513 13.7793 5.0771 14.3215L4.27805 14.9102C4.59839 15.752 5.05368 16.5361 5.626 17.2316L6.53113 16.8351C7.36923 16.4692 8.33124 16.5227 9.12353 16.9794C9.91581 17.4361 10.4443 18.2417 10.548 19.1526L10.657 20.1365C11.5466 20.2878 12.4555 20.2878 13.3451 20.1365L13.4541 19.1527C13.5549 18.2421 14.0828 17.4337 14.876 16.9753C15.6692 16.5168 16.6332 16.463 17.4728 16.8305L18.3772 17.2267C18.949 16.5323 19.4041 15.7495 19.7247 14.909L18.9267 14.3211C18.1879 13.7783 17.7516 12.9162 17.7516 11.9995C17.7516 11.0827 18.1879 10.2206 18.9258 9.67847L19.7227 9.09109C19.4021 8.25061 18.9468 7.46784 18.3748 6.77356L17.4783 7.16737C17.113 7.32901 16.7178 7.4122 16.3187 7.41158C14.849 7.41004 13.6155 6.30355 13.4551 4.84383L13.3462 3.8667C12.9007 3.7942 12.4526 3.75512 12.0124 3.7499ZM11.9997 8.24995C14.0708 8.24995 15.7497 9.92888 15.7497 12C15.7497 14.071 14.0708 15.75 11.9997 15.75C9.92863 15.75 8.2497 14.071 8.2497 12C8.2497 9.92888 9.92863 8.24995 11.9997 8.24995ZM11.9997 9.74995C10.7571 9.74995 9.7497 10.7573 9.7497 12C9.7497 13.2426 10.7571 14.25 11.9997 14.25C13.2423 14.25 14.2497 13.2426 14.2497 12C14.2497 10.7573 13.2423 9.74995 11.9997 9.74995Z",
    title: "Settings"
  },
  speed: {
    classes: [],
    hover: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM15.8791 6.66732C16.1062 6.47297 16.439 6.46653 16.6734 6.65195C16.9078 6.83738 16.9781 7.16278 16.8412 7.42842L16.7119 7.67862C16.6295 7.83801 16.5113 8.06624 16.3681 8.34179C16.0818 8.89278 15.6954 9.63339 15.2955 10.3912C14.8959 11.1485 14.4815 11.9253 14.1395 12.5479C13.9686 12.8589 13.8142 13.1344 13.6879 13.3509C13.5703 13.5524 13.4548 13.7421 13.3688 13.8508C12.7263 14.6629 11.5471 14.8004 10.735 14.1579C9.92288 13.5154 9.78538 12.3362 10.4279 11.5241C10.5139 11.4154 10.672 11.2593 10.8409 11.0986C11.0226 10.9258 11.2552 10.7121 11.5185 10.4744C12.0457 9.9983 12.7063 9.41631 13.3514 8.85315C13.9969 8.28961 14.6288 7.74321 15.0991 7.33783C15.3343 7.1351 15.5292 6.96755 15.6654 6.85065L15.8791 6.66732ZM7.93413 17.1265C7.64124 17.4194 7.16637 17.4194 6.87347 17.1265C4.04217 14.2952 4.04217 9.70478 6.87347 6.87348C8.71833 5.02862 11.3099 4.38674 13.6723 4.94459C14.0755 5.03978 14.3251 5.44375 14.2299 5.84687C14.1347 6.25 13.7308 6.49963 13.3276 6.40444C11.45 5.96106 9.39622 6.47205 7.93413 7.93414C5.68862 10.1797 5.68862 13.8203 7.93413 16.0659C8.22703 16.3588 8.22703 16.8336 7.93413 17.1265ZM17.8879 9.1415C18.2789 9.00477 18.7067 9.21089 18.8435 9.60189C19.7333 12.1463 19.1624 15.0907 17.1265 17.1265C16.8336 17.4194 16.3588 17.4194 16.0659 17.1265C15.773 16.8336 15.773 16.3588 16.0659 16.0659C17.6791 14.4526 18.1344 12.1183 17.4276 10.097C17.2908 9.70604 17.4969 9.27824 17.8879 9.1415Z",
    normal: "M7.93413 16.0659C8.22703 16.3588 8.22703 16.8336 7.93413 17.1265C7.64124 17.4194 7.16637 17.4194 6.87347 17.1265C4.04217 14.2952 4.04217 9.70478 6.87347 6.87348C8.71833 5.02862 11.3099 4.38674 13.6723 4.94459C14.0755 5.03978 14.3251 5.44375 14.2299 5.84687C14.1347 6.25 13.7308 6.49963 13.3276 6.40444C11.45 5.96106 9.39622 6.47205 7.93413 7.93414C5.68862 10.1797 5.68862 13.8203 7.93413 16.0659ZM17.8879 9.1415C18.2789 9.00477 18.7067 9.21089 18.8435 9.60189C19.7333 12.1463 19.1624 15.0907 17.1265 17.1265C16.8336 17.4194 16.3588 17.4194 16.0659 17.1265C15.773 16.8336 15.773 16.3588 16.0659 16.0659C17.6791 14.4526 18.1344 12.1183 17.4276 10.097C17.2908 9.70604 17.4969 9.27824 17.8879 9.1415ZM15.8791 6.66732C16.1062 6.47297 16.439 6.46653 16.6734 6.65195C16.9078 6.83738 16.9781 7.16278 16.8412 7.42842L16.7119 7.67862C16.6295 7.83801 16.5113 8.06624 16.3681 8.34179C16.0818 8.89278 15.6954 9.63339 15.2955 10.3912C14.8959 11.1485 14.4815 11.9253 14.1395 12.5479C13.9686 12.8589 13.8142 13.1344 13.6879 13.3509C13.5703 13.5524 13.4548 13.7421 13.3688 13.8508C12.7263 14.6629 11.5471 14.8004 10.735 14.1579C9.92288 13.5154 9.78538 12.3362 10.4279 11.5241C10.5139 11.4154 10.672 11.2593 10.8409 11.0986C11.0226 10.9258 11.2552 10.7121 11.5185 10.4744C12.0457 9.9983 12.7063 9.41631 13.3514 8.85315C13.9969 8.28961 14.6288 7.74321 15.0991 7.33783C15.3343 7.1351 15.5292 6.96755 15.6654 6.85065L15.8791 6.66732ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12Z",
    title: "Speed"
  },
  subtitles: {
    classes: [],
    hover: "M18.75 4C20.5449 4 22 5.45507 22 7.25V16.7546C22 18.5495 20.5449 20.0046 18.75 20.0046H5.25C3.45507 20.0046 2 18.5495 2 16.7546V7.25C2 5.51697 3.35645 4.10075 5.06558 4.00514L5.25 4H18.75ZM18.75 5.5H5.25L5.10647 5.5058C4.20711 5.57881 3.5 6.33183 3.5 7.25V16.7546C3.5 17.7211 4.2835 18.5046 5.25 18.5046H18.75C19.7165 18.5046 20.5 17.7211 20.5 16.7546V7.25C20.5 6.2835 19.7165 5.5 18.75 5.5ZM5.5 12C5.5 8.85442 8.21322 7.22469 10.6216 8.59854C10.9814 8.80378 11.1067 9.26183 10.9015 9.62162C10.6962 9.98141 10.2382 10.1067 9.87838 9.90146C8.48071 9.10417 7 9.99357 7 12C7 14.0046 8.48411 14.8962 9.8792 14.1027C10.2392 13.8979 10.6971 14.0238 10.9019 14.3838C11.1067 14.7439 10.9809 15.2018 10.6208 15.4066C8.21539 16.7747 5.5 15.1433 5.5 12ZM13 12C13 8.85442 15.7132 7.22469 18.1216 8.59854C18.4814 8.80378 18.6067 9.26183 18.4015 9.62162C18.1962 9.98141 17.7382 10.1067 17.3784 9.90146C15.9807 9.10417 14.5 9.99357 14.5 12C14.5 14.0046 15.9841 14.8962 17.3792 14.1027C17.7392 13.8979 18.1971 14.0238 18.4019 14.3838C18.6067 14.7439 18.4809 15.2018 18.1208 15.4066C15.7154 16.7747 13 15.1433 13 12Z",
    normal: "M18.75 4C20.5449 4 22 5.45507 22 7.25V16.7546C22 18.5495 20.5449 20.0046 18.75 20.0046H5.25C3.45507 20.0046 2 18.5495 2 16.7546V7.25C2 5.51697 3.35645 4.10075 5.06558 4.00514L5.25 4H18.75ZM10.6216 8.59854C8.21322 7.22469 5.5 8.85442 5.5 12C5.5 15.1433 8.21539 16.7747 10.6208 15.4066C10.9809 15.2018 11.1067 14.7439 10.9019 14.3838C10.6971 14.0238 10.2392 13.8979 9.8792 14.1027C8.48411 14.8962 7 14.0046 7 12C7 9.99357 8.48071 9.10417 9.87838 9.90146C10.2382 10.1067 10.6962 9.98141 10.9015 9.62162C11.1067 9.26183 10.9814 8.80378 10.6216 8.59854ZM18.1216 8.59854C15.7132 7.22469 13 8.85442 13 12C13 15.1433 15.7154 16.7747 18.1208 15.4066C18.4809 15.2018 18.6067 14.7439 18.4019 14.3838C18.1971 14.0238 17.7392 13.8979 17.3792 14.1027C15.9841 14.8962 14.5 14.0046 14.5 12C14.5 9.99357 15.9807 9.10417 17.3784 9.90146C17.7382 10.1067 18.1962 9.98141 18.4015 9.62162C18.6067 9.26183 18.4814 8.80378 18.1216 8.59854Z",
    title: "Subtitles"
  },
  subtitlesOff: {
    classes: [],
    hover: "M18.75 4C20.5449 4 22 5.45507 22 7.25V16.7546C22 18.5495 20.5449 20.0046 18.75 20.0046H5.25C3.45507 20.0046 2 18.5495 2 16.7546V7.25C2 5.51697 3.35645 4.10075 5.06558 4.00514L5.25 4H18.75ZM10.6216 8.59854C8.21322 7.22469 5.5 8.85442 5.5 12C5.5 15.1433 8.21539 16.7747 10.6208 15.4066C10.9809 15.2018 11.1067 14.7439 10.9019 14.3838C10.6971 14.0238 10.2392 13.8979 9.8792 14.1027C8.48411 14.8962 7 14.0046 7 12C7 9.99357 8.48071 9.10417 9.87838 9.90146C10.2382 10.1067 10.6962 9.98141 10.9015 9.62162C11.1067 9.26183 10.9814 8.80378 10.6216 8.59854ZM18.1216 8.59854C15.7132 7.22469 13 8.85442 13 12C13 15.1433 15.7154 16.7747 18.1208 15.4066C18.4809 15.2018 18.6067 14.7439 18.4019 14.3838C18.1971 14.0238 17.7392 13.8979 17.3792 14.1027C15.9841 14.8962 14.5 14.0046 14.5 12C14.5 9.99357 15.9807 9.10417 17.3784 9.90146C17.7382 10.1067 18.1962 9.98141 18.4015 9.62162C18.6067 9.26183 18.4814 8.80378 18.1216 8.59854Z",
    normal: "M18.75 4C20.5449 4 22 5.45507 22 7.25V16.7546C22 18.5495 20.5449 20.0046 18.75 20.0046H5.25C3.45507 20.0046 2 18.5495 2 16.7546V7.25C2 5.51697 3.35645 4.10075 5.06558 4.00514L5.25 4H18.75ZM18.75 5.5H5.25L5.10647 5.5058C4.20711 5.57881 3.5 6.33183 3.5 7.25V16.7546C3.5 17.7211 4.2835 18.5046 5.25 18.5046H18.75C19.7165 18.5046 20.5 17.7211 20.5 16.7546V7.25C20.5 6.2835 19.7165 5.5 18.75 5.5ZM5.5 12C5.5 8.85442 8.21322 7.22469 10.6216 8.59854C10.9814 8.80378 11.1067 9.26183 10.9015 9.62162C10.6962 9.98141 10.2382 10.1067 9.87838 9.90146C8.48071 9.10417 7 9.99357 7 12C7 14.0046 8.48411 14.8962 9.8792 14.1027C10.2392 13.8979 10.6971 14.0238 10.9019 14.3838C11.1067 14.7439 10.9809 15.2018 10.6208 15.4066C8.21539 16.7747 5.5 15.1433 5.5 12ZM13 12C13 8.85442 15.7132 7.22469 18.1216 8.59854C18.4814 8.80378 18.6067 9.26183 18.4015 9.62162C18.1962 9.98141 17.7382 10.1067 17.3784 9.90146C15.9807 9.10417 14.5 9.99357 14.5 12C14.5 14.0046 15.9841 14.8962 17.3792 14.1027C17.7392 13.8979 18.1971 14.0238 18.4019 14.3838C18.6067 14.7439 18.4809 15.2018 18.1208 15.4066C15.7154 16.7747 13 15.1433 13 12Z",
    title: "Subtitles"
  },
  theater: {
    classes: [],
    hover: "M5 3C3.34315 3 2 4.34315 2 6V18C2 19.6569 3.34315 21 5 21H19C20.6569 21 22 19.6569 22 18V6C22 4.34315 20.6569 3 19 3H5ZM7.59414 9.17574C7.77165 9.41005 7.77165 9.78995 7.59414 10.0243L6.55192 11.4H10.5455C10.7965 11.4 11 11.6686 11 12C11 12.3314 10.7965 12.6 10.5455 12.6H6.55192L7.59414 13.9757C7.77165 14.21 7.77165 14.5899 7.59414 14.8243C7.41663 15.0586 7.12883 15.0586 6.95131 14.8243L5.13313 12.4243C4.95562 12.1899 4.95562 11.8101 5.13313 11.5757L6.95131 9.17574C7.12883 8.94142 7.41663 8.94142 7.59414 9.17574ZM16.4059 9.17574C16.5834 8.94142 16.8712 8.94142 17.0487 9.17574L18.8669 11.5757C19.0444 11.8101 19.0444 12.1899 18.8669 12.4243L17.0487 14.8243C16.8712 15.0586 16.5834 15.0586 16.4059 14.8243C16.2283 14.5899 16.2283 14.21 16.4059 13.9757L17.4481 12.6H13.4545C13.2035 12.6 13 12.3314 13 12C13 11.6686 13.2035 11.4 13.4545 11.4H17.4481L16.4059 10.0243C16.2283 9.78995 16.2283 9.41005 16.4059 9.17574Z",
    normal: "M16.4059 10.0243C16.2283 9.78995 16.2283 9.41005 16.4059 9.17574C16.5834 8.94142 16.8712 8.94142 17.0487 9.17574L18.8669 11.5757C19.0444 11.81 19.0444 12.1899 18.8669 12.4243L17.0487 14.8243C16.8712 15.0586 16.5834 15.0586 16.4059 14.8243C16.2283 14.5899 16.2283 14.21 16.4059 13.9757L17.4481 12.6H13.4545C13.2035 12.6 13 12.3314 13 12C13 11.6686 13.2035 11.4 13.4545 11.4H17.4481L16.4059 10.0243Z M7.59414 10.0243C7.77165 9.78995 7.77165 9.41005 7.59414 9.17574C7.41663 8.94142 7.12883 8.94142 6.95132 9.17574L5.13313 11.5757C4.95562 11.81 4.95562 12.1899 5.13313 12.4243L6.95132 14.8243C7.12883 15.0586 7.41663 15.0586 7.59414 14.8243C7.77165 14.5899 7.77165 14.21 7.59414 13.9757L6.55192 12.6H10.5455C10.7965 12.6 11 12.3314 11 12C11 11.6686 10.7965 11.4 10.5455 11.4H6.55192L7.59414 10.0243Z M2 6.25C2 4.45507 3.3228 3 4.95455 3H19.0455C20.6772 3 22 4.45507 22 6.25V17.75C22 19.5449 20.6772 21 19.0455 21H4.95455C3.32279 21 2 19.5449 2 17.75V6.25ZM4.95455 4.5C4.07591 4.5 3.36364 5.2835 3.36364 6.25V17.75C3.36364 18.7165 4.07591 19.5 4.95455 19.5H19.0455C19.9241 19.5 20.6364 18.7165 20.6364 17.75V6.25C20.6364 5.2835 19.9241 4.5 19.0455 4.5H12H4.95455Z",
    title: "Theater mode"
  },
  theaterExit: {
    classes: [],
    hover: "M5 3C3.34315 3 2 4.34315 2 6V18C2 19.6569 3.34315 21 5 21H19C20.6569 21 22 19.6569 22 18V6C22 4.34315 20.6569 3 19 3H5ZM8.40586 9.17574C8.58337 8.94142 8.87117 8.94142 9.04869 9.17574L10.8669 11.5757C11.0444 11.8101 11.0444 12.1899 10.8669 12.4243L9.04869 14.8243C8.87117 15.0586 8.58337 15.0586 8.40586 14.8243C8.22835 14.5899 8.22835 14.21 8.40586 13.9757L9.44808 12.6H5.45455C5.20351 12.6 5 12.3314 5 12C5 11.6686 5.20351 11.4 5.45455 11.4H9.44808L8.40586 10.0243C8.22835 9.78995 8.22835 9.41005 8.40586 9.17574ZM15.5941 9.17574C15.7717 9.41005 15.7717 9.78995 15.5941 10.0243L14.5519 11.4H18.5455C18.7965 11.4 19 11.6686 19 12C19 12.3314 18.7965 12.6 18.5455 12.6H14.5519L15.5941 13.9757C15.7717 14.21 15.7717 14.5899 15.5941 14.8243C15.4166 15.0586 15.1288 15.0586 14.9513 14.8243L13.1331 12.4243C12.9556 12.1899 12.9556 11.8101 13.1331 11.5757L14.9513 9.17574C15.1288 8.94142 15.4166 8.94142 15.5941 9.17574Z",
    normal: "M8.40586 10.0243C8.22835 9.78995 8.22835 9.41005 8.40586 9.17574C8.58337 8.94142 8.87117 8.94142 9.04869 9.17574L10.8669 11.5757C11.0444 11.81 11.0444 12.1899 10.8669 12.4243L9.04869 14.8243C8.87117 15.0586 8.58337 15.0586 8.40586 14.8243C8.22835 14.5899 8.22835 14.21 8.40586 13.9757L9.44808 12.6H5.45455C5.20351 12.6 5 12.3314 5 12C5 11.6686 5.20351 11.4 5.45455 11.4H9.44808L8.40586 10.0243Z M15.5941 10.0243C15.7717 9.78995 15.7717 9.41005 15.5941 9.17574C15.4166 8.94142 15.1288 8.94142 14.9513 9.17574L13.1331 11.5757C12.9556 11.81 12.9556 12.1899 13.1331 12.4243L14.9513 14.8243C15.1288 15.0586 15.4166 15.0586 15.5941 14.8243C15.7717 14.5899 15.7717 14.21 15.5941 13.9757L14.5519 12.6H18.5455C18.7965 12.6 19 12.3314 19 12C19 11.6686 18.7965 11.4 18.5455 11.4H14.5519L15.5941 10.0243Z M2 6.25C2 4.45507 3.3228 3 4.95455 3H19.0455C20.6772 3 22 4.45507 22 6.25V17.75C22 19.5449 20.6772 21 19.0455 21H4.95455C3.32279 21 2 19.5449 2 17.75V6.25ZM4.95455 4.5C4.07591 4.5 3.36364 5.2835 3.36364 6.25V17.75C3.36364 18.7165 4.07591 19.5 4.95455 19.5H19.0455C19.9241 19.5 20.6364 18.7165 20.6364 17.75V6.25C20.6364 5.2835 19.9241 4.5 19.0455 4.5H12H4.95455Z",
    title: "Theater mode"
  },
  volumeHigh: {
    classes: [],
    hover: "M15 4.25049V19.7461C15 20.8247 13.7255 21.397 12.9194 20.6802L8.42793 16.6865C8.29063 16.5644 8.11329 16.497 7.92956 16.497H4.25C3.00736 16.497 2 15.4896 2 14.247V9.74907C2 8.50643 3.00736 7.49907 4.25 7.49907H7.92961C8.11333 7.49907 8.29065 7.43165 8.42794 7.30958L12.9195 3.31631C13.7255 2.59964 15 3.17187 15 4.25049ZM18.9916 5.89782C19.3244 5.65128 19.7941 5.72126 20.0407 6.05411C21.2717 7.71619 22 9.77439 22 12.0005C22 14.2266 21.2717 16.2848 20.0407 17.9469C19.7941 18.2798 19.3244 18.3497 18.9916 18.1032C18.6587 17.8567 18.5888 17.387 18.8353 17.0541C19.8815 15.6416 20.5 13.8943 20.5 12.0005C20.5 10.1067 19.8815 8.35945 18.8353 6.9469C18.5888 6.61404 18.6587 6.14435 18.9916 5.89782ZM17.143 8.36982C17.5072 8.17262 17.9624 8.30806 18.1596 8.67233C18.6958 9.66294 19 10.7973 19 12.0005C19 13.2037 18.6958 14.338 18.1596 15.3287C17.9624 15.6929 17.5072 15.8284 17.143 15.6312C16.7787 15.434 16.6432 14.9788 16.8404 14.6146C17.2609 13.8378 17.5 12.9482 17.5 12.0005C17.5 11.0528 17.2609 10.1632 16.8404 9.38642C16.6432 9.02216 16.7787 8.56701 17.143 8.36982Z",
    normal: "M15 4.25049C15 3.17187 13.7255 2.59964 12.9195 3.31631L8.42794 7.30958C8.29065 7.43165 8.11333 7.49907 7.92961 7.49907H4.25C3.00736 7.49907 2 8.50643 2 9.74907V14.247C2 15.4896 3.00736 16.497 4.25 16.497H7.92956C8.11329 16.497 8.29063 16.5644 8.42793 16.6865L12.9194 20.6802C13.7255 21.397 15 20.8247 15 19.7461V4.25049ZM9.4246 8.43059L13.5 4.80728V19.1893L9.42465 15.5655C9.01275 15.1993 8.48074 14.997 7.92956 14.997H4.25C3.83579 14.997 3.5 14.6612 3.5 14.247V9.74907C3.5 9.33486 3.83579 8.99907 4.25 8.99907H7.92961C8.48075 8.99907 9.01272 8.79679 9.4246 8.43059ZM18.9916 5.89782C19.3244 5.65128 19.7941 5.72126 20.0407 6.05411C21.2717 7.71619 22 9.77439 22 12.0005C22 14.2266 21.2717 16.2848 20.0407 17.9469C19.7941 18.2798 19.3244 18.3497 18.9916 18.1032C18.6587 17.8567 18.5888 17.387 18.8353 17.0541C19.8815 15.6416 20.5 13.8943 20.5 12.0005C20.5 10.1067 19.8815 8.35945 18.8353 6.9469C18.5888 6.61404 18.6587 6.14435 18.9916 5.89782ZM17.143 8.36982C17.5072 8.17262 17.9624 8.30806 18.1596 8.67233C18.6958 9.66294 19 10.7973 19 12.0005C19 13.2037 18.6958 14.338 18.1596 15.3287C17.9624 15.6929 17.5072 15.8284 17.143 15.6312C16.7787 15.434 16.6432 14.9788 16.8404 14.6146C17.2609 13.8378 17.5 12.9482 17.5 12.0005C17.5 11.0528 17.2609 10.1632 16.8404 9.38642C16.6432 9.02216 16.7787 8.56701 17.143 8.36982Z",
    title: "Mute"
  },
  volumeLow: {
    classes: [],
    hover: "M14.7041 3.44054C14.8952 3.66625 15 3.95238 15 4.24807V19.7497C15 20.4401 14.4404 20.9997 13.75 20.9997C13.4542 20.9997 13.168 20.8948 12.9423 20.7037L7.97513 16.4979H4.25C3.00736 16.4979 2 15.4905 2 14.2479V9.7479C2 8.50526 3.00736 7.4979 4.25 7.4979H7.97522L12.9425 3.29393C13.4694 2.84794 14.2582 2.91358 14.7041 3.44054Z",
    normal: "M14.7041 3.44054C14.8952 3.66625 15 3.95238 15 4.24807V19.7497C15 20.4401 14.4404 20.9997 13.75 20.9997C13.4542 20.9997 13.168 20.8948 12.9423 20.7037L7.97513 16.4979H4.25C3.00736 16.4979 2 15.4905 2 14.2479V9.7479C2 8.50526 3.00736 7.4979 4.25 7.4979H7.97522L12.9425 3.29393C13.4694 2.84794 14.2582 2.91358 14.7041 3.44054ZM13.5 4.78718L8.52478 8.9979H4.25C3.83579 8.9979 3.5 9.33369 3.5 9.7479V14.2479C3.5 14.6621 3.83579 14.9979 4.25 14.9979H8.52487L13.5 19.2104V4.78718Z",
    title: "Mute"
  },
  volumeMedium: {
    classes: [],
    hover: "M14.7041 3.4425C14.8952 3.66821 15 3.95433 15 4.25003V19.7517C15 20.442 14.4404 21.0017 13.75 21.0017C13.4542 21.0017 13.168 20.8968 12.9423 20.7056L7.97513 16.4999H4.25C3.00736 16.4999 2 15.4925 2 14.2499V9.74985C2 8.50721 3.00736 7.49985 4.25 7.49985H7.97522L12.9425 3.29588C13.4694 2.84989 14.2582 2.91554 14.7041 3.4425ZM17.1035 8.64021C17.4571 8.42442 17.9187 8.5361 18.1344 8.88967C18.7083 9.8298 18.9957 10.8818 18.9957 12.0304C18.9957 13.1789 18.7083 14.231 18.1344 15.1711C17.9187 15.5247 17.4571 15.6364 17.1035 15.4206C16.75 15.2048 16.6383 14.7432 16.8541 14.3897C17.2822 13.6882 17.4957 12.9069 17.4957 12.0304C17.4957 11.1539 17.2822 10.3726 16.8541 9.67112C16.6383 9.31756 16.75 8.85601 17.1035 8.64021Z",
    normal: "M14.7041 3.4425C14.8952 3.66821 15 3.95433 15 4.25003V19.7517C15 20.442 14.4404 21.0017 13.75 21.0017C13.4542 21.0017 13.168 20.8968 12.9423 20.7056L7.97513 16.4999H4.25C3.00736 16.4999 2 15.4925 2 14.2499V9.74985C2 8.50721 3.00736 7.49985 4.25 7.49985H7.97522L12.9425 3.29588C13.4694 2.84989 14.2582 2.91554 14.7041 3.4425ZM13.5 4.78913L8.52478 8.99985H4.25C3.83579 8.99985 3.5 9.33564 3.5 9.74985V14.2499C3.5 14.6641 3.83579 14.9999 4.25 14.9999H8.52487L13.5 19.2124V4.78913ZM17.1035 8.64021C17.4571 8.42442 17.9187 8.5361 18.1344 8.88967C18.7083 9.8298 18.9957 10.8818 18.9957 12.0304C18.9957 13.1789 18.7083 14.231 18.1344 15.1711C17.9187 15.5247 17.4571 15.6364 17.1035 15.4206C16.75 15.2048 16.6383 14.7432 16.8541 14.3897C17.2822 13.6882 17.4957 12.9069 17.4957 12.0304C17.4957 11.1539 17.2822 10.3726 16.8541 9.67112C16.6383 9.31756 16.75 8.85601 17.1035 8.64021Z",
    title: "Mute"
  },
  volumeMuted: {
    classes: [],
    hover: "M15 4.25049C15 3.17187 13.7255 2.59964 12.9195 3.31631L8.42794 7.30958C8.29065 7.43165 8.11333 7.49907 7.92961 7.49907H4.25C3.00736 7.49907 2 8.50643 2 9.74907V14.247C2 15.4896 3.00736 16.497 4.25 16.497H7.92956C8.11329 16.497 8.29063 16.5644 8.42793 16.6865L12.9194 20.6802C13.7255 21.397 15 20.8247 15 19.7461V4.25049ZM16.2197 9.22016C16.5126 8.92727 16.9874 8.92727 17.2803 9.22016L19 10.9398L20.7197 9.22016C21.0126 8.92727 21.4874 8.92727 21.7803 9.22016C22.0732 9.51305 22.0732 9.98793 21.7803 10.2808L20.0607 12.0005L21.7803 13.7202C22.0732 14.0131 22.0732 14.4879 21.7803 14.7808C21.4874 15.0737 21.0126 15.0737 20.7197 14.7808L19 13.0611L17.2803 14.7808C16.9874 15.0737 16.5126 15.0737 16.2197 14.7808C15.9268 14.4879 15.9268 14.0131 16.2197 13.7202L17.9393 12.0005L16.2197 10.2808C15.9268 9.98793 15.9268 9.51305 16.2197 9.22016Z",
    normal: "M12.9195 3.31631C13.7255 2.59964 15 3.17187 15 4.25049V19.7461C15 20.8247 13.7255 21.397 12.9194 20.6802L8.42793 16.6865C8.29063 16.5644 8.11329 16.497 7.92956 16.497H4.25C3.00736 16.497 2 15.4896 2 14.247V9.74907C2 8.50643 3.00736 7.49907 4.25 7.49907H7.92961C8.11333 7.49907 8.29065 7.43165 8.42794 7.30958L12.9195 3.31631ZM13.5 4.80728L9.4246 8.43059C9.01272 8.79679 8.48075 8.99907 7.92961 8.99907H4.25C3.83579 8.99907 3.5 9.33486 3.5 9.74907V14.247C3.5 14.6612 3.83579 14.997 4.25 14.997H7.92956C8.48074 14.997 9.01275 15.1993 9.42465 15.5655L13.5 19.1893V4.80728ZM16.2197 9.22017C16.5126 8.92728 16.9874 8.92728 17.2803 9.22017L19 10.9398L20.7197 9.22017C21.0126 8.92728 21.4874 8.92728 21.7803 9.22017C22.0732 9.51307 22.0732 9.98794 21.7803 10.2808L20.0607 12.0005L21.7803 13.7202C22.0732 14.0131 22.0732 14.4879 21.7803 14.7808C21.4874 15.0737 21.0126 15.0737 20.7197 14.7808L19 13.0612L17.2803 14.7808C16.9874 15.0737 16.5126 15.0737 16.2197 14.7808C15.9268 14.4879 15.9268 14.0131 16.2197 13.7202L17.9393 12.0005L16.2197 10.2808C15.9268 9.98794 15.9268 9.51307 16.2197 9.22017Z",
    title: "Unmute"
  },
  cast: {
    classes: [],
    hover: "M4.25 4C3.00736 4 2 5.00736 2 6.25V17.75C2 18.9926 3.00736 20 4.25 20H19.75C20.9926 20 22 18.9926 22 17.75V6.25C22 5.00736 20.9926 4 19.75 4H4.25ZM5.74585 8.9938C9.75201 8.9938 12.9996 12.2414 12.9996 16.2476C12.9996 16.6618 12.6639 16.9976 12.2496 16.9976C11.8354 16.9976 11.4996 16.6618 11.4996 16.2476C11.4996 13.0699 8.92359 10.4938 5.74585 10.4938C5.33164 10.4938 4.99585 10.158 4.99585 9.7438C4.99585 9.32959 5.33164 8.9938 5.74585 8.9938ZM4.99585 12.7506C4.99585 12.3364 5.33164 12.0006 5.74585 12.0006C8.09142 12.0006 9.99289 13.902 9.99289 16.2476C9.99289 16.6618 9.6571 16.9976 9.24289 16.9976C8.82867 16.9976 8.49289 16.6618 8.49289 16.2476C8.49289 14.7305 7.263 13.5006 5.74585 13.5006C5.33164 13.5006 4.99585 13.1648 4.99585 12.7506ZM6.99595 15.9955C6.99595 16.5466 6.54915 16.9934 5.998 16.9934C5.44684 16.9934 5.00005 16.5466 5.00005 15.9955C5.00005 15.4443 5.44684 14.9975 5.998 14.9975C6.54915 14.9975 6.99595 15.4443 6.99595 15.9955Z",
    normal: "M2 6.25C2 5.00736 3.00736 4 4.25 4H19.75C20.9926 4 22 5.00736 22 6.25V17.75C22 18.9926 20.9926 20 19.75 20H4.25C3.00736 20 2 18.9926 2 17.75V6.25ZM4.25 5.5C3.83579 5.5 3.5 5.83579 3.5 6.25V17.75C3.5 18.1642 3.83579 18.5 4.25 18.5H19.75C20.1642 18.5 20.5 18.1642 20.5 17.75V6.25C20.5 5.83579 20.1642 5.5 19.75 5.5H4.25ZM6.9959 15.9955C6.9959 16.5466 6.5491 16.9934 5.99795 16.9934C5.4468 16.9934 5 16.5466 5 15.9955C5 15.4443 5.4468 14.9975 5.99795 14.9975C6.5491 14.9975 6.9959 15.4443 6.9959 15.9955ZM4.9958 12.7506C4.9958 12.3363 5.33159 12.0006 5.7458 12.0006C8.09138 12.0006 9.99284 13.902 9.99284 16.2476C9.99284 16.6618 9.65705 16.9976 9.24284 16.9976C8.82863 16.9976 8.49284 16.6618 8.49284 16.2476C8.49284 14.7304 7.26295 13.5006 5.7458 13.5006C5.33159 13.5006 4.9958 13.1648 4.9958 12.7506ZM4.9958 9.74379C4.9958 9.32958 5.33159 8.99379 5.7458 8.99379C9.75197 8.99379 12.9996 12.2414 12.9996 16.2476C12.9996 16.6618 12.6638 16.9976 12.2496 16.9976C11.8354 16.9976 11.4996 16.6618 11.4996 16.2476C11.4996 13.0699 8.92354 10.4938 5.7458 10.4938C5.33159 10.4938 4.9958 10.158 4.9958 9.74379Z",
    title: "Cast"
  },
  aspectFit: {
    classes: [],
    hover: "M18.25 4C20.3211 4 22 5.67893 22 7.75V16.25C22 18.3211 20.3211 20 18.25 20H5.75C3.67893 20 2 18.3211 2 16.25V7.75C2 5.67893 3.67893 4 5.75 4H18.25ZM18.25 13C17.8703 13 17.5565 13.2822 17.5068 13.6482L17.5 13.75V15C17.5 15.2454 17.3231 15.4496 17.0899 15.4919L17 15.5H15.75C15.3358 15.5 15 15.8358 15 16.25C15 16.6297 15.2822 16.9435 15.6482 16.9932L15.75 17H17C18.0544 17 18.9182 16.1841 18.9945 15.1493L19 15V13.75C19 13.3358 18.6642 13 18.25 13ZM5.75 13C5.3703 13 5.05651 13.2822 5.00685 13.6482L5 13.75V15C5 16.0544 5.81588 16.9182 6.85074 16.9945L7 17H8.25C8.66421 17 9 16.6642 9 16.25C9 15.8703 8.71785 15.5565 8.35177 15.5068L8.25 15.5H7C6.75454 15.5 6.55039 15.3231 6.50806 15.0899L6.5 15V13.75C6.5 13.3358 6.16421 13 5.75 13ZM8.25 7H7L6.85074 7.00549C5.86762 7.07802 5.08214 7.86123 5.00604 8.84335L5 9V10.25L5.00685 10.3518C5.05651 10.7178 5.3703 11 5.75 11C6.1297 11 6.44349 10.7178 6.49315 10.3518L6.5 10.25V9L6.50806 8.91012C6.5451 8.70603 6.70603 8.5451 6.91012 8.50806L7 8.5H8.25L8.35177 8.49315C8.71785 8.44349 9 8.1297 9 7.75C9 7.3703 8.71785 7.05651 8.35177 7.00685L8.25 7ZM17 7H15.75C15.3358 7 15 7.33579 15 7.75C15 8.1297 15.2822 8.44349 15.6482 8.49315L15.75 8.5H17C17.2454 8.5 17.4496 8.67688 17.4919 8.91012L17.5 9V10.25C17.5 10.6642 17.8358 11 18.25 11C18.6297 11 18.9435 10.7178 18.9932 10.3518L19 10.25V9C19 7.94564 18.1841 7.08183 17.1493 7.00549L17 7Z",
    normal: "M18.25 4C20.3211 4 22 5.67893 22 7.75V16.25C22 18.3211 20.3211 20 18.25 20H5.75C3.67893 20 2 18.3211 2 16.25V7.75C2 5.67893 3.67893 4 5.75 4H18.25ZM18.25 5.5H5.75C4.50736 5.5 3.5 6.50736 3.5 7.75V16.25C3.5 17.4926 4.50736 18.5 5.75 18.5H18.25C19.4926 18.5 20.5 17.4926 20.5 16.25V7.75C20.5 6.50736 19.4926 5.5 18.25 5.5ZM18.25 13C18.6642 13 19 13.3358 19 13.75V15C19 16.1046 18.1046 17 17 17H15.75C15.3358 17 15 16.6642 15 16.25C15 15.8358 15.3358 15.5 15.75 15.5H17C17.2761 15.5 17.5 15.2761 17.5 15V13.75C17.5 13.3358 17.8358 13 18.25 13ZM5.75 13C6.16421 13 6.5 13.3358 6.5 13.75V15C6.5 15.2761 6.72386 15.5 7 15.5H8.25C8.66421 15.5 9 15.8358 9 16.25C9 16.6642 8.66421 17 8.25 17H7C5.89543 17 5 16.1046 5 15V13.75C5 13.3358 5.33579 13 5.75 13ZM7 7H8.25C8.66421 7 9 7.33579 9 7.75C9 8.1297 8.71785 8.44349 8.35177 8.49315L8.25 8.5H7C6.75454 8.5 6.55039 8.67688 6.50806 8.91012L6.5 9V10.25C6.5 10.6642 6.16421 11 5.75 11C5.3703 11 5.05651 10.7178 5.00685 10.3518L5 10.25V9C5 7.94564 5.81588 7.08183 6.85074 7.00549L7 7ZM17 7C18.1046 7 19 7.89543 19 9V10.25C19 10.6642 18.6642 11 18.25 11C17.8358 11 17.5 10.6642 17.5 10.25V9C17.5 8.72386 17.2761 8.5 17 8.5H15.75C15.3358 8.5 15 8.16421 15 7.75C15 7.33579 15.3358 7 15.75 7H17Z",
    title: "Aspect ratio fit"
  },
  aspectFill: {
    classes: [],
    hover: "M2 6.75C2 5.23122 3.23122 4 4.75 4H19.25C20.7688 4 22 5.23122 22 6.75V17.25C22 18.7688 20.7688 20 19.25 20H4.75C3.23122 20 2 18.7688 2 17.25V6.75ZM16.7808 7.21967C16.6402 7.07902 16.4494 7 16.2505 7L13.7493 7C13.3351 7 12.9993 7.33579 12.9993 7.75C12.9993 8.16421 13.3351 8.5 13.7493 8.5H14.4393L12.7197 10.219C12.4267 10.5118 12.4266 10.9867 12.7194 11.2796C13.0123 11.5726 13.4871 11.5727 13.7801 11.2798L15.5005 9.56014V10.25C15.5005 10.6642 15.8363 11 16.2505 11C16.6647 11 17.0005 10.6642 17.0005 10.25V7.75C17.0005 7.55109 16.9215 7.36032 16.7808 7.21967ZM7.75 16.9999H10.2512C10.6654 16.9999 11.0012 16.6641 11.0012 16.2499C11.0012 15.8357 10.6654 15.4999 10.2512 15.4999H9.56045L11.2804 13.7797C11.5732 13.4868 11.5732 13.0119 11.2803 12.719C10.9874 12.4261 10.5125 12.4262 10.2196 12.7191L8.5 14.439V13.7499C8.5 13.3357 8.16421 12.9999 7.75 12.9999C7.33579 12.9999 7 13.3357 7 13.7499L7 16.2499C7 16.4488 7.07902 16.6396 7.21967 16.7802C7.36032 16.9209 7.55109 16.9999 7.75 16.9999Z",
    normal: "M16.7808 7.21967C16.9215 7.36032 17.0005 7.55109 17.0005 7.75V10.25C17.0005 10.6642 16.6647 11 16.2505 11C15.8363 11 15.5005 10.6642 15.5005 10.25V9.56014L13.7801 11.2798C13.4871 11.5727 13.0123 11.5726 12.7194 11.2796C12.4266 10.9867 12.4267 10.5118 12.7197 10.219L14.4393 8.5H13.7493C13.3351 8.5 12.9993 8.16421 12.9993 7.75C12.9993 7.33579 13.3351 7 13.7493 7L16.2505 7C16.4494 7 16.6402 7.07902 16.7808 7.21967ZM7 16.2499C7 16.4488 7.07902 16.6396 7.21967 16.7802C7.36032 16.9209 7.55109 16.9999 7.75 16.9999H10.2512C10.6654 16.9999 11.0012 16.6641 11.0012 16.2499C11.0012 15.8357 10.6654 15.4999 10.2512 15.4999H9.56045L11.2804 13.7797C11.5732 13.4868 11.5732 13.0119 11.2803 12.719C10.9874 12.4261 10.5125 12.4262 10.2196 12.7191L8.5 14.439V13.7499C8.5 13.3357 8.16421 12.9999 7.75 12.9999C7.33579 12.9999 7 13.3357 7 13.7499L7 16.2499ZM2 6.75C2 5.23122 3.23122 4 4.75 4H19.25C20.7688 4 22 5.23122 22 6.75V17.25C22 18.7688 20.7688 20 19.25 20H4.75C3.23122 20 2 18.7688 2 17.25V6.75ZM4.75 5.5C4.05964 5.5 3.5 6.05964 3.5 6.75V17.25C3.5 17.9404 4.05964 18.5 4.75 18.5H19.25C19.9404 18.5 20.5 17.9404 20.5 17.25V6.75C20.5 6.05964 19.9404 5.5 19.25 5.5H4.75Z",
    title: "Aspect ratio fill"
  },
  aspectOriginal: {
    classes: [],
    hover: "M5.25 4C3.45507 4 2 5.45507 2 7.25V16.75C2 18.5449 3.45507 20 5.25 20H18.75C20.5449 20 22 18.5449 22 16.75V7.25C22 5.45507 20.5449 4 18.75 4H5.25ZM8.50008 8.75V15.25C8.50008 15.6642 8.16429 16 7.75008 16C7.33587 16 7.00008 15.6642 7.00008 15.25V10.1514L6.6661 10.374C6.32146 10.6038 5.85581 10.5107 5.62604 10.166C5.39628 9.82138 5.48941 9.35573 5.83405 9.12596L7.33405 8.12596C7.5642 7.97254 7.86011 7.95823 8.10397 8.08875C8.34784 8.21926 8.50008 8.4734 8.50008 8.75ZM17.5 8.75005V15.25C17.5 15.6643 17.1642 16 16.75 16C16.3358 16 16 15.6643 16 15.25V10.1514L15.666 10.3741C15.3214 10.6039 14.8557 10.5107 14.626 10.1661C14.3962 9.82143 14.4893 9.35578 14.834 9.12601L16.334 8.12601C16.5641 7.97258 16.86 7.95828 17.1039 8.08879C17.3478 8.21931 17.5 8.47345 17.5 8.75005ZM13.0001 14C13.0001 14.5523 12.5524 15 12.0001 15C11.4478 15 11.0001 14.5523 11.0001 14C11.0001 13.4477 11.4478 13 12.0001 13C12.5524 13 13.0001 13.4477 13.0001 14ZM12.0001 11C11.4478 11 11.0001 10.5523 11.0001 10C11.0001 9.44772 11.4478 9 12.0001 9C12.5524 9 13.0001 9.44772 13.0001 10C13.0001 10.5523 12.5524 11 12.0001 11Z",
    normal: "M8.50008 8.75C8.50008 8.4734 8.34784 8.21926 8.10397 8.08875C7.86011 7.95823 7.5642 7.97254 7.33405 8.12596L5.83405 9.12596C5.48941 9.35573 5.39628 9.82138 5.62604 10.166C5.85581 10.5107 6.32146 10.6038 6.6661 10.374L7.00008 10.1514V15.25C7.00008 15.6642 7.33587 16 7.75008 16C8.16429 16 8.50008 15.6642 8.50008 15.25V8.75ZM17.5 8.75005C17.5 8.47345 17.3478 8.21931 17.1039 8.08879C16.86 7.95828 16.5641 7.97258 16.334 8.12601L14.834 9.12601C14.4893 9.35578 14.3962 9.82143 14.626 10.1661C14.8557 10.5107 15.3214 10.6039 15.666 10.3741L16 10.1514V15.25C16 15.6643 16.3358 16 16.75 16C17.1642 16 17.5 15.6643 17.5 15.25V8.75005ZM13.0001 14C13.0001 14.5523 12.5524 15 12.0001 15C11.4478 15 11.0001 14.5523 11.0001 14C11.0001 13.4477 11.4478 13 12.0001 13C12.5524 13 13.0001 13.4477 13.0001 14ZM12.0001 11C12.5524 11 13.0001 10.5523 13.0001 10C13.0001 9.44772 12.5524 9 12.0001 9C11.4478 9 11.0001 9.44772 11.0001 10C11.0001 10.5523 11.4478 11 12.0001 11ZM5.25 4C3.45507 4 2 5.45507 2 7.25V16.75C2 18.5449 3.45507 20 5.25 20H18.75C20.5449 20 22 18.5449 22 16.75V7.25C22 5.45507 20.5449 4 18.75 4H5.25ZM3.5 7.25C3.5 6.2835 4.2835 5.5 5.25 5.5H18.75C19.7165 5.5 20.5 6.2835 20.5 7.25V16.75C20.5 17.7165 19.7165 18.5 18.75 18.5H5.25C4.2835 18.5 3.5 17.7165 3.5 16.75V7.25Z",
    title: "Aspect original"
  },
  share: {
    classes: [],
    hover: "M17.0002 3.00195C18.656 3.00195 19.9983 4.34424 19.9983 6.00003C19.9983 7.65582 18.656 8.9981 17.0002 8.9981C16.158 8.9981 15.3969 8.65085 14.8523 8.09171L9.39523 11.2113C9.46358 11.4626 9.50005 11.7271 9.50005 12C9.50005 12.273 9.46358 12.5374 9.39523 12.7887L14.8531 15.9076C15.3976 15.3489 16.1584 15.002 17.0002 15.002C18.656 15.002 19.9983 16.3442 19.9983 18C19.9983 19.6558 18.656 20.9981 17.0002 20.9981C15.3444 20.9981 14.0021 19.6558 14.0021 18C14.0021 17.7271 14.0386 17.4626 14.107 17.2113L8.64985 14.0917C8.10525 14.6508 7.34417 14.9981 6.50198 14.9981C4.84619 14.9981 3.50391 13.6558 3.50391 12C3.50391 10.3442 4.84619 9.00195 6.50198 9.00195C7.34379 9.00195 8.10457 9.3489 8.64912 9.907",
    normal: "M17 2.49805C18.934 2.49805 20.5018 4.06584 20.5018 5.99982C20.5018 7.93379 18.934 9.50158 17 9.50158C15.97 9.50158 15.0439 9.05692 14.4032 8.34909L9.84455 10.9535C9.94786 11.2839 10.0035 11.6354 10.0035 11.9998C10.0035 12.3643 9.94786 12.7157 9.84455 13.0461L14.4023 15.6516C15.043 14.9431 15.9695 14.498 17 14.498C18.934 14.498 20.5018 16.0658 20.5018 17.9998C20.5018 19.9338 18.934 21.5016 17 21.5016C15.066 21.5016 13.4982 19.9338 13.4982 17.9998C13.4982 17.6354 13.5539 17.2839 13.6572 16.9535L9.09951 14.3481C8.45873 15.0565 7.53223 15.5016 6.50177 15.5016C4.5678 15.5016 3 13.9338 3 11.9998C3 10.0658 4.5678 8.49805 6.50177 8.49805C7.53173 8.49805 8.45784 8.94271 9.09859 9.65054L13.6572 7.04612C13.5539 6.71571 13.4982 6.36427 13.4982 5.99982C13.4982 4.06584 15.066 2.49805 17 2.49805ZM17 15.998C15.8945 15.998 14.9982 16.8943 14.9982 17.9998C14.9982 19.1054 15.8945 20.0016 17 20.0016C18.1055 20.0016 19.0018 19.1054 19.0018 17.9998C19.0018 16.8943 18.1055 15.998 17 15.998ZM6.50177 9.99805C5.39622 9.99805 4.5 10.8943 4.5 11.9998C4.5 13.1054 5.39622 14.0016 6.50177 14.0016C7.60732 14.0016 8.50354 13.1054 8.50354 11.9998C8.50354 10.8943 7.60732 9.99805 6.50177 9.99805ZM17 3.99805C15.8945 3.99805 14.9982 4.89427 14.9982 5.99982C14.9982 7.10536 15.8945 8.00158 17 8.00158C18.1055 8.00158 19.0018 7.10536 19.0018 5.99982C19.0018 4.89427 18.1055 3.99805 17 3.99805Z",
    title: "Share"
  },
  menu: {
    classes: [],
    hover: "M12 8C10.8954 8 10 7.10457 10 6C10 4.89543 10.8954 4 12 4C13.1046 4 14 4.89543 14 6C14 7.10457 13.1046 8 12 8ZM12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14ZM10 18C10 19.1046 10.8954 20 12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18Z",
    normal: "M12 7.75C11.0335 7.75 10.25 6.9665 10.25 6C10.25 5.0335 11.0335 4.25 12 4.25C12.9665 4.25 13.75 5.0335 13.75 6C13.75 6.9665 12.9665 7.75 12 7.75ZM12 13.75C11.0335 13.75 10.25 12.9665 10.25 12C10.25 11.0335 11.0335 10.25 12 10.25C12.9665 10.25 13.75 11.0335 13.75 12C13.75 12.9665 12.9665 13.75 12 13.75ZM10.25 18C10.25 18.9665 11.0335 19.75 12 19.75C12.9665 19.75 13.75 18.9665 13.75 18C13.75 17.0335 12.9665 16.25 12 16.25C11.0335 16.25 10.25 17.0335 10.25 18Z",
    title: "Menu"
  },
  styled: {
    classes: [],
    hover: "M3.839 5.858c2.94-3.916 9.03-5.055 13.364-2.36 4.28 2.66 5.854 7.777 4.1 12.577-1.655 4.533-6.016 6.328-9.159 4.048-1.177-.854-1.634-1.925-1.854-3.664l-.106-.987-.045-.398c-.123-.934-.311-1.352-.705-1.572-.535-.298-.892-.305-1.595-.033l-.351.146-.179.078c-1.014.44-1.688.595-2.541.416l-.2-.047-.164-.047c-2.789-.864-3.202-4.647-.565-8.157Zm12.928 4.722a1.25 1.25 0 1 0 2.415-.647 1.25 1.25 0 0 0-2.415.647Zm.495 3.488a1.25 1.25 0 1 0 2.414-.647 1.25 1.25 0 0 0-2.414.647Zm-2.474-6.491a1.25 1.25 0 1 0 2.415-.647 1.25 1.25 0 0 0-2.415.647Zm-.028 8.998a1.25 1.25 0 1 0 2.415-.647 1.25 1.25 0 0 0-2.415.647Zm-3.497-9.97a1.25 1.25 0 1 0 2.415-.646 1.25 1.25 0 0 0-2.415.646Z",
    normal: "M3.839 5.858c2.94-3.916 9.03-5.055 13.364-2.36 4.28 2.66 5.854 7.777 4.1 12.577-1.655 4.533-6.016 6.328-9.159 4.048-1.177-.854-1.634-1.925-1.854-3.664l-.106-.987-.045-.398c-.123-.934-.311-1.352-.705-1.572-.535-.298-.892-.305-1.595-.033l-.351.146-.179.078c-1.014.44-1.688.595-2.541.416l-.2-.047-.164-.047c-2.789-.864-3.202-4.647-.565-8.157Zm.984 6.716.123.037.134.03c.439.087.814.015 1.437-.242l.602-.257c1.202-.493 1.985-.54 3.046.05.917.512 1.275 1.298 1.457 2.66l.053.459.055.532.047.422c.172 1.361.485 2.09 1.248 2.644 2.275 1.65 5.534.309 6.87-3.349 1.516-4.152.174-8.514-3.484-10.789-3.675-2.284-8.899-1.306-11.373 1.987-2.075 2.763-1.82 5.28-.215 5.816Zm11.225-1.994a1.25 1.25 0 1 1 2.414-.647 1.25 1.25 0 0 1-2.414.647Zm.494 3.488a1.25 1.25 0 1 1 2.415-.647 1.25 1.25 0 0 1-2.415.647ZM14.07 7.577a1.25 1.25 0 1 1 2.415-.647 1.25 1.25 0 0 1-2.415.647Zm-.028 8.998a1.25 1.25 0 1 1 2.414-.647 1.25 1.25 0 0 1-2.414.647Zm-3.497-9.97a1.25 1.25 0 1 1 2.415-.646 1.25 1.25 0 0 1-2.415.646Z",
    title: ""
  },
  restart: {
    classes: [],
    hover: "M3.2521 7.62551L3.25229 3.876C3.25229 3.53086 3.53208 3.25107 3.87721 3.25107C4.22235 3.25107 4.50214 3.53086 4.50214 3.876V5.38471C5.55439 4.19113 6.89396 3.24304 8.43223 2.65708C9.32061 2.31749 10.2699 2.10094 11.2592 2.02835C12.3471 1.9465 13.412 2.04372 14.4228 2.29646C18.7749 3.37903 22 7.3129 22 12C22 12.0363 21.9998 12.0726 21.9994 12.1088C21.9952 12.5511 21.9616 12.9882 21.9003 13.4178C21.563 15.7935 20.3908 17.9004 18.6903 19.432C18.0532 20.0065 17.3395 20.5019 16.5626 20.9001C15.3708 21.5122 14.0401 21.8918 12.6302 21.9794C11.3488 22.0616 10.1009 21.8958 8.93735 21.5207C7.94586 21.2018 7.02189 20.7324 6.19238 20.1393C4.05276 18.6121 2.5163 16.2495 2.10667 13.449C2.10219 13.4184 2.09785 13.3877 2.09364 13.357C2.00096 12.6805 1.97828 12.0099 2.02026 11.3527C2.04226 11.0083 2.33931 10.7469 2.68375 10.7689C3.02818 10.7909 3.28956 11.0879 3.26756 11.4324C3.25671 11.6024 3.25079 11.7735 3.24995 11.9456C3.2515 11.9635 3.25229 11.9817 3.25229 12C3.25229 15.8748 5.77124 19.1613 9.26094 20.3112C10.1229 20.5953 11.0441 20.749 12.0012 20.749C12.1841 20.749 12.3657 20.7434 12.5459 20.7323C12.7587 20.7188 12.9726 20.6974 13.1873 20.668C14.2335 20.5247 15.2111 20.2019 16.0932 19.735C19.2471 18.0656 21.1803 14.5536 20.6679 10.8126C20.1667 7.15366 17.4709 4.33476 14.0905 3.5021C13.421 3.33806 12.7213 3.25107 12.0012 3.25107C11.7822 3.25107 11.565 3.25912 11.3501 3.27493C11.1715 3.2884 10.9923 3.30737 10.8125 3.332C10.1616 3.42117 9.53726 3.57974 8.946 3.79924C7.26623 4.42525 5.83039 5.55273 4.82041 7.00058H7.00183C7.34697 7.00058 7.62675 7.28041 7.62675 7.62554C7.62675 7.97068 7.34697 8.25047 7.00183 8.25047H3.87721C3.83269 8.25047 3.78925 8.24581 3.74736 8.23696C3.46445 8.17727 3.2521 7.92619 3.2521 7.62551ZM8.8766 9.4591C8.8766 8.29594 10.1022 7.54067 11.1412 8.06353L16.1904 10.6044C17.3371 11.1815 17.3371 12.8185 16.1904 13.3956L11.1412 15.9365C10.1022 16.4593 8.8766 15.7041 8.8766 14.5409V9.4591Z",
    normal: "M3.2521 7.62551L3.25229 3.876C3.25229 3.53086 3.53208 3.25107 3.87721 3.25107C4.22235 3.25107 4.50214 3.53086 4.50214 3.876V5.38471C5.55439 4.19113 6.89396 3.24304 8.43223 2.65708C9.32061 2.31749 10.2699 2.10094 11.2592 2.02835C12.3471 1.9465 13.412 2.04372 14.4228 2.29646C18.7749 3.37903 22 7.3129 22 12C22 12.0363 21.9998 12.0726 21.9994 12.1088C21.9952 12.5511 21.9616 12.9882 21.9003 13.4178C21.563 15.7935 20.3908 17.9004 18.6903 19.432C18.0532 20.0065 17.3395 20.5019 16.5626 20.9001C15.3708 21.5122 14.0401 21.8918 12.6302 21.9794C11.3488 22.0616 10.1009 21.8958 8.93735 21.5207C7.94586 21.2018 7.02189 20.7324 6.19238 20.1393C4.05276 18.6121 2.5163 16.2495 2.10667 13.449C2.10219 13.4184 2.09785 13.3877 2.09364 13.357C2.00096 12.6805 1.97828 12.0099 2.02026 11.3527C2.04226 11.0083 2.33931 10.7469 2.68375 10.7689C3.02818 10.7909 3.28956 11.0879 3.26756 11.4324C3.25671 11.6024 3.25079 11.7735 3.24995 11.9456C3.2515 11.9635 3.25229 11.9817 3.25229 12C3.25229 15.8748 5.77124 19.1613 9.26094 20.3112C10.1229 20.5953 11.0441 20.749 12.0012 20.749C12.1841 20.749 12.3657 20.7434 12.5459 20.7323C12.7587 20.7188 12.9726 20.6974 13.1873 20.668C14.2335 20.5247 15.2111 20.2019 16.0932 19.735C19.2471 18.0656 21.1803 14.5536 20.6679 10.8126C20.1667 7.15366 17.4709 4.33476 14.0905 3.5021C13.421 3.33806 12.7213 3.25107 12.0012 3.25107C11.7822 3.25107 11.565 3.25912 11.3501 3.27493C11.1715 3.2884 10.9923 3.30737 10.8125 3.332C10.1616 3.42117 9.53726 3.57974 8.946 3.79924C7.26623 4.42525 5.83039 5.55273 4.82041 7.00058H7.00183C7.34697 7.00058 7.62675 7.28041 7.62675 7.62554C7.62675 7.97068 7.34697 8.25047 7.00183 8.25047H3.87721C3.83269 8.25047 3.78925 8.24581 3.74736 8.23696C3.46445 8.17727 3.2521 7.92619 3.2521 7.62551ZM8.8766 9.4591C8.8766 8.29594 10.1022 7.54067 11.1412 8.06353L16.1904 10.6044C17.3371 11.1815 17.3371 12.8185 16.1904 13.3956L11.1412 15.9365C10.1022 16.4593 8.8766 15.7041 8.8766 14.5409V9.4591ZM10.5794 9.17998C10.3716 9.07541 10.1264 9.22646 10.1264 9.4591V14.5409C10.1264 14.7735 10.3716 14.9246 10.5794 14.82L15.6286 12.2791C15.8579 12.1637 15.8579 11.8363 15.6286 11.7209L10.5794 9.17998Z",
    title: "Restart"
  },
  template: {
    classes: [],
    hover: "",
    normal: "",
    title: "Template"
  }
}, Nc = () => {
  const a = {};
  for (const e of Object.keys(Zi))
    a[e] = Zi[e];
  return a;
}, Bc = [
  "bottom-bar",
  "nm-z-10",
  "nm-flex",
  "nm-flex-col",
  "nm-items-center",
  "nm-w-full",
  "nm-gap-2",
  "nm-text-center",
  "nm-px-6",
  "nm-py-4",
  "nm-mt-auto",
  "nm-translate-y-full",
  "group-[&.nomercyplayer.active]:nm-translate-y-0",
  "group-[&.nomercyplayer.paused]:!nm-translate-y-0",
  "group-[&.nomercyplayer:has(.open)]:!nm-translate-y-0",
  "nm-transition-all",
  "nm-duration-300"
], Uc = [
  "nm-absolute",
  "nm-pointer-events-none",
  "nm-bottom-0",
  "nm-bg-gradient-to-t",
  "nm-via-black/20",
  "nm-from-black/90",
  "nm-pt-[20%]",
  "nm-w-available"
], $c = [
  "bottom-row",
  "nm-flex",
  "nm-h-10",
  "nm-mb-2",
  "nm-p-1",
  "nm-px-4",
  "nm-items-center",
  "nm-relative",
  "nm-w-available"
], Vc = [
  "button-base",
  "nm-flex",
  "nm-h-10",
  "nm-items-center",
  "nm-justify-center",
  "nm-w-10"
], Hc = [
  "nm-cursor-pointer",
  "nm-fill-white",
  "tv:nm-fill-white/30",
  "focus-visible:nm-fill-white",
  "nm-flex",
  // 'focus-visibile:nm-bg-white/20',
  // 'focus-visibile:nm-outline-none',
  // 'focus-visible:nm-bg-white/20',
  "-nm-outline-offset-2",
  "focus-visible:nm-outline",
  "focus-visible:nm-outline-2",
  "focus-visible:nm-outline-white/20",
  "nm-group/button",
  "nm-h-10",
  "nm-items-center",
  "nm-justify-center",
  "nm-p-2",
  "nm-relative",
  "nm-rounded-full",
  "nm-w-10",
  "nm-min-w-[40px]"
], Gc = [
  "center",
  "nm-absolute",
  "nm-grid",
  "nm-grid-cols-3",
  "nm-grid-rows-6",
  "nm-h-full",
  "nm-w-full",
  "nm-z-0"
], Kc = [
  "chapter-bar",
  "nm-bg-transparent",
  "nm-flex",
  "nm-h-2",
  "nm-relative",
  "nm-rounded-full",
  "nm-overflow-clip",
  "nm-w-available"
], Wc = [
  "chapter-marker",
  "nm-min-w-[2px]",
  "nm-absolute",
  "nm-h-available",
  "last:nm-translate-x-[1.5px]",
  "[&:last-child(2):.5px]",
  "nm-rounded-sm",
  "nm-overflow-hidden"
], zc = [
  "chapter-marker-bg",
  "nm-bg-white/20",
  "nm-absolute",
  "nm-h-available",
  "nm-left-0",
  "nm-w-available",
  "nm-z-0",
  "nm-rounded-sm"
], Yc = [
  "chapter-marker-buffer",
  "nm-absolute",
  "nm-bg-gray-300/30",
  "nm-h-available",
  "nm-left-0",
  "nm-origin-left",
  "nm-scale-x-0",
  "nm-w-available",
  "nm-z-10",
  "nm-rounded-sm"
], Zc = [
  "chapter-marker-hover",
  "nm-absolute",
  "nm-bg-gray-200",
  "nm-h-available",
  "nm-left-0",
  "nm-origin-left",
  "nm-scale-x-0",
  "nm-w-available",
  "nm-z-10",
  "nm-rounded-sm"
], qc = [
  "chapter-marker-progress",
  "nm-absolute",
  "nm-bg-white",
  "nm-h-available",
  "nm-left-0",
  "nm-origin-left",
  "nm-scale-x-0",
  "nm-w-available",
  "nm-z-20",
  "nm-rounded-sm"
], jc = ["chapter-text"], Xc = [
  "divider",
  "nm-flex",
  "nm-flex-1"
], Qc = ["nm-text-white"], Jc = [
  "language-button-span",
  "nm-MuiSvgIcon-root",
  "nm-cursor-pointer",
  "nm-h-6",
  "nm-object-contain",
  "nm-rounded-sm",
  "nm-w-6"
], eh = [
  "main-menu",
  "nm-duration-300",
  "nm-flex",
  "nm-flex-col",
  "nm-gap-1",
  "nm-p-2",
  "nm-overflow-clip",
  "nm-w-1/2"
], th = [
  "menu-button",
  "nm-cursor-pointer",
  "nm-flex",
  "nm-h-8",
  "hover:nm-bg-neutral-600/50",
  "nm-items-center",
  "nm-min-h-[28px]",
  "nm-px-2",
  "nm-rounded-lg",
  "nm-text-white",
  "nm-fill-white",
  "nm-w-available"
], sh = [
  "menu-button-text",
  "nm-cursor-pointer",
  "nm-font-semibold",
  "nm-pl-2",
  "nm-flex",
  "nm-gap-2",
  "nm-"
], ih = [
  "menu-content",
  "nm-duration-300",
  "nm-flex",
  "nm-flex-row",
  "nm-overflow-clip",
  "nm-w-[200%]"
], nh = [
  "menu-frame",
  "nm-absolute",
  "nm-bg-neutral-900/95",
  "nm-bottom-10",
  "nm-duration-300",
  "nm-max-w-[1200px]",
  "nm-flex",
  "nm-flex-col",
  "nm-hidden",
  "nm-overflow-clip",
  "nm-right-[2%]",
  "nm-rounded-lg",
  "nm-w-64",
  "nm-z-50"
], rh = [
  "menu-header-button",
  "nm-cursor-pointer",
  "nm-flex",
  "nm-h-8",
  "hover:nm-bg-neutral-600/50",
  "nm-items-center",
  "nm-menu-button",
  "nm-min-h-[2rem]",
  "nm-px-2",
  "nm-rounded-sm",
  "nm-text-white",
  "nm-w-available"
], ah = [
  "menu-header-button-text",
  "nm-font-semibold",
  "nm-pl-2"
], oh = [
  "menu-header",
  // 'nm-bg-white/10',
  "nm-p-2",
  "nm-flex",
  "nm-h-8",
  "nm-items-center",
  "nm-min-h-[2.5rem]",
  "nm-pb-1",
  "nm-text-white",
  "nm-w-available"
], lh = [
  "overlay",
  "nm-grid",
  "nm-absolute",
  "nm-fill-white",
  "nm-font-Poppins",
  "nm-font-[Poppins,sans-serif]",
  "nm-group",
  "nm-h-available",
  "nm-inset-0",
  "nm-overflow-clip",
  "nm-text-white",
  "nm-text-sm",
  "nm-w-available",
  "nm-z-20"
], ch = [
  "scroll-container",
  "nm-flex",
  "nm-flex-col",
  "nm-gap-1",
  "nm-language-scroll-container",
  "nm-overflow-x-hidden",
  "nm-overflow-y-auto",
  "nm-p-2",
  "nm-w-available"
], hh = [
  "slider-bar",
  "nm-group/slider",
  "nm-flex",
  "nm-rounded-full",
  "nm-bg-white/20",
  "nm-h-2",
  "nm-mx-4",
  "nm-relative",
  "nm-w-available"
], uh = [
  "slider-buffer",
  "nm-absolute",
  "nm-flex",
  "nm-h-full",
  "nm-pointer-events-none",
  "nm-rounded-full",
  "nm-bg-white/20",
  "nm-z-0",
  "nm-overflow-hidden",
  "nm-overflow-clip"
], dh = [
  "slider-hover",
  "nm-absolute",
  "nm-opacity-1",
  "nm-flex",
  "nm-h-full",
  "nm-pointer-events-none",
  "nm-rounded-full",
  "nm-bg-white/30",
  "nm-z-0",
  "nm-overflow-hidden",
  "nm-overflow-clip"
], fh = [
  "slider-progress",
  "nm-absolute",
  "nm-flex",
  "nm-h-full",
  "nm-pointer-events-none",
  "nm-rounded-full",
  "nm-bg-white",
  "nm-z-10",
  "nm-overflow-hidden",
  "nm-overflow-clip"
], mh = [
  "slider-nipple",
  "nm--translate-x-1/2",
  "nm--translate-y-[25%]",
  "nm-absolute",
  "nm-hidden",
  "group-hover/slider:nm-flex",
  "nm-bg-white",
  "nm-h-4",
  "nm-left-0",
  "nm-rounded-full",
  "nm-top-0",
  "nm-w-4",
  "nm-z-20"
], ph = ["slider-pop-image"], gh = [
  "slider-pop",
  "nm--translate-x-1/2",
  "nm-absolute",
  "nm-bg-neutral-900/95",
  "nm-bottom-4",
  "nm-flex",
  "nm-flex-col",
  "nm-font-semibold",
  "nm-gap-1",
  "hover:nm-scale-110",
  "nm-overflow-clip",
  "nm-pb-1",
  "nm-pointer-events-none",
  "nm-rounded-md",
  "nm-text-center",
  "nm-z-20"
], yh = [
  "slider-pop-text",
  "nm-font-mono"
], vh = ["slider-thumb"], Ch = [
  "speed-button-text",
  "nm-cursor-pointer",
  "nm-font-semibold",
  "nm-pl-2"
], Th = [
  "sub-menu-content",
  "nm-flex",
  "nm-flex-col",
  "nm-gap-1",
  "nm-hidden",
  "nm-max-h-available",
  "nm-w-available"
], Eh = [
  "sub-menu",
  "nm-duration-300",
  "nm-flex",
  "nm-flex-col",
  "nm-gap-1",
  "nm-w-1/2"
], xh = [
  "svg-size",
  "nm-h-5",
  "nm-w-5",
  "nm-pointer-events-none",
  "group-hover/button:nm-scale-110",
  "nm-duration-700"
], Sh = [
  "time",
  "nm-flex",
  "nm-font-mono",
  "nm-items-center",
  "nm-pointer-events-none",
  "nm-select-none",
  "nm-text-sm"
], bh = [
  "top-bar",
  "nm-z-10",
  "nm-flex",
  "nm-items-start",
  "nm-justify-between",
  "nm-w-full",
  "nm-gap-2",
  "nm-px-6",
  "nm-py-4",
  "nm-mb-auto",
  "-nm-translate-y-full",
  "group-[&.nomercyplayer.active]:nm-translate-y-0",
  "group-[&.nomercyplayer.paused]:!nm-translate-y-0",
  "group-[&.nomercyplayer:has(.open)]:!nm-translate-y-0",
  "nm-transition-all",
  "nm-duration-300"
], Lh = [
  "top-row",
  "nm-flex",
  "nm-gap-1",
  "nm-h-2",
  "nm-items-center",
  "nm-pl-2",
  "nm-pr-2",
  "nm-relative",
  "nm-w-available"
], Ah = [
  "touch-playback-button",
  "nm-pointer-events-none"
], wh = [
  "touch-playback",
  "nm-flex",
  "-nm-ml-2",
  "nm-items-center",
  "nm-justify-center"
], Ih = [
  "volume-container",
  "nm-group/volume",
  "nm-flex",
  "nm-overflow-clip"
], Rh = [
  "volume-slider",
  "nm-w-0",
  "nm-rounded-full",
  "nm-opacity-0",
  "nm-duration-300",
  "group-hover/volume:nm-w-20",
  "group-hover/volume:nm-opacity-100",
  "nm-appearance-none",
  "nm-volume-slider",
  "nm-bg-white/70",
  "nm-bg-gradient-to-r",
  "nm-from-white",
  "nm-to-white",
  "nm-self-center",
  "nm-h-1",
  "nm-bg-no-repeat",
  "nm-rounded-full",
  "nm-shadow-sm",
  "nm-transition-all",
  "range-track:nm-appearance-none",
  "range-track:nm-border-none",
  "range-track:nm-bg-transparent",
  "range-track:nm-shadow-none",
  "range-thumb:nm-h-3",
  "range-thumb:nm-w-3",
  "range-thumb:nm-appearance-none",
  "range-thumb:nm-rounded-full",
  "range-thumb:nm-bg-white",
  "range-thumb:nm-shadow-sm",
  "range-thumb:nm-border-none"
], kh = [
  "player-message",
  "nm-hidden",
  "nm-absolute",
  "nm-rounded-md",
  "nm-bg-neutral-900/95",
  "nm-left-1/2",
  "nm-px-4",
  "nm-py-2",
  "nm-pointer-events-none",
  "nm-text-center",
  "nm-top-12",
  "nm--translate-x-1/2",
  "nm-z-50"
], Dh = [
  "playlist-menu",
  "nm-p-2"
], Mh = [
  "playlist-menu-button",
  "nm-relative",
  "nm-flex",
  "nm-w-available",
  "nm-p-2",
  "nm-gap-2",
  "nm-rounded-lg",
  "nm-snap-center",
  "nm-outline-transparent",
  "nm-outline",
  "nm-outline-1",
  "nm-outline-solid",
  "focus-visible:nm-outline-2",
  "focus-visible:nm-outline-white",
  "nm-transition-all",
  "nm-duration-300",
  "hover:nm-bg-neutral-600/50"
], Ph = [
  "playlist-card-left",
  "nm-relative",
  "nm-rounded-md",
  "nm-w-[30%]",
  "nm-overflow-clip",
  "nm-self-center",
  "nm-pointer-events-none"
], Fh = [
  "episode-card-shadow",
  "nm-bg-[linear-gradient(0deg,rgba(0,0,0,0.87)_0%,rgba(0,0,0,0.7)_25%,rgba(0,0,0,0)_50%,rgba(0,0,0,0)_100%)]",
  "nm-shadow-[inset_0px_1px_0px_rgba(255,255,255,0.24),inset_0px_-1px_0px_rgba(0,0,0,0.24),inset_0px_-2px_0px_rgba(0,0,0,0.24)]",
  "nm-bottom-0",
  "nm-left-0",
  "nm-absolute",
  "!nm-h-available",
  "nm-w-available"
], _h = [
  "playlist-card-image",
  "nm-w-available",
  "nm-h-auto",
  "nm-aspect-video",
  "nm-object-cover",
  ""
], Oh = [
  "progress-container",
  "nm-absolute",
  "nm-bottom-0",
  "nm-w-available",
  "nm-flex",
  "nm-flex-col",
  "nm-px-3"
], Nh = [
  "progress-box",
  "nm-flex",
  "nm-justify-between",
  "nm-h-available",
  "nm-sm:mx-2",
  "nm-mb-1",
  "nm-px-1"
], Bh = [
  "progress-item",
  "nm-text-[0.7rem]",
  ""
], Uh = [
  "progress-duration",
  "nm-text-[0.7rem]"
], $h = [
  "slider-container",
  "nm-hidden",
  "nm-rounded-md",
  "nm-overflow-clip",
  "nm-bg-gray-500/80",
  "nm-h-1",
  "nm-mb-2",
  "nm-mx-1",
  "nm-sm:mx-2"
], Vh = [
  "progress-bar",
  "nm-bg-white"
], Hh = [
  "playlist-card-right",
  "nm-w-3/4",
  "nm-flex",
  "nm-flex-col",
  "nm-text-left",
  "nm-gap-1",
  "nm-pointer-events-none"
], Gh = [
  "playlist-card-title",
  "nm-font-bold",
  "nm-line-clamp-1",
  ""
], Kh = [
  "playlist-card-overview",
  "nm-text-[0.7rem]",
  "nm-leading-[1rem]",
  "nm-line-clamp-4",
  "nm-overflow-hidden",
  ""
], Wh = [
  "tooltip",
  "nm-hidden",
  "nm-absolute",
  "nm-left-0",
  "nm-bottom-0",
  "nm-z-50",
  "nm-px-3",
  "nm-py-2",
  "nm-text-xs",
  "nm-text-white",
  "nm-rounded-lg",
  "nm-font-medium",
  "nm-bg-neutral-900/95",
  "nm-pointer-events-none"
], zh = [
  "pause-screen",
  "nm-absolute",
  "nm-bg-black/80",
  "nm-inset-0",
  "nm-flex",
  "nm-p-6",
  "nm-text-white",
  "nm-w-available",
  "nm-h-available",
  "nm-z-0",
  "nm-hidden"
], Yh = [
  "episode-screen",
  "nm-absolute",
  "nm-bg-black/80",
  "nm-inset-0",
  "nm-flex",
  "nm-gap-4",
  "nm-p-6",
  "nm-text-white",
  "nm-w-available",
  "nm-h-available",
  "nm-z-0",
  "nm-hidden"
], Zh = [
  "language-screen",
  "nm-absolute",
  "nm-bg-black/80",
  "nm-inset-0",
  "nm-flex",
  "nm-p-6",
  "nm-text-white",
  "nm-w-available",
  "nm-h-available",
  "nm-z-0",
  "nm-hidden"
], qh = [
  "language-button",
  "nm-w-available",
  "nm-mr-auto",
  "nm-h-8",
  "nm-px-1",
  "nm-py-2",
  "nm-flex",
  "nm-items-center",
  "nm-rounded",
  "nm-snap-center",
  "nm-outline-transparent",
  "nm-outline",
  "nm-whitespace-nowrap",
  "nm-outline-1",
  "nm-outline-solid",
  "focus-visible:nm-outline-2",
  "focus-visible:nm-outline-white",
  "active:nm-outline-white"
], jh = [
  "nm-w-7/12",
  "nm-mr-auto",
  "nm-h-8",
  "nm-px-1",
  "nm-py-2",
  "nm-flex",
  "nm-items-center",
  "nm-rounded",
  "nm-snap-center",
  "nm-outline-transparent",
  "nm-outline",
  "nm-outline-1",
  "nm-outline-solid",
  "focus-visible:nm-outline-2",
  "focus-visible:nm-outline-white",
  "active:nm-outline-white"
], Xh = [
  "nm-text-white",
  "nm-text-sm",
  "nm-font-bold",
  "nm-mx-2",
  "nm-flex",
  "nm-justify-between"
], Qh = [
  "nm-w-available",
  "nm-mr-auto",
  "nm-h-8",
  "nm-px-1",
  "nm-py-2",
  "nm-flex",
  "nm-flex-nowrap",
  "nm-items-center",
  "nm-snap-center",
  "nm-rounded",
  "nm-outline-transparent",
  "nm-outline",
  "nm-outline-1",
  "nm-outline-solid",
  "focus-visible:nm-outline-2",
  "focus-visible:nm-outline-white",
  "active:nm-outline-white"
], Jh = [
  "nm-w-available",
  "nm-text-white",
  "nm-text-sm",
  "nm-font-bold",
  "nm-mx-2",
  "nm-flex",
  "nm-justify-between",
  "nm-flex-nowrap"
], eu = [
  "playlist-card-left",
  "nm-relative",
  "nm-rounded-md",
  "nm-w-[50%]",
  "nm-overflow-clip",
  "nm-self-center"
], tu = [
  "playlist-card-right",
  "nm-w-3/4",
  "nm-flex",
  "nm-flex-col",
  "nm-text-left",
  "nm-gap-1",
  "nm-px-1",
  "nm-outline-transparent",
  "nm-outline",
  "nm-outline-1",
  "nm-outline-solid",
  "focus-visible:nm-outline-2",
  "focus-visible:nm-outline-white",
  "active:nm-outline-white"
], su = [
  "playlist-card-title",
  "nm-font-bold",
  "nm-text-lg",
  "nm-line-clamp-1",
  ""
], iu = [
  "playlist-card-overview",
  "nm-font-bold",
  "nm-text-[0.7rem]",
  "nm-leading-4",
  "nm-line-clamp-4",
  "nm-overflow-hidden"
], nu = [
  "nm-flex",
  "nm-flex-col",
  "nm-justify-between",
  "nm-items-center",
  "nm-w-2/3",
  "nm-h-available"
], ru = [
  "nm-flex",
  "nm-flex-col",
  "nm-justify-center",
  "nm-items-center",
  "nm-w-available",
  "nm-gap-2",
  "nm-h-auto"
], au = [
  "nm-flex",
  "nm-flex-col",
  "nm-justify-center",
  "nm-items-center",
  "nm-w-available",
  "nm-h-[85px]",
  "nm-min-h-[85px]"
], ou = [
  "nm-w-auto",
  "nm-px-2",
  "nm-py-2",
  "nm-mr-auto",
  "nm-object-fit",
  "nm-h-auto",
  "nm-max-w-[23rem]",
  "nm-max-h-available",
  ""
], lu = [
  "nm-w-auto",
  "nm-h-available",
  "nm-items-center",
  "nm-py-0",
  "nm-max-w-[38vw]",
  "nm-mr-auto",
  "nm-leading-[1.2]",
  "nm-font-bold",
  "nm-object-fit"
], cu = [
  "nm-flex",
  "nm-flex-col",
  "nm-w-available",
  "nm-h-[40px]"
], hu = [
  "nm-flex",
  "nm-text-white",
  "nm-text-sm",
  "nm-font-bold",
  "nm-mx-2"
], uu = [
  "nm-flex",
  "nm-gap-2",
  "nm-items-center",
  "nm-w-available",
  "nm-text-white"
], du = [
  "nm-w-8",
  "nm-h-available",
  "nm-object-fit",
  "nm-invert"
], fu = [
  "nm-flex",
  "nm-text-white",
  "nm-text-sm",
  "nm-font-bold",
  "nm-mx-2"
], mu = [
  "nm-flex",
  "nm-flex-col",
  "nm-w-available",
  "nm-h-available"
], pu = [
  "nm-flex",
  "nm-text-white",
  "nm-text-lg",
  "nm-font-bold",
  "nm-mx-2"
], gu = [
  "nm-text-white",
  "nm-text-sm",
  "nm-line-clamp-4",
  "nm-font-bold",
  "nm-leading-5",
  "nm-overflow-hidden",
  "nm-mx-2"
], yu = [
  "nm-flex",
  "nm-flex-col",
  "nm-gap-3",
  "nm-w-available",
  "nm-h-1/2",
  "nm-mt-7",
  "nm-mb-3",
  "nm-overflow-auto",
  "nm-px-2",
  "nm-py-0.5",
  "[*::-webkit-scrollbar]:nm-hidden"
], vu = [
  "nm-flex",
  "nm-flex-col",
  "nm-gap-3",
  "nm-w-available",
  "nm-h-available",
  "nm-mt-7",
  "nm-mb-3",
  "nm-overflow-auto",
  "nm-px-2",
  "nm-py-0.5",
  "[*::-webkit-scrollbar]:nm-hidden"
], Cu = [
  "nm-flex",
  "nm-flex-col",
  "nm-justify-center",
  "nm-w-1/3",
  "nm-h-available"
], Tu = [
  "nm-flex",
  "nm-flex-col",
  "nm-justify-start",
  "nm-mt-28",
  "nm-w-1/3",
  "nm-h-available"
], Eu = [
  "nm-flex",
  "nm-flex-col",
  "nm-justify-between",
  "nm-items-center",
  "nm-w-2/5",
  "nm-h-available"
], xu = [
  "nm-flex",
  "nm-flex-col",
  "nm-justify-center",
  "nm-w-3/5",
  "nm-h-available"
], Su = [
  "nm-flex",
  "nm-flex-col",
  "nm-overflow-auto",
  "nm-h-available",
  "nm-pt-6",
  "nm-gap-2",
  "nm-p-1",
  "nm-min-h-[50%]"
], bu = [
  "nm-absolute",
  "nm-inset-0",
  "nm-w-available",
  "nm-h-available",
  "nm-z-50",
  "nm-grid",
  "nm-pointer-events-none",
  "nm-place-content-center"
], Lu = [
  "nm-flex",
  "nm-flex-col",
  "nm-items-center",
  "nm-gap-4",
  "nm-mt-11"
], Au = [
  "nm-inline",
  "nm-w-12",
  "nm-h-12",
  "nm-mr-2",
  "nm-animate-spin",
  "nm-text-white/20",
  "nm-fill-white"
], wu = [
  "nm-text-white",
  "nm-text-lg",
  "nm-font-bold"
], Iu = [
  "nm-episode-tip",
  "nm-hidden",
  "nm-absolute",
  "nm-left-0",
  "-nm-bottom-10",
  "nm-z-50",
  "!nm-w-96",
  "nm-h-24",
  "nm-px-2",
  "nm-gap-2",
  "nm-py-2",
  "nm-text-xs",
  "nm-text-white",
  "nm-rounded-lg",
  "nm-font-medium",
  "nm-bg-neutral-900/95"
], Ru = [
  "nm-playlist-card-left",
  "nm-relative",
  "nm-rounded-sm",
  "nm-w-[40%]",
  "nm-overflow-clip",
  "nm-self-center",
  ""
], ku = [
  "nm-playlist-card-image",
  "nm-w-available",
  "nm-h-auto",
  "nm-aspect-video",
  "nm-object-cover",
  "nm-rounded-md",
  ""
], Du = [
  "nm-playlist-card-left",
  "nm-relative",
  "nm-rounded-sm",
  "nm-w-[40%]",
  "nm-overflow-clip",
  "nm-self-center",
  ""
], Mu = [
  "nm-playlist-card-right",
  "nm-w-[60%]",
  "nm-flex",
  "nm-flex-col",
  "nm-text-left",
  "nm-gap-1"
], Pu = [
  "nm-playlist-card-header",
  "nm-font-bold",
  ""
], Fu = [
  "nm-playlist-card-title",
  "nm-font-bold",
  ""
], _u = [
  "nm-episode-tip",
  "nm-flex",
  "nm-gap-2",
  "nm-absolute",
  "nm-right-4",
  "nm-bottom-8",
  "!nm-w-80",
  "nm-h-24",
  "nm-px-2",
  "nm-py-2",
  "nm-z-50"
], Ou = [
  "nextup-button",
  "nm-bg-neutral-900/95",
  "nm-block",
  "!nm-text-[0.9rem]",
  "nm-font-bold",
  "!nm-color-neutral-100",
  "!nm-py-1.5",
  "nm-w-[45%]",
  "nm-outline",
  "nm-outline-transparent",
  "focus-visible:nm-outline-2",
  "focus-visible:nm-outline-white",
  "active:nm-outline-white",
  ""
], Nu = [
  "nextup-button",
  "animated",
  "nm-bg-neutral-100",
  "nm-w-[55%]",
  "nm-outline",
  "nm-outline-transparent",
  "focus-visible:nm-outline-2",
  "focus-visible:nm-outline-white",
  "active:nm-outline-white",
  ""
], Bu = [
  "nm-absolute",
  "nm-flex",
  "nm-flex-col",
  "nm-justify-end",
  "nm-gap-4",
  "nm-w-available",
  "nm-h-available",
  "nm-z-0"
], Uu = [
  "nm-absolute",
  "nm-inset-0",
  "nm-bg-black",
  "nm-pointer-events-none",
  "nm-bg-opacity-80",
  "nm-opacity-0",
  "nm-z-20",
  "nm-duration-300"
], $u = [
  "nm-relative",
  "nm-flex",
  "nm-flex-row",
  "nm-items-center",
  "nm-gap-4",
  "nm-mt-auto",
  "nm-w-available",
  "nm-px-20",
  "nm-pb-10",
  "nm-z-0"
], Vu = [], Hu = [], Gu = [], Ku = [], Wu = [
  "nm-flex",
  "nm-flex-col",
  "nm-justify-end",
  "nm-items-end",
  "nm-gap-2"
], zu = [
  "nm-text-white",
  "nm-text-sm",
  "nm-whitespace-pre",
  "nm-font-bold"
], Yu = [
  "nm-flex",
  "nm-flex-row",
  "nm-gap-2"
], Zu = [], qu = [], ju = [
  "nm-relative",
  "nm-h-auto",
  "nm-mb-28",
  "nm-w-available",
  "nm-translate-y-[80vh]",
  "nm-z-40",
  "nm-w-available"
], Xu = [
  "nm-relative",
  "nm-flex",
  "nm-h-available",
  "nm-w-available",
  "nm-overflow-auto",
  "nm-px-[calc(100%/2.14)]",
  "nm-gap-1.5",
  "scrollbar-none"
], Qu = [
  "nm-w-available",
  "nm-flex",
  "nm-gap-1.5",
  "nm-scroll-smooth",
  "nm-snap-x"
], Ju = [
  "nm-w-1/5",
  "nm-h-auto",
  "nm-object-cover",
  "nm-aspect-video",
  "nm-snap-center",
  "nm-duration-300",
  "",
  ""
], ed = [
  "[--gap:1.5rem]",
  "nm-absolute",
  "nm-flex",
  "nm-h-available",
  "nm-w-available",
  "nm-gap-[var(--gap)]",
  "z-10",
  "nm-pointer-events-none"
], td = [
  "nm-w-[calc(26%+(var(--gap)/2))]",
  "nm-h-auto",
  "nm-object-cover",
  "nm-aspect-video",
  "nm-border-4",
  "nm-mx-auto",
  ""
], sd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  backgroundStyles: Uu,
  bottomBarShadowStyles: Uc,
  bottomBarStyles: Bc,
  bottomRowStyles: $c,
  buttonBaseStyles: Vc,
  buttonContainerStyles: yu,
  buttonStyles: Hc,
  centerStyles: Gc,
  chapterBarStyles: Kc,
  chapterMarkerBGStyles: zc,
  chapterMarkerBufferStyles: Yc,
  chapterMarkerHoverStyles: Zc,
  chapterMarkerProgressStyles: qc,
  chapterMarkersStyles: Wc,
  chapterTextStyles: jc,
  descriptionStyles: gu,
  dividerStyles: Xc,
  episodeLeftSideStyles: Eu,
  episodeMenuButtonImageStyles: _h,
  episodeMenuButtonLeftStyles: Ph,
  episodeMenuButtonOverviewStyles: Kh,
  episodeMenuButtonRightSideStyles: Hh,
  episodeMenuButtonShadowStyles: Fh,
  episodeMenuButtonTitleStyles: Gh,
  episodeMenuProgressBoxStyles: Nh,
  episodeMenuProgressContainerStyles: Oh,
  episodeRightSideStyles: xu,
  episodeScreenStyles: Yh,
  episodeScrollContainerStyles: Su,
  episodesCountStyles: fu,
  fallbackTextStyles: lu,
  iconStyles: Qc,
  languageButtonSpanStyles: Jc,
  languageButtonStyles: qh,
  languageRightSideStyles: Tu,
  languageScreenStyles: Zh,
  leftSideStyles: nu,
  leftSideTopStyles: ru,
  logoContainerStyles: au,
  logoFooterStyles: cu,
  logoStyles: ou,
  mainMenuStyles: eh,
  menuButtonStyles: th,
  menuButtonTextStyles: sh,
  menuContentStyles: ih,
  menuFrameStyles: nh,
  menuHeaderButtonStyles: rh,
  menuHeaderButtonTextStyles: ah,
  menuHeaderStyles: oh,
  nextTipHeaderStyles: Pu,
  nextTipImageStyles: ku,
  nextTipLeftSideStyles: Du,
  nextTipRightSideStyles: Mu,
  nextTipStyles: Iu,
  nextTipTextStyles: Ru,
  nextTipTitleStyles: Fu,
  nextUpCreditsButtonStyles: Ou,
  nextUpNextButtonStyles: Nu,
  nextUpStyles: _u,
  overlayStyles: lh,
  overviewContainerStyles: mu,
  pauseScreenStyles: zh,
  playerMessageStyles: kh,
  playlistMenuButtonStyles: Mh,
  playlistMenuStyles: Dh,
  progressBarStyles: Vh,
  progressContainerDurationTextStyles: Uh,
  progressContainerItemTextStyles: Bh,
  ratingContainerStyles: uu,
  ratingImageStyles: du,
  rightSideStyles: Cu,
  roleStyles: Lu,
  scrollContainerStyles: ch,
  seekContainerChildStyles: Qu,
  seekContainerStyles: ju,
  seekScrollCloneStyles: ed,
  seekScrollContainerStyles: Xu,
  sliderBarStyles: hh,
  sliderBufferStyles: uh,
  sliderContainerStyles: $h,
  sliderHoverStyles: dh,
  sliderNippleStyles: mh,
  sliderPopImageStyles: ph,
  sliderPopStyles: gh,
  sliderProgressStyles: fh,
  sliderTextStyles: yh,
  sliderThumbStyles: vh,
  speedButtonTextStyles: Ch,
  spinnerContainerStyles: bu,
  spinnerStyles: Au,
  statusTextStyles: wu,
  subMenuContentStyles: Th,
  subMenuStyles: Eh,
  subtitleButtonContainerStyles: vu,
  svgSizeStyles: xh,
  thumbnailCloneStyles: td,
  thumbnailStyles: Ju,
  timeStyles: Sh,
  titleStyles: pu,
  tooltipStyles: Wh,
  topBarStyles: bh,
  topRowStyles: Lh,
  touchPlaybackButtonStyles: Ah,
  touchPlaybackStyles: wh,
  tvBottomRowStyles: $u,
  tvButtonStyles: jh,
  tvButtonTextStyles: Xh,
  tvCurrentItemContainerStyles: Wu,
  tvCurrentItemEpisodeStyles: Zu,
  tvCurrentItemShowStyles: zu,
  tvCurrentItemTitleContainerStyles: Yu,
  tvCurrentItemTitleStyles: qu,
  tvEpisodeMenuButtonLeftStyles: eu,
  tvEpisodeMenuButtonOverviewStyles: iu,
  tvEpisodeMenuButtonRightSideStyles: tu,
  tvEpisodeMenuButtonTitleStyles: su,
  tvOverlayStyles: Bu,
  tvSeasonButtonStyles: Qh,
  tvSeasonButtonTextStyles: Jh,
  tvSeekBarInnerBufferStyles: Ku,
  tvSeekBarInnerProgressStyles: Gu,
  tvSeekBarInnerStyles: Hu,
  tvSeekBarStyles: Vu,
  volumeContainerStyles: Ih,
  volumeSliderStyles: Rh,
  yearStyles: hu
}, Symbol.toStringTag, { value: "Module" }));
var Ut, cr;
class id extends ot {
  constructor() {
    super(...arguments);
    Ks(this, Ut);
    this.player = {}, this.overlay = {}, this.topBar = {}, this.bottomRow = {}, this.frame = {}, this.chapters = [], this.timer = {}, this.isMouseDown = !1, this.progressBar = {}, this.isScrubbing = !1, this.menuOpen = !1, this.mainMenuOpen = !1, this.languageMenuOpen = !1, this.subtitlesMenuOpen = !1, this.qualityMenuOpen = !1, this.speedMenuOpen = !1, this.playlistMenuOpen = !1, this.theaterModeEnabled = !1, this.pipEnabled = !1, this.leftTap = {}, this.rightTap = {}, this.leeway = 300, this.seekInterval = 10, this.previewTime = [], this.sliderPopImage = {}, this.chapterBar = {}, this.bottomBar = {}, this.topRow = {}, this.nextUp = {}, this.currentTimeFile = "", this.fluentIcons = {}, this.buttons = {}, this.tooltip = {}, this.hasNextTip = !1, this.sliderBar = {}, this.currentScrubTime = 0, this.imageBaseUrl = "", this.timeout = {}, this.episodeScrollContainer = {}, this.currentMenu = null, this.thumbs = [], this.image = "", this.disablePauseScreen = !1, this.disableOverlay = !1, this.seekContainer = {}, this.shouldSlide = !1, this.thumbnail = {}, this.thumbnailWidth = 256, this.thumbnailHeight = 144, this.controlsVisible = !1, this.makeStyles = (t) => this.mergeStyles(`${t}`, sd[t]);
  }
  initialize(t) {
    this.player = t, this.overlay = t.overlay, this.buttons = Nc(), this.imageBaseUrl = t.options.basePath ? "" : "https://image.tmdb.org/t/p/w185";
  }
  use() {
    this.topBar = this.createTopBar(this.overlay), this.createBackButton(this.topBar), this.createCloseButton(this.topBar), this.createDivider(this.topBar);
    const t = this.createTvCurrentItem(this.topBar);
    this.player.addClasses(t, [
      "nm-px-2",
      "nm-pt-2",
      "nm-z-0"
    ]), this.player.options.disableTouchControls || this.createCenter(this.overlay), this.bottomBar = this.createBottomBar(this.overlay), this.bottomBar.onmouseleave = (s) => {
      var n;
      const i = (n = this.player.getVideoElement()) == null ? void 0 : n.getBoundingClientRect();
      !i || s.x > i.left && s.x < i.right && s.y > i.top && s.y < i.bottom || this.player.emit("hide-tooltip");
    }, this.topRow = this.createTopRow(this.bottomBar), this.player.addClasses(this.topRow, ["nm-mt-4"]), this.bottomRow = this.createBottomRow(this.bottomBar), this.createProgressBar(this.topRow), this.createPlaybackButton(this.bottomRow), this.createPreviousButton(this.bottomRow), this.createSeekBackButton(this.bottomRow), this.createSeekForwardButton(this.bottomRow), this.createNextButton(this.bottomRow), this.createVolumeButton(this.bottomRow), this.createTime(this.bottomRow, "current", ["nm-ml-2"]), this.createDivider(this.bottomRow), this.createTime(this.bottomRow, "remaining", ["nm-mr-2"]), this.createTheaterButton(this.bottomRow), this.createPIPButton(this.bottomRow), this.createPlaylistsButton(this.bottomRow), this.createSpeedButton(this.bottomRow), this.createCaptionsButton(this.bottomRow), this.createAudioButton(this.bottomRow), this.createQualityButton(this.bottomRow), this.createSettingsButton(this.bottomRow), this.createFullscreenButton(this.bottomRow), this.frame = this.createMenuFrame(this.bottomRow), this.createMainMenu(this.frame), this.createToolTip(this.overlay), this.createEpisodeTip(this.overlay), this.createNextUp(this.overlay), this.modifySpinner(this.overlay), this.eventHandlers();
  }
  createBottomBar(t) {
    const s = this.player.createElement("div", "bottom-bar").addClasses(this.makeStyles("bottomBarStyles")).appendTo(t);
    return this.player.createElement("div", "bottom-bar-shadow").addClasses(this.makeStyles("bottomBarShadowStyles")).appendTo(s), s;
  }
  createTopRow(t) {
    return this.player.createElement("div", "top-row").addClasses(this.makeStyles("topRowStyles")).appendTo(t);
  }
  createBottomRow(t) {
    return this.player.createElement("div", "bottom-row").addClasses(this.makeStyles("bottomRowStyles")).appendTo(t);
  }
  eventHandlers() {
    this.player.on("controls", (t) => {
      var s, i;
      this.player.getElement() && (t ? (this.player.getElement().style.cursor = "default", (s = this.player.getElement()) == null || s.setAttribute("active", "true")) : (this.player.getElement().style.cursor = "none", (i = this.player.getElement()) == null || i.setAttribute("active", "false")));
    }), this.player.on("chapters", () => {
      this.createChapterMarkers();
    }), this.player.on("back-button-hyjack", () => {
      switch (this.currentMenu) {
        case "episode":
        case "language":
        case "quality":
          this.player.emit("showPauseScreen");
          break;
        case "seek":
        case "pause":
          this.seekContainer.style.transform = "", this.player.play();
          break;
        default:
          this.player.hasBackEventHandler ? this.player.emit("back") : history.back();
          break;
      }
    });
  }
  /**
      * Merges the default styles with the styles for a specific style name.
      * @param styleName - The name of the style to merge.
      * @param defaultStyles - The default styles to merge.
      * @returns An array containing the merged styles.
      */
  mergeStyles(t, s) {
    var n;
    const i = ((n = this.player.options.styles) == null ? void 0 : n[t]) || [];
    return [...s, ...i];
  }
  createTopBar(t) {
    return this.player.createElement("div", "top-bar").addClasses(this.makeStyles("topBarStyles")).appendTo(t);
  }
  createCenter(t) {
    const s = this.player.createElement("div", "center").addClasses(this.makeStyles("centerStyles")).appendTo(t);
    return this.createSpinnerContainer(s), this.player.isMobile() ? (this.createTouchSeekBack(s, { x: { start: 1, end: 1 }, y: { start: 2, end: 6 } }), this.createTouchPlayback(s, { x: { start: 2, end: 2 }, y: { start: 3, end: 5 } }), this.createTouchSeekForward(s, { x: { start: 3, end: 3 }, y: { start: 2, end: 6 } }), this.createTouchVolUp(s, { x: { start: 2, end: 2 }, y: { start: 1, end: 3 } }), this.createTouchVolDown(s, { x: { start: 2, end: 2 }, y: { start: 5, end: 7 } })) : (this.createTouchSeekBack(s, { x: { start: 1, end: 2 }, y: { start: 2, end: 6 } }), this.createTouchPlayback(s, { x: { start: 2, end: 3 }, y: { start: 2, end: 6 } }), this.createTouchSeekForward(s, { x: { start: 3, end: 4 }, y: { start: 2, end: 6 } })), s;
  }
  createTouchSeekBack(t, s) {
    const i = this.createTouchBox(t, "touchSeekBack", s);
    return ["click"].forEach((n) => {
      i.addEventListener(n, this.doubleTap(() => {
        this.player.rewindVideo();
      }));
    }), this.createSeekRipple(i, "left"), i;
  }
  /**
      * Attaches a double tap event listener to the element.
      * @param callback - The function to execute when a double tap event occurs.
      * @param callback2 - An optional function to execute when a second double tap event occurs.
      * @returns A function that detects double tap events.
      */
  doubleTap(t, s) {
    const i = this.player.options.doubleClickDelay ?? 500;
    let n = 0, r, o;
    return function(c, h) {
      const u = (/* @__PURE__ */ new Date()).getTime(), d = u - n;
      d > 0 && d < i ? (c.preventDefault(), t(c), clearTimeout(o)) : (r = setTimeout(() => {
        clearTimeout(r);
      }, i), o = setTimeout(() => {
        s == null || s(h);
      }, i)), n = u;
    };
  }
  createTouchSeekForward(t, s) {
    const i = this.createTouchBox(t, "touchSeekForward", s);
    return ["mouseup", "touchend"].forEach((n) => {
      i.addEventListener(n, this.doubleTap(() => {
        this.player.forwardVideo();
      }));
    }), this.createSeekRipple(i, "right"), i;
  }
  createTouchPlayback(t, s, i = !1) {
    const n = this.createTouchBox(t, "touchPlayback", s);
    if (this.player.addClasses(n, this.makeStyles("touchPlaybackStyles")), ["click"].forEach((r) => {
      n.addEventListener(r, this.doubleTap(
        () => this.player.getFullscreen(),
        () => {
          (this.controlsVisible || !this.player.options.disableTouchControls) && this.player.togglePlayback();
        }
      ));
    }), this.player.isMobile()) {
      const r = this.createSVGElement(n, "bigPlay", this.buttons.bigPlay, i);
      this.player.addClasses(r, this.makeStyles("touchPlaybackButtonStyles")), this.player.on("pause", () => {
        r.style.display = "flex";
      }), this.player.on("play", () => {
        r.style.display = "none";
      });
    }
    return n;
  }
  createTouchVolUp(t, s) {
    if (!this.player.isMobile())
      return;
    const i = this.createTouchBox(t, "touchVolUp", s);
    return ["click"].forEach((n) => {
      i.addEventListener(n, this.doubleTap(() => {
        this.player.volumeUp();
      }));
    }), i;
  }
  createTouchVolDown(t, s) {
    if (!this.player.isMobile())
      return;
    const i = this.createTouchBox(t, "touchVolDown", s);
    return ["click"].forEach((n) => {
      i.addEventListener(n, this.doubleTap(() => {
        this.player.volumeDown();
      }));
    }), i;
  }
  createTouchBox(t, s, i) {
    const n = this.player.createElement("div", `touch-box-${s}`).addClasses([`touch-box-${s}`, "nm-z-40"]).appendTo(t);
    return n.style.gridColumnStart = i.x.start.toString(), n.style.gridColumnEnd = i.x.end.toString(), n.style.gridRowStart = i.y.start.toString(), n.style.gridRowEnd = i.y.end.toString(), t.appendChild(n), n;
  }
  createDivider(t, s) {
    const i = this.player.createElement("div", "divider").addClasses(this.makeStyles("dividerStyles")).appendTo(t);
    return s ? i.innerHTML = s : this.player.addClasses(i, this.makeStyles("dividerStyles")), i;
  }
  createSVGElement(t, s, i, n = !1, r = !1) {
    const o = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    o.setAttribute("viewBox", "0 0 24 24"), o.id = s, this.player.addClasses(o, [
      `${s}-icon`,
      ...i.classes,
      ...this.makeStyles("svgSizeStyles"),
      ...this.makeStyles("iconStyles"),
      n ? "nm-hidden" : "nm-flex"
    ]);
    const l = document.createElementNS("http://www.w3.org/2000/svg", "path");
    l.setAttribute("d", r ? i.hover : i.normal), this.player.addClasses(l, [
      "group-hover/button:nm-hidden",
      "group-hover/volume:nm-hidden"
    ]), o.appendChild(l);
    const c = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return c.setAttribute("d", r ? i.normal : i.hover), this.player.addClasses(c, [
      "nm-hidden",
      "group-hover/button:nm-flex",
      "group-hover/volume:nm-flex"
    ]), o.appendChild(c), t.classList.contains("menu-button") || (t.addEventListener("mouseenter", () => {
      if (i.title.length == 0 || ["Next", "Previous"].includes(i.title) && this.player.hasNextTip || i.title == "Fullscreen" && this.player.getFullscreen() || i.title == "Exit fullscreen" && !this.player.getFullscreen() || i.title == "Play" && this.player.isPlaying || i.title == "Pause" && !this.player.isPlaying || i.title == "Mute" && this.player.isMuted() || i.title == "Unmute" && !this.player.isMuted())
        return;
      const h = `${this.player.localize(i.title)} ${this.getButtonKeyCode(s)}`, u = this.player.getElement().getBoundingClientRect(), d = t.getBoundingClientRect();
      let f = Math.abs(u.left - (d.left + d.width * 0.5) - h.length * 0.5);
      const m = Math.abs(u.bottom - (d.bottom + d.height * 1.2));
      f < 35 && (f = 35), f > u.right - u.left - 75 && (f = u.right - u.left - 75), this.player.emit("show-tooltip", {
        text: h,
        currentTime: "bottom",
        x: `${f}px`,
        y: `-${m}px`
      });
    }), t.addEventListener("mouseleave", () => {
      this.player.emit("hide-tooltip");
    })), t.appendChild(o), o;
  }
  createUiButton(t, s) {
    var n;
    const i = this.player.createElement("button", s).addClasses(this.makeStyles("buttonStyles")).appendTo(t);
    return i.ariaLabel = (n = this.buttons[s]) == null ? void 0 : n.title, i;
  }
  createSettingsButton(t, s = !1) {
    if (!this.player.hasSpeeds() && !this.player.hasAudioTracks() && !this.player.hasCaptions())
      return;
    const i = this.createUiButton(
      t,
      "settings"
    );
    return this.createSVGElement(i, "settings", this.buttons.settings, s), i.addEventListener("click", () => {
      this.player.emit("hide-tooltip"), this.menuOpen && this.mainMenuOpen ? this.player.emit("show-menu", !1) : !this.menuOpen && this.mainMenuOpen ? this.player.emit("show-menu", !0) : this.menuOpen && !this.mainMenuOpen ? (this.player.emit("show-main-menu", !0), this.player.emit("show-menu", !0)) : (this.player.emit("show-main-menu", !0), this.player.emit("show-menu", !0));
    }), this.player.on("pip-internal", (n) => {
      n ? i.style.display = "none" : i.style.display = "flex";
    }), t.append(i), i;
  }
  createBackButton(t, s = !1) {
    if (!this.player.hasBackEventHandler)
      return;
    const i = this.createUiButton(
      t,
      "back"
    );
    return t.appendChild(i), this.createSVGElement(i, "back", this.buttons.back, !1, s), i.addEventListener("click", () => {
      this.player.emit("hide-tooltip"), this.player.emit("back");
    }), this.player.on("pip-internal", (n) => {
      n ? i.style.display = "none" : i.style.display = "flex";
    }), i;
  }
  createCloseButton(t, s = !1) {
    if (!this.player.hasCloseEventHandler)
      return;
    const i = this.createUiButton(
      t,
      "close"
    );
    return t.appendChild(i), this.createSVGElement(i, "close", this.buttons.close, !1, s), i.addEventListener("click", () => {
      this.player.emit("hide-tooltip"), this.player.emit("close");
    }), this.player.on("pip-internal", (n) => {
      n ? i.style.display = "none" : i.style.display = "flex";
    }), i;
  }
  createPlaybackButton(t, s = !1) {
    var o;
    const i = this.createUiButton(
      t,
      "playback"
    );
    t.appendChild(i), i.ariaLabel = (o = this.buttons.play) == null ? void 0 : o.title;
    const n = this.createSVGElement(i, "paused", this.buttons.play, !1, s), r = this.createSVGElement(i, "playing", this.buttons.pause, !0, s);
    return i.addEventListener("click", (l) => {
      l.stopPropagation(), this.player.togglePlayback(), this.player.emit("hide-tooltip");
    }), this.player.on("pause", () => {
      r.style.display = "none", n.style.display = "flex";
    }), this.player.on("play", () => {
      n.style.display = "none", r.style.display = "flex";
    }), this.player.on("playlistItem", () => {
      r.focus();
    }), i;
  }
  createSeekBackButton(t, s = !1) {
    if (this.player.isMobile())
      return;
    const i = this.createUiButton(
      t,
      "seekBack"
    );
    return this.createSVGElement(i, "seekBack", this.buttons.seekBack, s), i.addEventListener("click", () => {
      this.player.emit("hide-tooltip"), this.player.rewindVideo();
    }), this.player.on("pip-internal", (n) => {
      n ? i.style.display = "none" : i.style.display = "flex";
    }), t.append(i), i;
  }
  createSeekForwardButton(t, s = !1) {
    if (this.player.isMobile())
      return;
    const i = this.createUiButton(
      t,
      "seekForward"
    );
    return this.createSVGElement(i, "seekForward", this.buttons.seekForward, s), i.addEventListener("click", () => {
      this.player.emit("hide-tooltip"), this.player.forwardVideo();
    }), this.player.on("pip-internal", (n) => {
      n ? i.style.display = "none" : i.style.display = "flex";
    }), t.append(i), i;
  }
  createTime(t, s, i) {
    const n = this.player.createElement("button", `${s}-time`).addClasses([
      ...i,
      ...this.makeStyles("timeStyles"),
      `${s}-time`
    ]).appendTo(t);
    switch (n.textContent = "00:00", s) {
      case "current":
        this.player.on("time", (r) => {
          n.textContent = be(r.currentTime);
        }), this.player.on("currentScrubTime", (r) => {
          n.textContent = be(r.currentTime);
        });
        break;
      case "remaining":
        this.player.on("duration", (r) => {
          r.remaining === 1 / 0 ? n.textContent = "Live" : n.textContent = be(r.remaining);
        }), this.player.on("time", (r) => {
          r.remaining === 1 / 0 ? n.textContent = "Live" : n.textContent = be(r.remaining);
        });
        break;
      case "duration":
        this.player.on("duration", (r) => {
          r.duration === 1 / 0 ? n.textContent = "Live" : n.textContent = be(r.duration);
        });
        break;
    }
    return this.player.on("pip-internal", (r) => {
      r ? n.style.display = "none" : n.style.display = "";
    }), n;
  }
  createVolumeButton(t, s = !1) {
    var u;
    if (this.player.isMobile())
      return;
    const i = this.player.createElement("div", "volume-container").addClasses(this.makeStyles("volumeContainerStyles")).appendTo(t), n = this.createUiButton(
      i,
      "volume"
    );
    n.ariaLabel = (u = this.buttons.volumeHigh) == null ? void 0 : u.title;
    const r = this.player.createElement("input", "volume-slider").addClasses(this.makeStyles("volumeSliderStyles")).appendTo(i);
    r.type = "range", r.min = "0", r.max = "100", r.step = "1", r.value = this.player.getVolume().toString(), r.style.backgroundSize = `${this.player.getVolume()}% 100%`;
    const o = this.createSVGElement(n, "volumeMuted", this.buttons.volumeMuted, !0, s), l = this.createSVGElement(n, "volumeLow", this.buttons.volumeLow, !0, s), c = this.createSVGElement(n, "volumeMedium", this.buttons.volumeMedium, !0, s), h = this.createSVGElement(n, "volumeHigh", this.buttons.volumeHigh, s);
    return n.addEventListener("click", (d) => {
      d.stopPropagation(), this.player.toggleMute(), this.player.emit("hide-tooltip");
    }), r.addEventListener("input", (d) => {
      d.stopPropagation();
      const f = Math.floor(parseInt(r.value, 10));
      r.style.backgroundSize = `${f}% 100%`, this.player.setVolume(f);
    }), i.addEventListener("wheel", (d) => {
      d.preventDefault();
      const f = d.deltaY === 0 ? -d.deltaX : -d.deltaY;
      f !== 0 && (r.style.backgroundSize = `${r.value}% 100%`, r.value = (parseFloat(r.value) + f * 0.5).toString(), this.player.setVolume(parseFloat(r.value)));
    }, {
      passive: !0
    }), this.player.on("volume", (d) => {
      this.volumeHandle(d, o, l, c, h), r.style.backgroundSize = `${d.volume}% 100%`;
    }), this.player.on("mute", (d) => {
      this.volumeHandle(d, o, l, c, h), d.mute ? r.style.backgroundSize = "0% 100%" : r.style.backgroundSize = `${this.player.getVolume()}% 100%`;
    }), i;
  }
  volumeHandle(t, s, i, n, r) {
    this.player.getMute() || t.volume == 0 ? (i.style.display = "none", n.style.display = "none", r.style.display = "none", s.style.display = "flex") : t.volume <= 30 ? (n.style.display = "none", r.style.display = "none", s.style.display = "none", i.style.display = "flex") : t.volume <= 60 ? (i.style.display = "none", r.style.display = "none", s.style.display = "none", n.style.display = "flex") : (i.style.display = "none", n.style.display = "none", s.style.display = "none", r.style.display = "flex");
  }
  isLastSibbling(t) {
    return !t.nextElementSibling;
  }
  createTvOverlay(t) {
    const s = this.player.createElement("div", "tv-overlay").addClasses(this.makeStyles("tvOverlayStyles")).appendTo(t), i = this.player.createElement("div", "background").addClasses(this.makeStyles("backgroundStyles")).appendTo(s), n = this.player.createTopBar(s);
    this.player.addClasses(n, [
      "nm-px-10",
      "nm-pt-10",
      "nm-z-0"
    ]);
    const r = this.createBackButton(n, !0);
    r && this.player.addClasses(r, ["children:nm-stroke-2"]);
    const o = this.createRestartButton(n, !0);
    this.player.addClasses(o, ["children:nm-stroke-2"]);
    const l = this.createNextButton(n, !0);
    this.player.addClasses(l, ["children:nm-stroke-2"]), this.createDivider(n), this.createTvCurrentItem(n), this.createOverlayCenterMessage(s), this.seekContainer = this.createSeekContainer(s);
    const c = this.createBottomBar(s), h = this.player.createElement("div", "seek-container").addClasses(this.makeStyles("tvBottomRowStyles")).appendTo(c), u = this.createPlaybackButton(h, !0);
    this.createTime(h, "current", []), this.createTvProgressBar(h), this.createTime(h, "remaining", ["nm-mr-14"]), this.createNextUp(s), this.player.on("show-seek-container", (f) => {
      f ? i.style.opacity = "1" : i.style.opacity = "0";
    }), this.player.on("controls", (f) => {
      f && this.currentMenu !== "seek" && !this.controlsVisible && u.focus();
    }), this.player.on("pause", () => {
      i.style.opacity = "1";
    }), this.player.on("play", () => {
      i.style.opacity = "0", this.hideSeekMenu();
    });
    let d = r ?? o ?? l;
    return [r, o, l].forEach((f) => {
      f == null || f.addEventListener("keydown", (m) => {
        var p;
        m.key == "ArrowDown" ? this.nextUp.style.display == "none" ? u == null || u.focus() : (p = this.nextUp.lastChild) == null || p.focus() : m.key == "ArrowLeft" ? (d = m.target.previousElementSibling, d == null || d.focus()) : m.key == "ArrowRight" && (m.preventDefault(), d = m.target.nextElementSibling, d == null || d.focus());
      });
    }), [this.nextUp.firstChild, this.nextUp.lastChild].forEach((f) => {
      f == null || f.addEventListener("keydown", (m) => {
        var p, g, v;
        m.key == "ArrowUp" ? (p = d || o) == null || p.focus() : m.key == "ArrowDown" ? u.focus() : m.key == "ArrowLeft" ? (g = this.nextUp.firstChild) == null || g.focus() : m.key == "ArrowRight" && ((v = this.nextUp.lastChild) == null || v.focus());
      });
    }), [u].forEach((f) => {
      f == null || f.addEventListener("keydown", (m) => {
        var p;
        m.key == "ArrowUp" && (m.preventDefault(), this.nextUp.style.display == "none" ? d == null || d.focus() : (p = this.nextUp.lastChild) == null || p.focus());
      });
    }), [this.player.getVideoElement(), s].forEach((f) => {
      f == null || f.addEventListener("keydown", (m) => {
        if (m.key == "ArrowLeft") {
          if ([r, o, l, this.nextUp.firstChild, this.nextUp.lastChild].includes(m.target))
            return;
          if (m.preventDefault(), this.showSeekMenu(), this.shouldSlide)
            this.currentScrubTime = this.getClosestSeekableInterval(), this.shouldSlide = !1;
          else {
            const p = this.currentScrubTime - 10;
            this.player.emit("currentScrubTime", {
              ...this.player.videoPlayer_getTimeData(),
              currentTime: p
            });
          }
        } else if (m.key == "ArrowRight") {
          if ([r, o, l, this.nextUp.firstChild, this.nextUp.lastChild].includes(m.target))
            return;
          if (m.preventDefault(), this.showSeekMenu(), this.shouldSlide)
            this.currentScrubTime = this.getClosestSeekableInterval(), this.shouldSlide = !1;
          else {
            const p = this.currentScrubTime + 10;
            this.player.emit("currentScrubTime", {
              ...this.player.videoPlayer_getTimeData(),
              currentTime: p
            });
          }
        }
      });
    }), [this.player.getVideoElement(), u, r, o, l].forEach((f) => {
      f == null || f.addEventListener("keydown", (m) => {
        m.key == "ArrowUp" ? (this.disablePauseScreen = !1, this.hideSeekMenu()) : m.key == "ArrowDown" ? (this.disablePauseScreen = !1, this.hideSeekMenu()) : m.key == "Enter" && (this.player.seek(this.currentScrubTime), this.player.play());
      });
    }), u.focus(), c;
  }
  getClosestSeekableInterval() {
    const t = this.player.currentTime(), i = this.previewTime.find((n) => t >= n.start && t < n.end);
    return i == null ? void 0 : i.start;
  }
  showSeekMenu() {
    this.currentMenu = "seek", this.disablePauseScreen = !0, this.player.emit("show-seek-container", !0);
  }
  hideSeekMenu() {
    this.currentMenu = null, this.disablePauseScreen = !1, this.disableOverlay = !1, this.currentMenu = null, this.disablePauseScreen = !1, this.shouldSlide = !0, this.player.emit("show-seek-container", !1);
  }
  createSeekContainer(t) {
    const s = this.player.createElement("div", "seek-container").addClasses(this.makeStyles("seekContainerStyles")).appendTo(t), i = this.player.createElement("div", "seek-scroll-clone-container").addClasses(this.makeStyles("seekScrollCloneStyles")).appendTo(s);
    this.player.createElement("div", "thumbnail-clone-1").addClasses(this.makeStyles("thumbnailCloneStyles")).appendTo(i);
    const n = this.player.createElement("div", "seek-scroll-container").addClasses(this.makeStyles("seekScrollContainerStyles")).appendTo(s);
    return this.player.once("playlistItem", () => {
      this.player.on("preview-time", () => {
        this.thumbs = [];
        for (const r of this.previewTime)
          this.thumbs.push({
            time: r,
            el: this.createThumbnail(r)
          });
        n.innerHTML = "", this.unique(this.thumbs.map((r) => r.el), "id").forEach((r) => {
          n.appendChild(r);
        }), this.player.once("time", () => {
          this.currentScrubTime = this.getClosestSeekableInterval(), this.player.emit("currentScrubTime", {
            ...this.player.videoPlayer_getTimeData(),
            currentTime: this.getClosestSeekableInterval()
          });
        });
      });
    }), this.player.on("lastTimeTrigger", () => {
      this.currentScrubTime = this.getClosestSeekableInterval(), this.player.emit("currentScrubTime", {
        ...this.player.videoPlayer_getTimeData(),
        currentTime: this.getClosestSeekableInterval()
      });
    }), this.player.on("currentScrubTime", (r) => {
      r.currentTime <= 0 ? r.currentTime = 0 : r.currentTime >= this.player.getDuration() && (r.currentTime = this.player.getDuration() - 10);
      const o = this.thumbs.find((d) => r.currentTime >= d.time.start && r.currentTime <= d.time.end);
      if (this.currentScrubTime = r.currentTime, !o)
        return;
      Ws(this, Ut, cr).call(this, o.el);
      const l = this.thumbs.findIndex((d) => d.el == o.el);
      if (!l)
        return;
      const c = 3, h = l - c, u = l + c;
      for (const [d, f] of this.thumbs.entries())
        d > h && d < u ? f.el.style.opacity = "1" : f.el.style.opacity = "0";
    }), this.player.on("show-seek-container", (r) => {
      r ? (s.style.transform = "none", this.player.pause()) : this.seekContainer.style.transform = "";
    }), s;
  }
  createTvCurrentItem(t) {
    const s = this.player.createElement("div", "current-item-container").addClasses(this.makeStyles("tvCurrentItemContainerStyles")).appendTo(t), i = this.player.createElement("div", "current-item-show").addClasses(this.makeStyles("tvCurrentItemShowStyles")).appendTo(s), n = this.player.createElement("div", "current-item-title-container").addClasses(this.makeStyles("tvCurrentItemTitleContainerStyles")).appendTo(s), r = this.player.createElement("div", "current-item-episode").addClasses(this.makeStyles("tvCurrentItemEpisodeStyles")).appendTo(n), o = this.player.createElement("div", "current-item-title").addClasses(this.makeStyles("tvCurrentItemTitleStyles")).appendTo(n);
    return this.player.on("playlistItem", () => {
      const l = this.player.playlistItem();
      i.innerHTML = this.breakLogoTitle(l.show), r.innerHTML = "", l.season && (r.innerHTML += `${this.player.localize("S")}${l.season}`), l.season && l.episode && (r.innerHTML += `: ${this.player.localize("E")}${l.episode}`), o.innerHTML = l.title.replace(l.show, "").length > 0 ? `"${l.title.replace(l.show, "").replace("%S", this.player.localize("S")).replace("%E", this.player.localize("E"))}"` : "";
    }), s;
  }
  createPreviousButton(t, s = !1) {
    if (this.player.isMobile())
      return;
    const i = this.createUiButton(
      t,
      "previous"
    );
    return i.style.display = "none", this.createSVGElement(i, "previous", this.buttons.previous, s), i.addEventListener("click", (n) => {
      n.stopPropagation(), this.player.previous(), this.player.emit("hide-tooltip");
    }), this.player.on("playlistItem", () => {
      this.player.getPlaylistIndex() > 0 ? i.style.display = "flex" : i.style.display = "none";
    }), this.player.on("pip-internal", (n) => {
      n ? i.style.display = "none" : (this.player.playlistItem().episode ?? -0 - 1 == 0) && (i.style.display = "flex");
    }), i.addEventListener("mouseenter", () => {
      const n = i.getBoundingClientRect(), r = t.getBoundingClientRect();
      let o = Math.abs(r.left - n.left + 50);
      const l = Math.abs(r.bottom - n.bottom - 60);
      o < 30 && (o = 30), o > n.right - n.left - 10 && (o = n.right - n.left - 10), this.player.emit("show-episode-tip", {
        direction: "previous",
        currentTime: "bottom",
        x: `${o}px`,
        y: `-${l}px`
      });
    }), i.addEventListener("mouseleave", () => {
      this.player.emit("hide-episode-tip");
    }), t.appendChild(i), i;
  }
  createNextButton(t, s = !1) {
    const i = this.createUiButton(
      t,
      "next"
    );
    return i.style.display = "none", this.player.hasNextTip = !0, this.createSVGElement(i, "next", this.buttons.next, !1, s), i.addEventListener("click", (n) => {
      n.stopPropagation(), this.player.next(), this.player.emit("hide-tooltip");
    }), this.player.on("playlistItem", () => {
      this.player.isLastPlaylistItem() ? i.style.display = "none" : i.style.display = "flex";
    }), this.player.on("pip-internal", (n) => {
      n ? i.style.display = "none" : this.player.isLastPlaylistItem() && (i.style.display = "flex");
    }), i.addEventListener("mouseenter", () => {
      const n = i.getBoundingClientRect(), r = t.getBoundingClientRect();
      let o = Math.abs(r.left - n.left + 50);
      const l = Math.abs(r.bottom - n.bottom - 60);
      o < 30 && (o = 30), o > n.right - n.left - 10 && (o = n.right - n.left - 10), this.player.emit("show-episode-tip", {
        direction: "next",
        currentTime: "bottom",
        x: `${o}px`,
        y: `-${l}px`
      });
    }), i.addEventListener("mouseleave", () => {
      this.player.emit("hide-episode-tip");
    }), t.appendChild(i), i;
  }
  createRestartButton(t, s = !1) {
    const i = this.createUiButton(
      t,
      "restart"
    );
    return t.appendChild(i), this.createSVGElement(i, "restart", this.buttons.restart, !1, s), i.addEventListener("click", (n) => {
      n.stopPropagation(), this.player.restart();
    }), i;
  }
  createCaptionsButton(t, s = !1) {
    var o;
    const i = this.createUiButton(
      t,
      "subtitles"
    );
    i.style.display = "none", i.ariaLabel = (o = this.buttons.subtitles) == null ? void 0 : o.title;
    const n = this.createSVGElement(i, "subtitle", this.buttons.subtitlesOff, s), r = this.createSVGElement(i, "subtitled", this.buttons.subtitles, !0, s);
    return i.addEventListener("click", (l) => {
      l.stopPropagation(), this.player.emit("hide-tooltip"), this.subtitlesMenuOpen ? this.player.emit("show-menu", !1) : this.player.emit("show-subtitles-menu", !0);
    }), this.player.on("captions", () => {
      this.player.getCaptionsList().length > 0 ? i.style.display = "flex" : i.style.display = "none";
    }), this.player.on("caption-change", (l) => {
      l.track == -1 ? (r.style.display = "none", n.style.display = "flex") : (r.style.display = "flex", n.style.display = "none");
    }), this.player.on("pip-internal", (l) => {
      l ? i.style.display = "none" : this.player.hasCaptions() && (i.style.display = "flex");
    }), t.appendChild(i), i;
  }
  createAudioButton(t, s = !1) {
    var n;
    const i = this.createUiButton(
      t,
      "audio"
    );
    return i.style.display = "none", i.ariaLabel = (n = this.buttons.language) == null ? void 0 : n.title, this.createSVGElement(i, "audio", this.buttons.languageOff, s), i.addEventListener("click", (r) => {
      r.stopPropagation(), this.player.emit("hide-tooltip"), this.languageMenuOpen ? this.player.emit("show-menu", !1) : this.player.emit("show-language-menu", !0);
    }), this.player.on("audio", (r) => {
      r.tracks.length > 1 ? i.style.display = "flex" : i.style.display = "none";
    }), this.player.on("pip-internal", (r) => {
      r ? i.style.display = "none" : this.player.hasAudioTracks() && (i.style.display = "flex");
    }), t.appendChild(i), i;
  }
  createQualityButton(t, s = !1) {
    const i = this.createUiButton(
      t,
      "quality"
    );
    i.style.display = "none";
    const n = this.createSVGElement(i, "low", this.buttons.quality, s), r = this.createSVGElement(i, "high", this.buttons.quality, !0, s);
    return i.addEventListener("click", (o) => {
      o.stopPropagation(), this.player.emit("hide-tooltip"), this.qualityMenuOpen ? this.player.emit("show-menu", !1) : this.player.emit("show-quality-menu", !0), this.player.highQuality ? (this.player.highQuality = !1, r.style.display = "none", n.style.display = "flex") : (this.player.highQuality = !0, n.style.display = "none", r.style.display = "flex");
    }), this.player.on("playing", () => {
      this.player.hasQualities() ? i.style.display = "flex" : i.style.display = "none";
    }), this.player.on("pip-internal", (o) => {
      o ? i.style.display = "none" : this.player.hasQualities() && (i.style.display = "flex");
    }), t.appendChild(i), i;
  }
  createTheaterButton(t, s = !1) {
    if (this.player.isMobile() || !this.player.hasTheaterEventHandler)
      return;
    const i = this.createUiButton(
      t,
      "theater"
    );
    return this.createSVGElement(i, "theater", this.buttons.theater, s), this.createSVGElement(i, "theater-enabled", this.buttons.theaterExit, !0, s), i.addEventListener("click", (n) => {
      n.stopPropagation(), this.player.emit("hide-tooltip"), this.theaterModeEnabled ? (this.theaterModeEnabled = !1, i.querySelector(".theater-enabled-icon").style.display = "none", i.querySelector(".theater-icon").style.display = "flex", this.player.emit("theaterMode", !1), this.player.emit("resize")) : (this.theaterModeEnabled = !0, i.querySelector(".theater-icon").style.display = "none", i.querySelector(".theater-enabled-icon").style.display = "flex", this.player.emit("theaterMode", !0), this.player.emit("resize"));
    }), this.player.on("fullscreen", () => {
      this.player.getFullscreen() ? i.style.display = "none" : i.style.display = "flex";
    }), this.player.on("pip-internal", (n) => {
      n ? i.style.display = "none" : i.style.display = "flex";
    }), t.appendChild(i), i;
  }
  createFullscreenButton(t, s = !1) {
    const i = this.createUiButton(
      t,
      "fullscreen"
    );
    return this.createSVGElement(i, "fullscreen-enabled", this.buttons.exitFullscreen, !0, s), this.createSVGElement(i, "fullscreen", this.buttons.fullscreen, s), i.addEventListener("click", (n) => {
      n.stopPropagation(), this.player.toggleFullscreen(), this.player.emit("hide-tooltip");
    }), this.player.on("fullscreen", (n) => {
      n ? (i.querySelector(".fullscreen-icon").style.display = "none", i.querySelector(".fullscreen-enabled-icon").style.display = "flex") : (i.querySelector(".fullscreen-enabled-icon").style.display = "none", i.querySelector(".fullscreen-icon").style.display = "flex");
    }), this.player.on("pip-internal", (n) => {
      n ? i.style.display = "none" : i.style.display = "flex";
    }), t.appendChild(i), i;
  }
  createPlaylistsButton(t, s = !1) {
    const i = this.createUiButton(
      t,
      "playlist"
    );
    return i.style.display = "none", this.createSVGElement(i, "playlist", this.buttons.playlist, s), i.addEventListener("click", (n) => {
      n.stopPropagation(), this.player.emit("hide-tooltip"), this.playlistMenuOpen ? this.player.emit("show-menu", !1) : (this.player.emit("show-playlist-menu", !0), this.player.emit("switch-season", this.player.playlistItem().season), setTimeout(() => {
        var r;
        (r = document.querySelector(`playlist-${this.player.playlistItem().id}`)) == null || r.scrollIntoView({ block: "center" });
      }, 100));
    }), this.player.on("playlistItem", () => {
      this.player.hasPlaylists() ? i.style.display = "flex" : i.style.display = "none";
    }), this.player.on("pip-internal", (n) => {
      n ? i.style.display = "none" : this.player.hasPlaylists() && (i.style.display = "flex");
    }), t.appendChild(i), i;
  }
  createSpeedButton(t, s = !1) {
    if (this.player.isMobile())
      return;
    const i = this.createUiButton(
      t,
      "speed"
    );
    return this.player.hasSpeeds() ? i.style.display = "flex" : i.style.display = "none", this.createSVGElement(i, "speed", this.buttons.speed, s), i.addEventListener("click", (n) => {
      n.stopPropagation(), this.player.emit("hide-tooltip"), this.speedMenuOpen ? this.player.emit("show-menu", !1) : this.player.emit("show-speed-menu", !0);
    }), this.player.on("pip-internal", (n) => {
      n ? i.style.display = "none" : this.player.hasSpeeds() && (i.style.display = "flex");
    }), t.appendChild(i), i;
  }
  createPIPButton(t, s = !1) {
    var n;
    if (this.player.isMobile() || !this.player.hasPipEventHandler)
      return;
    const i = this.createUiButton(
      t,
      "pip"
    );
    return this.player.hasPIP() ? i.style.display = "flex" : i.style.display = "none", i.ariaLabel = (n = this.buttons.pipEnter) == null ? void 0 : n.title, this.createSVGElement(i, "pip-enter", this.buttons.pipEnter, s), this.createSVGElement(i, "pip-exit", this.buttons.pipExit, !0, s), document.addEventListener("visibilitychange", () => {
      this.pipEnabled && (document.hidden ? document.pictureInPictureEnabled && this.player.getVideoElement().requestPictureInPicture() : document.pictureInPictureElement && document.exitPictureInPicture());
    }), i.addEventListener("click", (r) => {
      var o, l;
      r.stopPropagation(), this.player.emit("hide-tooltip"), this.player.emit("controls", !1), this.pipEnabled ? (this.pipEnabled = !1, i.querySelector(".pip-exit-icon").style.display = "none", i.querySelector(".pip-enter-icon").style.display = "flex", i.ariaLabel = (o = this.buttons.pipEnter) == null ? void 0 : o.title, this.player.emit("pip-internal", !1), this.player.emit("pip", !1)) : (this.pipEnabled = !0, i.querySelector(".pip-enter-icon").style.display = "none", i.querySelector(".pip-exit-icon").style.display = "flex", i.ariaLabel = (l = this.buttons.pipExit) == null ? void 0 : l.title, this.player.emit("pip-internal", !0), this.player.emit("pip", !0), this.player.emit("show-menu", !1));
    }), this.player.on("fullscreen", () => {
      this.player.getFullscreen() ? i.style.display = "none" : i.style.display = "flex";
    }), t.appendChild(i), i;
  }
  createMenuFrame(t) {
    const s = this.player.createElement("div", "menu-frame").addClasses(this.makeStyles("menuFrameStyles")).appendTo(t), i = this.player.createElement("div", "menu-content").addClasses(this.makeStyles("menuContentStyles")).appendTo(s);
    return i.style.maxHeight = `${this.player.getElement().getBoundingClientRect().height - 80}px`, this.player.on("resize", () => {
      this.createCalcMenu(i);
    }), this.player.on("fullscreen", () => {
      this.createCalcMenu(i);
    }), this.player.on("show-menu", (n) => {
      this.menuOpen = n, this.player.lockActive = n, n ? (s.style.display = "flex", s.classList.add("open")) : (s.style.display = "none", s.classList.remove("open")), i.classList.add("nm-translate-x-0"), i.classList.remove("-nm-translate-x-[50%]"), this.player.emit("show-language-menu", !1), this.player.emit("show-subtitles-menu", !1), this.player.emit("show-quality-menu", !1), this.player.emit("show-speed-menu", !1), this.player.emit("show-playlist-menu", !1);
    }), this.player.on("show-main-menu", (n) => {
      this.mainMenuOpen = n, this.player.lockActive = n, n && (s.classList.add("open"), this.player.emit("show-language-menu", !1), this.player.emit("show-subtitles-menu", !1), this.player.emit("show-quality-menu", !1), this.player.emit("show-speed-menu", !1), this.player.emit("show-playlist-menu", !1), i.classList.add("nm-translate-x-0"), i.classList.remove("-nm-translate-x-[50%]"), s.style.display = "flex");
    }), this.player.on("show-language-menu", (n) => {
      this.languageMenuOpen = n, this.player.lockActive = n, n && (s.classList.add("open"), this.player.emit("show-main-menu", !1), this.player.emit("show-subtitles-menu", !1), this.player.emit("show-quality-menu", !1), this.player.emit("show-speed-menu", !1), this.player.emit("show-playlist-menu", !1), i.classList.remove("nm-translate-x-0"), i.classList.add("-nm-translate-x-[50%]"), s.style.display = "flex");
    }), this.player.on("show-subtitles-menu", (n) => {
      this.subtitlesMenuOpen = n, this.player.lockActive = n, n && (s.classList.add("open"), this.player.emit("show-main-menu", !1), this.player.emit("show-language-menu", !1), this.player.emit("show-quality-menu", !1), this.player.emit("show-speed-menu", !1), this.player.emit("show-playlist-menu", !1), i.classList.remove("nm-translate-x-0"), i.classList.add("-nm-translate-x-[50%]"), s.style.display = "flex");
    }), this.player.on("show-quality-menu", (n) => {
      this.qualityMenuOpen = n, this.player.lockActive = n, n && (s.classList.add("open"), this.player.emit("show-main-menu", !1), this.player.emit("show-language-menu", !1), this.player.emit("show-subtitles-menu", !1), this.player.emit("show-speed-menu", !1), this.player.emit("show-playlist-menu", !1), i.classList.remove("nm-translate-x-0"), i.classList.add("-nm-translate-x-[50%]"), s.style.display = "flex");
    }), this.player.on("show-speed-menu", (n) => {
      this.speedMenuOpen = n, this.player.lockActive = n, n && (s.classList.add("open"), this.player.emit("show-main-menu", !1), this.player.emit("show-language-menu", !1), this.player.emit("show-subtitles-menu", !1), this.player.emit("show-quality-menu", !1), this.player.emit("show-playlist-menu", !1), i.classList.remove("nm-translate-x-0"), i.classList.add("-nm-translate-x-[50%]"), s.style.display = "flex");
    }), this.player.on("show-playlist-menu", (n) => {
      this.createCalcMenu(i), this.playlistMenuOpen = n, this.player.lockActive = n, n ? (s.classList.add("open"), this.player.emit("show-main-menu", !1), this.player.emit("show-language-menu", !1), this.player.emit("show-subtitles-menu", !1), this.player.emit("show-quality-menu", !1), this.player.emit("show-speed-menu", !1), i.classList.remove("nm-translate-x-0"), i.classList.add("-nm-translate-x-[50%]"), s.style.display = "flex", s.style.width = "96%") : s.style.width = "";
    }), this.player.on("controls", (n) => {
      this.player.lockActive = n, n || (this.player.emit("show-menu", !1), this.player.emit("show-main-menu", !1), this.player.emit("show-language-menu", !1), this.player.emit("show-subtitles-menu", !1), this.player.emit("show-quality-menu", !1), this.player.emit("show-speed-menu", !1), this.player.emit("show-playlist-menu", !1));
    }), i;
  }
  createCalcMenu(t) {
    this.player.getElement() && setTimeout(() => {
      var s;
      t.style.maxHeight = `${((s = this.player.getElement()) == null ? void 0 : s.getBoundingClientRect().height) - 80}px`, this.player.emit("hide-tooltip");
    }, 0);
  }
  createMainMenu(t) {
    const s = this.player.createElement("div", "main-menu").addClasses(this.makeStyles("mainMenuStyles")).appendTo(t);
    return s.style.transform = "translateX(0)", this.player.addClasses(s, this.makeStyles("mainMenuStyles")), this.createMenuButton(s, "language"), this.createMenuButton(s, "subtitles"), this.createMenuButton(s, "quality"), this.createMenuButton(s, "speed"), this.createMenuButton(s, "playlist"), this.createSubMenu(t), s;
  }
  createSubMenu(t) {
    const s = this.player.createElement("div", "sub-menu").addClasses(this.makeStyles("subMenuStyles")).appendTo(t);
    return s.style.transform = "translateX(0)", this.createLanguageMenu(s), this.createSubtitleMenu(s), this.createQualityMenu(s), this.createSpeedMenu(s), this.player.once("playlist", () => {
      this.createEpisodeMenu(s);
    }), s;
  }
  createMenuHeader(t, s, i = !1) {
    const n = this.player.createElement("div", "menu-header").addClasses(this.makeStyles("menuHeaderStyles")).appendTo(t);
    if (s !== "Episodes") {
      const o = this.createUiButton(
        n,
        "back"
      );
      this.createSVGElement(o, "menu", this.buttons.chevronL, i), this.player.addClasses(o, ["nm-w-8"]), o.classList.remove("nm-w-5"), o.addEventListener("click", (l) => {
        l.stopPropagation(), this.player.emit("show-main-menu", !0), this.player.emit("show-language-menu", !1), this.player.emit("show-subtitles-menu", !1), this.player.emit("show-quality-menu", !1), this.player.emit("show-speed-menu", !1), this.player.emit("show-playlist-menu", !1);
      });
    }
    const r = this.player.createElement("span", "menu-button-text").addClasses(this.makeStyles("menuHeaderButtonTextStyles")).appendTo(n);
    if (r.textContent = this.player.localize(s).toTitleCase(), s !== "Seasons") {
      const o = this.createUiButton(
        n,
        "close"
      );
      this.createSVGElement(o, "menu", this.buttons.close, i), this.player.addClasses(o, ["nm-ml-auto", "nm-w-8"]), o.classList.remove("nm-w-5"), o.addEventListener("click", (l) => {
        l.stopPropagation(), this.player.emit("show-menu", !1), this.player.lockActive = !1, this.player.emit("controls", !1);
      });
    }
    return n;
  }
  createMenuButton(t, s, i = !1) {
    const n = this.player.createElement("button", `menu-button-${s}`).addClasses(this.makeStyles("menuButtonStyles")).appendTo(t);
    s !== "speed" ? n.style.display = "none" : this.player.hasSpeeds() ? n.style.display = "flex" : n.style.display = "none", this.createSVGElement(n, "menu", this.buttons[s], i);
    const r = this.player.createElement("span", `menu-button-${s}`).addClasses(this.makeStyles("menuButtonTextStyles")).appendTo(n);
    r.textContent = this.player.localize(s).toTitleCase();
    const o = this.createSVGElement(n, "menu", this.buttons.chevronR, i);
    this.player.addClasses(o, ["nm-ml-auto"]), n.addEventListener("click", (l) => {
      l.stopPropagation(), this.player.emit(`show-${s}-menu`, !0);
    }), s === "language" ? this.player.on("audio", () => {
      this.player.getAudioTracks().length > 1 ? n.style.display = "flex" : n.style.display = "none";
    }) : s === "subtitles" ? this.player.on("captions", () => {
      this.player.getTextTracks().length > 0 ? n.style.display = "flex" : n.style.display = "none";
    }) : s === "quality" ? this.player.on("quality", () => {
      this.player.getQualities().length > 1 ? n.style.display = "flex" : n.style.display = "none";
    }) : s === "playlist" && this.player.once("playlistItem", () => {
      this.player.getPlaylist().length > 1 ? n.style.display = "flex" : n.style.display = "none";
    });
  }
  createLanguageMenu(t) {
    const s = this.player.createElement("div", "language-menu").addClasses(this.makeStyles("subMenuContentStyles")).appendTo(t);
    this.player.addClasses(s, ["nm-max-h-96"]), this.createMenuHeader(s, "Language");
    const i = this.player.createElement("div", "language-scroll-container").addClasses(this.makeStyles("scrollContainerStyles")).appendTo(s);
    return i.style.transform = "translateX(0)", this.player.on("audio", (n) => {
      var r;
      i.innerHTML = "";
      for (const [o, l] of ((r = n.tracks) == null ? void 0 : r.entries()) ?? [])
        this.player.createLanguageMenuButton(i, {
          language: l.language,
          label: l.name ?? l.label,
          type: "audio",
          index: l.hlsjsIndex ?? o
        });
    }), this.player.on("show-language-menu", (n) => {
      n ? s.style.display = "flex" : s.style.display = "none";
    }), s;
  }
  createSubtitleMenu(t) {
    const s = this.player.createElement("div", "subtitle-menu").addClasses(this.makeStyles("subMenuContentStyles")).appendTo(t);
    this.player.addClasses(s, ["nm-max-h-96"]), this.createMenuHeader(s, "subtitles");
    const i = this.player.createElement("div", "subtitle-scroll-container").addClasses(this.makeStyles("scrollContainerStyles")).appendTo(s);
    return i.style.transform = "translateX(0)", this.player.on("captions", (n) => {
      i.innerHTML = "";
      for (const [r, o] of n.tracks.entries() ?? [])
        this.player.createLanguageMenuButton(i, {
          language: o.language,
          label: o.label,
          type: "subtitle",
          index: r - 1
        });
    }), this.player.on("show-subtitles-menu", (n) => {
      n ? s.style.display = "flex" : s.style.display = "none";
    }), s;
  }
  createSpeedMenu(t, s = !1) {
    const i = this.player.createElement("div", "speed-menu").addClasses(this.makeStyles("subMenuContentStyles")).appendTo(t);
    this.player.addClasses(i, ["nm-max-h-96"]), this.createMenuHeader(i, "speed");
    const n = this.player.createElement("div", "speed-scroll-container").addClasses(this.makeStyles("scrollContainerStyles")).appendTo(i);
    n.style.transform = "translateX(0)";
    for (const r of this.player.getSpeeds() ?? []) {
      const o = document.createElement("div");
      o.id = `speed-button-${r}`, this.player.addClasses(o, this.makeStyles("menuButtonStyles"));
      const l = document.createElement("div");
      o.append(l);
      const c = document.createElement("span");
      c.classList.add("menu-button-text"), this.player.addClasses(c, this.makeStyles("speedButtonTextStyles")), c.textContent = r == 1 ? this.player.localize("Normal") : r.toString(), o.append(c);
      const h = this.createSVGElement(o, "menu", this.buttons.checkmark, s);
      this.player.addClasses(h, [
        "nm-ml-auto",
        "nm-hidden"
      ]), this.player.on("speed", (u) => {
        u === r ? h.classList.remove("nm-hidden") : h.classList.add("nm-hidden");
      }), o.addEventListener("click", () => {
        this.player.emit("show-menu", !1), this.player.setSpeed(r);
      }), n.append(o);
    }
    return this.player.on("show-speed-menu", (r) => {
      r ? i.style.display = "flex" : i.style.display = "none";
    }), i;
  }
  createQualityMenu(t) {
    const s = this.player.createElement("div", "quality-menu").addClasses(this.makeStyles("subMenuContentStyles")).appendTo(t);
    this.player.addClasses(s, ["nm-max-h-96"]), this.createMenuHeader(s, "quality");
    const i = this.player.createElement("div", "quality-scroll-container").addClasses(this.makeStyles("scrollContainerStyles")).appendTo(s);
    return i.style.transform = "translateX(0)", this.player.on("quality", (n) => {
      if (n) {
        i.innerHTML = "";
        for (const [r, o] of Object.entries(n) ?? [])
          this.player.createQualityMenuButton(i, {
            index: parseInt(r, 10),
            width: o.width,
            height: o.height,
            label: o.label,
            bitrate: o.bitrate
          });
      }
    }), this.player.on("show-quality-menu", (n) => {
      n ? s.style.display = "flex" : s.style.display = "none";
    }), s;
  }
  createQualityMenuButton(t, s, i = !1) {
    var l;
    const n = this.player.createElement("button", `quality-button-${s.height}-${s.bitrate}`).addClasses(this.makeStyles("languageButtonStyles")).appendTo(t), r = this.player.createElement("span", "menu-button-text").addClasses(this.makeStyles("menuButtonTextStyles")).appendTo(n);
    r.textContent = `${this.player.localize((l = s.label) == null ? void 0 : l.replace("segment-metadata", "Off"))}`;
    const o = this.createSVGElement(n, "checkmark", this.buttons.checkmark, i);
    return this.player.addClasses(o, ["nm-ml-auto"]), s.index > 0 && o.classList.add("nm-hidden"), this.player.on("quality-change", (c) => {
      c == s.index ? o.classList.remove("nm-hidden") : o.classList.add("nm-hidden");
    }), n.addEventListener("click", (c) => {
      c.stopPropagation(), this.player.setQualityLevel(s.index), this.player.emit("show-menu", !1);
    }), n;
  }
  createLanguageMenuButton(t, s, i = !1) {
    var l;
    const n = this.player.createElement("button", `${s.type}-button-${s.language}`).addClasses(this.makeStyles("languageButtonStyles")).appendTo(t), r = this.player.createElement("span", "menu-button-text").addClasses(this.makeStyles("menuButtonTextStyles")).appendTo(n);
    s.type == "subtitle" ? s.label == "segment-metadata" ? r.textContent = `${this.player.localize("Off")}` : s.styled ? r.textContent = `${this.player.localize(s.language ?? "")} ${this.player.localize(s.label)} ${this.player.localize("styled")}` : r.textContent = `${s.language == "off" ? "" : this.player.localize(s.language ?? "")} ${this.player.localize(s.label)}` : s.type == "audio" && (r.textContent = `${this.player.localize((l = s.language ?? s.label) == null ? void 0 : l.replace("segment-metadata", "Off"))}`);
    const o = this.createSVGElement(n, "checkmark", this.buttons.checkmark, i);
    return this.player.addClasses(o, ["nm-ml-auto"]), s.index > 0 && o.classList.add("nm-hidden"), s.type == "audio" ? this.player.on("audio-change", (c) => {
      c.currentTrack == s.index ? o.classList.remove("nm-hidden") : o.classList.add("nm-hidden");
    }) : s.type == "subtitle" && this.player.on("caption-change", (c) => {
      let h = s.index, u = c.track;
      h += 1, c.track == -1 && (u = 0), u == h ? o.classList.remove("nm-hidden") : o.classList.add("nm-hidden");
    }), n.addEventListener("click", (c) => {
      var h;
      c.stopPropagation(), s.type == "audio" ? this.player.setAudioTrack(s.index) : s.type == "subtitle" && ((h = this.player.getCurrentSrc()) != null && h.endsWith(".mp4") ? this.player.setCurrentCaption(s.index - 1) : this.player.setCurrentCaption(s.index)), this.player.emit("show-menu", !1);
    }), n.addEventListener("keyup", (c) => {
      var h, u, d, f;
      c.key == "ArrowLeft" ? (h = this.player.getClosestElement(n, '[id^="audio-button-"]')) == null || h.focus() : c.key == "ArrowRight" ? (u = this.player.getClosestElement(n, '[id^="subtitle-button-"]')) == null || u.focus() : c.key == "ArrowUp" && !this.player.options.disableTouchControls ? (d = n.previousElementSibling) == null || d.focus() : c.key == "ArrowDown" && !this.player.options.disableTouchControls && ((f = n.nextElementSibling) == null || f.focus());
    }), n;
  }
  createSeekRipple(t, s) {
    const i = this.player.createElement("div", "seek-ripple").addClasses(["seek-ripple", s]).appendTo(t), n = this.player.createElement("div", "seek-ripple-arrow").addClasses(["seek-ripple-arrow"]).appendTo(i), r = this.player.createElement("p", "seek-ripple-text").addClasses(["seek-ripple-text"]).appendTo(i);
    return s == "left" ? (i.style.borderRadius = "0 50% 50% 0", i.style.left = "0px", n.innerHTML = `
				<div class="arrow arrow2 arrow-left"></div>
				<div class="arrow arrow1 arrow-left"></div>
				<div class="arrow arrow3 arrow-left"></div>
			`, this.player.on("rewind", (o) => {
      r.textContent = `${Math.abs(o)} ${this.player.localize("seconds")}`, i.style.display = "flex";
    }), this.player.on("remove-rewind", () => {
      i.style.display = "none";
    })) : s == "right" && (i.style.borderRadius = "50% 0 0 50%", i.style.right = "0px", n.innerHTML = `
				<div class="arrow arrow3 arrow-right"></div>
				<div class="arrow arrow1 arrow-right"></div>
				<div class="arrow arrow2 arrow-right"></div>
			`, this.player.on("forward", (o) => {
      r.textContent = `${Math.abs(o)} ${this.player.localize("seconds")}`, i.style.display = "flex";
    }), this.player.on("remove-forward", () => {
      i.style.display = "none";
    })), i;
  }
  createProgressBar(t) {
    var h;
    this.sliderBar = this.player.createElement("div", "slider-bar").addClasses(this.makeStyles("sliderBarStyles")).appendTo(t);
    const s = this.player.createElement("div", "slider-buffer").addClasses(this.makeStyles("sliderBufferStyles")).appendTo(this.sliderBar), i = this.player.createElement("div", "slider-hover").addClasses(this.makeStyles("sliderHoverStyles")).appendTo(this.sliderBar), n = this.player.createElement("div", "slider-progress").addClasses(this.makeStyles("sliderProgressStyles")).appendTo(this.sliderBar);
    this.chapterBar = this.player.createElement("div", "chapter-progress").addClasses(this.makeStyles("chapterBarStyles")).appendTo(this.sliderBar);
    const r = document.createElement("div");
    this.player.addClasses(r, this.makeStyles("sliderNippleStyles")), r.id = "slider-nipple", this.player.options.nipple != !1 && this.sliderBar.append(r);
    const o = this.player.createElement("div", "slider-pop").addClasses(this.makeStyles("sliderPopStyles")).appendTo(this.sliderBar);
    o.style.setProperty("--visibility", "0"), o.style.opacity = "var(--visibility)", this.sliderPopImage = this.player.createElement("div", "slider-pop-image").addClasses(this.makeStyles("sliderPopImageStyles")).appendTo(o);
    const l = this.player.createElement("div", "slider-text").addClasses(this.makeStyles("sliderTextStyles")).appendTo(o), c = this.player.createElement("div", "chapter-text").addClasses(this.makeStyles("chapterTextStyles")).appendTo(o);
    return this.player.options.chapters && !this.player.isTv() && ((h = this.player.getChapters()) == null ? void 0 : h.length) > 0 && (this.sliderBar.style.background = "transparent"), ["mousedown", "touchstart"].forEach((u) => {
      this.sliderBar.addEventListener(u, () => {
        this.isMouseDown || (this.isMouseDown = !0, this.isScrubbing = !0);
      }, {
        passive: !0
      });
    }), this.bottomBar.addEventListener("click", (u) => {
      if (this.player.emit("hide-tooltip"), !this.isMouseDown)
        return;
      this.isMouseDown = !1, this.isScrubbing = !1, o.style.setProperty("--visibility", "0");
      const d = this.getScrubTime(u);
      r.style.left = `${d.scrubTime}%`, this.player.seek(d.scrubTimePlayer);
    }, {
      passive: !0
    }), ["mousemove", "touchmove"].forEach((u) => {
      this.sliderBar.addEventListener(u, (d) => {
        var p;
        const f = this.getScrubTime(d);
        this.getSliderPopImage(f), l.textContent = be(f.scrubTimePlayer);
        const m = this.getSliderPopOffsetX(o, f);
        o.style.left = `${m}%`, (!this.player.options.chapters || ((p = this.player.getChapters()) == null ? void 0 : p.length) == 0) && (i.style.width = `${f.scrubTime}%`), this.isMouseDown && (c.textContent = this.getChapterText(f.scrubTimePlayer), r.style.left = `${f.scrubTime}%`, this.previewTime.length > 0 && o.style.setProperty("--visibility", "1"));
      }, {
        passive: !0
      });
    }), this.sliderBar.addEventListener("mouseover", (u) => {
      const d = this.getScrubTime(u);
      if (this.getSliderPopImage(d), l.textContent = be(d.scrubTimePlayer), c.textContent = this.getChapterText(d.scrubTimePlayer), this.previewTime.length > 0) {
        o.style.setProperty("--visibility", "1");
        const f = this.getSliderPopOffsetX(o, d);
        o.style.left = `${f}%`;
      }
    }, {
      passive: !0
    }), this.sliderBar.addEventListener("mouseleave", () => {
      o.style.setProperty("--visibility", "0"), i.style.width = "0";
    }, {
      passive: !0
    }), this.player.on("seeked", () => {
      o.style.setProperty("--visibility", "0");
    }), this.player.on("playlistItem", () => {
      this.sliderBar.classList.add("nm-bg-white/20"), this.previewTime = [], this.chapters = [], s.style.width = "0", n.style.width = "0", this.fetchPreviewTime();
    }), this.player.on("chapters", () => {
      var u;
      ((u = this.player.getChapters()) == null ? void 0 : u.length) > 0 && !this.player.isTv() ? this.sliderBar.classList.remove("nm-bg-white/20") : this.sliderBar.classList.add("nm-bg-white/20");
    }), this.player.on("time", (u) => {
      var d;
      ((d = this.player.getChapters()) == null ? void 0 : d.length) == 0 && (s.style.width = `${u.buffered}%`, n.style.width = `${u.percentage}%`), this.isScrubbing || (r.style.left = `${u.percentage}%`);
    }), this.player.on("controls", (u) => {
      u || o.style.setProperty("--visibility", "0");
    }), this.player.on("pip-internal", (u) => {
      u ? this.sliderBar.style.display = "none" : this.sliderBar.style.display = "flex";
    }), this.sliderBar;
  }
  createTvProgressBar(t) {
    this.sliderBar = this.player.createElement("div", "slider-bar").addClasses(this.makeStyles("sliderBarStyles")).appendTo(t);
    const s = this.player.createElement("div", "slider-buffer").addClasses(this.makeStyles("sliderBufferStyles")).appendTo(this.sliderBar), i = this.player.createElement("div", "slider-progress").addClasses(this.makeStyles("sliderProgressStyles")).appendTo(this.sliderBar);
    return this.chapterBar = this.player.createElement("div", "chapter-progress").addClasses(this.makeStyles("chapterBarStyles")).appendTo(this.sliderBar), this.player.on("playlistItem", () => {
      this.sliderBar.classList.add("nm-bg-white/20"), this.previewTime = [], this.chapters = [], s.style.width = "0", i.style.width = "0", this.fetchPreviewTime();
    }), this.player.on("chapters", () => {
      var n;
      ((n = this.player.getChapters()) == null ? void 0 : n.length) > 0 && !this.player.isTv() ? this.sliderBar.classList.remove("nm-bg-white/20") : this.sliderBar.classList.add("nm-bg-white/20");
    }), this.player.on("time", (n) => {
      s.style.width = `${n.buffered}%`, i.style.width = `${n.percentage}%`;
    }), this.player.on("currentScrubTime", (n) => {
      i.style.width = `${n.currentTime / n.duration * 100}%`;
    }), this.sliderBar;
  }
  getChapterText(t) {
    var i, n, r, o;
    if (this.player.getChapters().length == 0)
      return null;
    const s = (i = this.player.getChapters()) == null ? void 0 : i.findIndex((l) => l.startTime > t);
    return ((n = this.player.getChapters()[s - 1]) == null ? void 0 : n.title) ?? ((o = this.player.getChapters()[((r = this.player.getChapters()) == null ? void 0 : r.length) - 1]) == null ? void 0 : o.title) ?? null;
  }
  createChapterMarker(t) {
    const s = this.player.createElement("div", `chapter-marker-${t.id.replace(/\s/gu, "-")}`).addClasses(this.makeStyles("chapterMarkersStyles")).appendTo(this.chapterBar);
    s.style.left = `${t.left}%`, s.style.width = `calc(${t.width}% - 2px)`, this.player.createElement("div", `chapter-marker-bg-${t.id.replace(/\s/gu, "-")}`).addClasses(this.makeStyles("chapterMarkerBGStyles")).appendTo(s);
    const i = this.player.createElement("div", `chapter-marker-buffer-${t.id.replace(/\s/gu, "-")}`).addClasses(this.makeStyles("chapterMarkerBufferStyles")).appendTo(s), n = this.player.createElement("div", `chapter-marker-hover-${t.id.replace(/\s/gu, "-")}`).addClasses(this.makeStyles("chapterMarkerHoverStyles")).appendTo(s), r = this.player.createElement("div", `chapter-marker-progress-${t.id.replace(/\s/gu, "-")}`).addClasses(this.makeStyles("chapterMarkerProgressStyles")).appendTo(s), o = t.left, l = t.left + t.width;
    return this.player.on("time", (c) => {
      c.percentage < o ? r.style.transform = "scaleX(0)" : c.percentage > l ? r.style.transform = "scaleX(1)" : r.style.transform = `scaleX(${(c.percentage - o) / (l - o)})`, c.buffered < o ? i.style.transform = "scaleX(0)" : c.buffered > l ? i.style.transform = "scaleX(1)" : i.style.transform = `scaleX(${(c.buffered - o) / (l - o)})`;
    }), ["mousemove", "touchmove"].forEach((c) => {
      this.chapterBar.addEventListener(c, (h) => {
        const { scrubTime: u } = this.getScrubTime(h);
        u < o ? n.style.transform = "scaleX(0)" : u > l ? n.style.transform = "scaleX(1)" : n.style.transform = `scaleX(${(u - o) / (l - o)})`;
      });
    }), this.chapterBar.addEventListener("mouseleave", () => {
      n.style.transform = "scaleX(0)";
    }), s;
  }
  createChapterMarkers() {
    var t;
    this.player.isTv() || (this.chapterBar.style.background = "transparent", this.player.on("playlistItem", () => {
      this.chapterBar.style.background = "";
    }), this.chapterBar.querySelectorAll(".chapter-marker").forEach((s) => {
      this.chapterBar.classList.add("nm-bg-white/20"), s.remove();
    }), (t = this.player.getChapters()) == null || t.forEach((s) => {
      this.player.createChapterMarker(s);
    }));
  }
  getSliderPopOffsetX(t, s) {
    const i = this.sliderBar.getBoundingClientRect(), r = t.getBoundingClientRect().width * 0.5 / i.width * 100;
    let o = s.scrubTime;
    return o <= r && (o = r), o >= 100 - r && (o = 100 - r), o;
  }
  createThumbnail(t) {
    return this.thumbnail = this.player.createElement("div", `thumbnail-${t.start}`).addClasses(this.makeStyles("thumbnailStyles")).get(), this.thumbnail.style.backgroundImage = this.image, this.thumbnail.style.backgroundPosition = `-${t.x}px -${t.y}px`, this.thumbnail.style.width = `${t.w}px`, this.thumbnail.style.minWidth = `${t.w}px`, this.thumbnail.style.height = `${t.h}px`, this.thumbnail;
  }
  getSliderPopImage(t) {
    const s = this.loadSliderPopImage(t);
    s && (this.sliderPopImage.style.backgroundPosition = `-${s.x}px -${s.y}px`, this.sliderPopImage.style.width = `${s.w}px`, this.sliderPopImage.style.height = `${s.h}px`);
  }
  adjustScaling(t, s) {
    const i = t % s;
    return i % 1 !== 0 && (t /= i / Math.round(i)), i > 1 && (t *= i), t;
  }
  fetchPreviewTime() {
    if (this.previewTime.length === 0) {
      const t = this.player.getSpriteFile(), s = new Image();
      this.player.once("playlistItem", () => {
        s.remove();
      }), t && (this.player.options.accessToken ? this.player.getFileContents({
        url: t,
        options: {
          type: "blob"
        },
        callback: (n) => {
          const r = URL.createObjectURL(n);
          s.src = r, this.player.isTv() ? this.image = `url('${r}')` : this.sliderPopImage.style.backgroundImage = `url('${r}')`, this.player.once("playlistItem", () => {
            URL.revokeObjectURL(r);
          }), setTimeout(() => {
            this.player.emit("preview-time", this.previewTime);
          }, 500);
        }
      }).then() : (this.player.isTv() ? this.image = `url('${t}')` : this.sliderPopImage.style.backgroundImage = `url('${t}')`, s.src = t, setTimeout(() => {
        this.player.emit("preview-time", this.previewTime);
      }, 500)));
      const i = this.player.getTimeFile();
      i && this.currentTimeFile !== i && (this.player.currentTimeFile = i, s.onload = () => {
        this.player.getFileContents({
          url: i,
          options: {
            type: "text"
          },
          callback: (n) => {
            const o = new Bt.WebVTTParser().parse(n, "metadata"), l = /(?<x>\d*),(?<y>\d*),(?<w>\d*),(?<h>\d*)/u;
            this.previewTime = [], o.cues.forEach((c) => {
              const h = l.exec(c.text);
              if (!(h != null && h.groups))
                return;
              const { x: u, y: d, w: f, h: m } = h.groups, [p, g, v, C] = [u, d, f, m].map((E) => parseInt(E, 10));
              this.previewTime.push({
                start: c.startTime,
                end: c.endTime,
                x: p,
                y: g,
                w: v,
                h: C
              });
            }), setTimeout(() => {
              this.player.emit("preview-time", this.previewTime);
            }, 500);
          }
        }).then(() => {
          this.loadSliderPopImage(0);
        });
      });
    }
  }
  loadSliderPopImage(t) {
    this.fetchPreviewTime();
    let s = this.previewTime.find(
      (i) => t.scrubTimePlayer >= i.start && t.scrubTimePlayer < i.end
    );
    return s || (s = this.previewTime.at(-1)), s;
  }
  getScrubTime(t, s = this.sliderBar) {
    var o, l, c, h;
    const i = s.getBoundingClientRect();
    let r = (t.clientX ?? ((l = (o = t.touches) == null ? void 0 : o[0]) == null ? void 0 : l.clientX) ?? ((h = (c = t.changedTouches) == null ? void 0 : c[0]) == null ? void 0 : h.clientX) ?? 0) - i.left;
    return r <= 0 && (r = 0), r >= i.width && (r = i.width), {
      scrubTime: r / s.offsetWidth * 100,
      scrubTimePlayer: r / s.offsetWidth * this.player.getDuration()
    };
  }
  createOverlayCenterMessage(t) {
    const s = this.player.createElement("button", "player-message").addClasses(this.makeStyles("playerMessageStyles")).appendTo(t);
    return this.player.on("display-message", (i) => {
      s.style.display = "flex", s.textContent = i;
    }), this.player.on("remove-message", () => {
      s.style.display = "none", s.textContent = "";
    }), s;
  }
  createEpisodeMenu(t) {
    const s = this.player.createElement("div", "playlist-menu").addClasses([
      ...this.makeStyles("subMenuContentStyles"),
      "!nm-flex-row",
      "!nm-gap-0"
    ]).appendTo(t);
    s.style.minHeight = `${parseInt(getComputedStyle(this.player.getVideoElement()).height.split("px")[0], 10) * 0.8}px`, this.player.getVideoElement().addEventListener("resize", () => {
      s.style.minHeight = `${parseInt(getComputedStyle(this.player.getVideoElement()).height.split("px")[0], 10) * 0.8}px`;
    });
    const i = this.player.createElement("div", "sub-menu").addClasses([
      ...this.makeStyles("subMenuContentStyles"),
      "!nm-flex",
      "!nm-w-1/3",
      "nm-border-r-2",
      "nm-border-gray-500/20"
    ]).appendTo(s);
    this.createMenuHeader(i, "Seasons");
    const n = this.player.createElement("div", "playlist-scroll-container").addClasses(this.makeStyles("scrollContainerStyles")).appendTo(i);
    n.style.transform = "translateX(0)", n.innerHTML = "";
    for (const [, l] of this.unique(this.player.getPlaylist(), "season").entries() ?? [])
      this.createSeasonMenuButton(n, l);
    const r = this.player.createElement("div", "episode-menu").addClasses([
      ...this.makeStyles("subMenuContentStyles"),
      "!nm-flex",
      "!nm-w/2/3"
    ]).appendTo(s);
    this.createMenuHeader(r, "Episodes");
    const o = this.player.createElement("div", "playlist-scroll-container").addClasses(this.makeStyles("scrollContainerStyles")).appendTo(r);
    o.innerHTML = "";
    for (const [l, c] of this.player.getPlaylist().entries() ?? [])
      this.createEpisodeMenuButton(o, c, l);
    return this.player.on("show-playlist-menu", (l) => {
      l ? s.style.display = "flex" : s.style.display = "none";
    }), s;
  }
  createSeasonMenuButton(t, s, i = !1) {
    var l;
    const n = this.player.createElement("button", `season-${s.id}`).addClasses(this.makeStyles("menuButtonStyles")).appendTo(t);
    ((l = this.player.playlistItem()) == null ? void 0 : l.season) === (s == null ? void 0 : s.season) ? (n.classList.add("active"), n.style.backgroundColor = "rgb(82 82 82 / 0.5)") : (n.classList.remove("active"), n.style.backgroundColor = ""), this.player.on("playlistItem", () => {
      var c;
      ((c = this.player.playlistItem()) == null ? void 0 : c.season) === (s == null ? void 0 : s.season) ? (n.classList.add("active"), n.style.backgroundColor = "rgb(82 82 82 / 0.5)") : (n.classList.remove("active"), n.style.backgroundColor = "");
    }), this.player.on("switch-season", (c) => {
      c === (s == null ? void 0 : s.season) ? (n.classList.add("active"), n.style.backgroundColor = "rgb(82 82 82 / 0.5)", n.style.outline = "2px solid fff") : (n.classList.remove("active"), n.style.backgroundColor = "", n.style.outline = "");
    });
    const r = this.player.createElement("span", `season-${s.id}-span`).addClasses(this.makeStyles("menuButtonTextStyles")).appendTo(n);
    r.innerText = s != null && s.seasonName ? s == null ? void 0 : s.seasonName : `Season ${s == null ? void 0 : s.season}`;
    const o = this.createSVGElement(n, "menu", this.buttons.chevronR, i);
    return this.player.addClasses(o, ["nm-ml-auto"]), n.addEventListener("click", () => {
      this.player.emit("switch-season", s == null ? void 0 : s.season);
    }), n;
  }
  createEpisodeMenuButton(t, s, i) {
    var v, C, E, T;
    const n = this.player.createElement("button", `playlist-${s.id}`).addClasses(this.makeStyles("playlistMenuButtonStyles")).appendTo(t);
    ((v = this.player.playlistItem()) == null ? void 0 : v.season) !== 1 && (n.style.display = "none");
    const r = this.player.createElement("div", `playlist-${s.id}-left`).addClasses(this.makeStyles("episodeMenuButtonLeftStyles")).appendTo(n);
    this.player.createElement("div", `episode-${s.id}-shadow`).addClasses(this.makeStyles("episodeMenuButtonShadowStyles")).appendTo(r);
    const o = this.player.createElement("img", `episode-${s.id}-image`).addClasses(this.makeStyles("episodeMenuButtonImageStyles")).appendTo(r);
    o.setAttribute("loading", "lazy"), o.src = s.image && s.image != "" ? `${this.imageBaseUrl}${s.image}` : "";
    const l = this.player.createElement("div", `episode-${s.id}-progress-container`).addClasses(this.makeStyles("episodeMenuProgressContainerStyles")).appendTo(r), c = this.player.createElement("div", `episode-${s.id}-progress-box`).addClasses(this.makeStyles("episodeMenuProgressBoxStyles")).appendTo(l), h = this.player.createElement("div", `episode-${s.id}-progress-item`).addClasses(this.makeStyles("progressContainerItemTextStyles")).appendTo(c);
    s.episode && (h.innerText = `${this.player.localize("E")}${s.episode}`);
    const u = this.player.createElement("div", `episode-${s.id}-progress-duration`).addClasses(this.makeStyles("progressContainerDurationTextStyles")).appendTo(c);
    u.innerText = ((C = s.duration) == null ? void 0 : C.replace(/^00:/u, "")) ?? "";
    const d = this.player.createElement("div", `episode-${s.id}-slider-container`).addClasses(this.makeStyles("sliderContainerStyles")).appendTo(l);
    d.style.display = (E = s.progress) != null && E.percentage ? "flex" : "none";
    const f = this.player.createElement("div", `episode-${s.id}-progress-bar`).addClasses(this.makeStyles("progressBarStyles")).appendTo(d);
    (T = s.progress) != null && T.percentage && (f.style.width = `${s.progress.percentage > 98 ? 100 : s.progress}%`);
    const m = this.player.createElement("div", `episode-${s.id}-right-side`).addClasses(this.makeStyles("episodeMenuButtonRightSideStyles")).appendTo(n), p = this.player.createElement("span", `episode-${s.id}-title`).addClasses(this.makeStyles("episodeMenuButtonTitleStyles")).appendTo(m);
    p.textContent = this.lineBreakShowTitle(s.title.replace(s.show, "").replace("%S", this.player.localize("S")).replace("%E", this.player.localize("E")));
    const g = this.player.createElement("span", `episode-${s.id}-overview`).addClasses(this.makeStyles("episodeMenuButtonOverviewStyles")).appendTo(m);
    return g.textContent = this.limitSentenceByCharacters(s.description, 600), this.player.on("playlistItem", () => {
      this.player.playlistItem().season == s.season ? n.style.display = "flex" : n.style.display = "none", this.player.playlistItem().season == s.season && this.player.playlistItem().episode == s.episode ? n.style.background = "rgba(255,255,255,.1)" : n.style.background = "transparent";
    }), this.player.on("switch-season", (x) => {
      x == s.season ? n.style.display = "flex" : n.style.display = "none";
    }), this.player.on("time", (x) => {
      var I;
      ((I = this.player.playlistItem()) == null ? void 0 : I.uuid) == s.uuid && (f.style.width = `${x.percentage}%`, d.style.display = "flex");
    }), s.episode && s.show && (h.innerText = s.season == null ? `${s.episode}` : `${this.player.localize("S")}${s.season}: ${this.player.localize("E")}${s.episode}`), n.addEventListener("click", () => {
      this.player.emit("show-menu", !1), s.episode && s.season ? this.setEpisode(s.season, s.episode) : this.player.playlistItem(i), this.player.emit("playlist-menu-button-clicked", s);
    }), n;
  }
  createToolTip(t) {
    return this.tooltip = this.player.createElement("div", "tooltip").addClasses(this.makeStyles("tooltipStyles")).appendTo(t), this.tooltip.style.transform = "translateX(10px)", this.tooltip.innerText = "Play (space)", this.player.on("show-tooltip", (s) => {
      this.tooltip.innerText = s.text, this.tooltip.style.display = "block", this.tooltip.style.transform = `translate(calc(${s.x} - 50%), calc(${s.y} - 100%))`, s.currentTime == "top" ? (this.tooltip.classList.add("nm-top-0"), this.tooltip.classList.remove("nm-bottom-0")) : (this.tooltip.classList.remove("nm-top-0"), this.tooltip.classList.add("nm-bottom-0"));
    }), this.player.on("hide-tooltip", () => {
      this.tooltip.style.display = "none";
    }), this.tooltip;
  }
  createEpisodeTip(t) {
    const s = this.player.createElement("div", "episode-tip").addClasses(this.makeStyles("nextTipStyles")).appendTo(t), i = this.player.createElement("div", "next-tip-left").addClasses(this.makeStyles("nextTipLeftSideStyles")).appendTo(s), n = this.player.createElement("img", "next-tip-image").addClasses(this.makeStyles("nextTipImageStyles")).appendTo(i);
    n.setAttribute("loading", "eager");
    const r = this.player.createElement("div", "next-tip-right-side").addClasses(this.makeStyles("nextTipRightSideStyles")).appendTo(s), o = this.player.createElement("span", "next-tip-header").addClasses(this.makeStyles("nextTipHeaderStyles")).appendTo(r), l = this.player.createElement("span", "next-tip-title").addClasses(this.makeStyles("nextTipTitleStyles")).appendTo(r);
    return this.player.on("show-episode-tip", (c) => {
      this.getTipData({ direction: c.direction, header: o, title: l, image: n }), s.style.display = "flex", s.style.transform = `translate(${c.x}, calc(${c.y} - 50%))`;
    }), this.player.on("hide-episode-tip", () => {
      s.style.display = "none";
    }), s;
  }
  getTipDataIndex(t) {
    let s;
    return t == "previous" ? s = this.player.playlistItem().episode ?? 0 - 1 - 1 : s = this.player.getPlaylistIndex() + 1, this.player.getPlaylist().at(s);
  }
  getTipData({ direction: t, header: s, title: i, image: n }) {
    const r = this.getTipDataIndex(t);
    r && (n.src = r.image && r.image != "" ? `${this.imageBaseUrl}${r.image}` : "", s.textContent = `${this.player.localize(`${t.toTitleCase()} Episode`)} ${this.getButtonKeyCode(t)}`, i.textContent = r.title.replace(r.show, "").replace("%S", this.player.localize("S")).replace("%E", this.player.localize("E")), this.player.once("playlistItem", () => {
      this.getTipData({ direction: t, header: s, title: i, image: n });
    }));
  }
  cancelNextUp() {
    clearTimeout(this.timeout), this.nextUp.style.display = "none";
  }
  createNextUp(t) {
    this.nextUp = this.player.createElement("div", "episode-tip").addClasses(this.makeStyles("nextUpStyles")).appendTo(t), this.nextUp.style.display = "none";
    const s = this.player.createElement("button", "next-up-credits").addClasses(this.makeStyles("nextUpCreditsButtonStyles")).appendTo(this.nextUp);
    s.innerText = this.player.localize("Watch credits");
    const i = this.player.createElement("button", "next-up-next").addClasses(this.makeStyles("nextUpNextButtonStyles")).appendTo(this.nextUp);
    i.setAttribute("data-label", this.player.localize("Next")), i.setAttribute("data-icon", "▶︎"), this.player.on("show-next-up", () => {
      this.nextUp.style.display = "flex", this.timeout = setTimeout(() => {
        this.nextUp.style.display = "none", this.player.isPlaying && this.player.next();
      }, 4200), setTimeout(() => {
        i.focus();
      }, 100);
    }), s.addEventListener("click", () => {
      clearTimeout(this.timeout), this.nextUp.style.display = "none";
    }), i.addEventListener("click", () => {
      clearTimeout(this.timeout), this.nextUp.style.display = "none", this.player.next();
    });
    let n = !1;
    return this.player.on("playlistItem", () => {
      clearTimeout(this.timeout), this.nextUp.style.display = "none", n = !1;
    }), this.player.once("playing", () => {
      this.player.on("time", (r) => {
        this.player.getDuration() > 0 && r.currentTime > this.player.getDuration() - 5 && !n && !this.player.isLastPlaylistItem() && (this.player.emit("show-next-up"), n = !0);
      });
    }), this.nextUp;
  }
  modifySpinner(t) {
    this.player.createElement("h2", "loader").addClasses(["loader", "nm-pointer-events-none"]).appendTo(t);
  }
  createSpinnerContainer(t) {
    const s = this.player.createElement("div", "spinner-container").addClasses(this.makeStyles("spinnerContainerStyles")).appendTo(t), i = this.player.createElement("div", "spinner-container").addClasses(this.makeStyles("roleStyles")).appendTo(s);
    i.setAttribute("role", "status"), this.createSpinner(i);
    const n = this.player.createElement("span", "status-text").addClasses(this.makeStyles("statusTextStyles")).appendTo(i);
    return n.innerText = this.player.localize("Loading..."), this.player.on("playing", () => {
      s.style.display = "none";
    }), this.player.on("waiting", () => {
      s.style.display = "grid", n.innerText = `${this.player.localize("Buffering")}...`;
    }), this.player.on("error", () => {
      s.style.display = "none", n.innerText = this.player.localize("Something went wrong trying to play this item");
    }), this.player.on("ended", () => {
      s.style.display = "none";
    }), this.player.on("time", () => {
      s.style.display = "none";
    }), this.player.on("bufferedEnd", () => {
      s.style.display = "none";
    }), this.player.on("stalled", () => {
      s.style.display = "grid", n.innerText = `${this.player.localize("Buffering")}...`;
    }), this.player.on("playlistItem", () => {
      s.style.display = "grid";
    }), s;
  }
  createSpinner(t) {
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 100 101"), s.id = "spinner", s.setAttribute("fill", "none"), this.player.addClasses(s, [
      "spinner-icon",
      ...this.makeStyles("spinnerStyles")
    ]), t.appendChild(s);
    const i = document.createElementNS("http://www.w3.org/2000/svg", "path");
    i.setAttribute("d", "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"), i.setAttribute("fill", "currentColor"), s.appendChild(i);
    const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
    n.setAttribute("d", "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"), n.setAttribute("fill", "currentFill"), s.appendChild(n);
  }
  getButtonKeyCode(t) {
    switch (t) {
      case "play":
      case "pause":
        return `(${this.player.localize("SPACE")})`;
      case "volumeMuted":
      case "volumeLow":
      case "volumeMedium":
      case "volumeHigh":
        return "(m)";
      case "seekBack":
        return "(<)";
      case "seekForward":
        return "(>)";
      case "next":
        return "(n)";
      case "theater":
        return "(t)";
      case "theater-enabled":
        return "(t)";
      case "pip-enter":
      case "pip-exit":
        return "(i)";
      case "playlist":
        return "";
      case "previous":
        return "(p)";
      case "speed":
        return "";
      case "subtitle":
      case "subtitled":
        return "(v)";
      case "audio":
        return "(b)";
      case "settings":
        return "";
      case "fullscreen-enable":
      case "fullscreen":
        return "(f)";
      default:
        return "";
    }
  }
  createButton(t, s, i = "after", n, r, o) {
    const l = document.querySelector(`${t}`);
    if (!l)
      throw new Error("Element not found");
    const c = this.createUiButton(l, s.replace(/\s/gu, "_"));
    return c.ariaLabel = s, i === "before" ? l == null || l.before(c) : l == null || l.after(c), this.createSVGElement(c, `${s.replace(/\s/gu, "_")}-enabled`, n, !0, !1), this.createSVGElement(c, s.replace(/\s/gu, "_"), n, !1), c.addEventListener("click", (h) => {
      h.stopPropagation(), r == null || r(), this.player.emit("hide-tooltip");
    }), c.addEventListener("contextmenu", (h) => {
      h.stopPropagation(), o == null || o(), this.player.emit("hide-tooltip");
    }), c;
  }
  nearestValue(t, s) {
    return t.reduce((i, n) => Math.abs(i) > Math.abs(n - s) ? n - s : i, 1 / 0) + s;
  }
  getClosestElement(t, s) {
    const i = [...document.querySelectorAll(s)].filter((o) => getComputedStyle(o).display == "flex"), n = t.getBoundingClientRect();
    return i.find((o) => o.getBoundingClientRect().top + o.getBoundingClientRect().height / 2 == this.nearestValue(
      i.map((l) => l.getBoundingClientRect().top + l.getBoundingClientRect().height / 2),
      n.top + n.height / 2
    ));
  }
  /**
      * Limits a sentence to a specified number of characters by truncating it at the last period before the limit.
      * @param str - The sentence to limit.
      * @param characters - The maximum number of characters to allow in the sentence.
      * @returns The truncated sentence.
      */
  limitSentenceByCharacters(t, s = 360) {
    if (!t)
      return "";
    const i = t.substring(0, s).split(".");
    return i.pop(i.length), `${i.join(".")}.`;
  }
  /**
      * Adds a line break before the episode title in a TV show string.
      * @param str - The TV show string to modify.
      * @param removeShow - Whether to remove the TV show name from the modified string.
      * @returns The modified TV show string.
      */
  lineBreakShowTitle(t, s = !1) {
    if (!t)
      return "";
    const i = t.match(/S\d{2}E\d{2}/u);
    if (i) {
      const n = t.split(/\sS\d{2}E\d{2}\s/u);
      return s ? `${i[0]} ${n[1]}` : `${n[0]} 
${i[0]} ${n[1]}`;
    }
    return t;
  }
  /**
      * Returns an array of unique objects based on a specified key.
      * @param array The array to filter.
      * @param key The key to use for uniqueness comparison.
      * @returns An array of unique objects.
      */
  unique(t, s) {
    return !t || !Array.isArray(t) ? [] : t.filter((i, n, r) => r.map((o) => o[s]).indexOf(i[s]) === n);
  }
  /**
      * Sets the current episode to play based on the given season and episode numbers.
      * If the episode is not found in the playlist, the first item in the playlist is played.
      * @param season - The season number of the episode to play.
      * @param episode - The episode number to play.
      */
  setEpisode(t, s) {
    const i = this.player.getPlaylist().findIndex((n) => n.season == t && n.episode == s);
    i == -1 ? this.player.playlistItem(0) : this.player.playlistItem(i), this.player.play();
  }
  /**
      * Breaks a logo title string into two lines by inserting a newline character after a specified set of characters.
      * @param str The logo title string to break.
      * @param characters An optional array of characters to break the string on. Defaults to [':', '!', '?'].
      * @returns The broken logo title string.
      */
  breakLogoTitle(t, s = [":", "!", "?"]) {
    if (!t)
      return "";
    if (t.split("").some((i) => s.includes(i))) {
      const i = new RegExp(s.map((r) => r == "?" ? `\\${r}` : r).join("|"), "u"), n = new RegExp(s.map((r) => r == "?" ? `\\${r}\\s` : `${r}\\s`).join("|"), "u");
      if (i && n && t.match(n))
        return t.replace(t.match(n)[0], `${t.match(i)[0]}
`);
    }
    return t;
  }
}
Ut = new WeakSet(), cr = function(t) {
  const i = t.parentElement, n = t.getBoundingClientRect().left + t.offsetWidth / 2 - i.offsetWidth / 2, r = i.scrollLeft, o = performance.now();
  function l(c) {
    const h = c - o, u = Math.min(h / 200, 1);
    i.scrollTo(r + n * u, 0), h < 200 && requestAnimationFrame(l);
  }
  requestAnimationFrame(l);
};
class nd extends ot {
  initialize(e) {
    this.player = e;
  }
  use() {
  }
}
class rd extends ot {
  initialize(e) {
    this.player = e;
  }
  use() {
  }
}
class ad extends ot {
  initialize(e) {
    this.player = e;
  }
  use() {
    this.player.options.disableControls || (document.removeEventListener("keyup", this.keyHandler.bind(this), !1), document.addEventListener("keyup", this.keyHandler.bind(this), !1));
  }
  /**
      * Handles keyboard events and executes the corresponding function based on the key binding.
      * @param {KeyboardEvent} event - The keyboard event to handle.
      */
  keyHandler(e) {
    var i;
    const t = this.keyBindings();
    let s = !1;
    this.player.getElement().getBoundingClientRect().width != 0 && (!s && this.player && (s = !0, t.some((n) => n.key === e.key && n.control === e.ctrlKey) && (e.preventDefault(), (i = t.find((n) => n.key === e.key && n.control === e.ctrlKey)) == null || i.function())), setTimeout(() => {
      s = !1;
    }, 300));
  }
  keyBindings() {
    return [
      {
        name: "Play",
        key: "MediaPlay",
        control: !1,
        function: () => !this.player.options.disableMediaControls && this.player.play()
      },
      {
        name: "Pause",
        key: "MediaPause",
        control: !1,
        function: () => !this.player.options.disableMediaControls && this.player.pause()
      },
      {
        name: "Toggle playback",
        key: " ",
        control: !1,
        function: () => this.player.togglePlayback()
      },
      {
        name: "Toggle playback",
        key: "MediaPlayPause",
        control: !1,
        function: () => !this.player.options.disableMediaControls && this.player.togglePlayback()
      },
      {
        name: "Stop",
        key: "MediaStop",
        control: !1,
        function: () => !this.player.options.disableMediaControls && this.player.stop()
      },
      {
        name: "Rewind",
        key: "ArrowLeft",
        control: !1,
        function: () => !this.player.isTv() && this.player.rewindVideo()
      },
      {
        name: "Rewind",
        key: "MediaRewind",
        control: !1,
        function: () => !this.player.options.disableMediaControls && this.player.rewindVideo()
      },
      {
        name: "Fast forward",
        key: "ArrowRight",
        control: !1,
        function: () => !this.player.isTv() && this.player.forwardVideo()
      },
      {
        name: "Fast forward",
        key: "MediaFastForward",
        control: !1,
        function: () => !this.player.options.disableMediaControls && this.player.forwardVideo()
      },
      {
        name: "Previous item",
        key: "MediaTrackPrevious",
        control: !1,
        function: () => !this.player.options.disableMediaControls && this.player.previous()
      },
      {
        name: "Previous item",
        key: "p",
        control: !1,
        function: () => this.player.previous()
      },
      {
        name: "Next item",
        key: "MediaTrackNext",
        control: !1,
        function: () => !this.player.options.disableMediaControls && this.player.next()
      },
      {
        name: "Next item",
        key: "n",
        control: !1,
        function: () => this.player.next()
      },
      {
        name: "Cycle subtitle tracks",
        key: "Subtitle",
        control: !1,
        function: () => this.player.cycleSubtitles()
      },
      {
        name: "Cycle subtitle tracks",
        key: "v",
        control: !1,
        function: () => this.player.cycleSubtitles()
      },
      {
        name: "Cycle audio tracks",
        key: "Audio",
        control: !1,
        function: () => this.player.cycleAudioTracks()
      },
      {
        name: "Cycle audio",
        key: "b",
        control: !1,
        function: () => this.player.cycleAudioTracks()
      },
      {
        name: "Forward 30 seconds",
        key: "ColorF0Red",
        control: !1,
        function: () => this.player.forwardVideo(30)
      },
      {
        name: "Forward 60 seconds",
        key: "ColorF1Green",
        control: !1,
        function: () => this.player.forwardVideo(60)
      },
      {
        name: "Forward 90 seconds",
        key: "ColorF2Yellow",
        control: !1,
        function: () => this.player.forwardVideo(90)
      },
      {
        name: "Forward 120 seconds",
        key: "ColorF3Blue",
        control: !1,
        function: () => this.player.forwardVideo(120)
      },
      {
        name: "Forward 30 seconds",
        key: "3",
        control: !1,
        function: () => this.player.forwardVideo(30)
      },
      {
        name: "Forward 60 seconds",
        key: "6",
        control: !1,
        function: () => this.player.forwardVideo(60)
      },
      {
        name: "Forward 90 seconds",
        key: "9",
        control: !1,
        function: () => this.player.forwardVideo(90)
      },
      {
        name: "Forward 120 seconds",
        key: "1",
        control: !1,
        function: () => this.player.forwardVideo(120)
      },
      {
        name: "Fullscreen",
        key: "f",
        control: !1,
        function: () => this.player.toggleFullscreen()
      },
      {
        name: "Volume up",
        key: "ArrowUp",
        control: !1,
        function: () => !this.player.isTv() && !this.player.isMobile() && this.player.volumeUp()
      },
      {
        name: "Volume down",
        key: "ArrowDown",
        control: !1,
        function: () => !this.player.isTv() && !this.player.isMobile() && this.player.volumeDown()
      },
      {
        name: "Mute",
        key: "m",
        control: !1,
        function: () => this.player.toggleMute()
      },
      {
        name: "Cycle aspect ratio",
        key: "BrowserFavorites",
        control: !1,
        function: () => this.player.cycleAspectRatio()
      },
      {
        name: "Show info",
        key: "Info",
        control: !1,
        function: () => {
        }
      }
    ].map((e, t) => ({
      ...e,
      id: t
    }));
  }
}
const qi = document.querySelector("#audioTracks"), od = document.querySelector("#currentAudio"), ji = document.querySelector("#subtitleTracks"), ld = document.querySelector("#currentSubtitle"), Xi = document.querySelector("#qualities"), cd = document.querySelector("#currentQuality"), Gs = {
  muted: !1,
  controls: !1,
  preload: "auto",
  debug: !1,
  playlist: [
    {
      title: "Cosmos Laundromat",
      description: "On a desolate island, a suicidal sheep named Franck meets his fate…in the form of a quirky salesman named Victor, who offers him the gift of a lifetime. The gift is many lifetimes, actually, in many different worlds – each lasting just a few minutes. In the sequel to the pilot, Franck will find a new reason to live…in the form of a bewitching female adventurer named Tara, who awakens his long-lost lust for life. But can Franck keep up with her?",
      image: "https://image.tmdb.org/t/p/w780/f2wABsgj2lIR2dkDEfBZX8p4Iyk.jpg",
      file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/Cosmos.Laundromat.(2015).NoMercy.m3u8",
      tracks: [
        {
          label: "Dutch (Full)",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.dut.full.vtt",
          language: "dut",
          kind: "subtitles"
        },
        {
          label: "English (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.eng.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "French (Full)",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.fre.full.vtt",
          language: "fre",
          kind: "subtitles"
        },
        {
          label: "Italian (Full)",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.ita.full.vtt",
          language: "ita",
          kind: "subtitles"
        },
        {
          label: "Portugese Brazilian (Full)",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.pob.full.vtt",
          language: "nor",
          kind: "subtitles"
        },
        {
          label: "Spanish (Full)",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.spa.full.vtt",
          language: "swe",
          kind: "subtitles"
        },
        {
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/thumbs_256x144.vtt",
          kind: "thumbnails"
        },
        {
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/chapters.vtt",
          kind: "chapters"
        },
        {
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/thumbs_256x144.webp",
          kind: "sprite"
        }
      ]
    },
    {
      title: "Sintel",
      description: `Sintel is an independently produced short film, initiated by the Blender Foundation as a means to further improve and validate the free/open source 3D creation suite Blender. With initial funding provided by 1000s of donations via the internet community, it has again proven to be a viable development model for both open 3D technology as for independent animation film.
This 15 minute film has been realized in the studio of the Amsterdam Blender Institute, by an international team of artists and developers. In addition to that, several crucial technical and creative targets have been realized online, by developers and artists and teams all over the world.
www.sintel.org`,
      image: "https://image.tmdb.org/t/p/w780/q2bVM5z90tCGbmXYtq2J38T5hSX.jpg",
      file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/Sintel.(2010).NoMercy.m3u8",
      tracks: [
        {
          label: "Dutch (Full)",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.dut.full.vtt",
          language: "dut",
          kind: "subtitles"
        },
        {
          label: "English (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.eng.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "French (Full)",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.fre.full.vtt",
          language: "fre",
          kind: "subtitles"
        },
        {
          label: "German (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.ger.full.vtt",
          language: "ger",
          kind: "subtitles"
        },
        {
          label: "Italian (Full)",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.ita.full.vtt",
          language: "ita",
          kind: "subtitles"
        },
        {
          label: "Russian (Full)",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.rus.full.vtt",
          language: "rus",
          kind: "subtitles"
        },
        {
          label: "German (Full)",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.ger.full.vtt",
          language: "ger",
          kind: "subtitles"
        },
        {
          label: "Portuguese (Full)",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.por.full.vtt",
          language: "por",
          kind: "subtitles"
        },
        {
          label: "Spanish (Full)",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.spa.full.vtt",
          language: "spa",
          kind: "subtitles"
        },
        {
          label: "Polish (Full)",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.pol.full.vtt",
          language: "pol",
          kind: "subtitles"
        },
        {
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/thumbs_256x109.vtt",
          kind: "thumbnails"
        },
        {
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/chapters.vtt",
          kind: "chapters"
        },
        {
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/thumbs_256x109.webp",
          kind: "sprite"
        }
      ]
    },
    {
      title: "Tears of Steel",
      description: "Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender. Target was to improve and test a complete open and free pipeline for visual effects in film - and to make a compelling sci-fi film in Amsterdam, the Netherlands.  The film itself, and all raw material used for making it, have been released under the Creatieve Commons 3.0 Attribution license. Visit the tearsofsteel.org website to find out more about this, or to purchase the 4-DVD box with a lot of extras.  (CC) Blender Foundation - https://www.tearsofsteel.org",
      image: "https://image.tmdb.org/t/p/w780/fOy6SL5Zs2PFcNXwqEPIDPrLB1q.jpg",
      file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/Tears.of.Steel.(2012).NoMercy.m3u8",
      tracks: [
        {
          label: "Brazilian (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.bra.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "Chinese (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.chi.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "Croatian (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.cro.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "Chech (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.cze.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "Danish (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.dan.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "Dutch (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.dut.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "English (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.eng.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "French (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.fre.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "German (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.ger.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "Greek (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.gre.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "Hebrew (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.heb.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "Hungarian (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.hun.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "Indian (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.ind.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "Italian (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.ita.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "Japanese (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.jpn.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "Norwegian (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.nor.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "Persian (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.per.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "Portugese (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.por.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "Russian (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.rus.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          label: "Spanish (Full)",
          type: "sdh",
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.spa.full.vtt",
          language: "eng",
          kind: "subtitles"
        },
        {
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/previews.vtt",
          kind: "thumbnails"
        },
        {
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/chapters.vtt",
          kind: "chapters"
        },
        {
          file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/previews.webp",
          kind: "sprite"
        }
      ]
    },
    {
      title: "Rail Wars",
      description: "Takayama enters the training program of JNR with the ambition of becoming one of the venerable train company's engineers. As a trainee he is teamed up with fight-ready Sakurai and stolid Iwaizumi and fellow Haruka Kōmi who has encyclopedic knowledge of trains. Together they learn how security officers for the train line work and get involved in more than one tricky situation.",
      image: "https://image.tmdb.org/t/p/original/vH8NqN2LMcmtBv037iHGwcPOgCZ.jpg",
      file: "https://backstore.fra1.digitaloceanspaces.com/demo/railwars/railwars.mp4",
      tracks: [
        {
          label: "English (Full)",
          file: "https://backstore.fra1.digitaloceanspaces.com/demo/railwars/railwars.ass",
          language: "eng",
          kind: "subtitles"
        },
        {
          file: "https://media.nomercy.tv/Films/Films/Rail.Wars.(2014)/fonts.json",
          kind: "fonts"
        }
      ]
    },
    {
      title: "No-Rin",
      description: "The sudden retirement of the famous idol Yuka Kusakabe from the entertainment business shocks the world and devastates her biggest fan, teenager Kosaku Hata. His classmates at the Tamo Agriculture School manages to get him out of his depression and bring him out of his room to attend his classes. But to everyone's surprise, Yuka Kusakabe - her stage name - comes into their class under the name Ringo Kinoshita as a transfer student. Kosaku realizes he has a once-in-a-lifetime opportunity to get to personally know his dream girl and, together with his group of friends, try to find out why she came to the agricultural school and become more than just classmates.",
      image: "https://image.tmdb.org/t/p/original/myHS6X2yonpoBQOptVuQ85PudtC.jpg",
      file: "https://backstore.fra1.digitaloceanspaces.com/demo/nourin/nourin.mp4",
      tracks: [
        {
          label: "English (Full)",
          file: "https://backstore.fra1.digitaloceanspaces.com/demo/nourin/nourin.ass",
          language: "eng",
          kind: "subtitles"
        },
        {
          file: "https://media.nomercy.tv/Films/Films/No-Rin.(2014)/fonts.json",
          kind: "fonts"
        }
      ]
    }
  ],
  controlsTimeout: 3e3,
  doubleClickDelay: 500,
  playbackRates: [
    0.25,
    0.5,
    0.75,
    1,
    1.25,
    1.5,
    1.75,
    2
  ],
  fullscreen: {
    iOS: !0,
    alwaysInLandscapeMode: !0,
    enable: !0,
    enterOnRotate: !0,
    exitOnRotate: !0
  }
  // NoMercy test account
  // accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJkNWE1YTAwNS05ZWE2LTRlODMtYmZmNy05ZTQ0MjY5OTg4OWMiLCJqdGkiOiJiNDAyZWU0YThjNGYxYzJjN2RhNmE0ODZjNjY2NDI4YWYyMzMwNGI2MzIyNzRmZjZjNThkODI2YTdjYTEzYTFhYmM2NTA2YjIyOWVmNWE3YiIsImlhdCI6MTY5MzI0NTIwNi42Mjk3NTUsIm5iZiI6MTY5MzI0NTIwNi42Mjk3NTYsImV4cCI6MTcyNDc4MTIwNi42MjM2NjcsInN1YiI6ImQ5OWE1NzQxLTM2ZTgtNGU1ZC1iYzUzLTg1MzAyNmIzZjRhYSIsInNjb3BlcyI6WyJvcGVuaWQiLCJwcm9maWxlIiwiZW1haWwiXSwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdEBub21lcmN5LnR2In0.GV7HlmRAVDL3Bb1MdWltS1AX8dR1LHRMF_vtvM01abLu2983djSKSUvtB26KV5MCpOSuOX-ZwlBlqbMJ5JUX55fSonUE0oiz0ujn8QIk0-G0ptB1-hqn6qIRtxncwZaT0TGNpF7TFejjMC_VcqwjtzmRA58JC940u7QL7k5304cbHJXv-_Op1FpAR3dRA0g3BVR8uJ5ckp1hO-KAj83NOetnviglQf6130WQKtx2AWC1qT55NW3Xx1YFAZZUptjgRZ5mhvDd0_OmTNnFvsQZYaHr5H2WFAzKfW7GEvlu7xFIiMxfhpfowyvV3u4VqoDU-wIfkod-U0lL9JlwnsufFAvE_dfXjMhDXZG80oFPifYLanj7DsL4lIfbaVJO92W1K4bYW0t8Jfi8U3ZdqXtvPSpjPmx5dyz9Z2Na16GtH0_sZu5oMPgbGRMk0pZLi0uGWb_Wxyg3MFMEE4f0zA3gRSc1yt3gCI-AIaiCeMKAbC_uPauV3QcNzbCV2JVxOzW-tKlexALBPYe53DKkODPVcQHhv_d1sqXZxqwS8OfkZzqNCg2MpN2DodgSAVM8b1xZMG_6Ym-hEtDYw0ZCghda7v0pZSAo67jFDv5kEk9MF4j7OGfvk3sFT-mi7gFogKLByrMfQMfs4-qnHrsoKOVZRU6S1JHkRJFSxkwcamv_AYI',
};
Gs.subtitleRenderer = "octopus";
Gs.sabreVersion = "0.5.1-pre.8bd763";
const N = lr("player").setup(Gs), hd = new id();
N.registerPlugin("desktopUI", hd);
N.usePlugin("desktopUI");
const ud = new nd();
N.registerPlugin("mobileUI", ud);
N.usePlugin("mobileUI");
const dd = new rd();
N.registerPlugin("tvUI", dd);
N.usePlugin("tvUI");
const fd = new Oc();
N.registerPlugin("octopus", fd);
N.usePlugin("octopus");
const md = new ad();
N.registerPlugin("keyHandler", md);
N.usePlugin("keyHandler");
N.on("ready", (a) => {
  console.log("ready", a);
});
N.on("setupError", (a) => {
  console.log("setupError", a);
});
N.on("playlist", (a) => {
  console.log("playlist", a);
});
N.on("playlistItem", (a) => {
  console.log("playlistItem", a);
});
N.on("playlistComplete", (a) => {
  console.log("playlistComplete", a);
});
N.on("bufferChange", (a) => {
  console.log("bufferChange", a);
});
N.on("firstFrame", () => {
  console.log("firstFrame");
});
N.on("play", (a) => {
  console.log("play", a);
});
N.on("pause", (a) => {
  console.log("pause", a);
});
N.on("buffer", (a) => {
  console.log("buffer", a);
});
N.on("idle", (a) => {
  console.log("idle", a);
});
N.on("complete", (a) => {
  console.log("complete", a);
});
N.on("error", (a) => {
  console.log("error", a);
});
N.on("seek", (a) => {
  console.log("seek", a);
});
N.on("seeked", (a) => {
  console.log("seeked", a);
});
N.on("time", (a) => {
});
N.on("mute", (a) => {
  console.log("mute", a);
});
N.on("volume", (a) => {
  console.log("volume", a);
});
N.on("gain", (a) => {
  console.log("gain", a), gain.innerHTML = a.value, gainSlider.value = a.value;
});
N.on("fullscreen", (a) => {
  console.log("fullscreen", a);
});
N.on("resize", (a) => {
  console.log("resize", a);
});
N.on("levels", (a) => {
  console.log("levels", a), Xi.innerHTML = "";
  const e = N.createElement("ul", "levelTrackList", !0).addClasses(["nm-overflow-auto"]).appendTo(Xi);
  N.hls.loadLevel, Object.values(a).forEach((t) => {
    const s = N.createElement("li", `levelTrack-${t.name}`).addClasses([
      "nm-p-2",
      "nm-cursor-pointer",
      "nm-border-b"
    ]).appendTo(e);
    s.innerHTML = t.name + (a.id === t.id ? " &#x2714;" : ""), N.on("levelsChanging", (i) => {
      console.log("levelsChanging", i), s.innerHTML = t.name + (i.id === t.id ? " &#x2714;" : "");
    }), s.addEventListener("click", () => {
      N.setCurrentQuality(t.id);
    });
  });
});
N.on("levelsChanged", (a) => {
  console.log("levelsChanged", a), cd.innerHTML = a.name;
});
N.on("audioTracks", (a) => {
  console.log("audioTracks", a), qi.innerHTML = "";
  const e = N.createElement("ul", "audioTrackList", !0).addClasses(["nm-overflow-auto"]).appendTo(qi);
  Object.values(a).forEach((t) => {
    const s = N.createElement("li", `audioTrack-${t.name}`).addClasses([
      "nm-p-2",
      "nm-cursor-pointer",
      "nm-border-b"
    ]).appendTo(e);
    s.innerHTML = t.name + (a.id === t.id || t.id === 0 ? " &#x2714;" : ""), N.on("audioTrackChanged", (i) => {
      s.innerHTML = t.name + (i.id === t.id ? " &#x2714;" : "");
    }), s.addEventListener("click", () => {
      N.setCurrentAudioTrack(t.id);
    });
  });
});
N.on("audioTrackChanged", (a) => {
  console.log("audioTrackChanged", a), od.innerHTML = a.name;
});
N.on("captionsList", (a) => {
  console.log("captionsList", a), ji.innerHTML = "";
  const e = N.createElement("ul", "captionTrackList", !0).addClasses(["nm-overflow-auto"]).appendTo(ji);
  Object.values(a).forEach((t, s) => {
    const i = N.createElement("li", `captionTrack-${t.name}`).addClasses([
      "nm-p-2",
      "nm-cursor-pointer",
      "nm-border-b"
    ]).appendTo(e);
    i.innerHTML = t.label + (a.id === t.id ? " &#x2714;" : ""), N.on("captionsChange", (n) => {
      i.innerHTML = t.label + (n.id === t.id ? " &#x2714;" : "");
    }), i.addEventListener("click", () => {
      N.setCurrentCaption(s);
    });
  });
});
N.on("captionsChange", (a) => {
  console.log("captionsChange", a.label), ld.innerHTML = N.getCurrentCaptionsName();
});
N.on("controls", (a) => {
  console.log("controls", a);
});
N.on("displayClick", (a) => {
  console.log("displayClick", a);
});
N.on("adClick", (a) => {
  console.log("adClick", a);
});
N.on("adCompanions", (a) => {
  console.log("adCompanions", a);
});
N.on("adComplete", (a) => {
  console.log("adComplete", a);
});
N.on("adError", (a) => {
  console.log("adError", a);
});
N.on("adImpression", (a) => {
  console.log("adImpression", a);
});
N.on("adTime", (a) => {
  console.log("adTime", a);
});
N.on("adSkipped", (a) => {
  console.log("adSkipped", a);
});
N.on("beforePlay", (a) => {
  console.log("beforePlay", a);
});
N.on("beforeComplete", (a) => {
  console.log("beforeComplete", a);
});
N.on("meta", (a) => {
  console.log("meta", a);
});
N.on("lastTimeTrigger", (a) => {
  console.log("lastTimeTrigger", a);
});
N.on("theaterMode", (a) => {
  console.log("theaterMode", a);
});
N.on("pip", (a) => {
  console.log("pip", a);
});