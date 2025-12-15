// components/website/sections/ContactSection.tsx
import { withAlpha } from "../theme";
import { ContactRow } from "../ui/ContactRow";
import { TextInput } from "../ui/TextInput";

type ContactData = {
  title: string;
  description: string;
  email: string;
  whatsapp?: string;
  phone?: string;
};

type FinalCtaData = {
  headline: string;
  subheadline: string;
  buttonLabel: string;
};

type Props = {
  contact: ContactData;
  finalCta: FinalCtaData;
  primary: string;
  primaryHover: string;
};

export function ContactSection({
  contact,
  finalCta,
  primary,
  primaryHover,
}: Props) {
  return (
    <section
      id="contact"
      className="border-t border-slate-800 bg-linear-to-b from-slate-900 to-slate-950"
    >
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="max-w-xl">
          <h2 className="text-xl font-semibold">{contact.title}</h2>
          <p className="mt-3 text-sm text-slate-300">{contact.description}</p>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Contact details */}
          <div className="space-y-4 text-sm">
            <div
              className="rounded-2xl border bg-slate-950/60 p-4"
              style={{
                borderColor: withAlpha(primary, 0.22),
              }}
            >
              <h3 className="text-sm font-semibold text-slate-100">
                Contact details
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Prefer email, WhatsApp, or a quick call? Reach us using any of
                the options below.
              </p>

              <div className="mt-4 space-y-2">
                <ContactRow label="Email" value={contact.email} />
                {contact.whatsapp && (
                  <ContactRow label="WhatsApp" value={contact.whatsapp} />
                )}
                {contact.phone && (
                  <ContactRow label="Phone" value={contact.phone} />
                )}
              </div>
            </div>

            <p className="text-xs text-slate-400">
              We usually reply within 24 hours on business days.
            </p>
          </div>

          {/* Contact form */}
          <form
            className="rounded-2xl border bg-slate-950/80 p-6 shadow-lg shadow-slate-950/40"
            style={{ borderColor: withAlpha(primary, 0.22) }}
            onSubmit={(e) => e.preventDefault()}
          >
            <h3 className="text-lg font-semibold text-slate-100">
              {finalCta.headline}
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              {finalCta.subheadline}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <TextInput
                label="Your name"
                placeholder="Enter your name"
                focusColor={primary}
              />
              <TextInput
                label="Email"
                placeholder="you@example.com"
                type="email"
                focusColor={primary}
              />
            </div>

            <label className="mt-3 block text-xs text-slate-300">
              Message
              <textarea
                rows={4}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 outline-none"
                style={{ borderColor: withAlpha(primary, 0.25) }}
                placeholder="Tell us a bit about what you need help with..."
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = String(primary))
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = String(
                    withAlpha(primary, 0.25)
                  ))
                }
              />
            </label>

            <button
              type="submit"
              className="mt-4 rounded-full px-5 py-2 text-sm font-medium text-slate-950 transition"
              style={{ backgroundColor: primary }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  String(primaryHover);
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  String(primary);
              }}
            >
              {finalCta.buttonLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
