import { z } from "zod";
export * from "./constants";
export * from "./forms";
export * from "./invoicePdf";

export const invoiceStatusSchema = z.enum(["draft", "active", "partially_paid", "paid"]);
export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;
export const invoiceItemSchema = z.object({
  id: z.string(),
  itemName: z.string(),
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

export const invoiceClientDetailsSchema = z.object({
  clientName: z.string(),
  address: z.string(),
  contactDetails: z.string(),
  email: z.string(),
  gstNumber: z.string().nullable(),
  state: z.string(),
  country: z.string(),
});
export type InvoiceClientDetails = z.infer<typeof invoiceClientDetailsSchema>;

export const invoicePayloadSchema = z.object({
  orgId: z.string(),
  invoiceNumber: z.string(),
  issueDate: z.string(),
  dueDate: z.string(),
  clientId: z.string(),
  clientDetails: invoiceClientDetailsSchema,
  isGstInvoice: z.boolean(),
  gstSplitType: z.enum(["none", "cgst_sgst", "igst"]),
  items: z.array(invoiceItemSchema),
  subtotal: z.number(),
  gst: z.number(),
  cgst: z.number().nullable(),
  sgst: z.number().nullable(),
  igst: z.number().nullable(),
  total: z.number(),
});
export type InvoicePayload = z.infer<typeof invoicePayloadSchema>;

export const invoiceSchema = invoicePayloadSchema.extend({
  id: z.string(),
  status: invoiceStatusSchema,
  amountPaid: z.number(),
  signatureUrl: z.string().nullable(),
  isDeleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
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
  invoicePrefix: z.string(),
  invoiceCount: z.number(),
  invoiceCountDetails: z
    .object({
      unpaidInvoiceCount: z.number(),
    })
    .optional(),
  bankDetails: z.string(),
  createdAt: z.string(),
});
export type Organization = z.infer<typeof organizationSchema>;
