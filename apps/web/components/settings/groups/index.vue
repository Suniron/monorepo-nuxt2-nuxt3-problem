<template>
  <div class="group-settings">
    <div class="create-wrapper">
      <v-dialog width="500" persistent>
        <template #activator="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on">Add team</v-btn>
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
    <groups-list :users="users" :groups="groups" @update="$emit('update')" />
  </div>
</template>

<script>
import GroupsList from '~/components/settings/groups/groups-list'
import CreateGroupModal from '~/components/settings/groups/create-edit-group-modal.vue'

export default {
  name: 'GroupsSettings',
  components: { GroupsList, CreateGroupModal },
  props: {
    users: {
      type: Array,
      default: () => []
    },
    groups: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss">
.group-settings {
  .create-wrapper {
    text-align: right;
    margin: 20px 0;
  }
}
</style>
