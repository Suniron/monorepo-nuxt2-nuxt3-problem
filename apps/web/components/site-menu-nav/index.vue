<script>
// @ts-check
import { mapActions, mapGetters } from 'vuex'
import SimpleMenuItem from './SimpleMenuItem.vue'
import DropdownMenuItem from '~/components/site-menu-nav/DropdownMenuItem.vue'
import ICONS from '~/assets/img/icons'

export default {
  components: { DropdownMenuItem, SimpleMenuItem },
  name: 'SiteNavMenu',
  computed: {
    ...mapGetters('user', ['isLoggedWithCredentials']),
    /**
     * @returns {boolean}
     */
    isUserAdmin() {
      return this.$store.getters['user/isAdmin']
    },
    /**
     * @returns {string}
     */
    version() {
      return process.env.PACKAGE_VERSION
    },
  },
  data: () => ({
    assets: {
      action: 'mdi-server',
      items: [
        {
          assetType: 'ALL',
          link: '/assets',
          title: 'All',
        },
        {
          assetType: 'SERVER',
          customImg: ICONS.server,
          link: '/assets?types=SERVER',
          title: 'Server',
        },
        {
          assetType: 'WEB',
          customImg: ICONS.web,
          link: '/assets?types=WEB',
          title: 'Web',
        },
        {
          assetType: 'NETWORK',
          customImg: ICONS.network,
          link: '/assets?types=NETWORK',
          title: 'Network',
        },
        {
          assetType: 'USER',
          customImg: ICONS.user,
          link: '/assets?types=USER',
          title: 'People',
        },
        {
          assetType: 'BUILDING',
          customImg: ICONS.building,
          link: '/assets?types=BUILDING',
          title: 'Building',
        },
        {
          assetType: 'UNIT',
          customImg: ICONS.unit,
          link: '/assets?types=UNIT',
          title: 'Business Unit',
        },
        {
          assetType: 'MISSION',
          customImg: ICONS.mission,
          link: '/assets?types=MISSION',
          title: 'Business Mission',
        },
        {
          assetType: 'USERGROUP',
          customImg: ICONS.usergroup,
          link: '/assets?types=USERGROUP',
          title: 'User Group',
        },
      ],
      title: 'Assets',
    },
    cartography: {
      action: 'mdi-graphql',
      items: [
        {
          icon: 'mdi-network',
          link: '/cartography/network',
          title: 'Network',
        },
        {
          icon: 'mdi-map-marker',
          link: '/cartography/worldmap',
          title: 'World Map',
        },
      ],
      title: 'Cartography',
    },
    expandLock: false,
    governance: {
      action: 'mdi-archive-arrow-down',
      items: [
        {
          assetType: 'POLICY',
          icon: 'mdi-file-alert',
          link: '/assets?types=POLICY',
          title: 'Policy',
        },
        {
          assetType: 'PROCEDURE',
          icon: 'mdi-file-lock',
          link: '/assets?types=PROCEDURE',
          title: 'Procedure',
        },
      ],
      title: 'Governance',
    },
    mouseOver: false,
    show: true,
  }),
  methods: {
    ...mapActions('user', ['deauthorize']),
    ...mapActions('assets', ['updateAssetSummary']),
    refreshAssetSummary() {
      this.updateAssetSummary(this.$axios)
    },
    toggleExpandLock() {
      this.expandLock = !this.expandLock
      localStorage.setItem('userpref-navbar-lock', this.expandLock ? '1' : '0')
    },
  },
  mounted() {
    this.expandLock = localStorage.getItem('userpref-navbar-lock') === '1'

    // Forcing navbar to update because of a vuetify bug which ignores the dynamic width on initialization
    this.expandLock = !this.expandLock
    setImmediate(() => {
      this.expandLock = !this.expandLock
    })
  },
}
</script>

<template>
  <!--
    Had to use a mouse event because of Vuetify bug:
    https://github.com/vuetifyjs/vuetify/issues/14585
  -->
  <v-navigation-drawer
    :value="show"
    app
    permanent
    :mini-variant="expandLock === false"
    :expand-on-hover="expandLock === false"
    :width="expandLock || mouseOver ? 256 : 56"
    @mouseenter.native="mouseOver = true"
    @mouseleave.native="mouseOver = false"
  >
    <!-- Logged in menu -->
    <v-list
      v-if="isLoggedWithCredentials"
      class="site-nav-list pl-0 pr-0 text-no-wrap"
      dense
      nav
    >
      <!-- Xrator Logo -->
      <v-list-item>
        <v-list-item-content>
          <img
            v-if="expandLock || mouseOver"
            class="logo-img"
            src="~/assets/img/logos/xrator-brand.png"
            alt="Xrator logo"
          >
          <img
            v-else
            class="logo-img"
            src="~/assets/img/logos/xrator-icon.png"
            alt="Xrator logo"
          >
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <!-- ### MENU ITEMS ### -->
      <!-- Dashboard menu item -->
      <SimpleMenuItem title="Dashboard" to="/dashboard" icon="mdi-chart-box" />

      <!-- Assets menu item -->
      <DropdownMenuItem :item="assets" @open="refreshAssetSummary" />

      <!-- Scans menu item -->
      <SimpleMenuItem title="Scans" to="/scans" icon="mdi-cube-scan" />

      <!-- Vulnerabilities menu item -->
      <SimpleMenuItem
        title="Vulnerabilities"
        to="/vulnerabilities"
        icon="mdi-bug"
      />

      <!-- Business Impact menu item -->
      <SimpleMenuItem
        title="Business Impact"
        to="/business-impact"
        icon="mdi-glass-fragile"
      />

      <!-- Remediation Project menu item -->
      <SimpleMenuItem title="Remediation Projects" to="/remediation-projects">
        <template #custom-icon>
          <v-list-item-icon>
            <img
              class="logo-img"
              src="~/assets/img/icons/health-cure.svg"
              alt="Health Cure Logo"
            >
          </v-list-item-icon>
        </template>
      </SimpleMenuItem>

      <!-- Cartography menu item -->
      <DropdownMenuItem :item="cartography" />

      <!-- Governance menu item -->
      <DropdownMenuItem :item="governance" @open="refreshAssetSummary" />

      <!-- Audit menu item -->
      <SimpleMenuItem title="Audit" to="/audit" icon="mdi-account-box" />

      <!-- Sensors menu item -->
      <SimpleMenuItem
        title="Sensors"
        to="/sensors"
        icon="mdi-access-point-network"
      />

      <!-- Settings menu item -->
      <SimpleMenuItem
        v-if="isUserAdmin"
        title="Settings"
        to="/settings"
        icon="mdi-cog"
      />
    </v-list>

    <!-- Logged out menu -->
    <v-list v-else class="site-nav-list" dense nav>
      <v-list-item>
        <v-list-item-content>
          <img
            class="logo-img"
            src="~/assets/img/logos/xrator-brand.png"
            alt="Xrator logo"
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-test="'navbar-sign-in'" nuxt to="/sign-in">
        <v-list-item-icon>
          <v-icon>mdi-login</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          Sign in
        </v-list-item-content>
      </v-list-item>
      <!-- Temporarily commented signup since there wont be signup soon -->
      <!-- <v-list-item nuxt to="/sign-up">
        <v-list-item-icon>
          <v-icon>mdi-account-plus</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          Sign up
        </v-list-item-content>
      </v-list-item> -->
    </v-list>
    <template #append>
      <div v-if="expandLock || mouseOver" class="mx-3 text-center grey--text">
        <p class="ma-0">
          Version: {{ version }}
        </p>
      </div>
      <v-list class="site-nav-list text-no-wrap" dense nav>
        <v-list-item @click="toggleExpandLock">
          <v-list-item-icon>
            <v-icon> {{ expandLock ? 'mdi-lock' : 'mdi-lock-open' }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            Lock menu
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<style lang="scss">
.site-nav-list {
  .logo-img {
    width: 100%;
  }
}

a.v-list-item .logo-img {
  opacity: 0.54;
}

a.v-list-item--active .logo-img {
  opacity: 1;
}
</style>
