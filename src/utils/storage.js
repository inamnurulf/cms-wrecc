export function getItem(key) {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(key); } catch { return null; }
}
export function setItem(key, val) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, val ?? ""); } catch {}
}
export function removeItem(key) {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem(key); } catch {}
}
