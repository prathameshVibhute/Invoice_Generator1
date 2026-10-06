"use client";

import { IconPlus, IconSettings } from "@tabler/icons-react";
import { Button } from "@invoice-generator/ui/button";

export function ClientListHeader() {
    return (
        <>
            <header className="page-head">
                <div>
                <h1>Clients</h1>
                <div className="org-switch">Acme Studio</div>
                </div>
                <div className="flex gap-2">
                <Button
                    icon={IconSettings}
                    routeUrl="/organization"
                    className="flex items-center rounded-xl border border-border bg-surface p-3"
                    type="button"
                />
                <Button
                    icon={IconPlus}
                    iconClassName="text-surface"
                    routeUrl="/clients/new"
                    className="flex items-center rounded-xl p-3 text-surface bg-primary"
                    label="Add client"
                    labelClassName="text-surface"
                    type="button"
                />
                </div>
            </header>
        </>
    );
}