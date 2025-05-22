"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import type { Paper } from "../types"

interface PaperListProps {
  papers: Paper[]
  loading: boolean
}

export default function PaperList({ papers, loading }: PaperListProps) {
  const [expandedPapers, setExpandedPapers] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedPapers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (papers.length === 0) {
    return (
      <Card className="w-full text-center py-12">
        <CardContent>
          <p className="text-gray-500">No papers found. Try a different search query.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {papers.map((paper) => (
        <Card key={paper.id} className="w-full">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{paper.title}</CardTitle>
                <CardDescription className="mt-1">
                  {paper.authors.join(", ")} • {new Date(paper.published_date).toLocaleDateString()}
                </CardDescription>
              </div>
              <a
                href={`https://arxiv.org/abs/${paper.arxiv_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                ArXiv
              </a>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {paper.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-1">Abstract</h4>
                <p className="text-sm text-gray-700">
                  {expandedPapers[paper.id]
                    ? paper.abstract
                    : `${paper.abstract.substring(0, 200)}${paper.abstract.length > 200 ? "..." : ""}`}
                </p>
                {paper.abstract.length > 200 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(paper.id)}
                    className="mt-1 h-6 px-2 text-xs text-blue-600"
                  >
                    {expandedPapers[paper.id] ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" /> Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" /> Show More
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-1">AI Summary</h4>
                <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-md border border-blue-100">
                  {paper.summary}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
