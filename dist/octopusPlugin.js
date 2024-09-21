import { P as v } from "./plugin.js";
const g = function(i) {
  let c = !1;
  try {
    if (typeof WebAssembly == "object" && typeof WebAssembly.instantiate == "function") {
      const s = new WebAssembly.Module(Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0));
      s instanceof WebAssembly.Module && (c = new WebAssembly.Instance(s) instanceof WebAssembly.Instance);
    }
  } catch {
  }
  const e = this;
  e.canvas = i.canvas, e.lossyRender = i.lossyRender, e.isOurCanvas = !1, e.video = i.video, e.canvasParent = null, e.fonts = i.fonts || [], e.availableFonts = i.availableFonts || [], e.defaultFont = i.defaultFont, e.onReadyEvent = i.onReady, c ? e.workerUrl = i.workerUrl || "subtitles-octopus-worker.js" : e.workerUrl = i.legacyWorkerUrl || "subtitles-octopus-worker-legacy.js", e.subUrl = i.subUrl, e.subContent = i.subContent || null, e.onErrorEvent = i.onError, e.debug = i.debug || !1, e.lastRenderTime = 0, e.pixelRatio = window.devicePixelRatio || 1, e.timeOffset = i.timeOffset || 0, e.hasAlphaBug = !1, function() {
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
    const t = document.createElement("canvas").getContext("2d", { willReadFrequently: !0 });
    window.ImageData = function() {
      let r = 0;
      if (arguments[0] instanceof Uint8ClampedArray)
        var o = arguments[r++];
      const a = arguments[r++], n = arguments[r], l = t.createImageData(a, n);
      return o && l.data.set(o), l;
    };
  }(), e.workerError = function(s) {
    console.error("Worker error: ", s), e.onErrorEvent && e.onErrorEvent(s), e.debug || e.dispose();
  }, e.init = function() {
    if (!window.Worker) {
      e.workerError("worker not supported");
      return;
    }
    e.worker || (e.worker = new Worker(e.workerUrl), e.worker.onmessage = e.onWorkerMessage, e.worker.onerror = e.workerError), e.workerActive = !1, e.createCanvas(), e.setVideo(i.video), e.setSubUrl(i.subUrl), e.worker.postMessage({
      target: "worker-init",
      width: e.canvas.width,
      height: e.canvas.height,
      URL: document.URL,
      currentScript: e.workerUrl,
      preMain: !0,
      fastRender: e.lossyRender,
      subUrl: e.subUrl,
      subContent: e.subContent,
      fonts: e.fonts,
      availableFonts: e.availableFonts,
      defaultFont: e.defaultFont,
      debug: e.debug
    });
  }, e.createCanvas = function() {
    e.canvas || (e.video ? (e.isOurCanvas = !0, e.canvas = document.createElement("canvas"), e.canvas.className = "libassjs-canvas", e.canvas.style.display = "none", e.canvasParent = document.createElement("div"), e.canvasParent.className = "libassjs-canvas-parent", e.canvasParent.appendChild(e.canvas), e.video.nextSibling ? e.video.parentNode.insertBefore(e.canvasParent, e.video.nextSibling) : e.video.parentNode.appendChild(e.canvasParent)) : e.canvas || e.workerError("Don't know where to render: you should give video or canvas in options.")), e.ctx = e.canvas.getContext("2d", { willReadFrequently: !0 }), e.bufferCanvas = document.createElement("canvas"), e.bufferCanvasCtx = e.bufferCanvas.getContext("2d", { willReadFrequently: !0 }), e.bufferCanvas.width = 1, e.bufferCanvas.height = 1;
    const s = new Uint8ClampedArray([
      0,
      255,
      0,
      0
    ]), t = new ImageData(s, 1, 1);
    e.bufferCanvasCtx.clearRect(0, 0, 1, 1), e.ctx.clearRect(0, 0, 1, 1);
    const r = e.ctx.getImageData(0, 0, 1, 1, { willReadFrequently: !0 }).data;
    e.bufferCanvasCtx.putImageData(t, 0, 0), e.ctx.drawImage(e.bufferCanvas, 0, 0);
    const o = e.ctx.getImageData(0, 0, 1, 1, { willReadFrequently: !0 }).data;
    e.hasAlphaBug = r[1] !== o[1], e.hasAlphaBug && console.log("Detected a browser having issue with transparent pixels, applying workaround");
  }, e.setVideo = function(s) {
    if (e.video = s, e.video) {
      const t = function() {
        e.setCurrentTime(s.currentTime + e.timeOffset);
      };
      e.video.addEventListener("timeupdate", t, !1), e.video.addEventListener("playing", () => {
        e.setIsPaused(!1, s.currentTime + e.timeOffset);
      }, !1), e.video.addEventListener("pause", () => {
        e.setIsPaused(!0, s.currentTime + e.timeOffset);
      }, !1), e.video.addEventListener("seeking", () => {
        e.video.removeEventListener("timeupdate", t);
      }, !1), e.video.addEventListener("seeked", () => {
        e.video.addEventListener("timeupdate", t, !1), e.setCurrentTime(s.currentTime + e.timeOffset);
      }, !1), e.video.addEventListener("ratechange", () => {
        e.setRate(s.playbackRate);
      }, !1), e.video.addEventListener("timeupdate", () => {
        e.setCurrentTime(s.currentTime + e.timeOffset);
      }, !1), e.video.addEventListener("waiting", () => {
        e.setIsPaused(!0, s.currentTime + e.timeOffset);
      }, !1), document.addEventListener("fullscreenchange", e.resizeWithTimeout, !1), document.addEventListener("mozfullscreenchange", e.resizeWithTimeout, !1), document.addEventListener("webkitfullscreenchange", e.resizeWithTimeout, !1), document.addEventListener("msfullscreenchange", e.resizeWithTimeout, !1), window.addEventListener("resize", e.resizeWithTimeout, !1), typeof ResizeObserver < "u" && (e.ro = new ResizeObserver(e.resizeWithTimeout), e.ro.observe(e.video)), e.video.videoWidth > 0 ? e.resize() : e.video.addEventListener("loadedmetadata", () => {
        e.resize();
      }, !1);
    }
  }, e.getVideoPosition = function() {
    const s = e.video.videoWidth / e.video.videoHeight, t = e.video.offsetWidth, r = e.video.offsetHeight, o = t / r;
    let a = t, n = r;
    o > s ? a = Math.floor(r * s) : n = Math.floor(t / s);
    const l = (t - a) / 2, m = (r - n) / 2;
    return {
      width: a,
      height: n,
      x: l,
      y: m
    };
  }, e.setSubUrl = function(s) {
    e.subUrl = s;
  }, e.renderFrameData = null;
  function d() {
    var s, t;
    const r = e.renderFramesData, o = performance.now();
    e.ctx.clearRect(0, 0, e.canvas.width, e.canvas.height);
    for (let a = 0; a < r.canvases.length; a++) {
      const n = r.canvases[a];
      e.bufferCanvas.width = n.w, e.bufferCanvas.height = n.h;
      const l = new Uint8ClampedArray(n.buffer);
      if (e.hasAlphaBug)
        for (let u = 3; u < l.length; u += 4)
          l[u] = l[u] >= 1 ? l[u] : 1;
      const m = new ImageData(l, n.w, n.h);
      e.bufferCanvasCtx.putImageData(m, 0, 0), e.ctx.drawImage(e.bufferCanvas, n.x, n.y);
    }
    if (e.debug) {
      const a = Math.round(performance.now() - o);
      (t = (s = window.socket) === null || s === void 0 ? void 0 : s.emit) === null || t === void 0 || t.call(s, "log", `${Math.round(r.spentTime)} ms (+ ${a} ms draw)`), console.log(`${Math.round(r.spentTime)} ms (+ ${a} ms draw)`), e.renderStart = performance.now();
    }
  }
  function f() {
    var s, t;
    const r = e.renderFramesData, o = performance.now();
    e.ctx.clearRect(0, 0, e.canvas.width, e.canvas.height);
    for (let a = 0; a < r.bitmaps.length; a++) {
      const n = r.bitmaps[a];
      e.ctx.drawImage(n.bitmap, n.x, n.y);
    }
    if (e.debug) {
      const a = Math.round(performance.now() - o);
      (t = (s = window.socket) === null || s === void 0 ? void 0 : s.emit) === null || t === void 0 || t.call(s, `${r.bitmaps.length} bitmaps, libass: ${Math.round(r.libassTime)}ms, decode: ${Math.round(r.decodeTime)}ms, draw: ${a}ms`), console.log(`${r.bitmaps.length} bitmaps, libass: ${Math.round(r.libassTime)}ms, decode: ${Math.round(r.decodeTime)}ms, draw: ${a}ms`), e.renderStart = performance.now();
    }
  }
  e.workerActive = !1, e.frameId = 0, e.onWorkerMessage = function(s) {
    e.workerActive || (e.workerActive = !0, e.onReadyEvent && e.onReadyEvent());
    const { data: t } = s;
    switch (t.target) {
      case "stdout": {
        console.log(t.content);
        break;
      }
      case "console-log": {
        console.log.apply(console, JSON.parse(t.content));
        break;
      }
      case "console-debug": {
        console.debug.apply(console, JSON.parse(t.content));
        break;
      }
      case "console-info": {
        console.info.apply(console, JSON.parse(t.content));
        break;
      }
      case "console-warn": {
        console.warn.apply(console, JSON.parse(t.content));
        break;
      }
      case "console-error": {
        console.error.apply(console, JSON.parse(t.content));
        break;
      }
      case "stderr": {
        console.error(t.content);
        break;
      }
      case "window": {
        window[t.method]();
        break;
      }
      case "canvas": {
        switch (t.op) {
          case "getContext": {
            e.ctx = e.canvas.getContext(t.type, t.attributes);
            break;
          }
          case "resize": {
            e.resize(t.width, t.height);
            break;
          }
          case "renderCanvas": {
            e.lastRenderTime < t.time && (e.lastRenderTime = t.time, e.renderFramesData = t, window.requestAnimationFrame(d));
            break;
          }
          case "renderMultiple": {
            e.lastRenderTime < t.time && (e.lastRenderTime = t.time, e.renderFramesData = t, window.requestAnimationFrame(d));
            break;
          }
          case "renderFastCanvas": {
            e.lastRenderTime < t.time && (e.lastRenderTime = t.time, e.renderFramesData = t, window.requestAnimationFrame(f));
            break;
          }
          case "setObjectProperty": {
            e.canvas[t.object][t.property] = t.value;
            break;
          }
          default:
            console.error(t);
            break;
        }
        break;
      }
      case "tick": {
        e.frameId = t.id, e.worker.postMessage({
          target: "tock",
          id: e.frameId
        });
        break;
      }
      case "custom": {
        if (e.onCustomMessage)
          e.onCustomMessage(s);
        else
          throw Error("Custom message received but client onCustomMessage not implemented.");
        break;
      }
      case "setimmediate": {
        e.worker.postMessage({
          target: "setimmediate"
        });
        break;
      }
      case "get-events": {
        console.log(t.target), console.log(t.events);
        break;
      }
      case "get-styles": {
        console.log(t.target), console.log(t.styles);
        break;
      }
      case "ready":
        break;
      default:
        throw Error("what? ", t.target);
    }
  }, e.resize = function(s, t, r, o) {
    let a = null;
    if (r = r || 0, o = o || 0, (!s || !t) && e.video) {
      a = e.getVideoPosition(), s = a.width * e.pixelRatio, t = a.height * e.pixelRatio;
      const n = e.canvasParent.getBoundingClientRect().top - e.video.getBoundingClientRect().top;
      r = a.y - n, o = a.x;
    }
    if (!s || !t) {
      e.video || console.error("width or height is 0. You should specify width & height for resize.");
      return;
    }
    (e.canvas.width !== s || e.canvas.height !== t || e.canvas.style.top !== r || e.canvas.style.left !== o) && (e.canvas.width = s, e.canvas.height = t, a !== null && (e.canvasParent.style.position = "relative", e.canvas.style.display = "block", e.canvas.style.position = "absolute", e.canvas.style.width = `${a.width}px`, e.canvas.style.height = `${a.height}px`, e.canvas.style.top = `${r}px`, e.canvas.style.left = `${o}px`, e.canvas.style.pointerEvents = "none"), e.worker.postMessage({
      target: "canvas",
      width: e.canvas.width,
      height: e.canvas.height
    }));
  }, e.resizeWithTimeout = function() {
    e.resize(), setTimeout(e.resize, 100);
  }, e.runBenchmark = function() {
    e.worker.postMessage({
      target: "runBenchmark"
    });
  }, e.customMessage = function(s, t) {
    t = t || {}, e.worker.postMessage({
      target: "custom",
      userData: s,
      preMain: t.preMain
    });
  }, e.setCurrentTime = function(s) {
    e.worker.postMessage({
      target: "video",
      currentTime: s
    });
  }, e.setTrackByUrl = function(s) {
    e.worker.postMessage({
      target: "set-track-by-url",
      url: s
    });
  }, e.setTrack = function(s) {
    e.worker.postMessage({
      target: "set-track",
      content: s
    });
  }, e.freeTrack = function() {
    e.worker.postMessage({
      target: "free-track"
    });
  }, e.render = e.setCurrentTime, e.setIsPaused = function(s, t) {
    e.worker.postMessage({
      target: "video",
      isPaused: s,
      currentTime: t
    });
  }, e.setRate = function(s) {
    e.worker.postMessage({
      target: "video",
      rate: s
    });
  }, e.dispose = function() {
    e.worker.postMessage({
      target: "destroy"
    }), e.worker.terminate(), e.workerActive = !1, e.video && document.body.contains(e.canvasParent) && e.video.parentNode.removeChild(e.canvasParent);
  }, e.createEvent = function(s) {
    e.worker.postMessage({
      target: "create-event",
      event: s
    });
  }, e.getEvents = function() {
    e.worker.postMessage({
      target: "get-events"
    });
  }, e.setEvent = function(s, t) {
    e.worker.postMessage({
      target: "set-event",
      event: s,
      index: t
    });
  }, e.removeEvent = function(s) {
    e.worker.postMessage({
      target: "remove-event",
      index: s
    });
  }, e.createStyle = function(s) {
    e.worker.postMessage({
      target: "create-style",
      style: s
    });
  }, e.getStyles = function() {
    e.worker.postMessage({
      target: "get-styles"
    });
  }, e.setStyle = function(s, t) {
    e.worker.postMessage({
      target: "set-style",
      style: s,
      index: t
    });
  }, e.removeStyle = function(s) {
    e.worker.postMessage({
      target: "remove-style",
      index: s
    });
  }, e.init();
};
class h extends v {
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
    var f, s, t;
    (f = this.player.octopusInstance) == null || f.dispose(), this.player.octopusInstance = null;
    const c = this.player.getSubtitleFile() ? `${this.player.options.basePath ?? ""}${this.player.getSubtitleFile()}` : null;
    if (!c)
      return;
    const e = (s = c == null ? void 0 : c.match(/\w+\.\w+\.\w+$/u)) == null ? void 0 : s[0];
    let [, , d] = e ? e.split(".") : [];
    if (d || (d = c.split(".").at(-1) || ""), !(d != "ass" && d != "ssa") && c) {
      await this.player.fetchFontFile();
      const r = (t = this.player.fonts) == null ? void 0 : t.map((a) => `${this.player.options.basePath ?? ""}${a.file}${this.player.options.accessToken ? `?token=${this.player.options.accessToken}` : ""}`);
      this.player.getElement().querySelectorAll(".libassjs-canvas-parent").forEach((a) => a.remove());
      try {
        this.player.octopusInstance.dispose();
      } catch {
      }
      const o = {
        video: this.player.getVideoElement(),
        lossyRender: !0,
        subUrl: `${c}${this.player.options.accessToken ? `?token=${this.player.options.accessToken}` : ""}`,
        debug: this.player.options.debug,
        blendRender: !0,
        lazyFileLoading: !0,
        targetFps: 24,
        fonts: r,
        workerUrl: "/js/octopus/subtitles-octopus-worker.js",
        legacyWorkerUrl: "/js/octopus/subtitles-octopus-worker-legacy.js",
        onReady: async () => {
        },
        onError: (a) => {
          console.error("opus error", a);
        }
      };
      c && c.includes(".ass") && (this.player.octopusInstance = new g(o));
    }
  }
}
export {
  h as O
};
