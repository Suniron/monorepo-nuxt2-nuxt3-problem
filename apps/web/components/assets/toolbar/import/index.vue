<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '~/components/base/Modal.vue'
import ToolbarImportAssets from '~/components/assets/toolbar/import/Assets.vue'
import ScanImport from '~/components/controls/scan-import.vue'

// import ToolbarImportScans from '~/components/assets/toolbar/import/Scans.vue'

const isModalOpen = ref(false)
const tab = ref(0)
</script>

<template>
  <div>
    <v-btn class="ma-1" color="primary" @click="isModalOpen = true">
      Import
    </v-btn>

    <BaseModal v-if="isModalOpen" title="Importation" size="medium" @close="isModalOpen = false">
      <div class="tabs">
        <a class="tab tab-lifted" :class="{ 'tab-active': tab === 0 }" @click.stop="tab = 0">Assets</a>
        <a class="tab tab-lifted" :class="{ 'tab-active': tab === 1 }" @click.stop="tab = 1">Scans</a>
      </div>

      <div class="p-2 text-center">
        <ToolbarImportAssets v-if="tab === 0" />
        <!-- TODO: will be redesigned into <ToolbarImportScans /> in XRAT-584 -->
        <ScanImport v-else-if="tab === 1" />
        <!-- <ToolbarImportScans/> -->
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="isModalOpen = false">
          Close
        </button>
      </div>
    </BaseModal>
  </div>
</template>
