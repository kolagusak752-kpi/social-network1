export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: any) =>
    request<T>(url, { method: "POST", body: body }),
  patch: <T>(url: string, body: any) =>
    request<T>(url, { method: "PATCH", body: body }),
  postFormData: <T>(url: string, formData: FormData) =>
    request<T>(url, { method: "POST", body: formData }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};

function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData;
  return fetch(url, {
    ...options,
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    body: isFormData ? options.body : JSON.stringify(options.body),
    credentials: "include",
  })
    .then(async (res) => {
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message ?? res.statusText);
      return data;
    })
}
