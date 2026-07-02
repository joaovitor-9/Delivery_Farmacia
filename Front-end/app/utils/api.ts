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

  return response;
};