<template>
  <v-app id="xrator">
    <site-nav-menu :show.sync="showMenu" class="side-menu" />

    <v-app-bar app class="app-bar">
      <!-- COMPANY LOGO OR BLANK SPACE -->
      <span v-if="!companyLogoInStore" class="mr-2" style="margin-left: 50px" />
      <v-img
        v-else
        :src="companyLogoInStore"
        class="mr-2"
        max-width="50px"
        max-height="50px"
      />

      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
      <template v-if="isLoggedIn">
        <v-divider vertical inset class="mx-4"></v-divider>
        <v-combobox
          hide-details
          :items="assetNamesIds"
          item-text="name"
          item-value="id"
          @input.native="(text) => debounceAssetSearch(text)"
          @change="clicked"
          label="Search for Assets..."
          append-icon="mdi-magnify"
          single-line
          class="toolbar-text"
          color="white"
        >
          <template #append v-if="assetNamesIds.length > 0">
            <v-btn
              height="auto"
              text
              @click="$router.push('/assets?search=' + search)"
            >
              see all result
            </v-btn>
          </template>
        </v-combobox>
        <v-divider vertical inset class="mx-4"></v-divider>
        <nuxt-link :to="localePath('scans-schedule')">
          <v-btn color="#000000" dark> + Schedule scan </v-btn>
        </nuxt-link>
        <v-spacer></v-spacer>
        <!-- <v-divider vertical inset class="mx-4"></v-divider>

        <v-btn class="mx-2" icon>
          <v-badge color="red" content="3+" overlap>
            <v-icon left color="white">mdi-bell-alert</v-icon>
          </v-badge>
        </v-btn>

        <v-btn class="mx-2" icon nuxt to="/blog">
          <v-badge color="red" content="2" overlap>
            <v-icon left color="white">mdi-email-alert</v-icon>
          </v-badge>
        </v-btn>
        <v-divider vertical inset class="mx-4"></v-divider> -->
        <v-menu offset-y allow-overflow>
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" elevation="0" text
              ><span style="color: white">{{ firstName }} {{ lastName }}</span
              ><v-avatar
                ><v-icon large right color="white"
                  >mdi-account-circle</v-icon
                ></v-avatar
              ></v-btn
            >
          </template>
          <v-list color="#0c8f10">
            <v-list-item-group>
              <v-list-item>
                <v-list-item-title style="color: white" @click="account"
                  ><v-icon color="white" left>mdi-account</v-icon
                  >Account</v-list-item-title
                >
              </v-list-item>
              <!-- <v-list-item>
                <v-list-item-title style="color: white;"
                  ><v-icon color="white" left>mdi-cog</v-icon
                  >Settings</v-list-item-title
                >
              </v-list-item>
              <v-list-item>
                <v-list-item-title style="color: white;"
                  ><v-icon color="white" left>mdi-clipboard-text</v-icon
                  >Activity Log</v-list-item-title
                >
              </v-list-item> -->
              <v-divider style="background-color: white"></v-divider>
              <v-list-item>
                <v-list-item-title style="color: white" @click="logout"
                  ><v-icon color="white" left>mdi-logout</v-icon
                  >Logout</v-list-item-title
                >
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main class="main-content">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
// @ts-check
import _debounce from 'lodash/debounce'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { searchAssetsService } from '~/services/assets'
import { logoutService } from '~/services/auth'
import siteNavMenu from '~/components/site-menu-nav/index.vue'
import { getCompanyLogo } from '~/services/companies/index.js'

const DEBOUNCE_WAIT = 300 // ms

export default {
  name: 'DefaultLayout',
  components: { siteNavMenu },
  data() {
    return {
      showMenu: true,
      assets: [],
      search: ''
    }
  },
  computed: {
    ...mapState(['pageTitle']),
    ...mapState('company', ['logo']),
    ...mapGetters('user', ['isLoggedIn', 'firstName', 'lastName']),
    ...mapGetters('assets', ['assetNamesIds']),
    ...mapState('company', {
      companyLogoInStore: 'logo'
    })
  },
  watch: {
    isLoggedIn: {
      /**
       * @param {boolean} isLogged **true** if user log into app
       */
      handler(isLogged) {
        if (!isLogged) {
          this.$router.push('/sign-in')
          return
        }

        this.fetchCompanyLogo()
      },
      immediate: true // needed to watch vuex state
    }
  },
  created() {
    this.debounceAssetSearch = _debounce(this.fetchAssets, DEBOUNCE_WAIT)
  },
  methods: {
    ...mapActions('assets', ['setAssets']),
    ...mapMutations(['SET_ASSETS']),
    ...mapActions('user', ['deauthorize']),
    ...mapActions('company', { updateCompanyLogoInStore: 'updateLogo' }),
    changeThemeMode(e = { matches: true }) {
      this.$vuetify.theme.dark = e.matches
    },
    async fetchAssets(text) {
      this.search = text.srcElement.value
      const serviceParams = { search: text.srcElement.value }
      const { assets } = await searchAssetsService(this.$axios, serviceParams)
      this.setAssets({ assets })
    },
    clicked(data) {
      if (data.id) this.$router.push('/assets/' + data.id)
    },
    async logout() {
      try {
        await logoutService(this.$axios)
      } catch (error) {
        // Silently fail
      }

      this.deauthorize()
      this.$router.push('/sign-in')
    },
    account() {
      this.$router.push('/account')
    },
    async fetchCompanyLogo() {
      try {
        this.updateCompanyLogoInStore(await getCompanyLogo(this.$axios))
      } catch (error) {
        // TODO: handle request error
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/sass/main';

#xrator {
  .app-bar {
    background-color: $color-primary;
    color: $text-light-color;
  }
  .side-menu {
    background-color: $bg-light;
  }
  .main-content {
    background-color: $bg-light;
  }
}

.toolbar-text {
  max-width: 500px;
}
.bg-active {
  color: white !important;
  background-color: #0c8f10 !important;
}
</style>
