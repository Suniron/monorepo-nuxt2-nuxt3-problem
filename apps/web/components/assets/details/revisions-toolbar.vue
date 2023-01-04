<script>
// @ts-check
import _debounce from 'lodash/debounce'
import { startDownloadFile } from '~/services/fileUpload'

const DEBOUNCE_WAIT = 300 // ms

export default {
  name: 'AssetDetailsRevisionsToolbar',
  data() {
    return {
      search: this.filters?.search || '',
      showDownloadFileError: false
    }
  },
  methods: {
    debouncedUpdateFilter: _debounce(function (payload) {
      this.$emit('filter', payload)
    }, DEBOUNCE_WAIT),
    async downloadTheLatestVersion() {
      try {
        await startDownloadFile(this.$axios, this.latestVersionUuid)
      }
      catch (error) {
        this.showDownloadFileError = true
      }
    },
  },
  props: {
    filters: {
      default: () => ({}),
      type: Object,
    },
    latestVersionUuid: {
      default: '',
      type: String,
    },
  },
}
</script>

<template>
  <v-row>
    <v-snackbar
      v-model="showDownloadFileError"
      :timeout="4000"
      :vertical="true"
      color="error"
    >
      An error occurred while downloading the file
    </v-snackbar>
    <v-col cols="12" lg="1" />
    <v-col cols="12" lg="2" class="revisions__toolbar">
      <v-text-field
        v-model="search"
        class="search mr-4"
        label="Search content"
        solo
        @input="(txt) => debouncedUpdateFilter({ name: 'search', value: txt })"
      />
    </v-col>
    <v-spacer />
    <v-col cols="12" lg="2" class="revisions__toolbar__left">
      <v-btn color="primary" download @click.stop="downloadTheLatestVersion">
        Download latest version
      </v-btn>
    </v-col>
    <v-col cols="12" lg="1" />
  </v-row>
</template>

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
