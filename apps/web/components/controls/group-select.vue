<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'GroupSelect',
  data() {
    return {
      selectedGroup: this.value ? { ...this.value } : null,
      isLoading: false
    }
  },
  computed: {
    ...mapState('groups', ['groups']),
    groupOptions() {
      const groups = [
        // Add an empty group at the beginning to be able to unselect
        this.createEmptyGroup(),
      ].concat(this.groups)
      return groups
    },
  },
  created() {
    if (this.value)
      this.selectedGroup = this.value
    this.fetchGroups()
  },
  methods: {
    ...mapActions('groups', {
      fetchGroupsInStore: 'fetchGroups',
    }),
    changeGroup(group) {
      const emptyGroup = this.createEmptyGroup()
      const isValidGroupSelected = g => g?.id && g.id !== emptyGroup.id
      this.$emit('input', isValidGroupSelected(group) ? { ...group } : null)
      this.$emit('select', isValidGroupSelected(group) ? { ...group } : null)
    },
    createEmptyGroup() {
      return {
        id: 'group-0',
        members: [],
        name: '',
      }
    },
    async fetchGroups() {
      this.isLoading = true
      await this.fetchGroupsInStore()
      this.isLoading = false
    },
  },
  props: {
    /**
     * Group object
     */
    value: {
      default: null,
      type: Object,
    },
  },
}
</script>

<template>
  <v-select
    v-model="selectedGroup"
    :items="groupOptions"
    :loading="isLoading"
    class="group-select"
    item-text="name"
    return-object
    v-bind="$attrs"
    :menu-props="{
      bottom: true,
      offsetY: true,
      closeOnClick: true,
    }"
    @input="changeGroup"
    @click.stop
  />
</template>

<style lang="scss">
.group-select {
  display: inline-flex;
}
</style>
