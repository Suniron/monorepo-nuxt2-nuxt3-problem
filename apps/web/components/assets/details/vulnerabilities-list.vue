<template>
  <div>
    <v-data-iterator
      :items="vulnerabilities"
      :items-per-page="200"
      item-key="id"
      hide-default-footer
    >
      <template #default="{ items }">
        <v-expansion-panels v-model="panel">
          <v-expansion-panel v-for="(item, i) of items" :key="i">
            <v-expansion-panel-header>
              <div class="vulnerability-header">
                <v-chip
                  v-if="item.details[0].vuln_publication_date"
                  class="vulnerability-header__date"
                  style="font-size:0.6em; margin-right:1em"
                >
                  {{ item.details[0].vuln_publication_date }}
                </v-chip>
                <div class="vulnerability-header__name">
                  {{ item.name }}
                </div>
                <div class="vulnerability-header__chips">
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
                  <div
                    v-if="
                      item.details &&
                        item.details.length === 1 &&
                        item.details[0].port
                    "
                    class="vulnerability-header__severity"
                  >
                    <v-chip class="severity-chip" small>
                      {{ item.details[0].port }}/{{ item.details[0].protocol }}
                    </v-chip>
                  </div>
                  <div
                    v-else-if="item.details && item.details.length > 1"
                    class="vulnerability-header__severity"
                  >
                    <v-chip
                      v-if="item.details.find((detail) => detail.ip)"
                      class="severity-chip"
                      small
                    >
                      {{ item.details.length }} Affected Ports
                    </v-chip>
                    <v-chip
                      v-if="item.details[0].uri"
                      class="severity-chip"
                      small
                    >
                      {{ item.details.length }} Affected Uris
                    </v-chip>
                  </div>
                  <div
                    v-if="item.cves && item.cves.length"
                    class="vulnerability-header__severity"
                  >
                    <v-chip class="severity-chip" small>
                      {{ item.cves[0].value }}
                    </v-chip>
                  </div>
                  <div
                    v-if="item.details[0].cvss_score"
                    class="vulnerability-header__severity"
                  >
                    <v-chip small>
                      CVSS Score : {{ item.details[0].cvss_score }}
                    </v-chip>
                  </div>
                </div>
                <v-spacer></v-spacer>
                <!-- Modal Activator -->
                <v-chip small @click.stop="openModal(item)">
                  {{ displayStatus(item.details) }}
                  <v-icon small color="primary" class="ml-2">
                    mdi-square-edit-outline
                  </v-icon>
                </v-chip>
              </div>
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <v-tabs v-model="tab">
                <v-tab>Details</v-tab>
                <v-tab>Comment</v-tab>
                <v-tab>Affected</v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item>
                  <v-row>
                    <v-col cols="12" lg="6">
                      <div class="vulnerability-content">
                        <!-- Description -->
                        <h4>Description</h4>
                        <p v-html="item.description"></p>
                        <!-- Remediation -->
                        <template v-if="item.remediation">
                          <h4>Remediation</h4>
                          <p v-html="item.remediation"></p>
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
                        <template v-if="item.cves && item.cves.length">
                          <h4>CVE(s)</h4>
                          <p>
                            <span v-for="(cve, i) in item.cves" :key="i"
                              >{{ cve.value
                              }}<span
                                v-if="i != Object.entries(item.cves).length - 1"
                                >,
                              </span></span
                            >
                          </p>
                        </template>
                        <template v-if="item.refs && item.refs.length">
                          <h4>Reference(s)</h4>
                          <p>
                            <span v-for="(ref, i) in item.refs" :key="i"
                              >{{ ref.value
                              }}<span
                                v-if="i != Object.entries(item.refs).length - 1"
                                ><br /></span
                            ></span>
                          </p>
                        </template>
                      </div>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <comments
                    :asset-id="asset.id"
                    :vuln-id="item.details[0].vast_id"
                  />
                </v-tab-item>
                <v-tab-item style="margin-top:2em">
                  <!-- Details -->
                  <template v-if="item.details" style="margin-top:1em">
                    <AssetInfo
                      :asset="asset"
                      section="detailsTable"
                      :details="item.details"
                      :item="item"
                    />
                  </template>
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
          :vulnerability="modalData.vulnerability"
          :vulnerabilities="modalData.vulnerabilities"
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
// import VulnerabilityForm from '@/components/assets/details/vulnerability-form.vue'
export default {
  name: 'VulnerabilitiesList',
  components: {
    updateStatus,
    comments,
    // VulnerabilityForm,
    AssetInfo: () => import('~/components/assets/type/AssetInfo.vue')
  },
  props: {
    vulnerabilities: {
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
      isModalOpen2: false,
      isModalOpen: false,
      tab: null,
      panel: null,
      modalData: {
        vulnerability: null,
        vulnerabilities: null
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
      this.modalData.vulnerability = item
      this.modalData.vulnerabilities = item.details
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
    doHeaders(details) {
      if (details[0].ip) {
        return [
          { text: 'Ip', value: 'ip' },
          { text: 'Port', value: 'port' },
          { text: 'Severity', value: 'severity' },
          { text: 'Status', value: 'status' },
          { text: 'Custom Descripton', value: 'custom_description' },
          { text: 'Custom Remediation', value: 'custom_remediation' },
          { text: 'Details', value: 'details' },
          { text: 'CVSS Score', value: 'cvss_score' },
          { text: 'CVSS Code', value: 'cvss_code' }
        ]
      } else {
        return [
          { text: 'Uri', value: 'uri' },
          { text: 'Severity', value: 'severity' },
          { text: 'Status', value: 'status' }
        ]
      }
    },
    toHtml2(details) {
      return details.replaceAll('    ', '&nbsp;&nbsp;&nbsp;&nbsp;')
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
  flex-wrap: nowrap !important;
  gap: 10px;

  &__name {
    width: 50%;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-left: 10px;
    margin-right: 10px;

    .vulnerability-header__severity {
      margin-left: 0px;
    }
  }

  &__severity {
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
