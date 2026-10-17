"use client";

import { useCallback, useState } from "react";
import { SearchSelect, type SearchSelectOption } from "./index";

type DemoRecord = {
  description: string;
};

const demoRecords: SearchSelectOption<DemoRecord>[] = [
  { value: "northwind", label: "Northwind Traders", data: { description: "Wholesale supplier" } },
  { value: "contoso", label: "Contoso Ltd.", data: { description: "Technology company" } },
  { value: "fabrikam", label: "Fabrikam Inc.", data: { description: "Manufacturing company" } },
  { value: "adatum", label: "A. Datum Corporation", data: { description: "Consulting company" } },
  { value: "woodgrove", label: "Woodgrove Bank", data: { description: "Financial services" } },
];

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
}

/** Interactive standalone demo for the SearchSelect states and keyboard behavior. */
export function SearchSelectDemo() {
  const [selected, setSelected] = useState<SearchSelectOption<DemoRecord> | null>(null);
  const searchRecords = useCallback(async (query: string) => {
    await wait(650);
    if (query.toLowerCase().includes("no-match")) return [];

    const normalizedQuery = query.trim().toLowerCase();
    return demoRecords.filter((record) => record.label.toLowerCase().includes(normalizedQuery));
  }, []);

  return (
    <section className="w-full max-w-md space-y-3">
      <p className="text-sm font-medium text-slate-900">Search records</p>
      <SearchSelect
        value={selected}
        onChange={setSelected}
        onSearch={searchRecords}
        placeholder="Search records..."
      />
      <p className="text-sm text-slate-500">
        Type to see loading and results, try “no-match” for no results, then select and reopen to
        see the selected tick.
      </p>
      {selected && (
        <p className="text-sm text-slate-900">
          Selected: {selected.label} {selected.data ? `— ${selected.data.description}` : ""}
        </p>
      )}
    </section>
  );
}
