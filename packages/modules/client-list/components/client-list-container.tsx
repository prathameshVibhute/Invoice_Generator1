"use client";

import { useEffect, useState } from "react";
import { EmptyStatePage } from "@invoice-generator/ui/empty-state-page";
import { Pagination } from "@invoice-generator/ui/pagination";
import type { Client } from "@invoice-generator/types";
import { ClientCard } from "./client-card";
import { ClientCardSkeletonLoader } from "./client-card-skeleton-loader";

interface ClientListContainerProps {
  getClientsAction: () => Promise<Client[]>;
}

export function ClientListContainer({ getClientsAction }: ClientListContainerProps) {
    const pageSize = 10;
    const [clients, setClients] = useState<Client[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        setIsLoading(true);
        getClientsAction()
            .then((fetchedClients) => {
                if (!cancelled) setClients(fetchedClients);
            })
            .catch((error: unknown) => {
                console.error("Failed to fetch clients", error);
                if (!cancelled) setClients([]);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [currentPage, getClientsAction]);

    const pageClients = clients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return ( 
        <>
            {isLoading && clients.length === 0 ? (
                <div className="grid gap-4">
                    {Array.from({ length: 3 }, (_, index) => (
                        <ClientCardSkeletonLoader key={index} />
                    ))}
                </div>
            ) : clients.length === 0 ? (
                <div className="flex min-h-0 flex-1 flex-col">
                    <EmptyStatePage message="There are no clients added, please add new clients" />
                </div>
            ) : (
                <div className="grid gap-4">
                    {pageClients.map((client) => {
                        return (
                            <ClientCard client={client} key={client.id} />
                        );
                    })}
                </div>
            )}
            <div className="mt-2">
            <Pagination
                totalNumber={clients.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
            />
            </div>
        </> 
    );
}