const TOKEN_KEY = 'setoran_access_token';
const REFRESH_KEY = 'setoran_refresh_token';
const USER_KEY = 'setoran_user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
};

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
};

export const login = async (username, password) => {
  const response = await fetch(
    `${import.meta.env.VITE_KC_URL}/realms/dev/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET,
        grant_type: 'password',
        username,
        password,
        scope: 'openid profile email'
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || 'Login failed');
  }

  const data = await response.json();
  setTokens(data.access_token, data.refresh_token);

  // Get user info
  const userResponse = await fetch(
    `${import.meta.env.VITE_KC_URL}/realms/dev/protocol/openid-connect/userinfo`,
    {
      headers: { Authorization: `Bearer ${data.access_token}` }
    }
  );

  if (userResponse.ok) {
    const userData = await userResponse.json();
    setUser(userData);
    return userData;
  }

  return { name: username };
};

export const logout = async () => {
  const idToken = localStorage.getItem('setoran_id_token');
  
  try {
    await fetch(
      `${import.meta.env.VITE_KC_URL}/realms/dev/protocol/openid-connect/logout`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: import.meta.env.VITE_CLIENT_ID,
          client_secret: import.meta.env.VITE_CLIENT_SECRET,
          id_token_hint: idToken || ''
        })
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuth();
  }
};