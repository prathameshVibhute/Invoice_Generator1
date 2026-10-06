
interface EmptyStatePageProps {
    message?: string;
}

export function EmptyStatePage({message = "No records found"}: EmptyStatePageProps) {
    const emptyStatePageUrl = "/empty-state.svg";
    return (
        <div className="flex h-full flex-col border border-dashed border-muted/50 w-full p-4 justify-center items-center rounded-xl">
            <img width={200} height={200} src={emptyStatePageUrl} alt="No records found" />
            <span>{message}</span>
        </div>
    );
}