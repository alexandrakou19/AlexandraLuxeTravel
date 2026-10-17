import type { Metadata } from "next"

import { PageHero } from "@/components/editorial/page-hero"
import { getSiteSettings } from "@/lib/content"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Alexandra Luxe Travel collects, uses and protects the information you share.",
  alternates: { canonical: "/privacy" },
}

// REVIEW(Saad): placeholder policy for client and legal review before launch.
export default async function PrivacyPage() {
  const site = await getSiteSettings()
  const sections = [
    {
      title: "What I collect",
      body: [
        "When you send a travel inquiry or contact message, I collect the details you choose to share: your name, email, phone number, where you are based, and information about your trip such as dates, destinations, budget, preferences and the number and ages of travelers, including children.",
        "I only ask for children’s ages so I can recommend suitable accommodations, activities and travel arrangements.",
      ],
    },
    {
      title: "How I use it",
      body: [
        "Your information is used to respond to your inquiry, prepare travel proposals, make bookings you request and keep in touch about your trip. I do not sell your personal information.",
        "When you book, relevant details are shared with the suppliers needed to deliver your trip, such as hotels, cruise lines, tour operators and airlines.",
      ],
    },
    {
      title: "Services that help run this website",
      body: [
        "Inquiries are delivered by email through a secure email provider. The website may use privacy-friendly spam protection and analytics to understand how visitors use the site. These providers process data on my behalf only.",
      ],
    },
    {
      title: "How long I keep it",
      body: ["I keep inquiry and trip records only as long as needed to plan and support your travel and to meet legal and accounting obligations."],
    },
    {
      title: "Your choices",
      body: [
        `You can ask to see, correct or delete the personal information I hold about you at any time by emailing ${site.email}.`,
      ],
    },
  ]

  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy">
        <p>Your trust matters. This page explains what information I collect through this website and how it is used.</p>
      </PageHero>
      <section className="container-editorial pb-24 lg:pb-32">
        <div className="max-w-[68ch] border-t border-hairline lg:ml-[calc(100%/12*5)]">
          {sections.map((s) => (
            <div key={s.title} className="border-b border-hairline py-10">
              <h2 className="display-3">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p.slice(0, 24)} className="mt-4 text-ink-soft">
                  {p}
                </p>
              ))}
            </div>
          ))}
          <p className="pt-8 text-[0.85rem] text-ink-soft">Last updated October 2026.</p>
        </div>
      </section>
    </>
  )
}
