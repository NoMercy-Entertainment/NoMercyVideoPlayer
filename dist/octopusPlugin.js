import { P as q } from "./plugin.js";
var L = 1e-3, w = 0.01, P = 1;
const C = function(l) {
  var c = !1;
  try {
    if (typeof WebAssembly == "object" && typeof WebAssembly.instantiate == "function") {
      var p = new WebAssembly.Module(Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0));
      p instanceof WebAssembly.Module && (c = new WebAssembly.Instance(p) instanceof WebAssembly.Instance);
    }
  } catch {
  }
  console.log("WebAssembly support detected: " + (c ? "yes" : "no"));
  var e = this;
  e.canvas = l.canvas, e.renderMode = l.renderMode || (l.lossyRender ? "lossy" : "wasm-blend"), e.dropAllAnimations = l.dropAllAnimations || !1, e.libassMemoryLimit = l.libassMemoryLimit || 0, e.libassGlyphLimit = l.libassGlyphLimit || 0, e.targetFps = l.targetFps || 24, e.prescaleFactor = l.prescaleFactor || 1, e.prescaleHeightLimit = l.prescaleHeightLimit || 1080, e.maxRenderHeight = l.maxRenderHeight || 0, e.resizeVariation = l.resizeVariation || 0.2, e.renderAhead = l.renderAhead || 0, e.isOurCanvas = !1, e.video = l.video, e.canvasParent = null, e.fonts = l.fonts || [], e.availableFonts = l.availableFonts || [], e.fallbackFont = l.fallbackFont || "default.woff2", e.lazyFileLoading = l.lazyFileLoading || !1, e.onReadyEvent = l.onReady, c ? e.workerUrl = l.workerUrl || "subtitles-octopus-worker.js" : e.workerUrl = l.legacyWorkerUrl || "subtitles-octopus-worker-legacy.js", e.subUrl = l.subUrl, e.subContent = l.subContent || null, e.onErrorEvent = l.onError, e.debug = l.debug || !1, e.lastRenderTime = 0, e.pixelRatio = window.devicePixelRatio || 1, e.timeOffset = l.timeOffset || 0, e.renderedItems = [], e.renderAhead = e.renderAhead * 1024 * 1024 * 0.9, e.oneshotState = {
    displayedEvent: null,
    // Last displayed event
    eventStart: null,
    eventOver: !1,
    iteration: 0,
    renderRequested: !1,
    requestNextTimestamp: -1,
    nextRequestOffset: 0,
    // Next request offset, s
    restart: !0,
    prevWidth: null,
    prevHeight: null
  }, e.rafId = 0, e.hasAlphaBug = !1, e.accessToken = l.accessToken || null;
  var f, u;
  (function() {
    if (typeof ImageData.prototype.constructor == "function")
      try {
        new window.ImageData(new Uint8ClampedArray([0, 0, 0, 0]), 1, 1);
        return;
      } catch {
        console.log("detected that ImageData is not constructable despite browser saying so");
      }
    var t = document.createElement("canvas"), r = t.getContext("2d", { willReadFrequently: !0 });
    window.ImageData = function() {
      var a = 0;
      if (arguments[0] instanceof Uint8ClampedArray)
        var s = arguments[a++];
      var n = arguments[a++], o = arguments[a], i = r.createImageData(n, o);
      return s && i.data.set(s), i;
    };
  })(), e.workerError = function(t) {
    if (console.error("Worker error: ", t), e.onErrorEvent && e.onErrorEvent(t), !e.debug)
      throw e.dispose(), new Error("Worker error: " + t);
  }, e.init = function() {
    if (!window.Worker) {
      e.workerError("worker not supported");
      return;
    }
    e.worker || (e.worker = new Worker(e.workerUrl), e.worker.addEventListener("message", e.onWorkerMessage), e.worker.addEventListener("error", e.workerError)), e.workerActive = !1, e.createCanvas(), e.setVideo(l.video), e.setSubUrl(l.subUrl), f = e.canvas.width, u = e.canvas.height, e.worker.postMessage({
      target: "worker-init",
      width: e.canvas.width,
      height: e.canvas.height,
      URL: document.URL,
      currentScript: e.workerUrl,
      preMain: !0,
      renderMode: e.renderMode,
      subUrl: e.subUrl,
      subContent: e.subContent,
      fonts: e.fonts,
      availableFonts: e.availableFonts,
      fallbackFont: e.fallbackFont,
      lazyFileLoading: e.lazyFileLoading,
      debug: e.debug,
      targetFps: e.targetFps,
      libassMemoryLimit: e.libassMemoryLimit,
      libassGlyphLimit: e.libassGlyphLimit,
      renderOnDemand: e.renderAhead > 0,
      dropAllAnimations: e.dropAllAnimations,
      accessToken: e.accessToken
    });
  }, e.createCanvas = function() {
    e.canvas || (e.video ? (e.isOurCanvas = !0, e.canvas = document.createElement("canvas"), e.canvas.className = "libassjs-canvas", e.canvas.style.display = "none", e.canvasParent = document.createElement("div"), e.canvasParent.className = "libassjs-canvas-parent", e.canvasParent.appendChild(e.canvas), e.video.nextSibling ? e.video.parentNode.insertBefore(e.canvasParent, e.video.nextSibling) : e.video.parentNode.appendChild(e.canvasParent)) : e.canvas || e.workerError("Don't know where to render: you should give video or canvas in options.")), e.ctx = e.canvas.getContext("2d", { willReadFrequently: !0 }), e.bufferCanvas = document.createElement("canvas"), e.bufferCanvasCtx = e.bufferCanvas.getContext("2d", { willReadFrequently: !0 }), e.bufferCanvas.width = 1, e.bufferCanvas.height = 1;
    var t = new Uint8ClampedArray([0, 255, 0, 0]), r = new ImageData(t, 1, 1);
    e.bufferCanvasCtx.clearRect(0, 0, 1, 1), e.ctx.clearRect(0, 0, 1, 1);
    var a = e.ctx.getImageData(0, 0, 1, 1).data;
    e.bufferCanvasCtx.putImageData(r, 0, 0), e.ctx.drawImage(e.bufferCanvas, 0, 0);
    var s = e.ctx.getImageData(0, 0, 1, 1).data;
    e.hasAlphaBug = a[1] != s[1], e.hasAlphaBug && console.log("Detected a browser having issue with transparent pixels, applying workaround");
  };
  function m() {
    e.setCurrentTime(e.video.currentTime + e.timeOffset);
  }
  function b() {
    e.setIsPaused(!1, e.video.currentTime + e.timeOffset);
  }
  function h() {
    e.setIsPaused(!0, e.video.currentTime + e.timeOffset);
  }
  function S() {
    e.video.removeEventListener("timeupdate", m, !1);
  }
  function E() {
    e.video.addEventListener("timeupdate", m, !1);
    var t = e.video.currentTime + e.timeOffset;
    e.setCurrentTime(t), e.renderAhead > 0 && T(t, !0);
  }
  function x() {
    e.setRate(e.video.playbackRate);
  }
  function F() {
    e.setIsPaused(!0, e.video.currentTime + e.timeOffset);
  }
  function k(t) {
    t.target.removeEventListener(t.type, k, !1), e.resize();
  }
  e.setVideo = function(t) {
    e.video = t, e.video && (e.video.addEventListener("timeupdate", m, !1), e.video.addEventListener("playing", b, !1), e.video.addEventListener("pause", h, !1), e.video.addEventListener("seeking", S, !1), e.video.addEventListener("seeked", E, !1), e.video.addEventListener("ratechange", x, !1), e.video.addEventListener("waiting", F, !1), document.addEventListener("fullscreenchange", e.resizeWithTimeout, !1), document.addEventListener("mozfullscreenchange", e.resizeWithTimeout, !1), document.addEventListener("webkitfullscreenchange", e.resizeWithTimeout, !1), document.addEventListener("msfullscreenchange", e.resizeWithTimeout, !1), window.addEventListener("resize", e.resizeWithTimeout, !1), typeof ResizeObserver < "u" && (e.ro = new ResizeObserver(e.resizeWithTimeout), e.ro.observe(e.video)), e.video.videoWidth > 0 ? e.resize() : e.video.addEventListener("loadedmetadata", k, !1));
  }, e.getVideoPosition = function() {
    var t = e.video.videoWidth / e.video.videoHeight, r = e.video.offsetWidth, a = e.video.offsetHeight, s = r / a, n = r, o = a;
    s > t ? n = Math.floor(a * t) : o = Math.floor(r / t);
    var i = (r - n) / 2, d = (a - o) / 2;
    return {
      width: n,
      height: o,
      x: i,
      y: d
    };
  }, e.setSubUrl = function(t) {
    e.subUrl = t;
  };
  function T(t, r) {
    for (var a = [], s = 0, n = e.renderedItems.length; s < n; s++) {
      var o = e.renderedItems[s];
      (o.emptyFinish < 0 || t < o.emptyFinish) && a.push(o);
    }
    if (r && a.length > 0 && t < a[0].eventStart)
      if (a[0].eventStart - t > 60)
        console.info("seeked back too far, cleaning prerender buffer"), a = [];
      else {
        console.info("seeked backwards, need to free up some buffer");
        for (var i = 0, d = e.renderAhead * 0.3, v = [], s = 0, n = a.length; s < n; s++) {
          var o = a[s];
          if (i += o.size, i >= d || o.emptyFinish < 0) break;
          v.push(o);
        }
        a = v;
      }
    r && (e.oneshotState.displayedEvent = null, e.oneshotState.nextRequestOffset = 0);
    var g = a.length < e.renderedItems.length;
    return e.renderedItems = a, g;
  }
  function y(t, r) {
    if (!(!e.renderAhead || e.renderAhead <= 0) && !(e.oneshotState.renderRequested && !r)) {
      if (typeof t > "u") {
        if (!e.video) return;
        t = e.video.currentTime + e.timeOffset;
      }
      for (var a = 0, s = 0, n = e.renderedItems.length; s < n; s++) {
        var o = e.renderedItems[s];
        if (o.emptyFinish < 0) {
          console.info("oneshot already reached end-of-events");
          return;
        }
        if (t >= o.eventStart && t < o.emptyFinish) {
          console.debug("not requesting a render for " + t + " as event already covering it exists (start=" + o.eventStart + ", empty=" + o.emptyFinish + ")");
          return;
        }
        a += o.size;
      }
      if (a <= e.renderAhead) {
        var i = t - (r ? 0 : L);
        e.oneshotState.renderRequested ? (e.workerActive, e.oneshotState.requestNextTimestamp = i) : (e.oneshotState.renderRequested = !0, e.worker.postMessage({
          target: "oneshot-render",
          lastRendered: i,
          renderNow: r,
          iteration: e.oneshotState.iteration
        }));
      }
    }
  }
  function R(t, r) {
    e.oneshotState.displayedEvent = t;
    var a = t.eventFinish !== t.emptyFinish && t.eventFinish <= r;
    if (!(e.oneshotState.eventStart == t.eventStart && e.oneshotState.eventOver == a)) {
      e.oneshotState.eventStart = t.eventStart, e.oneshotState.eventOver = a, e.oneshotState.nextRequestOffset = (e.oneshotState.nextRequestOffset + t.spentTime * 1e-3) * 0.5, e.oneshotState.nextRequestOffset = Math.min(e.oneshotState.nextRequestOffset, P);
      var s = performance.now();
      if ((t.viewport.width != e.canvas.width || t.viewport.height != e.canvas.height) && (e.canvas.width = t.viewport.width, e.canvas.height = t.viewport.height), e.ctx.clearRect(0, 0, e.canvas.width, e.canvas.height), !a)
        for (var n = 0; n < t.items.length; n++) {
          var o = t.items[n];
          e.bufferCanvas.width = o.w, e.bufferCanvas.height = o.h, e.bufferCanvasCtx.putImageData(o.image, 0, 0), e.ctx.drawImage(e.bufferCanvas, o.x, o.y);
        }
      if (e.debug) {
        var i = Math.round(performance.now() - s);
        console.log("render: " + Math.round(t.spentTime - t.blendTime) + " ms, blend: " + Math.round(t.blendTime) + " ms, draw: " + i + " ms");
      }
    }
  }
  function M() {
    if (e.rafId = window.requestAnimationFrame(M), !!e.video) {
      for (var t = e.video.currentTime + e.timeOffset, r = null, a = 0, s = e.renderedItems.length; a < s; a++) {
        var n = e.renderedItems[a];
        if (n.eventStart <= t)
          r = n;
        else
          break;
      }
      r ? R(r, t) : e.oneshotState.displayedEvent && R(e.oneshotState.displayedEvent, t);
      var o = t;
      e.video.paused || (o += Math.max(e.oneshotState.nextRequestOffset, 1 / e.targetFps) * e.video.playbackRate);
      for (var i = null, d = -1, v = !1, a = 0, s = e.renderedItems.length; a < s; a++) {
        var n = e.renderedItems[a];
        if (n.eventStart <= o)
          i = n, d = n.emptyFinish;
        else if (d >= 0)
          if (n.eventStart - d < w)
            d = n.emptyFinish, v = n.animated;
          else
            break;
        else
          break;
      }
      i && (d >= 0 ? o = Math.max(d, o) : o = -1);
      var g = !e.video.paused && T(t);
      (g || !r || e.oneshotState.restart) && o >= 0 && Math.abs(e.oneshotState.requestNextTimestamp - o) > w && y(o, o === d ? v : !0), e.oneshotState.restart = !1;
    }
  }
  function A() {
    window.cancelAnimationFrame(e.rafId), e.rafId = 0;
  }
  e.resetRenderAheadCache = function(t) {
    if (e.renderAhead > 0) {
      var r = [];
      if (t && e.oneshotState.prevHeight && e.oneshotState.prevWidth) {
        if (e.oneshotState.prevHeight === u && e.oneshotState.prevWidth === f) return;
        var a = 10, s = e.renderAhead * 0.3;
        u >= e.oneshotState.prevHeight * (1 - e.resizeVariation) && u <= e.oneshotState.prevHeight * (1 + e.resizeVariation) && f >= e.oneshotState.prevWidth * (1 - e.resizeVariation) && f <= e.oneshotState.prevWidth * (1 + e.resizeVariation) && (console.debug("viewport changes are small, leaving more of prerendered buffer"), a = 30, s = e.renderAhead * 0.5);
        for (var n = e.video.currentTime + e.timeOffset + a, o = 0, i = 0; i < e.renderedItems.length; i++) {
          var d = e.renderedItems[i];
          if (d.emptyFinish < 0 || n < d.emptyFinish || (o += d.size, o >= s)) break;
          r.push(d);
        }
      }
      console.info("resetting prerender cache"), e.renderedItems = r, e.oneshotState.eventStart = null, e.oneshotState.iteration++, e.oneshotState.renderRequested = !1, e.oneshotState.prevHeight = u, e.oneshotState.prevWidth = f, e.oneshotState.nextRequestOffset = 0, e.oneshotState.restart = !0, t || (e.oneshotState.displayedEvent = null), e.rafId || (e.rafId = window.requestAnimationFrame(M)), y(void 0, !0);
    }
  }, e.renderFrameData = null;
  function I() {
    var t = e.renderFramesData, r = performance.now();
    e.ctx.clearRect(0, 0, e.canvas.width, e.canvas.height);
    for (var a = 0; a < t.canvases.length; a++) {
      var s = t.canvases[a];
      e.bufferCanvas.width = s.w, e.bufferCanvas.height = s.h;
      var n = new Uint8ClampedArray(s.buffer);
      if (e.hasAlphaBug)
        for (var o = 3; o < n.length; o = o + 4)
          n[o] = n[o] >= 1 ? n[o] : 1;
      var i = new ImageData(n, s.w, s.h);
      e.bufferCanvasCtx.putImageData(i, 0, 0), e.ctx.drawImage(e.bufferCanvas, s.x, s.y);
    }
    if (e.debug) {
      var d = Math.round(performance.now() - r), v = t.blendTime;
      console.log(typeof v < "u" ? "render: " + Math.round(t.spentTime - v) + " ms, blend: " + Math.round(v) + " ms, draw: " + d + " ms; TOTAL=" + Math.round(t.spentTime + d) + " ms" : Math.round(t.spentTime) + " ms (+ " + d + " ms draw)"), e.renderStart = performance.now();
    }
  }
  function W() {
    var t = e.renderFramesData, r = performance.now();
    e.ctx.clearRect(0, 0, e.canvas.width, e.canvas.height);
    for (var a = 0; a < t.bitmaps.length; a++) {
      var s = t.bitmaps[a];
      e.ctx.drawImage(s.bitmap, s.x, s.y);
    }
    if (e.debug) {
      var n = Math.round(performance.now() - r);
      console.log(t.bitmaps.length + " bitmaps, libass: " + Math.round(t.libassTime) + "ms, decode: " + Math.round(t.decodeTime) + "ms, draw: " + n + "ms"), e.renderStart = performance.now();
    }
  }
  e.workerActive = !1, e.frameId = 0, e.onWorkerMessage = function(t) {
    e.workerActive || (e.workerActive = !0, e.onReadyEvent && e.onReadyEvent());
    var r = t.data;
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
            e.ctx = e.canvas.getContext(r.type, r.attributes);
            break;
          }
          case "resize": {
            e.resize(r.width, r.height);
            break;
          }
          case "renderCanvas": {
            e.lastRenderTime < r.time && (e.lastRenderTime = r.time, e.renderFramesData = r, window.requestAnimationFrame(I));
            break;
          }
          case "renderFastCanvas": {
            e.lastRenderTime < r.time && (e.lastRenderTime = r.time, e.renderFramesData = r, window.requestAnimationFrame(W));
            break;
          }
          case "setObjectProperty": {
            e.canvas[r.object][r.property] = r.value;
            break;
          }
          case "oneshot-result": {
            if (r.iteration != e.oneshotState.iteration) {
              console.debug("received stale prerender, ignoring");
              return;
            }
            e.debug && console.info("oneshot received (start=" + r.eventStart + ", empty=" + r.emptyFinish + "), render: " + Math.round(r.spentTime) + " ms"), e.oneshotState.renderRequested = !1, Math.abs(r.lastRenderedTime - e.oneshotState.requestNextTimestamp) < w && (e.oneshotState.requestNextTimestamp = -1), r.eventStart - r.lastRenderedTime > w && e.renderedItems.push({
              eventStart: r.lastRenderedTime,
              eventFinish: r.lastRenderedTime - L,
              emptyFinish: r.eventStart,
              viewport: r.viewport,
              spentTime: 0,
              blendTime: 0,
              items: [],
              animated: !1,
              size: 0
            });
            for (var a = [], s = 0, n = 0, o = r.canvases.length; n < o; n++) {
              var i = r.canvases[n];
              a.push({
                w: i.w,
                h: i.h,
                x: i.x,
                y: i.y,
                image: new ImageData(new Uint8ClampedArray(i.buffer), i.w, i.h)
              }), s += i.buffer.byteLength;
            }
            var d = !1;
            if (r.emptyFinish > 0 && r.emptyFinish - r.eventStart < 1 / e.targetFps || r.animated) {
              var v = r.eventStart + 1 / e.targetFps;
              r.emptyFinish = v, r.eventFinish = v, d = !0;
            }
            e.renderedItems.push({
              eventStart: r.eventStart,
              eventFinish: r.eventFinish,
              emptyFinish: r.emptyFinish,
              spentTime: r.spentTime,
              blendTime: r.blendTime,
              viewport: r.viewport,
              items: a,
              animated: r.animated,
              size: s
            }), e.renderedItems.sort(function(g, z) {
              return g.eventStart - z.eventStart;
            }), e.oneshotState.requestNextTimestamp >= 0 ? y(e.oneshotState.requestNextTimestamp, !0) : r.eventStart < 0 ? console.info('oneshot received "end of frames" event') : r.emptyFinish >= 0 ? y(r.emptyFinish, d) : console.info("there are no more events to prerender");
            break;
          }
          default:
            throw "eh?";
        }
        break;
      }
      case "tick": {
        e.frameId = r.id, e.worker.postMessage({
          target: "tock",
          id: e.frameId
        });
        break;
      }
      case "custom": {
        if (e.onCustomMessage)
          e.onCustomMessage(t);
        else
          throw "Custom message received but client onCustomMessage not implemented.";
        break;
      }
      case "setimmediate": {
        e.worker.postMessage({
          target: "setimmediate"
        });
        break;
      }
      case "get-events":
        break;
      case "get-styles":
        break;
      case "ready":
        break;
      default:
        throw "what? " + r.target;
    }
  };
  function O(t, r) {
    var a = e.prescaleFactor <= 0 ? 1 : e.prescaleFactor;
    if (r <= 0 || t <= 0)
      t = 0, r = 0;
    else {
      var s = a < 1 ? -1 : 1, n = r;
      s * n * a <= s * e.prescaleHeightLimit ? n *= a : s * n < s * e.prescaleHeightLimit && (n = e.prescaleHeightLimit), e.maxRenderHeight > 0 && n > e.maxRenderHeight && (n = e.maxRenderHeight), t *= n / r, r = n;
    }
    return { width: t, height: r };
  }
  e.resize = function(t, r, a, s) {
    var n = null;
    if (a = a || 0, s = s || 0, (!t || !r) && e.video) {
      n = e.getVideoPosition();
      var o = O(n.width * e.pixelRatio, n.height * e.pixelRatio);
      t = o.width, r = o.height;
      var i = e.canvasParent.getBoundingClientRect().top - e.video.getBoundingClientRect().top;
      a = n.y - i, s = n.x;
    }
    if (!t || !r) {
      e.video || console.error("width or height is 0. You should specify width & height for resize.");
      return;
    }
    n != null && (e.canvasParent.style.position = "relative", e.canvas.style.display = "block", e.canvas.style.position = "absolute", e.canvas.style.width = n.width + "px", e.canvas.style.height = n.height + "px", e.canvas.style.top = a + "px", e.canvas.style.left = s + "px", e.canvas.style.pointerEvents = "none"), (f !== t || u !== r) && (e.canvas.width = t, e.canvas.height = r, f = t, u = r, e.worker.postMessage({
      target: "canvas",
      width: e.canvas.width,
      height: e.canvas.height
    }), e.resetRenderAheadCache(!0));
  }, e.resizeWithTimeout = function() {
    e.resize(), setTimeout(e.resize, 100);
  }, e.runBenchmark = function() {
    e.worker.postMessage({
      target: "runBenchmark"
    });
  }, e.customMessage = function(t, r) {
    r = r || {}, e.worker.postMessage({
      target: "custom",
      userData: t,
      preMain: r.preMain
    });
  }, e.setCurrentTime = function(t) {
    e.worker.postMessage({
      target: "video",
      currentTime: t
    });
  }, e.setTrackByUrl = function(t) {
    e.worker.postMessage({
      target: "set-track-by-url",
      url: t
    }), e.resetRenderAheadCache(!1);
  }, e.setTrack = function(t) {
    e.worker.postMessage({
      target: "set-track",
      content: t
    }), e.resetRenderAheadCache(!1);
  }, e.freeTrack = function(t) {
    e.worker.postMessage({
      target: "free-track"
    }), e.resetRenderAheadCache(!1);
  }, e.render = e.setCurrentTime, e.setIsPaused = function(t, r) {
    e.worker.postMessage({
      target: "video",
      isPaused: t,
      currentTime: r
    });
  }, e.setRate = function(t) {
    e.worker.postMessage({
      target: "video",
      rate: t
    });
  }, e.dispose = function() {
    e.worker.postMessage({
      target: "destroy"
    }), e.worker.terminate(), e.worker.removeEventListener("message", e.onWorkerMessage), e.worker.removeEventListener("error", e.workerError), e.workerActive = !1, e.worker = null, e.video && (e.video.removeEventListener("timeupdate", m, !1), e.video.removeEventListener("playing", b, !1), e.video.removeEventListener("pause", h, !1), e.video.removeEventListener("seeking", S, !1), e.video.removeEventListener("seeked", E, !1), e.video.removeEventListener("ratechange", x, !1), e.video.removeEventListener("waiting", F, !1), e.video.removeEventListener("loadedmetadata", k, !1), document.removeEventListener("fullscreenchange", e.resizeWithTimeout, !1), document.removeEventListener("mozfullscreenchange", e.resizeWithTimeout, !1), document.removeEventListener("webkitfullscreenchange", e.resizeWithTimeout, !1), document.removeEventListener("msfullscreenchange", e.resizeWithTimeout, !1), window.removeEventListener("resize", e.resizeWithTimeout, !1), e.video.parentNode.removeChild(e.canvasParent), e.video = null), A(), e.ro && (e.ro.disconnect(), e.ro = null), e.onCustomMessage = null, e.onErrorEvent = null, e.onReadyEvent = null;
  }, e.fetchFromWorker = function(t, r, a) {
    try {
      var s = t.target, n = setTimeout(function() {
        i(Error("Error: Timeout while try to fetch " + s));
      }, 5e3), o = function(d) {
        d.data.target == s && (r(d.data), e.worker.removeEventListener("message", o), e.worker.removeEventListener("error", i), clearTimeout(n));
      }, i = function(d) {
        a(d), e.worker.removeEventListener("message", o), e.worker.removeEventListener("error", i), clearTimeout(n);
      };
      e.worker.addEventListener("message", o), e.worker.addEventListener("error", i), e.worker.postMessage(t);
    } catch (d) {
      a(d);
    }
  }, e.createEvent = function(t) {
    e.worker.postMessage({
      target: "create-event",
      event: t
    });
  }, e.getEvents = function(t, r) {
    e.fetchFromWorker({
      target: "get-events"
    }, function(a) {
      t(a.events);
    }, r);
  }, e.setEvent = function(t, r) {
    e.worker.postMessage({
      target: "set-event",
      event: t,
      index: r
    });
  }, e.removeEvent = function(t) {
    e.worker.postMessage({
      target: "remove-event",
      index: t
    });
  }, e.createStyle = function(t) {
    e.worker.postMessage({
      target: "create-style",
      style: t
    });
  }, e.getStyles = function(t, r) {
    e.fetchFromWorker({
      target: "get-styles"
    }, function(a) {
      t(a.styles);
    }, r);
  }, e.setStyle = function(t, r) {
    e.worker.postMessage({
      target: "set-style",
      style: t,
      index: r
    });
  }, e.removeStyle = function(t) {
    e.worker.postMessage({
      target: "remove-style",
      index: t
    });
  }, e.init();
};
typeof SubtitlesOctopusOnLoad == "function" && SubtitlesOctopusOnLoad();
typeof exports < "u" && typeof module < "u" && module.exports && (exports = module.exports = C);
class D extends q {
  initialize(c) {
    this.player = c;
  }
  use() {
    this.player.on("item", this.destroy.bind(this)), this.player.on("captionsChanged", this.opus.bind(this));
  }
  dispose() {
    this.player.off("item", this.destroy.bind(this)), this.player.off("captionsChanged", this.opus.bind(this)), this.destroy();
  }
  destroy() {
    var c;
    (c = this.player.octopusInstance) == null || c.dispose(), this.player.octopusInstance = null;
  }
  async opus() {
    var f, u;
    this.destroy();
    const c = this.player.getSubtitleFile() ? `${this.player.options.basePath ?? ""}${this.player.getSubtitleFile()}` : null;
    if (!c) return;
    const p = (f = c == null ? void 0 : c.match(/\w+\.\w+\.\w+$/u)) == null ? void 0 : f[0];
    let [, , e] = p ? p.split(".") : [];
    if (e || (e = c.split(".").at(-1) || ""), !(e != "ass" && e != "ssa") && c) {
      await this.player.fetchFontFile();
      const m = (u = this.player.fonts) == null ? void 0 : u.map((h) => `${this.player.options.basePath ?? ""}${h.file}`);
      this.player.getElement().querySelectorAll(".libassjs-canvas-parent").forEach((h) => h.remove());
      const b = {
        video: this.player.getVideoElement(),
        lossyRender: !0,
        accessToken: this.player.options.accessToken,
        subUrl: c,
        debug: this.player.options.debug,
        blendRender: !0,
        lazyFileLoading: !0,
        targetFps: 24,
        fonts: m,
        workerUrl: "/js/octopus/subtitles-octopus-worker.js",
        legacyWorkerUrl: "/js/octopus/subtitles-octopus-worker-legacy.js",
        onReady: async () => {
        },
        onError: (h) => {
          console.error("opus error", h);
        }
      };
      c && c.includes(".ass") && (this.player.octopusInstance = new C(b));
    }
  }
}
export {
  D as O
};
