import { NextResponse } from "next/server";
import { partnerSchema } from "@/lib/schemas";
import { badRequest, makeReference, persist, readJson, validationError } from "@/lib/api";

export async function POST(req: Request) {
  const body = await readJson(req);
  if (body === null) return badRequest("Expected JSON.");

  const parsed = partnerSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const reference = makeReference("VA01-PT");
  await persist("partner", { reference, ...parsed.data, receivedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true, reference });
}
