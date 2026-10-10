import { assets } from "../config/assets-config";
class AudioManager {
  volume = 0.5;
  muted = false;
  private audio: HTMLAudioElement | null = null;
  failed = false;
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
  }
}
export const audioManager = new AudioManager();
