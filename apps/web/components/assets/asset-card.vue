<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '@nuxtjs/composition-api'
import AssetIcon from '~/components/assets/AssetIcon.vue'
import SaveAssetModal from '~/components/assets/save-asset-modal.vue'
import RemoveAssetModal from '~/components/assets/remove-asset-modal.vue'
import AssetInfo from '~/components/assets/type/AssetInfo.vue'

const { asset } = defineProps({
  asset: { required: true, type: Object },
})

const emit = defineEmits(['saved', 'delete'])

const router = useRouter()

const isRemoveModalOpen = ref(false)
const isSaveModalOpen = ref(false)

const goToAssetPage = () => {
  router.push(`/assets/${asset.id}`)
}
</script>

<template>
  <v-card
    v-test="`asset-list-card-${asset.id}`"
    class="asset-card"
    @click.exact="goToAssetPage"
  >
    <v-dialog v-model="isSaveModalOpen" width="500">
      <template #activator="{ on, attrs }">
        <v-btn class="edit-asset-btn" small icon v-bind="attrs" v-on="on">
          <v-icon>mdi-pen</v-icon>
        </v-btn>
      </template>

      <template #default>
        <SaveAssetModal
          :is-update="true"
          :asset="asset"
          @saved="emit('saved')"
          @close="isSaveModalOpen = false"
        />
      </template>
    </v-dialog>

    <v-dialog v-model="isRemoveModalOpen" width="500">
      <template #activator="{ on, attrs }">
        <v-btn class="remove-asset-btn" small icon v-bind="attrs" v-on="on">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <template #default>
        <RemoveAssetModal
          :asset="asset"
          @delete="emit('delete')"
          @close="isRemoveModalOpen = false"
        />
      </template>
    </v-dialog>

    <div class="d-flex flex-column justify-space-between align-center">
      <AssetIcon :os="asset.os || asset.language || asset.type" />
    </div>

    <div class="asset-card__details mt-5">
      <AssetInfo :asset="asset" section="cardDetails" />
      <AssetInfo :asset="asset" section="cardFooter" />
    </div>
  </v-card>
</template>

<style lang="scss">
.asset-card {
  position: relative;
  padding: 20px 16px;
  transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  height: 100%;

  .v-input {
    width: 100%;
  }

  .edit-asset-btn {
    visibility: hidden;
    position: absolute;
    top: 16px;
    right: 16px;
  }

  .remove-asset-btn {
    visibility: hidden;
    position: absolute;
    top: 16px;
    left: 16px;
  }

  &:hover {
    cursor: pointer;
    box-shadow: 0 0.5rem 1rem rgba(black, 0.2) !important;

    .edit-asset-btn,
    .remove-asset-btn {
      visibility: visible;
    }
  }

  &__title {
    font-weight: 500;
    font-size: 16px;
    text-align: center;
  }

  &__details {
    font-size: 14px;
  }

  .asset-icon-wrapper {
    min-height: 65px;
    text-align: center;
  }
}
</style>
