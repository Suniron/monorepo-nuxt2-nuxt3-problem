<script>
// @ts-check
import LoadingSpinner from '~/components/utils/LoadingSpinner.vue'

export default {
  name: 'DefaultLayout',
  components: {
    LoadingSpinner
  },
  computed: {
    isAppLoading() {
      return this.$store.state.isLoading
    },
  },
  data() {
    return {
      assets: [],
      showMenu: true
    }
  },
}
</script>

<template>
  <div class="h-screen flex items-center">
    <div class="flex flex-col lg:flex-row sm:px-12 md:px-44 items-center place-content-center gap-10">
      <LoadingSpinner v-if="isAppLoading" />
      <template v-else>
        <div class="w-1/2 h-fit flex justify-center">
          <img
            class="logo-img align-self-center"
            src="~/assets/img/logos/xrator-full.png"
            alt="Xrator logo"
          >
        </div>
        <!-- Main content -->
        <nuxt class="w-1/2 h-fit flex justify-center" />
      </template>
    </div>
  </div>
</template>
