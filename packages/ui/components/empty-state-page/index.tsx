interface EmptyStatePageProps {
  message?: string;
}

export function EmptyStatePage({ message = "No records found" }: EmptyStatePageProps) {
  const emptyStatePageUrl = "/empty-state.svg";
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-4">
      <img width={200} height={200} src={emptyStatePageUrl} alt="No records found" />
      <span>{message}</span>
    </div>
  );
}
