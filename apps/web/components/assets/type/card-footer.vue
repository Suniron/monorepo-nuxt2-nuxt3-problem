<script>
import RiskIndicators from '~/components/assets/risk-indicators'

// Controls
import GroupsMultiselect from '~/components/controls/groups-multiselect'
import TagsMultiselect from '~/components/controls/tags-multiselect.vue'

// Services
import { updateAssetService } from '~/services/assets'

export default {
  components: {
    GroupsMultiselect,
    RiskIndicators,
    TagsMultiselect,
  },
  data() {
    return {}
  },
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  computed: {
    groupIds() {
      return this.asset.groups.map(val => val.id)
    },
    groups: {
      get() {
        return this.groupIds
      },
      set(newvalues) {
        this.changeAssetProp('groups', newvalues)
      },
    },
    tagIds() {
      return this.asset.tags.map(val => val.id)
    },
    tags: {
      get() {
        return this.tagIds
      },
      set(newvalues) {
        this.changeAssetProp('tags', newvalues)
      },
    },
  },
  methods: {
    async changeAssetProp(propName, value) {
      try {
        const updateParams = {}
        if (propName === 'groups')
          updateParams.groupIds = value.map(group => group.id)
        else if (propName === 'tags')
          updateParams.tagIds = value.map(tag => tag.id)

        await updateAssetService(this.$axios, this.asset.id, updateParams)
        this.$root.$emit('fetchTagsAgain', value)
      }
      catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<template>
  <div>
    <div
      v-if="asset.type !== 'PROCEDURE' && asset.type !== 'POLICY'"
      class="my-4 ws-8"
    >
      <span><strong>Risks:</strong></span>
      <RiskIndicators :asset="asset" />
    </div>
    <div class="my-4 ws-24">
      <span><strong>Team:</strong></span>
      <GroupsMultiselect v-model="groups" :visible-groups="3" />
    </div>
    <div class="my-4 ws-8">
      <span> <strong>Tags:</strong><br> </span>
      <TagsMultiselect v-model="tags" creatable :visible-groups="3" />
    </div>
  </div>
</template>

<style lang="scss">
.ws-8 {
  padding-top: 8px;
}

.ws-24 {
  padding-top: 24px;
}
</style>
