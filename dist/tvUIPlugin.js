import { B as C } from "./desktopUIPlugin.js";
import { n as E, l as S, a as k, b as T } from "./helpers.js";
class A extends C {
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
      this.player.getVideoElement().scrollIntoView(), this.closePreScreen();
    }), this.player.on("back-button", this.backMenu.bind(this)), document.addEventListener("keypress", (a) => {
      a.key == "Backspace" && this.backMenu(), a.key == "ArrowUp" && this.player.ui_resetInactivityTimer(), a.key == "ArrowDown" && this.player.ui_resetInactivityTimer(), a.key == "ArrowLeft" && this.player.ui_resetInactivityTimer(), a.key == "ArrowRight" && this.player.ui_resetInactivityTimer();
    }), this.player.on("pause", () => {
    });
  }
  backMenu() {
    this.player.isTv() && this.currentMenu !== "seek" && (this.player.container.classList.contains("episode-screen") ? this.closeEpisodeScreen() : this.player.container.classList.contains("language-screen") ? this.closeLanguageScreen() : (this.player.pause(), this.showPreScreen()));
  }
  createTvOverlay(a) {
    const e = this.player.createElement("div", "tv-overlay").addClasses([
      "absolute",
      "flex",
      "flex-col",
      "justify-end",
      "gap-4",
      "w-available",
      "h-available",
      "z-0"
    ]).addClasses(["group-[&.nomercyplayer.paused.pre-screen]:hidden"]).appendTo(a), n = this.createTopBar(e);
    this.player.addClasses(n, [
      "px-10",
      "pt-10",
      "z-0"
    ]);
    const t = this.createBackButton(n, !0);
    t && this.player.addClasses(t, ["children:stroke-2"]);
    const s = this.createRestartButton(n, !0);
    this.player.addClasses(s, ["children:stroke-2"]);
    const i = this.createNextButton(n, !0);
    this.player.addClasses(i, ["children:stroke-2"]), this.createDivider(n), this.createTvCurrentItem(n), this.createOverlayCenterMessage(e), this.seekContainer = this.createSeekContainer(e);
    const d = this.createBottomBar(e), l = this.player.createElement("div", "bottom-row").addClasses([
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
    ]).appendTo(d), p = this.createPlaybackButton(l, !0);
    this.createTime(l, "current", []), this.createTvProgressBar(l), this.createTime(l, "remaining", ["mr-14"]), this.createNextUp(e), this.player.on("playing", () => {
      this.currentMenu !== "seek" && !this.controlsVisible && p.focus();
    });
    let c = t ?? s ?? i;
    return [t, s, i].forEach((r) => {
      r == null || r.addEventListener("keypress", (o) => {
        var h;
        o.key == "ArrowDown" ? this.nextUp.style.display == "none" ? p == null || p.focus() : (h = this.nextUp.lastChild) == null || h.focus() : o.key == "ArrowLeft" ? (c = o.target.previousElementSibling, c == null || c.focus()) : o.key == "ArrowRight" && (o.preventDefault(), c = o.target.nextElementSibling, c == null || c.focus());
      });
    }), [this.nextUp.firstChild, this.nextUp.lastChild].forEach((r) => {
      r == null || r.addEventListener("keypress", (o) => {
        var h, u, y;
        o.key == "ArrowUp" ? (h = c || s) == null || h.focus() : o.key == "ArrowDown" ? p.focus() : o.key == "ArrowLeft" ? (u = this.nextUp.firstChild) == null || u.focus() : o.key == "ArrowRight" && ((y = this.nextUp.lastChild) == null || y.focus());
      });
    }), [p].forEach((r) => {
      r == null || r.addEventListener("keypress", (o) => {
        var h;
        o.key == "ArrowUp" && (o.preventDefault(), this.nextUp.style.display == "none" ? c == null || c.focus() : (h = this.nextUp.lastChild) == null || h.focus());
      });
    }), [this.player.getVideoElement(), e].forEach((r) => {
      r == null || r.addEventListener("keydown", (o) => {
        if (o.key == "ArrowLeft") {
          if ([t, s, i, this.nextUp.firstChild, this.nextUp.lastChild].includes(o.target))
            return;
          if (o.preventDefault(), this.player.emit("show-seek-container", !0), this.shouldSlide)
            this.currentScrubTime = this.getClosestSeekableInterval(), this.shouldSlide = !1;
          else {
            const h = this.currentScrubTime - 10;
            this.player.emit("currentScrubTime", {
              ...this.player.getTimeData(),
              currentTime: h
            });
          }
        } else if (o.key == "ArrowRight") {
          if ([t, s, i, this.nextUp.firstChild, this.nextUp.lastChild].includes(o.target))
            return;
          if (o.preventDefault(), this.player.emit("show-seek-container", !0), this.shouldSlide)
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
    }), [this.player.getVideoElement(), p, t, s, i].forEach((r) => {
      r == null || r.addEventListener("keypress", (o) => {
        o.key == "Enter" && (this.player.seek(this.currentScrubTime), this.player.play(), this.player.emit("show-seek-container", !1));
      });
    }), p.focus(), d;
  }
  showPreScreen() {
    var a;
    this.preScreen.showModal(), this.player.container.classList.add("pre-screen"), (a = this.preScreen.querySelector(".button-container>button")) == null || a.focus();
  }
  closePreScreen() {
    this.preScreen.close(), this.player.container.classList.remove("pre-screen"), this.player.ui_removeActiveClass();
  }
  createPreScreen(a) {
    this.preScreen = this.player.createElement("dialog", "pre-screen-dialog").addClasses(this.tvDialogStyles).addClasses([
      "group-[&.nomercyplayer.paused:not(.open)]:backdrop:bg-black/80",
      "group-[&.nomercyplayer.paused:not(.open)]:backdrop:pointer-events-none"
    ]).appendTo(a), this.preScreen.setAttribute("popover", "manual"), this.preScreen.setAttribute("role", "modal");
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
    ]).appendTo(e), t = this.createImageContainer(n), s = this.player.createElement("div", "title-container").addClasses([
      "flex",
      "flex-col",
      "w-available",
      "h-available"
    ]).appendTo(t), i = this.player.createElement("div", "title").addClasses([
      "flex",
      "text-white",
      "text-lg",
      "font-bold",
      "mx-2"
    ]).appendTo(s), d = this.player.createElement("div", "description").addClasses([
      "text-left",
      "text-white",
      "text-sm",
      "line-clamp-4",
      "font-bold",
      "leading-5",
      "overflow-hidden",
      "mx-2"
    ]).appendTo(s);
    this.player.on("item", () => {
      i.innerHTML = this.player.playlistItem().title.replace(this.player.playlistItem().show ?? "", "").replace("%S", this.player.localize("S")).replace("%E", this.player.localize("E")), d.innerHTML = this.player.playlistItem().description;
    });
    const l = this.player.createElement("div", "button-container").addClasses([
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
    this.createTvButton(l, "play", "Resume", this.player.play, this.buttons.play), this.createTvButton(l, "restart", "Play from beginning", this.player.restart, this.buttons.restart);
    const p = this.createTvButton(l, "showEpisodeMenu", "Episodes", () => this.player.emit("showEpisodeScreen"), this.buttons.playlist);
    p.style.display = "none", p.addEventListener("click", () => {
      this.player.emit("switch-season", this.player.playlistItem().season), this.showEpisodeScreen();
    });
    const c = this.createTvButton(l, "showLanguageMenu", "Audio and subtitles", () => this.player.emit("showLanguageScreen"), this.buttons.language);
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
      this.player.getPlaylist().length > 1 ? p.style.display = "flex" : p.style.display = "none";
    });
  }
  showEpisodeScreen() {
    var a;
    this.episodeScreen.showModal(), this.player.container.classList.add("episode-screen"), this.player.container.classList.add("open"), (a = this.episodeScrollContainer.querySelector(".button-container>button")) == null || a.focus();
  }
  closeEpisodeScreen() {
    var a;
    this.episodeScreen.close(), this.player.container.classList.remove("episode-screen"), this.player.container.classList.remove("open"), (a = this.preScreen.querySelector(".button-container>button")) == null || a.focus();
  }
  createEpisodeScreen(a) {
    var d;
    this.episodeScreen = this.player.createElement("dialog", "episode-screen-dialog").addClasses(this.tvDialogStyles).addClasses([
      "group-[&.nomercyplayer.paused.episode-screen]:backdrop:bg-black/80",
      "group-[&.nomercyplayer.paused.episode-screen]:backdrop:pointer-events-none"
    ]).appendTo(a), this.episodeScreen.setAttribute("popover", "manual"), this.episodeScreen.setAttribute("role", "modal");
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
    let s = {};
    for (const l of this.player.getSeasons())
      s = this.createTvSeasonButton(
        t,
        `season-${l.season}`,
        l,
        () => this.player.emit("switch-season", l.season)
      );
    (d = s.addEventListener) == null || d.call(s, "keypress", (l) => {
      var p, c;
      if (l.key != "ArrowLeft") {
        if (l.key != "ArrowRight") {
          if (!(l.key == "ArrowUp" && !this.player.options.disableTouchControls)) {
            if (l.key == "ArrowDown" && !this.player.options.disableTouchControls) {
              (p = s.nextElementSibling) == null || p.focus();
              const r = s.nextElementSibling;
              (r == null ? void 0 : r.nodeName) == "BUTTON" ? r == null || r.focus() : (c = s.parentElement.nextElementSibling) == null || c.focus();
            }
          }
        }
      }
    });
    const i = this.player.createElement("div", "episode-screen-right-side").addClasses([
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
      "scroll-snap-align-center",
      "scroll-smooth"
    ]).appendTo(i);
    for (const [l, p] of this.player.getPlaylist().entries() ?? [])
      this.createTvEpisodeMenuButton(this.episodeScrollContainer, p, l);
  }
  showLanguageScreen() {
    var a;
    this.languageScreen.showModal(), this.player.container.classList.add("language-screen"), this.player.container.classList.add("open"), (a = this.languageScreen.querySelector(".button-container>button")) == null || a.focus();
  }
  closeLanguageScreen() {
    var a;
    this.languageScreen.close(), this.player.container.classList.remove("language-screen"), this.player.container.classList.remove("open"), (a = this.preScreen.querySelector(".button-container>button")) == null || a.focus();
  }
  createLanguageScreen(a) {
    var r;
    this.languageScreen = this.player.createElement("dialog", "language-screen-dialog").addClasses(this.tvDialogStyles).addClasses([
      "group-[&.nomercyplayer.paused.language-screen]:backdrop:bg-black/80",
      "group-[&.nomercyplayer.paused.language-screen]:backdrop:pointer-events-none"
    ]).appendTo(a), this.languageScreen.setAttribute("popover", "manual"), this.languageScreen.setAttribute("role", "modal");
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
      "p-1"
    ]).appendTo(n), s = this.player.createElement("div", "language-button-container").addClasses([
      "flex-shrink-0",
      "h-auto",
      "px-2",
      "py-0.5",
      "w-available",
      "text-left",
      "mt-3"
    ]).appendTo(t);
    s.innerText = this.player.localize("Audio");
    const i = this.player.createElement("div", "language-button-container").addClasses([
      "[*::-webkit-scrollbar]:hidden",
      "flex",
      "flex-col",
      "flex-shrink-0",
      "gap-3",
      "px-2",
      "py-0.5",
      "w-available"
    ]).appendTo(t);
    i.style.paddingRight = "5rem";
    let d = {};
    const l = (o) => {
      var h, u;
      if (o.key != "ArrowLeft") {
        if (o.key != "ArrowRight") {
          if (o.key == "ArrowUp" && !this.player.options.disableTouchControls)
            (h = o.target.previousElementSibling) == null || h.focus();
          else if (o.key == "ArrowDown" && !this.player.options.disableTouchControls) {
            const y = o.target.nextElementSibling;
            (y == null ? void 0 : y.nodeName) == "BUTTON" ? y == null || y.focus() : (u = d.parentElement.nextElementSibling) == null || u.focus();
          }
        }
      }
    };
    (r = d.removeEventListener) == null || r.call(d, "keypress", l), this.player.on("audioTracks", (o) => {
      i.innerHTML = "";
      for (const [h, u] of (o == null ? void 0 : o.entries()) ?? [])
        d = this.createTvLanguageMenuButton(i, {
          language: u.language ?? "",
          label: u.label ?? "",
          type: u.type ?? "",
          id: u.id ?? h - 1,
          buttonType: "audio"
        });
    });
    const p = this.player.createElement("div", "language-button-container").addClasses([
      "flex-shrink-0",
      "h-auto",
      "px-2",
      "py-0.5",
      "w-available",
      "text-left",
      "mt-3"
    ]).appendTo(t);
    p.innerText = this.player.localize("Subtitles");
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
    c.style.paddingRight = "5rem", c.style.marginTop = "0", this.player.on("captionsList", (o) => {
      c.innerHTML = "";
      for (const [h, u] of o.entries() ?? [])
        this.createTvLanguageMenuButton(c, {
          language: u.language ?? "",
          label: u.label ?? "",
          type: u.type ?? "",
          id: u.id ?? h - 1,
          buttonType: "subtitle"
        });
    });
  }
  createTvProgressBar(a) {
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
    ]).appendTo(a);
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
  getClosestElement(a, e) {
    const n = [...document.querySelectorAll(e)].filter((s) => getComputedStyle(s).display == "flex"), t = a.getBoundingClientRect();
    return n.find((s) => s.getBoundingClientRect().top + s.getBoundingClientRect().height / 2 == E(
      n.map((i) => i.getBoundingClientRect().top + i.getBoundingClientRect().height / 2),
      t.top + t.height / 2
    ));
  }
  createTvEpisodeMenuButton(a, e, n) {
    var f, m, b;
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
    ]).appendTo(a);
    this.player.playlistItem().season !== 1 && (t.style.display = "none");
    const s = this.player.createElement("div", `playlist-${e.id}-left`).addClasses([
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
    ]).appendTo(s);
    const i = this.player.createElement("img", `episode-${e.id}-image`).addClasses([
      "episode-menu-button-image",
      "w-available",
      "h-auto",
      "aspect-video",
      "object-cover",
      ""
    ]).appendTo(s);
    i.setAttribute("loading", "lazy"), (f = e.image) != null && f.startsWith("http") ? i.src = e.image ?? "" : i.src = e.image && e.image != "" ? `${this.imageBaseUrl}${e.image}` : "";
    const d = this.player.createElement("div", `episode-${e.id}-progress-container`).addClasses([
      "episode-menu-progress-container",
      "absolute",
      "bottom-0",
      "w-available",
      "flex",
      "flex-col",
      "px-3"
    ]).appendTo(s), l = this.player.createElement("div", `episode-${e.id}-progress-box`).addClasses([
      "episode-menu-progress-box",
      "flex",
      "justify-between",
      "h-available",
      "sm:mx-2",
      "mb-1",
      "px-1"
    ]).appendTo(d), p = this.player.createElement("div", `episode-${e.id}-progress-item`).addClasses([
      "progress-item-text",
      "text-[0.7rem]",
      ""
    ]).appendTo(l);
    e.episode && e.show && (p.innerText = `${this.player.localize("E")}${e.episode}`);
    const c = this.player.createElement("div", `episode-${e.id}-progress-duration`).addClasses([
      "progress-duration",
      "text-[0.7rem]"
    ]).appendTo(l);
    c.innerText = (m = e.duration) == null ? void 0 : m.replace(/^00:/u, "");
    const r = this.player.createElement("div", `episode-${e.id}-slider-container`).addClasses([
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
    r.style.display = e.progress ? "flex" : "none";
    const o = this.player.createElement("div", `episode-${e.id}-progress-bar`).addClasses([
      "progress-bar",
      "bg-white"
    ]).appendTo(r);
    (b = e.progress) != null && b.percentage && (o.style.width = `${e.progress.percentage > 98 ? 100 : e.progress}%`);
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
    u.textContent = S(e.title.replace(e.show ?? "", "").replace("%S", this.player.localize("S")).replace("%E", this.player.localize("E")));
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
    }), this.player.on("switch-season", (g) => {
      this.selectedSeason = g, this.player.playlistItem().id == e.id ? setTimeout(() => {
        this.scrollCenter(a, t, {
          margin: 1
        });
      }, 50) : this.player.playlistItem().season !== g && this.episodeScrollContainer.scrollTo(0, 0), g == e.season ? t.style.display = "flex" : t.style.display = "none";
    }), this.player.on("time", (g) => {
      var v;
      ((v = this.player.playlistItem()) == null ? void 0 : v.uuid) == e.uuid && (o.style.width = `${g.percentage}%`, r.style.display = "flex");
    }), e.episode && e.show && (p.innerText = e.season == null ? `${e.episode}` : `${this.player.localize("S")}${e.season}: ${this.player.localize("E")}${e.episode}`), t.addEventListener("keypress", (g) => {
      var v, w, x;
      g.key == "ArrowLeft" ? (v = document.querySelector(`#season-${this.player.playlistItem().season}`)) == null || v.focus() : g.key == "ArrowRight" || (g.key == "ArrowUp" && !this.player.options.disableTouchControls ? (w = t.previousElementSibling) == null || w.focus() : g.key == "ArrowDown" && !this.player.options.disableTouchControls && ((x = t.nextElementSibling) == null || x.focus()));
    }), t.addEventListener("focus", () => {
      setTimeout(() => {
        this.scrollCenter(a, t, {
          margin: 1.1
        });
      }, 0);
    }), t.addEventListener("click", () => {
      e.episode && e.season ? this.setEpisode(e.season, e.episode) : this.player.playlistItem(n), this.closeEpisodeScreen(), this.closePreScreen(), this.player.play();
    }), t;
  }
  createTvSeasonButton(a, e, n, t, s) {
    const i = this.player.createElement("button", e).addClasses([
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
    ]).appendTo(a);
    if (i.type = "button", i.addEventListener("focus", () => {
      this.scrollIntoView(i);
    }), i.addEventListener("keypress", (l) => {
      var p, c, r, o, h, u;
      l.key == "ArrowLeft" || (l.key == "ArrowRight" ? this.selectedSeason == ((p = this.player.playlistItem()) == null ? void 0 : p.season) ? (r = [...document.querySelectorAll("[id^=playlist-]")].filter((y) => getComputedStyle(y).display == "flex").at((((c = this.player.playlistItem()) == null ? void 0 : c.episode) ?? 0) - 1)) == null || r.focus() : (o = this.getClosestElement(i, "[id^=playlist-]")) == null || o.focus() : l.key == "ArrowUp" && !this.player.options.disableTouchControls ? (h = i.previousElementSibling) == null || h.focus() : l.key == "ArrowDown" && !this.player.options.disableTouchControls && ((u = i.nextElementSibling) == null || u.focus()));
    }), i.addEventListener("click", () => {
      t == null || t.bind(this)();
    }), s) {
      const l = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      l.setAttribute("viewBox", "0 0 24 24"), l.id = e, this.player.addClasses(l, [
        `${e}-icon`,
        ...s.classes,
        "svg-size",
        "h-5",
        "w-5",
        "pointer-events-none",
        "group-hover/button:scale-110",
        "duration-700"
      ]);
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", s.hover), l.appendChild(p), i.appendChild(l);
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
    ]).appendTo(i);
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
			`, i;
  }
  createTvLanguageMenuButton(a, e, n = !1) {
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
      "hover:bg-neutral-600/50",
      "transition-all",
      "duration-100",
      "outline-1",
      "outline-solid",
      "focus-visible:outline-2",
      "focus-visible:outline-white",
      "active:outline-white"
    ]).appendTo(a), s = this.createSVGElement(t, "checkmark", this.buttons.checkmark, !1, n);
    return this.player.addClasses(s, [
      "w-10",
      "opacity-0"
    ]), this.getLanguageButtonText(t, e), e.id > 1 ? s.classList.add("opacity-0") : s.classList.remove("opacity-0"), e.buttonType == "audio" ? (this.player.on("audioTrackChanging", (i) => {
      e.id === i.id ? s.classList.remove("opacity-0") : s.classList.add("opacity-0");
    }), t.addEventListener("click", (i) => {
      i.stopPropagation(), this.player.setCurrentAudioTrack(e.id);
    })) : e.buttonType == "subtitle" && (e.id === this.player.getCaptionIndex() ? s.classList.remove("opacity-0") : s.classList.add("opacity-0"), this.player.on("captionsChanged", (i) => {
      e.id === i.id ? s.classList.remove("opacity-0") : s.classList.add("opacity-0");
    }), t.addEventListener("click", (i) => {
      i.stopPropagation(), this.player.setCurrentCaption(e.id);
    })), t.addEventListener("keypress", (i) => {
      var d, l, p, c;
      i.key == "ArrowLeft" ? (d = this.player.getClosestElement(t, '[id^="audio-button-"]')) == null || d.focus() : i.key == "ArrowRight" ? (l = this.player.getClosestElement(t, '[id^="subtitle-button-"]')) == null || l.focus() : i.key == "ArrowUp" && !this.player.options.disableTouchControls ? (p = t.previousElementSibling) == null || p.focus() : i.key == "ArrowDown" && !this.player.options.disableTouchControls && ((c = t.nextElementSibling) == null || c.focus());
    }), t.addEventListener("focus", () => {
      setTimeout(() => {
        this.scrollCenter(a, t, {
          margin: 1
        });
      }, 0);
    }), t;
  }
  getVisibleButtons(a) {
    const e = a.parentElement, n = e == null ? void 0 : e.querySelectorAll("button");
    if (!n || (n == null ? void 0 : n.length) == 0)
      return;
    const t = [...n].filter((i) => i.style.display != "none"), s = t.findIndex((i) => i == a);
    return {
      visibleButtons: t,
      currentButtonIndex: s
    };
  }
  findPreviousVisibleButton(a) {
    const e = this.getVisibleButtons(a);
    if (!e)
      return;
    const { visibleButtons: n, currentButtonIndex: t } = e;
    for (let s = t; s >= 0; s--)
      return n[s - 1];
  }
  findNextVisibleButton(a) {
    const e = this.getVisibleButtons(a);
    if (!e)
      return;
    const { visibleButtons: n, currentButtonIndex: t } = e;
    for (let s = t; s < n.length; s++)
      return n[s + 1];
  }
  createImageContainer(a) {
    const e = this.player.createElement("div", "left-side-top").addClasses([
      "flex",
      "flex-col",
      "justify-center",
      "items-center",
      "w-available",
      "gap-2",
      "h-auto"
    ]).appendTo(a), n = this.player.createElement("div", "logo-container").addClasses([
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
    ]).appendTo(n), s = this.player.createElement("img", "logo").addClasses([
      "w-auto",
      "px-2",
      "py-2",
      "mr-auto",
      "object-fit",
      "h-auto",
      "max-w-[23rem]",
      "max-h-available",
      ""
    ]).appendTo(n), i = this.player.createElement("div", "left-side-top-overview").addClasses([
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
    ]).appendTo(i), l = this.player.createElement("span", "year-text").addClasses([
      "flex",
      "text-white",
      "text-sm",
      "font-bold",
      "mx-2"
    ]).appendTo(d), p = this.player.createElement("img", "rating-image").addClasses([
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
      var h, u, y, f, m, b;
      const r = (h = this.player.playlistItem()) == null ? void 0 : h.logo;
      !r || r == "" || r.includes("null") || r.includes("undefined") ? (t.textContent = T(((u = this.player.playlistItem()) == null ? void 0 : u.show) ?? ""), t.style.fontSize = `calc(110px / ${t.textContent.length} + 3ch)`, t.style.display = "flex", s.style.display = "none") : (s.style.display = "block", t.style.display = "none", r != null && r.startsWith("http") ? s.src = r : s.src = r && r != "" ? `${this.imageBaseUrl}${r}` : ""), l.innerHTML = ((f = (y = this.player.playlistItem()) == null ? void 0 : y.year) == null ? void 0 : f.toString()) ?? "", (m = this.player.playlistItem()) != null && m.year ? l.style.display = "flex" : l.style.display = "none", p.removeAttribute("src"), p.removeAttribute("alt"), p.style.opacity = "0", this.player.getPlaylist().length > 1 && (c.innerHTML = `${this.player.getPlaylist().length} ${this.player.localize("episodes")}`);
      const o = (b = this.player.playlistItem()) == null ? void 0 : b.rating;
      o && (p.src = `https://storage.nomercy.tv/laravel/kijkwijzer/${o.image}`, p.alt = o.rating.toString(), p.style.opacity = "1");
    }), e;
  }
  createTvButton(a, e, n, t, s) {
    const i = this.player.createElement("button", e).addClasses([
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
    ]).appendTo(a);
    if (i.type = "button", i.addEventListener("focus", () => {
      this.scrollCenter(a, i, {
        margin: 1
      });
    }), i.addEventListener("keypress", (l) => {
      var p, c, r;
      if (l.key == "ArrowUp" && !this.player.options.disableTouchControls)
        (p = this.findPreviousVisibleButton(i)) == null || p.focus();
      else if (l.key == "ArrowDown" && !this.player.options.disableTouchControls) {
        const o = this.findNextVisibleButton(i);
        o ? o == null || o.focus() : (r = (c = i.parentElement) == null ? void 0 : c.nextElementSibling) == null || r.focus();
      }
    }), i.addEventListener("click", t == null ? void 0 : t.bind(this.player)), s) {
      const l = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      l.setAttribute("viewBox", "0 0 24 24"), l.id = e, this.player.addClasses(l, [
        `${e}-icon`,
        ...s.classes,
        "svg-size",
        "h-5",
        "w-5",
        "pointer-events-none",
        "group-hover/button:scale-110",
        "duration-700"
      ]);
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", s.hover), l.appendChild(p), i.appendChild(l);
    }
    const d = this.player.createElement("span", `${e}-buttonText`).addClasses([
      "text-white",
      "text-sm",
      "font-bold",
      "mx-2",
      "flex",
      "justify-between"
    ]).appendTo(i);
    return d.innerHTML = this.player.localize(n), i;
  }
  createTvCurrentItem(a) {
    const e = this.player.createElement("div", "current-item-container").addClasses([
      "flex",
      "flex-col",
      "justify-end",
      "items-end",
      "gap-2"
    ]).appendTo(a), n = this.player.createElement("div", "current-item-show").addClasses([
      "text-white",
      "text-sm",
      "whitespace-pre",
      "font-bold"
    ]).appendTo(e), t = this.player.createElement("div", "current-item-title-container").addClasses([
      "flex",
      "flex-row",
      "gap-2"
    ]).appendTo(e), s = this.player.createElement("div", "current-item-episode").addClasses([]).appendTo(t), i = this.player.createElement("div", "current-item-title").addClasses([]).appendTo(t);
    return this.player.on("item", () => {
      var l, p;
      const d = this.player.playlistItem();
      n.innerHTML = T(d.show ?? ""), s.innerHTML = "", d.season && (s.innerHTML += `${this.player.localize("S")}${d.season}`), d.season && d.episode && (s.innerHTML += `: ${this.player.localize("E")}${d.episode}`), i.innerHTML = ((l = d.title) == null ? void 0 : l.replace(d.show ?? "", "").length) > 0 ? `"${(p = d.title) == null ? void 0 : p.replace(d.show ?? "", "").replace("%S", this.player.localize("S")).replace("%E", this.player.localize("E"))}"` : "";
    }), e;
  }
}
export {
  A as T
};
