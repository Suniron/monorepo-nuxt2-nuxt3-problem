<template>
  <custom-multiselect
    :values="availableGroups"
    :selected-values="selectedValues"
    :visible-items="3"
    placeholder="Team"
    @change="groupsChanged"
    v-bind="$attrs"
  />
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CustomMultiselect from './custom-multiselect.vue'

export default {
  name: 'GroupsMultiselect',
  components: {
    CustomMultiselect
  },
  model: {
    prop: 'selectedValues',
    event: 'input'
  },
  props: {
    /**
     * Array of group objects
     */
    selectedValues: {
      type: Array,
      default: () => []
    },
    /**
     * Number of group chips shown before showing "+10" chip indicator of more groups selected
     */
    visibleGroups: {
      type: Number,
      default: 3
    },
    /**
     * A subset of values available in the dropdown
     */
    subset: {
      type: Array,
      default: null
    }
  },
  computed: {
    ...mapState('groups', ['groups']),
    availableGroups() {
      return this.subset ?? this.groups
    }
  },
  created() {
    if (this.values) this.selectedGroup = this.values
    this.fetchGroups()
  },
  methods: {
    ...mapActions('groups', {
      fetchGroupsInStore: 'fetchGroups'
    }),
    async fetchGroups() {
      await this.fetchGroupsInStore()
    },
    groupsChanged(newValues) {
      this.$emit('input', newValues)
    }
  }
}
</script>

<style lang="scss">
.groups-multiselect {
  display: inline-flex;
}
</style>
