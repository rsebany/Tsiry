/**
 * Gestionnaire d'AudioContext unique pour éviter de multiplier les instances.
 */
let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
};

// Écouteur global : débloque l'AudioContext dès la première interaction sur la page
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        console.log("🔊 Web Audio débloqué par l'utilisateur.");
      });
    }
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };

  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
}

/**
 * Génère un signal sonore synthétique d'urgence médicale via l'API Web Audio native.
 * @param {'ROUGE' | 'ORANGE'} niveau
 */
export const playEmergencySound = async (niveau = 'ROUGE') => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Si l'audio est suspendu par le navigateur, on tente de le relancer
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const isRouge = niveau === 'ROUGE';

    // ROUGE = 3 bips stridents répétitifs / ORANGE = 2 bips modérés
    const beepCount = isRouge ? 3 : 2;
    const frequency = isRouge ? 880 : 660; // Fréquence Hz (Note A5 / E5)

    for (let i = 0; i < beepCount; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isRouge ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      const startTime = ctx.currentTime + i * 0.22;
      const stopTime = startTime + 0.15;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, stopTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(stopTime);
    }
  } catch (err) {
    console.warn("L'alerte sonore n'a pas pu être jouée :", err);
  }
};