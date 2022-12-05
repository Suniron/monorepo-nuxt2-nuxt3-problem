<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12" lg="6">
          <v-select
            :items="users"
            v-model="owner"
            item-text="firstName"
            item-value="id"
            placeholder="Select Owner"
            label="Owner"
            color="#0C8F10"
            @change="$emit('change', { owner: owner })"
            :menu-props="{
              bottom: true,
              offsetY: true,
              closeOnClick: true
            }"
          >
          </v-select>
        </v-col>
        <v-col cols="12" lg="6">
          <v-select
            :items="users"
            v-model="maintainer"
            item-text="firstName"
            item-value="id"
            placeholder="Select Maintainer"
            label="Maintainer"
            color="#0C8F10"
            @change="$emit('change', { maintainer: maintainer })"
            :menu-props="{
              bottom: true,
              offsetY: true,
              closeOnClick: true
            }"
          >
          </v-select>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
const getUsers = () => [
  {
    id: 'ciso-id',
    firstName: 'François',
    lastName: 'Moerman',
    role: 'ciso',
    groups: ['Management']
  },
  {
    id: 'admin1',
    firstName: 'Kanye',
    lastName: 'West',
    role: 'admin',
    groups: ['Management', 'Security']
  },
  {
    id: 'admin2',
    firstName: 'Michael',
    lastName: 'Jordan',
    role: 'member',
    groups: ['Staff']
  }
]
export default {
  data() {
    return {
      users: [],
      owner: null,
      maintainer: null
    }
  },
  mounted() {
    this.fetchUsers()
  },
  methods: {
    fetchUsers() {
      const self = this
      setTimeout(() => {
        self.users = getUsers()
      }, 100)
    }
  }
}
</script>
