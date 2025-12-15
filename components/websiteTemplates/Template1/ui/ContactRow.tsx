// components/website/ui/ContactRow.tsx

type Props = {
  label: string;
  value: string;
};

export function ContactRow({ label, value }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-xs font-medium text-slate-100">{value}</span>
    </div>
  );
}
