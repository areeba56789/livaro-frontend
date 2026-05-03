export interface RAGRequest {
  query: string;
}

export interface KeyMetrics {
  predicted_appreciation_pct: number;
  estimated_rental_yield_pct: number;
  avg_price_per_sqft: number;
  sentiment_score_1_to_10: number;
}

export interface WhyMatrixItem {
  factor: string;
  math_breakdown: string;
  confidence_level: string;
  sources: string[];
}

export interface ChartDataPoint {
  period: string;
  value: number;
}

export interface AnalysisReport {
  summary: string;
  key_metrics: KeyMetrics;
  why_matrix: WhyMatrixItem[];
  chart_data: ChartDataPoint[];
}
