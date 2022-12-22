<script setup lang="ts">
import { useContext } from '@nuxtjs/composition-api'
import { computed, ref, watch } from 'vue'
import {
  createAssetService,
  searchAssetsService,
  updateAssetService,
} from '~/services/assets'

const props = defineProps<{
  // TODO: use business mission type
  mission: {
    id: string
    children: { id: string }[]
  }
}>()

const emit = defineEmits(
  ['saved'],
)

const axios = useContext().$axios

/**
 * Line creation prefix in dropdown.
 *
 * This must be not a Business Mission name!
 */
const CREATE_PREFIX = 'Create '

const show = ref(false)
const isInputValid = ref(false)
// TODO: use business unit type
const availableUnits = ref<{ id: string; name: string }[]>([])
const searchedBusinessUnit = ref('')
const selectedBusinessUnit = ref('')

const availableBusinessUnitNames = computed(() => {
  const names = availableUnits.value.map(unit => unit.name)

  // If no user search
  if (!searchedBusinessUnit.value || searchedBusinessUnit.value === '')
    return names

  return [...names, CREATE_PREFIX + searchedBusinessUnit.value]
})
const isBusinessUnitNeedCreation = computed(() => {
  if (!selectedBusinessUnit.value)
    return false

  return selectedBusinessUnit.value.startsWith(CREATE_PREFIX)
})

const getBusinessUnitsWithoutThisMission = async () => {
  const { assets: businessUnits } = await searchAssetsService(axios, {
    types: ['UNIT'],
  })
  // Filter only business units without this mission
  availableUnits.value = businessUnits.filter((unit) => {
    return !unit.parents.find(parent => parent.id === props.mission.id)
  })
}
const handleSave = async () => {
  // If business unit need to be created:
  if (isBusinessUnitNeedCreation.value) {
    // TODO: handle request fail
    await createAssetService(axios, {
      assetData: { parents: [props.mission.id] },
      name: selectedBusinessUnit.value.replace(CREATE_PREFIX, ''),
      type: 'UNIT',
    })
  }
  // ... or add existing business unit to mission
  else {
    const { id: businessUnitId } = availableUnits.value.find(
      unit => unit.name === selectedBusinessUnit.value,
    )

    await updateAssetService(axios, props.mission.id, {
      assetData: {
        children: [
          ...props.mission.children.map(child => child.id),
          businessUnitId,
        ],
      },
    })
  }

  emit('saved')

  // Close modal
  show.value = false
}

/**
* This watcher is used to check input validity
*/
watch(selectedBusinessUnit, (newInput: string) => {
  isInputValid.value = availableBusinessUnitNames.value.includes(newInput)
})

watch(show, async (switchToOpen) => {
  // On open:
  if (switchToOpen) {
    // Get all available business units:
    await getBusinessUnitsWithoutThisMission()
    return
  }

  // On close, reset data:
  availableUnits.value = []
  isInputValid.value = false
  searchedBusinessUnit.value = ''
  selectedBusinessUnit.value = ''
  show.value = false
})
</script>

<template>
  <!-- eslint-disable vue/no-deprecated-v-bind-sync -->
  <div class="text-center">
    <v-dialog v-model="show" width="500">
      <template #activator="{ on, attrs }">
        <v-btn color="success" class="mt-3" v-bind="attrs" v-on="on">
          <v-icon class="mr-1">
            mdi-plus-circle-outline
          </v-icon> Add Business
          Unit
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Add Business Unit
        </v-card-title>

        <v-card-text class="py-0">
          <v-autocomplete
            v-model="selectedBusinessUnit"
            :search-input.sync="searchedBusinessUnit" class="mt-3"
            :items="availableBusinessUnitNames" label="Create or search an existing Business Unit"
            placeholder="Start typing to search (or create)"
            auto-select-first
            hide-no-data
            filled chips
          />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
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
