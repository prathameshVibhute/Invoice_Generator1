"use client";

import { useState } from "react";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import type { InvoiceItem } from "@invoice-generator/types";
import { Button } from "@invoice-generator/ui/button";
import { money, organization } from "../../data";

interface InvoiceFormItemDetailsProps {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
  gst: boolean;
  clientState?: string;
  onClientDetails: () => void;
  onPreviewInvoice: () => void;
}

interface ItemDraft {
  itemName: string;
  quantity: string;
  rate: string;
  gstPercentage: string;
}

const gstRates = [0, 5, 12, 18, 28];

function getItemSubtotal(item: InvoiceItem) {
  return item.quantity * item.rate;
}

function getItemTax(item: InvoiceItem, gst: boolean) {
  return gst ? getItemSubtotal(item) * ((item.gstPercentage ?? 0) / 100) : 0;
}

function toDraft(item?: InvoiceItem, gst = true): ItemDraft {
  return item
    ? {
        itemName: item.itemName,
        quantity: String(item.quantity),
        rate: String(item.rate),
        gstPercentage: String(item.gstPercentage ?? 0),
      }
    : { itemName: "", quantity: "1", rate: "", gstPercentage: gst ? "18" : "0" };
}

export function InvoiceFormItemDetails({
  items,
  onItemsChange,
  gst,
  clientState,
  onClientDetails,
  onPreviewInvoice,
}: InvoiceFormItemDetailsProps) {
  const [editingItemId, setEditingItemId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<ItemDraft>(() => toDraft(undefined, gst));

  const subtotal = items.reduce((total, item) => total + getItemSubtotal(item), 0);
  const gstTotal = items.reduce((total, item) => total + getItemTax(item, gst), 0);
  const quantity = Number(draft.quantity);
  const rate = Number(draft.rate);
  const draftTax =
    gst && Number.isFinite(rate) ? rate * quantity * (Number(draft.gstPercentage) / 100) : 0;
  const draftTotal =
    Number.isFinite(rate) && Number.isFinite(quantity) ? rate * quantity + draftTax : 0;
  const canSave =
    draft.itemName.trim().length > 0 &&
    draft.quantity.trim().length > 0 &&
    Number.isFinite(quantity) &&
    quantity > 0 &&
    draft.rate.trim().length > 0 &&
    Number.isFinite(rate) &&
    rate >= 0;

  function openNewItemForm() {
    setDraft(toDraft(undefined, gst));
    setEditingItemId("new");
  }

  function openEditItemForm(item: InvoiceItem) {
    setDraft(toDraft(item));
    setEditingItemId(item.id);
  }

  function saveItem() {
    if (!canSave || editingItemId === null) return;

    const item: InvoiceItem = {
      id: editingItemId === "new" ? crypto.randomUUID() : editingItemId,
      itemName: draft.itemName.trim(),
      quantity,
      rate,
      gstPercentage: Number(draft.gstPercentage),
      total: draftTotal,
    };

    onItemsChange(
      editingItemId === "new"
        ? [...items, item]
        : items.map((existingItem) => (existingItem.id === item.id ? item : existingItem)),
    );
    setEditingItemId(null);
  }

  function renderEditor() {
    return (
      <div className="p-0">
        <label className="mb-4 grid gap-2 text-sm font-bold">
          Item description
          <input
            className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
            autoFocus
            value={draft.itemName}
            onChange={(event) => setDraft({ ...draft, itemName: event.target.value })}
            placeholder="e.g. maintenance"
            required
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="mb-4 grid gap-2 text-sm font-bold">
            Quantity
            <input
              className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
              type="number"
              min="0.01"
              step="any"
              value={draft.quantity}
              onChange={(event) => setDraft({ ...draft, quantity: event.target.value })}
              required
            />
          </label>
          <label className="mb-4 grid gap-2 text-sm font-bold">
            Unit price
            <input
              className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
              type="number"
              min="0"
              step="any"
              value={draft.rate}
              onChange={(event) => setDraft({ ...draft, rate: event.target.value })}
              placeholder="0"
              required
            />
          </label>
          <label className="mb-4 grid gap-2 text-sm font-bold">
            GST
            <select
              className="rounded-xl border border-slate-200 bg-white p-3 font-normal"
              value={draft.gstPercentage}
              disabled={!gst}
              onChange={(event) => setDraft({ ...draft, gstPercentage: event.target.value })}
            >
              {gstRates.map((value) => (
                <option key={value} value={value}>
                  {value}%
                </option>
              ))}
            </select>
          </label>
          <label className="mb-4 grid gap-2 text-sm font-bold">
            Total
            <input
              className="rounded-xl border border-slate-200 bg-slate-50 p-3 font-normal"
              value={money(draftTotal)}
              readOnly
              aria-live="polite"
            />
          </label>
        </div>
        <div className="flex justify-end">
          <Button
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
            type="button"
            onClick={saveItem}
            disabled={!canSave}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section aria-labelledby="items-heading">
      <h2 id="items-heading" className="mb-3 text-lg font-semibold">
        Line items
      </h2>
      {items.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white px-[18px]">
          {items.map((item, index) => {
            const itemTotal = getItemSubtotal(item) + getItemTax(item, gst);
            return (
              <div className="py-5" key={item.id}>
                {editingItemId === item.id ? (
                  renderEditor()
                ) : (
                  <>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-start gap-3 max-[480px]:grid-cols-[minmax(0,1fr)_auto]">
                      <div className="grid gap-2">
                        <strong>{item.itemName}</strong>
                        <span className="text-slate-500">
                          {item.quantity} × {money(item.rate)}
                        </span>
                        {gst && (
                          <span className="text-sm text-slate-500">
                            {(item.gstPercentage ?? 0) === 0
                              ? "No GST (0%)"
                              : clientState === organization.state
                                ? `CGST ${(item.gstPercentage ?? 0) / 2}% + SGST ${(item.gstPercentage ?? 0) / 2}%`
                                : `IGST ${item.gstPercentage}%`}
                          </span>
                        )}
                      </div>
                      <strong className="pt-0.5 whitespace-nowrap">{money(itemTotal)}</strong>
                      <div className="flex gap-2 max-[480px]:col-start-2 max-[480px]:row-start-2">
                        <Button
                          className="grid h-[38px] w-[38px] place-items-center rounded-full bg-slate-100 p-0 text-slate-500"
                          type="button"
                          aria-label={`Edit ${item.itemName}`}
                          title="Edit item"
                          onClick={() => openEditItemForm(item)}
                        >
                          <IconEdit aria-hidden="true" className="w-5 h-5" />
                        </Button>
                        <Button
                          className="grid h-[38px] w-[38px] place-items-center rounded-full bg-red-50 p-0 text-red-600"
                          type="button"
                          aria-label={`Delete ${item.itemName}`}
                          title="Delete is not available yet"
                        >
                          <IconTrash aria-hidden="true" className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                {index < items.length - 1 && (
                  <div className="mt-[18px] border-t border-slate-200" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {editingItemId === "new" && (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-[18px]">
          {renderEditor()}
        </div>
      )}

      <Button
        className="mt-[18px] flex min-h-[68px] w-full items-center justify-center gap-2.5 rounded-2xl border border-dashed border-slate-300 bg-transparent font-bold text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        type="button"
        onClick={openNewItemForm}
        disabled={editingItemId !== null}
      >
        <IconPlus aria-hidden="true" className="w-5 h-5" />
        Add item
      </Button>

      <div className="mt-[18px] grid gap-3.5 rounded-2xl border border-slate-200 bg-white px-[22px] py-5">
        <div>
          <span>Subtotal</span>
          <span>{money(subtotal)}</span>
        </div>
        {gst && (
          <div>
            <span>GST</span>
            <span>{money(gstTotal)}</span>
          </div>
        )}
        <div className="border-t border-slate-200 pt-3.5 text-lg">
          <strong>Total</strong>
          <strong>{money(subtotal + gstTotal)}</strong>
        </div>
      </div>

      <div className="mt-5 flex justify-between gap-3">
        <Button
          className="inline-flex items-center justify-center rounded-xl border border-blue-600 bg-white px-3.5 py-3 font-bold text-blue-600"
          type="button"
          onClick={onClientDetails}
        >
          Client details
        </Button>
        <Button
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3.5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={onPreviewInvoice}
          disabled={items.length === 0 || editingItemId !== null}
        >
          Preview invoice
        </Button>
      </div>
    </section>
  );
}
