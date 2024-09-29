import { P as l } from "./plugin.js";
class c extends l {
  initialize(e) {
    this.player = e;
  }
  use() {
    this.player.options.disableControls || (document.removeEventListener("keypress", this.keyHandler.bind(this), !1), document.addEventListener("keypress", this.keyHandler.bind(this), !1));
  }
  dispose() {
    document.removeEventListener("keypress", this.keyHandler.bind(this), !1);
  }
  /**
      * Handles keyboard events and executes the corresponding function based on the key binding.
      * @param {KeyboardEvent} event - The keyboard event to handle.
      */
  keyHandler(e) {
    var n, i;
    if (((n = document.activeElement) == null ? void 0 : n.nodeName) == "INPUT")
      return;
    const t = this.keyBindings();
    let a = !1;
    this.player.getElement().getBoundingClientRect().width != 0 && (!a && this.player && (a = !0, t.some((o) => o.key === e.key && o.control === e.ctrlKey) && (e.preventDefault(), (i = t.find((o) => o.key === e.key && o.control === e.ctrlKey)) == null || i.function())), setTimeout(() => {
      a = !1;
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
        key: "5",
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
export {
  c as K
};
