<template>
  <v-row>
    <v-snackbar
      :timeout="4000"
      :vertical="true"
      v-model="showDownloadFileError"
      color="error"
    >
      An error occurred while downloading the file
    </v-snackbar>
    <v-col cols="12" lg="1"></v-col>
    <v-col cols="12" lg="2" class="revisions__toolbar">
      <v-text-field
        v-model="search"
        @input="(txt) => debouncedUpdateFilter({ name: 'search', value: txt })"
        class="search mr-4"
        label="Search content"
        solo
      />
    </v-col>
    <v-spacer></v-spacer>
    <v-col cols="12" lg="2" class="revisions__toolbar__left">
      <v-btn @click.stop="downloadTheLatestVersion" color="primary" download
        >Download latest version</v-btn
      >
    </v-col>
    <v-col cols="12" lg="1"></v-col>
  </v-row>
</template>

<script>
// @ts-check
import _debounce from 'lodash/debounce'
import { startDownloadFile } from '~/services/file_upload'

const DEBOUNCE_WAIT = 300 // ms

export default {
  name: 'AssetDetailsRevisionsToolbar',
  props: {
    filters: {
      type: Object,
      default: () => ({})
    },
    latestVersionUuid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      search: this.filters?.search || '',
      showDownloadFileError: false
    }
  },
  methods: {
    debouncedUpdateFilter: _debounce(function(payload) {
      this.$emit('filter', payload)
    }, DEBOUNCE_WAIT),
    async downloadTheLatestVersion() {
      try {
        await startDownloadFile(this.$axios, this.latestVersionUuid)
      } catch (error) {
        this.showDownloadFileError = true
      }
    }
  }
}
</script>

<style lang="scss">
.revisions__toolbar {
  display: flex;

  .search {
    max-width: 300px;
  }

  .tags-select {
    max-width: 300px;
  }
}
</style>
