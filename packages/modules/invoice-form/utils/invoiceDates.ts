function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addCalendarMonths(dateValue: string, months: number): string {
  const parts = dateValue.split("-");
  if (parts.length !== 3) {
    throw new Error(`Invalid date value: ${dateValue}`);
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (
    ![year, month, day].every(Number.isInteger) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > new Date(year, month, 0).getDate()
  ) {
    throw new Error(`Invalid date value: ${dateValue}`);
  }

  const targetMonth = month - 1 + months;
  const lastDayOfTargetMonth = new Date(year, targetMonth + 1, 0).getDate();
  return toDateInputValue(new Date(year, targetMonth, Math.min(day, lastDayOfTargetMonth)));
}

export function getDefaultInvoiceDates(): { issueDate: string; dueDate: string } {
  const issueDate = toDateInputValue(new Date());
  return { issueDate, dueDate: addCalendarMonths(issueDate, 3) };
}

export function formatInvoiceDate(dateValue: string): string {
  const [year, month, day] = dateValue.split("-").map(Number);
  if (!year || !month || !day || month > 12 || day > new Date(year, month, 0).getDate()) {
    throw new Error(`Invalid date value: ${dateValue}`);
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
