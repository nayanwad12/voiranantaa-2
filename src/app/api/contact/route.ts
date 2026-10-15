import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas";
import { badRequest, makeReference, persist, readJson, validationError } from "@/lib/api";

export async function POST(req: Request) {
  const body = await readJson(req);
  if (body === null) return badRequest("Expected JSON.");

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const reference = makeReference("VA-C");
  await persist("contact", { reference, ...parsed.data, receivedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true, reference });
}
