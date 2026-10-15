"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnerTiers } from "@/content/partners";
import { partnerSchema, type PartnerInput } from "@/lib/schemas";
import { Arrow, Button } from "@/components/ui/Button";
import { CheckboxField, ChoiceGroup, TextArea, TextField } from "./fields";
import { FormAlert } from "./FormAlert";
import { submitForm } from "./submit";

export function PartnerForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PartnerInput>({
    resolver: zodResolver(partnerSchema),
    mode: "onTouched",
    defaultValues: { interest: [] } as Partial<PartnerInput> as PartnerInput,
  });

  const onValid = async (values: PartnerInput) => {
    setServerError(undefined);
    const res = await submitForm("/api/partner", values);
    if (res.ok) return router.push(`/confirmation/partner?ref=${encodeURIComponent(res.reference)}`);
    setServerError(res.message);
    Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => setError(k as FieldPath<PartnerInput>, { message: v?.[0] }));
  };

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate className="grid gap-8">
      {serverError && <FormAlert message={serverError} />}
      <div className="grid gap-7 sm:grid-cols-2">
        <TextField id="name" label="Name" autoComplete="name" error={errors.name?.message} {...register("name")} />
        <TextField id="organisation" label="Organisation" autoComplete="organization" error={errors.organisation?.message} {...register("organisation")} />
        <TextField id="role" label="Role" autoComplete="organization-title" error={errors.role?.message} {...register("role")} />
        <TextField id="workEmail" label="Work email" type="email" autoComplete="email" error={errors.workEmail?.message} {...register("workEmail")} />
        <TextField id="phone" label="Phone" type="tel" autoComplete="tel" error={errors.phone?.message} {...register("phone")} />
        <TextField id="website" label="Website" type="url" optional placeholder="https://" error={errors.website?.message} {...register("website")} />
      </div>
      <ChoiceGroup
        legend="Interest"
        name="interest"
        type="checkbox"
        hint="Choose any that apply."
        columns="sm:grid-cols-2 lg:grid-cols-3"
        error={errors.interest?.message}
        inputProps={register("interest")}
        options={partnerTiers.map((t) => ({ value: t.name, label: t.name, description: t.body }))}
      />
      <TextArea id="contribution" label="Proposed contribution" rows={4} error={errors.contribution?.message} {...register("contribution")} />
      <TextArea id="message" label="Message" optional rows={4} error={errors.message?.message} {...register("message")} />
      <CheckboxField
        id="consent"
        label={
          <>
            I agree to VOIRTALES contacting me about this enquiry, as described in the{" "}
            <Link href="/privacy" className="text-blue-soft underline underline-offset-4">
              privacy notice
            </Link>
            .
          </>
        }
        error={errors.consent?.message}
        {...register("consent")}
      />
      <div className="border-t border-line pt-8">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send enquiry"} <Arrow />
        </Button>
      </div>
    </form>
  );
}
