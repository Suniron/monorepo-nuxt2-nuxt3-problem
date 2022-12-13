export type AssetType =
  | 'SERVER'
  | 'BUILDING'
  | 'USER'
  | 'UNIT'
  | 'NETWORK'
  | 'POLICY'
  | 'MISSION'
  | 'COMPLIANCE'
  | 'PROCEDURE'
  | 'WEB'

export interface AssetWithRelations {
  id: number
  name: string
  type: string
  childrenIds: number[]
  parentsIds: number[]
}

export interface BelongedAsset {
  id: number
  name: string
  type: string
  childrenIds: number[]
  parentsIds: number[]
  risk: {
    hasVulnerability: boolean
    vulnerabilitiesCount?: {
      low: number
      medium: number
      high: number
      critical: number
    }
    lastScanDate?: string
    scores: {
      /**
       * 0 - 10
       */
      compoundScore?: number
      /**
       * 0 - 10
       */
      inherentScore?: number
      /**
       * 0 - 10
       */
      inheritedScore?: number
    }
  }
}
