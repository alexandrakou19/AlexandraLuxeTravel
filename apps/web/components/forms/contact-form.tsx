"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, CircleNotch } from "@phosphor-icons/react"
import { useEffect, useRef, useState } from "react"
import { useForm, type FieldPath } from "react-hook-form"

import { submitContact } from "@/app/(site)/contact/actions"
import { track } from "@/lib/analytics"
import { contactSchema, type ContactValues } from "@/lib/inquiry/schema"
import { buttonVariants } from "@workspace/ui/components/button"

import { Field, Honeypot, TextArea, TextInput } from "./fields"
import { TurnstileField } from "./turnstile-field"

export function ContactForm({ replyTimePromise }: { replyTimePromise: string }) {
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const startedAt = useRef(0)
  const { register, handleSubmit, setValue, setError, reset, formState } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { name: "", email: "", message: "", company: "", startedAt: 0, turnstileToken: "" },
  })
  const { errors, isSubmitting } = formState

  useEffect(() => {
    startedAt.current = Date.now()
    setValue("startedAt", startedAt.current)
  }, [setValue])

  const onSubmit = handleSubmit(async (values) => {
    setMessage(null)
    try {
      const result = await submitContact({ ...values, startedAt: startedAt.current })
      if (result.ok) {
        track("contact_submit")
        setSent(true)
        reset()
        return
      }
      setMessage(result.message)
      for (const [k, m] of Object.entries(result.fieldErrors ?? {})) setError(k as FieldPath<ContactValues>, { message: m })
    } catch {
      setMessage("We couldn’t send your message. Please check your connection and try again.")
    }
  })

  if (sent) {
    return (
      <div role="status" className="py-6">
        <p className="display-3">Thank you. Your message is on its way.</p>
        <p className="mt-4 text-ink-soft">I’ll reply {replyTimePromise}. A confirmation is heading to your inbox now.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-8 text-[0.8rem] font-medium tracking-[0.16em] uppercase underline decoration-accent-line underline-offset-8">
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative grid gap-6">
      <Honeypot {...register("company")} />
      <Field label="Name" error={errors.name?.message}>
        {(a) => <TextInput id={a.id} aria-describedby={a.describedBy} aria-invalid={a.invalid} autoComplete="name" {...register("name")} />}
      </Field>
      <Field label="Email" error={errors.email?.message}>
        {(a) => <TextInput id={a.id} type="email" inputMode="email" aria-describedby={a.describedBy} aria-invalid={a.invalid} autoComplete="email" {...register("email")} />}
      </Field>
      <Field label="Message" error={errors.message?.message}>
        {(a) => <TextArea id={a.id} aria-describedby={a.describedBy} aria-invalid={a.invalid} {...register("message")} />}
      </Field>
      <TurnstileField onToken={(t) => setValue("turnstileToken", t)} />
      {message ? (
        <p role="alert" className="border border-destructive/40 bg-destructive/5 px-4 py-3 text-[0.95rem] text-destructive">
          {message}
        </p>
      ) : null}
      <div>
        <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className={buttonVariants({ size: "lg" })}>
          {isSubmitting ? (
            <>
              <CircleNotch weight="light" aria-hidden className="animate-spin" /> Sending
            </>
          ) : (
            <>
              Send message <ArrowRight weight="light" aria-hidden />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
