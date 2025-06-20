export const getCookie = (name: string, cookies: string = document?.cookie) => {
  const keyValuePairs = cookies.split(';').reduce((acc: Record<string, string | undefined>, cookie: string) => {
    const [key, value] = cookie.split('=');
    acc[key.trim()] = value;

    return acc;
  }, {});

  return keyValuePairs[name];
};
