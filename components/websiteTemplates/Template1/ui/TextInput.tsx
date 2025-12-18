// components/website/ui/TextInput.tsx
import { withAlpha } from "../theme";

type Props = {
  label: string;
  placeholder: string;
  type?: string;
  focusColor: string;
};

export function TextInput({
  label,
  placeholder,
  type = "text",
  focusColor,
}: Props) {
  const baseBorder = withAlpha(focusColor, 0.25);

  return (
    <label className="text-xs text-slate-300">
      {label}
      <input
        type={type}
        className="mt-1 w-full rounded-md border bg-slate-900 px-2 py-1.5 text-xs text-slate-100 outline-none"
        style={{ borderColor: baseBorder }}
        placeholder={placeholder}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = String(focusColor))
        }
        onBlur={(e) => (e.currentTarget.style.borderColor = String(baseBorder))}
      />
    </label>
  );
}
