export function initializeLocalStorage(
  key: string,
  state: Record<string, unknown>,
): void {
  localStorage.setItem(key, JSON.stringify(state))
}

export function readLocalStoage(key: string): Record<string, unknown> {
  return JSON.parse(localStorage.getItem(key) ?? '{}')
}
