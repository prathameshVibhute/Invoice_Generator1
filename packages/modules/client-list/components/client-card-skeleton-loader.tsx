export function ClientCardSkeletonLoader() {
	return (
		<article
			aria-hidden="true"
			className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 animate-pulse"
		>
			<div className="flex items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-3">
					<div className="h-12 w-12 shrink-0 rounded-full bg-border/60" />
					<div className="flex min-w-0 flex-col gap-2">
						<div className="h-4 w-36 max-w-full rounded bg-border/60" />
						<div className="h-3 w-28 max-w-full rounded bg-border/60" />
					</div>
				</div>
				<div className="h-7 w-24 shrink-0 rounded-full bg-border/60" />
			</div>
			<div className="flex flex-col gap-3 border-t border-border pt-3">
				<div className="flex items-center gap-2">
					<div className="h-5 w-5 shrink-0 rounded bg-border/60" />
					<div className="h-3 w-36 max-w-full rounded bg-border/60" />
				</div>
				<div className="flex items-center gap-2">
					<div className="h-5 w-5 shrink-0 rounded bg-border/60" />
					<div className="h-3 w-48 max-w-full rounded bg-border/60" />
				</div>
			</div>
		</article>
	);
}
