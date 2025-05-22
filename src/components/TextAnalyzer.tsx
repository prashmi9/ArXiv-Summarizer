"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Sparkles,
  FileText,
  MessageSquare,
  Paperclip,
  ArrowUp,
} from "lucide-react";
import type { AnalysisResult } from "../types";
import { toast } from "@/components/ui/use-toast";
// Define a default API URL to use as fallback
const DEFAULT_API_URL = "http://localhost:8000";

// Helper function to safely get the API URL
const getApiUrl = () => {
  try {
    // Check if import.meta is defined
    if (
      typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_API_URL
    ) {
      return import.meta.env.VITE_API_URL;
    }
  } catch (error) {
    console.warn("Error accessing environment variables:", error);
  }

  // Fallback to default URL
  return DEFAULT_API_URL;
};

export default function TextAnalyzer() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/analyze/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Failed to analyze text");
      const data = await response.json();
      setResult(data);
      toast({
        title: "Analysis complete",
        description: "Text has been analyzed successfully.",
      });
    } catch (error) {
      console.error("Error analyzing text:", error);
      toast({
        title: "Error",
        description: "Failed to analyze text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is a text file
    if (
      !file.type.match("text.*") &&
      !file.name.endsWith(".txt") &&
      !file.name.endsWith(".md")
    ) {
      toast({
        title: "Invalid file type",
        description: "Please upload a text file (UTF-8 encoded)",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
      toast({
        title: "File uploaded",
        description: `${file.name} has been loaded successfully.`,
      });
    };
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Failed to read the uploaded file",
        variant: "destructive",
      });
    };
    reader.readAsText(file, "UTF-8");

    // Reset the file input
    if (event.target) {
      event.target.value = "";
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Text</CardTitle>
          <CardDescription>
            Enter any text or upload a text file to analyze it using our text
            analysis service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Textarea
              placeholder="Enter text to analyze (e.g., a research abstract or article)"
              className="min-h-[200px] mb-4 pr-20"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="absolute bottom-6 right-3 flex items-center gap-2">
              <button
                onClick={triggerFileUpload}
                className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                title="Upload text file"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Analyze text"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md,text/plain,text/markdown"
              className="hidden"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze Text
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">
                  <FileText className="h-4 w-4 mr-2" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="insights">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Insights
                </TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="mt-4">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h4 className="font-medium mb-2">Summary</h4>
                  <p className="text-gray-700">{result.summary}</p>
                </div>
              </TabsContent>
              <TabsContent value="insights" className="mt-4">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h4 className="font-medium mb-2">Key Insights</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {result.insights.map((insight, index) => (
                      <li key={index} className="text-gray-700">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
