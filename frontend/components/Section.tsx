export default function Section({
  eyebrow, title, note, children,
}: { eyebrow: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] text-ember uppercase">{eyebrow}</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink">{title}</h2>
        </div>
        {note && <p className="hidden max-w-xs text-right text-xs text-faint sm:block">{note}</p>}
      </div>
      {children}
    </section>
  );
}
