"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight, CircleNotch } from "@phosphor-icons/react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useForm, useWatch, type FieldPath, type Resolver } from "react-hook-form"

import { submitInquiry } from "@/app/(site)/inquire/actions"
import { useLenis } from "@/components/motion/smooth-scroll"
import { track } from "@/lib/analytics"
import {
  accommodationOptions,
  contactMethodOptions,
  heardFromOptions,
  inquiryDefaults,
  interestOptions,
  paceOptions,
  stepSchemas,
  stepTitles,
  tripTypeOptions,
  tripTypeValues,
  type InquiryValues,
} from "@/lib/inquiry/schema"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { CheckboxRow, ChoiceChips, Field, Honeypot, Select, TextArea, TextInput } from "./fields"
import { TurnstileField } from "./turnstile-field"

const stepFieldPrefixes: (keyof InquiryValues)[][] = [
  ["firstName", "lastName", "email", "phone", "contactMethod", "basedIn"],
  ["tripType", "destination", "helpDeciding", "dateFrom", "dateTo", "flexibleDates", "approxMonth", "nights", "adults", "children", "childAges", "occasion"],
  ["budget", "accommodation", "pace", "interests", "heardFrom", "notes", "consent"],
]

const ease = [0.16, 1, 0.3, 1] as const

export function InquiryForm({
  budgetRanges,
  destinationNames,
}: {
  budgetRanges: string[]
  /** slug -> display name, for ?destination= prefill */
  destinationNames: Record<string, string>
}) {
  const router = useRouter()
  const lenis = useLenis()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [serverMessage, setServerMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const stepRef = useRef(0)
  const started = useRef(false)
  const startedAt = useRef(0)
  const top = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)

  // Each step validates only its own schema; the server validates everything again.
  const resolver: Resolver<InquiryValues> = (values, ctx, opts) =>
    (zodResolver(stepSchemas[stepRef.current] as never) as unknown as Resolver<InquiryValues>)(values, ctx, opts)

  const form = useForm<InquiryValues>({ defaultValues: inquiryDefaults, resolver, mode: "onSubmit", reValidateMode: "onChange", shouldFocusError: true })
  const { register, handleSubmit, reset, setValue, setError, control, formState } = form
  const { errors } = formState

  // Prefill from ?trip= and ?destination= (read after mount so the form itself prerenders statically).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    startedAt.current = Date.now()
    const trip = params.get("trip")
    if (trip && tripTypeValues.includes(trip)) setValue("tripType", trip)
    const dest = params.get("destination")
    if (dest) setValue("destination", destinationNames[dest] ?? dest.replace(/-/g, " ").slice(0, 120))
  }, [setValue, destinationNames])

  const children = Number(useWatch({ control, name: "children" })) || 0
  const flexible = useWatch({ control, name: "flexibleDates" })
  const dateFrom = useWatch({ control, name: "dateFrom" })
  const today = new Date().toISOString().slice(0, 10)

  const goTo = (next: number) => {
    setDirection(next > stepRef.current ? 1 : -1)
    stepRef.current = next
    setStep(next)
    setServerMessage(null)
    requestAnimationFrame(() => {
      if (top.current) {
        const y = top.current.getBoundingClientRect().top + window.scrollY - 110
        if (lenis) lenis.scrollTo(y, { duration: 0.9 })
        else window.scrollTo({ top: y })
      }
      window.setTimeout(() => heading.current?.focus({ preventScroll: true }), 450)
    })
  }

  const onStart = () => {
    if (started.current) return
    started.current = true
    track("inquiry_start")
  }

  const onSubmit = handleSubmit(async (values) => {
    // Steps 1–2: the step schema passed, so move on (and reset "submitted" so the next step starts quiet).
    if (stepRef.current < 2) {
      track("inquiry_step", { step: stepRef.current + 1 })
      reset(form.getValues(), { keepDefaultValues: true })
      goTo(stepRef.current + 1)
      return
    }
    if (submitting) return
    setSubmitting(true)
    setServerMessage(null)
    try {
      // Send every answer (the resolver output only holds the final step's fields).
      const all = { ...form.getValues(), ...values }
      const result = await submitInquiry({ ...all, startedAt: startedAt.current })
      if (result.ok) {
        track("inquiry_step", { step: 3 })
        try {
          sessionStorage.setItem("inquiry-first-name", all.firstName)
        } catch {}
        router.push("/inquire/thank-you")
        return
      }
      setServerMessage(result.message)
      if (result.fieldErrors) {
        const keys = Object.keys(result.fieldErrors)
        const firstStep = stepFieldPrefixes.findIndex((fields) => keys.some((k) => fields.includes(k.split(".")[0] as keyof InquiryValues)))
        for (const [k, message] of Object.entries(result.fieldErrors)) setError(k as FieldPath<InquiryValues>, { message })
        if (firstStep >= 0 && firstStep !== stepRef.current) goTo(firstStep)
      }
      setSubmitting(false)
    } catch {
      setServerMessage("We couldn’t send your inquiry. Please check your connection and try again.")
      setSubmitting(false)
    }
  })

  return (
    <div ref={top} className="scroll-mt-28">
      {/* Progress */}
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[0.8rem] font-medium tracking-[0.18em] uppercase" aria-live="polite">
          Step {step + 1} of 3 <span className="text-ink-soft">· {stepTitles[step]}</span>
        </p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2" aria-hidden>
        {stepTitles.map((t, i) => (
          <span key={t} className="relative h-px overflow-hidden bg-foreground/15">
            <span
              className="absolute inset-0 origin-left bg-foreground transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `scaleX(${i <= step ? 1 : 0})` }}
            />
          </span>
        ))}
      </div>

      <form noValidate onSubmit={onSubmit} onFocusCapture={onStart} className="relative mt-10">
        <Honeypot {...register("company")} />

        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.fieldset
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -28 }}
            transition={{ duration: 0.55, ease }}
            className="min-w-0"
          >
            <legend className="sr-only">{stepTitles[step]}</legend>
            <h2 ref={heading} tabIndex={-1} className="display-3 outline-none">
              {step === 0 && "First, a little about you"}
              {step === 1 && "Now, the trip you’re dreaming of"}
              {step === 2 && "Finally, how you like to travel"}
            </h2>

            {step === 0 ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <Field label="First name" error={errors.firstName?.message}>
                  {(a) => <TextInput id={a.id} aria-describedby={a.describedBy} aria-invalid={a.invalid} autoComplete="given-name" {...register("firstName")} />}
                </Field>
                <Field label="Last name" error={errors.lastName?.message}>
                  {(a) => <TextInput id={a.id} aria-describedby={a.describedBy} aria-invalid={a.invalid} autoComplete="family-name" {...register("lastName")} />}
                </Field>
                <Field label="Email" error={errors.email?.message} className="sm:col-span-2">
                  {(a) => (
                    <TextInput id={a.id} type="email" inputMode="email" aria-describedby={a.describedBy} aria-invalid={a.invalid} autoComplete="email" {...register("email")} />
                  )}
                </Field>
                <Field label="Phone" optional error={errors.phone?.message}>
                  {(a) => <TextInput id={a.id} type="tel" inputMode="tel" aria-describedby={a.describedBy} aria-invalid={a.invalid} autoComplete="tel" {...register("phone")} />}
                </Field>
                <Field label="Preferred contact method" optional>
                  {(a) => (
                    <Select id={a.id} {...register("contactMethod")}>
                      <option value="">No preference</option>
                      {contactMethodOptions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </Select>
                  )}
                </Field>
                <Field label="Where are you based?" optional hint="City and country" error={errors.basedIn?.message} className="sm:col-span-2">
                  {(a) => <TextInput id={a.id} aria-describedby={a.describedBy} autoComplete="address-level2" {...register("basedIn")} />}
                </Field>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <Field label="Trip type" error={errors.tripType?.message} className="sm:col-span-2">
                  {(a) => (
                    <Select id={a.id} aria-describedby={a.describedBy} aria-invalid={a.invalid} {...register("tripType")}>
                      <option value="">Choose one</option>
                      {tripTypeOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Destination(s) in mind" error={errors.destination?.message} hint="A country, a region, or a few ideas.">
                    {(a) => <TextInput id={a.id} aria-describedby={a.describedBy} aria-invalid={a.invalid} {...register("destination")} />}
                  </Field>
                  <CheckboxRow className="mt-2" label="I’d love help deciding" {...register("helpDeciding")} />
                </div>

                <div className="sm:col-span-2">
                  <CheckboxRow label="My dates are flexible" {...register("flexibleDates")} />
                </div>
                {flexible ? (
                  <Field label="Approximate month" hint="For example: June 2027, or late spring" error={errors.approxMonth?.message} className="sm:col-span-2">
                    {(a) => <TextInput id={a.id} aria-describedby={a.describedBy} aria-invalid={a.invalid} {...register("approxMonth")} />}
                  </Field>
                ) : (
                  <>
                    <Field label="Departure date" error={errors.dateFrom?.message}>
                      {(a) => <TextInput id={a.id} type="date" min={today} aria-describedby={a.describedBy} aria-invalid={a.invalid} {...register("dateFrom")} />}
                    </Field>
                    <Field label="Return date" error={errors.dateTo?.message}>
                      {(a) => (
                        <TextInput id={a.id} type="date" min={dateFrom || today} aria-describedby={a.describedBy} aria-invalid={a.invalid} {...register("dateTo")} />
                      )}
                    </Field>
                  </>
                )}

                <Field label="Trip length" optional hint="Number of nights" error={errors.nights?.message}>
                  {(a) => <TextInput id={a.id} type="number" inputMode="numeric" min={1} aria-describedby={a.describedBy} aria-invalid={a.invalid} {...register("nights")} />}
                </Field>
                <Field label="Occasion" optional hint="Birthday, anniversary, honeymoon…" error={errors.occasion?.message}>
                  {(a) => <TextInput id={a.id} aria-describedby={a.describedBy} {...register("occasion")} />}
                </Field>
                <Field label="Number of adults" error={errors.adults?.message}>
                  {(a) => <TextInput id={a.id} type="number" inputMode="numeric" min={1} aria-describedby={a.describedBy} aria-invalid={a.invalid} {...register("adults")} />}
                </Field>
                <Field label="Number of children" error={errors.children?.message}>
                  {(a) => <TextInput id={a.id} type="number" inputMode="numeric" min={0} aria-describedby={a.describedBy} aria-invalid={a.invalid} {...register("children")} />}
                </Field>

                <AnimatePresence initial={false}>
                  {children > 0 ? (
                    <motion.fieldset
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5, ease }}
                      className="overflow-hidden sm:col-span-2"
                    >
                      <legend className="text-[0.9rem] font-medium">Children’s ages</legend>
                      <div className="mt-3 flex flex-wrap gap-3 pb-1">
                        {Array.from({ length: Math.min(children, 20) }, (_, i) => (
                          <div key={i} className="flex flex-col gap-1">
                            <label htmlFor={`child-age-${i}`} className="text-[0.8rem] text-ink-soft">
                              Child {i + 1}
                            </label>
                            <TextInput
                              id={`child-age-${i}`}
                              type="number"
                              inputMode="numeric"
                              min={0}
                              max={17}
                              aria-invalid={Boolean(errors.childAges?.[i])}
                              className="w-20 text-center"
                              {...register(`childAges.${i}` as const)}
                            />
                            {errors.childAges?.[i] ? (
                              <span role="alert" className="text-[0.75rem] text-destructive">
                                {errors.childAges[i]?.message}
                              </span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </motion.fieldset>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="mt-8 grid gap-8">
                <Field label="Budget range" hint="Total for the trip, excluding flights if you prefer." error={errors.budget?.message}>
                  {(a) => (
                    <Select id={a.id} aria-describedby={a.describedBy} aria-invalid={a.invalid} {...register("budget")}>
                      <option value="">Choose a range</option>
                      {budgetRanges.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </Select>
                  )}
                </Field>
                <ChoiceChips legend="Accommodation style" optional name="accommodation" options={accommodationOptions} register={(n) => register(n as "accommodation")} />
                <ChoiceChips legend="Travel pace" optional type="radio" name="pace" options={paceOptions} register={(n) => register(n as "pace")} />
                <ChoiceChips legend="Interests" optional name="interests" options={interestOptions} register={(n) => register(n as "interests")} />
                <Field label="How did you hear about us?" optional>
                  {(a) => (
                    <Select id={a.id} {...register("heardFrom")}>
                      <option value="">Choose one</option>
                      {heardFromOptions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </Select>
                  )}
                </Field>
                <Field label="Anything else I should know?" optional error={errors.notes?.message}>
                  {(a) => (
                    <TextArea
                      id={a.id}
                      aria-describedby={a.describedBy}
                      placeholder="Dream experiences, must-haves, dietary needs, mobility, celebrations…"
                      {...register("notes")}
                    />
                  )}
                </Field>
                <CheckboxRow
                  error={errors.consent?.message}
                  label={
                    <>
                      I agree to the{" "}
                      <Link href="/privacy" target="_blank" className="underline decoration-accent-line underline-offset-4">
                        privacy policy
                      </Link>{" "}
                      and to being contacted about my trip.
                    </>
                  }
                  {...register("consent")}
                />
                <TurnstileField onToken={(t) => setValue("turnstileToken", t)} />
              </div>
            ) : null}
          </motion.fieldset>
        </AnimatePresence>

        {serverMessage ? (
          <p role="alert" className="mt-8 border border-destructive/40 bg-destructive/5 px-4 py-3 text-[0.95rem] text-destructive">
            {serverMessage}
          </p>
        ) : null}

        <div className="mt-12 flex items-center justify-between gap-4 border-t border-hairline pt-8">
          {step > 0 ? (
            <button type="button" onClick={() => goTo(step - 1)} className={cn(buttonVariants({ variant: "ghost" }), "-ml-4 px-4")}>
              <ArrowLeft weight="light" aria-hidden />
              Back
            </button>
          ) : (
            <span />
          )}
          <button type="submit" disabled={submitting} aria-busy={submitting} className={buttonVariants({ size: "lg" })}>
            {step < 2 ? (
              <>
                Continue <ArrowRight weight="light" aria-hidden />
              </>
            ) : submitting ? (
              <>
                <CircleNotch weight="light" aria-hidden className="animate-spin" /> Sending
              </>
            ) : (
              <>
                Send inquiry <ArrowRight weight="light" aria-hidden />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
