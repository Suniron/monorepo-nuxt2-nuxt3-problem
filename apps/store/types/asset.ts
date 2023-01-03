export interface Asset {
  id: number
  owner: string
  maintainer: string
  group_id: number
  company_id: number
  name: string
  type: string
}

export interface MainIps {
  address: string
  id: number
  iface: string
  mac: string
  mask: string
}
export interface Server {
  id: number
  type: string | null
  os: string | null
  os_version: string | null
  os_build: string | null
  hostname: string | null
  o365_id: string | null
  aad_device_id: string | null
  first_seen: Date | null
  last_seen: Date | null
  os_processor: string | null
  architecture: string | null
  health_status: string | null
  external_address: string | null
  defender_av_status: string | null
  is_ad_joined: boolean | null
  onboarding_status: string | null
  managed_by: string | null
  managed_by_status: string | null
  mainIps: [MainIps] | []
}

export type TechnicalAssetType = 'USER' | 'SERVER' | 'WEB'
export type SuperAssetType = 'NETWORK' | 'BUILDING' | 'MISSION' | 'UNIT' | 'USERGROUP'
export type RelationType = 'BELONGS_TO' | 'CONNECTED_TO' | 'LOCATED_TO' | 'OWN_BY' | 'MAINTAINED_BY' | null
export interface LightAsset {
  id: number
  type: TechnicalAssetType | SuperAssetType
}
export interface LightRelation {
  id: number
  type: RelationType
  to_asset_id: number
  from_asset_id: number
}

export interface InherentRiskScore {
  asset_id: number
  inherentRisk: number | null
}
