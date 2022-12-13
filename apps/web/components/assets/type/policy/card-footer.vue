<script>
// Controls
import GroupSelect from '~/components/controls/group-select'
import TagsMultiselect from '~/components/controls/tags-multiselect'

// Services
import { updateAssetService } from '~/services/assets'

export default {
  components: {
    GroupSelect,
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
        if (propName === 'group')
          updateParams.groupId = value?.id || null
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
    <div class="my-4 ws-24">
      <span><strong>Group:</strong></span>
      <GroupSelect
        :value="asset.group"
        @input="(group) => changeAssetProp('group', group)"
      />
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
