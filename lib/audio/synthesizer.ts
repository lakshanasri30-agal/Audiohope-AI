// Web Audio API Synthesizer Engine for AudioHope AI

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private pureToneOsc: OscillatorNode | null = null;
  private isPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Create White, Pink, or Brown noise audio buffer
  private createNoiseBuffer(type: 'white' | 'pink' | 'brown'): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext not initialized');
    const bufferSize = 5 * this.ctx.sampleRate; // 5 seconds loop
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11; // scale volume
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // scale volume
      }
    }
    return buffer;
  }

  // Play Sound Therapy Engine
  public startTherapy(soundType: string, volume: number = 65, frequencyHz: number = 4200) {
    this.stopTherapy();
    this.initContext();

    if (!this.ctx || !this.masterGain) return;

    this.setVolume(volume);

    // Create noise source
    let noiseKind: 'white' | 'pink' | 'brown' = 'pink';
    if (soundType === 'white') noiseKind = 'white';
    if (soundType === 'brown') noiseKind = 'brown';

    const noiseBuffer = this.createNoiseBuffer(noiseKind);
    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    // Filter setup
    this.filterNode = this.ctx.createBiquadFilter();

    if (soundType === 'notch_masking') {
      // Bandpass centered at patient's tinnitus frequency
      this.filterNode.type = 'bandpass';
      this.filterNode.frequency.value = frequencyHz;
      this.filterNode.Q.value = 4.0; // narrow bandwidth around target frequency
    } else if (soundType === 'ocean') {
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 600;

      // LFO for slow ocean waves effect
      this.lfoNode = this.ctx.createOscillator();
      this.lfoNode.frequency.value = 0.12; // 0.12 Hz wave cycle
      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.value = 400;

      this.lfoNode.connect(this.lfoGain);
      this.lfoGain.connect(this.filterNode.frequency);
      this.lfoNode.start();
    } else if (soundType === 'wind' || soundType === 'rain') {
      this.filterNode.type = 'bandpass';
      this.filterNode.frequency.value = soundType === 'rain' ? 2200 : 800;
      this.filterNode.Q.value = 1.2;
    } else {
      // Default lowpass filter for smooth ambient playback
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 8000;
    }

    this.noiseNode.connect(this.filterNode);
    this.filterNode.connect(this.masterGain);
    this.noiseNode.start();
    this.isPlaying = true;
  }

  // Play Pure Tone (for Frequency Matching Game & Audiometry)
  public playPureTone(frequencyHz: number, volume: number = 50) {
    this.stopPureTone();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.pureToneOsc = this.ctx.createOscillator();
    const toneGain = this.ctx.createGain();
    
    this.pureToneOsc.type = 'sine';
    this.pureToneOsc.frequency.setValueAtTime(frequencyHz, this.ctx.currentTime);
    
    toneGain.gain.setValueAtTime((volume / 100) * 0.3, this.ctx.currentTime);

    this.pureToneOsc.connect(toneGain);
    toneGain.connect(this.masterGain);
    this.pureToneOsc.start();
  }

  public stopPureTone() {
    if (this.pureToneOsc) {
      try {
        this.pureToneOsc.stop();
        this.pureToneOsc.disconnect();
      } catch {}
      this.pureToneOsc = null;
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      const targetGain = Math.max(0, Math.min(1, volume / 100));
      this.masterGain.gain.linearRampToValueAtTime(targetGain * 0.8, this.ctx.currentTime + 0.1);
    }
  }

  public setFrequency(freq: number) {
    if (this.filterNode && this.ctx) {
      this.filterNode.frequency.setValueAtTime(freq, this.ctx.currentTime);
    }
  }

  public stopTherapy() {
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch {}
      this.noiseNode = null;
    }
    if (this.lfoNode) {
      try {
        this.lfoNode.stop();
        this.lfoNode.disconnect();
      } catch {}
      this.lfoNode = null;
    }
    this.stopPureTone();
    this.isPlaying = false;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AudioEngine();
