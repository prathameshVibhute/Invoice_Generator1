import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { organization } from "../data";
export function OrganizationScreen() {
  return (
    <>
      <header className="page-head">
        <Link className="icon-button" href="/invoices">
          <IconArrowLeft className="w-5 h-5" />
        </Link>
        <h1>Organization</h1>
      </header>
      <section className="card">
        <div className="form-grid">
          <label className="field">
            Organization name
            <input defaultValue={organization.name} />
          </label>
          <label className="field">
            GST number
            <input defaultValue={organization.gstNumber ?? ""} />
          </label>
          <label className="field">
            Address
            <input defaultValue={organization.address} />
          </label>
          <label className="field">
            State
            <input defaultValue={organization.state} />
          </label>
          <label className="field">
            Country
            <input defaultValue={organization.country} />
          </label>
          <label className="field">
            Contact details
            <input defaultValue={organization.contactDetails} />
          </label>
          <label className="field">
            Invoice prefix
            <input defaultValue={organization.invoiceNumberPrefix} />
          </label>
          <label className="field">
            Bank details
            <input defaultValue={organization.bankDetails} />
          </label>
        </div>
      </section>
      <button className="button" style={{ marginTop: 16 }}>
        Save changes
      </button>
    </>
  );
}
