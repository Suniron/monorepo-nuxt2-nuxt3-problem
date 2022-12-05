<template>
  <div>
    <v-data-iterator
      :items="hardening"
      :items-per-page="200"
      item-key="id"
      hide-default-footer
    >
      <template #default="{ items }">
        <v-expansion-panels v-model="panel">
          <v-expansion-panel v-for="item of items" :key="item.hardId">
            <v-expansion-panel-header>
              <div class="vulnerability-header">
                <div class="vulnerability-header__name">
                  {{ item.name }}
                </div>
                <div
                  v-if="item.details[0].severity"
                  class="vulnerability-header__severity"
                >
                  <v-chip
                    :color="severityColor(item.details[0].severity)"
                    class="severity-chip"
                    small
                  >
                    {{ item.details[0].severity }}
                  </v-chip>
                </div>
                <v-spacer></v-spacer>
                <!-- Modal Activator -->

                <v-btn
                  small
                  icon
                  @click.stop="openModal(item)"
                  class="justify-end"
                >
                  <v-chip small>
                    {{ displayStatus(item.details) }}
                    <v-icon small right>mdi-file-document-edit-outline</v-icon>
                  </v-chip>
                </v-btn>
              </div>
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <v-tabs v-model="tab">
                <v-tab>Details</v-tab>
                <v-tab>Comment</v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item>
                  <v-row>
                    <v-col cols="12" lg="6">
                      <div class="vulnerability-content">
                        <!-- Description -->
                        <template v-if="item.description">
                          <h4>Description</h4>
                          <p>
                            <span>{{ item.description.trim() }}</span>
                          </p>
                        </template>

                        <!-- Remediation -->
                        <template v-if="item.remediation">
                          <h4>Remediation</h4>
                          <p>
                            <span>{{ item.remediation.trim() }}</span>
                          </p>
                        </template>

                        <!-- Tracking -->
                        <template v-if="item.tracking">
                          <h4>Tracking</h4>
                          <p v-if="item.tracking.type === 'text'">
                            {{ item.tracking.value }}
                          </p>
                          <img
                            v-else-if="item.tracking.type === 'img'"
                            :src="getBase64Img(item.tracking.value)"
                          />
                        </template>
                      </div>
                    </v-col>
                    <v-col cols="12" lg="6">
                      <div class="vulnerability-content">
                        <template v-if="item.insight">
                          <h4>Expected Value:</h4>
                          <p>{{ item.insight }}</p>
                        </template>
                        <template v-if="item.details">
                          <h4>Current Value:</h4>
                          <p>{{ item.details[0].details }}</p>
                        </template>
                      </div>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <comments
                    :asset-id="asset.id"
                    :vuln-id="item.details[0].hard_id"
                  />
                </v-tab-item>
              </v-tabs-items>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </v-data-iterator>
    <v-dialog v-model="isModalOpen" width="1200">
      <template #default>
        <update-status
          :vulnerability="modalData.hardening"
          :vulnerabilities="modalData.hardening"
          :asset-id="asset.id"
          @close="isModalOpen = false"
        />
      </template>
    </v-dialog>
  </div>
</template>

<script>
import updateStatus from '~/components/vulnerabilities/update-status.vue'
import comments from '~/components/blog/comments.vue'

export default {
  name: 'HardeningList',
  components: {
    updateStatus,
    comments
    // AssetInfo: () => import('~/components/assets/type/asset-info.vue')
  },
  props: {
    hardening: {
      type: Array,
      required: true
    },
    asset: {
      type: Object,
      required: true
    },
    tabProp: {
      type: Number,
      default: 0
    },
    panelProp: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isModalOpen: false,
      tab: null,
      panel: null,
      modalData: {
        hardening: null,
        hardenings: null
      }
    }
  },
  watch: {
    panelProp(newVal, oldVal) {
      this.panel = newVal
    }
  },
  mounted() {
    this.tab = this.tabProp
    this.panel = this.panelProp
  },
  methods: {
    openModal(item) {
      this.modalData.hardening = item
      this.modalData.hardenings = item.details
      this.isModalOpen = true
    },
    severityColor(severity) {
      if (severity === 'low') return '#f0d802'
      if (severity === 'medium') return '#ed9b0e'
      if (severity === 'high') return '#d92b2b'
      if (severity === 'critical') return '#941e1e'
      return '#b0b0b0'
    },
    getBase64Img(data) {
      return `data:image/png;base64, ${data}`
    },
    getHighlighyTextParts(text = '') {
      const X_TAG = '@@X_HIGHLIGHT@@'
      return text.split(X_TAG)
    },
    updateStatus() {
      console.log('UPDATE')
    },
    toHtml2(details) {
      return details // .replaceAll('    ', '&nbsp;&nbsp;&nbsp;&nbsp;')
    },
    displayStatus(details) {
      let open = false
      let accepted = false
      let closed = false
      let status = ''
      details.forEach((element) => {
        if (!element.status || element.status.toLowerCase() === 'open')
          open = true
        else if (element.status.toLowerCase() === 'accepted') accepted = true
        else if (element.status.toLowerCase() === 'remediated') closed = true
      })
      if (open && accepted && closed) status = 'Open, Accepted & Remediated'
      else if (open && accepted) status = 'Open & Accepted'
      else if (open && closed) status = 'Open & Remediated'
      else if (accepted && closed) status = 'Accepted & Remediated'
      else if (open) status = 'Open'
      else if (accepted) status = 'Accepted'
      else status = 'Remediated'
      return status
    }
  }
}
</script>

<style lang="scss">
.vulnerability-header {
  display: flex;
  align-items: center;

  &__severity {
    margin-left: 16px;
    @media screen and (max-width: 959px) {
      margin-left: 0;
      margin-right: 8px;
    }

    &--low {
      background-color: #f0d802 !important;
      color: black;
    }

    &--medium {
      background-color: #ed9b0e !important;
      color: black;
    }

    &--high {
      background-color: #d92b2b !important;
    }

    &--critical {
      background-color: #941e1e !important;
    }
  }
}

.vulnerability-content {
  p {
    white-space: pre-wrap;
  }
}
</style>
