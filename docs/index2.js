import { B as Jn } from "./base.js";
import { t as Zn } from "./translations.js";
import { h as $e, c as er, p as Bi, u as tr } from "./helpers.js";
function ir(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var Ks = { exports: {} };
(function(a, e) {
  (function(t) {
    var i = /^(?=((?:[a-zA-Z0-9+\-.]+:)?))\1(?=((?:\/\/[^\/?#]*)?))\2(?=((?:(?:[^?#\/]*\/)*[^;?#\/]*)?))\3((?:;[^?#]*)?)(\?[^#]*)?(#[^]*)?$/, s = /^(?=([^\/?#]*))\1([^]*)$/, n = /(?:\/|^)\.(?=\/)/g, r = /(?:\/|^)\.\.\/(?!\.\.\/)[^\/]*(?=\/)/g, o = {
      // If opts.alwaysNormalize is true then the path will always be normalized even when it starts with / or //
      // E.g
      // With opts.alwaysNormalize = false (default, spec compliant)
      // http://a.com/b/cd + /e/f/../g => http://a.com/e/f/../g
      // With opts.alwaysNormalize = true (not spec compliant)
      // http://a.com/b/cd + /e/f/../g => http://a.com/e/g
      buildAbsoluteURL: function(l, h, c) {
        if (c = c || {}, l = l.trim(), h = h.trim(), !h) {
          if (!c.alwaysNormalize)
            return l;
          var u = o.parseURL(l);
          if (!u)
            throw new Error("Error trying to parse base URL.");
          return u.path = o.normalizePath(
            u.path
          ), o.buildURLFromParts(u);
        }
        var d = o.parseURL(h);
        if (!d)
          throw new Error("Error trying to parse relative URL.");
        if (d.scheme)
          return c.alwaysNormalize ? (d.path = o.normalizePath(d.path), o.buildURLFromParts(d)) : h;
        var f = o.parseURL(l);
        if (!f)
          throw new Error("Error trying to parse base URL.");
        if (!f.netLoc && f.path && f.path[0] !== "/") {
          var g = s.exec(f.path);
          f.netLoc = g[1], f.path = g[2];
        }
        f.netLoc && !f.path && (f.path = "/");
        var m = {
          // 2c) Otherwise, the embedded URL inherits the scheme of
          // the base URL.
          scheme: f.scheme,
          netLoc: d.netLoc,
          path: null,
          params: d.params,
          query: d.query,
          fragment: d.fragment
        };
        if (!d.netLoc && (m.netLoc = f.netLoc, d.path[0] !== "/"))
          if (!d.path)
            m.path = f.path, d.params || (m.params = f.params, d.query || (m.query = f.query));
          else {
            var T = f.path, y = T.substring(0, T.lastIndexOf("/") + 1) + d.path;
            m.path = o.normalizePath(y);
          }
        return m.path === null && (m.path = c.alwaysNormalize ? o.normalizePath(d.path) : d.path), o.buildURLFromParts(m);
      },
      parseURL: function(l) {
        var h = i.exec(l);
        return h ? {
          scheme: h[1] || "",
          netLoc: h[2] || "",
          path: h[3] || "",
          params: h[4] || "",
          query: h[5] || "",
          fragment: h[6] || ""
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
})(Ks);
var xi = Ks.exports;
function $i(a, e) {
  var t = Object.keys(a);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(a);
    e && (i = i.filter(function(s) {
      return Object.getOwnPropertyDescriptor(a, s).enumerable;
    })), t.push.apply(t, i);
  }
  return t;
}
function le(a) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? $i(Object(t), !0).forEach(function(i) {
      rr(a, i, t[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(a, Object.getOwnPropertyDescriptors(t)) : $i(Object(t)).forEach(function(i) {
      Object.defineProperty(a, i, Object.getOwnPropertyDescriptor(t, i));
    });
  }
  return a;
}
function sr(a, e) {
  if (typeof a != "object" || !a)
    return a;
  var t = a[Symbol.toPrimitive];
  if (t !== void 0) {
    var i = t.call(a, e || "default");
    if (typeof i != "object")
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(a);
}
function nr(a) {
  var e = sr(a, "string");
  return typeof e == "symbol" ? e : String(e);
}
function rr(a, e, t) {
  return e = nr(e), e in a ? Object.defineProperty(a, e, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : a[e] = t, a;
}
function se() {
  return se = Object.assign ? Object.assign.bind() : function(a) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var i in t)
        Object.prototype.hasOwnProperty.call(t, i) && (a[i] = t[i]);
    }
    return a;
  }, se.apply(this, arguments);
}
const M = Number.isFinite || function(a) {
  return typeof a == "number" && isFinite(a);
}, ar = Number.isSafeInteger || function(a) {
  return typeof a == "number" && Math.abs(a) <= or;
}, or = Number.MAX_SAFE_INTEGER || 9007199254740991;
let p = /* @__PURE__ */ function(a) {
  return a.MEDIA_ATTACHING = "hlsMediaAttaching", a.MEDIA_ATTACHED = "hlsMediaAttached", a.MEDIA_DETACHING = "hlsMediaDetaching", a.MEDIA_DETACHED = "hlsMediaDetached", a.BUFFER_RESET = "hlsBufferReset", a.BUFFER_CODECS = "hlsBufferCodecs", a.BUFFER_CREATED = "hlsBufferCreated", a.BUFFER_APPENDING = "hlsBufferAppending", a.BUFFER_APPENDED = "hlsBufferAppended", a.BUFFER_EOS = "hlsBufferEos", a.BUFFER_FLUSHING = "hlsBufferFlushing", a.BUFFER_FLUSHED = "hlsBufferFlushed", a.MANIFEST_LOADING = "hlsManifestLoading", a.MANIFEST_LOADED = "hlsManifestLoaded", a.MANIFEST_PARSED = "hlsManifestParsed", a.LEVEL_SWITCHING = "hlsLevelSwitching", a.LEVEL_SWITCHED = "hlsLevelSwitched", a.LEVEL_LOADING = "hlsLevelLoading", a.LEVEL_LOADED = "hlsLevelLoaded", a.LEVEL_UPDATED = "hlsLevelUpdated", a.LEVEL_PTS_UPDATED = "hlsLevelPtsUpdated", a.LEVELS_UPDATED = "hlsLevelsUpdated", a.AUDIO_TRACKS_UPDATED = "hlsAudioTracksUpdated", a.AUDIO_TRACK_SWITCHING = "hlsAudioTrackSwitching", a.AUDIO_TRACK_SWITCHED = "hlsAudioTrackSwitched", a.AUDIO_TRACK_LOADING = "hlsAudioTrackLoading", a.AUDIO_TRACK_LOADED = "hlsAudioTrackLoaded", a.SUBTITLE_TRACKS_UPDATED = "hlsSubtitleTracksUpdated", a.SUBTITLE_TRACKS_CLEARED = "hlsSubtitleTracksCleared", a.SUBTITLE_TRACK_SWITCH = "hlsSubtitleTrackSwitch", a.SUBTITLE_TRACK_LOADING = "hlsSubtitleTrackLoading", a.SUBTITLE_TRACK_LOADED = "hlsSubtitleTrackLoaded", a.SUBTITLE_FRAG_PROCESSED = "hlsSubtitleFragProcessed", a.CUES_PARSED = "hlsCuesParsed", a.NON_NATIVE_TEXT_TRACKS_FOUND = "hlsNonNativeTextTracksFound", a.INIT_PTS_FOUND = "hlsInitPtsFound", a.FRAG_LOADING = "hlsFragLoading", a.FRAG_LOAD_EMERGENCY_ABORTED = "hlsFragLoadEmergencyAborted", a.FRAG_LOADED = "hlsFragLoaded", a.FRAG_DECRYPTED = "hlsFragDecrypted", a.FRAG_PARSING_INIT_SEGMENT = "hlsFragParsingInitSegment", a.FRAG_PARSING_USERDATA = "hlsFragParsingUserdata", a.FRAG_PARSING_METADATA = "hlsFragParsingMetadata", a.FRAG_PARSED = "hlsFragParsed", a.FRAG_BUFFERED = "hlsFragBuffered", a.FRAG_CHANGED = "hlsFragChanged", a.FPS_DROP = "hlsFpsDrop", a.FPS_DROP_LEVEL_CAPPING = "hlsFpsDropLevelCapping", a.MAX_AUTO_LEVEL_UPDATED = "hlsMaxAutoLevelUpdated", a.ERROR = "hlsError", a.DESTROYING = "hlsDestroying", a.KEY_LOADING = "hlsKeyLoading", a.KEY_LOADED = "hlsKeyLoaded", a.LIVE_BACK_BUFFER_REACHED = "hlsLiveBackBufferReached", a.BACK_BUFFER_REACHED = "hlsBackBufferReached", a.STEERING_MANIFEST_LOADED = "hlsSteeringManifestLoaded", a;
}({}), V = /* @__PURE__ */ function(a) {
  return a.NETWORK_ERROR = "networkError", a.MEDIA_ERROR = "mediaError", a.KEY_SYSTEM_ERROR = "keySystemError", a.MUX_ERROR = "muxError", a.OTHER_ERROR = "otherError", a;
}({}), b = /* @__PURE__ */ function(a) {
  return a.KEY_SYSTEM_NO_KEYS = "keySystemNoKeys", a.KEY_SYSTEM_NO_ACCESS = "keySystemNoAccess", a.KEY_SYSTEM_NO_SESSION = "keySystemNoSession", a.KEY_SYSTEM_NO_CONFIGURED_LICENSE = "keySystemNoConfiguredLicense", a.KEY_SYSTEM_LICENSE_REQUEST_FAILED = "keySystemLicenseRequestFailed", a.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED = "keySystemServerCertificateRequestFailed", a.KEY_SYSTEM_SERVER_CERTIFICATE_UPDATE_FAILED = "keySystemServerCertificateUpdateFailed", a.KEY_SYSTEM_SESSION_UPDATE_FAILED = "keySystemSessionUpdateFailed", a.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED = "keySystemStatusOutputRestricted", a.KEY_SYSTEM_STATUS_INTERNAL_ERROR = "keySystemStatusInternalError", a.MANIFEST_LOAD_ERROR = "manifestLoadError", a.MANIFEST_LOAD_TIMEOUT = "manifestLoadTimeOut", a.MANIFEST_PARSING_ERROR = "manifestParsingError", a.MANIFEST_INCOMPATIBLE_CODECS_ERROR = "manifestIncompatibleCodecsError", a.LEVEL_EMPTY_ERROR = "levelEmptyError", a.LEVEL_LOAD_ERROR = "levelLoadError", a.LEVEL_LOAD_TIMEOUT = "levelLoadTimeOut", a.LEVEL_PARSING_ERROR = "levelParsingError", a.LEVEL_SWITCH_ERROR = "levelSwitchError", a.AUDIO_TRACK_LOAD_ERROR = "audioTrackLoadError", a.AUDIO_TRACK_LOAD_TIMEOUT = "audioTrackLoadTimeOut", a.SUBTITLE_LOAD_ERROR = "subtitleTrackLoadError", a.SUBTITLE_TRACK_LOAD_TIMEOUT = "subtitleTrackLoadTimeOut", a.FRAG_LOAD_ERROR = "fragLoadError", a.FRAG_LOAD_TIMEOUT = "fragLoadTimeOut", a.FRAG_DECRYPT_ERROR = "fragDecryptError", a.FRAG_PARSING_ERROR = "fragParsingError", a.FRAG_GAP = "fragGap", a.REMUX_ALLOC_ERROR = "remuxAllocError", a.KEY_LOAD_ERROR = "keyLoadError", a.KEY_LOAD_TIMEOUT = "keyLoadTimeOut", a.BUFFER_ADD_CODEC_ERROR = "bufferAddCodecError", a.BUFFER_INCOMPATIBLE_CODECS_ERROR = "bufferIncompatibleCodecsError", a.BUFFER_APPEND_ERROR = "bufferAppendError", a.BUFFER_APPENDING_ERROR = "bufferAppendingError", a.BUFFER_STALLED_ERROR = "bufferStalledError", a.BUFFER_FULL_ERROR = "bufferFullError", a.BUFFER_SEEK_OVER_HOLE = "bufferSeekOverHole", a.BUFFER_NUDGE_ON_STALL = "bufferNudgeOnStall", a.INTERNAL_EXCEPTION = "internalException", a.INTERNAL_ABORTED = "aborted", a.UNKNOWN = "unknown", a;
}({});
const Me = function() {
}, ri = {
  trace: Me,
  debug: Me,
  log: Me,
  warn: Me,
  info: Me,
  error: Me
};
let tt = ri;
function lr(a) {
  const e = self.console[a];
  return e ? e.bind(self.console, `[${a}] >`) : Me;
}
function hr(a, ...e) {
  e.forEach(function(t) {
    tt[t] = a[t] ? a[t].bind(a) : lr(t);
  });
}
function cr(a, e) {
  if (typeof console == "object" && a === !0 || typeof a == "object") {
    hr(
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
      tt.log(`Debug logs enabled for "${e}" in hls.js version 1.5.13`);
    } catch {
      tt = ri;
    }
  } else
    tt = ri;
}
const A = tt, ur = /^(\d+)x(\d+)$/, Gi = /(.+?)=(".*?"|.*?)(?:,|$)/g;
class te {
  constructor(e) {
    typeof e == "string" && (e = te.parseAttrList(e)), se(this, e);
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
      const i = new Uint8Array(t.length / 2);
      for (let s = 0; s < t.length / 2; s++)
        i[s] = parseInt(t.slice(s * 2, s * 2 + 2), 16);
      return i;
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
    const i = this[e];
    return i ? parseFloat(i) : t;
  }
  enumeratedString(e) {
    return this[e];
  }
  bool(e) {
    return this[e] === "YES";
  }
  decimalResolution(e) {
    const t = ur.exec(this[e]);
    if (t !== null)
      return {
        width: parseInt(t[1], 10),
        height: parseInt(t[2], 10)
      };
  }
  static parseAttrList(e) {
    let t;
    const i = {}, s = '"';
    for (Gi.lastIndex = 0; (t = Gi.exec(e)) !== null; ) {
      let n = t[2];
      n.indexOf(s) === 0 && n.lastIndexOf(s) === n.length - 1 && (n = n.slice(1, -1));
      const r = t[1].trim();
      i[r] = n;
    }
    return i;
  }
}
function dr(a) {
  return a !== "ID" && a !== "CLASS" && a !== "START-DATE" && a !== "DURATION" && a !== "END-DATE" && a !== "END-ON-NEXT";
}
function fr(a) {
  return a === "SCTE35-OUT" || a === "SCTE35-IN";
}
class Vs {
  constructor(e, t) {
    if (this.attr = void 0, this._startDate = void 0, this._endDate = void 0, this._badValueForSameId = void 0, t) {
      const i = t.attr;
      for (const s in i)
        if (Object.prototype.hasOwnProperty.call(e, s) && e[s] !== i[s]) {
          A.warn(`DATERANGE tag attribute: "${s}" does not match for tags with ID: "${e.ID}"`), this._badValueForSameId = s;
          break;
        }
      e = se(new te({}), i, e);
    }
    if (this.attr = e, this._startDate = new Date(e["START-DATE"]), "END-DATE" in this.attr) {
      const i = new Date(this.attr["END-DATE"]);
      M(i.getTime()) && (this._endDate = i);
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
      if (M(e))
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
    return !!this.id && !this._badValueForSameId && M(this.startDate.getTime()) && (this.duration === null || this.duration >= 0) && (!this.endOnNext || !!this.class);
  }
}
class Ot {
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
class Hs {
  constructor(e) {
    this._byteRange = null, this._url = null, this.baseurl = void 0, this.relurl = void 0, this.elementaryStreams = {
      [X.AUDIO]: null,
      [X.VIDEO]: null,
      [X.AUDIOVIDEO]: null
    }, this.baseurl = e;
  }
  // setByteRange converts a EXT-X-BYTERANGE attribute into a two element array
  setByteRange(e, t) {
    const i = e.split("@", 2);
    let s;
    i.length === 1 ? s = (t == null ? void 0 : t.byteRangeEndOffset) || 0 : s = parseInt(i[1]), this._byteRange = [s, parseInt(i[0]) + s];
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
    return !this._url && this.baseurl && this.relurl && (this._url = xi.buildAbsoluteURL(this.baseurl, this.relurl, {
      alwaysNormalize: !0
    })), this._url || "";
  }
  set url(e) {
    this._url = e;
  }
}
class Ut extends Hs {
  constructor(e, t) {
    super(t), this._decryptdata = null, this.rawProgramDateTime = null, this.programDateTime = null, this.tagList = [], this.duration = 0, this.sn = 0, this.levelkeys = void 0, this.type = void 0, this.loader = null, this.keyLoader = null, this.level = -1, this.cc = 0, this.startPTS = void 0, this.endPTS = void 0, this.startDTS = void 0, this.endDTS = void 0, this.start = 0, this.deltaPTS = void 0, this.maxStartPTS = void 0, this.minEndPTS = void 0, this.stats = new Ot(), this.data = void 0, this.bitrateTest = !1, this.title = null, this.initSegment = null, this.endList = void 0, this.gap = void 0, this.urlId = 0, this.type = e;
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
        const i = Object.keys(this.levelkeys);
        if (i.length === 1)
          return this._decryptdata = this.levelkeys[i[0]].getDecryptData(this.sn);
      }
    }
    return this._decryptdata;
  }
  get end() {
    return this.start + this.duration;
  }
  get endProgramDateTime() {
    if (this.programDateTime === null || !M(this.programDateTime))
      return null;
    const e = M(this.duration) ? this.duration : 0;
    return this.programDateTime + e * 1e3;
  }
  get encrypted() {
    var e;
    if ((e = this._decryptdata) != null && e.encrypted)
      return !0;
    if (this.levelkeys) {
      const t = Object.keys(this.levelkeys), i = t.length;
      if (i > 1 || i === 1 && this.levelkeys[t[0]].encrypted)
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
  setElementaryStreamInfo(e, t, i, s, n, r = !1) {
    const {
      elementaryStreams: o
    } = this, l = o[e];
    if (!l) {
      o[e] = {
        startPTS: t,
        endPTS: i,
        startDTS: s,
        endDTS: n,
        partial: r
      };
      return;
    }
    l.startPTS = Math.min(l.startPTS, t), l.endPTS = Math.max(l.endPTS, i), l.startDTS = Math.min(l.startDTS, s), l.endDTS = Math.max(l.endDTS, n);
  }
  clearElementaryStreamInfo() {
    const {
      elementaryStreams: e
    } = this;
    e[X.AUDIO] = null, e[X.VIDEO] = null, e[X.AUDIOVIDEO] = null;
  }
}
class gr extends Hs {
  constructor(e, t, i, s, n) {
    super(i), this.fragOffset = 0, this.duration = 0, this.gap = !1, this.independent = !1, this.relurl = void 0, this.fragment = void 0, this.index = void 0, this.stats = new Ot(), this.duration = e.decimalFloatingPoint("DURATION"), this.gap = e.bool("GAP"), this.independent = e.bool("INDEPENDENT"), this.relurl = e.enumeratedString("URI"), this.fragment = t, this.index = s;
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
const mr = 10;
class pr {
  constructor(e) {
    this.PTSKnown = !1, this.alignedSliding = !1, this.averagetargetduration = void 0, this.endCC = 0, this.endSN = 0, this.fragments = void 0, this.fragmentHint = void 0, this.partList = null, this.dateRanges = void 0, this.live = !0, this.ageHeader = 0, this.advancedDateTime = void 0, this.updated = !0, this.advanced = !0, this.availabilityDelay = void 0, this.misses = 0, this.startCC = 0, this.startSN = 0, this.startTimeOffset = null, this.targetduration = 0, this.totalduration = 0, this.type = null, this.url = void 0, this.m3u8 = "", this.version = null, this.canBlockReload = !1, this.canSkipUntil = 0, this.canSkipDateRanges = !1, this.skippedSegments = 0, this.recentlyRemovedDateranges = void 0, this.partHoldBack = 0, this.holdBack = 0, this.partTarget = 0, this.preloadHint = void 0, this.renditionReports = void 0, this.tuneInGoal = 0, this.deltaUpdateFailed = void 0, this.driftStartTime = 0, this.driftEndTime = 0, this.driftStart = 0, this.driftEnd = 0, this.encryptedFragments = void 0, this.playlistParsingError = null, this.variableList = null, this.hasVariableRefs = !1, this.fragments = [], this.encryptedFragments = [], this.dateRanges = {}, this.url = e;
  }
  reloaded(e) {
    if (!e) {
      this.advanced = !0, this.updated = !0;
      return;
    }
    const t = this.lastPartSn - e.lastPartSn, i = this.lastPartIndex - e.lastPartIndex;
    this.updated = this.endSN !== e.endSN || !!i || !!t || !this.live, this.advanced = this.endSN > e.endSN || t > 0 || t === 0 && i > 0, this.updated || this.advanced ? this.misses = Math.floor(e.misses * 0.6) : this.misses = e.misses + 1, this.availabilityDelay = e.availabilityDelay;
  }
  get hasProgramDateTime() {
    return this.fragments.length ? M(this.fragments[this.fragments.length - 1].programDateTime) : !1;
  }
  get levelTargetDuration() {
    return this.averagetargetduration || this.targetduration || mr;
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
function Si(a) {
  return Uint8Array.from(atob(a), (e) => e.charCodeAt(0));
}
function Tr(a) {
  const e = ai(a).subarray(0, 16), t = new Uint8Array(16);
  return t.set(e, 16 - e.length), t;
}
function yr(a) {
  const e = function(i, s, n) {
    const r = i[s];
    i[s] = i[n], i[n] = r;
  };
  e(a, 0, 3), e(a, 1, 2), e(a, 4, 5), e(a, 6, 7);
}
function Er(a) {
  const e = a.split(":");
  let t = null;
  if (e[0] === "data" && e.length === 2) {
    const i = e[1].split(";"), s = i[i.length - 1].split(",");
    if (s.length === 2) {
      const n = s[0] === "base64", r = s[1];
      n ? (i.splice(-1, 1), t = Si(r)) : t = Tr(r);
    }
  }
  return t;
}
function ai(a) {
  return Uint8Array.from(unescape(encodeURIComponent(a)), (e) => e.charCodeAt(0));
}
const ze = typeof self < "u" ? self : void 0;
var ee = {
  CLEARKEY: "org.w3.clearkey",
  FAIRPLAY: "com.apple.fps",
  PLAYREADY: "com.microsoft.playready",
  WIDEVINE: "com.widevine.alpha"
}, fe = {
  CLEARKEY: "org.w3.clearkey",
  FAIRPLAY: "com.apple.streamingkeydelivery",
  PLAYREADY: "com.microsoft.playready",
  WIDEVINE: "urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed"
};
function Ki(a) {
  switch (a) {
    case fe.FAIRPLAY:
      return ee.FAIRPLAY;
    case fe.PLAYREADY:
      return ee.PLAYREADY;
    case fe.WIDEVINE:
      return ee.WIDEVINE;
    case fe.CLEARKEY:
      return ee.CLEARKEY;
  }
}
var Ws = {
  WIDEVINE: "edef8ba979d64acea3c827dcd51d21ed"
};
function vr(a) {
  if (a === Ws.WIDEVINE)
    return ee.WIDEVINE;
}
function Vi(a) {
  switch (a) {
    case ee.FAIRPLAY:
      return fe.FAIRPLAY;
    case ee.PLAYREADY:
      return fe.PLAYREADY;
    case ee.WIDEVINE:
      return fe.WIDEVINE;
    case ee.CLEARKEY:
      return fe.CLEARKEY;
  }
}
function Bt(a) {
  const {
    drmSystems: e,
    widevineLicenseUrl: t
  } = a, i = e ? [ee.FAIRPLAY, ee.WIDEVINE, ee.PLAYREADY, ee.CLEARKEY].filter((s) => !!e[s]) : [];
  return !i[ee.WIDEVINE] && t && i.push(ee.WIDEVINE), i;
}
const Ys = function(a) {
  return ze != null && (a = ze.navigator) != null && a.requestMediaKeySystemAccess ? self.navigator.requestMediaKeySystemAccess.bind(self.navigator) : null;
}();
function xr(a, e, t, i) {
  let s;
  switch (a) {
    case ee.FAIRPLAY:
      s = ["cenc", "sinf"];
      break;
    case ee.WIDEVINE:
    case ee.PLAYREADY:
      s = ["cenc"];
      break;
    case ee.CLEARKEY:
      s = ["cenc", "keyids"];
      break;
    default:
      throw new Error(`Unknown key-system: ${a}`);
  }
  return Sr(s, e, t, i);
}
function Sr(a, e, t, i) {
  return [{
    initDataTypes: a,
    persistentState: i.persistentState || "optional",
    distinctiveIdentifier: i.distinctiveIdentifier || "optional",
    sessionTypes: i.sessionTypes || [i.sessionType || "temporary"],
    audioCapabilities: e.map((n) => ({
      contentType: `audio/mp4; codecs="${n}"`,
      robustness: i.audioRobustness || "",
      encryptionScheme: i.audioEncryptionScheme || null
    })),
    videoCapabilities: t.map((n) => ({
      contentType: `video/mp4; codecs="${n}"`,
      robustness: i.videoRobustness || "",
      encryptionScheme: i.videoEncryptionScheme || null
    }))
  }];
}
function Ue(a, e, t) {
  return Uint8Array.prototype.slice ? a.slice(e, t) : new Uint8Array(Array.prototype.slice.call(a, e, t));
}
const Ai = (a, e) => e + 10 <= a.length && a[e] === 73 && a[e + 1] === 68 && a[e + 2] === 51 && a[e + 3] < 255 && a[e + 4] < 255 && a[e + 6] < 128 && a[e + 7] < 128 && a[e + 8] < 128 && a[e + 9] < 128, qs = (a, e) => e + 10 <= a.length && a[e] === 51 && a[e + 1] === 68 && a[e + 2] === 73 && a[e + 3] < 255 && a[e + 4] < 255 && a[e + 6] < 128 && a[e + 7] < 128 && a[e + 8] < 128 && a[e + 9] < 128, it = (a, e) => {
  const t = e;
  let i = 0;
  for (; Ai(a, e); ) {
    i += 10;
    const s = Mt(a, e + 6);
    i += s, qs(a, e + 10) && (i += 10), e += i;
  }
  if (i > 0)
    return a.subarray(t, t + i);
}, Mt = (a, e) => {
  let t = 0;
  return t = (a[e] & 127) << 21, t |= (a[e + 1] & 127) << 14, t |= (a[e + 2] & 127) << 7, t |= a[e + 3] & 127, t;
}, Ar = (a, e) => Ai(a, e) && Mt(a, e + 6) + 10 <= a.length - e, Li = (a) => {
  const e = zs(a);
  for (let t = 0; t < e.length; t++) {
    const i = e[t];
    if (js(i))
      return Dr(i);
  }
}, js = (a) => a && a.key === "PRIV" && a.info === "com.apple.streaming.transportStreamTimestamp", Lr = (a) => {
  const e = String.fromCharCode(a[0], a[1], a[2], a[3]), t = Mt(a, 4), i = 10;
  return {
    type: e,
    size: t,
    data: a.subarray(i, i + t)
  };
}, zs = (a) => {
  let e = 0;
  const t = [];
  for (; Ai(a, e); ) {
    const i = Mt(a, e + 6);
    e += 10;
    const s = e + i;
    for (; e + 8 < s; ) {
      const n = Lr(a.subarray(e)), r = Rr(n);
      r && t.push(r), e += n.size + 10;
    }
    qs(a, e) && (e += 10);
  }
  return t;
}, Rr = (a) => a.type === "PRIV" ? br(a) : a.type[0] === "W" ? Cr(a) : Ir(a), br = (a) => {
  if (a.size < 2)
    return;
  const e = be(a.data, !0), t = new Uint8Array(a.data.subarray(e.length + 1));
  return {
    key: a.type,
    info: e,
    data: t.buffer
  };
}, Ir = (a) => {
  if (a.size < 2)
    return;
  if (a.type === "TXXX") {
    let t = 1;
    const i = be(a.data.subarray(t), !0);
    t += i.length + 1;
    const s = be(a.data.subarray(t));
    return {
      key: a.type,
      info: i,
      data: s
    };
  }
  const e = be(a.data.subarray(1));
  return {
    key: a.type,
    data: e
  };
}, Cr = (a) => {
  if (a.type === "WXXX") {
    if (a.size < 2)
      return;
    let t = 1;
    const i = be(a.data.subarray(t), !0);
    t += i.length + 1;
    const s = be(a.data.subarray(t));
    return {
      key: a.type,
      info: i,
      data: s
    };
  }
  const e = be(a.data);
  return {
    key: a.type,
    data: e
  };
}, Dr = (a) => {
  if (a.data.byteLength === 8) {
    const e = new Uint8Array(a.data), t = e[3] & 1;
    let i = (e[4] << 23) + (e[5] << 15) + (e[6] << 7) + e[7];
    return i /= 45, t && (i += 4772185884e-2), Math.round(i);
  }
}, be = (a, e = !1) => {
  const t = wr();
  if (t) {
    const h = t.decode(a);
    if (e) {
      const c = h.indexOf("\0");
      return c !== -1 ? h.substring(0, c) : h;
    }
    return h.replace(/\0/g, "");
  }
  const i = a.length;
  let s, n, r, o = "", l = 0;
  for (; l < i; ) {
    if (s = a[l++], s === 0 && e)
      return o;
    if (s === 0 || s === 3)
      continue;
    switch (s >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        o += String.fromCharCode(s);
        break;
      case 12:
      case 13:
        n = a[l++], o += String.fromCharCode((s & 31) << 6 | n & 63);
        break;
      case 14:
        n = a[l++], r = a[l++], o += String.fromCharCode((s & 15) << 12 | (n & 63) << 6 | (r & 63) << 0);
        break;
    }
  }
  return o;
};
let $t;
function wr() {
  if (!navigator.userAgent.includes("PlayStation 4"))
    return !$t && typeof self.TextDecoder < "u" && ($t = new self.TextDecoder("utf-8")), $t;
}
const Se = {
  hexDump: function(a) {
    let e = "";
    for (let t = 0; t < a.length; t++) {
      let i = a[t].toString(16);
      i.length < 2 && (i = "0" + i), e += i;
    }
    return e;
  }
}, Lt = Math.pow(2, 32) - 1, kr = [].push, Xs = {
  video: 1,
  audio: 2,
  id3: 3,
  text: 4
};
function ne(a) {
  return String.fromCharCode.apply(null, a);
}
function Qs(a, e) {
  const t = a[e] << 8 | a[e + 1];
  return t < 0 ? 65536 + t : t;
}
function $(a, e) {
  const t = Js(a, e);
  return t < 0 ? 4294967296 + t : t;
}
function Hi(a, e) {
  let t = $(a, e);
  return t *= Math.pow(2, 32), t += $(a, e + 4), t;
}
function Js(a, e) {
  return a[e] << 24 | a[e + 1] << 16 | a[e + 2] << 8 | a[e + 3];
}
function Gt(a, e, t) {
  a[e] = t >> 24, a[e + 1] = t >> 16 & 255, a[e + 2] = t >> 8 & 255, a[e + 3] = t & 255;
}
function _r(a) {
  const e = a.byteLength;
  for (let t = 0; t < e; ) {
    const i = $(a, t);
    if (i > 8 && a[t + 4] === 109 && a[t + 5] === 111 && a[t + 6] === 111 && a[t + 7] === 102)
      return !0;
    t = i > 1 ? t + i : e;
  }
  return !1;
}
function H(a, e) {
  const t = [];
  if (!e.length)
    return t;
  const i = a.byteLength;
  for (let s = 0; s < i; ) {
    const n = $(a, s), r = ne(a.subarray(s + 4, s + 8)), o = n > 1 ? s + n : i;
    if (r === e[0])
      if (e.length === 1)
        t.push(a.subarray(s + 8, o));
      else {
        const l = H(a.subarray(s + 8, o), e.slice(1));
        l.length && kr.apply(t, l);
      }
    s = o;
  }
  return t;
}
function Pr(a) {
  const e = [], t = a[0];
  let i = 8;
  const s = $(a, i);
  i += 4;
  let n = 0, r = 0;
  t === 0 ? (n = $(a, i), r = $(a, i + 4), i += 8) : (n = Hi(a, i), r = Hi(a, i + 8), i += 16), i += 2;
  let o = a.length + r;
  const l = Qs(a, i);
  i += 2;
  for (let h = 0; h < l; h++) {
    let c = i;
    const u = $(a, c);
    c += 4;
    const d = u & 2147483647;
    if ((u & 2147483648) >>> 31 === 1)
      return A.warn("SIDX has hierarchical references (not supported)"), null;
    const g = $(a, c);
    c += 4, e.push({
      referenceSize: d,
      subsegmentDuration: g,
      // unscaled
      info: {
        duration: g / s,
        start: o,
        end: o + d - 1
      }
    }), o += d, c += 4, i = c;
  }
  return {
    earliestPresentationTime: n,
    timescale: s,
    version: t,
    referencesCount: l,
    references: e
  };
}
function Zs(a) {
  const e = [], t = H(a, ["moov", "trak"]);
  for (let s = 0; s < t.length; s++) {
    const n = t[s], r = H(n, ["tkhd"])[0];
    if (r) {
      let o = r[0];
      const l = $(r, o === 0 ? 12 : 20), h = H(n, ["mdia", "mdhd"])[0];
      if (h) {
        o = h[0];
        const c = $(h, o === 0 ? 12 : 20), u = H(n, ["mdia", "hdlr"])[0];
        if (u) {
          const d = ne(u.subarray(8, 12)), f = {
            soun: X.AUDIO,
            vide: X.VIDEO
          }[d];
          if (f) {
            const g = H(n, ["mdia", "minf", "stbl", "stsd"])[0], m = Fr(g);
            e[l] = {
              timescale: c,
              type: f
            }, e[f] = le({
              timescale: c,
              id: l
            }, m);
          }
        }
      }
    }
  }
  return H(a, ["moov", "mvex", "trex"]).forEach((s) => {
    const n = $(s, 4), r = e[n];
    r && (r.default = {
      duration: $(s, 12),
      flags: $(s, 20)
    });
  }), e;
}
function Fr(a) {
  const e = a.subarray(8), t = e.subarray(8 + 78), i = ne(e.subarray(4, 8));
  let s = i;
  const n = i === "enca" || i === "encv";
  if (n) {
    const o = H(e, [i])[0].subarray(i === "enca" ? 28 : 78);
    H(o, ["sinf"]).forEach((h) => {
      const c = H(h, ["schm"])[0];
      if (c) {
        const u = ne(c.subarray(4, 8));
        if (u === "cbcs" || u === "cenc") {
          const d = H(h, ["frma"])[0];
          d && (s = ne(d));
        }
      }
    });
  }
  switch (s) {
    case "avc1":
    case "avc2":
    case "avc3":
    case "avc4": {
      const r = H(t, ["avcC"])[0];
      s += "." + rt(r[1]) + rt(r[2]) + rt(r[3]);
      break;
    }
    case "mp4a": {
      const r = H(e, [i])[0], o = H(r.subarray(28), ["esds"])[0];
      if (o && o.length > 12) {
        let l = 4;
        if (o[l++] !== 3)
          break;
        l = Kt(o, l), l += 2;
        const h = o[l++];
        if (h & 128 && (l += 2), h & 64 && (l += o[l++]), o[l++] !== 4)
          break;
        l = Kt(o, l);
        const c = o[l++];
        if (c === 64)
          s += "." + rt(c);
        else
          break;
        if (l += 12, o[l++] !== 5)
          break;
        l = Kt(o, l);
        const u = o[l++];
        let d = (u & 248) >> 3;
        d === 31 && (d += 1 + ((u & 7) << 3) + ((o[l] & 224) >> 5)), s += "." + d;
      }
      break;
    }
    case "hvc1":
    case "hev1": {
      const r = H(t, ["hvcC"])[0], o = r[1], l = ["", "A", "B", "C"][o >> 6], h = o & 31, c = $(r, 2), u = (o & 32) >> 5 ? "H" : "L", d = r[12], f = r.subarray(6, 12);
      s += "." + l + h, s += "." + c.toString(16).toUpperCase(), s += "." + u + d;
      let g = "";
      for (let m = f.length; m--; ) {
        const T = f[m];
        (T || g) && (g = "." + T.toString(16).toUpperCase() + g);
      }
      s += g;
      break;
    }
    case "dvh1":
    case "dvhe": {
      const r = H(t, ["dvcC"])[0], o = r[2] >> 1 & 127, l = r[2] << 5 & 32 | r[3] >> 3 & 31;
      s += "." + xe(o) + "." + xe(l);
      break;
    }
    case "vp09": {
      const r = H(t, ["vpcC"])[0], o = r[4], l = r[5], h = r[6] >> 4 & 15;
      s += "." + xe(o) + "." + xe(l) + "." + xe(h);
      break;
    }
    case "av01": {
      const r = H(t, ["av1C"])[0], o = r[1] >>> 5, l = r[1] & 31, h = r[2] >>> 7 ? "H" : "M", c = (r[2] & 64) >> 6, u = (r[2] & 32) >> 5, d = o === 2 && c ? u ? 12 : 10 : c ? 10 : 8, f = (r[2] & 16) >> 4, g = (r[2] & 8) >> 3, m = (r[2] & 4) >> 2, T = r[2] & 3, y = 1, E = 1, x = 1, v = 0;
      s += "." + o + "." + xe(l) + h + "." + xe(d) + "." + f + "." + g + m + T + "." + xe(y) + "." + xe(E) + "." + xe(x) + "." + v;
      break;
    }
  }
  return {
    codec: s,
    encrypted: n
  };
}
function Kt(a, e) {
  const t = e + 5;
  for (; a[e++] & 128 && e < t; )
    ;
  return e;
}
function rt(a) {
  return ("0" + a.toString(16).toUpperCase()).slice(-2);
}
function xe(a) {
  return (a < 10 ? "0" : "") + a;
}
function Or(a, e) {
  if (!a || !e)
    return a;
  const t = e.keyId;
  return t && e.isCommonEncryption && H(a, ["moov", "trak"]).forEach((s) => {
    const r = H(s, ["mdia", "minf", "stbl", "stsd"])[0].subarray(8);
    let o = H(r, ["enca"]);
    const l = o.length > 0;
    l || (o = H(r, ["encv"])), o.forEach((h) => {
      const c = l ? h.subarray(28) : h.subarray(78);
      H(c, ["sinf"]).forEach((d) => {
        const f = en(d);
        if (f) {
          const g = f.subarray(8, 24);
          g.some((m) => m !== 0) || (A.log(`[eme] Patching keyId in 'enc${l ? "a" : "v"}>sinf>>tenc' box: ${Se.hexDump(g)} -> ${Se.hexDump(t)}`), f.set(t, 8));
        }
      });
    });
  }), a;
}
function en(a) {
  const e = H(a, ["schm"])[0];
  if (e) {
    const t = ne(e.subarray(4, 8));
    if (t === "cbcs" || t === "cenc")
      return H(a, ["schi", "tenc"])[0];
  }
  return A.error("[eme] missing 'schm' box"), null;
}
function Mr(a, e) {
  return H(e, ["moof", "traf"]).reduce((t, i) => {
    const s = H(i, ["tfdt"])[0], n = s[0], r = H(i, ["tfhd"]).reduce((o, l) => {
      const h = $(l, 4), c = a[h];
      if (c) {
        let u = $(s, 4);
        if (n === 1) {
          if (u === Lt)
            return A.warn("[mp4-demuxer]: Ignoring assumed invalid signed 64-bit track fragment decode time"), o;
          u *= Lt + 1, u += $(s, 8);
        }
        const d = c.timescale || 9e4, f = u / d;
        if (M(f) && (o === null || f < o))
          return f;
      }
      return o;
    }, null);
    return r !== null && M(r) && (t === null || r < t) ? r : t;
  }, null);
}
function Nr(a, e) {
  let t = 0, i = 0, s = 0;
  const n = H(a, ["moof", "traf"]);
  for (let r = 0; r < n.length; r++) {
    const o = n[r], l = H(o, ["tfhd"])[0], h = $(l, 4), c = e[h];
    if (!c)
      continue;
    const u = c.default, d = $(l, 0) | (u == null ? void 0 : u.flags);
    let f = u == null ? void 0 : u.duration;
    d & 8 && (d & 2 ? f = $(l, 12) : f = $(l, 8));
    const g = c.timescale || 9e4, m = H(o, ["trun"]);
    for (let T = 0; T < m.length; T++) {
      if (t = Ur(m[T]), !t && f) {
        const y = $(m[T], 4);
        t = f * y;
      }
      c.type === X.VIDEO ? i += t / g : c.type === X.AUDIO && (s += t / g);
    }
  }
  if (i === 0 && s === 0) {
    let r = 1 / 0, o = 0, l = 0;
    const h = H(a, ["sidx"]);
    for (let c = 0; c < h.length; c++) {
      const u = Pr(h[c]);
      if (u != null && u.references) {
        r = Math.min(r, u.earliestPresentationTime / u.timescale);
        const d = u.references.reduce((f, g) => f + g.info.duration || 0, 0);
        o = Math.max(o, d + u.earliestPresentationTime / u.timescale), l = o - r;
      }
    }
    if (l && M(l))
      return l;
  }
  return i || s;
}
function Ur(a) {
  const e = $(a, 0);
  let t = 8;
  e & 1 && (t += 4), e & 4 && (t += 4);
  let i = 0;
  const s = $(a, 4);
  for (let n = 0; n < s; n++) {
    if (e & 256) {
      const r = $(a, t);
      i += r, t += 4;
    }
    e & 512 && (t += 4), e & 1024 && (t += 4), e & 2048 && (t += 4);
  }
  return i;
}
function Br(a, e, t) {
  H(e, ["moof", "traf"]).forEach((i) => {
    H(i, ["tfhd"]).forEach((s) => {
      const n = $(s, 4), r = a[n];
      if (!r)
        return;
      const o = r.timescale || 9e4;
      H(i, ["tfdt"]).forEach((l) => {
        const h = l[0], c = t * o;
        if (c) {
          let u = $(l, 4);
          if (h === 0)
            u -= c, u = Math.max(u, 0), Gt(l, 4, u);
          else {
            u *= Math.pow(2, 32), u += $(l, 8), u -= c, u = Math.max(u, 0);
            const d = Math.floor(u / (Lt + 1)), f = Math.floor(u % (Lt + 1));
            Gt(l, 4, d), Gt(l, 8, f);
          }
        }
      });
    });
  });
}
function $r(a) {
  const e = {
    valid: null,
    remainder: null
  }, t = H(a, ["moof"]);
  if (t.length < 2)
    return e.remainder = a, e;
  const i = t[t.length - 1];
  return e.valid = Ue(a, 0, i.byteOffset - 8), e.remainder = Ue(a, i.byteOffset - 8), e;
}
function Te(a, e) {
  const t = new Uint8Array(a.length + e.length);
  return t.set(a), t.set(e, a.length), t;
}
function Wi(a, e) {
  const t = [], i = e.samples, s = e.timescale, n = e.id;
  let r = !1;
  return H(i, ["moof"]).map((l) => {
    const h = l.byteOffset - 8;
    H(l, ["traf"]).map((u) => {
      const d = H(u, ["tfdt"]).map((f) => {
        const g = f[0];
        let m = $(f, 4);
        return g === 1 && (m *= Math.pow(2, 32), m += $(f, 8)), m / s;
      })[0];
      return d !== void 0 && (a = d), H(u, ["tfhd"]).map((f) => {
        const g = $(f, 4), m = $(f, 0) & 16777215, T = (m & 1) !== 0, y = (m & 2) !== 0, E = (m & 8) !== 0;
        let x = 0;
        const v = (m & 16) !== 0;
        let S = 0;
        const C = (m & 32) !== 0;
        let R = 8;
        g === n && (T && (R += 8), y && (R += 4), E && (x = $(f, R), R += 4), v && (S = $(f, R), R += 4), C && (R += 4), e.type === "video" && (r = Gr(e.codec)), H(u, ["trun"]).map((I) => {
          const D = I[0], w = $(I, 0) & 16777215, _ = (w & 1) !== 0;
          let O = 0;
          const P = (w & 4) !== 0, K = (w & 256) !== 0;
          let N = 0;
          const U = (w & 512) !== 0;
          let q = 0;
          const Q = (w & 1024) !== 0, B = (w & 2048) !== 0;
          let F = 0;
          const j = $(I, 4);
          let W = 8;
          _ && (O = $(I, W), W += 4), P && (W += 4);
          let z = O + h;
          for (let ie = 0; ie < j; ie++) {
            if (K ? (N = $(I, W), W += 4) : N = x, U ? (q = $(I, W), W += 4) : q = S, Q && (W += 4), B && (D === 0 ? F = $(I, W) : F = Js(I, W), W += 4), e.type === X.VIDEO) {
              let re = 0;
              for (; re < q; ) {
                const he = $(i, z);
                if (z += 4, Kr(r, i[z])) {
                  const ge = i.subarray(z, z + he);
                  tn(ge, r ? 2 : 1, a + F / s, t);
                }
                z += he, re += he + 4;
              }
            }
            a += N / s;
          }
        }));
      });
    });
  }), t;
}
function Gr(a) {
  if (!a)
    return !1;
  const e = a.indexOf("."), t = e < 0 ? a : a.substring(0, e);
  return t === "hvc1" || t === "hev1" || // Dolby Vision
  t === "dvh1" || t === "dvhe";
}
function Kr(a, e) {
  if (a) {
    const t = e >> 1 & 63;
    return t === 39 || t === 40;
  } else
    return (e & 31) === 6;
}
function tn(a, e, t, i) {
  const s = sn(a);
  let n = 0;
  n += e;
  let r = 0, o = 0, l = 0;
  for (; n < s.length; ) {
    r = 0;
    do {
      if (n >= s.length)
        break;
      l = s[n++], r += l;
    } while (l === 255);
    o = 0;
    do {
      if (n >= s.length)
        break;
      l = s[n++], o += l;
    } while (l === 255);
    const h = s.length - n;
    let c = n;
    if (o < h)
      n += o;
    else if (o > h) {
      A.error(`Malformed SEI payload. ${o} is too small, only ${h} bytes left to parse.`);
      break;
    }
    if (r === 4) {
      if (s[c++] === 181) {
        const d = Qs(s, c);
        if (c += 2, d === 49) {
          const f = $(s, c);
          if (c += 4, f === 1195456820) {
            const g = s[c++];
            if (g === 3) {
              const m = s[c++], T = 31 & m, y = 64 & m, E = y ? 2 + T * 3 : 0, x = new Uint8Array(E);
              if (y) {
                x[0] = m;
                for (let v = 1; v < E; v++)
                  x[v] = s[c++];
              }
              i.push({
                type: g,
                payloadType: r,
                pts: t,
                bytes: x
              });
            }
          }
        }
      }
    } else if (r === 5 && o > 16) {
      const u = [];
      for (let g = 0; g < 16; g++) {
        const m = s[c++].toString(16);
        u.push(m.length == 1 ? "0" + m : m), (g === 3 || g === 5 || g === 7 || g === 9) && u.push("-");
      }
      const d = o - 16, f = new Uint8Array(d);
      for (let g = 0; g < d; g++)
        f[g] = s[c++];
      i.push({
        payloadType: r,
        pts: t,
        uuid: u.join(""),
        userData: be(f),
        userDataBytes: f
      });
    }
  }
}
function sn(a) {
  const e = a.byteLength, t = [];
  let i = 1;
  for (; i < e - 2; )
    a[i] === 0 && a[i + 1] === 0 && a[i + 2] === 3 ? (t.push(i + 2), i += 2) : i++;
  if (t.length === 0)
    return a;
  const s = e - t.length, n = new Uint8Array(s);
  let r = 0;
  for (i = 0; i < s; r++, i++)
    r === t[0] && (r++, t.shift()), n[i] = a[r];
  return n;
}
function Vr(a) {
  const e = a[0];
  let t = "", i = "", s = 0, n = 0, r = 0, o = 0, l = 0, h = 0;
  if (e === 0) {
    for (; ne(a.subarray(h, h + 1)) !== "\0"; )
      t += ne(a.subarray(h, h + 1)), h += 1;
    for (t += ne(a.subarray(h, h + 1)), h += 1; ne(a.subarray(h, h + 1)) !== "\0"; )
      i += ne(a.subarray(h, h + 1)), h += 1;
    i += ne(a.subarray(h, h + 1)), h += 1, s = $(a, 12), n = $(a, 16), o = $(a, 20), l = $(a, 24), h = 28;
  } else if (e === 1) {
    h += 4, s = $(a, h), h += 4;
    const u = $(a, h);
    h += 4;
    const d = $(a, h);
    for (h += 4, r = 2 ** 32 * u + d, ar(r) || (r = Number.MAX_SAFE_INTEGER, A.warn("Presentation time exceeds safe integer limit and wrapped to max safe integer in parsing emsg box")), o = $(a, h), h += 4, l = $(a, h), h += 4; ne(a.subarray(h, h + 1)) !== "\0"; )
      t += ne(a.subarray(h, h + 1)), h += 1;
    for (t += ne(a.subarray(h, h + 1)), h += 1; ne(a.subarray(h, h + 1)) !== "\0"; )
      i += ne(a.subarray(h, h + 1)), h += 1;
    i += ne(a.subarray(h, h + 1)), h += 1;
  }
  const c = a.subarray(h, a.byteLength);
  return {
    schemeIdUri: t,
    value: i,
    timeScale: s,
    presentationTime: r,
    presentationTimeDelta: n,
    eventDuration: o,
    id: l,
    payload: c
  };
}
function Hr(a, ...e) {
  const t = e.length;
  let i = 8, s = t;
  for (; s--; )
    i += e[s].byteLength;
  const n = new Uint8Array(i);
  for (n[0] = i >> 24 & 255, n[1] = i >> 16 & 255, n[2] = i >> 8 & 255, n[3] = i & 255, n.set(a, 4), s = 0, i = 8; s < t; s++)
    n.set(e[s], i), i += e[s].byteLength;
  return n;
}
function Wr(a, e, t) {
  if (a.byteLength !== 16)
    throw new RangeError("Invalid system id");
  let i, s;
  if (e) {
    i = 1, s = new Uint8Array(e.length * 16);
    for (let o = 0; o < e.length; o++) {
      const l = e[o];
      if (l.byteLength !== 16)
        throw new RangeError("Invalid key");
      s.set(l, o * 16);
    }
  } else
    i = 0, s = new Uint8Array();
  let n;
  i > 0 ? (n = new Uint8Array(4), e.length > 0 && new DataView(n.buffer).setUint32(0, e.length, !1)) : n = new Uint8Array();
  const r = new Uint8Array(4);
  return t && t.byteLength > 0 && new DataView(r.buffer).setUint32(0, t.byteLength, !1), Hr(
    [112, 115, 115, 104],
    new Uint8Array([
      i,
      0,
      0,
      0
      // Flags
    ]),
    a,
    // 16 bytes
    n,
    s,
    r,
    t || new Uint8Array()
  );
}
function Yr(a) {
  if (!(a instanceof ArrayBuffer) || a.byteLength < 32)
    return null;
  const e = {
    version: 0,
    systemId: "",
    kids: null,
    data: null
  }, t = new DataView(a), i = t.getUint32(0);
  if (a.byteLength !== i && i > 44 || t.getUint32(4) !== 1886614376 || (e.version = t.getUint32(8) >>> 24, e.version > 1))
    return null;
  e.systemId = Se.hexDump(new Uint8Array(a, 12, 16));
  const n = t.getUint32(28);
  if (e.version === 0) {
    if (i - 32 < n)
      return null;
    e.data = new Uint8Array(a, 32, n);
  } else if (e.version === 1) {
    e.kids = [];
    for (let r = 0; r < n; r++)
      e.kids.push(new Uint8Array(a, 32 + r * 16, 16));
  }
  return e;
}
let at = {};
class st {
  static clearKeyUriToKeyIdMap() {
    at = {};
  }
  constructor(e, t, i, s = [1], n = null) {
    this.uri = void 0, this.method = void 0, this.keyFormat = void 0, this.keyFormatVersions = void 0, this.encrypted = void 0, this.isCommonEncryption = void 0, this.iv = null, this.key = null, this.keyId = null, this.pssh = null, this.method = e, this.uri = t, this.keyFormat = i, this.keyFormatVersions = s, this.iv = n, this.encrypted = e ? e !== "NONE" : !1, this.isCommonEncryption = this.encrypted && e !== "AES-128";
  }
  isSupported() {
    if (this.method) {
      if (this.method === "AES-128" || this.method === "NONE")
        return !0;
      if (this.keyFormat === "identity")
        return this.method === "SAMPLE-AES";
      switch (this.keyFormat) {
        case fe.FAIRPLAY:
        case fe.WIDEVINE:
        case fe.PLAYREADY:
        case fe.CLEARKEY:
          return ["ISO-23001-7", "SAMPLE-AES", "SAMPLE-AES-CENC", "SAMPLE-AES-CTR"].indexOf(this.method) !== -1;
      }
    }
    return !1;
  }
  getDecryptData(e) {
    if (!this.encrypted || !this.uri)
      return null;
    if (this.method === "AES-128" && this.uri && !this.iv) {
      typeof e != "number" && (this.method === "AES-128" && !this.iv && A.warn(`missing IV for initialization segment with method="${this.method}" - compliance issue`), e = 0);
      const i = qr(e);
      return new st(this.method, this.uri, "identity", this.keyFormatVersions, i);
    }
    const t = Er(this.uri);
    if (t)
      switch (this.keyFormat) {
        case fe.WIDEVINE:
          this.pssh = t, t.length >= 22 && (this.keyId = t.subarray(t.length - 22, t.length - 6));
          break;
        case fe.PLAYREADY: {
          const i = new Uint8Array([154, 4, 240, 121, 152, 64, 66, 134, 171, 146, 230, 91, 224, 136, 95, 149]);
          this.pssh = Wr(i, null, t);
          const s = new Uint16Array(t.buffer, t.byteOffset, t.byteLength / 2), n = String.fromCharCode.apply(null, Array.from(s)), r = n.substring(n.indexOf("<"), n.length), h = new DOMParser().parseFromString(r, "text/xml").getElementsByTagName("KID")[0];
          if (h) {
            const c = h.childNodes[0] ? h.childNodes[0].nodeValue : h.getAttribute("VALUE");
            if (c) {
              const u = Si(c).subarray(0, 16);
              yr(u), this.keyId = u;
            }
          }
          break;
        }
        default: {
          let i = t.subarray(0, 16);
          if (i.length !== 16) {
            const s = new Uint8Array(16);
            s.set(i, 16 - i.length), i = s;
          }
          this.keyId = i;
          break;
        }
      }
    if (!this.keyId || this.keyId.byteLength !== 16) {
      let i = at[this.uri];
      if (!i) {
        const s = Object.keys(at).length % Number.MAX_SAFE_INTEGER;
        i = new Uint8Array(16), new DataView(i.buffer, 12, 4).setUint32(0, s), at[this.uri] = i;
      }
      this.keyId = i;
    }
    return this;
  }
}
function qr(a) {
  const e = new Uint8Array(16);
  for (let t = 12; t < 16; t++)
    e[t] = a >> 8 * (15 - t) & 255;
  return e;
}
const nn = /\{\$([a-zA-Z0-9-_]+)\}/g;
function Yi(a) {
  return nn.test(a);
}
function de(a, e, t) {
  if (a.variableList !== null || a.hasVariableRefs)
    for (let i = t.length; i--; ) {
      const s = t[i], n = e[s];
      n && (e[s] = oi(a, n));
    }
}
function oi(a, e) {
  if (a.variableList !== null || a.hasVariableRefs) {
    const t = a.variableList;
    return e.replace(nn, (i) => {
      const s = i.substring(2, i.length - 1), n = t == null ? void 0 : t[s];
      return n === void 0 ? (a.playlistParsingError || (a.playlistParsingError = new Error(`Missing preceding EXT-X-DEFINE tag for Variable Reference: "${s}"`)), i) : n;
    });
  }
  return e;
}
function qi(a, e, t) {
  let i = a.variableList;
  i || (a.variableList = i = {});
  let s, n;
  if ("QUERYPARAM" in e) {
    s = e.QUERYPARAM;
    try {
      const r = new self.URL(t).searchParams;
      if (r.has(s))
        n = r.get(s);
      else
        throw new Error(`"${s}" does not match any query parameter in URI: "${t}"`);
    } catch (r) {
      a.playlistParsingError || (a.playlistParsingError = new Error(`EXT-X-DEFINE QUERYPARAM: ${r.message}`));
    }
  } else
    s = e.NAME, n = e.VALUE;
  s in i ? a.playlistParsingError || (a.playlistParsingError = new Error(`EXT-X-DEFINE duplicate Variable Name declarations: "${s}"`)) : i[s] = n || "";
}
function jr(a, e, t) {
  const i = e.IMPORT;
  if (t && i in t) {
    let s = a.variableList;
    s || (a.variableList = s = {}), s[i] = t[i];
  } else
    a.playlistParsingError || (a.playlistParsingError = new Error(`EXT-X-DEFINE IMPORT attribute not found in Multivariant Playlist: "${i}"`));
}
function Be(a = !0) {
  return typeof self > "u" ? void 0 : (a || !self.MediaSource) && self.ManagedMediaSource || self.MediaSource || self.WebKitMediaSource;
}
function zr(a) {
  return typeof self < "u" && a === self.ManagedMediaSource;
}
const Rt = {
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
function Xr(a, e) {
  const t = Rt[e];
  return !!t && !!t[a.slice(0, 4)];
}
function Vt(a, e, t = !0) {
  return !a.split(",").some((i) => !rn(i, e, t));
}
function rn(a, e, t = !0) {
  var i;
  const s = Be(t);
  return (i = s == null ? void 0 : s.isTypeSupported(nt(a, e))) != null ? i : !1;
}
function nt(a, e) {
  return `${e}/mp4;codecs="${a}"`;
}
function ji(a) {
  if (a) {
    const e = a.substring(0, 4);
    return Rt.video[e];
  }
  return 2;
}
function bt(a) {
  return a.split(",").reduce((e, t) => {
    const i = Rt.video[t];
    return i ? (i * 2 + e) / (e ? 3 : 2) : (Rt.audio[t] + e) / (e ? 2 : 1);
  }, 0);
}
const Ht = {};
function Qr(a, e = !0) {
  if (Ht[a])
    return Ht[a];
  const t = {
    flac: ["flac", "fLaC", "FLAC"],
    opus: ["opus", "Opus"]
  }[a];
  for (let i = 0; i < t.length; i++)
    if (rn(t[i], "audio", e))
      return Ht[a] = t[i], t[i];
  return a;
}
const Jr = /flac|opus/i;
function It(a, e = !0) {
  return a.replace(Jr, (t) => Qr(t.toLowerCase(), e));
}
function zi(a, e) {
  return a && a !== "mp4a" ? a : e && e.split(",")[0];
}
function Zr(a) {
  const e = a.split(",");
  for (let t = 0; t < e.length; t++) {
    const i = e[t].split(".");
    if (i.length > 2) {
      let s = i.shift() + ".";
      s += parseInt(i.shift()).toString(16), s += ("000" + parseInt(i.shift()).toString(16)).slice(-4), e[t] = s;
    }
  }
  return e.join(",");
}
const Xi = /#EXT-X-STREAM-INF:([^\r\n]*)(?:[\r\n](?:#[^\r\n]*)?)*([^\r\n]+)|#EXT-X-(SESSION-DATA|SESSION-KEY|DEFINE|CONTENT-STEERING|START):([^\r\n]*)[\r\n]+/g, Qi = /#EXT-X-MEDIA:(.*)/g, ea = /^#EXT(?:INF|-X-TARGETDURATION):/m, Ji = new RegExp([
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
].join("|"), "g"), ta = new RegExp([/#(EXTM3U)/.source, /#EXT-X-(DATERANGE|DEFINE|KEY|MAP|PART|PART-INF|PLAYLIST-TYPE|PRELOAD-HINT|RENDITION-REPORT|SERVER-CONTROL|SKIP|START):(.+)/.source, /#EXT-X-(BITRATE|DISCONTINUITY-SEQUENCE|MEDIA-SEQUENCE|TARGETDURATION|VERSION): *(\d+)/.source, /#EXT-X-(DISCONTINUITY|ENDLIST|GAP|INDEPENDENT-SEGMENTS)/.source, /(#)([^:]*):(.*)/.source, /(#)(.*)(?:.*)\r?\n?/.source].join("|"));
class Le {
  static findGroup(e, t) {
    for (let i = 0; i < e.length; i++) {
      const s = e[i];
      if (s.id === t)
        return s;
    }
  }
  static resolve(e, t) {
    return xi.buildAbsoluteURL(t, e, {
      alwaysNormalize: !0
    });
  }
  static isMediaPlaylist(e) {
    return ea.test(e);
  }
  static parseMasterPlaylist(e, t) {
    const i = Yi(e), s = {
      contentSteering: null,
      levels: [],
      playlistParsingError: null,
      sessionData: null,
      sessionKeys: null,
      startTimeOffset: null,
      variableList: null,
      hasVariableRefs: i
    }, n = [];
    Xi.lastIndex = 0;
    let r;
    for (; (r = Xi.exec(e)) != null; )
      if (r[1]) {
        var o;
        const h = new te(r[1]);
        de(s, h, ["CODECS", "SUPPLEMENTAL-CODECS", "ALLOWED-CPC", "PATHWAY-ID", "STABLE-VARIANT-ID", "AUDIO", "VIDEO", "SUBTITLES", "CLOSED-CAPTIONS", "NAME"]);
        const c = oi(s, r[2]), u = {
          attrs: h,
          bitrate: h.decimalInteger("BANDWIDTH") || h.decimalInteger("AVERAGE-BANDWIDTH"),
          name: h.NAME,
          url: Le.resolve(c, t)
        }, d = h.decimalResolution("RESOLUTION");
        d && (u.width = d.width, u.height = d.height), ia(h.CODECS, u), (o = u.unknownCodecs) != null && o.length || n.push(u), s.levels.push(u);
      } else if (r[3]) {
        const h = r[3], c = r[4];
        switch (h) {
          case "SESSION-DATA": {
            const u = new te(c);
            de(s, u, ["DATA-ID", "LANGUAGE", "VALUE", "URI"]);
            const d = u["DATA-ID"];
            d && (s.sessionData === null && (s.sessionData = {}), s.sessionData[d] = u);
            break;
          }
          case "SESSION-KEY": {
            const u = Zi(c, t, s);
            u.encrypted && u.isSupported() ? (s.sessionKeys === null && (s.sessionKeys = []), s.sessionKeys.push(u)) : A.warn(`[Keys] Ignoring invalid EXT-X-SESSION-KEY tag: "${c}"`);
            break;
          }
          case "DEFINE": {
            {
              const u = new te(c);
              de(s, u, ["NAME", "VALUE", "QUERYPARAM"]), qi(s, u, t);
            }
            break;
          }
          case "CONTENT-STEERING": {
            const u = new te(c);
            de(s, u, ["SERVER-URI", "PATHWAY-ID"]), s.contentSteering = {
              uri: Le.resolve(u["SERVER-URI"], t),
              pathwayId: u["PATHWAY-ID"] || "."
            };
            break;
          }
          case "START": {
            s.startTimeOffset = es(c);
            break;
          }
        }
      }
    const l = n.length > 0 && n.length < s.levels.length;
    return s.levels = l ? n : s.levels, s.levels.length === 0 && (s.playlistParsingError = new Error("no levels found in manifest")), s;
  }
  static parseMasterPlaylistMedia(e, t, i) {
    let s;
    const n = {}, r = i.levels, o = {
      AUDIO: r.map((h) => ({
        id: h.attrs.AUDIO,
        audioCodec: h.audioCodec
      })),
      SUBTITLES: r.map((h) => ({
        id: h.attrs.SUBTITLES,
        textCodec: h.textCodec
      })),
      "CLOSED-CAPTIONS": []
    };
    let l = 0;
    for (Qi.lastIndex = 0; (s = Qi.exec(e)) !== null; ) {
      const h = new te(s[1]), c = h.TYPE;
      if (c) {
        const u = o[c], d = n[c] || [];
        n[c] = d, de(i, h, ["URI", "GROUP-ID", "LANGUAGE", "ASSOC-LANGUAGE", "STABLE-RENDITION-ID", "NAME", "INSTREAM-ID", "CHARACTERISTICS", "CHANNELS"]);
        const f = h.LANGUAGE, g = h["ASSOC-LANGUAGE"], m = h.CHANNELS, T = h.CHARACTERISTICS, y = h["INSTREAM-ID"], E = {
          attrs: h,
          bitrate: 0,
          id: l++,
          groupId: h["GROUP-ID"] || "",
          name: h.NAME || f || "",
          type: c,
          default: h.bool("DEFAULT"),
          autoselect: h.bool("AUTOSELECT"),
          forced: h.bool("FORCED"),
          lang: f,
          url: h.URI ? Le.resolve(h.URI, t) : ""
        };
        if (g && (E.assocLang = g), m && (E.channels = m), T && (E.characteristics = T), y && (E.instreamId = y), u != null && u.length) {
          const x = Le.findGroup(u, E.groupId) || u[0];
          ts(E, x, "audioCodec"), ts(E, x, "textCodec");
        }
        d.push(E);
      }
    }
    return n;
  }
  static parseLevelPlaylist(e, t, i, s, n, r) {
    const o = new pr(t), l = o.fragments;
    let h = null, c = 0, u = 0, d = 0, f = 0, g = null, m = new Ut(s, t), T, y, E, x = -1, v = !1, S = null;
    for (Ji.lastIndex = 0, o.m3u8 = e, o.hasVariableRefs = Yi(e); (T = Ji.exec(e)) !== null; ) {
      v && (v = !1, m = new Ut(s, t), m.start = d, m.sn = c, m.cc = f, m.level = i, h && (m.initSegment = h, m.rawProgramDateTime = h.rawProgramDateTime, h.rawProgramDateTime = null, S && (m.setByteRange(S), S = null)));
      const D = T[1];
      if (D) {
        m.duration = parseFloat(D);
        const w = (" " + T[2]).slice(1);
        m.title = w || null, m.tagList.push(w ? ["INF", D, w] : ["INF", D]);
      } else if (T[3]) {
        if (M(m.duration)) {
          m.start = d, E && ns(m, E, o), m.sn = c, m.level = i, m.cc = f, l.push(m);
          const w = (" " + T[3]).slice(1);
          m.relurl = oi(o, w), is(m, g), g = m, d += m.duration, c++, u = 0, v = !0;
        }
      } else if (T[4]) {
        const w = (" " + T[4]).slice(1);
        g ? m.setByteRange(w, g) : m.setByteRange(w);
      } else if (T[5])
        m.rawProgramDateTime = (" " + T[5]).slice(1), m.tagList.push(["PROGRAM-DATE-TIME", m.rawProgramDateTime]), x === -1 && (x = l.length);
      else {
        if (T = T[0].match(ta), !T) {
          A.warn("No matches on slow regex match for level playlist!");
          continue;
        }
        for (y = 1; y < T.length && !(typeof T[y] < "u"); y++)
          ;
        const w = (" " + T[y]).slice(1), _ = (" " + T[y + 1]).slice(1), O = T[y + 2] ? (" " + T[y + 2]).slice(1) : "";
        switch (w) {
          case "PLAYLIST-TYPE":
            o.type = _.toUpperCase();
            break;
          case "MEDIA-SEQUENCE":
            c = o.startSN = parseInt(_);
            break;
          case "SKIP": {
            const P = new te(_);
            de(o, P, ["RECENTLY-REMOVED-DATERANGES"]);
            const K = P.decimalInteger("SKIPPED-SEGMENTS");
            if (M(K)) {
              o.skippedSegments = K;
              for (let U = K; U--; )
                l.unshift(null);
              c += K;
            }
            const N = P.enumeratedString("RECENTLY-REMOVED-DATERANGES");
            N && (o.recentlyRemovedDateranges = N.split("	"));
            break;
          }
          case "TARGETDURATION":
            o.targetduration = Math.max(parseInt(_), 1);
            break;
          case "VERSION":
            o.version = parseInt(_);
            break;
          case "INDEPENDENT-SEGMENTS":
          case "EXTM3U":
            break;
          case "ENDLIST":
            o.live = !1;
            break;
          case "#":
            (_ || O) && m.tagList.push(O ? [_, O] : [_]);
            break;
          case "DISCONTINUITY":
            f++, m.tagList.push(["DIS"]);
            break;
          case "GAP":
            m.gap = !0, m.tagList.push([w]);
            break;
          case "BITRATE":
            m.tagList.push([w, _]);
            break;
          case "DATERANGE": {
            const P = new te(_);
            de(o, P, ["ID", "CLASS", "START-DATE", "END-DATE", "SCTE35-CMD", "SCTE35-OUT", "SCTE35-IN"]), de(o, P, P.clientAttrs);
            const K = new Vs(P, o.dateRanges[P.ID]);
            K.isValid || o.skippedSegments ? o.dateRanges[K.id] = K : A.warn(`Ignoring invalid DATERANGE tag: "${_}"`), m.tagList.push(["EXT-X-DATERANGE", _]);
            break;
          }
          case "DEFINE": {
            {
              const P = new te(_);
              de(o, P, ["NAME", "VALUE", "IMPORT", "QUERYPARAM"]), "IMPORT" in P ? jr(o, P, r) : qi(o, P, t);
            }
            break;
          }
          case "DISCONTINUITY-SEQUENCE":
            f = parseInt(_);
            break;
          case "KEY": {
            const P = Zi(_, t, o);
            if (P.isSupported()) {
              if (P.method === "NONE") {
                E = void 0;
                break;
              }
              E || (E = {}), E[P.keyFormat] && (E = se({}, E)), E[P.keyFormat] = P;
            } else
              A.warn(`[Keys] Ignoring invalid EXT-X-KEY tag: "${_}"`);
            break;
          }
          case "START":
            o.startTimeOffset = es(_);
            break;
          case "MAP": {
            const P = new te(_);
            if (de(o, P, ["BYTERANGE", "URI"]), m.duration) {
              const K = new Ut(s, t);
              ss(K, P, i, E), h = K, m.initSegment = h, h.rawProgramDateTime && !m.rawProgramDateTime && (m.rawProgramDateTime = h.rawProgramDateTime);
            } else {
              const K = m.byteRangeEndOffset;
              if (K) {
                const N = m.byteRangeStartOffset;
                S = `${K - N}@${N}`;
              } else
                S = null;
              ss(m, P, i, E), h = m, v = !0;
            }
            break;
          }
          case "SERVER-CONTROL": {
            const P = new te(_);
            o.canBlockReload = P.bool("CAN-BLOCK-RELOAD"), o.canSkipUntil = P.optionalFloat("CAN-SKIP-UNTIL", 0), o.canSkipDateRanges = o.canSkipUntil > 0 && P.bool("CAN-SKIP-DATERANGES"), o.partHoldBack = P.optionalFloat("PART-HOLD-BACK", 0), o.holdBack = P.optionalFloat("HOLD-BACK", 0);
            break;
          }
          case "PART-INF": {
            const P = new te(_);
            o.partTarget = P.decimalFloatingPoint("PART-TARGET");
            break;
          }
          case "PART": {
            let P = o.partList;
            P || (P = o.partList = []);
            const K = u > 0 ? P[P.length - 1] : void 0, N = u++, U = new te(_);
            de(o, U, ["BYTERANGE", "URI"]);
            const q = new gr(U, m, t, N, K);
            P.push(q), m.duration += q.duration;
            break;
          }
          case "PRELOAD-HINT": {
            const P = new te(_);
            de(o, P, ["URI"]), o.preloadHint = P;
            break;
          }
          case "RENDITION-REPORT": {
            const P = new te(_);
            de(o, P, ["URI"]), o.renditionReports = o.renditionReports || [], o.renditionReports.push(P);
            break;
          }
          default:
            A.warn(`line parsed but not handled: ${T}`);
            break;
        }
      }
    }
    g && !g.relurl ? (l.pop(), d -= g.duration, o.partList && (o.fragmentHint = g)) : o.partList && (is(m, g), m.cc = f, o.fragmentHint = m, E && ns(m, E, o));
    const C = l.length, R = l[0], I = l[C - 1];
    if (d += o.skippedSegments * o.targetduration, d > 0 && C && I) {
      o.averagetargetduration = d / C;
      const D = I.sn;
      o.endSN = D !== "initSegment" ? D : 0, o.live || (I.endList = !0), R && (o.startCC = R.cc);
    } else
      o.endSN = 0, o.startCC = 0;
    return o.fragmentHint && (d += o.fragmentHint.duration), o.totalduration = d, o.endCC = f, x > 0 && sa(l, x), o;
  }
}
function Zi(a, e, t) {
  var i, s;
  const n = new te(a);
  de(t, n, ["KEYFORMAT", "KEYFORMATVERSIONS", "URI", "IV", "URI"]);
  const r = (i = n.METHOD) != null ? i : "", o = n.URI, l = n.hexadecimalInteger("IV"), h = n.KEYFORMATVERSIONS, c = (s = n.KEYFORMAT) != null ? s : "identity";
  o && n.IV && !l && A.error(`Invalid IV: ${n.IV}`);
  const u = o ? Le.resolve(o, e) : "", d = (h || "1").split("/").map(Number).filter(Number.isFinite);
  return new st(r, u, c, d, l);
}
function es(a) {
  const t = new te(a).decimalFloatingPoint("TIME-OFFSET");
  return M(t) ? t : null;
}
function ia(a, e) {
  let t = (a || "").split(/[ ,]+/).filter((i) => i);
  ["video", "audio", "text"].forEach((i) => {
    const s = t.filter((n) => Xr(n, i));
    s.length && (e[`${i}Codec`] = s.join(","), t = t.filter((n) => s.indexOf(n) === -1));
  }), e.unknownCodecs = t;
}
function ts(a, e, t) {
  const i = e[t];
  i && (a[t] = i);
}
function sa(a, e) {
  let t = a[e];
  for (let i = e; i--; ) {
    const s = a[i];
    if (!s)
      return;
    s.programDateTime = t.programDateTime - s.duration * 1e3, t = s;
  }
}
function is(a, e) {
  a.rawProgramDateTime ? a.programDateTime = Date.parse(a.rawProgramDateTime) : e != null && e.programDateTime && (a.programDateTime = e.endProgramDateTime), M(a.programDateTime) || (a.programDateTime = null, a.rawProgramDateTime = null);
}
function ss(a, e, t, i) {
  a.relurl = e.URI, e.BYTERANGE && a.setByteRange(e.BYTERANGE), a.level = t, a.sn = "initSegment", i && (a.levelkeys = i), a.initSegment = null;
}
function ns(a, e, t) {
  a.levelkeys = e;
  const {
    encryptedFragments: i
  } = t;
  (!i.length || i[i.length - 1].levelkeys !== e) && Object.keys(e).some((s) => e[s].isCommonEncryption) && i.push(a);
}
var Y = {
  MANIFEST: "manifest",
  LEVEL: "level",
  AUDIO_TRACK: "audioTrack",
  SUBTITLE_TRACK: "subtitleTrack"
}, G = {
  MAIN: "main",
  AUDIO: "audio",
  SUBTITLE: "subtitle"
};
function rs(a) {
  const {
    type: e
  } = a;
  switch (e) {
    case Y.AUDIO_TRACK:
      return G.AUDIO;
    case Y.SUBTITLE_TRACK:
      return G.SUBTITLE;
    default:
      return G.MAIN;
  }
}
function Wt(a, e) {
  let t = a.url;
  return (t === void 0 || t.indexOf("data:") === 0) && (t = e.url), t;
}
class na {
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
    e.on(p.MANIFEST_LOADING, this.onManifestLoading, this), e.on(p.LEVEL_LOADING, this.onLevelLoading, this), e.on(p.AUDIO_TRACK_LOADING, this.onAudioTrackLoading, this), e.on(p.SUBTITLE_TRACK_LOADING, this.onSubtitleTrackLoading, this);
  }
  unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(p.MANIFEST_LOADING, this.onManifestLoading, this), e.off(p.LEVEL_LOADING, this.onLevelLoading, this), e.off(p.AUDIO_TRACK_LOADING, this.onAudioTrackLoading, this), e.off(p.SUBTITLE_TRACK_LOADING, this.onSubtitleTrackLoading, this);
  }
  /**
   * Returns defaults or configured loader-type overloads (pLoader and loader config params)
   */
  createInternalLoader(e) {
    const t = this.hls.config, i = t.pLoader, s = t.loader, n = i || s, r = new n(t);
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
      url: i
    } = t;
    this.variableList = null, this.load({
      id: null,
      level: 0,
      responseType: "text",
      type: Y.MANIFEST,
      url: i,
      deliveryDirectives: null
    });
  }
  onLevelLoading(e, t) {
    const {
      id: i,
      level: s,
      pathwayId: n,
      url: r,
      deliveryDirectives: o
    } = t;
    this.load({
      id: i,
      level: s,
      pathwayId: n,
      responseType: "text",
      type: Y.LEVEL,
      url: r,
      deliveryDirectives: o
    });
  }
  onAudioTrackLoading(e, t) {
    const {
      id: i,
      groupId: s,
      url: n,
      deliveryDirectives: r
    } = t;
    this.load({
      id: i,
      groupId: s,
      level: null,
      responseType: "text",
      type: Y.AUDIO_TRACK,
      url: n,
      deliveryDirectives: r
    });
  }
  onSubtitleTrackLoading(e, t) {
    const {
      id: i,
      groupId: s,
      url: n,
      deliveryDirectives: r
    } = t;
    this.load({
      id: i,
      groupId: s,
      level: null,
      responseType: "text",
      type: Y.SUBTITLE_TRACK,
      url: n,
      deliveryDirectives: r
    });
  }
  load(e) {
    var t;
    const i = this.hls.config;
    let s = this.getInternalLoader(e);
    if (s) {
      const h = s.context;
      if (h && h.url === e.url && h.level === e.level) {
        A.trace("[playlist-loader]: playlist request ongoing");
        return;
      }
      A.log(`[playlist-loader]: aborting previous loader for type: ${e.type}`), s.abort();
    }
    let n;
    if (e.type === Y.MANIFEST ? n = i.manifestLoadPolicy.default : n = se({}, i.playlistLoadPolicy.default, {
      timeoutRetry: null,
      errorRetry: null
    }), s = this.createInternalLoader(e), M((t = e.deliveryDirectives) == null ? void 0 : t.part)) {
      let h;
      if (e.type === Y.LEVEL && e.level !== null ? h = this.hls.levels[e.level].details : e.type === Y.AUDIO_TRACK && e.id !== null ? h = this.hls.audioTracks[e.id].details : e.type === Y.SUBTITLE_TRACK && e.id !== null && (h = this.hls.subtitleTracks[e.id].details), h) {
        const c = h.partTarget, u = h.targetduration;
        if (c && u) {
          const d = Math.max(c * 3, u * 0.8) * 1e3;
          n = se({}, n, {
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
      onSuccess: (h, c, u, d) => {
        const f = this.getInternalLoader(u);
        this.resetInternalLoader(u.type);
        const g = h.data;
        if (g.indexOf("#EXTM3U") !== 0) {
          this.handleManifestParsingError(h, u, new Error("no EXTM3U delimiter"), d || null, c);
          return;
        }
        c.parsing.start = performance.now(), Le.isMediaPlaylist(g) ? this.handleTrackOrLevelPlaylist(h, c, u, d || null, f) : this.handleMasterPlaylist(h, c, u, d);
      },
      onError: (h, c, u, d) => {
        this.handleNetworkError(c, u, !1, h, d);
      },
      onTimeout: (h, c, u) => {
        this.handleNetworkError(c, u, !0, void 0, h);
      }
    };
    s.load(e, o, l);
  }
  handleMasterPlaylist(e, t, i, s) {
    const n = this.hls, r = e.data, o = Wt(e, i), l = Le.parseMasterPlaylist(r, o);
    if (l.playlistParsingError) {
      this.handleManifestParsingError(e, i, l.playlistParsingError, s, t);
      return;
    }
    const {
      contentSteering: h,
      levels: c,
      sessionData: u,
      sessionKeys: d,
      startTimeOffset: f,
      variableList: g
    } = l;
    this.variableList = g;
    const {
      AUDIO: m = [],
      SUBTITLES: T,
      "CLOSED-CAPTIONS": y
    } = Le.parseMasterPlaylistMedia(r, o, l);
    m.length && !m.some((x) => !x.url) && c[0].audioCodec && !c[0].attrs.AUDIO && (A.log("[playlist-loader]: audio codec signaled in quality level, but no embedded audio track signaled, create one"), m.unshift({
      type: "main",
      name: "main",
      groupId: "main",
      default: !1,
      autoselect: !1,
      forced: !1,
      id: -1,
      attrs: new te({}),
      bitrate: 0,
      url: ""
    })), n.trigger(p.MANIFEST_LOADED, {
      levels: c,
      audioTracks: m,
      subtitles: T,
      captions: y,
      contentSteering: h,
      url: o,
      stats: t,
      networkDetails: s,
      sessionData: u,
      sessionKeys: d,
      startTimeOffset: f,
      variableList: g
    });
  }
  handleTrackOrLevelPlaylist(e, t, i, s, n) {
    const r = this.hls, {
      id: o,
      level: l,
      type: h
    } = i, c = Wt(e, i), u = 0, d = M(l) ? l : M(o) ? o : 0, f = rs(i), g = Le.parseLevelPlaylist(e.data, c, d, f, u, this.variableList);
    if (h === Y.MANIFEST) {
      const m = {
        attrs: new te({}),
        bitrate: 0,
        details: g,
        name: "",
        url: c
      };
      r.trigger(p.MANIFEST_LOADED, {
        levels: [m],
        audioTracks: [],
        url: c,
        stats: t,
        networkDetails: s,
        sessionData: null,
        sessionKeys: null,
        contentSteering: null,
        startTimeOffset: null,
        variableList: null
      });
    }
    t.parsing.end = performance.now(), i.levelDetails = g, this.handlePlaylistLoaded(g, e, t, i, s, n);
  }
  handleManifestParsingError(e, t, i, s, n) {
    this.hls.trigger(p.ERROR, {
      type: V.NETWORK_ERROR,
      details: b.MANIFEST_PARSING_ERROR,
      fatal: t.type === Y.MANIFEST,
      url: e.url,
      err: i,
      error: i,
      reason: i.message,
      response: e,
      context: t,
      networkDetails: s,
      stats: n
    });
  }
  handleNetworkError(e, t, i = !1, s, n) {
    let r = `A network ${i ? "timeout" : "error" + (s ? " (status " + s.code + ")" : "")} occurred while loading ${e.type}`;
    e.type === Y.LEVEL ? r += `: ${e.level} id: ${e.id}` : (e.type === Y.AUDIO_TRACK || e.type === Y.SUBTITLE_TRACK) && (r += ` id: ${e.id} group-id: "${e.groupId}"`);
    const o = new Error(r);
    A.warn(`[playlist-loader]: ${r}`);
    let l = b.UNKNOWN, h = !1;
    const c = this.getInternalLoader(e);
    switch (e.type) {
      case Y.MANIFEST:
        l = i ? b.MANIFEST_LOAD_TIMEOUT : b.MANIFEST_LOAD_ERROR, h = !0;
        break;
      case Y.LEVEL:
        l = i ? b.LEVEL_LOAD_TIMEOUT : b.LEVEL_LOAD_ERROR, h = !1;
        break;
      case Y.AUDIO_TRACK:
        l = i ? b.AUDIO_TRACK_LOAD_TIMEOUT : b.AUDIO_TRACK_LOAD_ERROR, h = !1;
        break;
      case Y.SUBTITLE_TRACK:
        l = i ? b.SUBTITLE_TRACK_LOAD_TIMEOUT : b.SUBTITLE_LOAD_ERROR, h = !1;
        break;
    }
    c && this.resetInternalLoader(e.type);
    const u = {
      type: V.NETWORK_ERROR,
      details: l,
      fatal: h,
      url: e.url,
      loader: c,
      context: e,
      error: o,
      networkDetails: t,
      stats: n
    };
    if (s) {
      const d = (t == null ? void 0 : t.url) || e.url;
      u.response = le({
        url: d,
        data: void 0
      }, s);
    }
    this.hls.trigger(p.ERROR, u);
  }
  handlePlaylistLoaded(e, t, i, s, n, r) {
    const o = this.hls, {
      type: l,
      level: h,
      id: c,
      groupId: u,
      deliveryDirectives: d
    } = s, f = Wt(t, s), g = rs(s), m = typeof s.level == "number" && g === G.MAIN ? h : void 0;
    if (!e.fragments.length) {
      const y = new Error("No Segments found in Playlist");
      o.trigger(p.ERROR, {
        type: V.NETWORK_ERROR,
        details: b.LEVEL_EMPTY_ERROR,
        fatal: !1,
        url: f,
        error: y,
        reason: y.message,
        response: t,
        context: s,
        level: m,
        parent: g,
        networkDetails: n,
        stats: i
      });
      return;
    }
    e.targetduration || (e.playlistParsingError = new Error("Missing Target Duration"));
    const T = e.playlistParsingError;
    if (T) {
      o.trigger(p.ERROR, {
        type: V.NETWORK_ERROR,
        details: b.LEVEL_PARSING_ERROR,
        fatal: !1,
        url: f,
        error: T,
        reason: T.message,
        response: t,
        context: s,
        level: m,
        parent: g,
        networkDetails: n,
        stats: i
      });
      return;
    }
    switch (e.live && r && (r.getCacheAge && (e.ageHeader = r.getCacheAge() || 0), (!r.getCacheAge || isNaN(e.ageHeader)) && (e.ageHeader = 0)), l) {
      case Y.MANIFEST:
      case Y.LEVEL:
        o.trigger(p.LEVEL_LOADED, {
          details: e,
          level: m || 0,
          id: c || 0,
          stats: i,
          networkDetails: n,
          deliveryDirectives: d
        });
        break;
      case Y.AUDIO_TRACK:
        o.trigger(p.AUDIO_TRACK_LOADED, {
          details: e,
          id: c || 0,
          groupId: u || "",
          stats: i,
          networkDetails: n,
          deliveryDirectives: d
        });
        break;
      case Y.SUBTITLE_TRACK:
        o.trigger(p.SUBTITLE_TRACK_LOADED, {
          details: e,
          id: c || 0,
          groupId: u || "",
          stats: i,
          networkDetails: n,
          deliveryDirectives: d
        });
        break;
    }
  }
}
function an(a, e) {
  let t;
  try {
    t = new Event("addtrack");
  } catch {
    t = document.createEvent("Event"), t.initEvent("addtrack", !1, !1);
  }
  t.track = a, e.dispatchEvent(t);
}
function on(a, e) {
  const t = a.mode;
  if (t === "disabled" && (a.mode = "hidden"), a.cues && !a.cues.getCueById(e.id))
    try {
      if (a.addCue(e), !a.cues.getCueById(e.id))
        throw new Error(`addCue is failed for: ${e}`);
    } catch (i) {
      A.debug(`[texttrack-utils]: ${i}`);
      try {
        const s = new self.TextTrackCue(e.startTime, e.endTime, e.text);
        s.id = e.id, a.addCue(s);
      } catch (s) {
        A.debug(`[texttrack-utils]: Legacy TextTrackCue fallback failed: ${s}`);
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
function li(a, e, t, i) {
  const s = a.mode;
  if (s === "disabled" && (a.mode = "hidden"), a.cues && a.cues.length > 0) {
    const n = aa(a.cues, e, t);
    for (let r = 0; r < n.length; r++)
      (!i || i(n[r])) && a.removeCue(n[r]);
  }
  s === "disabled" && (a.mode = s);
}
function ra(a, e) {
  if (e < a[0].startTime)
    return 0;
  const t = a.length - 1;
  if (e > a[t].endTime)
    return -1;
  let i = 0, s = t;
  for (; i <= s; ) {
    const n = Math.floor((s + i) / 2);
    if (e < a[n].startTime)
      s = n - 1;
    else if (e > a[n].startTime && i < t)
      i = n + 1;
    else
      return n;
  }
  return a[i].startTime - e < e - a[s].startTime ? i : s;
}
function aa(a, e, t) {
  const i = [], s = ra(a, e);
  if (s > -1)
    for (let n = s, r = a.length; n < r; n++) {
      const o = a[n];
      if (o.startTime >= e && o.endTime <= t)
        i.push(o);
      else if (o.startTime > t)
        return i;
    }
  return i;
}
function pt(a) {
  const e = [];
  for (let t = 0; t < a.length; t++) {
    const i = a[t];
    (i.kind === "subtitles" || i.kind === "captions") && i.label && e.push(a[t]);
  }
  return e;
}
var ve = {
  audioId3: "org.id3",
  dateRange: "com.apple.quicktime.HLS",
  emsg: "https://aomedia.org/emsg/ID3"
};
const oa = 0.25;
function hi() {
  if (!(typeof self > "u"))
    return self.VTTCue || self.TextTrackCue;
}
function as(a, e, t, i, s) {
  let n = new a(e, t, "");
  try {
    n.value = i, s && (n.type = s);
  } catch {
    n = new a(e, t, JSON.stringify(s ? le({
      type: s
    }, i) : i));
  }
  return n;
}
const ot = (() => {
  const a = hi();
  try {
    a && new a(0, Number.POSITIVE_INFINITY, "");
  } catch {
    return Number.MAX_VALUE;
  }
  return Number.POSITIVE_INFINITY;
})();
function Yt(a, e) {
  return a.getTime() / 1e3 - e;
}
function la(a) {
  return Uint8Array.from(a.replace(/^0x/, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")).buffer;
}
class ha {
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
    e.on(p.MEDIA_ATTACHED, this.onMediaAttached, this), e.on(p.MEDIA_DETACHING, this.onMediaDetaching, this), e.on(p.MANIFEST_LOADING, this.onManifestLoading, this), e.on(p.FRAG_PARSING_METADATA, this.onFragParsingMetadata, this), e.on(p.BUFFER_FLUSHING, this.onBufferFlushing, this), e.on(p.LEVEL_UPDATED, this.onLevelUpdated, this);
  }
  _unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(p.MEDIA_ATTACHED, this.onMediaAttached, this), e.off(p.MEDIA_DETACHING, this.onMediaDetaching, this), e.off(p.MANIFEST_LOADING, this.onManifestLoading, this), e.off(p.FRAG_PARSING_METADATA, this.onFragParsingMetadata, this), e.off(p.BUFFER_FLUSHING, this.onBufferFlushing, this), e.off(p.LEVEL_UPDATED, this.onLevelUpdated, this);
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
        const i = e[t];
        if (i.kind === "metadata" && i.label === "id3")
          return an(i, this.media), i;
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
          enableEmsgMetadataCues: i,
          enableID3MetadataCues: s
        }
      }
    } = this;
    if (!i && !s)
      return;
    const {
      samples: n
    } = t;
    this.id3Track || (this.id3Track = this.createTrack(this.media));
    const r = hi();
    if (r)
      for (let o = 0; o < n.length; o++) {
        const l = n[o].type;
        if (l === ve.emsg && !i || !s)
          continue;
        const h = zs(n[o].data);
        if (h) {
          const c = n[o].pts;
          let u = c + n[o].duration;
          u > ot && (u = ot), u - c <= 0 && (u = c + oa);
          for (let f = 0; f < h.length; f++) {
            const g = h[f];
            if (!js(g)) {
              this.updateId3CueEnds(c, l);
              const m = as(r, c, u, g, l);
              m && this.id3Track.addCue(m);
            }
          }
        }
      }
  }
  updateId3CueEnds(e, t) {
    var i;
    const s = (i = this.id3Track) == null ? void 0 : i.cues;
    if (s)
      for (let n = s.length; n--; ) {
        const r = s[n];
        r.type === t && r.startTime < e && r.endTime === ot && (r.endTime = e);
      }
  }
  onBufferFlushing(e, {
    startOffset: t,
    endOffset: i,
    type: s
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
      let h;
      s === "audio" ? h = (c) => c.type === ve.audioId3 && l : s === "video" ? h = (c) => c.type === ve.emsg && o : h = (c) => c.type === ve.audioId3 && l || c.type === ve.emsg && o, li(n, t, i, h);
    }
  }
  onLevelUpdated(e, {
    details: t
  }) {
    if (!this.media || !t.hasProgramDateTime || !this.hls.config.enableDateRangeMetadataCues)
      return;
    const {
      dateRangeCuesAppended: i,
      id3Track: s
    } = this, {
      dateRanges: n
    } = t, r = Object.keys(n);
    if (s) {
      const c = Object.keys(i).filter((u) => !r.includes(u));
      for (let u = c.length; u--; ) {
        const d = c[u];
        Object.keys(i[d].cues).forEach((f) => {
          s.removeCue(i[d].cues[f]);
        }), delete i[d];
      }
    }
    const o = t.fragments[t.fragments.length - 1];
    if (r.length === 0 || !M(o == null ? void 0 : o.programDateTime))
      return;
    this.id3Track || (this.id3Track = this.createTrack(this.media));
    const l = o.programDateTime / 1e3 - o.start, h = hi();
    for (let c = 0; c < r.length; c++) {
      const u = r[c], d = n[u], f = Yt(d.startDate, l), g = i[u], m = (g == null ? void 0 : g.cues) || {};
      let T = (g == null ? void 0 : g.durationKnown) || !1, y = ot;
      const E = d.endDate;
      if (E)
        y = Yt(E, l), T = !0;
      else if (d.endOnNext && !T) {
        const v = r.reduce((S, C) => {
          if (C !== d.id) {
            const R = n[C];
            if (R.class === d.class && R.startDate > d.startDate && (!S || d.startDate < S.startDate))
              return R;
          }
          return S;
        }, null);
        v && (y = Yt(v.startDate, l), T = !0);
      }
      const x = Object.keys(d.attr);
      for (let v = 0; v < x.length; v++) {
        const S = x[v];
        if (!dr(S))
          continue;
        const C = m[S];
        if (C)
          T && !g.durationKnown && (C.endTime = y);
        else if (h) {
          let R = d.attr[S];
          fr(S) && (R = la(R));
          const I = as(h, f, y, {
            key: S,
            data: R
          }, ve.dateRange);
          I && (I.id = u, this.id3Track.addCue(I), m[S] = I);
        }
      }
      i[u] = {
        cues: m,
        dateRange: d,
        durationKnown: T
      };
    }
  }
}
class ca {
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
      partHoldBack: i,
      targetduration: s
    } = e, {
      liveSyncDuration: n,
      liveSyncDurationCount: r,
      lowLatencyMode: o
    } = this.config, l = this.hls.userConfig;
    let h = o && i || t;
    (l.liveSyncDuration || l.liveSyncDurationCount || h === 0) && (h = n !== void 0 ? n : r * s);
    const c = s, u = 1;
    return h + Math.min(this.stallCount * u, c);
  }
  get liveSyncPosition() {
    const e = this.estimateLiveEdge(), t = this.targetLatency, i = this.levelDetails;
    if (e === null || t === null || i === null)
      return null;
    const s = i.edge, n = e - t - this.edgeStalled, r = s - i.totalduration, o = s - (this.config.lowLatencyMode && i.partTarget || i.targetduration);
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
    const i = e.buffered.length;
    return (i ? e.buffered.end(i - 1) : t.edge) - this.currentTime;
  }
  destroy() {
    this.unregisterListeners(), this.onMediaDetaching(), this.levelDetails = null, this.hls = this.timeupdateHandler = null;
  }
  registerListeners() {
    this.hls.on(p.MEDIA_ATTACHED, this.onMediaAttached, this), this.hls.on(p.MEDIA_DETACHING, this.onMediaDetaching, this), this.hls.on(p.MANIFEST_LOADING, this.onManifestLoading, this), this.hls.on(p.LEVEL_UPDATED, this.onLevelUpdated, this), this.hls.on(p.ERROR, this.onError, this);
  }
  unregisterListeners() {
    this.hls.off(p.MEDIA_ATTACHED, this.onMediaAttached, this), this.hls.off(p.MEDIA_DETACHING, this.onMediaDetaching, this), this.hls.off(p.MANIFEST_LOADING, this.onManifestLoading, this), this.hls.off(p.LEVEL_UPDATED, this.onLevelUpdated, this), this.hls.off(p.ERROR, this.onError, this);
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
    var i;
    t.details === b.BUFFER_STALLED_ERROR && (this.stallCount++, (i = this.levelDetails) != null && i.live && A.warn("[playback-rate-controller]: Stall detected, adjusting target latency"));
  }
  timeupdate() {
    const {
      media: e,
      levelDetails: t
    } = this;
    if (!e || !t)
      return;
    this.currentTime = e.currentTime;
    const i = this.computeLatency();
    if (i === null)
      return;
    this._latency = i;
    const {
      lowLatencyMode: s,
      maxLiveSyncPlaybackRate: n
    } = this.config;
    if (!s || n === 1 || !t.live)
      return;
    const r = this.targetLatency;
    if (r === null)
      return;
    const o = i - r, l = Math.min(this.maxLatency, r + t.targetduration);
    if (o < l && o > 0.05 && this.forwardBufferLength > 1) {
      const c = Math.min(2, Math.max(1, n)), u = Math.round(2 / (1 + Math.exp(-0.75 * o - this.edgeStalled)) * 20) / 20;
      e.playbackRate = Math.min(c, Math.max(1, u));
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
const ci = ["NONE", "TYPE-0", "TYPE-1", null];
function ua(a) {
  return ci.indexOf(a) > -1;
}
const Ct = ["SDR", "PQ", "HLG"];
function da(a) {
  return !!a && Ct.indexOf(a) > -1;
}
var Tt = {
  No: "",
  Yes: "YES",
  v2: "v2"
};
function os(a) {
  const {
    canSkipUntil: e,
    canSkipDateRanges: t,
    age: i
  } = a, s = i < e / 2;
  return e && s ? t ? Tt.v2 : Tt.Yes : Tt.No;
}
class ls {
  constructor(e, t, i) {
    this.msn = void 0, this.part = void 0, this.skip = void 0, this.msn = e, this.part = t, this.skip = i;
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
    return hs(this._audioGroups, e);
  }
  hasSubtitleGroup(e) {
    return hs(this._subtitleGroups, e);
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
        let i = this._audioGroups;
        i || (i = this._audioGroups = []), i.indexOf(t) === -1 && i.push(t);
      } else if (e === "text") {
        let i = this._subtitleGroups;
        i || (i = this._subtitleGroups = []), i.indexOf(t) === -1 && i.push(t);
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
function hs(a, e) {
  return !e || !a ? !1 : a.indexOf(e) !== -1;
}
function qt(a, e) {
  const t = e.startPTS;
  if (M(t)) {
    let i = 0, s;
    e.sn > a.sn ? (i = t - a.start, s = a) : (i = a.start - t, s = e), s.duration !== i && (s.duration = i);
  } else
    e.sn > a.sn ? a.cc === e.cc && a.minEndPTS ? e.start = a.start + (a.minEndPTS - a.start) : e.start = a.start + a.duration : e.start = Math.max(a.start - e.duration, 0);
}
function ln(a, e, t, i, s, n) {
  i - t <= 0 && (A.warn("Fragment should have a positive duration", e), i = t + e.duration, n = s + e.duration);
  let o = t, l = i;
  const h = e.startPTS, c = e.endPTS;
  if (M(h)) {
    const T = Math.abs(h - t);
    M(e.deltaPTS) ? e.deltaPTS = Math.max(T, e.deltaPTS) : e.deltaPTS = T, o = Math.max(t, h), t = Math.min(t, h), s = Math.min(s, e.startDTS), l = Math.min(i, c), i = Math.max(i, c), n = Math.max(n, e.endDTS);
  }
  const u = t - e.start;
  e.start !== 0 && (e.start = t), e.duration = i - e.start, e.startPTS = t, e.maxStartPTS = o, e.startDTS = s, e.endPTS = i, e.minEndPTS = l, e.endDTS = n;
  const d = e.sn;
  if (!a || d < a.startSN || d > a.endSN)
    return 0;
  let f;
  const g = d - a.startSN, m = a.fragments;
  for (m[g] = e, f = g; f > 0; f--)
    qt(m[f], m[f - 1]);
  for (f = g; f < m.length - 1; f++)
    qt(m[f], m[f + 1]);
  return a.fragmentHint && qt(m[m.length - 1], a.fragmentHint), a.PTSKnown = a.alignedSliding = !0, u;
}
function fa(a, e) {
  let t = null;
  const i = a.fragments;
  for (let l = i.length - 1; l >= 0; l--) {
    const h = i[l].initSegment;
    if (h) {
      t = h;
      break;
    }
  }
  a.fragmentHint && delete a.fragmentHint.endPTS;
  let s = 0, n;
  if (pa(a, e, (l, h) => {
    l.relurl && (s = l.cc - h.cc), M(l.startPTS) && M(l.endPTS) && (h.start = h.startPTS = l.startPTS, h.startDTS = l.startDTS, h.maxStartPTS = l.maxStartPTS, h.endPTS = l.endPTS, h.endDTS = l.endDTS, h.minEndPTS = l.minEndPTS, h.duration = l.endPTS - l.startPTS, h.duration && (n = h), e.PTSKnown = e.alignedSliding = !0), h.elementaryStreams = l.elementaryStreams, h.loader = l.loader, h.stats = l.stats, l.initSegment && (h.initSegment = l.initSegment, t = l.initSegment);
  }), t && (e.fragmentHint ? e.fragments.concat(e.fragmentHint) : e.fragments).forEach((h) => {
    var c;
    h && (!h.initSegment || h.initSegment.relurl === ((c = t) == null ? void 0 : c.relurl)) && (h.initSegment = t);
  }), e.skippedSegments)
    if (e.deltaUpdateFailed = e.fragments.some((l) => !l), e.deltaUpdateFailed) {
      A.warn("[level-helper] Previous playlist missing segments skipped in delta playlist");
      for (let l = e.skippedSegments; l--; )
        e.fragments.shift();
      e.startSN = e.fragments[0].sn, e.startCC = e.fragments[0].cc;
    } else
      e.canSkipDateRanges && (e.dateRanges = ga(a.dateRanges, e.dateRanges, e.recentlyRemovedDateranges));
  const r = e.fragments;
  if (s) {
    A.warn("discontinuity sliding from playlist, take drift into account");
    for (let l = 0; l < r.length; l++)
      r[l].cc += s;
  }
  e.skippedSegments && (e.startCC = e.fragments[0].cc), ma(a.partList, e.partList, (l, h) => {
    h.elementaryStreams = l.elementaryStreams, h.stats = l.stats;
  }), n ? ln(e, n, n.startPTS, n.endPTS, n.startDTS, n.endDTS) : hn(a, e), r.length && (e.totalduration = e.edge - r[0].start), e.driftStartTime = a.driftStartTime, e.driftStart = a.driftStart;
  const o = e.advancedDateTime;
  if (e.advanced && o) {
    const l = e.edge;
    e.driftStart || (e.driftStartTime = o, e.driftStart = l), e.driftEndTime = o, e.driftEnd = l;
  } else
    e.driftEndTime = a.driftEndTime, e.driftEnd = a.driftEnd, e.advancedDateTime = a.advancedDateTime;
}
function ga(a, e, t) {
  const i = se({}, a);
  return t && t.forEach((s) => {
    delete i[s];
  }), Object.keys(e).forEach((s) => {
    const n = new Vs(e[s].attr, i[s]);
    n.isValid ? i[s] = n : A.warn(`Ignoring invalid Playlist Delta Update DATERANGE tag: "${JSON.stringify(e[s].attr)}"`);
  }), i;
}
function ma(a, e, t) {
  if (a && e) {
    let i = 0;
    for (let s = 0, n = a.length; s <= n; s++) {
      const r = a[s], o = e[s + i];
      r && o && r.index === o.index && r.fragment.sn === o.fragment.sn ? t(r, o) : i--;
    }
  }
}
function pa(a, e, t) {
  const i = e.skippedSegments, s = Math.max(a.startSN, e.startSN) - e.startSN, n = (a.fragmentHint ? 1 : 0) + (i ? e.endSN : Math.min(a.endSN, e.endSN)) - e.startSN, r = e.startSN - a.startSN, o = e.fragmentHint ? e.fragments.concat(e.fragmentHint) : e.fragments, l = a.fragmentHint ? a.fragments.concat(a.fragmentHint) : a.fragments;
  for (let h = s; h <= n; h++) {
    const c = l[r + h];
    let u = o[h];
    i && !u && h < i && (u = e.fragments[h] = c), c && u && t(c, u);
  }
}
function hn(a, e) {
  const t = e.startSN + e.skippedSegments - a.startSN, i = a.fragments;
  t < 0 || t >= i.length || ui(e, i[t].start);
}
function ui(a, e) {
  if (e) {
    const t = a.fragments;
    for (let i = a.skippedSegments; i < t.length; i++)
      t[i].start += e;
    a.fragmentHint && (a.fragmentHint.start += e);
  }
}
function Ta(a, e = 1 / 0) {
  let t = 1e3 * a.targetduration;
  if (a.updated) {
    const i = a.fragments, s = 4;
    if (i.length && t * s > e) {
      const n = i[i.length - 1].duration * 1e3;
      n < t && (t = n);
    }
  } else
    t /= 2;
  return Math.round(t);
}
function ya(a, e, t) {
  if (!(a != null && a.details))
    return null;
  const i = a.details;
  let s = i.fragments[e - i.startSN];
  return s || (s = i.fragmentHint, s && s.sn === e) ? s : e < i.startSN && t && t.sn === e ? t : null;
}
function cs(a, e, t) {
  var i;
  return a != null && a.details ? cn((i = a.details) == null ? void 0 : i.partList, e, t) : null;
}
function cn(a, e, t) {
  if (a)
    for (let i = a.length; i--; ) {
      const s = a[i];
      if (s.index === t && s.fragment.sn === e)
        return s;
    }
  return null;
}
function un(a) {
  a.forEach((e, t) => {
    const {
      details: i
    } = e;
    i != null && i.fragments && i.fragments.forEach((s) => {
      s.level = t;
    });
  });
}
function Dt(a) {
  switch (a.details) {
    case b.FRAG_LOAD_TIMEOUT:
    case b.KEY_LOAD_TIMEOUT:
    case b.LEVEL_LOAD_TIMEOUT:
    case b.MANIFEST_LOAD_TIMEOUT:
      return !0;
  }
  return !1;
}
function us(a, e) {
  const t = Dt(e);
  return a.default[`${t ? "timeout" : "error"}Retry`];
}
function Ri(a, e) {
  const t = a.backoff === "linear" ? 1 : Math.pow(2, e);
  return Math.min(t * a.retryDelayMs, a.maxRetryDelayMs);
}
function ds(a) {
  return le(le({}, a), {
    errorRetry: null,
    timeoutRetry: null
  });
}
function wt(a, e, t, i) {
  if (!a)
    return !1;
  const s = i == null ? void 0 : i.code, n = e < a.maxNumRetry && (Ea(s) || !!t);
  return a.shouldRetry ? a.shouldRetry(a, e, t, i, n) : n;
}
function Ea(a) {
  return a === 0 && navigator.onLine === !1 || !!a && (a < 400 || a > 499);
}
const dn = {
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
    let t = 0, i = a.length - 1, s = null, n = null;
    for (; t <= i; ) {
      s = (t + i) / 2 | 0, n = a[s];
      const r = e(n);
      if (r > 0)
        t = s + 1;
      else if (r < 0)
        i = s - 1;
      else
        return n;
    }
    return null;
  }
};
function va(a, e, t) {
  if (e === null || !Array.isArray(a) || !a.length || !M(e))
    return null;
  const i = a[0].programDateTime;
  if (e < (i || 0))
    return null;
  const s = a[a.length - 1].endProgramDateTime;
  if (e >= (s || 0))
    return null;
  t = t || 0;
  for (let n = 0; n < a.length; ++n) {
    const r = a[n];
    if (Sa(e, t, r))
      return r;
  }
  return null;
}
function kt(a, e, t = 0, i = 0, s = 5e-3) {
  let n = null;
  if (a) {
    n = e[a.sn - e[0].sn + 1] || null;
    const o = a.endDTS - t;
    o > 0 && o < 15e-7 && (t += 15e-7);
  } else
    t === 0 && e[0].start === 0 && (n = e[0]);
  if (n && ((!a || a.level === n.level) && di(t, i, n) === 0 || xa(n, a, Math.min(s, i))))
    return n;
  const r = dn.search(e, di.bind(null, t, i));
  return r && (r !== a || !n) ? r : n;
}
function xa(a, e, t) {
  if (e && e.start === 0 && e.level < a.level && (e.endPTS || 0) > 0) {
    const i = e.tagList.reduce((s, n) => (n[0] === "INF" && (s += parseFloat(n[1])), s), t);
    return a.start <= i;
  }
  return !1;
}
function di(a = 0, e = 0, t) {
  if (t.start <= a && t.start + t.duration > a)
    return 0;
  const i = Math.min(e, t.duration + (t.deltaPTS ? t.deltaPTS : 0));
  return t.start + t.duration - i <= a ? 1 : t.start - i > a && t.start ? -1 : 0;
}
function Sa(a, e, t) {
  const i = Math.min(e, t.duration + (t.deltaPTS ? t.deltaPTS : 0)) * 1e3;
  return (t.endProgramDateTime || 0) - i > a;
}
function Aa(a, e) {
  return dn.search(a, (t) => t.cc < e ? 1 : t.cc > e ? -1 : 0);
}
var ce = {
  DoNothing: 0,
  SendEndCallback: 1,
  SendAlternateToPenaltyBox: 2,
  RemoveAlternatePermanently: 3,
  InsertDiscontinuity: 4,
  RetryRequest: 5
}, ye = {
  None: 0,
  MoveAllAlternatesMatchingHost: 1,
  MoveAllAlternatesMatchingHDCP: 2,
  SwitchToSDR: 4
};
class La {
  constructor(e) {
    this.hls = void 0, this.playlistError = 0, this.penalizedRenditions = {}, this.log = void 0, this.warn = void 0, this.error = void 0, this.hls = e, this.log = A.log.bind(A, "[info]:"), this.warn = A.warn.bind(A, "[warning]:"), this.error = A.error.bind(A, "[error]:"), this.registerListeners();
  }
  registerListeners() {
    const e = this.hls;
    e.on(p.ERROR, this.onError, this), e.on(p.MANIFEST_LOADING, this.onManifestLoading, this), e.on(p.LEVEL_UPDATED, this.onLevelUpdated, this);
  }
  unregisterListeners() {
    const e = this.hls;
    e && (e.off(p.ERROR, this.onError, this), e.off(p.ERROR, this.onErrorOut, this), e.off(p.MANIFEST_LOADING, this.onManifestLoading, this), e.off(p.LEVEL_UPDATED, this.onLevelUpdated, this));
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
    return (e == null ? void 0 : e.type) === G.MAIN ? e.level : this.hls.loadLevel;
  }
  onManifestLoading() {
    this.playlistError = 0, this.penalizedRenditions = {};
  }
  onLevelUpdated() {
    this.playlistError = 0;
  }
  onError(e, t) {
    var i, s;
    if (t.fatal)
      return;
    const n = this.hls, r = t.context;
    switch (t.details) {
      case b.FRAG_LOAD_ERROR:
      case b.FRAG_LOAD_TIMEOUT:
      case b.KEY_LOAD_ERROR:
      case b.KEY_LOAD_TIMEOUT:
        t.errorAction = this.getFragRetryOrSwitchAction(t);
        return;
      case b.FRAG_PARSING_ERROR:
        if ((i = t.frag) != null && i.gap) {
          t.errorAction = {
            action: ce.DoNothing,
            flags: ye.None
          };
          return;
        }
      case b.FRAG_GAP:
      case b.FRAG_DECRYPT_ERROR: {
        t.errorAction = this.getFragRetryOrSwitchAction(t), t.errorAction.action = ce.SendAlternateToPenaltyBox;
        return;
      }
      case b.LEVEL_EMPTY_ERROR:
      case b.LEVEL_PARSING_ERROR:
        {
          var o, l;
          const h = t.parent === G.MAIN ? t.level : n.loadLevel;
          t.details === b.LEVEL_EMPTY_ERROR && ((o = t.context) != null && (l = o.levelDetails) != null && l.live) ? t.errorAction = this.getPlaylistRetryOrSwitchAction(t, h) : (t.levelRetry = !1, t.errorAction = this.getLevelSwitchAction(t, h));
        }
        return;
      case b.LEVEL_LOAD_ERROR:
      case b.LEVEL_LOAD_TIMEOUT:
        typeof (r == null ? void 0 : r.level) == "number" && (t.errorAction = this.getPlaylistRetryOrSwitchAction(t, r.level));
        return;
      case b.AUDIO_TRACK_LOAD_ERROR:
      case b.AUDIO_TRACK_LOAD_TIMEOUT:
      case b.SUBTITLE_LOAD_ERROR:
      case b.SUBTITLE_TRACK_LOAD_TIMEOUT:
        if (r) {
          const h = n.levels[n.loadLevel];
          if (h && (r.type === Y.AUDIO_TRACK && h.hasAudioGroup(r.groupId) || r.type === Y.SUBTITLE_TRACK && h.hasSubtitleGroup(r.groupId))) {
            t.errorAction = this.getPlaylistRetryOrSwitchAction(t, n.loadLevel), t.errorAction.action = ce.SendAlternateToPenaltyBox, t.errorAction.flags = ye.MoveAllAlternatesMatchingHost;
            return;
          }
        }
        return;
      case b.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED:
        {
          const h = n.levels[n.loadLevel], c = h == null ? void 0 : h.attrs["HDCP-LEVEL"];
          c ? t.errorAction = {
            action: ce.SendAlternateToPenaltyBox,
            flags: ye.MoveAllAlternatesMatchingHDCP,
            hdcpLevel: c
          } : this.keySystemError(t);
        }
        return;
      case b.BUFFER_ADD_CODEC_ERROR:
      case b.REMUX_ALLOC_ERROR:
      case b.BUFFER_APPEND_ERROR:
        t.errorAction = this.getLevelSwitchAction(t, (s = t.level) != null ? s : n.loadLevel);
        return;
      case b.INTERNAL_EXCEPTION:
      case b.BUFFER_APPENDING_ERROR:
      case b.BUFFER_FULL_ERROR:
      case b.LEVEL_SWITCH_ERROR:
      case b.BUFFER_STALLED_ERROR:
      case b.BUFFER_SEEK_OVER_HOLE:
      case b.BUFFER_NUDGE_ON_STALL:
        t.errorAction = {
          action: ce.DoNothing,
          flags: ye.None
        };
        return;
    }
    t.type === V.KEY_SYSTEM_ERROR && this.keySystemError(t);
  }
  keySystemError(e) {
    const t = this.getVariantLevelIndex(e.frag);
    e.levelRetry = !1, e.errorAction = this.getLevelSwitchAction(e, t);
  }
  getPlaylistRetryOrSwitchAction(e, t) {
    const i = this.hls, s = us(i.config.playlistLoadPolicy, e), n = this.playlistError++;
    if (wt(s, n, Dt(e), e.response))
      return {
        action: ce.RetryRequest,
        flags: ye.None,
        retryConfig: s,
        retryCount: n
      };
    const o = this.getLevelSwitchAction(e, t);
    return s && (o.retryConfig = s, o.retryCount = n), o;
  }
  getFragRetryOrSwitchAction(e) {
    const t = this.hls, i = this.getVariantLevelIndex(e.frag), s = t.levels[i], {
      fragLoadPolicy: n,
      keyLoadPolicy: r
    } = t.config, o = us(e.details.startsWith("key") ? r : n, e), l = t.levels.reduce((c, u) => c + u.fragmentError, 0);
    if (s && (e.details !== b.FRAG_GAP && s.fragmentError++, wt(o, l, Dt(e), e.response)))
      return {
        action: ce.RetryRequest,
        flags: ye.None,
        retryConfig: o,
        retryCount: l
      };
    const h = this.getLevelSwitchAction(e, i);
    return o && (h.retryConfig = o, h.retryCount = l), h;
  }
  getLevelSwitchAction(e, t) {
    const i = this.hls;
    t == null && (t = i.loadLevel);
    const s = this.hls.levels[t];
    if (s) {
      var n, r;
      const h = e.details;
      s.loadError++, h === b.BUFFER_APPEND_ERROR && s.fragmentError++;
      let c = -1;
      const {
        levels: u,
        loadLevel: d,
        minAutoLevel: f,
        maxAutoLevel: g
      } = i;
      i.autoLevelEnabled || (i.loadLevel = -1);
      const m = (n = e.frag) == null ? void 0 : n.type, y = (m === G.AUDIO && h === b.FRAG_PARSING_ERROR || e.sourceBufferName === "audio" && (h === b.BUFFER_ADD_CODEC_ERROR || h === b.BUFFER_APPEND_ERROR)) && u.some(({
        audioCodec: C
      }) => s.audioCodec !== C), x = e.sourceBufferName === "video" && (h === b.BUFFER_ADD_CODEC_ERROR || h === b.BUFFER_APPEND_ERROR) && u.some(({
        codecSet: C,
        audioCodec: R
      }) => s.codecSet !== C && s.audioCodec === R), {
        type: v,
        groupId: S
      } = (r = e.context) != null ? r : {};
      for (let C = u.length; C--; ) {
        const R = (C + d) % u.length;
        if (R !== d && R >= f && R <= g && u[R].loadError === 0) {
          var o, l;
          const I = u[R];
          if (h === b.FRAG_GAP && m === G.MAIN && e.frag) {
            const D = u[R].details;
            if (D) {
              const w = kt(e.frag, D.fragments, e.frag.start);
              if (w != null && w.gap)
                continue;
            }
          } else {
            if (v === Y.AUDIO_TRACK && I.hasAudioGroup(S) || v === Y.SUBTITLE_TRACK && I.hasSubtitleGroup(S))
              continue;
            if (m === G.AUDIO && (o = s.audioGroups) != null && o.some((D) => I.hasAudioGroup(D)) || m === G.SUBTITLE && (l = s.subtitleGroups) != null && l.some((D) => I.hasSubtitleGroup(D)) || y && s.audioCodec === I.audioCodec || !y && s.audioCodec !== I.audioCodec || x && s.codecSet === I.codecSet)
              continue;
          }
          c = R;
          break;
        }
      }
      if (c > -1 && i.loadLevel !== c)
        return e.levelRetry = !0, this.playlistError = 0, {
          action: ce.SendAlternateToPenaltyBox,
          flags: ye.None,
          nextAutoLevel: c
        };
    }
    return {
      action: ce.SendAlternateToPenaltyBox,
      flags: ye.MoveAllAlternatesMatchingHost
    };
  }
  onErrorOut(e, t) {
    var i;
    switch ((i = t.errorAction) == null ? void 0 : i.action) {
      case ce.DoNothing:
        break;
      case ce.SendAlternateToPenaltyBox:
        this.sendAlternateToPenaltyBox(t), !t.errorAction.resolved && t.details !== b.FRAG_GAP ? t.fatal = !0 : /MediaSource readyState: ended/.test(t.error.message) && (this.warn(`MediaSource ended after "${t.sourceBufferName}" sourceBuffer append error. Attempting to recover from media error.`), this.hls.recoverMediaError());
        break;
    }
    if (t.fatal) {
      this.hls.stopLoad();
      return;
    }
  }
  sendAlternateToPenaltyBox(e) {
    const t = this.hls, i = e.errorAction;
    if (!i)
      return;
    const {
      flags: s,
      hdcpLevel: n,
      nextAutoLevel: r
    } = i;
    switch (s) {
      case ye.None:
        this.switchLevel(e, r);
        break;
      case ye.MoveAllAlternatesMatchingHDCP:
        n && (t.maxHdcpLevel = ci[ci.indexOf(n) - 1], i.resolved = !0), this.warn(`Restricting playback to HDCP-LEVEL of "${t.maxHdcpLevel}" or lower`);
        break;
    }
    i.resolved || this.switchLevel(e, r);
  }
  switchLevel(e, t) {
    t !== void 0 && e.errorAction && (this.warn(`switching to level ${t} after ${e.details}`), this.hls.nextAutoLevel = t, e.errorAction.resolved = !0, this.hls.nextLoadLevel = this.hls.nextAutoLevel);
  }
}
class bi {
  constructor(e, t) {
    this.hls = void 0, this.timer = -1, this.requestScheduled = -1, this.canLoad = !1, this.log = void 0, this.warn = void 0, this.log = A.log.bind(A, `${t}:`), this.warn = A.warn.bind(A, `${t}:`), this.hls = e;
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
  switchParams(e, t, i) {
    const s = t == null ? void 0 : t.renditionReports;
    if (s) {
      let n = -1;
      for (let r = 0; r < s.length; r++) {
        const o = s[r];
        let l;
        try {
          l = new self.URL(o.URI, t.url).href;
        } catch (h) {
          A.warn(`Could not construct new URL for Rendition Report: ${h}`), l = o.URI || "";
        }
        if (l === e) {
          n = r;
          break;
        } else
          l === e.substring(0, l.length) && (n = r);
      }
      if (n !== -1) {
        const r = s[n], o = parseInt(r["LAST-MSN"]) || (t == null ? void 0 : t.lastPartSn);
        let l = parseInt(r["LAST-PART"]) || (t == null ? void 0 : t.lastPartIndex);
        if (this.hls.config.lowLatencyMode) {
          const c = Math.min(t.age - t.partTarget, t.targetduration);
          l >= 0 && c > t.partTarget && (l += 1);
        }
        const h = i && os(i);
        return new ls(o, l >= 0 ? l : void 0, h);
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
  playlistLoaded(e, t, i) {
    const {
      details: s,
      stats: n
    } = t, r = self.performance.now(), o = n.loading.first ? Math.max(0, r - n.loading.first) : 0;
    if (s.advancedDateTime = Date.now() - o, s.live || i != null && i.live) {
      if (s.reloaded(i), i && this.log(`live playlist ${e} ${s.advanced ? "REFRESHED " + s.lastPartSn + "-" + s.lastPartIndex : s.updated ? "UPDATED" : "MISSED"}`), i && s.fragments.length > 0 && fa(i, s), !this.canLoad || !s.live)
        return;
      let l, h, c;
      if (s.canBlockReload && s.endSN && s.advanced) {
        const T = this.hls.config.lowLatencyMode, y = s.lastPartSn, E = s.endSN, x = s.lastPartIndex, v = x !== -1, S = y === E, C = T ? 0 : x;
        v ? (h = S ? E + 1 : y, c = S ? C : x + 1) : h = E + 1;
        const R = s.age, I = R + s.ageHeader;
        let D = Math.min(I - s.partTarget, s.targetduration * 1.5);
        if (D > 0) {
          if (i && D > i.tuneInGoal)
            this.warn(`CDN Tune-in goal increased from: ${i.tuneInGoal} to: ${D} with playlist age: ${s.age}`), D = 0;
          else {
            const w = Math.floor(D / s.targetduration);
            if (h += w, c !== void 0) {
              const _ = Math.round(D % s.targetduration / s.partTarget);
              c += _;
            }
            this.log(`CDN Tune-in age: ${s.ageHeader}s last advanced ${R.toFixed(2)}s goal: ${D} skip sn ${w} to part ${c}`);
          }
          s.tuneInGoal = D;
        }
        if (l = this.getDeliveryDirectives(s, t.deliveryDirectives, h, c), T || !S) {
          this.loadPlaylist(l);
          return;
        }
      } else
        (s.canBlockReload || s.canSkipUntil) && (l = this.getDeliveryDirectives(s, t.deliveryDirectives, h, c));
      const u = this.hls.mainForwardBufferInfo, d = u ? u.end - u.len : 0, f = (s.edge - d) * 1e3, g = Ta(s, f);
      s.updated && r > this.requestScheduled + g && (this.requestScheduled = n.loading.start), h !== void 0 && s.canBlockReload ? this.requestScheduled = n.loading.first + g - (s.partTarget * 1e3 || 1e3) : this.requestScheduled === -1 || this.requestScheduled + g < r ? this.requestScheduled = r : this.requestScheduled - r <= 0 && (this.requestScheduled += g);
      let m = this.requestScheduled - r;
      m = Math.max(0, m), this.log(`reload live playlist ${e} in ${Math.round(m)} ms`), this.timer = self.setTimeout(() => this.loadPlaylist(l), m);
    } else
      this.clearTimer();
  }
  getDeliveryDirectives(e, t, i, s) {
    let n = os(e);
    return t != null && t.skip && e.deltaUpdateFailed && (i = t.msn, s = t.part, n = Tt.No), new ls(i, s, n);
  }
  checkRetry(e) {
    const t = e.details, i = Dt(e), s = e.errorAction, {
      action: n,
      retryCount: r = 0,
      retryConfig: o
    } = s || {}, l = !!s && !!o && (n === ce.RetryRequest || !s.resolved && n === ce.SendAlternateToPenaltyBox);
    if (l) {
      var h;
      if (this.requestScheduled = -1, r >= o.maxNumRetry)
        return !1;
      if (i && (h = e.context) != null && h.deliveryDirectives)
        this.warn(`Retrying playlist loading ${r + 1}/${o.maxNumRetry} after "${t}" without delivery-directives`), this.loadPlaylist();
      else {
        const c = Ri(o, r);
        this.timer = self.setTimeout(() => this.loadPlaylist(), c), this.warn(`Retrying playlist loading ${r + 1}/${o.maxNumRetry} after "${t}" in ${c}ms`);
      }
      e.levelRetry = !0, s.resolved = !0;
    }
    return l;
  }
}
class Ge {
  //  About half of the estimated value will be from the last |halfLife| samples by weight.
  constructor(e, t = 0, i = 0) {
    this.halfLife = void 0, this.alpha_ = void 0, this.estimate_ = void 0, this.totalWeight_ = void 0, this.halfLife = e, this.alpha_ = e ? Math.exp(Math.log(0.5) / e) : 0, this.estimate_ = t, this.totalWeight_ = i;
  }
  sample(e, t) {
    const i = Math.pow(this.alpha_, e);
    this.estimate_ = t * (1 - i) + i * this.estimate_, this.totalWeight_ += e;
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
class Ra {
  constructor(e, t, i, s = 100) {
    this.defaultEstimate_ = void 0, this.minWeight_ = void 0, this.minDelayMs_ = void 0, this.slow_ = void 0, this.fast_ = void 0, this.defaultTTFB_ = void 0, this.ttfb_ = void 0, this.defaultEstimate_ = i, this.minWeight_ = 1e-3, this.minDelayMs_ = 50, this.slow_ = new Ge(e), this.fast_ = new Ge(t), this.defaultTTFB_ = s, this.ttfb_ = new Ge(e);
  }
  update(e, t) {
    const {
      slow_: i,
      fast_: s,
      ttfb_: n
    } = this;
    i.halfLife !== e && (this.slow_ = new Ge(e, i.getEstimate(), i.getTotalWeight())), s.halfLife !== t && (this.fast_ = new Ge(t, s.getEstimate(), s.getTotalWeight())), n.halfLife !== e && (this.ttfb_ = new Ge(e, n.getEstimate(), n.getTotalWeight()));
  }
  sample(e, t) {
    e = Math.max(e, this.minDelayMs_);
    const i = 8 * t, s = e / 1e3, n = i / s;
    this.fast_.sample(s, n), this.slow_.sample(s, n);
  }
  sampleTTFB(e) {
    const t = e / 1e3, i = Math.sqrt(2) * Math.exp(-Math.pow(t, 2) / 2);
    this.ttfb_.sample(i, Math.max(e, 5));
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
const fn = {
  supported: !0,
  configurations: [],
  decodingInfoResults: [{
    supported: !0,
    powerEfficient: !0,
    smooth: !0
  }]
}, fs = {};
function ba(a, e, t, i, s, n) {
  const r = a.audioCodec ? a.audioGroups : null, o = n == null ? void 0 : n.audioCodec, l = n == null ? void 0 : n.channels, h = l ? parseInt(l) : o ? 1 / 0 : 2;
  let c = null;
  if (r != null && r.length)
    try {
      r.length === 1 && r[0] ? c = e.groups[r[0]].channels : c = r.reduce((u, d) => {
        if (d) {
          const f = e.groups[d];
          if (!f)
            throw new Error(`Audio track group ${d} not found`);
          Object.keys(f.channels).forEach((g) => {
            u[g] = (u[g] || 0) + f.channels[g];
          });
        }
        return u;
      }, {
        2: 0
      });
    } catch {
      return !0;
    }
  return a.videoCodec !== void 0 && (a.width > 1920 && a.height > 1088 || a.height > 1920 && a.width > 1088 || a.frameRate > Math.max(i, 30) || a.videoRange !== "SDR" && a.videoRange !== t || a.bitrate > Math.max(s, 8e6)) || !!c && M(h) && Object.keys(c).some((u) => parseInt(u) > h);
}
function Ia(a, e, t) {
  const i = a.videoCodec, s = a.audioCodec;
  if (!i || !s || !t)
    return Promise.resolve(fn);
  const n = {
    width: a.width,
    height: a.height,
    bitrate: Math.ceil(Math.max(a.bitrate * 0.9, a.averageBitrate)),
    // Assume a framerate of 30fps since MediaCapabilities will not accept Level default of 0.
    framerate: a.frameRate || 30
  }, r = a.videoRange;
  r !== "SDR" && (n.transferFunction = r.toLowerCase());
  const o = i.split(",").map((l) => ({
    type: "media-source",
    video: le(le({}, n), {}, {
      contentType: nt(l, "video")
    })
  }));
  return s && a.audioGroups && a.audioGroups.forEach((l) => {
    var h;
    l && ((h = e.groups[l]) == null || h.tracks.forEach((c) => {
      if (c.groupId === l) {
        const u = c.channels || "", d = parseFloat(u);
        M(d) && d > 2 && o.push.apply(o, s.split(",").map((f) => ({
          type: "media-source",
          audio: {
            contentType: nt(f, "audio"),
            channels: "" + d
            // spatialRendering:
            //   audioCodec === 'ec-3' && channels.indexOf('JOC'),
          }
        })));
      }
    }));
  }), Promise.all(o.map((l) => {
    const h = Ca(l);
    return fs[h] || (fs[h] = t.decodingInfo(l));
  })).then((l) => ({
    supported: !l.some((h) => !h.supported),
    configurations: o,
    decodingInfoResults: l
  })).catch((l) => ({
    supported: !1,
    configurations: o,
    decodingInfoResults: [],
    error: l
  }));
}
function Ca(a) {
  const {
    audio: e,
    video: t
  } = a, i = t || e;
  if (i) {
    const s = i.contentType.split('"')[1];
    if (t)
      return `r${t.height}x${t.width}f${Math.ceil(t.framerate)}${t.transferFunction || "sd"}_${s}_${Math.ceil(t.bitrate / 1e5)}`;
    if (e)
      return `c${e.channels}${e.spatialRendering ? "s" : "n"}_${s}`;
  }
  return "";
}
function Da() {
  if (typeof matchMedia == "function") {
    const a = matchMedia("(dynamic-range: high)"), e = matchMedia("bad query");
    if (a.media !== e.media)
      return a.matches === !0;
  }
  return !1;
}
function wa(a, e) {
  let t = !1, i = [];
  return a && (t = a !== "SDR", i = [a]), e && (i = e.allowedVideoRanges || Ct.slice(0), t = e.preferHDR !== void 0 ? e.preferHDR : Da(), t ? i = i.filter((s) => s !== "SDR") : i = ["SDR"]), {
    preferHDR: t,
    allowedVideoRanges: i
  };
}
function ka(a, e, t, i, s) {
  const n = Object.keys(a), r = i == null ? void 0 : i.channels, o = i == null ? void 0 : i.audioCodec, l = r && parseInt(r) === 2;
  let h = !0, c = !1, u = 1 / 0, d = 1 / 0, f = 1 / 0, g = 0, m = [];
  const {
    preferHDR: T,
    allowedVideoRanges: y
  } = wa(e, s);
  for (let S = n.length; S--; ) {
    const C = a[n[S]];
    h = C.channels[2] > 0, u = Math.min(u, C.minHeight), d = Math.min(d, C.minFramerate), f = Math.min(f, C.minBitrate);
    const R = y.filter((I) => C.videoRanges[I] > 0);
    R.length > 0 && (c = !0, m = R);
  }
  u = M(u) ? u : 0, d = M(d) ? d : 0;
  const E = Math.max(1080, u), x = Math.max(30, d);
  return f = M(f) ? f : t, t = Math.max(f, t), c || (e = void 0, m = []), {
    codecSet: n.reduce((S, C) => {
      const R = a[C];
      if (C === S)
        return S;
      if (R.minBitrate > t)
        return Ce(C, `min bitrate of ${R.minBitrate} > current estimate of ${t}`), S;
      if (!R.hasDefaultAudio)
        return Ce(C, "no renditions with default or auto-select sound found"), S;
      if (o && C.indexOf(o.substring(0, 4)) % 5 !== 0)
        return Ce(C, `audio codec preference "${o}" not found`), S;
      if (r && !l) {
        if (!R.channels[r])
          return Ce(C, `no renditions with ${r} channel sound found (channels options: ${Object.keys(R.channels)})`), S;
      } else if ((!o || l) && h && R.channels[2] === 0)
        return Ce(C, "no renditions with stereo sound found"), S;
      return R.minHeight > E ? (Ce(C, `min resolution of ${R.minHeight} > maximum of ${E}`), S) : R.minFramerate > x ? (Ce(C, `min framerate of ${R.minFramerate} > maximum of ${x}`), S) : m.some((I) => R.videoRanges[I] > 0) ? R.maxScore < g ? (Ce(C, `max score of ${R.maxScore} < selected max of ${g}`), S) : S && (bt(C) >= bt(S) || R.fragmentError > a[S].fragmentError) ? S : (g = R.maxScore, C) : (Ce(C, `no variants with VIDEO-RANGE of ${JSON.stringify(m)} found`), S);
    }, void 0),
    videoRanges: m,
    preferHDR: T,
    minFramerate: d,
    minBitrate: f
  };
}
function Ce(a, e) {
  A.log(`[abr] start candidates with "${a}" ignored because ${e}`);
}
function _a(a) {
  return a.reduce((e, t) => {
    let i = e.groups[t.groupId];
    i || (i = e.groups[t.groupId] = {
      tracks: [],
      channels: {
        2: 0
      },
      hasDefault: !1,
      hasAutoSelect: !1
    }), i.tracks.push(t);
    const s = t.channels || "2";
    return i.channels[s] = (i.channels[s] || 0) + 1, i.hasDefault = i.hasDefault || t.default, i.hasAutoSelect = i.hasAutoSelect || t.autoselect, i.hasDefault && (e.hasDefaultAudio = !0), i.hasAutoSelect && (e.hasAutoSelectAudio = !0), e;
  }, {
    hasDefaultAudio: !1,
    hasAutoSelectAudio: !1,
    groups: {}
  });
}
function Pa(a, e, t, i) {
  return a.slice(t, i + 1).reduce((s, n) => {
    if (!n.codecSet)
      return s;
    const r = n.audioGroups;
    let o = s[n.codecSet];
    o || (s[n.codecSet] = o = {
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
    return o.minHeight = Math.min(o.minHeight, l), o.minFramerate = Math.min(o.minFramerate, n.frameRate), o.maxScore = Math.max(o.maxScore, n.score), o.fragmentError += n.fragmentError, o.videoRanges[n.videoRange] = (o.videoRanges[n.videoRange] || 0) + 1, r && r.forEach((h) => {
      if (!h)
        return;
      const c = e.groups[h];
      c && (o.hasDefaultAudio = o.hasDefaultAudio || e.hasDefaultAudio ? c.hasDefault : c.hasAutoSelect || !e.hasDefaultAudio && !e.hasAutoSelectAudio, Object.keys(c.channels).forEach((u) => {
        o.channels[u] = (o.channels[u] || 0) + c.channels[u];
      }));
    }), s;
  }, {});
}
function Re(a, e, t) {
  if ("attrs" in a) {
    const i = e.indexOf(a);
    if (i !== -1)
      return i;
  }
  for (let i = 0; i < e.length; i++) {
    const s = e[i];
    if (qe(a, s, t))
      return i;
  }
  return -1;
}
function qe(a, e, t) {
  const {
    groupId: i,
    name: s,
    lang: n,
    assocLang: r,
    characteristics: o,
    default: l
  } = a, h = a.forced;
  return (i === void 0 || e.groupId === i) && (s === void 0 || e.name === s) && (n === void 0 || e.lang === n) && (n === void 0 || e.assocLang === r) && (l === void 0 || e.default === l) && (h === void 0 || e.forced === h) && (o === void 0 || Fa(o, e.characteristics)) && (t === void 0 || t(a, e));
}
function Fa(a, e = "") {
  const t = a.split(","), i = e.split(",");
  return t.length === i.length && !t.some((s) => i.indexOf(s) === -1);
}
function Ke(a, e) {
  const {
    audioCodec: t,
    channels: i
  } = a;
  return (t === void 0 || (e.audioCodec || "").substring(0, 4) === t.substring(0, 4)) && (i === void 0 || i === (e.channels || "2"));
}
function Oa(a, e, t, i, s) {
  const n = e[i], o = e.reduce((d, f, g) => {
    const m = f.uri;
    return (d[m] || (d[m] = [])).push(g), d;
  }, {})[n.uri];
  o.length > 1 && (i = Math.max.apply(Math, o));
  const l = n.videoRange, h = n.frameRate, c = n.codecSet.substring(0, 4), u = gs(e, i, (d) => {
    if (d.videoRange !== l || d.frameRate !== h || d.codecSet.substring(0, 4) !== c)
      return !1;
    const f = d.audioGroups, g = t.filter((m) => !f || f.indexOf(m.groupId) !== -1);
    return Re(a, g, s) > -1;
  });
  return u > -1 ? u : gs(e, i, (d) => {
    const f = d.audioGroups, g = t.filter((m) => !f || f.indexOf(m.groupId) !== -1);
    return Re(a, g, s) > -1;
  });
}
function gs(a, e, t) {
  for (let i = e; i; i--)
    if (t(a[i]))
      return i;
  for (let i = e + 1; i < a.length; i++)
    if (t(a[i]))
      return i;
  return -1;
}
class Ma {
  constructor(e) {
    this.hls = void 0, this.lastLevelLoadSec = 0, this.lastLoadedFragLevel = -1, this.firstSelection = -1, this._nextAutoLevel = -1, this.nextAutoLevelKey = "", this.audioTracksByGroup = null, this.codecTiers = null, this.timer = -1, this.fragCurrent = null, this.partCurrent = null, this.bitrateTestDelay = 0, this.bwEstimator = void 0, this._abandonRulesCheck = () => {
      const {
        fragCurrent: t,
        partCurrent: i,
        hls: s
      } = this, {
        autoLevelEnabled: n,
        media: r
      } = s;
      if (!t || !r)
        return;
      const o = performance.now(), l = i ? i.stats : t.stats, h = i ? i.duration : t.duration, c = o - l.loading.start, u = s.minAutoLevel;
      if (l.aborted || l.loaded && l.loaded === l.total || t.level <= u) {
        this.clearTimer(), this._nextAutoLevel = -1;
        return;
      }
      if (!n || r.paused || !r.playbackRate || !r.readyState)
        return;
      const d = s.mainForwardBufferInfo;
      if (d === null)
        return;
      const f = this.bwEstimator.getEstimateTTFB(), g = Math.abs(r.playbackRate);
      if (c <= Math.max(f, 1e3 * (h / (g * 2))))
        return;
      const m = d.len / g, T = l.loading.first ? l.loading.first - l.loading.start : -1, y = l.loaded && T > -1, E = this.getBwEstimate(), x = s.levels, v = x[t.level], S = l.total || Math.max(l.loaded, Math.round(h * v.averageBitrate / 8));
      let C = y ? c - T : c;
      C < 1 && y && (C = Math.min(c, l.loaded * 8 / E));
      const R = y ? l.loaded * 1e3 / C : 0, I = R ? (S - l.loaded) / R : S * 8 / E + f / 1e3;
      if (I <= m)
        return;
      const D = R ? R * 8 : E;
      let w = Number.POSITIVE_INFINITY, _;
      for (_ = t.level - 1; _ > u; _--) {
        const P = x[_].maxBitrate;
        if (w = this.getTimeToLoadFrag(f / 1e3, D, h * P, !x[_].details), w < m)
          break;
      }
      if (w >= I || w > h * 10)
        return;
      s.nextLoadLevel = s.nextAutoLevel = _, y ? this.bwEstimator.sample(c - Math.min(f, T), l.loaded) : this.bwEstimator.sampleTTFB(c);
      const O = x[_].maxBitrate;
      this.getBwEstimate() * this.hls.config.abrBandWidthUpFactor > O && this.resetEstimator(O), this.clearTimer(), A.warn(`[abr] Fragment ${t.sn}${i ? " part " + i.index : ""} of level ${t.level} is loading too slowly;
      Time to underbuffer: ${m.toFixed(3)} s
      Estimated load time for current fragment: ${I.toFixed(3)} s
      Estimated load time for down switch fragment: ${w.toFixed(3)} s
      TTFB estimate: ${T | 0} ms
      Current BW estimate: ${M(E) ? E | 0 : "Unknown"} bps
      New BW estimate: ${this.getBwEstimate() | 0} bps
      Switching to level ${_} @ ${O | 0} bps`), s.trigger(p.FRAG_LOAD_EMERGENCY_ABORTED, {
        frag: t,
        part: i,
        stats: l
      });
    }, this.hls = e, this.bwEstimator = this.initEstimator(), this.registerListeners();
  }
  resetEstimator(e) {
    e && (A.log(`setting initial bwe to ${e}`), this.hls.config.abrEwmaDefaultEstimate = e), this.firstSelection = -1, this.bwEstimator = this.initEstimator();
  }
  initEstimator() {
    const e = this.hls.config;
    return new Ra(e.abrEwmaSlowVoD, e.abrEwmaFastVoD, e.abrEwmaDefaultEstimate);
  }
  registerListeners() {
    const {
      hls: e
    } = this;
    e.on(p.MANIFEST_LOADING, this.onManifestLoading, this), e.on(p.FRAG_LOADING, this.onFragLoading, this), e.on(p.FRAG_LOADED, this.onFragLoaded, this), e.on(p.FRAG_BUFFERED, this.onFragBuffered, this), e.on(p.LEVEL_SWITCHING, this.onLevelSwitching, this), e.on(p.LEVEL_LOADED, this.onLevelLoaded, this), e.on(p.LEVELS_UPDATED, this.onLevelsUpdated, this), e.on(p.MAX_AUTO_LEVEL_UPDATED, this.onMaxAutoLevelUpdated, this), e.on(p.ERROR, this.onError, this);
  }
  unregisterListeners() {
    const {
      hls: e
    } = this;
    e && (e.off(p.MANIFEST_LOADING, this.onManifestLoading, this), e.off(p.FRAG_LOADING, this.onFragLoading, this), e.off(p.FRAG_LOADED, this.onFragLoaded, this), e.off(p.FRAG_BUFFERED, this.onFragBuffered, this), e.off(p.LEVEL_SWITCHING, this.onLevelSwitching, this), e.off(p.LEVEL_LOADED, this.onLevelLoaded, this), e.off(p.LEVELS_UPDATED, this.onLevelsUpdated, this), e.off(p.MAX_AUTO_LEVEL_UPDATED, this.onMaxAutoLevelUpdated, this), e.off(p.ERROR, this.onError, this));
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
    const i = t.frag;
    if (!this.ignoreFragment(i)) {
      if (!i.bitrateTest) {
        var s;
        this.fragCurrent = i, this.partCurrent = (s = t.part) != null ? s : null;
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
        case b.BUFFER_ADD_CODEC_ERROR:
        case b.BUFFER_APPEND_ERROR:
          this.lastLoadedFragLevel = -1, this.firstSelection = -1;
          break;
        case b.FRAG_LOAD_TIMEOUT: {
          const i = t.frag, {
            fragCurrent: s,
            partCurrent: n
          } = this;
          if (i && s && i.sn === s.sn && i.level === s.level) {
            const r = performance.now(), o = n ? n.stats : i.stats, l = r - o.loading.start, h = o.loading.first ? o.loading.first - o.loading.start : -1;
            if (o.loaded && h > -1) {
              const u = this.bwEstimator.getEstimateTTFB();
              this.bwEstimator.sample(l - Math.min(u, h), o.loaded);
            } else
              this.bwEstimator.sampleTTFB(l);
          }
          break;
        }
      }
  }
  getTimeToLoadFrag(e, t, i, s) {
    const n = e + i / t, r = s ? this.lastLevelLoadSec : 0;
    return n + r;
  }
  onLevelLoaded(e, t) {
    const i = this.hls.config, {
      loading: s
    } = t.stats, n = s.end - s.start;
    M(n) && (this.lastLevelLoadSec = n / 1e3), t.details.live ? this.bwEstimator.update(i.abrEwmaSlowLive, i.abrEwmaFastLive) : this.bwEstimator.update(i.abrEwmaSlowVoD, i.abrEwmaFastVoD);
  }
  onFragLoaded(e, {
    frag: t,
    part: i
  }) {
    const s = i ? i.stats : t.stats;
    if (t.type === G.MAIN && this.bwEstimator.sampleTTFB(s.loading.first - s.loading.start), !this.ignoreFragment(t)) {
      if (this.clearTimer(), t.level === this._nextAutoLevel && (this._nextAutoLevel = -1), this.firstSelection = -1, this.hls.config.abrMaxWithRealBitrate) {
        const n = i ? i.duration : t.duration, r = this.hls.levels[t.level], o = (r.loaded ? r.loaded.bytes : 0) + s.loaded, l = (r.loaded ? r.loaded.duration : 0) + n;
        r.loaded = {
          bytes: o,
          duration: l
        }, r.realBitrate = Math.round(8 * o / l);
      }
      if (t.bitrateTest) {
        const n = {
          stats: s,
          frag: t,
          part: i,
          id: t.type
        };
        this.onFragBuffered(p.FRAG_BUFFERED, n), t.bitrateTest = !1;
      } else
        this.lastLoadedFragLevel = t.level;
    }
  }
  onFragBuffered(e, t) {
    const {
      frag: i,
      part: s
    } = t, n = s != null && s.stats.loaded ? s.stats : i.stats;
    if (n.aborted || this.ignoreFragment(i))
      return;
    const r = n.parsing.end - n.loading.start - Math.min(n.loading.first - n.loading.start, this.bwEstimator.getEstimateTTFB());
    this.bwEstimator.sample(r, n.loaded), n.bwEstimate = this.getBwEstimate(), i.bitrateTest ? this.bitrateTestDelay = r / 1e3 : this.bitrateTestDelay = 0;
  }
  ignoreFragment(e) {
    return e.type !== G.MAIN || e.sn === "initSegment";
  }
  clearTimer() {
    this.timer > -1 && (self.clearInterval(this.timer), this.timer = -1);
  }
  get firstAutoLevel() {
    const {
      maxAutoLevel: e,
      minAutoLevel: t
    } = this.hls, i = this.getBwEstimate(), s = this.hls.config.maxStarvationDelay, n = this.findBestLevel(i, t, e, 0, s, 1, 1);
    if (n > -1)
      return n;
    const r = this.hls.firstLevel, o = Math.min(Math.max(r, t), e);
    return A.warn(`[abr] Could not find best starting auto level. Defaulting to first in playlist ${r} clamped to ${o}`), o;
  }
  get forcedAutoLevel() {
    return this.nextAutoLevelKey ? -1 : this._nextAutoLevel;
  }
  // return next auto level
  get nextAutoLevel() {
    const e = this.forcedAutoLevel, i = this.bwEstimator.canEstimate(), s = this.lastLoadedFragLevel > -1;
    if (e !== -1 && (!i || !s || this.nextAutoLevelKey === this.getAutoLevelKey()))
      return e;
    const n = i && s ? this.getNextABRAutoLevel() : this.firstAutoLevel;
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
      hls: i
    } = this, {
      maxAutoLevel: s,
      config: n,
      minAutoLevel: r
    } = i, o = t ? t.duration : e ? e.duration : 0, l = this.getBwEstimate(), h = this.getStarvationDelay();
    let c = n.abrBandWidthFactor, u = n.abrBandWidthUpFactor;
    if (h) {
      const T = this.findBestLevel(l, r, s, h, 0, c, u);
      if (T >= 0)
        return T;
    }
    let d = o ? Math.min(o, n.maxStarvationDelay) : n.maxStarvationDelay;
    if (!h) {
      const T = this.bitrateTestDelay;
      T && (d = (o ? Math.min(o, n.maxLoadingDelay) : n.maxLoadingDelay) - T, A.info(`[abr] bitrate test took ${Math.round(1e3 * T)}ms, set first fragment max fetchDuration to ${Math.round(1e3 * d)} ms`), c = u = 1);
    }
    const f = this.findBestLevel(l, r, s, h, d, c, u);
    if (A.info(`[abr] ${h ? "rebuffering expected" : "buffer is empty"}, optimal quality level ${f}`), f > -1)
      return f;
    const g = i.levels[r], m = i.levels[i.loadLevel];
    return (g == null ? void 0 : g.bitrate) < (m == null ? void 0 : m.bitrate) ? r : i.loadLevel;
  }
  getStarvationDelay() {
    const e = this.hls, t = e.media;
    if (!t)
      return 1 / 0;
    const i = t && t.playbackRate !== 0 ? Math.abs(t.playbackRate) : 1, s = e.mainForwardBufferInfo;
    return (s ? s.len : 0) / i;
  }
  getBwEstimate() {
    return this.bwEstimator.canEstimate() ? this.bwEstimator.getEstimate() : this.hls.config.abrEwmaDefaultEstimate;
  }
  findBestLevel(e, t, i, s, n, r, o) {
    var l;
    const h = s + n, c = this.lastLoadedFragLevel, u = c === -1 ? this.hls.firstLevel : c, {
      fragCurrent: d,
      partCurrent: f
    } = this, {
      levels: g,
      allAudioTracks: m,
      loadLevel: T,
      config: y
    } = this.hls;
    if (g.length === 1)
      return 0;
    const E = g[u], x = !!(E != null && (l = E.details) != null && l.live), v = T === -1 || c === -1;
    let S, C = "SDR", R = (E == null ? void 0 : E.frameRate) || 0;
    const {
      audioPreference: I,
      videoPreference: D
    } = y, w = this.audioTracksByGroup || (this.audioTracksByGroup = _a(m));
    if (v) {
      if (this.firstSelection !== -1)
        return this.firstSelection;
      const N = this.codecTiers || (this.codecTiers = Pa(g, w, t, i)), U = ka(N, C, e, I, D), {
        codecSet: q,
        videoRanges: Q,
        minFramerate: B,
        minBitrate: F,
        preferHDR: j
      } = U;
      S = q, C = j ? Q[Q.length - 1] : Q[0], R = B, e = Math.max(e, F), A.log(`[abr] picked start tier ${JSON.stringify(U)}`);
    } else
      S = E == null ? void 0 : E.codecSet, C = E == null ? void 0 : E.videoRange;
    const _ = f ? f.duration : d ? d.duration : 0, O = this.bwEstimator.getEstimateTTFB() / 1e3, P = [];
    for (let N = i; N >= t; N--) {
      var K;
      const U = g[N], q = N > u;
      if (!U)
        continue;
      if (y.useMediaCapabilities && !U.supportedResult && !U.supportedPromise) {
        const ie = navigator.mediaCapabilities;
        typeof (ie == null ? void 0 : ie.decodingInfo) == "function" && ba(U, w, C, R, e, I) ? (U.supportedPromise = Ia(U, w, ie), U.supportedPromise.then((re) => {
          if (!this.hls)
            return;
          U.supportedResult = re;
          const he = this.hls.levels, ge = he.indexOf(U);
          re.error ? A.warn(`[abr] MediaCapabilities decodingInfo error: "${re.error}" for level ${ge} ${JSON.stringify(re)}`) : re.supported || (A.warn(`[abr] Unsupported MediaCapabilities decodingInfo result for level ${ge} ${JSON.stringify(re)}`), ge > -1 && he.length > 1 && (A.log(`[abr] Removing unsupported level ${ge}`), this.hls.removeLevel(ge)));
        })) : U.supportedResult = fn;
      }
      if (S && U.codecSet !== S || C && U.videoRange !== C || q && R > U.frameRate || !q && R > 0 && R < U.frameRate || U.supportedResult && !((K = U.supportedResult.decodingInfoResults) != null && K[0].smooth)) {
        P.push(N);
        continue;
      }
      const Q = U.details, B = (f ? Q == null ? void 0 : Q.partTarget : Q == null ? void 0 : Q.averagetargetduration) || _;
      let F;
      q ? F = o * e : F = r * e;
      const j = _ && s >= _ * 2 && n === 0 ? g[N].averageBitrate : g[N].maxBitrate, W = this.getTimeToLoadFrag(O, F, j * B, Q === void 0);
      if (
        // if adjusted bw is greater than level bitrate AND
        F >= j && // no level change, or new level has no error history
        (N === c || U.loadError === 0 && U.fragmentError === 0) && // fragment fetchDuration unknown OR live stream OR fragment fetchDuration less than max allowed fetch duration, then this level matches
        // we don't account for max Fetch Duration for live streams, this is to avoid switching down when near the edge of live sliding window ...
        // special case to support startLevel = -1 (bitrateTest) on live streams : in that case we should not exit loop so that findBestLevel will return -1
        (W <= O || !M(W) || x && !this.bitrateTestDelay || W < h)
      ) {
        const ie = this.forcedAutoLevel;
        return N !== T && (ie === -1 || ie !== T) && (P.length && A.trace(`[abr] Skipped level(s) ${P.join(",")} of ${i} max with CODECS and VIDEO-RANGE:"${g[P[0]].codecs}" ${g[P[0]].videoRange}; not compatible with "${E.codecs}" ${C}`), A.info(`[abr] switch candidate:${u}->${N} adjustedbw(${Math.round(F)})-bitrate=${Math.round(F - j)} ttfb:${O.toFixed(1)} avgDuration:${B.toFixed(1)} maxFetchDuration:${h.toFixed(1)} fetchDuration:${W.toFixed(1)} firstSelection:${v} codecSet:${S} videoRange:${C} hls.loadLevel:${T}`)), v && (this.firstSelection = N), N;
      }
    }
    return -1;
  }
  set nextAutoLevel(e) {
    const {
      maxAutoLevel: t,
      minAutoLevel: i
    } = this.hls, s = Math.min(Math.max(e, i), t);
    this._nextAutoLevel !== s && (this.nextAutoLevelKey = "", this._nextAutoLevel = s);
  }
}
class Na {
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
var oe = {
  NOT_LOADED: "NOT_LOADED",
  APPENDING: "APPENDING",
  PARTIAL: "PARTIAL",
  OK: "OK"
};
class Ua {
  constructor(e) {
    this.activePartLists = /* @__PURE__ */ Object.create(null), this.endListFragments = /* @__PURE__ */ Object.create(null), this.fragments = /* @__PURE__ */ Object.create(null), this.timeRanges = /* @__PURE__ */ Object.create(null), this.bufferPadding = 0.2, this.hls = void 0, this.hasGaps = !1, this.hls = e, this._registerListeners();
  }
  _registerListeners() {
    const {
      hls: e
    } = this;
    e.on(p.BUFFER_APPENDED, this.onBufferAppended, this), e.on(p.FRAG_BUFFERED, this.onFragBuffered, this), e.on(p.FRAG_LOADED, this.onFragLoaded, this);
  }
  _unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(p.BUFFER_APPENDED, this.onBufferAppended, this), e.off(p.FRAG_BUFFERED, this.onFragBuffered, this), e.off(p.FRAG_LOADED, this.onFragLoaded, this);
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
    const i = this.activePartLists[t];
    if (i)
      for (let s = i.length; s--; ) {
        const n = i[s];
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
      fragments: i
    } = this, s = Object.keys(i);
    for (let n = s.length; n--; ) {
      const r = i[s[n]];
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
  detectEvictedFragments(e, t, i, s) {
    this.timeRanges && (this.timeRanges[e] = t);
    const n = (s == null ? void 0 : s.fragment.sn) || -1;
    Object.keys(this.fragments).forEach((r) => {
      const o = this.fragments[r];
      if (!o || n >= o.body.sn)
        return;
      if (!o.buffered && !o.loaded) {
        o.body.type === i && this.removeFragment(o.body);
        return;
      }
      const l = o.range[e];
      l && l.time.some((h) => {
        const c = !this.isTimeBuffered(h.startPTS, h.endPTS, t);
        return c && this.removeFragment(o.body), c;
      });
    });
  }
  /**
   * Checks if the fragment passed in is loaded in the buffer properly
   * Partially loaded fragments will be registered as a partial fragment
   */
  detectPartialFragments(e) {
    const t = this.timeRanges, {
      frag: i,
      part: s
    } = e;
    if (!t || i.sn === "initSegment")
      return;
    const n = Ve(i), r = this.fragments[n];
    if (!r || r.buffered && i.gap)
      return;
    const o = !i.relurl;
    Object.keys(t).forEach((l) => {
      const h = i.elementaryStreams[l];
      if (!h)
        return;
      const c = t[l], u = o || h.partial === !0;
      r.range[l] = this.getBufferedTimes(i, s, u, c);
    }), r.loaded = null, Object.keys(r.range).length ? (r.buffered = !0, (r.body.endList = i.endList || r.body.endList) && (this.endListFragments[r.body.type] = r), lt(r) || this.removeParts(i.sn - 1, i.type)) : this.removeFragment(r.body);
  }
  removeParts(e, t) {
    const i = this.activePartLists[t];
    i && (this.activePartLists[t] = i.filter((s) => s.fragment.sn >= e));
  }
  fragBuffered(e, t) {
    const i = Ve(e);
    let s = this.fragments[i];
    !s && t && (s = this.fragments[i] = {
      body: e,
      appendedPTS: null,
      loaded: null,
      buffered: !1,
      range: /* @__PURE__ */ Object.create(null)
    }, e.gap && (this.hasGaps = !0)), s && (s.loaded = null, s.buffered = !0);
  }
  getBufferedTimes(e, t, i, s) {
    const n = {
      time: [],
      partial: i
    }, r = e.start, o = e.end, l = e.minEndPTS || o, h = e.maxStartPTS || r;
    for (let c = 0; c < s.length; c++) {
      const u = s.start(c) - this.bufferPadding, d = s.end(c) + this.bufferPadding;
      if (h >= u && l <= d) {
        n.time.push({
          startPTS: Math.max(r, s.start(c)),
          endPTS: Math.min(o, s.end(c))
        });
        break;
      } else if (r < d && o > u) {
        const f = Math.max(r, s.start(c)), g = Math.min(o, s.end(c));
        g > f && (n.partial = !0, n.time.push({
          startPTS: f,
          endPTS: g
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
    let t = null, i, s, n, r = 0;
    const {
      bufferPadding: o,
      fragments: l
    } = this;
    return Object.keys(l).forEach((h) => {
      const c = l[h];
      c && lt(c) && (s = c.body.start - o, n = c.body.end + o, e >= s && e <= n && (i = Math.min(e - s, n - e), r <= i && (t = c.body, r = i)));
    }), t;
  }
  isEndListAppended(e) {
    const t = this.endListFragments[e];
    return t !== void 0 && (t.buffered || lt(t));
  }
  getState(e) {
    const t = Ve(e), i = this.fragments[t];
    return i ? i.buffered ? lt(i) ? oe.PARTIAL : oe.OK : oe.APPENDING : oe.NOT_LOADED;
  }
  isTimeBuffered(e, t, i) {
    let s, n;
    for (let r = 0; r < i.length; r++) {
      if (s = i.start(r) - this.bufferPadding, n = i.end(r) + this.bufferPadding, e >= s && t <= n)
        return !0;
      if (t <= s)
        return !1;
    }
    return !1;
  }
  onFragLoaded(e, t) {
    const {
      frag: i,
      part: s
    } = t;
    if (i.sn === "initSegment" || i.bitrateTest)
      return;
    const n = s ? null : t, r = Ve(i);
    this.fragments[r] = {
      body: i,
      appendedPTS: null,
      loaded: n,
      buffered: !1,
      range: /* @__PURE__ */ Object.create(null)
    };
  }
  onBufferAppended(e, t) {
    const {
      frag: i,
      part: s,
      timeRanges: n
    } = t;
    if (i.sn === "initSegment")
      return;
    const r = i.type;
    if (s) {
      let o = this.activePartLists[r];
      o || (this.activePartLists[r] = o = []), o.push(s);
    }
    this.timeRanges = n, Object.keys(n).forEach((o) => {
      const l = n[o];
      this.detectEvictedFragments(o, l, r, s);
    });
  }
  onFragBuffered(e, t) {
    this.detectPartialFragments(t);
  }
  hasFragment(e) {
    const t = Ve(e);
    return !!this.fragments[t];
  }
  hasParts(e) {
    var t;
    return !!((t = this.activePartLists[e]) != null && t.length);
  }
  removeFragmentsInRange(e, t, i, s, n) {
    s && !this.hasGaps || Object.keys(this.fragments).forEach((r) => {
      const o = this.fragments[r];
      if (!o)
        return;
      const l = o.body;
      l.type !== i || s && !l.gap || l.start < t && l.end > e && (o.buffered || n) && this.removeFragment(l);
    });
  }
  removeFragment(e) {
    const t = Ve(e);
    e.stats.loaded = 0, e.clearElementaryStreamInfo();
    const i = this.activePartLists[e.type];
    if (i) {
      const s = e.sn;
      this.activePartLists[e.type] = i.filter((n) => n.fragment.sn !== s);
    }
    delete this.fragments[t], e.endList && delete this.endListFragments[e.type];
  }
  removeAllFragments() {
    this.fragments = /* @__PURE__ */ Object.create(null), this.endListFragments = /* @__PURE__ */ Object.create(null), this.activePartLists = /* @__PURE__ */ Object.create(null), this.hasGaps = !1;
  }
}
function lt(a) {
  var e, t, i;
  return a.buffered && (a.body.gap || ((e = a.range.video) == null ? void 0 : e.partial) || ((t = a.range.audio) == null ? void 0 : t.partial) || ((i = a.range.audiovideo) == null ? void 0 : i.partial));
}
function Ve(a) {
  return `${a.type}_${a.level}_${a.sn}`;
}
const Ba = {
  length: 0,
  start: () => 0,
  end: () => 0
};
class Z {
  /**
   * Return true if `media`'s buffered include `position`
   */
  static isBuffered(e, t) {
    try {
      if (e) {
        const i = Z.getBuffered(e);
        for (let s = 0; s < i.length; s++)
          if (t >= i.start(s) && t <= i.end(s))
            return !0;
      }
    } catch {
    }
    return !1;
  }
  static bufferInfo(e, t, i) {
    try {
      if (e) {
        const s = Z.getBuffered(e), n = [];
        let r;
        for (r = 0; r < s.length; r++)
          n.push({
            start: s.start(r),
            end: s.end(r)
          });
        return this.bufferedInfo(n, t, i);
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
  static bufferedInfo(e, t, i) {
    t = Math.max(0, t), e.sort(function(h, c) {
      const u = h.start - c.start;
      return u || c.end - h.end;
    });
    let s = [];
    if (i)
      for (let h = 0; h < e.length; h++) {
        const c = s.length;
        if (c) {
          const u = s[c - 1].end;
          e[h].start - u < i ? e[h].end > u && (s[c - 1].end = e[h].end) : s.push(e[h]);
        } else
          s.push(e[h]);
      }
    else
      s = e;
    let n = 0, r, o = t, l = t;
    for (let h = 0; h < s.length; h++) {
      const c = s[h].start, u = s[h].end;
      if (t + i >= c && t < u)
        o = c, l = u, n = l - t;
      else if (t + i < c) {
        r = c;
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
      return A.log("failed to get media.buffered", t), Ba;
    }
  }
}
class Ii {
  constructor(e, t, i, s = 0, n = -1, r = !1) {
    this.level = void 0, this.sn = void 0, this.part = void 0, this.id = void 0, this.size = void 0, this.partial = void 0, this.transmuxing = ht(), this.buffering = {
      audio: ht(),
      video: ht(),
      audiovideo: ht()
    }, this.level = e, this.sn = t, this.id = i, this.size = s, this.part = n, this.partial = r;
  }
}
function ht() {
  return {
    start: 0,
    executeStart: 0,
    executeEnd: 0,
    end: 0
  };
}
function yt(a, e) {
  for (let i = 0, s = a.length; i < s; i++) {
    var t;
    if (((t = a[i]) == null ? void 0 : t.cc) === e)
      return a[i];
  }
  return null;
}
function $a(a, e, t) {
  return !!(e && (t.endCC > t.startCC || a && a.cc < t.startCC));
}
function Ga(a, e) {
  const t = a.fragments, i = e.fragments;
  if (!i.length || !t.length) {
    A.log("No fragments to align");
    return;
  }
  const s = yt(t, i[0].cc);
  if (!s || s && !s.startPTS) {
    A.log("No frag in previous level to align on");
    return;
  }
  return s;
}
function ms(a, e) {
  if (a) {
    const t = a.start + e;
    a.start = a.startPTS = t, a.endPTS = t + a.duration;
  }
}
function gn(a, e) {
  const t = e.fragments;
  for (let i = 0, s = t.length; i < s; i++)
    ms(t[i], a);
  e.fragmentHint && ms(e.fragmentHint, a), e.alignedSliding = !0;
}
function Ka(a, e, t) {
  e && (Va(a, t, e), !t.alignedSliding && e && _t(t, e), !t.alignedSliding && e && !t.skippedSegments && hn(e, t));
}
function Va(a, e, t) {
  if ($a(a, t, e)) {
    const i = Ga(t, e);
    i && M(i.start) && (A.log(`Adjusting PTS using last level due to CC increase within current level ${e.url}`), gn(i.start, e));
  }
}
function _t(a, e) {
  if (!a.hasProgramDateTime || !e.hasProgramDateTime)
    return;
  const t = a.fragments, i = e.fragments;
  if (!t.length || !i.length)
    return;
  let s, n;
  const r = Math.min(e.endCC, a.endCC);
  e.startCC < r && a.startCC < r && (s = yt(i, r), n = yt(t, r)), (!s || !n) && (s = i[Math.floor(i.length / 2)], n = yt(t, s.cc) || t[Math.floor(t.length / 2)]);
  const o = s.programDateTime, l = n.programDateTime;
  if (!o || !l)
    return;
  const h = (l - o) / 1e3 - (n.start - s.start);
  gn(h, a);
}
const ps = Math.pow(2, 17);
class Ha {
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
    const i = e.url;
    if (!i)
      return Promise.reject(new we({
        type: V.NETWORK_ERROR,
        details: b.FRAG_LOAD_ERROR,
        fatal: !1,
        frag: e,
        error: new Error(`Fragment does not have a ${i ? "part list" : "url"}`),
        networkDetails: null
      }));
    this.abort();
    const s = this.config, n = s.fLoader, r = s.loader;
    return new Promise((o, l) => {
      if (this.loader && this.loader.destroy(), e.gap)
        if (e.tagList.some((f) => f[0] === "GAP")) {
          l(ys(e));
          return;
        } else
          e.gap = !1;
      const h = this.loader = e.loader = n ? new n(s) : new r(s), c = Ts(e), u = ds(s.fragLoadPolicy.default), d = {
        loadPolicy: u,
        timeout: u.maxLoadTimeMs,
        maxRetry: 0,
        retryDelay: 0,
        maxRetryDelay: 0,
        highWaterMark: e.sn === "initSegment" ? 1 / 0 : ps
      };
      e.stats = h.stats, h.load(c, d, {
        onSuccess: (f, g, m, T) => {
          this.resetLoader(e, h);
          let y = f.data;
          m.resetIV && e.decryptdata && (e.decryptdata.iv = new Uint8Array(y.slice(0, 16)), y = y.slice(16)), o({
            frag: e,
            part: null,
            payload: y,
            networkDetails: T
          });
        },
        onError: (f, g, m, T) => {
          this.resetLoader(e, h), l(new we({
            type: V.NETWORK_ERROR,
            details: b.FRAG_LOAD_ERROR,
            fatal: !1,
            frag: e,
            response: le({
              url: i,
              data: void 0
            }, f),
            error: new Error(`HTTP Error ${f.code} ${f.text}`),
            networkDetails: m,
            stats: T
          }));
        },
        onAbort: (f, g, m) => {
          this.resetLoader(e, h), l(new we({
            type: V.NETWORK_ERROR,
            details: b.INTERNAL_ABORTED,
            fatal: !1,
            frag: e,
            error: new Error("Aborted"),
            networkDetails: m,
            stats: f
          }));
        },
        onTimeout: (f, g, m) => {
          this.resetLoader(e, h), l(new we({
            type: V.NETWORK_ERROR,
            details: b.FRAG_LOAD_TIMEOUT,
            fatal: !1,
            frag: e,
            error: new Error(`Timeout after ${d.timeout}ms`),
            networkDetails: m,
            stats: f
          }));
        },
        onProgress: (f, g, m, T) => {
          t && t({
            frag: e,
            part: null,
            payload: m,
            networkDetails: T
          });
        }
      });
    });
  }
  loadPart(e, t, i) {
    this.abort();
    const s = this.config, n = s.fLoader, r = s.loader;
    return new Promise((o, l) => {
      if (this.loader && this.loader.destroy(), e.gap || t.gap) {
        l(ys(e, t));
        return;
      }
      const h = this.loader = e.loader = n ? new n(s) : new r(s), c = Ts(e, t), u = ds(s.fragLoadPolicy.default), d = {
        loadPolicy: u,
        timeout: u.maxLoadTimeMs,
        maxRetry: 0,
        retryDelay: 0,
        maxRetryDelay: 0,
        highWaterMark: ps
      };
      t.stats = h.stats, h.load(c, d, {
        onSuccess: (f, g, m, T) => {
          this.resetLoader(e, h), this.updateStatsFromPart(e, t);
          const y = {
            frag: e,
            part: t,
            payload: f.data,
            networkDetails: T
          };
          i(y), o(y);
        },
        onError: (f, g, m, T) => {
          this.resetLoader(e, h), l(new we({
            type: V.NETWORK_ERROR,
            details: b.FRAG_LOAD_ERROR,
            fatal: !1,
            frag: e,
            part: t,
            response: le({
              url: c.url,
              data: void 0
            }, f),
            error: new Error(`HTTP Error ${f.code} ${f.text}`),
            networkDetails: m,
            stats: T
          }));
        },
        onAbort: (f, g, m) => {
          e.stats.aborted = t.stats.aborted, this.resetLoader(e, h), l(new we({
            type: V.NETWORK_ERROR,
            details: b.INTERNAL_ABORTED,
            fatal: !1,
            frag: e,
            part: t,
            error: new Error("Aborted"),
            networkDetails: m,
            stats: f
          }));
        },
        onTimeout: (f, g, m) => {
          this.resetLoader(e, h), l(new we({
            type: V.NETWORK_ERROR,
            details: b.FRAG_LOAD_TIMEOUT,
            fatal: !1,
            frag: e,
            part: t,
            error: new Error(`Timeout after ${d.timeout}ms`),
            networkDetails: m,
            stats: f
          }));
        }
      });
    });
  }
  updateStatsFromPart(e, t) {
    const i = e.stats, s = t.stats, n = s.total;
    if (i.loaded += s.loaded, n) {
      const l = Math.round(e.duration / t.duration), h = Math.min(Math.round(i.loaded / n), l), u = (l - h) * Math.round(i.loaded / h);
      i.total = i.loaded + u;
    } else
      i.total = Math.max(i.loaded, i.total);
    const r = i.loading, o = s.loading;
    r.start ? r.first += o.first - o.start : (r.start = o.start, r.first = o.first), r.end = o.end;
  }
  resetLoader(e, t) {
    e.loader = null, this.loader === t && (self.clearTimeout(this.partLoadTimeout), this.loader = null), t.destroy();
  }
}
function Ts(a, e = null) {
  const t = e || a, i = {
    frag: a,
    part: e,
    responseType: "arraybuffer",
    url: t.url,
    headers: {},
    rangeStart: 0,
    rangeEnd: 0
  }, s = t.byteRangeStartOffset, n = t.byteRangeEndOffset;
  if (M(s) && M(n)) {
    var r;
    let o = s, l = n;
    if (a.sn === "initSegment" && ((r = a.decryptdata) == null ? void 0 : r.method) === "AES-128") {
      const h = n - s;
      h % 16 && (l = n + (16 - h % 16)), s !== 0 && (i.resetIV = !0, o = s - 16);
    }
    i.rangeStart = o, i.rangeEnd = l;
  }
  return i;
}
function ys(a, e) {
  const t = new Error(`GAP ${a.gap ? "tag" : "attribute"} found`), i = {
    type: V.MEDIA_ERROR,
    details: b.FRAG_GAP,
    fatal: !1,
    frag: a,
    error: t,
    networkDetails: null
  };
  return e && (i.part = e), (e || a).stats.aborted = !0, new we(i);
}
class we extends Error {
  constructor(e) {
    super(e.error.message), this.data = void 0, this.data = e;
  }
}
class Wa {
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
class Ya {
  constructor(e, t) {
    this.subtle = void 0, this.key = void 0, this.subtle = e, this.key = t;
  }
  expandKey() {
    return this.subtle.importKey("raw", this.key, {
      name: "AES-CBC"
    }, !1, ["encrypt", "decrypt"]);
  }
}
function qa(a) {
  const e = a.byteLength, t = e && new DataView(a.buffer).getUint8(e - 1);
  return t ? Ue(a, 0, e - t) : a;
}
class ja {
  constructor() {
    this.rcon = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], this.subMix = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)], this.invSubMix = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)], this.sBox = new Uint32Array(256), this.invSBox = new Uint32Array(256), this.key = new Uint32Array(0), this.ksRows = 0, this.keySize = 0, this.keySchedule = void 0, this.invKeySchedule = void 0, this.initTable();
  }
  // Using view.getUint32() also swaps the byte order.
  uint8ArrayToUint32Array_(e) {
    const t = new DataView(e), i = new Uint32Array(4);
    for (let s = 0; s < 4; s++)
      i[s] = t.getUint32(s * 4);
    return i;
  }
  initTable() {
    const e = this.sBox, t = this.invSBox, i = this.subMix, s = i[0], n = i[1], r = i[2], o = i[3], l = this.invSubMix, h = l[0], c = l[1], u = l[2], d = l[3], f = new Uint32Array(256);
    let g = 0, m = 0, T = 0;
    for (T = 0; T < 256; T++)
      T < 128 ? f[T] = T << 1 : f[T] = T << 1 ^ 283;
    for (T = 0; T < 256; T++) {
      let y = m ^ m << 1 ^ m << 2 ^ m << 3 ^ m << 4;
      y = y >>> 8 ^ y & 255 ^ 99, e[g] = y, t[y] = g;
      const E = f[g], x = f[E], v = f[x];
      let S = f[y] * 257 ^ y * 16843008;
      s[g] = S << 24 | S >>> 8, n[g] = S << 16 | S >>> 16, r[g] = S << 8 | S >>> 24, o[g] = S, S = v * 16843009 ^ x * 65537 ^ E * 257 ^ g * 16843008, h[y] = S << 24 | S >>> 8, c[y] = S << 16 | S >>> 16, u[y] = S << 8 | S >>> 24, d[y] = S, g ? (g = E ^ f[f[f[v ^ E]]], m ^= f[f[m]]) : g = m = 1;
    }
  }
  expandKey(e) {
    const t = this.uint8ArrayToUint32Array_(e);
    let i = !0, s = 0;
    for (; s < t.length && i; )
      i = t[s] === this.key[s], s++;
    if (i)
      return;
    this.key = t;
    const n = this.keySize = t.length;
    if (n !== 4 && n !== 6 && n !== 8)
      throw new Error("Invalid aes key size=" + n);
    const r = this.ksRows = (n + 6 + 1) * 4;
    let o, l;
    const h = this.keySchedule = new Uint32Array(r), c = this.invKeySchedule = new Uint32Array(r), u = this.sBox, d = this.rcon, f = this.invSubMix, g = f[0], m = f[1], T = f[2], y = f[3];
    let E, x;
    for (o = 0; o < r; o++) {
      if (o < n) {
        E = h[o] = t[o];
        continue;
      }
      x = E, o % n === 0 ? (x = x << 8 | x >>> 24, x = u[x >>> 24] << 24 | u[x >>> 16 & 255] << 16 | u[x >>> 8 & 255] << 8 | u[x & 255], x ^= d[o / n | 0] << 24) : n > 6 && o % n === 4 && (x = u[x >>> 24] << 24 | u[x >>> 16 & 255] << 16 | u[x >>> 8 & 255] << 8 | u[x & 255]), h[o] = E = (h[o - n] ^ x) >>> 0;
    }
    for (l = 0; l < r; l++)
      o = r - l, l & 3 ? x = h[o] : x = h[o - 4], l < 4 || o <= 4 ? c[l] = x : c[l] = g[u[x >>> 24]] ^ m[u[x >>> 16 & 255]] ^ T[u[x >>> 8 & 255]] ^ y[u[x & 255]], c[l] = c[l] >>> 0;
  }
  // Adding this as a method greatly improves performance.
  networkToHostOrderSwap(e) {
    return e << 24 | (e & 65280) << 8 | (e & 16711680) >> 8 | e >>> 24;
  }
  decrypt(e, t, i) {
    const s = this.keySize + 6, n = this.invKeySchedule, r = this.invSBox, o = this.invSubMix, l = o[0], h = o[1], c = o[2], u = o[3], d = this.uint8ArrayToUint32Array_(i);
    let f = d[0], g = d[1], m = d[2], T = d[3];
    const y = new Int32Array(e), E = new Int32Array(y.length);
    let x, v, S, C, R, I, D, w, _, O, P, K, N, U;
    const q = this.networkToHostOrderSwap;
    for (; t < y.length; ) {
      for (_ = q(y[t]), O = q(y[t + 1]), P = q(y[t + 2]), K = q(y[t + 3]), R = _ ^ n[0], I = K ^ n[1], D = P ^ n[2], w = O ^ n[3], N = 4, U = 1; U < s; U++)
        x = l[R >>> 24] ^ h[I >> 16 & 255] ^ c[D >> 8 & 255] ^ u[w & 255] ^ n[N], v = l[I >>> 24] ^ h[D >> 16 & 255] ^ c[w >> 8 & 255] ^ u[R & 255] ^ n[N + 1], S = l[D >>> 24] ^ h[w >> 16 & 255] ^ c[R >> 8 & 255] ^ u[I & 255] ^ n[N + 2], C = l[w >>> 24] ^ h[R >> 16 & 255] ^ c[I >> 8 & 255] ^ u[D & 255] ^ n[N + 3], R = x, I = v, D = S, w = C, N = N + 4;
      x = r[R >>> 24] << 24 ^ r[I >> 16 & 255] << 16 ^ r[D >> 8 & 255] << 8 ^ r[w & 255] ^ n[N], v = r[I >>> 24] << 24 ^ r[D >> 16 & 255] << 16 ^ r[w >> 8 & 255] << 8 ^ r[R & 255] ^ n[N + 1], S = r[D >>> 24] << 24 ^ r[w >> 16 & 255] << 16 ^ r[R >> 8 & 255] << 8 ^ r[I & 255] ^ n[N + 2], C = r[w >>> 24] << 24 ^ r[R >> 16 & 255] << 16 ^ r[I >> 8 & 255] << 8 ^ r[D & 255] ^ n[N + 3], E[t] = q(x ^ f), E[t + 1] = q(C ^ g), E[t + 2] = q(S ^ m), E[t + 3] = q(v ^ T), f = _, g = O, m = P, T = K, t = t + 4;
    }
    return E.buffer;
  }
}
const za = 16;
class Ci {
  constructor(e, {
    removePKCS7Padding: t = !0
  } = {}) {
    if (this.logEnabled = !0, this.removePKCS7Padding = void 0, this.subtle = null, this.softwareDecrypter = null, this.key = null, this.fastAesKey = null, this.remainderData = null, this.currentIV = null, this.currentResult = null, this.useSoftware = void 0, this.useSoftware = e.enableSoftwareAES, this.removePKCS7Padding = t, t)
      try {
        const i = self.crypto;
        i && (this.subtle = i.subtle || i.webkitSubtle);
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
    const i = new Uint8Array(e);
    return this.reset(), this.removePKCS7Padding ? qa(i) : i;
  }
  reset() {
    this.currentResult = null, this.currentIV = null, this.remainderData = null, this.softwareDecrypter && (this.softwareDecrypter = null);
  }
  decrypt(e, t, i) {
    return this.useSoftware ? new Promise((s, n) => {
      this.softwareDecrypt(new Uint8Array(e), t, i);
      const r = this.flush();
      r ? s(r.buffer) : n(new Error("[softwareDecrypt] Failed to decrypt data"));
    }) : this.webCryptoDecrypt(new Uint8Array(e), t, i);
  }
  // Software decryption is progressive. Progressive decryption may not return a result on each call. Any cached
  // data is handled in the flush() call
  softwareDecrypt(e, t, i) {
    const {
      currentIV: s,
      currentResult: n,
      remainderData: r
    } = this;
    this.logOnce("JS AES decrypt"), r && (e = Te(r, e), this.remainderData = null);
    const o = this.getValidChunk(e);
    if (!o.length)
      return null;
    s && (i = s);
    let l = this.softwareDecrypter;
    l || (l = this.softwareDecrypter = new ja()), l.expandKey(t);
    const h = n;
    return this.currentResult = l.decrypt(o.buffer, 0, i), this.currentIV = Ue(o, -16).buffer, h || null;
  }
  webCryptoDecrypt(e, t, i) {
    if (this.key !== t || !this.fastAesKey) {
      if (!this.subtle)
        return Promise.resolve(this.onWebCryptoError(e, t, i));
      this.key = t, this.fastAesKey = new Ya(this.subtle, t);
    }
    return this.fastAesKey.expandKey().then((s) => this.subtle ? (this.logOnce("WebCrypto AES decrypt"), new Wa(this.subtle, new Uint8Array(i)).decrypt(e.buffer, s)) : Promise.reject(new Error("web crypto not initialized"))).catch((s) => (A.warn(`[decrypter]: WebCrypto Error, disable WebCrypto API, ${s.name}: ${s.message}`), this.onWebCryptoError(e, t, i)));
  }
  onWebCryptoError(e, t, i) {
    this.useSoftware = !0, this.logEnabled = !0, this.softwareDecrypt(e, t, i);
    const s = this.flush();
    if (s)
      return s.buffer;
    throw new Error("WebCrypto and softwareDecrypt: failed to decrypt data");
  }
  getValidChunk(e) {
    let t = e;
    const i = e.length - e.length % za;
    return i !== e.length && (t = Ue(e, 0, i), this.remainderData = Ue(e, i)), t;
  }
  logOnce(e) {
    this.logEnabled && (A.log(`[decrypter]: ${e}`), this.logEnabled = !1);
  }
}
const Xa = {
  toString: function(a) {
    let e = "";
    const t = a.length;
    for (let i = 0; i < t; i++)
      e += `[${a.start(i).toFixed(3)}-${a.end(i).toFixed(3)}]`;
    return e;
  }
}, k = {
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
class Di extends Na {
  constructor(e, t, i, s, n) {
    super(), this.hls = void 0, this.fragPrevious = null, this.fragCurrent = null, this.fragmentTracker = void 0, this.transmuxer = null, this._state = k.STOPPED, this.playlistType = void 0, this.media = null, this.mediaBuffer = null, this.config = void 0, this.bitrateTest = !1, this.lastCurrentTime = 0, this.nextLoadPosition = 0, this.startPosition = 0, this.startTimeOffset = null, this.loadedmetadata = !1, this.retryDate = 0, this.levels = null, this.fragmentLoader = void 0, this.keyLoader = void 0, this.levelLastLoaded = null, this.startFragRequested = !1, this.decrypter = void 0, this.initPTS = [], this.onvseeking = null, this.onvended = null, this.logPrefix = "", this.log = void 0, this.warn = void 0, this.playlistType = n, this.logPrefix = s, this.log = A.log.bind(A, `${s}:`), this.warn = A.warn.bind(A, `${s}:`), this.hls = e, this.fragmentLoader = new Ha(e.config), this.keyLoader = i, this.fragmentTracker = t, this.config = e.config, this.decrypter = new Ci(e.config), e.on(p.MANIFEST_LOADED, this.onManifestLoaded, this);
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
    e != null && e.loader && (e.abortRequests(), this.fragmentTracker.removeFragment(e)), this.resetTransmuxer(), this.fragCurrent = null, this.fragPrevious = null, this.clearInterval(), this.clearNextTick(), this.state = k.STOPPED;
  }
  _streamEnded(e, t) {
    if (t.live || e.nextStart || !e.end || !this.media)
      return !1;
    const i = t.partList;
    if (i != null && i.length) {
      const n = i[i.length - 1];
      return Z.isBuffered(this.media, n.start + n.duration / 2);
    }
    const s = t.fragments[t.fragments.length - 1].type;
    return this.fragmentTracker.isEndListAppended(s);
  }
  getLevelDetails() {
    if (this.levels && this.levelLastLoaded !== null) {
      var e;
      return (e = this.levelLastLoaded) == null ? void 0 : e.details;
    }
  }
  onMediaAttached(e, t) {
    const i = this.media = this.mediaBuffer = t.media;
    this.onvseeking = this.onMediaSeeking.bind(this), this.onvended = this.onMediaEnded.bind(this), i.addEventListener("seeking", this.onvseeking), i.addEventListener("ended", this.onvended);
    const s = this.config;
    this.levels && s.autoStartLoad && this.state === k.STOPPED && this.startLoad(s.startPosition);
  }
  onMediaDetaching() {
    const e = this.media;
    e != null && e.ended && (this.log("MSE detaching and video ended, reset startPosition"), this.startPosition = this.lastCurrentTime = 0), e && this.onvseeking && this.onvended && (e.removeEventListener("seeking", this.onvseeking), e.removeEventListener("ended", this.onvended), this.onvseeking = this.onvended = null), this.keyLoader && this.keyLoader.detach(), this.media = this.mediaBuffer = null, this.loadedmetadata = !1, this.fragmentTracker.removeAllFragments(), this.stopLoad();
  }
  onMediaSeeking() {
    const {
      config: e,
      fragCurrent: t,
      media: i,
      mediaBuffer: s,
      state: n
    } = this, r = i ? i.currentTime : 0, o = Z.bufferInfo(s || i, r, e.maxBufferHole);
    if (this.log(`media seeking to ${M(r) ? r.toFixed(3) : r}, state: ${n}`), this.state === k.ENDED)
      this.resetLoadingState();
    else if (t) {
      const l = e.maxFragLookUpTolerance, h = t.start - l, c = t.start + t.duration + l;
      if (!o.len || c < o.start || h > o.end) {
        const u = r > c;
        (r < h || u) && (u && t.loader && (this.log("seeking outside of buffer while fragment load in progress, cancel fragment load"), t.abortRequests(), this.resetLoadingState()), this.fragPrevious = null);
      }
    }
    i && (this.fragmentTracker.removeFragmentsInRange(r, 1 / 0, this.playlistType, !0), this.lastCurrentTime = r), !this.loadedmetadata && !o.len && (this.nextLoadPosition = this.startPosition = r), this.tickImmediate();
  }
  onMediaEnded() {
    this.startPosition = this.lastCurrentTime = 0;
  }
  onManifestLoaded(e, t) {
    this.startTimeOffset = t.startTimeOffset, this.initPTS = [];
  }
  onHandlerDestroying() {
    this.hls.off(p.MANIFEST_LOADED, this.onManifestLoaded, this), this.stopLoad(), super.onHandlerDestroying(), this.hls = null;
  }
  onHandlerDestroyed() {
    this.state = k.STOPPED, this.fragmentLoader && this.fragmentLoader.destroy(), this.keyLoader && this.keyLoader.destroy(), this.decrypter && this.decrypter.destroy(), this.hls = this.log = this.warn = this.decrypter = this.keyLoader = this.fragmentLoader = this.fragmentTracker = null, super.onHandlerDestroyed();
  }
  loadFragment(e, t, i) {
    this._loadFragForPlayback(e, t, i);
  }
  _loadFragForPlayback(e, t, i) {
    const s = (n) => {
      if (this.fragContextChanged(e)) {
        this.warn(`Fragment ${e.sn}${n.part ? " p: " + n.part.index : ""} of level ${e.level} was dropped during download.`), this.fragmentTracker.removeFragment(e);
        return;
      }
      e.stats.chunkCount++, this._handleFragmentLoadProgress(n);
    };
    this._doFragLoad(e, t, i, s).then((n) => {
      if (!n)
        return;
      const r = this.state;
      if (this.fragContextChanged(e)) {
        (r === k.FRAG_LOADING || !this.fragCurrent && r === k.PARSING) && (this.fragmentTracker.removeFragment(e), this.state = k.IDLE);
        return;
      }
      "payload" in n && (this.log(`Loaded fragment ${e.sn} of level ${e.level}`), this.hls.trigger(p.FRAG_LOADED, n)), this._handleFragmentLoadComplete(n);
    }).catch((n) => {
      this.state === k.STOPPED || this.state === k.ERROR || (this.warn(`Frag error: ${(n == null ? void 0 : n.message) || n}`), this.resetFragmentLoading(e));
    });
  }
  clearTrackerIfNeeded(e) {
    var t;
    const {
      fragmentTracker: i
    } = this;
    if (i.getState(e) === oe.APPENDING) {
      const n = e.type, r = this.getFwdBufferInfo(this.mediaBuffer, n), o = Math.max(e.duration, r ? r.len : this.config.maxBufferLength), l = this.backtrackFragment;
      ((l ? e.sn - l.sn : 0) === 1 || this.reduceMaxBufferLength(o, e.duration)) && i.removeFragment(e);
    } else
      ((t = this.mediaBuffer) == null ? void 0 : t.buffered.length) === 0 ? i.removeAllFragments() : i.hasParts(e.type) && (i.detectPartialFragments({
        frag: e,
        part: null,
        stats: e.stats,
        id: e.type
      }), i.getState(e) === oe.PARTIAL && i.removeFragment(e));
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
  flushMainBuffer(e, t, i = null) {
    if (!(e - t))
      return;
    const s = {
      startOffset: e,
      endOffset: t,
      type: i
    };
    this.hls.trigger(p.BUFFER_FLUSHING, s);
  }
  _loadInitSegment(e, t) {
    this._doFragLoad(e, t).then((i) => {
      if (!i || this.fragContextChanged(e) || !this.levels)
        throw new Error("init load aborted");
      return i;
    }).then((i) => {
      const {
        hls: s
      } = this, {
        payload: n
      } = i, r = e.decryptdata;
      if (n && n.byteLength > 0 && r != null && r.key && r.iv && r.method === "AES-128") {
        const o = self.performance.now();
        return this.decrypter.decrypt(new Uint8Array(n), r.key.buffer, r.iv.buffer).catch((l) => {
          throw s.trigger(p.ERROR, {
            type: V.MEDIA_ERROR,
            details: b.FRAG_DECRYPT_ERROR,
            fatal: !1,
            error: l,
            reason: l.message,
            frag: e
          }), l;
        }).then((l) => {
          const h = self.performance.now();
          return s.trigger(p.FRAG_DECRYPTED, {
            frag: e,
            payload: l,
            stats: {
              tstart: o,
              tdecrypt: h
            }
          }), i.payload = l, this.completeInitSegmentLoad(i);
        });
      }
      return this.completeInitSegmentLoad(i);
    }).catch((i) => {
      this.state === k.STOPPED || this.state === k.ERROR || (this.warn(i), this.resetFragmentLoading(e));
    });
  }
  completeInitSegmentLoad(e) {
    const {
      levels: t
    } = this;
    if (!t)
      throw new Error("init load aborted, missing levels");
    const i = e.frag.stats;
    this.state = k.IDLE, e.frag.data = new Uint8Array(e.payload), i.parsing.start = i.buffering.start = self.performance.now(), i.parsing.end = i.buffering.end = self.performance.now(), this.tick();
  }
  fragContextChanged(e) {
    const {
      fragCurrent: t
    } = this;
    return !e || !t || e.sn !== t.sn || e.level !== t.level;
  }
  fragBufferedComplete(e, t) {
    var i, s, n, r;
    const o = this.mediaBuffer ? this.mediaBuffer : this.media;
    if (this.log(`Buffered ${e.type} sn: ${e.sn}${t ? " part: " + t.index : ""} of ${this.playlistType === G.MAIN ? "level" : "track"} ${e.level} (frag:[${((i = e.startPTS) != null ? i : NaN).toFixed(3)}-${((s = e.endPTS) != null ? s : NaN).toFixed(3)}] > buffer:${o ? Xa.toString(Z.getBuffered(o)) : "(detached)"})`), e.sn !== "initSegment") {
      var l;
      if (e.type !== G.SUBTITLE) {
        const c = e.elementaryStreams;
        if (!Object.keys(c).some((u) => !!c[u])) {
          this.state = k.IDLE;
          return;
        }
      }
      const h = (l = this.levels) == null ? void 0 : l[e.level];
      h != null && h.fragmentError && (this.log(`Resetting level fragment error count of ${h.fragmentError} on frag buffered`), h.fragmentError = 0);
    }
    this.state = k.IDLE, o && (!this.loadedmetadata && e.type == G.MAIN && o.buffered.length && ((n = this.fragCurrent) == null ? void 0 : n.sn) === ((r = this.fragPrevious) == null ? void 0 : r.sn) && (this.loadedmetadata = !0, this.seekToStartPos()), this.tick());
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
      frag: i,
      part: s,
      partsLoaded: n
    } = e, r = !n || n.length === 0 || n.some((l) => !l), o = new Ii(i.level, i.sn, i.stats.chunkCount + 1, 0, s ? s.index : -1, !r);
    t.flush(o);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _handleFragmentLoadProgress(e) {
  }
  _doFragLoad(e, t, i = null, s) {
    var n;
    const r = t == null ? void 0 : t.details;
    if (!this.levels || !r)
      throw new Error(`frag load aborted, missing level${r ? "" : " detail"}s`);
    let o = null;
    if (e.encrypted && !((n = e.decryptdata) != null && n.key) ? (this.log(`Loading key for ${e.sn} of [${r.startSN}-${r.endSN}], ${this.logPrefix === "[stream-controller]" ? "level" : "track"} ${e.level}`), this.state = k.KEY_LOADING, this.fragCurrent = e, o = this.keyLoader.load(e).then((c) => {
      if (!this.fragContextChanged(c.frag))
        return this.hls.trigger(p.KEY_LOADED, c), this.state === k.KEY_LOADING && (this.state = k.IDLE), c;
    }), this.hls.trigger(p.KEY_LOADING, {
      frag: e
    }), this.fragCurrent === null && (o = Promise.reject(new Error("frag load aborted, context changed in KEY_LOADING")))) : !e.encrypted && r.encryptedFragments.length && this.keyLoader.loadClear(e, r.encryptedFragments), i = Math.max(e.start, i || 0), this.config.lowLatencyMode && e.sn !== "initSegment") {
      const c = r.partList;
      if (c && s) {
        i > e.end && r.fragmentHint && (e = r.fragmentHint);
        const u = this.getNextPart(c, e, i);
        if (u > -1) {
          const d = c[u];
          this.log(`Loading part sn: ${e.sn} p: ${d.index} cc: ${e.cc} of playlist [${r.startSN}-${r.endSN}] parts [0-${u}-${c.length - 1}] ${this.logPrefix === "[stream-controller]" ? "level" : "track"}: ${e.level}, target: ${parseFloat(i.toFixed(3))}`), this.nextLoadPosition = d.start + d.duration, this.state = k.FRAG_LOADING;
          let f;
          return o ? f = o.then((g) => !g || this.fragContextChanged(g.frag) ? null : this.doFragPartsLoad(e, d, t, s)).catch((g) => this.handleFragLoadError(g)) : f = this.doFragPartsLoad(e, d, t, s).catch((g) => this.handleFragLoadError(g)), this.hls.trigger(p.FRAG_LOADING, {
            frag: e,
            part: d,
            targetBufferTime: i
          }), this.fragCurrent === null ? Promise.reject(new Error("frag load aborted, context changed in FRAG_LOADING parts")) : f;
        } else if (!e.url || this.loadedEndOfParts(c, i))
          return Promise.resolve(null);
      }
    }
    this.log(`Loading fragment ${e.sn} cc: ${e.cc} ${r ? "of [" + r.startSN + "-" + r.endSN + "] " : ""}${this.logPrefix === "[stream-controller]" ? "level" : "track"}: ${e.level}, target: ${parseFloat(i.toFixed(3))}`), M(e.sn) && !this.bitrateTest && (this.nextLoadPosition = e.start + e.duration), this.state = k.FRAG_LOADING;
    const l = this.config.progressive;
    let h;
    return l && o ? h = o.then((c) => !c || this.fragContextChanged(c == null ? void 0 : c.frag) ? null : this.fragmentLoader.load(e, s)).catch((c) => this.handleFragLoadError(c)) : h = Promise.all([this.fragmentLoader.load(e, l ? s : void 0), o]).then(([c]) => (!l && c && s && s(c), c)).catch((c) => this.handleFragLoadError(c)), this.hls.trigger(p.FRAG_LOADING, {
      frag: e,
      targetBufferTime: i
    }), this.fragCurrent === null ? Promise.reject(new Error("frag load aborted, context changed in FRAG_LOADING")) : h;
  }
  doFragPartsLoad(e, t, i, s) {
    return new Promise((n, r) => {
      var o;
      const l = [], h = (o = i.details) == null ? void 0 : o.partList, c = (u) => {
        this.fragmentLoader.loadPart(e, u, s).then((d) => {
          l[u.index] = d;
          const f = d.part;
          this.hls.trigger(p.FRAG_LOADED, d);
          const g = cs(i, e.sn, u.index + 1) || cn(h, e.sn, u.index + 1);
          if (g)
            c(g);
          else
            return n({
              frag: e,
              part: f,
              partsLoaded: l
            });
        }).catch(r);
      };
      c(t);
    });
  }
  handleFragLoadError(e) {
    if ("data" in e) {
      const t = e.data;
      e.data && t.details === b.INTERNAL_ABORTED ? this.handleFragLoadAborted(t.frag, t.part) : this.hls.trigger(p.ERROR, t);
    } else
      this.hls.trigger(p.ERROR, {
        type: V.OTHER_ERROR,
        details: b.INTERNAL_EXCEPTION,
        err: e,
        error: e,
        fatal: !0
      });
    return null;
  }
  _handleTransmuxerFlush(e) {
    const t = this.getCurrentContext(e);
    if (!t || this.state !== k.PARSING) {
      !this.fragCurrent && this.state !== k.STOPPED && this.state !== k.ERROR && (this.state = k.IDLE);
      return;
    }
    const {
      frag: i,
      part: s,
      level: n
    } = t, r = self.performance.now();
    i.stats.parsing.end = r, s && (s.stats.parsing.end = r), this.updateLevelTiming(i, s, n, e.partial);
  }
  getCurrentContext(e) {
    const {
      levels: t,
      fragCurrent: i
    } = this, {
      level: s,
      sn: n,
      part: r
    } = e;
    if (!(t != null && t[s]))
      return this.warn(`Levels object was unset while buffering fragment ${n} of level ${s}. The current chunk will not be buffered.`), null;
    const o = t[s], l = r > -1 ? cs(o, n, r) : null, h = l ? l.fragment : ya(o, n, i);
    return h ? (i && i !== h && (h.stats = i.stats), {
      frag: h,
      part: l,
      level: o
    }) : null;
  }
  bufferFragmentData(e, t, i, s, n) {
    var r;
    if (!e || this.state !== k.PARSING)
      return;
    const {
      data1: o,
      data2: l
    } = e;
    let h = o;
    if (o && l && (h = Te(o, l)), !((r = h) != null && r.length))
      return;
    const c = {
      type: e.type,
      frag: t,
      part: i,
      chunkMeta: s,
      parent: t.type,
      data: h
    };
    if (this.hls.trigger(p.BUFFER_APPENDING, c), e.dropped && e.independent && !i) {
      if (n)
        return;
      this.flushBufferGap(t);
    }
  }
  flushBufferGap(e) {
    const t = this.media;
    if (!t)
      return;
    if (!Z.isBuffered(t, t.currentTime)) {
      this.flushMainBuffer(0, e.start);
      return;
    }
    const i = t.currentTime, s = Z.bufferInfo(t, i, 0), n = e.duration, r = Math.min(this.config.maxFragLookUpTolerance * 2, n * 0.25), o = Math.max(Math.min(e.start - r, s.end - r), i + r);
    e.start - o > r && this.flushMainBuffer(o, e.start);
  }
  getFwdBufferInfo(e, t) {
    const i = this.getLoadPosition();
    return M(i) ? this.getFwdBufferInfoAtPos(e, i, t) : null;
  }
  getFwdBufferInfoAtPos(e, t, i) {
    const {
      config: {
        maxBufferHole: s
      }
    } = this, n = Z.bufferInfo(e, t, s);
    if (n.len === 0 && n.nextStart !== void 0) {
      const r = this.fragmentTracker.getBufferedFrag(t, i);
      if (r && n.nextStart < r.end)
        return Z.bufferInfo(e, t, Math.max(n.nextStart, s));
    }
    return n;
  }
  getMaxBufferLength(e) {
    const {
      config: t
    } = this;
    let i;
    return e ? i = Math.max(8 * t.maxBufferSize / e, t.maxBufferLength) : i = t.maxBufferLength, Math.min(i, t.maxMaxBufferLength);
  }
  reduceMaxBufferLength(e, t) {
    const i = this.config, s = Math.max(Math.min(e - t, i.maxBufferLength), t), n = Math.max(e - t * 3, i.maxMaxBufferLength / 2, s);
    return n >= s ? (i.maxMaxBufferLength = n, this.warn(`Reduce max buffer length to ${n}s`), !0) : !1;
  }
  getAppendedFrag(e, t = G.MAIN) {
    const i = this.fragmentTracker.getAppendedFrag(e, G.MAIN);
    return i && "fragment" in i ? i.fragment : i;
  }
  getNextFragment(e, t) {
    const i = t.fragments, s = i.length;
    if (!s)
      return null;
    const {
      config: n
    } = this, r = i[0].start;
    let o;
    if (t.live) {
      const l = n.initialLiveManifestSize;
      if (s < l)
        return this.warn(`Not enough fragments to start playback (have: ${s}, need: ${l})`), null;
      (!t.PTSKnown && !this.startFragRequested && this.startPosition === -1 || e < r) && (o = this.getInitialLiveFragment(t, i), this.startPosition = this.nextLoadPosition = o ? this.hls.liveSyncPosition || o.start : e);
    } else
      e <= r && (o = i[0]);
    if (!o) {
      const l = n.lowLatencyMode ? t.partEnd : t.fragmentEnd;
      o = this.getFragmentAtPosition(e, l, t);
    }
    return this.mapToInitFragWhenRequired(o);
  }
  isLoopLoading(e, t) {
    const i = this.fragmentTracker.getState(e);
    return (i === oe.OK || i === oe.PARTIAL && !!e.gap) && this.nextLoadPosition > t;
  }
  getNextFragmentLoopLoading(e, t, i, s, n) {
    const r = e.gap, o = this.getNextFragment(this.nextLoadPosition, t);
    if (o === null)
      return o;
    if (e = o, r && e && !e.gap && i.nextStart) {
      const l = this.getFwdBufferInfoAtPos(this.mediaBuffer ? this.mediaBuffer : this.media, i.nextStart, s);
      if (l !== null && i.len + l.len >= n)
        return this.log(`buffer full after gaps in "${s}" playlist starting at sn: ${e.sn}`), null;
    }
    return e;
  }
  mapToInitFragWhenRequired(e) {
    return e != null && e.initSegment && !(e != null && e.initSegment.data) && !this.bitrateTest ? e.initSegment : e;
  }
  getNextPart(e, t, i) {
    let s = -1, n = !1, r = !0;
    for (let o = 0, l = e.length; o < l; o++) {
      const h = e[o];
      if (r = r && !h.independent, s > -1 && i < h.start)
        break;
      const c = h.loaded;
      c ? s = -1 : (n || h.independent || r) && h.fragment === t && (s = o), n = c;
    }
    return s;
  }
  loadedEndOfParts(e, t) {
    const i = e[e.length - 1];
    return i && t > i.start && i.loaded;
  }
  /*
   This method is used find the best matching first fragment for a live playlist. This fragment is used to calculate the
   "sliding" of the playlist, which is its offset from the start of playback. After sliding we can compute the real
   start and end times for each fragment in the playlist (after which this method will not need to be called).
  */
  getInitialLiveFragment(e, t) {
    const i = this.fragPrevious;
    let s = null;
    if (i) {
      if (e.hasProgramDateTime && (this.log(`Live playlist, switching playlist, load frag with same PDT: ${i.programDateTime}`), s = va(t, i.endProgramDateTime, this.config.maxFragLookUpTolerance)), !s) {
        const n = i.sn + 1;
        if (n >= e.startSN && n <= e.endSN) {
          const r = t[n - e.startSN];
          i.cc === r.cc && (s = r, this.log(`Live playlist, switching playlist, load frag with next SN: ${s.sn}`));
        }
        s || (s = Aa(t, i.cc), s && this.log(`Live playlist, switching playlist, load frag with same CC: ${s.sn}`));
      }
    } else {
      const n = this.hls.liveSyncPosition;
      n !== null && (s = this.getFragmentAtPosition(n, this.bitrateTest ? e.fragmentEnd : e.edge, e));
    }
    return s;
  }
  /*
  This method finds the best matching fragment given the provided position.
   */
  getFragmentAtPosition(e, t, i) {
    const {
      config: s
    } = this;
    let {
      fragPrevious: n
    } = this, {
      fragments: r,
      endSN: o
    } = i;
    const {
      fragmentHint: l
    } = i, {
      maxFragLookUpTolerance: h
    } = s, c = i.partList, u = !!(s.lowLatencyMode && c != null && c.length && l);
    u && l && !this.bitrateTest && (r = r.concat(l), o = l.sn);
    let d;
    if (e < t) {
      const f = e > t - h ? 0 : h;
      d = kt(n, r, e, f);
    } else
      d = r[r.length - 1];
    if (d) {
      const f = d.sn - i.startSN, g = this.fragmentTracker.getState(d);
      if ((g === oe.OK || g === oe.PARTIAL && d.gap) && (n = d), n && d.sn === n.sn && (!u || c[0].fragment.sn > d.sn) && n && d.level === n.level) {
        const T = r[f + 1];
        d.sn < o && this.fragmentTracker.getState(T) !== oe.OK ? d = T : d = null;
      }
    }
    return d;
  }
  synchronizeToLiveEdge(e) {
    const {
      config: t,
      media: i
    } = this;
    if (!i)
      return;
    const s = this.hls.liveSyncPosition, n = i.currentTime, r = e.fragments[0].start, o = e.edge, l = n >= r - t.maxFragLookUpTolerance && n <= o;
    if (s !== null && i.duration > s && (n < s || !l)) {
      const h = t.liveMaxLatencyDuration !== void 0 ? t.liveMaxLatencyDuration : t.liveMaxLatencyDurationCount * e.targetduration;
      (!l && i.readyState < 4 || n < o - h) && (this.loadedmetadata || (this.nextLoadPosition = s), i.readyState && (this.warn(`Playback: ${n.toFixed(3)} is located too far from the end of live sliding playlist: ${o}, reset currentTime to : ${s.toFixed(3)}`), i.currentTime = s));
    }
  }
  alignPlaylists(e, t, i) {
    const s = e.fragments.length;
    if (!s)
      return this.warn("No fragments in live playlist"), 0;
    const n = e.fragments[0].start, r = !t, o = e.alignedSliding && M(n);
    if (r || !o && !n) {
      const {
        fragPrevious: l
      } = this;
      Ka(l, i, e);
      const h = e.fragments[0].start;
      return this.log(`Live playlist sliding: ${h.toFixed(2)} start-sn: ${t ? t.startSN : "na"}->${e.startSN} prev-sn: ${l ? l.sn : "na"} fragments: ${s}`), h;
    }
    return n;
  }
  waitForCdnTuneIn(e) {
    return e.live && e.canBlockReload && e.partTarget && e.tuneInGoal > Math.max(e.partHoldBack, e.partTarget * 3);
  }
  setStartPosition(e, t) {
    let i = this.startPosition;
    if (i < t && (i = -1), i === -1 || this.lastCurrentTime === -1) {
      const s = this.startTimeOffset !== null, n = s ? this.startTimeOffset : e.startTimeOffset;
      n !== null && M(n) ? (i = t + n, n < 0 && (i += e.totalduration), i = Math.min(Math.max(t, i), t + e.totalduration), this.log(`Start time offset ${n} found in ${s ? "multivariant" : "media"} playlist, adjust startPosition to ${i}`), this.startPosition = i) : e.live ? i = this.hls.liveSyncPosition || t : this.startPosition = i = 0, this.lastCurrentTime = i;
    }
    this.nextLoadPosition = i;
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
    (!this.fragCurrent || !this.fragContextChanged(e) && this.state !== k.FRAG_LOADING_WAITING_RETRY) && (this.state = k.IDLE);
  }
  onFragmentOrKeyLoadError(e, t) {
    if (t.chunkMeta && !t.frag) {
      const c = this.getCurrentContext(t.chunkMeta);
      c && (t.frag = c.frag);
    }
    const i = t.frag;
    if (!i || i.type !== e || !this.levels)
      return;
    if (this.fragContextChanged(i)) {
      var s;
      this.warn(`Frag load error must match current frag to retry ${i.url} > ${(s = this.fragCurrent) == null ? void 0 : s.url}`);
      return;
    }
    const n = t.details === b.FRAG_GAP;
    n && this.fragmentTracker.fragBuffered(i, !0);
    const r = t.errorAction, {
      action: o,
      retryCount: l = 0,
      retryConfig: h
    } = r || {};
    if (r && o === ce.RetryRequest && h) {
      this.resetStartWhenNotLoaded(this.levelLastLoaded);
      const c = Ri(h, l);
      this.warn(`Fragment ${i.sn} of ${e} ${i.level} errored with ${t.details}, retrying loading ${l + 1}/${h.maxNumRetry} in ${c}ms`), r.resolved = !0, this.retryDate = self.performance.now() + c, this.state = k.FRAG_LOADING_WAITING_RETRY;
    } else if (h && r)
      if (this.resetFragmentErrors(e), l < h.maxNumRetry)
        !n && o !== ce.RemoveAlternatePermanently && (r.resolved = !0);
      else {
        A.warn(`${t.details} reached or exceeded max retry (${l})`);
        return;
      }
    else
      (r == null ? void 0 : r.action) === ce.SendAlternateToPenaltyBox ? this.state = k.WAITING_LEVEL : this.state = k.ERROR;
    this.tickImmediate();
  }
  reduceLengthAndFlushBuffer(e) {
    if (this.state === k.PARSING || this.state === k.PARSED) {
      const t = e.frag, i = e.parent, s = this.getFwdBufferInfo(this.mediaBuffer, i), n = s && s.len > 0.5;
      n && this.reduceMaxBufferLength(s.len, (t == null ? void 0 : t.duration) || 10);
      const r = !n;
      return r && this.warn(`Buffer full error while media.currentTime is not buffered, flush ${i} buffer`), t && (this.fragmentTracker.removeFragment(t), this.nextLoadPosition = t.start), this.resetLoadingState(), r;
    }
    return !1;
  }
  resetFragmentErrors(e) {
    e === G.AUDIO && (this.fragCurrent = null), this.loadedmetadata || (this.startFragRequested = !1), this.state !== k.STOPPED && (this.state = k.IDLE);
  }
  afterBufferFlushed(e, t, i) {
    if (!e)
      return;
    const s = Z.getBuffered(e);
    this.fragmentTracker.detectEvictedFragments(t, s, i), this.state === k.ENDED && this.resetLoadingState();
  }
  resetLoadingState() {
    this.log("Reset loading state"), this.fragCurrent = null, this.fragPrevious = null, this.state = k.IDLE;
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
  updateLevelTiming(e, t, i, s) {
    var n;
    const r = i.details;
    if (!r) {
      this.warn("level.details undefined");
      return;
    }
    if (!Object.keys(e.elementaryStreams).reduce((l, h) => {
      const c = e.elementaryStreams[h];
      if (c) {
        const u = c.endPTS - c.startPTS;
        if (u <= 0)
          return this.warn(`Could not parse fragment ${e.sn} ${h} duration reliably (${u})`), l || !1;
        const d = s ? 0 : ln(r, e, c.startPTS, c.endPTS, c.startDTS, c.endDTS);
        return this.hls.trigger(p.LEVEL_PTS_UPDATED, {
          details: r,
          level: i,
          drift: d,
          type: h,
          frag: e,
          start: c.startPTS,
          end: c.endPTS
        }), !0;
      }
      return l;
    }, !1) && ((n = this.transmuxer) == null ? void 0 : n.error) === null) {
      const l = new Error(`Found no media in fragment ${e.sn} of level ${e.level} resetting transmuxer to fallback to playlist timing`);
      if (i.fragmentError === 0 && (i.fragmentError++, e.gap = !0, this.fragmentTracker.removeFragment(e), this.fragmentTracker.fragBuffered(e, !0)), this.warn(l.message), this.hls.trigger(p.ERROR, {
        type: V.MEDIA_ERROR,
        details: b.FRAG_PARSING_ERROR,
        fatal: !1,
        error: l,
        frag: e,
        reason: `Found no media in msn ${e.sn} of level "${i.url}"`
      }), !this.hls)
        return;
      this.resetTransmuxer();
    }
    this.state = k.PARSED, this.hls.trigger(p.FRAG_PARSED, {
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
class mn {
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
    let i;
    if (e.length)
      e.length === 1 ? i = e[0] : i = Qa(e, t);
    else
      return new Uint8Array(0);
    return this.reset(), i;
  }
  reset() {
    this.chunks.length = 0, this.dataLength = 0;
  }
}
function Qa(a, e) {
  const t = new Uint8Array(e);
  let i = 0;
  for (let s = 0; s < a.length; s++) {
    const n = a[s];
    t.set(n, i), i += n.length;
  }
  return t;
}
function Ja() {
  return typeof __HLS_WORKER_BUNDLE__ == "function";
}
function Za() {
  const a = new self.Blob([`var exports={};var module={exports:exports};function define(f){f()};define.amd=true;(${__HLS_WORKER_BUNDLE__.toString()})(true);`], {
    type: "text/javascript"
  }), e = self.URL.createObjectURL(a);
  return {
    worker: new self.Worker(e),
    objectURL: e
  };
}
function eo(a) {
  const e = new self.URL(a, self.location.href).href;
  return {
    worker: new self.Worker(e),
    scriptURL: e
  };
}
function Ae(a = "", e = 9e4) {
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
class wi {
  constructor() {
    this._audioTrack = void 0, this._id3Track = void 0, this.frameIndex = 0, this.cachedData = null, this.basePTS = null, this.initPTS = null, this.lastPTS = null;
  }
  resetInitSegment(e, t, i, s) {
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
  appendFrame(e, t, i) {
  }
  // feed incoming data to the front of the parsing pipeline
  demux(e, t) {
    this.cachedData && (e = Te(this.cachedData, e), this.cachedData = null);
    let i = it(e, 0), s = i ? i.length : 0, n;
    const r = this._audioTrack, o = this._id3Track, l = i ? Li(i) : void 0, h = e.length;
    for ((this.basePTS === null || this.frameIndex === 0 && M(l)) && (this.basePTS = to(l, t, this.initPTS), this.lastPTS = this.basePTS), this.lastPTS === null && (this.lastPTS = this.basePTS), i && i.length > 0 && o.samples.push({
      pts: this.lastPTS,
      dts: this.lastPTS,
      data: i,
      type: ve.audioId3,
      duration: Number.POSITIVE_INFINITY
    }); s < h; ) {
      if (this.canParse(e, s)) {
        const c = this.appendFrame(r, e, s);
        c ? (this.frameIndex++, this.lastPTS = c.sample.pts, s += c.length, n = s) : s = h;
      } else
        Ar(e, s) ? (i = it(e, s), o.samples.push({
          pts: this.lastPTS,
          dts: this.lastPTS,
          data: i,
          type: ve.audioId3,
          duration: Number.POSITIVE_INFINITY
        }), s += i.length, n = s) : s++;
      if (s === h && n !== h) {
        const c = Ue(e, n);
        this.cachedData ? this.cachedData = Te(this.cachedData, c) : this.cachedData = c;
      }
    }
    return {
      audioTrack: r,
      videoTrack: Ae(),
      id3Track: o,
      textTrack: Ae()
    };
  }
  demuxSampleAes(e, t, i) {
    return Promise.reject(new Error(`[${this}] This demuxer does not support Sample-AES decryption`));
  }
  flush(e) {
    const t = this.cachedData;
    return t && (this.cachedData = null, this.demux(t, 0)), {
      audioTrack: this._audioTrack,
      videoTrack: Ae(),
      id3Track: this._id3Track,
      textTrack: Ae()
    };
  }
  destroy() {
  }
}
const to = (a, e, t) => {
  if (M(a))
    return a * 90;
  const i = t ? t.baseTime * 9e4 / t.timescale : 0;
  return e * 9e4 + i;
};
function io(a, e, t, i) {
  let s, n, r, o;
  const l = navigator.userAgent.toLowerCase(), h = i, c = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350];
  s = ((e[t + 2] & 192) >>> 6) + 1;
  const u = (e[t + 2] & 60) >>> 2;
  if (u > c.length - 1) {
    const d = new Error(`invalid ADTS sampling index:${u}`);
    a.emit(p.ERROR, p.ERROR, {
      type: V.MEDIA_ERROR,
      details: b.FRAG_PARSING_ERROR,
      fatal: !0,
      error: d,
      reason: d.message
    });
    return;
  }
  return r = (e[t + 2] & 1) << 2, r |= (e[t + 3] & 192) >>> 6, A.log(`manifest codec:${i}, ADTS type:${s}, samplingIndex:${u}`), /firefox/i.test(l) ? u >= 6 ? (s = 5, o = new Array(4), n = u - 3) : (s = 2, o = new Array(2), n = u) : l.indexOf("android") !== -1 ? (s = 2, o = new Array(2), n = u) : (s = 5, o = new Array(4), i && (i.indexOf("mp4a.40.29") !== -1 || i.indexOf("mp4a.40.5") !== -1) || !i && u >= 6 ? n = u - 3 : ((i && i.indexOf("mp4a.40.2") !== -1 && (u >= 6 && r === 1 || /vivaldi/i.test(l)) || !i && r === 1) && (s = 2, o = new Array(2)), n = u)), o[0] = s << 3, o[0] |= (u & 14) >> 1, o[1] |= (u & 1) << 7, o[1] |= r << 3, s === 5 && (o[1] |= (n & 14) >> 1, o[2] = (n & 1) << 7, o[2] |= 8, o[3] = 0), {
    config: o,
    samplerate: c[u],
    channelCount: r,
    codec: "mp4a.40." + s,
    manifestCodec: h
  };
}
function pn(a, e) {
  return a[e] === 255 && (a[e + 1] & 246) === 240;
}
function Tn(a, e) {
  return a[e + 1] & 1 ? 7 : 9;
}
function ki(a, e) {
  return (a[e + 3] & 3) << 11 | a[e + 4] << 3 | (a[e + 5] & 224) >>> 5;
}
function so(a, e) {
  return e + 5 < a.length;
}
function Pt(a, e) {
  return e + 1 < a.length && pn(a, e);
}
function no(a, e) {
  return so(a, e) && pn(a, e) && ki(a, e) <= a.length - e;
}
function ro(a, e) {
  if (Pt(a, e)) {
    const t = Tn(a, e);
    if (e + t >= a.length)
      return !1;
    const i = ki(a, e);
    if (i <= t)
      return !1;
    const s = e + i;
    return s === a.length || Pt(a, s);
  }
  return !1;
}
function yn(a, e, t, i, s) {
  if (!a.samplerate) {
    const n = io(e, t, i, s);
    if (!n)
      return;
    a.config = n.config, a.samplerate = n.samplerate, a.channelCount = n.channelCount, a.codec = n.codec, a.manifestCodec = n.manifestCodec, A.log(`parsed codec:${a.codec}, rate:${n.samplerate}, channels:${n.channelCount}`);
  }
}
function En(a) {
  return 1024 * 9e4 / a;
}
function ao(a, e) {
  const t = Tn(a, e);
  if (e + t <= a.length) {
    const i = ki(a, e) - t;
    if (i > 0)
      return {
        headerLength: t,
        frameLength: i
      };
  }
}
function vn(a, e, t, i, s) {
  const n = En(a.samplerate), r = i + s * n, o = ao(e, t);
  let l;
  if (o) {
    const {
      frameLength: u,
      headerLength: d
    } = o, f = d + u, g = Math.max(0, t + f - e.length);
    g ? (l = new Uint8Array(f - d), l.set(e.subarray(t + d, e.length), 0)) : l = e.subarray(t + d, t + f);
    const m = {
      unit: l,
      pts: r
    };
    return g || a.samples.push(m), {
      sample: m,
      length: f,
      missing: g
    };
  }
  const h = e.length - t;
  return l = new Uint8Array(h), l.set(e.subarray(t, e.length), 0), {
    sample: {
      unit: l,
      pts: r
    },
    length: h,
    missing: -1
  };
}
let ct = null;
const oo = [32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160], lo = [44100, 48e3, 32e3, 22050, 24e3, 16e3, 11025, 12e3, 8e3], ho = [
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
], co = [
  0,
  // Reserved
  1,
  // Layer3
  1,
  // Layer2
  4
  // Layer1
];
function xn(a, e, t, i, s) {
  if (t + 24 > e.length)
    return;
  const n = Sn(e, t);
  if (n && t + n.frameLength <= e.length) {
    const r = n.samplesPerFrame * 9e4 / n.sampleRate, o = i + s * r, l = {
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
function Sn(a, e) {
  const t = a[e + 1] >> 3 & 3, i = a[e + 1] >> 1 & 3, s = a[e + 2] >> 4 & 15, n = a[e + 2] >> 2 & 3;
  if (t !== 1 && s !== 0 && s !== 15 && n !== 3) {
    const r = a[e + 2] >> 1 & 1, o = a[e + 3] >> 6, l = t === 3 ? 3 - i : i === 3 ? 3 : 4, h = oo[l * 14 + s - 1] * 1e3, u = lo[(t === 3 ? 0 : t === 2 ? 1 : 2) * 3 + n], d = o === 3 ? 1 : 2, f = ho[t][i], g = co[i], m = f * 8 * g, T = Math.floor(f * h / u + r) * g;
    if (ct === null) {
      const x = (navigator.userAgent || "").match(/Chrome\/(\d+)/i);
      ct = x ? parseInt(x[1]) : 0;
    }
    return !!ct && ct <= 87 && i === 2 && h >= 224e3 && o === 0 && (a[e + 3] = a[e + 3] | 128), {
      sampleRate: u,
      channelCount: d,
      frameLength: T,
      samplesPerFrame: m
    };
  }
}
function _i(a, e) {
  return a[e] === 255 && (a[e + 1] & 224) === 224 && (a[e + 1] & 6) !== 0;
}
function An(a, e) {
  return e + 1 < a.length && _i(a, e);
}
function uo(a, e) {
  return _i(a, e) && 4 <= a.length - e;
}
function Ln(a, e) {
  if (e + 1 < a.length && _i(a, e)) {
    const i = Sn(a, e);
    let s = 4;
    i != null && i.frameLength && (s = i.frameLength);
    const n = e + s;
    return n === a.length || An(a, n);
  }
  return !1;
}
class fo extends wi {
  constructor(e, t) {
    super(), this.observer = void 0, this.config = void 0, this.observer = e, this.config = t;
  }
  resetInitSegment(e, t, i, s) {
    super.resetInitSegment(e, t, i, s), this._audioTrack = {
      container: "audio/adts",
      type: "audio",
      id: 2,
      pid: -1,
      sequenceNumber: 0,
      segmentCodec: "aac",
      samples: [],
      manifestCodec: t,
      duration: s,
      inputTimeScale: 9e4,
      dropped: 0
    };
  }
  // Source for probe info - https://wiki.multimedia.cx/index.php?title=ADTS
  static probe(e) {
    if (!e)
      return !1;
    const t = it(e, 0);
    let i = (t == null ? void 0 : t.length) || 0;
    if (Ln(e, i))
      return !1;
    for (let s = e.length; i < s; i++)
      if (ro(e, i))
        return A.log("ADTS sync word found !"), !0;
    return !1;
  }
  canParse(e, t) {
    return no(e, t);
  }
  appendFrame(e, t, i) {
    yn(e, this.observer, t, i, e.manifestCodec);
    const s = vn(e, t, i, this.basePTS, this.frameIndex);
    if (s && s.missing === 0)
      return s;
  }
}
const go = /\/emsg[-/]ID3/i;
class mo {
  constructor(e, t) {
    this.remainderData = null, this.timeOffset = 0, this.config = void 0, this.videoTrack = void 0, this.audioTrack = void 0, this.id3Track = void 0, this.txtTrack = void 0, this.config = t;
  }
  resetTimeStamp() {
  }
  resetInitSegment(e, t, i, s) {
    const n = this.videoTrack = Ae("video", 1), r = this.audioTrack = Ae("audio", 1), o = this.txtTrack = Ae("text", 1);
    if (this.id3Track = Ae("id3", 1), this.timeOffset = 0, !(e != null && e.byteLength))
      return;
    const l = Zs(e);
    if (l.video) {
      const {
        id: h,
        timescale: c,
        codec: u
      } = l.video;
      n.id = h, n.timescale = o.timescale = c, n.codec = u;
    }
    if (l.audio) {
      const {
        id: h,
        timescale: c,
        codec: u
      } = l.audio;
      r.id = h, r.timescale = c, r.codec = u;
    }
    o.id = Xs.text, n.sampleDuration = 0, n.duration = r.duration = s;
  }
  resetContiguity() {
    this.remainderData = null;
  }
  static probe(e) {
    return _r(e);
  }
  demux(e, t) {
    this.timeOffset = t;
    let i = e;
    const s = this.videoTrack, n = this.txtTrack;
    if (this.config.progressive) {
      this.remainderData && (i = Te(this.remainderData, e));
      const o = $r(i);
      this.remainderData = o.remainder, s.samples = o.valid || new Uint8Array();
    } else
      s.samples = i;
    const r = this.extractID3Track(s, t);
    return n.samples = Wi(t, s), {
      videoTrack: s,
      audioTrack: this.audioTrack,
      id3Track: r,
      textTrack: this.txtTrack
    };
  }
  flush() {
    const e = this.timeOffset, t = this.videoTrack, i = this.txtTrack;
    t.samples = this.remainderData || new Uint8Array(), this.remainderData = null;
    const s = this.extractID3Track(t, this.timeOffset);
    return i.samples = Wi(e, t), {
      videoTrack: t,
      audioTrack: Ae(),
      id3Track: s,
      textTrack: Ae()
    };
  }
  extractID3Track(e, t) {
    const i = this.id3Track;
    if (e.samples.length) {
      const s = H(e.samples, ["emsg"]);
      s && s.forEach((n) => {
        const r = Vr(n);
        if (go.test(r.schemeIdUri)) {
          const o = M(r.presentationTime) ? r.presentationTime / r.timeScale : t + r.presentationTimeDelta / r.timeScale;
          let l = r.eventDuration === 4294967295 ? Number.POSITIVE_INFINITY : r.eventDuration / r.timeScale;
          l <= 1e-3 && (l = Number.POSITIVE_INFINITY);
          const h = r.payload;
          i.samples.push({
            data: h,
            len: h.byteLength,
            dts: o,
            pts: o,
            type: ve.emsg,
            duration: l
          });
        }
      });
    }
    return i;
  }
  demuxSampleAes(e, t, i) {
    return Promise.reject(new Error("The MP4 demuxer does not support SAMPLE-AES decryption"));
  }
  destroy() {
  }
}
const Rn = (a, e) => {
  let t = 0, i = 5;
  e += i;
  const s = new Uint32Array(1), n = new Uint32Array(1), r = new Uint8Array(1);
  for (; i > 0; ) {
    r[0] = a[e];
    const o = Math.min(i, 8), l = 8 - o;
    n[0] = 4278190080 >>> 24 + l << l, s[0] = (r[0] & n[0]) >> l, t = t ? t << o | s[0] : s[0], e += 1, i -= o;
  }
  return t;
};
class po extends wi {
  constructor(e) {
    super(), this.observer = void 0, this.observer = e;
  }
  resetInitSegment(e, t, i, s) {
    super.resetInitSegment(e, t, i, s), this._audioTrack = {
      container: "audio/ac-3",
      type: "audio",
      id: 2,
      pid: -1,
      sequenceNumber: 0,
      segmentCodec: "ac3",
      samples: [],
      manifestCodec: t,
      duration: s,
      inputTimeScale: 9e4,
      dropped: 0
    };
  }
  canParse(e, t) {
    return t + 64 < e.length;
  }
  appendFrame(e, t, i) {
    const s = bn(e, t, i, this.basePTS, this.frameIndex);
    if (s !== -1)
      return {
        sample: e.samples[e.samples.length - 1],
        length: s,
        missing: 0
      };
  }
  static probe(e) {
    if (!e)
      return !1;
    const t = it(e, 0);
    if (!t)
      return !1;
    const i = t.length;
    return e[i] === 11 && e[i + 1] === 119 && Li(t) !== void 0 && // check the bsid to confirm ac-3
    Rn(e, i) < 16;
  }
}
function bn(a, e, t, i, s) {
  if (t + 8 > e.length || e[t] !== 11 || e[t + 1] !== 119)
    return -1;
  const n = e[t + 4] >> 6;
  if (n >= 3)
    return -1;
  const o = [48e3, 44100, 32e3][n], l = e[t + 4] & 63, c = [64, 69, 96, 64, 70, 96, 80, 87, 120, 80, 88, 120, 96, 104, 144, 96, 105, 144, 112, 121, 168, 112, 122, 168, 128, 139, 192, 128, 140, 192, 160, 174, 240, 160, 175, 240, 192, 208, 288, 192, 209, 288, 224, 243, 336, 224, 244, 336, 256, 278, 384, 256, 279, 384, 320, 348, 480, 320, 349, 480, 384, 417, 576, 384, 418, 576, 448, 487, 672, 448, 488, 672, 512, 557, 768, 512, 558, 768, 640, 696, 960, 640, 697, 960, 768, 835, 1152, 768, 836, 1152, 896, 975, 1344, 896, 976, 1344, 1024, 1114, 1536, 1024, 1115, 1536, 1152, 1253, 1728, 1152, 1254, 1728, 1280, 1393, 1920, 1280, 1394, 1920][l * 3 + n] * 2;
  if (t + c > e.length)
    return -1;
  const u = e[t + 6] >> 5;
  let d = 0;
  u === 2 ? d += 2 : (u & 1 && u !== 1 && (d += 2), u & 4 && (d += 2));
  const f = (e[t + 6] << 8 | e[t + 7]) >> 12 - d & 1, m = [2, 1, 2, 3, 3, 4, 4, 5][u] + f, T = e[t + 5] >> 3, y = e[t + 5] & 7, E = new Uint8Array([n << 6 | T << 1 | y >> 2, (y & 3) << 6 | u << 3 | f << 2 | l >> 4, l << 4 & 224]), x = 1536 / o * 9e4, v = i + s * x, S = e.subarray(t, t + c);
  return a.config = E, a.channelCount = m, a.samplerate = o, a.samples.push({
    unit: S,
    pts: v
  }), c;
}
class To {
  constructor() {
    this.VideoSample = null;
  }
  createVideoSample(e, t, i, s) {
    return {
      key: e,
      frame: !1,
      pts: t,
      dts: i,
      units: [],
      debug: s,
      length: 0
    };
  }
  getLastNalUnit(e) {
    var t;
    let i = this.VideoSample, s;
    if ((!i || i.units.length === 0) && (i = e[e.length - 1]), (t = i) != null && t.units) {
      const n = i.units;
      s = n[n.length - 1];
    }
    return s;
  }
  pushAccessUnit(e, t) {
    if (e.units.length && e.frame) {
      if (e.pts === void 0) {
        const i = t.samples, s = i.length;
        if (s) {
          const n = i[s - 1];
          e.pts = n.pts, e.dts = n.dts;
        } else {
          t.dropped++;
          return;
        }
      }
      t.samples.push(e);
    }
    e.debug.length && A.log(e.pts + "/" + e.dts + ":" + e.debug);
  }
}
class Es {
  constructor(e) {
    this.data = void 0, this.bytesAvailable = void 0, this.word = void 0, this.bitsAvailable = void 0, this.data = e, this.bytesAvailable = e.byteLength, this.word = 0, this.bitsAvailable = 0;
  }
  // ():void
  loadWord() {
    const e = this.data, t = this.bytesAvailable, i = e.byteLength - t, s = new Uint8Array(4), n = Math.min(4, t);
    if (n === 0)
      throw new Error("no bytes available");
    s.set(e.subarray(i, i + n)), this.word = new DataView(s.buffer).getUint32(0), this.bitsAvailable = n * 8, this.bytesAvailable -= n;
  }
  // (count:int):void
  skipBits(e) {
    let t;
    e = Math.min(e, this.bytesAvailable * 8 + this.bitsAvailable), this.bitsAvailable > e ? (this.word <<= e, this.bitsAvailable -= e) : (e -= this.bitsAvailable, t = e >> 3, e -= t << 3, this.bytesAvailable -= t, this.loadWord(), this.word <<= e, this.bitsAvailable -= e);
  }
  // (size:int):uint
  readBits(e) {
    let t = Math.min(this.bitsAvailable, e);
    const i = this.word >>> 32 - t;
    if (e > 32 && A.error("Cannot read more than 32 bits at a time"), this.bitsAvailable -= t, this.bitsAvailable > 0)
      this.word <<= t;
    else if (this.bytesAvailable > 0)
      this.loadWord();
    else
      throw new Error("no bits available");
    return t = e - t, t > 0 && this.bitsAvailable ? i << t | this.readBits(t) : i;
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
    let t = 8, i = 8, s;
    for (let n = 0; n < e; n++)
      i !== 0 && (s = this.readEG(), i = (t + s + 256) % 256), t = i === 0 ? t : i;
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
    let e = 0, t = 0, i = 0, s = 0, n, r, o;
    const l = this.readUByte.bind(this), h = this.readBits.bind(this), c = this.readUEG.bind(this), u = this.readBoolean.bind(this), d = this.skipBits.bind(this), f = this.skipEG.bind(this), g = this.skipUEG.bind(this), m = this.skipScalingList.bind(this);
    l();
    const T = l();
    if (h(5), d(3), l(), g(), T === 100 || T === 110 || T === 122 || T === 244 || T === 44 || T === 83 || T === 86 || T === 118 || T === 128) {
      const C = c();
      if (C === 3 && d(1), g(), g(), d(1), u())
        for (r = C !== 3 ? 8 : 12, o = 0; o < r; o++)
          u() && (o < 6 ? m(16) : m(64));
    }
    g();
    const y = c();
    if (y === 0)
      c();
    else if (y === 1)
      for (d(1), f(), f(), n = c(), o = 0; o < n; o++)
        f();
    g(), d(1);
    const E = c(), x = c(), v = h(1);
    v === 0 && d(1), d(1), u() && (e = c(), t = c(), i = c(), s = c());
    let S = [1, 1];
    if (u() && u())
      switch (l()) {
        case 1:
          S = [1, 1];
          break;
        case 2:
          S = [12, 11];
          break;
        case 3:
          S = [10, 11];
          break;
        case 4:
          S = [16, 11];
          break;
        case 5:
          S = [40, 33];
          break;
        case 6:
          S = [24, 11];
          break;
        case 7:
          S = [20, 11];
          break;
        case 8:
          S = [32, 11];
          break;
        case 9:
          S = [80, 33];
          break;
        case 10:
          S = [18, 11];
          break;
        case 11:
          S = [15, 11];
          break;
        case 12:
          S = [64, 33];
          break;
        case 13:
          S = [160, 99];
          break;
        case 14:
          S = [4, 3];
          break;
        case 15:
          S = [3, 2];
          break;
        case 16:
          S = [2, 1];
          break;
        case 255: {
          S = [l() << 8 | l(), l() << 8 | l()];
          break;
        }
      }
    return {
      width: Math.ceil((E + 1) * 16 - e * 2 - t * 2),
      height: (2 - v) * (x + 1) * 16 - (v ? 2 : 4) * (i + s),
      pixelRatio: S
    };
  }
  readSliceType() {
    return this.readUByte(), this.readUEG(), this.readUEG();
  }
}
class yo extends To {
  parseAVCPES(e, t, i, s, n) {
    const r = this.parseAVCNALu(e, i.data);
    let o = this.VideoSample, l, h = !1;
    i.data = null, o && r.length && !e.audFound && (this.pushAccessUnit(o, e), o = this.VideoSample = this.createVideoSample(!1, i.pts, i.dts, "")), r.forEach((c) => {
      var u;
      switch (c.type) {
        case 1: {
          let m = !1;
          l = !0;
          const T = c.data;
          if (h && T.length > 4) {
            const y = new Es(T).readSliceType();
            (y === 2 || y === 4 || y === 7 || y === 9) && (m = !0);
          }
          if (m) {
            var d;
            (d = o) != null && d.frame && !o.key && (this.pushAccessUnit(o, e), o = this.VideoSample = null);
          }
          o || (o = this.VideoSample = this.createVideoSample(!0, i.pts, i.dts, "")), o.frame = !0, o.key = m;
          break;
        }
        case 5:
          l = !0, (u = o) != null && u.frame && !o.key && (this.pushAccessUnit(o, e), o = this.VideoSample = null), o || (o = this.VideoSample = this.createVideoSample(!0, i.pts, i.dts, "")), o.key = !0, o.frame = !0;
          break;
        case 6: {
          l = !0, tn(c.data, 1, i.pts, t.samples);
          break;
        }
        case 7: {
          var f, g;
          l = !0, h = !0;
          const m = c.data, y = new Es(m).readSPS();
          if (!e.sps || e.width !== y.width || e.height !== y.height || ((f = e.pixelRatio) == null ? void 0 : f[0]) !== y.pixelRatio[0] || ((g = e.pixelRatio) == null ? void 0 : g[1]) !== y.pixelRatio[1]) {
            e.width = y.width, e.height = y.height, e.pixelRatio = y.pixelRatio, e.sps = [m], e.duration = n;
            const E = m.subarray(1, 4);
            let x = "avc1.";
            for (let v = 0; v < 3; v++) {
              let S = E[v].toString(16);
              S.length < 2 && (S = "0" + S), x += S;
            }
            e.codec = x;
          }
          break;
        }
        case 8:
          l = !0, e.pps = [c.data];
          break;
        case 9:
          l = !0, e.audFound = !0, o && this.pushAccessUnit(o, e), o = this.VideoSample = this.createVideoSample(!1, i.pts, i.dts, "");
          break;
        case 12:
          l = !0;
          break;
        default:
          l = !1, o && (o.debug += "unknown NAL " + c.type + " ");
          break;
      }
      o && l && o.units.push(c);
    }), s && o && (this.pushAccessUnit(o, e), this.VideoSample = null);
  }
  parseAVCNALu(e, t) {
    const i = t.byteLength;
    let s = e.naluState || 0;
    const n = s, r = [];
    let o = 0, l, h, c, u = -1, d = 0;
    for (s === -1 && (u = 0, d = t[0] & 31, s = 0, o = 1); o < i; ) {
      if (l = t[o++], !s) {
        s = l ? 0 : 1;
        continue;
      }
      if (s === 1) {
        s = l ? 0 : 2;
        continue;
      }
      if (!l)
        s = 3;
      else if (l === 1) {
        if (h = o - s - 1, u >= 0) {
          const f = {
            data: t.subarray(u, h),
            type: d
          };
          r.push(f);
        } else {
          const f = this.getLastNalUnit(e.samples);
          f && (n && o <= 4 - n && f.state && (f.data = f.data.subarray(0, f.data.byteLength - n)), h > 0 && (f.data = Te(f.data, t.subarray(0, h)), f.state = 0));
        }
        o < i ? (c = t[o] & 31, u = o, d = c, s = 0) : s = -1;
      } else
        s = 0;
    }
    if (u >= 0 && s >= 0) {
      const f = {
        data: t.subarray(u, i),
        type: d,
        state: s
      };
      r.push(f);
    }
    if (r.length === 0) {
      const f = this.getLastNalUnit(e.samples);
      f && (f.data = Te(f.data, t));
    }
    return e.naluState = s, r;
  }
}
class Eo {
  constructor(e, t, i) {
    this.keyData = void 0, this.decrypter = void 0, this.keyData = i, this.decrypter = new Ci(t, {
      removePKCS7Padding: !1
    });
  }
  decryptBuffer(e) {
    return this.decrypter.decrypt(e, this.keyData.key.buffer, this.keyData.iv.buffer);
  }
  // AAC - encrypt all full 16 bytes blocks starting from offset 16
  decryptAacSample(e, t, i) {
    const s = e[t].unit;
    if (s.length <= 16)
      return;
    const n = s.subarray(16, s.length - s.length % 16), r = n.buffer.slice(n.byteOffset, n.byteOffset + n.length);
    this.decryptBuffer(r).then((o) => {
      const l = new Uint8Array(o);
      s.set(l, 16), this.decrypter.isSync() || this.decryptAacSamples(e, t + 1, i);
    });
  }
  decryptAacSamples(e, t, i) {
    for (; ; t++) {
      if (t >= e.length) {
        i();
        return;
      }
      if (!(e[t].unit.length < 32) && (this.decryptAacSample(e, t, i), !this.decrypter.isSync()))
        return;
    }
  }
  // AVC - encrypt one 16 bytes block out of ten, starting from offset 32
  getAvcEncryptedData(e) {
    const t = Math.floor((e.length - 48) / 160) * 16 + 16, i = new Int8Array(t);
    let s = 0;
    for (let n = 32; n < e.length - 16; n += 160, s += 16)
      i.set(e.subarray(n, n + 16), s);
    return i;
  }
  getAvcDecryptedUnit(e, t) {
    const i = new Uint8Array(t);
    let s = 0;
    for (let n = 32; n < e.length - 16; n += 160, s += 16)
      e.set(i.subarray(s, s + 16), n);
    return e;
  }
  decryptAvcSample(e, t, i, s, n) {
    const r = sn(n.data), o = this.getAvcEncryptedData(r);
    this.decryptBuffer(o.buffer).then((l) => {
      n.data = this.getAvcDecryptedUnit(r, l), this.decrypter.isSync() || this.decryptAvcSamples(e, t, i + 1, s);
    });
  }
  decryptAvcSamples(e, t, i, s) {
    if (e instanceof Uint8Array)
      throw new Error("Cannot decrypt samples of type Uint8Array");
    for (; ; t++, i = 0) {
      if (t >= e.length) {
        s();
        return;
      }
      const n = e[t].units;
      for (; !(i >= n.length); i++) {
        const r = n[i];
        if (!(r.data.length <= 48 || r.type !== 1 && r.type !== 5) && (this.decryptAvcSample(e, t, i, s, r), !this.decrypter.isSync()))
          return;
      }
    }
  }
}
const ae = 188;
class Fe {
  constructor(e, t, i) {
    this.observer = void 0, this.config = void 0, this.typeSupported = void 0, this.sampleAes = null, this.pmtParsed = !1, this.audioCodec = void 0, this.videoCodec = void 0, this._duration = 0, this._pmtId = -1, this._videoTrack = void 0, this._audioTrack = void 0, this._id3Track = void 0, this._txtTrack = void 0, this.aacOverFlow = null, this.remainderData = null, this.videoParser = void 0, this.observer = e, this.config = t, this.typeSupported = i, this.videoParser = new yo();
  }
  static probe(e) {
    const t = Fe.syncOffset(e);
    return t > 0 && A.warn(`MPEG2-TS detected but first sync word found @ offset ${t}`), t !== -1;
  }
  static syncOffset(e) {
    const t = e.length;
    let i = Math.min(ae * 5, t - ae) + 1, s = 0;
    for (; s < i; ) {
      let n = !1, r = -1, o = 0;
      for (let l = s; l < t; l += ae)
        if (e[l] === 71 && (t - l === ae || e[l + ae] === 71)) {
          if (o++, r === -1 && (r = l, r !== 0 && (i = Math.min(r + ae * 99, e.length - ae) + 1)), n || (n = fi(e, l) === 0), n && o > 1 && (r === 0 && o > 2 || l + ae > i))
            return r;
        } else {
          if (o)
            return -1;
          break;
        }
      s++;
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
      id: Xs[e],
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
  resetInitSegment(e, t, i, s) {
    this.pmtParsed = !1, this._pmtId = -1, this._videoTrack = Fe.createTrack("video"), this._audioTrack = Fe.createTrack("audio", s), this._id3Track = Fe.createTrack("id3"), this._txtTrack = Fe.createTrack("text"), this._audioTrack.segmentCodec = "aac", this.aacOverFlow = null, this.remainderData = null, this.audioCodec = t, this.videoCodec = i, this._duration = s;
  }
  resetTimeStamp() {
  }
  resetContiguity() {
    const {
      _audioTrack: e,
      _videoTrack: t,
      _id3Track: i
    } = this;
    e && (e.pesData = null), t && (t.pesData = null), i && (i.pesData = null), this.aacOverFlow = null, this.remainderData = null;
  }
  demux(e, t, i = !1, s = !1) {
    i || (this.sampleAes = null);
    let n;
    const r = this._videoTrack, o = this._audioTrack, l = this._id3Track, h = this._txtTrack;
    let c = r.pid, u = r.pesData, d = o.pid, f = l.pid, g = o.pesData, m = l.pesData, T = null, y = this.pmtParsed, E = this._pmtId, x = e.length;
    if (this.remainderData && (e = Te(this.remainderData, e), x = e.length, this.remainderData = null), x < ae && !s)
      return this.remainderData = e, {
        audioTrack: o,
        videoTrack: r,
        id3Track: l,
        textTrack: h
      };
    const v = Math.max(0, Fe.syncOffset(e));
    x -= (x - v) % ae, x < e.byteLength && !s && (this.remainderData = new Uint8Array(e.buffer, x, e.buffer.byteLength - x));
    let S = 0;
    for (let R = v; R < x; R += ae)
      if (e[R] === 71) {
        const I = !!(e[R + 1] & 64), D = fi(e, R), w = (e[R + 3] & 48) >> 4;
        let _;
        if (w > 1) {
          if (_ = R + 5 + e[R + 4], _ === R + ae)
            continue;
        } else
          _ = R + 4;
        switch (D) {
          case c:
            I && (u && (n = He(u)) && this.videoParser.parseAVCPES(r, h, n, !1, this._duration), u = {
              data: [],
              size: 0
            }), u && (u.data.push(e.subarray(_, R + ae)), u.size += R + ae - _);
            break;
          case d:
            if (I) {
              if (g && (n = He(g)))
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
              g = {
                data: [],
                size: 0
              };
            }
            g && (g.data.push(e.subarray(_, R + ae)), g.size += R + ae - _);
            break;
          case f:
            I && (m && (n = He(m)) && this.parseID3PES(l, n), m = {
              data: [],
              size: 0
            }), m && (m.data.push(e.subarray(_, R + ae)), m.size += R + ae - _);
            break;
          case 0:
            I && (_ += e[_] + 1), E = this._pmtId = vo(e, _);
            break;
          case E: {
            I && (_ += e[_] + 1);
            const O = xo(e, _, this.typeSupported, i, this.observer);
            c = O.videoPid, c > 0 && (r.pid = c, r.segmentCodec = O.segmentVideoCodec), d = O.audioPid, d > 0 && (o.pid = d, o.segmentCodec = O.segmentAudioCodec), f = O.id3Pid, f > 0 && (l.pid = f), T !== null && !y && (A.warn(`MPEG-TS PMT found at ${R} after unknown PID '${T}'. Backtracking to sync byte @${v} to parse all TS packets.`), T = null, R = v - 188), y = this.pmtParsed = !0;
            break;
          }
          case 17:
          case 8191:
            break;
          default:
            T = D;
            break;
        }
      } else
        S++;
    S > 0 && Ft(this.observer, new Error(`Found ${S} TS packet/s that do not start with 0x47`)), r.pesData = u, o.pesData = g, l.pesData = m;
    const C = {
      audioTrack: o,
      videoTrack: r,
      id3Track: l,
      textTrack: h
    };
    return s && this.extractRemainingSamples(C), C;
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
      videoTrack: i,
      id3Track: s,
      textTrack: n
    } = e, r = i.pesData, o = t.pesData, l = s.pesData;
    let h;
    if (r && (h = He(r)) ? (this.videoParser.parseAVCPES(i, n, h, !0, this._duration), i.pesData = null) : i.pesData = r, o && (h = He(o))) {
      switch (t.segmentCodec) {
        case "aac":
          this.parseAACPES(t, h);
          break;
        case "mp3":
          this.parseMPEGPES(t, h);
          break;
        case "ac3":
          this.parseAC3PES(t, h);
          break;
      }
      t.pesData = null;
    } else
      o != null && o.size && A.log("last AAC PES packet truncated,might overlap between fragments"), t.pesData = o;
    l && (h = He(l)) ? (this.parseID3PES(s, h), s.pesData = null) : s.pesData = l;
  }
  demuxSampleAes(e, t, i) {
    const s = this.demux(e, i, !0, !this.config.progressive), n = this.sampleAes = new Eo(this.observer, this.config, t);
    return this.decrypt(s, n);
  }
  decrypt(e, t) {
    return new Promise((i) => {
      const {
        audioTrack: s,
        videoTrack: n
      } = e;
      s.samples && s.segmentCodec === "aac" ? t.decryptAacSamples(s.samples, 0, () => {
        n.samples ? t.decryptAvcSamples(n.samples, 0, 0, () => {
          i(e);
        }) : i(e);
      }) : n.samples && t.decryptAvcSamples(n.samples, 0, 0, () => {
        i(e);
      });
    });
  }
  destroy() {
    this._duration = 0;
  }
  parseAACPES(e, t) {
    let i = 0;
    const s = this.aacOverFlow;
    let n = t.data;
    if (s) {
      this.aacOverFlow = null;
      const u = s.missing, d = s.sample.unit.byteLength;
      if (u === -1)
        n = Te(s.sample.unit, n);
      else {
        const f = d - u;
        s.sample.unit.set(n.subarray(0, u), f), e.samples.push(s.sample), i = s.missing;
      }
    }
    let r, o;
    for (r = i, o = n.length; r < o - 1 && !Pt(n, r); r++)
      ;
    if (r !== i) {
      let u;
      const d = r < o - 1;
      if (d ? u = `AAC PES did not start with ADTS header,offset:${r}` : u = "No ADTS header found in AAC PES", Ft(this.observer, new Error(u), d), !d)
        return;
    }
    yn(e, this.observer, n, r, this.audioCodec);
    let l;
    if (t.pts !== void 0)
      l = t.pts;
    else if (s) {
      const u = En(e.samplerate);
      l = s.sample.pts + u;
    } else {
      A.warn("[tsdemuxer]: AAC PES unknown PTS");
      return;
    }
    let h = 0, c;
    for (; r < o; )
      if (c = vn(e, n, r, l, h), r += c.length, c.missing) {
        this.aacOverFlow = c;
        break;
      } else
        for (h++; r < o - 1 && !Pt(n, r); r++)
          ;
  }
  parseMPEGPES(e, t) {
    const i = t.data, s = i.length;
    let n = 0, r = 0;
    const o = t.pts;
    if (o === void 0) {
      A.warn("[tsdemuxer]: MPEG PES unknown PTS");
      return;
    }
    for (; r < s; )
      if (An(i, r)) {
        const l = xn(e, i, r, o, n);
        if (l)
          r += l.length, n++;
        else
          break;
      } else
        r++;
  }
  parseAC3PES(e, t) {
    {
      const i = t.data, s = t.pts;
      if (s === void 0) {
        A.warn("[tsdemuxer]: AC3 PES unknown PTS");
        return;
      }
      const n = i.length;
      let r = 0, o = 0, l;
      for (; o < n && (l = bn(e, i, o, s, r++)) > 0; )
        o += l;
    }
  }
  parseID3PES(e, t) {
    if (t.pts === void 0) {
      A.warn("[tsdemuxer]: ID3 PES unknown PTS");
      return;
    }
    const i = se({}, t, {
      type: this._videoTrack ? ve.emsg : ve.audioId3,
      duration: Number.POSITIVE_INFINITY
    });
    e.samples.push(i);
  }
}
function fi(a, e) {
  return ((a[e + 1] & 31) << 8) + a[e + 2];
}
function vo(a, e) {
  return (a[e + 10] & 31) << 8 | a[e + 11];
}
function xo(a, e, t, i, s) {
  const n = {
    audioPid: -1,
    videoPid: -1,
    id3Pid: -1,
    segmentVideoCodec: "avc",
    segmentAudioCodec: "aac"
  }, r = (a[e + 1] & 15) << 8 | a[e + 2], o = e + 3 + r - 4, l = (a[e + 10] & 15) << 8 | a[e + 11];
  for (e += 12 + l; e < o; ) {
    const h = fi(a, e), c = (a[e + 3] & 15) << 8 | a[e + 4];
    switch (a[e]) {
      case 207:
        if (!i) {
          jt("ADTS AAC");
          break;
        }
      case 15:
        n.audioPid === -1 && (n.audioPid = h);
        break;
      case 21:
        n.id3Pid === -1 && (n.id3Pid = h);
        break;
      case 219:
        if (!i) {
          jt("H.264");
          break;
        }
      case 27:
        n.videoPid === -1 && (n.videoPid = h, n.segmentVideoCodec = "avc");
        break;
      case 3:
      case 4:
        !t.mpeg && !t.mp3 ? A.log("MPEG audio found, not supported in this browser") : n.audioPid === -1 && (n.audioPid = h, n.segmentAudioCodec = "mp3");
        break;
      case 193:
        if (!i) {
          jt("AC-3");
          break;
        }
      case 129:
        t.ac3 ? n.audioPid === -1 && (n.audioPid = h, n.segmentAudioCodec = "ac3") : A.log("AC-3 audio found, not supported in this browser");
        break;
      case 6:
        if (n.audioPid === -1 && c > 0) {
          let u = e + 5, d = c;
          for (; d > 2; ) {
            switch (a[u]) {
              case 106:
                t.ac3 !== !0 ? A.log("AC-3 audio found, not supported in this browser for now") : (n.audioPid = h, n.segmentAudioCodec = "ac3");
                break;
            }
            const g = a[u + 1] + 2;
            u += g, d -= g;
          }
        }
        break;
      case 194:
      case 135:
        return Ft(s, new Error("Unsupported EC-3 in M2TS found")), n;
      case 36:
        return Ft(s, new Error("Unsupported HEVC in M2TS found")), n;
    }
    e += c + 5;
  }
  return n;
}
function Ft(a, e, t) {
  A.warn(`parsing error: ${e.message}`), a.emit(p.ERROR, p.ERROR, {
    type: V.MEDIA_ERROR,
    details: b.FRAG_PARSING_ERROR,
    fatal: !1,
    levelRetry: t,
    error: e,
    reason: e.message
  });
}
function jt(a) {
  A.log(`${a} with AES-128-CBC encryption found in unencrypted stream`);
}
function He(a) {
  let e = 0, t, i, s, n, r;
  const o = a.data;
  if (!a || a.size === 0)
    return null;
  for (; o[0].length < 19 && o.length > 1; )
    o[0] = Te(o[0], o[1]), o.splice(1, 1);
  if (t = o[0], (t[0] << 16) + (t[1] << 8) + t[2] === 1) {
    if (i = (t[4] << 8) + t[5], i && i > a.size - 6)
      return null;
    const h = t[7];
    h & 192 && (n = (t[9] & 14) * 536870912 + // 1 << 29
    (t[10] & 255) * 4194304 + // 1 << 22
    (t[11] & 254) * 16384 + // 1 << 14
    (t[12] & 255) * 128 + // 1 << 7
    (t[13] & 254) / 2, h & 64 ? (r = (t[14] & 14) * 536870912 + // 1 << 29
    (t[15] & 255) * 4194304 + // 1 << 22
    (t[16] & 254) * 16384 + // 1 << 14
    (t[17] & 255) * 128 + // 1 << 7
    (t[18] & 254) / 2, n - r > 60 * 9e4 && (A.warn(`${Math.round((n - r) / 9e4)}s delta between PTS and DTS, align them`), n = r)) : r = n), s = t[8];
    let c = s + 9;
    if (a.size <= c)
      return null;
    a.size -= c;
    const u = new Uint8Array(a.size);
    for (let d = 0, f = o.length; d < f; d++) {
      t = o[d];
      let g = t.byteLength;
      if (c)
        if (c > g) {
          c -= g;
          continue;
        } else
          t = t.subarray(c), g -= c, c = 0;
      u.set(t, e), e += g;
    }
    return i && (i -= s + 3), {
      data: u,
      pts: n,
      dts: r,
      len: i
    };
  }
  return null;
}
class So extends wi {
  resetInitSegment(e, t, i, s) {
    super.resetInitSegment(e, t, i, s), this._audioTrack = {
      container: "audio/mpeg",
      type: "audio",
      id: 2,
      pid: -1,
      sequenceNumber: 0,
      segmentCodec: "mp3",
      samples: [],
      manifestCodec: t,
      duration: s,
      inputTimeScale: 9e4,
      dropped: 0
    };
  }
  static probe(e) {
    if (!e)
      return !1;
    const t = it(e, 0);
    let i = (t == null ? void 0 : t.length) || 0;
    if (t && e[i] === 11 && e[i + 1] === 119 && Li(t) !== void 0 && // check the bsid to confirm ac-3 or ec-3 (not mp3)
    Rn(e, i) <= 16)
      return !1;
    for (let s = e.length; i < s; i++)
      if (Ln(e, i))
        return A.log("MPEG Audio sync word found !"), !0;
    return !1;
  }
  canParse(e, t) {
    return uo(e, t);
  }
  appendFrame(e, t, i) {
    if (this.basePTS !== null)
      return xn(e, t, i, this.basePTS, this.frameIndex);
  }
}
class vs {
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
const _e = Math.pow(2, 32) - 1;
class L {
  static init() {
    L.types = {
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
    for (e in L.types)
      L.types.hasOwnProperty(e) && (L.types[e] = [e.charCodeAt(0), e.charCodeAt(1), e.charCodeAt(2), e.charCodeAt(3)]);
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
    ]), i = new Uint8Array([
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
    L.HDLR_TYPES = {
      video: t,
      audio: i
    };
    const s = new Uint8Array([
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
    L.STTS = L.STSC = L.STCO = n, L.STSZ = new Uint8Array([
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
    ]), L.VMHD = new Uint8Array([
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
    ]), L.SMHD = new Uint8Array([
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
    ]), L.STSD = new Uint8Array([
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
    L.FTYP = L.box(L.types.ftyp, r, l, r, o), L.DINF = L.box(L.types.dinf, L.box(L.types.dref, s));
  }
  static box(e, ...t) {
    let i = 8, s = t.length;
    const n = s;
    for (; s--; )
      i += t[s].byteLength;
    const r = new Uint8Array(i);
    for (r[0] = i >> 24 & 255, r[1] = i >> 16 & 255, r[2] = i >> 8 & 255, r[3] = i & 255, r.set(e, 4), s = 0, i = 8; s < n; s++)
      r.set(t[s], i), i += t[s].byteLength;
    return r;
  }
  static hdlr(e) {
    return L.box(L.types.hdlr, L.HDLR_TYPES[e]);
  }
  static mdat(e) {
    return L.box(L.types.mdat, e);
  }
  static mdhd(e, t) {
    t *= e;
    const i = Math.floor(t / (_e + 1)), s = Math.floor(t % (_e + 1));
    return L.box(L.types.mdhd, new Uint8Array([
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
      i >> 24,
      i >> 16 & 255,
      i >> 8 & 255,
      i & 255,
      s >> 24,
      s >> 16 & 255,
      s >> 8 & 255,
      s & 255,
      85,
      196,
      // 'und' language (undetermined)
      0,
      0
    ]));
  }
  static mdia(e) {
    return L.box(L.types.mdia, L.mdhd(e.timescale, e.duration), L.hdlr(e.type), L.minf(e));
  }
  static mfhd(e) {
    return L.box(L.types.mfhd, new Uint8Array([
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
    return e.type === "audio" ? L.box(L.types.minf, L.box(L.types.smhd, L.SMHD), L.DINF, L.stbl(e)) : L.box(L.types.minf, L.box(L.types.vmhd, L.VMHD), L.DINF, L.stbl(e));
  }
  static moof(e, t, i) {
    return L.box(L.types.moof, L.mfhd(e), L.traf(i, t));
  }
  static moov(e) {
    let t = e.length;
    const i = [];
    for (; t--; )
      i[t] = L.trak(e[t]);
    return L.box.apply(null, [L.types.moov, L.mvhd(e[0].timescale, e[0].duration)].concat(i).concat(L.mvex(e)));
  }
  static mvex(e) {
    let t = e.length;
    const i = [];
    for (; t--; )
      i[t] = L.trex(e[t]);
    return L.box.apply(null, [L.types.mvex, ...i]);
  }
  static mvhd(e, t) {
    t *= e;
    const i = Math.floor(t / (_e + 1)), s = Math.floor(t % (_e + 1)), n = new Uint8Array([
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
      i >> 24,
      i >> 16 & 255,
      i >> 8 & 255,
      i & 255,
      s >> 24,
      s >> 16 & 255,
      s >> 8 & 255,
      s & 255,
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
    return L.box(L.types.mvhd, n);
  }
  static sdtp(e) {
    const t = e.samples || [], i = new Uint8Array(4 + t.length);
    let s, n;
    for (s = 0; s < t.length; s++)
      n = t[s].flags, i[s + 4] = n.dependsOn << 4 | n.isDependedOn << 2 | n.hasRedundancy;
    return L.box(L.types.sdtp, i);
  }
  static stbl(e) {
    return L.box(L.types.stbl, L.stsd(e), L.box(L.types.stts, L.STTS), L.box(L.types.stsc, L.STSC), L.box(L.types.stsz, L.STSZ), L.box(L.types.stco, L.STCO));
  }
  static avc1(e) {
    let t = [], i = [], s, n, r;
    for (s = 0; s < e.sps.length; s++)
      n = e.sps[s], r = n.byteLength, t.push(r >>> 8 & 255), t.push(r & 255), t = t.concat(Array.prototype.slice.call(n));
    for (s = 0; s < e.pps.length; s++)
      n = e.pps[s], r = n.byteLength, i.push(r >>> 8 & 255), i.push(r & 255), i = i.concat(Array.prototype.slice.call(n));
    const o = L.box(L.types.avcC, new Uint8Array([
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
    ]).concat(i))), l = e.width, h = e.height, c = e.pixelRatio[0], u = e.pixelRatio[1];
    return L.box(
      L.types.avc1,
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
        h >> 8 & 255,
        h & 255,
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
      L.box(L.types.btrt, new Uint8Array([
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
      L.box(L.types.pasp, new Uint8Array([
        c >> 24,
        // hSpacing
        c >> 16 & 255,
        c >> 8 & 255,
        c & 255,
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
    return L.box(L.types.mp4a, L.audioStsd(e), L.box(L.types.esds, L.esds(e)));
  }
  static mp3(e) {
    return L.box(L.types[".mp3"], L.audioStsd(e));
  }
  static ac3(e) {
    return L.box(L.types["ac-3"], L.audioStsd(e), L.box(L.types.dac3, e.config));
  }
  static stsd(e) {
    return e.type === "audio" ? e.segmentCodec === "mp3" && e.codec === "mp3" ? L.box(L.types.stsd, L.STSD, L.mp3(e)) : e.segmentCodec === "ac3" ? L.box(L.types.stsd, L.STSD, L.ac3(e)) : L.box(L.types.stsd, L.STSD, L.mp4a(e)) : L.box(L.types.stsd, L.STSD, L.avc1(e));
  }
  static tkhd(e) {
    const t = e.id, i = e.duration * e.timescale, s = e.width, n = e.height, r = Math.floor(i / (_e + 1)), o = Math.floor(i % (_e + 1));
    return L.box(L.types.tkhd, new Uint8Array([
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
      s >> 8 & 255,
      s & 255,
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
    const i = L.sdtp(e), s = e.id, n = Math.floor(t / (_e + 1)), r = Math.floor(t % (_e + 1));
    return L.box(
      L.types.traf,
      L.box(L.types.tfhd, new Uint8Array([
        0,
        // version 0
        0,
        0,
        0,
        // flags
        s >> 24,
        s >> 16 & 255,
        s >> 8 & 255,
        s & 255
        // track_ID
      ])),
      L.box(L.types.tfdt, new Uint8Array([
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
      L.trun(e, i.length + 16 + // tfhd
      20 + // tfdt
      8 + // traf header
      16 + // mfhd
      8 + // moof header
      8),
      // mdat header
      i
    );
  }
  /**
   * Generate a track box.
   * @param track a track definition
   */
  static trak(e) {
    return e.duration = e.duration || 4294967295, L.box(L.types.trak, L.tkhd(e), L.mdia(e));
  }
  static trex(e) {
    const t = e.id;
    return L.box(L.types.trex, new Uint8Array([
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
    const i = e.samples || [], s = i.length, n = 12 + 16 * s, r = new Uint8Array(n);
    let o, l, h, c, u, d;
    for (t += 8 + n, r.set([
      e.type === "video" ? 1 : 0,
      // version 1 for video with signed-int sample_composition_time_offset
      0,
      15,
      1,
      // flags
      s >>> 24 & 255,
      s >>> 16 & 255,
      s >>> 8 & 255,
      s & 255,
      // sample_count
      t >>> 24 & 255,
      t >>> 16 & 255,
      t >>> 8 & 255,
      t & 255
      // data_offset
    ], 0), o = 0; o < s; o++)
      l = i[o], h = l.duration, c = l.size, u = l.flags, d = l.cts, r.set([
        h >>> 24 & 255,
        h >>> 16 & 255,
        h >>> 8 & 255,
        h & 255,
        // sample_duration
        c >>> 24 & 255,
        c >>> 16 & 255,
        c >>> 8 & 255,
        c & 255,
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
    return L.box(L.types.trun, r);
  }
  static initSegment(e) {
    L.types || L.init();
    const t = L.moov(e);
    return Te(L.FTYP, t);
  }
}
L.types = void 0;
L.HDLR_TYPES = void 0;
L.STTS = void 0;
L.STSC = void 0;
L.STCO = void 0;
L.STSZ = void 0;
L.VMHD = void 0;
L.SMHD = void 0;
L.STSD = void 0;
L.FTYP = void 0;
L.DINF = void 0;
const In = 9e4;
function Pi(a, e, t = 1, i = !1) {
  const s = a * e * t;
  return i ? Math.round(s) : s;
}
function Ao(a, e, t = 1, i = !1) {
  return Pi(a, e, 1 / t, i);
}
function et(a, e = !1) {
  return Pi(a, 1e3, 1 / In, e);
}
function Lo(a, e = 1) {
  return Pi(a, In, 1 / e);
}
const Ro = 10 * 1e3, xs = 1024, bo = 1152, Io = 1536;
let We = null, zt = null;
class Et {
  constructor(e, t, i, s = "") {
    if (this.observer = void 0, this.config = void 0, this.typeSupported = void 0, this.ISGenerated = !1, this._initPTS = null, this._initDTS = null, this.nextAvcDts = null, this.nextAudioPts = null, this.videoSampleDuration = null, this.isAudioContiguous = !1, this.isVideoContiguous = !1, this.videoTrackConfig = void 0, this.observer = e, this.config = t, this.typeSupported = i, this.ISGenerated = !1, We === null) {
      const r = (navigator.userAgent || "").match(/Chrome\/(\d+)/i);
      We = r ? parseInt(r[1]) : 0;
    }
    if (zt === null) {
      const n = navigator.userAgent.match(/Safari\/(\d+)/i);
      zt = n ? parseInt(n[1]) : 0;
    }
  }
  destroy() {
    this.config = this.videoTrackConfig = this._initPTS = this._initDTS = null;
  }
  resetTimeStamp(e) {
    A.log("[mp4-remuxer]: initPTS & initDTS reset"), this._initPTS = this._initDTS = e;
  }
  resetNextTimestamp() {
    A.log("[mp4-remuxer]: reset next timestamp"), this.isVideoContiguous = !1, this.isAudioContiguous = !1;
  }
  resetInitSegment() {
    A.log("[mp4-remuxer]: ISGenerated flag reset"), this.ISGenerated = !1, this.videoTrackConfig = void 0;
  }
  getVideoStartPts(e) {
    let t = !1;
    const i = e.reduce((s, n) => {
      const r = n.pts - s;
      return r < -4294967296 ? (t = !0, pe(s, n.pts)) : r > 0 ? s : n.pts;
    }, e[0].pts);
    return t && A.debug("PTS rollover detected"), i;
  }
  remux(e, t, i, s, n, r, o, l) {
    let h, c, u, d, f, g, m = n, T = n;
    const y = e.pid > -1, E = t.pid > -1, x = t.samples.length, v = e.samples.length > 0, S = o && x > 0 || x > 1;
    if ((!y || v) && (!E || S) || this.ISGenerated || o) {
      if (this.ISGenerated) {
        var R, I, D, w;
        const K = this.videoTrackConfig;
        K && (t.width !== K.width || t.height !== K.height || ((R = t.pixelRatio) == null ? void 0 : R[0]) !== ((I = K.pixelRatio) == null ? void 0 : I[0]) || ((D = t.pixelRatio) == null ? void 0 : D[1]) !== ((w = K.pixelRatio) == null ? void 0 : w[1])) && this.resetInitSegment();
      } else
        u = this.generateIS(e, t, n, r);
      const _ = this.isVideoContiguous;
      let O = -1, P;
      if (S && (O = Co(t.samples), !_ && this.config.forceKeyFrameOnDiscontinuity))
        if (g = !0, O > 0) {
          A.warn(`[mp4-remuxer]: Dropped ${O} out of ${x} video samples due to a missing keyframe`);
          const K = this.getVideoStartPts(t.samples);
          t.samples = t.samples.slice(O), t.dropped += O, T += (t.samples[0].pts - K) / t.inputTimeScale, P = T;
        } else
          O === -1 && (A.warn(`[mp4-remuxer]: No keyframe found out of ${x} video samples`), g = !1);
      if (this.ISGenerated) {
        if (v && S) {
          const K = this.getVideoStartPts(t.samples), U = (pe(e.samples[0].pts, K) - K) / t.inputTimeScale;
          m += Math.max(0, U), T += Math.max(0, -U);
        }
        if (v) {
          if (e.samplerate || (A.warn("[mp4-remuxer]: regenerate InitSegment as audio detected"), u = this.generateIS(e, t, n, r)), c = this.remuxAudio(e, m, this.isAudioContiguous, r, E || S || l === G.AUDIO ? T : void 0), S) {
            const K = c ? c.endPTS - c.startPTS : 0;
            t.inputTimeScale || (A.warn("[mp4-remuxer]: regenerate InitSegment as video detected"), u = this.generateIS(e, t, n, r)), h = this.remuxVideo(t, T, _, K);
          }
        } else
          S && (h = this.remuxVideo(t, T, _, 0));
        h && (h.firstKeyFrame = O, h.independent = O !== -1, h.firstKeyFramePTS = P);
      }
    }
    return this.ISGenerated && this._initPTS && this._initDTS && (i.samples.length && (f = Cn(i, n, this._initPTS, this._initDTS)), s.samples.length && (d = Dn(s, n, this._initPTS))), {
      audio: c,
      video: h,
      initSegment: u,
      independent: g,
      text: d,
      id3: f
    };
  }
  generateIS(e, t, i, s) {
    const n = e.samples, r = t.samples, o = this.typeSupported, l = {}, h = this._initPTS;
    let c = !h || s, u = "audio/mp4", d, f, g;
    if (c && (d = f = 1 / 0), e.config && n.length) {
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
        initSegment: e.segmentCodec === "mp3" && o.mpeg ? new Uint8Array(0) : L.initSegment([e]),
        metadata: {
          channelCount: e.channelCount
        }
      }, c && (g = e.inputTimeScale, !h || g !== h.timescale ? d = f = n[0].pts - Math.round(g * i) : c = !1);
    }
    if (t.sps && t.pps && r.length) {
      if (t.timescale = t.inputTimeScale, l.video = {
        id: "main",
        container: "video/mp4",
        codec: t.codec,
        initSegment: L.initSegment([t]),
        metadata: {
          width: t.width,
          height: t.height
        }
      }, c)
        if (g = t.inputTimeScale, !h || g !== h.timescale) {
          const m = this.getVideoStartPts(r), T = Math.round(g * i);
          f = Math.min(f, pe(r[0].dts, m) - T), d = Math.min(d, m - T);
        } else
          c = !1;
      this.videoTrackConfig = {
        width: t.width,
        height: t.height,
        pixelRatio: t.pixelRatio
      };
    }
    if (Object.keys(l).length)
      return this.ISGenerated = !0, c ? (this._initPTS = {
        baseTime: d,
        timescale: g
      }, this._initDTS = {
        baseTime: f,
        timescale: g
      }) : d = g = void 0, {
        tracks: l,
        initPTS: d,
        timescale: g
      };
  }
  remuxVideo(e, t, i, s) {
    const n = e.inputTimeScale, r = e.samples, o = [], l = r.length, h = this._initPTS;
    let c = this.nextAvcDts, u = 8, d = this.videoSampleDuration, f, g, m = Number.POSITIVE_INFINITY, T = Number.NEGATIVE_INFINITY, y = !1;
    if (!i || c === null) {
      const B = t * n, F = r[0].pts - pe(r[0].dts, r[0].pts);
      We && c !== null && Math.abs(B - F - c) < 15e3 ? i = !0 : c = B - F;
    }
    const E = h.baseTime * n / h.timescale;
    for (let B = 0; B < l; B++) {
      const F = r[B];
      F.pts = pe(F.pts - E, c), F.dts = pe(F.dts - E, c), F.dts < r[B > 0 ? B - 1 : B].dts && (y = !0);
    }
    y && r.sort(function(B, F) {
      const j = B.dts - F.dts, W = B.pts - F.pts;
      return j || W;
    }), f = r[0].dts, g = r[r.length - 1].dts;
    const x = g - f, v = x ? Math.round(x / (l - 1)) : d || e.inputTimeScale / 30;
    if (i) {
      const B = f - c, F = B > v, j = B < -1;
      if ((F || j) && (F ? A.warn(`AVC: ${et(B, !0)} ms (${B}dts) hole between fragments detected at ${t.toFixed(3)}`) : A.warn(`AVC: ${et(-B, !0)} ms (${B}dts) overlapping between fragments detected at ${t.toFixed(3)}`), !j || c >= r[0].pts || We)) {
        f = c;
        const W = r[0].pts - B;
        if (F)
          r[0].dts = f, r[0].pts = W;
        else
          for (let z = 0; z < r.length && !(r[z].dts > W); z++)
            r[z].dts -= B, r[z].pts -= B;
        A.log(`Video: Initial PTS/DTS adjusted: ${et(W, !0)}/${et(f, !0)}, delta: ${et(B, !0)} ms`);
      }
    }
    f = Math.max(0, f);
    let S = 0, C = 0, R = f;
    for (let B = 0; B < l; B++) {
      const F = r[B], j = F.units, W = j.length;
      let z = 0;
      for (let ie = 0; ie < W; ie++)
        z += j[ie].data.length;
      C += z, S += W, F.length = z, F.dts < R ? (F.dts = R, R += v / 4 | 0 || 1) : R = F.dts, m = Math.min(F.pts, m), T = Math.max(F.pts, T);
    }
    g = r[l - 1].dts;
    const I = C + 4 * S + 8;
    let D;
    try {
      D = new Uint8Array(I);
    } catch (B) {
      this.observer.emit(p.ERROR, p.ERROR, {
        type: V.MUX_ERROR,
        details: b.REMUX_ALLOC_ERROR,
        fatal: !1,
        error: B,
        bytes: I,
        reason: `fail allocating video mdat ${I}`
      });
      return;
    }
    const w = new DataView(D.buffer);
    w.setUint32(0, I), D.set(L.types.mdat, 4);
    let _ = !1, O = Number.POSITIVE_INFINITY, P = Number.POSITIVE_INFINITY, K = Number.NEGATIVE_INFINITY, N = Number.NEGATIVE_INFINITY;
    for (let B = 0; B < l; B++) {
      const F = r[B], j = F.units;
      let W = 0;
      for (let re = 0, he = j.length; re < he; re++) {
        const ge = j[re], Ze = ge.data, Nt = ge.data.byteLength;
        w.setUint32(u, Nt), u += 4, D.set(Ze, u), u += Nt, W += 4 + Nt;
      }
      let z;
      if (B < l - 1)
        d = r[B + 1].dts - F.dts, z = r[B + 1].pts - F.pts;
      else {
        const re = this.config, he = B > 0 ? F.dts - r[B - 1].dts : v;
        if (z = B > 0 ? F.pts - r[B - 1].pts : v, re.stretchShortVideoTrack && this.nextAudioPts !== null) {
          const ge = Math.floor(re.maxBufferHole * n), Ze = (s ? m + s * n : this.nextAudioPts) - F.pts;
          Ze > ge ? (d = Ze - he, d < 0 ? d = he : _ = !0, A.log(`[mp4-remuxer]: It is approximately ${Ze / 90} ms to the next segment; using duration ${d / 90} ms for the last video frame.`)) : d = he;
        } else
          d = he;
      }
      const ie = Math.round(F.pts - F.dts);
      O = Math.min(O, d), K = Math.max(K, d), P = Math.min(P, z), N = Math.max(N, z), o.push(new Ss(F.key, d, W, ie));
    }
    if (o.length) {
      if (We) {
        if (We < 70) {
          const B = o[0].flags;
          B.dependsOn = 2, B.isNonSync = 0;
        }
      } else if (zt && N - P < K - O && v / K < 0.025 && o[0].cts === 0) {
        A.warn("Found irregular gaps in sample duration. Using PTS instead of DTS to determine MP4 sample duration.");
        let B = f;
        for (let F = 0, j = o.length; F < j; F++) {
          const W = B + o[F].duration, z = B + o[F].cts;
          if (F < j - 1) {
            const ie = W + o[F + 1].cts;
            o[F].duration = ie - z;
          } else
            o[F].duration = F ? o[F - 1].duration : v;
          o[F].cts = 0, B = W;
        }
      }
    }
    d = _ || !d ? v : d, this.nextAvcDts = c = g + d, this.videoSampleDuration = d, this.isVideoContiguous = !0;
    const U = L.moof(e.sequenceNumber++, f, se({}, e, {
      samples: o
    })), q = "video", Q = {
      data1: U,
      data2: D,
      startPTS: m / n,
      endPTS: (T + d) / n,
      startDTS: f / n,
      endDTS: c / n,
      type: q,
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
        return bo;
      case "ac3":
        return Io;
      default:
        return xs;
    }
  }
  remuxAudio(e, t, i, s, n) {
    const r = e.inputTimeScale, o = e.samplerate ? e.samplerate : r, l = r / o, h = this.getSamplesPerFrame(e), c = h * l, u = this._initPTS, d = e.segmentCodec === "mp3" && this.typeSupported.mpeg, f = [], g = n !== void 0;
    let m = e.samples, T = d ? 0 : 8, y = this.nextAudioPts || -1;
    const E = t * r, x = u.baseTime * r / u.timescale;
    if (this.isAudioContiguous = i = i || m.length && y > 0 && (s && Math.abs(E - y) < 9e3 || Math.abs(pe(m[0].pts - x, E) - y) < 20 * c), m.forEach(function(U) {
      U.pts = pe(U.pts - x, E);
    }), !i || y < 0) {
      if (m = m.filter((U) => U.pts >= 0), !m.length)
        return;
      n === 0 ? y = 0 : s && !g ? y = Math.max(0, E) : y = m[0].pts;
    }
    if (e.segmentCodec === "aac") {
      const U = this.config.maxAudioFramesDrift;
      for (let q = 0, Q = y; q < m.length; q++) {
        const B = m[q], F = B.pts, j = F - Q, W = Math.abs(1e3 * j / r);
        if (j <= -U * c && g)
          q === 0 && (A.warn(`Audio frame @ ${(F / r).toFixed(3)}s overlaps nextAudioPts by ${Math.round(1e3 * j / r)} ms.`), this.nextAudioPts = y = Q = F);
        else if (j >= U * c && W < Ro && g) {
          let z = Math.round(j / c);
          Q = F - z * c, Q < 0 && (z--, Q += c), q === 0 && (this.nextAudioPts = y = Q), A.warn(`[mp4-remuxer]: Injecting ${z} audio frame @ ${(Q / r).toFixed(3)}s due to ${Math.round(1e3 * j / r)} ms gap.`);
          for (let ie = 0; ie < z; ie++) {
            const re = Math.max(Q, 0);
            let he = vs.getSilentFrame(e.manifestCodec || e.codec, e.channelCount);
            he || (A.log("[mp4-remuxer]: Unable to get silent frame for given audio codec; duplicating last frame instead."), he = B.unit.subarray()), m.splice(q, 0, {
              unit: he,
              pts: re
            }), Q += c, q++;
          }
        }
        B.pts = Q, Q += c;
      }
    }
    let v = null, S = null, C, R = 0, I = m.length;
    for (; I--; )
      R += m[I].unit.byteLength;
    for (let U = 0, q = m.length; U < q; U++) {
      const Q = m[U], B = Q.unit;
      let F = Q.pts;
      if (S !== null) {
        const W = f[U - 1];
        W.duration = Math.round((F - S) / l);
      } else if (i && e.segmentCodec === "aac" && (F = y), v = F, R > 0) {
        R += T;
        try {
          C = new Uint8Array(R);
        } catch (W) {
          this.observer.emit(p.ERROR, p.ERROR, {
            type: V.MUX_ERROR,
            details: b.REMUX_ALLOC_ERROR,
            fatal: !1,
            error: W,
            bytes: R,
            reason: `fail allocating audio mdat ${R}`
          });
          return;
        }
        d || (new DataView(C.buffer).setUint32(0, R), C.set(L.types.mdat, 4));
      } else
        return;
      C.set(B, T);
      const j = B.byteLength;
      T += j, f.push(new Ss(!0, h, j, 0)), S = F;
    }
    const D = f.length;
    if (!D)
      return;
    const w = f[f.length - 1];
    this.nextAudioPts = y = S + l * w.duration;
    const _ = d ? new Uint8Array(0) : L.moof(e.sequenceNumber++, v / l, se({}, e, {
      samples: f
    }));
    e.samples = [];
    const O = v / r, P = y / r, N = {
      data1: _,
      data2: C,
      startPTS: O,
      endPTS: P,
      startDTS: O,
      endDTS: P,
      type: "audio",
      hasAudio: !0,
      hasVideo: !1,
      nb: D
    };
    return this.isAudioContiguous = !0, N;
  }
  remuxEmptyAudio(e, t, i, s) {
    const n = e.inputTimeScale, r = e.samplerate ? e.samplerate : n, o = n / r, l = this.nextAudioPts, h = this._initDTS, c = h.baseTime * 9e4 / h.timescale, u = (l !== null ? l : s.startDTS * n) + c, d = s.endDTS * n + c, f = o * xs, g = Math.ceil((d - u) / f), m = vs.getSilentFrame(e.manifestCodec || e.codec, e.channelCount);
    if (A.warn("[mp4-remuxer]: remux empty Audio"), !m) {
      A.trace("[mp4-remuxer]: Unable to remuxEmptyAudio since we were unable to get a silent frame for given audio codec");
      return;
    }
    const T = [];
    for (let y = 0; y < g; y++) {
      const E = u + y * f;
      T.push({
        unit: m,
        pts: E,
        dts: E
      });
    }
    return e.samples = T, this.remuxAudio(e, t, i, !1);
  }
}
function pe(a, e) {
  let t;
  if (e === null)
    return a;
  for (e < a ? t = -8589934592 : t = 8589934592; Math.abs(a - e) > 4294967296; )
    a += t;
  return a;
}
function Co(a) {
  for (let e = 0; e < a.length; e++)
    if (a[e].key)
      return e;
  return -1;
}
function Cn(a, e, t, i) {
  const s = a.samples.length;
  if (!s)
    return;
  const n = a.inputTimeScale;
  for (let o = 0; o < s; o++) {
    const l = a.samples[o];
    l.pts = pe(l.pts - t.baseTime * n / t.timescale, e * n) / n, l.dts = pe(l.dts - i.baseTime * n / i.timescale, e * n) / n;
  }
  const r = a.samples;
  return a.samples = [], {
    samples: r
  };
}
function Dn(a, e, t) {
  const i = a.samples.length;
  if (!i)
    return;
  const s = a.inputTimeScale;
  for (let r = 0; r < i; r++) {
    const o = a.samples[r];
    o.pts = pe(o.pts - t.baseTime * s / t.timescale, e * s) / s;
  }
  a.samples.sort((r, o) => r.pts - o.pts);
  const n = a.samples;
  return a.samples = [], {
    samples: n
  };
}
class Ss {
  constructor(e, t, i, s) {
    this.size = void 0, this.duration = void 0, this.cts = void 0, this.flags = void 0, this.duration = t, this.size = i, this.cts = s, this.flags = {
      isLeading: 0,
      isDependedOn: 0,
      hasRedundancy: 0,
      degradPrio: 0,
      dependsOn: e ? 2 : 1,
      isNonSync: e ? 0 : 1
    };
  }
}
class Do {
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
  resetInitSegment(e, t, i, s) {
    this.audioCodec = t, this.videoCodec = i, this.generateInitSegment(Or(e, s)), this.emitInitSegment = !0;
  }
  generateInitSegment(e) {
    let {
      audioCodec: t,
      videoCodec: i
    } = this;
    if (!(e != null && e.byteLength)) {
      this.initTracks = void 0, this.initData = void 0;
      return;
    }
    const s = this.initData = Zs(e);
    s.audio && (t = As(s.audio, X.AUDIO)), s.video && (i = As(s.video, X.VIDEO));
    const n = {};
    s.audio && s.video ? n.audiovideo = {
      container: "video/mp4",
      codec: t + "," + i,
      initSegment: e,
      id: "main"
    } : s.audio ? n.audio = {
      container: "audio/mp4",
      codec: t,
      initSegment: e,
      id: "audio"
    } : s.video ? n.video = {
      container: "video/mp4",
      codec: i,
      initSegment: e,
      id: "main"
    } : A.warn("[passthrough-remuxer.ts]: initSegment does not contain moov or trak boxes."), this.initTracks = n;
  }
  remux(e, t, i, s, n, r) {
    var o, l;
    let {
      initPTS: h,
      lastEndTime: c
    } = this;
    const u = {
      audio: void 0,
      video: void 0,
      text: s,
      id3: i,
      initSegment: void 0
    };
    M(c) || (c = this.lastEndTime = n || 0);
    const d = t.samples;
    if (!(d != null && d.length))
      return u;
    const f = {
      initPTS: void 0,
      timescale: 1
    };
    let g = this.initData;
    if ((o = g) != null && o.length || (this.generateInitSegment(d), g = this.initData), !((l = g) != null && l.length))
      return A.warn("[passthrough-remuxer.ts]: Failed to generate initSegment."), u;
    this.emitInitSegment && (f.tracks = this.initTracks, this.emitInitSegment = !1);
    const m = Nr(d, g), T = Mr(g, d), y = T === null ? n : T;
    (wo(h, y, n, m) || f.timescale !== h.timescale && r) && (f.initPTS = y - n, h && h.timescale === 1 && A.warn(`Adjusting initPTS by ${f.initPTS - h.baseTime}`), this.initPTS = h = {
      baseTime: f.initPTS,
      timescale: 1
    });
    const E = e ? y - h.baseTime / h.timescale : c, x = E + m;
    Br(g, d, h.baseTime / h.timescale), m > 0 ? this.lastEndTime = x : (A.warn("Duration parsed from mp4 should be greater than zero"), this.resetNextTimestamp());
    const v = !!g.audio, S = !!g.video;
    let C = "";
    v && (C += "audio"), S && (C += "video");
    const R = {
      data1: d,
      startPTS: E,
      startDTS: E,
      endPTS: x,
      endDTS: x,
      type: C,
      hasAudio: v,
      hasVideo: S,
      nb: 1,
      dropped: 0
    };
    return u.audio = R.type === "audio" ? R : void 0, u.video = R.type !== "audio" ? R : void 0, u.initSegment = f, u.id3 = Cn(i, n, h, h), s.samples.length && (u.text = Dn(s, n, h)), u;
  }
}
function wo(a, e, t, i) {
  if (a === null)
    return !0;
  const s = Math.max(i, 1), n = e - a.baseTime / a.timescale;
  return Math.abs(n - t) > s;
}
function As(a, e) {
  const t = a == null ? void 0 : a.codec;
  if (t && t.length > 4)
    return t;
  if (e === X.AUDIO) {
    if (t === "ec-3" || t === "ac-3" || t === "alac")
      return t;
    if (t === "fLaC" || t === "Opus")
      return It(t, !1);
    const i = "mp4a.40.5";
    return A.info(`Parsed audio codec "${t}" or audio object type not handled. Using "${i}"`), i;
  }
  return A.warn(`Unhandled video codec "${t}"`), t === "hvc1" || t === "hev1" ? "hvc1.1.6.L120.90" : t === "av01" ? "av01.0.04M.08" : "avc1.42e01e";
}
let ke;
try {
  ke = self.performance.now.bind(self.performance);
} catch {
  A.debug("Unable to use Performance API on this environment"), ke = ze == null ? void 0 : ze.Date.now;
}
const vt = [{
  demux: mo,
  remux: Do
}, {
  demux: Fe,
  remux: Et
}, {
  demux: fo,
  remux: Et
}, {
  demux: So,
  remux: Et
}];
vt.splice(2, 0, {
  demux: po,
  remux: Et
});
class Ls {
  constructor(e, t, i, s, n) {
    this.async = !1, this.observer = void 0, this.typeSupported = void 0, this.config = void 0, this.vendor = void 0, this.id = void 0, this.demuxer = void 0, this.remuxer = void 0, this.decrypter = void 0, this.probe = void 0, this.decryptionPromise = null, this.transmuxConfig = void 0, this.currentTransmuxState = void 0, this.observer = e, this.typeSupported = t, this.config = i, this.vendor = s, this.id = n;
  }
  configure(e) {
    this.transmuxConfig = e, this.decrypter && this.decrypter.reset();
  }
  push(e, t, i, s) {
    const n = i.transmuxing;
    n.executeStart = ke();
    let r = new Uint8Array(e);
    const {
      currentTransmuxState: o,
      transmuxConfig: l
    } = this;
    s && (this.currentTransmuxState = s);
    const {
      contiguous: h,
      discontinuity: c,
      trackSwitch: u,
      accurateTimeOffset: d,
      timeOffset: f,
      initSegmentChange: g
    } = s || o, {
      audioCodec: m,
      videoCodec: T,
      defaultInitPts: y,
      duration: E,
      initSegmentData: x
    } = l, v = ko(r, t);
    if (v && v.method === "AES-128") {
      const I = this.getDecrypter();
      if (I.isSync()) {
        let D = I.softwareDecrypt(r, v.key.buffer, v.iv.buffer);
        if (i.part > -1 && (D = I.flush()), !D)
          return n.executeEnd = ke(), Xt(i);
        r = new Uint8Array(D);
      } else
        return this.decryptionPromise = I.webCryptoDecrypt(r, v.key.buffer, v.iv.buffer).then((D) => {
          const w = this.push(D, null, i);
          return this.decryptionPromise = null, w;
        }), this.decryptionPromise;
    }
    const S = this.needsProbing(c, u);
    if (S) {
      const I = this.configureTransmuxer(r);
      if (I)
        return A.warn(`[transmuxer] ${I.message}`), this.observer.emit(p.ERROR, p.ERROR, {
          type: V.MEDIA_ERROR,
          details: b.FRAG_PARSING_ERROR,
          fatal: !1,
          error: I,
          reason: I.message
        }), n.executeEnd = ke(), Xt(i);
    }
    (c || u || g || S) && this.resetInitSegment(x, m, T, E, t), (c || g || S) && this.resetInitialTimestamp(y), h || this.resetContiguity();
    const C = this.transmux(r, v, f, d, i), R = this.currentTransmuxState;
    return R.contiguous = !0, R.discontinuity = !1, R.trackSwitch = !1, n.executeEnd = ke(), C;
  }
  // Due to data caching, flush calls can produce more than one TransmuxerResult (hence the Array type)
  flush(e) {
    const t = e.transmuxing;
    t.executeStart = ke();
    const {
      decrypter: i,
      currentTransmuxState: s,
      decryptionPromise: n
    } = this;
    if (n)
      return n.then(() => this.flush(e));
    const r = [], {
      timeOffset: o
    } = s;
    if (i) {
      const u = i.flush();
      u && r.push(this.push(u, null, e));
    }
    const {
      demuxer: l,
      remuxer: h
    } = this;
    if (!l || !h)
      return t.executeEnd = ke(), [Xt(e)];
    const c = l.flush(o);
    return xt(c) ? c.then((u) => (this.flushRemux(r, u, e), r)) : (this.flushRemux(r, c, e), r);
  }
  flushRemux(e, t, i) {
    const {
      audioTrack: s,
      videoTrack: n,
      id3Track: r,
      textTrack: o
    } = t, {
      accurateTimeOffset: l,
      timeOffset: h
    } = this.currentTransmuxState;
    A.log(`[transmuxer.ts]: Flushed fragment ${i.sn}${i.part > -1 ? " p: " + i.part : ""} of level ${i.level}`);
    const c = this.remuxer.remux(s, n, r, o, h, l, !0, this.id);
    e.push({
      remuxResult: c,
      chunkMeta: i
    }), i.transmuxing.executeEnd = ke();
  }
  resetInitialTimestamp(e) {
    const {
      demuxer: t,
      remuxer: i
    } = this;
    !t || !i || (t.resetTimeStamp(e), i.resetTimeStamp(e));
  }
  resetContiguity() {
    const {
      demuxer: e,
      remuxer: t
    } = this;
    !e || !t || (e.resetContiguity(), t.resetNextTimestamp());
  }
  resetInitSegment(e, t, i, s, n) {
    const {
      demuxer: r,
      remuxer: o
    } = this;
    !r || !o || (r.resetInitSegment(e, t, i, s), o.resetInitSegment(e, t, i, n));
  }
  destroy() {
    this.demuxer && (this.demuxer.destroy(), this.demuxer = void 0), this.remuxer && (this.remuxer.destroy(), this.remuxer = void 0);
  }
  transmux(e, t, i, s, n) {
    let r;
    return t && t.method === "SAMPLE-AES" ? r = this.transmuxSampleAes(e, t, i, s, n) : r = this.transmuxUnencrypted(e, i, s, n), r;
  }
  transmuxUnencrypted(e, t, i, s) {
    const {
      audioTrack: n,
      videoTrack: r,
      id3Track: o,
      textTrack: l
    } = this.demuxer.demux(e, t, !1, !this.config.progressive);
    return {
      remuxResult: this.remuxer.remux(n, r, o, l, t, i, !1, this.id),
      chunkMeta: s
    };
  }
  transmuxSampleAes(e, t, i, s, n) {
    return this.demuxer.demuxSampleAes(e, t, i).then((r) => ({
      remuxResult: this.remuxer.remux(r.audioTrack, r.videoTrack, r.id3Track, r.textTrack, i, s, !1, this.id),
      chunkMeta: n
    }));
  }
  configureTransmuxer(e) {
    const {
      config: t,
      observer: i,
      typeSupported: s,
      vendor: n
    } = this;
    let r;
    for (let d = 0, f = vt.length; d < f; d++) {
      var o;
      if ((o = vt[d].demux) != null && o.probe(e)) {
        r = vt[d];
        break;
      }
    }
    if (!r)
      return new Error("Failed to find demuxer by probing fragment data");
    const l = this.demuxer, h = this.remuxer, c = r.remux, u = r.demux;
    (!h || !(h instanceof c)) && (this.remuxer = new c(i, t, s, n)), (!l || !(l instanceof u)) && (this.demuxer = new u(i, t, s), this.probe = u.probe);
  }
  needsProbing(e, t) {
    return !this.demuxer || !this.remuxer || e || t;
  }
  getDecrypter() {
    let e = this.decrypter;
    return e || (e = this.decrypter = new Ci(this.config)), e;
  }
}
function ko(a, e) {
  let t = null;
  return a.byteLength > 0 && (e == null ? void 0 : e.key) != null && e.iv !== null && e.method != null && (t = e), t;
}
const Xt = (a) => ({
  remuxResult: {},
  chunkMeta: a
});
function xt(a) {
  return "then" in a && a.then instanceof Function;
}
class _o {
  constructor(e, t, i, s, n) {
    this.audioCodec = void 0, this.videoCodec = void 0, this.initSegmentData = void 0, this.duration = void 0, this.defaultInitPts = void 0, this.audioCodec = e, this.videoCodec = t, this.initSegmentData = i, this.duration = s, this.defaultInitPts = n || null;
  }
}
class Po {
  constructor(e, t, i, s, n, r) {
    this.discontinuity = void 0, this.contiguous = void 0, this.accurateTimeOffset = void 0, this.trackSwitch = void 0, this.timeOffset = void 0, this.initSegmentChange = void 0, this.discontinuity = e, this.contiguous = t, this.accurateTimeOffset = i, this.trackSwitch = s, this.timeOffset = n, this.initSegmentChange = r;
  }
}
var wn = { exports: {} };
(function(a) {
  var e = Object.prototype.hasOwnProperty, t = "~";
  function i() {
  }
  Object.create && (i.prototype = /* @__PURE__ */ Object.create(null), new i().__proto__ || (t = !1));
  function s(l, h, c) {
    this.fn = l, this.context = h, this.once = c || !1;
  }
  function n(l, h, c, u, d) {
    if (typeof c != "function")
      throw new TypeError("The listener must be a function");
    var f = new s(c, u || l, d), g = t ? t + h : h;
    return l._events[g] ? l._events[g].fn ? l._events[g] = [l._events[g], f] : l._events[g].push(f) : (l._events[g] = f, l._eventsCount++), l;
  }
  function r(l, h) {
    --l._eventsCount === 0 ? l._events = new i() : delete l._events[h];
  }
  function o() {
    this._events = new i(), this._eventsCount = 0;
  }
  o.prototype.eventNames = function() {
    var h = [], c, u;
    if (this._eventsCount === 0)
      return h;
    for (u in c = this._events)
      e.call(c, u) && h.push(t ? u.slice(1) : u);
    return Object.getOwnPropertySymbols ? h.concat(Object.getOwnPropertySymbols(c)) : h;
  }, o.prototype.listeners = function(h) {
    var c = t ? t + h : h, u = this._events[c];
    if (!u)
      return [];
    if (u.fn)
      return [u.fn];
    for (var d = 0, f = u.length, g = new Array(f); d < f; d++)
      g[d] = u[d].fn;
    return g;
  }, o.prototype.listenerCount = function(h) {
    var c = t ? t + h : h, u = this._events[c];
    return u ? u.fn ? 1 : u.length : 0;
  }, o.prototype.emit = function(h, c, u, d, f, g) {
    var m = t ? t + h : h;
    if (!this._events[m])
      return !1;
    var T = this._events[m], y = arguments.length, E, x;
    if (T.fn) {
      switch (T.once && this.removeListener(h, T.fn, void 0, !0), y) {
        case 1:
          return T.fn.call(T.context), !0;
        case 2:
          return T.fn.call(T.context, c), !0;
        case 3:
          return T.fn.call(T.context, c, u), !0;
        case 4:
          return T.fn.call(T.context, c, u, d), !0;
        case 5:
          return T.fn.call(T.context, c, u, d, f), !0;
        case 6:
          return T.fn.call(T.context, c, u, d, f, g), !0;
      }
      for (x = 1, E = new Array(y - 1); x < y; x++)
        E[x - 1] = arguments[x];
      T.fn.apply(T.context, E);
    } else {
      var v = T.length, S;
      for (x = 0; x < v; x++)
        switch (T[x].once && this.removeListener(h, T[x].fn, void 0, !0), y) {
          case 1:
            T[x].fn.call(T[x].context);
            break;
          case 2:
            T[x].fn.call(T[x].context, c);
            break;
          case 3:
            T[x].fn.call(T[x].context, c, u);
            break;
          case 4:
            T[x].fn.call(T[x].context, c, u, d);
            break;
          default:
            if (!E)
              for (S = 1, E = new Array(y - 1); S < y; S++)
                E[S - 1] = arguments[S];
            T[x].fn.apply(T[x].context, E);
        }
    }
    return !0;
  }, o.prototype.on = function(h, c, u) {
    return n(this, h, c, u, !1);
  }, o.prototype.once = function(h, c, u) {
    return n(this, h, c, u, !0);
  }, o.prototype.removeListener = function(h, c, u, d) {
    var f = t ? t + h : h;
    if (!this._events[f])
      return this;
    if (!c)
      return r(this, f), this;
    var g = this._events[f];
    if (g.fn)
      g.fn === c && (!d || g.once) && (!u || g.context === u) && r(this, f);
    else {
      for (var m = 0, T = [], y = g.length; m < y; m++)
        (g[m].fn !== c || d && !g[m].once || u && g[m].context !== u) && T.push(g[m]);
      T.length ? this._events[f] = T.length === 1 ? T[0] : T : r(this, f);
    }
    return this;
  }, o.prototype.removeAllListeners = function(h) {
    var c;
    return h ? (c = t ? t + h : h, this._events[c] && r(this, c)) : (this._events = new i(), this._eventsCount = 0), this;
  }, o.prototype.off = o.prototype.removeListener, o.prototype.addListener = o.prototype.on, o.prefixed = t, o.EventEmitter = o, a.exports = o;
})(wn);
var Fo = wn.exports, Fi = /* @__PURE__ */ ir(Fo);
class kn {
  constructor(e, t, i, s) {
    this.error = null, this.hls = void 0, this.id = void 0, this.observer = void 0, this.frag = null, this.part = null, this.useWorker = void 0, this.workerContext = null, this.onwmsg = void 0, this.transmuxer = null, this.onTransmuxComplete = void 0, this.onFlush = void 0;
    const n = e.config;
    this.hls = e, this.id = t, this.useWorker = !!n.enableWorker, this.onTransmuxComplete = i, this.onFlush = s;
    const r = (h, c) => {
      c = c || {}, c.frag = this.frag, c.id = this.id, h === p.ERROR && (this.error = c.error), this.hls.trigger(h, c);
    };
    this.observer = new Fi(), this.observer.on(p.FRAG_DECRYPTED, r), this.observer.on(p.ERROR, r);
    const o = Be(n.preferManagedMediaSource) || {
      isTypeSupported: () => !1
    }, l = {
      mpeg: o.isTypeSupported("audio/mpeg"),
      mp3: o.isTypeSupported('audio/mp4; codecs="mp3"'),
      ac3: o.isTypeSupported('audio/mp4; codecs="ac-3"')
    };
    if (this.useWorker && typeof Worker < "u" && (n.workerPath || Ja())) {
      try {
        n.workerPath ? (A.log(`loading Web Worker ${n.workerPath} for "${t}"`), this.workerContext = eo(n.workerPath)) : (A.log(`injecting Web Worker for "${t}"`), this.workerContext = Za()), this.onwmsg = (u) => this.onWorkerMessage(u);
        const {
          worker: c
        } = this.workerContext;
        c.addEventListener("message", this.onwmsg), c.onerror = (u) => {
          const d = new Error(`${u.message}  (${u.filename}:${u.lineno})`);
          n.enableWorker = !1, A.warn(`Error in "${t}" Web Worker, fallback to inline`), this.hls.trigger(p.ERROR, {
            type: V.OTHER_ERROR,
            details: b.INTERNAL_EXCEPTION,
            fatal: !1,
            event: "demuxerWorker",
            error: d
          });
        }, c.postMessage({
          cmd: "init",
          typeSupported: l,
          vendor: "",
          id: t,
          config: JSON.stringify(n)
        });
      } catch (c) {
        A.warn(`Error setting up "${t}" Web Worker, fallback to inline`, c), this.resetWorker(), this.error = null, this.transmuxer = new Ls(this.observer, l, n, "", t);
      }
      return;
    }
    this.transmuxer = new Ls(this.observer, l, n, "", t);
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
  push(e, t, i, s, n, r, o, l, h, c) {
    var u, d;
    h.transmuxing.start = self.performance.now();
    const {
      transmuxer: f
    } = this, g = r ? r.start : n.start, m = n.decryptdata, T = this.frag, y = !(T && n.cc === T.cc), E = !(T && h.level === T.level), x = T ? h.sn - T.sn : -1, v = this.part ? h.part - this.part.index : -1, S = x === 0 && h.id > 1 && h.id === (T == null ? void 0 : T.stats.chunkCount), C = !E && (x === 1 || x === 0 && (v === 1 || S && v <= 0)), R = self.performance.now();
    (E || x || n.stats.parsing.start === 0) && (n.stats.parsing.start = R), r && (v || !C) && (r.stats.parsing.start = R);
    const I = !(T && ((u = n.initSegment) == null ? void 0 : u.url) === ((d = T.initSegment) == null ? void 0 : d.url)), D = new Po(y, C, l, E, g, I);
    if (!C || y || I) {
      A.log(`[transmuxer-interface, ${n.type}]: Starting new transmux session for sn: ${h.sn} p: ${h.part} level: ${h.level} id: ${h.id}
        discontinuity: ${y}
        trackSwitch: ${E}
        contiguous: ${C}
        accurateTimeOffset: ${l}
        timeOffset: ${g}
        initSegmentChange: ${I}`);
      const w = new _o(i, s, t, o, c);
      this.configureTransmuxer(w);
    }
    if (this.frag = n, this.part = r, this.workerContext)
      this.workerContext.worker.postMessage({
        cmd: "demux",
        data: e,
        decryptdata: m,
        chunkMeta: h,
        state: D
      }, e instanceof ArrayBuffer ? [e] : []);
    else if (f) {
      const w = f.push(e, m, h, D);
      xt(w) ? (f.async = !0, w.then((_) => {
        this.handleTransmuxComplete(_);
      }).catch((_) => {
        this.transmuxerError(_, h, "transmuxer-interface push error");
      })) : (f.async = !1, this.handleTransmuxComplete(w));
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
      let i = t.flush(e);
      xt(i) || t.async ? (xt(i) || (i = Promise.resolve(i)), i.then((n) => {
        this.handleFlushResult(n, e);
      }).catch((n) => {
        this.transmuxerError(n, e, "transmuxer-interface flush error");
      })) : this.handleFlushResult(i, e);
    }
  }
  transmuxerError(e, t, i) {
    this.hls && (this.error = e, this.hls.trigger(p.ERROR, {
      type: V.MEDIA_ERROR,
      details: b.FRAG_PARSING_ERROR,
      chunkMeta: t,
      frag: this.frag || void 0,
      fatal: !1,
      error: e,
      err: e,
      reason: i
    }));
  }
  handleFlushResult(e, t) {
    e.forEach((i) => {
      this.handleTransmuxComplete(i);
    }), this.onFlush(t);
  }
  onWorkerMessage(e) {
    const t = e.data;
    if (!(t != null && t.event)) {
      A.warn(`worker message received with no ${t ? "event name" : "data"}`);
      return;
    }
    const i = this.hls;
    if (this.hls)
      switch (t.event) {
        case "init": {
          var s;
          const n = (s = this.workerContext) == null ? void 0 : s.objectURL;
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
          A[t.data.logType] && A[t.data.logType](t.data.message);
          break;
        default: {
          t.data = t.data || {}, t.data.frag = this.frag, t.data.id = this.id, i.trigger(t.event, t.data);
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
function _n(a, e) {
  if (a.length !== e.length)
    return !1;
  for (let t = 0; t < a.length; t++)
    if (!Qe(a[t].attrs, e[t].attrs))
      return !1;
  return !0;
}
function Qe(a, e, t) {
  const i = a["STABLE-RENDITION-ID"];
  return i && !t ? i === e["STABLE-RENDITION-ID"] : !(t || ["LANGUAGE", "NAME", "CHARACTERISTICS", "AUTOSELECT", "DEFAULT", "FORCED", "ASSOC-LANGUAGE"]).some((s) => a[s] !== e[s]);
}
function gi(a, e) {
  return e.label.toLowerCase() === a.name.toLowerCase() && (!e.language || e.language.toLowerCase() === (a.lang || "").toLowerCase());
}
const Rs = 100;
class Oo extends Di {
  constructor(e, t, i) {
    super(e, t, i, "[audio-stream-controller]", G.AUDIO), this.videoBuffer = null, this.videoTrackCC = -1, this.waitingVideoCC = -1, this.bufferedTrack = null, this.switchingTrack = null, this.trackId = -1, this.waitingData = null, this.mainDetails = null, this.flushing = !1, this.bufferFlushed = !1, this.cachedTrackLoadedData = null, this._registerListeners();
  }
  onHandlerDestroying() {
    this._unregisterListeners(), super.onHandlerDestroying(), this.mainDetails = null, this.bufferedTrack = null, this.switchingTrack = null;
  }
  _registerListeners() {
    const {
      hls: e
    } = this;
    e.on(p.MEDIA_ATTACHED, this.onMediaAttached, this), e.on(p.MEDIA_DETACHING, this.onMediaDetaching, this), e.on(p.MANIFEST_LOADING, this.onManifestLoading, this), e.on(p.LEVEL_LOADED, this.onLevelLoaded, this), e.on(p.AUDIO_TRACKS_UPDATED, this.onAudioTracksUpdated, this), e.on(p.AUDIO_TRACK_SWITCHING, this.onAudioTrackSwitching, this), e.on(p.AUDIO_TRACK_LOADED, this.onAudioTrackLoaded, this), e.on(p.ERROR, this.onError, this), e.on(p.BUFFER_RESET, this.onBufferReset, this), e.on(p.BUFFER_CREATED, this.onBufferCreated, this), e.on(p.BUFFER_FLUSHING, this.onBufferFlushing, this), e.on(p.BUFFER_FLUSHED, this.onBufferFlushed, this), e.on(p.INIT_PTS_FOUND, this.onInitPtsFound, this), e.on(p.FRAG_BUFFERED, this.onFragBuffered, this);
  }
  _unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(p.MEDIA_ATTACHED, this.onMediaAttached, this), e.off(p.MEDIA_DETACHING, this.onMediaDetaching, this), e.off(p.MANIFEST_LOADING, this.onManifestLoading, this), e.off(p.LEVEL_LOADED, this.onLevelLoaded, this), e.off(p.AUDIO_TRACKS_UPDATED, this.onAudioTracksUpdated, this), e.off(p.AUDIO_TRACK_SWITCHING, this.onAudioTrackSwitching, this), e.off(p.AUDIO_TRACK_LOADED, this.onAudioTrackLoaded, this), e.off(p.ERROR, this.onError, this), e.off(p.BUFFER_RESET, this.onBufferReset, this), e.off(p.BUFFER_CREATED, this.onBufferCreated, this), e.off(p.BUFFER_FLUSHING, this.onBufferFlushing, this), e.off(p.BUFFER_FLUSHED, this.onBufferFlushed, this), e.off(p.INIT_PTS_FOUND, this.onInitPtsFound, this), e.off(p.FRAG_BUFFERED, this.onFragBuffered, this);
  }
  // INIT_PTS_FOUND is triggered when the video track parsed in the stream-controller has a new PTS value
  onInitPtsFound(e, {
    frag: t,
    id: i,
    initPTS: s,
    timescale: n
  }) {
    if (i === "main") {
      const r = t.cc;
      this.initPTS[t.cc] = {
        baseTime: s,
        timescale: n
      }, this.log(`InitPTS for cc: ${r} found from main: ${s}`), this.videoTrackCC = r, this.state === k.WAITING_INIT_PTS && this.tick();
    }
  }
  startLoad(e) {
    if (!this.levels) {
      this.startPosition = e, this.state = k.STOPPED;
      return;
    }
    const t = this.lastCurrentTime;
    this.stopLoad(), this.setInterval(Rs), t > 0 && e === -1 ? (this.log(`Override startPosition with lastCurrentTime @${t.toFixed(3)}`), e = t, this.state = k.IDLE) : (this.loadedmetadata = !1, this.state = k.WAITING_TRACK), this.nextLoadPosition = this.startPosition = this.lastCurrentTime = e, this.tick();
  }
  doTick() {
    switch (this.state) {
      case k.IDLE:
        this.doTickIdle();
        break;
      case k.WAITING_TRACK: {
        var e;
        const {
          levels: i,
          trackId: s
        } = this, n = i == null || (e = i[s]) == null ? void 0 : e.details;
        if (n) {
          if (this.waitForCdnTuneIn(n))
            break;
          this.state = k.WAITING_INIT_PTS;
        }
        break;
      }
      case k.FRAG_LOADING_WAITING_RETRY: {
        var t;
        const i = performance.now(), s = this.retryDate;
        if (!s || i >= s || (t = this.media) != null && t.seeking) {
          const {
            levels: n,
            trackId: r
          } = this;
          this.log("RetryDate reached, switch back to IDLE state"), this.resetStartWhenNotLoaded((n == null ? void 0 : n[r]) || null), this.state = k.IDLE;
        }
        break;
      }
      case k.WAITING_INIT_PTS: {
        const i = this.waitingData;
        if (i) {
          const {
            frag: s,
            part: n,
            cache: r,
            complete: o
          } = i;
          if (this.initPTS[s.cc] !== void 0) {
            this.waitingData = null, this.waitingVideoCC = -1, this.state = k.FRAG_LOADING;
            const l = r.flush(), h = {
              frag: s,
              part: n,
              payload: l,
              networkDetails: null
            };
            this._handleFragmentLoadProgress(h), o && super._handleFragmentLoadComplete(h);
          } else if (this.videoTrackCC !== this.waitingVideoCC)
            this.log(`Waiting fragment cc (${s.cc}) cancelled because video is at cc ${this.videoTrackCC}`), this.clearWaitingFragment();
          else {
            const l = this.getLoadPosition(), h = Z.bufferInfo(this.mediaBuffer, l, this.config.maxBufferHole);
            di(h.end, this.config.maxFragLookUpTolerance, s) < 0 && (this.log(`Waiting fragment cc (${s.cc}) @ ${s.start} cancelled because another fragment at ${h.end} is needed`), this.clearWaitingFragment());
          }
        } else
          this.state = k.IDLE;
      }
    }
    this.onTickEnd();
  }
  clearWaitingFragment() {
    const e = this.waitingData;
    e && (this.fragmentTracker.removeFragment(e.frag), this.waitingData = null, this.waitingVideoCC = -1, this.state = k.IDLE);
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
      media: i,
      trackId: s
    } = this, n = e.config;
    if (!i && (this.startFragRequested || !n.startFragPrefetch) || !(t != null && t[s]))
      return;
    const r = t[s], o = r.details;
    if (!o || o.live && this.levelLastLoaded !== r || this.waitForCdnTuneIn(o)) {
      this.state = k.WAITING_TRACK;
      return;
    }
    const l = this.mediaBuffer ? this.mediaBuffer : this.media;
    this.bufferFlushed && l && (this.bufferFlushed = !1, this.afterBufferFlushed(l, X.AUDIO, G.AUDIO));
    const h = this.getFwdBufferInfo(l, G.AUDIO);
    if (h === null)
      return;
    const {
      bufferedTrack: c,
      switchingTrack: u
    } = this;
    if (!u && this._streamEnded(h, o)) {
      e.trigger(p.BUFFER_EOS, {
        type: "audio"
      }), this.state = k.ENDED;
      return;
    }
    const d = this.getFwdBufferInfo(this.videoBuffer ? this.videoBuffer : this.media, G.MAIN), f = h.len, g = this.getMaxBufferLength(d == null ? void 0 : d.len), m = o.fragments, T = m[0].start;
    let y = this.flushing ? this.getLoadPosition() : h.end;
    if (u && i) {
      const S = this.getLoadPosition();
      c && !Qe(u.attrs, c.attrs) && (y = S), o.PTSKnown && S < T && (h.end > T || h.nextStart) && (this.log("Alt audio track ahead of main track, seek to start of alt audio track"), i.currentTime = T + 0.05);
    }
    if (f >= g && !u && y < m[m.length - 1].start)
      return;
    let E = this.getNextFragment(y, o), x = !1;
    if (E && this.isLoopLoading(E, y) && (x = !!E.gap, E = this.getNextFragmentLoopLoading(E, o, h, G.MAIN, g)), !E) {
      this.bufferFlushed = !0;
      return;
    }
    const v = d && E.start > d.end + o.targetduration;
    if (v || // Or wait for main buffer after buffing some audio
    !(d != null && d.len) && h.len) {
      const S = this.getAppendedFrag(E.start, G.MAIN);
      if (S === null || (x || (x = !!S.gap || !!v && d.len === 0), v && !x || x && h.nextStart && h.nextStart < S.end))
        return;
    }
    this.loadFragment(E, r, y);
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
    this.resetTransmuxer(), this.levels = t.map((i) => new Xe(i));
  }
  onAudioTrackSwitching(e, t) {
    const i = !!t.url;
    this.trackId = t.id;
    const {
      fragCurrent: s
    } = this;
    s && (s.abortRequests(), this.removeUnbufferedFrags(s.start)), this.resetLoadingState(), i ? this.setInterval(Rs) : this.resetTransmuxer(), i ? (this.switchingTrack = t, this.state = k.IDLE, this.flushAudioIfNeeded(t)) : (this.switchingTrack = null, this.bufferedTrack = t, this.state = k.STOPPED), this.tick();
  }
  onManifestLoading() {
    this.fragmentTracker.removeAllFragments(), this.startPosition = this.lastCurrentTime = 0, this.bufferFlushed = this.flushing = !1, this.levels = this.mainDetails = this.waitingData = this.bufferedTrack = this.cachedTrackLoadedData = this.switchingTrack = null, this.startFragRequested = !1, this.trackId = this.videoTrackCC = this.waitingVideoCC = -1;
  }
  onLevelLoaded(e, t) {
    this.mainDetails = t.details, this.cachedTrackLoadedData !== null && (this.hls.trigger(p.AUDIO_TRACK_LOADED, this.cachedTrackLoadedData), this.cachedTrackLoadedData = null);
  }
  onAudioTrackLoaded(e, t) {
    var i;
    if (this.mainDetails == null) {
      this.cachedTrackLoadedData = t;
      return;
    }
    const {
      levels: s
    } = this, {
      details: n,
      id: r
    } = t;
    if (!s) {
      this.warn(`Audio tracks were reset while loading level ${r}`);
      return;
    }
    this.log(`Audio track ${r} loaded [${n.startSN},${n.endSN}]${n.lastPartSn ? `[part-${n.lastPartSn}-${n.lastPartIndex}]` : ""},duration:${n.totalduration}`);
    const o = s[r];
    let l = 0;
    if (n.live || (i = o.details) != null && i.live) {
      this.checkLiveUpdate(n);
      const c = this.mainDetails;
      if (n.deltaUpdateFailed || !c)
        return;
      if (!o.details && n.hasProgramDateTime && c.hasProgramDateTime)
        _t(n, c), l = n.fragments[0].start;
      else {
        var h;
        l = this.alignPlaylists(n, o.details, (h = this.levelLastLoaded) == null ? void 0 : h.details);
      }
    }
    o.details = n, this.levelLastLoaded = o, !this.startFragRequested && (this.mainDetails || !n.live) && this.setStartPosition(this.mainDetails || n, l), this.state === k.WAITING_TRACK && !this.waitForCdnTuneIn(n) && (this.state = k.IDLE), this.tick();
  }
  _handleFragmentLoadProgress(e) {
    var t;
    const {
      frag: i,
      part: s,
      payload: n
    } = e, {
      config: r,
      trackId: o,
      levels: l
    } = this;
    if (!l) {
      this.warn(`Audio tracks were reset while fragment load was in progress. Fragment ${i.sn} of level ${i.level} will not be buffered`);
      return;
    }
    const h = l[o];
    if (!h) {
      this.warn("Audio track is undefined on fragment load progress");
      return;
    }
    const c = h.details;
    if (!c) {
      this.warn("Audio track details undefined on fragment load progress"), this.removeUnbufferedFrags(i.start);
      return;
    }
    const u = r.defaultAudioCodec || h.audioCodec || "mp4a.40.2";
    let d = this.transmuxer;
    d || (d = this.transmuxer = new kn(this.hls, G.AUDIO, this._handleTransmuxComplete.bind(this), this._handleTransmuxerFlush.bind(this)));
    const f = this.initPTS[i.cc], g = (t = i.initSegment) == null ? void 0 : t.data;
    if (f !== void 0) {
      const T = s ? s.index : -1, y = T !== -1, E = new Ii(i.level, i.sn, i.stats.chunkCount, n.byteLength, T, y);
      d.push(n, g, u, "", i, s, c.totalduration, !1, E, f);
    } else {
      this.log(`Unknown video PTS for cc ${i.cc}, waiting for video PTS before demuxing audio frag ${i.sn} of [${c.startSN} ,${c.endSN}],track ${o}`);
      const {
        cache: m
      } = this.waitingData = this.waitingData || {
        frag: i,
        part: s,
        cache: new mn(),
        complete: !1
      };
      m.push(new Uint8Array(n)), this.waitingVideoCC = this.videoTrackCC, this.state = k.WAITING_INIT_PTS;
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
    const i = t.tracks.audio;
    i && (this.mediaBuffer = i.buffer || null), t.tracks.video && (this.videoBuffer = t.tracks.video.buffer || null);
  }
  onFragBuffered(e, t) {
    const {
      frag: i,
      part: s
    } = t;
    if (i.type !== G.AUDIO) {
      if (!this.loadedmetadata && i.type === G.MAIN) {
        const n = this.videoBuffer || this.media;
        n && Z.getBuffered(n).length && (this.loadedmetadata = !0);
      }
      return;
    }
    if (this.fragContextChanged(i)) {
      this.warn(`Fragment ${i.sn}${s ? " p: " + s.index : ""} of level ${i.level} finished buffering, but was aborted. state: ${this.state}, audioSwitch: ${this.switchingTrack ? this.switchingTrack.name : "false"}`);
      return;
    }
    if (i.sn !== "initSegment") {
      this.fragPrevious = i;
      const n = this.switchingTrack;
      n && (this.bufferedTrack = n, this.switchingTrack = null, this.hls.trigger(p.AUDIO_TRACK_SWITCHED, le({}, n)));
    }
    this.fragBufferedComplete(i, s);
  }
  onError(e, t) {
    var i;
    if (t.fatal) {
      this.state = k.ERROR;
      return;
    }
    switch (t.details) {
      case b.FRAG_GAP:
      case b.FRAG_PARSING_ERROR:
      case b.FRAG_DECRYPT_ERROR:
      case b.FRAG_LOAD_ERROR:
      case b.FRAG_LOAD_TIMEOUT:
      case b.KEY_LOAD_ERROR:
      case b.KEY_LOAD_TIMEOUT:
        this.onFragmentOrKeyLoadError(G.AUDIO, t);
        break;
      case b.AUDIO_TRACK_LOAD_ERROR:
      case b.AUDIO_TRACK_LOAD_TIMEOUT:
      case b.LEVEL_PARSING_ERROR:
        !t.levelRetry && this.state === k.WAITING_TRACK && ((i = t.context) == null ? void 0 : i.type) === Y.AUDIO_TRACK && (this.state = k.IDLE);
        break;
      case b.BUFFER_APPEND_ERROR:
      case b.BUFFER_FULL_ERROR:
        if (!t.parent || t.parent !== "audio")
          return;
        if (t.details === b.BUFFER_APPEND_ERROR) {
          this.resetLoadingState();
          return;
        }
        this.reduceLengthAndFlushBuffer(t) && (this.bufferedTrack = null, super.flushMainBuffer(0, Number.POSITIVE_INFINITY, "audio"));
        break;
      case b.INTERNAL_EXCEPTION:
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
      this.flushing = !1, this.bufferFlushed = !0, this.state === k.ENDED && (this.state = k.IDLE);
      const i = this.mediaBuffer || this.media;
      i && (this.afterBufferFlushed(i, t, G.AUDIO), this.tick());
    }
  }
  _handleTransmuxComplete(e) {
    var t;
    const i = "audio", {
      hls: s
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
      part: h,
      level: c
    } = o, {
      details: u
    } = c, {
      audio: d,
      text: f,
      id3: g,
      initSegment: m
    } = n;
    if (this.fragContextChanged(l) || !u) {
      this.fragmentTracker.removeFragment(l);
      return;
    }
    if (this.state = k.PARSING, this.switchingTrack && d && this.completeAudioSwitch(this.switchingTrack), m != null && m.tracks) {
      const T = l.initSegment || l;
      this._bufferInitSegment(c, m.tracks, T, r), s.trigger(p.FRAG_PARSING_INIT_SEGMENT, {
        frag: T,
        id: i,
        tracks: m.tracks
      });
    }
    if (d) {
      const {
        startPTS: T,
        endPTS: y,
        startDTS: E,
        endDTS: x
      } = d;
      h && (h.elementaryStreams[X.AUDIO] = {
        startPTS: T,
        endPTS: y,
        startDTS: E,
        endDTS: x
      }), l.setElementaryStreamInfo(X.AUDIO, T, y, E, x), this.bufferFragmentData(d, l, h, r);
    }
    if (g != null && (t = g.samples) != null && t.length) {
      const T = se({
        id: i,
        frag: l,
        details: u
      }, g);
      s.trigger(p.FRAG_PARSING_METADATA, T);
    }
    if (f) {
      const T = se({
        id: i,
        frag: l,
        details: u
      }, f);
      s.trigger(p.FRAG_PARSING_USERDATA, T);
    }
  }
  _bufferInitSegment(e, t, i, s) {
    if (this.state !== k.PARSING)
      return;
    t.video && delete t.video;
    const n = t.audio;
    if (!n)
      return;
    n.id = "audio";
    const r = e.audioCodec;
    this.log(`Init audio buffer, container:${n.container}, codecs[level/parsed]=[${r}/${n.codec}]`), r && r.split(",").length === 1 && (n.levelCodec = r), this.hls.trigger(p.BUFFER_CODECS, t);
    const o = n.initSegment;
    if (o != null && o.byteLength) {
      const l = {
        type: "audio",
        frag: i,
        part: null,
        chunkMeta: s,
        parent: i.type,
        data: o
      };
      this.hls.trigger(p.BUFFER_APPENDING, l);
    }
    this.tickImmediate();
  }
  loadFragment(e, t, i) {
    const s = this.fragmentTracker.getState(e);
    if (this.fragCurrent = e, this.switchingTrack || s === oe.NOT_LOADED || s === oe.PARTIAL) {
      var n;
      if (e.sn === "initSegment")
        this._loadInitSegment(e, t);
      else if ((n = t.details) != null && n.live && !this.initPTS[e.cc]) {
        this.log(`Waiting for video PTS in continuity counter ${e.cc} of live stream before loading audio fragment ${e.sn} of level ${this.trackId}`), this.state = k.WAITING_INIT_PTS;
        const r = this.mainDetails;
        r && r.fragments[0].start !== t.details.fragments[0].start && _t(t.details, r);
      } else
        this.startFragRequested = !0, super.loadFragment(e, t, i);
    } else
      this.clearTrackerIfNeeded(e);
  }
  flushAudioIfNeeded(e) {
    const {
      media: t,
      bufferedTrack: i
    } = this, s = i == null ? void 0 : i.attrs, n = e.attrs;
    t && s && (s.CHANNELS !== n.CHANNELS || i.name !== e.name || i.lang !== e.lang) && (this.log("Switching audio track : flushing all audio"), super.flushMainBuffer(0, Number.POSITIVE_INFINITY, "audio"), this.bufferedTrack = null);
  }
  completeAudioSwitch(e) {
    const {
      hls: t
    } = this;
    this.flushAudioIfNeeded(e), this.bufferedTrack = e, this.switchingTrack = null, t.trigger(p.AUDIO_TRACK_SWITCHED, le({}, e));
  }
}
class Mo extends bi {
  constructor(e) {
    super(e, "[audio-track-controller]"), this.tracks = [], this.groupIds = null, this.tracksInGroup = [], this.trackId = -1, this.currentTrack = null, this.selectDefaultTrack = !0, this.registerListeners();
  }
  registerListeners() {
    const {
      hls: e
    } = this;
    e.on(p.MANIFEST_LOADING, this.onManifestLoading, this), e.on(p.MANIFEST_PARSED, this.onManifestParsed, this), e.on(p.LEVEL_LOADING, this.onLevelLoading, this), e.on(p.LEVEL_SWITCHING, this.onLevelSwitching, this), e.on(p.AUDIO_TRACK_LOADED, this.onAudioTrackLoaded, this), e.on(p.ERROR, this.onError, this);
  }
  unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(p.MANIFEST_LOADING, this.onManifestLoading, this), e.off(p.MANIFEST_PARSED, this.onManifestParsed, this), e.off(p.LEVEL_LOADING, this.onLevelLoading, this), e.off(p.LEVEL_SWITCHING, this.onLevelSwitching, this), e.off(p.AUDIO_TRACK_LOADED, this.onAudioTrackLoaded, this), e.off(p.ERROR, this.onError, this);
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
      id: i,
      groupId: s,
      details: n
    } = t, r = this.tracksInGroup[i];
    if (!r || r.groupId !== s) {
      this.warn(`Audio track with id:${i} and group:${s} not found in active group ${r == null ? void 0 : r.groupId}`);
      return;
    }
    const o = r.details;
    r.details = t.details, this.log(`Audio track ${i} "${r.name}" lang:${r.lang} group:${s} loaded [${n.startSN}-${n.endSN}]`), i === this.trackId && this.playlistLoaded(i, t, o);
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
    const i = t.audioGroups || null, s = this.groupIds;
    let n = this.currentTrack;
    if (!i || (s == null ? void 0 : s.length) !== (i == null ? void 0 : i.length) || i != null && i.some((o) => (s == null ? void 0 : s.indexOf(o)) === -1)) {
      this.groupIds = i, this.trackId = -1, this.currentTrack = null;
      const o = this.tracks.filter((d) => !i || i.indexOf(d.groupId) !== -1);
      if (o.length)
        this.selectDefaultTrack && !o.some((d) => d.default) && (this.selectDefaultTrack = !1), o.forEach((d, f) => {
          d.id = f;
        });
      else if (!n && !this.tracksInGroup.length)
        return;
      this.tracksInGroup = o;
      const l = this.hls.config.audioPreference;
      if (!n && l) {
        const d = Re(l, o, Ke);
        if (d > -1)
          n = o[d];
        else {
          const f = Re(l, this.tracks);
          n = this.tracks[f];
        }
      }
      let h = this.findTrackId(n);
      h === -1 && n && (h = this.findTrackId(null));
      const c = {
        audioTracks: o
      };
      this.log(`Updating audio tracks, ${o.length} track(s) found in group(s): ${i == null ? void 0 : i.join(",")}`), this.hls.trigger(p.AUDIO_TRACKS_UPDATED, c);
      const u = this.trackId;
      if (h !== -1 && u === -1)
        this.setAudioTrack(h);
      else if (o.length && u === -1) {
        var r;
        const d = new Error(`No audio track selected for current audio group-ID(s): ${(r = this.groupIds) == null ? void 0 : r.join(",")} track count: ${o.length}`);
        this.warn(d.message), this.hls.trigger(p.ERROR, {
          type: V.MEDIA_ERROR,
          details: b.AUDIO_TRACK_LOAD_ERROR,
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
      const i = this.allAudioTracks;
      if (this.selectDefaultTrack = !1, i.length) {
        const s = this.currentTrack;
        if (s && qe(e, s, Ke))
          return s;
        const n = Re(e, this.tracksInGroup, Ke);
        if (n > -1) {
          const r = this.tracksInGroup[n];
          return this.setAudioTrack(n), r;
        } else if (s) {
          let r = t.loadLevel;
          r === -1 && (r = t.firstAutoLevel);
          const o = Oa(e, t.levels, i, r, Ke);
          if (o === -1)
            return null;
          t.nextLoadLevel = o;
        }
        if (e.channels || e.audioCodec) {
          const r = Re(e, i);
          if (r > -1)
            return i[r];
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
    const i = this.currentTrack, s = t[e], n = s.details && !s.details.live;
    if (e === this.trackId && s === i && n || (this.log(`Switching to audio-track ${e} "${s.name}" lang:${s.lang} group:${s.groupId} channels:${s.channels}`), this.trackId = e, this.currentTrack = s, this.hls.trigger(p.AUDIO_TRACK_SWITCHING, le({}, s)), n))
      return;
    const r = this.switchParams(s.url, i == null ? void 0 : i.details, s.details);
    this.loadPlaylist(r);
  }
  findTrackId(e) {
    const t = this.tracksInGroup;
    for (let i = 0; i < t.length; i++) {
      const s = t[i];
      if (!(this.selectDefaultTrack && !s.default) && (!e || qe(e, s, Ke)))
        return i;
    }
    if (e) {
      const {
        name: i,
        lang: s,
        assocLang: n,
        characteristics: r,
        audioCodec: o,
        channels: l
      } = e;
      for (let h = 0; h < t.length; h++) {
        const c = t[h];
        if (qe({
          name: i,
          lang: s,
          assocLang: n,
          characteristics: r,
          audioCodec: o,
          channels: l
        }, c, Ke))
          return h;
      }
      for (let h = 0; h < t.length; h++) {
        const c = t[h];
        if (Qe(e.attrs, c.attrs, ["LANGUAGE", "ASSOC-LANGUAGE", "CHARACTERISTICS"]))
          return h;
      }
      for (let h = 0; h < t.length; h++) {
        const c = t[h];
        if (Qe(e.attrs, c.attrs, ["LANGUAGE"]))
          return h;
      }
    }
    return -1;
  }
  loadPlaylist(e) {
    const t = this.currentTrack;
    if (this.shouldLoadPlaylist(t) && t) {
      super.loadPlaylist();
      const i = t.id, s = t.groupId;
      let n = t.url;
      if (e)
        try {
          n = e.addDirectives(n);
        } catch (r) {
          this.warn(`Could not construct new URL with HLS Delivery Directives: ${r}`);
        }
      this.log(`loading audio-track playlist ${i} "${t.name}" lang:${t.lang} group:${s}`), this.clearTimer(), this.hls.trigger(p.AUDIO_TRACK_LOADING, {
        url: n,
        id: i,
        groupId: s,
        deliveryDirectives: e || null
      });
    }
  }
}
const bs = 500;
class No extends Di {
  constructor(e, t, i) {
    super(e, t, i, "[subtitle-stream-controller]", G.SUBTITLE), this.currentTrackId = -1, this.tracksBuffered = [], this.mainDetails = null, this._registerListeners();
  }
  onHandlerDestroying() {
    this._unregisterListeners(), super.onHandlerDestroying(), this.mainDetails = null;
  }
  _registerListeners() {
    const {
      hls: e
    } = this;
    e.on(p.MEDIA_ATTACHED, this.onMediaAttached, this), e.on(p.MEDIA_DETACHING, this.onMediaDetaching, this), e.on(p.MANIFEST_LOADING, this.onManifestLoading, this), e.on(p.LEVEL_LOADED, this.onLevelLoaded, this), e.on(p.ERROR, this.onError, this), e.on(p.SUBTITLE_TRACKS_UPDATED, this.onSubtitleTracksUpdated, this), e.on(p.SUBTITLE_TRACK_SWITCH, this.onSubtitleTrackSwitch, this), e.on(p.SUBTITLE_TRACK_LOADED, this.onSubtitleTrackLoaded, this), e.on(p.SUBTITLE_FRAG_PROCESSED, this.onSubtitleFragProcessed, this), e.on(p.BUFFER_FLUSHING, this.onBufferFlushing, this), e.on(p.FRAG_BUFFERED, this.onFragBuffered, this);
  }
  _unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(p.MEDIA_ATTACHED, this.onMediaAttached, this), e.off(p.MEDIA_DETACHING, this.onMediaDetaching, this), e.off(p.MANIFEST_LOADING, this.onManifestLoading, this), e.off(p.LEVEL_LOADED, this.onLevelLoaded, this), e.off(p.ERROR, this.onError, this), e.off(p.SUBTITLE_TRACKS_UPDATED, this.onSubtitleTracksUpdated, this), e.off(p.SUBTITLE_TRACK_SWITCH, this.onSubtitleTrackSwitch, this), e.off(p.SUBTITLE_TRACK_LOADED, this.onSubtitleTrackLoaded, this), e.off(p.SUBTITLE_FRAG_PROCESSED, this.onSubtitleFragProcessed, this), e.off(p.BUFFER_FLUSHING, this.onBufferFlushing, this), e.off(p.FRAG_BUFFERED, this.onFragBuffered, this);
  }
  startLoad(e) {
    this.stopLoad(), this.state = k.IDLE, this.setInterval(bs), this.nextLoadPosition = this.startPosition = this.lastCurrentTime = e, this.tick();
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
      frag: i,
      success: s
    } = t;
    if (this.fragPrevious = i, this.state = k.IDLE, !s)
      return;
    const n = this.tracksBuffered[this.currentTrackId];
    if (!n)
      return;
    let r;
    const o = i.start;
    for (let h = 0; h < n.length; h++)
      if (o >= n[h].start && o <= n[h].end) {
        r = n[h];
        break;
      }
    const l = i.start + i.duration;
    r ? r.end = l : (r = {
      start: o,
      end: l
    }, n.push(r)), this.fragmentTracker.fragBuffered(i), this.fragBufferedComplete(i, null);
  }
  onBufferFlushing(e, t) {
    const {
      startOffset: i,
      endOffset: s
    } = t;
    if (i === 0 && s !== Number.POSITIVE_INFINITY) {
      const n = s - 1;
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
      }), this.fragmentTracker.removeFragmentsInRange(i, n, G.SUBTITLE);
    }
  }
  onFragBuffered(e, t) {
    if (!this.loadedmetadata && t.frag.type === G.MAIN) {
      var i;
      (i = this.media) != null && i.buffered.length && (this.loadedmetadata = !0);
    }
  }
  // If something goes wrong, proceed to next frag, if we were processing one.
  onError(e, t) {
    const i = t.frag;
    (i == null ? void 0 : i.type) === G.SUBTITLE && (t.details === b.FRAG_GAP && this.fragmentTracker.fragBuffered(i, !0), this.fragCurrent && this.fragCurrent.abortRequests(), this.state !== k.STOPPED && (this.state = k.IDLE));
  }
  // Got all new subtitle levels.
  onSubtitleTracksUpdated(e, {
    subtitleTracks: t
  }) {
    if (this.levels && _n(this.levels, t)) {
      this.levels = t.map((i) => new Xe(i));
      return;
    }
    this.tracksBuffered = [], this.levels = t.map((i) => {
      const s = new Xe(i);
      return this.tracksBuffered[s.id] = [], s;
    }), this.fragmentTracker.removeFragmentsInRange(0, Number.POSITIVE_INFINITY, G.SUBTITLE), this.fragPrevious = null, this.mediaBuffer = null;
  }
  onSubtitleTrackSwitch(e, t) {
    var i;
    if (this.currentTrackId = t.id, !((i = this.levels) != null && i.length) || this.currentTrackId === -1) {
      this.clearInterval();
      return;
    }
    const s = this.levels[this.currentTrackId];
    s != null && s.details ? this.mediaBuffer = this.mediaBufferTimeRanges : this.mediaBuffer = null, s && this.setInterval(bs);
  }
  // Got a new set of subtitle fragments.
  onSubtitleTrackLoaded(e, t) {
    var i;
    const {
      currentTrackId: s,
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
    let h = 0;
    if (r.live || (i = l.details) != null && i.live) {
      const u = this.mainDetails;
      if (r.deltaUpdateFailed || !u)
        return;
      const d = u.fragments[0];
      if (!l.details)
        r.hasProgramDateTime && u.hasProgramDateTime ? (_t(r, u), h = r.fragments[0].start) : d && (h = d.start, ui(r, h));
      else {
        var c;
        h = this.alignPlaylists(r, l.details, (c = this.levelLastLoaded) == null ? void 0 : c.details), h === 0 && d && (h = d.start, ui(r, h));
      }
    }
    l.details = r, this.levelLastLoaded = l, o === s && (!this.startFragRequested && (this.mainDetails || !r.live) && this.setStartPosition(this.mainDetails || r, h), this.tick(), r.live && !this.fragCurrent && this.media && this.state === k.IDLE && (kt(null, r.fragments, this.media.currentTime, 0) || (this.warn("Subtitle playlist not aligned with playback"), l.details = void 0)));
  }
  _handleFragmentLoadComplete(e) {
    const {
      frag: t,
      payload: i
    } = e, s = t.decryptdata, n = this.hls;
    if (!this.fragContextChanged(t) && i && i.byteLength > 0 && s != null && s.key && s.iv && s.method === "AES-128") {
      const r = performance.now();
      this.decrypter.decrypt(new Uint8Array(i), s.key.buffer, s.iv.buffer).catch((o) => {
        throw n.trigger(p.ERROR, {
          type: V.MEDIA_ERROR,
          details: b.FRAG_DECRYPT_ERROR,
          fatal: !1,
          error: o,
          reason: o.message,
          frag: t
        }), o;
      }).then((o) => {
        const l = performance.now();
        n.trigger(p.FRAG_DECRYPTED, {
          frag: t,
          payload: o,
          stats: {
            tstart: r,
            tdecrypt: l
          }
        });
      }).catch((o) => {
        this.warn(`${o.name}: ${o.message}`), this.state = k.IDLE;
      });
    }
  }
  doTick() {
    if (!this.media) {
      this.state = k.IDLE;
      return;
    }
    if (this.state === k.IDLE) {
      const {
        currentTrackId: e,
        levels: t
      } = this, i = t == null ? void 0 : t[e];
      if (!i || !t.length || !i.details)
        return;
      const {
        config: s
      } = this, n = this.getLoadPosition(), r = Z.bufferedInfo(this.tracksBuffered[this.currentTrackId] || [], n, s.maxBufferHole), {
        end: o,
        len: l
      } = r, h = this.getFwdBufferInfo(this.media, G.MAIN), c = i.details, u = this.getMaxBufferLength(h == null ? void 0 : h.len) + c.levelTargetDuration;
      if (l > u)
        return;
      const d = c.fragments, f = d.length, g = c.edge;
      let m = null;
      const T = this.fragPrevious;
      if (o < g) {
        const y = s.maxFragLookUpTolerance, E = o > g - y ? 0 : y;
        m = kt(T, d, Math.max(d[0].start, o), E), !m && T && T.start < d[0].start && (m = d[0]);
      } else
        m = d[f - 1];
      if (!m)
        return;
      if (m = this.mapToInitFragWhenRequired(m), m.sn !== "initSegment") {
        const y = m.sn - c.startSN, E = d[y - 1];
        E && E.cc === m.cc && this.fragmentTracker.getState(E) === oe.NOT_LOADED && (m = E);
      }
      this.fragmentTracker.getState(m) === oe.NOT_LOADED && this.loadFragment(m, i, o);
    }
  }
  getMaxBufferLength(e) {
    const t = super.getMaxBufferLength();
    return e ? Math.max(t, e) : t;
  }
  loadFragment(e, t, i) {
    this.fragCurrent = e, e.sn === "initSegment" ? this._loadInitSegment(e, t) : (this.startFragRequested = !0, super.loadFragment(e, t, i));
  }
  get mediaBufferTimeRanges() {
    return new Uo(this.tracksBuffered[this.currentTrackId] || []);
  }
}
class Uo {
  constructor(e) {
    this.buffered = void 0;
    const t = (i, s, n) => {
      if (s = s >>> 0, s > n - 1)
        throw new DOMException(`Failed to execute '${i}' on 'TimeRanges': The index provided (${s}) is greater than the maximum bound (${n})`);
      return e[s][i];
    };
    this.buffered = {
      get length() {
        return e.length;
      },
      end(i) {
        return t("end", i, e.length);
      },
      start(i) {
        return t("start", i, e.length);
      }
    };
  }
}
class Bo extends bi {
  constructor(e) {
    super(e, "[subtitle-track-controller]"), this.media = null, this.tracks = [], this.groupIds = null, this.tracksInGroup = [], this.trackId = -1, this.currentTrack = null, this.selectDefaultTrack = !0, this.queuedDefaultTrack = -1, this.asyncPollTrackChange = () => this.pollTrackChange(0), this.useTextTrackPolling = !1, this.subtitlePollingInterval = -1, this._subtitleDisplay = !0, this.onTextTracksChanged = () => {
      if (this.useTextTrackPolling || self.clearInterval(this.subtitlePollingInterval), !this.media || !this.hls.config.renderTextTracksNatively)
        return;
      let t = null;
      const i = pt(this.media.textTracks);
      for (let n = 0; n < i.length; n++)
        if (i[n].mode === "hidden")
          t = i[n];
        else if (i[n].mode === "showing") {
          t = i[n];
          break;
        }
      const s = this.findTrackForTextTrack(t);
      this.subtitleTrack !== s && this.setSubtitleTrack(s);
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
    e.on(p.MEDIA_ATTACHED, this.onMediaAttached, this), e.on(p.MEDIA_DETACHING, this.onMediaDetaching, this), e.on(p.MANIFEST_LOADING, this.onManifestLoading, this), e.on(p.MANIFEST_PARSED, this.onManifestParsed, this), e.on(p.LEVEL_LOADING, this.onLevelLoading, this), e.on(p.LEVEL_SWITCHING, this.onLevelSwitching, this), e.on(p.SUBTITLE_TRACK_LOADED, this.onSubtitleTrackLoaded, this), e.on(p.ERROR, this.onError, this);
  }
  unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(p.MEDIA_ATTACHED, this.onMediaAttached, this), e.off(p.MEDIA_DETACHING, this.onMediaDetaching, this), e.off(p.MANIFEST_LOADING, this.onManifestLoading, this), e.off(p.MANIFEST_PARSED, this.onManifestParsed, this), e.off(p.LEVEL_LOADING, this.onLevelLoading, this), e.off(p.LEVEL_SWITCHING, this.onLevelSwitching, this), e.off(p.SUBTITLE_TRACK_LOADED, this.onSubtitleTrackLoaded, this), e.off(p.ERROR, this.onError, this);
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
    self.clearInterval(this.subtitlePollingInterval), this.useTextTrackPolling || this.media.textTracks.removeEventListener("change", this.asyncPollTrackChange), this.trackId > -1 && (this.queuedDefaultTrack = this.trackId), pt(this.media.textTracks).forEach((t) => {
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
      id: i,
      groupId: s,
      details: n
    } = t, r = this.tracksInGroup[i];
    if (!r || r.groupId !== s) {
      this.warn(`Subtitle track with id:${i} and group:${s} not found in active group ${r == null ? void 0 : r.groupId}`);
      return;
    }
    const o = r.details;
    r.details = t.details, this.log(`Subtitle track ${i} "${r.name}" lang:${r.lang} group:${s} loaded [${n.startSN}-${n.endSN}]`), i === this.trackId && this.playlistLoaded(i, t, o);
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
    const i = t.subtitleGroups || null, s = this.groupIds;
    let n = this.currentTrack;
    if (!i || (s == null ? void 0 : s.length) !== (i == null ? void 0 : i.length) || i != null && i.some((r) => (s == null ? void 0 : s.indexOf(r)) === -1)) {
      this.groupIds = i, this.trackId = -1, this.currentTrack = null;
      const r = this.tracks.filter((c) => !i || i.indexOf(c.groupId) !== -1);
      if (r.length)
        this.selectDefaultTrack && !r.some((c) => c.default) && (this.selectDefaultTrack = !1), r.forEach((c, u) => {
          c.id = u;
        });
      else if (!n && !this.tracksInGroup.length)
        return;
      this.tracksInGroup = r;
      const o = this.hls.config.subtitlePreference;
      if (!n && o) {
        this.selectDefaultTrack = !1;
        const c = Re(o, r);
        if (c > -1)
          n = r[c];
        else {
          const u = Re(o, this.tracks);
          n = this.tracks[u];
        }
      }
      let l = this.findTrackId(n);
      l === -1 && n && (l = this.findTrackId(null));
      const h = {
        subtitleTracks: r
      };
      this.log(`Updating subtitle tracks, ${r.length} track(s) found in "${i == null ? void 0 : i.join(",")}" group-id`), this.hls.trigger(p.SUBTITLE_TRACKS_UPDATED, h), l !== -1 && this.trackId === -1 && this.setSubtitleTrack(l);
    } else
      this.shouldReloadPlaylist(n) && this.setSubtitleTrack(this.trackId);
  }
  findTrackId(e) {
    const t = this.tracksInGroup, i = this.selectDefaultTrack;
    for (let s = 0; s < t.length; s++) {
      const n = t[s];
      if (!(i && !n.default || !i && !e) && (!e || qe(n, e)))
        return s;
    }
    if (e) {
      for (let s = 0; s < t.length; s++) {
        const n = t[s];
        if (Qe(e.attrs, n.attrs, ["LANGUAGE", "ASSOC-LANGUAGE", "CHARACTERISTICS"]))
          return s;
      }
      for (let s = 0; s < t.length; s++) {
        const n = t[s];
        if (Qe(e.attrs, n.attrs, ["LANGUAGE"]))
          return s;
      }
    }
    return -1;
  }
  findTrackForTextTrack(e) {
    if (e) {
      const t = this.tracksInGroup;
      for (let i = 0; i < t.length; i++) {
        const s = t[i];
        if (gi(s, e))
          return i;
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
        const i = this.currentTrack;
        if (i && qe(e, i))
          return i;
        const s = Re(e, this.tracksInGroup);
        if (s > -1) {
          const n = this.tracksInGroup[s];
          return this.setSubtitleTrack(s), n;
        } else {
          if (i)
            return null;
          {
            const n = Re(e, t);
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
      const i = t.id, s = t.groupId;
      let n = t.url;
      if (e)
        try {
          n = e.addDirectives(n);
        } catch (r) {
          this.warn(`Could not construct new URL with HLS Delivery Directives: ${r}`);
        }
      this.log(`Loading subtitle playlist for id ${i}`), this.hls.trigger(p.SUBTITLE_TRACK_LOADING, {
        url: n,
        id: i,
        groupId: s,
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
    const t = pt(e.textTracks), i = this.currentTrack;
    let s;
    if (i && (s = t.filter((n) => gi(i, n))[0], s || this.warn(`Unable to find subtitle TextTrack with name "${i.name}" and language "${i.lang}"`)), [].slice.call(t).forEach((n) => {
      n.mode !== "disabled" && n !== s && (n.mode = "disabled");
    }), s) {
      const n = this.subtitleDisplay ? "showing" : "hidden";
      s.mode !== n && (s.mode = n);
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
    if (e < -1 || e >= t.length || !M(e)) {
      this.warn(`Invalid subtitle track id: ${e}`);
      return;
    }
    this.clearTimer(), this.selectDefaultTrack = !1;
    const i = this.currentTrack, s = t[e] || null;
    if (this.trackId = e, this.currentTrack = s, this.toggleTrackModes(), !s) {
      this.hls.trigger(p.SUBTITLE_TRACK_SWITCH, {
        id: e
      });
      return;
    }
    const n = !!s.details && !s.details.live;
    if (e === this.trackId && s === i && n)
      return;
    this.log(`Switching to subtitle-track ${e}` + (s ? ` "${s.name}" lang:${s.lang} group:${s.groupId}` : ""));
    const {
      id: r,
      groupId: o = "",
      name: l,
      type: h,
      url: c
    } = s;
    this.hls.trigger(p.SUBTITLE_TRACK_SWITCH, {
      id: r,
      groupId: o,
      name: l,
      type: h,
      url: c
    });
    const u = this.switchParams(s.url, i == null ? void 0 : i.details, s.details);
    this.loadPlaylist(u);
  }
}
class $o {
  constructor(e) {
    this.buffers = void 0, this.queues = {
      video: [],
      audio: [],
      audiovideo: []
    }, this.buffers = e;
  }
  append(e, t, i) {
    const s = this.queues[t];
    s.push(e), s.length === 1 && !i && this.executeNext(t);
  }
  insertAbort(e, t) {
    this.queues[t].unshift(e), this.executeNext(t);
  }
  appendBlocker(e) {
    let t;
    const i = new Promise((n) => {
      t = n;
    }), s = {
      execute: t,
      onStart: () => {
      },
      onComplete: () => {
      },
      onError: () => {
      }
    };
    return this.append(s, e), i;
  }
  executeNext(e) {
    const t = this.queues[e];
    if (t.length) {
      const i = t[0];
      try {
        i.execute();
      } catch (s) {
        A.warn(`[buffer-operation-queue]: Exception executing "${e}" SourceBuffer operation: ${s}`), i.onError(s);
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
const Is = /(avc[1234]|hvc1|hev1|dvh[1e]|vp09|av01)(?:\.[^.,]+)+/;
class Go {
  constructor(e) {
    this.details = null, this._objectUrl = null, this.operationQueue = void 0, this.listeners = void 0, this.hls = void 0, this.bufferCodecEventsExpected = 0, this._bufferCodecEventsTotal = 0, this.media = null, this.mediaSource = null, this.lastMpegAudioChunk = null, this.appendSource = void 0, this.appendErrors = {
      audio: 0,
      video: 0,
      audiovideo: 0
    }, this.tracks = {}, this.pendingTracks = {}, this.sourceBuffer = void 0, this.log = void 0, this.warn = void 0, this.error = void 0, this._onEndStreaming = (i) => {
      this.hls && this.hls.pauseBuffering();
    }, this._onStartStreaming = (i) => {
      this.hls && this.hls.resumeBuffering();
    }, this._onMediaSourceOpen = () => {
      const {
        media: i,
        mediaSource: s
      } = this;
      this.log("Media source opened"), i && (i.removeEventListener("emptied", this._onMediaEmptied), this.updateMediaElementDuration(), this.hls.trigger(p.MEDIA_ATTACHED, {
        media: i,
        mediaSource: s
      })), s && s.removeEventListener("sourceopen", this._onMediaSourceOpen), this.checkPendingTracks();
    }, this._onMediaSourceClose = () => {
      this.log("Media source closed");
    }, this._onMediaSourceEnded = () => {
      this.log("Media source ended");
    }, this._onMediaEmptied = () => {
      const {
        mediaSrc: i,
        _objectUrl: s
      } = this;
      i !== s && A.error(`Media element src was set while attaching MediaSource (${s} > ${i})`);
    }, this.hls = e;
    const t = "[buffer-controller]";
    this.appendSource = zr(Be(e.config.preferManagedMediaSource)), this.log = A.log.bind(A, t), this.warn = A.warn.bind(A, t), this.error = A.error.bind(A, t), this._initSourceBuffer(), this.registerListeners();
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
    e.on(p.MEDIA_ATTACHING, this.onMediaAttaching, this), e.on(p.MEDIA_DETACHING, this.onMediaDetaching, this), e.on(p.MANIFEST_LOADING, this.onManifestLoading, this), e.on(p.MANIFEST_PARSED, this.onManifestParsed, this), e.on(p.BUFFER_RESET, this.onBufferReset, this), e.on(p.BUFFER_APPENDING, this.onBufferAppending, this), e.on(p.BUFFER_CODECS, this.onBufferCodecs, this), e.on(p.BUFFER_EOS, this.onBufferEos, this), e.on(p.BUFFER_FLUSHING, this.onBufferFlushing, this), e.on(p.LEVEL_UPDATED, this.onLevelUpdated, this), e.on(p.FRAG_PARSED, this.onFragParsed, this), e.on(p.FRAG_CHANGED, this.onFragChanged, this);
  }
  unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(p.MEDIA_ATTACHING, this.onMediaAttaching, this), e.off(p.MEDIA_DETACHING, this.onMediaDetaching, this), e.off(p.MANIFEST_LOADING, this.onManifestLoading, this), e.off(p.MANIFEST_PARSED, this.onManifestParsed, this), e.off(p.BUFFER_RESET, this.onBufferReset, this), e.off(p.BUFFER_APPENDING, this.onBufferAppending, this), e.off(p.BUFFER_CODECS, this.onBufferCodecs, this), e.off(p.BUFFER_EOS, this.onBufferEos, this), e.off(p.BUFFER_FLUSHING, this.onBufferFlushing, this), e.off(p.LEVEL_UPDATED, this.onLevelUpdated, this), e.off(p.FRAG_PARSED, this.onFragParsed, this), e.off(p.FRAG_CHANGED, this.onFragChanged, this);
  }
  _initSourceBuffer() {
    this.sourceBuffer = {}, this.operationQueue = new $o(this.sourceBuffer), this.listeners = {
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
    let i = 2;
    (t.audio && !t.video || !t.altAudio) && (i = 1), this.bufferCodecEventsExpected = this._bufferCodecEventsTotal = i, this.log(`${this.bufferCodecEventsExpected} bufferCodec event(s) expected`);
  }
  onMediaAttaching(e, t) {
    const i = this.media = t.media, s = Be(this.appendSource);
    if (i && s) {
      var n;
      const r = this.mediaSource = new s();
      this.log(`created media source: ${(n = r.constructor) == null ? void 0 : n.name}`), r.addEventListener("sourceopen", this._onMediaSourceOpen), r.addEventListener("sourceended", this._onMediaSourceEnded), r.addEventListener("sourceclose", this._onMediaSourceClose), this.appendSource && (r.addEventListener("startstreaming", this._onStartStreaming), r.addEventListener("endstreaming", this._onEndStreaming));
      const o = this._objectUrl = self.URL.createObjectURL(r);
      if (this.appendSource)
        try {
          i.removeAttribute("src");
          const l = self.ManagedMediaSource;
          i.disableRemotePlayback = i.disableRemotePlayback || l && r instanceof l, Cs(i), Ko(i, o), i.load();
        } catch {
          i.src = o;
        }
      else
        i.src = o;
      i.addEventListener("emptied", this._onMediaEmptied);
    }
  }
  onMediaDetaching() {
    const {
      media: e,
      mediaSource: t,
      _objectUrl: i
    } = this;
    if (t) {
      if (this.log("media source detaching"), t.readyState === "open")
        try {
          t.endOfStream();
        } catch (s) {
          this.warn(`onMediaDetaching: ${s.message} while calling endOfStream`);
        }
      this.onBufferReset(), t.removeEventListener("sourceopen", this._onMediaSourceOpen), t.removeEventListener("sourceended", this._onMediaSourceEnded), t.removeEventListener("sourceclose", this._onMediaSourceClose), this.appendSource && (t.removeEventListener("startstreaming", this._onStartStreaming), t.removeEventListener("endstreaming", this._onEndStreaming)), e && (e.removeEventListener("emptied", this._onMediaEmptied), i && self.URL.revokeObjectURL(i), this.mediaSrc === i ? (e.removeAttribute("src"), this.appendSource && Cs(e), e.load()) : this.warn("media|source.src was changed by a third party - skip cleanup")), this.mediaSource = null, this.media = null, this._objectUrl = null, this.bufferCodecEventsExpected = this._bufferCodecEventsTotal, this.pendingTracks = {}, this.tracks = {};
    }
    this.hls.trigger(p.MEDIA_DETACHED, void 0);
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
        var i;
        this.removeBufferListeners(e), this.sourceBuffer[e] = void 0, (i = this.mediaSource) != null && i.sourceBuffers.length && this.mediaSource.removeSourceBuffer(t);
      }
    } catch (s) {
      this.warn(`onBufferReset ${e}`, s);
    }
  }
  onBufferCodecs(e, t) {
    const i = this.getSourceBufferTypes().length, s = Object.keys(t);
    if (s.forEach((r) => {
      if (i) {
        const l = this.tracks[r];
        if (l && typeof l.buffer.changeType == "function") {
          var o;
          const {
            id: h,
            codec: c,
            levelCodec: u,
            container: d,
            metadata: f
          } = t[r], g = zi(l.codec, l.levelCodec), m = g == null ? void 0 : g.replace(Is, "$1");
          let T = zi(c, u);
          const y = (o = T) == null ? void 0 : o.replace(Is, "$1");
          if (T && m !== y) {
            r.slice(0, 5) === "audio" && (T = It(T, this.appendSource));
            const E = `${d};codecs=${T}`;
            this.appendChangeType(r, E), this.log(`switching codec ${g} to ${T}`), this.tracks[r] = {
              buffer: l.buffer,
              codec: c,
              container: d,
              levelCodec: u,
              metadata: f,
              id: h
            };
          }
        }
      } else
        this.pendingTracks[r] = t[r];
    }), i)
      return;
    const n = Math.max(this.bufferCodecEventsExpected - 1, 0);
    this.bufferCodecEventsExpected !== n && (this.log(`${n} bufferCodec event(s) expected ${s.join(",")}`), this.bufferCodecEventsExpected = n), this.mediaSource && this.mediaSource.readyState === "open" && this.checkPendingTracks();
  }
  appendChangeType(e, t) {
    const {
      operationQueue: i
    } = this, s = {
      execute: () => {
        const n = this.sourceBuffer[e];
        n && (this.log(`changing ${e} sourceBuffer type to ${t}`), n.changeType(t)), i.shiftAndExecuteNext(e);
      },
      onStart: () => {
      },
      onComplete: () => {
      },
      onError: (n) => {
        this.warn(`Failed to change ${e} SourceBuffer type`, n);
      }
    };
    i.append(s, e, !!this.pendingTracks[e]);
  }
  onBufferAppending(e, t) {
    const {
      hls: i,
      operationQueue: s,
      tracks: n
    } = this, {
      data: r,
      type: o,
      frag: l,
      part: h,
      chunkMeta: c
    } = t, u = c.buffering[o], d = self.performance.now();
    u.start = d;
    const f = l.stats.buffering, g = h ? h.stats.buffering : null;
    f.start === 0 && (f.start = d), g && g.start === 0 && (g.start = d);
    const m = n.audio;
    let T = !1;
    o === "audio" && (m == null ? void 0 : m.container) === "audio/mpeg" && (T = !this.lastMpegAudioChunk || c.id === 1 || this.lastMpegAudioChunk.sn !== c.sn, this.lastMpegAudioChunk = c);
    const y = l.start, E = {
      execute: () => {
        if (u.executeStart = self.performance.now(), T) {
          const x = this.sourceBuffer[o];
          if (x) {
            const v = y - x.timestampOffset;
            Math.abs(v) >= 0.1 && (this.log(`Updating audio SourceBuffer timestampOffset to ${y} (delta: ${v}) sn: ${l.sn})`), x.timestampOffset = y);
          }
        }
        this.appendExecutor(r, o);
      },
      onStart: () => {
      },
      onComplete: () => {
        const x = self.performance.now();
        u.executeEnd = u.end = x, f.first === 0 && (f.first = x), g && g.first === 0 && (g.first = x);
        const {
          sourceBuffer: v
        } = this, S = {};
        for (const C in v)
          S[C] = Z.getBuffered(v[C]);
        this.appendErrors[o] = 0, o === "audio" || o === "video" ? this.appendErrors.audiovideo = 0 : (this.appendErrors.audio = 0, this.appendErrors.video = 0), this.hls.trigger(p.BUFFER_APPENDED, {
          type: o,
          frag: l,
          part: h,
          chunkMeta: c,
          parent: l.type,
          timeRanges: S
        });
      },
      onError: (x) => {
        const v = {
          type: V.MEDIA_ERROR,
          parent: l.type,
          details: b.BUFFER_APPEND_ERROR,
          sourceBufferName: o,
          frag: l,
          part: h,
          chunkMeta: c,
          error: x,
          err: x,
          fatal: !1
        };
        if (x.code === DOMException.QUOTA_EXCEEDED_ERR)
          v.details = b.BUFFER_FULL_ERROR;
        else {
          const S = ++this.appendErrors[o];
          v.details = b.BUFFER_APPEND_ERROR, this.warn(`Failed ${S}/${i.config.appendErrorMaxRetry} times to append segment in "${o}" sourceBuffer`), S >= i.config.appendErrorMaxRetry && (v.fatal = !0);
        }
        i.trigger(p.ERROR, v);
      }
    };
    s.append(E, o, !!this.pendingTracks[o]);
  }
  onBufferFlushing(e, t) {
    const {
      operationQueue: i
    } = this, s = (n) => ({
      execute: this.removeExecutor.bind(this, n, t.startOffset, t.endOffset),
      onStart: () => {
      },
      onComplete: () => {
        this.hls.trigger(p.BUFFER_FLUSHED, {
          type: n
        });
      },
      onError: (r) => {
        this.warn(`Failed to remove from ${n} SourceBuffer`, r);
      }
    });
    t.type ? i.append(s(t.type), t.type) : this.getSourceBufferTypes().forEach((n) => {
      i.append(s(n), n);
    });
  }
  onFragParsed(e, t) {
    const {
      frag: i,
      part: s
    } = t, n = [], r = s ? s.elementaryStreams : i.elementaryStreams;
    r[X.AUDIOVIDEO] ? n.push("audiovideo") : (r[X.AUDIO] && n.push("audio"), r[X.VIDEO] && n.push("video"));
    const o = () => {
      const l = self.performance.now();
      i.stats.buffering.end = l, s && (s.stats.buffering.end = l);
      const h = s ? s.stats : i.stats;
      this.hls.trigger(p.FRAG_BUFFERED, {
        frag: i,
        part: s,
        stats: h,
        id: i.type
      });
    };
    n.length === 0 && this.warn(`Fragments must have at least one ElementaryStreamType set. type: ${i.type} level: ${i.level} sn: ${i.sn}`), this.blockBuffers(o, n);
  }
  onFragChanged(e, t) {
    this.trimBuffers();
  }
  // on BUFFER_EOS mark matching sourcebuffer(s) as ended and trigger checkEos()
  // an undefined data.type will mark all buffers as EOS.
  onBufferEos(e, t) {
    this.getSourceBufferTypes().reduce((s, n) => {
      const r = this.sourceBuffer[n];
      return r && (!t.type || t.type === n) && (r.ending = !0, r.ended || (r.ended = !0, this.log(`${n} sourceBuffer now EOS`))), s && !!(!r || r.ended);
    }, !0) && (this.log("Queueing mediaSource.endOfStream()"), this.blockBuffers(() => {
      this.getSourceBufferTypes().forEach((n) => {
        const r = this.sourceBuffer[n];
        r && (r.ending = !1);
      });
      const {
        mediaSource: s
      } = this;
      if (!s || s.readyState !== "open") {
        s && this.log(`Could not call mediaSource.endOfStream(). mediaSource.readyState: ${s.readyState}`);
        return;
      }
      this.log("Calling mediaSource.endOfStream()"), s.endOfStream();
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
      media: i
    } = this;
    if (!i || t === null || !this.getSourceBufferTypes().length)
      return;
    const n = e.config, r = i.currentTime, o = t.levelTargetDuration, l = t.live && n.liveBackBufferLength !== null ? n.liveBackBufferLength : n.backBufferLength;
    if (M(l) && l > 0) {
      const h = Math.max(l, o), c = Math.floor(r / o) * o - h;
      this.flushBackBuffer(r, o, c);
    }
    if (M(n.frontBufferFlushThreshold) && n.frontBufferFlushThreshold > 0) {
      const h = Math.max(n.maxBufferLength, n.frontBufferFlushThreshold), c = Math.max(h, o), u = Math.floor(r / o) * o + c;
      this.flushFrontBuffer(r, o, u);
    }
  }
  flushBackBuffer(e, t, i) {
    const {
      details: s,
      sourceBuffer: n
    } = this;
    this.getSourceBufferTypes().forEach((o) => {
      const l = n[o];
      if (l) {
        const h = Z.getBuffered(l);
        if (h.length > 0 && i > h.start(0)) {
          if (this.hls.trigger(p.BACK_BUFFER_REACHED, {
            bufferEnd: i
          }), s != null && s.live)
            this.hls.trigger(p.LIVE_BACK_BUFFER_REACHED, {
              bufferEnd: i
            });
          else if (l.ended && h.end(h.length - 1) - e < t * 2) {
            this.log(`Cannot flush ${o} back buffer while SourceBuffer is in ended state`);
            return;
          }
          this.hls.trigger(p.BUFFER_FLUSHING, {
            startOffset: 0,
            endOffset: i,
            type: o
          });
        }
      }
    });
  }
  flushFrontBuffer(e, t, i) {
    const {
      sourceBuffer: s
    } = this;
    this.getSourceBufferTypes().forEach((r) => {
      const o = s[r];
      if (o) {
        const l = Z.getBuffered(o), h = l.length;
        if (h < 2)
          return;
        const c = l.start(h - 1), u = l.end(h - 1);
        if (i > c || e >= c && e <= u)
          return;
        if (o.ended && e - u < 2 * t) {
          this.log(`Cannot flush ${r} front buffer while SourceBuffer is in ended state`);
          return;
        }
        this.hls.trigger(p.BUFFER_FLUSHING, {
          startOffset: c,
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
      media: i,
      mediaSource: s
    } = this, n = e.fragments[0].start + e.totalduration, r = i.duration, o = M(s.duration) ? s.duration : 0;
    e.live && t.config.liveDurationInfinity ? (s.duration = 1 / 0, this.updateSeekableRange(e)) : (n > o && n > r || !M(r)) && (this.log(`Updating Media Source duration to ${n.toFixed(3)}`), s.duration = n);
  }
  updateSeekableRange(e) {
    const t = this.mediaSource, i = e.fragments;
    if (i.length && e.live && t != null && t.setLiveSeekableRange) {
      const n = Math.max(0, i[0].start), r = Math.max(n, n + e.totalduration);
      this.log(`Media Source duration is set to ${t.duration}. Setting seekable range to ${n}-${r}.`), t.setLiveSeekableRange(n, r);
    }
  }
  checkPendingTracks() {
    const {
      bufferCodecEventsExpected: e,
      operationQueue: t,
      pendingTracks: i
    } = this, s = Object.keys(i).length;
    if (s && (!e || s === 2 || "audiovideo" in i)) {
      this.createSourceBuffers(i), this.pendingTracks = {};
      const n = this.getSourceBufferTypes();
      if (n.length)
        this.hls.trigger(p.BUFFER_CREATED, {
          tracks: this.tracks
        }), n.forEach((r) => {
          t.executeNext(r);
        });
      else {
        const r = new Error("could not create source buffer for media codec(s)");
        this.hls.trigger(p.ERROR, {
          type: V.MEDIA_ERROR,
          details: b.BUFFER_INCOMPATIBLE_CODECS_ERROR,
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
      mediaSource: i
    } = this;
    if (!i)
      throw Error("createSourceBuffers called when mediaSource was null");
    for (const n in e)
      if (!t[n]) {
        var s;
        const r = e[n];
        if (!r)
          throw Error(`source buffer exists for track ${n}, however track does not`);
        let o = ((s = r.levelCodec) == null ? void 0 : s.indexOf(",")) === -1 ? r.levelCodec : r.codec;
        o && n.slice(0, 5) === "audio" && (o = It(o, this.appendSource));
        const l = `${r.container};codecs=${o}`;
        this.log(`creating sourceBuffer(${l})`);
        try {
          const h = t[n] = i.addSourceBuffer(l), c = n;
          this.addBufferListener(c, "updatestart", this._onSBUpdateStart), this.addBufferListener(c, "updateend", this._onSBUpdateEnd), this.addBufferListener(c, "error", this._onSBUpdateError), this.appendSource && this.addBufferListener(c, "bufferedchange", (u, d) => {
            const f = d.removedRanges;
            f != null && f.length && this.hls.trigger(p.BUFFER_FLUSHED, {
              type: n
            });
          }), this.tracks[n] = {
            buffer: h,
            codec: o,
            container: r.container,
            levelCodec: r.levelCodec,
            metadata: r.metadata,
            id: r.id
          };
        } catch (h) {
          this.error(`error while trying to add sourceBuffer: ${h.message}`), this.hls.trigger(p.ERROR, {
            type: V.MEDIA_ERROR,
            details: b.BUFFER_ADD_CODEC_ERROR,
            fatal: !1,
            error: h,
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
      operationQueue: i
    } = this;
    i.current(e).onComplete(), i.shiftAndExecuteNext(e);
  }
  _onSBUpdateError(e, t) {
    var i;
    const s = new Error(`${e} SourceBuffer error. MediaSource readyState: ${(i = this.mediaSource) == null ? void 0 : i.readyState}`);
    this.error(`${s}`, t), this.hls.trigger(p.ERROR, {
      type: V.MEDIA_ERROR,
      details: b.BUFFER_APPENDING_ERROR,
      sourceBufferName: e,
      error: s,
      fatal: !1
    });
    const n = this.operationQueue.current(e);
    n && n.onError(s);
  }
  // This method must result in an updateend event; if remove is not called, _onSBUpdateEnd must be called manually
  removeExecutor(e, t, i) {
    const {
      media: s,
      mediaSource: n,
      operationQueue: r,
      sourceBuffer: o
    } = this, l = o[e];
    if (!s || !n || !l) {
      this.warn(`Attempting to remove from the ${e} SourceBuffer, but it does not exist`), r.shiftAndExecuteNext(e);
      return;
    }
    const h = M(s.duration) ? s.duration : 1 / 0, c = M(n.duration) ? n.duration : 1 / 0, u = Math.max(0, t), d = Math.min(i, h, c);
    d > u && (!l.ending || l.ended) ? (l.ended = !1, this.log(`Removing [${u},${d}] from the ${e} SourceBuffer`), l.remove(u, d)) : r.shiftAndExecuteNext(e);
  }
  // This method must result in an updateend event; if append is not called, _onSBUpdateEnd must be called manually
  appendExecutor(e, t) {
    const i = this.sourceBuffer[t];
    if (!i) {
      if (!this.pendingTracks[t])
        throw new Error(`Attempting to append to the ${t} SourceBuffer, but it does not exist`);
      return;
    }
    i.ended = !1, i.appendBuffer(e);
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
      operationQueue: i
    } = this, s = t.map((n) => i.appendBlocker(n));
    Promise.all(s).then(() => {
      e(), t.forEach((n) => {
        const r = this.sourceBuffer[n];
        r != null && r.updating || i.shiftAndExecuteNext(n);
      });
    });
  }
  getSourceBufferTypes() {
    return Object.keys(this.sourceBuffer);
  }
  addBufferListener(e, t, i) {
    const s = this.sourceBuffer[e];
    if (!s)
      return;
    const n = i.bind(this, e);
    this.listeners[e].push({
      event: t,
      listener: n
    }), s.addEventListener(t, n);
  }
  removeBufferListeners(e) {
    const t = this.sourceBuffer[e];
    t && this.listeners[e].forEach((i) => {
      t.removeEventListener(i.event, i.listener);
    });
  }
}
function Cs(a) {
  const e = a.querySelectorAll("source");
  [].slice.call(e).forEach((t) => {
    a.removeChild(t);
  });
}
function Ko(a, e) {
  const t = self.document.createElement("source");
  t.type = "video/mp4", t.src = e, a.appendChild(t);
}
const Vo = {
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
}, Pn = (a) => String.fromCharCode(Vo[a] || a), Ee = 15, De = 100, Ho = {
  17: 1,
  18: 3,
  21: 5,
  22: 7,
  23: 9,
  16: 11,
  19: 12,
  20: 14
}, Wo = {
  17: 2,
  18: 4,
  21: 6,
  22: 8,
  23: 10,
  19: 13,
  20: 15
}, Yo = {
  25: 1,
  26: 3,
  29: 5,
  30: 7,
  31: 9,
  24: 11,
  27: 12,
  28: 14
}, qo = {
  25: 2,
  26: 4,
  29: 6,
  30: 8,
  31: 10,
  27: 13,
  28: 15
}, jo = ["white", "green", "blue", "cyan", "red", "yellow", "magenta", "black", "transparent"];
class zo {
  constructor() {
    this.time = null, this.verboseLevel = 0;
  }
  log(e, t) {
    if (this.verboseLevel >= e) {
      const i = typeof t == "function" ? t() : t;
      A.log(`${this.time} [${e}] ${i}`);
    }
  }
}
const Oe = function(e) {
  const t = [];
  for (let i = 0; i < e.length; i++)
    t.push(e[i].toString(16));
  return t;
};
class Fn {
  constructor() {
    this.foreground = "white", this.underline = !1, this.italics = !1, this.background = "black", this.flash = !1;
  }
  reset() {
    this.foreground = "white", this.underline = !1, this.italics = !1, this.background = "black", this.flash = !1;
  }
  setStyles(e) {
    const t = ["foreground", "underline", "italics", "background", "flash"];
    for (let i = 0; i < t.length; i++) {
      const s = t[i];
      e.hasOwnProperty(s) && (this[s] = e[s]);
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
class Xo {
  constructor() {
    this.uchar = " ", this.penState = new Fn();
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
class Qo {
  constructor(e) {
    this.chars = [], this.pos = 0, this.currPenState = new Fn(), this.cueStartTime = null, this.logger = void 0;
    for (let t = 0; t < De; t++)
      this.chars.push(new Xo());
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
      for (let i = this.pos + 1; i < t + 1; i++)
        this.chars[i].setPenState(this.currPenState);
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
    const t = Pn(e);
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
    for (let i = 0; i < De; i++) {
      const s = this.chars[i].uchar;
      s !== " " && (t = !1), e.push(s);
    }
    return t ? "" : e.join("");
  }
  setPenStyles(e) {
    this.currPenState.setStyles(e), this.chars[this.pos].setPenState(this.currPenState);
  }
}
class Qt {
  constructor(e) {
    this.rows = [], this.currRow = Ee - 1, this.nrRollUpRows = null, this.lastOutputScreen = null, this.logger = void 0;
    for (let t = 0; t < Ee; t++)
      this.rows.push(new Qo(e));
    this.logger = e;
  }
  reset() {
    for (let e = 0; e < Ee; e++)
      this.rows[e].clear();
    this.currRow = Ee - 1;
  }
  equals(e) {
    let t = !0;
    for (let i = 0; i < Ee; i++)
      if (!this.rows[i].equals(e.rows[i])) {
        t = !1;
        break;
      }
    return t;
  }
  copy(e) {
    for (let t = 0; t < Ee; t++)
      this.rows[t].copy(e.rows[t]);
  }
  isEmpty() {
    let e = !0;
    for (let t = 0; t < Ee; t++)
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
      for (let o = 0; o < Ee; o++)
        this.rows[o].clear();
      const n = this.currRow + 1 - this.nrRollUpRows, r = this.lastOutputScreen;
      if (r) {
        const o = r.rows[n].cueStartTime, l = this.logger.time;
        if (o !== null && l !== null && o < l)
          for (let h = 0; h < this.nrRollUpRows; h++)
            this.rows[t - this.nrRollUpRows + h + 1].copy(r.rows[n + h]);
      }
    }
    this.currRow = t;
    const i = this.rows[this.currRow];
    if (e.indent !== null) {
      const n = e.indent, r = Math.max(n - 1, 0);
      i.setCursor(e.indent), e.color = i.chars[r].penState.foreground;
    }
    const s = {
      foreground: e.color,
      underline: e.underline,
      italics: e.italics,
      background: "black",
      flash: !1
    };
    this.setPen(s);
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
    let i = "", s = -1;
    for (let n = 0; n < Ee; n++) {
      const r = this.rows[n].getTextString();
      r && (s = n + 1, e ? t.push("Row " + s + ": '" + r + "'") : t.push(r.trim()));
    }
    return t.length > 0 && (e ? i = "[" + t.join(" | ") + "]" : i = t.join(`
`)), i;
  }
  getTextAndFormat() {
    return this.rows;
  }
}
class Ds {
  constructor(e, t, i) {
    this.chNr = void 0, this.outputFilter = void 0, this.mode = void 0, this.verbose = void 0, this.displayedMemory = void 0, this.nonDisplayedMemory = void 0, this.lastOutputScreen = void 0, this.currRollUpRow = void 0, this.writeScreen = void 0, this.cueStartTime = void 0, this.logger = void 0, this.chNr = e, this.outputFilter = t, this.mode = null, this.verbose = 0, this.displayedMemory = new Qt(i), this.nonDisplayedMemory = new Qt(i), this.lastOutputScreen = new Qt(i), this.currRollUpRow = this.displayedMemory.rows[Ee - 1], this.writeScreen = this.displayedMemory, this.mode = null, this.cueStartTime = null, this.logger = i;
  }
  reset() {
    this.mode = null, this.displayedMemory.reset(), this.nonDisplayedMemory.reset(), this.lastOutputScreen.reset(), this.outputFilter.reset(), this.currRollUpRow = this.displayedMemory.rows[Ee - 1], this.writeScreen = this.displayedMemory, this.mode = null, this.cueStartTime = null;
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
    for (let i = 0; i < e.length; i++)
      this.writeScreen.insertChar(e[i]);
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
      const i = Math.floor(e / 2) - 16, s = ["white", "green", "blue", "cyan", "red", "yellow", "magenta"];
      t.foreground = s[i];
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
class ws {
  constructor(e, t, i) {
    this.channels = void 0, this.currentChannel = 0, this.cmdHistory = Zo(), this.logger = void 0;
    const s = this.logger = new zo();
    this.channels = [null, new Ds(e, t, s), new Ds(e + 1, i, s)];
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
    for (let i = 0; i < t.length; i += 2) {
      const s = t[i] & 127, n = t[i + 1] & 127;
      let r = !1, o = null;
      if (s === 0 && n === 0)
        continue;
      this.logger.log(3, () => "[" + Oe([t[i], t[i + 1]]) + "] -> (" + Oe([s, n]) + ")");
      const l = this.cmdHistory;
      if (s >= 16 && s <= 31) {
        if (Jo(s, n, l)) {
          ut(null, null, l), this.logger.log(3, () => "Repeated command (" + Oe([s, n]) + ") is dropped");
          continue;
        }
        ut(s, n, this.cmdHistory), r = this.parseCmd(s, n), r || (r = this.parseMidrow(s, n)), r || (r = this.parsePAC(s, n)), r || (r = this.parseBackgroundAttributes(s, n));
      } else
        ut(null, null, l);
      if (!r && (o = this.parseChars(s, n), o)) {
        const c = this.currentChannel;
        c && c > 0 ? this.channels[c].insertChars(o) : this.logger.log(2, "No channel found yet. TEXT-MODE?");
      }
      !r && !o && this.logger.log(2, () => "Couldn't parse cleaned data " + Oe([s, n]) + " orig: " + Oe([t[i], t[i + 1]]));
    }
  }
  /**
   * Parse Command.
   * @returns True if a command was found
   */
  parseCmd(e, t) {
    const i = (e === 20 || e === 28 || e === 21 || e === 29) && t >= 32 && t <= 47, s = (e === 23 || e === 31) && t >= 33 && t <= 35;
    if (!(i || s))
      return !1;
    const n = e === 20 || e === 21 || e === 23 ? 1 : 2, r = this.channels[n];
    return e === 20 || e === 21 || e === 28 || e === 29 ? t === 32 ? r.ccRCL() : t === 33 ? r.ccBS() : t === 34 ? r.ccAOF() : t === 35 ? r.ccAON() : t === 36 ? r.ccDER() : t === 37 ? r.ccRU(2) : t === 38 ? r.ccRU(3) : t === 39 ? r.ccRU(4) : t === 40 ? r.ccFON() : t === 41 ? r.ccRDC() : t === 42 ? r.ccTR() : t === 43 ? r.ccRTD() : t === 44 ? r.ccEDM() : t === 45 ? r.ccCR() : t === 46 ? r.ccENM() : t === 47 && r.ccEOC() : r.ccTO(t - 32), this.currentChannel = n, !0;
  }
  /**
   * Parse midrow styling command
   */
  parseMidrow(e, t) {
    let i = 0;
    if ((e === 17 || e === 25) && t >= 32 && t <= 47) {
      if (e === 17 ? i = 1 : i = 2, i !== this.currentChannel)
        return this.logger.log(0, "Mismatch channel in midrow parsing"), !1;
      const s = this.channels[i];
      return s ? (s.ccMIDROW(t), this.logger.log(3, () => "MIDROW (" + Oe([e, t]) + ")"), !0) : !1;
    }
    return !1;
  }
  /**
   * Parse Preable Access Codes (Table 53).
   * @returns {Boolean} Tells if PAC found
   */
  parsePAC(e, t) {
    let i;
    const s = (e >= 17 && e <= 23 || e >= 25 && e <= 31) && t >= 64 && t <= 127, n = (e === 16 || e === 24) && t >= 64 && t <= 95;
    if (!(s || n))
      return !1;
    const r = e <= 23 ? 1 : 2;
    t >= 64 && t <= 95 ? i = r === 1 ? Ho[e] : Yo[e] : i = r === 1 ? Wo[e] : qo[e];
    const o = this.channels[r];
    return o ? (o.setPAC(this.interpretPAC(i, t)), this.currentChannel = r, !0) : !1;
  }
  /**
   * Interpret the second byte of the pac, and return the information.
   * @returns pacData with style parameters
   */
  interpretPAC(e, t) {
    let i;
    const s = {
      color: null,
      italics: !1,
      indent: null,
      underline: !1,
      row: e
    };
    return t > 95 ? i = t - 96 : i = t - 64, s.underline = (i & 1) === 1, i <= 13 ? s.color = ["white", "green", "blue", "cyan", "red", "yellow", "magenta", "white"][Math.floor(i / 2)] : i <= 15 ? (s.italics = !0, s.color = "white") : s.indent = Math.floor((i - 16) / 2) * 4, s;
  }
  /**
   * Parse characters.
   * @returns An array with 1 to 2 codes corresponding to chars, if found. null otherwise.
   */
  parseChars(e, t) {
    let i, s = null, n = null;
    if (e >= 25 ? (i = 2, n = e - 8) : (i = 1, n = e), n >= 17 && n <= 19) {
      let r;
      n === 17 ? r = t + 80 : n === 18 ? r = t + 112 : r = t + 144, this.logger.log(2, () => "Special char '" + Pn(r) + "' in channel " + i), s = [r];
    } else
      e >= 32 && e <= 127 && (s = t === 0 ? [e] : [e, t]);
    return s && this.logger.log(3, () => "Char codes =  " + Oe(s).join(",")), s;
  }
  /**
   * Parse extended background attributes as well as new foreground color black.
   * @returns True if background attributes are found
   */
  parseBackgroundAttributes(e, t) {
    const i = (e === 16 || e === 24) && t >= 32 && t <= 47, s = (e === 23 || e === 31) && t >= 45 && t <= 47;
    if (!(i || s))
      return !1;
    let n;
    const r = {};
    e === 16 || e === 24 ? (n = Math.floor((t - 32) / 2), r.background = jo[n], t % 2 === 1 && (r.background = r.background + "_semi")) : t === 45 ? r.background = "transparent" : (r.foreground = "black", t === 47 && (r.underline = !0));
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
    ut(null, null, this.cmdHistory);
  }
  /**
   * Trigger the generation of a cue, and the start of a new one if displayScreens are not empty.
   */
  cueSplitAtTime(e) {
    for (let t = 0; t < this.channels.length; t++) {
      const i = this.channels[t];
      i && i.cueSplitAtTime(e);
    }
  }
}
function ut(a, e, t) {
  t.a = a, t.b = e;
}
function Jo(a, e, t) {
  return t.a === a && t.b === e;
}
function Zo() {
  return {
    a: null,
    b: null
  };
}
class dt {
  constructor(e, t) {
    this.timelineController = void 0, this.cueRanges = [], this.trackName = void 0, this.startTime = null, this.endTime = null, this.screen = null, this.timelineController = e, this.trackName = t;
  }
  dispatchCue() {
    this.startTime !== null && (this.timelineController.addCues(this.trackName, this.startTime, this.endTime, this.screen, this.cueRanges), this.startTime = null);
  }
  newCue(e, t, i) {
    (this.startTime === null || this.startTime > e) && (this.startTime = e), this.endTime = t, this.screen = i, this.timelineController.createCaptionsTrack(this.trackName);
  }
  reset() {
    this.cueRanges = [], this.startTime = null;
  }
}
var Oi = function() {
  if (ze != null && ze.VTTCue)
    return self.VTTCue;
  const a = ["", "lr", "rl"], e = ["start", "middle", "end", "left", "right"];
  function t(o, l) {
    if (typeof l != "string" || !Array.isArray(o))
      return !1;
    const h = l.toLowerCase();
    return ~o.indexOf(h) ? h : !1;
  }
  function i(o) {
    return t(a, o);
  }
  function s(o) {
    return t(e, o);
  }
  function n(o, ...l) {
    let h = 1;
    for (; h < arguments.length; h++) {
      const c = arguments[h];
      for (const u in c)
        o[u] = c[u];
    }
    return o;
  }
  function r(o, l, h) {
    const c = this, u = {
      enumerable: !0
    };
    c.hasBeenReset = !1;
    let d = "", f = !1, g = o, m = l, T = h, y = null, E = "", x = !0, v = "auto", S = "start", C = 50, R = "middle", I = 50, D = "middle";
    Object.defineProperty(c, "id", n({}, u, {
      get: function() {
        return d;
      },
      set: function(w) {
        d = "" + w;
      }
    })), Object.defineProperty(c, "pauseOnExit", n({}, u, {
      get: function() {
        return f;
      },
      set: function(w) {
        f = !!w;
      }
    })), Object.defineProperty(c, "startTime", n({}, u, {
      get: function() {
        return g;
      },
      set: function(w) {
        if (typeof w != "number")
          throw new TypeError("Start time must be set to a number.");
        g = w, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(c, "endTime", n({}, u, {
      get: function() {
        return m;
      },
      set: function(w) {
        if (typeof w != "number")
          throw new TypeError("End time must be set to a number.");
        m = w, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(c, "text", n({}, u, {
      get: function() {
        return T;
      },
      set: function(w) {
        T = "" + w, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(c, "region", n({}, u, {
      get: function() {
        return y;
      },
      set: function(w) {
        y = w, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(c, "vertical", n({}, u, {
      get: function() {
        return E;
      },
      set: function(w) {
        const _ = i(w);
        if (_ === !1)
          throw new SyntaxError("An invalid or illegal string was specified.");
        E = _, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(c, "snapToLines", n({}, u, {
      get: function() {
        return x;
      },
      set: function(w) {
        x = !!w, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(c, "line", n({}, u, {
      get: function() {
        return v;
      },
      set: function(w) {
        if (typeof w != "number" && w !== "auto")
          throw new SyntaxError("An invalid number or illegal string was specified.");
        v = w, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(c, "lineAlign", n({}, u, {
      get: function() {
        return S;
      },
      set: function(w) {
        const _ = s(w);
        if (!_)
          throw new SyntaxError("An invalid or illegal string was specified.");
        S = _, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(c, "position", n({}, u, {
      get: function() {
        return C;
      },
      set: function(w) {
        if (w < 0 || w > 100)
          throw new Error("Position must be between 0 and 100.");
        C = w, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(c, "positionAlign", n({}, u, {
      get: function() {
        return R;
      },
      set: function(w) {
        const _ = s(w);
        if (!_)
          throw new SyntaxError("An invalid or illegal string was specified.");
        R = _, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(c, "size", n({}, u, {
      get: function() {
        return I;
      },
      set: function(w) {
        if (w < 0 || w > 100)
          throw new Error("Size must be between 0 and 100.");
        I = w, this.hasBeenReset = !0;
      }
    })), Object.defineProperty(c, "align", n({}, u, {
      get: function() {
        return D;
      },
      set: function(w) {
        const _ = s(w);
        if (!_)
          throw new SyntaxError("An invalid or illegal string was specified.");
        D = _, this.hasBeenReset = !0;
      }
    })), c.displayState = void 0;
  }
  return r.prototype.getCueAsHTML = function() {
    return self.WebVTT.convertCueToDOMTree(self, this.text);
  }, r;
}();
class el {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  decode(e, t) {
    if (!e)
      return "";
    if (typeof e != "string")
      throw new Error("Error - expected string data.");
    return decodeURIComponent(encodeURIComponent(e));
  }
}
function On(a) {
  function e(i, s, n, r) {
    return (i | 0) * 3600 + (s | 0) * 60 + (n | 0) + parseFloat(r || 0);
  }
  const t = a.match(/^(?:(\d+):)?(\d{2}):(\d{2})(\.\d+)?/);
  return t ? parseFloat(t[2]) > 59 ? e(t[2], t[3], 0, t[4]) : e(t[1], t[2], t[3], t[4]) : null;
}
class tl {
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
  get(e, t, i) {
    return i ? this.has(e) ? this.values[e] : t[i] : this.has(e) ? this.values[e] : t;
  }
  // Check whether we have a value for a key.
  has(e) {
    return e in this.values;
  }
  // Accept a setting if its one of the given alternatives.
  alt(e, t, i) {
    for (let s = 0; s < i.length; ++s)
      if (t === i[s]) {
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
      const i = parseFloat(t);
      if (i >= 0 && i <= 100)
        return this.set(e, i), !0;
    }
    return !1;
  }
}
function Mn(a, e, t, i) {
  const s = i ? a.split(i) : [a];
  for (const n in s) {
    if (typeof s[n] != "string")
      continue;
    const r = s[n].split(t);
    if (r.length !== 2)
      continue;
    const o = r[0], l = r[1];
    e(o, l);
  }
}
const mi = new Oi(0, 0, ""), ft = mi.align === "middle" ? "middle" : "center";
function il(a, e, t) {
  const i = a;
  function s() {
    const o = On(a);
    if (o === null)
      throw new Error("Malformed timestamp: " + i);
    return a = a.replace(/^[^\sa-zA-Z-]+/, ""), o;
  }
  function n(o, l) {
    const h = new tl();
    Mn(o, function(d, f) {
      let g;
      switch (d) {
        case "region":
          for (let m = t.length - 1; m >= 0; m--)
            if (t[m].id === f) {
              h.set(d, t[m].region);
              break;
            }
          break;
        case "vertical":
          h.alt(d, f, ["rl", "lr"]);
          break;
        case "line":
          g = f.split(","), h.integer(d, g[0]), h.percent(d, g[0]) && h.set("snapToLines", !1), h.alt(d, g[0], ["auto"]), g.length === 2 && h.alt("lineAlign", g[1], ["start", ft, "end"]);
          break;
        case "position":
          g = f.split(","), h.percent(d, g[0]), g.length === 2 && h.alt("positionAlign", g[1], ["start", ft, "end", "line-left", "line-right", "auto"]);
          break;
        case "size":
          h.percent(d, f);
          break;
        case "align":
          h.alt(d, f, ["start", ft, "end", "left", "right"]);
          break;
      }
    }, /:/, /\s/), l.region = h.get("region", null), l.vertical = h.get("vertical", "");
    let c = h.get("line", "auto");
    c === "auto" && mi.line === -1 && (c = -1), l.line = c, l.lineAlign = h.get("lineAlign", "start"), l.snapToLines = h.get("snapToLines", !0), l.size = h.get("size", 100), l.align = h.get("align", ft);
    let u = h.get("position", "auto");
    u === "auto" && mi.position === 50 && (u = l.align === "start" || l.align === "left" ? 0 : l.align === "end" || l.align === "right" ? 100 : 50), l.position = u;
  }
  function r() {
    a = a.replace(/^\s+/, "");
  }
  if (r(), e.startTime = s(), r(), a.slice(0, 3) !== "-->")
    throw new Error("Malformed time stamp (time stamps must be separated by '-->'): " + i);
  a = a.slice(3), r(), e.endTime = s(), r(), n(a, e);
}
function Nn(a) {
  return a.replace(/<br(?: \/)?>/gi, `
`);
}
class sl {
  constructor() {
    this.state = "INITIAL", this.buffer = "", this.decoder = new el(), this.regionList = [], this.cue = null, this.oncue = void 0, this.onparsingerror = void 0, this.onflush = void 0;
  }
  parse(e) {
    const t = this;
    e && (t.buffer += t.decoder.decode(e, {
      stream: !0
    }));
    function i() {
      let n = t.buffer, r = 0;
      for (n = Nn(n); r < n.length && n[r] !== "\r" && n[r] !== `
`; )
        ++r;
      const o = n.slice(0, r);
      return n[r] === "\r" && ++r, n[r] === `
` && ++r, t.buffer = n.slice(r), o;
    }
    function s(n) {
      Mn(n, function(r, o) {
      }, /:/);
    }
    try {
      let n = "";
      if (t.state === "INITIAL") {
        if (!/\r\n|\n/.test(t.buffer))
          return this;
        n = i();
        const o = n.match(/^(ï»¿)?WEBVTT([ \t].*)?$/);
        if (!(o != null && o[0]))
          throw new Error("Malformed WebVTT signature.");
        t.state = "HEADER";
      }
      let r = !1;
      for (; t.buffer; ) {
        if (!/\r\n|\n/.test(t.buffer))
          return this;
        switch (r ? r = !1 : n = i(), t.state) {
          case "HEADER":
            /:/.test(n) ? s(n) : n || (t.state = "ID");
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
            if (t.cue = new Oi(0, 0, ""), t.state = "CUE", n.indexOf("-->") === -1) {
              t.cue.id = n;
              continue;
            }
          case "CUE":
            if (!t.cue) {
              t.state = "BADCUE";
              continue;
            }
            try {
              il(n, t.cue, t.regionList);
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
const nl = /\r\n|\n\r|\n|\r/g, Jt = function(e, t, i = 0) {
  return e.slice(i, i + t.length) === t;
}, rl = function(e) {
  let t = parseInt(e.slice(-3));
  const i = parseInt(e.slice(-6, -4)), s = parseInt(e.slice(-9, -7)), n = e.length > 9 ? parseInt(e.substring(0, e.indexOf(":"))) : 0;
  if (!M(t) || !M(i) || !M(s) || !M(n))
    throw Error(`Malformed X-TIMESTAMP-MAP: Local:${e}`);
  return t += 1e3 * i, t += 60 * 1e3 * s, t += 60 * 60 * 1e3 * n, t;
}, Zt = function(e) {
  let t = 5381, i = e.length;
  for (; i; )
    t = t * 33 ^ e.charCodeAt(--i);
  return (t >>> 0).toString();
};
function Mi(a, e, t) {
  return Zt(a.toString()) + Zt(e.toString()) + Zt(t);
}
const al = function(e, t, i) {
  let s = e[t], n = e[s.prevCC];
  if (!n || !n.new && s.new) {
    e.ccOffset = e.presentationOffset = s.start, s.new = !1;
    return;
  }
  for (; (r = n) != null && r.new; ) {
    var r;
    e.ccOffset += s.start - n.start, s.new = !1, s = n, n = e[s.prevCC];
  }
  e.presentationOffset = i;
};
function ol(a, e, t, i, s, n, r) {
  const o = new sl(), l = be(new Uint8Array(a)).trim().replace(nl, `
`).split(`
`), h = [], c = e ? Lo(e.baseTime, e.timescale) : 0;
  let u = "00:00.000", d = 0, f = 0, g, m = !0;
  o.oncue = function(T) {
    const y = t[i];
    let E = t.ccOffset;
    const x = (d - c) / 9e4;
    if (y != null && y.new && (f !== void 0 ? E = t.ccOffset = y.start : al(t, i, x)), x) {
      if (!e) {
        g = new Error("Missing initPTS for VTT MPEGTS");
        return;
      }
      E = x - t.presentationOffset;
    }
    const v = T.endTime - T.startTime, S = pe((T.startTime + E - f) * 9e4, s * 9e4) / 9e4;
    T.startTime = Math.max(S, 0), T.endTime = Math.max(S + v, 0);
    const C = T.text.trim();
    T.text = decodeURIComponent(encodeURIComponent(C)), T.id || (T.id = Mi(T.startTime, T.endTime, C)), T.endTime > 0 && h.push(T);
  }, o.onparsingerror = function(T) {
    g = T;
  }, o.onflush = function() {
    if (g) {
      r(g);
      return;
    }
    n(h);
  }, l.forEach((T) => {
    if (m)
      if (Jt(T, "X-TIMESTAMP-MAP=")) {
        m = !1, T.slice(16).split(",").forEach((y) => {
          Jt(y, "LOCAL:") ? u = y.slice(6) : Jt(y, "MPEGTS:") && (d = parseInt(y.slice(7)));
        });
        try {
          f = rl(u) / 1e3;
        } catch (y) {
          g = y;
        }
        return;
      } else
        T === "" && (m = !1);
    o.parse(T + `
`);
  }), o.flush();
}
const ei = "stpp.ttml.im1t", Un = /^(\d{2,}):(\d{2}):(\d{2}):(\d{2})\.?(\d+)?$/, Bn = /^(\d*(?:\.\d*)?)(h|m|s|ms|f|t)$/, ll = {
  left: "start",
  center: "center",
  right: "end",
  start: "start",
  end: "end"
};
function ks(a, e, t, i) {
  const s = H(new Uint8Array(a), ["mdat"]);
  if (s.length === 0) {
    i(new Error("Could not parse IMSC1 mdat"));
    return;
  }
  const n = s.map((o) => be(o)), r = Ao(e.baseTime, 1, e.timescale);
  try {
    n.forEach((o) => t(hl(o, r)));
  } catch (o) {
    i(o);
  }
}
function hl(a, e) {
  const s = new DOMParser().parseFromString(a, "text/xml").getElementsByTagName("tt")[0];
  if (!s)
    throw new Error("Invalid ttml");
  const n = {
    frameRate: 30,
    subFrameRate: 1,
    frameRateMultiplier: 0,
    tickRate: 0
  }, r = Object.keys(n).reduce((u, d) => (u[d] = s.getAttribute(`ttp:${d}`) || n[d], u), {}), o = s.getAttribute("xml:space") !== "preserve", l = _s(ti(s, "styling", "style")), h = _s(ti(s, "layout", "region")), c = ti(s, "body", "[begin]");
  return [].map.call(c, (u) => {
    const d = $n(u, o);
    if (!d || !u.hasAttribute("begin"))
      return null;
    const f = si(u.getAttribute("begin"), r), g = si(u.getAttribute("dur"), r);
    let m = si(u.getAttribute("end"), r);
    if (f === null)
      throw Ps(u);
    if (m === null) {
      if (g === null)
        throw Ps(u);
      m = f + g;
    }
    const T = new Oi(f - e, m - e, d);
    T.id = Mi(T.startTime, T.endTime, T.text);
    const y = h[u.getAttribute("region")], E = l[u.getAttribute("style")], x = cl(y, E, l), {
      textAlign: v
    } = x;
    if (v) {
      const S = ll[v];
      S && (T.lineAlign = S), T.align = v;
    }
    return se(T, x), T;
  }).filter((u) => u !== null);
}
function ti(a, e, t) {
  const i = a.getElementsByTagName(e)[0];
  return i ? [].slice.call(i.querySelectorAll(t)) : [];
}
function _s(a) {
  return a.reduce((e, t) => {
    const i = t.getAttribute("xml:id");
    return i && (e[i] = t), e;
  }, {});
}
function $n(a, e) {
  return [].slice.call(a.childNodes).reduce((t, i, s) => {
    var n;
    return i.nodeName === "br" && s ? t + `
` : (n = i.childNodes) != null && n.length ? $n(i, e) : e ? t + i.textContent.trim().replace(/\s+/g, " ") : t + i.textContent;
  }, "");
}
function cl(a, e, t) {
  const i = "http://www.w3.org/ns/ttml#styling";
  let s = null;
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
  return r && t.hasOwnProperty(r) && (s = t[r]), n.reduce((o, l) => {
    const h = ii(e, i, l) || ii(a, i, l) || ii(s, i, l);
    return h && (o[l] = h), o;
  }, {});
}
function ii(a, e, t) {
  return a && a.hasAttributeNS(e, t) ? a.getAttributeNS(e, t) : null;
}
function Ps(a) {
  return new Error(`Could not parse ttml timestamp ${a}`);
}
function si(a, e) {
  if (!a)
    return null;
  let t = On(a);
  return t === null && (Un.test(a) ? t = ul(a, e) : Bn.test(a) && (t = dl(a, e))), t;
}
function ul(a, e) {
  const t = Un.exec(a), i = (t[4] | 0) + (t[5] | 0) / e.subFrameRate;
  return (t[1] | 0) * 3600 + (t[2] | 0) * 60 + (t[3] | 0) + i / e.frameRate;
}
function dl(a, e) {
  const t = Bn.exec(a), i = Number(t[1]);
  switch (t[2]) {
    case "h":
      return i * 3600;
    case "m":
      return i * 60;
    case "ms":
      return i * 1e3;
    case "f":
      return i / e.frameRate;
    case "t":
      return i / e.tickRate;
  }
  return i;
}
class fl {
  constructor(e) {
    this.hls = void 0, this.media = null, this.config = void 0, this.enabled = !0, this.Cues = void 0, this.textTracks = [], this.tracks = [], this.initPTS = [], this.unparsedVttFrags = [], this.captionsTracks = {}, this.nonNativeCaptionsTracks = {}, this.cea608Parser1 = void 0, this.cea608Parser2 = void 0, this.lastCc = -1, this.lastSn = -1, this.lastPartIndex = -1, this.prevCC = -1, this.vttCCs = Os(), this.captionsProperties = void 0, this.hls = e, this.config = e.config, this.Cues = e.config.cueHandler, this.captionsProperties = {
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
    }, e.on(p.MEDIA_ATTACHING, this.onMediaAttaching, this), e.on(p.MEDIA_DETACHING, this.onMediaDetaching, this), e.on(p.MANIFEST_LOADING, this.onManifestLoading, this), e.on(p.MANIFEST_LOADED, this.onManifestLoaded, this), e.on(p.SUBTITLE_TRACKS_UPDATED, this.onSubtitleTracksUpdated, this), e.on(p.FRAG_LOADING, this.onFragLoading, this), e.on(p.FRAG_LOADED, this.onFragLoaded, this), e.on(p.FRAG_PARSING_USERDATA, this.onFragParsingUserdata, this), e.on(p.FRAG_DECRYPTED, this.onFragDecrypted, this), e.on(p.INIT_PTS_FOUND, this.onInitPtsFound, this), e.on(p.SUBTITLE_TRACKS_CLEARED, this.onSubtitleTracksCleared, this), e.on(p.BUFFER_FLUSHING, this.onBufferFlushing, this);
  }
  destroy() {
    const {
      hls: e
    } = this;
    e.off(p.MEDIA_ATTACHING, this.onMediaAttaching, this), e.off(p.MEDIA_DETACHING, this.onMediaDetaching, this), e.off(p.MANIFEST_LOADING, this.onManifestLoading, this), e.off(p.MANIFEST_LOADED, this.onManifestLoaded, this), e.off(p.SUBTITLE_TRACKS_UPDATED, this.onSubtitleTracksUpdated, this), e.off(p.FRAG_LOADING, this.onFragLoading, this), e.off(p.FRAG_LOADED, this.onFragLoaded, this), e.off(p.FRAG_PARSING_USERDATA, this.onFragParsingUserdata, this), e.off(p.FRAG_DECRYPTED, this.onFragDecrypted, this), e.off(p.INIT_PTS_FOUND, this.onInitPtsFound, this), e.off(p.SUBTITLE_TRACKS_CLEARED, this.onSubtitleTracksCleared, this), e.off(p.BUFFER_FLUSHING, this.onBufferFlushing, this), this.hls = this.config = null, this.cea608Parser1 = this.cea608Parser2 = void 0;
  }
  initCea608Parsers() {
    if (this.config.enableCEA708Captions && (!this.cea608Parser1 || !this.cea608Parser2)) {
      const e = new dt(this, "textTrack1"), t = new dt(this, "textTrack2"), i = new dt(this, "textTrack3"), s = new dt(this, "textTrack4");
      this.cea608Parser1 = new ws(1, e, t), this.cea608Parser2 = new ws(3, i, s);
    }
  }
  addCues(e, t, i, s, n) {
    let r = !1;
    for (let o = n.length; o--; ) {
      const l = n[o], h = gl(l[0], l[1], t, i);
      if (h >= 0 && (l[0] = Math.min(l[0], t), l[1] = Math.max(l[1], i), r = !0, h / (i - t) > 0.5))
        return;
    }
    if (r || n.push([t, i]), this.config.renderTextTracksNatively) {
      const o = this.captionsTracks[e];
      this.Cues.newCue(o, t, i, s);
    } else {
      const o = this.Cues.newCue(null, t, i, s);
      this.hls.trigger(p.CUES_PARSED, {
        type: "captions",
        cues: o,
        track: e
      });
    }
  }
  // Triggered when an initial PTS is found; used for synchronisation of WebVTT.
  onInitPtsFound(e, {
    frag: t,
    id: i,
    initPTS: s,
    timescale: n
  }) {
    const {
      unparsedVttFrags: r
    } = this;
    i === "main" && (this.initPTS[t.cc] = {
      baseTime: s,
      timescale: n
    }), r.length && (this.unparsedVttFrags = [], r.forEach((o) => {
      this.onFragLoaded(p.FRAG_LOADED, o);
    }));
  }
  getExistingTrack(e, t) {
    const {
      media: i
    } = this;
    if (i)
      for (let s = 0; s < i.textTracks.length; s++) {
        const n = i.textTracks[s];
        if (Fs(n, {
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
      captionsTracks: i,
      media: s
    } = this, {
      label: n,
      languageCode: r
    } = t[e], o = this.getExistingTrack(n, r);
    if (o)
      i[e] = o, Ye(i[e]), an(i[e], s);
    else {
      const l = this.createTextTrack("captions", n, r);
      l && (l[e] = !0, i[e] = l);
    }
  }
  createNonNativeTrack(e) {
    if (this.nonNativeCaptionsTracks[e])
      return;
    const t = this.captionsProperties[e];
    if (!t)
      return;
    const i = t.label, s = {
      _id: e,
      label: i,
      kind: "captions",
      default: t.media ? !!t.media.default : !1,
      closedCaptions: t.media
    };
    this.nonNativeCaptionsTracks[e] = s, this.hls.trigger(p.NON_NATIVE_TEXT_TRACKS_FOUND, {
      tracks: [s]
    });
  }
  createTextTrack(e, t, i) {
    const s = this.media;
    if (s)
      return s.addTextTrack(e, t, i);
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
    this.lastCc = -1, this.lastSn = -1, this.lastPartIndex = -1, this.prevCC = -1, this.vttCCs = Os(), this._cleanTracks(), this.tracks = [], this.captionsTracks = {}, this.nonNativeCaptionsTracks = {}, this.textTracks = [], this.unparsedVttFrags = [], this.initPTS = [], this.cea608Parser1 && this.cea608Parser2 && (this.cea608Parser1.reset(), this.cea608Parser2.reset());
  }
  _cleanTracks() {
    const {
      media: e
    } = this;
    if (!e)
      return;
    const t = e.textTracks;
    if (t)
      for (let i = 0; i < t.length; i++)
        Ye(t[i]);
  }
  onSubtitleTracksUpdated(e, t) {
    const i = t.subtitleTracks || [], s = i.some((n) => n.textCodec === ei);
    if (this.config.enableWebVTT || s && this.config.enableIMSC1) {
      if (_n(this.tracks, i)) {
        this.tracks = i;
        return;
      }
      if (this.textTracks = [], this.tracks = i, this.config.renderTextTracksNatively) {
        const r = this.media, o = r ? pt(r.textTracks) : null;
        if (this.tracks.forEach((l, h) => {
          let c;
          if (o) {
            let u = null;
            for (let d = 0; d < o.length; d++)
              if (o[d] && Fs(o[d], l)) {
                u = o[d], o[d] = null;
                break;
              }
            u && (c = u);
          }
          if (c)
            Ye(c);
          else {
            const u = Gn(l);
            c = this.createTextTrack(u, l.name, l.lang), c && (c.mode = "disabled");
          }
          c && this.textTracks.push(c);
        }), o != null && o.length) {
          const l = o.filter((h) => h !== null).map((h) => h.label);
          l.length && A.warn(`Media element contains unused subtitle tracks: ${l.join(", ")}. Replace media element for each source to clear TextTracks and captions menu.`);
        }
      } else if (this.tracks.length) {
        const r = this.tracks.map((o) => ({
          label: o.name,
          kind: o.type.toLowerCase(),
          default: o.default,
          subtitleTrack: o
        }));
        this.hls.trigger(p.NON_NATIVE_TEXT_TRACKS_FOUND, {
          tracks: r
        });
      }
    }
  }
  onManifestLoaded(e, t) {
    this.config.enableCEA708Captions && t.captions && t.captions.forEach((i) => {
      const s = /(?:CC|SERVICE)([1-4])/.exec(i.instreamId);
      if (!s)
        return;
      const n = `textTrack${s[1]}`, r = this.captionsProperties[n];
      r && (r.label = i.name, i.lang && (r.languageCode = i.lang), r.media = i);
    });
  }
  closedCaptionsForLevel(e) {
    const t = this.hls.levels[e.level];
    return t == null ? void 0 : t.attrs["CLOSED-CAPTIONS"];
  }
  onFragLoading(e, t) {
    if (this.enabled && t.frag.type === G.MAIN) {
      var i, s;
      const {
        cea608Parser1: n,
        cea608Parser2: r,
        lastSn: o
      } = this, {
        cc: l,
        sn: h
      } = t.frag, c = (i = (s = t.part) == null ? void 0 : s.index) != null ? i : -1;
      n && r && (h !== o + 1 || h === o && c !== this.lastPartIndex + 1 || l !== this.lastCc) && (n.reset(), r.reset()), this.lastCc = l, this.lastSn = h, this.lastPartIndex = c;
    }
  }
  onFragLoaded(e, t) {
    const {
      frag: i,
      payload: s
    } = t;
    if (i.type === G.SUBTITLE)
      if (s.byteLength) {
        const n = i.decryptdata, r = "stats" in t;
        if (n == null || !n.encrypted || r) {
          const o = this.tracks[i.level], l = this.vttCCs;
          l[i.cc] || (l[i.cc] = {
            start: i.start,
            prevCC: this.prevCC,
            new: !0
          }, this.prevCC = i.cc), o && o.textCodec === ei ? this._parseIMSC1(i, s) : this._parseVTTs(t);
        }
      } else
        this.hls.trigger(p.SUBTITLE_FRAG_PROCESSED, {
          success: !1,
          frag: i,
          error: new Error("Empty subtitle payload")
        });
  }
  _parseIMSC1(e, t) {
    const i = this.hls;
    ks(t, this.initPTS[e.cc], (s) => {
      this._appendCues(s, e.level), i.trigger(p.SUBTITLE_FRAG_PROCESSED, {
        success: !0,
        frag: e
      });
    }, (s) => {
      A.log(`Failed to parse IMSC1: ${s}`), i.trigger(p.SUBTITLE_FRAG_PROCESSED, {
        success: !1,
        frag: e,
        error: s
      });
    });
  }
  _parseVTTs(e) {
    var t;
    const {
      frag: i,
      payload: s
    } = e, {
      initPTS: n,
      unparsedVttFrags: r
    } = this, o = n.length - 1;
    if (!n[i.cc] && o === -1) {
      r.push(e);
      return;
    }
    const l = this.hls, h = (t = i.initSegment) != null && t.data ? Te(i.initSegment.data, new Uint8Array(s)) : s;
    ol(h, this.initPTS[i.cc], this.vttCCs, i.cc, i.start, (c) => {
      this._appendCues(c, i.level), l.trigger(p.SUBTITLE_FRAG_PROCESSED, {
        success: !0,
        frag: i
      });
    }, (c) => {
      const u = c.message === "Missing initPTS for VTT MPEGTS";
      u ? r.push(e) : this._fallbackToIMSC1(i, s), A.log(`Failed to parse VTT cue: ${c}`), !(u && o > i.cc) && l.trigger(p.SUBTITLE_FRAG_PROCESSED, {
        success: !1,
        frag: i,
        error: c
      });
    });
  }
  _fallbackToIMSC1(e, t) {
    const i = this.tracks[e.level];
    i.textCodec || ks(t, this.initPTS[e.cc], () => {
      i.textCodec = ei, this._parseIMSC1(e, t);
    }, () => {
      i.textCodec = "wvtt";
    });
  }
  _appendCues(e, t) {
    const i = this.hls;
    if (this.config.renderTextTracksNatively) {
      const s = this.textTracks[t];
      if (!s || s.mode === "disabled")
        return;
      e.forEach((n) => on(s, n));
    } else {
      const s = this.tracks[t];
      if (!s)
        return;
      const n = s.default ? "default" : "subtitles" + t;
      i.trigger(p.CUES_PARSED, {
        type: "subtitles",
        cues: e,
        track: n
      });
    }
  }
  onFragDecrypted(e, t) {
    const {
      frag: i
    } = t;
    i.type === G.SUBTITLE && this.onFragLoaded(p.FRAG_LOADED, t);
  }
  onSubtitleTracksCleared() {
    this.tracks = [], this.captionsTracks = {};
  }
  onFragParsingUserdata(e, t) {
    this.initCea608Parsers();
    const {
      cea608Parser1: i,
      cea608Parser2: s
    } = this;
    if (!this.enabled || !i || !s)
      return;
    const {
      frag: n,
      samples: r
    } = t;
    if (!(n.type === G.MAIN && this.closedCaptionsForLevel(n) === "NONE"))
      for (let o = 0; o < r.length; o++) {
        const l = r[o].bytes;
        if (l) {
          const h = this.extractCea608Data(l);
          i.addData(r[o].pts, h[0]), s.addData(r[o].pts, h[1]);
        }
      }
  }
  onBufferFlushing(e, {
    startOffset: t,
    endOffset: i,
    endOffsetSubtitles: s,
    type: n
  }) {
    const {
      media: r
    } = this;
    if (!(!r || r.currentTime < i)) {
      if (!n || n === "video") {
        const {
          captionsTracks: o
        } = this;
        Object.keys(o).forEach((l) => li(o[l], t, i));
      }
      if (this.config.renderTextTracksNatively && t === 0 && s !== void 0) {
        const {
          textTracks: o
        } = this;
        Object.keys(o).forEach((l) => li(o[l], t, s));
      }
    }
  }
  extractCea608Data(e) {
    const t = [[], []], i = e[0] & 31;
    let s = 2;
    for (let n = 0; n < i; n++) {
      const r = e[s++], o = 127 & e[s++], l = 127 & e[s++];
      if (o === 0 && l === 0)
        continue;
      if ((4 & r) !== 0) {
        const c = 3 & r;
        (c === 0 || c === 1) && (t[c].push(o), t[c].push(l));
      }
    }
    return t;
  }
}
function Gn(a) {
  return a.characteristics && /transcribes-spoken-dialog/gi.test(a.characteristics) && /describes-music-and-sound/gi.test(a.characteristics) ? "captions" : "subtitles";
}
function Fs(a, e) {
  return !!a && a.kind === Gn(e) && gi(e, a);
}
function gl(a, e, t, i) {
  return Math.min(e, i) - Math.max(a, t);
}
function Os() {
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
class Ni {
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
    e.on(p.FPS_DROP_LEVEL_CAPPING, this.onFpsDropLevelCapping, this), e.on(p.MEDIA_ATTACHING, this.onMediaAttaching, this), e.on(p.MANIFEST_PARSED, this.onManifestParsed, this), e.on(p.LEVELS_UPDATED, this.onLevelsUpdated, this), e.on(p.BUFFER_CODECS, this.onBufferCodecs, this), e.on(p.MEDIA_DETACHING, this.onMediaDetaching, this);
  }
  unregisterListener() {
    const {
      hls: e
    } = this;
    e.off(p.FPS_DROP_LEVEL_CAPPING, this.onFpsDropLevelCapping, this), e.off(p.MEDIA_ATTACHING, this.onMediaAttaching, this), e.off(p.MANIFEST_PARSED, this.onManifestParsed, this), e.off(p.LEVELS_UPDATED, this.onLevelsUpdated, this), e.off(p.BUFFER_CODECS, this.onBufferCodecs, this), e.off(p.MEDIA_DETACHING, this.onMediaDetaching, this);
  }
  onFpsDropLevelCapping(e, t) {
    const i = this.hls.levels[t.droppedLevel];
    this.isLevelAllowed(i) && this.restrictedLevels.push({
      bitrate: i.bitrate,
      height: i.height,
      width: i.width
    });
  }
  onMediaAttaching(e, t) {
    this.media = t.media instanceof HTMLVideoElement ? t.media : null, this.clientRect = null, this.timer && this.hls.levels.length && this.detectPlayerSize();
  }
  onManifestParsed(e, t) {
    const i = this.hls;
    this.restrictedLevels = [], this.firstLevel = t.firstLevel, i.config.capLevelToPlayerSize && t.video && this.startCapping();
  }
  onLevelsUpdated(e, t) {
    this.timer && M(this.autoLevelCapping) && this.detectPlayerSize();
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
        const t = this.hls, i = this.getMaxLevel(e.length - 1);
        i !== this.autoLevelCapping && A.log(`Setting autoLevelCapping to ${i}: ${e[i].height}p@${e[i].bitrate} for media ${this.mediaWidth}x${this.mediaHeight}`), t.autoLevelCapping = i, t.autoLevelCapping > this.autoLevelCapping && this.streamController && this.streamController.nextLevelSwitch(), this.autoLevelCapping = t.autoLevelCapping;
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
    const i = t.filter((s, n) => this.isLevelAllowed(s) && n <= e);
    return this.clientRect = null, Ni.getMaxLevelByMediaSize(i, this.mediaWidth, this.mediaHeight);
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
      const i = e.getBoundingClientRect();
      t.width = i.width, t.height = i.height, !t.width && !t.height && (t.width = i.right - i.left || e.width || 0, t.height = i.bottom - i.top || e.height || 0);
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
    return !this.restrictedLevels.some((i) => e.bitrate === i.bitrate && e.width === i.width && e.height === i.height);
  }
  static getMaxLevelByMediaSize(e, t, i) {
    if (!(e != null && e.length))
      return -1;
    const s = (o, l) => l ? o.width !== l.width || o.height !== l.height : !0;
    let n = e.length - 1;
    const r = Math.max(t, i);
    for (let o = 0; o < e.length; o += 1) {
      const l = e[o];
      if ((l.width >= r || l.height >= r) && s(l, e[o + 1])) {
        n = o;
        break;
      }
    }
    return n;
  }
}
class ml {
  constructor(e) {
    this.hls = void 0, this.isVideoPlaybackQualityAvailable = !1, this.timer = void 0, this.media = null, this.lastTime = void 0, this.lastDroppedFrames = 0, this.lastDecodedFrames = 0, this.streamController = void 0, this.hls = e, this.registerListeners();
  }
  setStreamController(e) {
    this.streamController = e;
  }
  registerListeners() {
    this.hls.on(p.MEDIA_ATTACHING, this.onMediaAttaching, this);
  }
  unregisterListeners() {
    this.hls.off(p.MEDIA_ATTACHING, this.onMediaAttaching, this);
  }
  destroy() {
    this.timer && clearInterval(this.timer), this.unregisterListeners(), this.isVideoPlaybackQualityAvailable = !1, this.media = null;
  }
  onMediaAttaching(e, t) {
    const i = this.hls.config;
    if (i.capLevelOnFPSDrop) {
      const s = t.media instanceof self.HTMLVideoElement ? t.media : null;
      this.media = s, s && typeof s.getVideoPlaybackQuality == "function" && (this.isVideoPlaybackQualityAvailable = !0), self.clearInterval(this.timer), this.timer = self.setInterval(this.checkFPSInterval.bind(this), i.fpsDroppedMonitoringPeriod);
    }
  }
  checkFPS(e, t, i) {
    const s = performance.now();
    if (t) {
      if (this.lastTime) {
        const n = s - this.lastTime, r = i - this.lastDroppedFrames, o = t - this.lastDecodedFrames, l = 1e3 * r / n, h = this.hls;
        if (h.trigger(p.FPS_DROP, {
          currentDropped: r,
          currentDecoded: o,
          totalDroppedFrames: i
        }), l > 0 && r > h.config.fpsDroppedMonitoringThreshold * o) {
          let c = h.currentLevel;
          A.warn("drop FPS ratio greater than max allowed value for currentLevel: " + c), c > 0 && (h.autoLevelCapping === -1 || h.autoLevelCapping >= c) && (c = c - 1, h.trigger(p.FPS_DROP_LEVEL_CAPPING, {
            level: c,
            droppedLevel: h.currentLevel
          }), h.autoLevelCapping = c, this.streamController.nextLevelSwitch());
        }
      }
      this.lastTime = s, this.lastDroppedFrames = i, this.lastDecodedFrames = t;
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
const gt = "[eme]";
class je {
  constructor(e) {
    this.hls = void 0, this.config = void 0, this.media = null, this.keyFormatPromise = null, this.keySystemAccessPromises = {}, this._requestLicenseFailureCount = 0, this.mediaKeySessions = [], this.keyIdToKeySessionPromise = {}, this.setMediaKeysQueue = je.CDMCleanupPromise ? [je.CDMCleanupPromise] : [], this.onMediaEncrypted = this._onMediaEncrypted.bind(this), this.onWaitingForKey = this._onWaitingForKey.bind(this), this.debug = A.debug.bind(A, gt), this.log = A.log.bind(A, gt), this.warn = A.warn.bind(A, gt), this.error = A.error.bind(A, gt), this.hls = e, this.config = e.config, this.registerListeners();
  }
  destroy() {
    this.unregisterListeners(), this.onMediaDetached();
    const e = this.config;
    e.requestMediaKeySystemAccessFunc = null, e.licenseXhrSetup = e.licenseResponseCallback = void 0, e.drmSystems = e.drmSystemOptions = {}, this.hls = this.onMediaEncrypted = this.onWaitingForKey = this.keyIdToKeySessionPromise = null, this.config = null;
  }
  registerListeners() {
    this.hls.on(p.MEDIA_ATTACHED, this.onMediaAttached, this), this.hls.on(p.MEDIA_DETACHED, this.onMediaDetached, this), this.hls.on(p.MANIFEST_LOADING, this.onManifestLoading, this), this.hls.on(p.MANIFEST_LOADED, this.onManifestLoaded, this);
  }
  unregisterListeners() {
    this.hls.off(p.MEDIA_ATTACHED, this.onMediaAttached, this), this.hls.off(p.MEDIA_DETACHED, this.onMediaDetached, this), this.hls.off(p.MANIFEST_LOADING, this.onManifestLoading, this), this.hls.off(p.MANIFEST_LOADED, this.onManifestLoaded, this);
  }
  getLicenseServerUrl(e) {
    const {
      drmSystems: t,
      widevineLicenseUrl: i
    } = this.config, s = t[e];
    if (s)
      return s.licenseUrl;
    if (e === ee.WIDEVINE && i)
      return i;
    throw new Error(`no license server URL configured for key-system "${e}"`);
  }
  getServerCertificateUrl(e) {
    const {
      drmSystems: t
    } = this.config, i = t[e];
    if (i)
      return i.serverCertificateUrl;
    this.log(`No Server Certificate in config.drmSystems["${e}"]`);
  }
  attemptKeySystemAccess(e) {
    const t = this.hls.levels, i = (r, o, l) => !!r && l.indexOf(r) === o, s = t.map((r) => r.audioCodec).filter(i), n = t.map((r) => r.videoCodec).filter(i);
    return s.length + n.length === 0 && n.push("avc1.42e01e"), new Promise((r, o) => {
      const l = (h) => {
        const c = h.shift();
        this.getMediaKeysPromise(c, s, n).then((u) => r({
          keySystem: c,
          mediaKeys: u
        })).catch((u) => {
          h.length ? l(h) : u instanceof me ? o(u) : o(new me({
            type: V.KEY_SYSTEM_ERROR,
            details: b.KEY_SYSTEM_NO_ACCESS,
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
      requestMediaKeySystemAccessFunc: i
    } = this.config;
    if (typeof i != "function") {
      let s = `Configured requestMediaKeySystemAccess is not a function ${i}`;
      return Ys === null && self.location.protocol === "http:" && (s = `navigator.requestMediaKeySystemAccess is not available over insecure protocol ${location.protocol}`), Promise.reject(new Error(s));
    }
    return i(e, t);
  }
  getMediaKeysPromise(e, t, i) {
    const s = xr(e, t, i, this.config.drmSystemOptions), n = this.keySystemAccessPromises[e];
    let r = n == null ? void 0 : n.keySystemAccess;
    if (!r) {
      this.log(`Requesting encrypted media "${e}" key-system access with config: ${JSON.stringify(s)}`), r = this.requestMediaKeySystemAccess(e, s);
      const o = this.keySystemAccessPromises[e] = {
        keySystemAccess: r
      };
      return r.catch((l) => {
        this.log(`Failed to obtain access to key-system "${e}": ${l}`);
      }), r.then((l) => {
        this.log(`Access for key-system "${l.keySystem}" obtained`);
        const h = this.fetchServerCertificate(e);
        return this.log(`Create media-keys for "${e}"`), o.mediaKeys = l.createMediaKeys().then((c) => (this.log(`Media-keys created for "${e}"`), h.then((u) => u ? this.setMediaKeysServerCertificate(c, e, u) : c))), o.mediaKeys.catch((c) => {
          this.error(`Failed to create media-keys for "${e}"}: ${c}`);
        }), o.mediaKeys;
      });
    }
    return r.then(() => n.mediaKeys);
  }
  createMediaKeySessionContext({
    decryptdata: e,
    keySystem: t,
    mediaKeys: i
  }) {
    this.log(`Creating key-system session "${t}" keyId: ${Se.hexDump(e.keyId || [])}`);
    const s = i.createSession(), n = {
      decryptdata: e,
      keySystem: t,
      mediaKeys: i,
      mediaKeysSession: s,
      keyStatus: "status-pending"
    };
    return this.mediaKeySessions.push(n), n;
  }
  renewKeySession(e) {
    const t = e.decryptdata;
    if (t.pssh) {
      const i = this.createMediaKeySessionContext(e), s = this.getKeyIdString(t), n = "cenc";
      this.keyIdToKeySessionPromise[s] = this.generateRequestWithPreferredKeySession(i, n, t.pssh, "expired");
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
    var i;
    const s = e.mediaKeysSession;
    return this.log(`Updating key-session "${s.sessionId}" for keyID ${Se.hexDump(((i = e.decryptdata) == null ? void 0 : i.keyId) || [])}
      } (data length: ${t && t.byteLength})`), s.update(t);
  }
  selectKeySystemFormat(e) {
    const t = Object.keys(e.levelkeys || {});
    return this.keyFormatPromise || (this.log(`Selecting key-system from fragment (sn: ${e.sn} ${e.type}: ${e.level}) key formats ${t.join(", ")}`), this.keyFormatPromise = this.getKeyFormatPromise(t)), this.keyFormatPromise;
  }
  getKeyFormatPromise(e) {
    return new Promise((t, i) => {
      const s = Bt(this.config), n = e.map(Ki).filter((r) => !!r && s.indexOf(r) !== -1);
      return this.getKeySystemSelectionPromise(n).then(({
        keySystem: r
      }) => {
        const o = Vi(r);
        o ? t(o) : i(new Error(`Unable to find format for key-system "${r}"`));
      }).catch(i);
    });
  }
  loadKey(e) {
    const t = e.keyInfo.decryptdata, i = this.getKeyIdString(t), s = `(keyId: ${i} format: "${t.keyFormat}" method: ${t.method} uri: ${t.uri})`;
    this.log(`Starting session for key ${s}`);
    let n = this.keyIdToKeySessionPromise[i];
    return n || (n = this.keyIdToKeySessionPromise[i] = this.getKeySystemForKeyPromise(t).then(({
      keySystem: r,
      mediaKeys: o
    }) => (this.throwIfDestroyed(), this.log(`Handle encrypted media sn: ${e.frag.sn} ${e.frag.type}: ${e.frag.level} using key ${s}`), this.attemptSetMediaKeys(r, o).then(() => {
      this.throwIfDestroyed();
      const l = this.createMediaKeySessionContext({
        keySystem: r,
        mediaKeys: o,
        decryptdata: t
      }), h = "cenc";
      return this.generateRequestWithPreferredKeySession(l, h, t.pssh, "playlist-key");
    }))), n.catch((r) => this.handleError(r))), n;
  }
  throwIfDestroyed(e = "Invalid state") {
    if (!this.hls)
      throw new Error("invalid state");
  }
  handleError(e) {
    this.hls && (this.error(e.message), e instanceof me ? this.hls.trigger(p.ERROR, e.data) : this.hls.trigger(p.ERROR, {
      type: V.KEY_SYSTEM_ERROR,
      details: b.KEY_SYSTEM_NO_KEYS,
      error: e,
      fatal: !0
    }));
  }
  getKeySystemForKeyPromise(e) {
    const t = this.getKeyIdString(e), i = this.keyIdToKeySessionPromise[t];
    if (!i) {
      const s = Ki(e.keyFormat), n = s ? [s] : Bt(this.config);
      return this.attemptKeySystemAccess(n);
    }
    return i;
  }
  getKeySystemSelectionPromise(e) {
    if (e.length || (e = Bt(this.config)), e.length === 0)
      throw new me({
        type: V.KEY_SYSTEM_ERROR,
        details: b.KEY_SYSTEM_NO_CONFIGURED_LICENSE,
        fatal: !0
      }, `Missing key-system license configuration options ${JSON.stringify({
        drmSystems: this.config.drmSystems
      })}`);
    return this.attemptKeySystemAccess(e);
  }
  _onMediaEncrypted(e) {
    const {
      initDataType: t,
      initData: i
    } = e;
    if (this.debug(`"${e.type}" event: init data type: "${t}"`), i === null)
      return;
    let s, n;
    if (t === "sinf" && this.config.drmSystems[ee.FAIRPLAY]) {
      const c = ne(new Uint8Array(i));
      try {
        const u = Si(JSON.parse(c).sinf), d = en(new Uint8Array(u));
        if (!d)
          return;
        s = d.subarray(8, 24), n = ee.FAIRPLAY;
      } catch {
        this.warn('Failed to parse sinf "encrypted" event message initData');
        return;
      }
    } else {
      const c = Yr(i);
      if (c === null)
        return;
      c.version === 0 && c.systemId === Ws.WIDEVINE && c.data && (s = c.data.subarray(8, 24)), n = vr(c.systemId);
    }
    if (!n || !s)
      return;
    const r = Se.hexDump(s), {
      keyIdToKeySessionPromise: o,
      mediaKeySessions: l
    } = this;
    let h = o[r];
    for (let c = 0; c < l.length; c++) {
      const u = l[c], d = u.decryptdata;
      if (d.pssh || !d.keyId)
        continue;
      const f = Se.hexDump(d.keyId);
      if (r === f || d.uri.replace(/-/g, "").indexOf(r) !== -1) {
        h = o[f], delete o[f], d.pssh = new Uint8Array(i), d.keyId = s, h = o[r] = h.then(() => this.generateRequestWithPreferredKeySession(u, t, i, "encrypted-event-key-match"));
        break;
      }
    }
    h || (h = o[r] = this.getKeySystemSelectionPromise([n]).then(({
      keySystem: c,
      mediaKeys: u
    }) => {
      var d;
      this.throwIfDestroyed();
      const f = new st("ISO-23001-7", r, (d = Vi(c)) != null ? d : "");
      return f.pssh = new Uint8Array(i), f.keyId = s, this.attemptSetMediaKeys(c, u).then(() => {
        this.throwIfDestroyed();
        const g = this.createMediaKeySessionContext({
          decryptdata: f,
          keySystem: c,
          mediaKeys: u
        });
        return this.generateRequestWithPreferredKeySession(g, t, i, "encrypted-event-no-match");
      });
    })), h.catch((c) => this.handleError(c));
  }
  _onWaitingForKey(e) {
    this.log(`"${e.type}" event`);
  }
  attemptSetMediaKeys(e, t) {
    const i = this.setMediaKeysQueue.slice();
    this.log(`Setting media-keys for "${e}"`);
    const s = Promise.all(i).then(() => {
      if (!this.media)
        throw new Error("Attempted to set mediaKeys without media element attached");
      return this.media.setMediaKeys(t);
    });
    return this.setMediaKeysQueue.push(s), s.then(() => {
      this.log(`Media-keys set for "${e}"`), i.push(s), this.setMediaKeysQueue = this.setMediaKeysQueue.filter((n) => i.indexOf(n) === -1);
    });
  }
  generateRequestWithPreferredKeySession(e, t, i, s) {
    var n, r;
    const o = (n = this.config.drmSystems) == null || (r = n[e.keySystem]) == null ? void 0 : r.generateRequest;
    if (o)
      try {
        const g = o.call(this.hls, t, i, e);
        if (!g)
          throw new Error("Invalid response from configured generateRequest filter");
        t = g.initDataType, i = e.decryptdata.pssh = g.initData ? new Uint8Array(g.initData) : null;
      } catch (g) {
        var l;
        if (this.warn(g.message), (l = this.hls) != null && l.config.debug)
          throw g;
      }
    if (i === null)
      return this.log(`Skipping key-session request for "${s}" (no initData)`), Promise.resolve(e);
    const h = this.getKeyIdString(e.decryptdata);
    this.log(`Generating key-session request for "${s}": ${h} (init data type: ${t} length: ${i ? i.byteLength : null})`);
    const c = new Fi(), u = e._onmessage = (g) => {
      const m = e.mediaKeysSession;
      if (!m) {
        c.emit("error", new Error("invalid state"));
        return;
      }
      const {
        messageType: T,
        message: y
      } = g;
      this.log(`"${T}" message event for session "${m.sessionId}" message size: ${y.byteLength}`), T === "license-request" || T === "license-renewal" ? this.renewLicense(e, y).catch((E) => {
        this.handleError(E), c.emit("error", E);
      }) : T === "license-release" ? e.keySystem === ee.FAIRPLAY && (this.updateKeySession(e, ai("acknowledged")), this.removeSession(e)) : this.warn(`unhandled media key message type "${T}"`);
    }, d = e._onkeystatuseschange = (g) => {
      if (!e.mediaKeysSession) {
        c.emit("error", new Error("invalid state"));
        return;
      }
      this.onKeyStatusChange(e);
      const T = e.keyStatus;
      c.emit("keyStatus", T), T === "expired" && (this.warn(`${e.keySystem} expired for key ${h}`), this.renewKeySession(e));
    };
    e.mediaKeysSession.addEventListener("message", u), e.mediaKeysSession.addEventListener("keystatuseschange", d);
    const f = new Promise((g, m) => {
      c.on("error", m), c.on("keyStatus", (T) => {
        T.startsWith("usable") ? g() : T === "output-restricted" ? m(new me({
          type: V.KEY_SYSTEM_ERROR,
          details: b.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED,
          fatal: !1
        }, "HDCP level output restricted")) : T === "internal-error" ? m(new me({
          type: V.KEY_SYSTEM_ERROR,
          details: b.KEY_SYSTEM_STATUS_INTERNAL_ERROR,
          fatal: !0
        }, `key status changed to "${T}"`)) : T === "expired" ? m(new Error("key expired while generating request")) : this.warn(`unhandled key status change "${T}"`);
      });
    });
    return e.mediaKeysSession.generateRequest(t, i).then(() => {
      var g;
      this.log(`Request generated for key-session "${(g = e.mediaKeysSession) == null ? void 0 : g.sessionId}" keyId: ${h}`);
    }).catch((g) => {
      throw new me({
        type: V.KEY_SYSTEM_ERROR,
        details: b.KEY_SYSTEM_NO_SESSION,
        error: g,
        fatal: !1
      }, `Error generating key-session request: ${g}`);
    }).then(() => f).catch((g) => {
      throw c.removeAllListeners(), this.removeSession(e), g;
    }).then(() => (c.removeAllListeners(), e));
  }
  onKeyStatusChange(e) {
    e.mediaKeysSession.keyStatuses.forEach((t, i) => {
      this.log(`key status change "${t}" for keyStatuses keyId: ${Se.hexDump("buffer" in i ? new Uint8Array(i.buffer, i.byteOffset, i.byteLength) : new Uint8Array(i))} session keyId: ${Se.hexDump(new Uint8Array(e.decryptdata.keyId || []))} uri: ${e.decryptdata.uri}`), e.keyStatus = t;
    });
  }
  fetchServerCertificate(e) {
    const t = this.config, i = t.loader, s = new i(t), n = this.getServerCertificateUrl(e);
    return n ? (this.log(`Fetching server certificate for "${e}"`), new Promise((r, o) => {
      const l = {
        responseType: "arraybuffer",
        url: n
      }, h = t.certLoadPolicy.default, c = {
        loadPolicy: h,
        timeout: h.maxLoadTimeMs,
        maxRetry: 0,
        retryDelay: 0,
        maxRetryDelay: 0
      }, u = {
        onSuccess: (d, f, g, m) => {
          r(d.data);
        },
        onError: (d, f, g, m) => {
          o(new me({
            type: V.KEY_SYSTEM_ERROR,
            details: b.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED,
            fatal: !0,
            networkDetails: g,
            response: le({
              url: l.url,
              data: void 0
            }, d)
          }, `"${e}" certificate request failed (${n}). Status: ${d.code} (${d.text})`));
        },
        onTimeout: (d, f, g) => {
          o(new me({
            type: V.KEY_SYSTEM_ERROR,
            details: b.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED,
            fatal: !0,
            networkDetails: g,
            response: {
              url: l.url,
              data: void 0
            }
          }, `"${e}" certificate request timed out (${n})`));
        },
        onAbort: (d, f, g) => {
          o(new Error("aborted"));
        }
      };
      s.load(l, c, u);
    })) : Promise.resolve();
  }
  setMediaKeysServerCertificate(e, t, i) {
    return new Promise((s, n) => {
      e.setServerCertificate(i).then((r) => {
        this.log(`setServerCertificate ${r ? "success" : "not supported by CDM"} (${i == null ? void 0 : i.byteLength}) on "${t}"`), s(e);
      }).catch((r) => {
        n(new me({
          type: V.KEY_SYSTEM_ERROR,
          details: b.KEY_SYSTEM_SERVER_CERTIFICATE_UPDATE_FAILED,
          error: r,
          fatal: !0
        }, r.message));
      });
    });
  }
  renewLicense(e, t) {
    return this.requestLicense(e, new Uint8Array(t)).then((i) => this.updateKeySession(e, new Uint8Array(i)).catch((s) => {
      throw new me({
        type: V.KEY_SYSTEM_ERROR,
        details: b.KEY_SYSTEM_SESSION_UPDATE_FAILED,
        error: s,
        fatal: !0
      }, s.message);
    }));
  }
  unpackPlayReadyKeyMessage(e, t) {
    const i = String.fromCharCode.apply(null, new Uint16Array(t.buffer));
    if (!i.includes("PlayReadyKeyMessage"))
      return e.setRequestHeader("Content-Type", "text/xml; charset=utf-8"), t;
    const s = new DOMParser().parseFromString(i, "application/xml"), n = s.querySelectorAll("HttpHeader");
    if (n.length > 0) {
      let c;
      for (let u = 0, d = n.length; u < d; u++) {
        var r, o;
        c = n[u];
        const f = (r = c.querySelector("name")) == null ? void 0 : r.textContent, g = (o = c.querySelector("value")) == null ? void 0 : o.textContent;
        f && g && e.setRequestHeader(f, g);
      }
    }
    const l = s.querySelector("Challenge"), h = l == null ? void 0 : l.textContent;
    if (!h)
      throw new Error("Cannot find <Challenge> in key message");
    return ai(atob(h));
  }
  setupLicenseXHR(e, t, i, s) {
    const n = this.config.licenseXhrSetup;
    return n ? Promise.resolve().then(() => {
      if (!i.decryptdata)
        throw new Error("Key removed");
      return n.call(this.hls, e, t, i, s);
    }).catch((r) => {
      if (!i.decryptdata)
        throw r;
      return e.open("POST", t, !0), n.call(this.hls, e, t, i, s);
    }).then((r) => (e.readyState || e.open("POST", t, !0), {
      xhr: e,
      licenseChallenge: r || s
    })) : (e.open("POST", t, !0), Promise.resolve({
      xhr: e,
      licenseChallenge: s
    }));
  }
  requestLicense(e, t) {
    const i = this.config.keyLoadPolicy.default;
    return new Promise((s, n) => {
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
            const h = this.config.licenseResponseCallback;
            if (h)
              try {
                l = h.call(this.hls, o, r, e);
              } catch (c) {
                this.error(c);
              }
            s(l);
          } else {
            const l = i.errorRetry, h = l ? l.maxNumRetry : 0;
            if (this._requestLicenseFailureCount++, this._requestLicenseFailureCount > h || o.status >= 400 && o.status < 500)
              n(new me({
                type: V.KEY_SYSTEM_ERROR,
                details: b.KEY_SYSTEM_LICENSE_REQUEST_FAILED,
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
              const c = h - this._requestLicenseFailureCount + 1;
              this.warn(`Retrying license request, ${c} attempts left`), this.requestLicense(e, t).then(s, n);
            }
          }
      }, e.licenseXhr && e.licenseXhr.readyState !== XMLHttpRequest.DONE && e.licenseXhr.abort(), e.licenseXhr = o, this.setupLicenseXHR(o, r, e, t).then(({
        xhr: l,
        licenseChallenge: h
      }) => {
        e.keySystem == ee.PLAYREADY && (h = this.unpackPlayReadyKeyMessage(l, h)), l.send(h);
      });
    });
  }
  onMediaAttached(e, t) {
    if (!this.config.emeEnabled)
      return;
    const i = t.media;
    this.media = i, i.addEventListener("encrypted", this.onMediaEncrypted), i.addEventListener("waitingforkey", this.onWaitingForKey);
  }
  onMediaDetached() {
    const e = this.media, t = this.mediaKeySessions;
    e && (e.removeEventListener("encrypted", this.onMediaEncrypted), e.removeEventListener("waitingforkey", this.onWaitingForKey), this.media = null), this._requestLicenseFailureCount = 0, this.setMediaKeysQueue = [], this.mediaKeySessions = [], this.keyIdToKeySessionPromise = {}, st.clearKeyUriToKeyIdMap();
    const i = t.length;
    je.CDMCleanupPromise = Promise.all(t.map((s) => this.removeSession(s)).concat(e == null ? void 0 : e.setMediaKeys(null).catch((s) => {
      this.log(`Could not clear media keys: ${s}`);
    }))).then(() => {
      i && (this.log("finished closing key sessions and clearing media keys"), t.length = 0);
    }).catch((s) => {
      this.log(`Could not close sessions and clear media keys: ${s}`);
    });
  }
  onManifestLoading() {
    this.keyFormatPromise = null;
  }
  onManifestLoaded(e, {
    sessionKeys: t
  }) {
    if (!(!t || !this.config.emeEnabled) && !this.keyFormatPromise) {
      const i = t.reduce((s, n) => (s.indexOf(n.keyFormat) === -1 && s.push(n.keyFormat), s), []);
      this.log(`Selecting key-system from session-keys ${i.join(", ")}`), this.keyFormatPromise = this.getKeyFormatPromise(i);
    }
  }
  removeSession(e) {
    const {
      mediaKeysSession: t,
      licenseXhr: i
    } = e;
    if (t) {
      this.log(`Remove licenses and keys and close session ${t.sessionId}`), e._onmessage && (t.removeEventListener("message", e._onmessage), e._onmessage = void 0), e._onkeystatuseschange && (t.removeEventListener("keystatuseschange", e._onkeystatuseschange), e._onkeystatuseschange = void 0), i && i.readyState !== XMLHttpRequest.DONE && i.abort(), e.mediaKeysSession = e.decryptdata = e.licenseXhr = void 0;
      const s = this.mediaKeySessions.indexOf(e);
      return s > -1 && this.mediaKeySessions.splice(s, 1), t.remove().catch((n) => {
        this.log(`Could not remove session: ${n}`);
      }).then(() => t.close()).catch((n) => {
        this.log(`Could not close session: ${n}`);
      });
    }
  }
}
je.CDMCleanupPromise = void 0;
class me extends Error {
  constructor(e, t) {
    super(t), this.data = void 0, e.error || (e.error = new Error(t)), this.data = e, e.err = e.error;
  }
}
var ue;
(function(a) {
  a.MANIFEST = "m", a.AUDIO = "a", a.VIDEO = "v", a.MUXED = "av", a.INIT = "i", a.CAPTION = "c", a.TIMED_TEXT = "tt", a.KEY = "k", a.OTHER = "o";
})(ue || (ue = {}));
var pi;
(function(a) {
  a.DASH = "d", a.HLS = "h", a.SMOOTH = "s", a.OTHER = "o";
})(pi || (pi = {}));
var Ne;
(function(a) {
  a.OBJECT = "CMCD-Object", a.REQUEST = "CMCD-Request", a.SESSION = "CMCD-Session", a.STATUS = "CMCD-Status";
})(Ne || (Ne = {}));
const pl = {
  [Ne.OBJECT]: ["br", "d", "ot", "tb"],
  [Ne.REQUEST]: ["bl", "dl", "mtp", "nor", "nrr", "su"],
  [Ne.SESSION]: ["cid", "pr", "sf", "sid", "st", "v"],
  [Ne.STATUS]: ["bs", "rtp"]
};
class Je {
  constructor(e, t) {
    this.value = void 0, this.params = void 0, Array.isArray(e) && (e = e.map((i) => i instanceof Je ? i : new Je(i))), this.value = e, this.params = t;
  }
}
class Kn {
  constructor(e) {
    this.description = void 0, this.description = e;
  }
}
const Tl = "Dict";
function yl(a) {
  return Array.isArray(a) ? JSON.stringify(a) : a instanceof Map ? "Map{}" : a instanceof Set ? "Set{}" : typeof a == "object" ? JSON.stringify(a) : String(a);
}
function El(a, e, t, i) {
  return new Error(`failed to ${a} "${yl(e)}" as ${t}`, {
    cause: i
  });
}
const Ms = "Bare Item", vl = "Boolean", xl = "Byte Sequence", Sl = "Decimal", Al = "Integer";
function Ll(a) {
  return a < -999999999999999 || 999999999999999 < a;
}
const Rl = /[\x00-\x1f\x7f]+/, bl = "Token", Il = "Key";
function Ie(a, e, t) {
  return El("serialize", a, e, t);
}
function Cl(a) {
  if (typeof a != "boolean")
    throw Ie(a, vl);
  return a ? "?1" : "?0";
}
function Dl(a) {
  return btoa(String.fromCharCode(...a));
}
function wl(a) {
  if (ArrayBuffer.isView(a) === !1)
    throw Ie(a, xl);
  return `:${Dl(a)}:`;
}
function Vn(a) {
  if (Ll(a))
    throw Ie(a, Al);
  return a.toString();
}
function kl(a) {
  return `@${Vn(a.getTime() / 1e3)}`;
}
function Hn(a, e) {
  if (a < 0)
    return -Hn(-a, e);
  const t = Math.pow(10, e);
  if (Math.abs(a * t % 1 - 0.5) < Number.EPSILON) {
    const s = Math.floor(a * t);
    return (s % 2 === 0 ? s : s + 1) / t;
  } else
    return Math.round(a * t) / t;
}
function _l(a) {
  const e = Hn(a, 3);
  if (Math.floor(Math.abs(e)).toString().length > 12)
    throw Ie(a, Sl);
  const t = e.toString();
  return t.includes(".") ? t : `${t}.0`;
}
const Pl = "String";
function Fl(a) {
  if (Rl.test(a))
    throw Ie(a, Pl);
  return `"${a.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}
function Ol(a) {
  return a.description || a.toString().slice(7, -1);
}
function Ns(a) {
  const e = Ol(a);
  if (/^([a-zA-Z*])([!#$%&'*+\-.^_`|~\w:/]*)$/.test(e) === !1)
    throw Ie(e, bl);
  return e;
}
function Ti(a) {
  switch (typeof a) {
    case "number":
      if (!M(a))
        throw Ie(a, Ms);
      return Number.isInteger(a) ? Vn(a) : _l(a);
    case "string":
      return Fl(a);
    case "symbol":
      return Ns(a);
    case "boolean":
      return Cl(a);
    case "object":
      if (a instanceof Date)
        return kl(a);
      if (a instanceof Uint8Array)
        return wl(a);
      if (a instanceof Kn)
        return Ns(a);
    default:
      throw Ie(a, Ms);
  }
}
function yi(a) {
  if (/^[a-z*][a-z0-9\-_.*]*$/.test(a) === !1)
    throw Ie(a, Il);
  return a;
}
function Ui(a) {
  return a == null ? "" : Object.entries(a).map(([e, t]) => t === !0 ? `;${yi(e)}` : `;${yi(e)}=${Ti(t)}`).join("");
}
function Wn(a) {
  return a instanceof Je ? `${Ti(a.value)}${Ui(a.params)}` : Ti(a);
}
function Ml(a) {
  return `(${a.value.map(Wn).join(" ")})${Ui(a.params)}`;
}
function Nl(a, e = {
  whitespace: !0
}) {
  if (typeof a != "object")
    throw Ie(a, Tl);
  const t = a instanceof Map ? a.entries() : Object.entries(a), i = e != null && e.whitespace ? " " : "";
  return Array.from(t).map(([s, n]) => {
    n instanceof Je || (n = new Je(n));
    let r = yi(s);
    return n.value === !0 ? r += Ui(n.params) : (r += "=", Array.isArray(n.value) ? r += Ml(n) : r += Wn(n)), r;
  }).join(`,${i}`);
}
function Ul(a, e) {
  return Nl(a, e);
}
const Bl = (a) => a === "ot" || a === "sf" || a === "st", $l = (a) => typeof a == "number" ? M(a) : a != null && a !== "" && a !== !1;
function Gl(a, e) {
  const t = new URL(a), i = new URL(e);
  if (t.origin !== i.origin)
    return a;
  const s = t.pathname.split("/").slice(1), n = i.pathname.split("/").slice(1, -1);
  for (; s[0] === n[0]; )
    s.shift(), n.shift();
  for (; n.length; )
    n.shift(), s.unshift("..");
  return s.join("/");
}
function Kl() {
  try {
    return crypto.randomUUID();
  } catch {
    try {
      const e = URL.createObjectURL(new Blob()), t = e.toString();
      return URL.revokeObjectURL(e), t.slice(t.lastIndexOf("/") + 1);
    } catch {
      let t = (/* @__PURE__ */ new Date()).getTime();
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (s) => {
        const n = (t + Math.random() * 16) % 16 | 0;
        return t = Math.floor(t / 16), (s == "x" ? n : n & 3 | 8).toString(16);
      });
    }
  }
}
const St = (a) => Math.round(a), Vl = (a, e) => (e != null && e.baseUrl && (a = Gl(a, e.baseUrl)), encodeURIComponent(a)), mt = (a) => St(a / 100) * 100, Hl = {
  /**
   * Bitrate (kbps) rounded integer
   */
  br: St,
  /**
   * Duration (milliseconds) rounded integer
   */
  d: St,
  /**
   * Buffer Length (milliseconds) rounded nearest 100ms
   */
  bl: mt,
  /**
   * Deadline (milliseconds) rounded nearest 100ms
   */
  dl: mt,
  /**
   * Measured Throughput (kbps) rounded nearest 100kbps
   */
  mtp: mt,
  /**
   * Next Object Request URL encoded
   */
  nor: Vl,
  /**
   * Requested maximum throughput (kbps) rounded nearest 100kbps
   */
  rtp: mt,
  /**
   * Top Bitrate (kbps) rounded integer
   */
  tb: St
};
function Wl(a, e) {
  const t = {};
  if (a == null || typeof a != "object")
    return t;
  const i = Object.keys(a).sort(), s = se({}, Hl, e == null ? void 0 : e.formatters), n = e == null ? void 0 : e.filter;
  return i.forEach((r) => {
    if (n != null && n(r))
      return;
    let o = a[r];
    const l = s[r];
    l && (o = l(o, e)), !(r === "v" && o === 1) && (r == "pr" && o === 1 || $l(o) && (Bl(r) && typeof o == "string" && (o = new Kn(o)), t[r] = o));
  }), t;
}
function Yn(a, e = {}) {
  return a ? Ul(Wl(a, e), se({
    whitespace: !1
  }, e)) : "";
}
function Yl(a, e = {}) {
  if (!a)
    return {};
  const t = Object.entries(a), i = Object.entries(pl).concat(Object.entries((e == null ? void 0 : e.customHeaderMap) || {})), s = t.reduce((n, r) => {
    var o, l;
    const [h, c] = r, u = ((o = i.find((d) => d[1].includes(h))) == null ? void 0 : o[0]) || Ne.REQUEST;
    return (l = n[u]) != null || (n[u] = {}), n[u][h] = c, n;
  }, {});
  return Object.entries(s).reduce((n, [r, o]) => (n[r] = Yn(o, e), n), {});
}
function ql(a, e, t) {
  return se(a, Yl(e, t));
}
const jl = "CMCD";
function zl(a, e = {}) {
  if (!a)
    return "";
  const t = Yn(a, e);
  return `${jl}=${encodeURIComponent(t)}`;
}
const Us = /CMCD=[^&#]+/;
function Xl(a, e, t) {
  const i = zl(e, t);
  if (!i)
    return a;
  if (Us.test(a))
    return a.replace(Us, i);
  const s = a.includes("?") ? "&" : "?";
  return `${a}${s}${i}`;
}
class Ql {
  // eslint-disable-line no-restricted-globals
  constructor(e) {
    this.hls = void 0, this.config = void 0, this.media = void 0, this.sid = void 0, this.cid = void 0, this.useHeaders = !1, this.includeKeys = void 0, this.initialized = !1, this.starved = !1, this.buffering = !0, this.audioBuffer = void 0, this.videoBuffer = void 0, this.onWaiting = () => {
      this.initialized && (this.starved = !0), this.buffering = !0;
    }, this.onPlaying = () => {
      this.initialized || (this.initialized = !0), this.buffering = !1;
    }, this.applyPlaylistData = (s) => {
      try {
        this.apply(s, {
          ot: ue.MANIFEST,
          su: !this.initialized
        });
      } catch (n) {
        A.warn("Could not generate manifest CMCD data.", n);
      }
    }, this.applyFragmentData = (s) => {
      try {
        const n = s.frag, r = this.hls.levels[n.level], o = this.getObjectType(n), l = {
          d: n.duration * 1e3,
          ot: o
        };
        (o === ue.VIDEO || o === ue.AUDIO || o == ue.MUXED) && (l.br = r.bitrate / 1e3, l.tb = this.getTopBandwidth(o) / 1e3, l.bl = this.getBufferLength(o)), this.apply(s, l);
      } catch (n) {
        A.warn("Could not generate segment CMCD data.", n);
      }
    }, this.hls = e;
    const t = this.config = e.config, {
      cmcd: i
    } = t;
    i != null && (t.pLoader = this.createPlaylistLoader(), t.fLoader = this.createFragmentLoader(), this.sid = i.sessionId || Kl(), this.cid = i.contentId, this.useHeaders = i.useHeaders === !0, this.includeKeys = i.includeKeys, this.registerListeners());
  }
  registerListeners() {
    const e = this.hls;
    e.on(p.MEDIA_ATTACHED, this.onMediaAttached, this), e.on(p.MEDIA_DETACHED, this.onMediaDetached, this), e.on(p.BUFFER_CREATED, this.onBufferCreated, this);
  }
  unregisterListeners() {
    const e = this.hls;
    e.off(p.MEDIA_ATTACHED, this.onMediaAttached, this), e.off(p.MEDIA_DETACHED, this.onMediaDetached, this), e.off(p.BUFFER_CREATED, this.onBufferCreated, this);
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
    var i, s;
    this.audioBuffer = (i = t.tracks.audio) == null ? void 0 : i.buffer, this.videoBuffer = (s = t.tracks.video) == null ? void 0 : s.buffer;
  }
  /**
   * Create baseline CMCD data
   */
  createData() {
    var e;
    return {
      v: 1,
      sf: pi.HLS,
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
    se(t, this.createData());
    const i = t.ot === ue.INIT || t.ot === ue.VIDEO || t.ot === ue.MUXED;
    this.starved && i && (t.bs = !0, t.su = !0, this.starved = !1), t.su == null && (t.su = this.buffering);
    const {
      includeKeys: s
    } = this;
    s && (t = Object.keys(t).reduce((n, r) => (s.includes(r) && (n[r] = t[r]), n), {})), this.useHeaders ? (e.headers || (e.headers = {}), ql(e.headers, t)) : e.url = Xl(e.url, t);
  }
  /**
   * The CMCD object type.
   */
  getObjectType(e) {
    const {
      type: t
    } = e;
    if (t === "subtitle")
      return ue.TIMED_TEXT;
    if (e.sn === "initSegment")
      return ue.INIT;
    if (t === "audio")
      return ue.AUDIO;
    if (t === "main")
      return this.hls.audioTracks.length ? ue.VIDEO : ue.MUXED;
  }
  /**
   * Get the highest bitrate.
   */
  getTopBandwidth(e) {
    let t = 0, i;
    const s = this.hls;
    if (e === ue.AUDIO)
      i = s.audioTracks;
    else {
      const n = s.maxAutoLevel, r = n > -1 ? n + 1 : s.levels.length;
      i = s.levels.slice(0, r);
    }
    for (const n of i)
      n.bitrate > t && (t = n.bitrate);
    return t > 0 ? t : NaN;
  }
  /**
   * Get the buffer length for a media type in milliseconds
   */
  getBufferLength(e) {
    const t = this.hls.media, i = e === ue.AUDIO ? this.audioBuffer : this.videoBuffer;
    return !i || !t ? NaN : Z.bufferInfo(i, t.currentTime, this.config.maxBufferHole).len * 1e3;
  }
  /**
   * Create a playlist loader
   */
  createPlaylistLoader() {
    const {
      pLoader: e
    } = this.config, t = this.applyPlaylistData, i = e || this.config.loader;
    return class {
      constructor(n) {
        this.loader = void 0, this.loader = new i(n);
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
    } = this.config, t = this.applyFragmentData, i = e || this.config.loader;
    return class {
      constructor(n) {
        this.loader = void 0, this.loader = new i(n);
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
const Jl = 3e5;
class Zl {
  constructor(e) {
    this.hls = void 0, this.log = void 0, this.loader = null, this.uri = null, this.pathwayId = ".", this.pathwayPriority = null, this.timeToLoad = 300, this.reloadTimer = -1, this.updated = 0, this.started = !1, this.enabled = !0, this.levels = null, this.audioTracks = null, this.subtitleTracks = null, this.penalizedPathways = {}, this.hls = e, this.log = A.log.bind(A, "[content-steering]:"), this.registerListeners();
  }
  registerListeners() {
    const e = this.hls;
    e.on(p.MANIFEST_LOADING, this.onManifestLoading, this), e.on(p.MANIFEST_LOADED, this.onManifestLoaded, this), e.on(p.MANIFEST_PARSED, this.onManifestParsed, this), e.on(p.ERROR, this.onError, this);
  }
  unregisterListeners() {
    const e = this.hls;
    e && (e.off(p.MANIFEST_LOADING, this.onManifestLoading, this), e.off(p.MANIFEST_LOADED, this.onManifestLoaded, this), e.off(p.MANIFEST_PARSED, this.onManifestParsed, this), e.off(p.ERROR, this.onError, this));
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
    t && (this.levels = t.filter((i) => i !== e));
  }
  onManifestLoading() {
    this.stopLoad(), this.enabled = !0, this.timeToLoad = 300, this.updated = 0, this.uri = null, this.pathwayId = ".", this.levels = this.audioTracks = this.subtitleTracks = null;
  }
  onManifestLoaded(e, t) {
    const {
      contentSteering: i
    } = t;
    i !== null && (this.pathwayId = i.pathwayId, this.uri = i.uri, this.started && this.startLoad());
  }
  onManifestParsed(e, t) {
    this.audioTracks = t.audioTracks, this.subtitleTracks = t.subtitleTracks;
  }
  onError(e, t) {
    const {
      errorAction: i
    } = t;
    if ((i == null ? void 0 : i.action) === ce.SendAlternateToPenaltyBox && i.flags === ye.MoveAllAlternatesMatchingHost) {
      const s = this.levels;
      let n = this.pathwayPriority, r = this.pathwayId;
      if (t.context) {
        const {
          groupId: o,
          pathwayId: l,
          type: h
        } = t.context;
        o && s ? r = this.getPathwayForGroupId(o, h, r) : l && (r = l);
      }
      r in this.penalizedPathways || (this.penalizedPathways[r] = performance.now()), !n && s && (n = s.reduce((o, l) => (o.indexOf(l.pathwayId) === -1 && o.push(l.pathwayId), o), [])), n && n.length > 1 && (this.updatePathwayPriority(n), i.resolved = this.pathwayId !== r), i.resolved || A.warn(`Could not resolve ${t.details} ("${t.error.message}") with content-steering for Pathway: ${r} levels: ${s && s.length} priorities: ${JSON.stringify(n)} penalized: ${JSON.stringify(this.penalizedPathways)}`);
    }
  }
  filterParsedLevels(e) {
    this.levels = e;
    let t = this.getLevelsForPathway(this.pathwayId);
    if (t.length === 0) {
      const i = e[0].pathwayId;
      this.log(`No levels found in Pathway ${this.pathwayId}. Setting initial Pathway to "${i}"`), t = this.getLevelsForPathway(i), this.pathwayId = i;
    }
    return t.length !== e.length ? (this.log(`Found ${t.length}/${e.length} levels in Pathway "${this.pathwayId}"`), t) : e;
  }
  getLevelsForPathway(e) {
    return this.levels === null ? [] : this.levels.filter((t) => e === t.pathwayId);
  }
  updatePathwayPriority(e) {
    this.pathwayPriority = e;
    let t;
    const i = this.penalizedPathways, s = performance.now();
    Object.keys(i).forEach((n) => {
      s - i[n] > Jl && delete i[n];
    });
    for (let n = 0; n < e.length; n++) {
      const r = e[n];
      if (r in i)
        continue;
      if (r === this.pathwayId)
        return;
      const o = this.hls.nextLoadLevel, l = this.hls.levels[o];
      if (t = this.getLevelsForPathway(r), t.length > 0) {
        this.log(`Setting Pathway to "${r}"`), this.pathwayId = r, un(t), this.hls.trigger(p.LEVELS_UPDATED, {
          levels: t
        });
        const h = this.hls.levels[o];
        l && h && this.levels && (h.attrs["STABLE-VARIANT-ID"] !== l.attrs["STABLE-VARIANT-ID"] && h.bitrate !== l.bitrate && this.log(`Unstable Pathways change from bitrate ${l.bitrate} to ${h.bitrate}`), this.hls.nextLoadLevel = o);
        break;
      }
    }
  }
  getPathwayForGroupId(e, t, i) {
    const s = this.getLevelsForPathway(i).concat(this.levels || []);
    for (let n = 0; n < s.length; n++)
      if (t === Y.AUDIO_TRACK && s[n].hasAudioGroup(e) || t === Y.SUBTITLE_TRACK && s[n].hasSubtitleGroup(e))
        return s[n].pathwayId;
    return i;
  }
  clonePathways(e) {
    const t = this.levels;
    if (!t)
      return;
    const i = {}, s = {};
    e.forEach((n) => {
      const {
        ID: r,
        "BASE-ID": o,
        "URI-REPLACEMENT": l
      } = n;
      if (t.some((c) => c.pathwayId === r))
        return;
      const h = this.getLevelsForPathway(o).map((c) => {
        const u = new te(c.attrs);
        u["PATHWAY-ID"] = r;
        const d = u.AUDIO && `${u.AUDIO}_clone_${r}`, f = u.SUBTITLES && `${u.SUBTITLES}_clone_${r}`;
        d && (i[u.AUDIO] = d, u.AUDIO = d), f && (s[u.SUBTITLES] = f, u.SUBTITLES = f);
        const g = qn(c.uri, u["STABLE-VARIANT-ID"], "PER-VARIANT-URIS", l), m = new Xe({
          attrs: u,
          audioCodec: c.audioCodec,
          bitrate: c.bitrate,
          height: c.height,
          name: c.name,
          url: g,
          videoCodec: c.videoCodec,
          width: c.width
        });
        if (c.audioGroups)
          for (let T = 1; T < c.audioGroups.length; T++)
            m.addGroupId("audio", `${c.audioGroups[T]}_clone_${r}`);
        if (c.subtitleGroups)
          for (let T = 1; T < c.subtitleGroups.length; T++)
            m.addGroupId("text", `${c.subtitleGroups[T]}_clone_${r}`);
        return m;
      });
      t.push(...h), Bs(this.audioTracks, i, l, r), Bs(this.subtitleTracks, s, l, r);
    });
  }
  loadSteeringManifest(e) {
    const t = this.hls.config, i = t.loader;
    this.loader && this.loader.destroy(), this.loader = new i(t);
    let s;
    try {
      s = new self.URL(e);
    } catch {
      this.enabled = !1, this.log(`Failed to parse Steering Manifest URI: ${e}`);
      return;
    }
    if (s.protocol !== "data:") {
      const c = (this.hls.bandwidthEstimate || t.abrEwmaDefaultEstimate) | 0;
      s.searchParams.set("_HLS_pathway", this.pathwayId), s.searchParams.set("_HLS_throughput", "" + c);
    }
    const n = {
      responseType: "json",
      url: s.href
    }, r = t.steeringManifestLoadPolicy.default, o = r.errorRetry || r.timeoutRetry || {}, l = {
      loadPolicy: r,
      timeout: r.maxLoadTimeMs,
      maxRetry: o.maxNumRetry || 0,
      retryDelay: o.retryDelayMs || 0,
      maxRetryDelay: o.maxRetryDelayMs || 0
    }, h = {
      onSuccess: (c, u, d, f) => {
        this.log(`Loaded steering manifest: "${s}"`);
        const g = c.data;
        if (g.VERSION !== 1) {
          this.log(`Steering VERSION ${g.VERSION} not supported!`);
          return;
        }
        this.updated = performance.now(), this.timeToLoad = g.TTL;
        const {
          "RELOAD-URI": m,
          "PATHWAY-CLONES": T,
          "PATHWAY-PRIORITY": y
        } = g;
        if (m)
          try {
            this.uri = new self.URL(m, s).href;
          } catch {
            this.enabled = !1, this.log(`Failed to parse Steering Manifest RELOAD-URI: ${m}`);
            return;
          }
        this.scheduleRefresh(this.uri || d.url), T && this.clonePathways(T);
        const E = {
          steeringManifest: g,
          url: s.toString()
        };
        this.hls.trigger(p.STEERING_MANIFEST_LOADED, E), y && this.updatePathwayPriority(y);
      },
      onError: (c, u, d, f) => {
        if (this.log(`Error loading steering manifest: ${c.code} ${c.text} (${u.url})`), this.stopLoad(), c.code === 410) {
          this.enabled = !1, this.log(`Steering manifest ${u.url} no longer available`);
          return;
        }
        let g = this.timeToLoad * 1e3;
        if (c.code === 429) {
          const m = this.loader;
          if (typeof (m == null ? void 0 : m.getResponseHeader) == "function") {
            const T = m.getResponseHeader("Retry-After");
            T && (g = parseFloat(T) * 1e3);
          }
          this.log(`Steering manifest ${u.url} rate limited`);
          return;
        }
        this.scheduleRefresh(this.uri || u.url, g);
      },
      onTimeout: (c, u, d) => {
        this.log(`Timeout loading steering manifest (${u.url})`), this.scheduleRefresh(this.uri || u.url);
      }
    };
    this.log(`Requesting steering manifest: ${s}`), this.loader.load(n, l, h);
  }
  scheduleRefresh(e, t = this.timeToLoad * 1e3) {
    this.clearTimeout(), this.reloadTimer = self.setTimeout(() => {
      var i;
      const s = (i = this.hls) == null ? void 0 : i.media;
      if (s && !s.ended) {
        this.loadSteeringManifest(e);
        return;
      }
      this.scheduleRefresh(e, this.timeToLoad * 1e3);
    }, t);
  }
}
function Bs(a, e, t, i) {
  a && Object.keys(e).forEach((s) => {
    const n = a.filter((r) => r.groupId === s).map((r) => {
      const o = se({}, r);
      return o.details = void 0, o.attrs = new te(o.attrs), o.url = o.attrs.URI = qn(r.url, r.attrs["STABLE-RENDITION-ID"], "PER-RENDITION-URIS", t), o.groupId = o.attrs["GROUP-ID"] = e[s], o.attrs["PATHWAY-ID"] = i, o;
    });
    a.push(...n);
  });
}
function qn(a, e, t, i) {
  const {
    HOST: s,
    PARAMS: n,
    [t]: r
  } = i;
  let o;
  e && (o = r == null ? void 0 : r[e], o && (a = o));
  const l = new self.URL(a);
  return s && !o && (l.host = s), n && Object.keys(n).sort().forEach((h) => {
    h && l.searchParams.set(h, n[h]);
  }), l.href;
}
const eh = /^age:\s*[\d.]+\s*$/im;
class jn {
  constructor(e) {
    this.xhrSetup = void 0, this.requestTimeout = void 0, this.retryTimeout = void 0, this.retryDelay = void 0, this.config = null, this.callbacks = null, this.context = null, this.loader = null, this.stats = void 0, this.xhrSetup = e && e.xhrSetup || null, this.stats = new Ot(), this.retryDelay = 0;
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
  load(e, t, i) {
    if (this.stats.loading.start)
      throw new Error("Loader can only be used once.");
    this.stats.loading.start = self.performance.now(), this.context = e, this.config = t, this.callbacks = i, this.loadInternal();
  }
  loadInternal() {
    const {
      config: e,
      context: t
    } = this;
    if (!e || !t)
      return;
    const i = this.loader = new self.XMLHttpRequest(), s = this.stats;
    s.loading.first = 0, s.loaded = 0, s.aborted = !1;
    const n = this.xhrSetup;
    n ? Promise.resolve().then(() => {
      if (!(this.loader !== i || this.stats.aborted))
        return n(i, t.url);
    }).catch((r) => {
      if (!(this.loader !== i || this.stats.aborted))
        return i.open("GET", t.url, !0), n(i, t.url);
    }).then(() => {
      this.loader !== i || this.stats.aborted || this.openAndSendXhr(i, t, e);
    }).catch((r) => {
      this.callbacks.onError({
        code: i.status,
        text: r.message
      }, t, i, s);
    }) : this.openAndSendXhr(i, t, e);
  }
  openAndSendXhr(e, t, i) {
    e.readyState || e.open("GET", t.url, !0);
    const s = t.headers, {
      maxTimeToFirstByteMs: n,
      maxLoadTimeMs: r
    } = i.loadPolicy;
    if (s)
      for (const o in s)
        e.setRequestHeader(o, s[o]);
    t.rangeEnd && e.setRequestHeader("Range", "bytes=" + t.rangeStart + "-" + (t.rangeEnd - 1)), e.onreadystatechange = this.readystatechange.bind(this), e.onprogress = this.loadprogress.bind(this), e.responseType = t.responseType, self.clearTimeout(this.requestTimeout), i.timeout = n && M(n) ? n : r, this.requestTimeout = self.setTimeout(this.loadtimeout.bind(this), i.timeout), e.send();
  }
  readystatechange() {
    const {
      context: e,
      loader: t,
      stats: i
    } = this;
    if (!e || !t)
      return;
    const s = t.readyState, n = this.config;
    if (!i.aborted && s >= 2 && (i.loading.first === 0 && (i.loading.first = Math.max(self.performance.now(), i.loading.start), n.timeout !== n.loadPolicy.maxLoadTimeMs && (self.clearTimeout(this.requestTimeout), n.timeout = n.loadPolicy.maxLoadTimeMs, this.requestTimeout = self.setTimeout(this.loadtimeout.bind(this), n.loadPolicy.maxLoadTimeMs - (i.loading.first - i.loading.start)))), s === 4)) {
      self.clearTimeout(this.requestTimeout), t.onreadystatechange = null, t.onprogress = null;
      const r = t.status, o = t.responseType !== "text";
      if (r >= 200 && r < 300 && (o && t.response || t.responseText !== null)) {
        i.loading.end = Math.max(self.performance.now(), i.loading.first);
        const l = o ? t.response : t.responseText, h = t.responseType === "arraybuffer" ? l.byteLength : l.length;
        if (i.loaded = i.total = h, i.bwEstimate = i.total * 8e3 / (i.loading.end - i.loading.first), !this.callbacks)
          return;
        const c = this.callbacks.onProgress;
        if (c && c(i, e, l, t), !this.callbacks)
          return;
        const u = {
          url: t.responseURL,
          data: l,
          code: r
        };
        this.callbacks.onSuccess(u, i, e, t);
      } else {
        const l = n.loadPolicy.errorRetry, h = i.retry, c = {
          url: e.url,
          data: void 0,
          code: r
        };
        wt(l, h, !1, c) ? this.retry(l) : (A.error(`${r} while loading ${e.url}`), this.callbacks.onError({
          code: r,
          text: t.statusText
        }, e, t, i));
      }
    }
  }
  loadtimeout() {
    if (!this.config)
      return;
    const e = this.config.loadPolicy.timeoutRetry, t = this.stats.retry;
    if (wt(e, t, !0))
      this.retry(e);
    else {
      var i;
      A.warn(`timeout while loading ${(i = this.context) == null ? void 0 : i.url}`);
      const s = this.callbacks;
      s && (this.abortInternal(), s.onTimeout(this.stats, this.context, this.loader));
    }
  }
  retry(e) {
    const {
      context: t,
      stats: i
    } = this;
    this.retryDelay = Ri(e, i.retry), i.retry++, A.warn(`${status ? "HTTP Status " + status : "Timeout"} while loading ${t == null ? void 0 : t.url}, retrying ${i.retry}/${e.maxNumRetry} in ${this.retryDelay}ms`), this.abortInternal(), this.loader = null, self.clearTimeout(this.retryTimeout), this.retryTimeout = self.setTimeout(this.loadInternal.bind(this), this.retryDelay);
  }
  loadprogress(e) {
    const t = this.stats;
    t.loaded = e.loaded, e.lengthComputable && (t.total = e.total);
  }
  getCacheAge() {
    let e = null;
    if (this.loader && eh.test(this.loader.getAllResponseHeaders())) {
      const t = this.loader.getResponseHeader("age");
      e = t ? parseFloat(t) : null;
    }
    return e;
  }
  getResponseHeader(e) {
    return this.loader && new RegExp(`^${e}:\\s*[\\d.]+\\s*$`, "im").test(this.loader.getAllResponseHeaders()) ? this.loader.getResponseHeader(e) : null;
  }
}
function th() {
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
const ih = /(\d+)-(\d+)\/(\d+)/;
class $s {
  constructor(e) {
    this.fetchSetup = void 0, this.requestTimeout = void 0, this.request = null, this.response = null, this.controller = void 0, this.context = null, this.config = null, this.callbacks = null, this.stats = void 0, this.loader = null, this.fetchSetup = e.fetchSetup || ah, this.controller = new self.AbortController(), this.stats = new Ot();
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
  load(e, t, i) {
    const s = this.stats;
    if (s.loading.start)
      throw new Error("Loader can only be used once.");
    s.loading.start = self.performance.now();
    const n = sh(e, this.controller.signal), r = i.onProgress, o = e.responseType === "arraybuffer", l = o ? "byteLength" : "length", {
      maxTimeToFirstByteMs: h,
      maxLoadTimeMs: c
    } = t.loadPolicy;
    this.context = e, this.config = t, this.callbacks = i, this.request = this.fetchSetup(e, n), self.clearTimeout(this.requestTimeout), t.timeout = h && M(h) ? h : c, this.requestTimeout = self.setTimeout(() => {
      this.abortInternal(), i.onTimeout(s, e, this.response);
    }, t.timeout), self.fetch(this.request).then((u) => {
      this.response = this.loader = u;
      const d = Math.max(self.performance.now(), s.loading.start);
      if (self.clearTimeout(this.requestTimeout), t.timeout = c, this.requestTimeout = self.setTimeout(() => {
        this.abortInternal(), i.onTimeout(s, e, this.response);
      }, c - (d - s.loading.start)), !u.ok) {
        const {
          status: f,
          statusText: g
        } = u;
        throw new oh(g || "fetch, bad network response", f, u);
      }
      return s.loading.first = d, s.total = rh(u.headers) || s.total, r && M(t.highWaterMark) ? this.loadProgressively(u, s, e, t.highWaterMark, r) : o ? u.arrayBuffer() : e.responseType === "json" ? u.json() : u.text();
    }).then((u) => {
      const d = this.response;
      if (!d)
        throw new Error("loader destroyed");
      self.clearTimeout(this.requestTimeout), s.loading.end = Math.max(self.performance.now(), s.loading.first);
      const f = u[l];
      f && (s.loaded = s.total = f);
      const g = {
        url: d.url,
        data: u,
        code: d.status
      };
      r && !M(t.highWaterMark) && r(s, e, u, d), i.onSuccess(g, s, e, d);
    }).catch((u) => {
      if (self.clearTimeout(this.requestTimeout), s.aborted)
        return;
      const d = u && u.code || 0, f = u ? u.message : null;
      i.onError({
        code: d,
        text: f
      }, e, u ? u.details : null, s);
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
  loadProgressively(e, t, i, s = 0, n) {
    const r = new mn(), o = e.body.getReader(), l = () => o.read().then((h) => {
      if (h.done)
        return r.dataLength && n(t, i, r.flush(), e), Promise.resolve(new ArrayBuffer(0));
      const c = h.value, u = c.length;
      return t.loaded += u, u < s || r.dataLength ? (r.push(c), r.dataLength >= s && n(t, i, r.flush(), e)) : n(t, i, c, e), l();
    }).catch(() => Promise.reject());
    return l();
  }
}
function sh(a, e) {
  const t = {
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
    signal: e,
    headers: new self.Headers(se({}, a.headers))
  };
  return a.rangeEnd && t.headers.set("Range", "bytes=" + a.rangeStart + "-" + String(a.rangeEnd - 1)), t;
}
function nh(a) {
  const e = ih.exec(a);
  if (e)
    return parseInt(e[2]) - parseInt(e[1]) + 1;
}
function rh(a) {
  const e = a.get("Content-Range");
  if (e) {
    const i = nh(e);
    if (M(i))
      return i;
  }
  const t = a.get("Content-Length");
  if (t)
    return parseInt(t);
}
function ah(a, e) {
  return new self.Request(a.url, e);
}
class oh extends Error {
  constructor(e, t, i) {
    super(e), this.code = void 0, this.details = void 0, this.code = t, this.details = i;
  }
}
const lh = /\s/, hh = {
  newCue(a, e, t, i) {
    const s = [];
    let n, r, o, l, h;
    const c = self.VTTCue || self.TextTrackCue;
    for (let d = 0; d < i.rows.length; d++)
      if (n = i.rows[d], o = !0, l = 0, h = "", !n.isEmpty()) {
        var u;
        for (let m = 0; m < n.chars.length; m++)
          lh.test(n.chars[m].uchar) && o ? l++ : (h += n.chars[m].uchar, o = !1);
        n.cueStartTime = e, e === t && (t += 1e-4), l >= 16 ? l-- : l++;
        const f = Nn(h.trim()), g = Mi(e, t, f);
        a != null && (u = a.cues) != null && u.getCueById(g) || (r = new c(e, t, f), r.id = g, r.line = d + 1, r.align = "left", r.position = 10 + Math.min(80, Math.floor(l * 8 / 32) * 10), s.push(r));
      }
    return a && s.length && (s.sort((d, f) => d.line === "auto" || f.line === "auto" ? 0 : d.line > 8 && f.line > 8 ? f.line - d.line : d.line - f.line), s.forEach((d) => on(a, d))), s;
  }
}, ch = {
  maxTimeToFirstByteMs: 8e3,
  maxLoadTimeMs: 2e4,
  timeoutRetry: null,
  errorRetry: null
}, zn = le(le({
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
  loader: jn,
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
  abrController: Ma,
  bufferController: Go,
  capLevelController: Ni,
  errorController: La,
  fpsController: ml,
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
  requestMediaKeySystemAccessFunc: Ys,
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
    default: ch
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
}, uh()), {}, {
  subtitleStreamController: No,
  subtitleTrackController: Bo,
  timelineController: fl,
  audioStreamController: Oo,
  audioTrackController: Mo,
  emeController: je,
  cmcdController: Ql,
  contentSteeringController: Zl
});
function uh() {
  return {
    cueHandler: hh,
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
function dh(a, e) {
  if ((e.liveSyncDurationCount || e.liveMaxLatencyDurationCount) && (e.liveSyncDuration || e.liveMaxLatencyDuration))
    throw new Error("Illegal hls.js config: don't mix up liveSyncDurationCount/liveMaxLatencyDurationCount and liveSyncDuration/liveMaxLatencyDuration");
  if (e.liveMaxLatencyDurationCount !== void 0 && (e.liveSyncDurationCount === void 0 || e.liveMaxLatencyDurationCount <= e.liveSyncDurationCount))
    throw new Error('Illegal hls.js config: "liveMaxLatencyDurationCount" must be greater than "liveSyncDurationCount"');
  if (e.liveMaxLatencyDuration !== void 0 && (e.liveSyncDuration === void 0 || e.liveMaxLatencyDuration <= e.liveSyncDuration))
    throw new Error('Illegal hls.js config: "liveMaxLatencyDuration" must be greater than "liveSyncDuration"');
  const t = Ei(a), i = ["manifest", "level", "frag"], s = ["TimeOut", "MaxRetry", "RetryDelay", "MaxRetryTimeout"];
  return i.forEach((n) => {
    const r = `${n === "level" ? "playlist" : n}LoadPolicy`, o = e[r] === void 0, l = [];
    s.forEach((h) => {
      const c = `${n}Loading${h}`, u = e[c];
      if (u !== void 0 && o) {
        l.push(c);
        const d = t[r].default;
        switch (e[r] = {
          default: d
        }, h) {
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
    }), l.length && A.warn(`hls.js config: "${l.join('", "')}" setting(s) are deprecated, use "${r}": ${JSON.stringify(e[r])}`);
  }), le(le({}, t), e);
}
function Ei(a) {
  return a && typeof a == "object" ? Array.isArray(a) ? a.map(Ei) : Object.keys(a).reduce((e, t) => (e[t] = Ei(a[t]), e), {}) : a;
}
function fh(a) {
  const e = a.loader;
  e !== $s && e !== jn ? (A.log("[config]: Custom loader detected, cannot enable progressive streaming"), a.progressive = !1) : th() && (a.loader = $s, a.progressive = !0, a.enableSoftwareAES = !0, A.log("[config]: Progressive streaming enabled, using FetchLoader"));
}
let ni;
class gh extends bi {
  constructor(e, t) {
    super(e, "[level-controller]"), this._levels = [], this._firstLevel = -1, this._maxAutoLevel = -1, this._startLevel = void 0, this.currentLevel = null, this.currentLevelIndex = -1, this.manualLevelIndex = -1, this.steering = void 0, this.onParsedComplete = void 0, this.steering = t, this._registerListeners();
  }
  _registerListeners() {
    const {
      hls: e
    } = this;
    e.on(p.MANIFEST_LOADING, this.onManifestLoading, this), e.on(p.MANIFEST_LOADED, this.onManifestLoaded, this), e.on(p.LEVEL_LOADED, this.onLevelLoaded, this), e.on(p.LEVELS_UPDATED, this.onLevelsUpdated, this), e.on(p.FRAG_BUFFERED, this.onFragBuffered, this), e.on(p.ERROR, this.onError, this);
  }
  _unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(p.MANIFEST_LOADING, this.onManifestLoading, this), e.off(p.MANIFEST_LOADED, this.onManifestLoaded, this), e.off(p.LEVEL_LOADED, this.onLevelLoaded, this), e.off(p.LEVELS_UPDATED, this.onLevelsUpdated, this), e.off(p.FRAG_BUFFERED, this.onFragBuffered, this), e.off(p.ERROR, this.onError, this);
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
    const i = this.hls.config.preferManagedMediaSource, s = [], n = {}, r = {};
    let o = !1, l = !1, h = !1;
    t.levels.forEach((c) => {
      var u, d;
      const f = c.attrs;
      let {
        audioCodec: g,
        videoCodec: m
      } = c;
      ((u = g) == null ? void 0 : u.indexOf("mp4a.40.34")) !== -1 && (ni || (ni = /chrome|firefox/i.test(navigator.userAgent)), ni && (c.audioCodec = g = void 0)), g && (c.audioCodec = g = It(g, i)), ((d = m) == null ? void 0 : d.indexOf("avc1")) === 0 && (m = c.videoCodec = Zr(m));
      const {
        width: T,
        height: y,
        unknownCodecs: E
      } = c;
      if (o || (o = !!(T && y)), l || (l = !!m), h || (h = !!g), E != null && E.length || g && !Vt(g, "audio", i) || m && !Vt(m, "video", i))
        return;
      const {
        CODECS: x,
        "FRAME-RATE": v,
        "HDCP-LEVEL": S,
        "PATHWAY-ID": C,
        RESOLUTION: R,
        "VIDEO-RANGE": I
      } = f, w = `${`${C || "."}-`}${c.bitrate}-${R}-${v}-${x}-${I}-${S}`;
      if (n[w])
        if (n[w].uri !== c.url && !c.attrs["PATHWAY-ID"]) {
          const _ = r[w] += 1;
          c.attrs["PATHWAY-ID"] = new Array(_ + 1).join(".");
          const O = new Xe(c);
          n[w] = O, s.push(O);
        } else
          n[w].addGroupId("audio", f.AUDIO), n[w].addGroupId("text", f.SUBTITLES);
      else {
        const _ = new Xe(c);
        n[w] = _, r[w] = 1, s.push(_);
      }
    }), this.filterAndSortMediaOptions(s, t, o, l, h);
  }
  filterAndSortMediaOptions(e, t, i, s, n) {
    let r = [], o = [], l = e;
    if ((i || s) && n && (l = l.filter(({
      videoCodec: g,
      videoRange: m,
      width: T,
      height: y
    }) => (!!g || !!(T && y)) && da(m))), l.length === 0) {
      Promise.resolve().then(() => {
        if (this.hls) {
          t.levels.length && this.warn(`One or more CODECS in variant not supported: ${JSON.stringify(t.levels[0].attrs)}`);
          const g = new Error("no level with compatible codecs found in manifest");
          this.hls.trigger(p.ERROR, {
            type: V.MEDIA_ERROR,
            details: b.MANIFEST_INCOMPATIBLE_CODECS_ERROR,
            fatal: !0,
            url: t.url,
            error: g,
            reason: g.message
          });
        }
      });
      return;
    }
    if (t.audioTracks) {
      const {
        preferManagedMediaSource: g
      } = this.hls.config;
      r = t.audioTracks.filter((m) => !m.audioCodec || Vt(m.audioCodec, "audio", g)), Gs(r);
    }
    t.subtitles && (o = t.subtitles, Gs(o));
    const h = l.slice(0);
    l.sort((g, m) => {
      if (g.attrs["HDCP-LEVEL"] !== m.attrs["HDCP-LEVEL"])
        return (g.attrs["HDCP-LEVEL"] || "") > (m.attrs["HDCP-LEVEL"] || "") ? 1 : -1;
      if (i && g.height !== m.height)
        return g.height - m.height;
      if (g.frameRate !== m.frameRate)
        return g.frameRate - m.frameRate;
      if (g.videoRange !== m.videoRange)
        return Ct.indexOf(g.videoRange) - Ct.indexOf(m.videoRange);
      if (g.videoCodec !== m.videoCodec) {
        const T = ji(g.videoCodec), y = ji(m.videoCodec);
        if (T !== y)
          return y - T;
      }
      if (g.uri === m.uri && g.codecSet !== m.codecSet) {
        const T = bt(g.codecSet), y = bt(m.codecSet);
        if (T !== y)
          return y - T;
      }
      return g.averageBitrate !== m.averageBitrate ? g.averageBitrate - m.averageBitrate : 0;
    });
    let c = h[0];
    if (this.steering && (l = this.steering.filterParsedLevels(l), l.length !== h.length)) {
      for (let g = 0; g < h.length; g++)
        if (h[g].pathwayId === l[0].pathwayId) {
          c = h[g];
          break;
        }
    }
    this._levels = l;
    for (let g = 0; g < l.length; g++)
      if (l[g] === c) {
        var u;
        this._firstLevel = g;
        const m = c.bitrate, T = this.hls.bandwidthEstimate;
        if (this.log(`manifest loaded, ${l.length} level(s) found, first bitrate: ${m}`), ((u = this.hls.userConfig) == null ? void 0 : u.abrEwmaDefaultEstimate) === void 0) {
          const y = Math.min(m, this.hls.config.abrEwmaDefaultEstimateMax);
          y > T && T === zn.abrEwmaDefaultEstimate && (this.hls.bandwidthEstimate = y);
        }
        break;
      }
    const d = n && !s, f = {
      levels: l,
      audioTracks: r,
      subtitleTracks: o,
      sessionData: t.sessionData,
      sessionKeys: t.sessionKeys,
      firstLevel: this._firstLevel,
      stats: t.stats,
      audio: n,
      video: s,
      altAudio: !d && r.some((g) => !!g.url)
    };
    this.hls.trigger(p.MANIFEST_PARSED, f), (this.hls.config.autoStartLoad || this.hls.forceStartLoad) && this.hls.startLoad(this.hls.config.startPosition);
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
      const c = new Error("invalid level idx"), u = e < 0;
      if (this.hls.trigger(p.ERROR, {
        type: V.OTHER_ERROR,
        details: b.LEVEL_SWITCH_ERROR,
        level: e,
        fatal: u,
        error: c,
        reason: c.message
      }), u)
        return;
      e = Math.min(e, t.length - 1);
    }
    const i = this.currentLevelIndex, s = this.currentLevel, n = s ? s.attrs["PATHWAY-ID"] : void 0, r = t[e], o = r.attrs["PATHWAY-ID"];
    if (this.currentLevelIndex = e, this.currentLevel = r, i === e && r.details && s && n === o)
      return;
    this.log(`Switching to level ${e} (${r.height ? r.height + "p " : ""}${r.videoRange ? r.videoRange + " " : ""}${r.codecSet ? r.codecSet + " " : ""}@${r.bitrate})${o ? " with Pathway " + o : ""} from level ${i}${n ? " with Pathway " + n : ""}`);
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
    this.hls.trigger(p.LEVEL_SWITCHING, l);
    const h = r.details;
    if (!h || h.live) {
      const c = this.switchParams(r.uri, s == null ? void 0 : s.details, h);
      this.loadPlaylist(c);
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
    if (t !== void 0 && t.type === G.MAIN) {
      const i = t.elementaryStreams;
      if (!Object.keys(i).some((n) => !!i[n]))
        return;
      const s = this._levels[t.level];
      s != null && s.loadError && (this.log(`Resetting level error count of ${s.loadError} on frag buffered`), s.loadError = 0);
    }
  }
  onLevelLoaded(e, t) {
    var i;
    const {
      level: s,
      details: n
    } = t, r = this._levels[s];
    if (!r) {
      var o;
      this.warn(`Invalid level index ${s}`), (o = t.deliveryDirectives) != null && o.skip && (n.deltaUpdateFailed = !0);
      return;
    }
    s === this.currentLevelIndex ? (r.fragmentError === 0 && (r.loadError = 0), this.playlistLoaded(s, t, r.details)) : (i = t.deliveryDirectives) != null && i.skip && (n.deltaUpdateFailed = !0);
  }
  loadPlaylist(e) {
    super.loadPlaylist();
    const t = this.currentLevelIndex, i = this.currentLevel;
    if (i && this.shouldLoadPlaylist(i)) {
      let s = i.uri;
      if (e)
        try {
          s = e.addDirectives(s);
        } catch (r) {
          this.warn(`Could not construct new URL with HLS Delivery Directives: ${r}`);
        }
      const n = i.attrs["PATHWAY-ID"];
      this.log(`Loading level index ${t}${(e == null ? void 0 : e.msn) !== void 0 ? " at sn " + e.msn + " part " + e.part : ""} with${n ? " Pathway " + n : ""} ${s}`), this.clearTimer(), this.hls.trigger(p.LEVEL_LOADING, {
        url: s,
        level: t,
        pathwayId: i.attrs["PATHWAY-ID"],
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
    const i = this._levels.filter((s, n) => n !== e ? !0 : (this.steering && this.steering.removeLevel(s), s === this.currentLevel && (this.currentLevel = null, this.currentLevelIndex = -1, s.details && s.details.fragments.forEach((r) => r.level = -1)), !1));
    un(i), this._levels = i, this.currentLevelIndex > -1 && (t = this.currentLevel) != null && t.details && (this.currentLevelIndex = this.currentLevel.details.fragments[0].level), this.hls.trigger(p.LEVELS_UPDATED, {
      levels: i
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
      maxHdcpLevel: i
    } = this.hls;
    this._maxAutoLevel !== t && (this._maxAutoLevel = t, this.hls.trigger(p.MAX_AUTO_LEVEL_UPDATED, {
      autoLevelCapping: e,
      levels: this.levels,
      maxAutoLevel: t,
      minAutoLevel: this.hls.minAutoLevel,
      maxHdcpLevel: i
    }));
  }
}
function Gs(a) {
  const e = {};
  a.forEach((t) => {
    const i = t.groupId || "";
    t.id = e[i] = e[i] || 0, e[i]++;
  });
}
class mh {
  constructor(e) {
    this.config = void 0, this.keyUriToKeyInfo = {}, this.emeController = null, this.config = e;
  }
  abort(e) {
    for (const i in this.keyUriToKeyInfo) {
      const s = this.keyUriToKeyInfo[i].loader;
      if (s) {
        var t;
        if (e && e !== ((t = s.context) == null ? void 0 : t.frag.type))
          return;
        s.abort();
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
  createKeyLoadError(e, t = b.KEY_LOAD_ERROR, i, s, n) {
    return new we({
      type: V.NETWORK_ERROR,
      details: t,
      fatal: !1,
      frag: e,
      response: n,
      error: i,
      networkDetails: s
    });
  }
  loadClear(e, t) {
    if (this.emeController && this.config.emeEnabled) {
      const {
        sn: i,
        cc: s
      } = e;
      for (let n = 0; n < t.length; n++) {
        const r = t[n];
        if (s <= r.cc && (i === "initSegment" || r.sn === "initSegment" || i < r.sn)) {
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
    var i, s;
    t && e.setKeyFormat(t);
    const n = e.decryptdata;
    if (!n) {
      const h = new Error(t ? `Expected frag.decryptdata to be defined after setting format ${t}` : "Missing decryption data on fragment in onKeyLoading");
      return Promise.reject(this.createKeyLoadError(e, b.KEY_LOAD_ERROR, h));
    }
    const r = n.uri;
    if (!r)
      return Promise.reject(this.createKeyLoadError(e, b.KEY_LOAD_ERROR, new Error(`Invalid key URI: "${r}"`)));
    let o = this.keyUriToKeyInfo[r];
    if ((i = o) != null && i.decryptdata.key)
      return n.key = o.decryptdata.key, Promise.resolve({
        frag: e,
        keyInfo: o
      });
    if ((s = o) != null && s.keyLoadPromise) {
      var l;
      switch ((l = o.mediaKeySessionContext) == null ? void 0 : l.keyStatus) {
        case void 0:
        case "status-pending":
        case "usable":
        case "usable-in-future":
          return o.keyLoadPromise.then((h) => (n.key = h.keyInfo.decryptdata.key, {
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
        return Promise.reject(this.createKeyLoadError(e, b.KEY_LOAD_ERROR, new Error(`Key supplied with unsupported METHOD: "${n.method}"`)));
    }
  }
  loadKeyEME(e, t) {
    const i = {
      frag: t,
      keyInfo: e
    };
    if (this.emeController && this.config.emeEnabled) {
      const s = this.emeController.loadKey(i);
      if (s)
        return (e.keyLoadPromise = s.then((n) => (e.mediaKeySessionContext = n, i))).catch((n) => {
          throw e.keyLoadPromise = null, n;
        });
    }
    return Promise.resolve(i);
  }
  loadKeyHTTP(e, t) {
    const i = this.config, s = i.loader, n = new s(i);
    return t.keyLoader = e.loader = n, e.keyLoadPromise = new Promise((r, o) => {
      const l = {
        keyInfo: e,
        frag: t,
        responseType: "arraybuffer",
        url: e.decryptdata.uri
      }, h = i.keyLoadPolicy.default, c = {
        loadPolicy: h,
        timeout: h.maxLoadTimeMs,
        maxRetry: 0,
        retryDelay: 0,
        maxRetryDelay: 0
      }, u = {
        onSuccess: (d, f, g, m) => {
          const {
            frag: T,
            keyInfo: y,
            url: E
          } = g;
          if (!T.decryptdata || y !== this.keyUriToKeyInfo[E])
            return o(this.createKeyLoadError(T, b.KEY_LOAD_ERROR, new Error("after key load, decryptdata unset or changed"), m));
          y.decryptdata.key = T.decryptdata.key = new Uint8Array(d.data), T.keyLoader = null, y.loader = null, r({
            frag: T,
            keyInfo: y
          });
        },
        onError: (d, f, g, m) => {
          this.resetLoader(f), o(this.createKeyLoadError(t, b.KEY_LOAD_ERROR, new Error(`HTTP Error ${d.code} loading key ${d.text}`), g, le({
            url: l.url,
            data: void 0
          }, d)));
        },
        onTimeout: (d, f, g) => {
          this.resetLoader(f), o(this.createKeyLoadError(t, b.KEY_LOAD_TIMEOUT, new Error("key loading timed out"), g));
        },
        onAbort: (d, f, g) => {
          this.resetLoader(f), o(this.createKeyLoadError(t, b.INTERNAL_ABORTED, new Error("key loading aborted"), g));
        }
      };
      n.load(l, c, u);
    });
  }
  resetLoader(e) {
    const {
      frag: t,
      keyInfo: i,
      url: s
    } = e, n = i.loader;
    t.keyLoader === n && (t.keyLoader = null, i.loader = null), delete this.keyUriToKeyInfo[s], n && n.destroy();
  }
}
function Xn() {
  return self.SourceBuffer || self.WebKitSourceBuffer;
}
function Qn() {
  if (!Be())
    return !1;
  const e = Xn();
  return !e || e.prototype && typeof e.prototype.appendBuffer == "function" && typeof e.prototype.remove == "function";
}
function ph() {
  if (!Qn())
    return !1;
  const a = Be();
  return typeof (a == null ? void 0 : a.isTypeSupported) == "function" && (["avc1.42E01E,mp4a.40.2", "av01.0.01M.08", "vp09.00.50.08"].some((e) => a.isTypeSupported(nt(e, "video"))) || ["mp4a.40.2", "fLaC"].some((e) => a.isTypeSupported(nt(e, "audio"))));
}
function Th() {
  var a;
  const e = Xn();
  return typeof (e == null || (a = e.prototype) == null ? void 0 : a.changeType) == "function";
}
const yh = 250, At = 2, Eh = 0.1, vh = 0.05;
class xh {
  constructor(e, t, i, s) {
    this.config = void 0, this.media = null, this.fragmentTracker = void 0, this.hls = void 0, this.nudgeRetry = 0, this.stallReported = !1, this.stalled = null, this.moved = !1, this.seeking = !1, this.config = e, this.media = t, this.fragmentTracker = i, this.hls = s;
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
      config: i,
      media: s,
      stalled: n
    } = this;
    if (s === null)
      return;
    const {
      currentTime: r,
      seeking: o
    } = s, l = this.seeking && !o, h = !this.seeking && o;
    if (this.seeking = o, r !== e) {
      if (this.moved = !0, o || (this.nudgeRetry = 0), n !== null) {
        if (this.stallReported) {
          const T = self.performance.now() - n;
          A.warn(`playback not stuck anymore @${r}, after ${Math.round(T)}ms`), this.stallReported = !1;
        }
        this.stalled = null;
      }
      return;
    }
    if (h || l) {
      this.stalled = null;
      return;
    }
    if (s.paused && !o || s.ended || s.playbackRate === 0 || !Z.getBuffered(s).length) {
      this.nudgeRetry = 0;
      return;
    }
    const c = Z.bufferInfo(s, r, 0), u = c.nextStart || 0;
    if (o) {
      const T = c.len > At, y = !u || t && t.start <= r || u - r > At && !this.fragmentTracker.getPartialFragment(r);
      if (T || y)
        return;
      this.moved = !1;
    }
    if (!this.moved && this.stalled !== null) {
      var d;
      if (!(c.len > 0) && !u)
        return;
      const y = Math.max(u, c.start || 0) - r, E = this.hls.levels ? this.hls.levels[this.hls.currentLevel] : null, v = (E == null || (d = E.details) == null ? void 0 : d.live) ? E.details.targetduration * 2 : At, S = this.fragmentTracker.getPartialFragment(r);
      if (y > 0 && (y <= v || S)) {
        s.paused || this._trySkipBufferHole(S);
        return;
      }
    }
    const f = self.performance.now();
    if (n === null) {
      this.stalled = f;
      return;
    }
    const g = f - n;
    if (!o && g >= yh && (this._reportStall(c), !this.media))
      return;
    const m = Z.bufferInfo(s, r, i.maxBufferHole);
    this._tryFixBufferStall(m, g);
  }
  /**
   * Detects and attempts to fix known buffer stalling issues.
   * @param bufferInfo - The properties of the current buffer.
   * @param stalledDurationMs - The amount of time Hls.js has been stalling for.
   * @private
   */
  _tryFixBufferStall(e, t) {
    const {
      config: i,
      fragmentTracker: s,
      media: n
    } = this;
    if (n === null)
      return;
    const r = n.currentTime, o = s.getPartialFragment(r);
    o && (this._trySkipBufferHole(o) || !this.media) || (e.len > i.maxBufferHole || e.nextStart && e.nextStart - r < i.maxBufferHole) && t > i.highBufferWatchdogPeriod * 1e3 && (A.warn("Trying to nudge playhead over buffer-hole"), this.stalled = null, this._tryNudgeBuffer());
  }
  /**
   * Triggers a BUFFER_STALLED_ERROR event, but only once per stall period.
   * @param bufferLen - The playhead distance from the end of the current buffer segment.
   * @private
   */
  _reportStall(e) {
    const {
      hls: t,
      media: i,
      stallReported: s
    } = this;
    if (!s && i) {
      this.stallReported = !0;
      const n = new Error(`Playback stalling at @${i.currentTime} due to low buffer (${JSON.stringify(e)})`);
      A.warn(n.message), t.trigger(p.ERROR, {
        type: V.MEDIA_ERROR,
        details: b.BUFFER_STALLED_ERROR,
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
      hls: i,
      media: s
    } = this;
    if (s === null)
      return 0;
    const n = s.currentTime, r = Z.bufferInfo(s, n, 0), o = n < r.start ? r.start : r.nextStart;
    if (o) {
      const l = r.len <= t.maxBufferHole, h = r.len > 0 && r.len < 1 && s.readyState < 3, c = o - n;
      if (c > 0 && (l || h)) {
        if (c > t.maxBufferHole) {
          const {
            fragmentTracker: d
          } = this;
          let f = !1;
          if (n === 0) {
            const g = d.getAppendedFrag(0, G.MAIN);
            g && o < g.end && (f = !0);
          }
          if (!f) {
            const g = e || d.getAppendedFrag(n, G.MAIN);
            if (g) {
              let m = !1, T = g.end;
              for (; T < o; ) {
                const y = d.getPartialFragment(T);
                if (y)
                  T += y.duration;
                else {
                  m = !0;
                  break;
                }
              }
              if (m)
                return 0;
            }
          }
        }
        const u = Math.max(o + vh, n + Eh);
        if (A.warn(`skipping hole, adjusting currentTime from ${n} to ${u}`), this.moved = !0, this.stalled = null, s.currentTime = u, e && !e.gap) {
          const d = new Error(`fragment loaded with buffer holes, seeking from ${n} to ${u}`);
          i.trigger(p.ERROR, {
            type: V.MEDIA_ERROR,
            details: b.BUFFER_SEEK_OVER_HOLE,
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
      media: i,
      nudgeRetry: s
    } = this;
    if (i === null)
      return;
    const n = i.currentTime;
    if (this.nudgeRetry++, s < e.nudgeMaxRetry) {
      const r = n + (s + 1) * e.nudgeOffset, o = new Error(`Nudging 'currentTime' from ${n} to ${r}`);
      A.warn(o.message), i.currentTime = r, t.trigger(p.ERROR, {
        type: V.MEDIA_ERROR,
        details: b.BUFFER_NUDGE_ON_STALL,
        error: o,
        fatal: !1
      });
    } else {
      const r = new Error(`Playhead still not moving while enough data buffered @${n} after ${e.nudgeMaxRetry} nudges`);
      A.error(r.message), t.trigger(p.ERROR, {
        type: V.MEDIA_ERROR,
        details: b.BUFFER_STALLED_ERROR,
        error: r,
        fatal: !0
      });
    }
  }
}
const Sh = 100;
class Ah extends Di {
  constructor(e, t, i) {
    super(e, t, i, "[stream-controller]", G.MAIN), this.audioCodecSwap = !1, this.gapController = null, this.level = -1, this._forceStartLoad = !1, this.altAudio = !1, this.audioOnly = !1, this.fragPlaying = null, this.onvplaying = null, this.onvseeked = null, this.fragLastKbps = 0, this.couldBacktrack = !1, this.backtrackFragment = null, this.audioCodecSwitch = !1, this.videoBuffer = null, this._registerListeners();
  }
  _registerListeners() {
    const {
      hls: e
    } = this;
    e.on(p.MEDIA_ATTACHED, this.onMediaAttached, this), e.on(p.MEDIA_DETACHING, this.onMediaDetaching, this), e.on(p.MANIFEST_LOADING, this.onManifestLoading, this), e.on(p.MANIFEST_PARSED, this.onManifestParsed, this), e.on(p.LEVEL_LOADING, this.onLevelLoading, this), e.on(p.LEVEL_LOADED, this.onLevelLoaded, this), e.on(p.FRAG_LOAD_EMERGENCY_ABORTED, this.onFragLoadEmergencyAborted, this), e.on(p.ERROR, this.onError, this), e.on(p.AUDIO_TRACK_SWITCHING, this.onAudioTrackSwitching, this), e.on(p.AUDIO_TRACK_SWITCHED, this.onAudioTrackSwitched, this), e.on(p.BUFFER_CREATED, this.onBufferCreated, this), e.on(p.BUFFER_FLUSHED, this.onBufferFlushed, this), e.on(p.LEVELS_UPDATED, this.onLevelsUpdated, this), e.on(p.FRAG_BUFFERED, this.onFragBuffered, this);
  }
  _unregisterListeners() {
    const {
      hls: e
    } = this;
    e.off(p.MEDIA_ATTACHED, this.onMediaAttached, this), e.off(p.MEDIA_DETACHING, this.onMediaDetaching, this), e.off(p.MANIFEST_LOADING, this.onManifestLoading, this), e.off(p.MANIFEST_PARSED, this.onManifestParsed, this), e.off(p.LEVEL_LOADED, this.onLevelLoaded, this), e.off(p.FRAG_LOAD_EMERGENCY_ABORTED, this.onFragLoadEmergencyAborted, this), e.off(p.ERROR, this.onError, this), e.off(p.AUDIO_TRACK_SWITCHING, this.onAudioTrackSwitching, this), e.off(p.AUDIO_TRACK_SWITCHED, this.onAudioTrackSwitched, this), e.off(p.BUFFER_CREATED, this.onBufferCreated, this), e.off(p.BUFFER_FLUSHED, this.onBufferFlushed, this), e.off(p.LEVELS_UPDATED, this.onLevelsUpdated, this), e.off(p.FRAG_BUFFERED, this.onFragBuffered, this);
  }
  onHandlerDestroying() {
    this._unregisterListeners(), super.onHandlerDestroying();
  }
  startLoad(e) {
    if (this.levels) {
      const {
        lastCurrentTime: t,
        hls: i
      } = this;
      if (this.stopLoad(), this.setInterval(Sh), this.level = -1, !this.startFragRequested) {
        let s = i.startLevel;
        s === -1 && (i.config.testBandwidth && this.levels.length > 1 ? (s = 0, this.bitrateTest = !0) : s = i.firstAutoLevel), i.nextLoadLevel = s, this.level = i.loadLevel, this.loadedmetadata = !1;
      }
      t > 0 && e === -1 && (this.log(`Override startPosition with lastCurrentTime @${t.toFixed(3)}`), e = t), this.state = k.IDLE, this.nextLoadPosition = this.startPosition = this.lastCurrentTime = e, this.tick();
    } else
      this._forceStartLoad = !0, this.state = k.STOPPED;
  }
  stopLoad() {
    this._forceStartLoad = !1, super.stopLoad();
  }
  doTick() {
    switch (this.state) {
      case k.WAITING_LEVEL: {
        const {
          levels: t,
          level: i
        } = this, s = t == null ? void 0 : t[i], n = s == null ? void 0 : s.details;
        if (n && (!n.live || this.levelLastLoaded === s)) {
          if (this.waitForCdnTuneIn(n))
            break;
          this.state = k.IDLE;
          break;
        } else if (this.hls.nextLoadLevel !== this.level) {
          this.state = k.IDLE;
          break;
        }
        break;
      }
      case k.FRAG_LOADING_WAITING_RETRY:
        {
          var e;
          const t = self.performance.now(), i = this.retryDate;
          if (!i || t >= i || (e = this.media) != null && e.seeking) {
            const {
              levels: s,
              level: n
            } = this, r = s == null ? void 0 : s[n];
            this.resetStartWhenNotLoaded(r || null), this.state = k.IDLE;
          }
        }
        break;
    }
    this.state === k.IDLE && this.doTickIdle(), this.onTickEnd();
  }
  onTickEnd() {
    super.onTickEnd(), this.checkBuffer(), this.checkFragmentChanged();
  }
  doTickIdle() {
    const {
      hls: e,
      levelLastLoaded: t,
      levels: i,
      media: s
    } = this;
    if (t === null || !s && (this.startFragRequested || !e.config.startFragPrefetch) || this.altAudio && this.audioOnly)
      return;
    const n = e.nextLoadLevel;
    if (!(i != null && i[n]))
      return;
    const r = i[n], o = this.getMainFwdBufferInfo();
    if (o === null)
      return;
    const l = this.getLevelDetails();
    if (l && this._streamEnded(o, l)) {
      const m = {};
      this.altAudio && (m.type = "video"), this.hls.trigger(p.BUFFER_EOS, m), this.state = k.ENDED;
      return;
    }
    e.loadLevel !== n && e.manualLevel === -1 && this.log(`Adapting to level ${n} from level ${this.level}`), this.level = e.nextLoadLevel = n;
    const h = r.details;
    if (!h || this.state === k.WAITING_LEVEL || h.live && this.levelLastLoaded !== r) {
      this.level = n, this.state = k.WAITING_LEVEL;
      return;
    }
    const c = o.len, u = this.getMaxBufferLength(r.maxBitrate);
    if (c >= u)
      return;
    this.backtrackFragment && this.backtrackFragment.start > o.end && (this.backtrackFragment = null);
    const d = this.backtrackFragment ? this.backtrackFragment.start : o.end;
    let f = this.getNextFragment(d, h);
    if (this.couldBacktrack && !this.fragPrevious && f && f.sn !== "initSegment" && this.fragmentTracker.getState(f) !== oe.OK) {
      var g;
      const T = ((g = this.backtrackFragment) != null ? g : f).sn - h.startSN, y = h.fragments[T - 1];
      y && f.cc === y.cc && (f = y, this.fragmentTracker.removeFragment(y));
    } else
      this.backtrackFragment && o.len && (this.backtrackFragment = null);
    if (f && this.isLoopLoading(f, d)) {
      if (!f.gap) {
        const T = this.audioOnly && !this.altAudio ? X.AUDIO : X.VIDEO, y = (T === X.VIDEO ? this.videoBuffer : this.mediaBuffer) || this.media;
        y && this.afterBufferFlushed(y, T, G.MAIN);
      }
      f = this.getNextFragmentLoopLoading(f, h, o, G.MAIN, u);
    }
    f && (f.initSegment && !f.initSegment.data && !this.bitrateTest && (f = f.initSegment), this.loadFragment(f, r, d));
  }
  loadFragment(e, t, i) {
    const s = this.fragmentTracker.getState(e);
    this.fragCurrent = e, s === oe.NOT_LOADED || s === oe.PARTIAL ? e.sn === "initSegment" ? this._loadInitSegment(e, t) : this.bitrateTest ? (this.log(`Fragment ${e.sn} of level ${e.level} is being downloaded to test bitrate and will not be buffered`), this._loadBitrateTestFrag(e, t)) : (this.startFragRequested = !0, super.loadFragment(e, t, i)) : this.clearTrackerIfNeeded(e);
  }
  getBufferedFrag(e) {
    return this.fragmentTracker.getBufferedFrag(e, G.MAIN);
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
      let i;
      const s = this.getAppendedFrag(t.currentTime);
      s && s.start > 1 && this.flushMainBuffer(0, s.start - 1);
      const n = this.getLevelDetails();
      if (n != null && n.live) {
        const o = this.getMainFwdBufferInfo();
        if (!o || o.len < n.targetduration * 2)
          return;
      }
      if (!t.paused && e) {
        const o = this.hls.nextLoadLevel, l = e[o], h = this.fragLastKbps;
        h && this.fragCurrent ? i = this.fragCurrent.duration * l.maxBitrate / (1e3 * h) + 1 : i = 0;
      } else
        i = 0;
      const r = this.getBufferedFrag(t.currentTime + i);
      if (r) {
        const o = this.followingBufferedFrag(r);
        if (o) {
          this.abortCurrentFrag();
          const l = o.maxStartPTS ? o.maxStartPTS : o.start, h = o.duration, c = Math.max(r.end, l + Math.min(Math.max(h - this.config.maxFragLookUpTolerance, h * (this.couldBacktrack ? 0.5 : 0.125)), h * (this.couldBacktrack ? 0.75 : 0.25)));
          this.flushMainBuffer(c, Number.POSITIVE_INFINITY);
        }
      }
    }
  }
  abortCurrentFrag() {
    const e = this.fragCurrent;
    switch (this.fragCurrent = null, this.backtrackFragment = null, e && (e.abortRequests(), this.fragmentTracker.removeFragment(e)), this.state) {
      case k.KEY_LOADING:
      case k.FRAG_LOADING:
      case k.FRAG_LOADING_WAITING_RETRY:
      case k.PARSING:
      case k.PARSED:
        this.state = k.IDLE;
        break;
    }
    this.nextLoadPosition = this.getLoadPosition();
  }
  flushMainBuffer(e, t) {
    super.flushMainBuffer(e, t, this.altAudio ? "video" : null);
  }
  onMediaAttached(e, t) {
    super.onMediaAttached(e, t);
    const i = t.media;
    this.onvplaying = this.onMediaPlaying.bind(this), this.onvseeked = this.onMediaSeeked.bind(this), i.addEventListener("playing", this.onvplaying), i.addEventListener("seeked", this.onvseeked), this.gapController = new xh(this.config, i, this.fragmentTracker, this.hls);
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
    M(t) && this.log(`Media seeked to ${t.toFixed(3)}`);
    const i = this.getMainFwdBufferInfo();
    if (i === null || i.len === 0) {
      this.warn(`Main forward buffer length on "seeked" event ${i ? i.len : "empty"})`);
      return;
    }
    this.tick();
  }
  onManifestLoading() {
    this.log("Trigger BUFFER_RESET"), this.hls.trigger(p.BUFFER_RESET, void 0), this.fragmentTracker.removeAllFragments(), this.couldBacktrack = !1, this.startPosition = this.lastCurrentTime = this.fragLastKbps = 0, this.levels = this.fragPlaying = this.backtrackFragment = this.levelLastLoaded = null, this.altAudio = this.audioOnly = this.startFragRequested = !1;
  }
  onManifestParsed(e, t) {
    let i = !1, s = !1;
    t.levels.forEach((n) => {
      const r = n.audioCodec;
      r && (i = i || r.indexOf("mp4a.40.2") !== -1, s = s || r.indexOf("mp4a.40.5") !== -1);
    }), this.audioCodecSwitch = i && s && !Th(), this.audioCodecSwitch && this.log("Both AAC/HE-AAC audio found in levels; declaring level codec as HE-AAC"), this.levels = t.levels, this.startFragRequested = !1;
  }
  onLevelLoading(e, t) {
    const {
      levels: i
    } = this;
    if (!i || this.state !== k.IDLE)
      return;
    const s = i[t.level];
    (!s.details || s.details.live && this.levelLastLoaded !== s || this.waitForCdnTuneIn(s.details)) && (this.state = k.WAITING_LEVEL);
  }
  onLevelLoaded(e, t) {
    var i;
    const {
      levels: s
    } = this, n = t.level, r = t.details, o = r.totalduration;
    if (!s) {
      this.warn(`Levels were reset while loading level ${n}`);
      return;
    }
    this.log(`Level ${n} loaded [${r.startSN},${r.endSN}]${r.lastPartSn ? `[part-${r.lastPartSn}-${r.lastPartIndex}]` : ""}, cc [${r.startCC}, ${r.endCC}] duration:${o}`);
    const l = s[n], h = this.fragCurrent;
    h && (this.state === k.FRAG_LOADING || this.state === k.FRAG_LOADING_WAITING_RETRY) && h.level !== t.level && h.loader && this.abortCurrentFrag();
    let c = 0;
    if (r.live || (i = l.details) != null && i.live) {
      var u;
      if (this.checkLiveUpdate(r), r.deltaUpdateFailed)
        return;
      c = this.alignPlaylists(r, l.details, (u = this.levelLastLoaded) == null ? void 0 : u.details);
    }
    if (l.details = r, this.levelLastLoaded = l, this.hls.trigger(p.LEVEL_UPDATED, {
      details: r,
      level: n
    }), this.state === k.WAITING_LEVEL) {
      if (this.waitForCdnTuneIn(r))
        return;
      this.state = k.IDLE;
    }
    this.startFragRequested ? r.live && this.synchronizeToLiveEdge(r) : this.setStartPosition(r, c), this.tick();
  }
  _handleFragmentLoadProgress(e) {
    var t;
    const {
      frag: i,
      part: s,
      payload: n
    } = e, {
      levels: r
    } = this;
    if (!r) {
      this.warn(`Levels were reset while fragment load was in progress. Fragment ${i.sn} of level ${i.level} will not be buffered`);
      return;
    }
    const o = r[i.level], l = o.details;
    if (!l) {
      this.warn(`Dropping fragment ${i.sn} of level ${i.level} after level details were reset`), this.fragmentTracker.removeFragment(i);
      return;
    }
    const h = o.videoCodec, c = l.PTSKnown || !l.live, u = (t = i.initSegment) == null ? void 0 : t.data, d = this._getAudioCodec(o), f = this.transmuxer = this.transmuxer || new kn(this.hls, G.MAIN, this._handleTransmuxComplete.bind(this), this._handleTransmuxerFlush.bind(this)), g = s ? s.index : -1, m = g !== -1, T = new Ii(i.level, i.sn, i.stats.chunkCount, n.byteLength, g, m), y = this.initPTS[i.cc];
    f.push(n, u, d, h, i, s, l.totalduration, c, T, y);
  }
  onAudioTrackSwitching(e, t) {
    const i = this.altAudio;
    if (!!!t.url) {
      if (this.mediaBuffer !== this.media) {
        this.log("Switching on main audio, use media.buffered to schedule main fragment loading"), this.mediaBuffer = this.media;
        const r = this.fragCurrent;
        r && (this.log("Switching to main audio track, cancel main fragment load"), r.abortRequests(), this.fragmentTracker.removeFragment(r)), this.resetTransmuxer(), this.resetLoadingState();
      } else
        this.audioOnly && this.resetTransmuxer();
      const n = this.hls;
      i && (n.trigger(p.BUFFER_FLUSHING, {
        startOffset: 0,
        endOffset: Number.POSITIVE_INFINITY,
        type: null
      }), this.fragmentTracker.removeAllFragments()), n.trigger(p.AUDIO_TRACK_SWITCHED, t);
    }
  }
  onAudioTrackSwitched(e, t) {
    const i = t.id, s = !!this.hls.audioTracks[i].url;
    if (s) {
      const n = this.videoBuffer;
      n && this.mediaBuffer !== n && (this.log("Switching on alternate audio, use video.buffered to schedule main fragment loading"), this.mediaBuffer = n);
    }
    this.altAudio = s, this.tick();
  }
  onBufferCreated(e, t) {
    const i = t.tracks;
    let s, n, r = !1;
    for (const o in i) {
      const l = i[o];
      if (l.id === "main") {
        if (n = o, s = l, o === "video") {
          const h = i[o];
          h && (this.videoBuffer = h.buffer);
        }
      } else
        r = !0;
    }
    r && s ? (this.log(`Alternate track found, use ${n}.buffered to schedule main fragment loading`), this.mediaBuffer = s.buffer) : this.mediaBuffer = this.media;
  }
  onFragBuffered(e, t) {
    const {
      frag: i,
      part: s
    } = t;
    if (i && i.type !== G.MAIN)
      return;
    if (this.fragContextChanged(i)) {
      this.warn(`Fragment ${i.sn}${s ? " p: " + s.index : ""} of level ${i.level} finished buffering, but was aborted. state: ${this.state}`), this.state === k.PARSED && (this.state = k.IDLE);
      return;
    }
    const n = s ? s.stats : i.stats;
    this.fragLastKbps = Math.round(8 * n.total / (n.buffering.end - n.loading.first)), i.sn !== "initSegment" && (this.fragPrevious = i), this.fragBufferedComplete(i, s);
  }
  onError(e, t) {
    var i;
    if (t.fatal) {
      this.state = k.ERROR;
      return;
    }
    switch (t.details) {
      case b.FRAG_GAP:
      case b.FRAG_PARSING_ERROR:
      case b.FRAG_DECRYPT_ERROR:
      case b.FRAG_LOAD_ERROR:
      case b.FRAG_LOAD_TIMEOUT:
      case b.KEY_LOAD_ERROR:
      case b.KEY_LOAD_TIMEOUT:
        this.onFragmentOrKeyLoadError(G.MAIN, t);
        break;
      case b.LEVEL_LOAD_ERROR:
      case b.LEVEL_LOAD_TIMEOUT:
      case b.LEVEL_PARSING_ERROR:
        !t.levelRetry && this.state === k.WAITING_LEVEL && ((i = t.context) == null ? void 0 : i.type) === Y.LEVEL && (this.state = k.IDLE);
        break;
      case b.BUFFER_APPEND_ERROR:
      case b.BUFFER_FULL_ERROR:
        if (!t.parent || t.parent !== "main")
          return;
        if (t.details === b.BUFFER_APPEND_ERROR) {
          this.resetLoadingState();
          return;
        }
        this.reduceLengthAndFlushBuffer(t) && this.flushMainBuffer(0, Number.POSITIVE_INFINITY);
        break;
      case b.INTERNAL_EXCEPTION:
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
      if (this.loadedmetadata || !Z.getBuffered(e).length) {
        const i = this.state !== k.IDLE ? this.fragCurrent : null;
        t.poll(this.lastCurrentTime, i);
      }
      this.lastCurrentTime = e.currentTime;
    }
  }
  onFragLoadEmergencyAborted() {
    this.state = k.IDLE, this.loadedmetadata || (this.startFragRequested = !1, this.nextLoadPosition = this.startPosition), this.tickImmediate();
  }
  onBufferFlushed(e, {
    type: t
  }) {
    if (t !== X.AUDIO || this.audioOnly && !this.altAudio) {
      const i = (t === X.VIDEO ? this.videoBuffer : this.mediaBuffer) || this.media;
      this.afterBufferFlushed(i, t, G.MAIN), this.tick();
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
    let i = this.startPosition;
    if (i >= 0 && t < i) {
      if (e.seeking) {
        this.log(`could not seek to ${i}, already seeking at ${t}`);
        return;
      }
      const s = Z.getBuffered(e), r = (s.length ? s.start(0) : 0) - i;
      r > 0 && (r < this.config.maxBufferHole || r < this.config.maxFragLookUpTolerance) && (this.log(`adjusting start position by ${r} to match buffer start`), i += r, this.startPosition = i), this.log(`seek to target start position ${i} from current time ${t}`), e.currentTime = i;
    }
  }
  _getAudioCodec(e) {
    let t = this.config.defaultAudioCodec || e.audioCodec;
    return this.audioCodecSwap && t && (this.log("Swapping audio codec"), t.indexOf("mp4a.40.5") !== -1 ? t = "mp4a.40.2" : t = "mp4a.40.5"), t;
  }
  _loadBitrateTestFrag(e, t) {
    e.bitrateTest = !0, this._doFragLoad(e, t).then((i) => {
      const {
        hls: s
      } = this;
      if (!i || this.fragContextChanged(e))
        return;
      t.fragmentError = 0, this.state = k.IDLE, this.startFragRequested = !1, this.bitrateTest = !1;
      const n = e.stats;
      n.parsing.start = n.parsing.end = n.buffering.start = n.buffering.end = self.performance.now(), s.trigger(p.FRAG_LOADED, i), e.bitrateTest = !1;
    });
  }
  _handleTransmuxComplete(e) {
    var t;
    const i = "main", {
      hls: s
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
      part: h,
      level: c
    } = o, {
      video: u,
      text: d,
      id3: f,
      initSegment: g
    } = n, {
      details: m
    } = c, T = this.altAudio ? void 0 : n.audio;
    if (this.fragContextChanged(l)) {
      this.fragmentTracker.removeFragment(l);
      return;
    }
    if (this.state = k.PARSING, g) {
      if (g != null && g.tracks) {
        const x = l.initSegment || l;
        this._bufferInitSegment(c, g.tracks, x, r), s.trigger(p.FRAG_PARSING_INIT_SEGMENT, {
          frag: x,
          id: i,
          tracks: g.tracks
        });
      }
      const y = g.initPTS, E = g.timescale;
      M(y) && (this.initPTS[l.cc] = {
        baseTime: y,
        timescale: E
      }, s.trigger(p.INIT_PTS_FOUND, {
        frag: l,
        id: i,
        initPTS: y,
        timescale: E
      }));
    }
    if (u && m && l.sn !== "initSegment") {
      const y = m.fragments[l.sn - 1 - m.startSN], E = l.sn === m.startSN, x = !y || l.cc > y.cc;
      if (n.independent !== !1) {
        const {
          startPTS: v,
          endPTS: S,
          startDTS: C,
          endDTS: R
        } = u;
        if (h)
          h.elementaryStreams[u.type] = {
            startPTS: v,
            endPTS: S,
            startDTS: C,
            endDTS: R
          };
        else if (u.firstKeyFrame && u.independent && r.id === 1 && !x && (this.couldBacktrack = !0), u.dropped && u.independent) {
          const I = this.getMainFwdBufferInfo(), D = (I ? I.end : this.getLoadPosition()) + this.config.maxBufferHole, w = u.firstKeyFramePTS ? u.firstKeyFramePTS : v;
          if (!E && D < w - this.config.maxBufferHole && !x) {
            this.backtrack(l);
            return;
          } else
            x && (l.gap = !0);
          l.setElementaryStreamInfo(u.type, l.start, S, l.start, R, !0);
        } else
          E && v > At && (l.gap = !0);
        l.setElementaryStreamInfo(u.type, v, S, C, R), this.backtrackFragment && (this.backtrackFragment = l), this.bufferFragmentData(u, l, h, r, E || x);
      } else if (E || x)
        l.gap = !0;
      else {
        this.backtrack(l);
        return;
      }
    }
    if (T) {
      const {
        startPTS: y,
        endPTS: E,
        startDTS: x,
        endDTS: v
      } = T;
      h && (h.elementaryStreams[X.AUDIO] = {
        startPTS: y,
        endPTS: E,
        startDTS: x,
        endDTS: v
      }), l.setElementaryStreamInfo(X.AUDIO, y, E, x, v), this.bufferFragmentData(T, l, h, r);
    }
    if (m && f != null && (t = f.samples) != null && t.length) {
      const y = {
        id: i,
        frag: l,
        details: m,
        samples: f.samples
      };
      s.trigger(p.FRAG_PARSING_METADATA, y);
    }
    if (m && d) {
      const y = {
        id: i,
        frag: l,
        details: m,
        samples: d.samples
      };
      s.trigger(p.FRAG_PARSING_USERDATA, y);
    }
  }
  _bufferInitSegment(e, t, i, s) {
    if (this.state !== k.PARSING)
      return;
    this.audioOnly = !!t.audio && !t.video, this.altAudio && !this.audioOnly && delete t.audio;
    const {
      audio: n,
      video: r,
      audiovideo: o
    } = t;
    if (n) {
      let l = e.audioCodec;
      const h = navigator.userAgent.toLowerCase();
      if (this.audioCodecSwitch) {
        l && (l.indexOf("mp4a.40.5") !== -1 ? l = "mp4a.40.2" : l = "mp4a.40.5");
        const c = n.metadata;
        c && "channelCount" in c && (c.channelCount || 1) !== 1 && h.indexOf("firefox") === -1 && (l = "mp4a.40.5");
      }
      l && l.indexOf("mp4a.40.5") !== -1 && h.indexOf("android") !== -1 && n.container !== "audio/mpeg" && (l = "mp4a.40.2", this.log(`Android: force audio codec to ${l}`)), e.audioCodec && e.audioCodec !== l && this.log(`Swapping manifest audio codec "${e.audioCodec}" for "${l}"`), n.levelCodec = l, n.id = "main", this.log(`Init audio buffer, container:${n.container}, codecs[selected/level/parsed]=[${l || ""}/${e.audioCodec || ""}/${n.codec}]`);
    }
    r && (r.levelCodec = e.videoCodec, r.id = "main", this.log(`Init video buffer, container:${r.container}, codecs[level/parsed]=[${e.videoCodec || ""}/${r.codec}]`)), o && this.log(`Init audiovideo buffer, container:${o.container}, codecs[level/parsed]=[${e.codecs}/${o.codec}]`), this.hls.trigger(p.BUFFER_CODECS, t), Object.keys(t).forEach((l) => {
      const c = t[l].initSegment;
      c != null && c.byteLength && this.hls.trigger(p.BUFFER_APPENDING, {
        type: l,
        data: c,
        frag: i,
        part: null,
        chunkMeta: s,
        parent: i.type
      });
    }), this.tickImmediate();
  }
  getMainFwdBufferInfo() {
    return this.getFwdBufferInfo(this.mediaBuffer ? this.mediaBuffer : this.media, G.MAIN);
  }
  backtrack(e) {
    this.couldBacktrack = !0, this.backtrackFragment = e, this.resetTransmuxer(), this.flushBufferGap(e), this.fragmentTracker.removeFragment(e), this.fragPrevious = null, this.nextLoadPosition = e.start, this.state = k.IDLE;
  }
  checkFragmentChanged() {
    const e = this.media;
    let t = null;
    if (e && e.readyState > 1 && e.seeking === !1) {
      const i = e.currentTime;
      if (Z.isBuffered(e, i) ? t = this.getAppendedFrag(i) : Z.isBuffered(e, i + 0.1) && (t = this.getAppendedFrag(i + 0.1)), t) {
        this.backtrackFragment = null;
        const s = this.fragPlaying, n = t.level;
        (!s || t.sn !== s.sn || s.level !== n) && (this.fragPlaying = t, this.hls.trigger(p.FRAG_CHANGED, {
          frag: t
        }), (!s || s.level !== n) && this.hls.trigger(p.LEVEL_SWITCHED, {
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
      const t = e.currentTime, i = this.currentFrag;
      if (i && M(t) && M(i.programDateTime)) {
        const s = i.programDateTime + (t - i.start) * 1e3;
        return new Date(s);
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
    return Qn();
  }
  /**
   * Check if MediaSource Extensions are available and isTypeSupported checks pass for any baseline codecs.
   */
  static isSupported() {
    return ph();
  }
  /**
   * Get the MediaSource global used for MSE playback (ManagedMediaSource, MediaSource, or WebKitMediaSource).
   */
  static getMediaSource() {
    return Be();
  }
  static get Events() {
    return p;
  }
  static get ErrorTypes() {
    return V;
  }
  static get ErrorDetails() {
    return b;
  }
  /**
   * Get the default configuration applied to new instances.
   */
  static get DefaultConfig() {
    return J.defaultConfig ? J.defaultConfig : zn;
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
    this.config = void 0, this.userConfig = void 0, this.coreComponents = void 0, this.networkControllers = void 0, this.started = !1, this._emitter = new Fi(), this._autoLevelCapping = -1, this._maxHdcpLevel = null, this.abrController = void 0, this.bufferController = void 0, this.capLevelController = void 0, this.latencyController = void 0, this.levelController = void 0, this.streamController = void 0, this.audioTrackController = void 0, this.subtitleTrackController = void 0, this.emeController = void 0, this.cmcdController = void 0, this._media = null, this.url = null, this.triggeringException = void 0, cr(e.debug || !1, "Hls instance");
    const t = this.config = dh(J.DefaultConfig, e);
    this.userConfig = e, t.progressive && fh(t);
    const {
      abrController: i,
      bufferController: s,
      capLevelController: n,
      errorController: r,
      fpsController: o
    } = t, l = new r(this), h = this.abrController = new i(this), c = this.bufferController = new s(this), u = this.capLevelController = new n(this), d = new o(this), f = new na(this), g = new ha(this), m = t.contentSteeringController, T = m ? new m(this) : null, y = this.levelController = new gh(this, T), E = new Ua(this), x = new mh(this.config), v = this.streamController = new Ah(this, E, x);
    u.setStreamController(v), d.setStreamController(v);
    const S = [f, y, v];
    T && S.splice(1, 0, T), this.networkControllers = S;
    const C = [h, c, u, d, g, E];
    this.audioTrackController = this.createController(t.audioTrackController, S);
    const R = t.audioStreamController;
    R && S.push(new R(this, E, x)), this.subtitleTrackController = this.createController(t.subtitleTrackController, S);
    const I = t.subtitleStreamController;
    I && S.push(new I(this, E, x)), this.createController(t.timelineController, C), x.emeController = this.emeController = this.createController(t.emeController, C), this.cmcdController = this.createController(t.cmcdController, C), this.latencyController = this.createController(ca, C), this.coreComponents = C, S.push(l);
    const D = l.onErrorOut;
    typeof D == "function" && this.on(p.ERROR, D, l);
  }
  createController(e, t) {
    if (e) {
      const i = new e(this);
      return t && t.push(i), i;
    }
    return null;
  }
  // Delegate the EventEmitter through the public API of Hls.js
  on(e, t, i = this) {
    this._emitter.on(e, t, i);
  }
  once(e, t, i = this) {
    this._emitter.once(e, t, i);
  }
  removeAllListeners(e) {
    this._emitter.removeAllListeners(e);
  }
  off(e, t, i = this, s) {
    this._emitter.off(e, t, i, s);
  }
  listeners(e) {
    return this._emitter.listeners(e);
  }
  emit(e, t, i) {
    return this._emitter.emit(e, t, i);
  }
  trigger(e, t) {
    if (this.config.debug)
      return this.emit(e, e, t);
    try {
      return this.emit(e, e, t);
    } catch (i) {
      if (A.error("An internal error happened while handling event " + e + '. Error message: "' + i.message + '". Here is a stacktrace:', i), !this.triggeringException) {
        this.triggeringException = !0;
        const s = e === p.ERROR;
        this.trigger(p.ERROR, {
          type: V.OTHER_ERROR,
          details: b.INTERNAL_EXCEPTION,
          fatal: s,
          event: e,
          error: i
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
    A.log("destroy"), this.trigger(p.DESTROYING, void 0), this.detachMedia(), this.removeAllListeners(), this._autoLevelCapping = -1, this.url = null, this.networkControllers.forEach((t) => t.destroy()), this.networkControllers.length = 0, this.coreComponents.forEach((t) => t.destroy()), this.coreComponents.length = 0;
    const e = this.config;
    e.xhrSetup = e.fetchSetup = void 0, this.userConfig = null;
  }
  /**
   * Attaches Hls.js to a media element
   */
  attachMedia(e) {
    A.log("attachMedia"), this._media = e, this.trigger(p.MEDIA_ATTACHING, {
      media: e
    });
  }
  /**
   * Detach Hls.js from the media
   */
  detachMedia() {
    A.log("detachMedia"), this.trigger(p.MEDIA_DETACHING, void 0), this._media = null;
  }
  /**
   * Set the source URL. Can be relative or absolute.
   */
  loadSource(e) {
    this.stopLoad();
    const t = this.media, i = this.url, s = this.url = xi.buildAbsoluteURL(self.location.href, e, {
      alwaysNormalize: !0
    });
    this._autoLevelCapping = -1, this._maxHdcpLevel = null, A.log(`loadSource:${s}`), t && i && (i !== s || this.bufferController.hasSourceTypes()) && (this.detachMedia(), this.attachMedia(t)), this.trigger(p.MANIFEST_LOADING, {
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
    A.log(`startLoad(${e})`), this.started = !0, this.networkControllers.forEach((t) => {
      t.startLoad(e);
    });
  }
  /**
   * Stop loading of any stream data.
   */
  stopLoad() {
    A.log("stopLoad"), this.started = !1, this.networkControllers.forEach((e) => {
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
    A.log("swapAudioCodec"), this.streamController.swapAudioCodec();
  }
  /**
   * When the media-element fails, this allows to detach and then re-attach it
   * as one call (convenience method).
   *
   * Automatic recovery of media-errors by this process is configurable.
   */
  recoverMediaError() {
    A.log("recoverMediaError");
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
    A.log(`set currentLevel:${e}`), this.levelController.manualLevel = e, this.streamController.immediateLevelSwitch();
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
    A.log(`set nextLevel:${e}`), this.levelController.manualLevel = e, this.streamController.nextLevelSwitch();
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
    A.log(`set loadLevel:${e}`), this.levelController.manualLevel = e;
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
    A.log(`set firstLevel:${e}`), this.levelController.firstLevel = e;
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
    A.log(`set startLevel:${e}`), e !== -1 && (e = Math.max(e, this.minAutoLevel)), this.levelController.startLevel = e;
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
    this._autoLevelCapping !== e && (A.log(`set autoLevelCapping:${e}`), this._autoLevelCapping = e, this.levelController.checkMaxAutoUpdated());
  }
  get maxHdcpLevel() {
    return this._maxHdcpLevel;
  }
  set maxHdcpLevel(e) {
    ua(e) && this._maxHdcpLevel !== e && (this._maxHdcpLevel = e, this.levelController.checkMaxAutoUpdated());
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
    const i = e.length;
    for (let s = 0; s < i; s++)
      if (e[s].maxBitrate >= t)
        return s;
    return 0;
  }
  /**
   * max level selectable in auto mode according to autoLevelCapping
   */
  get maxAutoLevel() {
    const {
      levels: e,
      autoLevelCapping: t,
      maxHdcpLevel: i
    } = this;
    let s;
    if (t === -1 && e != null && e.length ? s = e.length - 1 : s = t, i)
      for (let n = s; n--; ) {
        const r = e[n].attrs["HDCP-LEVEL"];
        if (r && r <= i)
          return n;
      }
    return s;
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
var vi = {};
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
      }), this.entities = o, this.parse = function(l, h) {
        l = l.replace(/\0/g, "�");
        var c = /\r\n|\r|\n/, u = Date.now(), d = 0, f = l.split(c), g = !1, m = [], T = [], y = [];
        function E(N, U) {
          y.push({ message: N, line: d + 1, col: U });
        }
        var x = f[d], v = x.length, S = "WEBVTT", C = 0, R = S.length;
        for (x[0] === "\uFEFF" && (C = 1, R += 1), (v < R || x.indexOf(S) !== 0 + C || v > R && x[R] !== " " && x[R] !== "	") && E('No valid signature. (File needs to start with "WEBVTT".)'), d++; f[d] != "" && f[d] != null; ) {
          if (E("No blank line after the signature."), f[d].indexOf("-->") != -1) {
            g = !0;
            break;
          }
          d++;
        }
        for (; f[d] != null; ) {
          for (var I; !g && f[d] == ""; )
            d++;
          if (!g && f[d] == null)
            break;
          I = Object.assign({}, e, {
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
          var D = !0;
          if (f[d].indexOf("-->") == -1) {
            if (I.id = f[d], /^NOTE($|[ \t])/.test(I.id)) {
              for (d++; f[d] != "" && f[d] != null; )
                f[d].indexOf("-->") != -1 && E("Cannot have timestamp in a comment."), d++;
              continue;
            }
            if (/^STYLE($|[ \t])/.test(I.id)) {
              var w = [], _ = !1;
              for (d++; f[d] != "" && f[d] != null; )
                f[d].indexOf("-->") != -1 && (E("Cannot have timestamp in a style block."), _ = !0), w.push(f[d]), d++;
              if (T.length) {
                E("Style blocks cannot appear after the first cue.");
                continue;
              }
              _ || m.push(w.join(`
`));
              continue;
            }
            if (d++, f[d] == "" || f[d] == null) {
              E("Cue identifier cannot be standalone.");
              continue;
            }
            if (f[d].indexOf("-->") == -1) {
              D = !1, E("Cue identifier needs to be followed by timestamp.");
              continue;
            }
          }
          g = !1;
          var O = new i(f[d], E), P = 0;
          if (T.length > 0 && (P = T[T.length - 1].startTime), D && !O.parse(I, P)) {
            for (I = null, d++; f[d] != "" && f[d] != null; ) {
              if (f[d].indexOf("-->") != -1) {
                g = !0;
                break;
              }
              d++;
            }
            continue;
          }
          for (d++; f[d] != "" && f[d] != null; ) {
            if (f[d].indexOf("-->") != -1) {
              E("Blank line missing before cue."), g = !0;
              break;
            }
            I.text != "" && (I.text += `
`), I.text += f[d], d++;
          }
          var K = new s(I.text, E, h, o);
          I.tree = K.parse(I.startTime, I.endTime), T.push(I);
        }
        return T.sort(function(N, U) {
          return N.startTime < U.startTime ? -1 : N.startTime > U.startTime ? 1 : N.endTime > U.endTime ? -1 : N.endTime < U.endTime ? 1 : 0;
        }), { cues: T, errors: y, time: Date.now() - u, styles: m };
      };
    }, i = function(u, l) {
      var h = /[\u0020\t\f]/, c = /[^\u0020\t\f]/, u = u, d = 0, f = function(E) {
        l(E, d + 1);
      };
      function g(E) {
        for (; u[d] != null && E.test(u[d]); )
          d++;
      }
      function m(E) {
        for (var x = ""; u[d] != null && E.test(u[d]); )
          x += u[d], d++;
        return x;
      }
      function T() {
        var E = "minutes", x, v, S, C;
        if (u[d] == null) {
          f("No timestamp found.");
          return;
        }
        if (!/\d/.test(u[d])) {
          f("Timestamp must start with a character in the range 0-9.");
          return;
        }
        if (x = m(/\d/), (x.length > 2 || parseInt(x, 10) > 59) && (E = "hours"), u[d] != ":") {
          f("No time unit separator found.");
          return;
        }
        if (d++, v = m(/\d/), v.length != 2) {
          f("Must be exactly two digits.");
          return;
        }
        if (E == "hours" || u[d] == ":") {
          if (u[d] != ":") {
            f("No seconds found or minutes is greater than 59.");
            return;
          }
          if (d++, S = m(/\d/), S.length != 2) {
            f("Must be exactly two digits.");
            return;
          }
        } else {
          if (x.length != 2) {
            f("Must be exactly two digits.");
            return;
          }
          S = v, v = x, x = "0";
        }
        if (u[d] != ".") {
          f('No decimal separator (".") found.');
          return;
        }
        if (d++, C = m(/\d/), C.length != 3) {
          f("Milliseconds must be given in three digits.");
          return;
        }
        if (parseInt(v, 10) > 59) {
          f("You cannot have more than 59 minutes.");
          return;
        }
        if (parseInt(S, 10) > 59) {
          f("You cannot have more than 59 seconds.");
          return;
        }
        return parseInt(x, 10) * 60 * 60 + parseInt(v, 10) * 60 + parseInt(S, 10) + parseInt(C, 10) / 1e3;
      }
      function y(E, x) {
        for (var v = E.split(h), S = [], C = 0; C < v.length; C++)
          if (v[C] != "") {
            var R = v[C].indexOf(":"), I = v[C].slice(0, R), D = v[C].slice(R + 1);
            if (S.indexOf(I) != -1 && f("Duplicate setting."), S.push(I), D == "") {
              f("No value for setting defined.");
              return;
            }
            if (I == "vertical") {
              if (D != "rl" && D != "lr") {
                f("Writing direction can only be set to 'rl' or 'rl'.");
                continue;
              }
              x.direction = D;
            } else if (I == "line") {
              if (/,/.test(D)) {
                var w = D.split(",");
                D = w[0];
                var _ = w[1];
              }
              if (!/^[-\d](\d*)(\.\d+)?%?$/.test(D)) {
                f("Line position takes a number or percentage.");
                continue;
              }
              if (D.indexOf("-", 1) != -1) {
                f("Line position can only have '-' at the start.");
                continue;
              }
              if (D.indexOf("%") != -1 && D.indexOf("%") != D.length - 1) {
                f("Line position can only have '%' at the end.");
                continue;
              }
              if (D[0] == "-" && D[D.length - 1] == "%") {
                f("Line position cannot be a negative percentage.");
                continue;
              }
              var O = D, P = !1;
              if (D[D.length - 1] == "%" && (P = !0, O = D.slice(0, D.length - 1), parseInt(D, 10) > 100)) {
                f("Line position cannot be >100%.");
                continue;
              }
              if (O === "" || isNaN(O) || !isFinite(O)) {
                f("Line position needs to be a number");
                continue;
              }
              if (_ !== void 0) {
                if (!["start", "center", "end"].includes(_)) {
                  f("Line alignment needs to be one of start, center or end");
                  continue;
                }
                x.lineAlign = _;
              }
              x.snapToLines = !P, x.linePosition = parseFloat(O), parseFloat(O).toString() !== O && (x.nonSerializable = !0);
            } else if (I == "position") {
              if (/,/.test(D)) {
                var w = D.split(",");
                D = w[0];
                var K = w[1];
              }
              if (D[D.length - 1] != "%") {
                f("Text position must be a percentage.");
                continue;
              }
              if (parseInt(D, 10) > 100 || parseInt(D, 10) < 0) {
                f("Text position needs to be between 0 and 100%.");
                continue;
              }
              if (O = D.slice(0, D.length - 1), O === "" || isNaN(O) || !isFinite(O)) {
                f("Line position needs to be a number");
                continue;
              }
              if (K !== void 0) {
                if (!["line-left", "center", "line-right"].includes(K)) {
                  f("Position alignment needs to be one of line-left, center or line-right");
                  continue;
                }
                x.positionAlign = K;
              }
              x.textPosition = parseFloat(O);
            } else if (I == "size") {
              if (D[D.length - 1] != "%") {
                f("Size must be a percentage.");
                continue;
              }
              if (parseInt(D, 10) > 100) {
                f("Size cannot be >100%.");
                continue;
              }
              var N = D.slice(0, D.length - 1);
              if (N === void 0 || N === "" || isNaN(N)) {
                f("Size needs to be a number"), N = 100;
                continue;
              } else if (N = parseFloat(N), N < 0 || N > 100) {
                f("Size needs to be between 0 and 100%.");
                continue;
              }
              x.size = N;
            } else if (I == "align") {
              var U = ["start", "center", "end", "left", "right"];
              if (U.indexOf(D) == -1) {
                f("Alignment can only be set to one of " + U.join(", ") + ".");
                continue;
              }
              x.alignment = D;
            } else
              f("Invalid setting.");
          }
      }
      this.parse = function(E, x) {
        if (g(h), E.startTime = T(), E.startTime != null) {
          if (E.startTime < x && f("Start timestamp is not greater than or equal to start timestamp of previous cue."), c.test(u[d]) && f("Timestamp not separated from '-->' by whitespace."), g(h), u[d] != "-") {
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
          if (d++, c.test(u[d]) && f("'-->' not separated from timestamp by whitespace."), g(h), E.endTime = T(), E.endTime != null)
            return E.endTime <= E.startTime && f("End timestamp is not greater than start timestamp."), c.test(u[d]), g(h), y(u.substring(d), E), !0;
        }
      }, this.parseTimestamp = function() {
        var E = T();
        if (u[d] != null) {
          f("Timestamp must not have trailing characters.");
          return;
        }
        return E;
      };
    }, s = function(d, l, h, c) {
      this.entities = c;
      var u = this, d = d, f = 0, g = function(T) {
        h != "metadata" && l(T, f + 1);
      };
      this.parse = function(T, y) {
        function E(O) {
          const P = { ...O };
          return O.children && (P.children = O.children.map(E)), P.parent && delete P.parent, P;
        }
        var x = { children: [] }, v = x, S = [];
        function C(O) {
          v.children.push({ type: "object", name: O[1], classes: O[2], children: [], parent: v }), v = v.children[v.children.length - 1];
        }
        function R(O) {
          for (var P = v; P; ) {
            if (P.name == O)
              return !0;
            P = P.parent;
          }
        }
        for (; d[f] != null; ) {
          var I = m();
          if (I[0] == "text")
            v.children.push({ type: "text", value: I[1], parent: v });
          else if (I[0] == "start tag") {
            h == "chapters" && g("Start tags not allowed in chapter title text.");
            var D = I[1];
            D != "v" && D != "lang" && I[3] != "" && g("Only <v> and <lang> can have an annotation."), D == "c" || D == "i" || D == "b" || D == "u" || D == "ruby" || D == "rt" && v.name == "ruby" ? C(I) : D == "v" ? (R("v") && g("<v> cannot be nested inside itself."), C(I), v.value = I[3], I[3] || g("<v> requires an annotation.")) : D == "lang" ? (C(I), v.value = I[3]) : g("Incorrect start tag.");
          } else if (I[0] == "end tag")
            h == "chapters" && g("End tags not allowed in chapter title text."), I[1] == v.name ? v = v.parent : I[1] == "ruby" && v.name == "rt" ? v = v.parent.parent : g("Incorrect end tag.");
          else if (I[0] == "timestamp") {
            h == "chapters" && g("Timestamp not allowed in chapter title text.");
            var w = new i(I[1], g), _ = w.parseTimestamp();
            _ != null && ((_ <= T || _ >= y) && g("Timestamp must be between start timestamp and end timestamp."), S.length > 0 && S[S.length - 1] >= _ && g("Timestamp must be greater than any previous timestamp."), v.children.push({ type: "timestamp", value: _, parent: v }), S.push(_));
          }
        }
        for (; v.parent; )
          v.name != "v" && g("Required end tag missing."), v = v.parent;
        return E(x);
      };
      function m() {
        for (var T = "data", y = "", E = "", x = []; d[f - 1] != null || f == 0; ) {
          var v = d[f];
          if (T == "data")
            if (v == "&")
              E = v, T = "escape";
            else if (v == "<" && y == "")
              T = "tag";
            else {
              if (v == "<" || v == null)
                return ["text", y];
              y += v;
            }
          else if (T == "escape")
            if (v == "<" || v == null) {
              g("Incorrect escape.");
              let S;
              return (S = E.match(/^&#([0-9]+)$/)) ? y += String.fromCharCode(S[1]) : u.entities[E] ? y += u.entities[E] : y += E, ["text", y];
            } else if (v == "&")
              g("Incorrect escape."), y += E, E = v;
            else if (/[a-z#0-9]/i.test(v))
              E += v;
            else if (v == ";") {
              let S;
              (S = E.match(/^&#(x?[0-9]+)$/)) ? y += String.fromCharCode("0" + S[1]) : u.entities[E + v] ? y += u.entities[E + v] : (S = Object.keys(c).find((C) => E.startsWith(C))) ? y += u.entities[S] + E.slice(S.length) + v : (g("Incorrect escape."), y += E + ";"), T = "data";
            } else
              g("Incorrect escape."), y += E + v, T = "data";
          else if (T == "tag")
            if (v == "	" || v == `
` || v == "\f" || v == " ")
              T = "start tag annotation";
            else if (v == ".")
              T = "start tag class";
            else if (v == "/")
              T = "end tag";
            else if (/\d/.test(v))
              y = v, T = "timestamp tag";
            else {
              if (v == ">" || v == null)
                return v == ">" && f++, ["start tag", "", [], ""];
              y = v, T = "start tag";
            }
          else if (T == "start tag")
            if (v == "	" || v == "\f" || v == " ")
              T = "start tag annotation";
            else if (v == `
`)
              E = v, T = "start tag annotation";
            else if (v == ".")
              T = "start tag class";
            else {
              if (v == ">" || v == null)
                return v == ">" && f++, ["start tag", y, [], ""];
              y += v;
            }
          else if (T == "start tag class")
            if (v == "	" || v == "\f" || v == " ")
              E && x.push(E), E = "", T = "start tag annotation";
            else if (v == `
`)
              E && x.push(E), E = v, T = "start tag annotation";
            else if (v == ".")
              E && x.push(E), E = "";
            else {
              if (v == ">" || v == null)
                return v == ">" && f++, E && x.push(E), ["start tag", y, x, ""];
              E += v;
            }
          else if (T == "start tag annotation") {
            if (v == ">" || v == null)
              return v == ">" && f++, E = E.split(/[\u0020\t\f\r\n]+/).filter(function(S) {
                if (S)
                  return !0;
              }).join(" "), ["start tag", y, x, E];
            E += v;
          } else if (T == "end tag") {
            if (v == ">" || v == null)
              return v == ">" && f++, ["end tag", y];
            y += v;
          } else if (T == "timestamp tag") {
            if (v == ">" || v == null)
              return v == ">" && f++, ["timestamp", y];
            y += v;
          } else
            g("Never happens.");
          f++;
        }
      }
    }, n = function() {
      function o(d) {
        const f = ("00" + (d - Math.floor(d)).toFixed(3) * 1e3).slice(-3);
        let g = 0, m = 0, T = 0;
        return d >= 3600 && (g = Math.floor(d / 3600)), m = Math.floor((d - 3600 * g) / 60), T = Math.floor(d - 3600 * g - 60 * m), (g ? g + ":" : "") + ("" + m).padStart(2, "0") + ":" + ("" + T).padStart(2, "0") + "." + f;
      }
      function l(d) {
        var f = "";
        const g = Object.keys(e).filter((m) => d[m] !== e[m]);
        return g.includes("direction") && (f += " vertical:" + d.direction), g.includes("alignment") && (f += " align:" + d.alignment), g.includes("size") && (f += " size:" + d.size + "%"), (g.includes("lineAlign") || g.includes("linePosition")) && (f += " line:" + d.linePosition + (d.snapToLines ? "" : "%") + (d.lineAlign && d.lineAlign != e.lineAlign ? "," + d.lineAlign : "")), (g.includes("textPosition") || g.includes("positionAlign")) && (f += " position:" + d.textPosition + "%" + (d.positionAlign && d.positionAlign !== e.positionAlign ? "," + d.positionAlign : "")), f;
      }
      function h(d) {
        for (var f = "", g = 0; g < d.length; g++) {
          var m = d[g];
          if (m.type == "text")
            f += m.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          else if (m.type == "object") {
            if (f += "<" + m.name, m.classes)
              for (var T = 0; T < m.classes.length; T++)
                f += "." + m.classes[T];
            m.value && (f += " " + m.value), f += ">", m.children && (f += h(m.children)), f += "</" + m.name + ">";
          } else
            m.type == "timestamp" ? f += "<" + o(m.value) + ">" : f += "<" + m.value + ">";
        }
        return f;
      }
      function c(d) {
        return (d.id !== void 0 ? d.id + `
` : "") + o(d.startTime) + " --> " + o(d.endTime) + l(d) + `
` + h(d.tree.children) + `

`;
      }
      function u(d) {
        return `STYLE
` + d + `

`;
      }
      this.serialize = function(d, f) {
        var g = `WEBVTT

`;
        if (f)
          for (var m = 0; m < f.length; m++)
            g += u(f[m]);
        for (var m = 0; m < d.length; m++)
          g += c(d[m]);
        return g;
      };
    };
    function r(o) {
      o.WebVTTParser = t, o.WebVTTCueTimingsAndSettingsParser = i, o.WebVTTCueTextParser = s, o.WebVTTSerializer = n;
    }
    typeof window < "u" && r(window), r(a);
  })();
})(vi);
const Pe = /* @__PURE__ */ new Map();
class Lh extends Jn {
  constructor(e) {
    if (super(), this.translations = {}, this.defaultTranslations = Zn, this.message = {}, this.leftTap = {}, this.rightTap = {}, this.leeway = 300, this.seekInterval = 10, this.tapCount = 0, this.chapters = {}, this.currentChapterFile = "", this.previewTime = [], this.currentTimeFile = "", this.fonts = [], this.currentFontFile = "", this.currentSkipFile = "", this.currentSubtitleIndex = 0, this.subtitles = {}, this.currentSubtitleFile = "", this.currentSpriteFile = "", this.playlist = [], this.currentPlaylistItem = {}, this.currentIndex = -1, this.isPlaying = !1, this.muted = !1, this.volume = 100, this.lastTime = 0, this.lockActive = !1, this.plugins = {}, this.stretchOptions = [
      "uniform",
      "fill",
      "exactfit",
      "none"
    ], this.currentAspectRatio = this.options.stretching ?? "uniform", this.allowFullscreen = !0, this.shouldFloat = !1, this.firstFrame = !1, this.chapterSkipPatterns = [
      /^OP$/ui,
      /^ED$/ui,
      /^PV$/ui,
      /^NCOP$/ui,
      /^NCED$/ui,
      /^CM$/ui,
      /^Preview$/ui,
      /^Next Episode Preview$/ui,
      /^Next Time Preview$/ui,
      // /^Intro$/ui,
      /^Outro$/ui,
      /^Opening$/ui,
      /^Ending$/ui,
      /^Opening Credits$/ui,
      /^Ending Credits$/ui,
      /^Opening Theme$/ui,
      /^Ending Theme$/ui,
      /^Opening Song$/ui,
      /^Ending Song$/ui
    ], this.getFileContents = async ({ url: t, options: i, callback: s }) => {
      const n = {
        "Accept-Language": i.language || "en"
      };
      this.options.accessToken && !i.anonymous && (n.Authorization = `Bearer ${this.options.accessToken}`);
      let r = "";
      return this.options.basePath && !t.startsWith("http") && (r = this.options.basePath), await fetch(r + t, {
        ...i,
        headers: n
      }).then(async (o) => {
        switch (i.type) {
          case "blob":
            s(await o.blob());
            break;
          case "json":
            s(await o.json());
            break;
          case "arrayBuffer":
            s(await o.arrayBuffer());
            break;
          case "text":
          default:
            s(await o.text());
            break;
        }
      }).catch((o) => {
        console.error("Failed to fetch file contents", o);
      });
    }, this.lastChapter = "", this.inactivityTimeout = null, this.inactivityTime = 5e3, !e && Pe.size == 0)
      throw new Error("No player element found");
    if (!e && Pe.size > 0)
      return Pe.values().next().value;
    if (typeof e == "number")
      throw Pe.forEach((t, i) => {
        if (parseInt(i, 10) === e)
          return t;
      }), new Error("Player not found");
    return Pe.has(e) ? Pe.get(e) : this.init(e);
  }
  init(e) {
    const t = document.querySelector(`#${e}`);
    if (!t)
      throw new Error(`Player element with ID ${e} not found`);
    if (t.nodeName !== "DIV")
      throw new Error("Element must be a div element");
    return this.playerId = e, this.container = t, this.plugins = {}, this.fetchTranslationsFile().then(), this.styleContainer(), this.createVideoElement(), this.createSubtitleOverlay(), this.createChapterSkipper(), this.createOverlayElement(), this.createOverlayCenterMessage(), Pe.set(e, this), this._removeEvents(), this._addEvents(), this;
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
    const t = e.map((i) => new Promise((s, n) => {
      let r;
      if (i.endsWith(".js") ? (r = document.createElement("script"), r.src = i) : i.endsWith(".css") ? (r = document.createElement("link"), r.rel = "stylesheet", r.href = i) : n(new Error("Unsupported file type")), !r)
        return n(new Error("File could not be loaded"));
      r.addEventListener("load", () => {
        s();
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
    const e = this.getVideoElement().getBoundingClientRect(), t = window.innerHeight || document.documentElement.clientHeight, i = window.innerWidth || document.documentElement.clientWidth, s = e.top <= t && e.top + e.height >= 0, n = e.left <= i && e.left + e.width >= 0;
    return s && n;
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
  createElement(e, t, i) {
    let s;
    return i ? s = document.getElementById(t) ?? document.createElement(e) : s = document.createElement(e), s.id = t, {
      addClasses: (n) => this.addClasses(s, n),
      appendTo: (n) => (n.appendChild(s), s),
      prependTo: (n) => (n.prepend(s), s),
      get: () => s
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
    var i;
    for (const s of t.filter(Boolean))
      (i = e.classList) == null || i.add(s.trim());
    return {
      appendTo: (s) => (s.appendChild(e), e),
      prependTo: (s) => (s.prepend(e), e),
      addClasses: (s) => this.addClasses(e, s),
      get: () => e
    };
  }
  styleContainer() {
    this.container.classList.add("nomercyplayer"), this.container.style.overflow = "hidden", this.container.style.position = "relative", this.container.style.display = "flex", this.container.style.width = "100%", this.container.style.height = "auto", this.container.style.aspectRatio = "16/9", this.container.style.zIndex = "0", this.container.style.alignItems = "center", this.container.style.justifyContent = "center";
  }
  createVideoElement() {
    this.videoElement = this.createElement("video", `${this.playerId}_video`, !0).appendTo(this.container), this.videoElement.style.width = "100%", this.videoElement.style.height = "100%", this.videoElement.style.objectFit = "contain", this.videoElement.style.zIndex = "0", this.videoElement.style.backgroundColor = "black", this.videoElement.style.display = "block", this.videoElement.style.position = "absolute", this.videoElement.autoplay = this.options.autoPlay ?? !1, this.videoElement.controls = this.options.controls ?? !1, this.videoElement.preload = this.options.preload ?? "auto", this.videoElement.muted = this.options.muted ?? localStorage.getItem("nmplayer-muted") === "true", this.videoElement.volume = localStorage.getItem("nmplayer-volume") ? parseFloat(localStorage.getItem("nmplayer-volume")) / 100 : 0.4, this.videoElement.addEventListener("scroll", () => {
      console.log("Scrolling"), this.videoElement.scrollIntoView();
    }), this.ui_setPauseClass();
  }
  createOverlayElement() {
    this.overlay = this.createElement("div", `${this.playerId}_overlay`, !0).addClasses(["overlay"]).appendTo(this.container), this.overlay.style.width = "100%", this.overlay.style.height = "100%", this.overlay.style.position = "absolute", this.overlay.style.zIndex = "10", this.overlay.style.display = "flex", this.overlay.style.flexDirection = "column", this.overlay.style.justifyContent = "center", this.overlay.style.alignItems = "center";
  }
  createOverlayCenterMessage() {
    const e = this.createElement("button", "player-message").addClasses([
      "player-message",
      "hidden",
      "absolute",
      "rounded-md",
      "bg-neutral-900/95",
      "left-1/2",
      "px-4",
      "py-2",
      "pointer-events-none",
      "text-center",
      "top-12",
      "-translate-x-1/2",
      "z-50"
    ]).appendTo(this.overlay);
    return this.on("display-message", (t) => {
      e.style.display = "flex", e.textContent = t;
    }), this.on("remove-message", () => {
      e.style.display = "none", e.textContent = "";
    }), e;
  }
  createSubtitleOverlay() {
    this.subtitleOverlay = this.createElement("div", "subtitle-overlay", !0).addClasses([
      "absolute",
      "w-full",
      "text-center",
      "text-white",
      "text-xl",
      "p-2",
      "z-0",
      "transition-all",
      "duration-300"
    ]).appendTo(this.container), this.subtitleOverlay.style.bottom = "5%", this.subtitleOverlay.style.display = "none", this.container.appendChild(this.subtitleOverlay), this.subtitleText = this.createElement("span", "subtitle-text", !0).addClasses(["subtitle-text", "text-center", "whitespace-pre-line", "font-bolder", "leading-normal"]).appendTo(this.subtitleOverlay), this.subtitleText.style.fontSize = "clamp(1.5rem, 2vw, 2.5rem)", this.subtitleText.style.textShadow = "black 0 0 4px, black 0 0 4px, black 0 0 4px, black 0 0 4px, black 0 0 4px, black 0 0 4px, black 0 0 4px", this.on("time", this.checkSubtitles.bind(this));
  }
  checkSubtitles() {
    if (!this.subtitles || !this.subtitles.cues || this.subtitles.cues.length === 0)
      return;
    if (this.subtitles.errors.length > 0) {
      console.error("Error parsing subtitles:", this.subtitles.errors);
      return;
    }
    const e = this.videoElement.currentTime;
    let t = "";
    this.subtitles.cues.forEach((r) => {
      if (e >= r.startTime && e <= r.endTime) {
        if (r.text === t)
          return;
        t = r.text;
      }
    }), this.subtitleOverlay.style.display = "block", this.subtitleText.innerHTML = "";
    const i = document.createDocumentFragment(), s = t.split(/(<\/?i>|<\/?b>)/gu);
    if (s.length == 1 && s[0] == "")
      return;
    let n = null;
    s.forEach((r) => {
      r === "<i>" ? n = document.createElement("i") : r === "<b>" ? n = document.createElement("b") : r === "</i>" || r === "</b>" ? n && (i.appendChild(n), n = null) : n ? n.appendChild(document.createTextNode(r)) : i.appendChild(document.createTextNode(r));
    }), this.subtitleText.appendChild(i), this.subtitleText.setAttribute("data-language", this.getCaptionLanguage());
  }
  createChapterSkipper() {
    this.on("time", this.checkChapters.bind(this));
  }
  checkChapters() {
    if (!this.chapters || !this.chapters.cues || this.chapters.cues.length === 0)
      return;
    if (this.chapters.errors.length > 0) {
      console.error("Error parsing chapters:", this.chapters.errors);
      return;
    }
    const e = this.videoElement.currentTime;
    let t = this.getCurrentChapter(e);
    if (t)
      for (; this.lastChapter != t.text && this.shouldSkipChapter(t.text); ) {
        this.lastChapter = t.text;
        const i = this.getNextChapter(t.endTime);
        if (!i) {
          console.log("No more chapters"), this.next(), this.lastChapter = "";
          return;
        }
        t = i, console.log("Skipping chapter:", t.text), this.seek(t.startTime);
      }
  }
  shouldSkipChapter(e) {
    return this.chapterSkipPatterns.some((t) => t.test(e));
  }
  getCurrentChapter(e) {
    return this.chapters.cues.find((t) => e >= t.startTime && e <= t.endTime);
  }
  getNextChapter(e) {
    return this.chapters.cues.find((t) => t.startTime >= e);
  }
  hdrSupported() {
    return screen.colorDepth > 24 && window.matchMedia("(color-gamut: p3)").matches;
  }
  loadSource(e) {
    var t, i, s;
    this.videoElement.pause(), this.videoElement.removeAttribute("src"), e.endsWith(".m3u8") ? J.isSupported() ? (this.playlistItem(), this.hls ?? (this.hls = new J({
      debug: this.options.debug ?? !1,
      enableWorker: !0,
      lowLatencyMode: !0,
      backBufferLength: 0,
      maxBufferHole: 0.5,
      maxBufferLength: 60,
      maxMaxBufferLength: 60,
      autoStartLoad: !0,
      testBandwidth: !0,
      // startPosition: item.progress
      // 	? convertToSeconds(item.duration!) / 100 * item.progress.percentage
      // 	: 0,
      videoPreference: {
        preferHDR: this.hdrSupported()
      },
      xhrSetup: (n) => {
        this.options.accessToken && n.setRequestHeader("authorization", `Bearer ${this.options.accessToken}`);
      }
    })), this.emit("hls"), (i = this.hls) == null || i.loadSource(e), (s = this.hls) == null || s.attachMedia(this.videoElement)) : this.videoElement.canPlayType("application/vnd.apple.mpegurl") && (this.videoElement.src = e) : ((t = this.hls) == null || t.destroy(), this.hls = void 0, this.videoElement.src = `${e}${this.options.accessToken ? `?token=${this.options.accessToken}` : ""}`), this.options.autoPlay && this.play().then();
  }
  addGainNode() {
    const e = new (window.AudioContext || window.webkitAudioContext)(), t = e.createMediaElementSource(this.videoElement), i = e.createGain();
    this.gainNode = i, i.gain.value = 1, t.connect(i), i.connect(e.destination), setTimeout(() => {
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
  videoPlayer_playEvent(e) {
    this.emit("beforePlay"), this.container.classList.remove("paused"), this.container.classList.add("playing"), this.emit("play");
  }
  videoPlayer_onPlayingEvent(e) {
    this.videoElement.removeEventListener("playing", this.videoPlayer_onPlayingEvent), this.firstFrame || (this.emit("firstFrame"), this.firstFrame = !0), this.setMediaAPI(), this.on("item", () => {
      this.videoElement.addEventListener("playing", this.videoPlayer_onPlayingEvent), this.firstFrame = !1;
    });
  }
  setCaptionFromStorage() {
    if (localStorage.getItem("nmplayer-subtitle-language") && localStorage.getItem("nmplayer-subtitle-type") && localStorage.getItem("nmplayer-subtitle-ext")) {
      const e = this.getTextTrackIndexBy(
        localStorage.getItem("nmplayer-subtitle-language"),
        localStorage.getItem("nmplayer-subtitle-type"),
        localStorage.getItem("nmplayer-subtitle-ext")
      );
      if (e == null || e == -1)
        return;
      console.log("Setting caption from storage", e), this.setCurrentCaption(e);
    }
  }
  videoPlayer_pauseEvent(e) {
    this.container.classList.remove("playing"), this.container.classList.add("paused"), this.emit("pause", this.videoElement);
  }
  videoPlayer_endedEvent(e) {
    this.currentIndex < this.playlist.length - 1 ? this.playVideo(this.currentIndex + 1) : (console.log("Playlist completed."), this.isPlaying = !1, this.emit("playlistComplete"));
  }
  videoPlayer_errorEvent(e) {
    this.emit("error", this.videoElement);
  }
  videoPlayer_waitingEvent(e) {
    this.emit("waiting", this.videoElement);
  }
  videoPlayer_canplayEvent(e) {
    this.emit("canplay", this.videoElement);
  }
  videoPlayer_loadedmetadataEvent(e) {
    const t = e;
    this.emit("loadedmetadata", this.videoElement), this.emit("duration", this.videoPlayer_getTimeData(t));
  }
  videoPlayer_loadstartEvent(e) {
    this.emit("loadstart", this.videoElement);
  }
  videoPlayer_timeupdateEvent(e) {
    const t = e;
    Number.isNaN(t.target.duration) || Number.isNaN(t.target.currentTime) || this.emit("time", this.videoPlayer_getTimeData(t));
  }
  videoPlayer_durationchangeEvent(e) {
    const t = e;
    this.emit("duration", this.videoPlayer_getTimeData(t)), this.emit("ready");
  }
  videoPlayer_volumechangeEvent(e) {
    this.volume != Math.round(this.videoElement.volume * 100) && this.emit("volume", {
      volume: Math.round(this.videoElement.volume * 100),
      muted: this.videoElement.muted
    }), this.muted != this.videoElement.muted && this.emit("mute", {
      volume: Math.round(this.videoElement.volume * 100),
      muted: this.videoElement.muted
    }), this.muted = this.videoElement.muted, this.volume = Math.round(this.videoElement.volume * 100);
  }
  videoPlayer_getTimeData(e) {
    return {
      currentTime: e.target.currentTime,
      duration: e.target.duration,
      percentage: e.target.currentTime / e.target.duration * 100,
      remaining: e.target.duration - e.target.currentTime,
      currentTimeHuman: $e(e.target.currentTime),
      durationHuman: $e(e.target.duration),
      remainingHuman: $e(e.target.duration - e.target.currentTime),
      playbackRate: e.target.playbackRate
    };
  }
  getTimeData() {
    return {
      currentTime: this.videoElement.currentTime,
      duration: this.videoElement.duration,
      percentage: this.videoElement.currentTime / this.videoElement.duration * 100,
      remaining: this.videoElement.duration - this.videoElement.currentTime,
      currentTimeHuman: $e(this.videoElement.currentTime),
      durationHuman: $e(this.videoElement.duration),
      remainingHuman: $e(this.videoElement.duration - this.videoElement.currentTime),
      playbackRate: this.videoElement.playbackRate
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
    const t = e == null ? void 0 : e.target;
    t && (t.tagName === "BUTTON" || t.tagName === "INPUT") && !this.isTv() || (this.inactivityTimeout = setTimeout(() => {
      this.ui_removeActiveClass();
    }, this.inactivityTime));
  }
  ui_setPlayClass() {
    this.container.classList.remove("paused"), this.container.classList.add("playing"), this.emit("playing", !0);
  }
  ui_setPauseClass() {
    this.container.classList.remove("playing"), this.container.classList.add("paused"), this.emit("playing", !1);
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
    this.videoElement.addEventListener("play", this.videoPlayer_playEvent.bind(this)), this.videoElement.addEventListener("playing", this.videoPlayer_onPlayingEvent.bind(this)), this.videoElement.addEventListener("pause", this.videoPlayer_pauseEvent.bind(this)), this.videoElement.addEventListener("ended", this.videoPlayer_endedEvent.bind(this)), this.videoElement.addEventListener("error", this.videoPlayer_errorEvent.bind(this)), this.videoElement.addEventListener("waiting", this.videoPlayer_waitingEvent.bind(this)), this.videoElement.addEventListener("canplay", this.videoPlayer_canplayEvent.bind(this)), this.videoElement.addEventListener("loadedmetadata", this.videoPlayer_loadedmetadataEvent.bind(this)), this.videoElement.addEventListener("loadstart", this.videoPlayer_loadstartEvent.bind(this)), this.videoElement.addEventListener("timeupdate", this.videoPlayer_timeupdateEvent.bind(this)), this.videoElement.addEventListener("durationchange", this.videoPlayer_durationchangeEvent.bind(this)), this.videoElement.addEventListener("volumechange", this.videoPlayer_volumechangeEvent.bind(this)), this.container.addEventListener("mousemove", this.ui_resetInactivityTimer.bind(this)), this.container.addEventListener("click", this.ui_resetInactivityTimer.bind(this)), this.container.addEventListener("mouseleave", this.handleMouseLeave.bind(this)), this.container.addEventListener("keydown", this.ui_resetInactivityTimer.bind(this)), this.videoElement.addEventListener("keydown", this.ui_resetInactivityTimer.bind(this)), this.on("play", this.ui_setPlayClass.bind(this)), this.on("pause", this.ui_setPauseClass.bind(this)), this.on("showControls", this.ui_addActiveClass.bind(this)), this.on("hideControls", this.ui_removeActiveClass.bind(this)), this.on("dynamicControls", this.ui_resetInactivityTimer.bind(this)), this.on("item", () => {
      this.lastTime = 0, setTimeout(() => {
        var e, t;
        this.emit("captionsList", this.getCaptionsList()), this.emit("levels", this.getQualityLevels()), this.emit("levelsChanging", {
          id: (e = this.hls) == null ? void 0 : e.loadLevel,
          name: (t = this.getQualityLevels().find((i) => {
            var s;
            return i.id === ((s = this.hls) == null ? void 0 : s.loadLevel);
          })) == null ? void 0 : t.name
        }), this.emit("audioTracks", this.getAudioTracks());
      }, 250);
    }), this.on("firstFrame", () => {
      var e, t;
      this.emit("levels", this.getQualityLevels()), this.emit("levelsChanging", {
        id: (e = this.hls) == null ? void 0 : e.loadLevel,
        name: (t = this.getQualityLevels().find((i) => {
          var s;
          return i.id === ((s = this.hls) == null ? void 0 : s.loadLevel);
        })) == null ? void 0 : t.name
      }), this.emit("audioTracks", this.getAudioTracks());
    }), this.once("hls", () => {
      this.hls && (this.hls.on(J.Events.AUDIO_TRACK_LOADING, (e, t) => {
        console.log("Audio track loading", t);
      }), this.hls.on(J.Events.AUDIO_TRACK_LOADED, (e, t) => {
        var i;
        console.log("Audio track loaded", t), this.emit("audioTracks", this.getAudioTracks()), this.emit("audioTrackChanging", {
          id: t.id,
          name: (i = this.getAudioTracks().find((s) => s.id === t.id)) == null ? void 0 : i.name
        });
      }), this.hls.on(J.Events.AUDIO_TRACK_SWITCHING, (e, t) => {
        var i;
        console.log("Audio track switching", t), this.emit("audioTrackChanging", {
          id: t.id,
          name: (i = this.getAudioTracks().find((s) => s.id === t.id)) == null ? void 0 : i.name
        });
      }), this.hls.on(J.Events.AUDIO_TRACK_SWITCHED, (e, t) => {
        var i;
        console.log("Audio track switched", t), this.emit("audioTrackChanged", {
          id: t.id,
          name: (i = this.getAudioTracks().find((s) => s.id === t.id)) == null ? void 0 : i.name
        });
      }), this.hls.on(J.Events.ERROR, (e, t) => {
        console.error("HLS error", t);
      }), this.hls.on(J.Events.LEVEL_LOADED, (e, t) => {
        console.log("Level loaded", t);
      }), this.hls.on(J.Events.LEVEL_LOADING, (e, t) => {
        var i, s;
        this.emit("levels", this.getQualityLevels()), this.emit("levelsChanging", {
          id: (i = this.hls) == null ? void 0 : i.loadLevel,
          name: (s = this.getQualityLevels().find((n) => {
            var r;
            return n.id === ((r = this.hls) == null ? void 0 : r.loadLevel);
          })) == null ? void 0 : s.name
        });
      }), this.hls.on(J.Events.LEVEL_SWITCHED, (e, t) => {
        var i;
        this.emit("levelsChanged", {
          id: t.level,
          name: (i = this.getQualityLevels().find((s) => s.id === t.level)) == null ? void 0 : i.name
        });
      }), this.hls.on(J.Events.LEVEL_SWITCHING, (e, t) => {
        var i;
        this.emit("levelsChanging", {
          id: t.level,
          name: (i = this.getQualityLevels().find((s) => s.id === t.level)) == null ? void 0 : i.name
        });
      }), this.hls.on(J.Events.LEVEL_UPDATED, (e, t) => {
        var i;
        this.emit("levelsChanged", {
          id: t.level,
          name: (i = this.getQualityLevels().find((s) => s.id === t.level)) == null ? void 0 : i.name
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
    }), this.once("item", () => {
      this.on("captionsList", () => {
        this.setCaptionFromStorage();
      }), this.emit("speed", this.videoElement.playbackRate), this.once("audio", () => {
        this.getAudioTracks().length < 2 || (localStorage.getItem("nmplayer-audio-language") ? this.setCurrentAudioTrack(this.getAudioTrackIndexByLanguage(localStorage.getItem("nmplayer-audio-language"))) : this.setCurrentAudioTrack(0), this.once("play", () => {
          localStorage.getItem("nmplayer-audio-language") ? this.setCurrentAudioTrack(this.getAudioTrackIndexByLanguage(localStorage.getItem("nmplayer-audio-language"))) : this.setCurrentAudioTrack(0);
        }));
      }), this.options.disableControls || this.getVideoElement().focus();
      const e = this.getParameterByName("item"), t = e ? parseInt(e, 10) : null, i = this.getParameterByName("season"), s = i ? parseInt(i, 10) : null, n = this.getParameterByName("episode"), r = n ? parseInt(n, 10) : null;
      if (t)
        setTimeout(() => {
          this.setEpisode(0, t);
        }, 0);
      else if (s && r)
        setTimeout(() => {
          this.setEpisode(s, r);
        }, 0);
      else {
        const o = this.getPlaylist().filter((h) => h.progress);
        if (o.length == 0 && this.options.autoPlay) {
          this.play().then();
          return;
        }
        const l = o.sort((h, c) => {
          var u;
          return (u = c.progress.date) == null ? void 0 : u.localeCompare(h.progress.date);
        }).at(0);
        if (!(l != null && l.progress)) {
          this.options.autoPlay && this.play().then();
          return;
        }
        setTimeout(() => {
          l.progress && l.progress.percentage > 90 ? this.playlistItem(this.getPlaylist().indexOf(l) + 1) : this.playlistItem(this.getPlaylist().indexOf(l));
        }, 0), this.once("play", () => {
          l.progress && this.seek(er(l.duration) / 100 * l.progress.percentage);
        });
      }
    }), this.on("playing", () => {
      this.container.classList.remove("buffering"), this.container.classList.remove("error");
    }), this.on("waiting", () => {
      this.container.classList.add("buffering");
    }), this.on("error", () => {
      this.container.classList.add("error");
    }), this.on("ended", () => {
      this.container.classList.remove("buffering"), this.container.classList.remove("error");
    }), this.on("time", (e) => {
      this.container.classList.remove("buffering"), this.container.classList.remove("error"), e.currentTime > this.lastTime + 5 && (this.emit("lastTimeTrigger", e), this.lastTime = e.currentTime);
    }), this.on("bufferedEnd", () => {
      this.container.classList.remove("buffering");
    }), this.on("stalled", () => {
      this.container.classList.add("buffering");
    }), this.on("item", () => {
      this.container.classList.remove("buffering"), this.container.classList.remove("error"), this.setCaptionFromStorage(), this.fetchChapterFile();
    });
  }
  _removeEvents() {
    this.videoElement.removeEventListener("play", this.videoPlayer_playEvent.bind(this)), this.videoElement.removeEventListener("playing", this.videoPlayer_onPlayingEvent.bind(this)), this.videoElement.removeEventListener("pause", this.videoPlayer_pauseEvent.bind(this)), this.videoElement.removeEventListener("ended", this.videoPlayer_endedEvent.bind(this)), this.videoElement.removeEventListener("error", this.videoPlayer_errorEvent.bind(this)), this.videoElement.removeEventListener("waiting", this.videoPlayer_waitingEvent.bind(this)), this.videoElement.removeEventListener("canplay", this.videoPlayer_canplayEvent.bind(this)), this.videoElement.removeEventListener("loadedmetadata", this.videoPlayer_loadedmetadataEvent.bind(this)), this.videoElement.removeEventListener("loadstart", this.videoPlayer_loadstartEvent.bind(this)), this.videoElement.removeEventListener("timeupdate", this.videoPlayer_timeupdateEvent.bind(this)), this.videoElement.removeEventListener("durationchange", this.videoPlayer_durationchangeEvent.bind(this)), this.videoElement.removeEventListener("volumechange", this.videoPlayer_volumechangeEvent.bind(this)), this.container.removeEventListener("mousemove", this.ui_resetInactivityTimer.bind(this)), this.container.removeEventListener("click", this.ui_resetInactivityTimer.bind(this)), this.container.removeEventListener("mouseleave", this.handleMouseLeave.bind(this)), this.container.removeEventListener("keydown", this.ui_resetInactivityTimer.bind(this)), this.videoElement.removeEventListener("keydown", this.ui_resetInactivityTimer.bind(this)), this.off("play", this.ui_setPlayClass.bind(this)), this.off("pause", this.ui_setPauseClass.bind(this)), this.off("showControls", this.ui_addActiveClass.bind(this)), this.off("hideControls", this.ui_removeActiveClass.bind(this)), this.off("dynamicControls", this.ui_resetInactivityTimer.bind(this));
  }
  getParameterByName(e, t = window.location.href) {
    e = e.replace(/[[\]]/gu, "\\$&");
    const s = new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`, "u").exec(t);
    return s ? s[2] ? decodeURIComponent(s[2].replace(/\+/gu, " ")) : "" : null;
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
        album: e.season ? `S${Bi(e.season, 2)}E${Bi(e.episode ?? 0, 2)}` : "",
        artwork: e.image ? [
          {
            src: e.image,
            type: `image/${e.image.split(".").at(-1)}`
          }
        ] : []
      }), typeof navigator.mediaSession.setActionHandler == "function" && (navigator.mediaSession.setActionHandler("previoustrack", this.previous.bind(this)), navigator.mediaSession.setActionHandler("nexttrack", this.next.bind(this)), navigator.mediaSession.setActionHandler("seekbackward", (i) => this.rewindVideo.bind(this)(i.seekTime)), navigator.mediaSession.setActionHandler("seekforward", (i) => this.forwardVideo.bind(this)(i.seekTime)), navigator.mediaSession.setActionHandler("seekto", (i) => this.seek(i.seekTime)), navigator.mediaSession.setActionHandler("play", this.play.bind(this)), navigator.mediaSession.setActionHandler("pause", this.pause.bind(this)));
    }
  }
  /**
   * Returns the localized string for the given value, if available.
   * If the value is not found in the translations, it returns the original value.
   * @param value - The string value to be localized.
   * @returns The localized string, if available. Otherwise, the original value.
   */
  localize(e) {
    return this.translations && this.translations[e] ? this.translations[e] : this.defaultTranslations && this.defaultTranslations[e] ? this.defaultTranslations[e] : e;
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
    return (e = this.playlistItem().tracks) == null ? void 0 : e.filter((t) => t.kind === "subtitles").map((t, i) => {
      var s, n;
      return {
        ...t,
        id: i,
        ext: t.file.split(".").at(-1) ?? "vtt",
        type: (s = t.label) != null && s.includes("Full") || (n = t.label) != null && n.includes("full") ? "full" : "sign"
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
    return (t = (e = this.playlistItem().tracks) == null ? void 0 : e.find((i) => i.kind === "thumbnails")) == null ? void 0 : t.file;
  }
  /**
   * Returns the file associated with the sprite metadata of the current playlist item.
   * @returns The sprite file, or undefined if no sprite metadata is found.
   */
  getSpriteFile() {
    var e, t;
    return (t = (e = this.playlistItem().tracks) == null ? void 0 : e.find((i) => i.kind === "sprite")) == null ? void 0 : t.file;
  }
  /**
   * Returns the file associated with the chapter metadata of the current playlist item, if any.
   * @returns The chapter file, or undefined if no chapter metadata is found.
   */
  getChapterFile() {
    var e, t;
    return (t = (e = this.playlistItem().tracks) == null ? void 0 : e.find((i) => i.kind === "chapters")) == null ? void 0 : t.file;
  }
  /**
   * Returns the file associated with the chapter metadata of the current playlist item, if any.
   * @returns The chapter file, or undefined if no chapter metadata is found.
   */
  getSkipFile() {
    var e, t;
    return (t = (e = this.playlistItem().tracks) == null ? void 0 : e.find((i) => i.kind === "skippers")) == null ? void 0 : t.file;
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
        const i = new window.WebVTTParser();
        this.skippers = i.parse(t, "metadata"), this.getDuration() ? this.emit("skippers", this.getSkippers()) : this.once("duration", () => {
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
    return ((t = (e = this.skippers) == null ? void 0 : e.cues) == null ? void 0 : t.map((i, s) => ({
      id: `Skip ${s}`,
      title: i.text,
      startTime: i.startTime,
      endTime: i.endTime,
      type: i.text.trim()
    }))) ?? [];
  }
  /**
   * Returns the current skip based on the current time.
   * @returns The current skip object or undefined if no skip is found.
   */
  getSkip() {
    var e;
    return (e = this.getSkippers()) == null ? void 0 : e.find((t) => this.getCurrentTime() >= t.startTime && this.getCurrentTime() <= t.endTime);
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
    return (t = (e = this.playlistItem().tracks) == null ? void 0 : e.find((i) => i.kind === "fonts")) == null ? void 0 : t.file;
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
        try {
          this.fonts = JSON.parse(t).map((i) => {
            const s = e.replace(/\/[^/]*$/u, "");
            return {
              ...i,
              file: `${s}/fonts/${i.file}`
            };
          });
        } catch {
          this.fonts = [];
        }
        this.emit("fonts", this.fonts);
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
      callback: (i) => {
        this.translations = JSON.parse(i), this.emit("translations", this.translations);
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
        const i = new vi.WebVTTParser();
        this.chapters = i.parse(t, "chapters"), console.log("Chapters", this.chapters, t), this.once("duration", () => {
          this.emit("chapters", this.chapters);
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
    return ((t = (e = this.chapters) == null ? void 0 : e.cues) == null ? void 0 : t.map((i, s) => {
      var r, o;
      const n = ((o = (r = this.chapters) == null ? void 0 : r.cues[s + 1]) == null ? void 0 : o.startTime) ?? this.getDuration();
      return {
        id: `Chapter ${s}`,
        title: i.text,
        left: i.startTime / this.getDuration() * 100,
        width: (n - i.startTime) / this.getDuration() * 100,
        startTime: i.startTime,
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
    return (e = this.getChapters()) == null ? void 0 : e.find((t) => this.getCurrentTime() >= t.startTime && this.getCurrentTime() <= t.endTime);
  }
  fetchSubtitleFile() {
    const e = this.getSubtitleFile();
    e && this.currentSubtitleFile !== e ? (this.currentSubtitleFile = e, this.emit("captionsChanged", this.getCurrentCaptions()), this.getFileContents({
      url: e,
      options: {
        anonymous: !1
      },
      callback: (t) => {
        const i = new vi.WebVTTParser();
        this.subtitles = i.parse(t, "metadata"), this.storeSubtitleChoice(), this.once("duration", () => {
          this.emit("subtitles", this.subtitles);
        });
      }
    }).then()) : this.emit("captionsChanged", this.getCurrentCaptions());
  }
  // Method to load and play a video from the playlist
  playVideo(e) {
    e >= 0 && e < this.playlist.length ? (this.subtitles = {}, this.subtitleText.textContent = "", this.subtitleOverlay.style.display = "none", this.currentIndex !== e && setTimeout(() => {
      this.emit("item", this.currentPlaylistItem);
    }, 0), this.currentIndex = e, this.currentPlaylistItem = this.playlist[e], this.videoElement.poster = this.currentPlaylistItem.image ?? "", this.loadSource((this.options.basePath ?? "") + this.currentPlaylistItem.file)) : console.log("No more videos in the playlist.");
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
      console.log("Playlist fetched", e), this.playlist = e.map((t) => ({
        ...t,
        season: t.season,
        episode: t.episode
      })).filter((t) => !!t.file), setTimeout(() => {
        this.emit("playlist", this.playlist);
      }, 0), this.playVideo(0);
    }) : Array.isArray(this.options.playlist) && (this.playlist = this.options.playlist.map((e, t) => ({
      ...e,
      season: e.season,
      episode: e.episode
    })), setTimeout(() => {
      this.emit("playlist", this.playlist);
    }, 0), this.playVideo(0));
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
    return matchMedia("(max-width: 520px) and (orientation: portrait), (max-height: 520px) and (orientation: landscape)").matches;
  }
  /**
   * Determines if the current device is a TV based on the user agent string or the window dimensions.
   * @returns {boolean} True if the current device is a TV, false otherwise.
   */
  isTv() {
    return matchMedia("(width: 960px) and (height: 540px)").matches;
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
  load(e) {
    this.playlist = e;
  }
  playlistItem(e) {
    if (e === void 0)
      return this.currentPlaylistItem;
    e != this.currentIndex && this.playVideo(e);
  }
  /**
   * Sets the current episode to play based on the given season and episode numbers.
   * If the episode is not found in the playlist, the first item in the playlist is played.
   * @param season - The season number of the episode to play.
   * @param episode - The episode number to play.
   */
  setEpisode(e, t) {
    const i = this.getPlaylist().findIndex((s) => s.season == e && s.episode == t);
    i == -1 ? this.playlistItem(0) : this.playlistItem(i), this.play().then();
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
  getCurrentTime() {
    return this.videoElement.currentTime;
  }
  getDuration() {
    return this.videoElement.duration;
  }
  seek(e) {
    return this.videoElement.currentTime = e;
  }
  restart() {
    this.seek(0);
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
      this.emit("remove-rewind"), this.seek(this.getCurrentTime() - this.tapCount), this.tapCount = 0;
    }, this.leeway);
  }
  /**
   * Forwards the video by the specified time interval.
   * @param time - The time interval to forward the video by, in seconds. Defaults to 10 seconds if not provided.
   */
  forwardVideo(e = this.seekInterval ?? 10) {
    console.log("Forwarding", e), this.emit("remove-rewind"), clearTimeout(this.rightTap), this.tapCount += e, this.emit("forward", this.tapCount), this.rightTap = setTimeout(() => {
      this.emit("remove-forward"), this.seek(this.getCurrentTime() + this.tapCount), this.tapCount = 0;
    }, this.leeway);
  }
  // Volume
  getMute() {
    return this.videoElement.muted;
  }
  getVolume() {
    return Math.floor(this.videoElement.volume * 100);
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
    let t = e / 100;
    t > 1 && (t = 1), t < 0 && (t = 0), this.videoElement.volume = t, this.setMute(!1), localStorage.setItem("nmplayer-volume", `${this.videoElement.volume * 100}`);
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
    }).catch((e) => {
      alert(
        `Error attempting to enable fullscreen mode: ${e.message} (${e.name})`
      );
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
    return this.hls ? this.hls.audioTracks.map((e, t) => ({
      ...e,
      id: t,
      language: e.lang,
      label: e.name
    })) : [];
  }
  getCurrentAudioTrack() {
    return this.hls ? this.hls.audioTrack : -1;
  }
  getCurrentAudioTrackName() {
    return this.hls ? this.hls.audioTracks[this.hls.audioTrack].name : "";
  }
  setCurrentAudioTrack(e) {
    var t;
    !e && e != 0 || !this.hls || (this.hls.audioTrack = e, localStorage.setItem("nmplayer-audio-language", ((t = this.getAudioTracks()[e]) == null ? void 0 : t.lang) ?? ""));
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
    return this.hls ? this.hls.levels.map((e, t) => ({
      ...e,
      id: t,
      label: e.name
    })).filter((e) => {
      var s;
      const t = (s = e._attrs.at(0)) == null ? void 0 : s["VIDEO-RANGE"];
      return this.hdrSupported() ? !0 : t !== "PQ";
    }) : [];
  }
  getCurrentQuality() {
    return this.hls ? this.hls.currentLevel : -1;
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
    const e = this.getSubtitles() ?? [];
    return e.unshift({
      id: -1,
      label: "Off",
      language: "",
      type: "none",
      ext: "none",
      file: "",
      kind: "subtitles"
    }), e;
  }
  hasCaptions() {
    var e;
    return (((e = this.getSubtitles()) == null ? void 0 : e.length) ?? 0) > 0;
  }
  getCurrentCaptions() {
    var e;
    return ((e = this.getSubtitles()) == null ? void 0 : e[this.currentSubtitleIndex]) ?? {
      id: -1,
      label: "Off",
      language: "",
      kind: "subtitles",
      type: "none",
      file: "",
      ext: "none",
      default: !0
    };
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
  getTextTrackIndexBy(e, t, i) {
    var n, r;
    const s = (n = this.getCaptionsList()) == null ? void 0 : n.findIndex((o) => (o.file ?? o.id).endsWith(`${e}.${t}.${i}`));
    return s === -1 ? ((r = this.getCaptionsList()) == null ? void 0 : r.findIndex((o) => o.language === e && o.type === t && o.ext === i)) - 1 : s - 1;
  }
  setCurrentCaption(e) {
    if (!(!e && e != 0)) {
      if (this.currentSubtitleFile = "", this.currentSubtitleIndex = e, this.subtitles = {}, this.subtitleText.textContent = "", this.subtitleOverlay.style.display = "none", e == -1) {
        this.emit("captionsChanged", this.getCurrentCaptions()), this.storeSubtitleChoice();
        return;
      }
      this.fetchSubtitleFile();
    }
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
   */
  storeSubtitleChoice() {
    const e = this.getCurrentCaptions();
    if (!e)
      return;
    const { language: t, type: i, ext: s } = e;
    !t || !i || !s || (localStorage.setItem("nmplayer-subtitle-language", t), localStorage.setItem("nmplayer-subtitle-type", i), localStorage.setItem("nmplayer-subtitle-ext", s));
  }
  /**
   * Cycles through the available subtitle tracks and sets the active track to the next one.
   * If there are no subtitle tracks, this method does nothing.
   * If the current track is the last one, this method sets the active track to the first one.
   * Otherwise, it sets the active track to the next one.
   * Finally, it displays a message indicating the current subtitle track.
   */
  cycleSubtitles() {
    this.hasCaptions() && (this.getCaptionIndex() === this.getCaptionsList().length - 1 ? this.setCurrentCaption(-1) : this.setCurrentCaption(this.getCaptionIndex() + 1), this.displayMessage(`${this.localize("Subtitle")}: ${this.getCaptionLabel() || this.localize("Off")}`));
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
  dispose() {
    clearTimeout(this.message), clearTimeout(this.leftTap), clearTimeout(this.rightTap), this.inactivityTimeout && clearTimeout(this.inactivityTimeout), this._removeEvents();
    for (const e of Object.values(this.plugins))
      console.log("Disposing plugin", e), e.dispose();
    this.plugins = {}, this.hls && (this.hls.destroy(), this.hls = void 0), this.gainNode && (this.removeGainNode(), this.gainNode = void 0), this.container && (this.container.innerHTML = ""), Pe.delete(this.playerId), this.emit("dispose"), this.off("all");
  }
  /**
   * Returns an array of objects representing each season in the playlist, along with the number of episodes in each season.
   * @returns {Array<{ season: number, seasonName: string, episodes: number }>} An array of objects representing each season in the playlist, along with the number of episodes in each season.
   */
  getSeasons() {
    return tr(this.getPlaylist(), "season").map((e) => ({
      season: e.season,
      seasonName: e.seasonName,
      episodes: this.getPlaylist().filter((t) => t.season == e.season).length
    }));
  }
}
String.prototype.toTitleCase = function() {
  let a, e, t;
  t = this.replace(/([^\W_]+[^\s-]*) */gu, (n) => n.charAt(0).toUpperCase() + n.substring(1).toLowerCase());
  const i = ["A", "An", "The", "And", "But", "Or", "For", "Nor", "As", "At", "By", "For", "From", "In", "Into", "Near", "Of", "On", "Onto", "To", "With"];
  for (a = 0, e = i.length; a < e; a++)
    t = t.replace(new RegExp(`\\s${i[a]}\\s`, "gu"), (n) => n.toLowerCase());
  const s = ["Id", "Tv"];
  for (a = 0, e = s.length; a < e; a++)
    t = t.replace(new RegExp(`\\b${s[a]}\\b`, "gu"), s[a].toUpperCase());
  return t;
};
String.prototype.titleCase = function(a = navigator.language.split("-")[0], e = !0) {
  let t, i = [];
  if (t = this.replace(/([^\s:\-'])([^\s:\-']*)/gu, (n) => n.charAt(0).toUpperCase() + n.substring(1).toLowerCase()).replace(/Mc(.)/gu, (n, r) => `Mc${r.toUpperCase()}`), e) {
    i = ["A", "An", "The", "At", "By", "For", "In", "Of", "On", "To", "Up", "And", "As", "But", "Or", "Nor", "Not"], a == "FR" ? i = ["Un", "Une", "Le", "La", "Les", "Du", "De", "Des", "À", "Au", "Aux", "Par", "Pour", "Dans", "Sur", "Et", "Comme", "Mais", "Ou", "Où", "Ne", "Ni", "Pas"] : a == "NL" && (i = ["De", "Het", "Een", "En", "Van", "Naar", "Op", "Door", "Voor", "In", "Als", "Maar", "Waar", "Niet", "Bij", "Aan"]);
    for (let n = 0; n < i.length; n++)
      t = t.replace(new RegExp(`\\s${i[n]}\\s`, "gu"), (r) => r.toLowerCase());
  }
  const s = ["Id", "R&d"];
  for (let n = 0; n < s.length; n++)
    t = t.replace(new RegExp(`\\b${s[n]}\\b`, "gu"), s[n].toUpperCase());
  return t;
};
const Rh = (a) => new Lh(a);
window.nmplayer = Rh;
export {
  Rh as n,
  vi as p
};
