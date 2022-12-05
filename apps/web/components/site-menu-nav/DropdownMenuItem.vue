<template>
  <v-list-group
    :key="item.title"
    v-test="`navbar-${item.title}`"
    :prepend-icon="item.action"
    v-model="isOpen"
    no-action
  >
    <template #activator>
      <v-list-item-content>
        {{ item.title }}
      </v-list-item-content>
    </template>
    <!-- Dropdown subitems: -->
    <v-list-item
      v-for="child in item.items"
      :key="child.title"
      v-test="`navbar-${item.title}-${child.title}`"
      exact
      nuxt
      :to="child.link"
      replace
      link
    >
      <!-- subitem icon -->
      <v-icon v-if="child.icon" small class="mr-2">{{ child.icon }}</v-icon>

      <v-list-item-icon
        class="mr-0"
        style="align-items: center"
        v-if="child.customImg"
      >
        <img
          width="16"
          height="16"
          :src="child.customImg.src"
          :alt="child.customImg.alt"
        />
      </v-list-item-icon>

      <!-- subitem content -->
      <v-list-item-content>
        <v-list-item-title
          >{{ child.title
          }}<template v-if="assetTypeCount[child.assetType] !== undefined">
            ({{ assetTypeCount[child.assetType] }})</template
          ></v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>
  </v-list-group>
</template>

<script>
// @ts-check
import { mapState } from 'vuex'

export default {
  props: {
    /**
     * @type {import('vue').PropOptions<import('~/types/components/siteMenuNav').DropdownMenuItem>}
     */
    item: { type: Object, required: true }
  },
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    ...mapState('assets', ['assetSummary']),
    /**
     * @returns {{ [assetType: string]: string }}
     */
    assetTypeCount() {
      return {
        ...this.assetSummary,
        ALL: this.assetSummary?.technicalAssets + this.assetSummary?.superAssets
      }
    }
  },
  watch: {
    isOpen(becomeOpen) {
      if (!becomeOpen) {
        this.$emit('close')
        return
      }

      this.$emit('open')
    }
  }
}
</script>
