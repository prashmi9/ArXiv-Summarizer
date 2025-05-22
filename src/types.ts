export interface Paper {
  id: string
  arxiv_id: string
  title: string
  authors: string[]
  abstract: string
  summary: string
  categories: string[]
  published_date: string
}

export interface AnalysisResult {
  summary: string
  insights: string[]
  sentiment: string
  topics: string[]
}
