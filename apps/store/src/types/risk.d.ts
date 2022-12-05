export type AssetRisk = {
  lastScanDate: Date | null
  scores: AssetRiskScores
}

export type AssetRiskScores = {
  inherentScore: number | null
  inheritedScore: number | null
  compoundScore: number | null
}
