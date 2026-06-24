import "clsx";
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
class StudyStore {
  session = null;
  tutorHistory = [];
  tutorOpen = false;
  startSession(deckId, cards, mode) {
    const ids = cards.map((c) => c.id);
    const order = mode === "shuffle" ? shuffle(ids) : ids;
    this.session = {
      deckId,
      mode,
      cardOrder: order,
      currentIndex: 0,
      results: [],
      startedAt: Date.now()
    };
    this.tutorHistory = [];
    this.tutorOpen = false;
  }
  endSession() {
    this.session = null;
    this.tutorHistory = [];
    this.tutorOpen = false;
  }
  nextCard() {
    if (!this.session) return;
    this.session = { ...this.session, currentIndex: this.session.currentIndex + 1 };
    this.tutorHistory = [];
  }
  prevCard() {
    if (!this.session) return;
    const prev = Math.max(0, this.session.currentIndex - 1);
    this.session = { ...this.session, currentIndex: prev };
    this.tutorHistory = [];
  }
  recordResult(result) {
    if (!this.session) return;
    const cardId = this.session.cardOrder[this.session.currentIndex];
    const cardResult = { ...result, cardId };
    const existing = this.session.results.findIndex((r) => r.cardId === cardId);
    const results = existing >= 0 ? this.session.results.map((r, i) => i === existing ? cardResult : r) : [...this.session.results, cardResult];
    this.session = { ...this.session, results };
  }
  /**
   * Update only the AI feedback of an already-recorded result (by cardId).
   * Used when the streamed answer review completes, so revisits can reconstruct
   * the explanation without re-calling the AI.
   */
  setAiFeedback(cardId, feedback) {
    if (!this.session) return;
    const results = this.session.results.map((r) => r.cardId === cardId ? { ...r, aiFeedback: feedback } : r);
    this.session = { ...this.session, results };
  }
  addTutorMessage(msg) {
    this.tutorHistory = [...this.tutorHistory, msg];
  }
  setTutorOpen(open) {
    this.tutorOpen = open;
  }
  toggleTutor() {
    this.tutorOpen = !this.tutorOpen;
  }
  // ── Derived ─────────────────────────────────────────────────────────────
  get currentCardId() {
    if (!this.session) return null;
    return this.session.cardOrder[this.session.currentIndex] ?? null;
  }
  get isComplete() {
    if (!this.session) return false;
    return this.session.currentIndex >= this.session.cardOrder.length;
  }
  get totalCards() {
    return this.session?.cardOrder.length ?? 0;
  }
  get progress() {
    if (!this.totalCards) return 0;
    return this.session.currentIndex / this.totalCards;
  }
  computeSummary() {
    const results = this.session?.results ?? [];
    const answered = results.filter((r) => !r.skipped);
    const correct = results.filter((r) => r.verdict === "correct").length;
    const partial = results.filter((r) => r.verdict === "partial").length;
    const wrong = results.filter((r) => r.verdict === "wrong").length;
    const skipped = results.filter((r) => r.skipped).length;
    const score = answered.length === 0 ? 0 : answered.reduce(
      (acc, r) => {
        if (r.verdict === "correct") return acc + 1;
        if (r.verdict === "partial") return acc + 0.5;
        return acc;
      },
      0
    ) / answered.length;
    return { correct, partial, wrong, skipped, score, mastery: score };
  }
  getWrongCards() {
    return (this.session?.results ?? []).filter((r) => !r.skipped && r.verdict === "wrong").map((r) => r.cardId);
  }
  getKnownCards() {
    return (this.session?.results ?? []).filter((r) => !r.skipped && r.verdict === "correct").map((r) => r.cardId);
  }
}
const studyStore = new StudyStore();
function verdictLabel(verdict) {
  return { correct: "Corretto", partial: "Parziale", wrong: "Errato" }[verdict];
}
function verdictColor(verdict) {
  return {
    correct: "text-fc-success",
    partial: "text-fc-warning",
    wrong: "text-fc-danger"
  }[verdict];
}
export {
  verdictLabel as a,
  studyStore as s,
  verdictColor as v
};
