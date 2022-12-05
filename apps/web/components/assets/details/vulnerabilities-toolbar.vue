<template>
  <div class="vulnerabilities__toolbar">
    <v-text-field
      v-model="search"
      @input="(txt) => debouncedUpdateFilter({ name: 'search', value: txt })"
      class="search mr-4"
      :label="
        asset.type === 'USER' ? 'Search awareness' : 'Search vulnerability'
      "
      solo
    />
    <v-btn
      color="primary mr-4"
      @click="$emit('change')"
      :disabled="asset.type === 'USER'"
      >+ Add

      {{ asset.type === 'USER' ? 'Awareness' : 'Vulnerability' }}</v-btn
    >

    <div class="vulnerabilities__toolbar__risks">
      <div>
        <div>
          <v-btn
            :class="
              isSeverityActive('critical')
                ? 'risk risk--critical risk--active'
                : 'risk risk--critical risk--not-active'
            "
            @click="toggleSeverityFilter('critical')"
          >
            Critical:
            {{ (asset.vulnerabilities && asset.vulnerabilities.critical) || 0 }}
          </v-btn>
          <v-btn
            :class="
              isSeverityActive('high')
                ? 'risk risk--high risk--active'
                : 'risk risk--high risk--not-active'
            "
            @click="toggleSeverityFilter('high')"
          >
            High:
            {{ (asset.vulnerabilities && asset.vulnerabilities.high) || 0 }}
          </v-btn>
        </div>
        <div class="mt-2">
          <v-btn
            :class="
              isSeverityActive('medium')
                ? 'risk risk--medium risk--active'
                : 'risk risk--medium risk--not-active'
            "
            @click="toggleSeverityFilter('medium')"
          >
            Medium:
            {{ (asset.vulnerabilities && asset.vulnerabilities.medium) || 0 }}
          </v-btn>
          <v-btn
            :class="
              isSeverityActive('low')
                ? 'risk risk--low risk--active'
                : 'risk risk--low risk--not-active'
            "
            @click="toggleSeverityFilter('low')"
          >
            Low: {{ (asset.vulnerabilities && asset.vulnerabilities.low) || 0 }}
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _debounce from 'lodash/debounce'

const DEBOUNCE_WAIT = 300 // ms

export default {
  name: 'AssetDetailsVulnerabilitiesToolbar',
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
      margin-left: 20px;
      min-width: 150px !important;
      @media screen and (max-width: 620px) {
        margin-left: 0px !important;
        margin-bottom: 8px;
      }

      &--low {
        background-color: #f0d802aa;
        color: #555;

        &.risk--active {
          transform: scale(1.1);
          background-color: #f0d802;
          color: black;
        }
      }

      &--medium {
        background-color: #ed9b0eaa;
        color: #555;

        &.risk--active {
          transform: scale(1.1);
          background-color: #ed9b0e;
          color: white;
        }
      }

      &--high {
        background-color: #d92b2baa;
        color: #555;

        &.risk--active {
          transform: scale(1.1);
          background-color: #d92b2b;
          color: black;
        }
      }

      &--critical {
        background-color: #941e1eaa;
        color: #555;

        &.risk--active {
          transform: scale(1.1);
          background-color: #941e1e;
          color: black;
        }
      }
    }
  }
}
</style>
