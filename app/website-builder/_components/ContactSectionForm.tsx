"use client";

import { WebsiteData } from "@/lib/websiteTypes";

type ContactSectionFormProps = {
  data: WebsiteData;
  setData: React.Dispatch<React.SetStateAction<WebsiteData>>;
};

export function ContactSectionForm({ data, setData }: ContactSectionFormProps) {
  return (
    <div className="space-y-4">
      {/* Contact Section Title */}
      <label className="block text-xs text-slate-400">
        Contact Section Title
        <input
          value={data.contact.title}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              contact: { ...prev.contact, title: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      {/* Description */}
      <label className="block text-xs text-slate-400">
        Contact Description
        <textarea
          value={data.contact.description}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              contact: { ...prev.contact, description: e.target.value },
            }))
          }
          rows={3}
          className="input-base"
        />
      </label>

      {/* Email */}
      <label className="block text-xs text-slate-400">
        Email Address
        <input
          value={data.contact.email}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              contact: { ...prev.contact, email: e.target.value },
            }))
          }
          placeholder="you@example.com"
          type="email"
          className="input-base"
        />
      </label>

      {/* WhatsApp */}
      <label className="block text-xs text-slate-400">
        WhatsApp Number (optional)
        <input
          value={data.contact.whatsapp ?? ""}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              contact: { ...prev.contact, whatsapp: e.target.value },
            }))
          }
          placeholder="+92 300 1234567"
          className="input-base"
        />
      </label>

      {/* Phone */}
      <label className="block text-xs text-slate-400">
        Phone Number (optional)
        <input
          value={data.contact.phone ?? ""}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              contact: { ...prev.contact, phone: e.target.value },
            }))
          }
          placeholder="+92 51 1234567"
          className="input-base"
        />
      </label>

      {/* FINAL CTA CARD */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-3 space-y-3 mt-6">
        <h4 className="text-xs font-semibold text-slate-300">Final CTA Box</h4>

        {/* CTA Headline */}
        <label className="block text-xs text-slate-400">
          CTA Headline
          <input
            value={data.finalCta.headline}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                finalCta: { ...prev.finalCta, headline: e.target.value },
              }))
            }
            placeholder="Ready to get started?"
            className="input-base"
          />
        </label>

        {/* CTA Subheadline */}
        <label className="block text-xs text-slate-400">
          CTA Subheadline
          <textarea
            value={data.finalCta.subheadline}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                finalCta: { ...prev.finalCta, subheadline: e.target.value },
              }))
            }
            rows={2}
            placeholder="We're here to help you move forward."
            className="input-base"
          />
        </label>

        {/* CTA Button Label */}
        <label className="block text-xs text-slate-400">
          CTA Button Label
          <input
            value={data.finalCta.buttonLabel}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                finalCta: { ...prev.finalCta, buttonLabel: e.target.value },
              }))
            }
            placeholder="Contact Us"
            className="input-base"
          />
        </label>
      </div>
    </div>
  );
}
