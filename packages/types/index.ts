import { z } from "zod";
export * from "./constants";
export * from "./forms";

export const invoiceStatusSchema = z.enum(["draft", "active", "partially_paid", "paid"]);
export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;
export const invoiceItemSchema = z.object({
  id: z.string(),
  itemName: z.string(),
  hsnSacCode: z.string(),
  quantity: z.number(),
  gstPercentage: z.number().nullable(),
  rate: z.number(),
  total: z.number(),
});
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;

// Client schema
export const clientSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  clientName: z.string(),
  contactPersonDetails: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  gstNumber: z.string().nullable(),
  address: z.string(),
  state: z.string(),
  country: z.string(),
  contactDetails: z.string(),
  email: z.string(),
  pendingInvoiceCount: z.number(),
  isDeleted: z.boolean(),
  createdAt: z.string(),
});
export type Client = z.infer<typeof clientSchema>;

export const invoiceSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  clientId: z.string(),
  invoiceNumber: z.string(),
  status: invoiceStatusSchema,
  isGstInvoice: z.boolean(),
  gstSplitType: z.enum(["none", "cgst_sgst", "igst"]),
  amountPaid: z.number(),
  subtotal: z.number(),
  total: z.number(),
  signatureUrl: z.string().nullable(),
  isDeleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  items: z.array(invoiceItemSchema),
});
export type Invoice = z.infer<typeof invoiceSchema>;
export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  state: z.string(),
  country: z.string(),
  gstNumber: z.string().nullable(),
  logoUrl: z.string().nullable(),
  signatureUrl: z.string().nullable(),
  contactDetails: z.string(),
  invoiceNumberPrefix: z.string(),
  invoiceNumberCurrentSeq: z.number(),
  bankDetails: z.string(),
  createdAt: z.string(),
});
export type Organization = z.infer<typeof organizationSchema>;
