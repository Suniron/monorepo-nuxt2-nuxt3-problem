<script>
import GroupsList from '~/components/settings/groups/groups-list'
import CreateGroupModal from '~/components/settings/groups/create-edit-group-modal.vue'

export default {
  components: { GroupsList, CreateGroupModal },
  name: 'GroupsSettings',
  props: {
    groups: {
      default: () => [],
      type: Array,
    },
    users: {
      default: () => [],
      type: Array,
    },
  },
}
</script>

<template>
  <div class="group-settings">
    <div class="create-wrapper">
      <v-dialog width="500" persistent>
        <template #activator="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on">
            Add team
          </v-btn>
        </template>
        <template #default="dialog">
          <CreateGroupModal
            :users="users"
            :groups="groups"
            @created="$emit('update')"
            @close="dialog.value = false"
          />
        </template>
      </v-dialog>
    </div>
    <GroupsList :users="users" :groups="groups" @update="$emit('update')" />
  </div>
</template>

<style lang="scss">
.group-settings {
  .create-wrapper {
    text-align: right;
    margin: 20px 0;
  }
}
</style>
