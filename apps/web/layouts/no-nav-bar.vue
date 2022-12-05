<template>
  <v-app id="xrator">
    <v-main class="main-content" style="height: 100vh">
      <v-row style="height: 100%">
        <v-col v-if="isAppLoading" class="d-flex align-center justify-center">
          <LoadingSpinner />
        </v-col>
        <template v-else>
          <v-col class="d-flex align-center justify-center" md="6" sm="12">
            <img
              cols="12"
              class="logo-img align-self-center"
              src="~/assets/img/logos/xrator-full.png"
              alt="Xrator logo"
            />
          </v-col>
          <v-col class="d-flex align-center justify-center" md="6" sm="12">
            <nuxt class="align-stretch" />
          </v-col>
        </template>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
// @ts-check
import LoadingSpinner from '~/components/utils/LoadingSpinner.vue'

export default {
  name: 'DefaultLayout',
  components: {
    LoadingSpinner
  },
  data() {
    return {
      showMenu: true,
      assets: []
    }
  },
  computed: {
    isAppLoading() {
      return this.$store.state.isLoading
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/sass/main';

#xrator {
  .main-content {
    display: flex;
    width: 100vw;
    // & > div {
    //   display: flex;
    // }
  }
}
html {
  background-color: $bg-light;
}
</style>
