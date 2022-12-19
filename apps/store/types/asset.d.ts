export type Asset = {
  id: number
  owner: string
  maintainer: string
  group_id: number
  company_id: number
  name: string
  type: string
}

export type MainIps = {
  address: string 
  id: number
  iface: string
  mac:  string
  mask: string
}
export type Server = {
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