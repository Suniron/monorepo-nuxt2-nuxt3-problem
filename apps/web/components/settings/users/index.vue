<template>
  <div class="user-settings">
    <div class="create-wrapper">
      <v-dialog width="500" persistent>
        <template #activator="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on">Add user</v-btn>
        </template>
        <template #default="dialog">
          <CreateUserModal
            @created="$emit('update')"
            @close="dialog.value = false"
          />
        </template>
      </v-dialog>
    </div>
    <UsersList :users="users" :groups="groups" @update="$emit('update')" />
  </div>
</template>

<script>
import UsersList from '~/components/settings/users/users-list'
import CreateUserModal from '~/components/settings/users/create-edit-user-modal.vue'

export default {
  name: 'UsersSettings',
  components: { UsersList, CreateUserModal },
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
.user-settings {
  .create-wrapper {
    text-align: right;
    margin: 20px 0;
  }
}
</style>
