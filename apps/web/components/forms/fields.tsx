"use client"

import { CaretDown, Check } from "@phosphor-icons/react"
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react"

import { cn } from "@workspace/ui/lib/utils"

const control =
  "w-full rounded-[2px] border border-input bg-field px-4 text-[1rem] text-foreground transition-[border-color,box-shadow] duration-300 outline-none placeholder:text-ink-soft/70 hover:border-ink-soft focus:border-foreground focus:ring-2 focus:ring-ring/45 aria-[invalid=true]:border-destructive disabled:opacity-60"

type FieldProps = {
  label: ReactNode
  hint?: ReactNode
  error?: string
  optional?: boolean
  className?: string
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
}

/** Label above, control, helper text, then the error (announced to screen readers). */
export function Field({ label, hint, error, optional, className, children }: FieldProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-[0.9rem] font-medium">
        {label}
        {optional ? <span className="ml-2 font-normal text-ink-soft">(optional)</span> : null}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint ? (
        <p id={hintId} className="text-[0.85rem] text-ink-soft">
          {hint}
        </p>
      ) : null}
      <p id={errorId} role={error ? "alert" : undefined} className={cn("text-[0.85rem] text-destructive", !error && "sr-only")}>
        {error}
      </p>
    </div>
  )
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function TextInput(
  { className, ...props },
  ref
) {
  return <input ref={ref} className={cn(control, "h-12", className)} {...props} />
})

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function TextArea(
  { className, ...props },
  ref
) {
  return <textarea ref={ref} className={cn(control, "min-h-36 resize-y py-3 leading-relaxed", className)} {...props} />
})

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...props },
  ref
) {
  return (
    <div className="relative">
      <select ref={ref} className={cn(control, "h-12 appearance-none pr-11", className)} {...props}>
        {children}
      </select>
      <CaretDown weight="light" aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-soft" />
    </div>
  )
})

/** A checkbox with a large hit area and a drawn check mark. */
export const CheckboxRow = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; error?: string }
>(function CheckboxRow({ label, error, className, id: idProp, ...props }, ref) {
  const auto = useId()
  const id = idProp ?? auto
  const errorId = error ? `${id}-error` : undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="group flex min-h-11 cursor-pointer items-start gap-3 py-1">
        <span className="relative mt-[0.2rem] inline-flex size-5 shrink-0">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            className="peer size-5 cursor-pointer appearance-none rounded-[2px] border border-input bg-field transition-colors checked:border-foreground checked:bg-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[invalid=true]:border-destructive"
            {...props}
          />
          <Check
            weight="bold"
            aria-hidden
            className="pointer-events-none absolute inset-0 m-auto size-3.5 text-background opacity-0 transition-opacity peer-checked:opacity-100"
          />
        </span>
        <span className="text-[0.98rem] leading-snug">{label}</span>
      </label>
      {error ? (
        <p id={errorId} role="alert" className="mt-1 pl-8 text-[0.85rem] text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
})

/** Multi- or single-select options rendered as tappable chips (real inputs underneath). */
export function ChoiceChips({
  legend,
  name,
  options,
  type = "checkbox",
  register,
  optional,
  error,
}: {
  legend: string
  name: string
  options: readonly string[]
  type?: "checkbox" | "radio"
  register: (name: string) => Record<string, unknown>
  optional?: boolean
  error?: string
}) {
  const id = useId()
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="text-[0.9rem] font-medium">
        {legend}
        {optional ? <span className="ml-2 font-normal text-ink-soft">(optional)</span> : null}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((opt) => (
          <label key={opt} className="relative cursor-pointer">
            <input type={type} value={opt} className="peer sr-only" {...register(name)} />
            <span className="inline-flex min-h-11 items-center rounded-full border border-input bg-field px-4 text-[0.92rem] transition-colors duration-300 select-none peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring hover:border-foreground">
              {opt}
            </span>
          </label>
        ))}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[0.85rem] text-destructive">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}

/** Visually hidden honeypot field; real people never see or fill it. */
export const Honeypot = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Honeypot(props, ref) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company
        <input ref={ref} type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  )
})
