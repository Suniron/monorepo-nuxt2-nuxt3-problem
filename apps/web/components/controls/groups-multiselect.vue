<script>
import { mapActions, mapState } from 'vuex'
import CustomMultiselect from './custom-multiselect.vue'

export default {
  components: {
    CustomMultiselect
  },
  name: 'GroupsMultiselect',
  computed: {
    ...mapState('groups', ['groups']),
    availableGroups() {
      return this.subset ?? this.groups
    },
  },
  created() {
    if (this.values)
      this.selectedGroup = this.values
    this.fetchGroups()
  },
  methods: {
    ...mapActions('groups', {
      fetchGroupsInStore: 'fetchGroups',
    }),
    async fetchGroups() {
      await this.fetchGroupsInStore()
    },
    groupsChanged(newValues) {
      this.$emit('input', newValues)
    },
  },
  model: {
    event: 'input',
    prop: 'selectedValues',
  },
  props: {
    /**
     * Array of group objects
     */
    selectedValues: {
      default: () => [],
      type: Array,
    },

    /**
     * A subset of values available in the dropdown
     */
    subset: {
      default: null,
      type: Array,
    },

    /**
     * Number of group chips shown before showing "+10" chip indicator of more groups selected
     */
    visibleGroups: {
      default: 3,
      type: Number,
    },
  },
}
</script>

<template>
  <CustomMultiselect
    :values="availableGroups"
    :selected-values="selectedValues"
    :visible-items="3"
    placeholder="Team"
    v-bind="$attrs"
    @change="groupsChanged"
  />
</template>

<style lang="scss">
.groups-multiselect {
  display: inline-flex;
}
</style>
