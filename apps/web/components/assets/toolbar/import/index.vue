<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '~/components/base/Modal.vue'
import ToolbarImportAssets from '~/components/assets/toolbar/import/Assets.vue'
import ToolbarImportScans from '~/components/assets/toolbar/import/Scans.vue'

const isModalOpen = ref(false)
const tab = ref(0)
</script>

<template>
  <div>
    <v-btn class="ma-1" color="primary" @click="isModalOpen = true">
      Import
    </v-btn>

    <BaseModal v-if="isModalOpen" title="Importation" size="large" @close="isModalOpen = false">
      <div class="tabs">
        <a class="tab tab-lifted" :class="{ 'tab-active': tab === 0 }" @click.stop="tab = 0">Assets</a>
        <a class="tab tab-lifted" :class="{ 'tab-active': tab === 1 }" @click.stop="tab = 1">Scans</a>
      </div>

      <div class="p-2 text-center max-h-96 overflow-y-auto">
        <ToolbarImportAssets v-if="tab === 0" />
        <ToolbarImportScans v-else-if="tab === 1" />
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="isModalOpen = false">
          Cancel
        </button>
      </div>
    </BaseModal>
  </div>
</template>
