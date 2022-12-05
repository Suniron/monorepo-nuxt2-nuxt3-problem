<template>
  <div class="tag-settings">
    <div class="create-wrapper">
      <v-dialog width="500" persistent>
        <template #activator="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on">Add tag</v-btn>
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
    <tags-list :tags="tags" @update="$emit('update')" />
  </div>
</template>

<script>
import TagsList from '~/components/settings/tags/tags-list.vue'
import CreateTagModal from '~/components/settings/tags/create-edit-tags-modal.vue'

export default {
  name: 'TagsSettings',
  components: { TagsList, CreateTagModal },
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss">
.tag-settings {
  .create-wrapper {
    text-align: right;
    margin: 20px 0;
  }
}
</style>
