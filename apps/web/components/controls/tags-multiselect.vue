<script>
import { mapActions, mapState } from 'vuex'
import CustomMultiselect from './custom-multiselect.vue'
export default {
  components: {
    CustomMultiselect
  },
  name: 'TagsMultiselect',
  model: {
    event: 'input',
    prop: 'selectedValues'
  },
  data() {
    return {
      selectedTags: [...(this.value || [])], // Array of tag objects
      newTagName: null,
      isLoading: false,
      myFilteredTags: [],
      errorMessage: ''
    }
  },
  computed: {
    ...mapState('tags', ['tags']),
    availableTags() {
      return this.subset ?? this.tags
    },
  },
  created() {
    this.fetchTagsInStore()
  },
  methods: {
    ...mapActions('tags', {
      createTagInStore: 'createTag',
      fetchTagsInStore: 'fetchTags',
    }),
    changeTags(newValues) {
      this.$emit('input', newValues)
    },
    async createNewTag(name) {
      if (!name)
        return
      const result = await this.createTagInStore({ name })
      if (result?.error) {
        if (result.error.response.status === 409)
          this.errorMessage = 'Tag already exists'
        else
          this.errorMessage = 'Error creating tag'
      }
      else {
        this.newTagName = ''
      }
    },
    emitBlur() {
      this.$emit('blur', [...this.selectedTags])
    },
    async fetchTags() {
      this.isLoading = true
      await this.fetchTagsInStore()
      this.isLoading = false
    },
    filterAssetsToGetType(newAssets) {
      const array = []
      const array2 = []
      newAssets.forEach((c) => {
        c.tags.forEach((t) => {
          if (!array.includes(t.id)) {
            array.push(t.id)
            array2.push(t)
          }
        })
      })
      this.myFilteredTags = array2
    },
    getChipText(tag, idx) {
      if (idx < this.visibleTags)
        return tag.name
      return `+${this.selectedTags.length - this.visibleTags}`
    },
    setSelectedTags(tags = []) {
      this.selectedTags = [...tags]
    },
    unselectTag(tag) {
      const tagToUnselectIdx = this.selectedTags.findIndex(
        t => t.id === tag.id,
      )
      if (tagToUnselectIdx >= 0) {
        const newSelectedTags = [...this.selectedTags]
        newSelectedTags.splice(tagToUnselectIdx, 1)

        this.changeTags(newSelectedTags)
      }
    },
  },
  props: {
    /**
     * If true, an option to create a new tag is added
     */
    creatable: {
      default: false,
      type: Boolean,
    },

    selectedValues: {
      default: () => [],
      type: Array,
    },

    subset: {
      default: null,
      type: Array,
    },

    tagsAlreadyLinked: {
      default: false,
      type: Boolean,
    },
    /**
     * Number of tag chips shown before showing "+10" chip indicator of more tags selected
     */
    visibleTags: {
      default: 3,
      type: Number,
    },
  },
  watch: {
    assets(newAssets) {
      this.filterAssetsToGetType(newAssets)
    },
    newTagName() {
      this.errorMessage = ''
    },
    value(newTags) {
      const tagsAreDifferent = (tags1, tags2) =>
        tags1
        && tags2
        && (tags1.length !== tags2.length
          || tags2.some(t1 => !tags2.find(t2 => t2.id === t1.id)))

      if (tagsAreDifferent(this.selectedTags, newTags))
        this.setSelectedTags(newTags)
    },
  },
}
</script>

<template>
  <div>
    <template>
      <CustomMultiselect
        :values="availableTags"
        :selected-values="selectedValues"
        :visible-items="3"
        placeholder="Tags"
        @change="changeTags"
      >
        <div v-if="creatable" class="pa-4">
          <v-text-field
            v-model="newTagName"
            outlined
            placeholder="Create tag"
            clearable
            :error-messages="errorMessage"
            :hide-details="errorMessage === ''"
            :disabled="isLoading"
            @keypress.enter.stop.prevent="createNewTag(newTagName)"
          />
        </div>
      </CustomMultiselect>
    </template>
  </div>
</template>

<style lang="scss">
.tags-multiselect {
  display: inline-flex;
}
</style>
