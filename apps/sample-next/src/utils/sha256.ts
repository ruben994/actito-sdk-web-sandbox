export async function sha256(data: string) {
  const msgBuffer = new TextEncoder().encode(data);

  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => ("00" + b.toString(16)).slice(-2)).join("");
}
