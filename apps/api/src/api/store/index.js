// ts-check
import axios from 'axios'
import env from '@/config/env'
import https from 'https'
import fs from 'fs'
import path from 'path'
import {
  requestCreateAsset,
  requestDeleteAsset,
  requestSearchAssets,
  requestUpdateAsset,
  requestUpdateAssetsBulk,
  requestDeleteAssetsBulk,
  requestSearchAssetVulnerabilities,
  requestUpdateStatus,
  requestSearchPostVulnerabilityAsset,
  requestAddPostVulnerabilityAsset,
  requestSearchAssetRevisions,
  requestImportCsv,
  requestFetchAssetPorts,
  requestCreateAssetVulnerability,
  requestSearchAssetsBelonging,
  requestGetAssetRisk,
} from '@/api/store/assets'
import {
  requestLogin,
  requestRefreshToken,
  requestLogout,
  requestIsAuthorized,
  requestSendResetPasswordMail,
  requestUpdateResetPasswordByToken,
} from '@/api/store/auth'
import {
  requestFetchPosts,
  requestCreateRemediationProjectPostsService,
} from '@/api/store/blog'
import {
  requestCreateGroup,
  requestSearchGroups,
  requestUpdateGroup,
  requestDeleteGroup,
} from '@/api/store/groups'
import { requestSearchProbes, requestUpdateProbes } from '@/api/store/probes'
import {
  requestCreateRelation,
  requestUpdateRelation,
  requestDeleteRelation,
  requestDeleteRelationByAssetsIds,
  requestCreateBulkRelation,
} from '@/api/store/relations'
import { requestGenerate } from '@/api/store/reports'
import {
  scheduleWebScanStoreAPI,
  scheduleNetworkScanStoreAPI,
  scheduleScanStoreAPI,
  searchScansStoreAPI,
  requestParseScanResult,
  requestSearchScanAssets,
  requestSearchPhishingScenarios,
  requestUpdateScan,
  requestScanReport,
} from '@/api/store/scans'
import {
  requestSearchTags,
  requestCreateTag,
  requestDeleteTag,
} from '@/api/store/tags'
import {
  createUser,
  requestSearchUsers,
  requestUpdateUser,
  requestDeleteUser,
} from '@/api/store/users'
import {
  requestSearchVulnerabilities,
  requestSearchVulnerabilitiesWithTheirAssets,
  requestCreateVulnerability,
  requestUpdatePortVuln,
  requestDeleteVuln,
} from '@/api/store/vulnerabilities'
import {
  requestChartsData,
  requestFetchDashboard,
  requestUpdateDashboardUser,
} from '@/api/store/dashboard'
import {
  requestMissionAnalysisService,
  requestBusinessImpactService,
  requestUpdateBusinessImpactServiceIntoUnit,
  requestSeveritiesService,
  requestUpdateFearedEventSeverityService,
} from '@/api/store/missions_analysis'
import { requestGetAvailableTransitions } from '@/api/store/project-statuses'
import {
  requestGetRemediationProjectsSummary,
  requestGetRemediationProjects,
  requestUpdateRemediationProjects,
  requestGetRemediationProjectStatusHistory,
  requestGetRemediationProjectsScope,
  requestUpdateRemediationProjectScopeService,
  requestUpdateRemediationProjectScopeItemService,
  requestGetRemediationProjectComments,
  requestCreateRemediationProjects,
  requestSearchProjectPrioritiesService,
} from '@/api/store/remediationProjects'
import {
  requestFetchCartographies,
  requestFetchCartographyElements,
  requestUpdateCartography,
  requestCreateCartography,
  requestDeleteCartography,
  requestAddCartographyElement,
  requestUpdateCartographyElement,
  requestDeleteCartographyElement,
} from '@/api/store/cartography'
import {
  requestSearchCompanies,
  requestCreateCompany,
  requestGetCompanyRisk,
  requestSearchCompanyLogo,
  requestUpdateCompanyLogo,
  requestDeleteCompanyLogo,
  requestUpdateCompany,
} from '@/api/store/companies'
import {
  requestUploadFiles,
  requestDownloadFile,
  requestProcessCSV,
} from '@/api/store/file_upload'
import { deleteIpStore, updateIpStore, createIpStore } from '@/api/store/ips'
import { requestFetchCompliance } from '@/api/store/self-assessment'
import { requestGroupedRemediationsService } from '@/api/store/remediations'
import { getPhishingScenariosDomainsFromStore } from '@/api/store/phishing-scenarios-domains'
import { requestPassThroughService } from './passthrough'
import { log } from '@/lib/logger'
const httpsEnabled =
  fs.existsSync(path.resolve(__dirname, '../../../secrets', 'api_cert.pem')) &&
  fs.existsSync(path.resolve(__dirname, '../../../secrets', 'api_key.pem'))

if (env.nodeEnv.isProduction && !httpsEnabled) {
  log.warn(
    'Building for production without certificate. Please provide both `api_cert.pem` and `api_key.pem` files.'
  )
}

let httpsAgent = undefined

if (httpsEnabled) {
  const readConfigFile = (filename) =>
    fs.readFileSync(path.resolve(__dirname, '../../../secrets', filename)) // Read 'secrets' folder in the project's root folder
  httpsAgent = new https.Agent({
    cert: readConfigFile('api_cert.pem'),
    key: readConfigFile('api_key.pem'),
    ca: readConfigFile('api_cert.pem'),
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
  searchMissionAnalysisService: (params, accessToken) =>
    requestMissionAnalysisService(provider, params, accessToken),
  searchBusinessImpactService: (params, accessToken) =>
    requestBusinessImpactService(provider, params, accessToken),
  updateBusinessImpactServiceIntoUnit: (id, body, accessToken) =>
    requestUpdateBusinessImpactServiceIntoUnit(provider, id, body, accessToken),
  searchSeveritiesService: (params, accessToken) =>
    requestSeveritiesService(provider, params, accessToken),
  updateFearedEventSeverityService: (id, body, accessToken) =>
    requestUpdateFearedEventSeverityService(provider, id, body, accessToken),
}
export const projectStatusesAPIs = {
  getAvailableTransitionsService: (params, accessToken) =>
    requestGetAvailableTransitions(provider, params, accessToken),
}

export const remediationProjectsAPIs = {
  getRemediationProjectsService: (params, accessToken) =>
    requestGetRemediationProjects(provider, params, accessToken),
  getRemediationProjectStatusHistoryService: (id, params, accessToken) =>
    requestGetRemediationProjectStatusHistory(
      provider,
      id,
      params,
      accessToken
    ),
  updateRemediationProjectsService: (id, body, accessToken) =>
    requestUpdateRemediationProjects(provider, id, body, accessToken),
  getRemediationProjectsScopeService: (params, accessToken) =>
    requestGetRemediationProjectsScope(provider, params, accessToken),
  updateRemediationProjectScopeService: (params, body, accessToken) =>
    requestUpdateRemediationProjectScopeService(
      provider,
      params,
      body,
      accessToken
    ),
  updateRemediationProjectScopeItemService: (params, body, accessToken) =>
    requestUpdateRemediationProjectScopeItemService(
      provider,
      params,
      body,
      accessToken
    ),
  getRemediationProjectCommentsService: (id, params, accessToken) =>
    requestGetRemediationProjectComments(provider, id, params, accessToken),
  getRemediationProjectsSummaryService: (params, accessToken) =>
    requestGetRemediationProjectsSummary(provider, params, accessToken),
  getRemediationProjectsService: (params, accessToken) =>
    requestGetRemediationProjects(provider, params, accessToken),
  createRemediationProjectsService: (params, accessToken) =>
    requestCreateRemediationProjects(provider, params, accessToken),
  searchProjectPrioritiesService: (params, accessToken) =>
    requestSearchProjectPrioritiesService(provider, params, accessToken),
}
export const groupedRemediationsAPIs = {
  searchGroupedRemediationsService: (accessToken) =>
    requestGroupedRemediationsService(provider, accessToken),
}

export const ipsAPIs = {
  deleteIp: (params, accessToken) =>
    deleteIpStore(provider, params, accessToken),
  updateIp: (body, accessToken, id) =>
    updateIpStore(provider, body, accessToken, id),
  createIp: (body, accessToken, assetId) =>
    createIpStore(provider, body, accessToken, assetId),
}

export const assetsAPIs = {
  updatePortVuln: (body, params, accessToken) =>
    requestUpdatePortVuln(provider, body, params, accessToken),
  deleteVuln: (body, params, accessToken) =>
    requestDeleteVuln(provider, body, params, accessToken),
  searchAssets: (params, accessToken) =>
    requestSearchAssets(provider, params, accessToken),
  createAsset: (params, accessToken) =>
    requestCreateAsset(provider, params, accessToken),
  deleteAsset: (id, accessToken) =>
    requestDeleteAsset(provider, id, accessToken),
  updateAsset: (id, params, accessToken) =>
    requestUpdateAsset(provider, id, params, accessToken),
  updateStatus: (aid, vid, params, accessToken) =>
    requestUpdateStatus(provider, aid, vid, params, accessToken),
  updateAssetsBulk: (params, accessToken) =>
    requestUpdateAssetsBulk(provider, params, accessToken),
  deleteAssetsBulk: (params, accessToken) =>
    requestDeleteAssetsBulk(provider, params, accessToken),
  searchAssetVulnerabilities: (id, params, accessToken) =>
    requestSearchAssetVulnerabilities(provider, id, params, accessToken),
  searchPostVulnerabilityAsset: (aid, vid, accessToken) =>
    requestSearchPostVulnerabilityAsset(provider, aid, vid, accessToken),
  addPostVulnerabilityAsset: (aid, vid, params, accessToken) =>
    requestAddPostVulnerabilityAsset(provider, aid, vid, params, accessToken),
  searchAssetRevisions: (id, params, accessToken) =>
    requestSearchAssetRevisions(provider, id, params, accessToken),
  importCSV: (params, accessToken) =>
    requestImportCsv(provider, params, accessToken),
  fetchAssetPorts: (assetId, accessToken) =>
    requestFetchAssetPorts(provider, assetId, accessToken),
  createAssetVulnerability: (id, params, accessToken) =>
    requestCreateAssetVulnerability(provider, id, params, accessToken),
  searchAssetsBelonging: (params, accessToken) =>
    requestSearchAssetsBelonging(provider, params, accessToken),
  getAssetRisk: (assetId, accessToken) =>
    requestGetAssetRisk(provider, assetId, accessToken),
}

export const authAPIs = {
  login: (params) => requestLogin(provider, params),
  refreshToken: (refreshToken, accessToken) =>
    requestRefreshToken(provider, refreshToken, accessToken),
  sendResetPasswordMail: (params) =>
    requestSendResetPasswordMail(provider, params),
  updateResetPasswordByToken: (params) =>
    requestUpdateResetPasswordByToken(provider, params),
  logout: (accessToken) => requestLogout(provider, accessToken),
  isAuthorized: (accessToken) => requestIsAuthorized(provider, accessToken),
}

export const postsAPIs = {
  fetchPosts: (accessToken) => requestFetchPosts(provider, accessToken),
  CreateRemediationProjectPostsService: (id, body, accessToken) =>
    requestCreateRemediationProjectPostsService(
      provider,
      id,
      body,
      accessToken
    ),
}

export const cartographiesAPIs = {
  fetchCartographies: (accessToken) =>
    requestFetchCartographies(provider, accessToken),
  fetchCartographyElements: (id, accessToken) =>
    requestFetchCartographyElements(provider, id, accessToken),
  updateCartography: (id, params, accessToken) =>
    requestUpdateCartography(provider, id, params, accessToken),
  createCartography: (params, accessToken) =>
    requestCreateCartography(provider, params, accessToken),
  deleteCartography: (id, accessToken) =>
    requestDeleteCartography(provider, id, accessToken),
  addCartographyElement: (id, params, accessToken) =>
    requestAddCartographyElement(provider, id, params, accessToken),
  updateCartographyElement: (id, eid, params, accessToken) =>
    requestUpdateCartographyElement(provider, id, eid, params, accessToken),
  deleteCartographyElement: (id, eid, accessToken) =>
    requestDeleteCartographyElement(provider, id, eid, accessToken),
}

export const companiesAPIs = {
  searchCompanies: (params, accessToken) =>
    requestSearchCompanies(provider, params, accessToken),
  createCompany: (params, accessToken) =>
    requestCreateCompany(provider, params, accessToken),
  getCompanyRisk: (accessToken) => requestGetCompanyRisk(provider, accessToken),
  searchCompanyLogo: (params, accessToken) =>
    requestSearchCompanyLogo(provider, params, accessToken),
  /**
   *
   * @param {{logo:string}} params
   * @param {string} accessToken
   * @returns
   */
  updateCompanyLogo: (params, accessToken) =>
    requestUpdateCompanyLogo(provider, params, accessToken),
  deleteCompanyLogo: (params, accessToken) =>
    requestDeleteCompanyLogo(provider, params, accessToken),
  updateCompany: (params, accessToken) =>
    requestUpdateCompany(provider, params, accessToken),
}

export const dashboardAPIs = {
  getChartsData: (params, accessToken) =>
    requestChartsData(provider, params, accessToken),
  fetchDashboard: (accessToken) => requestFetchDashboard(provider, accessToken),
  updateDashboardUser: (id, params, accessToken) =>
    requestUpdateDashboardUser(provider, id, params, accessToken),
}

export const groupsAPIs = {
  searchGroups: (params, accessToken) =>
    requestSearchGroups(provider, params, accessToken),
  updateGroup: (params, accessToken) =>
    requestUpdateGroup(provider, params, accessToken),
  createGroup: (params, accessToken) =>
    requestCreateGroup(provider, params, accessToken),
  deleteGroup: (params, accessToken) =>
    requestDeleteGroup(provider, params, accessToken),
}

export const probesAPIs = {
  searchProbes: (params, accessToken) =>
    requestSearchProbes(provider, params, accessToken),
  updateProbes: (params, body, accessToken) =>
    requestUpdateProbes(provider, params, body, accessToken),
}

export const relationsAPIs = {
  createRelation: (params, accessToken) =>
    requestCreateRelation(provider, params, accessToken),
  createBulkRelation: (params, accessToken) =>
    requestCreateBulkRelation(provider, params, accessToken),
  updateRelation: (id, params, accessToken) =>
    requestUpdateRelation(provider, id, params, accessToken),
  deleteRelation: (id, accessToken) =>
    requestDeleteRelation(provider, id, accessToken),
  deleteRelationByAssetsIds: (params, accessToken) =>
    requestDeleteRelationByAssetsIds(provider, params, accessToken),
}

export const reportsAPIs = {
  generate: (accessToken) => requestGenerate(provider, accessToken),
}

export const scanAPIs = {
  searchScansStoreAPI: (params, accessToken) =>
    searchScansStoreAPI(provider, params, accessToken),
  scheduleWebScanStoreAPI: (params, accessToken) =>
    scheduleWebScanStoreAPI(provider, params, accessToken),
  scheduleNetworkScanStoreAPI: (params, accessToken) =>
    scheduleNetworkScanStoreAPI(provider, params, accessToken),
  scheduleScanStoreAPI: (params, accessToken) =>
    scheduleScanStoreAPI(provider, params, accessToken),
  parseScanResult: (params, accessToken) =>
    requestParseScanResult(provider, params, accessToken),
  searchScanAssets: (accessToken) =>
    requestSearchScanAssets(provider, accessToken),
  searchPhishingScenarios: (accessToken) =>
    requestSearchPhishingScenarios(provider, accessToken),
  updateScan: (id, params, accessToken) =>
    requestUpdateScan(provider, id, params, accessToken),
  getScanDetails: (id, accessToken) =>
    requestScanReport(provider, id, accessToken),
  getScanReport: (id, accessToken) =>
    requestScanReport(provider, id, accessToken),
}

export const tagsAPIs = {
  searchTags: (params, accessToken) =>
    requestSearchTags(provider, params, accessToken),
  createTag: (params, accessToken) =>
    requestCreateTag(provider, params, accessToken),
  deleteTag: (id, accessToken) => requestDeleteTag(provider, id, accessToken),
}

export const userAPIs = {
  searchUsers: (params, accessToken) =>
    requestSearchUsers(provider, params, accessToken),
  createUser: (params, accessToken) =>
    createUser(provider, params, accessToken),
  updateUser: (params, accessToken) =>
    requestUpdateUser(provider, params, accessToken),
  deleteUser: (id, accessToken) => requestDeleteUser(provider, id, accessToken),
}

export const vulnerabilitiesAPIs = {
  searchVulnerabilities: (params, accessToken) =>
    requestSearchVulnerabilities(provider, params, accessToken),
  searchVulnerabilitiesWithTheirAssets: (params, accessToken) =>
    requestSearchVulnerabilitiesWithTheirAssets(provider, params, accessToken),
  createVulnerability: (params, accessToken) =>
    requestCreateVulnerability(provider, params, accessToken),
}

export const fileAPIs = {
  uploadFiles: (params, accessToken) =>
    requestUploadFiles(provider, params, accessToken),
  downloadFile: (id, accessToken) =>
    requestDownloadFile(provider, id, accessToken),
  processCSV: (accessToken) => requestProcessCSV(provider, accessToken),
}

export const complianceAPIs = {
  fetchCompliance: (params, accessToken) =>
    requestFetchCompliance(provider, params, accessToken),
}

export const getPhishingScenariosDomainsAPIs = {
  getDomains: (params, accessToken) =>
    getPhishingScenariosDomainsFromStore(provider, params, accessToken),
}
