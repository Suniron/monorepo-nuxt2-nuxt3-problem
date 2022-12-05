<template>
  <div>
    <div
      v-if="asset.type !== 'PROCEDURE' && asset.type !== 'POLICY'"
      class="my-4 ws-8"
    >
      <span><strong>Risks:</strong></span>
      <risk-indicators :asset="asset" />
    </div>
    <div class="my-4 ws-24">
      <span><strong>Team:</strong></span>
      <groups-multiselect :visible-groups="3" v-model="groups" />
    </div>
    <div class="my-4 ws-8">
      <span> <strong>Tags:</strong><br /> </span>
      <tags-multiselect creatable :visible-groups="3" v-model="tags" />
    </div>
  </div>
</template>
<script>
import RiskIndicators from '~/components/assets/risk-indicators'

// Controls
import GroupsMultiselect from '~/components/controls/groups-multiselect'
import TagsMultiselect from '~/components/controls/tags-multiselect.vue'

// Services
import { updateAssetService } from '~/services/assets'

export default {
  components: {
    RiskIndicators,
    GroupsMultiselect,
    TagsMultiselect
  },
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    groupIds() {
      return this.asset.groups.map((val) => val.id)
    },
    groups: {
      get() {
        return this.groupIds
      },
      set(newvalues) {
        this.changeAssetProp('groups', newvalues)
      }
    },
    tagIds() {
      return this.asset.tags.map((val) => val.id)
    },
    tags: {
      get() {
        return this.tagIds
      },
      set(newvalues) {
        this.changeAssetProp('tags', newvalues)
      }
    }
  },
  methods: {
    async changeAssetProp(propName, value) {
      try {
        const updateParams = {}
        if (propName === 'groups') {
          updateParams.groupIds = value.map((group) => group.id)
        } else if (propName === 'tags') {
          updateParams.tagIds = value.map((tag) => tag.id)
        }

        await updateAssetService(this.$axios, this.asset.id, updateParams)
        this.$root.$emit('fetchTagsAgain', value)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
<style lang="scss">
.ws-8 {
  padding-top: 8px;
}

.ws-24 {
  padding-top: 24px;
}
</style>
