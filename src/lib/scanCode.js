export function orderCodeFromScan(value) {
  return String(value ?? '').match(/\bPSN-[A-Z0-9]{6}\b/i)?.[0].toUpperCase() ?? null
}
