import { z } from "zod"

export const tripTypeOptions = [
  { value: "family", label: "Family Vacation" },
  { value: "honeymoon", label: "Honeymoon" },
  { value: "romantic", label: "Romantic Getaway" },
  { value: "wedding", label: "Destination Wedding" },
  { value: "group", label: "Group Trip" },
  { value: "adventure", label: "Adventure / Once-in-a-Lifetime" },
  { value: "other", label: "Other" },
] as const

export const contactMethodOptions = ["Email", "Phone call", "Text message"] as const
export const accommodationOptions = ["Luxury hotel", "Resort", "Private villa", "Boutique hotel", "Open to ideas"] as const
export const paceOptions = ["Relaxed", "Balanced", "Action-packed"] as const
export const interestOptions = [
  "Culture & history",
  "Food & wine",
  "Beach",
  "Adventure",
  "Wildlife",
  "Wellness",
  "Kid-friendly activities",
  "Nightlife",
] as const
export const heardFromOptions = ["Instagram", "Facebook", "Google", "Referral", "Other"] as const

export const tripTypeValues = tripTypeOptions.map((o) => o.value) as [string, ...string[]]

export function tripTypeLabel(value: string) {
  return tripTypeOptions.find((o) => o.value === value)?.label ?? value
}

const optionalText = (max = 200) => z.string().trim().max(max, `Please keep this under ${max} characters.`)
const isWholeNumber = (v: string) => /^\d+$/.test(v.trim())

/* ---------- Step 1: About you ---------- */
export const stepAboutSchema = z.object({
  firstName: z.string().trim().min(1, "Please share your first name.").max(80),
  lastName: z.string().trim().min(1, "Please share your last name.").max(80),
  email: z.string().trim().min(1, "Please share your email.").email("That email doesn’t look quite right."),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v === "" || /^[+()\-.\s\d]{7,}$/.test(v), "That phone number doesn’t look quite right."),
  contactMethod: z.string(),
  basedIn: optionalText(120),
})

/* ---------- Step 2: Your trip ---------- */
const stepTripBase = z.object({
  tripType: z.string(),
  destination: optionalText(200),
  helpDeciding: z.boolean(),
  dateFrom: z.string(),
  dateTo: z.string(),
  flexibleDates: z.boolean(),
  approxMonth: optionalText(60),
  nights: z.string().trim(),
  adults: z.string().trim(),
  children: z.string().trim(),
  childAges: z.array(z.string().trim()),
  occasion: optionalText(160),
})

type TripValues = z.infer<typeof stepTripBase>

function refineTrip(v: TripValues, ctx: z.RefinementCtx) {
  if (!tripTypeValues.includes(v.tripType)) {
    ctx.addIssue({ code: "custom", path: ["tripType"], message: "Please choose the kind of trip you’re planning." })
  }
  if (!v.destination && !v.helpDeciding) {
    ctx.addIssue({
      code: "custom",
      path: ["destination"],
      message: "Share a destination, or tick “I’d love help deciding”.",
    })
  }
  if (v.flexibleDates) {
    if (!v.approxMonth) {
      ctx.addIssue({ code: "custom", path: ["approxMonth"], message: "Roughly when would you like to travel?" })
    }
  } else {
    if (!v.dateFrom) ctx.addIssue({ code: "custom", path: ["dateFrom"], message: "Please choose a departure date." })
    if (!v.dateTo) ctx.addIssue({ code: "custom", path: ["dateTo"], message: "Please choose a return date." })
    if (v.dateFrom && v.dateTo && v.dateTo < v.dateFrom) {
      ctx.addIssue({ code: "custom", path: ["dateTo"], message: "Your return date is before your departure date." })
    }
  }
  if (v.nights && (!isWholeNumber(v.nights) || Number(v.nights) < 1 || Number(v.nights) > 120)) {
    ctx.addIssue({ code: "custom", path: ["nights"], message: "Please enter a number of nights between 1 and 120." })
  }
  if (!isWholeNumber(v.adults) || Number(v.adults) < 1 || Number(v.adults) > 60) {
    ctx.addIssue({ code: "custom", path: ["adults"], message: "At least one adult, please." })
  }
  if (!isWholeNumber(v.children) || Number(v.children) > 20) {
    ctx.addIssue({ code: "custom", path: ["children"], message: "Please enter a number of children (0 is fine)." })
  } else {
    const count = Number(v.children)
    for (let i = 0; i < count; i++) {
      const age = v.childAges[i] ?? ""
      if (!isWholeNumber(age) || Number(age) > 17) {
        ctx.addIssue({ code: "custom", path: ["childAges", i], message: "Age 0–17" })
      }
    }
  }
}

export const stepTripSchema = stepTripBase.superRefine(refineTrip)

/* ---------- Step 3: Preferences ---------- */
export const stepPreferencesSchema = z.object({
  budget: z.string().min(1, "Please choose a budget range. “Not sure yet” is perfectly fine."),
  accommodation: z.array(z.string()),
  pace: z.string(),
  interests: z.array(z.string()),
  heardFrom: z.string(),
  notes: optionalText(3000),
  consent: z.boolean().refine((v) => v, "Please agree to the privacy policy so I can reply to you."),
})

/* ---------- Anti-spam (not shown to people) ---------- */
export const spamSchema = z.object({
  company: z.string().max(0).optional().or(z.literal("")),
  startedAt: z.number(),
  turnstileToken: z.string().optional(),
})

export const inquirySchema = stepAboutSchema
  .extend(stepTripBase.shape)
  .extend(stepPreferencesSchema.shape)
  .extend(spamSchema.shape)
  .superRefine(refineTrip)

export type InquiryValues = z.infer<typeof inquirySchema>

export const stepSchemas = [stepAboutSchema, stepTripSchema, stepPreferencesSchema] as const

export const stepTitles = ["About you", "Your trip", "Preferences"] as const

export const inquiryDefaults: InquiryValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  contactMethod: "",
  basedIn: "",
  tripType: "",
  destination: "",
  helpDeciding: false,
  dateFrom: "",
  dateTo: "",
  flexibleDates: false,
  approxMonth: "",
  nights: "",
  adults: "2",
  children: "0",
  childAges: [],
  occasion: "",
  budget: "",
  accommodation: [],
  pace: "",
  interests: [],
  heardFrom: "",
  notes: "",
  consent: false,
  company: "",
  startedAt: 0,
  turnstileToken: "",
}

/* ---------- Contact form ---------- */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please share your name.").max(120),
  email: z.string().trim().min(1, "Please share your email.").email("That email doesn’t look quite right."),
  message: z.string().trim().min(10, "A few more words, please.").max(3000),
  company: z.string().max(0).optional().or(z.literal("")),
  startedAt: z.number(),
  turnstileToken: z.string().optional(),
})

export type ContactValues = z.infer<typeof contactSchema>
