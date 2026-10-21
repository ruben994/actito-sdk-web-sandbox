export function base64Encode(data: string): string {
  return self.btoa(data);
}

export function base64Decode(data: string): string {
  return self.atob(data);
}
