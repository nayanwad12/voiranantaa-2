import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/schemas";
import { badRequest, makeReference, persist, readJson, validationError } from "@/lib/api";

export async function POST(req: Request) {
  const body = await readJson(req);
  if (body === null) return badRequest("Expected JSON.");

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const reference = makeReference("VA-N");
  await persist("newsletter", { reference, ...parsed.data, receivedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true, reference });
}
