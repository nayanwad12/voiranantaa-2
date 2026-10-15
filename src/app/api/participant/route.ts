import { NextResponse } from "next/server";
import { edition } from "@/content/edition";
import { participantSchema, validateUploads } from "@/lib/schemas";
import { badRequest, makeReference, persist, validationError } from "@/lib/api";

/**
 * Participant application (multipart: `data` JSON + `files[]`).
 * Payment is not connected yet: applications are recorded with
 * paymentStatus "pending" and, while registration is closed, flagged as preview.
 */
export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return badRequest("Expected a multipart form submission.");
  }

  let data: unknown;
  try {
    data = JSON.parse(String(form.get("data") ?? ""));
  } catch {
    return badRequest("Missing application details.");
  }

  const parsed = participantSchema.safeParse(data);
  if (!parsed.success) return validationError(parsed.error);

  const files = form.getAll("files").filter((f): f is File => typeof f === "object" && f !== null && "size" in f);
  const uploadError = validateUploads(files.map((f) => ({ name: f.name, size: f.size, type: f.type })));
  if (uploadError) {
    return NextResponse.json({ ok: false, message: uploadError, fieldErrors: { files: [uploadError] } }, { status: 422 });
  }

  const input = parsed.data;
  const studentFee = input.status === "student" && input.studentFeeEligible === true;
  const fee = studentFee ? edition.fees.student : edition.fees.others;
  const preview = !edition.registrationOpen;
  const reference = makeReference(preview ? "PREVIEW-VA01" : "VA01");

  await persist("participant", {
    reference,
    ...input,
    fee,
    feeType: studentFee ? "student" : "others",
    files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
    paymentStatus: "pending",
    preview,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    reference,
    fee,
    feeType: studentFee ? "student" : "others",
    paymentStatus: "pending",
    preview,
  });
}
