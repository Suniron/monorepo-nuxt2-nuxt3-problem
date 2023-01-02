<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useContext } from '@nuxtjs/composition-api'
import { searchAssetsBelonging, searchAssetsService } from '~/services/assets'
import LoadingSpinner from '~/components/utils/LoadingSpinner.vue'
import {
  createBulkRelationService,
  deleteRelationByAssetsIdsService,
} from '~/services/relations'
import type { Asset, AssetWithRelations } from '~/types/asset'

interface AssetWithIsSelected extends Asset {
  isSelected: boolean
}

const props = defineProps<{
  asset: Asset
  isOpen: boolean
  allowedTypes: string[]
  relationWanted: string
  relationType: string
}>()

const emits = defineEmits<{
  (event: 'closed'): void
  (event: 'saved'): void
}>()

const axios = useContext().$axios

const isLoading = ref(true)
const searchAsset = ref('')
const assetsBelongings = ref<AssetWithRelations[]>([])
const availableAssets = ref<AssetWithIsSelected[]>([])
const groupByType = ref(false)
const showOnlySelected = ref(false)
const elementsToLink = ref<number[]>([])
const elementsToUnlink = ref<number[]>([])
const selectedAssets = ref<Asset[]>([])

const linkElement = (elementId: number) => {
  if (!elementsToUnlink.value.includes(elementId))
    return elementsToLink.value.push(elementId)

  elementsToUnlink.value.splice(
    elementsToUnlink.value.indexOf(elementId),
    1,
  )
}

const unlinkElement = (elementId: number) => {
  if (!elementsToLink.value.includes(elementId))
    return elementsToUnlink.value.push(elementId)

  elementsToLink.value.splice(elementsToLink.value.indexOf(elementId), 1)
}

const handleToggleSelectOneItem = (
  { item, value }: {
    item: AssetWithIsSelected
    value: boolean
  }) => {
  item.isSelected = value
  if (!value)
    return unlinkElement(item.id)

  linkElement(item.id)
}

const handleToggleSelectAllItems = (event: {
  items: AssetWithIsSelected[]
  value: boolean
},
) => {
  // Reset lists of elements to link and unlink
  elementsToLink.value = []
  elementsToUnlink.value = []

  event.items.forEach((item) => {
    handleToggleSelectOneItem({ item, value: event.value })
  })

  // = Clean elements to avoid the link of a relation already existing or unlink no existing relations =
  // Remove from unlink list elements that are not already linked
  elementsToUnlink.value = elementsToUnlink.value.filter(
    id => assetsBelongings.value.map(ab => ab.id).includes(id),
  )
  // Remove from link list elements that are already linked
  elementsToLink.value = elementsToLink.value.filter(
    id => !assetsBelongings.value.map(ab => ab.id).includes(id),
  )
}

const fetchAsset = async () => {
  isLoading.value = true
  availableAssets.value = []

  const option = {
    childrenIds: props.relationWanted === 'parents' ? props.asset.id : undefined,
    parentsIds: props.relationWanted === 'children' ? props.asset.id : undefined,
  }

  const { assets } = await searchAssetsService(axios, {
    types: props.allowedTypes,
  })

  const { data: fetchedAssetsBelongings } = await searchAssetsBelonging(
    axios,
    option,
  )

  assetsBelongings.value = fetchedAssetsBelongings.assets.filter(
    fab => fab.id !== props.asset.id,
  )

  availableAssets.value = assets.map((a) => {
    const isSelected = assetsBelongings.value.map(ab => ab.id).includes(a.id)
    return {
      ...a,
      isSelected,
    }
  })

  isLoading.value = false
}

const handleConfirmClick = async () => {
  await Promise.all(
    elementsToUnlink.value.map(newRelativeId =>
      deleteRelationByAssetsIdsService(axios, {
        fromAssetId:
          props.relationWanted === 'children'
            ? newRelativeId
            : props.asset.id,
        relationType: props.relationType,
        toAssetId:
          props.relationWanted === 'children' ? props.asset.id : newRelativeId,
      }),
    ),
  )

  if (elementsToLink.value.length > 0) {
    await createBulkRelationService(
      axios,
      elementsToLink.value.map(newRelativeId => ({
        fromAssetId:
          props.relationWanted === 'children'
            ? newRelativeId
            : props.asset.id,
        relationType: props.relationType,
        toAssetId:
          props.relationWanted === 'children' ? props.asset.id : newRelativeId,
      })),
    )
  }

  elementsToLink.value.splice(0, elementsToLink.value.length)
  elementsToUnlink.value.splice(0, elementsToUnlink.value.length)

  emits('saved')
}

watch(
  () => props.isOpen,
  (value) => {
    if (value)
      fetchAsset()
  },
)

const newUsableAvailableAssets = computed(() => {
  return availableAssets.value
    .filter(
      as =>
        as.id !== props.asset.id
        && !(showOnlySelected.value && !as.isSelected),
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }))
})

watch(newUsableAvailableAssets.value, (value) => {
  selectedAssets.value = value.filter(a => a.isSelected)
})

// TODO: find a way to use selectedAssets.value instead of this
const selected = computed(() => {
  return newUsableAvailableAssets.value.filter(nuaa => nuaa.isSelected)
})

const assetsHeaders = [
  {
    align: 'start',
    text: 'Type',
    value: 'type',
  },
  {
    text: 'Name',
    value: 'name',
  },
]

// Fetch on created
fetchAsset()
</script>

<template>
  <v-card class="d-flex flex-column">
    <v-card-title>Assets inventory</v-card-title>
    <v-card-text>
      <div class="d-flex justify-space-between mx-5">
        <v-switch v-model="groupByType" label="Group by type" hide-details />
        <v-switch v-model="showOnlySelected" label="Show only selected" hide-details />
      </div>
      <div style="border:1px solid black" class="ma-3">
        <v-text-field v-model="searchAsset" dense class="py-0" filled clearable label="Search an asset" hide-details />
        <div class="d-flex flex-column justify-stretch">
          <LoadingSpinner v-if="isLoading" class="align-self-center ma-10" />

          <v-data-table
            v-else
            :value="selected"
            :headers="assetsHeaders"
            :group-by="groupByType ? 'type' : null"
            :items="newUsableAvailableAssets"
            :search="searchAsset"
            :items-per-page="15"
            show-select
            dense
            @click:row="(_, { select }) => select()"
            @item-selected="handleToggleSelectOneItem"
            @toggle-select-all="handleToggleSelectAllItems"
          >
            <template #[`group.header`]="{ group, groupBy, headers, toggle, isOpen }">
              <td :colspan="headers.length">
                <v-btn :ref="group" small icon @click="toggle">
                  <v-icon v-if="isOpen" title="Collapse group">
                    mdi-minus
                  </v-icon>
                  <v-icon v-else title="Expand group">
                    mdi-plus
                  </v-icon>
                </v-btn>

                <span class="mx-5 font-weight-bold">
                  {{
                    assetsHeaders.find((header) => header.value === groupBy[0])
                      .text
                  }}: {{ group }}
                </span>
              </td>
            </template>
          </v-data-table>
        </div>
      </div>
    </v-card-text>
    <v-card-actions class="d-flex justify-end mb-3">
      <v-btn class="mx-3" @click="emits('closed')">
        Cancel
      </v-btn>
      <v-btn color="primary" @click="handleConfirmClick">
        Confirm
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
