"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, FileText, BookOpen } from "lucide-react";
import PaperList from "./components/PaperList";
import TextAnalyzer from "./components/TextAnalyzer";
import type { Paper } from "./types";
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
function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [papers, setPapers] = useState<Paper[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const API_URL = getApiUrl();
      const response = await fetch(
        `${API_URL}/api/papers/search/?query=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error("Failed to fetch papers");
      const data = await response.json();
      setPapers(data);
    } catch (error) {
      console.error("Error searching papers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                ArXiv Summarizer
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="search">
              <Search className="h-4 w-4 mr-2" />
              Search Papers
            </TabsTrigger>
            <TabsTrigger value="analyze">
              <BookOpen className="h-4 w-4 mr-2" />
              Analyze Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Search ArXiv Papers</CardTitle>
                <CardDescription>
                  Search for papers and view their AI-generated summaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex w-full max-w-lg mx-auto items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter keywords (e.g., 'machine learning')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <PaperList papers={papers} loading={loading} />
          </TabsContent>

          <TabsContent value="analyze">
            <TextAnalyzer />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;
