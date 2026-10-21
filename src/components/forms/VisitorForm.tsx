"use client";

import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AUDIENCE_OPTIONS, visitorSchema, type VisitorInput } from "@/lib/schemas";
import { Arrow, Button } from "@/components/ui/Button";
import { Confirmation } from "./Confirmation";
import { CheckboxField, SelectField, TextArea, TextField } from "./fields";
import { FormAlert } from "./FormAlert";
import { submitForm } from "./submit";

export function VisitorForm() {
  const [done, setDone] = useState<string>();
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VisitorInput>({
    resolver: zodResolver(visitorSchema),
    mode: "onTouched",
    defaultValues: { partySize: 1, country: "India" } as Partial<VisitorInput> as VisitorInput,
  });

  const onValid = async (values: VisitorInput) => {
    setServerError(undefined);
    const res = await submitForm("/api/visitor", values);
    if (res.ok) return setDone(res.reference);
    setServerError(res.message);
    Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => setError(k as FieldPath<VisitorInput>, { message: v?.[0] }));
  };

  if (done) return <Confirmation kind="visitor" reference={done} onReset={() => setDone(undefined)} />;

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate className="grid gap-8">
      {serverError && <FormAlert message={serverError} />}
      <div className="grid gap-7 sm:grid-cols-2">
        <TextField id="name" label="Name" autoComplete="name" error={errors.name?.message} {...register("name")} />
        <TextField id="email" label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <TextField id="city" label="City" autoComplete="address-level2" error={errors.city?.message} {...register("city")} />
        <TextField id="country" label="Country" autoComplete="country-name" error={errors.country?.message} {...register("country")} />
        <TextField
          id="partySize"
          label="Intended party size"
          type="number"
          inputMode="numeric"
          min={1}
          max={6}
          hint="Including you. Up to 6."
          error={errors.partySize?.message}
          {...register("partySize")}
        />
        <SelectField id="audienceType" label="I am attending as" options={AUDIENCE_OPTIONS} error={errors.audienceType?.message} {...register("audienceType")} />
      </div>
      <TextArea
        id="accessibility"
        label="Accessibility needs"
        optional
        rows={3}
        hint="Tell us anything that would make your visit easier. We will follow up personally."
        error={errors.accessibility?.message}
        {...register("accessibility")}
      />
      <CheckboxField
        id="consent"
        label={
          <>
            Keep me updated about dates, venue and passes for Edition 01. See the{" "}
            privacy notice
            .
          </>
        }
        error={errors.consent?.message}
        {...register("consent")}
      />
      <div className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-mute">Registering interest does not guarantee entry.</p>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Register interest"} <Arrow />
        </Button>
      </div>
    </form>
  );
}
