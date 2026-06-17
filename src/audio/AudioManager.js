export class AudioManager {
  constructor() {
    this.ctx = new AudioContext();
  }

  _playTone(frequency, duration, type = "sine", volume = 0.3) {
    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.ctx.currentTime + duration,
    );

    oscillator.start(this.ctx.currentTime);
    oscillator.stop(this.ctx.currentTime + duration);
  }

  playSpin() {
    this._playTone(440, 0.15, "sine", 0.1);
  }

  playTick() {
    this._playTone(300, 0.05, "square", 0.15);
  }

  playWin() {
    this._playTone(523, 0.3, "sine", 0.3);
    setTimeout(() => this._playTone(659, 0.3, "sine", 0.3), 100);
    setTimeout(() => this._playTone(784, 0.5, "sine", 0.3), 200);
  }

  playLose() {
    this._playTone(200, 0.3, "sawtooth", 0.2);
    setTimeout(() => this._playTone(150, 0.4, "sawtooth", 0.2), 200);
  }
}
