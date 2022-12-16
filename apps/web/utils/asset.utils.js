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
        description: `No consequences for the organization's
        performance (possible margin consumption) and no impacts on
        health & safety, facilities or ecology`,
        icon: 'mdi-battery-outline',
        name: 'minor',
        severity: 'C1',
      }
    case 'C2':
      return {
        color: '#f0d802',
        description: `Limited consequences for the organization's
        performance (possible degraded mode of operation) and no
        impacts on health & safety, facilities or ecology`,
        icon: 'mdi-battery-30',
        name: 'significant',
        severity: 'C2',
      }
    case 'C3':
      return {
        color: '#ed9b0e',
        description: `Heavy consequences for the organization's
        performance or significant impacts on health & safety, facilities
        or ecology`,
        icon: 'mdi-battery-50',
        name: 'serious',
        severity: 'C3',
      }
    case 'C4':
      return {
        color: '#d92b2b',
        description: `Disastrous consequences for the organization
        (endangered survival) or serious impacts on health & safety,
        facilities or ecology`,
        icon: 'mdi-battery-80',
        name: 'critical',
        severity: 'C4',
      }
    case 'C5':
      return {
        color: '#941e1e',
        description: `Consequences beyond the organization
        level (regalian, sectorial) or critical impacts on health & safety,
        facilities or ecology`,
        icon: 'mdi-battery',
        name: 'catastrophic',
        severity: 'C5',
      }
    default:
      return {
        color: '#ddd',
        description: '',
        icon: '',
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
        description:
          'Inability to provide a service, degradation in operational performance, delays, impacts on production or distribution of goods and services, impossibility of implementing a key process.',
        name: 'organizations service',
      }
    case 'governance & decision':
      return {
        description:
          'Loss of sovereignty, loss or limitation of independence of judgement or decision, limitation of trading margins, loss of the capacity of influence, takeover of the organisation, forced change in strategy, loss of key suppliers or subcontractors.',
        name: 'governance & decision',
      }
    case 'financial':
      return {
        description:
          'Loss of turnover, loss of a market, unplanned expenses, drop in the stock market value, drop in income, imposed penalties.',
        name: 'financial',
      }
    case 'health & safety':
      return {
        description:
          'Occupational accident, occupational disease, loss of human life, placing in danger, health alert or crisis.',
        name: 'health & safety',
      }
    case 'intellectual property':
      return {
        description:
          'Loss of memory of the company (former projects, successes or failures), loss of implicit knowledge (know-how transmitted between generations, optimisation in the execution of tasks or processes), capturing innovative ideas, loss of scientific or technical heritage, loss of key human resources.',
        name: 'intellectual property',
      }
    case 'trust & image':
      return {
        description:
          'Publication of negative articles in the press, loss of credibility with customers, discontented shareholders, loss of notoriety, loss of user trust.',
        name: 'trust & image',
      }
    case 'ecological':
      return {
        description:
          'Radiological or chemical contamination of groundwater or the ground, discharge of pollutants into the atmosphere.',
        name: 'ecological',
      }
    case 'legal':
      return {
        description: 'Trial, fine, sentencing of a manager, contract amendment.',
        name: 'legal',
      }
    case 'facilities & equipment':
      return {
        description:
          'Destruction of premises or installations, damage to means of production, premature wear of equipment.',
        name: 'facilities & equipment',
      }
    case 'employee social link':
      return {
        description:
          'Loss of trust from employees in the sustainability of the organisation, exacerbation of a feelings or tensions between groups, drop in commitment, loss of the meaning of common values.',
        name: 'employee social link',
      }
    default:
      return {
        description: 'No description available',
        name: 'Unknown',
      }
  }
}

export const ASSET_TYPES = [
  { text: 'Server', type: 'SERVER' },
  { text: 'Web', type: 'WEB' },
  { text: 'Network', type: 'NETWORK' },
  { text: 'People', type: 'USER' },
  { text: 'Building', type: 'BUILDING' },
  { text: 'Policy', type: 'POLICY' },
  { text: 'Procedure', type: 'PROCEDURE' },
  { text: 'Business Unit', type: 'UNIT' },
  { text: 'Business Mission', type: 'MISSION' },
  { text: 'User group', type: 'USERGROUP' },
]

export const TECHNICAL_ASSET_TYPES = ['USER', 'SERVER', 'WEB']
export const SUPER_ASSET_TYPES = [
  'NETWORK',
  'BUILDING',
  'MISSION',
  'UNIT',
  'USERGROUP',
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
  BUILDING: { children: ['SERVER', 'USER'] },
  MISSION: { children: ['UNIT'] },
  NETWORK: { children: ['SERVER', 'WEB', 'USER', 'BUILDING'] },
  SERVER: { children: [] },
  UNIT: {
    children: ['NETWORK', 'WEB', 'USER', 'BUILDING', 'USERGROUP', 'SERVER'],
  },
  USER: { children: [] },
  USERGROUP: { children: ['USER'] },
  WEB: { children: [] },
}
Object.keys(allowedRelationsTypes).forEach((assetType) => {
  allowedRelationsTypes[assetType].parents = Object.keys(
    allowedRelationsTypes,
  ).filter((allowedType) => {
    return allowedRelationsTypes[allowedType].children.includes(assetType)
  })
})
export { allowedRelationsTypes }

/**
     * Return true if the asset is a super asset
     *
     * @returns {boolean}
     */
export const isSuperAsset = (assetType) => {
  return SUPER_ASSET_TYPES.includes(assetType)
}
