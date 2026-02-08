// ============================================
// SOUND SYSTEM - Web Audio API
// ============================================
let audioContext = null;
let backgroundMusicGain = null;
let sfxGain = null;
let backgroundMusicOscillators = [];

function initSoundSystem() {
    try {
        // Create Audio Context (lazy initialization)
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create gain nodes for volume control
            backgroundMusicGain = audioContext.createGain();
            backgroundMusicGain.connect(audioContext.destination);

            sfxGain = audioContext.createGain();
            sfxGain.connect(audioContext.destination);

            updateSoundVolume();
        }
    } catch (e) {
        console.warn('Web Audio API not supported:', e);
    }
}

async function resumeAudioContext() {
    if (!audioContext) {
        initSoundSystem();
    }
    if (audioContext && audioContext.state === 'suspended') {
        await audioContext.resume();
        console.log('AudioContext resumed successfully');
    }
}

function playSound(type) {
    if (!AppState.settings.sound) return;

    // Ensure context is initialized and resumed
    if (!audioContext) initSoundSystem();
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    if (!audioContext) return;

    try {
        switch (type) {
            case 'click':
                playClickSound();
                break;
            case 'success':
                playSuccessSound();
                break;
            case 'error':
                playErrorSound();
                break;
            case 'coin':
                playCoinSound();
                break;
            case 'gameEnd':
                playGameEndSound();
                break;
            case 'cardFlip':
                playCardFlipSound();
                break;
            default:
                playClickSound();
        }
    } catch (e) {
        console.warn('Sound playback error:', e);
    }
}

function playClickSound() {
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain);

    // Softer, plucky click
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
    osc.type = 'sine';

    filter.type = 'highpass';
    filter.frequency.value = 500;

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.05);
}

function playSuccessSound() {
    const now = audioContext.currentTime;

    // Sparkly ascending arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const g = audioContext.createGain();
        osc.connect(g);
        g.connect(sfxGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        g.gain.setValueAtTime(0, now + i * 0.05);
        g.gain.linearRampToValueAtTime(0.3, now + i * 0.05 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.2);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.2);
    });
}

function playErrorSound() {
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(sfxGain);

    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);
    osc.type = 'sawtooth';

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
}

function playCoinSound() {
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(sfxGain);

    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
    osc.type = 'triangle';

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
}

function playGameEndSound() {
    const now = audioContext.currentTime;

    // 1. Celebration "Pop" (Firecracker)
    for (let i = 0; i < 5; i++) {
        const time = now + (i * 0.25);

        // Background noise "burst"
        const bufferSize = audioContext.sampleRate * 0.1;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) data[j] = Math.random() * 2 - 1;

        const noise = audioContext.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();

        filter.type = 'bandpass';
        filter.frequency.value = 1000 + Math.random() * 2000;

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(sfxGain);

        noiseGain.gain.setValueAtTime(0.3, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        noise.start(time);
        noise.stop(time + 0.1);

        // Accompanying high "sparkle"
        const osc = audioContext.createOscillator();
        const oscGain = audioContext.createGain();
        osc.connect(oscGain);
        oscGain.connect(sfxGain);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(2000 + Math.random() * 1000, time);
        oscGain.gain.setValueAtTime(0.2, time);
        oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
        osc.start(time);
        osc.stop(time + 0.2);
    }

    // 2. Final Victory Chord
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(sfxGain);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const startTime = now + 1.25 + (index * 0.1);
        gain.gain.setValueAtTime(0.4, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);
        osc.start(startTime);
        osc.stop(startTime + 0.8);
    });
}

function playCardFlipSound() {
    const now = audioContext.currentTime;

    // Quick noise burst for "paper" feel + frequency sweep
    const bufferSize = audioContext.sampleRate * 0.05;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = audioContext.createGain();
    noise.connect(noiseGain);
    noiseGain.connect(sfxGain);

    noiseGain.gain.setValueAtTime(0.1, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    noise.start(now);
    osc.start(now);
    osc.stop(now + 0.1);
}

function startBackgroundMusic() {
    if (!AppState.settings.music || !audioContext || backgroundMusicOscillators.length > 0) return;

    try {
        // Soft, fun melodic sequence (C Major pentatonic)
        const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        let noteIndex = 0;

        function playSequence() {
            if (!AppState.settings.music) return;

            const now = audioContext.currentTime;

            // Play a soft pluck
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(backgroundMusicGain);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(notes[noteIndex], now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, now);
            filter.frequency.exponentialRampToValueAtTime(200, now + 0.4);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.03, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

            osc.start(now);
            osc.stop(now + 0.5);

            backgroundMusicOscillators.push(osc);

            // Cycle through notes with some randomness for 'fun' feel
            noteIndex = (noteIndex + Math.floor(Math.random() * 2) + 1) % notes.length;

            if (AppState.settings.music) {
                // Faster, rhythmic interval (approx 250ms per note)
                setTimeout(playSequence, 500 + Math.random() * 500);
            }
        }

        playSequence();
    } catch (e) {
        console.warn('Background music error:', e);
    }
}

function stopBackgroundMusic() {
    backgroundMusicOscillators.forEach(osc => {
        try {
            osc.stop();
        } catch (e) {
            // Oscillator might already be stopped
        }
    });
    backgroundMusicOscillators = [];
}

function updateSoundVolume() {
    if (!audioContext) return;

    const volume = AppState.settings.volume / 100;

    if (sfxGain) {
        sfxGain.gain.value = volume;
    }

    if (backgroundMusicGain) {
        backgroundMusicGain.gain.value = volume * 0.3; // Background music at 30% of main volume
    }
}
