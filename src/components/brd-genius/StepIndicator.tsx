"use client";

import type React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="mb-6 text-center">
      <p className="text-sm text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="mt-2 flex justify-center">
        <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
