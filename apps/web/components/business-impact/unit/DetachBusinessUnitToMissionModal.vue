<script>
import { updateAssetService } from '~/services/assets'

export default {
  data() {
    return {
      show: false
    }
  },
  props: {
    mission: {
      type: Object,
      required: true
    },
    unit: {
      type: Object,
      required: true
    }
  },
  methods: {
    async handleConfirm() {
      // Get all business units without current unit:
      const businessUnitsWithoutCurrent = this.mission.children.filter(
        businessUnit => businessUnit.id !== this.unit.unitId,
      )

      try {
        // Send update..
        await updateAssetService(this.$axios, this.mission.id, {
          assetData: {
            children: businessUnitsWithoutCurrent.map(m => m.id),
          },
        })

        this.$emit('saved')
      }
      catch (e) {
        // TODO: handle request fail
      }

      // close modal
      this.show = false
    },
  },
}
</script>

<template>
  <v-dialog v-model="show" width="500">
    <template #activator="{ on, attrs }">
      <v-btn
        id="modal-button"
        v-bind="attrs"
        color="error"
        x-small
        text
        v-on="on"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>

    <template #default>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Detach Business Unit
        </v-card-title>
        <v-card-text>
          <p class="mt-2">
            Are you sure you want to detach this business unit

            <span class="font-weight-bold">"{{ unit.name }}"</span>

            from the business mission

            <span class="font-weight-bold">"{{ mission.name }}"?</span>
          </p>

          <v-alert dense text type="warning">
            All the business impacts and severities attached will be
            lost
          </v-alert>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn @click="show = false">
            cancel
          </v-btn>
          <v-btn color="success" @click="handleConfirm">
            confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style lang="scss" scoped>
#modal-button {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 0px;
  min-height: 0px;
  padding: 0;
  margin: 2px;
}

#modal-button i {
  color: black;
}

#modal-button i:hover {
  color: inherit;
}
</style>
