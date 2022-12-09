import _ from 'lodash'
import { getAssetSummary } from '~/services/assets'

const initialState = () => ({
  assetSummary: {
    BUILDING: 0,
    COMPLIANCE: 0,
    MISSION: 0,
    NETWORK: 0,
    POLICY: 0,
    PROCEDURE: 0,
    SERVER: 0,
    UNIT: 0,
    USER: 0,
    USERGROUP: 0,
    WEB: 0,
    superAssets: 0,
    technicalAssets: 0,
  },
  assets: [],
})

const createAssetObject = () => ({
  details: [],
  group: null,
  id: 0,
  ip: '',
  name: '',
  os: '',
  risks: {
    critical: 0,
    high: 0,
    low: 0,
    medium: 0,
  },
  sitemap: null,
  tags: [],
})

export const state = initialState

export const getters = {
  assetNamesIds: state =>
    state.assets.map((asset) => {
      return { id: asset.id, name: asset.name }
    }),
  networkAssets: state =>
    state.assets.filter((asset) => {
      const parts = asset.name.split('.')
      return parts.length === 4 && parts.every(part => !isNaN(part))
    }),
  networkAssetsIPs: (_state, getters) =>
    getters.networkAssets.map(asset => asset.ip),
  vulnerabilities: (state) => {
    const hashVulnerabilities = state.assets.reduce((hash, asset) => {
      asset.details.forEach((vulnerability) => {
        const assetDetails = {
          affectedAssetId: asset.id,
          affectedAssetName: asset.name,
        }
        if (hash[vulnerability.Name]) {
          hash[vulnerability.Name].affectedAssets.add(assetDetails)
        }
        else {
          hash[vulnerability.Name] = {
            ...vulnerability,
            affectedAssets: new Set([assetDetails]),
          }
        }
      })
      return hash
    }, {})

    return hashVulnerabilities
  },
  webAssets: state =>
    state.assets.filter((asset) => {
      const parts = asset.name.split('.')
      return parts.length !== 4 || parts.some(part => isNaN(part))
    }),
  webAssetsNames: (_state, getters) =>
    getters.webAssets.map(asset => asset.name),
}

const types = {
  CHANGE_ASSET_PROP: 'CHANGE_ASSET_PROP',
  CREATE_ASSET: 'CREATE_ASSET',
  EDIT_ASSET: 'EDIT_ASSET',
  REMOVE_ASSET: 'REMOVE_ASSET',
  SET_ASSETS: 'SET_ASSETS',
  UPDATE_ASSET_SUMMARY: 'UPDATE_ASSET_SUMMARY',
}

export const mutations = {
  [types.SET_ASSETS](state, assets) {
    state.assets = assets
  },
  [types.CHANGE_ASSET_PROP](state, { assetName, propName, value, id }) {
    const newAssets = [...state.assets]
    const assetToChange = newAssets.find(asset => asset.id === id)
    assetToChange[propName] = value

    state.assets = newAssets
  },
  [types.EDIT_ASSET](state, { originalName, newName, ip, os, id }) {
    const newAssets = [...state.assets]
    const assetToChange = newAssets.find(asset => asset.id === id)

    assetToChange.name = newName
    assetToChange.ip = ip
    assetToChange.os = os
    assetToChange.id = id

    state.assets = newAssets
  },
  [types.CREATE_ASSET](state, { name, ip, os }) {
    const newAssets = [...state.assets]

    const asset = createAssetObject()
    asset.name = name
    asset.ip = ip
    asset.os = os
    asset.id = Math.max(...newAssets.map(asset => asset.id)) + 1

    newAssets.push(asset)
    state.assets = newAssets
  },
  [types.REMOVE_ASSET](state, { id }) {
    const newAssets = [...state.assets]

    const assetToRemove = newAssets.find(asset => asset.id === id)
    const assetIndex = newAssets.indexOf(assetToRemove)

    newAssets.splice(assetIndex, 1)
    state.assets = newAssets
  },
  [types.UPDATE_ASSET_SUMMARY](state, summary) {
    // Updating all properties at once to avoid refreshing components for each property changed
    if (!_.isEqual(state.assetSummary, summary)) {
      // Generating initialState to set a 0 count to missing asset types
      Object.assign(state.assetSummary, initialState().assetSummary, summary)
    }
  },
}

export const actions = {
  changeAssetProp({ state, commit }, { assetName, propName, value, id }) {
    if (!state.assets.find(asset => asset.id === id))
      return

    commit(types.CHANGE_ASSET_PROP, { assetName, id, propName, value })
  },
  createAsset({ state, commit }, payload) {
    if (state.assets.find(asset => asset.id === payload.id))
      return

    commit(types.CREATE_ASSET, payload)
  },
  editAsset({ state, commit }, payload) {
    if (!state.assets.find(asset => asset.id === payload.id))
      return

    commit(types.EDIT_ASSET, payload)
  },
  removeAsset({ state, commit }, payload) {
    if (!state.assets.find(asset => asset.id === payload.id))
      return

    commit(types.REMOVE_ASSET, payload)
  },
  setAssets({ commit }, { assets = [] } = {}) {
    commit(types.SET_ASSETS, [...assets])
  },
  async updateAssetSummary({ commit }, axios) {
    const result = await getAssetSummary(axios)
    if (result.data)
      commit(types.UPDATE_ASSET_SUMMARY, result.data.summary)
  },
}
