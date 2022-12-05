<template>
  <div class="vulnerabilities__toolbar">
    <div class="filters">
      <v-text-field
        v-model="filters.search"
        @input="
          (text) => debouncedUpdateFilter({ name: 'search', value: text })
        "
        class="search mr-4"
        label="Search vulnerability"
      />
    </div>
    <v-spacer></v-spacer>
    <v-dialog v-model="dialog" width="1000">
      <template #activator="{ on, attrs }">
        <v-btn color="primary mr-4" v-bind="attrs" v-on="on"
          >+ Add Vulnerability</v-btn
        >
      </template>
      <v-card ref="newVulnDialog">
        <v-card-title>Add vulnerabilities</v-card-title>
        <v-card-text>
          <vulnerability-form @close="dialog = false" @save="saveVuln" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- NOT CURRENTLY ACTIVE <v-btn color="primary">IMPORT</v-btn> -->
  </div>
</template>

<script>
import _debounce from 'lodash/debounce'
import VulnerabilityForm from '~/components/vulnerabilities/vulnerability-form.vue'

import { createVulnerabilityService } from '@/services/vulnerabilities'

const DEBOUNCE_WAIT = 300 // ms

export default {
  name: 'VulnerabilitiesToolbar',
  components: { VulnerabilityForm },
  props: {
    search: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      filters: {
        search: this.search
      },
      dialog: false
    }
  },
  watch: {
    dialog() {
      // Scroll dialog to the top
      this.$refs.newVulnDialog?.$el.parentNode.scroll(0, 0)
    }
  },
  methods: {
    debouncedUpdateFilter: _debounce(function(payload) {
      this.$emit('filter', payload)
    }, DEBOUNCE_WAIT),
    async saveVuln(form) {
      const id = await createVulnerabilityService(this.$axios, form)
      console.log(id)
      this.$emit('change')
      this.dialog = false
    }
  }
}
</script>

<style lang="scss">
.vulnerabilities__toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .filters {
    display: flex;
    flex-wrap: wrap;

    .v-input {
      min-width: 210px;
    }

    .v-input__slot {
      min-height: 42px;
    }

    .search {
      max-width: 300px;
    }

    .severity-select {
      max-width: 300px;
      .severity {
        &--info {
          background-color: #b0b0b0;
        }
        &--low {
          background-color: #f0d802;
        }
        &--medium {
          background-color: #ed9b0e;
        }
        &--high {
          background-color: #d92b2b;
        }
        &--critical {
          background-color: #941e1e;
        }
      }
    }

    .likelihood-select {
      max-width: 300px;
      .likelihood {
        &--rare {
          background-color: #bcd2e8;
        }
        &--unlikely {
          background-color: #91bad6;
        }
        &--moderate {
          background-color: #528aae;
        }
        &--likely {
          color: white;
          background-color: #2e5984;
        }
        &--certain {
          color: white;
          background-color: #1e3f66;
        }
      }
    }
  }
}
</style>
