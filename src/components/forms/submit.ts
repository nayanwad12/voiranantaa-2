import { STATIC_PREVIEW } from "@/lib/preview";

export type SubmitResult =
  | { ok: true; reference: string; [k: string]: unknown }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

/** POST to one of the form API routes and normalise the response. */
export async function submitForm(url: string, body: unknown | FormData): Promise<SubmitResult> {
  // Static preview has no server: inputs were already validated in the browser.
  if (STATIC_PREVIEW) return previewResult(url, body);
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

const PREFIX: Record<string, string> = {
  "/api/participant": "PREVIEW-VA01",
  "/api/partner": "PREVIEW-VA01-PT",
  "/api/visitor": "PREVIEW-VA01-V",
  "/api/contact": "PREVIEW-VA-C",
  "/api/newsletter": "PREVIEW-VA-N",
};

async function previewResult(url: string, body: unknown): Promise<SubmitResult> {
  await new Promise((r) => setTimeout(r, 500));
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const code = Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => alphabet[b % alphabet.length]).join("");
  const result: SubmitResult = { ok: true, reference: `${PREFIX[url] ?? "PREVIEW"}-${code}`, preview: true };
  if (url === "/api/participant" && body instanceof FormData) {
    try {
      const data = JSON.parse(String(body.get("data")));
      const student = data.status === "student" && data.studentFeeEligible === true;
      Object.assign(result, { fee: student ? 2000 : 3500, paymentStatus: "pending" });
    } catch {
      /* fee falls back to the form's own figure */
    }
  }
  return result;
}
