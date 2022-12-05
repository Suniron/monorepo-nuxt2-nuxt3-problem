<template>
  <v-container>
    <comments />
  </v-container>
</template>

<script>
import comments from '~/components/blog/comments.vue'
export default {
  name: 'BlogPage',
  components: { comments },
  middleware: ['auth'],
  created() {
    this.$store.dispatch('changePageTitle', 'Blog')
  }
}
</script>

<style lang="scss"></style>
