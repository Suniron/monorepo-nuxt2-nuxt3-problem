<template>
  <div>
    <template>
      <custom-multiselect
        :values="availableTags"
        :selected-values="selectedValues"
        :visible-items="3"
        placeholder="Tags"
        @change="changeTags"
      >
        <div class="pa-4" v-if="creatable">
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
      </custom-multiselect>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import CustomMultiselect from './custom-multiselect.vue'
export default {
  name: 'TagsMultiselect',
  components: {
    CustomMultiselect
  },
  model: {
    prop: 'selectedValues',
    event: 'input'
  },
  props: {
    selectedValues: {
      type: Array,
      default: () => []
    },
    subset: {
      type: Array,
      default: null
    },
    /**
     * If true, an option to create a new tag is added
     */
    creatable: {
      type: Boolean,
      default: false
    },
    /**
     * Number of tag chips shown before showing "+10" chip indicator of more tags selected
     */
    visibleTags: {
      type: Number,
      default: 3
    },
    tagsAlreadyLinked: {
      type: Boolean,
      default: false
    }
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
    }
  },
  watch: {
    value(newTags) {
      const tagsAreDifferent = (tags1, tags2) =>
        tags1 &&
        tags2 &&
        (tags1.length !== tags2.length ||
          tags2.some((t1) => !tags2.find((t2) => t2.id === t1.id)))

      if (tagsAreDifferent(this.selectedTags, newTags))
        this.setSelectedTags(newTags)
    },
    assets(newAssets) {
      this.filterAssetsToGetType(newAssets)
    },
    newTagName() {
      this.errorMessage = ''
    }
  },
  created() {
    this.fetchTagsInStore()
  },
  methods: {
    ...mapActions('tags', {
      fetchTagsInStore: 'fetchTags',
      createTagInStore: 'createTag'
    }),
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
      if (idx < this.visibleTags) return tag.name
      return '+' + (this.selectedTags.length - this.visibleTags)
    },
    setSelectedTags(tags = []) {
      this.selectedTags = [...tags]
    },
    unselectTag(tag) {
      const tagToUnselectIdx = this.selectedTags.findIndex(
        (t) => t.id === tag.id
      )
      if (tagToUnselectIdx >= 0) {
        const newSelectedTags = [...this.selectedTags]
        newSelectedTags.splice(tagToUnselectIdx, 1)

        this.changeTags(newSelectedTags)
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
    changeTags(newValues) {
      this.$emit('input', newValues)
    },
    async createNewTag(name) {
      if (!name) return
      const result = await this.createTagInStore({ name })
      if (result?.error) {
        if (result.error.response.status === 409) {
          this.errorMessage = 'Tag already exists'
        } else {
          this.errorMessage = 'Error creating tag'
        }
      } else {
        this.newTagName = ''
      }
    }
  }
}
</script>

<style lang="scss">
.tags-multiselect {
  display: inline-flex;
}
</style>
