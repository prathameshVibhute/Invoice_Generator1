import { z } from "zod";
import { STATE } from "./constants";

const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const gstinCharacters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const stateCodes = new Set(STATE.map((state) => state.code));

function hasValidGstinChecksum(gstin: string): boolean {
  let factor = 2;
  let sum = 0;

  for (let index = gstin.length - 2; index >= 0; index -= 1) {
    const value = gstinCharacters.indexOf(gstin[index]!);
    const product = value * factor;
    sum += Math.floor(product / 36) + (product % 36);
    factor = factor === 2 ? 1 : 2;
  }

  const checksum = (36 - (sum % 36)) % 36;
  return gstin[gstin.length - 1] === gstinCharacters[checksum];
}

export const gstinSchema = z
  .string()
  .trim()
  .toUpperCase()
  .refine((value) => {
    if (value === "") return true;
    if (!gstinPattern.test(value)) return false;
    if (!stateCodes.has(value.slice(0, 2))) return false;
    return hasValidGstinChecksum(value);
  }, "Enter a valid GSTIN");

export const clientFormSchema = z.object({
  clientName: z.string().trim().min(1, "Organization name is required").default(""),
  contactPersonDetails: z.object({
    firstName: z.string().trim().min(1, "First name is required").default(""),
    lastName: z.string().trim().min(1, "Last name is required").default(""),
  }).default({ firstName: "", lastName: "" }),
  gstNumber: gstinSchema.default(""),
  address: z.string().trim().default(""),
  state: z.string().trim().min(1, "State is required").default(""),
  country: z.string().trim().default(""),
  contactDetails: z.string().trim().default(""),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .or(z.literal(""))
    .default(""),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;