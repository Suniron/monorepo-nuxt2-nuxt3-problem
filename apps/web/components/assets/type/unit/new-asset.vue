<script>
import { searchAssetsService } from '~/services/assets'
export default {
  data() {
    return {
      formData: {
        missionsLinked: []
      },
      missions: []
    }
  },
  props: {
    asset: {
      type: Object,
      required: true
    },
    quickedit: {
      type: Boolean,
      required: false
    }
  },
  watch: {
    'asset.id'(newAsset) {
      this.restoreTheActualStateInDatabase()
      this.fetchMissions()
    }
  },
  created() {
    this.restoreTheActualStateInDatabase()
    this.fetchMissions()
    this.$root.$on('canceledSaves', this.canceledSaves)
    this.changed()
  },
  methods: {
    canceledSaves() {
      this.changed()
      this.restoreTheActualStateInDatabase()
    },
    changed() {
      this.$emit('change', {
        parents: Array.from(
          new Set([
            ...(this.asset.parents ?? [])
              .filter(mission => mission.type !== 'MISSION')
              .map(parent => parent.id),
            ...this.formData.missionsLinked,
          ]),
        ),
      })
    },
    async fetchMissions() {
      const serviceParams = {}
      serviceParams.types = ['MISSION']
      const { assets } = await searchAssetsService(this.$axios, serviceParams)
      this.missions = assets
    },
    restoreTheActualStateInDatabase() {
      if (this.asset?.parents?.length > 0) {
        this.formData.missionsLinked = this.asset.parents.filter(
          mission => mission.type === 'MISSION',
        )
      }
    },
  },
}
</script>

<template>
  <div style="width: 100%;">
    <v-col cols="12">
      <v-select
        v-if="missions.length > 0"
        v-model="formData.missionsLinked"
        :items="missions"
        item-value="id"
        item-text="name"
        class="custom-multiselect"
        multiple
        chips
        deletable-chips
        v-bind="$attrs"
        label="Business Missions"
        single-line
        :disabled="!quickedit"
        :menu-props="{
          bottom: true,
          offsetY: true,
          closeOnClick: true,
        }"
        @change="changed"
        @click.stop
      />
    </v-col>
  </div>
</template>
