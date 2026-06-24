function toSpeechText(raw) {
  let s = raw;
  s = s.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").replace(/`([^`]*)`/g, "$1");
  s = s.replace(/\$\$([\s\S]*?)\$\$/g, " $1 ").replace(/\$([^$]*)\$/g, " $1 ");
  s = s.replace(/\\[a-zA-Z]+/g, " ").replace(/[{}^_\\]/g, " ");
  s = s.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1");
  s = s.replace(/[*_~#>|]/g, " ");
  return s.replace(/\s+/g, " ").trim();
}
function speak(text, lang, voiceURI, rate = 1, pitch = 1) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(toSpeechText(text));
  utt.lang = lang;
  utt.rate = rate;
  utt.pitch = pitch;
  if (voiceURI) {
    const voice = window.speechSynthesis.getVoices().find((v) => v.voiceURI === voiceURI);
    if (voice) utt.voice = voice;
  }
  window.speechSynthesis.speak(utt);
}
function stopTts() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
function isTtsSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
export {
  stopTts as a,
  isTtsSupported as i,
  speak as s
};
