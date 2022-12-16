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
  name: 'CompanySettingsPage',
  components: { UsersSettings, GroupsSettings, CompanySettings, TagsSettings },
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
  middleware: ['auth'],
  created() {
    // If user is not admin, show a 403 FORBIDDEN PAGE
    if (!this.$store.getters['user/isAdmin'])
      this.$nuxt.error({ statusCode: 403 })

    this.$store.dispatch('changePageTitle', 'Settings')

    this.fetchAllData()
  },
  methods: {
    changeShow(show) {
      console.log(show)
      this.showUser = false
      this.showTeam = false
      this.showTag = false
      this.showCompany = false
      if (show === 'User')
        this.showUser = true

      if (show === 'Teams')
        this.showTeam = true

      if (show === 'Tag')
        this.showTag = true

      if (show === 'Company')
        this.showCompany = true
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
  <v-container class="bg-base-100">
    <!-- Users Settings -->

    <div>
      <h1 class="card-title mt-6">
        Settings
      </h1>
      <div class="tabs text-center">
        <a v-if="!showUser" class="tab tab-bordered " @click="changeShow('User')">User</a>
        <a v-else class="tab tab-bordered tab-active ">User</a>

        <a v-if="!showTeam" class="tab tab-bordered " @click="changeShow('Teams')">Teams</a>
        <a v-else class="tab tab-bordered tab-active ">Teams</a>

        <a v-if="!showTag" class="tab tab-bordered " @click="changeShow('Tag')">Tag</a>
        <a v-else class="tab tab-bordered tab-active ">Tag</a>

        <a v-if="!showCompany" class="tab tab-bordered " @click="changeShow('Company')">Company</a>
        <a v-else class="tab tab-bordered tab-active ">Company</a>
      </div>
      <UsersSettings
        v-if="showUser"
        :users="users"
        :groups="groups"
        @update="fetchAllData"
      />
    </div>

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

    <CompanySettings v-if="showCompany" />
  </v-container>
</template>

<style></style>
