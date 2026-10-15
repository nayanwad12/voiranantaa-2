export type SubmitResult =
  | { ok: true; reference: string; [k: string]: unknown }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

/** POST to one of the form API routes and normalise the response. */
export async function submitForm(url: string, body: unknown | FormData): Promise<SubmitResult> {
  try {
    const isForm = typeof FormData !== "undefined" && body instanceof FormData;
    const res = await fetch(url, {
      method: "POST",
      body: isForm ? (body as FormData) : JSON.stringify(body),
      headers: isForm ? undefined : { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) return data as SubmitResult;
    return {
      ok: false,
      message: data.message ?? "Something went wrong. Your details are still here — please try again.",
      fieldErrors: data.fieldErrors,
    };
  } catch {
    return { ok: false, message: "We couldn't reach the server. Check your connection and try again — nothing has been lost." };
  }
}
