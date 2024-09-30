import { B as C } from "./desktopUIPlugin.js";
import { n as E, l as S, a as k, b as T } from "./helpers.js";
class $ extends C {
  constructor() {
    super(...arguments), this.disablePreScreen = !1, this.preScreen = {}, this.episodeScreen = {}, this.languageScreen = {}, this.tvDialogStyles = [
      "w-available",
      "h-available",
      "max-w-available",
      "max-h-available",
      ""
    ];
  }
  use() {
    this.createTvOverlay(this.player.overlay), this.createPreScreen(this.player.overlay), this.createEpisodeScreen(this.player.overlay), this.createLanguageScreen(this.player.overlay), this.player.options.autoPlay || this.showPreScreen(), this.player.on("play", () => {
      this.player.getVideoElement().scrollIntoView(), this.closePreScreen(), this.closeEpisodeScreen(), this.closeLanguageScreen();
    }), this.player.on("back-button", this.backMenu.bind(this)), document.addEventListener("keypress", (l) => {
      l.key == "Backspace" && this.backMenu(), l.key == "ArrowUp" && this.player.ui_resetInactivityTimer(), l.key == "ArrowDown" && this.player.ui_resetInactivityTimer(), l.key == "ArrowLeft" && this.player.ui_resetInactivityTimer(), l.key == "ArrowRight" && this.player.ui_resetInactivityTimer();
    }), this.player.on("pause", () => {
    });
  }
  backMenu() {
    this.player.isTv() && this.currentMenu !== "seek" && (this.player.container.classList.contains("episode-screen") ? this.closeEpisodeScreen() : this.player.container.classList.contains("language-screen") ? this.closeLanguageScreen() : this.player.container.classList.contains("pre-screen") ? this.player.emit("back") : (this.player.pause(), this.showPreScreen()));
  }
  createTvOverlay(l) {
    const e = this.player.createElement("div", "tv-overlay").addClasses([
      "absolute",
      "flex",
      "flex-col",
      "justify-end",
      "gap-4",
      "w-available",
      "h-available",
      "z-0"
    ]).addClasses(["group-[&.nomercyplayer.paused.pre-screen]:hidden"]).appendTo(l), n = this.createTopBar(e);
    this.player.addClasses(n, [
      "px-10",
      "pt-10",
      "z-0"
    ]);
    const t = this.createBackButton(n, !0);
    t && this.player.addClasses(t, ["children:stroke-2"]);
    const i = this.createRestartButton(n, !0);
    this.player.addClasses(i, ["children:stroke-2"]);
    const s = this.createNextButton(n, !0);
    this.player.addClasses(s, ["children:stroke-2"]), this.createDivider(n), this.createTvCurrentItem(n), this.createOverlayCenterMessage(e), this.createSpinnerContainer(e), this.seekContainer = this.createSeekContainer(e);
    const d = this.createBottomBar(e), a = this.player.createElement("div", "bottom-row").addClasses([
      "tv-bottom-row",
      "relative",
      "flex",
      "flex-row",
      "items-center",
      "gap-4",
      "mt-auto",
      "w-available",
      "px-20",
      "pb-10",
      "z-0"
    ]).appendTo(d), o = this.createPlaybackButton(a, !0);
    this.createTime(a, "current", []), this.createTvProgressBar(a), this.createTime(a, "remaining", ["mr-14"]), this.createNextUp(e), this.player.on("playing", () => {
      this.currentMenu !== "seek" && !this.controlsVisible && o.focus();
    });
    let c = t ?? i ?? s;
    return [t, i, s].forEach((p) => {
      p == null || p.addEventListener("keypress", (r) => {
        var h;
        r.key == "ArrowDown" ? this.nextUp.style.display == "none" ? o == null || o.focus() : (h = this.nextUp.lastChild) == null || h.focus() : r.key == "ArrowLeft" ? (c = r.target.previousElementSibling, c == null || c.focus()) : r.key == "ArrowRight" && (r.preventDefault(), c = r.target.nextElementSibling, c == null || c.focus());
      });
    }), [this.nextUp.firstChild, this.nextUp.lastChild].forEach((p) => {
      p == null || p.addEventListener("keypress", (r) => {
        var h, u, y;
        r.key == "ArrowUp" ? (h = c || i) == null || h.focus() : r.key == "ArrowDown" ? o.focus() : r.key == "ArrowLeft" ? (u = this.nextUp.firstChild) == null || u.focus() : r.key == "ArrowRight" && ((y = this.nextUp.lastChild) == null || y.focus());
      });
    }), [o].forEach((p) => {
      p == null || p.addEventListener("keypress", (r) => {
        var h;
        r.key == "ArrowUp" && (r.preventDefault(), this.nextUp.style.display == "none" ? c == null || c.focus() : (h = this.nextUp.lastChild) == null || h.focus());
      });
    }), [this.player.getVideoElement(), e].forEach((p) => {
      p == null || p.addEventListener("keydown", (r) => {
        if (r.key == "ArrowLeft") {
          if ([t, i, s, this.nextUp.firstChild, this.nextUp.lastChild].includes(r.target))
            return;
          if (r.preventDefault(), this.player.emit("show-seek-container", !0), this.shouldSlide)
            this.currentScrubTime = this.getClosestSeekableInterval(), this.shouldSlide = !1;
          else {
            const h = this.currentScrubTime - 10;
            this.player.emit("currentScrubTime", {
              ...this.player.getTimeData(),
              currentTime: h
            });
          }
        } else if (r.key == "ArrowRight") {
          if ([t, i, s, this.nextUp.firstChild, this.nextUp.lastChild].includes(r.target))
            return;
          if (r.preventDefault(), this.player.emit("show-seek-container", !0), this.shouldSlide)
            this.currentScrubTime = this.getClosestSeekableInterval(), this.shouldSlide = !1;
          else {
            const h = this.currentScrubTime + 10;
            this.player.emit("currentScrubTime", {
              ...this.player.getTimeData(),
              currentTime: h
            });
          }
        }
      });
    }), [this.player.getVideoElement(), o, t, i, s].forEach((p) => {
      p == null || p.addEventListener("keypress", (r) => {
        r.key == "Enter" && (this.player.seek(this.currentScrubTime), this.player.emit("show-seek-container", !1), setTimeout(() => {
          this.player.play();
        }, 0));
      });
    }), o.focus(), d;
  }
  showPreScreen() {
    var l;
    this.preScreen.showModal(), (l = this.preScreen.querySelector(".button-container>button")) == null || l.focus(), setTimeout(() => {
      this.player.container.classList.add("pre-screen");
    }, 5);
  }
  closePreScreen() {
    this.preScreen.close(), this.player.ui_removeActiveClass(), this.player.container.classList.remove("pre-screen");
  }
  createPreScreen(l) {
    this.preScreen = this.player.createElement("dialog", "pre-screen-dialog").addClasses(this.tvDialogStyles).addClasses([
      "group-[&.nomercyplayer.paused:not(.open)]:backdrop:bg-black/80",
      "group-[&.nomercyplayer.paused:not(.open)]:backdrop:pointer-events-none"
    ]).appendTo(l), this.preScreen.setAttribute("popover", "manual"), this.preScreen.setAttribute("role", "modal");
    const e = this.player.createElement("div", "pre-screen").addClasses([
      "pre-screen",
      "absolute",
      "inset-0",
      "flex",
      "p-6",
      "text-white",
      "w-available",
      "h-available",
      "z-0"
    ]).addClasses([
      "group-[&.nomercyplayer.paused.episode-screen]:hidden",
      "group-[&.nomercyplayer.paused.language-screen]:hidden"
    ]).appendTo(this.preScreen), n = this.player.createElement("div", "left-side").addClasses([
      "flex",
      "flex-col",
      "justify-between",
      "items-center",
      "w-1/2",
      "h-available"
    ]).appendTo(e), t = this.createImageContainer(n), i = this.player.createElement("div", "title-container").addClasses([
      "flex",
      "flex-col",
      "w-available",
      "h-available"
    ]).appendTo(t), s = this.player.createElement("div", "title").addClasses([
      "flex",
      "text-white",
      "text-lg",
      "font-bold",
      "mx-2"
    ]).appendTo(i), d = this.player.createElement("div", "description").addClasses([
      "text-left",
      "text-white",
      "text-sm",
      "line-clamp-4",
      "font-bold",
      "leading-5",
      "overflow-hidden",
      "mx-2"
    ]).appendTo(i);
    this.player.on("item", () => {
      s.innerHTML = this.player.playlistItem().title.replace(this.player.playlistItem().show ?? "", "").replace("%S", this.player.localize("S")).replace("%E", this.player.localize("E")), d.innerHTML = this.player.playlistItem().description;
    });
    const a = this.player.createElement("div", "button-container").addClasses([
      "button-container",
      "flex",
      "flex-col",
      "gap-3",
      "w-available",
      "h-1/2",
      "mt-7",
      "mb-3",
      "overflow-auto",
      "px-2",
      "py-0.5",
      "[*::-webkit-scrollbar]:hidden"
    ]).appendTo(n);
    this.createTvButton(a, "play", "Resume", this.player.play, this.buttons.play), this.createTvButton(a, "restart", "Play from beginning", this.player.restart, this.buttons.restart);
    const o = this.createTvButton(a, "showEpisodeMenu", "Episodes", () => this.player.emit("showEpisodeScreen"), this.buttons.playlist);
    o.style.display = "none", o.addEventListener("click", () => {
      this.player.emit("switch-season", this.player.playlistItem().season), this.showEpisodeScreen();
    });
    const c = this.createTvButton(a, "showLanguageMenu", "Audio and subtitles", () => this.player.emit("showLanguageScreen"), this.buttons.language);
    c.style.display = "none", c.addEventListener("click", () => {
      this.showLanguageScreen();
    }), this.player.createElement("div", "pre-screen-right-side").addClasses([
      "flex",
      "flex-col",
      "justify-center",
      "w-1/3",
      "h-available"
    ]).appendTo(e), this.player.on("audioTracks", () => {
      this.player.hasAudioTracks() || this.player.hasCaptions() ? c.style.display = "flex" : c.style.display = "none";
    }), this.player.on("item", () => {
      this.player.getPlaylist().length > 1 ? o.style.display = "flex" : o.style.display = "none";
    });
  }
  showEpisodeScreen() {
    var l;
    this.episodeScreen.showModal(), this.player.container.classList.add("episode-screen"), this.player.container.classList.add("open"), (l = this.episodeScrollContainer.querySelector(".button-container>button")) == null || l.focus();
  }
  closeEpisodeScreen() {
    var l;
    this.episodeScreen.close(), this.player.container.classList.remove("episode-screen"), this.player.container.classList.remove("open"), (l = this.preScreen.querySelector(".button-container>button")) == null || l.focus();
  }
  createEpisodeScreen(l) {
    this.episodeScreen = this.player.createElement("dialog", "episode-screen-dialog").addClasses(this.tvDialogStyles).addClasses([
      "group-[&.nomercyplayer.paused.episode-screen]:backdrop:bg-black/80",
      "group-[&.nomercyplayer.paused.episode-screen]:backdrop:pointer-events-none"
    ]).appendTo(l), this.episodeScreen.setAttribute("popover", "manual"), this.episodeScreen.setAttribute("role", "modal");
    const e = this.player.createElement("div", "episode-screen").addClasses([
      "episode-screen",
      "absolute",
      "inset-0",
      "flex",
      "gap-4",
      "p-6",
      "text-white",
      "w-available",
      "h-available",
      "z-0"
    ]).appendTo(this.episodeScreen), n = this.player.createElement("div", "episode-screen-left-side").addClasses([
      "flex",
      "flex-col",
      "justify-between",
      "items-center",
      "w-2/5",
      "h-available"
    ]).appendTo(e);
    this.createImageContainer(n);
    const t = this.player.createElement("div", "season-button-container").addClasses([
      "flex",
      "flex-col",
      "gap-3",
      "w-available",
      "h-1/2",
      "mt-7",
      "mb-3",
      "overflow-auto",
      "px-2",
      "py-0.5",
      "[*::-webkit-scrollbar]:hidden"
    ]).appendTo(n);
    this.player.once("playlist", () => {
      var d;
      let i = {};
      for (const a of this.player.getSeasons())
        i = this.createTvSeasonButton(
          t,
          `season-${a.season}`,
          a,
          () => this.player.emit("switch-season", a.season)
        );
      (d = i.addEventListener) == null || d.call(i, "keypress", (a) => {
        var o, c;
        if (a.key != "ArrowLeft") {
          if (a.key != "ArrowRight") {
            if (!(a.key == "ArrowUp" && !this.player.options.disableTouchControls)) {
              if (a.key == "ArrowDown" && !this.player.options.disableTouchControls) {
                (o = i.nextElementSibling) == null || o.focus();
                const p = i.nextElementSibling;
                (p == null ? void 0 : p.nodeName) == "BUTTON" ? p == null || p.focus() : (c = i.parentElement.nextElementSibling) == null || c.focus();
              }
            }
          }
        }
      });
      const s = this.player.createElement("div", "episode-screen-right-side").addClasses([
        "flex",
        "flex-col",
        "justify-center",
        "w-3/5",
        "h-available"
      ]).appendTo(e);
      this.episodeScrollContainer = this.player.createElement("div", "episode-button-container").addClasses([
        "button-container",
        "flex",
        "flex-col",
        "overflow-auto",
        "h-available",
        "pt-6",
        "gap-2",
        "p-1",
        "min-h-[50%]",
        "scroll-p-4",
        "scroll-smooth"
      ]).appendTo(s);
      for (const [a, o] of this.player.getPlaylist().entries() ?? [])
        this.createTvEpisodeMenuButton(this.episodeScrollContainer, o, a);
    });
  }
  showLanguageScreen() {
    var l;
    this.languageScreen.showModal(), this.player.container.classList.add("language-screen"), this.player.container.classList.add("open"), (l = this.languageScreen.querySelector(".button-container>button")) == null || l.focus();
  }
  closeLanguageScreen() {
    var l;
    this.languageScreen.close(), this.player.container.classList.remove("language-screen"), this.player.container.classList.remove("open"), (l = this.preScreen.querySelector(".button-container>button")) == null || l.focus();
  }
  createLanguageScreen(l) {
    var p;
    this.languageScreen = this.player.createElement("dialog", "language-screen-dialog").addClasses(this.tvDialogStyles).addClasses([
      "group-[&.nomercyplayer.paused.language-screen]:backdrop:bg-black/80",
      "group-[&.nomercyplayer.paused.language-screen]:backdrop:pointer-events-none"
    ]).appendTo(l), this.languageScreen.setAttribute("popover", "manual"), this.languageScreen.setAttribute("role", "modal");
    const e = this.player.createElement("div", "language-screen").addClasses([
      "language-screen",
      "absolute",
      "inset-0",
      "flex",
      "p-6",
      "text-white",
      "w-available",
      "h-available",
      "z-0"
    ]).appendTo(this.languageScreen), n = this.player.createElement("div", "language-screen-left-side").addClasses([
      "flex",
      "flex-col",
      "items-center",
      "overflow-clip",
      "w-2/5",
      "h-available"
    ]).appendTo(e);
    this.createImageContainer(n);
    const t = this.player.createElement("div", "language-scroll-container").addClasses([
      "flex",
      "flex-col",
      "overflow-auto",
      "w-available",
      "h-available",
      "gap-3",
      "scroll-p-4",
      "scroll-smooth",
      "border-transparent",
      "outline-transparent",
      "p-1"
    ]).appendTo(n);
    t.addEventListener("focus", (r) => {
      var h;
      (h = t.querySelector("button")) == null || h.focus();
    });
    const i = this.player.createElement("div", "language-button-container").addClasses([
      "flex-shrink-0",
      "h-auto",
      "px-2",
      "py-0.5",
      "w-available",
      "text-left",
      "mt-3"
    ]).appendTo(t);
    i.innerText = this.player.localize("Audio");
    const s = this.player.createElement("div", "language-button-container").addClasses([
      "[*::-webkit-scrollbar]:hidden",
      "flex",
      "flex-col",
      "flex-shrink-0",
      "gap-3",
      "px-2",
      "py-0.5",
      "w-available"
    ]).appendTo(t);
    s.style.paddingRight = "5rem";
    let d = {};
    const a = (r) => {
      var h, u;
      if (r.key != "ArrowLeft") {
        if (r.key != "ArrowRight") {
          if (r.key == "ArrowUp" && !this.player.options.disableTouchControls)
            (h = r.target.previousElementSibling) == null || h.focus();
          else if (r.key == "ArrowDown" && !this.player.options.disableTouchControls) {
            const y = r.target.nextElementSibling;
            (y == null ? void 0 : y.nodeName) == "BUTTON" ? y == null || y.focus() : (u = d.parentElement.nextElementSibling) == null || u.focus();
          }
        }
      }
    };
    (p = d.removeEventListener) == null || p.call(d, "keypress", a), this.player.on("audioTracks", (r) => {
      s.innerHTML = "";
      for (const [h, u] of (r == null ? void 0 : r.entries()) ?? [])
        d = this.createTvLanguageMenuButton(s, {
          language: u.language ?? "",
          label: u.label ?? "",
          type: u.type ?? "",
          id: u.id ?? h - 1,
          buttonType: "audio"
        });
    });
    const o = this.player.createElement("div", "language-button-container").addClasses([
      "flex-shrink-0",
      "h-auto",
      "px-2",
      "py-0.5",
      "w-available",
      "text-left",
      "mt-3"
    ]).appendTo(t);
    o.innerText = this.player.localize("Subtitles");
    const c = this.player.createElement("div", "subtitle-button-container").addClasses([
      "[*::-webkit-scrollbar]:hidden",
      "flex",
      "flex-col",
      "flex-shrink-0",
      "gap-3",
      "flex-shrink-0",
      "px-2",
      "py-0.5",
      "w-available"
    ]).appendTo(t);
    c.style.paddingRight = "5rem", c.style.marginTop = "0", this.player.on("captionsList", (r) => {
      c.innerHTML = "";
      for (const [h, u] of r.entries() ?? [])
        this.createTvLanguageMenuButton(c, {
          language: u.language ?? "",
          label: u.label ?? "",
          type: u.type ?? "",
          id: u.id ?? h - 1,
          buttonType: "subtitle"
        });
    });
  }
  createTvProgressBar(l) {
    this.sliderBar = this.player.createElement("div", "slider-bar").addClasses([
      "slider-bar",
      "group/slider",
      "flex",
      "rounded-full",
      "bg-white/20",
      "h-2",
      "mx-4",
      "relative",
      "w-available"
    ]).appendTo(l);
    const e = this.player.createElement("div", "slider-buffer").addClasses([
      "slider-buffer",
      "absolute",
      "flex",
      "h-full",
      "pointer-events-none",
      "rounded-full",
      "bg-white/20",
      "z-0",
      "overflow-hidden",
      "overflow-clip"
    ]).appendTo(this.sliderBar), n = this.player.createElement("div", "slider-progress").addClasses([
      "slider-progress",
      "absolute",
      "flex",
      "h-full",
      "pointer-events-none",
      "rounded-full",
      "bg-white",
      "z-10",
      "overflow-hidden",
      "overflow-clip"
    ]).appendTo(this.sliderBar);
    return this.chapterBar = this.player.createElement("div", "chapter-progress").addClasses([
      "chapter-bar",
      "bg-transparent",
      "flex",
      "h-2",
      "relative",
      "rounded-full",
      "overflow-clip",
      "w-available"
    ]).appendTo(this.sliderBar), this.player.on("item", () => {
      this.sliderBar.classList.add("bg-white/20"), this.previewTime = [], this.chapters = [], e.style.width = "0", n.style.width = "0", this.fetchPreviewTime();
    }), this.player.on("chapters", () => {
      var t;
      ((t = this.player.getChapters()) == null ? void 0 : t.length) > 0 && !this.player.isTv() ? this.sliderBar.classList.remove("bg-white/20") : this.sliderBar.classList.add("bg-white/20");
    }), this.player.on("time", (t) => {
      e.style.width = `${t.buffered}%`, n.style.width = `${t.percentage}%`;
    }), this.player.on("currentScrubTime", (t) => {
      n.style.width = `${t.currentTime / t.duration * 100}%`;
    }), this.sliderBar;
  }
  getClosestElement(l, e) {
    const n = [...document.querySelectorAll(e)].filter((i) => getComputedStyle(i).display == "flex"), t = l.getBoundingClientRect();
    return n.find((i) => i.getBoundingClientRect().top + i.getBoundingClientRect().height / 2 == E(
      n.map((s) => s.getBoundingClientRect().top + s.getBoundingClientRect().height / 2),
      t.top + t.height / 2
    ));
  }
  createTvEpisodeMenuButton(l, e, n) {
    var g, m, b;
    const t = this.player.createElement("button", `playlist-${e.id}`).addClasses([
      "playlist-menu-button",
      "relative",
      "flex",
      "w-available",
      "p-2",
      "gap-2",
      "rounded-lg",
      "snap-center",
      "outline-transparent",
      "outline",
      "outline-1",
      "outline-solid",
      "text-white",
      "focus-visible:outline-2",
      "focus-visible:outline-white",
      "transition-all",
      "duration-300",
      "hover:bg-neutral-600/20"
    ]).appendTo(l);
    this.player.playlistItem().season !== 1 && (t.style.display = "none");
    const i = this.player.createElement("div", `playlist-${e.id}-left`).addClasses([
      "episode-menu-button-left",
      "relative",
      "rounded-md",
      "w-[50%]",
      "overflow-clip",
      "self-center"
    ]).appendTo(t);
    this.player.createElement("div", `episode-${e.id}-shadow`).addClasses([
      "episode-menu-button-shadow",
      "bg-[linear-gradient(0deg,rgba(0,0,0,0.87)_0%,rgba(0,0,0,0.7)_25%,rgba(0,0,0,0)_50%,rgba(0,0,0,0)_100%)]",
      "shadow-[inset_0px_1px_0px_rgba(255,255,255,0.24),inset_0px_-1px_0px_rgba(0,0,0,0.24),inset_0px_-2px_0px_rgba(0,0,0,0.24)]",
      "bottom-0",
      "left-0",
      "absolute",
      "!h-available",
      "w-available"
    ]).appendTo(i);
    const s = this.player.createElement("img", `episode-${e.id}-image`).addClasses([
      "episode-menu-button-image",
      "w-available",
      "h-auto",
      "aspect-video",
      "object-cover",
      ""
    ]).appendTo(i);
    s.setAttribute("loading", "lazy"), (g = e.image) != null && g.startsWith("http") ? s.src = e.image ?? "" : s.src = e.image && e.image != "" ? `${this.imageBaseUrl}${e.image}` : "";
    const d = this.player.createElement("div", `episode-${e.id}-progress-container`).addClasses([
      "episode-menu-progress-container",
      "absolute",
      "bottom-0",
      "w-available",
      "flex",
      "flex-col",
      "px-3"
    ]).appendTo(i), a = this.player.createElement("div", `episode-${e.id}-progress-box`).addClasses([
      "episode-menu-progress-box",
      "flex",
      "justify-between",
      "h-available",
      "sm:mx-2",
      "mb-1",
      "px-1"
    ]).appendTo(d), o = this.player.createElement("div", `episode-${e.id}-progress-item`).addClasses([
      "progress-item-text",
      "text-[0.7rem]",
      ""
    ]).appendTo(a);
    e.episode && e.show && (o.innerText = `${this.player.localize("E")}${e.episode}`);
    const c = this.player.createElement("div", `episode-${e.id}-progress-duration`).addClasses([
      "progress-duration",
      "text-[0.7rem]"
    ]).appendTo(a);
    c.innerText = (m = e.duration) == null ? void 0 : m.replace(/^00:/u, "");
    const p = this.player.createElement("div", `episode-${e.id}-slider-container`).addClasses([
      "slider-container",
      "hidden",
      "rounded-md",
      "overflow-clip",
      "bg-gray-500/80",
      "h-1",
      "mb-2",
      "mx-1",
      "sm:mx-2"
    ]).appendTo(d);
    p.style.display = e.progress ? "flex" : "none";
    const r = this.player.createElement("div", `episode-${e.id}-progress-bar`).addClasses([
      "progress-bar",
      "bg-white"
    ]).appendTo(p);
    (b = e.progress) != null && b.percentage && (r.style.width = `${e.progress.percentage > 98 ? 100 : e.progress}%`);
    const h = this.player.createElement("div", `episode-${e.id}-right-side`).addClasses([
      "playlist-card-right",
      "w-3/4",
      "flex",
      "flex-col",
      "text-left",
      "gap-1",
      "px-1",
      "outline-transparent",
      "outline",
      "outline-1",
      "outline-solid",
      "focus-visible:outline-2",
      "focus-visible:outline-white",
      "active:outline-white"
    ]).appendTo(t), u = this.player.createElement("span", `episode-${e.id}-title`).addClasses([
      "playlist-menu-button-title",
      "font-bold",
      "text-lg",
      "line-clamp-1",
      "text-white",
      ""
    ]).appendTo(h);
    u.textContent = S((e.title ?? "").replace(e.show ?? "", "").replace("%S", this.player.localize("S")).replace("%E", this.player.localize("E")));
    const y = this.player.createElement("span", `episode-${e.id}-overview`).addClasses([
      "playlist-menu-button-overview",
      "font-bold",
      "text-[0.7rem]",
      "leading-4",
      "line-clamp-4",
      "overflow-hidden",
      "text-white"
    ]).appendTo(h);
    return y.textContent = k(e.description, 600), this.player.on("item", () => {
      this.player.playlistItem().season == e.season ? t.style.display = "flex" : t.style.display = "none", this.player.playlistItem().season == e.season && this.player.playlistItem().episode == e.episode ? t.style.background = "rgba(255,255,255,.1)" : t.style.background = "transparent";
    }), this.player.on("switch-season", (f) => {
      this.selectedSeason = f, this.player.playlistItem().id == e.id ? setTimeout(() => {
        this.scrollCenter(t, l, {
          margin: 1,
          duration: 100
        });
      }, 50) : this.player.playlistItem().season !== f && this.episodeScrollContainer.scrollTo(0, 0), f == e.season ? t.style.display = "flex" : t.style.display = "none";
    }), this.player.on("time", (f) => {
      var v;
      ((v = this.player.playlistItem()) == null ? void 0 : v.uuid) == e.uuid && (r.style.width = `${f.percentage}%`, p.style.display = "flex");
    }), e.episode && e.show && (o.innerText = e.season == null ? `${e.episode}` : `${this.player.localize("S")}${e.season}: ${this.player.localize("E")}${e.episode}`), t.addEventListener("keypress", (f) => {
      var v, w, x;
      f.key == "ArrowLeft" ? (v = document.querySelector(`#season-${this.player.playlistItem().season}`)) == null || v.focus() : f.key == "ArrowRight" || (f.key == "ArrowUp" && !this.player.options.disableTouchControls ? (w = t.previousElementSibling) == null || w.focus() : f.key == "ArrowDown" && !this.player.options.disableTouchControls && ((x = t.nextElementSibling) == null || x.focus()));
    }), t.addEventListener("focus", () => {
      this.scrollCenter(t, l, {
        margin: 2,
        duration: 50
      });
    }), t.addEventListener("click", () => {
      e.episode && e.season ? this.setEpisode(e.season, e.episode) : this.player.playlistItem(n), this.closeEpisodeScreen(), this.closePreScreen(), this.player.play();
    }), t;
  }
  createTvSeasonButton(l, e, n, t, i) {
    const s = this.player.createElement("button", e).addClasses([
      "w-available",
      "mr-auto",
      "h-8",
      "px-1",
      "py-2",
      "flex",
      "flex-nowrap",
      "items-center",
      "snap-center",
      "rounded",
      "outline-transparent",
      "outline",
      "outline-1",
      "outline-solid",
      "focus-visible:outline-2",
      "focus-visible:outline-white",
      "active:outline-white",
      `${e}-button`
    ]).appendTo(l);
    if (s.type = "button", s.addEventListener("focus", () => {
      this.scrollIntoView(s);
    }), s.addEventListener("keyup", (a) => {
      var o, c, p, r;
      a.key == "ArrowLeft" || a.key == "ArrowRight" && (n.season == ((o = this.player.playlistItem()) == null ? void 0 : o.season) ? (p = [...document.querySelectorAll("[id^=playlist-]")].filter((h) => getComputedStyle(h).display == "flex").at((((c = this.player.playlistItem()) == null ? void 0 : c.episode) ?? 0) - 1)) == null || p.focus() : (r = [...document.querySelectorAll("[id^=playlist-]")].filter((h) => getComputedStyle(h).display == "flex").at(0)) == null || r.focus());
    }), s.addEventListener("keypress", (a) => {
      var o, c;
      a.key == "ArrowUp" && !this.player.options.disableTouchControls ? (o = s.previousElementSibling) == null || o.focus() : a.key == "ArrowDown" && !this.player.options.disableTouchControls && ((c = s.nextElementSibling) == null || c.focus());
    }), s.addEventListener("click", () => {
      t == null || t.bind(this)();
    }), i) {
      const a = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      a.setAttribute("viewBox", "0 0 24 24"), a.id = e, this.player.addClasses(a, [
        `${e}-icon`,
        ...i.classes,
        "svg-size",
        "h-5",
        "w-5",
        "pointer-events-none",
        "group-hover/button:scale-110",
        "duration-700"
      ]);
      const o = document.createElementNS("http://www.w3.org/2000/svg", "path");
      o.setAttribute("d", i.hover), a.appendChild(o), s.appendChild(a);
    }
    const d = this.player.createElement("span", `${e}-buttonText`).addClasses([
      "w-available",
      "text-white",
      "text-sm",
      "font-bold",
      "mx-2",
      "flex",
      "justify-between",
      "flex-nowrap"
    ]).appendTo(s);
    return n.seasonName ? d.innerHTML = `
				<span>
					${n.seasonName ?? ""}  
				</span>
				<span>
					${n.episodes} ${this.player.localize("episodes")}
				</span>
			` : n.season ? d.innerHTML = `
				<span>
					${this.player.localize("Season")} ${n.season}
				</span>
				<span>
					${n.episodes} ${this.player.localize("episodes")}
				</span>
			` : d.innerHTML = `
				<span>
					
				</span>
				<span>
					${n.episodes} ${this.player.localize("episodes")}
				</span>
			`, s;
  }
  createTvLanguageMenuButton(l, e, n = !1) {
    const t = this.player.createElement("button", `${e.type}-button-${e.language}`).addClasses([
      "language-button",
      "w-available",
      "mr-auto",
      "h-8",
      "px-1",
      "py-2",
      "flex",
      "items-center",
      "rounded",
      "snap-center",
      "outline-transparent",
      "outline",
      "whitespace-nowrap",
      "transition-all",
      "duration-100",
      "outline-1",
      "outline-solid",
      "focus-visible:outline-2",
      "focus-visible:outline-white",
      "active:outline-white"
    ]).appendTo(l), i = this.createSVGElement(t, "checkmark", this.buttons.checkmark, !1, n);
    return this.player.addClasses(i, [
      "w-10",
      "opacity-0"
    ]), this.getLanguageButtonText(t, e), e.id > 0 && e.buttonType == "audio" || e.id > 1 && e.buttonType == "subtitle" ? i.classList.add("opacity-0") : i.classList.remove("opacity-0"), e.buttonType == "audio" ? (this.player.on("audioTrackChanging", (s) => {
      e.id === s.id ? i.classList.remove("opacity-0") : i.classList.add("opacity-0");
    }), t.addEventListener("click", (s) => {
      s.stopPropagation(), this.player.setCurrentAudioTrack(e.id);
    })) : e.buttonType == "subtitle" && (e.id === this.player.getCaptionIndex() ? i.classList.remove("opacity-0") : i.classList.add("opacity-0"), this.player.on("captionsChanged", (s) => {
      e.id === s.id ? i.classList.remove("opacity-0") : i.classList.add("opacity-0");
    }), t.addEventListener("click", (s) => {
      s.stopPropagation(), this.player.setCurrentCaption(e.id);
    })), t.addEventListener("keypress", (s) => {
      var d, a, o, c;
      s.key == "ArrowLeft" ? (d = this.player.getClosestElement(t, '[id^="audio-button-"]')) == null || d.focus() : s.key == "ArrowRight" ? (a = this.player.getClosestElement(t, '[id^="subtitle-button-"]')) == null || a.focus() : s.key == "ArrowUp" && !this.player.options.disableTouchControls ? (o = t.previousElementSibling) == null || o.focus() : s.key == "ArrowDown" && !this.player.options.disableTouchControls && ((c = t.nextElementSibling) == null || c.focus());
    }), t.addEventListener("focus", () => {
      setTimeout(() => {
        this.scrollCenter(t, l.parentElement, {
          margin: 1,
          duration: 100
        });
      }, 50);
    }), this.player.on("audioTrackChanged", (s) => {
      e.id === s.id && t.focus();
    }), t;
  }
  getVisibleButtons(l) {
    const e = l.parentElement, n = e == null ? void 0 : e.querySelectorAll("button");
    if (!n || (n == null ? void 0 : n.length) == 0)
      return;
    const t = [...n].filter((s) => s.style.display != "none"), i = t.findIndex((s) => s == l);
    return {
      visibleButtons: t,
      currentButtonIndex: i
    };
  }
  findPreviousVisibleButton(l) {
    const e = this.getVisibleButtons(l);
    if (!e)
      return;
    const { visibleButtons: n, currentButtonIndex: t } = e;
    for (let i = t; i >= 0; i--)
      return n[i - 1];
  }
  findNextVisibleButton(l) {
    const e = this.getVisibleButtons(l);
    if (!e)
      return;
    const { visibleButtons: n, currentButtonIndex: t } = e;
    for (let i = t; i < n.length; i++)
      return n[i + 1];
  }
  createImageContainer(l) {
    const e = this.player.createElement("div", "left-side-top").addClasses([
      "flex",
      "flex-col",
      "justify-center",
      "items-center",
      "w-available",
      "gap-2",
      "h-auto"
    ]).appendTo(l), n = this.player.createElement("div", "logo-container").addClasses([
      "flex",
      "flex-col",
      "justify-center",
      "items-center",
      "w-available",
      "h-[85px]",
      "min-h-[85px]"
    ]).appendTo(e), t = this.player.createElement("span", "fallbackText").addClasses([
      "w-auto",
      "h-available",
      "items-center",
      "py-0",
      "max-w-[38vw]",
      "mr-auto",
      "leading-[1.2]",
      "font-bold",
      "object-fit"
    ]).appendTo(n), i = this.player.createElement("img", "logo").addClasses([
      "w-auto",
      "px-2",
      "py-2",
      "mr-auto",
      "object-fit",
      "h-auto",
      "max-w-[23rem]",
      "max-h-available",
      ""
    ]).appendTo(n), s = this.player.createElement("div", "left-side-top-overview").addClasses([
      "flex",
      "flex-col",
      "w-available",
      "h-[40px]"
    ]).appendTo(e), d = this.player.createElement("div", "rating-container").addClasses([
      "flex",
      "gap-2",
      "items-center",
      "w-available",
      "text-white"
    ]).appendTo(s), a = this.player.createElement("span", "year-text").addClasses([
      "flex",
      "text-white",
      "text-sm",
      "font-bold",
      "mx-2"
    ]).appendTo(d), o = this.player.createElement("img", "rating-image").addClasses([
      "w-8",
      "h-available",
      "object-fit",
      "invert"
    ]).appendTo(d), c = this.player.createElement("span", "episodes-count-text").addClasses([
      "flex",
      "text-white",
      "text-sm",
      "font-bold",
      "mx-2"
    ]).appendTo(d);
    return this.player.on("item", () => {
      var h, u, y, g, m, b;
      const p = (h = this.player.playlistItem()) == null ? void 0 : h.logo;
      !p || p == "" || p.includes("null") || p.includes("undefined") ? (t.textContent = T(((u = this.player.playlistItem()) == null ? void 0 : u.show) ?? ""), t.style.fontSize = `calc(110px / ${t.textContent.length} + 3ch)`, t.style.display = "flex", i.style.display = "none") : (i.style.display = "block", t.style.display = "none", p != null && p.startsWith("http") ? i.src = p : i.src = p && p != "" ? `${this.imageBaseUrl}${p}` : ""), a.innerHTML = ((g = (y = this.player.playlistItem()) == null ? void 0 : y.year) == null ? void 0 : g.toString()) ?? "", (m = this.player.playlistItem()) != null && m.year ? a.style.display = "flex" : a.style.display = "none", o.removeAttribute("src"), o.removeAttribute("alt"), o.style.opacity = "0", this.player.getPlaylist().length > 1 && (c.innerHTML = `${this.player.getPlaylist().length} ${this.player.localize("episodes")}`);
      const r = (b = this.player.playlistItem()) == null ? void 0 : b.rating;
      r && (o.src = `https://storage.nomercy.tv/laravel/kijkwijzer/${r.image}`, o.alt = r.rating.toString(), o.style.opacity = "1");
    }), e;
  }
  createTvButton(l, e, n, t, i) {
    const s = this.player.createElement("button", e).addClasses([
      "w-9/12",
      "mr-auto",
      "h-8",
      "px-1",
      "py-2",
      "flex",
      "items-center",
      "rounded",
      "snap-center",
      "outline-transparent",
      "outline",
      "outline-1",
      "outline-solid",
      "focus-visible:outline-2",
      "focus-visible:outline-white",
      "active:outline-white",
      `${e}-button`
    ]).appendTo(l);
    if (s.type = "button", s.addEventListener("focus", () => {
      setTimeout(() => {
        this.scrollCenter(s, l, {
          margin: 1,
          duration: 100
        });
      }, 50);
    }), s.addEventListener("keypress", (a) => {
      var o, c, p;
      if (a.key == "ArrowUp" && !this.player.options.disableTouchControls)
        (o = this.findPreviousVisibleButton(s)) == null || o.focus();
      else if (a.key == "ArrowDown" && !this.player.options.disableTouchControls) {
        const r = this.findNextVisibleButton(s);
        r ? r == null || r.focus() : (p = (c = s.parentElement) == null ? void 0 : c.nextElementSibling) == null || p.focus();
      }
    }), s.addEventListener("click", t == null ? void 0 : t.bind(this.player)), i) {
      const a = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      a.setAttribute("viewBox", "0 0 24 24"), a.id = e, this.player.addClasses(a, [
        `${e}-icon`,
        ...i.classes,
        "svg-size",
        "h-5",
        "w-5",
        "pointer-events-none",
        "group-hover/button:scale-110",
        "duration-700"
      ]);
      const o = document.createElementNS("http://www.w3.org/2000/svg", "path");
      o.setAttribute("d", i.hover), a.appendChild(o), s.appendChild(a);
    }
    const d = this.player.createElement("span", `${e}-buttonText`).addClasses([
      "text-white",
      "text-sm",
      "font-bold",
      "mx-2",
      "flex",
      "justify-between"
    ]).appendTo(s);
    return d.innerHTML = this.player.localize(n), s;
  }
  createTvCurrentItem(l) {
    const e = this.player.createElement("div", "current-item-container").addClasses([
      "flex",
      "flex-col",
      "justify-end",
      "items-end",
      "gap-2"
    ]).appendTo(l), n = this.player.createElement("div", "current-item-show").addClasses([
      "text-white",
      "text-sm",
      "whitespace-pre",
      "font-bold"
    ]).appendTo(e), t = this.player.createElement("div", "current-item-title-container").addClasses([
      "flex",
      "flex-row",
      "gap-2"
    ]).appendTo(e), i = this.player.createElement("div", "current-item-episode").addClasses([]).appendTo(t), s = this.player.createElement("div", "current-item-title").addClasses([]).appendTo(t);
    return this.player.on("item", () => {
      var a, o;
      const d = this.player.playlistItem();
      n.innerHTML = T(d.show ?? ""), i.innerHTML = "", d.season && (i.innerHTML += `${this.player.localize("S")}${d.season}`), d.season && d.episode && (i.innerHTML += `: ${this.player.localize("E")}${d.episode}`), s.innerHTML = ((a = d.title) == null ? void 0 : a.replace(d.show ?? "", "").length) > 0 ? `"${(o = d.title) == null ? void 0 : o.replace(d.show ?? "", "").replace("%S", this.player.localize("S")).replace("%E", this.player.localize("E"))}"` : "";
    }), e;
  }
}
export {
  $ as T
};
