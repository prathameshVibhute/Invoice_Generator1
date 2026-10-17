"use client";

import { useState, type ReactNode } from "react";
import { Button } from "../button";

export type StepperStepContentProps = {
  onNext?: () => void;
  onPrevious?: () => void;
};
export type StepperStep = {
  label?: string;
  content: (props: StepperStepContentProps) => ReactNode;
};

export type StepperProps = {
  steps: StepperStep[];
  currentStepIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  className?: string;
};

export function Stepper({
  steps,
  currentStepIndex,
  onNext,
  onPrevious,
  className = "",
}: StepperProps) {
  if (steps.length === 0) return null;

  const activeIndex = Math.min(Math.max(currentStepIndex, 0), steps.length - 1);

  return (
    <section className={`w-full ${className}`.trim()}>
      <ol aria-label="Progress" className="flex w-full items-start">
        {steps.map((step, index) => {
          const isReached = index <= activeIndex;
          return (
            <li
              key={`${step.label ?? "step"}-${index}`}
              aria-current={index === activeIndex ? "step" : undefined}
              className="flex min-w-0 flex-1 basis-0 flex-col items-center"
            >
              <div className="relative flex w-full justify-center">
                {index < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`absolute left-1/2 top-[17px] h-0.5 w-full ${
                      index < activeIndex ? "bg-blue-600" : "bg-slate-300 opacity-40"
                    }`}
                  />
                )}
                <span
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                    isReached
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white text-slate-500"
                  }`}
                >
                  {index + 1}
                </span>
              </div>
              {step.label ? (
                <span
                  className={`mt-2 w-full break-words px-1 text-center text-sm ${isReached ? "text-blue-600" : "text-slate-500"}`}
                >
                  {step.label}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="mt-8">
        {steps.map((step, index) => {
          return (
            <div key={`${step.label ?? "step"}-${index}`} hidden={index !== activeIndex}>
              {step.content({ onNext, onPrevious })}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DemoStep({
  title,
  children,
  onNext,
  onPrevious,
}: {
  title: string;
  children: string;
  onNext?: () => void;
  onPrevious?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="m-0 text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-slate-500">{children}</p>
      <div className="mt-6 flex justify-between gap-3">
        {onPrevious ? (
          <Button
            type="button"
            className="rounded-xl bg-blue-600 px-3.5 py-3 font-bold text-white"
            onClick={onPrevious}
          >
            Previous
          </Button>
        ) : (
          <span />
        )}
        {onNext ? (
          <Button
            type="button"
            className="rounded-xl bg-blue-600 px-3.5 py-3 font-bold text-white"
            onClick={onNext}
          >
            Next
          </Button>
        ) : null}
      </div>
    </div>
  );
}

const demoSteps: StepperStep[] = [
  {
    label: "Details",
    content: (props) => (
      <DemoStep title="Step 1: Details" {...props}>
        Add the basic details here.
      </DemoStep>
    ),
  },
  {
    label: "Items",
    content: (props) => (
      <DemoStep title="Step 2: Items" {...props}>
        Add items and quantities here.
      </DemoStep>
    ),
  },
  {
    label: "Review",
    content: (props) => (
      <DemoStep title="Step 3: Review" {...props}>
        Review everything before finishing.
      </DemoStep>
    ),
  },
];

/** Standalone three-step example. */
export function StepperDemo() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  return (
    <Stepper
      steps={demoSteps}
      currentStepIndex={currentStepIndex}
      onNext={() => setCurrentStepIndex((index) => Math.min(index + 1, demoSteps.length - 1))}
      onPrevious={() => setCurrentStepIndex((index) => Math.max(index - 1, 0))}
    />
  );
}
