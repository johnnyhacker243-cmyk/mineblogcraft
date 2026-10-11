import { assets } from "../config/assets-config";
class AudioManager {
  volume = 0.5;
  muted = false;
  private audio: HTMLAudioElement | null = null;
  failed = false;
  private bookAudio: HTMLAudioElement | null = null;
  private lastBookSound = -Infinity;
  private bookFailed = false;
  book() {
    if (
      this.muted ||
      this.bookFailed ||
      performance.now() - this.lastBookSound < 600
    )
      return;
    this.lastBookSound = performance.now();
    try {
      this.bookAudio ??= new Audio("/assets/inventory/book-open.ogg");
      this.bookAudio.volume = this.volume * 0.35;
      this.bookAudio.currentTime = 0;
      void this.bookAudio.play().catch(() => {
        this.bookFailed = true;
      });
    } catch {
      this.bookFailed = true;
    }
  }
  setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value));
  }
  click() {
    if (!assets.sound || this.muted || this.failed) return;
    try {
      this.audio ??= new Audio(assets.sound);
      this.audio.volume = this.volume;
      this.audio.currentTime = 0;
      void this.audio.play().catch(() => {
        this.failed = true;
      });
    } catch {
      this.failed = true;
    }
  }
  dispose() {
    this.audio?.pause();
    this.audio = null;
    this.bookAudio?.pause();
    this.bookAudio = null;
  }
}
export const audioManager = new AudioManager();
