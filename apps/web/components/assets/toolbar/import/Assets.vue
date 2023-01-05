<script setup lang="ts">
import { useContext } from '@nuxtjs/composition-api'
import { computed, ref } from 'vue'
import { processCSV } from '~/services/fileUpload'
import BaseAlert from '~/components/base/Alert.vue'
import type { FailedCsvImportSimple, FailedCsvImportWithAssetData } from '~/services/assets'
import { importCsvService } from '~/services/assets'

const axios = useContext().$axios

const fileWarningMessage = ref('')
const importedWithSuccessCount = ref(0)
const uploadedCsvFile = ref<File>()
const isCsvValid = ref(false)
const csvDataRows = ref<string[][]>([])

const csvHeaders = ref<{ csv: number[]; key: string }[]>([])

const failedToImport = ref<(FailedCsvImportSimple | FailedCsvImportWithAssetData)[]>([])
const failedImportedAssets = computed(() => {
  const assets = failedToImport.value.filter((fti) => {
    return 'assetData' in fti
  })

  return assets as FailedCsvImportWithAssetData[]
})

const resetState = () => {
  fileWarningMessage.value = ''
  importedWithSuccessCount.value = 0
  failedToImport.value = []
  uploadedCsvFile.value = undefined
  isCsvValid.value = false
  csvDataRows.value = []
  csvHeaders.value = []
}

/**
 * This method is called when the user uploads a CSV file
 */
const handleFileInput = async (e:
| Event,
) => {
  resetState()

  const target = e.target as HTMLInputElement
  const uploadedFile: File = (target.files as FileList)[0]

  if (!uploadedFile)
    return

  if (uploadedFile.type !== 'text/csv') {
    fileWarningMessage.value = 'Please upload a file with the .csv extension.'
    return
  }

  uploadedCsvFile.value = uploadedFile

  const fileData = new FormData()
  fileData.append('files', uploadedCsvFile.value, uploadedCsvFile.value.name)

  const data = await processCSV(axios, fileData)

  // If csv file processing failed
  if (!data.csvData || !data.csvHeaders || !data.headers) {
    fileWarningMessage.value = 'Your CSV file is not valid, please follow "sample file" structure.'
    return
  }
  // If there is no data in csv file
  else if (data.csvData.length === 0) {
    fileWarningMessage.value = 'Your CSV file is empty, please fill it with your assets.'
    return
  }
  // If some column headers are not valid
  else if (data.csvHeaders.length !== data.headers.length) {
    /**
     * Headers which are in the uploaded CSV file but not in the valid headers in DB
     */
    const invalidHeaders = data.csvHeaders.filter(csvHeader => !data.headers.map(h => h.key).includes(csvHeader.csv))
    fileWarningMessage.value = `Some columns in your CSV file are not valid: "${invalidHeaders.map(ih => ih.csv).join(', ')}", please correct them.`
    return
  }

  csvHeaders.value = data.headers
  csvDataRows.value = data.csvData
  isCsvValid.value = true
}

const handleConfirmImport = async () => {
  const { pass, failed } = await importCsvService(axios, {
    data: csvDataRows.value,
    headers: csvHeaders.value,
  })

  resetState()
  // TODO reset input file, watcher ?

  importedWithSuccessCount.value = pass
  failedToImport.value = failed
}
</script>

<template>
  <div class="flex flex-col items-center">
    <ul class="steps steps-vertical">
      <li class="step">
        <a class="btn btn-sm btn-outline btn-primary gap-2" href="/files/sample_import_assets.csv" download="">
          Download a sample CSV file
          <svg
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6"
          >
            <path
              stroke-linecap="round" stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </a>
      </li>
      <li class="step">
        Fill the CSV file with your assets
      </li>
      <li class="step">
        <div class="flex gap-2">
          Upload
          <input
            type="file" accept=".csv"
            class="file-input file-input-sm file-input-bordered file-input-primary w-full max-w-xs"
            @input="e => handleFileInput(e)"
          >
        </div>
      </li>
      <li class="step">
        <div v-if="isCsvValid" class="flex items-center gap-2">
          <b>{{ csvDataRows.length }}</b> assets are detected in your file
          <button class="btn btn-primary btn-sm mx-1" @click="handleConfirmImport">
            confirm import
          </button>
        </div>
        <div v-else class="italic">
          upload a valid CSV file to continue
        </div>
      </li>
    </ul>

    <!--  Notification area -->
    <div class="max-w-md">
      <BaseAlert v-if="fileWarningMessage" class="my-1" type="warning">
        {{ fileWarningMessage }}
      </BaseAlert>

      <BaseAlert v-if="importedWithSuccessCount" class="my-1" type="success">
        <b>{{ importedWithSuccessCount }}</b> asset(s) imported successfully
      </BaseAlert>

      <!-- TODO: print info about errors -->
      <BaseAlert v-if="failedImportedAssets.length" class="my-1" type="warning">
        <p><b>{{ failedImportedAssets.length }}</b> asset(s) could not be imported: {{ failedImportedAssets.map(fia => fia.name).join(", ") }}.</p>
        <p class="italic">
          Please, check if names are unique, for example.
        </p>
      </BaseAlert>
    </div>
  </div>
</template>
