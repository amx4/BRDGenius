
"use client";

import type React from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { downloadTextFile, downloadMarkdownFile, downloadDocxFile } from '@/lib/download';
import { FileText, Download, RefreshCw, FileType } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface BrdDisplayStepProps {
  brdContent: string;
  isLoading: boolean;
  onRestart: () => void;
  fileName: string;
  onBrdContentChange: (newContent: string) => void;
}

export function BrdDisplayStep({ brdContent, isLoading, onRestart, fileName, onBrdContentChange }: BrdDisplayStepProps) {
  const { toast } = useToast();

  const handleDownloadTxt = () => {
    downloadTextFile(fileName, brdContent);
    toast({ title: "Downloaded TXT", description: `${fileName}.txt has been downloaded.` });
  };

  const handleDownloadMd = () => {
    downloadMarkdownFile(fileName, brdContent);
    toast({ title: "Downloaded Markdown", description: `${fileName}.md has been downloaded.` });
  };

  const handleDownloadDocx = async () => {
    try {
      await downloadDocxFile(fileName, brdContent);
      toast({ title: "Downloaded DOCX", description: `${fileName}.docx has been downloaded.` });
    } catch (error) {
      console.error("Error generating or downloading DOCX file:", error);
      toast({
        title: "DOCX Download Error",
        description: "Failed to download DOCX. Try another format or check browser console.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center space-x-2 text-accent mb-2">
          <FileText className="w-6 h-6" />
          <CardTitle className="font-headline text-2xl">Your Generated BRD</CardTitle>
        </div>
        <CardDescription>
          Review and edit your Business Requirements Document below. You can then download it in your preferred format.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center">Generating your BRD, please wait...</p>
            <Progress value={50} className="w-full animate-pulse" />
          </div>
        )}
        
        {!isLoading && (brdContent || brdContent === '') && ( // Show textarea even if brdContent is initially empty after loading
           <Textarea
            value={brdContent}
            onChange={(e) => onBrdContentChange(e.target.value)}
            placeholder="Your BRD will appear here..."
            rows={18}
            className="text-sm font-mono bg-muted/20 resize-y"
            aria-label="Generated Business Requirements Document"
          />
        )}

        {!isLoading && !brdContent && brdContent !== '' && ( // Only show this if loading is false AND brdContent is truly null/undefined (not just empty string)
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
          {!isLoading && (
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full sm:w-auto justify-end">
              <Button onClick={handleDownloadTxt} variant="secondary" className="w-full sm:w-auto" disabled={!brdContent}>
                <Download className="mr-2 h-4 w-4" />
                TXT
              </Button>
              <Button onClick={handleDownloadMd} variant="secondary" className="w-full sm:w-auto" disabled={!brdContent}>
                <Download className="mr-2 h-4 w-4" />
                Markdown
              </Button>
              <Button onClick={handleDownloadDocx} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!brdContent}>
                <FileType className="mr-2 h-4 w-4" />
                DOCX
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </>
  );
}
