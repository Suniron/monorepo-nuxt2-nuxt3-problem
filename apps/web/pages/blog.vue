<script>
import comments from '~/components/blog/comments.vue'
export default {
  components: { comments },
  name: 'BlogPage',
  middleware: ['auth'],
  created() {
    this.$store.dispatch('changePageTitle', 'Blog')
  },
}
</script>

<template>
  <v-container>
    <comments />
  </v-container>
</template>

<style lang="scss"></style>
