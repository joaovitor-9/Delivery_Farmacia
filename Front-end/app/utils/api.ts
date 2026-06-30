
export const apiFetch = async (url: string, options: any = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        ...options.headers,
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
    };

    const response = await fetch(`http://localhost:8000${url}`, {
        ...options,
        headers,
    });

    return response;
};