<script>
import _debounce from 'lodash/debounce'

import SaveAssetModal from '~/components/assets/save-asset-modal'

// Controls
import GroupsMultiselect from '~/components/controls/groups-multiselect'
import TagsMultiselect from '~/components/controls/tags-multiselect'

const DEBOUNCE_WAIT = 300 // ms

export default {
  components: {
    GroupsMultiselect,
    TagsMultiselect,
    SaveAssetModal
  },
  name: 'AssetsToolbarAlt',
  props: {
    search: {
      type: String,
      default: ''
    },
    /**
     * Array of tag IDs. Used when setting selected tags from route query
     */
    tags: {
      type: Array,
      default: () => []
    },
    severities: {
      type: Array,
      default: () => []
    },
    groups: {
      type: Array,
      default: () => []
    },
    types: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const severities = ['critical', 'high', 'medium', 'low']

    return {
      filters: {
        search: this.search,
        severities: [...this.severities],
        tags: [...this.tags],
        groups: [...this.groups],
        types: [...this.types],
      },
      isSaveModalOpen: false,
      severityOptions: severities.map((severity) => ({
        text: severity,
        value: severity
      })),
      goals: 1,
      imports: [
        { title: 'CSV' },
        { title: 'Nessus' },
        { title: 'Openvas' },
        { title: 'Qualys' },
        { title: 'Bloodhund' },
        { title: 'PingCastle' }
      ],
      ticksLabels: ['0%', '25%', '50%', '100%'],
    }
  },
  created() {
    this.debouncedUpdateFilter = _debounce(this.updateFilter, DEBOUNCE_WAIT)
  },
  watch: {
    groups(newGroups) {
      this.filters.groups = [...newGroups]
    },
    severities(newSeverities) {
      this.filters.severities = [...newSeverities]
    }
  },
  methods: {
    filterGroups(groups) {
      this.$emit('filter', {
        name: 'groupIds',
        value: groups.map(g => g.id),
      })
    },
    removeSeverity(item) {
      this.filters.severities.splice(
        this.filters.severities.indexOf(item.value),
        1,
      )
      this.updateFilter({ name: 'severities', value: [...this.severities] })
    },
    updateFilter(payload) {
      this.$emit('filter', payload)
    },
  },
}
</script>

<template>
  <div>
    <div class="assets__toolbar">
      <v-row>
        <v-col cols="12" lg="8">
          <div class="filters">
            <v-text-field
              v-model="filters.search"
              :value="search"
              class="search mr-4"
              label="Search asset"
              @input="
                (text) => debouncedUpdateFilter({ name: 'search', value: text })
              "
            />
            <TagsMultiselect
              v-model="filters.tags"
              class="mr-4"
              label="Tags"
              placeholder="Select Tags"
              creatable
              @input="
                (tags) =>
                  $emit('filter', {
                    name: 'tagIds',
                    value: tags.map((t) => t.id),
                  })
              "
            />
            <GroupsMultiselect
              v-model="filters.groups"
              label="Groups"
              @input="filterGroups"
            />
          </div>
        </v-col>
        <v-spacer />
        <v-col cols="12" lg="1">
          <div class="actions">
            <v-dialog v-model="isSaveModalOpen" width="500">
              <template #activator="{ on, attrs }">
                <v-btn
                  class="create-asset-btn"
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                >
                  + Create asset
                </v-btn>
              </template>

              <template #default>
                <SaveAssetModal
                  @saved="$emit('saved')"
                  @close="isSaveModalOpen = false"
                />
              </template>
            </v-dialog>
          </div>
        </v-col>
        <v-col cols="12" lg="1" />
      </v-row>
    </div>
    <!-- <v-row>
      <v-col cols="12" lg="12">
        <v-card>
          <v-subheader>ISO 27001 Goal:</v-subheader>
          <v-card-text>
            <v-slider
              v-model="goals"
              :tick-labels="ticksLabels"
              :max="3"
              step="1"
              ticks="always"
              tick-size="4"
              :thumb-size="24"
              thumb-label="always"
              readonly
            ></v-slider>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->
  </div>
</template>

<style lang="scss">
.assets__toolbar {
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

    .tags-multiselect {
      max-width: 300px;
    }

    .severity-select {
      max-width: 300px;
      .severity {
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

    .groups-multiselect {
      max-width: 300px;
    }
  }
  .actions {
    .create-asset-btn {
      min-height: 48px;
      margin-bottom: 16px;
    }
  }
}
</style>
