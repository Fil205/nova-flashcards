import "clsx";
let _nextId = 0;
function uid() {
  return String(++_nextId);
}
class ToastStore {
  toasts = [];
  // Track pending auto-dismiss timers so manual remove() can cancel them
  timers = /* @__PURE__ */ new Map();
  add(variant, message, duration = 3500) {
    const toast = { id: uid(), variant, message, duration };
    this.toasts = [...this.toasts, toast];
    if (duration > 0) {
      const timer = setTimeout(() => this.remove(toast.id), duration);
      this.timers.set(toast.id, timer);
    }
  }
  remove(id) {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
  success(message, duration) {
    this.add("success", message, duration);
  }
  error(message, duration) {
    this.add("error", message, duration ?? 5e3);
  }
  warning(message, duration) {
    this.add("warning", message, duration);
  }
  info(message, duration) {
    this.add("info", message, duration);
  }
}
const toastStore = new ToastStore();
export {
  toastStore as t
};
