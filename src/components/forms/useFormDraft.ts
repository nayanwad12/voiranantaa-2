"use client";

import { useEffect, useRef, useState } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

/**
 * Saved progress: keeps a draft of the form in localStorage (this device
 * only) and restores it on return. Files are never stored.
 */
export function useFormDraft<T extends FieldValues>(key: string, form: UseFormReturn<T>) {
  const [restored, setRestored] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const saved = JSON.parse(raw) as { values: T; savedAt: number };
        form.reset({ ...form.getValues(), ...saved.values });
        setRestored(true);
      }
    } catch {
      /* storage unavailable — continue without drafts */
    }
  }, [key, form]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const sub = form.watch((values) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          window.localStorage.setItem(key, JSON.stringify({ values, savedAt: Date.now() }));
        } catch {
          /* ignore */
        }
      }, 400);
    });
    return () => {
      clearTimeout(timer);
      sub.unsubscribe();
    };
  }, [key, form]);

  const clear = () => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  };

  return { restored, clear };
}
