<template>
  <v-data-table
    :headers="headers"
    :items="groups"
    :items-per-page="15"
    class="groups-list-table"
  >
    <template #[`footer.page-text`]="items">
      {{ items.pageStart }}-{{ items.pageStop }} of
      {{ items.itemsLength }} results
    </template>
    <template #[`item.name`]="{ item }">
      {{ item.name }}
    </template>
    <template #[`item.members`]="{ item }">
      <v-select
        :items="users"
        :value="item.members"
        item-text="firstName"
        @input="(newMembers) => changeGroupMembers(item.id, newMembers)"
        class="member-list"
        chips
        deletable-chips
        multiple
        placeholder="Select Members"
        return-object
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
          <create-edit-group-modal
            :group="itemEdit"
            :users="users"
            :groups="groups"
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
            whatis-deleting="Group"
            @close="dialog.value = false"
            @delete="removeGroup"
          />
        </template>
      </v-dialog>
    </template>
  </v-data-table>
</template>

<script>
// Service
import CreateEditGroupModal from './create-edit-group-modal.vue'
import { updateGroupService, deleteGroupService } from '~/services/groups'
import DeleteModal from '~/components/settings/delete-modal.vue'
export default {
  name: 'GroupsList',
  components: { CreateEditGroupModal, DeleteModal },
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
      headers: [
        {
          text: 'Name',
          value: 'name',
          width: '30%',
          sortable: false
        },
        {
          text: 'Members',
          value: 'members',
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
      isGroupsLoading: false
    }
  },
  methods: {
    async changeGroupMembers(groupId, members) {
      try {
        this.isGroupsLoading = true

        await updateGroupService(this.$axios, groupId, {
          memberIds: members.map((m) => m.id)
        })

        this.$emit('update')
      } catch (error) {
        console.error(error)
      } finally {
        this.isGroupsLoading = false
      }
    },
    async removeGroup(item) {
      const res = await deleteGroupService(this.$axios, item)
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
.groups-list-table {
  //   .role-column,
  //   .groups-column {
  //     max-width: 200px;
  //   }

  .member-list {
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
