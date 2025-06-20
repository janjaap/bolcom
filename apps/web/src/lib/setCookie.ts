export const setCookie = (name: string, value: string, exdays: number, sameSite: string = 'strict') => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value};SameSite=${sameSite};${expires};path=/`;
};
