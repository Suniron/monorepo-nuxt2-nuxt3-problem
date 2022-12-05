<template>
  <div class="text-center">
    <v-dialog v-model="show" width="500">
      <template #activator="{ on, attrs }">
        <v-btn color="success" class="mt-3" v-bind="attrs" v-on="on">
          <v-icon class="mr-1">mdi-plus-circle-outline</v-icon> Add Business
          Unit
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Add Business Unit
        </v-card-title>

        <v-card-text class="py-0">
          <v-autocomplete
            class="mt-3"
            v-model="selectedBusinessUnit"
            :items="availableBusinessUnitNames"
            :search-input.sync="searchedBusinessUnit"
            label="Create or search an existing Business Unit"
            placeholder="Start typing to search (or create)"
            auto-select-first
            hide-no-data
            filled
            chips
          >
          </v-autocomplete>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="show = false">
            cancel
          </v-btn>
          <v-btn color="success" :disabled="!isInputValid" @click="handleSave">
            add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  createAssetService,
  searchAssetsService,
  updateAssetService
} from '~/services/assets'

/**
 * Line creation prefix in dropdown.
 *
 * This must be not a Business Mission name!
 */
const CREATE_PREFIX = 'Create '

export default {
  props: {
    mission: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      show: false,
      isInputValid: false,
      availableUnits: [],
      /**
       * User searched string
       * @type {string}
       */
      searchedBusinessUnit: null,
      selectedBusinessUnit: ''
    }
  },
  computed: {
    /**
     * Get all available business units names listed in dropdown
     * @returns {string[]} available business units names
     */
    availableBusinessUnitNames() {
      const names = this.availableUnits.map((unit) => unit.name)

      // If no user search
      if (!this.searchedBusinessUnit || this.searchedBusinessUnit === '') {
        return names
      }

      return [...names, CREATE_PREFIX + this.searchedBusinessUnit]
    },
    /**
     * Determine if business unit must be created or not
     * @returns {boolean} true if business unit need to be created
     */
    isBusinessUnitNeedCreation() {
      if (!this.selectedBusinessUnit) {
        return false
      }
      return this.selectedBusinessUnit.startsWith(CREATE_PREFIX)
    }
  },
  watch: {
    /**
     * This watcher is used to check input validity
     *
     * @param {string} newVal new user input
     */
    selectedBusinessUnit(newInput) {
      this.isInputValid = this.availableBusinessUnitNames.includes(newInput)
    },
    /**
     * This watcher is used to fetch datas on open and reset it on close.
     * @param {boolean} switchToOpen new show state
     */
    show(switchToOpen) {
      // On open:
      if (switchToOpen) {
        // Get all available business units:
        this.getBusinessUnitsWithoutThisMission()
        return
      }
      // On close, reset datas:
      Object.assign(this.$data, this.$options.data())
    }
  },
  methods: {
    /**
     * Get all business units without this mission and affect in the state
     */
    async getBusinessUnitsWithoutThisMission() {
      const { assets: businessUnits } = await searchAssetsService(this.$axios, {
        types: ['UNIT']
      })
      // Filter only business units without this mission
      this.availableUnits = businessUnits.filter((unit) => {
        return !unit.parents.find((parent) => parent.id === this.mission.id)
      })
    },
    /**
     * Handle save button click
     */
    async handleSave() {
      // If business unit need to be created:
      if (this.isBusinessUnitNeedCreation) {
        // TODO: handle request fail
        await createAssetService(this.$axios, {
          name: this.selectedBusinessUnit.replace(CREATE_PREFIX, ''),
          type: 'UNIT',
          assetData: { parents: [this.mission.id] }
        })
      }
      // ... or add existing business unit to mission
      else {
        const { id: businessUnitId } = this.availableUnits.find(
          (unit) => unit.name === this.selectedBusinessUnit
        )

        await updateAssetService(this.$axios, this.mission.id, {
          assetData: {
            children: [
              ...this.mission.children.map((child) => child.id),
              businessUnitId
            ]
          }
        })
      }

      this.$emit('saved')

      this.show = false // close modal
    }
  }
}
</script>
