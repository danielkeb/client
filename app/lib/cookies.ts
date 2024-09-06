export function getCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const value = `; `;
  const parts = document.cookie.split(value);

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].split("=");
    if (part[0].trim() === name) {
      return part[1].trim();
    }
  }

  return null;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function setCookie(name: string, value: string) {
  const expiresIn = new Date(Date.now() + 48 * 60 * 60 * 1000); // Expires in 2 day
  document.cookie = `${name}=${value}; expires=${expiresIn.toUTCString()}; Secure; path=/`;
}
