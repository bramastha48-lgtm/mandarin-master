// Text-to-Speech utility for Mandarin pronunciation
// Uses Web Speech API with Chinese voice

let voices = [];
let voicesLoaded = false;

function loadVoices() {
  return new Promise((resolve) => {
    voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      voicesLoaded = true;
      resolve(voices);
      return;
    }
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
      voicesLoaded = true;
      resolve(voices);
    };
    // Fallback timeout
    setTimeout(() => {
      voices = speechSynthesis.getVoices();
      resolve(voices);
    }, 2000);
  });
}

function getChineseVoice() {
  // Prefer Chinese voices
  const zhVoices = voices.filter(v =>
    v.lang.startsWith('zh') ||
    v.lang.startsWith('cmn') ||
    v.name.toLowerCase().includes('chinese') ||
    v.name.toLowerCase().includes('mandarin')
  );

  // Prefer female voices (usually smoother)
  const femaleVoice = zhVoices.find(v =>
    v.name.toLowerCase().includes('female') ||
    v.name.toLowerCase().includes('ting') ||
    v.name.toLowerCase().includes('mei') ||
    v.name.toLowerCase().includes('lili')
  );

  return femaleVoice || zhVoices[0] || voices[0] || null;
}

export async function initTTS() {
  await loadVoices();
  return getChineseVoice() !== null;
}

export function speak(text, rate = 0.85) {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getChineseVoice();

    if (voice) {
      utterance.voice = voice;
    }

    utterance.lang = 'zh-CN';
    utterance.rate = rate; // Slightly slower for clarity
    utterance.pitch = 1.05; // Slightly higher for warmth
    utterance.volume = 1;

    utterance.onend = resolve;
    utterance.onerror = (e) => {
      if (e.error === 'canceled') {
        resolve();
      } else {
        reject(e);
      }
    };

    speechSynthesis.speak(utterance);
  });
}

export function speakSlow(text) {
  return speak(text, 0.6);
}

export function speakFast(text) {
  return speak(text, 1.1);
}

export function stopSpeaking() {
  speechSynthesis.cancel();
}

export function isSupported() {
  return 'speechSynthesis' in window;
}
