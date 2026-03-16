export const API_BASE_URL = 'http://80.255.190.78';

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string | null;
}

export async function get<T = unknown>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      ...(options.headers ?? {}),
    },
    signal: options.signal,
  });

  return (await res.json()) as ApiResponse<T>;
}

export async function post<T = unknown, B = unknown>(
  path: string,
  body: B,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers ?? {}),
    },
    body: JSON.stringify(body),
    signal: options.signal,
  });

  return (await res.json()) as ApiResponse<T>;
}
