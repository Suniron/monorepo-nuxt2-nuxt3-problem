<template>
  <div class="d-flex justify-center">
    <v-card class="px-4" width="100%">
      <v-card-title class="px-0">Project settings</v-card-title>
      <div class="d-flex">
        <div class="flex-grow-1 d-flex justify-space-around flex-wrap">
          <div>
            <div class="d-flex justify-space-between">
              <v-text-field
                class="shrink remediation-project-id-preview"
                :value="previewIdDisplay"
                label="Identifier"
                outlined
                disabled
                filled
                dense
              ></v-text-field>
              <v-text-field
                class="flex-grow-1 remediation-project-form-name"
                v-model="newRemediationProject.name"
                :rules="validations.required"
                label="Project name"
                messages="Required"
                outlined
                dense
              ></v-text-field>
            </div>
            <v-textarea
              v-model="newRemediationProject.description"
              :rules="validations.required"
              rows="3"
              dense
              outlined
              name="description"
              label="Description"
              messages="Required"
            ></v-textarea>
          </div>
          <div class="remediation-project-form-dates">
            <date-picker
              v-model="newRemediationProject.creationDate"
              :text-field-props="{
                outlined: true,
                dense: true,
                clearable: true
              }"
              disabled
              label="Creation date"
            ></date-picker>
            <date-picker
              v-model="newRemediationProject.startDate"
              :text-field-props="{
                outlined: true,
                dense: true,
                clearable: true
              }"
              label="Start date"
            ></date-picker>
            <date-picker
              v-model="newRemediationProject.deadline"
              :text-field-props="{
                outlined: true,
                dense: true,
                clearable: true,
                messages: 'Required',
                rules: validations.required
              }"
              :min="newRemediationProject.startDate"
              label="Deadline"
            ></date-picker>
          </div>
          <div>
            <v-select
              :items="sortedPriotities"
              v-model="newRemediationProject.priority"
              :rules="validations.required"
              item-text="name"
              item-value="id"
              messages="Required"
              dense
              outlined
              deletable-chips
              label="Project Priority"
              placeholder="Project Priority"
              :menu-props="{
                bottom: true,
                offsetY: true,
                closeOnClick: true
              }"
            >
            </v-select>
            <div class="d-flex align-center">
              <v-select
                :items="users"
                :value="owner"
                :rules="validations.required"
                item-text="username"
                item-value="id"
                @input="setOwner"
                messages="Required"
                class="project-owner-select"
                dense
                small-chips
                outlined
                chips
                deletable-chips
                label="Project Owner"
                placeholder="Project Owner"
                return-object
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  closeOnClick: true
                }"
              >
              </v-select>
              <a @click="setSelfAsOwner" class="ml-5 mb-6">Assign to me</a>
            </div>
            <v-select
              :items="users"
              :value="assignees"
              :rules="validations.atLeastOne"
              item-text="username"
              item-value="id"
              @input="setAssignees"
              messages="Required"
              class="member-list fix-v-select"
              dense
              small-chips
              outlined
              chips
              deletable-chips
              multiple
              label="Assignees"
              placeholder="Assignees"
              return-object
              :menu-props="{
                bottom: true,
                offsetY: true,
                closeOnClick: true
              }"
            >
              <template #selection="{ item, index }">
                <v-chip
                  v-if="index <= 3"
                  small
                  close
                  @click:close="() => assignees.splice(index, 1)"
                >
                  {{ item.username }}
                </v-chip>
                <v-tooltip
                  v-if="index === 4"
                  top
                  open-delay="100"
                  open-on-hover
                >
                  <template #activator="{ on, attrs }">
                    <v-chip v-bind="attrs" v-on="on" small>
                      +{{ assignees.length - 4 }}
                    </v-chip>
                  </template>
                  <span>{{
                    assignees
                      .slice(3)
                      .map((user) => user.username)
                      .join(', ')
                  }}</span>
                </v-tooltip>
              </template>
            </v-select>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
// @ts-check
import { mapState } from 'vuex'
import { getRemediationProjectsSummaryService } from '@/services/remediation-projects'
import { searchProjectPrioritiesService } from '@/services/project-priorities'
import DatePicker from '@/components/utils/DatePicker.vue'
import { searchUsersService } from '~/services/users'

export default {
  components: {
    DatePicker
  },
  model: {
    prop: 'settings',
    event: 'updateSettings'
  },
  props: {
    /**
     * @type {import('vue').PropOptions<import('./remediation-project-edition.vue').ProjectData>}
     */
    settings: {
      type: Object,
      default: () => {
        return {
          id: '',
          name: '',
          description: '',
          creationDate: null,
          startDate: null,
          deadline: null,
          priority: null,
          owner: null,
          assignees: []
        }
      }
    }
  },
  data() {
    return {
      previewId: 1,
      newRemediationProject: {
        id: 1,
        name: '',
        description: '',
        creationDate: new Date().toISOString(),
        startDate: new Date().toISOString(),
        deadline: null,
        assignees: [],
        owner: null,
        priority: null
      },
      assignees: [],
      users: [],
      owner: null,
      /**
       * @type {import('~/types/projectsManagement').ProjectPriority[]}
       */
      priorities: [],
      validations: {
        required: [(value) => Boolean(value)],
        atLeastOne: [(value) => value.length > 0]
      }
    }
  },
  computed: {
    ...mapState('user', { userId: 'id', userUsername: 'username' }),
    ...mapState({
      /**
       * @returns {string}
       */
      remediationProjectIdPrefix: (state) =>
        state.remediationProject.remediationProjectIdPrefix
    }),
    /**
     * @return {string}
     */
    previewIdDisplay() {
      return `${this.remediationProjectIdPrefix}${this.previewId ?? '1'}`
    },
    /**
     * @return {import('~/types/projectsManagement').ProjectPriority[]}
     */
    sortedPriotities() {
      return [...(this.priorities ?? [])].sort((a, b) => {
        return b.weight - a.weight
      })
    }
  },
  watch: {
    newRemediationProject: {
      deep: true,
      handler(newValue) {
        this.sendUpdateEvent()
      }
    }
  },
  async mounted() {
    try {
      const [projects, priorities, { users }] = await Promise.all([
        getRemediationProjectsSummaryService(this.$axios),
        searchProjectPrioritiesService(this.$axios),
        searchUsersService(this.$axios)
      ])
      this.previewId =
        Math.max(
          ...projects.remediationProjects.map((project) => project.project_id)
        ) + 1

      this.priorities = priorities.map((priority) => {
        return {
          id: priority.id,
          name: this.$t(`projectManagement.priorityLevel.${priority.name}`),
          weight: priority.weight
        }
      })

      this.users.splice(0, this.users.length, ...users)

      this.sendUpdateEvent()
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    setAssignees(users) {
      this.assignees.splice(0, this.assignees.length, ...users)
      this.newRemediationProject.assignees.splice(
        0,
        this.newRemediationProject.assignees.length,
        ...users.map((user) => user.id)
      )
    },
    setOwner(user) {
      if (user) {
        const { id, username } = user
        this.$set(this, 'owner', { id, username })
        this.newRemediationProject.owner = id
      } else {
        this.$set(this.newRemediationProject, 'owner', null)
        this.$set(this, 'owner', null)
      }
    },
    setSelfAsOwner() {
      this.setOwner({ id: this.userId, username: this.userUsername })
    },
    sendUpdateEvent() {
      this.$emit('updateSettings', this.newRemediationProject)
    }
  }
}
</script>

<style scoped>
.remediation-project-id-preview {
  max-width: 125px;
}
.remediation-project-form-name {
  max-width: 150px;
}
.remediation-project-form-dates {
  max-width: 200px;
}
.project-owner-select {
  max-width: 175px;
}
</style>
