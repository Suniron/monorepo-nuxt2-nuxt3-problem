<template>
  <v-data-table
    :headers="headers"
    :items="tagsWithAssets"
    :items-per-page="15"
    class="tags-list-table"
  >
    <template #[`footer.page-text`]="items">
      {{ items.pageStart }}-{{ items.pageStop }} of
      {{ items.itemsLength }} results
    </template>
    <template #[`item.name`]="{ item }">
      <v-chip :color="item.color">
        {{ item.name }}
      </v-chip>
    </template>
    <template #[`item.assets`]="{ item }">
      {{ item.assets.length }}
    </template>
    <template #[`item.edit`]="{ item: itemEdit }">
      <v-dialog width="500" persistent :retain-focus="false">
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" style="cursor:pointer" small right
            >mdi-pencil</v-icon
          >
        </template>
        <template #default="dialog">
          <create-edit-tag-modal
            :tag="itemEdit"
            :tags="tags"
            @created="$emit('update')"
            @close="dialog.value = false"
          />
        </template>
      </v-dialog>
      <v-dialog width="500" persistent :retain-focus="false">
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" style="cursor:pointer" small right
            >mdi-delete</v-icon
          >
        </template>
        <template #default="dialog">
          <delete-modal
            style="background-color:white"
            :item="itemEdit"
            whatis-deleting="Tag"
            @close="dialog.value = false"
            @delete="removeTag"
          />
        </template>
      </v-dialog>
    </template>
  </v-data-table>
</template>

<script>
// Service
import CreateEditTagModal from './create-edit-tags-modal.vue'
import { updateTagService, deleteTagService } from '~/services/tags'
import DeleteModal from '~/components/settings/delete-modal.vue'
import { searchAssetsService } from '~/services/assets'
export default {
  name: 'TagsList',
  components: { CreateEditTagModal, DeleteModal },
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name',
          width: '30%',
          sortable: false
        },
        {
          text: 'Assets count',
          value: 'assets',
          sortable: false
        },
        {
          text: 'Edit',
          value: 'edit',
          class: 'edit-column',
          width: '10%',
          sortable: false
        }
      ],
      assetsWithTags: [],
      isTagsLoading: false
    }
  },
  computed: {
    /**
     * @returns {Array} - Array of tags with assets count
     */
    tagsWithAssets() {
      return this.tags.map((tag) => ({
        ...tag,
        assets: this.assetsWithTags.filter((asset) =>
          asset.tags.some((assetTag) => assetTag.id === tag.id)
        )
      }))
    }
  },
  async mounted() {
    const assets = (
      await searchAssetsService(this.$axios, {
        tagIds: this.tags.map((tag) => tag.id)
      })
    ).assets
    this.assetsWithTags.splice(0, this.assetsWithTags.length, ...assets)
  },
  methods: {
    async changeTagColor(tagId, color) {
      try {
        this.isTagsLoading = true

        await updateTagService(this.$axios, tagId, {
          color
        })

        this.$emit('update')
      } catch (error) {
        console.error(error)
      } finally {
        this.isTagsLoading = false
      }
    },
    async removeTag(tag) {
      const res = await deleteTagService(this.$axios, tag.id)
      if (res.status >= 300) {
        this.error = 'An error has occured'
      } else {
        this.$emit('update')
      }
    }
  }
}
</script>

<style lang="scss">
.tags-list-table {
  //   .role-column,
  //   .tags-column {
  //     max-width: 200px;
  //   }

  .tag-color-list {
    @media screen and (max-width: 400px) {
      width: 200px;
    }
    @media screen and (min-width: 401px) and (max-width: 500px) {
      width: 250px;
    }
    @media screen and (min-width: 501px) and (max-width: 599px) {
      width: 350px;
    }
  }
}
</style>
