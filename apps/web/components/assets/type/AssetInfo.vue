<script>
// Profile
import BuildingProfile from '~/components/assets/type/building/profile.vue'
import PolicyProfile from '~/components/assets/type/policy/profile.vue'
import ServerProfile from '~/components/assets/type/server/profile.vue'
import UserProfile from '~/components/assets/type/user/profile.vue'
import WebProfile from '~/components/assets/type/web/profile.vue'
import NetworkProfile from '~/components/assets/type/network/profile.vue'
import BusinessMissionProfile from '~/components/assets/type/business-mission/Profile.vue'
import BusinessUnitProfile from '~/components/assets/type/unit/Profile.vue'
import UserGroupProfile from '~/components/assets/type/usergroup/profile.vue'

// Card details
import BuildingCardDetails from '~/components/assets/type/building/card-details.vue'
import PolicyCardDetails from '~/components/assets/type/policy/card-details.vue'
import ServerCardDetails from '~/components/assets/type/server/card-details.vue'
import UserCardDetails from '~/components/assets/type/user/card-details.vue'
import WebCardDetails from '~/components/assets/type/web/card-details.vue'
import NetworkCardDetails from '~/components/assets/type/network/card-details.vue'
import UnitCardDetails from '~/components/assets/type/unit/card-details.vue'
import UserGroupCardDetails from '~/components/assets/type/usergroup/card-details.vue'
// Tabs
// import GenericTabs from '~/components/assets/type/AssetTabs.vue'
import ServerTabs from '~/components/assets/type/server/AssetTabs.vue'
import PolicyTabs from '~/components/assets/type/policy/AssetTabs.vue'
import WebTabs from '~/components/assets/type/web/AssetTabs.vue'
import UserTabs from '~/components/assets/type/user/AssetTabs.vue'
import BusinessMissionTabs from '~/components/assets/type/business-mission/AssetTabs.vue'
import BusinessUnitTabs from '~/components/assets/type/unit/AssetTabs.vue'
import NetworkTabs from '~/components/assets/type/network/AssetTabs.vue'
import BuildingTabs from '~/components/assets/type/building/AssetTabs.vue'
import UsergroupTabs from '~/components/assets/type/usergroup/AssetTabs.vue'

// Card footers
import GenericCardFooter from '~/components/assets/type/card-footer.vue'
// import PolicyCardFooter from '~/components/assets/type/policy/card-footer.vue'

// Table details
import ServerTableDetails from '~/components/assets/type/server/table-details.vue'
import WebTableDetails from '~/components/assets/type/web/table-details.vue'
import UserTableDetails from '~/components/assets/type/user/table-details.vue'

// Add asset details
import ServerNewAsset from '~/components/assets/type/server/new-asset.vue'
import WebNewAsset from '~/components/assets/type/web/new-asset.vue'
import UserNewAsset from '~/components/assets/type/user/new-asset.vue'
import BuildingNewAsset from '~/components/assets/type/building/new-asset.vue'
import PolicyNewAsset from '~/components/assets/type/policy/new-asset.vue'
import NetworkNewAsset from '~/components/assets/type/network/new-asset.vue'
import UnitNewAsset from '~/components/assets/type/unit/new-asset.vue'
import BusinessMissionNewAsset from '~/components/assets/type/business-mission/NewAsset.vue'
import UserGroupNewAsset from '~/components/assets/type/usergroup/new-asset.vue'
// Edit asset details
import ServerEditDetails from '~/components/assets/type/server/edit-details.vue'
import WebEditDetails from '~/components/assets/type/web/edit-details.vue'
import UserEditDetails from '~/components/assets/type/user/edit-details.vue'
import BuildingEditDetails from '~/components/assets/type/building/edit-details.vue'
import PolicyEditDetails from '~/components/assets/type/policy/edit-details.vue'

// Bulk Edit
import ServerBulkEdit from '~/components/assets/type/server/bulk-edit.vue'
import WebBulkEdit from '~/components/assets/type/web/bulk-edit.vue'
import UserBulkEdit from '~/components/assets/type/user/bulk-edit.vue'
import BuildingBulkEdit from '~/components/assets/type/building/bulk-edit.vue'
import PolicyBulkEdit from '~/components/assets/type/policy/bulk-edit.vue'
import NetworkBulkEdit from '~/components/assets/type/network/bulk-edit.vue'
import UnitBulkEdit from '~/components/assets/type/unit/bulk-edit.vue'
import BusinessMissionBulkEdit from '~/components/assets/type/business-mission/bulk-edit.vue'
import UserGroupBulkEdit from '~/components/assets/type/usergroup/bulk-edit.vue'

export default {
  name: 'AssetInfo',
  data() {
    return {
      info: {}
    }
  },
  computed: {
    /**
     * Get the asset component, return **undefined** if the asset type is not supported.
     *
     * @returns {any}
     */
    assetComponent() {
      return this.info[this.asset.type.toUpperCase()][this.section]
    },
  },
  created() {
    this.info = {
      BUILDING: {
        bulkEdit: BuildingBulkEdit,
        cardDetails: BuildingCardDetails,
        cardFooter: GenericCardFooter,
        editDetails: BuildingEditDetails,
        newAsset: BuildingNewAsset,
        profile: BuildingProfile,
        tabs: BuildingTabs,
      },
      MISSION: {
        bulkEdit: BusinessMissionBulkEdit,
        cardDetails: UnitCardDetails,
        cardFooter: GenericCardFooter,
        newAsset: BusinessMissionNewAsset,
        profile: BusinessMissionProfile,
        tabs: BusinessMissionTabs,
      },
      NETWORK: {
        bulkEdit: NetworkBulkEdit,
        cardDetails: NetworkCardDetails,
        cardFooter: GenericCardFooter,
        newAsset: NetworkNewAsset,
        profile: NetworkProfile,
        tabs: NetworkTabs,
      },
      POLICY: {
        bulkEdit: PolicyBulkEdit,
        cardDetails: PolicyCardDetails,
        cardFooter: GenericCardFooter,
        editDetails: PolicyEditDetails,
        newAsset: PolicyNewAsset,
        profile: PolicyProfile,
        tabs: PolicyTabs,
      },
      PROCEDURE: {
        bulkEdit: PolicyBulkEdit,
        cardDetails: PolicyCardDetails,
        cardFooter: GenericCardFooter,
        editDetails: PolicyEditDetails,
        newAsset: PolicyNewAsset,
        profile: PolicyProfile,
        tabs: PolicyTabs,
      },
      SERVER: {
        bulkEdit: ServerBulkEdit,
        cardDetails: ServerCardDetails,
        cardFooter: GenericCardFooter,
        detailsTable: ServerTableDetails,
        editDetails: ServerEditDetails,
        newAsset: ServerNewAsset,
        profile: ServerProfile,
        tabs: ServerTabs,
      },
      UNIT: {
        bulkEdit: UnitBulkEdit,
        cardDetails: UnitCardDetails,
        cardFooter: GenericCardFooter,
        newAsset: UnitNewAsset,
        profile: BusinessUnitProfile,
        tabs: BusinessUnitTabs,
      },
      USER: {
        bulkEdit: UserBulkEdit,
        cardDetails: UserCardDetails,
        cardFooter: GenericCardFooter,
        detailsTable: UserTableDetails,
        editDetails: UserEditDetails,
        newAsset: UserNewAsset,
        profile: UserProfile,
        tabs: UserTabs,
      },
      USERGROUP: {
        bulkEdit: UserGroupBulkEdit,
        cardDetails: UserGroupCardDetails,
        cardFooter: GenericCardFooter,
        newAsset: UserGroupNewAsset,
        profile: UserGroupProfile,
        tabs: UsergroupTabs,
      },
      WEB: {
        bulkEdit: WebBulkEdit,
        cardDetails: WebCardDetails,
        cardFooter: GenericCardFooter,
        detailsTable: WebTableDetails,
        editDetails: WebEditDetails,
        newAsset: WebNewAsset,
        profile: WebProfile,
        tabs: WebTabs,
      },
    }
  },
  methods: {
    changed(data) {
      this.$emit('change', data)
    },
  },
  props: {
    asset: {
      required: true,
      type: Object,
    },
    details: {
      default: () => {
        return null
      },
      type: Array,
    },
    isUpdate: {
      default: false,
      type: Boolean,
    },
    item: {
      required: false,
      type: Object,
    },
    quickEdit: {
      default: () => {
        return true
      },
      type: Boolean,
    },
    section: {
      required: true,
      type: String,
    },
  },
}
</script>

<template>
  <component
    :is="assetComponent"
    v-if="details"
    :asset="asset"
    :details="details"
    :quickedit="quickEdit"
    :itemvul-n="item"
    :is-update="isUpdate"
    @change="changed"
  />
  <component
    :is="assetComponent"
    v-else
    :asset="asset"
    :quickedit="quickEdit"
    :is-update="isUpdate"
    @change="changed"
  />
</template>
