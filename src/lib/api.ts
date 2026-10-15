import { NextResponse } from "next/server";
import type { ZodError } from "zod";

/**
 * Stub persistence layer. Every submission is validated with the shared
 * schemas, then handed to `persist()`. Replace `persist()` with a database /
 * CRM / email-provider call — see README "Connecting the backend".
 */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function makeReference(prefix: string) {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const code = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `${prefix}-${code}`;
}

export function validationError(error: ZodError) {
  return NextResponse.json(
    {
      ok: false,
      message: "Some details need attention. Please check the highlighted fields.",
      fieldErrors: error.flatten().fieldErrors,
    },
    { status: 422 },
  );
}

export function badRequest(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function persist(kind: string, record: Record<string, unknown>) {
  // Intentionally logs only the kind + reference — never personal data.
  console.info(`[voiranantaa] ${kind} received`, { reference: record.reference });
}

export async function readJson(req: Request): Promise<unknown | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
