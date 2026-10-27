
interface InvoiceCountCard {
    count: number;
    label: string;
}

export function InvoiceCountCard({count, label}: InvoiceCountCard) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <strong className="mb-1 block text-xl">
                {count}
            </strong>
            <span className="text-slate-500">{label}</span>
        </div>
    );
}