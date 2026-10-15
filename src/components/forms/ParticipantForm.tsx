"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { categories } from "@/content/categories";
import { edition, formatINR } from "@/content/edition";
import { rasas } from "@/content/rasas";
import {
  STATUS_OPTIONS,
  participantSchema,
  participantSteps,
  validateUploads,
  type ParticipantInput,
} from "@/lib/schemas";
import { lenisRef } from "@/components/motion/SmoothScroll";
import { Arrow, Button } from "@/components/ui/Button";
import { CheckboxField, ChoiceGroup, SelectField, TextArea, TextField } from "./fields";
import { FileDrop } from "./FileDrop";
import { FormAlert } from "./FormAlert";
import { Stepper } from "./Stepper";
import { submitForm } from "./submit";
import { useFormDraft } from "./useFormDraft";

const DRAFT_KEY = "voiranantaa:participant-draft:v1";

export function ParticipantForm() {
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>();
  const [serverError, setServerError] = useState<string>();
  const preview = !edition.registrationOpen;

  const form = useForm<ParticipantInput>({
    resolver: zodResolver(participantSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      city: "",
      country: "India",
      institution: "",
      discipline: "",
      portfolio: "",
      artworkTitle: "",
      concept: "",
      rasas: [],
      materials: "",
      ratioExplanation: "",
      performance: "",
      studentFeeEligible: false,
    } as Partial<ParticipantInput> as ParticipantInput,
  });
  const {
    register,
    trigger,
    watch,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form;
  const { restored, clear } = useFormDraft(DRAFT_KEY, form);

  const status = watch("status");
  const studentFee = status === "student" && watch("studentFeeEligible") === true;
  const fee = studentFee ? edition.fees.student : edition.fees.others;
  const concept = watch("concept") ?? "";

  const goTo = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => {
      const top = (topRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 120;
      if (lenisRef.current) lenisRef.current.scrollTo(top, { duration: 0.8 });
      else window.scrollTo({ top });
      headingRef.current?.focus({ preventScroll: true });
    });
  };

  const checkFiles = () => {
    const err = validateUploads(files);
    setFileError(err ?? undefined);
    return !err;
  };

  const next = async () => {
    const fields = participantSteps[step].fields as unknown as FieldPath<ParticipantInput>[];
    const ok = await trigger(fields, { shouldFocus: true });
    const filesOk = step === 1 ? checkFiles() : true;
    if (ok && filesOk) goTo(step + 1);
  };

  const onValid = async (values: ParticipantInput) => {
    setServerError(undefined);
    if (!checkFiles()) return goTo(1);
    const body = new FormData();
    body.append("data", JSON.stringify(values));
    files.forEach((f) => body.append("files", f));
    const res = await submitForm("/api/participant", body);
    if (res.ok) {
      clear();
      const q = new URLSearchParams({
        ref: res.reference,
        fee: String(res.fee ?? fee),
        payment: String(res.paymentStatus ?? "pending"),
        ...(res.preview ? { preview: "1" } : {}),
      });
      router.push(`/confirmation/participant?${q}`);
      return;
    }
    setServerError(res.message);
    if (res.fieldErrors) {
      let firstStep = 2;
      for (const [name, msgs] of Object.entries(res.fieldErrors)) {
        if (name === "files") {
          setFileError(msgs?.[0]);
          firstStep = Math.min(firstStep, 1);
          continue;
        }
        setError(name as FieldPath<ParticipantInput>, { message: msgs?.[0] });
        const idx = participantSteps.findIndex((s) => (s.fields as readonly string[]).includes(name));
        if (idx >= 0) firstStep = Math.min(firstStep, idx);
      }
      goTo(firstStep);
    }
  };

  // Pressing a step button with the mouse would blur the active field and start
  // a competing on-blur validation that can restore stale errors. Keep focus put;
  // the step validation below moves focus to the first invalid field anyway.
  const keepFocus = (e: React.MouseEvent) => e.preventDefault();

  const onInvalid = (errs: Partial<Record<string, unknown>>) => {
    const idx = participantSteps.findIndex((s) => s.fields.some((f) => f in errs));
    if (idx >= 0 && idx !== step) goTo(idx);
  };

  return (
    <div ref={topRef} className="grid gap-10">
      <Stepper steps={participantSteps.map((s) => s.title)} current={step} />

      {preview && (
        <FormAlert
          tone="info"
          message={`Preview: registration opens ${edition.registrationOpensLabel.replace(/^First/, "in the first")}. You can explore the form now — submissions are saved as previews and no payment is taken.`}
        />
      )}
      {restored && step === 0 && <FormAlert tone="info" message="We restored your saved progress on this device." />}
      {serverError && <FormAlert message={serverError} />}

      <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate className="grid gap-10" aria-labelledby="step-heading">
        <h2 id="step-heading" ref={headingRef} tabIndex={-1} className="display-md outline-none">
          Step {String(step + 1).padStart(2, "0")} / {participantSteps[step].title}
        </h2>

        {/* ------------------------------------------------ STEP 01 */}
        <div hidden={step !== 0} className="grid gap-7">
          <div className="grid gap-7 sm:grid-cols-2">
            <TextField id="fullName" label="Full name" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
            <TextField id="email" label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
            <TextField
              id="phone"
              label="Phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <SelectField
              id="status"
              label="Status"
              options={STATUS_OPTIONS}
              error={errors.status?.message}
              {...register("status")}
            />
            <TextField id="city" label="City" autoComplete="address-level2" error={errors.city?.message} {...register("city")} />
            <TextField id="country" label="Country" autoComplete="country-name" error={errors.country?.message} {...register("country")} />
            <TextField
              id="discipline"
              label="Discipline"
              placeholder="e.g. costume design, sculpture, architecture"
              error={errors.discipline?.message}
              {...register("discipline")}
            />
            <TextField
              id="institution"
              label="Institution"
              optional
              hint="If you are a student or affiliated with a college or studio."
              error={errors.institution?.message}
              {...register("institution")}
            />
            <TextField
              id="portfolio"
              label="Portfolio link"
              type="url"
              optional
              placeholder="https://"
              error={errors.portfolio?.message}
              className="sm:col-span-2"
              {...register("portfolio")}
            />
          </div>
          <CheckboxField
            id="ageConfirmed"
            label={`I confirm I am ${edition.eligibility.minAge} or older.`}
            error={errors.ageConfirmed?.message}
            {...register("ageConfirmed")}
          />
        </div>

        {/* ------------------------------------------------ STEP 02 */}
        <div hidden={step !== 1} className="grid gap-9">
          <ChoiceGroup
            legend="Category"
            name="category"
            type="radio"
            error={errors.category?.message}
            inputProps={register("category")}
            options={categories.map((c) => ({ value: c.id, label: c.name, description: `${c.kicker} — ${c.summary}` }))}
          />
          <TextField id="artworkTitle" label="Artwork title" error={errors.artworkTitle?.message} {...register("artworkTitle")} />
          <TextArea
            id="concept"
            label="Concept statement"
            rows={6}
            hint={`What is the idea, and how does it respond to Infinite Raga? ${concept.length} / 2000`}
            error={errors.concept?.message}
            {...register("concept")}
          />
          <ChoiceGroup
            legend="Rasa explored"
            name="rasas"
            type="checkbox"
            hint="One rasa, or a considered relationship between several."
            columns="grid-cols-2 sm:grid-cols-3"
            error={errors.rasas?.message}
            inputProps={register("rasas")}
            options={rasas.map((r) => ({ value: r.id, label: r.name, description: r.feeling }))}
          />
          <TextArea
            id="materials"
            label="Materials proposed"
            rows={4}
            placeholder="Paper, metal, wire, wood, found objects, natural, recycled or experimental materials…"
            error={errors.materials?.message}
            {...register("materials")}
          />
          <TextArea
            id="ratioExplanation"
            label="95 / 5 explanation"
            rows={4}
            hint="How will at least 95% of the work be unconventional material, with no more than 5% textile or fabric?"
            error={errors.ratioExplanation?.message}
            {...register("ratioExplanation")}
          />
          <TextArea
            id="performance"
            label="Performance approach"
            rows={4}
            hint="How will the work come alive in five minutes? Movement, music, dance, theatre, light, sound, spoken word…"
            error={errors.performance?.message}
            {...register("performance")}
          />
          <FileDrop
            id="files"
            files={files}
            onChange={(f) => {
              setFiles(f);
              if (fileError) setFileError(validateUploads(f) ?? undefined);
            }}
            error={fileError}
          />
        </div>

        {/* ------------------------------------------------ STEP 03 */}
        <div hidden={step !== 2} className="grid gap-9">
          <fieldset className="grid gap-5">
            <legend className="mb-3 font-sans text-[0.8rem] font-medium uppercase tracking-[0.12em] text-paper">Declarations</legend>
            <CheckboxField
              id="originality"
              label="This work is my original idea, and the final piece will be 100% human-made — demonstrating my own authorship, making and intervention."
              error={errors.originality?.message}
              {...register("originality")}
            />
            <CheckboxField
              id="materialSafety"
              label="I accept the 95 / 5 material requirement and agree that materials, structures, wearable components, props and performance must meet the final safety rules."
              error={errors.materialSafety?.message}
              {...register("materialSafety")}
            />
            <CheckboxField
              id="terms"
              label={
                <>
                  I accept the{" "}
                  <Link href="/terms" target="_blank" className="text-blue-soft underline underline-offset-4">
                    terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/rules" target="_blank" className="text-blue-soft underline underline-offset-4">
                    participation rules
                  </Link>
                  , and understand that registration does not guarantee selection.
                </>
              }
              error={errors.terms?.message}
              {...register("terms")}
            />
            <CheckboxField
              id="privacy"
              label={
                <>
                  I have read the{" "}
                  <Link href="/privacy" target="_blank" className="text-blue-soft underline underline-offset-4">
                    privacy notice
                  </Link>{" "}
                  and agree to my details being used to process this application.
                </>
              }
              error={errors.privacy?.message}
              {...register("privacy")}
            />
            {status === "student" && (
              <CheckboxField
                id="studentFeeEligible"
                label="I am currently enrolled as a student and can provide valid student ID on request (student fee)."
                {...register("studentFeeEligible")}
              />
            )}
          </fieldset>

          <section aria-labelledby="payment-heading" className="glass relative overflow-hidden rounded-2xl p-6 sm:p-8">
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-green" />
            <h3 id="payment-heading" className="text-2xl">
              Payment
            </h3>
            <dl className="mt-6 grid gap-3 text-[0.95rem]">
              <div className="flex justify-between gap-4 border-b border-line pb-3">
                <dt className="text-mute">Application fee · {studentFee ? "Student" : "Others"}</dt>
                <dd className="font-medium text-paper">{formatINR(fee)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-mute">Payment status</dt>
                <dd className="text-paper">Pending</dd>
              </div>
            </dl>
            <p className="mt-5 text-sm text-mute">
              {preview
                ? "Secure online payment opens with registration. No payment is taken in this preview."
                : "Secure payment is not yet connected. Your application will be saved with payment pending, and we will email you a secure payment link and receipt."}
            </p>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={() => goTo(step - 1)}>
              ← Back
            </Button>
          ) : (
            <span className="text-sm text-mute">Progress is saved on this device as you type.</span>
          )}
          {step < participantSteps.length - 1 ? (
            <Button type="button" onMouseDown={keepFocus} onClick={next}>
              Continue <Arrow />
            </Button>
          ) : (
            <Button type="submit" onMouseDown={keepFocus} disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : preview ? "Submit preview application" : "Submit application"} <Arrow />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
