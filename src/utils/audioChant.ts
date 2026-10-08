/**
 * Web Audio API synthesizer for meditative sacred temple bells and harmonic acoustic ambience.
 * 100% self-contained, zero external network MP3 dependency.
 */

class TempleAudioService {
  private ctx: AudioContext | null = null;
  private isPlayingAmbience: boolean = false;
  private droneOscillators: OscillatorNode[] = [];
  private droneGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Plays a sacred high-resonance bronze temple bell chime (Ghanti).
   */
  public playTempleBell() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Fundamental frequencies of an authentic temple bell: 432Hz fundamental, plus 864Hz octave, 1296Hz chime
      const harmonics = [432, 864, 1296, 2160];
      const gains = [0.4, 0.25, 0.15, 0.08];

      harmonics.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Bell strike attack and long sustained decay
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(gains[idx], now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2 - (idx * 0.4));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 3.5);
      });
    } catch {
      // AudioContext policy gracefully handled
    }
  }

  /**
   * Toggles meditative harmonic warm tanpura / sacred drone background atmosphere
   */
  public toggleAmbience(): boolean {
    this.initCtx();
    if (!this.ctx) return false;

    if (this.isPlayingAmbience) {
      this.stopAmbience();
      return false;
    } else {
      this.startAmbience();
      return true;
    }
  }

  private startAmbience() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.08, now + 1.5);
    masterGain.connect(this.ctx.destination);
    this.droneGain = masterGain;

    // Sacred D-string tanpura drone frequencies: 146.83 Hz (D3), 220.00 Hz (A3), 293.66 Hz (D4)
    const notes = [146.83, 220.0, 293.66];
    this.droneOscillators = notes.map((freq) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Add gentle slow LFO vibrato
      const lfo = this.ctx!.createOscillator();
      lfo.frequency.setValueAtTime(0.2, now);
      const lfoGain = this.ctx!.createGain();
      lfoGain.gain.setValueAtTime(1.5, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);

      osc.connect(masterGain);
      osc.start(now);
      return osc;
    });

    this.isPlayingAmbience = true;
  }

  private stopAmbience() {
    if (!this.ctx || !this.droneGain) return;
    const now = this.ctx.currentTime;
    this.droneGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
    setTimeout(() => {
      this.droneOscillators.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      this.droneOscillators = [];
      this.isPlayingAmbience = false;
    }, 850);
  }

  public getIsPlaying(): boolean {
    return this.isPlayingAmbience;
  }
}

export const templeAudio = new TempleAudioService();
