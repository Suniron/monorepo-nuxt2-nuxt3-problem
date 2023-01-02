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

export interface Asset {
  children: []
  gateway: null
  groups: []
  hostname: null
  id: number
  ips: []
  language: null
  last_update_date: null
  latitude: null
  location: null
  longitude: null
  mail: null
  mainIps: []
  name: string
  netmask: null
  network: null
  os: null
  owner: null
  parents: []
  phone_number: null
  position: null
  postal_address: null
  relations: []
  rev_cdate: null
  revision: null
  risk: {
    hasVulnerability: false
    lastScanDate: null
    scores: {
      /**
      * 0 - 10
      */
      compoundScore: number | null
      /**
      * 0 - 10
      */
      inherentScore: number | null
      /**
      * 0 - 10
      */
      inheritedScore: number | null
    }
    vulnerabilitiesCount: {
      critical: number
      high: number
      low: number
      medium: number
    }
  }
  tags: []
  tel: null
  type: AssetType
  url: null
  version: null
  vulnerabilities: {
    critical: number
    high: number
    low: number
    medium: number
  }
}

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
