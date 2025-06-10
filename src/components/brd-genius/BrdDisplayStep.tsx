"use client";

import type React from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { downloadTextFile, downloadMarkdownFile } from '@/lib/download';
import { FileText, Download, RefreshCw } from "lucide-react";

interface BrdDisplayStepProps {
  brd: string;
  isLoading: boolean;
  onRestart: () => void;
  fileName: string;
}

export function BrdDisplayStep({ brd, isLoading, onRestart, fileName }: BrdDisplayStepProps) {
  
  const handleDownloadTxt = () => {
    downloadTextFile(fileName, brd);
  };

  const handleDownloadMd = () => {
    downloadMarkdownFile(fileName, brd);
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center space-x-2 text-accent mb-2">
          <FileText className="w-6 h-6" />
          <CardTitle className="font-headline text-2xl">Business Requirements Document</CardTitle>
        </div>
        <CardDescription>
          Here is your generated BRD. You can review it and download it in your preferred format.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center">Generating your BRD, please wait...</p>
            <Progress value={50} className="w-full animate-pulse" /> {}
          </div>
        )}
        
        {!isLoading && brd && (
          <ScrollArea className="h-96 w-full rounded-md border p-4 bg-muted/20">
            <pre className="text-sm whitespace-pre-wrap font-code">{brd}</pre>
          </ScrollArea>
        )}

        {!isLoading && !brd && (
          <div className="text-center text-muted-foreground py-8">
            <p>BRD generation failed or no content was produced.</p>
            <p>Please try starting over.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
          <Button onClick={onRestart} variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
          {!isLoading && brd && (
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <Button onClick={handleDownloadTxt} variant="secondary" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Download as TXT
              </Button>
              <Button onClick={handleDownloadMd} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                <Download className="mr-2 h-4 w-4" />
                Download as Markdown
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </>
  );
}
