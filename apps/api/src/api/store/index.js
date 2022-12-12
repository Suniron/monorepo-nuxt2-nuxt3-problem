// ts-check
import https from 'https'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { requestPassThroughService } from './passthrough'
import env from '@/config/env'
import {
  requestAddPostVulnerabilityAsset,
  requestCreateAsset,
  requestCreateAssetVulnerability,
  requestDeleteAsset,
  requestDeleteAssetsBulk,
  requestFetchAssetPorts,
  requestGetAssetRisk,
  requestImportCsv,
  requestSearchAssetRevisions,
  requestSearchAssetVulnerabilities,
  requestSearchAssets,
  requestSearchAssetsBelonging,
  requestSearchPostVulnerabilityAsset,
  requestUpdateAsset,
  requestUpdateAssetsBulk,
  requestUpdateStatus,
} from '@/api/store/assets'
import {
  requestIsAuthorized,
  requestLogin,
  requestLogout,
  requestRefreshToken,
  requestSendResetPasswordMail,
  requestUpdateResetPasswordByToken,
} from '@/api/store/auth'
import {
  requestCreateRemediationProjectPostsService,
  requestFetchPosts,
} from '@/api/store/blog'
import {
  requestCreateGroup,
  requestDeleteGroup,
  requestSearchGroups,
  requestUpdateGroup,
} from '@/api/store/groups'
import { requestSearchProbes, requestUpdateProbes } from '@/api/store/probes'
import {
  requestCreateBulkRelation,
  requestCreateRelation,
  requestDeleteRelation,
  requestDeleteRelationByAssetsIds,
  requestUpdateRelation,
} from '@/api/store/relations'
import { requestGenerate } from '@/api/store/reports'
import {
  requestParseScanResult,
  requestScanReport,
  requestSearchPhishingScenarios,
  requestSearchScanAssets,
  requestUpdateScan,
  scheduleNetworkScanStoreAPI,
  scheduleScanStoreAPI,
  scheduleWebScanStoreAPI,
  searchScansStoreAPI,
} from '@/api/store/scans'
import {
  requestCreateTag,
  requestDeleteTag,
  requestSearchTags,
} from '@/api/store/tags'
import {
  createUser,
  requestDeleteUser,
  requestSearchUsers,
  requestUpdateUser,
} from '@/api/store/users'
import {
  requestCreateVulnerability,
  requestDeleteVuln,
  requestSearchVulnerabilities,
  requestSearchVulnerabilitiesWithTheirAssets,
  requestUpdatePortVuln,
} from '@/api/store/vulnerabilities'
import {
  requestChartsData,
  requestFetchDashboard,
  requestUpdateDashboardUser,
} from '@/api/store/dashboard'
import {
  requestBusinessImpactService,
  requestMissionAnalysisService,
  requestSeveritiesService,
  requestUpdateBusinessImpactServiceIntoUnit,
  requestUpdateFearedEventSeverityService,
} from '@/api/store/missions_analysis'
import { requestGetAvailableTransitions } from '@/api/store/project-statuses'
import {
  requestCreateRemediationProjects,
  requestGetRemediationProjectComments,
  requestGetRemediationProjectStatusHistory,
  requestGetRemediationProjects,
  requestGetRemediationProjectsScope,
  requestGetRemediationProjectsSummary,
  requestSearchProjectPrioritiesService,
  requestUpdateRemediationProjectScopeItemService,
  requestUpdateRemediationProjectScopeService,
  requestUpdateRemediationProjects,
} from '@/api/store/remediationProjects'
import {
  requestAddCartographyElement,
  requestCreateCartography,
  requestDeleteCartography,
  requestDeleteCartographyElement,
  requestFetchCartographies,
  requestFetchCartographyElements,
  requestUpdateCartography,
  requestUpdateCartographyElement,
} from '@/api/store/cartography'
import {
  requestCreateCompany,
  requestDeleteCompanyLogo,
  requestGetCompanyRisk,
  requestSearchCompanies,
  requestSearchCompanyLogo,
  requestUpdateCompany,
  requestUpdateCompanyLogo,
} from '@/api/store/companies'
import {
  requestDownloadFile,
  requestProcessCSV,
  requestUploadFiles,
} from '@/api/store/file_upload'
import { createIpStore, deleteIpStore, updateIpStore } from '@/api/store/ips'
import { requestFetchCompliance } from '@/api/store/self-assessment'
import { requestGroupedRemediationsService } from '@/api/store/remediations'
import { getPhishingScenariosDomainsFromStore } from '@/api/store/phishing-scenarios-domains'
import { log } from '@/lib/logger'
const httpsEnabled
  = fs.existsSync(path.resolve(__dirname, '../../../secrets', 'api_cert.pem'))
  && fs.existsSync(path.resolve(__dirname, '../../../secrets', 'api_key.pem'))

if (env.nodeEnv.isProduction && !httpsEnabled) {
  log.warn(
    'Building for production without certificate. Please provide both `api_cert.pem` and `api_key.pem` files.',
  )
}

let httpsAgent

if (httpsEnabled) {
  const readConfigFile = filename =>
    fs.readFileSync(path.resolve(__dirname, '../../../secrets', filename)) // Read 'secrets' folder in the project's root folder
  httpsAgent = new https.Agent({
    ca: readConfigFile('api_cert.pem'),
    cert: readConfigFile('api_cert.pem'),
    key: readConfigFile('api_key.pem'),
    rejectUnauthorized: env.nodeEnv.isDevelopment,
  })
}

const storeAPIHandler = axios.create({
  baseURL: env.store.baseURL,
  httpsAgent,
})

const provider = { axios: storeAPIHandler, logger: console }

export const passThroughApi = {
  passThrough: (path, method, query, body, accessToken) =>
    requestPassThroughService(provider, path, method, query, body, accessToken),
}

export const missionsAPIs = {
  searchBusinessImpactService: (params, accessToken) =>
    requestBusinessImpactService(provider, params, accessToken),
  searchMissionAnalysisService: (params, accessToken) =>
    requestMissionAnalysisService(provider, params, accessToken),
  searchSeveritiesService: (params, accessToken) =>
    requestSeveritiesService(provider, params, accessToken),
  updateBusinessImpactServiceIntoUnit: (id, body, accessToken) =>
    requestUpdateBusinessImpactServiceIntoUnit(provider, id, body, accessToken),
  updateFearedEventSeverityService: (id, body, accessToken) =>
    requestUpdateFearedEventSeverityService(provider, id, body, accessToken),
}
export const projectStatusesAPIs = {
  getAvailableTransitionsService: (params, accessToken) =>
    requestGetAvailableTransitions(provider, params, accessToken),
}

export const remediationProjectsAPIs = {
  createRemediationProjectsService: (params, accessToken) =>
    requestCreateRemediationProjects(provider, params, accessToken),
  getRemediationProjectCommentsService: (id, params, accessToken) =>
    requestGetRemediationProjectComments(provider, id, params, accessToken),
  getRemediationProjectStatusHistoryService: (id, params, accessToken) =>
    requestGetRemediationProjectStatusHistory(
      provider,
      id,
      params,
      accessToken,
    ),
  getRemediationProjectsScopeService: (params, accessToken) =>
    requestGetRemediationProjectsScope(provider, params, accessToken),
  getRemediationProjectsService: (params, accessToken) =>
    requestGetRemediationProjects(provider, params, accessToken),
  getRemediationProjectsSummaryService: (params, accessToken) =>
    requestGetRemediationProjectsSummary(provider, params, accessToken),
  searchProjectPrioritiesService: (params, accessToken) =>
    requestSearchProjectPrioritiesService(provider, params, accessToken),
  updateRemediationProjectScopeItemService: (params, body, accessToken) =>
    requestUpdateRemediationProjectScopeItemService(
      provider,
      params,
      body,
      accessToken,
    ),
  updateRemediationProjectScopeService: (params, body, accessToken) =>
    requestUpdateRemediationProjectScopeService(
      provider,
      params,
      body,
      accessToken,
    ),
  updateRemediationProjectsService: (id, body, accessToken) =>
    requestUpdateRemediationProjects(provider, id, body, accessToken),
}
export const groupedRemediationsAPIs = {
  searchGroupedRemediationsService: accessToken =>
    requestGroupedRemediationsService(provider, accessToken),
}

export const ipsAPIs = {
  createIp: (body, accessToken, assetId) =>
    createIpStore(provider, body, accessToken, assetId),
  deleteIp: (params, accessToken) =>
    deleteIpStore(provider, params, accessToken),
  updateIp: (body, accessToken, id) =>
    updateIpStore(provider, body, accessToken, id),
}

export const assetsAPIs = {
  addPostVulnerabilityAsset: (aid, vid, params, accessToken) =>
    requestAddPostVulnerabilityAsset(provider, aid, vid, params, accessToken),
  createAsset: (params, accessToken) =>
    requestCreateAsset(provider, params, accessToken),
  createAssetVulnerability: (id, params, accessToken) =>
    requestCreateAssetVulnerability(provider, id, params, accessToken),
  deleteAsset: (id, accessToken) =>
    requestDeleteAsset(provider, id, accessToken),
  deleteAssetsBulk: (params, accessToken) =>
    requestDeleteAssetsBulk(provider, params, accessToken),
  deleteVuln: (body, params, accessToken) =>
    requestDeleteVuln(provider, body, params, accessToken),
  fetchAssetPorts: (assetId, accessToken) =>
    requestFetchAssetPorts(provider, assetId, accessToken),
  getAssetRisk: (assetId, accessToken) =>
    requestGetAssetRisk(provider, assetId, accessToken),
  importCSV: (params, accessToken) =>
    requestImportCsv(provider, params, accessToken),
  searchAssetRevisions: (id, params, accessToken) =>
    requestSearchAssetRevisions(provider, id, params, accessToken),
  searchAssetVulnerabilities: (id, params, accessToken) =>
    requestSearchAssetVulnerabilities(provider, id, params, accessToken),
  searchAssets: (params, accessToken) =>
    requestSearchAssets(provider, params, accessToken),
  searchAssetsBelonging: (params, accessToken) =>
    requestSearchAssetsBelonging(provider, params, accessToken),
  searchPostVulnerabilityAsset: (aid, vid, accessToken) =>
    requestSearchPostVulnerabilityAsset(provider, aid, vid, accessToken),
  updateAsset: (id, params, accessToken) =>
    requestUpdateAsset(provider, id, params, accessToken),
  updateAssetsBulk: (params, accessToken) =>
    requestUpdateAssetsBulk(provider, params, accessToken),
  updatePortVuln: (body, params, accessToken) =>
    requestUpdatePortVuln(provider, body, params, accessToken),
  updateStatus: (aid, vid, params, accessToken) =>
    requestUpdateStatus(provider, aid, vid, params, accessToken),
}

export const authAPIs = {
  isAuthorized: accessToken => requestIsAuthorized(provider, accessToken),
  login: params => requestLogin(provider, params),
  logout: accessToken => requestLogout(provider, accessToken),
  refreshToken: (refreshToken, accessToken) =>
    requestRefreshToken(provider, refreshToken, accessToken),
  sendResetPasswordMail: params =>
    requestSendResetPasswordMail(provider, params),
  updateResetPasswordByToken: params =>
    requestUpdateResetPasswordByToken(provider, params),
}

export const postsAPIs = {
  CreateRemediationProjectPostsService: (id, body, accessToken) =>
    requestCreateRemediationProjectPostsService(
      provider,
      id,
      body,
      accessToken,
    ),
  fetchPosts: accessToken => requestFetchPosts(provider, accessToken),
}

export const cartographiesAPIs = {
  addCartographyElement: (id, params, accessToken) =>
    requestAddCartographyElement(provider, id, params, accessToken),
  createCartography: (params, accessToken) =>
    requestCreateCartography(provider, params, accessToken),
  deleteCartography: (id, accessToken) =>
    requestDeleteCartography(provider, id, accessToken),
  deleteCartographyElement: (id, eid, accessToken) =>
    requestDeleteCartographyElement(provider, id, eid, accessToken),
  fetchCartographies: accessToken =>
    requestFetchCartographies(provider, accessToken),
  fetchCartographyElements: (id, accessToken) =>
    requestFetchCartographyElements(provider, id, accessToken),
  updateCartography: (id, params, accessToken) =>
    requestUpdateCartography(provider, id, params, accessToken),
  updateCartographyElement: (id, eid, params, accessToken) =>
    requestUpdateCartographyElement(provider, id, eid, params, accessToken),
}

export const companiesAPIs = {
  createCompany: (params, accessToken) =>
    requestCreateCompany(provider, params, accessToken),
  deleteCompanyLogo: (params, accessToken) =>
    requestDeleteCompanyLogo(provider, params, accessToken),
  getCompanyRisk: accessToken => requestGetCompanyRisk(provider, accessToken),
  searchCompanies: (params, accessToken) =>
    requestSearchCompanies(provider, params, accessToken),

  searchCompanyLogo: (params, accessToken) =>
    requestSearchCompanyLogo(provider, params, accessToken),

  updateCompany: (params, accessToken) =>
    requestUpdateCompany(provider, params, accessToken),
  /**
   *
   * @param {{logo:string}} params
   * @param {string} accessToken
   * @returns
   */
  updateCompanyLogo: (params, accessToken) =>
    requestUpdateCompanyLogo(provider, params, accessToken),
}

export const dashboardAPIs = {
  fetchDashboard: accessToken => requestFetchDashboard(provider, accessToken),
  getChartsData: (params, accessToken) =>
    requestChartsData(provider, params, accessToken),
  updateDashboardUser: (id, params, accessToken) =>
    requestUpdateDashboardUser(provider, id, params, accessToken),
}

export const groupsAPIs = {
  createGroup: (params, accessToken) =>
    requestCreateGroup(provider, params, accessToken),
  deleteGroup: (params, accessToken) =>
    requestDeleteGroup(provider, params, accessToken),
  searchGroups: (params, accessToken) =>
    requestSearchGroups(provider, params, accessToken),
  updateGroup: (params, accessToken) =>
    requestUpdateGroup(provider, params, accessToken),
}

export const probesAPIs = {
  searchProbes: (params, accessToken) =>
    requestSearchProbes(provider, params, accessToken),
  updateProbes: (params, body, accessToken) =>
    requestUpdateProbes(provider, params, body, accessToken),
}

export const relationsAPIs = {
  createBulkRelation: (params, accessToken) =>
    requestCreateBulkRelation(provider, params, accessToken),
  createRelation: (params, accessToken) =>
    requestCreateRelation(provider, params, accessToken),
  deleteRelation: (id, accessToken) =>
    requestDeleteRelation(provider, id, accessToken),
  deleteRelationByAssetsIds: (params, accessToken) =>
    requestDeleteRelationByAssetsIds(provider, params, accessToken),
  updateRelation: (id, params, accessToken) =>
    requestUpdateRelation(provider, id, params, accessToken),
}

export const reportsAPIs = {
  generate: accessToken => requestGenerate(provider, accessToken),
}

export const scanAPIs = {
  getScanDetails: (id, accessToken) =>
    requestScanReport(provider, id, accessToken),
  getScanReport: (id, accessToken) =>
    requestScanReport(provider, id, accessToken),
  parseScanResult: (params, accessToken) =>
    requestParseScanResult(provider, params, accessToken),
  scheduleNetworkScanStoreAPI: (params, accessToken) =>
    scheduleNetworkScanStoreAPI(provider, params, accessToken),
  scheduleScanStoreAPI: (params, accessToken) =>
    scheduleScanStoreAPI(provider, params, accessToken),
  scheduleWebScanStoreAPI: (params, accessToken) =>
    scheduleWebScanStoreAPI(provider, params, accessToken),
  searchPhishingScenarios: accessToken =>
    requestSearchPhishingScenarios(provider, accessToken),
  searchScanAssets: accessToken =>
    requestSearchScanAssets(provider, accessToken),
  searchScansStoreAPI: (params, accessToken) =>
    searchScansStoreAPI(provider, params, accessToken),
  updateScan: (id, params, accessToken) =>
    requestUpdateScan(provider, id, params, accessToken),
}

export const tagsAPIs = {
  createTag: (params, accessToken) =>
    requestCreateTag(provider, params, accessToken),
  deleteTag: (id, accessToken) => requestDeleteTag(provider, id, accessToken),
  searchTags: (params, accessToken) =>
    requestSearchTags(provider, params, accessToken),
}

export const userAPIs = {
  createUser: (params, accessToken) =>
    createUser(provider, params, accessToken),
  deleteUser: (id, accessToken) => requestDeleteUser(provider, id, accessToken),
  searchUsers: (params, accessToken) =>
    requestSearchUsers(provider, params, accessToken),
  updateUser: (params, accessToken) =>
    requestUpdateUser(provider, params, accessToken),
}

export const vulnerabilitiesAPIs = {
  createVulnerability: (params, accessToken) =>
    requestCreateVulnerability(provider, params, accessToken),
  searchVulnerabilities: (params, accessToken) =>
    requestSearchVulnerabilities(provider, params, accessToken),
  searchVulnerabilitiesWithTheirAssets: (params, accessToken) =>
    requestSearchVulnerabilitiesWithTheirAssets(provider, params, accessToken),
}

export const fileAPIs = {
  downloadFile: (id, accessToken) =>
    requestDownloadFile(provider, id, accessToken),
  processCSV: accessToken => requestProcessCSV(provider, accessToken),
  uploadFiles: (params, accessToken) =>
    requestUploadFiles(provider, params, accessToken),
}

export const complianceAPIs = {
  fetchCompliance: (params, accessToken) =>
    requestFetchCompliance(provider, params, accessToken),
}

export const getPhishingScenariosDomainsAPIs = {
  getDomains: (params, accessToken) =>
    getPhishingScenariosDomainsFromStore(provider, params, accessToken),
}
