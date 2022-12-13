<script>
// @ts-check

import { mapGetters } from 'vuex'
import RemediationProjectDetailsTab from './tabs/remediation-project-details-tab/index.vue'
import RemediationProjectDiscussionTab from './tabs/remediation-project-discussion-tab/index.vue'
import RemediationProjectEditInfoTab from './tabs/RemediationProjectEditInfoTab.vue'
import RemediationProjectHistoryTab from './tabs/RemediationProjectHistoryTab.vue'
import RemediationProjectEditScopeTab from './tabs/RemediationProjectEditScopeTab.vue'

export default {
  components: {
    RemediationProjectDetailsTab,
    RemediationProjectDiscussionTab,
    RemediationProjectEditInfoTab,
    RemediationProjectEditScopeTab,
    RemediationProjectHistoryTab,
  },
  computed: {
    ...mapGetters('remediationProject', ['isReadOnlyMode', 'isUserOwner']),
  },
  data() {
    return {
      tab: 0,
    }
  },
}
</script>

<template>
  <v-row justify="center">
    <v-col>
      <v-alert
        v-if="isReadOnlyMode"
        icon="mdi-alert"
        type="warning"
        elevation="2"
      >
        You are <b>not allowed</b> to edit this project since you're not owner
        or assignee. It's in <b>read-only</b> mode
      </v-alert>
      <v-tabs v-model="tab" centered>
        <!-- TABS SELECTION -->
        <v-tab>Project Details</v-tab>
        <v-tab>Project Discussion</v-tab>
        <v-tab>Project History</v-tab>
        <!-- Only for owner -->
        <template v-if="!isReadOnlyMode && isUserOwner">
          <v-tab>Edit Project Information</v-tab>
          <v-tab>Edit Project Scope</v-tab>
        </template>

        <!-- TABS CONTENT -->
        <v-tab-item class="pa-4">
          <RemediationProjectDetailsTab />
        </v-tab-item>
        <v-tab-item class="pa-4">
          <RemediationProjectDiscussionTab />
        </v-tab-item>
        <v-tab-item class="pa-4">
          <RemediationProjectHistoryTab />
        </v-tab-item>
        <!-- Only for owner -->
        <template v-if="!isReadOnlyMode && isUserOwner">
          <v-tab-item class="pa-4">
            <RemediationProjectEditInfoTab />
          </v-tab-item>
          <v-tab-item class="pa-4">
            <RemediationProjectEditScopeTab />
          </v-tab-item>
        </template>
      </v-tabs>
    </v-col>
  </v-row>
</template>
