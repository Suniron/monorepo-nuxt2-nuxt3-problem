<script>
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
      showUser: true,
      showTeam : false,
      showTag: false,
      showCompany: false,

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
    changeTabToShow(tabToShow) {
      this.showUser = tabToShow === 'users'
      this.showTeam = tabToShow === 'teams'
      this.showTag = tabToShow === 'tags'
      this.showCompany = tabToShow === 'company'
    },
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
  <v-container>
    <h1 class="card-title my-6 text-2xl">
      Settings
    </h1>

    <div class="max-w-6xl mx-auto">
      <div class="tabs flex justify-center">
        <a class="tab tab-lg tab-bordered" :class="{ 'tab-active': showUser }" @click="changeTabToShow('users')">Users</a>
        <a class="tab tab-lg tab-bordered" :class="{ 'tab-active': showTeam }" @click="changeTabToShow('teams')">Teams</a>
        <a class="tab tab-lg tab-bordered" :class="{ 'tab-active': showTag }" @click="changeTabToShow('tags')">Tags</a>
        <a class="tab tab-lg tab-bordered" :class="{ 'tab-active': showCompany }" @click="changeTabToShow('company')">Company</a>
      </div>

      <!-- Users Settings -->
      <UsersSettings
        v-if="showUser"
        :users="users"
        :groups="groups"

        @update="fetchAllData"
      />

      <!-- Groups Settings -->
      <GroupsSettings
        v-if="showTeam"
        :users="users"
        :groups="groups"

        @update="fetchAllData"
      />

      <!-- Tags Settings -->
      <TagsSettings v-if="showTag" :tags="tags" @update="fetchAllData" />

      <!-- Company Settings -->
      <CompanySettings
        v-if="showCompany"
      />
    </div>
  </v-container>
</template>
