export async function sleep(ms: number): Promise<void> {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

export function setCookie(cname: string, cvalue: string) {
  const d = new Date();
  d.setTime(d.getTime() + 86400000);
  const expires = d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";expires=" + expires + ";path=/";
}

export function getCookie(cname: string) {
  const prefix = cname + "=";
  const cookie = decodeURIComponent(document.cookie)
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(prefix));
  return cookie ? cookie.slice(prefix.length) : "";
}

export function getAllCookies() {
  const cookies = decodeURIComponent(document.cookie)
    .split(";")
    .map((c) => c.trim());
  return cookies;
}
