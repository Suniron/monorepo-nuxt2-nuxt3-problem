<template>
  <div>
    <tree
      id="sitemap"
      ref="sitemap"
      :custom-styles="myCustomStyles"
      :nodes="treeData"
    />
  </div>
</template>

<script>
import Tree from 'vuejs-tree'

export default {
  name: 'AssetSiteMap',
  components: { Tree },
  props: {
    sitemap: {
      type: [Object, Array],
      required: true
    }
  },
  data() {
    return {
      treeData: {}
    }
  },
  computed: {
    myCustomStyles() {
      return {
        expanded: {
          class: 'x-folder-icon'
        }
      }
    }
  },
  created() {
    this.createTreeData(this.sitemap)
  },
  mounted() {
    this.$refs.sitemap.expandNode('root')
  },
  methods: {
    createTreeData(sitemap) {
      const [root] = sitemap
      const createTreeNode = (r, isRoot = false) => {
        if (!r) return

        const node = { text: r.name }
        if (isRoot) node.id = 'root'
        if (Array.isArray(r.children) && r.children.length)
          node.nodes = r.children.map((rNode) => createTreeNode(rNode))

        return node
      }

      this.treeData = [createTreeNode(root, true)]
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/sass/main';

#sitemap {
  .x-folder-icon:before {
    font-family: 'Material Icons';
    content: 'folder';
    color: $color-primary;
    -webkit-font-feature-settings: 'liga' 1;
    font-feature-settings: 'liga' 1;
  }
  .x-folder-icon.expanded:before {
    font-family: 'Material Icons';
    content: 'folder_open';
    -webkit-font-feature-settings: 'liga' 1;
    font-feature-settings: 'liga' 1;
  }

  .small-tree-indent:before {
    font-family: 'Material Icons';
    content: 'text_snippet';
    -webkit-font-feature-settings: 'liga' 1;
    font-feature-settings: 'liga' 1;
  }
}
</style>
