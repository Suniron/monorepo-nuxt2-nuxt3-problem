<script>
import NetworkDiagram from '~/components/cartography/network-diagram.vue'
import {
  createCartographyService,
  deleteCartographyService,
  fetchCartographiesService,
  updateCartographyService,
} from '~/services/cartography'

export default {
  components: { NetworkDiagram },
  name: 'CartographyPage',
  middleware: ['auth'],
  data() {
    return {
      newNode: '',
      cy: [],
      tab: 1,
      isDeleteDialogOpen: false,
      toDelete: null,
    }
  },
  created() {
    this.$store.dispatch('changePageTitle', 'Network')
    this.fetchCy()
  },
  methods: {
    async addTab() {
      const cyId = await createCartographyService(this.$axios)
      this.cy.push({ id: cyId, name: '' })
      this.tab = this.cy.length
    },
    async deleteCy() {
      await deleteCartographyService(this.$axios, this.toDelete.id)
      this.cy.splice(
        this.cy.findIndex(e => e.id === this.toDelete.id),
        1,
      )
      this.toDelete = null
      this.isDeleteDialogOpen = false
    },
    deleteCyStep(cy) {
      this.toDelete = cy
      this.isDeleteDialogOpen = true
    },
    async fetchCy() {
      const cy = await fetchCartographiesService(this.$axios)
      this.cy = cy
      this.tab = 1
    },
    tmp() {
      console.log(this.tab)
    },
    async updateCy(cyId) {
      const cy = this.cy.find(e => e.id === cyId)
      if (cy)
        await updateCartographyService(this.$axios, cyId, cy)
    },
  },
}
</script>

<template>
  <v-container>
    <v-tabs v-model="tab" @change="tmp">
      <v-tab v-for="c in cy" :key="c.id">
        <v-text-field
          v-model="c.name"
          class="mt-6 tab-text"
          single-line
          dense
          full-width
          append-icon="mdi-trash-can-outline"
          @change="updateCy(c.id)"
          @click:append="deleteCyStep(c)"
        />
      </v-tab>
      <v-tab @click="addTab">
        <v-icon>mdi-plus</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="c in cy" :key="c.id">
        <v-card>
          <NetworkDiagram
            :new-node-props="newNode"
            :cy-id="c.id"
            :network-name="c.name"
          />
        </v-card>
      </v-tab-item>
      <v-tab-item />
    </v-tabs-items>
    <v-dialog v-model="isDeleteDialogOpen" width="500">
      <template #default>
        <v-card>
          <v-card-title>Delete Cartography</v-card-title>
          <v-card-text>
            Are you sure you want to delete this cartography ?
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="isDeleteDialogOpen = false">
              Cancel
            </v-btn>
            <v-btn color="primary" text @click="deleteCy">
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-container>
</template>

<style lang="scss">
.tab-text {
  width: fit-content !important;
}
</style>
