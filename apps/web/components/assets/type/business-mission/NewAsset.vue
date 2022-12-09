<script>
import { searchAssetsService } from '~/services/assets'
export default {
  data() {
    return {
      formData: {
        unitsLinked: []
      },
      units: []
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
        children: Array.from(
          new Set([
            ...(this.asset.children ?? [])
              .filter(child => child.type !== 'UNIT')
              .map(child => child.id),
            ...this.formData.unitsLinked,
          ]),
        ),
      })
    },
    async fetchMissions() {
      const serviceParams = {}
      serviceParams.types = ['UNIT']
      const { assets } = await searchAssetsService(this.$axios, serviceParams)
      this.units = assets
    },
    restoreTheActualStateInDatabase() {
      if (this.asset?.children?.length > 0) {
        this.formData.unitsLinked = (this.asset.children ?? [])
          .filter(child => child.type === 'UNIT')
          .map(unit => unit.id)
      }
    },
  },
}
</script>

<template>
  <div style="width: 100%;">
    <v-col cols="12">
      <v-select
        v-if="units.length > 0"
        v-model="formData.unitsLinked"
        :items="units"
        item-value="id"
        item-text="name"
        class="custom-multiselect"
        multiple
        chips
        deletable-chips
        v-bind="$attrs"
        label="Business Units"
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
