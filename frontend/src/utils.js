import Cookies from 'js-cookie';

export const getCurrentUser = () => {
  if (!Cookies.get('auth-token')) {
    return;
  }

  const token = Cookies.get('auth-token');
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (err) {
    console.error(`Can't parse token:`, token);
    Cookies.remove('auth-token');
  }
};

export const storeToken = token => Cookies.set('auth-token', token, { expires: 30 });

export const hash = password => crypto.subtle
  .digest('SHA-256', new TextEncoder().encode(password))
  .then(buff => [].map.call(new Uint8Array(buff),
    v => v.toString(16).padStart(2, '0')).join('')
  );