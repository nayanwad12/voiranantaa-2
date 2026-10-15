"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CONTACT_TOPICS, contactSchema } from "@/lib/schemas";
import { Arrow, Button } from "@/components/ui/Button";
import { CheckboxField, SelectField, TextArea, TextField } from "./fields";
import { FormAlert } from "./FormAlert";
import { submitForm } from "./submit";

type ContactInput = z.infer<typeof contactSchema>;

export function ContactForm({ defaultTopic }: { defaultTopic?: ContactInput["topic"] }) {
  const [done, setDone] = useState<string>();
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { topic: defaultTopic ?? "general" } as Partial<ContactInput> as ContactInput,
  });

  const onValid = async (values: ContactInput) => {
    setServerError(undefined);
    const res = await submitForm("/api/contact", values);
    if (res.ok) return setDone(res.reference);
    setServerError(res.message);
    Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => setError(k as FieldPath<ContactInput>, { message: v?.[0] }));
  };

  if (done) {
    return (
      <div role="status" className="glass rounded-2xl p-8">
        <p className="label mb-3">Message received</p>
        <p className="display-sm">Thank you. We&rsquo;ll reply by email.</p>
        <p className="mt-4 text-sm text-mute">Reference {done}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate className="grid gap-7">
      {serverError && <FormAlert message={serverError} />}
      <div className="grid gap-7 sm:grid-cols-2">
        <TextField id="c-name" label="Name" autoComplete="name" error={errors.name?.message} {...register("name")} />
        <TextField id="c-email" label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      </div>
      <SelectField id="c-topic" label="Topic" options={CONTACT_TOPICS} error={errors.topic?.message} {...register("topic")} />
      <TextArea id="c-message" label="Message" rows={5} error={errors.message?.message} {...register("message")} />
      <CheckboxField
        id="c-consent"
        label={
          <>
            I agree to being contacted about my message. See the{" "}
            <Link href="/privacy" className="text-blue-soft underline underline-offset-4">
              privacy notice
            </Link>
            .
          </>
        }
        error={errors.consent?.message}
        {...register("consent")}
      />
      <div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send message"} <Arrow />
        </Button>
      </div>
    </form>
  );
}
