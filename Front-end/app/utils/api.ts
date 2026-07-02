export const apiFetch = async (url: string, options: any = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const response = await fetch(`${apiUrl}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    console.warn("Sessão expirada ou não autorizada. Deslogando o usuário...");
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
  }

  return response;
};