class a {
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
    }, this.hasPipEventHandler = !1, this.hasTheaterEventHandler = !1, this.hasBackEventHandler = !1, this.hasCloseEventHandler = !1, this.events = [], this.eventElement = document.createElement("div");
  }
  emit(e, s) {
    var t, i;
    (i = (t = this.eventElement) == null ? void 0 : t.dispatchEvent) == null || i.call(t, new CustomEvent(e, {
      detail: s
    }));
  }
  on(e, s) {
    var t;
    this.eventHooks(e, !0), (t = this.eventElement) == null || t.addEventListener(e, (i) => s(i.detail)), this.events.push({ type: e, fn: s });
  }
  off(e, s) {
    if (this.eventHooks(e, !1), s && this.eventElement.removeEventListener(e, () => s()), e === "all") {
      this.events.forEach((t) => {
        this.eventElement.removeEventListener(t.type, t.fn);
      });
      return;
    }
    this.events.filter((t) => t.type === e).forEach((t) => {
      this.eventElement.removeEventListener(t.type, t.fn);
    });
  }
  once(e, s) {
    var t;
    this.eventHooks(e, !0), (t = this.eventElement) == null || t.addEventListener(e, (i) => s(i.detail), { once: !0 });
  }
  /**
      * Sets the enabled state of various event hooks.
      * @param event - The event to enable/disable.
      * @param enabled - Whether the event should be enabled or disabled.
      */
  eventHooks(e, s) {
    e == "pip" ? this.hasPipEventHandler = s : e == "theaterMode" ? this.hasTheaterEventHandler = s : e == "back" ? this.hasBackEventHandler = s : e == "close" && (this.hasCloseEventHandler = s);
  }
}
export {
  a as B
};
