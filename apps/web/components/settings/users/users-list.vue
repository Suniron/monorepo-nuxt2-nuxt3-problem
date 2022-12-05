<template>
  <v-data-table
    :headers="headers"
    :items="users"
    :items-per-page="15"
    class="users-list-table"
  >
    <template #[`footer.page-text`]="items">
      {{ items.pageStart }}-{{ items.pageStop }} of
      {{ items.itemsLength }} results
    </template>
    <template #[`item.name`]="{ item }">
      {{ item.firstName + ' ' + item.lastName }}
    </template>
    <template #[`item.role`]="{ item }">
      <v-select
        :items="roleOptions"
        :value="item.roles[0]"
        :loading="isRoleLoading"
        class="role-list"
        placeholder="Select Role"
        :menu-props="{
          bottom: true,
          offsetY: true,
          closeOnClick: true
        }"
        @change="(role) => updateUser(item, { role })"
      >
      </v-select>
    </template>
    <template #[`item.groups`]="{ item }">
      <v-select
        :value="item.groups"
        :items="groups"
        item-text="name"
        class="group-list"
        chips
        deletable-chips
        multiple
        placeholder="Select Groups"
        return-object
        @change="(groups) => updateUser(item, { groups })"
        :menu-props="{
          bottom: true,
          offsetY: true,
          closeOnClick: true
        }"
      ></v-select>
    </template>
    <template #[`item.edit`]="{ item: itemEdit }">
      <v-dialog width="500" persistent :retain-focus="false">
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" style="cursor:pointer" small right
            >mdi-pencil</v-icon
          >
        </template>

        <template #default="dialog">
          <create-edit-user-modal
            :user="itemEdit"
            @created="$emit('update')"
            @close="dialog.value = false"
          />
        </template>
      </v-dialog>
      <v-dialog width="500" persistent :retain-focus="false">
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" style="cursor:pointer" small right
            >mdi-delete</v-icon
          >
        </template>
        <template #default="dialog">
          <delete-modal
            style="background-color:white"
            :item="itemEdit"
            whatis-deleting="User"
            @close="dialog.value = false"
            @delete="removeUser"
          />
        </template>
      </v-dialog>
    </template>
  </v-data-table>
</template>

<script>
// Services
import createEditUserModal from './create-edit-user-modal'
import { updateUserService, deleteUserService } from '~/services/users'
import DeleteModal from '~/components/settings/delete-modal.vue'
export default {
  name: 'UsersList',
  components: {
    createEditUserModal,
    DeleteModal
  },
  props: {
    users: {
      type: Array,
      default: () => []
    },
    groups: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      arrUsers: [...this.users],
      headers: [
        {
          text: 'Name',
          value: 'name',
          class: 'name-column',
          width: '30%',
          sortable: false
        },
        {
          text: 'Role',
          value: 'role',
          class: 'role-column',
          width: '30%',
          sortable: false
        },
        {
          text: 'Groups',
          value: 'groups',
          class: 'groups-column',
          width: '30%',
          sortable: false
        },
        {
          text: 'Edit',
          value: 'edit',
          class: 'edit-column',
          width: '10%',
          sortable: false
        }
      ],
      groupOptions: ['Management', 'Security', 'Staff', 'Other'],
      roleOptions: [
        { text: 'Admin', value: 'admin' },
        { text: 'Member', value: 'member' }
      ],
      isRoleLoading: false
    }
  },
  watch: {
    users(newUsers) {
      this.arrUsers = [...newUsers]
    }
  },
  methods: {
    async updateUser(user, payload) {
      try {
        this.isRoleLoading = true

        const { role, groups } = payload
        const params = {
          id: user.id,
          roles: role ? [role] : undefined,
          groups
        }
        await updateUserService(this.$axios, params)

        this.$emit('update')
      } catch (error) {
        console.error(error)
      } finally {
        this.isRoleLoading = false
      }
    },
    async removeUser(item) {
      const res = await deleteUserService(this.$axios, item)
      if (res.status !== 200) {
        this.error = 'An error has occured'
      } else {
        this.$emit('update')
      }
    }
  }
}
</script>

<style lang="scss">
.users-list-table {
  .role-column,
  .groups-column {
    max-width: 200px;
  }

  .role-list,
  .group-list {
    @media screen and (max-width: 400px) {
      width: 200px;
    }
    @media screen and (min-width: 401px) and (max-width: 500px) {
      width: 250px;
    }
    @media screen and (min-width: 501px) and (max-width: 599px) {
      width: 350px;
    }
  }
}
</style>
