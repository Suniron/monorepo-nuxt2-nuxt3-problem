<script>
// @ts-check
import UsersSettings from '~/components/settings/users/index.vue'
import GroupsSettings from '~/components/settings/groups/index.vue'
import TagsSettings from '~/components/settings/tags/index.vue'
import CompanySettings from '~/components/settings/company/index.vue'

// Services
import { searchUsersService } from '~/services/users'
import { searchGroupsService } from '~/services/groups'
import { searchTagsService } from '~/services/tags'

export default {
  components: { UsersSettings, GroupsSettings, CompanySettings, TagsSettings },
  name: 'CompanySettingsPage',
  middleware: ['auth'],
  data() {
    return {
      groups: [],
      users: [],
      tags: [],
    }
  },
  created() {
    // If user is not admin, show a 403 FORBIDDEN PAGE
    if (!this.$store.getters['user/isAdmin'])
      this.$nuxt.error({ statusCode: 403 })

    this.$store.dispatch('changePageTitle', 'Settings')

    this.fetchAllData()
  },
  methods: {
    async fetchAllData() {
      await Promise.all([
        this.fetchUsers(),
        this.fetchGroups(),
        this.fetchTags(),
      ])
    },
    async fetchGroups() {
      try {
        const { groups } = await searchGroupsService(this.$axios)
        this.groups = groups
      }
      catch (error) {
        console.error(error)
      }
    },
    async fetchTags() {
      try {
        const { tags } = await searchTagsService(this.$axios)
        this.tags = tags
      }
      catch (error) {
        console.error(error)
      }
    },
    async fetchUsers() {
      try {
        const { users } = await searchUsersService(this.$axios)
        this.users = users
      }
      catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<template>
  <v-container style="max-width: 1000px">
    <v-expansion-panels multiple class="mt-8">
      <!-- Users Settings -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Users</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <UsersSettings
            :users="users"
            :groups="groups"
            @update="fetchAllData"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Groups Settings -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Teams</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <GroupsSettings
            :users="users"
            :groups="groups"
            @update="fetchAllData"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Tags Settings -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Tags</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <TagsSettings :tags="tags" @update="fetchAllData" />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Company Settings -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Company Profile</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <CompanySettings />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<style></style>
