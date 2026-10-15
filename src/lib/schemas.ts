import { z } from "zod";
import { rasas } from "@/content/rasas";
import { partnerInterestOptions } from "@/content/partners";

/**
 * Form schemas shared by the browser (react-hook-form) and the API routes.
 * One source of truth for every field and validation message.
 */

const required = (label: string) => z.string().trim().min(1, `${label} is required`);
const mustAccept = (msg: string) => z.literal(true, { errorMap: () => ({ message: msg }) });
const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || /^https?:\/\/\S+\.\S+/.test(v), "Enter a full link starting with https://");
const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number, including country code");

// ------------------------------------------------------------- participant

export const STATUS_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "professional", label: "Creative professional" },
  { value: "independent", label: "Independent practitioner" },
  { value: "other", label: "Other" },
] as const;

export const RASA_IDS = rasas.map((r) => r.id) as [string, ...string[]];

export const participantAboutSchema = z.object({
  fullName: required("Full name").min(2, "Enter your full name"),
  ageConfirmed: mustAccept("You must be 18 or older to participate"),
  email: z.string().trim().email("Enter a valid email address"),
  phone,
  city: required("City"),
  country: required("Country"),
  institution: z.string().trim().max(160).optional(),
  status: z.enum(["student", "professional", "independent", "other"], {
    errorMap: () => ({ message: "Choose the option that best describes you" }),
  }),
  discipline: required("Discipline").max(120),
  portfolio: optionalUrl,
});

export const participantWorkSchema = z.object({
  category: z.enum(["form", "voice"], { errorMap: () => ({ message: "Choose a category" }) }),
  artworkTitle: required("Artwork title").max(120),
  concept: z
    .string()
    .trim()
    .min(80, "Tell us a little more — at least 80 characters")
    .max(2000, "Keep it under 2,000 characters"),
  rasas: z.array(z.enum(RASA_IDS)).min(1, "Choose at least one rasa"),
  materials: z.string().trim().min(20, "List the materials you plan to use").max(1200),
  ratioExplanation: z
    .string()
    .trim()
    .min(40, "Explain how the work meets the 95 / 5 rule")
    .max(1200),
  performance: z
    .string()
    .trim()
    .min(40, "Describe how the work will come alive in five minutes")
    .max(1500),
});

export const participantCheckoutSchema = z.object({
  originality: mustAccept("Confirm the work is original and human-made"),
  materialSafety: mustAccept("Accept the material and safety requirements"),
  terms: mustAccept("Accept the terms and participation rules"),
  privacy: mustAccept("Acknowledge the privacy notice"),
  studentFeeEligible: z.boolean().optional(),
});

export const participantSchema = participantAboutSchema
  .merge(participantWorkSchema)
  .merge(participantCheckoutSchema);

export type ParticipantInput = z.infer<typeof participantSchema>;

export const participantSteps = [
  { id: "about", title: "About you", fields: Object.keys(participantAboutSchema.shape) },
  { id: "work", title: "Your work", fields: Object.keys(participantWorkSchema.shape) },
  { id: "checkout", title: "Checkout", fields: Object.keys(participantCheckoutSchema.shape) },
] as const;

// ------------------------------------------------------------- uploads

export const UPLOAD_RULES = {
  maxFiles: 5,
  maxBytes: 10 * 1024 * 1024,
  types: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
  accept: ".pdf,.jpg,.jpeg,.png,.webp",
  label: "PDF, JPG, PNG or WEBP · up to 10 MB each · max 5 files",
} as const;

export function validateUploads(files: { name: string; size: number; type: string }[]): string | null {
  if (files.length === 0) return "Add at least one proposal file (sketch, moodboard or concept PDF)";
  if (files.length > UPLOAD_RULES.maxFiles) return `Upload up to ${UPLOAD_RULES.maxFiles} files`;
  for (const f of files) {
    if (!(UPLOAD_RULES.types as readonly string[]).includes(f.type)) return `${f.name}: file type not accepted`;
    if (f.size > UPLOAD_RULES.maxBytes) return `${f.name}: larger than 10 MB`;
  }
  return null;
}

// ------------------------------------------------------------- partner

export const partnerSchema = z.object({
  name: required("Name"),
  organisation: required("Organisation"),
  role: required("Role"),
  workEmail: z.string().trim().email("Enter a valid work email"),
  phone,
  website: optionalUrl,
  interest: z
    .array(z.enum(partnerInterestOptions as [string, ...string[]]))
    .min(1, "Choose at least one area of interest"),
  contribution: z.string().trim().min(20, "Tell us what you would like to contribute").max(1500),
  message: z.string().trim().max(2000).optional(),
  consent: mustAccept("We need your consent to contact you"),
});
export type PartnerInput = z.infer<typeof partnerSchema>;

// ------------------------------------------------------------- visitor

export const AUDIENCE_OPTIONS = [
  { value: "public", label: "General audience" },
  { value: "student", label: "Student" },
  { value: "creative", label: "Designer / artist / creative professional" },
  { value: "industry", label: "Industry / brand" },
  { value: "press", label: "Press / media" },
] as const;

export const visitorSchema = z.object({
  name: required("Name"),
  email: z.string().trim().email("Enter a valid email address"),
  city: required("City"),
  country: required("Country"),
  partySize: z.coerce
    .number({ invalid_type_error: "Enter a number" })
    .int()
    .min(1, "At least 1")
    .max(6, "For groups larger than 6, please contact us"),
  audienceType: z.enum(["public", "student", "creative", "industry", "press"], {
    errorMap: () => ({ message: "Choose an audience type" }),
  }),
  accessibility: z.string().trim().max(800).optional(),
  consent: mustAccept("We need your consent to keep you updated"),
});
export type VisitorInput = z.infer<typeof visitorSchema>;

// ------------------------------------------------------------- newsletter / contact

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  consent: mustAccept("Please confirm you want to receive updates"),
});

export const CONTACT_TOPICS = [
  { value: "general", label: "General" },
  { value: "participants", label: "Participation" },
  { value: "partners", label: "Partnerships" },
  { value: "media", label: "Media enquiry" },
] as const;

export const contactSchema = z.object({
  name: required("Name"),
  email: z.string().trim().email("Enter a valid email address"),
  topic: z.enum(["general", "participants", "partners", "media"]),
  message: z.string().trim().min(10, "Tell us a little more").max(3000),
  consent: mustAccept("We need your consent to reply"),
});
