<script>
import TagsList from '~/components/settings/tags/tags-list.vue'
import CreateTagModal from '~/components/settings/tags/create-edit-tags-modal.vue'

export default {
  components: { TagsList, CreateTagModal },
  name: 'TagsSettings',
  props: {
    tags: {
      default: () => [],
      type: Array,
    },
  },
}
</script>

<template>
  <div class="tag-settings">
    <div class="create-wrapper">
      <v-dialog width="500" persistent>
        <template #activator="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on">
            Add tag
          </v-btn>
        </template>
        <template #default="dialog">
          <CreateTagModal
            :tags="tags"
            @created="$emit('update')"
            @close="dialog.value = false"
          />
        </template>
      </v-dialog>
    </div>
    <TagsList :tags="tags" @update="$emit('update')" />
  </div>
</template>

<style lang="scss">
.tag-settings {
  .create-wrapper {
    text-align: right;
    margin: 20px 0;
  }
}
</style>
