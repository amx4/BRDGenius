
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ListChecks, Loader2, ChevronRight, ChevronLeft } from "lucide-react";

interface BrdStructureStepProps {
  onSubmit: (structure: string) => void;
  onBack: () => void;
  initialValue: string;
  isLoading: boolean;
}

export function BrdStructureStep({ onSubmit, onBack, initialValue, isLoading }: BrdStructureStepProps) {
  const [structure, setStructure] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStructure(initialValue);
  }, [initialValue]);

  const handleSubmit = () => {
    if (!structure.trim()) {
      setError("BRD structure template cannot be empty.");
      return;
    }
    setError(null);
    onSubmit(structure);
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center space-x-2 text-primary mb-2">
          <ListChecks className="w-6 h-6" />
          <CardTitle className="font-headline text-2xl">Customize BRD Structure</CardTitle>
        </div>
        <CardDescription>
          Review and edit the Markdown template for your BRD. The AI will use this structure to generate the document.
          Use placeholders like <code>{'{{{problemStatement}}}'}</code>, <code>{'{{{chosenSolution}}}'}</code>, <code>{'{{{frontendStack}}}'}</code>, <code>{'{{{backendStack}}}'}</code>, and <code>{'{{{databaseStack}}}'}</code> where you want the AI to insert specific information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div>
          <Label htmlFor="brd-structure" className="sr-only">BRD Structure Template</Label>
          <Textarea
            id="brd-structure"
            placeholder="Enter your BRD Markdown template here..."
            value={structure}
            onChange={(e) => setStructure(e.target.value)}
            rows={15}
            className="text-sm font-mono"
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
          <Button onClick={onBack} variant="outline" disabled={isLoading} className="w-full sm:w-auto">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !structure.trim()} 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
               <ChevronRight className="mr-2 h-4 w-4" />
            )}
            Next: Generate BRD
          </Button>
        </div>
      </CardContent>
    </>
  );
}
