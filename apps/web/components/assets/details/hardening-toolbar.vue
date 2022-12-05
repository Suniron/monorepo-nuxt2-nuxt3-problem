<template>
  <div class="vulnerabilities__toolbar">
    <v-text-field
      v-model="search"
      @input="(txt) => debouncedUpdateFilter({ name: 'search', value: txt })"
      class="search mr-4"
      label="Search hardening item"
      solo
    />
  </div>
</template>

<script>
import _debounce from 'lodash/debounce'

const DEBOUNCE_WAIT = 300 // ms

export default {
  name: 'AssetDetailsHardeningToolbar',
  props: {
    asset: {
      type: Object,
      required: true
    },
    filters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      search: this.filters?.search || '',
      dialog: false,
      severities: Array.isArray(this.filters?.severities)
        ? [...this.filters.severities]
        : []
    }
  },
  computed: {
    isSeverityActive() {
      return function(severity) {
        return Boolean(this.$route.query.severities?.includes(severity))
      }
    }
  },
  created() {
    if (this.$route.query.severities) {
      this.toggleSeverityFilter(this.$route.query.severities)
    }
  },
  methods: {
    debouncedUpdateFilter: _debounce(function(payload) {
      this.$emit('filter', payload)
    }, DEBOUNCE_WAIT),
    toggleSeverityFilter(severity) {
      if (this.severities.includes(severity)) {
        const newSeverities = [...this.severities]
        newSeverities.splice(newSeverities.indexOf(severity), 1)
        this.severities = newSeverities
      } else {
        this.severities = [...this.severities, severity]
      }

      this.$emit('filter', { name: 'severities', value: [...this.severities] })
    }
  }
}
</script>

<style lang="scss">
.vulnerabilities__toolbar {
  display: flex;

  .search {
    max-width: 300px;
  }

  .tags-select {
    max-width: 300px;
  }

  div.vulnerabilities__toolbar__risks {
    margin-left: 32px;
    display: flex;
    flex-wrap: wrap;
    @media screen and (max-width: 620px) {
      margin-left: 0px !important;
    }

    button.risk {
      min-width: 150px !important;
      @media screen and (max-width: 620px) {
        margin-left: 0px !important;
        margin-bottom: 8px;
      }

      &--low {
        background-color: #f0d802aa;
        color: #555;

        &.risk--active {
          background-color: #f0d802;
          color: black;
        }
      }

      &--medium {
        background-color: #ed9b0eaa;
        color: #555;

        &.risk--active {
          background-color: #ed9b0e;
          color: black;
        }
      }

      &--high {
        background-color: #d92b2baa;
        color: #555;

        &.risk--active {
          background-color: #d92b2b;
          color: black;
        }
      }

      &--critical {
        background-color: #941e1eaa;
        color: #555;

        &.risk--active {
          background-color: #941e1e;
          color: black;
        }
      }
    }
  }
}
</style>
