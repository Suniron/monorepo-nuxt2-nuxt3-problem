<template>
  <v-row>
    <v-col cols="11">
      <v-container class="max-width">
        <v-pagination
          v-model="page"
          :length="totalPage"
          :total-visible="totalVisiblePages"
          @next="$emit('newPage', { page, pageSize })"
          @previous="$emit('newPage', { page, pageSize })"
          @input="$emit('newPage', { page, pageSize })"
        ></v-pagination>
      </v-container>
    </v-col>
    <v-col v-if="itemsPerPage && !selectType" cols="1">
      <v-text-field
        :value="pageSize"
        type="number"
        min="5"
        :max="totalRecord"
        label="Items per page"
        @input="($event) => debouncedNewPageSize($event)"
      ></v-text-field>
    </v-col>
    <v-col v-if="itemsPerPage && selectType" cols="1">
      <v-select
        v-model="pageSize"
        :items="itemsPerPageOptions"
        label="Items per page"
        @input="($event) => debouncedNewPageSize($event)"
      ></v-select>
    </v-col>
  </v-row>
</template>

<script>
// @ts-check
import _debounce from 'lodash/debounce'

const DEBOUNCE_WAIT = 300 // ms

export default {
  name: 'Pagination',
  props: {
    defaultPageSize: {
      type: Number,
      default: () => 10
    },
    totalRecord: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Boolean,
      default: () => true
    },
    totalVisiblePages: {
      type: Number,
      default: () => 7
    },
    selectType: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      page: 1,
      pageSize: this.defaultPageSize
    }
  },
  computed: {
    /**
     * @returns {number}
     */
    totalPage() {
      return Math.ceil(this.totalRecord / this.pageSize) || 0
    },
    /**
     * @returns {Array.<number>}
     */
    itemsPerPageOptions() {
      return Array.from(
        { length: Math.ceil(this.totalRecord / 5) },
        (_, x) => (x + 1) * 5
      )
    }
  },
  watch: {
    pageSize() {
      if (this.page * this.pageSize >= this.totalRecord)
        this.page = Math.ceil(this.totalRecord / this.pageSize)
    }
  },
  methods: {
    debouncedNewPageSize: _debounce(function(payload) {
      this.pageSize = parseInt(payload, 10)
      this.$emit('newPage', { page: this.page, pageSize: this.pageSize })
    }, DEBOUNCE_WAIT)
  }
}
</script>

<style></style>
