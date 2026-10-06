"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Dropdown } from "@invoice-generator/ui/dropdown";
import { Button } from "@invoice-generator/ui/button";
import { Client, clientFormSchema, ClientFormValues, STATE } from "@invoice-generator/types";
import { FormEvent, useState } from "react";
import { clients } from "../../data";

type NewClient = Omit<Client, "id" | "orgId" | "createdAt" | "isDeleted">;

type ClientFormErrors = Omit<
  Partial<Record<keyof ClientFormValues, string>>,
  "contactPersonDetails"
> & {
  contactPersonDetails?: Partial<
    Record<keyof ClientFormValues["contactPersonDetails"], string>
  >;
};

interface ClientFormContainerProps {
    id?: string;
    addClientAction: (client: NewClient) => Promise<Client>;
}

export function ClientFormContainer({id, addClientAction}: ClientFormContainerProps) {
    const t = useTranslations("clientForm");
    const router = useRouter();
    const client = clients.find((item) => item.id === id);
    const [values, setValues] = useState<ClientFormValues>({
    clientName: client?.clientName ?? "",
    contactPersonDetails: {
        firstName: "",
        lastName: ""
    },
    gstNumber: client?.gstNumber ?? "",
    address: client?.address ?? "",
    state: client?.state ?? STATE[25]?.stateName ?? "",
    country: client?.country ?? "India",
    contactDetails: client?.contactDetails ?? "",
    email: client?.email ?? "",
    });
    const [errors, setErrors] = useState<ClientFormErrors>({});
    const stateOptions = STATE.map((state) => {
    return {
        label: state.stateName,
        value: state.stateName,
        id: state.code
    }
    });
    
    function updateField<Field extends keyof ClientFormValues>(field: Field, value: ClientFormValues[Field]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const result = clientFormSchema.safeParse(values);
        if (!result.success) {
        const nextErrors: ClientFormErrors = {};
        for (const issue of result.error.issues) {
            const field = issue.path[0];
            const nestedField = issue.path[1];
            if (
            field === "contactPersonDetails" &&
            (nestedField === "firstName" || nestedField === "lastName")
            ) {
            nextErrors.contactPersonDetails = {
                ...nextErrors.contactPersonDetails,
                [nestedField]: issue.message,
            };
            } else if (
            typeof field === "string" &&
            field in values &&
            field !== "contactPersonDetails"
            ) {
            nextErrors[field as Exclude<keyof ClientFormValues, "contactPersonDetails">] = issue.message;
            }
        }
        setErrors(nextErrors);
        document.getElementById("app-scroll-container")?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        return;
        }
        setErrors({});
        await addClientAction({ ...result.data, pendingInvoiceCount: 0 });
        router.push("/clients");
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-grid">
            <div className="flex flex-col w-full p-2 gap-1.5">
                <label>
                {t("organizationName")} <span aria-hidden="true" className="text-red-600">*</span>
                </label>
                <input className="p-3 rounded-xl border border-border" value={values.clientName} onChange={(event) => updateField("clientName", event.target.value)} placeholder={t("organizationNamePlaceholder")} />
                {errors.clientName && <span className="text-red-600">{errors.clientName}</span>}
            </div>
            <div className="flex flex-col w-full p-2 gap-1.5">
                <label>
                {t("contactPersonDetails")} <span aria-hidden="true" className="text-red-600">*</span>
                </label>
                <div className="flex flex-row w-full gap-2">
                <input className="w-full p-3 rounded-xl border border-border" value={values.contactPersonDetails.firstName} onChange={(event) => updateField("contactPersonDetails", {
                    ...values.contactPersonDetails,
                    firstName:  event.target.value
                    })} placeholder={t("firstNamePlaceholder")} />
                <input className="w-full p-3 rounded-xl border border-border" value={values.contactPersonDetails.lastName} onChange={(event) => updateField("contactPersonDetails", {
                    ...values.contactPersonDetails,
                    lastName:  event.target.value
                    })} placeholder={t("lastNamePlaceholder")} />
                </div>
                {(errors.contactPersonDetails?.firstName || errors.contactPersonDetails?.lastName) && <span className="text-red-600">{errors.contactPersonDetails?.firstName ?? errors.contactPersonDetails?.lastName}</span>}
            </div>
            <div className="flex flex-col w-full p-2 gap-1.5">
                <label>{t("gstNumber")}</label>
                <input className="p-3 rounded-xl border border-border" value={values.gstNumber} onChange={(event) => updateField("gstNumber", event.target.value)} placeholder={t("gstNumberPlaceholder")} />
                {errors.gstNumber && <span className="text-red-600">{errors.gstNumber}</span>}
            </div>
            {/* <hr className="w-full border-gray-200 my-2" /> */}
            <div className="flex flex-col w-full p-2 gap-1.5">
                <label>{t("address")}</label>
                <input className="p-3 rounded-xl border border-border" value={values.address} onChange={(event) => updateField("address", event.target.value)} placeholder={t("addressPlaceholder")} />
                {errors.address && <span className="text-red-600">{errors.address}</span>}
            </div>
            <div className="flex flex-col w-full p-2 gap-1.5">
                <label>{t("state")} <span aria-hidden="true" className="text-red-600">*</span></label>
                <Dropdown options={stateOptions} value={values.state} onChange={(value) => updateField("state", value)} placeholder={t("statePlaceholder")} />
                {errors.state && <span className="text-red-600">{errors.state}</span>}
            </div>
            <div className="flex flex-col w-full p-2 gap-1.5">
                <label>{t("country")}</label>
                <input disabled={true} className="p-3 rounded-xl border border-border disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60" value={values.country} onChange={(event) => updateField("country", event.target.value)} />
                {errors.country && <span className="text-red-600">{errors.country}</span>}
            </div>
            <div className="flex flex-col w-full p-2 gap-1.5">
                <label>{t("contactDetails")}</label>
                <input className="p-3 rounded-xl border border-border" value={values.contactDetails} onChange={(event) => updateField("contactDetails", event.target.value)} />
                {errors.contactDetails && <span className="text-red-600">{errors.contactDetails}</span>}
            </div>
            <div className="flex flex-col w-full p-2 gap-1.5">
                <label>{t("email")}</label>
                <input className="p-3 rounded-xl border border-border" type="email" value={values.email} onChange={(event) => updateField("email", event.target.value)} />
                {errors.email && <span className="text-red-600">{errors.email}</span>}
            </div>
            </div>
            {/* </section> */}
            <div className="w-full p-2">
                <Button className="w-full bg-primary p-3 rounded-xl" labelClassName="text-surface" label={t("save")} type="submit" />
            </div>
        </form>
    );
}