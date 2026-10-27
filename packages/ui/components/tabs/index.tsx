import { Button } from "@invoice-generator/ui/button";

interface TabsProps {
  labels: string[];
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Tabs({ labels, currentTab, onTabChange }: TabsProps) {
  return (
    <div className="mb-4 flex gap-5 border-b border-slate-200" role="tablist">
      {labels.map((label) => (
        <Button
          aria-selected={currentTab === label}
          className={`border-0 border-b-2 bg-transparent px-0.5 py-3 font-bold ${currentTab === label ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500"}`}
          key={label}
          onClick={() => onTabChange(label)}
          role="tab"
          type="button"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
