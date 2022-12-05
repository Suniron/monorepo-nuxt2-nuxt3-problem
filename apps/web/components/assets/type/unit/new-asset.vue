<template>
  <div style="width: 100%;">
    <v-col cols="12">
      <v-select
        v-if="missions.length > 0"
        :items="missions"
        item-value="id"
        item-text="name"
        v-model="formData.missionsLinked"
        class="custom-multiselect"
        multiple
        chips
        deletable-chips
        @change="changed"
        @click.stop
        v-bind="$attrs"
        label="Business Missions"
        single-line
        :disabled="!quickedit"
        :menu-props="{
          bottom: true,
          offsetY: true,
          closeOnClick: true
        }"
      >
      </v-select>
    </v-col>
  </div>
</template>
<script>
import { searchAssetsService } from '~/services/assets'
export default {
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
  data() {
    return {
      formData: {
        missionsLinked: []
      },
      missions: []
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
    restoreTheActualStateInDatabase() {
      if (this.asset?.parents?.length > 0) {
        this.formData.missionsLinked = this.asset.parents.filter(
          (mission) => mission.type === 'MISSION'
        )
      }
    },
    changed() {
      this.$emit('change', {
        parents: Array.from(
          new Set([
            ...(this.asset.parents ?? [])
              .filter((mission) => mission.type !== 'MISSION')
              .map((parent) => parent.id),
            ...this.formData.missionsLinked
          ])
        )
      })
    },
    canceledSaves() {
      this.changed()
      this.restoreTheActualStateInDatabase()
    },
    async fetchMissions() {
      const serviceParams = {}
      serviceParams.types = ['MISSION']
      const { assets } = await searchAssetsService(this.$axios, serviceParams)
      this.missions = assets
    }
  }
}
</script>
