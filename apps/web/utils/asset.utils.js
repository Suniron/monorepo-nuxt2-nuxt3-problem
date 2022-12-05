/** @typedef {import("~/types/businessImpactAnalysis").BusinessImpactSeverityInfos} BusinessImpactSeverityInfos */

/**
 * Give infos about a given Business Impact Code
 *
 * @param {string} businessImpactSeverityCode Business Impact Severity code (like C1, C2, C3, etc)
 *
 * @returns {BusinessImpactSeverityInfos}
 */
export const getBusinessSeverityInfos = (businessImpactSeverityCode) => {
  switch (businessImpactSeverityCode.toUpperCase()) {
    case 'C1':
      return {
        color: 'blue',
        name: 'minor',
        severity: 'C1',
        icon: 'mdi-battery-outline',
        description: `No consequences for the organization's
        performance (possible margin consumption) and no impacts on
        health & safety, facilities or ecology`
      }
    case 'C2':
      return {
        color: '#f0d802',
        name: 'significant',
        severity: 'C2',
        icon: 'mdi-battery-30',
        description: `Limited consequences for the organization's
        performance (possible degraded mode of operation) and no
        impacts on health & safety, facilities or ecology`
      }
    case 'C3':
      return {
        color: '#ed9b0e',
        name: 'serious',
        severity: 'C3',
        icon: 'mdi-battery-50',
        description: `Heavy consequences for the organization's
        performance or significant impacts on health & safety, facilities
        or ecology`
      }
    case 'C4':
      return {
        color: '#d92b2b',
        name: 'critical',
        severity: 'C4',
        icon: 'mdi-battery-80',
        description: `Disastrous consequences for the organization
        (endangered survival) or serious impacts on health & safety,
        facilities or ecology`
      }
    case 'C5':
      return {
        color: '#941e1e',
        name: 'catastrophic',
        severity: 'C5',
        icon: 'mdi-battery',
        description: `Consequences beyond the organization
        level (regalian, sectorial) or critical impacts on health & safety,
        facilities or ecology`
      }
    default:
      return {
        color: '#ddd',
        icon: '',
        description: ''
      }
  }
}

/** @typedef {import("~/types/assets").BusinessImpactInfos} BusinessImpactInfos */

/**
 * Give infos about a given Business Impact
 *
 * @param {string} businessImpactName Business Impact name
 *
 * @returns {BusinessImpactInfos}
 */
export const getBusinessImpactInfos = (businessImpactName) => {
  switch (businessImpactName.toLowerCase()) {
    case 'organizations service':
      return {
        name: 'organizations service',
        description:
          'Inability to provide a service, degradation in operational performance, delays, impacts on production or distribution of goods and services, impossibility of implementing a key process.'
      }
    case 'governance & decision':
      return {
        name: 'governance & decision',
        description:
          'Loss of sovereignty, loss or limitation of independence of judgement or decision, limitation of trading margins, loss of the capacity of influence, takeover of the organisation, forced change in strategy, loss of key suppliers or subcontractors.'
      }
    case 'financial':
      return {
        name: 'financial',
        description:
          'Loss of turnover, loss of a market, unplanned expenses, drop in the stock market value, drop in income, imposed penalties.'
      }
    case 'health & safety':
      return {
        name: 'health & safety',
        description:
          'Occupational accident, occupational disease, loss of human life, placing in danger, health alert or crisis.'
      }
    case 'intellectual property':
      return {
        name: 'intellectual property',
        description:
          'Loss of memory of the company (former projects, successes or failures), loss of implicit knowledge (know-how transmitted between generations, optimisation in the execution of tasks or processes), capturing innovative ideas, loss of scientific or technical heritage, loss of key human resources.'
      }
    case 'trust & image':
      return {
        name: 'trust & image',
        description:
          'Publication of negative articles in the press, loss of credibility with customers, discontented shareholders, loss of notoriety, loss of user trust.'
      }
    case 'ecological':
      return {
        name: 'ecological',
        description:
          'Radiological or chemical contamination of groundwater or the ground, discharge of pollutants into the atmosphere.'
      }
    case 'legal':
      return {
        name: 'legal',
        description: 'Trial, fine, sentencing of a manager, contract amendment.'
      }
    case 'facilities & equipment':
      return {
        name: 'facilities & equipment',
        description:
          'Destruction of premises or installations, damage to means of production, premature wear of equipment.'
      }
    case 'employee social link':
      return {
        name: 'employee social link',
        description:
          'Loss of trust from employees in the sustainability of the organisation, exacerbation of a feelings or tensions between groups, drop in commitment, loss of the meaning of common values.'
      }
    default:
      return {
        name: 'Unknown',
        description: 'No description available'
      }
  }
}

export const ASSET_TYPES = [
  { type: 'SERVER', text: 'Server' },
  { type: 'WEB', text: 'Web' },
  { type: 'NETWORK', text: 'Network' },
  { type: 'USER', text: 'People' },
  { type: 'BUILDING', text: 'Building' },
  { type: 'POLICY', text: 'Policy' },
  { type: 'PROCEDURE', text: 'Procedure' },
  { type: 'UNIT', text: 'Business Unit' },
  { type: 'MISSION', text: 'Business Mission' },
  { type: 'USERGROUP', text: 'User group' }
]

export const TECHNICAL_ASSET_TYPES = ['USER', 'SERVER', 'WEB']
export const SUPER_ASSET_TYPES = [
  'NETWORK',
  'BUILDING',
  'MISSION',
  'UNIT',
  'USERGROUP'
]

/**
 * @type {{
 *  [type: string]: {
 *    parents: string[],
 *    children: string[]
 *  };
 * }}
 */
const allowedRelationsTypes = {
  UNIT: {
    children: ['NETWORK', 'WEB', 'USER', 'BUILDING', 'USERGROUP', 'SERVER']
  },
  MISSION: { children: ['UNIT'] },
  SERVER: { children: [] },
  WEB: { children: [] },
  NETWORK: { children: ['SERVER', 'WEB', 'USER', 'BUILDING'] },
  USER: { children: [] },
  BUILDING: { children: ['SERVER', 'USER'] },
  USERGROUP: { children: ['USER'] }
}
Object.keys(allowedRelationsTypes).forEach((assetType) => {
  allowedRelationsTypes[assetType].parents = Object.keys(
    allowedRelationsTypes
  ).filter((allowedType) => {
    return allowedRelationsTypes[allowedType].children.includes(assetType)
  })
})
export { allowedRelationsTypes }
