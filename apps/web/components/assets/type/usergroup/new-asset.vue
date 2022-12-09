<script>
import { searchAssetsService } from '~/services/assets'
export default {
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
                .filter(child => child.type !== 'USER')
                .map(child => child.id),
              ...people,
            ]),
          ),
        )
      },
    },
  },
  created() {
    this.restoreTheActualStateInDatabase()
    this.fetchMissions()
    this.$root.$on('canceledSaves', this.canceledSaves)
    this.changed()
  },
  watch: {
    asset() {
      this.restoreTheActualStateInDatabase()
      this.fetchMissions()
    }
  },
  methods: {
    canceledSaves() {
      this.changed()
      this.restoreTheActualStateInDatabase()
    },
    changed() {
      this.$emit('change', this.formData)
    },
    async fetchMissions() {
      const serviceParams = {}
      serviceParams.types = ['USER']
      const { assets } = await searchAssetsService(this.$axios, serviceParams)
      this.availablePeople = assets
    },
    restoreTheActualStateInDatabase() {
      if (this.asset?.children?.length > 0) {
        this.people = (this.asset.children ?? [])
          .filter(person => person.type === 'USER')
          .map(person => person.id)
      }
    },
  },
}
</script>

<template>
  <div style="width: 100%;">
    <v-col cols="12">
      <v-select
        v-if="availablePeople.length > 0"
        v-model="people"
        :items="availablePeople"
        item-value="id"
        item-text="name"
        class="custom-multiselect"
        multiple
        chips
        deletable-chips
        v-bind="$attrs"
        label="Group members"
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
