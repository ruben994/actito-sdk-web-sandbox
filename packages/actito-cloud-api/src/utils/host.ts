export function ensureHostHttpPrefix(host: string) {
  return host.startsWith('http://') || host.startsWith('https://') ? host : `https://${host}`;
}
