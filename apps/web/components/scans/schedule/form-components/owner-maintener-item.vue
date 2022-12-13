<script>
const getUsers = () => [
  {
    firstName: 'François',
    groups: ['Management'],
    id: 'ciso-id',
    lastName: 'Moerman',
    role: 'ciso',
  },
  {
    firstName: 'Kanye',
    groups: ['Management', 'Security'],
    id: 'admin1',
    lastName: 'West',
    role: 'admin',
  },
  {
    firstName: 'Michael',
    groups: ['Staff'],
    id: 'admin2',
    lastName: 'Jordan',
    role: 'member',
  },
]
export default {
  data() {
    return {
      maintainer: null,
      owner: null,
      users: [],
    }
  },
  methods: {
    fetchUsers() {
      const self = this
      setTimeout(() => {
        self.users = getUsers()
      }, 100)
    }
  },
  mounted() {
    this.fetchUsers()
  }
}
</script>

<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12" lg="6">
          <v-select
            v-model="owner"
            :items="users"
            item-text="firstName"
            item-value="id"
            placeholder="Select Owner"
            label="Owner"
            color="#0C8F10"
            :menu-props="{
              bottom: true,
              offsetY: true,
              closeOnClick: true,
            }"
            @change="$emit('change', { owner })"
          />
        </v-col>
        <v-col cols="12" lg="6">
          <v-select
            v-model="maintainer"
            :items="users"
            item-text="firstName"
            item-value="id"
            placeholder="Select Maintainer"
            label="Maintainer"
            color="#0C8F10"
            :menu-props="{
              bottom: true,
              offsetY: true,
              closeOnClick: true,
            }"
            @change="$emit('change', { maintainer })"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
