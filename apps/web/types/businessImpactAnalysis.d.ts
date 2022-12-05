export type Severity = {
  id: number,
  name: string,
}

export type BusinessImpactSeverityInfos = {
  icon: string
  color: string
  name: string
  severity: string
  description: string
}

export type BusinessImpact = {
  id: number
  name: string
}

export type FearedEvent = {
  id: number
  name: string
  severity?: string
  businessImpact: BusinessImpact[]
}

export type Vulnerabilities = {
  low: number
  medium: number
  high: number
  critical: number
}

export type BusinessUnit = {
  /**
   * // TODO: find difference between id and unitId
   */
  id: number
  name: string
  unitId: number
  fearedEvents: FearedEvent[]
}

export type BusinessMission = {
  /**
   * List of Business Units
   */
  children: {
    /**
     * Business unit id
     */
    id: number
    /**
     * Business mission unit
     */
    name: string
  }[]
  id: number
  last_update_date: string
  name: string
  owner: string
  type: 'MISSION'
  version: number
  vulnerabilities: Vulnerabilities
}

export type BusinessMissionAnalysis = {
  id: number,
  name: string,
  type: string,
  units: BusinessUnit[],
}
