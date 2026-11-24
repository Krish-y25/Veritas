const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Sends an API request to the backend with automated Authorization header attachment,
 * dynamic body serialization (JSON vs FormData), and consistent error throwing.
 */
export async function apiRequest(path, options = {}) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = path.startsWith('http') ? path : `${BASE_URL}${cleanPath}`;

  const headers = { ...(options.headers || {}) };

  // Attach token from localStorage if available
  const token = localStorage.getItem('veritas_token');
  if (token && !headers.Authorization && !headers.authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  let requestBody = options.body;
  // Automatically serialize objects to JSON unless FormData
  if (!isFormData && requestBody && typeof requestBody === 'object' && !(requestBody instanceof Blob)) {
    headers['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(requestBody);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body: requestBody,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (isJson && data?.message) ||
      (isJson && data?.errors?.[0]?.message) ||
      response.statusText ||
      'Request failed';
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export default apiRequest;
