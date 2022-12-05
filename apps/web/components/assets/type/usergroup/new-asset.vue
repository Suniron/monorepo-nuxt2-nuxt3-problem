<template>
  <div style="width: 100%;">
    <v-col cols="12">
      <v-select
        v-if="availablePeople.length > 0"
        :items="availablePeople"
        item-value="id"
        item-text="name"
        v-model="people"
        class="custom-multiselect"
        multiple
        chips
        deletable-chips
        @change="changed"
        @click.stop
        v-bind="$attrs"
        label="Group members"
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
        /**
         * @type {number[]}
         */
        children: []
      },
      availablePeople: []
    }
  },
  computed: {
    /**
     * @type {number[]}
     */
    people: {
      get() {
        return this.formData.children
      },
      set(people) {
        this.$set(
          this.formData,
          'children',
          Array.from(
            new Set([
              ...(this.asset.children ?? [])
                .filter((child) => child.type !== 'USER')
                .map((child) => child.id),
              ...people
            ])
          )
        )
      }
    }
  },
  watch: {
    asset() {
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
      if (this.asset?.children?.length > 0) {
        this.people = (this.asset.children ?? [])
          .filter((person) => person.type === 'USER')
          .map((person) => person.id)
      }
    },
    changed() {
      this.$emit('change', this.formData)
    },
    canceledSaves() {
      this.changed()
      this.restoreTheActualStateInDatabase()
    },
    async fetchMissions() {
      const serviceParams = {}
      serviceParams.types = ['USER']
      const { assets } = await searchAssetsService(this.$axios, serviceParams)
      this.availablePeople = assets
    }
  }
}
</script>
