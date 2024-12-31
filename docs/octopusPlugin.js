import { P as g } from "./plugin.js";
const f = function(i) {
  let o = !1;
  try {
    if (typeof WebAssembly == "object" && typeof WebAssembly.instantiate == "function") {
      const t = new WebAssembly.Module(Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0));
      t instanceof WebAssembly.Module && (o = new WebAssembly.Instance(t) instanceof WebAssembly.Instance);
    }
  } catch {
  }
  console.log(`WebAssembly support detected: ${o ? "yes" : "no"}`);
  const e = this;
  e.canvas = i.canvas, e.lossyRender = i.lossyRender, e.isOurCanvas = !1, e.video = i.video, e.canvasParent = null, e.fonts = i.fonts || [], e.availableFonts = i.availableFonts || [], e.onReadyEvent = i.onReady, o ? e.workerUrl = i.workerUrl || "subtitles-octopus-worker.ts" : e.workerUrl = i.legacyWorkerUrl || "subtitles-octopus-worker-legacy.ts", e.subUrl = i.subUrl, e.subContent = i.subContent || null, e.onErrorEvent = i.onError, e.debug = i.debug || !1, e.lastRenderTime = 0, e.pixelRatio = window.devicePixelRatio || 1, e.timeOffset = i.timeOffset || 0, e.accessToken = i.accessToken || null, e.hasAlphaBug = !1, function() {
    if (typeof ImageData.prototype.constructor == "function")
      try {
        new window.ImageData(new Uint8ClampedArray([0, 0, 0, 0]), 1, 1);
        return;
      } catch {
        console.log("detected that ImageData is not constructable despite browser saying so");
      }
    const s = document.createElement("canvas").getContext("2d", { willReadFrequently: !0 });
    window.ImageData = function() {
      let a = 0;
      if (arguments[0] instanceof Uint8ClampedArray)
        var r = arguments[a++];
      const n = arguments[a++], l = arguments[a], c = s.createImageData(n, l);
      return r && c.data.set(r), c;
    };
  }(), e.workerError = function(t) {
    if (console.error("Worker error: ", t), e.onErrorEvent && e.onErrorEvent(t), !e.debug)
      throw e.dispose(), new Error(`Worker error: ${t}`);
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
      debug: e.debug,
      token: e.accessToken
    });
  }, e.createCanvas = function() {
    e.canvas || (e.video ? (e.isOurCanvas = !0, e.canvas = document.createElement("canvas"), e.canvas.className = "libassjs-canvas", e.canvas.style.display = "none", e.canvasParent = document.createElement("div"), e.canvasParent.className = "libassjs-canvas-parent", e.canvasParent.appendChild(e.canvas), e.video.nextSibling ? e.video.parentNode.insertBefore(e.canvasParent, e.video.nextSibling) : e.video.parentNode.appendChild(e.canvasParent)) : e.canvas || e.workerError("Don't know where to render: you should give video or canvas in options.")), e.ctx = e.canvas.getContext("2d", { willReadFrequently: !0 }), e.bufferCanvas = document.createElement("canvas"), e.bufferCanvasCtx = e.bufferCanvas.getContext("2d", { willReadFrequently: !0 }), e.bufferCanvas.width = 1, e.bufferCanvas.height = 1;
    const t = new Uint8ClampedArray([0, 255, 0, 0]), s = new ImageData(t, 1, 1);
    e.bufferCanvasCtx.clearRect(0, 0, 1, 1), e.ctx.clearRect(0, 0, 1, 1);
    const a = e.ctx.getImageData(0, 0, 1, 1).data;
    e.bufferCanvasCtx.putImageData(s, 0, 0), e.ctx.drawImage(e.bufferCanvas, 0, 0);
    const r = e.ctx.getImageData(0, 0, 1, 1).data;
    e.hasAlphaBug = a[1] != r[1], e.hasAlphaBug && console.log("Detected a browser having issue with transparent pixels, applying workaround");
  }, e.setVideo = function(t) {
    if (e.video = t, e.video) {
      const s = function() {
        e.setCurrentTime(t.currentTime + e.timeOffset);
      };
      e.video.addEventListener("timeupdate", s, !1), e.video.addEventListener(
        "playing",
        () => {
          e.setIsPaused(!1, t.currentTime + e.timeOffset);
        },
        !1
      ), e.video.addEventListener(
        "pause",
        () => {
          e.setIsPaused(!0, t.currentTime + e.timeOffset);
        },
        !1
      ), e.video.addEventListener(
        "seeking",
        () => {
          e.video.removeEventListener("timeupdate", s);
        },
        !1
      ), e.video.addEventListener(
        "seeked",
        () => {
          e.video.addEventListener("timeupdate", s, !1), e.setCurrentTime(t.currentTime + e.timeOffset);
        },
        !1
      ), e.video.addEventListener(
        "ratechange",
        () => {
          e.setRate(t.playbackRate);
        },
        !1
      ), e.video.addEventListener(
        "timeupdate",
        () => {
          e.setCurrentTime(t.currentTime + e.timeOffset);
        },
        !1
      ), e.video.addEventListener(
        "waiting",
        () => {
          e.setIsPaused(!0, t.currentTime + e.timeOffset);
        },
        !1
      ), document.addEventListener("fullscreenchange", e.resizeWithTimeout, !1), document.addEventListener("mozfullscreenchange", e.resizeWithTimeout, !1), document.addEventListener("webkitfullscreenchange", e.resizeWithTimeout, !1), document.addEventListener("msfullscreenchange", e.resizeWithTimeout, !1), window.addEventListener("resize", e.resizeWithTimeout, !1), typeof ResizeObserver < "u" && (e.ro = new ResizeObserver(e.resizeWithTimeout), e.ro.observe(e.video)), e.video.videoWidth > 0 ? e.resize() : e.video.addEventListener(
        "loadedmetadata",
        function a(r) {
          r.target.removeEventListener(r.type, a), e.resize();
        },
        !1
      );
    }
  }, e.getVideoPosition = function() {
    const t = e.video.videoWidth / e.video.videoHeight, s = e.video.offsetWidth, a = e.video.offsetHeight, r = s / a;
    let n = s, l = a;
    r > t ? n = Math.floor(a * t) : l = Math.floor(s / t);
    const c = (s - n) / 2, m = (a - l) / 2;
    return {
      width: n,
      height: l,
      x: c,
      y: m
    };
  }, e.setSubUrl = function(t) {
    e.subUrl = t;
  }, e.renderFrameData = null;
  function d() {
    const t = e.renderFramesData, s = performance.now();
    e.ctx.clearRect(0, 0, e.canvas.width, e.canvas.height);
    for (let a = 0; a < t.canvases.length; a++) {
      const r = t.canvases[a];
      e.bufferCanvas.width = r.w, e.bufferCanvas.height = r.h;
      const n = new Uint8ClampedArray(r.buffer);
      if (e.hasAlphaBug)
        for (let c = 3; c < n.length; c += 4)
          n[c] = n[c] >= 1 ? n[c] : 1;
      const l = new ImageData(n, r.w, r.h);
      e.bufferCanvasCtx.putImageData(l, 0, 0), e.ctx.drawImage(e.bufferCanvas, r.x, r.y);
    }
    if (e.debug) {
      const a = Math.round(performance.now() - s);
      console.log(`${Math.round(t.spentTime)} ms (+ ${a} ms draw)`), e.renderStart = performance.now();
    }
  }
  function u() {
    const t = e.renderFramesData, s = performance.now();
    e.ctx.clearRect(0, 0, e.canvas.width, e.canvas.height);
    for (let a = 0; a < t.bitmaps.length; a++) {
      const r = t.bitmaps[a];
      e.ctx.drawImage(r.bitmap, r.x, r.y);
    }
    if (e.debug) {
      const a = Math.round(performance.now() - s);
      console.log(`${t.bitmaps.length} bitmaps, libass: ${Math.round(t.libassTime)}ms, decode: ${Math.round(t.decodeTime)}ms, draw: ${a}ms`), e.renderStart = performance.now();
    }
  }
  e.workerActive = !1, e.frameId = 0, e.onWorkerMessage = function(t) {
    e.workerActive || (e.workerActive = !0, e.onReadyEvent && e.onReadyEvent());
    const s = t.data;
    switch (s.target) {
      case "stdout": {
        console.log(s.content);
        break;
      }
      case "console-log": {
        console.log.apply(console, JSON.parse(s.content));
        break;
      }
      case "console-debug": {
        console.debug.apply(console, JSON.parse(s.content));
        break;
      }
      case "console-info": {
        console.info.apply(console, JSON.parse(s.content));
        break;
      }
      case "console-warn": {
        console.warn.apply(console, JSON.parse(s.content));
        break;
      }
      case "console-error": {
        console.error.apply(console, JSON.parse(s.content));
        break;
      }
      case "stderr": {
        console.error(s.content);
        break;
      }
      case "window": {
        window[s.method]();
        break;
      }
      case "canvas": {
        switch (s.op) {
          case "getContext": {
            e.ctx = e.canvas.getContext(s.type, s.attributes);
            break;
          }
          case "resize": {
            e.resize(s.width, s.height);
            break;
          }
          case "renderCanvas": {
            e.lastRenderTime < s.time && (e.lastRenderTime = s.time, e.renderFramesData = s, window.requestAnimationFrame(d));
            break;
          }
          case "renderMultiple": {
            e.lastRenderTime < s.time && (e.lastRenderTime = s.time, e.renderFramesData = s, window.requestAnimationFrame(d));
            break;
          }
          case "renderFastCanvas": {
            e.lastRenderTime < s.time && (e.lastRenderTime = s.time, e.renderFramesData = s, window.requestAnimationFrame(u));
            break;
          }
          case "setObjectProperty": {
            e.canvas[s.object][s.property] = s.value;
            break;
          }
          default:
            throw console.error(s), "eh?";
        }
        break;
      }
      case "tick": {
        e.frameId = s.id, e.worker.postMessage({
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
      case "get-events": {
        console.log(s.target), console.log(s.events);
        break;
      }
      case "get-styles": {
        console.log(s.target), console.log(s.styles);
        break;
      }
      default:
        throw `what? ${s.target}`;
    }
  }, e.resize = function(t, s, a, r) {
    let n = null;
    if (a = a || 0, r = r || 0, (!t || !s) && e.video) {
      n = e.getVideoPosition(), t = n.width * e.pixelRatio, s = n.height * e.pixelRatio;
      const l = e.canvasParent.getBoundingClientRect().top - e.video.getBoundingClientRect().top;
      a = n.y - l, r = n.x;
    }
    if (!t || !s) {
      e.video || console.error("width or height is 0. You should specify width & height for resize.");
      return;
    }
    (e.canvas.width != t || e.canvas.height != s || e.canvas.style.top != a || e.canvas.style.left != r) && (e.canvas.width = t, e.canvas.height = s, n != null && (e.canvasParent.style.position = "relative", e.canvas.style.display = "block", e.canvas.style.position = "absolute", e.canvas.style.width = `${n.width}px`, e.canvas.style.height = `${n.height}px`, e.canvas.style.top = `${a}px`, e.canvas.style.left = `${r}px`, e.canvas.style.pointerEvents = "none"), e.worker.postMessage({
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
  }, e.customMessage = function(t, s) {
    s = s || {}, e.worker.postMessage({
      target: "custom",
      userData: t,
      preMain: s.preMain
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
    });
  }, e.setTrack = function(t) {
    e.worker.postMessage({
      target: "set-track",
      content: t
    });
  }, e.freeTrack = function(t) {
    e.worker.postMessage({
      target: "free-track"
    });
  }, e.render = e.setCurrentTime, e.setIsPaused = function(t, s) {
    e.worker.postMessage({
      target: "video",
      isPaused: t,
      currentTime: s
    });
  }, e.setRate = function(t) {
    e.worker.postMessage({
      target: "video",
      rate: t
    });
  }, e.dispose = function() {
    e.worker.postMessage({
      target: "destroy"
    }), e.worker.terminate(), e.workerActive = !1, e.video && e.video.parentNode.removeChild(e.canvasParent);
  }, e.createEvent = function(t) {
    e.worker.postMessage({
      target: "create-event",
      event: t
    });
  }, e.getEvents = function() {
    e.worker.postMessage({
      target: "get-events"
    });
  }, e.setEvent = function(t, s) {
    e.worker.postMessage({
      target: "set-event",
      event: t,
      index: s
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
  }, e.getStyles = function() {
    e.worker.postMessage({
      target: "get-styles"
    });
  }, e.setStyle = function(t, s) {
    e.worker.postMessage({
      target: "set-style",
      style: t,
      index: s
    });
  }, e.removeStyle = function(t) {
    e.worker.postMessage({
      target: "remove-style",
      index: t
    });
  }, e.init();
};
typeof SubtitlesOctopusOnLoad == "function" && SubtitlesOctopusOnLoad();
typeof exports < "u" && typeof module < "u" && module.exports && (exports = module.exports = f);
class p extends g {
  initialize(o) {
    this.player = o;
  }
  use() {
    this.player.on("item", this.destroy.bind(this)), this.player.on("captionsChanged", this.opus.bind(this));
  }
  dispose() {
    this.player.off("item", this.destroy.bind(this)), this.player.off("captionsChanged", this.opus.bind(this)), this.destroy();
  }
  destroy() {
    var o;
    (o = this.player.octopusInstance) == null || o.dispose(), this.player.octopusInstance = null;
  }
  async opus() {
    var u, t;
    this.destroy();
    const o = this.player.getSubtitleFile() ? `${this.player.options.basePath ?? ""}${this.player.getSubtitleFile()}` : null;
    if (!o)
      return;
    const e = (u = o == null ? void 0 : o.match(/\w+\.\w+\.\w+$/u)) == null ? void 0 : u[0];
    let [, , d] = e ? e.split(".") : [];
    if (d || (d = o.split(".").at(-1) || ""), !(d != "ass" && d != "ssa") && o) {
      await this.player.fetchFontFile();
      const s = (t = this.player.fonts) == null ? void 0 : t.map((r) => `${this.player.options.basePath ?? ""}${r.file}`);
      this.player.getElement().querySelectorAll(".libassjs-canvas-parent").forEach((r) => r.remove());
      const a = {
        video: this.player.getVideoElement(),
        lossyRender: !0,
        accessToken: this.player.options.accessToken,
        subUrl: o,
        debug: this.player.options.debug,
        blendRender: !0,
        lazyFileLoading: !0,
        targetFps: 24,
        fonts: s,
        workerUrl: "/js/octopus/subtitles-octopus-worker.js",
        legacyWorkerUrl: "/js/octopus/subtitles-octopus-worker-legacy.js",
        onReady: async () => {
        },
        onError: (r) => {
          console.error("opus error", r);
        }
      };
      o && o.includes(".ass") && (this.player.octopusInstance = new f(a));
    }
  }
}
export {
  p as O
};
